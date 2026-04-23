# Media Tracker Back-End Documentation

## Purpose

This document is the internal reference for the back-end codebase.

It is meant to answer these questions quickly:

- What the service does and how requests flow through it
- Which entities exist and how they relate to each other
- Which routes are available and what behavior they implement
- Where validation, mapping, persistence, logging, and external integrations live
- Which invariants must be preserved when adding new features
- How tests are structured and what they already guarantee

The codebase is a plain Express + TypeScript application backed by MongoDB/Mongoose and Firebase authentication.
The current runtime target is Node.js 22.x, as declared in `package.json`.

## High-Level Architecture

The app follows a fairly regular layered structure:

- `app/server`
  Builds the Express app, mounts middleware, and registers routers.
- `app/routes`
  Defines HTTP endpoints and converts request/response payloads.
- `app/controllers`
  Contains business logic, database access helpers, external catalog integrations, and the legacy import flow.
- `app/data/models`
  Defines API models, internal models, external service payload models, and error models.
- `app/data/mappers`
  Converts between API models, internal models, external API payloads, and legacy-import payloads.
- `app/schemas`
  Defines Mongoose schemas and collection names.
- `app/auth`
  Firebase authentication and user-resource authorization.
- `app/config`
  Runtime configuration loading and validation.
- `app/loggers`
  Application, request/response, database, performance, and external API logging.
- `app/utilities`
  Shared helpers such as request-scoped context, validation, date conversion, string helpers, and misc helpers.
- `app/factories`
  Small resolution helpers, mainly to map category media type to the correct media-item controllers.

The typical request flow is:

1. `index.ts` loads `reflect-metadata` and calls `init()`.
2. `app/app.ts` initializes Firebase, starts Express, then opens the MongoDB connection.
3. `app/server/server.ts` builds the middleware stack and mounts routers.
4. A router validates the payload with `parserValidator`, maps API objects to internal models, and calls a controller.
5. A controller performs precondition checks and uses `QueryHelper` or an external catalog controller.
6. The route maps the result back to API models and sends JSON.

## Runtime And Startup

### Entrypoint

- `index.ts`
  Imports `reflect-metadata` and calls `init()`.

### Application bootstrap

- `app/app.ts`
  - Logs startup
  - Initializes Firebase Admin using `config.firebase.serviceAccountKey` and `config.firebase.databaseUrl`
  - Starts the Express server on `config.server.port`
  - Opens the MongoDB connection after `listen()`
  - Registers a graceful shutdown hook with `exit-hook`

Shutdown closes:

- log4js
- the Express server instance
- the Mongoose connection

### Express setup

`app/server/server.ts` configures the app in this order:

1. `express.json({ limit: '10mb' })`
2. `requestScopeContextMiddleware`
3. CORS with:
   - `origin: '*'`
   - `credentials: true`
   - `methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`
   - `preflightContinue: true`
4. `authenticationMiddleware`
5. logging middleware
6. routers
7. final catch-all 404 router

There is no central error-handling middleware. Each route handles its own failures inline.

## Configuration

### Source Of Truth

Configuration is loaded by `app/config/config.ts`.

Order of resolution:

1. `MEDIA_TRACKER_BE_CONFIG` environment variable, parsed as JSON
2. fallback file `app/config/MEDIA_TRACKER_BE_CONFIG.json`

After loading:

- it is validated synchronously against `Config` from `app/config/type-config.ts`
- `PORT`, if set in the environment, overrides `config.server.port`

If parsing or validation fails, the app throws at startup.

### Main config sections

The full shape lives in `app/config/type-config.ts`.
`app/config/config-sample.ts` is the best human-readable template.

Main sections:

- `server.port`
- `db.url`
- `externalApis`
- `log`
- `firebase`

### External API config

Configured external catalog providers:

- TMDb for movies
- TMDb for TV shows
- Google Books for books
- Giant Bomb for videogames

Shared external API settings:

- `externalApis.timeoutMilliseconds`
- `externalApis.userAgent`

### Logging config

Configured in `config.log`:

- `level`: `debug | info | error | off`
- `file`
- `apisInputOutput.active`
- `apisInputOutput.excludeRequestBodyRegExp`
- `apisInputOutput.excludeResponseBodyRegExp`
- `externalApisInputOutput.active`
- `databaseQueries.active`
- `performance.active`

Important detail:

- `config.log.file` is required by config validation.
- If it is a non-empty string, logs go to both file and console.
- If it is an empty string, logger setup falls back to console-only.

## Authentication And Authorization

### Authentication

`app/auth/authentication.ts` enforces Firebase ID token authentication.

Behavior:

- `OPTIONS` requests are always allowed
- `GET /status` is always allowed
- every other route requires `Authorization: Bearer <token>`
- the token is verified with `firebase-admin/auth().verifyIdToken(...)`
- on success, `requestScopeContext.currentUserId` is set to the Firebase UID
- on failure, the route returns `401 { error: 'Unauthorized' }`

### Authorization

`app/auth/authorization.ts` contains `userResourceAuthorizationMiddleware`.

It applies only to routes that include `:userId`.

Behavior:

- reads `request.params.userId`
- reads `requestScopeContext.currentUserId`
- returns `403 { error: 'Forbidden' }` if they differ

Current authorization model is intentionally simple:

- a user can only access their own resources
- there is no admin mode
- there is no shared-resource access

### Catalog routes

Catalog routes do not contain `:userId`, so they are not user-authorized.
However, they are still authenticated, because `authenticationMiddleware` is mounted globally before the routers.

## Request Scope And Logging Context

`app/utilities/request-scope-context.ts` uses `express-http-context` to store per-request values:

- `currentUserId`
- `correlationId`

`app/loggers/express-logger.ts` sets a correlation ID with `uuid.v4()` early in the middleware chain.

`app/loggers/logger.ts` injects both values into the log layout:

- current user ID
- correlation ID

Log layout:

- `[%d] [%x{currentUserId}] [%x{correlationId}] %p %c - %m`

## Validation Strategy

### Request and config validation

Validation is centralized in `app/utilities/parser-validator.ts`.

It wraps `class-transformer-validator` and is used for:

- runtime config validation
- route request validation
- external API response validation, unless the caller explicitly opts out

The validation layer is model-driven:

- API payloads are classes in `app/data/models/api/**`
- config is a class in `app/config/type-config.ts`
- external service responses are classes in `app/data/models/external-services/**`

### Error behavior

If request validation fails, routes generally respond with:

- HTTP `500`
- error payload derived from `AppError.INVALID_REQUEST`

This is a deliberate current behavior of the codebase, even though a `400` would usually be more conventional.

## Error Model

Errors are represented by `AppError` in `app/data/models/error/error.ts`.

Important predefined error groups:

- generic application errors
- auth/authz errors
- not found
- invalid request
- database init/find/save/delete
- database uniqueness
- external API invocation/timeout/parsing/generic

Routes usually convert `AppError` into API payloads via `errorResponseFactory`.

Important detail:

- `errorResponseFactory` unwraps nested `AppError` chains and exposes the first source error code/description/details.

## Domain Model

### Ownership model

There is no `User` collection in this project.
Ownership is tracked by Firebase UID strings stored directly in documents.

### Category

Internal model: `app/data/models/internal/category.ts`

Fields:

- `_id`
- `name`
- `mediaType`
- `color`
- `owner`

Meaning:

- a category belongs to one user
- a category has exactly one media type
- that media type determines which media-item controller/schema/routes are valid under it

### Group

Internal model: `app/data/models/internal/group.ts`

Fields:

- `_id`
- `name`
- `owner`
- `category`

Meaning:

- groups are category-scoped
- groups are optional on media items
- groups can be used to order media items with `orderInGroup`

### Own Platform

Internal model: `app/data/models/internal/own-platform.ts`

Fields:

- `_id`
- `name`
- `color`
- `icon`
- `owner`
- `category`

Meaning:

- an own platform represents where the user owns an item
- examples are physical/digital platforms or storefronts
- own platform references on media items are optional

### Media Item Common Fields

Internal base model: `app/data/models/internal/media-items/media-item.ts`

Common fields:

- `_id`
- `name`
- `genres`
- `description`
- `releaseDate`
- `imageUrl`
- `catalogId`
- `category`
- `group`
- `orderInGroup`
- `ownPlatform`
- `owner`
- `importance`
- `userComment`
- `completedOn`
- `completedLastOn`
- `active`
- `markedAsRedo`

Important semantics:

- `importance` is one of `'100' | '200' | '300' | '400'`
- `completedOn` stores the full list of completion dates
- `completedLastOn` is denormalized from `completedOn` for easier sorting/filtering
- `active` means currently reading/watching/playing
- `markedAsRedo` means the item was completed before but moved back into the active/current workflow

### Media-Type Specific Fields

Movie:

- `directors`
- `durationMinutes`

TV show:

- `creators`
- `averageEpisodeRuntimeMinutes`
- `seasons`
- `inProduction`
- `nextEpisodeAirDate`

Book:

- `authors`
- `pagesNumber`

Videogame:

- `developers`
- `publishers`
- `platforms`
- `averageLengthHours`

### TV show seasons

Schema-level validation enforces:

- season number must be positive
- season numbers must be unique
- seasons must already be sorted in ascending order

This is implemented in `app/schemas/media-items/tv-show.ts`.

## Persistence Model

### Collections

Collection names:

- `Category`
- `Group`
- `OwnPlatform`
- `Movie`
- `TvShow`
- `Book`
- `Videogame`

### Reference strategy

References are stored as:

- `category` -> `Category` ObjectId
- `group` -> `Group` ObjectId
- `ownPlatform` -> `OwnPlatform` ObjectId

Owner is not a MongoDB reference:

- `owner` is a raw Firebase UID string

### Common media-item schema

Shared fields are defined once in `app/schemas/media-items/media-item.ts`.
Each media type adds its own extra fields in its specific schema file.

### Populate behavior

Media-item read paths use populate for:

- `group`
- `ownPlatform`

This is why API responses can include nested `groupData` and `ownPlatformData`.

## Controllers

### `QueryHelper`

`app/controllers/database/query-helper.ts` is the shared database helper used by controllers.

Capabilities:

- `find`
- `findOne`
- `save`
- `updateSelectiveMany`
- `deleteById`
- `delete`
- `checkUniquenessAndSave`

Important details:

- `find` uses English collation for case-insensitive sorting
- optional populate flags are supported
- query performance logging is emitted when enabled
- `checkUniquenessAndSave` exists, but the current entity controllers do not use it

### `AbstractEntityController`

Shared helper methods:

- `checkExistencePreconditionsHelper(...)`
- `getEntityStringId(...)`

This is the base used by category/group/own-platform/media-item controllers.

### `CategoryController`

File: `app/controllers/entities/category.ts`

Responsibilities:

- load categories for a user
- filter by exact case-insensitive name
- save category
- delete category
- delete all categories for a user

Important rule:

- category media type cannot be changed if the category already contains media items

Delete behavior cascades to:

- all groups in the category
- all media items in the category, through the media-type-specific controller resolved by `mediaItemFactory`
- all own platforms in the category
- the category itself

### `GroupController`

File: `app/controllers/entities/group.ts`

Responsibilities:

- load/filter/save/delete groups
- delete all groups for a category or user

Delete behavior:

- deleting a group also deletes all media items in that group

### `OwnPlatformController`

File: `app/controllers/entities/own-platform.ts`

Responsibilities:

- load/filter/save/delete own platforms
- merge multiple own platforms into one
- delete all own platforms for a category or user

Delete behavior:

- deleting an own platform does not delete media items
- instead, it unsets `ownPlatform` on all matching media items in the category

Merge behavior:

- at least two own-platform IDs are required
- all input platforms must belong to the same user/category
- the first ID in `ownPlatformIds` becomes the kept platform ID
- merged data is saved into that kept ID
- all media items pointing at the other platform IDs are rewritten to the kept ID
- the other platform documents are deleted

### `MediaItemEntityController`

File: `app/controllers/entities/media-items/media-item.ts`

This is the most important shared controller in the codebase.

Responsibilities:

- get one media item
- get all media items for a category
- filter and sort media items
- search media items by term
- save/update/delete media items
- bulk delete by group/category/user
- bulk replace own-platform references

Key behaviors:

- inserts verify that category media type matches the controller media type
- writes verify referenced group and own platform exist when provided
- read/filter/search operations populate group and own-platform references

Shared filtering supported for all media types:

- `importanceLevels`
- `complete`
- `name`
- `groups.anyGroup`
- `groups.noGroup`
- `groups.groupIds`
- `ownPlatforms.anyOwnPlatform`
- `ownPlatforms.noOwnPlatform`
- `ownPlatforms.ownPlatformIds`

`complete` filter semantics:

- `true`
  returns items with `completedLastOn != undefined` and `markedAsRedo != true`
- `false`
  returns items with `completedLastOn == undefined` or `markedAsRedo == true`

Shared sort fields supported for all media types:

- `IMPORTANCE`
- `NAME`
- `GROUP`
- `OWN_PLATFORM`
- `COMPLETION_DATE`
- `ACTIVE`
- `RELEASE_DATE`

Search behavior:

- case-insensitive substring matching
- always searches by `name`
- also searches a type-specific field depending on media type
- search term is regex-escaped, so literal characters like `.*` do not become regex wildcards

### Media-specific entity controllers

Movie:

- default sort: `NAME asc`
- type-specific search: `directors`
- type-specific sort: `DIRECTOR`

TV show:

- default sort: `NAME asc`
- type-specific search: `creators`
- type-specific sort: `CREATOR`

Book:

- default sort: `NAME asc`
- type-specific search: `authors`
- type-specific sort: `AUTHOR`

Videogame:

- default sort: `NAME asc`
- type-specific search: `developers`
- type-specific sort: `DEVELOPER`

## Factories

### `mediaItemFactory`

File: `app/factories/media-item.ts`

Purpose:

- resolve the correct entity controller or catalog controller from a category or media type

Why it matters:

- category delete needs it to know which media-item collection to clear
- any future cross-media-type workflow should use this instead of duplicating switch statements

Supported media types:

- `BOOK`
- `MOVIE`
- `TV_SHOW`
- `VIDEOGAME`

## API Surface

All routes are mounted under `/`.

### Health

- `GET /status`
  - no authentication
  - returns `{ status: 'Running' }`

### Categories

- `GET /users/:userId/categories`
- `POST /users/:userId/categories/filter`
- `POST /users/:userId/categories`
- `PUT /users/:userId/categories/:id`
- `DELETE /users/:userId/categories/:id`

Notes:

- filter supports exact case-insensitive name match
- results are sorted by name ascending

### Groups

- `GET /users/:userId/categories/:categoryId/groups`
- `POST /users/:userId/categories/:categoryId/groups/filter`
- `POST /users/:userId/categories/:categoryId/groups`
- `PUT /users/:userId/categories/:categoryId/groups/:id`
- `DELETE /users/:userId/categories/:categoryId/groups/:id`

Notes:

- filter supports exact case-insensitive name match
- results are sorted by name ascending

### Own Platforms

- `GET /users/:userId/categories/:categoryId/own-platforms`
- `POST /users/:userId/categories/:categoryId/own-platforms/filter`
- `POST /users/:userId/categories/:categoryId/own-platforms`
- `PUT /users/:userId/categories/:categoryId/own-platforms/merge`
- `PUT /users/:userId/categories/:categoryId/own-platforms/:id`
- `DELETE /users/:userId/categories/:categoryId/own-platforms/:id`

Notes:

- filter supports exact case-insensitive name match
- results are sorted by name ascending

### Media-item entity routes

For each type:

- movies -> `/users/:userId/categories/:categoryId/movies`
- tv shows -> `/users/:userId/categories/:categoryId/tv-shows`
- books -> `/users/:userId/categories/:categoryId/books`
- videogames -> `/users/:userId/categories/:categoryId/videogames`

Per type, the following route pattern exists:

- `GET /users/:userId/categories/:categoryId/<type>`
- `POST /users/:userId/categories/:categoryId/<type>/filter`
- `POST /users/:userId/categories/:categoryId/<type>/search`
- `POST /users/:userId/categories/:categoryId/<type>`
- `PUT /users/:userId/categories/:categoryId/<type>/:id`
- `DELETE /users/:userId/categories/:categoryId/<type>/:id`

### Catalog routes

Per type:

- `GET /catalog/movies/search/:searchTerm`
- `GET /catalog/movies/:catalogId`
- `GET /catalog/tv-shows/search/:searchTerm`
- `GET /catalog/tv-shows/:catalogId`
- `GET /catalog/books/search/:searchTerm`
- `GET /catalog/books/:catalogId`
- `GET /catalog/videogames/search/:searchTerm`
- `GET /catalog/videogames/:catalogId`

Notes:

- catalog routes are authenticated
- they are not user-resource-authorized
- they proxy external catalog lookups after mapping the results into the app's internal/API model

### Legacy import

- `POST /users/:userId/import/old-app`

Behavior:

- clears all existing entities for that user first
- imports categories and their media items from the old export format
- creates one default own platform per imported category from the request options

### Catch-all

- all unknown routes end in `catch-all.ts`
- returns HTTP `404` with `AppError.NOT_FOUND`

## API Models And Mapping

### Separation of models

The app keeps four separate model families:

- API models
  `app/data/models/api/**`
- internal models
  `app/data/models/internal/**`
- external service response models
  `app/data/models/external-services/**`
- legacy import models
  `app/data/models/api/import/**` and `app/data/models/internal/import/**`

### Why the mapper layer exists

Routes do not pass raw request bodies directly into controllers.
Instead they use mappers so that:

- API types can stay stable even if persistence changes
- internal models can use `Date`, object references, and DB-oriented shapes
- external APIs can be normalized into the app's own contract

### Generic mapper base

`app/data/mappers/common.ts` defines `ModelMapper<TInternal, TExternal, TParams>`.

It provides:

- `toExternal`
- `toExternalList`
- `toInternal`
- `toInternalList`

It also logs every mapping at debug level.

### Media-item mapper conventions

Common media-item mapping rules in `app/data/mappers/media-items/media-item.ts`:

- API date strings become `Date`
- `completedOn` is sorted before deriving `completedLastOn`
- populated `group` and `ownPlatform` references become nested API objects with `groupData` and `ownPlatformData`
- boolean-ish values are normalized through `miscUtils.parseBoolean(...)`

## External Catalog Integrations

### Shared external invoker

`app/controllers/external-services/rest-json-invoker.ts` is the common HTTP client.

Behavior:

- uses `axios`
- always sends JSON headers and configured `User-Agent`
- supports query params, headers, request body, and timeout
- logs request/response when enabled
- validates JSON responses against typed classes unless `assumeWellFormedResponse` is set

Timeout handling:

- implemented with an Axios cancel token plus `setTimeout(...)`
- maps timeout failures to `AppError.EXTERNAL_API_TIMEOUT`

### Movies

Provider:

- TMDb

Search mapping:

- `title` -> name
- `release_date` -> release date

Details mapping:

- `title`
- `genres[].name`
- `overview`
- `release_date`
- backdrop image URL built from configured TMDb image base path
- directors extracted from `credits.crew` by matching configured `directorJobName`
- `runtime`

### TV shows

Provider:

- TMDb

Search mapping:

- `name`
- `first_air_date`

Details mapping:

- `name`
- `genres[].name`
- `overview`
- `first_air_date`
- backdrop image URL built from configured TV image base path
- creators from `created_by[].name`
- average episode runtime from `episode_run_time[]`
- seasons from TMDb season list, excluding season number `0`
- `in_production`

Extra behavior:

- if the show is still in production and TMDb returns at least one season, the controller makes an extra season request for the latest season
- it then infers `nextEpisodeAirDate` from future episodes in that season

### Books

Provider:

- Google Books

Search mapping:

- `volumeInfo.title`
- `volumeInfo.publishedDate`

Details mapping:

- title
- categories
- description
- published date
- authors
- page count
- image URL preference:
  - `imageLinks.medium`
  - fallback `imageLinks.thumbnail`

### Videogames

Provider:

- Giant Bomb

Search/details mapping:

- name
- genres
- deck -> description
- developers
- publishers
- platforms

Release date rule:

- if Giant Bomb provides expected release year/month/day fields, they are combined into a UTC date
- otherwise `original_release_date` is used

Image URL preference:

- `screen_url`
- fallback `medium_url`

## Legacy Import Flow

### Purpose

The old-app import endpoint migrates exports from an earlier Media Tracker application format into the current schema.

### Controller flow

`app/controllers/import/old-app.ts`:

1. delete all media items for the user across every media type
2. delete all groups for the user
3. delete all own platforms for the user
4. delete all categories for the user
5. recreate imported categories
6. create a default own platform for each imported category
7. recreate imported media items under the new category

### Legacy category mapping

`app/data/mappers/import/old-app/category.ts` converts:

- old media types
  - `BOOKS` -> `BOOK`
  - `MOVIES` -> `MOVIE`
  - `TV_SHOWS` -> `TV_SHOW`
  - `VIDEOGAMES` -> `VIDEOGAME`
- old colors into hardcoded hex values

### Legacy media-item mapping

`app/data/mappers/import/old-app/media-items/media-item.ts` handles common legacy fields.

Important rules:

- old importance enum becomes the new four-level string enum
- old `OWNED` boolean does not become a boolean field
  - it determines whether the imported item gets linked to the default imported own platform
- old `DOING_NOW` becomes `active`
- old `COMPLETION_DATE` becomes the completion date
- old `TIMES_COMPLETED` duplicates that date into `completedOn`

Redo behavior:

- if `COMPLETION_DATE` is missing but `TIMES_COMPLETED > 0`, the import assumes the item had been completed before and is now a redo
- in that case:
  - `markedAsRedo = true`
  - the synthetic completion date defaults to the current day at midnight

Type-specific legacy mappers then add:

- movie: directors, duration
- tv show: creators, runtime, in-production flag, next-episode air date
- book: authors, page count
- videogame: developers, publishers, platforms, average length

Current limitation:

- legacy groups are not imported
- imported TV-show seasons are left `undefined`

## Logging

### Logger categories

Defined in `app/loggers/logger.ts`:

- `logger`
  general application logs
- `inputOutputLogger`
  API request/response logs
- `externalInvocationsInputOutputLogger`
  external HTTP request/response logs
- `databaseLogger`
  Mongoose debug logging
- `performanceLogger`
  request/query/external-call timings

### Request/response logging

`app/loggers/express-logger.ts`:

- logs request bodies unless URL matches configured exclusion regexes
- logs response bodies unless URL matches configured exclusion regexes
- uses `express-mung` to log JSON responses

The default sample config excludes request body logging for:

- `^/users/[^/]+/import/old-app$`

That is useful because import payloads can be large.

### Log redaction

`app/loggers/log-redactor.ts` redacts object keys:

- `api_key`
- `key`

This affects JSON stringification before log output.

## Utility Notes

### `dateUtils`

Used heavily in mappers and catalog integrations.

Important behavior:

- partial year/month/day inputs resolve to the last possible day
- all helper-generated dates are UTC
- string conversions use ISO format

This matters especially for Google Books and Giant Bomb, where release dates may be partial.

### `miscUtils`

Key helpers:

- `escapeRegExp`
- `buildUrl`
- `parseBoolean`
- `mergeAndSumPromiseResults`
- `extractFilterAndSortFieldValues`
- `filterAndSortValues`
- `objectToStringKeyValue`

`parseBoolean` treats these as true:

- `true`
- `'true'`
- `1`
- `'1'`
- `'on'`
- `'yes'`

Everything else becomes false.

### `stringUtils`

Mostly used by logging exclusions.

Key helper:

- `matches(string, regularExpressions)`

## Testing Strategy

### Test startup

`test/global/global-init-tests.ts` does three important things:

- loads `reflect-metadata`
- overrides `MEDIA_TRACKER_BE_CONFIG` with `testConfig`
- installs Firebase auth mocks

### Test config

`test/global/config-test.ts` points tests at:

- local MongoDB: `mongodb://127.0.0.1:27017/mediaTrackerBackEndTestDatabase`
- mocked external API base URLs
- logging disabled with `level: 'off'`

### Auth mocking

`test/helpers/auth-handler-helper.ts` replaces `firebase-admin.auth` with a fake implementation.

Test auth token format:

- the token is a JSON string containing a `uid`

This means integration tests do not need real Firebase tokens.

### Server and DB test helpers

- `setupTestServer()`
  starts/stops Express once per test suite
- `setupTestDatabaseConnection()`
  connects once, drops the database after each test, closes at the end

### External API mocking

`test/mocks/external-services-mocks.ts` uses `nock` to fake:

- TMDb movie routes
- TMDb TV routes
- Google Books routes
- Giant Bomb routes

### What tests already cover well

The current suite covers:

- request validation on routes
- auth/authz behavior
- CRUD for categories, groups, own platforms, and each media type
- filtering, sorting, and searching
- population of linked group and own-platform data
- catalog mapping
- legacy import mapping
- own-platform merge behavior
- category media-type-change restriction
- TV-show season validation

### Commands

Before closing work on the backend, run:

- `npm run lint`
- `npm run typecheck`
- `npm test`

`npm test` requires a local MongoDB instance running on the test DB URL above.

## Conventions To Preserve

- Keep generic media-item infrastructure generic.
  Do not put movie/book/tv/videogame specifics into shared media-item base files unless the field truly applies to every media type.
- Routes should stay thin.
  Validation and payload conversion belong in models and mappers; business rules belong in controllers.
- Use internal models inside controllers and API models at the route boundary.
- If a feature depends on category media type, resolve behavior through `mediaItemFactory` instead of duplicating a switch in multiple places.
- Preserve ownership checks:
  - authentication by Firebase token
  - authorization by matching `:userId`
- Keep delete side effects consistent:
  - deleting category removes nested data
  - deleting group removes media items in that group
  - deleting own platform unlinks media items instead of deleting them
- Preserve `completedLastOn` whenever you add code that writes `completedOn`.

## How To Add Or Change Features Safely

### Add a new field to an existing entity

Touch all of these layers:

1. internal model
2. API model
3. schema
4. mapper
5. tests

Potentially also:

- external-service mapper, if the field comes from a catalog
- old-app import mapper, if it should be imported from legacy data
- route request validation, if new API input is required

### Add a new media type

This is the biggest extension path in the app.
At minimum, add:

1. internal models
2. API models
3. Mongoose schema
4. entity controller subclass
5. catalog controller subclass
6. API/internal/catalog mappers
7. route module using the generic router builders
8. `mediaItemFactory` resolution
9. config section if it needs a new external provider
10. integration and unit tests

Also update:

- `INTERNAL_MEDIA_TYPES`
- API `MEDIA_TYPES`
- docs in this file and `AGENTS.md` if conventions change

### Add a new route

Prefer this pattern:

1. define API request/response classes
2. validate with `parserValidator`
3. map to internal model
4. call controller
5. map result to API response
6. cover both unit and integration paths where sensible

### Add a cross-category or cross-media workflow

Start with these existing tools before inventing new abstractions:

- `mediaItemFactory`
- `QueryHelper`
- shared media-item router/controller base classes
- common media-item mappers

## Known Implementation Characteristics

- Most route failures currently return HTTP `500`, including validation and some precondition failures.
- There is no transaction handling around multi-step deletes/merges/imports.
- There is no central error middleware.
- There are no explicit DB uniqueness constraints enforced by current controllers.
- Catalog routes require authentication even though they are not user-scoped.
- The app starts listening before the DB connection promise resolves; if DB init fails, startup throws afterward.

These are not necessarily bugs for this codebase, but they are important to remember when changing behavior.

## Useful File Map

Entrypoints:

- `index.ts`
- `app/app.ts`
- `app/server/server.ts`

Security:

- `app/auth/authentication.ts`
- `app/auth/authorization.ts`

Core entities:

- `app/controllers/entities/category.ts`
- `app/controllers/entities/group.ts`
- `app/controllers/entities/own-platform.ts`
- `app/controllers/entities/media-items/**`

Generic data access:

- `app/controllers/database/query-helper.ts`
- `app/controllers/database/database-manager.ts`

Catalog integrations:

- `app/controllers/catalogs/media-items/**`
- `app/controllers/external-services/rest-json-invoker.ts`

Routing:

- `app/routes/**`

Mapping:

- `app/data/mappers/**`

Persistence:

- `app/schemas/**`

Testing:

- `test/integration/**`
- `test/unit/**`
- `test/helpers/**`
- `test/mocks/**`
