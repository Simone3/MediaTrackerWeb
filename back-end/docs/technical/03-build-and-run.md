# §3 — Build and run

*[Index](README.md) · [← §2 Repository map](02-repository-map.md)*

---

## 3.1 Node baseline

`engines.node` is `24.x`. Dependencies are pinned to exact versions — no `^`, no `~` — so an install reproduces the same tree.

## 3.2 Commands

```sh
npm run build      # tsc, then tsc-alias, then copy the config fallback into build/
npm start          # node build/index.js  (requires a build first)
npm run debug      # ts-node-dev with --inspect and --respawn, no build step
npm run lint       # ESLint over app/, test/ and index.ts
npm run typecheck  # tsc --noEmit
npm test           # nyc node test/run-tests.cjs
```

**The build is three steps for a reason.** `tsc` emits JavaScript that still contains the TypeScript path aliases; `tsc-alias` rewrites them to real relative paths so Node can resolve them; `copyfiles` then places `app/config/MEDIA_TRACKER_BE_CONFIG.json` inside `build/app/config`, because the config loader's file fallback looks for it beside the compiled code ([§4.1](04-configuration.md#41-source-of-truth)).

## 3.3 Running locally

`npm test` and a local run both need MongoDB. Tests point at `mongodb://127.0.0.1:27017/mediaTrackerBackEndTestDatabase` and drop that database after each test ([§16.2](16-testing.md#162-test-config)), so it must not be a database that matters.

A run also needs configuration: either the `MEDIA_TRACKER_BE_CONFIG` environment variable holding the JSON, or the fallback file. The repository root `README.md` has the full setup, including the external API keys and the Firebase project.

```sh
npm install
npm run build
npm start
```

`npm run debug` skips the build and reloads on change, which is the loop to use while iterating.

## 3.4 Deployment

`render.yaml` in the repository root describes the Render Blueprint. Render supplies `MEDIA_TRACKER_BE_CONFIG` as a secret environment variable at Blueprint setup, and `PORT` from the environment overrides `config.server.port` ([§4.1](04-configuration.md#41-source-of-truth)).

**The checked-in `app/config/MEDIA_TRACKER_BE_CONFIG.json` is a local fallback only.** Do not rely on it for a Render deploy; the environment variable is the production source.

## 3.5 What must not own the build

Plain Express with TypeScript. Do NOT add an application framework such as NestJS: nothing may own routing, dependency injection or the controller model.

---

[← §2 Repository map](02-repository-map.md) · [§4 Configuration →](04-configuration.md)
