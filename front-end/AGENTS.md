
## Recap
- This is the front-end part of the Media Tracker application. In `../back-end` we have the back-end APIs. Both front-end and back-end are in the same Git repository, but each has its own self-consistent project.
- This project is the React + TypeScript web port of an old React Native mobile app. If old behavior needs to be checked, use the original RN code in git history at commit `d06c1ed109c400087b408e28816a603adfb4d2f8`.
- The app is still architecturally closer to the original mobile app than to a typical modern React web app, so prefer parity over unnecessary modernization.

## Core Constraints
- Work only in this repository and only on the current branch.
- Unless specifically asked to, you should only work on the front-end application when prompted in this root directory.
- `README.md` just contains minimal information about the application and how to run it.
- `DOCUMENTATION.md` contains the detailed application documentation.
- Keep `AGENTS.md` and `DOCUMENTATION.md` aligned and up to date. If either becomes stale or contradicts the project state, fix it as part of the task.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- `package.json` dependencies must always use exact versions; do not use modifiers such as `^` or `~`.
- Prefer existing project patterns over new abstractions when they are available. However, do centralize behavior into shared components/utilities whenever convenient.
- "Media item" components must always stay generic and must not contain book-, movie-, TV show-, or videogame-specific logic or references. Delegate those to specific components that use or extend the generic "media item" components.
- Use plain React with TypeScript and CSS only. Do not add frameworks such as Vite or Next.js.
- Keep the code style consistent with the existing codebase, including spacing and newline conventions.
- User-facing strings must come from `app/resources/lang/lang-en.json`, not be hardcoded in components.
- Styling should reuse semantic tokens from `app/web/styles.css` and logic-owned color presets from config. Avoid raw hex/rgba values in components unless there is a very good reason.
- For responsive JS behavior, reuse `app/utilities/layout.ts` `MOBILE_LAYOUT_BREAKPOINT` rather than introducing new hardcoded breakpoints.

## Architecture Guardrails
- Start with these high-signal files when you need context:
  - `AGENTS.md`
  - `DOCUMENTATION.md`
  - `index.tsx`
  - `app/app.tsx`
  - `app/redux/initializer.ts`
  - `app/redux/reducers/root.ts`
  - `app/redux/sagas/root.ts`
  - `app/redux/sagas/navigation/navigation.ts`
  - `app/utilities/navigation-routes.ts`
  - `app/utilities/navigation-service.ts`
  - `app/web/styles.css`
- Navigation is action-driven and often saga-driven. If a screen opens or redirects unexpectedly, inspect `app/redux/sagas/navigation/navigation.ts` before changing component click handlers.
- Controller selection happens in `app/controllers/main/**` based on `config.mocks.*`. Before debugging a data issue, confirm whether the active environment is using mocks or real implementations.
- Runtime config is selected through `MEDIA_TRACKER_APP_ENV`. Keep the dev/prod split working in both webpack and tests when touching config code.
- Web session persistence restores navigation/detail context from `sessionStorage`. Persisted list slices intentionally come back as `REQUIRES_FETCH` so a browser reload still behaves like a real refresh; do not break that behavior.
- `navigationService.setParam()` is intentionally not implemented on web beyond debug logging. Do not build new logic that depends on it.
- Most components still follow the original class-component-heavy structure and a centralized global stylesheet. Do not refactor aggressively unless there is a clear payoff.

## Shared UI And Styling Rules
- Reuse the shared presentational building blocks before creating screen-specific duplicates. Important shared pieces include:
  - `app/components/presentational/generic/responsive-action-menu`
  - `app/components/presentational/generic/entity-management-screen`
  - `app/components/presentational/generic/entity-management-list`
  - `app/components/presentational/generic/entity-details-frame`
  - `app/components/presentational/generic/same-name-confirmation`
  - `app/components/presentational/generic/color-picker`
  - `app/components/presentational/generic/input`
  - `app/components/presentational/generic/select`
  - `app/components/presentational/generic/textarea`
  - `app/components/presentational/generic/responsive-header-add-button`
  - `app/components/presentational/own-platform/common/icon-registry.ts`
- The authenticated web experience now uses a shared sticky top header and a full-bleed dark shell. Preserve that shared structure instead of reintroducing older per-screen navigation chrome or light-shell variants without a strong reason.
- Global styling lives in `app/web/styles.css`. Keep additions consistent with the existing semantic custom-property approach.

## Testing And Validation
- The dependency baseline requires Node `>=20.9.0`.
- Testing should stay minimal but meaningful: focused unit tests for important logic plus at least 1-2 smoke tests for critical user flows.
- Prefer focused tests close to the changed component/container. A tiny local Redux store is usually better than importing broad app modules.
- Be careful with broad imports in tests: decorator-heavy modules can cause unrelated Jest/Babel parsing issues.
- All relevant checks must pass before closing a feature or fix:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`

## Delivery Rules
- You MUST commit the code when you complete any task.
- Every commit message must start with `Codex: `.
- Leave ignored files and `.gitignore` patterns alone.
