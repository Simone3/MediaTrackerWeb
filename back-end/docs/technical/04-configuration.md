# §4 — Configuration

*[Index](README.md) · [← §3 Build and run](03-build-and-run.md)*

---

## 4.1 Source of truth

`app/config/config.ts` resolves the configuration in this order:

1. the `MEDIA_TRACKER_BE_CONFIG` environment variable, parsed as JSON
2. the fallback file `app/config/MEDIA_TRACKER_BE_CONFIG.json`

After loading:

- it is **validated synchronously** against the `Config` class in `app/config/type-config.ts`, through the same `parserValidator` the routes use ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything))
- `PORT`, if present in the environment, overrides `config.server.port`

**Parsing or validation failure throws at startup.** A service that boots with half a configuration and fails on the first request that needs the missing half is worse than one that never boots, so the check is up front and fatal.

For deployment, `render.yaml` expects Render to provide `MEDIA_TRACKER_BE_CONFIG` as a secret; the checked-in file is a local fallback and must not be relied on in production ([§3.4](03-build-and-run.md#34-deployment)).

## 4.2 The sections

The full shape is `app/config/type-config.ts`. `app/config/config-sample.ts` is the readable template to copy from.

- `server.port`
- `db.url`
- `externalApis`
- `log`
- `firebase`

## 4.3 External API config

The configured catalog providers ([§12](12-catalog-integrations.md)):

- **TMDb** for movies
- **TMDb** for TV shows
- **Google Books** for books
- **IGDB** for videogames, authenticated through Twitch app credentials

Shared across all of them:

- `externalApis.timeoutMilliseconds`
- `externalApis.userAgent`

Provider-specific values live here too, and belong here rather than inline: image base paths, image sizes and extensions, and TMDb's `directorJobName` — the crew job string used to pick directors out of the credits list ([§12.2](12-catalog-integrations.md#122-movies-tmdb)).

## 4.4 Logging config

`config.log`:

- `level`: `debug | info | warn | error | off`
- `file`
- `fileBackups`
- `apisInputOutput.active`
- `apisInputOutput.excludeRequestBodyRegExp`
- `apisInputOutput.excludeResponseBodyRegExp`
- `externalApisInputOutput.active`
- `databaseQueries.active`

**`config.log.file` is required by validation, but an empty string is meaningful.** A non-empty value sends logs to both the file and the console; an empty one makes logger setup fall back to console-only. That is how a containerized deployment with no writable log path is configured — the key is still required, so its absence is a mistake rather than a silent default ([§14](14-logging.md)).

**`config.log.fileBackups` is how many rolled files are kept besides the current one.** log4js defaults a `dateFile` appender to one, which would make yesterday the oldest log available, so the value is configured rather than left to the library ([§14.1](14-logging.md#141-one-logger)).

---

[← §3 Build and run](03-build-and-run.md) · [§5 Authentication and authorization →](05-authentication.md)
