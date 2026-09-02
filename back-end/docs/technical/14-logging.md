# §14 — Logging

*[Index](README.md) · [← §12 Catalog integrations](12-catalog-integrations.md)*

---

## 14.1 One logger

`app/loggers/logger.ts` defines a **single** `logger`, writing at `debug`, `info`, `warn` or `error` to the console and, when `config.log.file` is set, to a rolling daily file ([§4.4](04-configuration.md#44-logging-config)).

**There used to be five log4js categories** — application, request/response, external API, database and performance. They bought nothing: all five took their level from the same `config.log.level`, all five wrote to the same appenders, and each line already says what it is about (`API GET /x …`, `Query find on categories …`, `External Service GET https://… …`), so the category name printed next to it was a second copy of the same fact.

**What actually controls the volume is `config.log`**, checked at the call site rather than at the logger:

| Switch | What it silences |
| --- | --- |
| `level` | Everything below it, `off` included |
| `apisInputOutput.active` | The API request and response lines ([§14.2](#142-requestresponse-logging)) |
| `externalApisInputOutput.active` | The outbound request and response lines ([§12.1](12-catalog-integrations.md#121-the-shared-invoker)) |
| `databaseQueries.active` | The per-query lines ([§14.3](#143-query-logging)) |

**`warn` is for a request nobody needs to act on** — a caller's invalid payload or unknown route, decided by the error middleware ([§6.3](06-validation-and-errors.md#63-the-error-model)), and a degraded but served response, the catalog dropping unreadable items from a provider payload ([§6.4](06-validation-and-errors.md#64-tolerating-bad-provider-data)). `error` is reserved for what the application itself got wrong, so that a log read at `level: 'error'` is a list of things to fix rather than a list of people mistyping URLs.

Every line carries the current user ID and the correlation ID through the layout ([§5.3](05-authentication.md#53-request-scope-and-correlation)).

**`numBackups` is set explicitly on the file appender**, from `config.log.fileBackups` ([§4.4](04-configuration.md#44-logging-config)). log4js defaults a `dateFile` appender to keeping one rolled file, which would make yesterday the oldest log available.

## 14.2 Request/response logging

`app/loggers/express-logger.ts`:

- sets the correlation ID
- logs request bodies unless the URL matches a configured exclusion regex
- captures the JSON response body with `express-mung`, because a response cannot be read back once it has been sent
- logs the response — status, elapsed time and body — from the response `finish` event

**The response line is written on `finish`, not in the `express-mung` hook.** The hook only sees responses that carry a JSON body, so a response without one would otherwise go unlogged; `finish` also gives the true end of the exchange to measure against.

Both exclusion lists are empty in the sample config: no current endpoint carries a body large or sensitive enough to keep out of the log.

**The logging middleware is mounted above the authentication middleware** ([§1.5](01-architecture.md#15-the-middleware-stack)). A request rejected by authentication is a request worth seeing, and below the authentication it would have produced an error line naming neither the URL nor a correlation ID.

**A failed request is three lines under one correlation ID** — the request, the failure from the error middleware, and the response with its status and elapsed time. The failure line is the only one a route contributes, and it does not write it itself:

```
INFO - API GET /unknown-route - Received Request: -
WARN - API GET /unknown-route - Rejected Request: api.not.found - Cannot find the requested API
INFO - API GET /unknown-route - Sent Response: 404 in 3.5 ms - {"errorCode":"api.not.found",…}
```

The authentication and authorization middlewares are the exception: they log their own rejection and answer directly, because their response body is not the standard error payload ([§5](05-authentication.md)).

## 14.3 Query logging

`QueryHelper` writes one line per call — the method, the collection, the conditions and the elapsed time ([§8.5](08-persistence.md#85-queryhelper)).

**There is no `mongoose.set('debug')` hook.** It used to log every collection access, without a timing, alongside a separate performance line that carried the timing without the query. Every model in the application is reachable only through a `QueryHelper`, so the helper is the chokepoint and can log both at once. Documents are not logged: a write's payload is already in the request body line.

The methods that delegate to another one here — `findOne`, `checkUniquenessAndSave` — log their own total without repeating the conditions the inner call already logged.

## 14.4 Elapsed time is inline

`app/loggers/elapsed-time.ts` measures an operation with `process.hrtime.bigint()` and formats it for the message of the operation itself. Route responses, queries, outbound calls and outbound failures all print their own duration.

**There is no separate performance log.** A timing on its own line is a timing you have to correlate back to the thing it measured, and it needs its own switch and its own level to be visible at all — which is how the previous `performanceLogger` came to emit at `debug` under a config whose level was `info`: the `performance.active` flag was on and nothing was ever written. A duration is a property of an event, so it is printed with the event.

## 14.5 Redaction and error formatting

`app/loggers/log-redactor.ts` redacts the object keys that name a credential — `api_key`, `key`, `token`, `access_token`, `refresh_token`, `authorization`, `password`, `secret`, `client_secret` — during JSON stringification, before anything reaches the output.

**Keys are matched on their lowercase alphanumeric form**, so one entry covers `api_key`, `apiKey` and `API-KEY`: a provider's choice of casing and separator is not something a redaction list should have to enumerate. The match is on the whole normalized key, not a substring, so `keyword` and `monkey` are left alone.

**External catalog calls carry provider API keys in their query parameters**, and outbound request logging would otherwise write them to a file in plain text ([§12](12-catalog-integrations.md)). Redaction at the stringification step is what keeps that from depending on every call site remembering.

**The redactor only sees object keys, so it is not the whole defence.** The Twitch token request sends its client secret in a form-encoded string body, where there are no keys to match; that call sets `hideRequestBodyInLogs` and `hideResponseBodyInLogs` instead ([§12.1](12-catalog-integrations.md#121-the-shared-invoker)). A credential that is not an object property has to be hidden at the call site.

**Errors are not JSON-stringified.** An `Error`'s message and stack are not enumerable properties, so `JSON.stringify` renders one as `{}` — which is what the `%s` of every `logger.error('…: %s', error)` used to print. `logger` formats them instead: a raw error becomes its stack, and an `AppError` becomes its cause chain flattened onto the one line, `generic.application - Generic application error <- db.find - Database find query returned an error <- …`.

---

[← §12 Catalog integrations](12-catalog-integrations.md) · [§15 Utilities →](15-utilities.md)
