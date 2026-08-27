# §3 — Build and run

*[Index](README.md) · [← §2 Repository map](02-repository-map.md)*

The commands, what each one does, and how webpack is wired.

---

## 3.1 Node baseline

`engines.node` is `>=20.9.0`. Dependencies are pinned to exact versions — no `^`, no `~` — so an install reproduces the same tree.

## 3.2 Commands

```sh
npm start          # webpack dev server, development mode, port 5173
npm run build      # webpack production build
npm run lint       # ESLint over app/, tests/ and index.tsx
npm run typecheck  # tsc --noEmit
npm test           # Jest
```

The environment the bundle is built or served with comes from `MEDIA_TRACKER_APP_ENV` ([§4](04-configuration.md)), so all four combinations are available:

```sh
npm start                                  # local, dev config
MEDIA_TRACKER_APP_ENV=prod npm start       # local, prod config
npm run build                              # production build, prod config
MEDIA_TRACKER_APP_ENV=dev npm run build    # production build, dev config
```

Running the app end to end also needs the back end from `../back-end` and a MongoDB instance behind it; the repository root `README.md` has that setup.

While iterating, prefer running one test file:

```sh
npm test -- tests/media-item-form-data.test.ts
```

## 3.3 Webpack

`webpack.config.js` owns:

- the dev server on port **5173**, with the history API fallback on so deep links into `/media/...` resolve to the SPA
- the `app` alias, which is what makes `app/...` imports resolve
- `public/index.html` as the served and built template
- the injected define `__MEDIA_TRACKER_APP_ENV__`
- the injected define `__MEDIA_TRACKER_BACK_END_BASE_URL__`, only when the variable is provided

Both defines are read back through `app/utilities/env.ts`, which is what lets the same config code work in the browser bundle and under Jest, where neither define exists ([§4.1](04-configuration.md#41-how-the-environment-is-resolved)). `tests/webpack-config.test.ts` covers the config itself, so a change here has a test to answer to.

**No application framework owns the build.** Webpack bundles, Babel transforms and Jest runs the tests; routing, rendering and the component model stay plain React. Do not introduce Vite, Next.js or an equivalent ([§1.2](01-architecture.md#12-it-is-a-port-and-it-still-reads-like-one)).

---

[← §2 Repository map](02-repository-map.md) · [§4 Configuration →](04-configuration.md)
