# Media Tracker Web Migration

This repository is being migrated from React Native to a plain React web app (TypeScript + React Router + CSS).

## Migration plan

- Phase 1: web foundation and representative flows
  - Deliverables: webpack app shell, React Router navigation, web-safe config/storage/auth adapters, working Auth + Categories flows, minimal tests.
- Phase 2: migrate media details and list flows
  - Deliverables: media item list/details, category details, groups/platforms selection flows.
- Phase 3: migrate settings, import/export, and remaining forms
  - Deliverables: settings actions (logout/import), credits screen, TV season management.
- Phase 4: hardening
  - Deliverables: test coverage extension, accessibility pass, cleanup of RN-only files/deps.

## Current status (Phase 1 complete)

Implemented end-to-end:

- App shell and routing with React Router.
- Auth flow screens:
  - Login
  - Signup
  - Auth loading
- First authenticated screen:
  - Categories list with refresh and category selection wiring.
- Placeholder routes for non-migrated screens (with explicit TODO messages).
- Web adapters:
  - `react-native-config` -> `process.env`
  - AsyncStorage -> browser `localStorage`
  - RN Firebase Auth -> Firebase Web SDK

## Run the web app

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm start
```

The app runs on `http://localhost:5173`.

3. Build production bundle:

```bash
npm run build
```

4. Quality checks:

```bash
npm run lint
npm run typecheck
npm test
```

## Environment variables

### App environment

- `MEDIA_TRACKER_APP_ENV=dev|prod`
- default is `dev` when not set.

### Firebase web auth (for prod auth mode)

- `MEDIA_TRACKER_FIREBASE_API_KEY`
- `MEDIA_TRACKER_FIREBASE_AUTH_DOMAIN`
- `MEDIA_TRACKER_FIREBASE_PROJECT_ID`
- `MEDIA_TRACKER_FIREBASE_APP_ID`

If these are missing and prod user auth is enabled, auth calls will fail with an explicit error.

## RN -> web component mapping

| React Native primitive/component | Web equivalent used |
| --- | --- |
| `View` | `div`, `section`, `article` |
| `Text` | `span`, `p`, heading tags |
| `ScrollView` | Scrollable `div` |
| `FlatList` | `ul` + `map` |
| `TouchableOpacity` / `TouchableWithoutFeedback` | `button` |
| `TextInput` | `input` |
| `Modal` | Fixed overlay `div` |
| `ActivityIndicator` | CSS spinner |
| Drawer/Stack navigation | React Router routes + app shell links |
| `StatusBar` | removed (browser handles page chrome) |
| `AsyncStorage` | browser `localStorage` wrapper |

## Navigation mapping (RN navigation -> React Router)

| RN route ID | Web path |
| --- | --- |
| `AuthLoadingScreen` | `/auth/loading` |
| `UserLoginScreen` | `/auth/login` |
| `UserSignupScreen` | `/auth/signup` |
| `CategoriesListScreen` | `/media/categories` |
| `CategoryDetailsScreen` | `/media/categories/details` |
| `MediaItemsListScreen` | `/media/items` |
| `MediaItemDetailsScreen` | `/media/items/details` |
| `TvShowSeasonsListScreen` | `/media/tv-show-seasons` |
| `TvShowSeasonDetailsScreen` | `/media/tv-show-seasons/details` |
| `GroupsListScreen` | `/media/groups` |
| `GroupDetailsScreen` | `/media/groups/details` |
| `OwnPlatformsListScreen` | `/media/platforms` |
| `OwnPlatformDetailsScreen` | `/media/platforms/details` |
| `SettingsScreen` | `/settings` |
| `CreditsScreen` | `/credits` |

### Deep links and params

- Phase 1 routes are path-based and parameter-free.
- Details routes currently rely on Redux state (same pattern as RN flow).
- TODO phase 2: migrate details flows to URL params/query where appropriate.

## TODOs (explicitly deferred)

- Migrate media item, groups, own platforms, TV seasons screens from placeholders.
- Migrate settings operations UI and credits page content.
- Complete web-native import/export file workflow (currently URI fetch-based fallback in prod import controller).
- Replace remaining RN-only style/component files as each screen is migrated.
