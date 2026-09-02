# §11 — API models and mapping

*[Index](README.md) · [← §10 API surface](10-api-surface.md)*

---

## 11.1 Four model families

| Family | Location |
| --- | --- |
| API models | `app/data/models/api/**` |
| Internal models | `app/data/models/internal/**` |
| External service response models | `app/data/models/external-services/**` |

**Use internal models inside controllers and API models at the route boundary.** A controller that accepts an API model has let the transport shape into the business logic, and the two stop being separable from that point on.

## 11.2 Why the mapper layer exists

Routes never pass a raw request body into a controller. Everything crosses through a mapper, which buys three things:

- **the API contract can stay stable while persistence changes** — the front end is not renegotiated every time a schema moves
- **internal models can use `Date`, object references and database-oriented shapes** that JSON cannot express
- **external APIs can be normalized into the app's own contract**, so a TMDb field rename is one mapper's problem rather than the whole codebase's ([§12](12-catalog-integrations.md))

## 11.3 The generic mapper base

`app/data/mappers/common.ts` defines `ModelMapper<TInternal, TExternal, TParams>`, providing:

- `toExternal`
- `toExternalList`
- `toInternal`
- `toInternalList`

It logs every mapping at debug level, which is what makes a wrong field traceable without adding prints ([§14.1](14-logging.md#141-one-logger)).

## 11.4 Media-item mapper conventions

`app/data/mappers/media-items/media-item.ts` holds the shared rules:

- **API date strings become `Date` objects** on the way in
- **`completedOn` is sorted before `completedLastOn` is derived from it** — the client may send completion dates in any order, and the denormalized "last" field is only correct if the list is sorted first ([§7.5](07-domain-model.md#75-media-item-common-fields))
- **populated `group` and `ownPlatform` references become nested API objects** as `groupData` and `ownPlatformData` ([§8.4](08-persistence.md#84-populate))
- **the `group` block is emitted when `orderInGroup` is defined, not when it is truthy** — the field is a number, so a truthiness test would drop the whole group from the response for an item ordered `0` ([§7.5](07-domain-model.md#75-media-item-common-fields))
- boolean-ish values are normalized through `miscUtils.parseBoolean(...)` ([§15.2](15-utilities.md#152-miscutils))

**Anything that writes `completedOn` anywhere must keep `completedLastOn` consistent.** This mapper is where that is done today; a new write path is a new place it can be forgotten.

## 11.5 Pagination models

`PaginationRequest` and `PaginationResponse` live in `app/data/models/api/common.ts`, `PaginationInternal` and `PaginatedResultInternal<T>` in `app/data/models/internal/common.ts`, and `paginationMapper` in `app/data/mappers/common.ts` — the same `common.ts` in each of the three families, because pagination belongs to no single entity ([§8.7](08-persistence.md#87-pagination)).

- **the whole request block is optional, but its two fields are not.** A `limit` with no `offset` is an ambiguous request rather than a partial one, so both are required once the block is present
- **`limit` is capped by `PAGINATION_MAX_LIMIT`**, an exported constant next to the model rather than a config value — it is part of the API contract, the same way `MEDIA_ITEM_ORDER_IN_GROUP_MAX` is
- **the response block is returned only when the request asked for a page.** A caller that does not paginate gets byte-for-byte the response it got before pagination existed
- `totalCount` counts everything matching the request, ignoring `offset` and `limit`: it is what tells the caller whether another page exists

Only media items are wired up today. The plumbing is entity-agnostic, so adding pagination to categories, groups or own platforms is a request field, a response field and one extra argument.

## 11.6 Stats models

The media items stats live alongside the other media-item models: `GetMediaItemsStatsRequest` / `GetMediaItemsStatsResponse` and their nested blocks in `app/data/models/api/media-items/media-item.ts`, `MediaItemsStatsInternal` in the matching internal file, and `mediaItemsStatsFilterMapper` / `mediaItemsStatsMapper` in `app/data/mappers/media-items/media-item.ts`.

Three things are specific to them:

- **`MediaItemsStatsFilter` reuses `MediaItemGroupFilter` and `MediaItemOwnPlatformFilter` unchanged**, and its mapper produces an ordinary `MediaItemFilterInternal` with only those two blocks set. The stats query is then the list query's own condition builder, which is what stops the two screens from drifting apart on what a filter means
- **the stats mapper only goes outwards.** Stats are computed by the database and never travel into the application, so `convertToInternal` throws rather than pretending to be implemented
- **`ownPlatformId` is emitted as an explicit `null`** for the media items the user does not own. It is a bucket of the result rather than a missing value, and an absent key would read as the latter

There are no per-media-type subclasses: nothing in these models is type-specific ([§10.5](10-api-surface.md#105-media-item-entity-routes)).

---

[← §10 API surface](10-api-surface.md) · [§12 Catalog integrations →](12-catalog-integrations.md)
