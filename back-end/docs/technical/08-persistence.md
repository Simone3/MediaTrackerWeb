# §8 — Persistence

*[Index](README.md) · [← §7 Domain model](07-domain-model.md)*

MongoDB through Mongoose: the collections, how they reference each other, and the one helper every controller goes through.

---

## 8.1 Collections

`Category` · `Group` · `OwnPlatform` · `Movie` · `TvShow` · `Book` · `Videogame`

**Each media type has its own collection.** That is what makes a category's media type immutable once it holds items ([§7.2](07-domain-model.md#72-category)) and what makes `mediaItemFactory` necessary — a cross-type operation has to be told which collection to work in ([§9.8](09-controllers.md#98-mediaitemfactory)).

## 8.2 References

Stored as ObjectIds:

- `category` → `Category`
- `group` → `Group`
- `ownPlatform` → `OwnPlatform`

**`owner` is not a reference.** It is a raw Firebase UID string, because there is no user collection to point at ([§7.1](07-domain-model.md#71-the-ownership-model)).

## 8.3 The shared media-item schema

The common fields are defined once, in `app/schemas/media-items/media-item.ts`. Each media type's schema file adds only its own extra fields ([§7.6](07-domain-model.md#76-media-type-specific-fields)).

Keeping the shared definition in one file is what stops four collections from slowly disagreeing about what a media item is.

## 8.4 Populate

Media-item read paths populate `group` and `ownPlatform`.

That is why API responses carry nested `groupData` and `ownPlatformData` objects rather than bare IDs: a list row needs the group's name and the platform's color and icon to render, and a second round trip per row would be absurd ([§11.4](11-models-and-mapping.md#114-media-item-mapper-conventions)).

## 8.5 `QueryHelper`

`app/controllers/database/query-helper.ts` is the shared database helper every controller uses:

- `find`
- `count`
- `aggregate`
- `castConditions`
- `findOne`
- `save`
- `updateSelectiveMany`
- `deleteById`
- `delete`
- `checkUniquenessAndSave`

Details worth knowing:

- **every read uses English collation**, so sorting is case-insensitive — otherwise `Zorro` would sort before `apple`. The constant lives in `app/schemas/common.ts` because the indexes have to declare the same one ([§8.8](#88-indexes))
- optional populate flags are supported ([§8.4](#84-populate))
- **`find` takes optional pagination options, and omitting them returns every matching document** ([§8.7](#87-pagination))
- query performance logging is emitted when enabled ([§14.1](14-logging.md#141-logger-categories))
- **`checkUniquenessAndSave` exists but no current entity controller uses it.** Uniqueness is handled by the duplicate-name confirmation flow in the front end instead, so there are no database-level uniqueness constraints enforced today ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics))

**`aggregate` runs a pipeline** and exists for the reads whose answer is a handful of numbers over a lot of documents — today only the media items stats ([§9.6](09-controllers.md#96-mediaitementitycontroller)). Loading those documents into the application to reduce them here is what it avoids.

**Mongoose does not cast an aggregation pipeline**, which is what `castConditions` is for. Every other method casts on its own: a `find` given `category: '65f…'` turns the string into an ObjectId against the schema, while the identical condition written inside a `$match` stage stays a string and matches nothing. There is no error, only an empty result — so any query condition going into a pipeline has to be run through `castConditions` first.

**Go through `QueryHelper` rather than reaching for Mongoose directly.** One-off access styles per controller lose the collation, the populate flags and the performance logging, all silently.

## 8.6 No transactions

There is no transaction handling around the multi-step deletes, the own-platform merge, or the legacy import ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics)). A cascade that fails partway leaves the partial result behind.

Know this before adding another multi-step write: it is a property of the current codebase, not something a new operation gets for free.

## 8.7 Pagination

`find` accepts an optional `{ offset, limit }` and turns it into Mongo's `skip` and `limit`. `count` runs the same conditions through `countDocuments`, under the same collation, and ignores the pagination — that is where a caller gets the total.

**Omitting the pagination options must keep returning every matching document.** The cascades, the bulk reads and the legacy import all call `find` with no pagination and would silently start losing rows if a default page size were ever introduced ([§9.6](09-controllers.md#96-mediaitementitycontroller)).

**Offset pagination, not a cursor.** The sort is caller-chosen, multi-field and per-field directional, and five of the sortable fields are nullable; a keyset predicate over that is a generated nested `$or` with explicit null handling, and it would need collation-matched indexes that do not exist. At the size of one user's category the `skip` cost that would justify the complexity is not there.

**The second query is the price.** A paginated request runs `find` and `countDocuments`; an unpaginated one runs only `find`, because the results already are the total.

## 8.8 Indexes

One index is declared, on the four media-item collections:

```
{ owner: 1, category: 1 }   collation { locale: 'en' }
```

`addCommonMediaItemSchemaIndexes` in `app/schemas/media-items/media-item.ts` adds it, and each media type's schema file calls it — the same "define it once" arrangement as the shared field definition ([§8.3](#83-the-shared-media-item-schema)).

**Every media-item read is scoped to an owner and, in all but the delete-everything-for-a-user cascade, to a category.** That prefix is what the list, the filter, the search, the cascades and the stats aggregate all start from, so one index serves all of them.

**The collation is not optional.** An index is usable only by a query that runs under the same collation, and `QueryHelper` runs every read under English collation ([§8.5](#85-queryhelper)). A plain index would be silently ignored by every query in the application; declaring it from the same `DATABASE_COLLATION` constant is what keeps the two from drifting apart.

Nothing else is indexed. The categories, groups and own platforms of one user are a handful of documents each, and the sortable media-item fields are chosen by the caller, are five-deep and multi-directional — indexing for those is a different exercise from indexing for the access scope ([§8.7](#87-pagination)).

Mongoose builds the index at startup, on model initialization.

---

[← §7 Domain model](07-domain-model.md) · [§9 Controllers →](09-controllers.md)
