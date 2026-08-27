# §2 — Repository map

*[Index](README.md) · [← §1 Architecture](01-architecture.md)*

Where everything lives. Generated folders — `node_modules/`, `build/`, `coverage/`, `.nyc_output/`, `test/build-test/` — are ignored and not listed.

---

## 2.1 Root

| File | Purpose |
| --- | --- |
| `index.ts` | The entry point: `reflect-metadata`, then `init()` |
| `package.json` | Scripts and exact dependency versions. `engines.node` is `22.x` |
| `tsconfig.json` | The application TypeScript config, with the path aliases `tsc-alias` rewrites at build time |
| `tsconfig.common.json` | The base both the application and `test/tsconfig.json` extend |
| `eslint.config.js` | The flat ESLint config used by `npm run lint` |
| `CLAUDE.md` | The rules and commands for Claude Code. Keep it aligned with these pages |
| `README.md` | The short landing page for this sub-project; the detail is here |

## 2.2 `app/server`, `app/auth`, `app/config`

| File | Purpose |
| --- | --- |
| `app/app.ts` | The bootstrap: Firebase, listen, connect, shutdown hook ([§1.4](01-architecture.md#14-startup)) |
| `app/server/server.ts` | The middleware stack and the router mounting ([§1.5](01-architecture.md#15-the-middleware-stack)) |
| `app/auth/authentication.ts` | Firebase ID token verification for every request ([§5.1](05-authentication.md#51-authentication)) |
| `app/auth/authorization.ts` | `userResourceAuthorizationMiddleware`, the `:userId` match ([§5.2](05-authentication.md#52-authorization)) |
| `app/config/config.ts` | Loads and validates the runtime configuration ([§4.1](04-configuration.md#41-source-of-truth)) |
| `app/config/type-config.ts` | The config shape, as a validated class |
| `app/config/config-sample.ts` | The human-readable configuration template |

## 2.3 `app/routes`

| File | Purpose |
| --- | --- |
| `misc.ts` | `GET /status`, the one unauthenticated route |
| `category.ts` | The category endpoints |
| `group.ts` | The group endpoints |
| `own-platform.ts` | The own-platform endpoints, including `merge` |
| `media-items/media-item.ts` | The generic media-item router builders every media type is assembled from |
| `media-items/movie.ts`, `tv-show.ts`, `book.ts`, `videogame.ts` | The per-type routers and catalog routes |
| `import/old-app.ts` | The legacy import endpoint ([§13](13-legacy-import.md)) |
| `catch-all.ts` | The final 404 middleware |

## 2.4 `app/controllers`

| Path | Purpose |
| --- | --- |
| `database/query-helper.ts` | The shared database access helper ([§8.5](08-persistence.md#85-queryhelper)) |
| `database/database-manager.ts` | The Mongoose connection lifecycle |
| `entities/category.ts` | Categories, and the delete cascade ([§9.3](09-controllers.md#93-categorycontroller)) |
| `entities/group.ts` | Groups ([§9.4](09-controllers.md#94-groupcontroller)) |
| `entities/own-platform.ts` | Own platforms, including the merge ([§9.5](09-controllers.md#95-ownplatformcontroller)) |
| `entities/media-items/media-item.ts` | The generic media-item controller, the largest shared piece in the codebase ([§9.6](09-controllers.md#96-mediaitementitycontroller)) |
| `entities/media-items/movie.ts`, `tv-show.ts`, `book.ts`, `videogame.ts` | The per-type subclasses ([§9.7](09-controllers.md#97-media-specific-entity-controllers)) |
| `catalogs/media-items/**` | The external catalog controllers, one per media type ([§12](12-catalog-integrations.md)) |
| `external-services/rest-json-invoker.ts` | The shared HTTP client for outbound calls ([§12.1](12-catalog-integrations.md#121-the-shared-invoker)) |
| `import/old-app.ts` | The legacy import flow ([§13.2](13-legacy-import.md#132-the-controller-flow)) |

## 2.5 `app/data`, `app/schemas`, `app/factories`

| Path | Purpose |
| --- | --- |
| `data/models/api/**` | The transport boundary, validated with `class-validator` decorators |
| `data/models/internal/**` | What controllers work with ([§7](07-domain-model.md)) |
| `data/models/external-services/**` | The shapes external catalogs actually return |
| `data/models/error/error.ts` | `AppError` and the predefined error groups ([§6.3](06-validation-and-errors.md#63-the-error-model)) |
| `data/mappers/common.ts` | `ModelMapper`, the generic base ([§11.3](11-models-and-mapping.md#113-the-generic-mapper-base)) |
| `data/mappers/media-items/**`, `external-services/**`, `import/**` | The conversions themselves |
| `schemas/category.ts`, `group.ts`, `own-platform.ts` | The Mongoose schemas |
| `schemas/media-items/media-item.ts` | The shared media-item fields, defined once |
| `schemas/media-items/movie.ts`, `tv-show.ts`, `book.ts`, `videogame.ts` | The per-type schemas. `tv-show.ts` carries the season validation ([§7.7](07-domain-model.md#77-tv-show-seasons)) |
| `factories/media-item.ts` | `mediaItemFactory`, the media-type resolution point ([§9.8](09-controllers.md#98-mediaitemfactory)) |

## 2.6 `app/loggers`, `app/utilities`

| File | Purpose |
| --- | --- |
| `loggers/logger.ts` | The log4js categories and the layout that carries user and correlation IDs ([§14.1](14-logging.md#141-logger-categories)) |
| `loggers/express-logger.ts` | Request/response logging and the correlation ID |
| `loggers/log-redactor.ts` | Key redaction before output ([§14.3](14-logging.md#143-redaction)) |
| `utilities/parser-validator.ts` | The one validation entry point ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything)) |
| `utilities/request-scope-context.ts` | Per-request user and correlation IDs ([§5.3](05-authentication.md#53-request-scope-and-correlation)) |
| `utilities/date-utils.ts` | Partial-date resolution and UTC conversion ([§15.1](15-utilities.md#151-dateutils)) |
| `utilities/misc-utils.ts` | `escapeRegExp`, `buildUrl`, `parseBoolean` and the filter/sort helpers ([§15.2](15-utilities.md#152-miscutils)) |
| `utilities/string-utils.ts` | `matches`, used by the logging exclusions ([§15.3](15-utilities.md#153-stringutils)) |
| `utilities/request-param-utils.ts` | Request parameter extraction |
| `utilities/helper-types.ts` | Shared type helpers |

## 2.7 `test`

| Path | Purpose |
| --- | --- |
| `run-tests.cjs` | The runner `npm test` invokes under `nyc` |
| `global/global-init-tests.ts` | `reflect-metadata`, the test config override, the Firebase mocks ([§16.1](16-testing.md#161-test-startup)) |
| `global/config-test.ts` | The test database URL, the mocked external base URLs, logging off |
| `helpers/*` | Server and database lifecycle, the auth mock, entity builders and comparisons, the API caller |
| `mocks/external-services-mocks.ts` | The `nock` fixtures for TMDb, Google Books, Twitch and IGDB |
| `resources/mocks/*` | The static payloads those fixtures return |
| `integration/routes/*` | Route-level tests against a real test database |
| `unit/auth/*`, `unit/controllers/*`, `unit/utilities/*` | The unit tests |

---

[← §1 Architecture](01-architecture.md) · [§3 Build and run →](03-build-and-run.md)
