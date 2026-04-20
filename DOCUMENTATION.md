# MediaTrackerWeb Documentation

## Purpose
This file is the main coding reference for the web app.

Use it together with `AGENTS.md` when working in this repository.

This documentation is intentionally optimized for implementation work rather than product marketing:

- how the app boots
- how navigation really happens
- which Redux slices matter
- where data comes from
- which shared components already exist
- what invariants are easy to break

Do not rely on `README.md` for coding context in this repo. `README.md` is currently owner-facing; this file is the implementation guide.

## Application Summary
Media Tracker Web is a React + TypeScript web port of an older React Native app.

The app lets authenticated users manage:

- categories
- media items inside a category
- groups inside a category
- owned platforms inside a category
- TV show seasons inside a TV show form
- settings and credits

Supported media types:

- `BOOK`
- `MOVIE`
- `TV_SHOW`
- `VIDEOGAME`

Architecturally, the app still behaves more like the mobile app than like a modern route-centric React SPA:

- Redux is the main source of screen state.
- Redux sagas orchestrate async work and many navigation side effects.
- Containers are still mostly `connect(...)`-based.
- Many presentational components are class components.
- Screen transitions often happen because an action was dispatched, not because a component directly navigated.

## Quick Orientation
Read these files first when starting any meaningful work:

1. `AGENTS.md`
2. `DOCUMENTATION.md`
3. `index.tsx`
4. `app/app.tsx`
5. `app/redux/initializer.ts`
6. `app/redux/reducers/root.ts`
7. `app/redux/sagas/root.ts`
8. `app/redux/sagas/navigation/navigation.ts`
9. `app/utilities/navigation-routes.ts`
10. `app/utilities/navigation-service.ts`
11. `app/web/styles.css`

High-value feature entry points:

- Authentication: `app/components/containers/auth/*`
- Main routing: `app/components/containers/navigation/*`
- Categories: `app/components/containers/category/*`
- Media items: `app/components/containers/media-item/*`
- TV show seasons: `app/components/containers/tv-show-season/*`
- Groups: `app/components/containers/group/*`
- Own platforms: `app/components/containers/own-platform/*`
- Settings and credits: `app/components/containers/settings/*`, `app/components/containers/credits/*`

## Top-Level Structure
```text
app/
  app.tsx                       App root
  components/
    containers/                Redux-connected containers and routing shells
    presentational/            UI-only components and Formik forms
  config/                      Environment-specific runtime config
  controllers/
    interfaces/               Data access contracts
    implementations/mocks/    In-memory mock controllers
    implementations/real/     Firebase + REST-backed controllers
    main/                     Runtime controller selectors/singletons
  data/
    models/api/               Validated transport models
    models/internal/          App-facing domain models
    mappers/                  Internal <-> API conversions
  factories/                  Media-type-driven factory helpers
  redux/
    actions/                  Action constants/types/generators
    reducers/                 State transitions
    sagas/                    Async workflows and navigation triggers
    state/                    State slice types + persistence mapping rules
  resources/
    images/                   Raster and icon assets
    lang/                     User-facing strings
  utilities/                  Cross-cutting helpers
  web/                        Global stylesheet
tests/                        Jest unit and smoke tests
index.tsx                     Browser entry point
webpack.config.js             Bundling and env injection
jest.config.js                Test setup
eslint.config.js              Lint rules
```

## Runtime And Bootstrap
Boot flow:

1. `index.tsx`
   - imports `reflect-metadata`
   - imports `app/web/styles.css`
   - renders `<App />` inside React strict mode
2. `app/app.tsx`
   - creates the Redux store once via `initializeRedux()`
   - wraps the app in `Provider`
   - wraps everything in the global error handler
   - renders the navigation container
3. `app/redux/initializer.ts`
   - loads persisted Redux state from `sessionStorage`
   - creates the store with `configureStore`
   - attaches saga middleware
   - disables Redux Toolkit serializable checks for both actions and state
   - runs `rootSaga`
   - subscribes persistence on every store update

Important note:

- Dates and non-plain values are present in Redux state.
- The repo explicitly disables serializable checking instead of normalizing that away.

## Environment And Config
`app/config/config.ts` resolves runtime config from `MEDIA_TRACKER_APP_ENV`.

Supported values:

- `dev`
- `prod`

Resolution order in `app/utilities/env.ts`:

1. `globalThis.__MEDIA_TRACKER_ENV__`
2. `process.env`
3. webpack-defined `__MEDIA_TRACKER_APP_ENV__`

Fallback:

- no override -> `dev`

### Dev Config
`app/config/properties/config-dev.ts`

- back-end base URL: `http://localhost:3000`
- timeout: `5000`
- `assumeWellFormedResponse: false`
- Firebase project: `media-tracker-dev-db499`
- all mocks disabled by default

### Prod Config
`app/config/properties/config-prod.ts`

- back-end base URL: `https://media-tracker-back-end.onrender.com`
- timeout: `10000`
- `assumeWellFormedResponse: true`
- Firebase project: `media-tracker-da288`
- all mocks disabled by default

### Shared Config Responsibilities
Config also owns:

- category and own-platform color presets
- default date format
- external search URL builders
  - Google
  - Wikipedia
  - JustWatch
  - HowLongToBeat
- logging flags for request/mapping debug output

### Webpack
`webpack.config.js`

- dev server port: `5173`
- history API fallback enabled
- aliases `app -> ./app`
- injects `__MEDIA_TRACKER_APP_ENV__`
- serves `public/index.html`

## Navigation Model
Navigation is a mix of:

- React Router route matching
- Redux action dispatches
- saga-driven navigation side effects
- a global `navigationService`

### Route Map
`app/utilities/navigation-routes.ts`

| Screen/Section | Path |
| --- | --- |
| `AppSections.Unauthenticated` | `/auth` |
| `AppSections.Authenticated` | `/app` |
| `AppSections.Media` | `/media` |
| `AppSections.Settings` | `/settings` |
| `AppScreens.AuthLoading` | `/auth/loading` |
| `AppScreens.UserLogin` | `/auth/login` |
| `AppScreens.UserSignup` | `/auth/signup` |
| `AppScreens.CategoriesList` | `/media/categories` |
| `AppScreens.CategoryDetails` | `/media/categories/details` |
| `AppScreens.MediaItemsList` | `/media/items` |
| `AppScreens.MediaItemDetails` | `/media/items/details` |
| `AppScreens.TvShowSeasonsList` | `/media/tv-show-seasons` |
| `AppScreens.TvShowSeasonDetails` | `/media/tv-show-seasons/details` |
| `AppScreens.GroupsList` | `/media/groups` |
| `AppScreens.GroupDetails` | `/media/groups/details` |
| `AppScreens.OwnPlatformsList` | `/media/platforms` |
| `AppScreens.OwnPlatformDetails` | `/media/platforms/details` |
| `AppScreens.Settings` | `/settings` |
| `AppScreens.Credits` | `/settings/credits` |

### Router Composition
`app/components/containers/navigation/*`

- `AppNavigationContainer`
  - owns `BrowserRouter`
  - bridges React Router `navigate()` into `navigationService`
- `ConnectedAuthenticationNavigator`
  - chooses auth loading, unauthenticated, or authenticated flow from Redux
- `AuthenticatedNavigator`
  - switches between `/media/*` and `/settings/*`
- `MediaNavigator`
  - owns all media/category/group/platform/season routes
- `SettingsNavigator`
  - owns settings and nested credits

### navigationService
`app/utilities/navigation-service.ts`

- `navigate(routeName)` converts screen IDs to paths
- `back()` uses `navigate(-1)` semantics through the router
- `setParam()` is intentionally a stub and only logs to the console

Do not build new logic that depends on `navigationService.setParam()`.

### Saga-Driven Navigation
`app/redux/sagas/navigation/navigation.ts`

Many screen changes happen here, not in UI click handlers.

Important mappings:

- `SELECT_CATEGORY` -> navigate to media items list
- `LOAD_*_DETAILS` and `LOAD_NEW_*_DETAILS` -> navigate to the matching details screen
- `COMPLETE_SAVING_*` -> go back
- `REQUEST_GROUP_SELECTION` -> open groups list
- `REQUEST_OWN_PLATFORM_SELECTION` -> open own-platforms list
- `SELECT_GROUP` -> go back
- `SELECT_OWN_PLATFORM` -> go back
- `START_TV_SHOW_SEASONS_HANDLING` -> open seasons list
- `COMPLETE_TV_SHOW_SEASONS_HANDLING` -> go back

If navigation feels "mysterious", inspect this saga first.

## Authentication Flow
Auth state lives in Redux and starts as `REQUIRES_CHECK`.

Flow:

1. App starts in `AuthLoadingScreenComponent`
2. `CHECK_USER_LOGIN_STATUS` saga asks `userController.getCurrentUser()`
3. reducer converts result into:
   - `AUTHENTICATED`
   - `UNAUTHENTICATED`
4. navigator switches to the right subtree

Important behavior:

- login-status check failures still fall back to `UNAUTHENTICATED`
- this avoids trapping the app on the loading screen

### Real Auth
`app/controllers/implementations/real/entities/user.ts`

- uses Firebase Web Auth
- initializes a named Firebase app: `media-tracker-web`
- waits for the first `onAuthStateChanged` event before reading `currentUser`
- login/signup use email + password
- access token comes from `firebaseUser.getIdToken()`

### Mock Auth
`app/controllers/implementations/mocks/entities/user.ts`

- stores a mocked current user in browser `localStorage`
- seeded with one user: `test@test.test`
- returns `-fake-access-token-`

## Redux Architecture
Root wiring:

- reducer: `app/redux/reducers/root.ts`
- saga: `app/redux/sagas/root.ts`

The root reducer resets the entire store on `COMPLETE_LOGGING_USER_OUT`.

### State Slices
`app/redux/state/state.ts`

| Slice | Purpose | Persisted? |
| --- | --- | --- |
| `error` | global flash error | reset on persistence |
| `userGlobal` | authenticated user + auth status | reset to initial `REQUIRES_CHECK` on persistence |
| `userOperations` | auth request statuses | reset on persistence |
| `categoryGlobal` | selected category | persisted |
| `categoriesList` | categories list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `categoryDetails` | category form state | entity persists, save status resets |
| `mediaItemsList` | current media list, mode, search/filter/sort | entity list persists, status resets to `REQUIRES_FETCH` |
| `mediaItemDetails` | current media item form + draft + catalog state | entity/draft persist, save/catalog statuses reset |
| `groupGlobal` | selected group | persisted |
| `groupsList` | groups list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `groupDetails` | group form state | entity persists, save status resets |
| `ownPlatformGlobal` | selected platform | persisted |
| `ownPlatformsList` | platform list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `ownPlatformDetails` | platform form state | entity persists, save status resets |
| `tvShowSeasonsList` | local season-editing list + completion timestamp | persisted |
| `tvShowSeasonDetails` | current season form state | persisted, save status resets |

### Persistence Contract
`app/redux/persistence.ts`

Session key:

- `media-tracker-redux-state`

Rules:

- only persists while `userGlobal.status === 'AUTHENTICATED'`
- persistence uses `sessionStorage`, not `localStorage`
- dates are encoded as `{ _type: 'Date', _value: iso }`
- dates are revived on load
- invalid persistence payloads are cleared
- persisted auth is not trusted blindly
  - `mapStateForPersistence()` resets `userGlobal` to initial state
  - on reload the app still re-checks auth status through the controller

Intentional refresh behavior:

- list slices come back as `REQUIRES_FETCH`
- highlighted items are cleared
- media-item list mode `SET_FILTERS` becomes `NORMAL`

This preserves context while still making reload behave like a real refresh.

### Error Handling
Global error flow:

1. saga or other code dispatches `setError(...)`
2. `ErrorHandlerContainer` reads `state.error.error`
3. `ErrorHandlerComponent` converts `AppError` to an i18n message
4. a toast is shown for 3 seconds
5. the Redux error is cleared immediately after being surfaced

### Common Async Pattern
Most CRUD flows use this pattern:

1. action generator emits intent action
2. saga dispatches `START_*`
3. saga calls controller
4. saga dispatches `COMPLETE_*` or `FAIL_*`
5. reducers update status flags
6. navigation saga may react to the completion action

Duplicate-name confirmation flows are implemented in sagas, not in forms:

- category
- group
- own platform
- media item

## Domain Model
Internal models live in `app/data/models/internal/*`.

### User
- `id`
- `email`

### Category
- `id`
- `name`
- `mediaType`
- `color`

`DEFAULT_CATEGORY`:

- empty name
- first configured category color
- media type `BOOK`

### Group
- `id`
- `name`

### Own Platform
- `id`
- `name`
- `color`
- `icon`

Supported own-platform icon IDs:

- `default`
- `android`
- `apple`
- `book`
- `disc`
- `disney`
- `download`
- `epic`
- `gog`
- `hulu`
- `kindle`
- `netflix`
- `origin`
- `playstation`
- `steam`
- `switch`
- `uplay`

### Generic Media Item
Shared fields:

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

Importance values:

- `400`
- `300`
- `200`
- `100`

Status values:

- `ACTIVE`
- `UPCOMING`
- `REDO`
- `COMPLETE`
- `NEW`

### Media-Type-Specific Fields
Book:

- `authors?`
- `pagesNumber?`

Movie:

- `directors?`
- `durationMinutes?`

TV Show:

- `creators?`
- `averageEpisodeRuntimeMinutes?`
- `inProduction?`
- `nextEpisodeAirDate?`
- `seasons?`

Videogame:

- `developers?`
- `publishers?`
- `platforms?`
- `averageLengthHours?`

### TV Show Season
- `number`
- `episodesNumber?`
- `watchedEpisodesNumber?`

Important note:

- TV show seasons are edited as a nested local workflow.
- They do not hit the back end independently.
- They become part of the parent TV show when the TV show itself is saved.

## Data Layer
The controller structure is:

- `interfaces/` for contracts
- `implementations/real/` for real integrations
- `implementations/mocks/` for in-memory substitutes
- `main/` for runtime singleton selection

### Runtime Controller Selection
`app/controllers/main/**`

Entity controllers are chosen from `config.mocks.*`.

Examples:

- `categoryController`
- `groupController`
- `ownPlatformController`
- `userController`
- media-item controller factories by media type

Before debugging a data issue, confirm whether the app is using mocks or real implementations.

### REST Transport
Real REST calls use:

- `BackEndInvokerRestJson`
- `RestJsonInvokerAxios`
- `parserValidator`

Important behavior:

- default timeout comes from config unless explicitly overridden
- request/response validation can be skipped when `assumeWellFormedResponse` is true
- API models use `class-validator` decorators
- mappers convert between API and internal models

### Endpoint Patterns
Categories:

- `GET /users/:userId/categories`
- `POST /users/:userId/categories/filter`
- `POST /users/:userId/categories`
- `PUT /users/:userId/categories/:id`
- `DELETE /users/:userId/categories/:id`

Groups:

- `GET /users/:userId/categories/:categoryId/groups`
- `POST /users/:userId/categories/:categoryId/groups/filter`
- `POST /users/:userId/categories/:categoryId/groups`
- `PUT /users/:userId/categories/:categoryId/groups/:id`
- `DELETE /users/:userId/categories/:categoryId/groups/:id`

Own platforms:

- `GET /users/:userId/categories/:categoryId/own-platforms`
- `POST /users/:userId/categories/:categoryId/own-platforms/filter`
- `POST /users/:userId/categories/:categoryId/own-platforms`
- `PUT /users/:userId/categories/:categoryId/own-platforms/:id`
- `DELETE /users/:userId/categories/:categoryId/own-platforms/:id`

Books:

- `POST /users/:userId/categories/:categoryId/books/filter`
- `POST /users/:userId/categories/:categoryId/books/search`
- `POST /users/:userId/categories/:categoryId/books`
- `PUT /users/:userId/categories/:categoryId/books/:id`
- `DELETE /users/:userId/categories/:categoryId/books/:id`
- `GET /catalog/books/search/:searchTerm`
- `GET /catalog/books/:catalogId`

Movies:

- `POST /users/:userId/categories/:categoryId/movies/filter`
- `POST /users/:userId/categories/:categoryId/movies/search`
- `POST /users/:userId/categories/:categoryId/movies`
- `PUT /users/:userId/categories/:categoryId/movies/:id`
- `DELETE /users/:userId/categories/:categoryId/movies/:id`
- `GET /catalog/movies/search/:searchTerm`
- `GET /catalog/movies/:catalogId`

TV shows:

- `POST /users/:userId/categories/:categoryId/tv-shows/filter`
- `POST /users/:userId/categories/:categoryId/tv-shows/search`
- `POST /users/:userId/categories/:categoryId/tv-shows`
- `PUT /users/:userId/categories/:categoryId/tv-shows/:id`
- `DELETE /users/:userId/categories/:categoryId/tv-shows/:id`
- `GET /catalog/tv-shows/search/:searchTerm`
- `GET /catalog/tv-shows/:catalogId`

Videogames:

- `POST /users/:userId/categories/:categoryId/videogames/filter`
- `POST /users/:userId/categories/:categoryId/videogames/search`
- `POST /users/:userId/categories/:categoryId/videogames`
- `PUT /users/:userId/categories/:categoryId/videogames/:id`
- `DELETE /users/:userId/categories/:categoryId/videogames/:id`
- `GET /catalog/videogames/search/:searchTerm`
- `GET /catalog/videogames/:catalogId`

### Media-Type Factories
`app/controllers/main/entities/media-items/factories.ts`

Three factory families exist:

- item controllers
- definitions controllers
- catalog controllers

They switch by `MediaTypeInternal`.

This is the central place that keeps media-item code generic while still delegating subtype behavior.

### Media Definitions Controllers
Each media type currently shares the same defaults:

- default filter: `status: 'CURRENT'`
- default sort:
  - `ACTIVE desc`
  - `IMPORTANCE desc`
  - `RELEASE_DATE asc`
- view-group sort:
  - `GROUP asc`

They also expose:

- creator name extraction
- duration extraction
- default media item creation

### Mock Controllers
Mock controllers are in-memory and extend `MockControllerHelper`.

Traits:

- optional artificial delay
- optional error probability
- seeded sample data
- simplistic filter/sort behavior
- useful for UI work, not exhaustive behavior parity

Notable limitations:

- generic media-item mock filtering/sorting is intentionally incomplete
- it logs when behavior would normally be handled by the real back end

## Feature Walkthroughs

### Categories
Home screen:

- `CategoriesListScreenComponent`
- title: `Media Tracker`
- header shows settings shortcut

Behavior:

- fetches when `categoriesList.status === 'REQUIRES_FETCH'`
- selecting a category dispatches `SELECT_CATEGORY`
- `SELECT_CATEGORY` does two important things:
  - stores `categoryGlobal.selectedCategory`
  - resets media-item list state with the right default filter/sort
- navigation saga then pushes to media items list

Category details:

- still use the older custom header/form shell, not `EntityDetailsFrameComponent`
- Formik-driven
- same-name confirmation is opened when saga sets `saveStatus` to `REQUIRES_CONFIRMATION`

### Media Items List
Primary files:

- `app/components/containers/media-item/list/screen.ts`
- `app/components/containers/media-item/list/list.ts`
- `app/redux/reducers/media-item/list.ts`
- `app/redux/sagas/media-item/fetch.ts`

Modes:

- `NORMAL`
- `SEARCH`
- `SET_FILTERS`
- `VIEW_GROUP`

List behavior:

- fetches on mount/update while status is `REQUIRES_FETCH`
- search form is always visible in the header area
- entering a non-empty search term:
  - opens search mode if needed
  - dispatches `SEARCH_MEDIA_ITEMS`
  - same action is watched by the fetch saga
- opening filters switches mode to `SET_FILTERS`
- selecting "view group" in the context menu switches mode to `VIEW_GROUP`
- leaving search or view-group mode resets to `NORMAL` and marks the list for refetch

Context menu:

- implemented with `ResponsiveActionMenuComponent`
- desktop: floating popover
- mobile: bottom sheet

Inline status actions:

- `MARK_MEDIA_ITEM_AS_ACTIVE`
- `MARK_MEDIA_ITEM_AS_COMPLETE`
- `MARK_MEDIA_ITEM_AS_REDO`

Inline update rules from `inline-update-helper.ts`:

- active -> `status: ACTIVE`, `active: true`
- complete -> append completion date, clear `active`, clear `markedAsRedo`, set `status: COMPLETE`
- redo -> `active: false`, `markedAsRedo: true`, `status: REDO`

### Media Item Details
Primary files:

- `app/components/containers/media-item/details/screen.ts`
- `app/components/presentational/media-item/details/form/wrapper/media-item.tsx`
- subtype wrappers in `app/components/presentational/media-item/details/form/wrapper/*`
- subtype form views in `app/components/presentational/media-item/details/form/view/*`

High-level design:

- the screen itself is just a switcher
- the current media type chooses the correct subtype form
- each subtype wrapper plugs validation/normalization/default-catalog behavior into the shared `CommonMediaItemFormComponent`

Shared form behavior:

- Formik with `enableReinitialize`
- duplicate-name confirmation
- catalog-reload confirmation
- loading overlay while saving/catalog/group/platform requests are in flight
- draft persistence on every value change
- group/platform selections merged back from global Redux slices
- optional catalog details merged into current Formik values

Draft behavior:

- unsaved form values are stored in `mediaItemDetails.formDraft`
- browser back / same-origin anchor navigation is blocked while dirty
- confirming exit clears the draft

Catalog behavior:

- name field can search the external catalog
- choosing a result loads detailed catalog data
- catalog payloads include a transport-only `catalogLoadId`
- the shared wrapper strips `catalogLoadId` before storing values in Formik

Subtype-specific fields:

- books: authors, pages
- movies: directors, duration
- TV shows: creators, episode runtime, seasons, production state, next episode air date
- videogames: developers, publishers, platforms, average length

External action buttons are media-specific:

- generic/shared forms can open Google and Wikipedia
- TV shows add JustWatch
- videogames add HowLongToBeat

### TV Show Seasons Nested Flow
This is the most special-case workflow in the app.

Entry point:

- TV show form dispatches `START_TV_SHOW_SEASONS_HANDLING(currentSeasons || [])`
- navigation saga opens the seasons list screen

State model:

- `tvShowSeasonsList.tvShowSeasons` holds the working list
- `tvShowSeasonDetails` holds the currently edited season

Season operations are local-only:

- add season
- edit season
- delete season
- inline complete season

No independent back-end controller exists for seasons.

Completion path:

1. seasons screen dispatches `COMPLETE_TV_SHOW_SEASONS_HANDLING()`
2. reducer stores a fresh `completeHandlingTimestamp`
3. navigation saga goes back to the TV show form
4. `TvShowFormComponent` notices the timestamp changed
5. Formik values are updated with the latest seasons list
6. the TV show gets persisted only when the parent media item is saved

Catalog reload nuance:

- `preserveTvShowSeasonProgress()` keeps `watchedEpisodesNumber` when reloading catalog seasons

### Groups
Groups are category-scoped and mainly serve two purposes:

- collection/franchise grouping for media items
- selection target from the media-item form

UI traits:

- shared `EntityManagementScreenComponent`
- shared `EntityManagementListComponent`
- "None" option for clearing current selection
- selecting a group dispatches `SELECT_GROUP`
- navigation saga then goes back to the media-item form

Group management is still available from the same screen:

- add
- edit
- delete

### Own Platforms
Own platforms mirror the group workflow, but add:

- color
- icon

Display details:

- icons are centralized in `app/components/presentational/own-platform/common/icon-registry.ts`
- badge rendering uses CSS mask styles built by `buildOwnPlatformMaskStyle(...)`

Selection works the same way as groups:

- request selection from media-item form
- open management/selection screen
- choose platform or "None"
- `SELECT_OWN_PLATFORM` triggers navigation back

### Settings
Settings currently contains:

- logout
- credits link

Logout behavior:

- opens a confirmation dialog
- dispatches `LOG_USER_OUT`
- root reducer resets the whole Redux state on completion

### Credits
Credits screen is static and links to:

- TMDb
- Giant Bomb
- Google Books

## UI Architecture
The UI still follows the original container/presentational split closely.

### Containers
Containers typically:

- map Redux state to props
- map dispatch functions
- do very little rendering logic
- throw early if required global context is missing

### Presentational Components
Presentational components typically own:

- markup
- local dialog state
- `componentDidMount` / `componentDidUpdate` fetch triggers
- Formik forms
- responsive UI behavior

### Important Shared Building Blocks
Use these before creating a one-off alternative:

- `generic/authenticated-page-header`
- `generic/entity-management-screen`
- `generic/entity-management-list`
- `generic/entity-details-frame`
- `generic/responsive-action-menu`
- `generic/browser-back-navigation-guard`
- `generic/same-name-confirmation`
- `generic/confirm-dialog`
- `generic/pill-button`
- `generic/input`
- `generic/select`
- `generic/textarea`
- `generic/clearable-input`
- `generic/color-picker`
- `generic/responsive-header-add-button`
- `generic/media-switcher`

### Styling
Global styling lives in `app/web/styles.css`.

Important themes:

- full-bleed dark authenticated shell
- sticky top header
- semantic CSS custom properties for colors and surfaces
- reusable skeleton/loading styles

Use style tokens instead of raw component-level colors whenever possible.

Exceptions:

- logic-owned color presets come from config
- static accent presets exist for some flows like TV show seasons

### Responsive Behavior
For JS-controlled responsive behavior, use:

- `MOBILE_LAYOUT_BREAKPOINT` from `app/utilities/layout.ts`

Current shared JS-responsive component:

- `ResponsiveActionMenuComponent`

### Localization
All user-facing strings must come from:

- `app/resources/lang/lang-en.json`

`app/utilities/i18n.ts` initializes `i18n-js` with:

- locale `en`
- fallback enabled

## Important Invariants And Pitfalls

### Category context is required for most media flows
Many media-item containers and sagas throw if `categoryGlobal.selectedCategory` is missing.

If media item screens fail unexpectedly after reload or navigation changes, confirm the selected category is still being established correctly.

### Group/platform selections are global transient state
`groupGlobal.selectedGroup` and `ownPlatformGlobal.selectedOwnPlatform` are not route params.

They are temporary cross-screen selections injected back into the active media-item form.

### Dirty-form protection is browser-oriented
`BrowserBackNavigationGuardComponent` intercepts:

- browser back
- same-origin anchor navigation
- page unload

It does not make `navigationService.setParam()` useful, and it is not a generic replacement for all app navigation rules.

### TV show seasons are local until parent save
Changing seasons does not persist anything by itself.

The parent TV show must still be saved afterward.

### Persistence intentionally invalidates lists
Do not "optimize" persisted list slices to remain `FETCHED` after reload.

The current behavior is deliberate.

### Redux contains dates and non-serializable-friendly values
The store relies on custom persistence and disabled serializable checks.

Do not assume Redux Toolkit warnings will catch date/object issues here.

### `strictNullChecks` is off
The codebase uses runtime guards and legacy assumptions in several places.

Be careful when adding new types or refactors that implicitly expect strict null safety.

### Mock behavior is not full production parity
Mocks are helpful for UI development, but:

- filtering is simplified
- sorting is simplified
- seeded data is small
- some flows only approximate back-end behavior

## Testing And Tooling
Node baseline:

- `>=20.9.0`

Scripts:

- `npm start`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm test`

### Jest
`jest.config.js`

- environment: `jsdom`
- roots: `app`, `tests`
- TS/TSX transformed via `babel-jest`
- CSS and images mocked

### ESLint
`eslint.config.js`

- TypeScript-aware flat config
- stylistic rules are warning-level
- React and React Hooks safety rules enabled
- repo style strongly favors tabs and single quotes

### What The Existing Tests Cover
Representative coverage areas:

- auth screens and authenticated navigation
- categories, media items, groups, platforms, settings, credits smoke tests
- shared form controls
- browser-back guard
- navigation routes/service
- redux persistence
- REST invoker
- Firebase user controller
- webpack config

Testing style in this repo favors:

- focused unit tests for logic-heavy helpers
- small smoke tests for important screens and flows

## Extension Playbooks

### Add Or Change A Screen
Touch, in order:

1. `app/utilities/screens.ts`
2. `app/utilities/navigation-routes.ts`
3. the appropriate navigator in `app/components/containers/navigation/*`
4. container + presentational screen components
5. navigation saga if the screen is action-driven
6. i18n strings
7. smoke tests

### Add A Media-Item Field
Touch, in order:

1. internal subtype model in `app/data/models/internal/media-items/*`
2. API model in `app/data/models/api/media-items/*` if it is persisted remotely
3. mapper in `app/data/mappers/media-items/*`
4. subtype validation + normalization in `app/components/presentational/media-item/details/form/data/*`
5. subtype form view in `app/components/presentational/media-item/details/form/view/*`
6. subtype row rendering if the field affects list output
7. tests

If the field is catalog-backed, also inspect:

- catalog API model
- catalog mapper
- default catalog item constant
- `onLoadCatalogDetails` behavior

### Add A New Media Type
This is a large change. Expect to update all of:

1. category media-type definitions and labels
2. internal and API models
3. mappers
4. controller interfaces
5. real controllers
6. mock controllers
7. `controllers/main/entities/media-items/*`
8. factory switch statements
9. subtype form container/wrapper/view/data files
10. subtype list row files
11. i18n keys
12. tests

Keep generic media-item components generic. Media-type-specific logic belongs in subtype wrappers, subtype views, subtype rows, subtype definitions controllers, or subtype controller/mapping code.

## Debugging Checklist
When something looks wrong, check these in order:

1. Is the app on `dev` or `prod` config?
2. Are mocks enabled for the entity you are debugging?
3. Which action started the flow?
4. Does a saga mutate navigation after that action?
5. Which reducer owns the status flag or selected entity you expected?
6. Did persistence restore stale context after reload?
7. Is the missing value actually expected to be global Redux state rather than a route param?

Good trace path:

- action generator
- action constant/type
- saga watcher/worker
- reducer
- container
- presentational component

## Current Product Surface
As of the current repo state, the user-visible screen set is:

- auth loading
- login
- signup
- categories list
- category details
- media items list
- media item details
- TV show seasons list
- TV show season details
- groups list
- group details
- own platforms list
- own platform details
- settings
- credits

## Final Notes
This repo is intentionally conservative.

Prefer:

- parity with the older mobile-era architecture
- existing container/presentational patterns
- existing shared components
- action-driven navigation
- localized strings from `lang-en.json`

Avoid:

- assuming routes alone define app state
- introducing route-param-based state when Redux already owns that context
- generic media-item components that know about a specific subtype
- refactors that "modernize" structure without a direct payoff
