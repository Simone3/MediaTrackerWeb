# CLAUDE.md — front end

Instructions for Claude Code when working in `front-end/`.

`docs/technical/` is the detailed reference for this sub-project, split into numbered sections: architecture, repository map, build and run, configuration, navigation, Redux state, authentication, the domain model, the data layer, the features, the interface, styling, text, testing, the invariants and the extension playbooks. Start from [`docs/technical/README.md`](docs/technical/README.md) and read ONLY the sections relevant to the current task, before changing code in an area you have not touched yet in the current session. This file holds only the rules and commands; the reasoning behind them lives there.

## Project

The front end of Media Tracker: a React + TypeScript single-page application for tracking books, movies, TV shows and videogames. It is the web port of an older React Native mobile app, and it is still architecturally closer to that app than to a modern route-centric React SPA — **prefer parity over unnecessary modernization**. If old behaviour needs checking, the original React Native code is in git history at commit `d06c1ed109c400087b408e28816a603adfb4d2f8`.

The back end lives in `../back-end` and is a separate self-sufficient project with its own `CLAUDE.md` and `docs/technical/`. Work here unless asked otherwise.

## Commands

```sh
npm start          # webpack dev server, development mode, port 5173
npm run build      # webpack production build
npm run lint       # ESLint flat config (eslint.config.js)
npm run typecheck  # tsc --noEmit
npm test           # Jest
```

Prefer running a single test file while iterating:

```sh
npm test -- tests/media-item-form-data.test.ts
```

The environment comes from `MEDIA_TRACKER_APP_ENV` (`dev` by default): `MEDIA_TRACKER_APP_ENV=prod npm start` and `MEDIA_TRACKER_APP_ENV=dev npm run build` are the other combinations.

## Hard Rules

- Work only in this repository and only on the current branch.
- Keep `CLAUDE.md` and `docs/technical/` from going stale: fix either one when it contradicts the state of the project. A new section takes the next number rather than renumbering the ones already written, and the index in `docs/technical/README.md` lists every file in the folder.
- `docs/technical/` is where a decision is recorded, and settling one does not earn a `CLAUDE.md` entry — add a rule here only when it would change what gets written *before* the relevant `docs/technical/` section would be read. Anything scoped to a single area belongs in that section alone.
- `README.md` in this folder is a short landing page. Every technical detail belongs in `docs/technical/`, which it links to.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- `package.json` dependencies must use exact versions. No `^` or `~`.
- Use plain React with TypeScript and CSS. Do NOT add an application framework such as Vite, Next.js, Remix or Astro: nothing may own routing, rendering or the component model. Webpack bundles, Babel transforms and Jest runs the tests, and that is the whole build ([§3.3](docs/technical/03-build-and-run.md#33-webpack)).
- Leave ignored files and `.gitignore` patterns alone.
- **Generic "media item" components must stay generic** and must never contain book-, movie-, TV-show- or videogame-specific logic or references. Delegate those to the subtype wrappers, views, rows and definitions controllers that extend the generic ones ([§8.5](docs/technical/08-domain-model.md#85-generic-media-item)).
- **Navigation is action-driven and often saga-driven.** If a screen opens or redirects unexpectedly, inspect `app/redux/sagas/navigation/navigation.ts` before changing a component click handler ([§5.4](docs/technical/05-navigation.md#54-saga-driven-navigation)).
- **`navigationService.setParam()` is intentionally a no-op on web.** Do not build logic that depends on it.
- **Web session persistence deliberately returns list slices as `REQUIRES_FETCH`** so a browser reload behaves like a real refresh. Do not "optimize" that away ([§6.3](docs/technical/06-redux.md#63-the-persistence-contract)).
- **Runtime config is selected through `MEDIA_TRACKER_APP_ENV`.** Keep the dev/prod split working in both webpack and tests when touching config code ([§4.1](docs/technical/04-configuration.md#41-how-the-environment-is-resolved)).
- Controller selection happens in `app/controllers/main/**` based on `config.mocks.*`. Before debugging a data issue, confirm whether the active environment is using mocks or real implementations.
- Most components still follow the original class-component-heavy structure and a centralized global stylesheet. Do not refactor aggressively without a clear payoff.

## Code Conventions

- Match the existing code style exactly, including spacing and newline conventions — tabs and single quotes. Read a neighbouring file before writing a new one.
- Prefer existing project patterns over new abstractions, but do centralize behaviour into shared components/utilities when convenient.
- **Reuse the shared presentational building blocks before creating a screen-specific duplicate**: `generic/responsive-action-menu`, `generic/entity-management-screen`, `generic/entity-management-list`, `generic/entity-details-frame`, `generic/same-name-confirmation`, `generic/color-picker`, `generic/input`, `generic/select`, `generic/textarea`, `generic/field-error`, `generic/responsive-header-add-button`, and the own-platform `icon-registry.ts` ([§11.3](docs/technical/11-interface.md#113-shared-building-blocks)).
- The authenticated experience is a shared sticky top header over a full-bleed dark shell. Preserve that structure instead of reintroducing per-screen navigation chrome or a light-shell variant.
- **Every string the user can read belongs in `app/resources/lang/lang-en.json`**, never inline in a component. Developer-facing strings (log messages, console output, errors only a bug can raise) stay in the module that owns them and stay in English.
- **A form rule the user can trip needs a message from the bundle and a wired `generic/field-error`**, since a disabled Save explains nothing and yup's default message is developer text. Validation belongs in the schema, not in an extra guard next to the Save button ([§11.6](docs/technical/11-interface.md#116-form-validation-feedback)).
- **Styling reuses the semantic tokens in `app/web/styles.css`** and the logic-owned color presets from config. Avoid raw hex or `rgba()` in components unless there is a very good reason.
- **Every hover effect belongs inside a `@media (hover: hover)` block**, since a touch screen's emulated hover makes lists tremble while scrolling. A rule that pairs `:hover` with `:focus-visible` gets split, and the focus half stays outside ([§12.5](docs/technical/12-styling.md#125-hover-effects-are-gated-on-a-hovering-pointer)).
- **For responsive JS behaviour, reuse `MOBILE_LAYOUT_BREAKPOINT` from `app/utilities/layout.ts`.** Do not introduce a new hardcoded breakpoint.
- Tunable values (color presets, date formats, external search URLs, timeouts) belong in `app/config`, not inline in modules.
- `strictNullChecks` is off. Be explicit about nullable cases rather than trusting the compiler ([§15.7](docs/technical/15-invariants-and-pitfalls.md#157-strictnullchecks-is-off)).

## Testing

Testing stays minimal but meaningful: focused unit tests for important logic plus 1-2 smoke tests for critical user flows. New logic in `app/utilities`, `app/redux` and the media-item form data helpers should come with a unit test; a new screen should come with a smoke test.

Prefer focused tests close to the changed component or container — a tiny local Redux store is usually better than importing broad app modules. **Be careful with broad imports in tests**: the decorator-heavy API models can cause unrelated Jest/Babel parsing failures.

The dependency baseline is Node `>=20.9.0`. All three checks must pass before a feature or fix is considered done:

```sh
npm run lint && npm run typecheck && npm test
```

## Workflow

1. For a non-trivial change, read the relevant `docs/technical/` section first.
2. Implement, following the conventions above.
3. Run lint, typecheck, and tests. Fix what breaks.
4. Update the relevant `docs/technical/` section if behaviour, architecture, or repository structure changed.
5. Commit, with an imperative summary as the first line, e.g. `Reject legacy videogame catalog IDs`.

Commit when a task is complete. Do not amend or rewrite existing commits, and do not push unless asked.
