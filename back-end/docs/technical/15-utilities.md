# §15 — Utilities

*[Index](README.md) · [← §14 Logging](14-logging.md)*

The shared helpers whose behaviour is not obvious from their names.

---

## 15.1 `dateUtils`

`app/utilities/date-utils.ts`, used heavily by the mappers and the catalog integrations.

- **partial year/month/day inputs resolve to the last possible day** — `2019` becomes 31 December 2019, `2019-03` becomes 31 March 2019
- all helper-generated dates are **UTC**
- string conversions use ISO format

The partial-date rule exists for Google Books, which routinely publishes a year alone ([§12.4](12-catalog-integrations.md#124-books-google-books)). Resolving to the last possible day rather than the first means a partially-dated item sorts after everything definitely released earlier in that period, which is the safer error for a release date.

UTC everywhere is what keeps a release date from shifting a day depending on where the server runs.

## 15.2 `miscUtils`

`app/utilities/misc-utils.ts`:

- `escapeRegExp` — what makes media-item search treat `.*` as literal characters ([§9.6](09-controllers.md#96-mediaitementitycontroller))
- `buildUrl`
- `parseBoolean`
- `mergeAndSumPromiseResults`
- `extractFilterAndSortFieldValues`
- `filterAndSortValues`
- `objectToStringKeyValue`

**`parseBoolean` treats exactly these as true**: `true`, `'true'`, `1`, `'1'`, `'on'`, `'yes'`. Everything else is false.

The permissive list exists because boolean-ish values arrive from several sources with different conventions — JSON bodies, query strings, legacy import payloads — and normalizing them in one place beats each mapper guessing ([§11.4](11-models-and-mapping.md#114-media-item-mapper-conventions)).

## 15.3 `stringUtils`

`app/utilities/string-utils.ts`, used mostly by the logging exclusions.

- `matches(string, regularExpressions)` — tests a string against a list of patterns, which is how the request and response body exclusion regexes are applied ([§14.2](14-logging.md#142-requestresponse-logging))

---

[← §14 Logging](14-logging.md) · [§16 Testing →](16-testing.md)
