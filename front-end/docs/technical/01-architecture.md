# §1 — Architecture

*[Index](README.md)*

What the web app is, the shape it inherited, and what happens between opening the page and seeing a screen.

---

## 1.1 What the application is

Media Tracker Web is a React + TypeScript single-page application that lets an authenticated user manage:

- categories
- media items inside a category
- groups inside a category
- own platforms inside a category
- TV show seasons inside a TV show form
- settings and credits

Supported media types are `BOOK`, `MOVIE`, `TV_SHOW` and `VIDEOGAME`. Every category has exactly one of them, and that choice decides which controllers, forms, list rows and catalog integrations apply underneath it.

It talks to the back end in `../back-end` over REST and to Firebase for authentication. Nothing is stored on the server about the browser session; what survives a reload is what the app itself puts in `sessionStorage` ([§6.3](06-redux.md#63-the-persistence-contract)).

## 1.2 It is a port, and it still reads like one

**This is the web port of an older React Native mobile app, and it is deliberately closer to that app than to a modern route-centric React SPA.** The original React Native code is in git history at commit `d06c1ed109c400087b408e28816a603adfb4d2f8`; when a behaviour looks odd and undocumented, that is where to check what it used to do.

What that inheritance means in practice:

- **Redux is the source of screen state**, not the URL. Most screens read the entity they are showing out of a global slice rather than out of a route parameter ([§6](06-redux.md)).
- **Sagas orchestrate async work and many navigation side effects.** A screen frequently opens because an action was dispatched, not because a component navigated ([§5.4](05-navigation.md#54-saga-driven-navigation)).
- **Many presentational components are class components** with `componentDidMount` / `componentDidUpdate` fetch triggers ([§11](11-interface.md)). The containers in front of them are function components that read Redux through hooks ([§11.1](11-interface.md#111-containers)).
- **Styling is one global stylesheet** with semantic custom properties, not per-component CSS modules ([§12](12-styling.md)).

Prefer parity with that architecture over modernization. A refactor that only makes the code look more current is not worth the churn; a refactor that removes a real duplication is.

## 1.3 The layers

```text
index.tsx                    browser entry point
  app/app.tsx                store creation, provider, global error handler, router
    app/components/containers/       Redux-connected shells
      app/components/presentational/ markup, forms, dialogs
    app/redux/                       actions, reducers, sagas, state, persistence
      app/controllers/               data access, chosen at runtime
        app/data/mappers/            internal <-> API conversion
        app/data/models/             API models and internal models
```

- **Containers** map state and dispatch to props and render very little themselves.
- **Presentational components** own markup, local dialog state, Formik forms and the fetch triggers.
- **Redux** owns everything a screen needs to render, plus the statuses that drive loading and error UI.
- **Controllers** are the only thing that talks to the network, and which implementation is live is a config decision ([§9.2](09-data-layer.md#92-runtime-controller-selection)).
- **Mappers** stand between the validated API models and the internal models the app actually works with, so the two can drift apart without either one breaking.

## 1.4 Boot flow

1. **`public/index.html`** paints the boot placeholder — the app background and a spinner, styled inline — before any script runs, and React clears it on its first commit ([§12.4](12-styling.md#124-the-boot-placeholder)).
2. **`index.tsx`** imports `reflect-metadata` (the `class-validator` decorators on the API models need it), imports `app/web/styles.css`, and renders `<App />` inside React strict mode.
3. **`app/app.tsx`** creates the Redux store once via `initializeRedux()`, wraps the tree in `Provider`, wraps everything in the global error handler, and renders the navigation container.
4. **`app/redux/initializer.ts`**
   - loads persisted Redux state from `sessionStorage`
   - creates the store with `configureStore`
   - attaches the saga middleware
   - **disables the Redux Toolkit serializable checks for both actions and state**
   - runs `rootSaga`
   - subscribes persistence to every store update
5. The navigator picks the auth-loading, unauthenticated or authenticated subtree from `userGlobal.status`, which starts as `REQUIRES_CHECK` ([§7](07-authentication.md)).

**The serializable checks are off on purpose.** Redux state holds `Date` objects and other non-plain values, and the repository chose to carry them rather than normalize them away. Persistence encodes and revives dates itself ([§6.3](06-redux.md#63-the-persistence-contract)). The consequence is that Redux Toolkit will not warn about a date or an object placed in state here, so nothing catches that mistake for you ([§15.6](15-invariants-and-pitfalls.md#156-redux-holds-dates-and-non-plain-values)).

---

[§2 Repository map →](02-repository-map.md)
