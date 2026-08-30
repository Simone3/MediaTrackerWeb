# §4 — Configuration

*[Index](README.md) · [← §3 Build and run](03-build-and-run.md)*

How the app decides which environment it is in, and everything the config object owns beyond that.

---

## 4.1 How the environment is resolved

`app/config/config.ts` resolves the active runtime config from `MEDIA_TRACKER_APP_ENV`, whose supported values are `dev` and `prod`.

`app/utilities/env.ts` looks in three places, in this order:

1. `globalThis.__MEDIA_TRACKER_ENV__`
2. `process.env`
3. the webpack-injected defines `__MEDIA_TRACKER_APP_ENV__` and `__MEDIA_TRACKER_BACK_END_BASE_URL__`

With no override at all, the environment is `dev`.

**Three sources exist because three runtimes need to answer the question.** The browser bundle has only the webpack defines, Node-side tooling has only `process.env`, and a test needs to set the value from inside the process without either. Keep all three paths working when touching config code — `tests/config.test.ts` and `tests/webpack-config.test.ts` both depend on it.

## 4.2 Dev config

`app/config/properties/config-dev.ts`

- back-end base URL: `http://localhost:3000`
- request timeout: `5000`
- `assumeWellFormedResponse: false`
- Firebase project: `media-tracker-dev-db499`
- all mocks disabled by default

## 4.3 Prod config

`app/config/properties/config-prod.ts`

- back-end base URL: `MEDIA_TRACKER_BACK_END_BASE_URL`, falling back to `https://media-tracker-back-end.onrender.com`
- request timeout: `10000`
- `assumeWellFormedResponse: true`
- Firebase project: `media-tracker-da288`
- all mocks disabled by default

**`assumeWellFormedResponse` is the one behavioural difference that matters.** With it off, every REST response is validated against its API model before the app touches it, and a back end that drifts fails loudly in development. With it on, that validation is skipped for speed in production ([§9.3](09-data-layer.md#93-rest-transport)).

## 4.4 What else config owns

Beyond the environment split, the config object is where tunable values live rather than being inlined in components:

- **category and own-platform color presets** — the palettes the color picker offers ([§12.3](12-styling.md#123-colors-that-come-from-config))
- **the default date format**
- **`ui.mediaItemsPageSize`**, how many media items one page of the list holds. It is the `limit` the filter and search requests send, so it must stay within the back end's `PAGINATION_MAX_LIMIT` of 100 ([§10.2](10-features.md#102-media-items-list))
- **external search URL builders** for Google, Wikipedia, JustWatch and HowLongToBeat, used by the media-item form's action buttons ([§10.3](10-features.md#103-media-item-details))
- **logging flags** for request and mapping debug output
- **`mocks.*`**, the flags that decide which controller implementation is live ([§9.2](09-data-layer.md#92-runtime-controller-selection))

---

[← §3 Build and run](03-build-and-run.md) · [§5 Navigation →](05-navigation.md)
