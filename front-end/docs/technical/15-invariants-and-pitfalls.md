# §15 — Invariants and pitfalls

*[Index](README.md) · [← §14 Testing](14-testing.md)*

The things that look like bugs and are not, and the ones that will bite a change made without reading them.

---

## 15.1 Category context is required for most media flows

Many media-item containers and sagas **throw** when `categoryGlobal.selectedCategory` is missing ([§11.1](11-interface.md#111-containers)).

That context is set by `SELECT_CATEGORY` ([§10.1](10-features.md#101-categories)) and restored by persistence ([§6.3](06-redux.md#63-the-persistence-contract)). If media screens fail after a reload or after a navigation change, check that the selected category is still being established — the missing value is the cause, not a symptom.

It is also why opening a `/details` route directly, in a fresh tab, does not work: the route names a screen, not an entity ([§5.1](05-navigation.md#51-route-map)). A fresh tab is what makes this visible — persistence is `sessionStorage` while the login is not, so the user arrives authenticated but without any of the context the screen needs ([§6.3](06-redux.md#63-the-persistence-contract)).

**The screens that need context are guarded** ([§5.6](05-navigation.md#56-screens-that-cannot-be-opened-cold)): the guard redirects to the categories list with an explanatory toast before the container can throw, and it covers the screens that used to degrade quietly — a details form falling back to a default entity, a picker fetching with no category — as well as the ones that threw. The screen error boundary ([§11.5](11-interface.md#115-the-screen-error-boundary)) stays behind it for anything that still manages to throw while rendering.

**Adding a screen means deciding what it needs.** A new route with no entry in `screenRequiredContext` is assumed to be openable cold.

## 15.2 Group/platform selections are global transient state

`groupGlobal.selectedGroup` and `ownPlatformGlobal.selectedOwnPlatform` are **not route params**. They are temporary cross-screen selections that the picker screen writes and the active media-item form reads back ([§10.5](10-features.md#105-groups)).

Treating them as durable entity state, or trying to move them into the URL, breaks the picker round trip.

## 15.3 Dirty-form protection is browser-oriented

`BrowserBackNavigationGuardComponent` intercepts:

- browser back, unless `interceptBrowserBack` is false
- same-origin anchor navigation
- page unload

**That is its whole scope.** It is not a general app-navigation rule engine, and it does not make `navigationService.setParam()` useful ([§5.3](05-navigation.md#53-navigationservice)). Saga-driven navigation goes around it, which is a known gap rather than a design.

### The guard follows the media item draft, not the media item screen

The media item form is not the only screen where its draft can be thrown away: the group, own platform and TV show season screens are opened *from* the form, and the header logo is right there on all of them. `MediaItemUnsavedChangesGuardContainer` is therefore mounted on every screen of that flow — the form itself in `containers/media-item/details/screen.ts`, the six screens it opens in `MediaNavigator` ([§5.2](05-navigation.md#52-router-composition)) — and reads `hasUnsavedMediaItemFormChanges()`, which is true while the form is dirty *and* the draft is still in `mediaItemDetails.formDraft`.

**The draft matters as much as the dirty flag.** `dirty` is only ever written by the mounted form, so it stays true after the user confirms an exit; the draft is what actually gets cleared on exit, save and reload. A guard condition built on `dirty` alone would keep firing on unrelated screens.

**The screens opened from the form pass `interceptBrowserBack={false}`.** Browser back from them returns to the form, which restores the draft — there is nothing to warn about, and pushing a duplicate history entry there would turn a safe back into a dialog.

What is still not covered: TV show season edits made in the seasons screens and abandoned from there. They live in `tvShowSeasonsList` and only reach the form on `COMPLETE_TV_SHOW_SEASONS_HANDLING` ([§10.4](10-features.md#104-tv-show-seasons-the-nested-flow)), so a media item that is not dirty yet has nothing for the guard to protect.

## 15.4 TV show seasons are local until the parent is saved

Changing seasons persists nothing by itself. The parent TV show must still be saved afterwards ([§10.4](10-features.md#104-tv-show-seasons-the-nested-flow)).

## 15.5 Persistence intentionally invalidates lists

Persisted list slices come back as `REQUIRES_FETCH` on purpose, so a browser refresh refetches ([§6.3](06-redux.md#63-the-persistence-contract)). Do not "optimize" them into coming back `FETCHED`.

## 15.6 Redux holds dates and non-plain values

The store carries `Date` objects, persistence encodes and revives them itself, and the Redux Toolkit serializable checks are off ([§6.5](06-redux.md#65-redux-holds-non-plain-values)). **Nothing will warn you** when a new date or object goes into state — check it yourself.

## 15.7 `strictNullChecks` is off

`tsconfig.json` has `strictNullChecks` disabled, and the codebase leans on runtime guards and inherited assumptions in a number of places.

New types and refactors that implicitly assume strict null safety will typecheck and then fail at runtime. Be explicit about the nullable cases rather than trusting the compiler here.

## 15.8 Mock behaviour is not production parity

Mocks help with UI work, but filtering and sorting are simplified, the seeded data is small, and some flows only approximate the back end ([§9.7](09-data-layer.md#97-mock-controllers)). A flow verified only against mocks is not verified.

## 15.9 Debugging checklist

When something looks wrong, in order:

1. Is the app on `dev` or `prod` config? ([§4](04-configuration.md))
2. Are mocks enabled for the entity being debugged? ([§9.2](09-data-layer.md#92-runtime-controller-selection))
3. Which action started the flow?
4. Does a saga move navigation after that action? ([§5.4](05-navigation.md#54-saga-driven-navigation))
5. Which reducer owns the status flag or selected entity you expected?
6. Did persistence restore stale context after a reload? ([§6.3](06-redux.md#63-the-persistence-contract))
7. Is the missing value actually global Redux state rather than a route param? ([§15.1](#151-category-context-is-required-for-most-media-flows))
8. If a media item is counted in one place and not another, do both sides still agree on how `status` is derived? ([§15.11](#1511-the-media-item-status-rule-lives-on-both-sides))

The trace path that answers most of these: action generator → action constant/type → saga watcher/worker → reducer → container → presentational component.

## 15.10 Computed Formik `initialValues` must not read anything else

The Formik forms in the app pass `enableReinitialize`, and they hand Formik a *computed* `initialValues` — a mapper called on every render, not a prop passed straight through. Formik deep-compares that value and resets the form whenever it changes, so the mapper's output is a form-resetting signal, not just a starting point.

That makes it a rule: **a mapper feeding `initialValues` may read its arguments and nothing else.** One that also reads asynchronously loaded state returns one thing before the data lands and another after, and Formik will wipe whatever the user typed in between, with the same inputs from beginning to end.

The concrete case is the media items filter, whose group and own platform options arrive after the modal is already open ([§10.2](10-features.md#102-media-items-list)). Its mapper emits the selected ID whether or not the matching entity is loaded, and resolving that ID to a display name is left to the view.

## 15.11 The media item status rule lives on both sides

`status` is derived, never stored: the front end computes it in `mediaItemUtils.buildStatusLabel`, and the back end applies the same five branches as a MongoDB expression inside the stats aggregation, because the alternative is shipping every media item to the client to bucket it there ([§8.5](08-domain-model.md#85-generic-media-item), [§10.9](10-features.md#109-media-items-stats)).

**Changing the precedence on one side alone fails silently**: nothing errors, the stats screen simply stops agreeing with the list rows about which items are still to do. Change both, or neither.

The two sides are pinned together by **the same table of cases, written out twice**: `tests/media-item-status-rule.test.ts` here runs it through the helper, and `test/integration/routes/media-items/status-rule-test.ts` in the back end seeds one media item per case and reads the bucket it lands in back off the stats API. Neither project can import the other, so the copies are kept identical by hand and each file's header says so. A precedence change on one side alone now fails a test naming the exact case, on both sides.

A smaller version of the same split is still accepted: `UPCOMING` is evaluated against the browser's clock in the list and against the server's in the stats, so an item releasing today can land on different sides of the line. That one is harmless and deliberately not solved — it is also why the back-end copy of the table builds its dates as offsets from the current instant, while the front-end copy pins them against a fixed one.

---

[← §14 Testing](14-testing.md) · [§16 Extension playbooks →](16-extension-playbooks.md)
