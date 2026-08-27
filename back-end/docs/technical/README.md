# Media Tracker back end — technical reference

**Implementation documentation**

How the service is built: how a request flows through it, which entities exist and how they relate, which routes exist and what they do, and where validation, mapping, persistence, logging and the external integrations live.

A plain Express + TypeScript API on MongoDB via Mongoose, authenticated with Firebase, running on Node.js 22.x. It serves the web front end in `../front-end` and nothing else.

What is worth knowing before changing anything: **there is no user collection** — ownership is a Firebase UID on each document, and the `:userId` match is the whole access-control system ([§5.2](05-authentication.md#52-authorization)); **each media type has its own collection**, which is why `mediaItemFactory` exists and why a category's media type is immutable once it holds items ([§8.1](08-persistence.md#81-collections), [§9.8](09-controllers.md#98-mediaitemfactory)); and **the delete cascades are asymmetric on purpose** — a group owns its items, a platform only describes them ([§9.2](09-controllers.md#92-the-delete-cascades-in-one-place)).

The front end that calls this API documents itself in [`../../../front-end/docs/technical/`](../../../front-end/docs/technical/README.md).

---

## Contents

| § | Section | What it answers |
| --- | --- | --- |
| 1 | [Architecture](01-architecture.md) | The layers, the request path, startup and the middleware stack |
| 2 | [Repository map](02-repository-map.md) | Where every file is and what it is for |
| 3 | [Build and run](03-build-and-run.md) | The commands, the three-step build, running locally and deploying |
| 4 | [Configuration](04-configuration.md) | Where config comes from, what it holds, and why it is fatal |
| 5 | [Authentication and authorization](05-authentication.md) | Who may call what, and the per-request context |
| 6 | [Validation and errors](06-validation-and-errors.md) | The one validator, the error model, and what a failure returns |
| 7 | [Domain model](07-domain-model.md) | The entities, the ownership model, and the fields that carry meaning |
| 8 | [Persistence](08-persistence.md) | Collections, references, populate and `QueryHelper` |
| 9 | [Controllers](09-controllers.md) | The business rules, the cascades, and the media-type factory |
| 10 | [API surface](10-api-surface.md) | Every route and what it does |
| 11 | [API models and mapping](11-models-and-mapping.md) | The four model families and why the mapper layer exists |
| 12 | [Catalog integrations](12-catalog-integrations.md) | TMDb, Google Books and IGDB, and what their payloads become |
| 13 | [Legacy import](13-legacy-import.md) | The old-app migration and the assumptions it makes |
| 14 | [Logging](14-logging.md) | The categories, the correlation IDs and the redaction |
| 15 | [Utilities](15-utilities.md) | The shared helpers whose behaviour is not obvious |
| 16 | [Testing](16-testing.md) | How tests start, what they mock, and what they already guarantee |
| 17 | [Extension playbooks](17-extension-playbooks.md) | Adding a field, a media type or a route — plus the known characteristics |

Sections are added as the application grows.

## How this is organised

```
docs/technical/
├── README.md          this file — the index and the conventions
└── NN-name.md         one Markdown file per section, numbered as the section
```

- **The numbers are stable.** `§9` means section 9, and file names carry the same number so a directory listing reads in document order. A new section takes the next number rather than renumbering the ones already written.
- **Each file is self-contained enough to act on.** Reading one section should be enough to change the area it covers, with cross-references for what it deliberately does not repeat.
- **Rules do not live here.** What Claude Code must and must not do is in [`CLAUDE.md`](../../CLAUDE.md); these pages explain the code, and the two are kept non-overlapping.
- **Reasoning is inline.** A decision is explained where the thing it decided is described, because the two are read together.
- **The plan is not here.** `TODO.md` in the repository root holds the outstanding work. These pages describe the code as it is, never as it is planned to be.

## Conventions

- A cross-reference is written `§N` or `§N.M` and links to the file it names. A cross-reference into the front end names the sub-project.
- File paths are written relative to `back-end/`, in backticks: `app/controllers/entities/category.ts`.
