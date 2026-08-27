# §13 — Legacy import

*[Index](README.md) · [← §12 Catalog integrations](12-catalog-integrations.md)*

---

## 13.1 Purpose

`POST /users/:userId/import/old-app` migrates an export from an earlier Media Tracker application into the current schema. It exists for a one-time migration per user, not as an ongoing sync.

## 13.2 The controller flow

`app/controllers/import/old-app.ts`:

1. delete all media items for the user, across every media type
2. delete all groups for the user
3. delete all own platforms for the user
4. delete all categories for the user
5. recreate the imported categories
6. create one default own platform per imported category
7. recreate the imported media items under the new categories

**It is a replace, not a merge.** Everything the user already had is destroyed first. There are no transactions around any of it ([§8.6](08-persistence.md#86-no-transactions)), so a failure partway leaves a partial state.

The endpoint is also why `express.json` has a 10 MB limit and why the sample config excludes this URL from request body logging ([§14.2](14-logging.md#142-requestresponse-logging)) — an export of a full library is large.

## 13.3 Category mapping

`app/data/mappers/import/old-app/category.ts`:

| Old media type | New |
| --- | --- |
| `BOOKS` | `BOOK` |
| `MOVIES` | `MOVIE` |
| `TV_SHOWS` | `TV_SHOW` |
| `VIDEOGAMES` | `VIDEOGAME` |

Old colors become hardcoded hex values.

## 13.4 Media-item mapping

`app/data/mappers/import/old-app/media-items/media-item.ts` handles the common legacy fields:

- the old importance enum becomes the new four-level string enum
- **the old `OWNED` boolean does not become a field.** It decides whether the imported item is linked to the category's default imported own platform — the old app had a flag where the new one has a relationship ([§7.4](07-domain-model.md#74-own-platform))
- old `DOING_NOW` becomes `active`
- old `COMPLETION_DATE` becomes the completion date
- old `TIMES_COMPLETED` duplicates that date into `completedOn`, so the completion count survives even though the individual dates were never recorded ([§7.5](07-domain-model.md#75-media-item-common-fields))

**The redo inference.** If `COMPLETION_DATE` is missing but `TIMES_COMPLETED > 0`, the item was completed at some point and is now being redone. In that case `markedAsRedo` is set to `true` and a synthetic completion date defaults to the current day at midnight.

That synthetic date is a deliberate approximation: the new model cannot express "completed, date unknown", and losing the completion entirely would be worse than dating it wrong.

The type-specific mappers then add movie directors and duration; TV show creators, runtime, in-production flag and next-episode air date; book authors and page count; videogame developers, publishers, platforms and average length.

## 13.5 What the import does not carry

- **legacy groups are not imported**
- **imported TV show seasons are left `undefined`**

Both are current limitations rather than decisions worth preserving.

---

[← §12 Catalog integrations](12-catalog-integrations.md) · [§14 Logging →](14-logging.md)
