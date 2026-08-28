# §2 — Repository map

*[Index](README.md) · [← §1 Architecture](01-architecture.md)*

Where everything lives. Generated folders — `node_modules/`, `coverage/`, build output — are ignored and not listed.

---

## 2.1 Root

| File | Purpose |
| --- | --- |
| `index.tsx` | The browser entry point: `reflect-metadata`, the global stylesheet, and `<App />` in strict mode |
| `package.json` | Scripts and exact dependency versions. `engines.node` is `>=20.9.0` |
| `webpack.config.js` | Bundling, the dev server, the `app` alias and the injected environment defines ([§3.3](03-build-and-run.md#33-webpack)) |
| `tsconfig.json` | TypeScript for the application. Note that `strictNullChecks` is off ([§15.7](15-invariants-and-pitfalls.md#157-strictnullchecks-is-off)) |
| `tsconfig.webpack.json` | The separate TypeScript config the webpack config itself is checked against |
| `babel.config.js` | The Babel setup `babel-jest` uses to transform TS/TSX in tests |
| `jest.config.js` | Test environment, roots and the CSS/image mocks ([§14.2](14-testing.md#142-jest)) |
| `eslint.config.js` | The flat ESLint config used by `npm run lint` ([§14.3](14-testing.md#143-eslint)) |
| `CLAUDE.md` | The rules and commands for Claude Code. Keep it aligned with these pages |
| `README.md` | The short landing page for this sub-project; the detail is here |
| `public/index.html` | The HTML template webpack serves and builds against |

## 2.2 `app/components` — the UI

| Path | Purpose |
| --- | --- |
| `containers/auth/*` | Login, signup and the auth-loading shell |
| `containers/navigation/*` | The router composition: the browser router, the authentication switch, and the media and settings navigators ([§5.2](05-navigation.md#52-router-composition)) |
| `containers/category/*` | Categories list and category details |
| `containers/media-item/*` | Media items list and media item details, the largest feature area |
| `containers/tv-show-season/*` | The nested seasons list and season details ([§10.4](10-features.md#104-tv-show-seasons-the-nested-flow)) |
| `containers/group/*` | Groups list and group details |
| `containers/own-platform/*` | Own platforms list and own platform details |
| `containers/settings/*`, `containers/credits/*` | Settings and the static credits screen |
| `containers/generic/*` | Cross-cutting containers, including the global error handler |
| `presentational/generic/*` | The shared building blocks every feature should reach for first ([§11.3](11-interface.md#113-shared-building-blocks)) |
| `presentational/<feature>/*` | Screen markup, Formik forms and dialogs per feature |
| `presentational/media-item/details/form/wrapper/*` | The shared media-item form plus one wrapper per media type |
| `presentational/media-item/details/form/view/*` | The per-media-type field layouts |
| `presentational/media-item/details/form/data/*` | Per-media-type validation, normalization and catalog defaults |
| `presentational/own-platform/common/icon-registry.ts` | The single place own-platform icons are declared ([§10.6](10-features.md#106-own-platforms)) |

## 2.3 `app/redux` — the state

| Path | Purpose |
| --- | --- |
| `initializer.ts` | Store creation, saga middleware, persistence subscription ([§1.4](01-architecture.md#14-boot-flow)) |
| `persistence.ts` | The `sessionStorage` contract: what is saved, what is deliberately reset ([§6.3](06-redux.md#63-the-persistence-contract)) |
| `reducers/root.ts` | The root reducer, which resets the whole store on `COMPLETE_LOGGING_USER_OUT` |
| `sagas/root.ts` | The root saga |
| `sagas/navigation/navigation.ts` | The saga that turns domain actions into screen changes. Read this before changing a click handler ([§5.4](05-navigation.md#54-saga-driven-navigation)) |
| `actions/<feature>/*` | Action constants, types and generators |
| `reducers/<feature>/*` | State transitions and status flags |
| `sagas/<feature>/*` | Async workflows, including the duplicate-name confirmation flows |
| `state/state.ts` | The slice types ([§6.2](06-redux.md#62-state-slices)) |

## 2.4 `app/controllers` — the data access

| Path | Purpose |
| --- | --- |
| `interfaces/entities/*` | The contracts each entity controller implements |
| `interfaces/common/*` | Shared transport contracts, including the back-end invoker |
| `implementations/real/*` | Firebase and REST-backed controllers |
| `implementations/mocks/*` | In-memory substitutes with seeded data ([§9.7](09-data-layer.md#97-mock-controllers)) |
| `main/*` | The runtime singletons: which implementation is live, decided from `config.mocks.*` ([§9.2](09-data-layer.md#92-runtime-controller-selection)) |
| `main/entities/media-items/factories.ts` | The three media-type factory families ([§9.5](09-data-layer.md#95-media-type-factories)) |

## 2.5 `app/data`, `app/factories`, `app/config`

| Path | Purpose |
| --- | --- |
| `data/models/api/*` | Transport models carrying `class-validator` decorators |
| `data/models/internal/*` | The domain models the app works with ([§8](08-domain-model.md)) |
| `data/mappers/*` | Conversions in both directions between the two |
| `factories/*` | Media-type-driven helpers used outside the controller layer |
| `config/config.ts` | Resolves the active runtime config ([§4](04-configuration.md)) |
| `config/properties/config-dev.ts`, `config-prod.ts` | The two environments |

## 2.6 `app/utilities`, `app/resources`, `app/web`

| File | Purpose |
| --- | --- |
| `utilities/navigation-routes.ts` | Screen ID to path mapping ([§5.1](05-navigation.md#51-route-map)) |
| `utilities/navigation-service.ts` | The global navigation entry point sagas call |
| `utilities/screens.ts` | The `AppSections` and `AppScreens` identifiers |
| `utilities/env.ts` | Resolves `MEDIA_TRACKER_APP_ENV` across the three sources ([§4.1](04-configuration.md#41-how-the-environment-is-resolved)) |
| `utilities/i18n.ts` | Initializes `i18n-js` ([§13](13-text-and-languages.md)) |
| `utilities/layout.ts` | `MOBILE_LAYOUT_BREAKPOINT`, the one breakpoint JS-driven responsive behaviour may use ([§11.4](11-interface.md#114-responsive-behaviour)) |
| `utilities/parser-validator.ts` | The `class-transformer-validator` wrapper used on API payloads |
| `utilities/date-utils.ts`, `misc-utils.ts`, `media-item-utils.ts`, `browser.ts`, `helper-types.ts` | Shared helpers |
| `resources/lang/lang-en.json` | Every user-facing string ([§13](13-text-and-languages.md)) |
| `resources/images/*` | Raster and icon assets. SVGs are inlined into the bundle and kept SVGO-optimized ([§3.5](03-build-and-run.md#35-svgs-are-inlined-raster-images-are-not)) |
| `web/styles.css` | The only global stylesheet ([§12](12-styling.md)) |
| `types/assets.d.ts` | Module declarations for imported image assets |

## 2.7 `tests`

A single flat folder. `setup-tests.ts` is the Jest setup file; `style-mock.js` and `file-mock.js` stand in for CSS and image imports. Everything else is either a `*.test.ts(x)` unit test or a `*.smoke.test.tsx` screen test ([§14](14-testing.md)).

---

[← §1 Architecture](01-architecture.md) · [§3 Build and run →](03-build-and-run.md)
