# §6 — Validation and errors

*[Index](README.md) · [← §5 Authentication and authorization](05-authentication.md)*

---

## 6.1 One validator for everything

`app/utilities/parser-validator.ts` wraps `class-transformer-validator` and is the single validation entry point. It is used for:

- runtime configuration ([§4.1](04-configuration.md#41-source-of-truth))
- route request payloads
- external API responses, unless the caller explicitly opts out ([§12.1](12-catalog-integrations.md#121-the-shared-invoker))

**Validation is model-driven, not procedural.** The rules live as decorators on classes — API payloads in `app/data/models/api/**`, the config in `app/config/type-config.ts`, external responses in `app/data/models/external-services/**` — so the shape and its constraints are the same declaration. Ad hoc checks in routes or controllers duplicate that and drift from it; use the model classes instead ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics)).

This is also why `index.ts` imports `reflect-metadata` before anything else: the decorators do not work without it.

## 6.2 What a validation failure returns

A failed request validation generally responds with:

- HTTP **`500`**
- an error payload derived from `AppError.INVALID_REQUEST`

**A `400` would be the conventional answer, and this is not it.** The behaviour is current and deliberate rather than accidental, and the front end handles it, so changing the status is an API change that both sides have to make together — not a local fix.

## 6.3 The error model

`AppError` in `app/data/models/error/error.ts` covers:

- generic application errors
- auth and authorization errors
- not found
- invalid request
- database init, find, save and delete
- database uniqueness
- external API invocation, timeout, parsing and generic failures

Routes convert an `AppError` into an API payload with `errorResponseFactory`.

**`errorResponseFactory` unwraps nested `AppError` chains** and exposes the first source error's code, description and details. A database failure wrapped by a controller error wrapped by a route error still surfaces the thing that actually went wrong, instead of the outermost generic label.

There is no central error middleware ([§1.5](01-architecture.md#15-the-middleware-stack)) — each route handles its own failures inline — and most route failures, including validation and some precondition failures, currently return `500` ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics)).

---

[← §5 Authentication and authorization](05-authentication.md) · [§7 Domain model →](07-domain-model.md)
