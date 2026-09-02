# §10 — API surface

*[Index](README.md) · [← §9 Controllers](09-controllers.md)*

Every route, mounted under `/`. Everything except `GET /status` requires a Firebase ID token; everything containing `:userId` also requires that it match the authenticated user ([§5](05-authentication.md)).

---

## 10.1 Health

- `GET /status` — **unauthenticated**, returns `{ status: 'Running' }`

## 10.2 Categories

- `GET /users/:userId/categories`
- `POST /users/:userId/categories/filter`
- `POST /users/:userId/categories`
- `PUT /users/:userId/categories/:id`
- `DELETE /users/:userId/categories/:id`

Filter supports an exact case-insensitive name match; results are sorted by name ascending. The delete cascades ([§9.3](09-controllers.md#93-categorycontroller)).

## 10.3 Groups

- `GET /users/:userId/categories/:categoryId/groups`
- `POST /users/:userId/categories/:categoryId/groups/filter`
- `POST /users/:userId/categories/:categoryId/groups`
- `PUT /users/:userId/categories/:categoryId/groups/:id`
- `DELETE /users/:userId/categories/:categoryId/groups/:id`

Filter supports an exact case-insensitive name match; results are sorted by name ascending. **The delete removes the media items in the group** ([§9.4](09-controllers.md#94-groupcontroller)).

## 10.4 Own platforms

- `GET /users/:userId/categories/:categoryId/own-platforms`
- `POST /users/:userId/categories/:categoryId/own-platforms/filter`
- `POST /users/:userId/categories/:categoryId/own-platforms`
- **`PUT /users/:userId/categories/:categoryId/own-platforms/merge`**
- `PUT /users/:userId/categories/:categoryId/own-platforms/:id`
- `DELETE /users/:userId/categories/:categoryId/own-platforms/:id`

Filter supports an exact case-insensitive name match; results are sorted by name ascending. **The delete unlinks media items rather than deleting them** ([§9.5](09-controllers.md#95-ownplatformcontroller)).

Note that `merge` is registered **before** `:id` — a literal path segment that would otherwise be captured as an ID has to come first.

## 10.5 Media-item entity routes

One base path per type:

- movies → `/users/:userId/categories/:categoryId/movies`
- tv shows → `/users/:userId/categories/:categoryId/tv-shows`
- books → `/users/:userId/categories/:categoryId/books`
- videogames → `/users/:userId/categories/:categoryId/videogames`

And the same seven routes under each, with `<type>` standing for the segment above:

- `GET /users/:userId/categories/:categoryId/<type>`
- `POST /users/:userId/categories/:categoryId/<type>/filter`
- `POST /users/:userId/categories/:categoryId/<type>/search`
- `POST /users/:userId/categories/:categoryId/<type>/stats`
- `POST /users/:userId/categories/:categoryId/<type>`
- `PUT /users/:userId/categories/:categoryId/<type>/:id`
- `DELETE /users/:userId/categories/:categoryId/<type>/:id`

**The four are identical by construction** — they are assembled from the generic router builders in `app/routes/media-items/media-item.ts`, not written out four times ([§17.2](17-extension-playbooks.md#172-add-a-new-media-type)).

**`filter` and `search` accept optional pagination**, as a `pagination: { offset, limit }` block in the request body. When it is present the response carries a `pagination: { offset, limit, totalCount }` block back; when it is absent the API returns every match and no pagination block, exactly as it did before ([§11.5](11-models-and-mapping.md#115-pagination-models)). `GET <type>` is not paginated — the front end does not call it.

Because the block sits on the abstract `FilterMediaItemsRequest` / `SearchMediaItemsRequest` and their responses, all four media types get it without a per-type change.

**`stats` returns aggregated numbers, not media items.** It is a read with a filter body, hence a `POST` like `filter` and `search`. Its request and response are `GetMediaItemsStatsRequest` and `GetMediaItemsStatsResponse`, and unlike the other five they are **not** subclassed per media type: nothing in them is type-specific, so the four routes share one pair of classes.

The request carries the group and own-platform filter blocks of `filter`, unchanged, plus an optional `timezone`. The response carries three blocks — `mediaItems`, `completions` and `backlog` — that answer three different questions and are deliberately not comparable with each other; the aggregation and the status rule behind them are in [§9.6](09-controllers.md#96-mediaitementitycontroller), the models in [§11.6](11-models-and-mapping.md#116-stats-models).

There is no seasons endpoint. TV show seasons travel inside the TV show payload ([§7.7](07-domain-model.md#77-tv-show-seasons)).

## 10.6 Catalog routes

- `GET /catalog/movies/search/:searchTerm` · `GET /catalog/movies/:catalogId`
- `GET /catalog/tv-shows/search/:searchTerm` · `GET /catalog/tv-shows/:catalogId`
- `GET /catalog/books/search/:searchTerm` · `GET /catalog/books/:catalogId`
- `GET /catalog/videogames/search/:searchTerm` · `GET /catalog/videogames/:catalogId`

These proxy an external catalog lookup and map the result into the app's own models ([§12](12-catalog-integrations.md)). They are **authenticated but not user-resource-authorized**, because they carry no `:userId` ([§5.4](05-authentication.md#54-catalog-routes)).

## 10.8 Catch-all

Every unmatched route ends in the middleware from `app/routes/catch-all.ts`, which returns HTTP `404` with `AppError.NOT_FOUND`.

**An unauthenticated request to an unknown route returns `401`, not `404`**, because authentication runs earlier in the stack ([§1.5](01-architecture.md#15-the-middleware-stack)). That is the correct order — it means the API does not tell an anonymous caller which routes exist.

---

[← §9 Controllers](09-controllers.md) · [§11 API models and mapping →](11-models-and-mapping.md)
