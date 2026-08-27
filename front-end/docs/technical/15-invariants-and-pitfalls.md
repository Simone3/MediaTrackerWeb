# §15 — Invariants and pitfalls

*[Index](README.md) · [← §14 Testing](14-testing.md)*

The things that look like bugs and are not, and the ones that will bite a change made without reading them.

---

## 15.1 Category context is required for most media flows

Many media-item containers and sagas **throw** when `categoryGlobal.selectedCategory` is missing ([§11.1](11-interface.md#111-containers)).

That context is set by `SELECT_CATEGORY` ([§10.1](10-features.md#101-categories)) and restored by persistence ([§6.3](06-redux.md#63-the-persistence-contract)). If media screens fail after a reload or after a navigation change, check that the selected category is still being established — the missing value is the cause, not a symptom.

It is also why opening a `/details` route directly, in a fresh tab, does not work: the route names a screen, not an entity ([§5.1](05-navigation.md#51-route-map)).

## 15.2 Group/platform selections are global transient state

`groupGlobal.selectedGroup` and `ownPlatformGlobal.selectedOwnPlatform` are **not route params**. They are temporary cross-screen selections that the picker screen writes and the active media-item form reads back ([§10.5](10-features.md#105-groups)).

Treating them as durable entity state, or trying to move them into the URL, breaks the picker round trip.

## 15.3 Dirty-form protection is browser-oriented

`BrowserBackNavigationGuardComponent` intercepts:

- browser back
- same-origin anchor navigation
- page unload

**That is its whole scope.** It is not a general app-navigation rule engine, and it does not make `navigationService.setParam()` useful ([§5.3](05-navigation.md#53-navigationservice)). Saga-driven navigation goes around it, which is a known gap rather than a design.

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

The trace path that answers most of these: action generator → action constant/type → saga watcher/worker → reducer → container → presentational component.

---

[← §14 Testing](14-testing.md) · [§16 Extension playbooks →](16-extension-playbooks.md)
