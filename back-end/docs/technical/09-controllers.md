# §9 — Controllers

*[Index](README.md) · [← §8 Persistence](08-persistence.md)*

Where the business rules live. Routes call into here and do nothing themselves ([§1.2](01-architecture.md#12-the-layers)).

---

## 9.1 `AbstractEntityController`

The base for the category, group, own-platform and media-item controllers. It provides:

- `checkExistencePreconditionsHelper(...)`
- `getEntityStringId(...)`

## 9.2 The delete cascades, in one place

The three cascade rules below are the invariants most easily broken by a new feature, so they are worth reading together before reading them apart:

| Deleting | Effect on media items |
| --- | --- |
| a **category** | its groups, its media items and its own platforms all go |
| a **group** | the media items in that group are **deleted** |
| an **own platform** | the media items are **kept** and simply unlinked |

**A group owns its items; a platform only describes them.** That is the reasoning behind the asymmetry, and it is why the two must not be made to behave the same way.

## 9.3 `CategoryController`

`app/controllers/entities/category.ts`

- load categories for a user
- filter by exact case-insensitive literal name
- save
- delete
- delete all categories for a user

**A category's media type cannot change once the category contains media items** ([§7.2](07-domain-model.md#72-category)).

The delete cascades to all groups in the category, all media items in it — through the type-specific controller resolved by `mediaItemFactory` ([§9.8](#98-mediaitemfactory)) — all own platforms in it, and finally the category itself.

## 9.4 `GroupController`

`app/controllers/entities/group.ts`

- load, filter, save and delete groups
- delete all groups for a user's category, or for a user

**Deleting a group deletes the media items in it.**

## 9.5 `OwnPlatformController`

`app/controllers/entities/own-platform.ts`

- load, filter, save and delete own platforms
- **merge several own platforms into one**
- delete all own platforms for a user's category, or for a user

**Deleting an own platform does not delete media items** — it unsets `ownPlatform` on every matching item in the category.

The merge:

- requires at least two own-platform IDs
- requires all of them to belong to the same user and category
- **the first ID in `ownPlatformIds` becomes the kept platform**
- the merged data is saved onto that kept ID
- every media item pointing at the other IDs is rewritten to the kept one
- the other platform documents are deleted

**No media item may be left pointing at a deleted platform.** The rewrite is the whole point of the operation; the delete is the cleanup.

## 9.6 `MediaItemEntityController`

`app/controllers/entities/media-items/media-item.ts` — **the most important shared controller in the codebase.**

Responsibilities:

- get one media item, or all for a category
- filter and sort
- search by term
- save, update, delete
- bulk delete by group, category or user
- bulk replace own-platform references (used by the merge above)

Key behaviours:

- **inserts verify that the category's media type matches the controller's media type** — the one guard that keeps a movie out of a book collection
- writes verify that a referenced group and own platform actually exist
- read, filter and search operations populate group and own-platform references ([§8.4](08-persistence.md#84-populate))

**Filters shared by every media type:**

`importanceLevels` · `complete` · `name` · `groups.anyGroup` · `groups.noGroup` · `groups.groupIds` · `ownPlatforms.anyOwnPlatform` · `ownPlatforms.noOwnPlatform` · `ownPlatforms.ownPlatformIds`

`complete` is the one with real semantics:

- **`true`** — `completedLastOn != undefined` **and** `markedAsRedo != true`
- **`false`** — `completedLastOn == undefined` **or** `markedAsRedo == true`

An item marked as redo counts as *not* complete even though it carries completion dates, which is exactly what "I finished this and I am reading it again" should mean to a list ([§7.5](07-domain-model.md#75-media-item-common-fields)).

**Sort fields shared by every media type:**

`IMPORTANCE` · `NAME` · `GROUP` · `OWN_PLATFORM` · `COMPLETION_DATE` · `ACTIVE` · `RELEASE_DATE`

**Search:**

- case-insensitive substring matching
- always searches `name`
- also searches one type-specific field, chosen by media type ([§9.7](#97-media-specific-entity-controllers))
- **the search term is regex-escaped**, so a user typing `.*` searches for the literal characters instead of matching everything

**Pagination:**

`filterAndOrderMediaItems` and `searchMediaItems` take optional `{ offset, limit }` options and return `{ elements, totalCount }` rather than a bare list ([§8.7](08-persistence.md#87-pagination)). Without those options they return every match, and `totalCount` is just the number of elements — no second query runs.

**Every sort ends with the ID as a tiebreaker.** None of the sortable fields is unique, so two media items with the same sort value have no defined order between them. That is invisible while the whole list comes back at once and becomes a bug the moment it does not: without the tiebreaker, one item can land on two consecutive pages while another never appears at all.

## 9.7 Media-specific entity controllers

Each subclass contributes a default sort, one searchable field and one extra sort field:

| Type | Default sort | Type-specific search | Type-specific sort |
| --- | --- | --- | --- |
| Movie | `NAME asc` | `directors` | `DIRECTOR` |
| TV show | `NAME asc` | `creators` | `CREATOR` |
| Book | `NAME asc` | `authors` | `AUTHOR` |
| Videogame | `NAME asc` | `developers` | `DEVELOPER` |

**That is the whole surface a subclass is meant to add.** Anything larger appearing in one of these files usually belongs in the shared controller instead.

## 9.8 `mediaItemFactory`

`app/factories/media-item.ts` resolves the right entity controller or catalog controller from a category or a media type. Supported types: `BOOK`, `MOVIE`, `TV_SHOW`, `VIDEOGAME`.

**This is the single place media type maps to behaviour.** Category delete needs it to know which media-item collection to clear; any cross-media-type workflow needs it for the same reason. **A `switch` on media type anywhere else is a duplicate of this file** and will be the one that gets forgotten when a fifth type is added ([§17.2](17-extension-playbooks.md#172-add-a-new-media-type)).

---

[← §8 Persistence](08-persistence.md) · [§10 API surface →](10-api-surface.md)
