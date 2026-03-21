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
- Web session persistence: `app/redux/persistence.ts`
- Root reducer: `app/redux/reducers/root.ts`
- Root saga: `app/redux/sagas/root.ts`
- Typical flow:
  - container dispatches action
  - saga performs async work / navigation
  - reducer updates slice state
  - presentational component re-renders from Redux props
- Hard browser reloads now restore the current post-category navigation/detail context from `sessionStorage`.
- Persisted list slices are intentionally reloaded as `REQUIRES_FETCH` on restore, so browser refresh still behaves like an actual data refresh.

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
- Media item list screen on web still looked like an older placeholder instead of matching the newer categories experience.
  - Correct behavior/style on web now:
    - the screen uses the same full-bleed dark shell language as the categories list
    - desktop shows a top-right add button while mobile keeps the shared FAB pattern
    - the top header now uses the media-type icon next to the category name instead of a repeated media-type pill
    - the list toolbar, view-group banner, empty state, row cards, media-item context menu, and filter modal now belong to that same visual family without repeating the page title/count inside the list
    - the rows sit directly on the screen background instead of inside an extra boxed panel, which keeps the layout closer to the categories list
    - media-item rows now fill the same shared content width as the categories list, and their left accent follows the status color while staying transparent for `NEW` items
    - the search bar is now always visible with the `Filter` button beside it, while still using the existing Redux search mode under the hood
    - the search toolbar no longer wraps that form in an extra container box, and the `Search` / `Filter` buttons now use the same compact pill sizing
    - the temporary view-group banner now uses the shared card surface without an extra left accent strip
    - the row highlight treatment now uses that same left accent color instead of a generic dark/black outline
    - the status chip now matches the three-dots chip size, and `NEW` items reuse the same neutral chrome as the options button
    - row text now shrinks correctly even for extremely long unbroken media-item names, preventing right-edge overflow
    - the screen/list wrappers now also clip stray horizontal overflow defensively so pathological test data cannot push the page width
    - search, filter, group-view, inline row metadata, and context-menu actions keep their existing logic
  - Relevant files:
    - `app/components/containers/media-item/list/screen.ts`
    - `app/components/presentational/media-item/list/screen/index.tsx`
    - `app/components/presentational/media-item/list/list/index.tsx`
    - `app/components/presentational/media-item/list/row/index.tsx`
    - `app/resources/lang/lang-en.json`
    - `app/web/styles.css`
    - `tests/media-items-screen.smoke.test.tsx`
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
  - opens the old actions again in an anchored desktop popover or a mobile bottom sheet, matching the categories list behavior
  - the menu header only shows the media item name now; it no longer repeats the media-type subtitle
  - available actions still include:
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
  - that media row only appears when editing an existing item or after a catalog entry has been selected, matching the old RN behavior
  - restores `group`, `own platform`, `order in group`, and `completed on` handling
  - switches creator/genre/platform multi-value fields back to single-line inputs instead of textareas
  - reconnects catalog search/details loading plus group/platform selection wiring in the details screen
  - preserves staged group/platform/catalog form state when returning from picker/detail sub-screens on web remount
  - preserves arbitrary unsaved main-form edits when opening and backing out of group/platform picker screens
  - preserves handled TV show season edits when returning from the seasons sub-flow
  - warns before leaving category and media-item details forms when the current form has unsaved changes, matching the old RN flow again
  - confirmed exit from the media-item form now discards the temporary Redux draft instead of carrying it past navigation
  - the details page now uses the same full-bleed dark shell language as the media items list instead of the older light card
  - the form is grouped into responsive section cards, while the artwork and external shortcut buttons now sit together in a top strip again instead of a left sidebar
  - the media block now uses a vertical shortcut list beside the poster, with the poster/shortcut group centered in the strip and the panel gap preserved across breakpoints
  - the poster is rendered without the old box chrome, stays centered in the left portion of the strip, and keeps the same fixed-height treatment while cropping proportionally if width gets tight
  - the old extra media-type eyebrow has been removed from the page header
- Relevant files:
  - `app/components/containers/category/details/screen.ts`
  - `app/components/containers/media-item/details/screen.ts`
  - `app/components/presentational/category/details/screen/index.tsx`
  - `app/components/presentational/media-item/details/screen/index.tsx`
  - `app/web/styles.css`
  - `tests/category-details.smoke.test.tsx`
  - `tests/media-item-details.smoke.test.tsx`
- Inline media-item completion had an immutability bug on web:
  - `MARK_MEDIA_ITEM_AS_COMPLETE` reused the existing `completedOn` array reference
  - pushing the new completion date mutated Redux state during dispatch
  - the safe version now lives in a tiny helper that clones the completion history first
- Relevant files:
  - `app/redux/sagas/media-item/inline-update.ts`
  - `app/redux/sagas/media-item/inline-update-helper.ts`
  - `tests/media-item-inline-update.test.ts`
- Media item list text search had been lost on the web port even though the Redux search flow still existed.
  - Correct behavior on web now:
    - the list header always shows the category-specific search field plus a submit button
    - typing a term and submitting still dispatches the existing list search flow and enters Redux search mode
    - submitting an empty field while already in search mode exits search mode without hiding the search bar itself
  - Relevant files:
    - `app/components/containers/media-item/list/list.ts`
    - `app/components/presentational/media-item/list/list/index.tsx`
    - `app/web/styles.css`
    - `tests/media-items-list.smoke.test.tsx`
    - `tests/media-items-list-container.smoke.test.tsx`
- Media item rows on the web had lost most of the old RN summary content and iconography.
  - Correct behavior on web now:
    - each row again shows the own-platform icon on the left, falling back to the old "none" icon when there is no platform
    - the row body mirrors the RN text layout again:
      - title on the first line
      - year / duration / TV production flag / creators on the second line when available
      - either completion history or genres on the third line
      - group order on the fourth line when applicable
    - the right edge again shows the old status circle/icon plus the separate options trigger
    - `NEW` items keep the original importance icon in that status circle, while active/complete/redo/upcoming items use the old status-specific icons and colors
  - Relevant files:
    - `app/components/presentational/media-item/list/list/index.tsx`
    - `app/components/presentational/media-item/list/row/index.tsx`
    - `app/web/styles.css`
    - `tests/media-items-list.smoke.test.tsx`
- Old React Native image density variants were still checked into the web app asset folder.
  - Cleanup on web now:
    - removes all `@2x` and `@3x` files from `app/resources/images`
    - keeps only the base image assets that the web port uses
  - Relevant files:
    - `app/resources/images`
- Manual `Refresh` buttons on category/media/group/platform lists were redundant once browser reload started restoring navigation state.
  - Correct behavior on web now:
    - the explicit `Refresh` buttons are gone from those list screens
    - a hard browser refresh no longer breaks after selecting a category / media item / group / own platform
    - the selected navigation/detail context is restored from `sessionStorage`
    - list screens immediately mark themselves for refetch after restore so the browser refresh still reloads data
  - Relevant files:
    - `app/redux/initializer.ts`
    - `app/redux/persistence.ts`
    - `app/components/presentational/category/list/list/index.tsx`
    - `app/components/presentational/media-item/list/list/index.tsx`
    - `app/components/presentational/group/list/screen/index.tsx`
    - `app/components/presentational/own-platform/list/screen/index.tsx`
    - `app/components/containers/category/list/list.ts`
    - `app/components/containers/media-item/list/list.ts`
    - `app/components/containers/group/list/screen.ts`
    - `app/components/containers/own-platform/list/screen.ts`
    - `app/web/styles.css`
    - `tests/redux-persistence.test.ts`
    - `tests/categories-list.smoke.test.tsx`
    - `tests/media-items-list.smoke.test.tsx`
    - `tests/groups-list.smoke.test.tsx`
- Visible navigation `Back` buttons have been removed from the web screens in favor of the browser back button.
  - Correct behavior on web now:
    - category, media item, group, own platform, and TV show season screens no longer render explicit `Back` buttons
    - the media-item list still keeps its in-list `Back` control for exiting "view group" mode, because that is not browser navigation
    - dirty category/media-item forms now intercept the browser back button and show the same unsaved-changes confirmation before leaving
    - confirming browser-back from the media-item details screen still discards the temporary Redux draft before leaving
  - Relevant files:
    - `app/components/presentational/generic/browser-back-navigation-guard/index.tsx`
    - `app/components/containers/category/details/screen.ts`
    - `app/components/containers/media-item/details/screen.ts`
    - `app/components/presentational/category/details/screen/index.tsx`
    - `app/components/presentational/media-item/details/screen/index.tsx`
    - `app/components/presentational/group/list/screen/index.tsx`
    - `app/components/presentational/group/details/screen/index.tsx`
    - `app/components/presentational/own-platform/list/screen/index.tsx`
    - `app/components/presentational/own-platform/details/screen/index.tsx`
    - `app/components/presentational/tv-show-season/list/screen/index.tsx`
    - `app/components/presentational/tv-show-season/details/screen/index.tsx`
    - `tests/browser-back-navigation-guard.test.tsx`
    - `tests/category-details.smoke.test.tsx`
    - `tests/media-item-details.smoke.test.tsx`
- Authenticated app navigation now uses a VS Code-style icon rail on desktop and a touch-friendly bottom bar on mobile.
  - Correct behavior on web now:
    - the authenticated shell shows only the section icons in a narrow left rail on desktop
    - hovering or keyboard-focusing a nav icon reveals its label next to the rail
    - the hover label now stacks above the main content instead of getting hidden under it
    - smaller screens switch to a fixed bottom navigation with visible labels because hover is not available on touch
    - the `Media` nav item now stays active anywhere inside the `/media/*` section instead of only on the categories route
  - Relevant files:
    - `app/components/containers/navigation/authenticated-navigator.tsx`
    - `app/web/styles.css`
    - `tests/authenticated-navigation.smoke.test.tsx`
- The categories page now has a dark elevated main panel with white accent cards, a desktop header CTA, and a responsive overflow menu.
  - Correct behavior on web now:
    - the categories route now drives the authenticated content area into a full-screen dark treatment instead of sitting inside a smaller dark card with light margins around it
    - category rows render as mostly dark-neutral cards with a thin color rail, the restored media-type icon, and a quieter ghost-style options trigger
    - desktop shows an outlined `Add category` header button, while mobile keeps the floating `+` action above the bottom nav
    - the category overflow actions open as an anchored popover on desktop and a bottom sheet on mobile, while keeping the same edit/delete behavior and a darker confirmation dialog for destructive actions on the categories route
    - mobile floating actions and bottom sheets now sit above the fixed bottom navigation instead of getting partially hidden by it
  - Relevant files:
    - `app/components/presentational/category/common/media-icon/index.tsx`
    - `app/components/presentational/category/list/constants.ts`
    - `app/components/containers/category/list/screen.ts`
    - `app/components/presentational/category/list/screen/index.tsx`
    - `app/components/presentational/category/list/list/index.tsx`
    - `app/components/presentational/category/list/row/index.tsx`
    - `app/components/presentational/category/list/context-menu/index.tsx`
    - `app/resources/lang/lang-en.json`
    - `app/web/styles.css`
    - `tests/categories-list.smoke.test.tsx`
    - `tests/category-context-menu.smoke.test.tsx`
    - `tests/categories-screen.smoke.test.tsx`
- The category add/edit screen now matches the dark categories theme and uses only the predefined color palette.
  - Correct behavior on web now:
    - the category details route uses the same full-screen dark categories theme as the categories list, including dark confirmation/loading surfaces
    - the form is now a single centered dark card with visual media-type choices and compact predefined color swatches
    - selected media-type tiles now keep their selected tint while hovered instead of visually falling back to the generic hover state
    - the free-form browser color picker has been removed, so category colors now come only from the configured preset palette
    - the media type remains locked while editing an existing category, matching the prior web behavior
    - smaller screens keep the same single-column form layout and expand the save button to full width
  - Relevant files:
    - `app/components/presentational/category/details/screen/index.tsx`
    - `app/components/presentational/category/common/media-icon/index.tsx`
    - `app/components/containers/category/details/screen.ts`
    - `app/web/styles.css`
    - `tests/category-details.smoke.test.tsx`
- The login and signup pages now use a dark full-screen auth shell instead of the older light pill-input card.
  - Correct behavior on web now:
    - both auth routes now activate the same dark full-screen background treatment used by the app's newer dark pages, including a dark loading overlay while auth requests are in progress
    - login and signup now render as responsive two-panel layouts on desktop and stack cleanly into a single column on mobile
    - the auth forms now use clearer field labels, stronger dark inputs, a more prominent primary submit button, and preserve submit-via-click and submit-via-enter behavior
    - the initial auth loading screen now also uses the dark full-screen loading treatment instead of rendering a parent-sized spinner with no proper shell
  - Relevant files:
    - `app/components/presentational/auth/common/app-title/index.tsx`
    - `app/components/presentational/auth/common/auth-submit/index.tsx`
    - `app/components/presentational/auth/loading/screen/index.tsx`
    - `app/components/presentational/auth/login/screen/index.tsx`
    - `app/components/presentational/auth/signup/screen/index.tsx`
    - `app/resources/lang/lang-en.json`
    - `app/web/styles.css`
    - `tests/auth-login-screen.smoke.test.tsx`
    - `tests/auth-signup-screen.smoke.test.tsx`
- The Settings and Credits sections now use the same full-screen dark shell styling as the categories experience.
  - Correct behavior on web now:
    - the Settings route uses a dark shell with a centered elevated panel for the user actions while keeping the existing logout confirmation flow
    - the Credits route now presents the external data sources as dark cards with clearer outbound links
    - both routes activate the same dark confirm-dialog/loading treatment used on the categories screens
    - mobile keeps the same dark shell and collapses the credits cards into a single column
  - Relevant files:
    - `app/components/presentational/settings/screen/index.tsx`
    - `app/components/presentational/credits/screen/index.tsx`
    - `app/web/styles.css`
    - `tests/settings-screen.smoke.test.tsx`
    - `tests/credits-screen.smoke.test.tsx`
- Chrome overscroll no longer reveals the old light page background above or below the app shell.
  - Correct behavior on web now:
    - the global `html` / `body` / `#root` background is now a stable dark shell color so browser bounce/elastic scrolling does not flash a white strip around the app
    - the light gradient background for the classic non-dark authenticated pages now lives on `.app-shell-content` instead of on the whole document
    - Chrome gets `overscroll-behavior-y: none` at the page level to reduce the visible elastic-scroll artifact that Firefox was not showing
  - Relevant files:
    - `app/web/styles.css`

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
- Mobile error toasts are intentionally lifted above the fixed bottom nav and floating action button so they do not get obscured by either control.

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
