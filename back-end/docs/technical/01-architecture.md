# §1 — Architecture

*[Index](README.md)*

The layers, the path a request takes through them, and what happens between `node build/index.js` and a listening server.

---

## 1.1 What the service is

A plain Express + TypeScript API backed by MongoDB through Mongoose, with Firebase for authentication. The runtime target is Node.js 22.x, declared in `package.json`.

It serves the web front end in `../front-end` and nothing else. There is no HTML, no session, no cookie: every request carries a Firebase ID token and is answered with JSON.

## 1.2 The layers

| Folder | Responsibility |
| --- | --- |
| `app/server` | Builds the Express app, mounts middleware, registers routers |
| `app/routes` | Defines the HTTP endpoints and converts request/response payloads |
| `app/controllers` | Business logic, database access helpers, external catalog integrations |
| `app/data/models` | API models, internal models, external service payload models, error models |
| `app/data/mappers` | Conversions between API, internal and external shapes |
| `app/schemas` | Mongoose schemas and collection names |
| `app/auth` | Firebase authentication and user-resource authorization |
| `app/config` | Runtime configuration loading and validation |
| `app/loggers` | The single application logger, the request/response middleware and the redactor |
| `app/utilities` | Request-scoped context, validation, date conversion, string and misc helpers |
| `app/factories` | Resolution helpers, mainly media type to the right media-item controllers |

**Routes are thin on purpose.** A route validates, maps API objects to internal models, calls a controller, and maps the result back. Business rules belong in controllers, so that two routes reaching the same rule cannot disagree about it ([§9](09-controllers.md)).

## 1.3 The request path

1. `index.ts` loads `reflect-metadata` and calls `init()`.
2. `app/app.ts` initializes Firebase, starts Express, then opens the MongoDB connection.
3. `app/server/server.ts` builds the middleware stack and mounts the routers.
4. A router validates the payload with `parserValidator` ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything)), maps API objects to internal models, and calls a controller.
5. The controller checks its preconditions and uses `QueryHelper` ([§8.5](08-persistence.md#85-queryhelper)) or an external catalog controller ([§12](12-catalog-integrations.md)).
6. The route maps the result back to API models and sends JSON.

## 1.4 Startup

**`index.ts`** imports `reflect-metadata` — the `class-transformer-validator` decorators on the config and API models need it before anything else loads — and calls `init()`.

**`app/app.ts`**:

- logs startup
- initializes Firebase Admin from `config.firebase.serviceAccountKey` and `config.firebase.databaseUrl`
- starts the Express server on `config.server.port`
- **opens the MongoDB connection after `listen()`**
- registers a graceful shutdown hook with `exit-hook`

The ordering means the process is listening before the database connection has resolved. If database init fails, startup throws afterwards, having already accepted the port ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics)).

Shutdown closes log4js, the Express server instance, and the Mongoose connection.

## 1.5 The middleware stack

`app/server/server.ts` configures the app in this order:

1. `express.json({ limit: '10mb' })` — a deliberately generous limit; no current endpoint comes close to it
2. `requestScopeContextMiddleware` ([§5.3](05-authentication.md#53-request-scope-and-correlation))
3. CORS: `origin: '*'`, `credentials: true`, `methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`, `preflightContinue: true`
4. the logging middleware ([§14.2](14-logging.md#142-requestresponse-logging))
5. `authenticationMiddleware` ([§5.1](05-authentication.md#51-authentication))
6. the routers
7. the catch-all 404 middleware

**Authentication is mounted globally, above every router.** That is what makes catalog routes authenticated even though they carry no `:userId`, and what makes an unknown route return `401` rather than `404` to an unauthenticated caller ([§10.8](10-api-surface.md#108-catch-all)).

**There is no central error-handling middleware.** Each route handles its own failures inline ([§6.3](06-validation-and-errors.md#63-the-error-model)).

---

[§2 Repository map →](02-repository-map.md)
