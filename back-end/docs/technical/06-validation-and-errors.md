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

When `class-validator` has no constraint for what a field means, the answer is a **custom constraint** in `app/utilities/validators.ts`, not a check in the route ([§15.4](15-utilities.md#154-validators)).

## 6.2 What a validation failure returns

A failed request validation generally responds with:

- HTTP **`500`**
- an error payload derived from `AppError.INVALID_REQUEST`

**A `400` would be the conventional answer, and this is not it.** The behaviour is current and deliberate rather than accidental, and the front end handles it, so changing the status is an API change that both sides have to make together — not a local fix. It is now a one-line change on this side: `ERROR_STATUS_CODES` in `app/routes/error-handler.ts` ([§6.3](#63-the-error-model)).

## 6.3 The error model

`AppError` in `app/data/models/error/error.ts` covers:

- generic application errors
- auth and authorization errors
- not found
- invalid request
- database init, find, save and delete
- database uniqueness
- external API invocation, timeout, parsing and generic failures

`app/routes/error-handler.ts` converts an `AppError` into an API payload with `errorResponseFactory`. Routes do not do it themselves: each one wraps its failure in the `AppError` that describes it — `AppError.INVALID_REQUEST` for a rejected payload, `AppError.GENERIC` for anything the controller raised — and hands it to `next(...)`.

**`errorResponseFactory` unwraps nested `AppError` chains** and exposes the first source error's code, description and details. A database failure wrapped by a controller error wrapped by a route error still surfaces the thing that actually went wrong, instead of the outermost generic label.

**The middleware reads the source error, not the outermost one.** Every route wraps its failure in a generic label, so the outermost `AppError` is the same on every route and says nothing; the status code, the log level and the response body all follow `AppError.sourceError`, the innermost error of the chain.

**A failure the caller caused is logged as a warning**, not as an error: an invalid payload, an unknown route, a uniqueness rejection and a non-empty delete say nothing about the health of the application, and at `level: 'error'` they would be the whole log. A `500` logged at `warn` is the honest reading of a validation failure that answers `500` ([§6.2](#62-what-a-validation-failure-returns)) — the status is the part that is wrong.

Only `AppError.NOT_FOUND` maps to a status of its own, `404`. Everything else returns `500`, including validation and some precondition failures ([§17.5](17-extension-playbooks.md#175-known-implementation-characteristics)) — `ERROR_STATUS_CODES` in `app/routes/error-handler.ts` is the one place that would change.

## 6.4 Tolerating bad provider data

`parseAndValidateDiscardingInvalidItems` and `parseAndValidateListDiscardingInvalid` are the lenient counterparts of the two parse methods, used only for external catalog responses ([§12.1](12-catalog-integrations.md#121-the-shared-invoker)). They parse normally and, on failure, walk the `ValidationError` tree alongside the raw payload, drop the list elements the errors point at, and parse again — reporting how many were discarded.

**Only list elements are droppable, and only the smallest one that fails.** An invalid genre inside a movie discards that genre, not the movie; a search result with no title discards that result, not the search. A failure that is not inside a list — a details response missing its own `title` — still rejects, because there is nothing usable left to return.

**A property-level `each` constraint drops the whole list.** class-validator reports `@IsString({ each: true })` as one constraint on the property with no indication of which element failed, so the list cannot be repaired element by element and is removed instead. The re-parse then rejects if the model required it.

**This is why the external-response models carry no `@IsDefined({ each: true })`.** It is redundant — `@ValidateNested()` already reports a null or non-object element as an indexed child — and it is harmful, because it turns a repairable per-element failure into exactly the property-level constraint above.

**Required means the mapper needs it.** In `app/data/models/external-services/**`, a field stays required when a result without it cannot be mapped into something worth showing (an ID, a title, a name), and becomes optional when it is never read or the mapper already copes. Requiring a field the mapper ignores does not add safety; it only discards results that would have been fine.

Request payloads and the config keep using the strict methods. A malformed request is the caller's bug and must be rejected, not quietly trimmed.

---

[← §5 Authentication and authorization](05-authentication.md) · [§7 Domain model →](07-domain-model.md)
