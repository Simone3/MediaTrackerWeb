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
- `public/index.html` as the served and built template, which also carries the boot placeholder ([§12.4](12-styling.md#124-the-boot-placeholder))
- the injected define `__MEDIA_TRACKER_APP_ENV__`
- the injected define `__MEDIA_TRACKER_BACK_END_BASE_URL__`, only when the variable is provided

Both defines are read back through `app/utilities/env.ts`, which is what lets the same config code work in the browser bundle and under Jest, where neither define exists ([§4.1](04-configuration.md#41-how-the-environment-is-resolved)). `tests/webpack-config.test.ts` covers the config itself, so a change here has a test to answer to.

**No application framework owns the build.** Webpack bundles, Babel transforms and Jest runs the tests; routing, rendering and the component model stay plain React. Do not introduce Vite, Next.js or an equivalent ([§1.2](01-architecture.md#12-it-is-a-port-and-it-still-reads-like-one)).

## 3.4 Build output and caching

The build lays `dist/` out in two halves, and the split is what makes the caching rule safe to write:

```
dist/
├── index.html          no content hash — must always be revalidated
├── ic_app_logo.png     the favicon, copied by HtmlWebpackPlugin
└── assets/             every content-hashed output, and nothing else
    ├── bundle.<hash>.js
    └── <hash>.png
```

`output.filename` and `output.assetModuleFilename` both write into `assets/`, so a file under that folder can never change without changing its name. `render.yaml` gives `/assets/*` a `Cache-Control` of `public, max-age=31536000, immutable`; everything outside it keeps the platform default. **Do not emit an unhashed file into `assets/`** — it would be cached for a year with no way to invalidate it, which is exactly why the favicon and `index.html` stay at the root.

Without that header the static host defaults to `max-age=0`, which makes the browser revalidate every asset on every page load — the icons then visibly pop in a fraction of a second after the rest of the page.

## 3.5 Images are inlined into the bundle

`.svg` is an `asset/inline` module: an icon becomes a data URI inside the bundle, so it costs no request and paints with the first render. `.png`, `.jpg` and `.gif` are `asset` modules with a 4 KB threshold — under it they inline too, over it they are emitted into `assets/` as their own file. Every image in the project is currently under the threshold, so **a production page loads `index.html`, the bundle and nothing else**; the threshold exists so that adding a real photograph does not silently bloat the bundle.

The data URI is **URI-escaped, not base64**. Two reasons, and both are load-bearing:

- an escaped SVG stays text, so it compresses roughly as well as the file it replaces, where base64 would not
- the escaping covers `(`, `)`, `"`, `'` and whitespace on top of what `encodeURIComponent` handles, because own-platform icons end up inside an unquoted CSS `url(...)` in a mask ([§12.3](12-styling.md#123-colors-that-come-from-config)), and any of those characters would terminate it early

`svgToDataUri` in `webpack.config.js` owns that escaping and `tests/webpack-config.test.ts` covers it.

Source SVGs in `app/resources/images` are kept optimized — they were exported from drawing tools and arrived carrying editor metadata, roughly two thirds of their bytes. Run a new icon through SVGO before committing it, and keep its `viewBox`: the icons are scaled by CSS, and several are painted through `mask-size: contain`.

## 3.6 Which artwork is vector and which is not

`ic_app_logo.svg` and `im_media_item_form_default.svg` are the app's own mark — a ring, a round-capped handle and three cube faces — redrawn as vector primitives from the PNGs they replaced, so they stay sharp on high-DPI screens where the 155 px original was visibly soft.

Two deliberate exceptions:

- **`ic_app_logo.png` stays**, and is referenced by nothing but the `HtmlWebpackPlugin` favicon option. SVG favicon support is still uneven, and the favicon is one uncached root-level request either way. Change both files when the mark changes.
- **`ic_google.png`, `ic_wikipedia.png`, `ic_justwatch.png` and `ic_howlongtobeat.png` are third-party brand marks** and are left as raster on purpose. Tracing someone else's logo produces a poor imitation of it; the right fix is the official vector asset, not a redrawing. They are 30 px sources shown at 20 CSS px, so they are soft on high-DPI screens.

---

[← §2 Repository map](02-repository-map.md) · [§4 Configuration →](04-configuration.md)
