# Media items stats screen

Functional specification for a new screen that shows, for one media items category, what the user has
finished and what they have not. Nothing described here is implemented yet.

- **Mockup**: [`mockup.html`](mockup.html) — open it in a browser. The two filters, the tooltips on the
  year bars and the empty states all work; the category switch above the frame is a mockup control and
  is not part of the screen.
- **Front end**: `front-end/`, under its own [`CLAUDE.md`](../../front-end/CLAUDE.md) and
  [`docs/technical/`](../../front-end/docs/technical/README.md).
- **Back end**: `back-end/`, under its own [`CLAUDE.md`](../../back-end/CLAUDE.md) and
  [`docs/technical/`](../../back-end/docs/technical/README.md).

---

## 1. What the screen is for

One category, two questions that are deliberately **not** compared to each other:

| Half | Question | Unit |
| --- | --- | --- |
| **Completed** | How much have I finished, and when? | completions |
| **Still to do** | What is left, and where is it? | media items |

The two halves never share a bar, a percentage or a total. A backlog grows because the user keeps adding
things to it, so measuring it against a lifetime of completions says nothing useful. The screen is
therefore laid out as two stacked sections with their own headline figures, separated by a rule.

## 2. How things are counted

`completedOn` is a list of completion dates, and an item marked for redo is both something already done
and something still to do. That gives one rule per side:

| An item that is… | Completions | Still to do |
| --- | --- | --- |
| Completed once | +1 | 0 |
| Completed three times | +3 | 0 |
| Completed twice, marked to redo | +2 | +1 |
| Active, upcoming or never started | 0 | +1 |

- **Completions counts dates**, one per entry in `completedOn`, whatever the item's status.
- **Still to do counts items**, one per item whose status is not `COMPLETE`.
- The two sides therefore do not add up to the number of items in the category, and are not meant to.
  A redo item is on both sides at once.

## 3. Entry point and navigation

The media items list header gains a second action beside the add button:

- `MediaItemsListScreenComponent` passes a `PillButtonComponent` (`tone='secondary'`,
  `appearance='subtle'`) into the `actions` of `AuthenticatedPageHeaderComponent`, before
  `ResponsiveHeaderAddButtonComponent`.
- On mobile it shows the same short label; there is no icon-only variant.

Navigation is direct, not saga-driven — there is no state to load before the screen opens, and the
category is already in `categoryGlobal`. The container calls
`navigationService.navigate(AppScreens.MediaItemsStats)`, the same way the settings screen opens the
credits screen. Do **not** add a `navigation.ts` saga entry for it.

| Thing | Value |
| --- | --- |
| Screen id | `AppScreens.MediaItemsStats` |
| Path | `/media/items/stats` |
| Navigator | `MediaNavigator` |
| Required context | `categoryGlobal.selectedCategory` — add it to `screenRequiredContext` |

Leaving the screen is `navigationService.back()` from the container, as on the group, platform and
season screens. The screen is **not** wrapped in `MediaItemUnsavedChangesGuardContainer`: it opens no
form and holds no draft.

## 4. Screen anatomy

Top to bottom. The whole screen is one column; nothing is side by side.

### 4.1 Header

`AuthenticatedPageHeaderComponent`, as everywhere else in the authenticated shell.

- **Title**: the category name plus the screen's own word, e.g. *Movies progress*.
- **Subtitle**: the number of items tracked in the category, unfiltered, e.g. *128 movies tracked*.
- **Action**: a back link to the list.

The subtitle is the only place the plain item count appears, and it deliberately ignores the filters —
it is context for the screen, not one of its figures.

### 4.2 Filters

A single row above the content, in the shape of the media items list toolbar: a bordered pill-shaped
strip with the label *Filters* and two `SelectComponent` controls.

| Filter | Options |
| --- | --- |
| Group | *With or without group* (default), *Only without group*, then each of the user's groups |
| Owned platform | *Owned or not* (default), *Only not owned*, then each of the user's platforms |

Reuse the option text already in the bundle: `mediaItem.list.filter.values.group.*` and
`mediaItem.list.filter.values.ownPlatform.*`, including `unknown` and `deleted` for an id with no
matching entity.

**There is no importance filter and no status filter.**

- Importance is an axis of the panel in [§4.7](#47-the-backlog-by-importance-and-platform); filtering by
  it would leave that panel showing a single box.
- Filtering to *completed only* or *current only* would empty one half of the screen outright. Status is
  shown as a result in [§4.6](#46-the-backlog-by-status) instead.

Behaviour:

- Both filters default to "everything" and the strip shows **nothing else** in that state — no summary,
  no clear action.
- As soon as either filter is set, a **Clear** action and a summary appear at the right of the strip,
  reading *29 of 128 movies*. Clear resets both.
- Changing a filter marks the slice `REQUIRES_FETCH` and refetches. Both halves of the screen recompute;
  the header subtitle does not.
- The groups and platforms lists load the same way the media items filter modal loads them
  ([front end §10.2](../../front-end/docs/technical/10-features.md#102-media-items-list)): fetched only
  when their status is `REQUIRES_FETCH` or `FETCH_FAILED`, never blocking, with a small spinner beside
  the control while in flight and the generic options usable throughout. A failure raises the usual
  error toast and leaves the generic options working.

### 4.3 The *Completed* section header

Not a card — a section rule that opens the first half.

- Label: **COMPLETED**, in the small uppercase style.
- Figure: total completions, in the completions colour, followed by the media type's word for them
  (*viewings*, *readings*, *playthroughs*) and *, all time*.
- Right side, muted: the number of **distinct** items that have been completed at least once, and the
  number of **repeats** (total completions minus distinct items). Example:
  *77 distinct movies · 14 repeats*.

The repeats figure is what makes the headline number honest: it says how much of it is the same things
done again.

### 4.4 *Watched per year*

One card, one bar chart.

- **One bar per year**, from the earliest year with a completion to the current year inclusive.
  **Years with nothing get a bar of zero**, not a gap in the sequence — a dry year is a fact worth
  seeing.
- Every non-zero bar carries its value above it. The tallest bar's label is brighter than the rest.
- Hovering a bar dims the others and shows a tooltip with the year and the count.
- Card head, right side: **the yearly average**, one decimal, e.g. *15.2 a year on average*. It is total
  completions divided by the number of years shown, so the current, partial year counts as a whole one.
  Hidden when there are no completions.
- Card title uses the media type's own verb: *Watched per year*, *Read per year*, *Finished per year*.

**Empty state**: no completions at all → the card shows *Nothing completed yet* in place of the chart,
and the average is hidden.

### 4.5 The *Still to do* section header

Same shape as [§4.3](#43-the-completed-section-header), opening the second half.

- Label: **STILL TO DO**.
- Figure: the backlog count in the backlog colour, followed by the item noun (*movies*, singular when 1).
- Nothing on the right.

### 4.6 *The backlog, by status*

One card: a donut on the left, a key on the right, wrapping to a column when narrow.

- The donut divides the backlog by status, with the total in the centre under the media type's phrase
  for it (*to watch*, *to read*, *to play*).
- **Segment order is fixed**: *Not started*, then the active one (*Watching*, *Reading*, *Playing*),
  then *Upcoming*, then the redo one (*To rewatch*, *To reread*, *To replay*). This is not arbitrary —
  see [§5](#5-colour).
- A status with a count of zero is dropped from both the donut and the key.
- The key lists, per row: swatch, label, count, and the share of the backlog as a whole percentage.
- There is **no** control to switch the donut to another dimension.

**Empty state**: nothing left → *Nothing left. Everything here is done.*

### 4.7 *The backlog, by importance and platform*

One card holding **four boxes, one per importance level**, in the app's own order: *Very important*,
*Important*, *Fairly important*, *Unimportant*.

- The boxes are laid out **two by two, or one per row when the card is narrow — never three in one row
  and one in the next**. Use a container query on the card (`container-type: inline-size`), so the
  layout follows the card's width rather than the viewport's.
- Each box shows the level's name and its total, the total in the backlog colour.
- Inside, one row per platform holding something at that level: the platform name, a bar, and the count.
  *Not owned* is a row like any other, last.
- **A platform with nothing left at that level is not listed**, and a platform with nothing left anywhere
  disappears from the panel entirely.
- **All bars across all four boxes share one scale** — the largest single count anywhere in the panel.
  This is what makes the boxes comparable to each other instead of four unrelated charts.
- A box whose level is empty shows *Nothing left here.* and its total is muted rather than coloured.

**Empty state**: nothing left in the backlog at all → *Nothing left to place.*

## 5. Colour

Only three colour decisions, all of them reusing the tokens already in `app/web/styles.css`.

| Role | Token | Value |
| --- | --- | --- |
| Completions — the year bars, the *Completed* figure | `--color-media-item-status-complete` | `#e75fe7` |
| The backlog — its figure, the box totals, the bars in the boxes | `--color-media-item-status-active` | `#74eb74` |
| The donut segments | the four status tokens | see below |

The donut is the only place several colours sit next to each other, and its order is load-bearing:

| Position | Status | Token |
| --- | --- | --- |
| 1 | Not started | `--color-media-item-status-new` used as a solid `#8b9ab6` |
| 2 | Watching / Reading / Playing | `--color-media-item-status-active` `#74eb74` |
| 3 | Upcoming | `--color-media-item-status-upcoming` `#ee9b52` |
| 4 | To rewatch / reread / replay | `--color-media-item-status-redo` `#4bead7` |

**Do not reorder these.** The active green and the redo teal are indistinguishable when adjacent — they
separate by a perceptual distance of 12 where 15 is the floor for normal colour vision, let alone
colour-blind vision. Putting the neutral and the orange between them is what makes the ring readable.
The green–orange pair that remains is weaker under deuteranopia than we would like, which is why every
segment is also named and counted in the key, and why the segments carry a 4px gap between them.

The category colour is used nowhere on this screen. It identifies a category in a list of categories;
here there is only one category, and spending a colour on it would compete with the two that carry
meaning.

## 6. States

| State | What shows |
| --- | --- |
| Loading | `LoadingIndicatorComponent` with `fullScreen={false}`, as on the media items list screen |
| Fetch failed | The usual error toast, plus a retry card in the body, mirroring the list's fetch-error card ([front end §10.2](../../front-end/docs/technical/10-features.md#102-media-items-list)) |
| Empty category | Both halves show their own empty copy; the screen is still reachable and the filters still render |
| Filter matches nothing | The summary reads *0 of 128 movies* and both halves show their empty copy |

## 7. Text

Every string goes in `app/resources/lang/lang-en.json` under a new `mediaItem.stats` branch. The ones
that differ per media type follow the existing convention of a key per `mediaType`, as
`mediaItem.list.countByType.*` already does.

```
mediaItem.stats.title                       "{{category}} progress"
mediaItem.stats.subtitle.<mediaType>        "{{count}} movies tracked"
mediaItem.stats.back                        "Back to list"
mediaItem.stats.filters.label               "Filters"
mediaItem.stats.filters.summary             "{{shown}} of {{total}} {{items}}"
mediaItem.stats.completed.label             "Completed"
mediaItem.stats.completed.unit.<mediaType>  "viewings, all time"
mediaItem.stats.completed.distinct          "{{count}} distinct {{items}}"
mediaItem.stats.completed.repeats           "{{count}} repeats"
mediaItem.stats.perYear.<mediaType>         "Watched per year"
mediaItem.stats.perYear.average             "{{value}} a year on average"
mediaItem.stats.perYear.empty               "Nothing completed yet"
mediaItem.stats.todo.label                  "Still to do"
mediaItem.stats.todo.centre.<mediaType>     "to watch"
mediaItem.stats.byStatus.title              "The backlog, by status"
mediaItem.stats.byStatus.empty              "Nothing left. Everything here is done."
mediaItem.stats.byPlatform.title            "The backlog, by importance and platform"
mediaItem.stats.byPlatform.empty            "Nothing left to place."
mediaItem.stats.byPlatform.emptyLevel       "Nothing left here."
mediaItem.stats.byPlatform.noOwnPlatform    "Not owned"
```

Status labels reuse `mediaItem.list.status.*` where they exist and follow the same per-media-type shape
where they do not. Importance labels reuse `mediaItem.common.importance.*` unchanged. Filter option text
reuses `mediaItem.list.filter.values.*` unchanged.

## 8. Front-end wiring

### 8.1 State

One new slice, `mediaItemsStats`, in `app/redux/state/state.ts`:

```ts
type MediaItemsStatsState = {
	stats?: MediaItemsStatsInternal;
	filter: MediaItemsStatsFilterInternal;   // groups + ownPlatforms, same shape as the list filter
	status: 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'FETCH_FAILED';
};
```

- Persistence follows the list slices: **the data persists, the status resets to `REQUIRES_FETCH`**
  ([front end §6.3](../../front-end/docs/technical/06-redux.md#63-the-persistence-contract)). A reload
  behaves like a real refresh.
- `SELECT_CATEGORY` resets the whole slice, filter included — the same action that already resets the
  media items list state.
- Setting a filter writes it and marks the slice `REQUIRES_FETCH`.

### 8.2 Saga and controller

The usual async shape ([front end §6.4](../../front-end/docs/technical/06-redux.md#64-error-handling-and-the-async-pattern)):
`START_FETCHING_MEDIA_ITEMS_STATS` → controller call → `COMPLETE_FETCHING_MEDIA_ITEMS_STATS` or
`FAIL_FETCHING_MEDIA_ITEMS_STATS`. The screen requests a fetch on mount and on update while the status
is `REQUIRES_FETCH`, exactly like the list screens.

The call belongs on the existing media-item controller interface, so it goes through the media-type
factories in `app/controllers/main/entities/media-items/factories.ts` like every other media-item call —
no `switch` on media type anywhere else
([front end §9.5](../../front-end/docs/technical/09-data-layer.md#95-media-type-factories)). Both a real
and a mock implementation are needed; the mock can compute the aggregates over its in-memory items.

### 8.3 Components

- `app/components/containers/media-item/stats/screen.ts`
- `app/components/presentational/media-item/stats/screen/index.tsx` — header, filters, the two sections
- `.../stats/year-chart/index.tsx` — the bar chart and its tooltip
- `.../stats/status-donut/index.tsx` — the donut and its key
- `.../stats/importance-boxes/index.tsx` — the four boxes

All of them stay **generic**: no book-, movie-, TV-show- or videogame-specific logic. The per-media-type
wording comes from the i18n keys in [§7](#7-text), keyed by `category.mediaType`, exactly as the list
screen's count label already does
([front end §8.5](../../front-end/docs/technical/08-domain-model.md#85-generic-media-item)).

Styling goes in `app/web/styles.css` with the semantic tokens, and every hover effect goes inside a
`@media (hover: hover)` block
([front end §12.5](../../front-end/docs/technical/12-styling.md#125-hover-effects-are-gated-on-a-hovering-pointer)).

### 8.4 Tests

A smoke test for the screen, and unit tests for the two pieces of real logic: filling the year range
including zero years, and the shared bar scale across the four boxes.

## 9. Back-end aggregate

One new endpoint, following the media-item route shape, with `<type>` one of `books`, `movies`,
`tv-shows`, `videogames`:

```
POST /users/:userId/categories/:categoryId/<type>/stats
```

It is a read with a filter body, so it is a `POST` like `filter` and `search`.

**Request** — `GetMediaItemsStatsRequest extends CommonRequest`. Reuse the existing group and own
platform filter blocks from `FilterMediaItemsRequest` unchanged, so the two screens mean the same thing
by the same words:

```jsonc
{
  "filter": {
    "groups":       { "anyGroup": true, "noGroup": false, "groupIds": ["..."] },
    "ownPlatforms": { "anyOwnPlatform": true, "noOwnPlatform": false, "ownPlatformIds": ["..."] }
  }
}
```

**Response** — `GetMediaItemsStatsResponse extends CommonResponse`:

```jsonc
{
  "message": "Stats successfully retrieved",
  "completions": {
    "total": 91,             // sum of completedOn lengths across the filtered items
    "mediaItems": 77,        // items with at least one completion date
    "byYear": [              // only years that have something; the front end fills the gaps
      { "year": 2021, "count": 1 },
      { "year": 2022, "count": 11 }
    ]
  },
  "backlog": {
    "total": 53,             // items whose status is not COMPLETE
    "byStatus": [
      { "status": "NEW", "count": 37 },
      { "status": "ACTIVE", "count": 6 },
      { "status": "UPCOMING", "count": 8 },
      { "status": "REDO", "count": 2 }
    ],
    "byImportanceAndOwnPlatform": [
      { "importance": "400", "ownPlatformId": "6c2f…", "count": 2 },
      { "importance": "400", "ownPlatformId": null,    "count": 1 }
    ]
  }
}
```

- `byYear` omits empty years to keep the payload small; the front end knows the current year and fills
  the range, as [§4.4](#44-watched-per-year) requires.
- `byImportanceAndOwnPlatform` omits combinations with a count of zero. `ownPlatformId: null` is the
  *not owned* bucket. The front end resolves ids to names from the own platforms list it already loads
  for the filter, and falls back to the existing `unknown` and `deleted` labels.
- No pagination block: the response is bounded by the number of years, four statuses, and four
  importance levels times the user's platforms.

### 9.1 The one piece of logic that has to be duplicated

`byStatus` is the only awkward part of this endpoint. **The four status labels do not exist on the back
end** — the front end derives them in `MediaItemMapper.buildStatusLabel`, from persisted fields, in this
precedence:

1. `completedOn` is non-empty and `markedAsRedo` is falsy → `COMPLETE`
2. `active` → `ACTIVE`
3. `completedOn` is non-empty and `markedAsRedo` → `REDO`
4. `releaseDate` is in the future → `UPCOMING`
5. otherwise → `NEW`

The back end must apply the same precedence to bucket the backlog, which means the rule lives in two
places. It is worth it: the alternative is shipping enough per-item data to bucket on the client, which
defeats the point of an aggregate. Two consequences to accept:

- **The rule above is the contract.** Changing it on one side without the other silently makes this
  screen disagree with the list rows.
- **`UPCOMING` is evaluated against the server's clock here** and against the browser's in the list. An
  item releasing today can be counted differently by the two, which is harmless and not worth solving.

The `COMPLETE` case never appears in `byStatus`: items in that state are the ones the backlog excludes.

## 10. Implementation order

Two changes under two sets of rules — the back end first, so the front end has something to call.

**Back end**

1. The request and response API models, with their `class-validator` decorators
2. The status bucketing rule from [§9.1](#91-the-one-piece-of-logic-that-has-to-be-duplicated), in one
   place, unit tested against all five branches
3. The aggregate query in the persistence layer
4. The controller and the route
5. Tests, and its own `docs/technical/` §10 API surface entry

**Front end**

1. The internal models and the mapper
2. The controller interface, the real implementation, the mock implementation, the factory entry
3. The slice, the actions and the fetch saga
4. `screens.ts`, `navigation-routes.ts`, `MediaNavigator`, `screenRequiredContext`
5. The i18n keys
6. The container and the five presentational components, plus the styles
7. The button on the media items list header
8. Tests, and its own `docs/technical/` updates — §5 route map, §6 slices, §9 endpoints, §10 features
