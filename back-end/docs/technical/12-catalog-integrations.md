# §12 — Catalog integrations

*[Index](README.md) · [← §11 API models and mapping](11-models-and-mapping.md)*

The four external providers behind `/catalog/*` ([§10.6](10-api-surface.md#106-catalog-routes)), and what each one's payload becomes.

---

## 12.1 The shared invoker

`app/controllers/external-services/rest-json-invoker.ts` is the common HTTP client for every outbound call:

- uses `axios`
- always sends JSON headers and the configured `User-Agent`
- supports query params, headers, a request body and a timeout
- logs request and response, the response carrying the elapsed time, when enabled ([§14.1](14-logging.md#141-one-logger))
- **validates JSON responses against typed classes** unless `assumeWellFormedResponse` is set ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything))
- **discards the invalid list items instead of the whole response** when `discardInvalidResponseItems` is set ([§6.4](06-validation-and-errors.md#64-tolerating-bad-provider-data)), logging a warning with how many were dropped

**Every catalog call sets `discardInvalidResponseItems`.** A catalog response is a best-effort view of somebody else's data: one search result with no title, one genre with no name, one null element in a list, and an all-or-nothing parse turns a usable answer into an error page. Provider payloads are not a contract this app can enforce, so the elements it cannot read are dropped and the rest is served.

**Timeouts use an Axios cancel token plus a `setTimeout(...)`**, and a timeout failure maps to `AppError.EXTERNAL_API_TIMEOUT` rather than a generic failure — a provider being slow is a different operational problem from a provider being wrong, and the logs should say which one happened.

**New integrations go through this invoker.** A direct `axios` call skips the validation, the logging and the timeout mapping at once.

## 12.2 Movies (TMDb)

**Search** — `title` → name, `release_date` → release date.

**Details** — `title`, `genres[].name`, `overview`, `release_date`, a backdrop image URL built from the configured TMDb image base path, `runtime`, and **directors extracted from `credits.crew` by matching the configured `directorJobName`**.

That job name is configuration rather than a literal ([§4.3](04-configuration.md#43-external-api-config)): TMDb's crew list is free-form, and the string that identifies a director is a provider detail, not a domain fact.

## 12.3 TV shows (TMDb)

**Search** — `name`, `first_air_date`.

**Details** — `name`, `genres[].name`, `overview`, `first_air_date`, a backdrop image URL from the configured TV image base path, creators from `created_by[].name`, average episode runtime from `episode_run_time[]`, `in_production`, and the season list **excluding season number `0`** — TMDb uses season 0 for specials, which are not seasons in this app's model ([§7.7](07-domain-model.md#77-tv-show-seasons)).

**One extra request, conditionally.** If the show is still in production and TMDb returned at least one season, the controller fetches the latest season on its own and infers `nextEpisodeAirDate` from the future episodes in it. TMDb does not expose that date directly, and it is the single most useful field for a show someone is currently following — so it is worth the second call, and only made when it can produce something.

**That second call cannot fail the first.** If the season request errors out, the show is returned without `nextEpisodeAirDate` rather than not at all: the field is a bonus on top of a details lookup that already succeeded.

## 12.4 Books (Google Books)

**Search** — `volumeInfo.title`, `volumeInfo.publishedDate`.

**Details** — title, categories, description, published date, authors, page count, and an image URL preferring `imageLinks.medium` and falling back to `imageLinks.thumbnail`.

**Google Books dates are frequently partial** — a year alone, or a year and month. `dateUtils` resolves those to the last possible day, which is why that helper matters most here ([§15.1](15-utilities.md#151-dateutils)).

## 12.5 Videogames (IGDB)

Authenticated through Twitch app credentials ([§4.3](04-configuration.md#43-external-api-config)).

**Search and details** — name, genres, `summary` → description, involved companies flagged as developers, involved companies flagged as publishers, platforms.

**Release date** — `first_release_date` is an IGDB Unix timestamp, converted to a UTC date.

**Catalog ID** — IGDB IDs are carried in the existing `catalogId` field with an **`igdb:` prefix**, for example `igdb:123`. Details lookups require the prefix, and **unprefixed legacy GiantBomb IDs are rejected**. The provider changed; the field did not. Without the prefix a stored GiantBomb ID and an IGDB ID are indistinguishable numbers, and a lookup would silently fetch the wrong game — so the prefix is what makes the collision detectable instead of invisible.

**Image URL** — `cover.image_id` combined with the configured IGDB image base path, image size and extension.

---

[← §11 API models and mapping](11-models-and-mapping.md) · [§14 Logging →](14-logging.md)
