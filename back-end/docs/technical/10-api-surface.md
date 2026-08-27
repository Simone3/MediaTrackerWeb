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

And the same six routes under each, with `<type>` standing for the segment above:

- `GET /users/:userId/categories/:categoryId/<type>`
- `POST /users/:userId/categories/:categoryId/<type>/filter`
- `POST /users/:userId/categories/:categoryId/<type>/search`
- `POST /users/:userId/categories/:categoryId/<type>`
- `PUT /users/:userId/categories/:categoryId/<type>/:id`
- `DELETE /users/:userId/categories/:categoryId/<type>/:id`

**The four are identical by construction** — they are assembled from the generic router builders in `app/routes/media-items/media-item.ts`, not written out four times ([§17.2](17-extension-playbooks.md#172-add-a-new-media-type)).

There is no seasons endpoint. TV show seasons travel inside the TV show payload ([§7.7](07-domain-model.md#77-tv-show-seasons)).

## 10.6 Catalog routes

- `GET /catalog/movies/search/:searchTerm` · `GET /catalog/movies/:catalogId`
- `GET /catalog/tv-shows/search/:searchTerm` · `GET /catalog/tv-shows/:catalogId`
- `GET /catalog/books/search/:searchTerm` · `GET /catalog/books/:catalogId`
- `GET /catalog/videogames/search/:searchTerm` · `GET /catalog/videogames/:catalogId`

These proxy an external catalog lookup and map the result into the app's own models ([§12](12-catalog-integrations.md)). They are **authenticated but not user-resource-authorized**, because they carry no `:userId` ([§5.4](05-authentication.md#54-catalog-routes)).

## 10.7 Legacy import

- `POST /users/:userId/import/old-app`

**Destructive**: it clears every existing entity for that user first, then imports categories and their media items from the old export format, creating one default own platform per imported category from the request options ([§13](13-legacy-import.md)).

## 10.8 Catch-all

Every unmatched route ends in the middleware from `app/routes/catch-all.ts`, which returns HTTP `404` with `AppError.NOT_FOUND`.

**An unauthenticated request to an unknown route returns `401`, not `404`**, because authentication runs earlier in the stack ([§1.5](01-architecture.md#15-the-middleware-stack)). That is the correct order — it means the API does not tell an anonymous caller which routes exist.

---

[← §9 Controllers](09-controllers.md) · [§11 API models and mapping →](11-models-and-mapping.md)
