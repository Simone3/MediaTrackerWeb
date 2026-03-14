# MediaTrackerWeb Context Notes

## What this repo is
- React + TypeScript web port of an older React Native app.
- Target behavior is: keep the old RN logic as closely as possible on web.
- Original RN snapshot to compare against: commit `d06c1ed109c400087b408e28816a603adfb4d2f8`.
- The removed exception is the old "Import from old app" feature.

## Fast start
- Install: `npm install`
- Dev server: `npm start`
- Production build: `npm run build`
- Checks:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`

## Boot flow
1. `index.tsx`
   - loads `reflect-metadata`
   - loads global CSS from `app/web/styles.css`
   - renders `<App />`
2. `app/app.tsx`
   - creates Redux store once via `initializeRedux()`
   - wraps app with `Provider`
   - mounts `ErrorHandlerContainer`
   - mounts `AppNavigationContainer`
3. `app/components/containers/navigation/app-navigator.tsx`
   - uses `BrowserRouter`
   - bridges `react-router-dom` navigation into `navigationService`

## Main architecture

### UI split
- `app/components/containers`
  - Redux-connected wrappers
- `app/components/presentational`
  - most actual screen / row / dialog rendering
- Most components are still class components.
- Global styling is still centralized in `app/web/styles.css`.

### State management
- Redux store setup: `app/redux/initializer.ts`
- Root reducer: `app/redux/reducers/root.ts`
- Root saga: `app/redux/sagas/root.ts`
- Typical flow:
  - container dispatches action
  - saga performs async work / navigation
  - reducer updates slice state
  - presentational component re-renders from Redux props

### Navigation model
- Screen/path mapping: `app/utilities/navigation-routes.ts`
- Imperative navigation helper: `app/utilities/navigation-service.ts`
- Navigation is action-driven through saga:
  - `app/redux/sagas/navigation/navigation.ts`
- Important consequence:
  - dispatching actions like `LOAD_CATEGORY_DETAILS` or `SELECT_CATEGORY` can change route indirectly through saga
  - when debugging "why did this screen open?", always check navigation saga

### Controllers and data sources
- `app/controllers/core/...`
  - abstraction points used by the rest of the app
- `app/controllers/impl-mocks/...`
  - mocked data implementations
- `app/controllers/impl-prod/...`
  - real backend / Firebase implementations
- Selection happens in the `core` controller files based on `config.mocks.*`
- Example:
  - `app/controllers/core/entities/category.ts`
  - `app/controllers/core/entities/user.ts`

## Config notes
- Runtime config loader: `app/config/config.ts`
- Dev config: `app/config/properties/config-dev.ts`
- Prod config: `app/config/properties/config-prod.ts`
- Current dev config uses mocks for:
  - user
  - categories
  - groups
  - own platforms
  - media items
- Backend base URL in dev config is `http://localhost:3000`
- The comment in `app/config/config.ts` says some config files are not versioned, but in this repo the config files are present.

## High-signal files to open first
- `app/AGENTS.md`
- `index.tsx`
- `app/app.tsx`
- `app/redux/initializer.ts`
- `app/redux/reducers/root.ts`
- `app/redux/sagas/root.ts`
- `app/redux/sagas/navigation/navigation.ts`
- `app/utilities/navigation-routes.ts`
- `app/utilities/navigation-service.ts`
- `app/web/styles.css`

## Entity areas
- Categories:
  - list/detail Redux under `app/redux/actions/category`, `app/redux/reducers/category`, `app/redux/sagas/category`
  - UI under `app/components/presentational/category`
- Media items:
  - largest / most interconnected area
  - includes catalog search/details, inline updates, TV show seasons
- Groups / own platforms:
  - structurally similar to each other
  - good reference implementations when category behavior looks wrong

## Recent fix worth remembering
- Category three-dots options had regressed to direct edit navigation.
- Correct behavior on web now:
  - clicking three dots highlights the category
  - opens a popup with `Edit category` and `Delete category`
  - delete still asks for confirmation
- Relevant files:
  - `app/components/containers/category/list/list.ts`
  - `app/components/presentational/category/list/list/index.tsx`
  - `app/components/presentational/category/list/context-menu/index.tsx`
  - `app/web/styles.css`
  - `tests/category-context-menu.smoke.test.tsx`
  - `tests/categories-list-container.smoke.test.tsx`
- Media item three-dots options had also regressed to direct edit navigation.
- Correct behavior on web now:
  - clicking three dots highlights the media item instead of routing immediately
  - opens a popup with the old actions again:
    - edit
    - delete with confirmation
    - status shortcuts like mark active / complete / redo when applicable
    - view group when the item belongs to a group
  - if group-view mode is opened from that popup, the list now shows a small exit banner so the user can return to the normal list
- Relevant files:
  - `app/components/containers/media-item/list/list.ts`
  - `app/components/presentational/media-item/list/list/index.tsx`
  - `app/components/presentational/media-item/list/context-menu/index.tsx`
  - `app/web/styles.css`
  - `tests/media-item-context-menu.smoke.test.tsx`
  - `tests/media-items-list-container.smoke.test.tsx`
- Media item details form had drifted far from the old RN flow.
- Correct behavior on web now:
  - restores the old shared field order on the details screen
  - removes the stray editable `status` field
  - brings back the top image/action row with Google/Wikipedia and catalog reload actions
  - restores `group`, `own platform`, `order in group`, and `completed on` handling
  - switches creator/genre/platform multi-value fields back to single-line inputs instead of textareas
  - reconnects catalog search/details loading plus group/platform selection wiring in the details screen
  - preserves staged group/platform/catalog form state when returning from picker/detail sub-screens on web remount
- Relevant files:
  - `app/components/containers/media-item/details/screen.ts`
  - `app/components/presentational/media-item/details/screen/index.tsx`
  - `app/web/styles.css`
  - `tests/media-item-details.smoke.test.tsx`
- Inline media-item completion had an immutability bug on web:
  - `MARK_MEDIA_ITEM_AS_COMPLETE` reused the existing `completedOn` array reference
  - pushing the new completion date mutated Redux state during dispatch
  - the safe version now lives in a tiny helper that clones the completion history first
- Relevant files:
  - `app/redux/sagas/media-item/inline-update.ts`
  - `app/redux/sagas/media-item/inline-update-helper.ts`
  - `tests/media-item-inline-update.test.ts`

## Testing notes
- Jest setup is lightweight and mostly smoke-test oriented.
- Tests live in `tests/`.
- Prefer focused tests around the exact container/component being changed.
- Useful pattern:
  - render presentational component directly for UI behavior
  - use a tiny local Redux store for container wiring tests
- Important gotcha:
  - importing very broad app modules in tests can pull in decorator-heavy API model files
  - this can trip Jest/Babel parsing in places unrelated to the feature under test
  - avoid importing the full root reducer in tests unless really needed

## Web-specific gaps / caveats
- `navigationService.setParam()` is not implemented on web; it only logs a debug message.
- Global CSS file is large and mixed across features.
- Some original RN patterns were ported literally, so behavior may be correct even if the structure feels awkward for web.
- Missing or partial web parity is often easiest to confirm by comparing with the old RN commit.

## Good recovery workflow for future work
1. Read `app/AGENTS.md`.
2. Run:
   - `npm test -- --runInBand`
   - `npm run typecheck`
   - `npm run lint`
3. Check whether dev config mocks are enabled in `app/config/properties/config-dev.ts`.
4. If a feature seems off, compare with RN commit `d06c1ed109c400087b408e28816a603adfb4d2f8`.
5. For navigation bugs, inspect `app/redux/sagas/navigation/navigation.ts` before changing component handlers.
6. For data bugs, inspect the `core` controller file first to see whether mocks or prod implementation is active.

## Current mental model
- This app is still closer to the original mobile architecture than to a typical modern React web app.
- The fastest safe way to fix behavior is usually:
  - find the equivalent RN behavior in the old commit
  - mirror the logic
  - add a small smoke test around the restored flow
