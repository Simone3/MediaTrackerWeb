# §9 — Data layer

*[Index](README.md) · [← §8 Domain model](08-domain-model.md)*

Everything that talks to the network, and the switch that decides whether anything actually does.

---

## 9.1 The controller structure

- `interfaces/` — the contracts
- `implementations/real/` — Firebase and REST-backed
- `implementations/mocks/` — in-memory substitutes
- `main/` — the runtime singletons that pick between them

Nothing outside this folder makes a network call. A saga calls a controller; the controller decides how that becomes a request.

## 9.2 Runtime controller selection

`app/controllers/main/**` chooses each entity controller from `config.mocks.*` ([§4.4](04-configuration.md#44-what-else-config-owns)):

- `categoryController`
- `groupController`
- `ownPlatformController`
- `userController`
- the media-item controller factories, by media type

**Before debugging any data problem, check whether the app is on mocks or on the real implementations.** A list that shows plausible-looking data that the back end has never heard of is the usual symptom.

## 9.3 REST transport

Real REST calls go through `BackEndInvokerRestJson`, `RestJsonInvokerAxios` and `parserValidator`.

- the timeout comes from config unless a call overrides it explicitly
- **request and response validation is skipped when `assumeWellFormedResponse` is true**, which is the production setting ([§4.3](04-configuration.md#43-prod-config))
- API models carry `class-validator` decorators, which is why `index.tsx` imports `reflect-metadata` first
- mappers convert between the API models and the internal ones ([§8](08-domain-model.md))

**The mapper layer is what lets the two model families drift.** The API shape follows the back end; the internal shape follows what components need — real `Date` objects, resolved references. Neither has to compromise for the other.

## 9.4 Endpoint patterns

The authoritative list, with the behaviour behind each route, is the back end's own [§10 API surface](../../../back-end/docs/technical/10-api-surface.md).

**Categories**

- `GET /users/:userId/categories`
- `POST /users/:userId/categories/filter`
- `POST /users/:userId/categories`
- `PUT /users/:userId/categories/:id`
- `DELETE /users/:userId/categories/:id`

**Groups**

- `GET /users/:userId/categories/:categoryId/groups`
- `POST /users/:userId/categories/:categoryId/groups/filter`
- `POST /users/:userId/categories/:categoryId/groups`
- `PUT /users/:userId/categories/:categoryId/groups/:id`
- `DELETE /users/:userId/categories/:categoryId/groups/:id`

**Own platforms**

- `GET /users/:userId/categories/:categoryId/own-platforms`
- `POST /users/:userId/categories/:categoryId/own-platforms/filter`
- `POST /users/:userId/categories/:categoryId/own-platforms`
- `PUT /users/:userId/categories/:categoryId/own-platforms/:id`
- `DELETE /users/:userId/categories/:categoryId/own-platforms/:id`

**Media items**, with `<type>` one of `books`, `movies`, `tv-shows`, `videogames`

- `POST /users/:userId/categories/:categoryId/<type>/filter`
- `POST /users/:userId/categories/:categoryId/<type>/search`
- `POST /users/:userId/categories/:categoryId/<type>/stats`
- `POST /users/:userId/categories/:categoryId/<type>`
- `PUT /users/:userId/categories/:categoryId/<type>/:id`
- `DELETE /users/:userId/categories/:categoryId/<type>/:id`
- `GET /catalog/<type>/search/:searchTerm`
- `GET /catalog/<type>/:catalogId`

The four media types share one route shape exactly; that symmetry is what the factories in [§9.5](#95-media-type-factories) rely on. It is also why `implementations/real/entities/media-items/media-item.ts` exists: **every one of those calls is made there once**, by `MediaItemBackEndController` for the user database routes and by `MediaItemCatalogBackEndController` for the catalog ones.

A subtype controller therefore holds no transport code at all. It declares:

- `mediaItemPathName`, the path segment that tells the routes apart
- the response classes of the calls whose response model is media-type-specific, since those are what the parser validates against
- `buildFilterRequest`, `buildSearchRequest`, `buildAddRequest` and `buildUpdateRequest`, which are where the type's own mappers live
- `getMediaItemsFromResponse`, and the two catalog equivalents, because the request and response bodies name their field after the media type: `books`, `newBook`, `catalogBook`

**The URLs, the HTTP methods, the add-versus-update branch and the pagination fallback are the base's business, not the subtype's.** Anything that would otherwise have to be edited four times identically belongs there.

**`stats` is a read with a filter body, so it is a `POST` like the other two, and it sends the browser's own time zone.** Completion dates are written at local midnight and stored as the matching instant, so a completion dated the 1st of January is stored in the previous year for anyone east of Greenwich: without the time zone the server would group those completions into the wrong bar ([§10.9](10-features.md#109-media-items-stats)).

**The two list routes are paginated.** `filter` and `search` take an optional `PaginationInternal` (`offset`, `limit`) and answer with a `PaginatedResultInternal`: the page of elements plus the `totalCount` of everything that matched. Omitting the options asks for every match, and the back end then answers without a pagination block, so `totalCount` falls back to the length of what came back. Only media items are wired up — the plumbing on both sides is entity-agnostic, so the other lists can opt in later ([back end §10](../../../back-end/docs/technical/10-api-surface.md)).

`limit` cannot exceed the back end's `PAGINATION_MAX_LIMIT` of 100, which `app/data/models/api/common.ts` mirrors so a misconfigured page size fails validation here instead of at the server. `PAGINATION_INTERNAL_MAX_LIMIT` mirrors it once more for code that cannot import the decorated API module, which is how the config test guards the configured page size ([§14](14-testing.md)).

## 9.5 Media-type factories

`app/controllers/main/entities/media-items/factories.ts` holds three factory families, all switching on `MediaTypeInternal`:

- **item controllers** — CRUD, filter, search
- **definitions controllers** — defaults and per-type field extraction
- **catalog controllers** — external catalog search and details

**This is the one place that maps a media type to its behaviour.** It is what keeps the generic media-item code generic: a `switch` on media type anywhere else is a duplication of this file and should be replaced by a call into it.

## 9.6 Media definitions controllers

`MediaItemDefinitionsControllerImpl` in `implementations/real/entities/media-items-definitions/media-item.ts` holds the defaults, because every media type currently shares them:

- default filter: `status: 'CURRENT'`
- default sort: `ACTIVE desc`, `IMPORTANCE desc`, `RELEASE_DATE asc`
- view-group sort: `GROUP asc`

A subtype controller implements only the three things that are phrased differently per type but mean the same thing to the list row: creator-name extraction ("author", "director", "creator", "developer"), duration extraction, and default media-item creation. **A media type that wants its own default filter or sort order says so with an override**, which is what keeps "they are all the same" a statement the code makes rather than a coincidence four files happen to share.

The generic sort options carry no `field`, since each media type widens it with its own values, so the shared defaults are built against the common fields and converted on the way out.

## 9.7 Mock controllers

Mock controllers extend `MockControllerHelper` and are in-memory:

- optional artificial delay
- optional error probability
- seeded sample data
- simplistic filter and sort behaviour

Pagination is the one thing they do faithfully: `mockPaginate` slices the requested window and reports the full match count, so a paginated list behaves the same against mocks as against the server even when the filtering that produced it does not.

**They are for UI work, not for behaviour parity.** Generic media-item mock filtering and sorting are intentionally incomplete — name, importance, group and own platform are honoured, status is not — and the mock logs when it hits something the real back end would have handled. A flow that works against mocks has not been shown to work ([§15.8](15-invariants-and-pitfalls.md#158-mock-behaviour-is-not-production-parity)).

---

[← §8 Domain model](08-domain-model.md) · [§10 Features →](10-features.md)
