# §16 — Testing

*[Index](README.md) · [← §15 Utilities](15-utilities.md)*

Unlike the front end, this side aims for **broad coverage**: as much logic as practical, through both unit and integration tests. The integration tests run against a real MongoDB and a real Express server, so they exercise the middleware stack, validation and persistence together.

---

## 16.1 Test startup

`test/global/global-init-tests.ts` does three things, in this order:

- loads `reflect-metadata`
- **overrides `MEDIA_TRACKER_BE_CONFIG` with `testConfig`**, before the config module resolves anything ([§4.1](04-configuration.md#41-source-of-truth))
- installs the Firebase auth mocks

The ordering matters: config is loaded and validated once, synchronously, at import time — so the override has to happen before anything imports it.

## 16.2 Test config

`test/global/config-test.ts` points tests at:

- local MongoDB at `mongodb://127.0.0.1:27017/mediaTrackerBackEndTestDatabase`
- mocked external API base URLs ([§16.5](#165-external-api-mocking))
- logging disabled, with `level: 'off'`

**That database is dropped after every test.** It must not be one that matters.

## 16.3 Auth mocking

`test/helpers/auth-handler-helper.ts` replaces `firebase-admin`'s `auth` with a fake implementation. The test token is simply **a JSON string containing a `uid`**.

That is what lets integration tests exercise the real authentication and authorization middleware — including the `403` on a `:userId` mismatch ([§5.2](05-authentication.md#52-authorization)) — without a Firebase project or a network round trip.

## 16.4 Server and database helpers

- **`setupTestServer()`** starts and stops Express once per suite
- **`setupTestDatabaseConnection()`** connects once, drops the database after each test, and closes at the end

Per-suite server, per-test database: the expensive thing happens once, and isolation still holds.

`test/helpers/` also carries the API caller, the entity builders and the comparison helpers that keep the integration tests readable.

## 16.5 External API mocking

`test/mocks/external-services-mocks.ts` uses `nock` to fake:

- TMDb movie routes
- TMDb TV routes
- Google Books routes
- Twitch auth and IGDB videogame routes

The static payloads live in `test/resources/mocks/`. Some of them are **deliberately malformed** — a book search with a titleless volume and a null element, a movie details response with an unnamed genre and an unnamed crew member — so that the discard-and-serve behaviour is exercised through the real route stack and not only in the parser's unit tests ([§6.4](06-validation-and-errors.md#64-tolerating-bad-provider-data)).

## 16.6 What the suite already covers

- request validation on routes
- authentication and authorization behaviour
- CRUD for categories, groups, own platforms and every media type
- filtering, sorting and searching
- the media items stats aggregate: the five status branches, the completion years and their time zone, the filters and the cross-user isolation
- population of linked group and own-platform data
- catalog mapping, including the responses whose invalid list items are discarded
- legacy import mapping
- the own-platform merge
- the category media-type-change restriction
- TV show season validation

## 16.7 Running them

```sh
npm run lint && npm run typecheck && npm test
```

`npm test` runs `nyc node test/run-tests.cjs`, and needs the local MongoDB above plus the ability to bind the local test server port.

---

[← §15 Utilities](15-utilities.md) · [§17 Extension playbooks →](17-extension-playbooks.md)
