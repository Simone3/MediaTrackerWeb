# §10 — Features

*[Index](README.md) · [← §9 Data layer](09-data-layer.md)*

Each user-facing area, its entry files, and the behaviour that is not obvious from reading them.

---

## 10.1 Categories

The home screen is `CategoriesListScreenComponent`, titled *Media Tracker*, with the settings shortcut in the header.

- fetches whenever `categoriesList.status === 'REQUIRES_FETCH'`
- selecting a category dispatches `SELECT_CATEGORY`

**`SELECT_CATEGORY` does two things, and the second one is easy to miss.** It stores `categoryGlobal.selectedCategory`, *and* it resets the media-item list state with the right default filter and sort for that category's media type ([§9.6](09-data-layer.md#96-media-definitions-controllers)). The navigation saga then pushes to the media items list.

Category details still use the older custom header/form shell rather than `EntityDetailsFrameComponent`. It is Formik-driven, and the same-name confirmation opens when the saga sets `saveStatus` to `REQUIRES_CONFIRMATION` ([§6.4](06-redux.md#64-error-handling-and-the-async-pattern)).

## 10.2 Media items list

Entry files:

- `app/components/containers/media-item/list/screen.tsx`
- `app/components/containers/media-item/list/list.tsx`
- `app/redux/reducers/media-item/list.ts`
- `app/redux/sagas/media-item/fetch.ts`

**Four modes**: `NORMAL`, `SEARCH`, `SET_FILTERS`, `VIEW_GROUP`.

- fetches on mount and update while the status is `REQUIRES_FETCH`
- the search form is always visible in the header area
- a non-empty search term opens search mode if needed and dispatches `SEARCH_MEDIA_ITEMS`, which the fetch saga also watches
- opening filters switches the mode to `SET_FILTERS`
- "view group" in the context menu switches the mode to `VIEW_GROUP`
- leaving search or view-group mode resets to `NORMAL` **and marks the list for refetch**, because the previous mode's results are not the normal list

### Pagination

The list shows one page at a time, `config.ui.mediaItemsPageSize` items long ([§4.4](04-configuration.md#44-what-else-config-owns)). `currentPage` and `totalCount` live in the list slice, the fetch saga turns the page index into the `offset`/`limit` the filter and search endpoints take, and `PaginationComponent` renders a step either way around a picker that jumps to any page ([§11.3](11-interface.md#113-shared-building-blocks)). The header count is `totalCount`, not the size of the loaded page.

**Classic pages rather than infinite scroll, because of what happens after a write.** Deleting or inline-updating an item marks the list for refetch, and the visible window has to be re-materialized from the server. With one bounded page that is a single request for the page the user is on; with an accumulated infinite-scroll window it would be either an unbounded reload, a reset that throws the user back to the top, or client-side filter logic deciding whether the changed row still belongs. Paging makes the question go away.

Which actions move the user and which do not follows from that:

- **the query changed** — submitting or clearing filters, submitting a search, leaving search or view-group mode — starts again from the first page, since the old page index means nothing against a new query
- **the data changed** — saving, deleting, inline-updating — reloads **the current page**, so a write does not cost the user their place
- **the current page can stop existing**, e.g. when the last item on it is deleted. The reducer notices the fetched page is past the end, falls back to the last page that does exist and marks the list for reload; when nothing matches at all it settles on the first page without a second request

A failed page fetch keeps the last known rows on screen and renders a retry card under them, on top of the usual error toast: the toast names the cause and disappears, the card is the way back ([§6.4](06-redux.md#64-error-handling-and-the-async-pattern)).

Changing page scrolls back to the top, from the list component itself: `ScrollToTopOnNewScreen` does not cover it, since moving between pages is not a navigation ([§5.5](05-navigation.md#55-scroll-position)).

### Filters

The modal is `MediaItemFilterModalComponent` over the Formik `filter-form` `wrapper`/`view`/`data` trio, one set per media type.

Status, importance and sort offer a fixed set of options. **Group and own platform also list the user's actual groups and platforms**, under the generic "with or without", "only with" and "only without". A specific choice maps to the `groupIds`/`ownPlatformIds` that the filter endpoint already accepted, and a specific ID wins over the generic flags on both sides of the wire.

**Those options load when the modal opens, and the load never blocks it.** The two slices are fetched only when their status is `REQUIRES_FETCH` or `FETCH_FAILED` — so a failure retries on the next open, which is the only retry the user can ask for here — and while a request is in flight the inputs stay usable with their generic options, under a small spinner next to the label rather than an overlay over the form. A failure raises the usual error toast and leaves the generic options working.

**The filter carries the display names of what it selects**, in `groupNames`/`ownPlatformNames` beside the IDs. They are a display aid and never reach the back end: the modal fills them in on submit from the loaded lists, and persistence keeps them, so a reload can label a selected group before — or without — the groups list coming back. Three cases leave a selected ID with no matching option, and all three keep the selection rather than silently dropping it:

| Case | What its option reads |
| --- | --- |
| the list has not come back yet, or its fetch failed | the carried name |
| the list came back without the ID, i.e. the entity was deleted | the carried name, marked as deleted |
| there is no carried name, e.g. a filter stored before they existed | the bare ID |

**Clear resets rather than empties.** The third action of the form dispatches `CLEAR_MEDIA_ITEMS_FILTERS` with the current category and closes the modal, and the reducer puts back the filter and the sort options that `getDefaultFilter()`/`getDefaultSortBy()` give the category — the same values `SELECT_CATEGORY` starts the list with, which today is "current items only" for every media type, not "everything". The defaults are derived in the reducer, where they already are for `SELECT_CATEGORY`, so the form never has to know them; that also keeps the reset outside Formik, since the modal is closing anyway and the form values are rebuilt from the new filter on the next open.

**A specific group in the filter is deliberately not `VIEW_GROUP` mode.** Both end up querying `groupIds`, but view-group is its own mode with its own sort from the definitions controller, while the filter stays in `NORMAL` with whatever sort the user chose.

The form mappers are what keep this stable while the options arrive, and they have to stay pure ([§15.10](15-invariants-and-pitfalls.md#1510-computed-formik-initialvalues-must-not-read-anything-else)).

The context menu is `ResponsiveActionMenuComponent`: a floating popover on desktop, a bottom sheet on mobile ([§11.3](11-interface.md#113-shared-building-blocks)).

**Inline status actions** — `MARK_MEDIA_ITEM_AS_ACTIVE`, `MARK_MEDIA_ITEM_AS_COMPLETE`, `MARK_MEDIA_ITEM_AS_REDO` — apply the rules in `inline-update-helper.ts`:

| Action | Effect |
| --- | --- |
| active | `status: ACTIVE`, `active: true` |
| complete | append the completion date, clear `active`, clear `markedAsRedo`, `status: COMPLETE` |
| redo | `active: false`, `markedAsRedo: true`, `status: REDO` |

Completion appends rather than replaces: `completedOn` is the full history of completions, which is what makes a re-read or a re-watch expressible ([§8.5](08-domain-model.md#85-generic-media-item)).

## 10.3 Media item details

Entry files:

- `app/components/containers/media-item/details/screen.ts`
- `app/components/containers/media-item/details/unsaved-changes-guard.tsx`
- `app/components/presentational/media-item/details/form/wrapper/media-item.tsx`
- subtype wrappers in `.../form/wrapper/*`
- subtype views in `.../form/view/*`
- subtype validation and normalization in `.../form/data/*`

**The screen is only a switcher.** The current media type picks the subtype form; each subtype wrapper plugs its validation, normalization and default-catalog behaviour into the shared `CommonMediaItemFormComponent`. That is the structure that keeps the generic form free of subtype knowledge ([§8.5](08-domain-model.md#85-generic-media-item)).

Shared form behaviour:

- Formik with `enableReinitialize`
- duplicate-name confirmation
- catalog-reload confirmation
- a loading overlay while save, catalog, group or platform requests are in flight
- draft persistence on every value change
- group and platform selections merged back in from the global Redux slices
- optional catalog details merged into the current Formik values

**Drafts.** Unsaved values live in `mediaItemDetails.formDraft`. While the form is dirty, browser back and same-origin anchor navigation are blocked by `BrowserBackNavigationGuardComponent`; confirming the exit clears the draft. The same guard stays mounted on the group, own platform and TV show season screens the form opens, since the draft can be lost from there too ([§15.3](15-invariants-and-pitfalls.md#153-dirty-form-protection-is-browser-oriented)).

**Catalog.** The name field can search the external catalog, and choosing a result loads full details. Catalog payloads carry a transport-only `catalogLoadId`; **the shared wrapper strips it before the values reach Formik**, so it never becomes a form field and never gets saved.

Subtype fields follow [§8.6](08-domain-model.md#86-media-type-specific-fields). The external action buttons are media-specific: Google and Wikipedia everywhere, JustWatch on TV shows, HowLongToBeat on videogames — all built from the URL builders in config ([§4.4](04-configuration.md#44-what-else-config-owns)).

## 10.4 TV show seasons: the nested flow

**This is the most special-case workflow in the app.**

The TV show form dispatches `START_TV_SHOW_SEASONS_HANDLING(currentSeasons || [])` and the navigation saga opens the seasons list. From there:

- `tvShowSeasonsList.tvShowSeasons` holds the working list
- `tvShowSeasonDetails` holds the season being edited
- add, edit, delete and complete all operate on that local list, and the screen is built on `EntityManagementScreenComponent` and `EntityManagementListComponent` like groups and platforms

**No back-end controller for seasons exists.** Nothing is persisted until the parent TV show is saved.

Coming back is timestamp-driven:

1. the seasons screen dispatches `COMPLETE_TV_SHOW_SEASONS_HANDLING()`
2. the reducer stores a fresh `completeHandlingTimestamp`
3. the navigation saga goes back to the TV show form
4. `TvShowFormComponent` notices the timestamp changed
5. Formik values are updated with the latest seasons list
6. the seasons reach the back end only when the media item itself is saved

The timestamp exists because the seasons list can come back *identical* to what was sent — a user who opens seasons and changes nothing still has to be distinguished from one who never opened them. Comparing the arrays would not tell those apart.

On a catalog reload, `preserveTvShowSeasonProgress()` keeps `watchedEpisodesNumber`, so refreshing a show's metadata does not wipe how much of it the user has watched.

## 10.5 Groups

Groups are category-scoped and serve two purposes: collecting a franchise, and being a selection target from the media-item form.

- built on `EntityManagementScreenComponent` and `EntityManagementListComponent`
- a "None" option clears the current selection
- a `EntitySearchBarComponent` above the list filters the loaded groups by name, client-side. It appears only once there is something to filter, the header count follows the filtered list, and while a search is running the "None" option and the empty-state copy give way to the no-results copy. **Seasons deliberately have no search bar**: a show's seasons are few and already ordered
- selecting a group dispatches `SELECT_GROUP`, and the navigation saga goes back to the media-item form
- add stays in the header, while edit and delete live in the row action menu ([§11.3](11-interface.md#113-shared-building-blocks))
- the media-item form's order-in-group field is a `number` input stepping by `0.1`, bounded by the same one-decimal rule the schema validates ([§8.3](08-domain-model.md#83-group)). An out-of-range order disables Save and says why, once the field has been left ([§11.6](11-interface.md#116-form-validation-feedback))

**One screen is both the manager and the picker.** That is why arriving here from a form and arriving here from the menu look the same.

## 10.6 Own platforms

Own platforms mirror the group workflow and add a color and an icon.

- the same client-side search bar as groups sits above the list
- icons are centralized in `app/components/presentational/own-platform/common/icon-registry.ts`
- badges are rendered with CSS mask styles built by `buildOwnPlatformMaskStyle(...)`, which is what lets one icon asset take the platform's color

Selection works exactly as groups do: the form requests it, the screen opens, the user picks a platform or "None", and `SELECT_OWN_PLATFORM` sends them back.

## 10.7 Settings and credits

Settings holds logout and the credits link. Logout opens a confirmation dialog and dispatches `LOG_USER_OUT`; the root reducer resets the whole store on completion ([§7.4](07-authentication.md#74-logging-out)).

Credits is static and links to TMDb, IGDB and Google Books.

## 10.8 The current screen set

auth loading · login · signup · categories list · category details · media items list · media item details · media items stats · TV show seasons list · TV show season details · groups list · group details · own platforms list · own platform details · settings · credits

## 10.9 Media items stats

Entry files:

- `app/components/containers/media-item/stats/screen.tsx`
- `app/components/containers/media-item/stats/filters.tsx`
- `app/components/presentational/media-item/stats/screen/index.tsx`
- `app/components/presentational/media-item/stats/data/media-item.ts`
- `app/redux/reducers/media-item/stats.ts`
- `app/redux/sagas/media-item/fetch-stats.ts`

One category, two questions that are **deliberately never compared to each other**:

| Half | Question | Unit |
| --- | --- | --- |
| Completed | how much have I finished, and when? | completions |
| Still to do | what is left, and where is it? | media items |

They share no bar, no percentage and no total, and the screen is laid out as two stacked sections with their own headline figures. A backlog grows because the user keeps adding to it, so measuring it against a lifetime of completions would say nothing — and an item completed twice and marked for redo is on both sides at once, which is exactly why the two do not add up to the size of the category.

The whole aggregate is one `stats` call ([§9.4](09-data-layer.md#94-endpoint-patterns)), reached from the media items list header and left with `navigationService.back()` ([§5.4](05-navigation.md#54-saga-driven-navigation)). The slice fetches on mount and on update while its status is `REQUIRES_FETCH`, like the list screens.

**The two headers pay for the screen in words.** The category name is the first thing a narrow header truncates, so the way in is an icon and the way out is a phrase that shortens: the list header carries an `AuthenticatedPageHeaderIconButtonComponent` rather than a labelled pill, and the back action is a `ResponsiveHeaderButtonComponent` reading *Back to list* on a desktop and *Back* on a phone ([§11.3](11-interface.md#113-shared-building-blocks)).

### The filters

A single strip above the content, with a group select and an own platform select offering the same options as the media items list filter ([§10.2](#102-media-items-list)) — including the carried display names and the `unknown`/`deleted` fallbacks, since both screens share the option builders and the form-value conversions in `.../list/filter-form/data/media-item.ts`.

**There is no importance filter and no status filter**, and that is a design decision rather than an omission: importance and status are the two axes the backlog is broken down along, so filtering by either would reduce its own panel to a single value, and filtering to "completed only" would empty one half of the screen outright.

The strip shows **nothing else while both filters target everything** — no clear action, no summary. As soon as either is set, a Clear action and a `29 of 128 movies` summary appear. Changing a filter marks the slice `REQUIRES_FETCH` and both halves recompute; the header subtitle does not, since it is context for the screen rather than one of its figures.

The groups and own platforms load exactly the way the filter modal loads them: only when their status is `REQUIRES_FETCH` or `FETCH_FAILED`, never blocking, with a small spinner beside the control while in flight.

On a phone the strip **stacks into a single column instead of wrapping**: wrapped, its second select starts where the label pushed the first one to and ends wherever its own longest option does, so two controls doing the same job sit at two widths and two left edges.

### The three charts

**Watched per year** is one bar per year from the first completion to the current one, **zeros included**: a year in which the user finished nothing is a fact about the history, and a gap in the sequence would silently redraw it as a shorter, busier one. The back end sends only the years that have something and the client fills the rest in `buildYearSeries`, so the payload stays proportional to the data rather than to the range. The card head carries the yearly average, which divides by the number of years shown and therefore counts the current, partial year as a whole one.

**The chart is drawn in a narrower coordinate space on a phone**, 360 units wide instead of 640, and the reason is the text. The SVG scales to the card, so the wide box on a 320px card renders every year and every value at about half the size it was written at; the narrow one lands near 1:1. Nothing else about the drawing changes, because the bar widths and the label thinning below are all expressed in the same units and follow the box on their own. It is the one piece of the screen that reads `useIsMobileLayout()` ([§11.4](11-interface.md#114-responsive-behaviour)) rather than leaving the difference to the stylesheet.

**A long history thins its own axis out.** Once the bars are too narrow to hold a year under them, only every *n*th year is written, counted back from the last one so that the year the chart ends at is always labelled and never lands on top of its neighbour; narrower still, only the tallest bar keeps its value. The hover tooltip names every year regardless, so nothing the chart was saying is lost.

**The backlog by status** is a donut with a key, which sits beside the ring when the card is wide and wraps under it — with the ring then centred on the line it has to itself — when it is not. **Its segment order is load-bearing and must not be changed**: the active green and the redo teal are indistinguishable when adjacent, so the neutral grey of *Not started* and the orange of *Upcoming* sit between them. The green–orange pair that remains is still weak under deuteranopia, which is why every segment is also named and counted in the key and why the segments carry a gap.

**The backlog by importance and platform** is four boxes, one per importance level, laid out **two by two or one per row, never three and one**. The layout is driven by a container query on the card rather than a viewport media query, so it follows the room the boxes actually have. **All the bars across all four boxes share one scale** — the largest single count anywhere in the panel — and that shared scale is the whole point: it is what makes the boxes comparable to each other instead of four unrelated charts. A platform with nothing left at a level is not listed, and the four levels are always all there, since dropping an empty one would say the level does not exist rather than that it is clear.

### Colour

Only three decisions, all reusing the status tokens ([§12.2](12-styling.md#122-semantic-custom-properties)): `--color-media-item-status-complete` for the completions, `--color-media-item-status-active` for the backlog, and the four status tokens for the donut. *Not started* takes `--color-media-item-status-new-solid` rather than the status token itself, which is a translucent white overlay that would let the card show through the ring.

**The category colour is used nowhere here.** It identifies a category in a list of categories; on this screen there is only one, and spending a colour on it would compete with the two that carry meaning.

### Where the numbers come from

Every figure is in the one response, `mediaItems`/`completions`/`backlog`, and none is derived from another slice. That includes the two counts the filter summary compares and the category size in the header subtitle: **the subtitle stays blank until the stats arrive** rather than borrowing the media items list's `totalCount`, which answers a different query and would visibly change under the user once the real figure landed.

---

[← §9 Data layer](09-data-layer.md) · [§11 Interface →](11-interface.md)
