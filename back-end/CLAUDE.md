# CLAUDE.md — back end

Instructions for Claude Code when working in `back-end/`.

`docs/technical/` is the detailed reference for this sub-project, split into numbered sections: architecture, repository map, build and run, configuration, authentication, validation and errors, the domain model, persistence, controllers, the API surface, mapping, catalog integrations, logging, utilities, testing and the extension playbooks. Start from [`docs/technical/README.md`](docs/technical/README.md) and read ONLY the sections relevant to the current task, before changing code in an area you have not touched yet in the current session. This file holds only the rules and commands; the reasoning behind them lives there.

## Project

The back end of Media Tracker: a plain Express + TypeScript API on MongoDB via Mongoose, authenticated with Firebase, running on Node.js 22.x. It serves the web front end and nothing else — no HTML, no sessions, no cookies.

The front end lives in `../front-end` and is a separate self-sufficient project with its own `CLAUDE.md` and `docs/technical/`. Work here unless asked otherwise.

## Commands

```sh
npm run build      # tsc, then tsc-alias, then copy the config fallback into build/
npm start          # node build/index.js  (build first)
npm run debug      # ts-node-dev with --inspect and --respawn, no build step
npm run lint       # ESLint flat config (eslint.config.js)
npm run typecheck  # tsc --noEmit
npm test           # nyc node test/run-tests.cjs
```

`npm test` needs the local test environment: the MongoDB test database from `test/global/config-test.ts` and the ability to bind the local test server port.

## Hard Rules

- Work only in this repository and only on the current branch.
- Keep `CLAUDE.md` and `docs/technical/` from going stale: fix either one when it contradicts the state of the project. A new section takes the next number rather than renumbering the ones already written, and the index in `docs/technical/README.md` lists every file in the folder.
- `docs/technical/` is where a decision is recorded, and settling one does not earn a `CLAUDE.md` entry — add a rule here only when it would change what gets written *before* the relevant `docs/technical/` section would be read. Anything scoped to a single area belongs in that section alone.
- `README.md` in this folder is a short landing page. Every technical detail belongs in `docs/technical/`, which it links to.
- Do NOT introduce extra libraries unless you justify them briefly and they clearly reduce work or risk.
- `package.json` dependencies must use exact versions. No `^` or `~`.
- Use plain Express with TypeScript. Do NOT add an application framework such as NestJS: nothing may own routing, dependency injection or the controller model.
- Leave ignored files and `.gitignore` patterns alone.
- **Generic "media item" modules must stay generic** and must never contain book-, movie-, TV-show- or videogame-specific logic or references. Delegate those to the specific movie, TV show, book and videogame modules ([§7.5](docs/technical/07-domain-model.md#75-media-item-common-fields)).

## Architecture Rules

- **Keep routes thin.** A route file validates requests, maps API models to internal models, calls a controller, and maps the result back to an API response. Business rules belong in controllers ([§1.2](docs/technical/01-architecture.md#12-the-layers)).
- Use the existing layering consistently: API boundary types in `app/data/models/api`, internal application types in `app/data/models/internal`, persistence shape in `app/schemas`, conversions in `app/data/mappers`, business logic in `app/controllers`.
- **Use `parserValidator` plus the existing API model classes** for request validation instead of ad hoc validation in routes or controllers ([§6.1](docs/technical/06-validation-and-errors.md#61-one-validator-for-everything)).
- **Use `QueryHelper`** for database access instead of adding one-off Mongoose access styles per controller — a direct query loses the collation, the populate flags and the performance logging ([§8.5](docs/technical/08-persistence.md#85-queryhelper)).
- **If behaviour depends on media type, resolve it through `mediaItemFactory`** instead of duplicating a `switch` across the codebase ([§9.8](docs/technical/09-controllers.md#98-mediaitemfactory)).
- Reuse the generic media-item infrastructure before adding new abstractions: `app/routes/media-items/media-item.ts`, `app/controllers/entities/media-items/media-item.ts`, `app/data/models/api/media-items/media-item.ts`, `app/data/models/internal/media-items/media-item.ts`, `app/data/mappers/media-items/media-item.ts`.
- External catalog integrations go through the existing catalog controllers, external-service mappers and `restJsonInvoker` ([§12.1](docs/technical/12-catalog-integrations.md#121-the-shared-invoker)).

## Behavioral Invariants

These are the rules a change can break silently. Do not relax one without changing the section that explains it.

- **There is no user collection.** Resource ownership is a Firebase UID string stored in documents and compared against the authenticated user. Database reads, writes and cascades carry owner conditions whenever a user context is available ([§5.2](docs/technical/05-authentication.md#52-authorization)).
- **Authentication is globally enabled.** Only `OPTIONS` requests and `GET /status` are unauthenticated. Catalog routes are authenticated too, even though they are not `:userId`-scoped.
- **A category's `mediaType` must not change if the category already contains media items.**
- **Deleting a category cascades** to its groups, media items and own platforms.
- **Deleting a group deletes the media items in that group.**
- **Deleting an own platform unlinks it from media items** rather than deleting them.
- **Merging own platforms rewrites media-item references** from the removed platforms to the kept one; no item may be left pointing at a deleted platform.
- **Code that writes or transforms `completedOn` must keep `completedLastOn` consistent** ([§7.5](docs/technical/07-domain-model.md#75-media-item-common-fields)).
- **TV show seasons must stay positive, unique, and ordered by season number.**
- **A `QueryHelper.find` without pagination options returns every matching document**, and every media-item sort ends with the ID as a tiebreaker. Cascades and bulk reads depend on the first; paginated requests silently repeat and skip rows without the second ([§8.7](docs/technical/08-persistence.md#87-pagination)).

## Code Conventions

- Match the existing code style exactly, including spacing and newline conventions. Read a neighbouring file before writing a new one.
- Prefer existing project patterns over new abstractions, but do centralize behaviour into shared utilities/helpers when convenient.
- Use internal models inside controllers and API models at the route boundary; never let an API model reach the business logic.
- Tunable values (timeouts, user agents, image base paths, provider field names such as TMDb's `directorJobName`) belong in the config, not inline in modules ([§4.3](docs/technical/04-configuration.md#43-external-api-config)).

## Testing

Testing should cover as much logic as practical, with both unit and integration tests. Integration tests run against a real MongoDB and a real Express server, so they exercise the middleware stack, validation and persistence together.

All three checks must pass before a feature or fix is considered done:

```sh
npm run lint && npm run typecheck && npm test
```

## Workflow

1. For a non-trivial change, read the relevant `docs/technical/` section first.
2. Implement, following the conventions above.
3. Run lint, typecheck, and tests. Fix what breaks.
4. Update the relevant `docs/technical/` section if behaviour, architecture, or repository structure changed.
5. Commit, with an imperative summary as the first line, e.g. `Reject legacy videogame catalog IDs`.

Commit when a task is complete. Do not amend or rewrite existing commits, and do not push unless asked.
