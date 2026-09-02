# §7 — Domain model

*[Index](README.md) · [← §6 Validation and errors](06-validation-and-errors.md)*

The internal models in `app/data/models/internal/*` — what controllers work with, as opposed to the API models at the route boundary ([§11](11-models-and-mapping.md)). The front end's view of the same entities is in `../../../front-end/docs/technical/08-domain-model.md`.

---

## 7.1 The ownership model

**There is no `User` collection in this project.** Ownership is a Firebase UID string stored directly on each document, in the `owner` field, and compared against the authenticated user ([§5.2](05-authentication.md#52-authorization)).

That is why `owner` is not a Mongo reference and never will be: there is nothing to reference.

## 7.2 Category

`app/data/models/internal/category.ts`

- `_id`
- `name`
- `mediaType`
- `color`
- `owner`

A category belongs to one user and has **exactly one media type**, and that media type decides which media-item controller, schema and routes are valid underneath it.

**It cannot be changed once the category holds media items** ([§9.3](09-controllers.md#93-categorycontroller)) — the items live in a per-type collection, so changing the type would orphan every one of them.

## 7.3 Group

`app/data/models/internal/group.ts`

- `_id`
- `name`
- `owner`
- `category`

Groups are category-scoped and optional on a media item. `orderInGroup` on the item is what gives a series its reading or watching order.

## 7.4 Own platform

`app/data/models/internal/own-platform.ts`

- `_id`
- `name`
- `color`
- `icon`
- `owner`
- `category`

An own platform records *where* the user owns an item — a physical shelf, a storefront, a streaming service. The reference on a media item is optional.

## 7.5 Media item, common fields

`app/data/models/internal/media-items/media-item.ts`

- `_id`
- `name`
- `genres`
- `description`
- `releaseDate`
- `imageUrl`
- `catalogId`
- `category`
- `group`
- `orderInGroup`
- `ownPlatform`
- `owner`
- `importance`
- `userComment`
- `completedOn`
- `completedLastOn`
- `active`
- `markedAsRedo`

Semantics that are not obvious from the names:

- **`importance`** is one of `'100' | '200' | '300' | '400'`
- **`orderInGroup` is a decimal, not an integer** — greater than zero, at most `9999`, at most one decimal digit. The decimal digit is the point: it lets a spin-off take the `2.5` slot between two main entries without renumbering the rest of the group. It is stored as a plain BSON number and the `GROUP` sort orders on it directly, so no code has to know about the fractional part
- **`completedOn` is the full list of completion dates** — a book read twice has two
- **`completedLastOn` is denormalized from `completedOn`** purely so sorting and filtering can use a single date field instead of reaching into an array. It is redundant by construction, which is why **any code that writes or transforms `completedOn` must keep it consistent** ([§11.4](11-models-and-mapping.md#114-media-item-mapper-conventions))
- **`active`** means currently reading, watching or playing
- **`markedAsRedo`** means the item was completed before and has been moved back into the current workflow. It is what lets the `complete` filter distinguish "finished" from "finished once, doing it again" ([§9.6](09-controllers.md#96-mediaitementitycontroller))

**There is no status field.** What the user sees as a status — new, active, upcoming, redo, complete — is derived from `completedOn`, `markedAsRedo`, `active` and `releaseDate`, by a precedence rule the stats aggregate and the front end each apply for themselves, pinned to each other by a table of cases duplicated in both test suites ([§9.6](09-controllers.md#96-mediaitementitycontroller)).

**Nothing here may know about a specific media type.** Generic media-item files stay generic; subtype behaviour goes in the subtype module ([§17.2](17-extension-playbooks.md#172-add-a-new-media-type)).

## 7.6 Media-type-specific fields

**Movie**

- `directors`
- `durationMinutes`

**TV show**

- `creators`
- `averageEpisodeRuntimeMinutes`
- `seasons`
- `inProduction`
- `nextEpisodeAirDate`

**Book**

- `authors`
- `pagesNumber`

**Videogame**

- `developers`
- `publishers`
- `platforms`
- `averageLengthHours`

## 7.7 TV show seasons

`app/schemas/media-items/tv-show.ts` enforces, at the schema level:

- the season number must be positive
- season numbers must be unique
- **seasons must already be sorted ascending**

The third one puts the ordering burden on the writer rather than the reader. It means every read path gets seasons in order without sorting them, and it means a caller that appends a season out of order is rejected instead of silently producing a list that renders wrong.

The front end edits seasons as a purely local nested workflow and sends them with the parent TV show; there is no seasons endpoint ([§10.5](10-api-surface.md#105-media-item-entity-routes)).

---

[← §6 Validation and errors](06-validation-and-errors.md) · [§8 Persistence →](08-persistence.md)
