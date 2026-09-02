# §14 — Logging

*[Index](README.md) · [← §12 Catalog integrations](12-catalog-integrations.md)*

---

## 14.1 Logger categories

`app/loggers/logger.ts` defines five log4js categories, each independently switchable from `config.log` ([§4.4](04-configuration.md#44-logging-config)):

| Category | What it carries |
| --- | --- |
| `logger` | General application logs |
| `inputOutputLogger` | API request and response logs |
| `externalInvocationsInputOutputLogger` | Outbound HTTP request and response logs ([§12.1](12-catalog-integrations.md#121-the-shared-invoker)) |
| `databaseLogger` | Mongoose debug logging |
| `performanceLogger` | Request, query and external-call timings |

Each category writes at `debug`, `info`, `warn` or `error`. **`warn` is for a degraded but served response** — the catalog dropping unreadable items from a provider payload ([§6.4](06-validation-and-errors.md#64-tolerating-bad-provider-data)) — as opposed to `error`, which means the caller got nothing.

**They are separate because they are noisy in different amounts.** Turning on database query logging to diagnose a slow endpoint should not also flood the log with every request body.

Every line carries the current user ID and the correlation ID through the layout ([§5.3](05-authentication.md#53-request-scope-and-correlation)).

## 14.2 Request/response logging

`app/loggers/express-logger.ts`:

- logs request bodies unless the URL matches a configured exclusion regex
- logs response bodies unless the URL matches a configured exclusion regex
- uses `express-mung` to reach JSON responses

Both exclusion lists are empty in the sample config: no current endpoint carries a body large or sensitive enough to keep out of the log.

## 14.3 Redaction

`app/loggers/log-redactor.ts` redacts the object keys `api_key` and `key` during JSON stringification, before anything reaches the output.

**External catalog calls carry provider API keys in their query parameters**, and outbound request logging would otherwise write them to a file in plain text ([§12](12-catalog-integrations.md)). Redaction at the stringification step is what keeps that from depending on every call site remembering.

---

[← §12 Catalog integrations](12-catalog-integrations.md) · [§15 Utilities →](15-utilities.md)
