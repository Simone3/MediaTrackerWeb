## Recap
- This repo is the React + TypeScript web port of the old React Native mobile app.
- The goal is to preserve the old RN behavior and logic as closely as possible, except for the removed "Import from old app" feature.
- The complete original RN code is available in git history at commit `d06c1ed109c400087b408e28816a603adfb4d2f8`.
- When behavior is unclear, compare with that RN commit before inventing a web-specific rewrite.
- The app is still architecturally closer to the original mobile app than to a typical modern React web app, so prefer parity over unnecessary modernization.

## Core Constraints
- `README.md` is just for the repo owner for now. Do NOT read it and do NOT change it.
- `DOC.md` is the fast recovery/context file. Always keep it up to date when durable project knowledge, workflow guidance, or architectural notes change.
- Keep `AGENTS.md` and `DOC.md` aligned. If one of them becomes stale or contradicts the repo state, fix it as part of the task.
- Work only in this repository and only on the current branch.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- Use plain React with TypeScript and CSS only. Do not add frameworks such as Vite or Next.js.
- Keep the code style consistent with the existing repo, including spacing and new-line conventions.
- Prefer existing project patterns over fresh abstractions unless the current code clearly needs a shared solution.
- User-facing strings should come from `app/resources/lang/lang-en.json` rather than being hardcoded in components.
- Styling should reuse semantic tokens from `app/web/styles.css` and logic-owned color presets from config. Avoid raw hex/rgba values in components unless there is a very good reason.
- For responsive JS behavior, reuse `app/utilities/layout.ts` `MOBILE_LAYOUT_BREAKPOINT` instead of introducing new hardcoded breakpoints.

## Architecture Guardrails
- Start with these high-signal files when you need context:
  - `AGENTS.md`
  - `DOC.md`
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
- Web session persistence restores navigation/detail context from `sessionStorage`. Persisted list slices intentionally come back as `REQUIRES_FETCH` so browser reload still behaves like a real refresh; do not break that behavior.
- `navigationService.setParam()` is intentionally not implemented on web beyond debug logging. Do not build new logic that depends on it.
- Most components still follow the original class-component-heavy structure and a centralized global stylesheet. Do not refactor aggressively without a clear payoff.

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
- The authenticated web experience now uses a shared sticky top header and full-bleed dark shell. Preserve that shared structure instead of reintroducing older per-screen navigation chrome or light-shell variants without a strong reason.
- Global styling lives in `app/web/styles.css`. Keep additions consistent with the existing semantic custom-property approach.

## Testing And Validation
- The dependency baseline requires Node `>=20.9.0`.
- Testing should stay minimal but meaningful: focused unit tests for important logic plus at least 1-2 smoke tests for critical user flows.
- Prefer focused tests close to the changed component/container. A tiny local Redux store is usually better than importing very broad app modules.
- Be careful with broad imports in tests: decorator-heavy modules can cause unrelated Jest/Babel parsing issues.
- All relevant checks must pass before closing a feature or fix:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`

## Delivery Rules
- You MUST commit the code when you complete any task.
- Every commit message must start with `Codex: `.
- Leave ignored files and `.gitignore` patterns alone.
