# §8 — Domain model

*[Index](README.md) · [← §7 Authentication](07-authentication.md)*

The internal models in `app/data/models/internal/*` — what the app works with, as opposed to the API models it sends and receives ([§9.3](09-data-layer.md#93-rest-transport)). The back end's own view of the same entities is in `../../../back-end/docs/technical/07-domain-model.md`.

---

## 8.1 User

- `id`
- `email`

## 8.2 Category

- `id`
- `name`
- `mediaType`
- `color`

`DEFAULT_CATEGORY` is an empty name, the first configured category color, and media type `BOOK`.

**A category's media type decides everything below it**: which controller, form, list row and catalog integration apply to the items inside ([§9.5](09-data-layer.md#95-media-type-factories)).

## 8.3 Group

- `id`
- `name`

Groups are category-scoped and optional on a media item. They exist to collect a franchise or series, and `orderInGroup` gives the items a position within one ([§10.5](10-features.md#105-groups)).

**`orderInGroup` is a decimal, not an integer.** It allows one decimal digit so that a spin-off can sit between two main entries (2.5), and it must be greater than zero and at most 9999. The bound lives twice, once per model family: `MEDIA_ITEM_ORDER_IN_GROUP_MAX_DECIMALS` / `MEDIA_ITEM_ORDER_IN_GROUP_MAX` on the API side and `MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX_DECIMALS` / `MEDIA_ITEM_ORDER_IN_GROUP_INTERNAL_MAX` on the internal side, the same way the importance values are duplicated. Both mirror the back end's own bounds.

A whole order carries no decimal digits anywhere: it is a plain `number`, so `2` renders as `2` and never as `2.0`. Nothing formats the field, and nothing should start.

## 8.4 Own platform

- `id`
- `name`
- `color`
- `icon`

Supported icon IDs: `default`, `android`, `apple`, `book`, `disc`, `disney`, `download`, `epic`, `gog`, `hulu`, `kindle`, `netflix`, `origin`, `playstation`, `primevideo`, `steam`, `switch`, `uplay`.

The list is declared once, in `app/components/presentational/own-platform/common/icon-registry.ts` ([§10.6](10-features.md#106-own-platforms)).

## 8.5 Generic media item

Shared across all four media types:

- `id`
- `mediaType`
- `name`
- `genres?`
- `description?`
- `releaseDate?`
- `imageUrl?`
- `catalogId?`
- `status`
- `importance`
- `group?`
- `orderInGroup?`
- `ownPlatform?`
- `userComment?`
- `completedOn?`
- `active?`
- `markedAsRedo?`

Importance is one of `400`, `300`, `200`, `100`. Status is one of `ACTIVE`, `UPCOMING`, `REDO`, `COMPLETE`, `NEW`.

**Nothing here may know about a specific media type.** The generic media-item components, models and mappers stay generic; subtype behaviour goes in the subtype wrapper, view, row or controller ([§16.3](16-extension-playbooks.md#163-add-a-new-media-type)).

## 8.6 Media-type-specific fields

**Book**

- `authors?`
- `pagesNumber?`

**Movie**

- `directors?`
- `durationMinutes?`

**TV show**

- `creators?`
- `averageEpisodeRuntimeMinutes?`
- `inProduction?`
- `nextEpisodeAirDate?`
- `seasons?`

**Videogame**

- `developers?`
- `publishers?`
- `platforms?`
- `averageLengthHours?`

## 8.7 TV show season

- `number`
- `episodesNumber?`
- `watchedEpisodesNumber?`

**Seasons have no back end of their own.** They are edited in a nested local workflow and become part of the parent TV show only when that TV show is saved ([§10.4](10-features.md#104-tv-show-seasons-the-nested-flow)).

---

[← §7 Authentication](07-authentication.md) · [§9 Data layer →](09-data-layer.md)
