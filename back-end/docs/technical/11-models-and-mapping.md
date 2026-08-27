# §11 — API models and mapping

*[Index](README.md) · [← §10 API surface](10-api-surface.md)*

---

## 11.1 Four model families

| Family | Location |
| --- | --- |
| API models | `app/data/models/api/**` |
| Internal models | `app/data/models/internal/**` |
| External service response models | `app/data/models/external-services/**` |
| Legacy import models | `app/data/models/api/import/**` and `app/data/models/internal/import/**` |

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

It logs every mapping at debug level, which is what makes a wrong field traceable without adding prints ([§14.1](14-logging.md#141-logger-categories)).

## 11.4 Media-item mapper conventions

`app/data/mappers/media-items/media-item.ts` holds the shared rules:

- **API date strings become `Date` objects** on the way in
- **`completedOn` is sorted before `completedLastOn` is derived from it** — the client may send completion dates in any order, and the denormalized "last" field is only correct if the list is sorted first ([§7.5](07-domain-model.md#75-media-item-common-fields))
- **populated `group` and `ownPlatform` references become nested API objects** as `groupData` and `ownPlatformData` ([§8.4](08-persistence.md#84-populate))
- boolean-ish values are normalized through `miscUtils.parseBoolean(...)` ([§15.2](15-utilities.md#152-miscutils))

**Anything that writes `completedOn` anywhere must keep `completedLastOn` consistent.** This mapper is where that is done today; a new write path is a new place it can be forgotten.

---

[← §10 API surface](10-api-surface.md) · [§12 Catalog integrations →](12-catalog-integrations.md)
