# §5 — Authentication and authorization

*[Index](README.md) · [← §4 Configuration](04-configuration.md)*

---

## 5.1 Authentication

`app/auth/authentication.ts` enforces Firebase ID token authentication for the whole application:

- `OPTIONS` requests are always allowed
- `GET /status` is always allowed
- **every other route requires `Authorization: Bearer <token>`**
- the token is verified with `getAuth().verifyIdToken(...)` from `firebase-admin/auth`
- on success, `requestScopeContext.currentUserId` is set to the Firebase UID
- on failure, the response is `401 { error: 'Unauthorized' }`

The middleware is mounted above every router ([§1.5](01-architecture.md#15-the-middleware-stack)), which has two consequences worth knowing: catalog routes are authenticated even though they are not user-scoped ([§5.4](#54-catalog-routes)), and an unknown route answers `401` rather than `404` when the caller is unauthenticated ([§10.8](10-api-surface.md#108-catch-all)).

## 5.2 Authorization

`app/auth/authorization.ts` holds `userResourceAuthorizationMiddleware`, which applies **only to routes containing `:userId`**:

- it reads `request.params.userId`
- it reads `requestScopeContext.currentUserId`
- it responds `403 { error: 'Forbidden' }` if they differ

The model is intentionally minimal: **a user can only reach their own resources.** There is no admin mode and no shared-resource access. Adding either one means adding a concept this codebase does not have today, not relaxing a check.

**There is no user collection.** Ownership is a Firebase UID string stored on each document ([§7.1](07-domain-model.md#71-the-ownership-model)), so the check above is the entire access-control system — which is why database reads, writes and cascades all carry owner conditions whenever a user context exists.

## 5.3 Request scope and correlation

`app/utilities/request-scope-context.ts` uses `express-http-context` to hold two per-request values:

- `currentUserId`
- `correlationId`

`app/loggers/express-logger.ts` sets the correlation ID with `uuid.v4()` early in the chain, and `app/loggers/logger.ts` injects both into the log layout:

```
[%d] [%x{currentUserId}] [%x{correlationId}] %p %c - %m
```

**Every line of a request's log therefore names the user and the request.** With one worker interleaving many requests, that is the only thing that makes a log readable after the fact ([§14](14-logging.md)).

## 5.4 Catalog routes

Catalog routes carry no `:userId`, so `userResourceAuthorizationMiddleware` never runs on them. They are still authenticated, because the authentication middleware is global.

That is deliberate: the catalog endpoints spend the application's own third-party API quota, so they must not be open to anonymous callers, even though there is no per-user resource to protect ([§12](12-catalog-integrations.md)).

---

[← §4 Configuration](04-configuration.md) · [§6 Validation and errors →](06-validation-and-errors.md)
