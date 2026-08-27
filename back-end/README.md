# Media Tracker — back end

The REST API behind Media Tracker: plain Express + TypeScript on MongoDB via Mongoose, authenticated with Firebase. It serves the web UI in [`../front-end`](../front-end) and proxies the external catalogs (TMDb, Google Books, IGDB).

## Run it

Requires Node 22.x, a running MongoDB, and a configuration.

```sh
npm install
npm run build
npm start
```

Configuration comes from the `MEDIA_TRACKER_BE_CONFIG` environment variable holding the JSON, or from `app/config/MEDIA_TRACKER_BE_CONFIG.json` as a local fallback. `app/config/config-sample.ts` is the template. Full setup, including the MongoDB URL, the external API keys and the Firebase service account, is in the [repository README](../README.md).

For an iterating loop, `npm run debug` skips the build and reloads on change.

## Checks

```sh
npm run lint && npm run typecheck && npm test
```

`npm test` needs a local MongoDB — it uses, and drops, the test database named in `test/global/config-test.ts`.

## Documentation

[`docs/technical/`](docs/technical/README.md) is the implementation reference — architecture, the API surface, the domain model, persistence, the controllers and the invariants. [`CLAUDE.md`](CLAUDE.md) holds the rules for working in this folder.
