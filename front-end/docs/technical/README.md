# Media Tracker front end — technical reference

**Implementation documentation**

How the web app is built: how it boots, how navigation really happens, which Redux slices matter, where data comes from, which shared components already exist, and what is easy to break.

Media Tracker Web is a React + TypeScript single-page application for tracking books, movies, TV shows and videogames. It is the web port of an older React Native app and **still reads like one on purpose**: Redux owns screen state, sagas drive navigation, and containers are `connect(...)`-based. Prefer parity with that architecture over modernization ([§1.2](01-architecture.md#12-it-is-a-port-and-it-still-reads-like-one)).

What is worth knowing before changing anything: **routes carry no entity IDs** — screen context lives in Redux and is restored from `sessionStorage`, and screens throw without it ([§5.1](05-navigation.md#51-route-map), [§15.1](15-invariants-and-pitfalls.md#151-category-context-is-required-for-most-media-flows)); **screens open because an action was dispatched**, not because a component navigated ([§5.4](05-navigation.md#54-saga-driven-navigation)); and **a reload deliberately invalidates every list** ([§6.3](06-redux.md#63-the-persistence-contract)).

The back end this app talks to documents itself in [`../../../back-end/docs/technical/`](../../../back-end/docs/technical/README.md).

---

## Contents

| § | Section | What it answers |
| --- | --- | --- |
| 1 | [Architecture](01-architecture.md) | What the app is, the shape it inherited, and what happens at boot |
| 2 | [Repository map](02-repository-map.md) | Where every file is and what it is for |
| 3 | [Build and run](03-build-and-run.md) | The commands, the dev server and how webpack is wired |
| 4 | [Configuration](04-configuration.md) | How the environment is resolved, and everything config owns |
| 5 | [Navigation](05-navigation.md) | The routes, the navigators, and the saga that actually moves screens |
| 6 | [Redux state](06-redux.md) | The slices, what survives a reload, and the shape of every async flow |
| 7 | [Authentication](07-authentication.md) | How the app decides who is logged in |
| 8 | [Domain model](08-domain-model.md) | The internal models and the fields on each media type |
| 9 | [Data layer](09-data-layer.md) | Controllers, mocks, REST transport, endpoints and the media-type factories |
| 10 | [Features](10-features.md) | Each screen area, its entry files, and the non-obvious behaviour |
| 11 | [Interface](11-interface.md) | Containers, presentational components and the shared building blocks |
| 12 | [Styling](12-styling.md) | The one stylesheet, the tokens, and the colors that are data |
| 13 | [Text and languages](13-text-and-languages.md) | How wording reaches the screen |
| 14 | [Testing](14-testing.md) | What is tested, where it lives, and the import trap |
| 15 | [Invariants and pitfalls](15-invariants-and-pitfalls.md) | What looks like a bug and is not, plus the debugging checklist |
| 16 | [Extension playbooks](16-extension-playbooks.md) | Adding a screen, a media-item field, or a whole media type |

Sections are added as the application grows.

## How this is organised

```
docs/technical/
├── README.md          this file — the index and the conventions
└── NN-name.md         one Markdown file per section, numbered as the section
```

- **The numbers are stable.** `§4` means section 4, and file names carry the same number so a directory listing reads in document order. A new section takes the next number rather than renumbering the ones already written.
- **Each file is self-contained enough to act on.** Reading one section should be enough to change the area it covers, with cross-references for what it deliberately does not repeat.
- **Rules do not live here.** What Claude Code must and must not do is in [`CLAUDE.md`](../../CLAUDE.md); these pages explain the code, and the two are kept non-overlapping.
- **Reasoning is inline.** A decision is explained where the thing it decided is described, because the two are read together.
- **The plan is not here.** `TODO.md` in the repository root holds the outstanding work. These pages describe the code as it is, never as it is planned to be.

## Conventions

- A cross-reference is written `§N` or `§N.M` and links to the file it names. A cross-reference into the back end names the sub-project.
- File paths are written relative to `front-end/`, in backticks: `app/redux/sagas/root.ts`.
