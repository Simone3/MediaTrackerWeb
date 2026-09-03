# Media Tracker — front end

The web application UI: a React + TypeScript single-page app for tracking books, movies, TV shows and videogames. It is the web port of an older React Native mobile app, and it talks to the back end in [`../back-end`](../back-end).

## Run it

Requires Node 24.x, and the back end running locally.

```sh
npm install
npm start
```

The dev server listens on port 5173 with the `dev` configuration. The other combinations:

```sh
npm run build                             # production build, prod config
MEDIA_TRACKER_APP_ENV=prod npm start      # local, prod config
MEDIA_TRACKER_APP_ENV=dev npm run build   # production build, dev config
```

Configure your own URLs and Firebase project in `app/config/properties/config-dev.ts` and `config-prod.ts`. Full setup, including the back end and the external API keys, is in the [repository README](../README.md).

## Checks

```sh
npm run lint && npm run typecheck && npm test
```

## Documentation

[`docs/technical/`](docs/technical/README.md) is the implementation reference — architecture, navigation, Redux, the data layer, the features and the invariants. [`CLAUDE.md`](CLAUDE.md) holds the rules for working in this folder.
