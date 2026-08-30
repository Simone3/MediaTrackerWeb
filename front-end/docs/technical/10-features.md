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

- `app/components/containers/media-item/list/screen.ts`
- `app/components/containers/media-item/list/list.ts`
- `app/redux/reducers/media-item/list.ts`
- `app/redux/sagas/media-item/fetch.ts`

**Four modes**: `NORMAL`, `SEARCH`, `SET_FILTERS`, `VIEW_GROUP`.

- fetches on mount and update while the status is `REQUIRES_FETCH`
- the search form is always visible in the header area
- a non-empty search term opens search mode if needed and dispatches `SEARCH_MEDIA_ITEMS`, which the fetch saga also watches
- opening filters switches the mode to `SET_FILTERS`
- "view group" in the context menu switches the mode to `VIEW_GROUP`
- leaving search or view-group mode resets to `NORMAL` **and marks the list for refetch**, because the previous mode's results are not the normal list

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
- `app/components/containers/media-item/details/unsaved-changes-guard.ts`
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

auth loading · login · signup · categories list · category details · media items list · media item details · TV show seasons list · TV show season details · groups list · group details · own platforms list · own platform details · settings · credits

---

[← §9 Data layer](09-data-layer.md) · [§11 Interface →](11-interface.md)
