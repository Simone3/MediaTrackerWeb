# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Project

Media Tracker is a web application for keeping track of books, movies, TV shows and videogames. The repository holds two **self-sufficient sub-projects**, each with its own dependencies, its own build and test tooling, and its own instructions and documentation:

| Folder | What it is | Where its rules are |
| --- | --- | --- |
| [`front-end/`](front-end) | The React + TypeScript web UI | [`front-end/CLAUDE.md`](front-end/CLAUDE.md) · [`front-end/docs/technical/`](front-end/docs/technical/README.md) |
| [`back-end/`](back-end) | The Express + TypeScript REST API | [`back-end/CLAUDE.md`](back-end/CLAUDE.md) · [`back-end/docs/technical/`](back-end/docs/technical/README.md) |

**Work inside one of them, not from here.** When the task is about the front end, work in `front-end/` and follow its `CLAUDE.md`; when it is about the back end, work in `back-end/` and follow its. There is no root `package.json` and no root build — every command runs inside a sub-project.

A change that spans both is two changes: make each one under its own rules, and say so.

## What lives at the root

| File | Purpose |
| --- | --- |
| `README.md` | The landing page: what Media Tracker is, how to install it, how to run it locally and on Render. Every technical detail belongs in a sub-project's `docs/technical/` |
| `TODO.md` | The outstanding work and the ideas that have not been committed to. Not maintained from here |
| `render.yaml` | The Render Blueprint that deploys both sub-projects |
| `docs/` | Specifications for work that spans both sub-projects, one folder each. A sub-project's own reference stays in its `docs/technical/` |
| `development/` | Local development scratch material, not part of either build |
| `.claude/` | The permission settings and the `/check` and `/sync-docs` commands |

## Hard Rules

- Work only in this repository and only on the current branch.
- Do NOT edit `TODO.md`.
- **This file holds only what is true of the whole repository.** A rule that applies to one sub-project belongs in that sub-project's `CLAUDE.md`; the reasoning behind it belongs in its `docs/technical/`. Do not restate a sub-project's rules here.
- Keep `README.md` a user-facing landing page. It links to the sub-projects; it does not explain them.
- Leave ignored files and `.gitignore` patterns alone.
- Do not push unless asked, and do not amend or rewrite existing commits.

## Workflow

1. Identify which sub-project the task belongs to and move into it.
2. Read that sub-project's `CLAUDE.md`, then the relevant `docs/technical/` sections.
3. Implement, run its lint, typecheck and tests, and fix what breaks.
4. Update the relevant `docs/technical/` section if behaviour, architecture or structure changed.
5. Commit when the task is complete, with an imperative summary as the first line, e.g. `Reject legacy videogame catalog IDs`.
