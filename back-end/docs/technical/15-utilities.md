# §15 — Utilities

*[Index](README.md) · [← §14 Logging](14-logging.md)*

The shared helpers whose behaviour is not obvious from their names.

---

## 15.1 `dateUtils`

`app/utilities/date-utils.ts`, used heavily by the mappers and the catalog integrations.

- **partial year/month/day inputs resolve to the last possible day** — `2019` becomes 31 December 2019, `2019-03` becomes 31 March 2019
- all helper-generated dates are **UTC**
- string conversions use ISO format
- `isValidTimeZone` accepts an IANA identifier such as `Europe/Rome` or a UTC offset such as `+02:00`

The partial-date rule exists for Google Books, which routinely publishes a year alone ([§12.4](12-catalog-integrations.md#124-books-google-books)). Resolving to the last possible day rather than the first means a partially-dated item sorts after everything definitely released earlier in that period, which is the safer error for a release date.

UTC everywhere is what keeps a release date from shifting a day depending on where the server runs.

**`isValidTimeZone` has no list to compare against.** The only reliable check is asking `Intl.DateTimeFormat` to build a formatter for the value, which throws for anything the runtime does not recognize. It backs the `IsTimeZone` constraint ([§15.4](#154-validators)).

## 15.2 `miscUtils`

`app/utilities/misc-utils.ts`:

- `escapeRegExp` — what makes media-item search treat `.*` as literal characters ([§9.6](09-controllers.md#96-mediaitementitycontroller))
- `buildUrl`
- `parseBoolean`
- `mergeAndSumPromiseResults`
- `extractFilterAndSortFieldValues`
- `filterAndSortValues`
- `objectToStringKeyValue`

**`extractFilterAndSortFieldValues` skips nullish field values before stringifying them**, so an element whose field is absent contributes nothing instead of the literal string `undefined`. That matters wherever a provider model leaves a name optional ([§6.4](06-validation-and-errors.md#64-tolerating-bad-provider-data)).

**`parseBoolean` treats exactly these as true**: `true`, `'true'`, `1`, `'1'`, `'on'`, `'yes'`. Everything else is false.

The permissive list exists because boolean-ish values arrive from several sources with different conventions — JSON bodies, query strings — and normalizing them in one place beats each mapper guessing ([§11.4](11-models-and-mapping.md#114-media-item-mapper-conventions)).

## 15.3 `stringUtils`

`app/utilities/string-utils.ts`, down to a single helper:

- `join(array, separator, defaultIfEmpty, properties)` — joins an array skipping the falsy elements, optionally reading the first defined one of several properties per element rather than the element itself

**It exists because `Array.prototype.join` writes the empty elements out as separators.** The values it is given are provider data — a genre with no name, a missing author — and the plain join turns those into `, , `. The `properties` argument covers the same shape from the other side: a provider that names a field differently between two of its endpoints is read with both names listed in preference order ([§12](12-catalog-integrations.md)).

**`matches` used to live here too**, testing a string against a list of patterns for the request and response body exclusion regexes. Those were replaced by a boolean ([§4.4](04-configuration.md#44-logging-config)) and nothing else needed it.

## 15.4 `validators`

`app/utilities/validators.ts` holds the custom `class-validator` constraints — today just one:

- `IsTimeZone` — used by the media items stats request ([§10.5](10-api-surface.md#105-media-item-entity-routes))

**A custom constraint rather than a check in the route or the controller.** Validation here is model-driven ([§6.1](06-validation-and-errors.md#61-one-validator-for-everything)), and the alternative for a time zone is letting an unknown value reach MongoDB and fail inside the aggregation, where the error says nothing about which request field was wrong.

This file is where the next one goes. A one-off validity check written into a route is a rule that no longer lives with the shape it constrains.

---

[← §14 Logging](14-logging.md) · [§16 Testing →](16-testing.md)
