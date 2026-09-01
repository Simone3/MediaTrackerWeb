# §14 — Testing

*[Index](README.md) · [← §13 Text and languages](13-text-and-languages.md)*

---

## 14.1 What is tested, and how much

Testing stays **minimal but meaningful**: focused unit tests for logic-heavy helpers, plus one or two smoke tests for each critical user flow. The goal is not coverage; it is that a flow which mattered enough to build breaks loudly when it stops working.

All three checks must pass before a feature or fix is done:

```sh
npm run lint && npm run typecheck && npm test
```

## 14.2 Jest

`jest.config.js`

- environment: `jsdom`
- roots: `app` and `tests`
- TS and TSX transformed through `babel-jest` (`babel.config.js`)
- CSS mocked by `tests/style-mock.js`, images by `tests/file-mock.js`
- setup file: `tests/setup-tests.ts`

Tests live in one flat `tests/` folder: `*.test.ts(x)` for units, `*.smoke.test.tsx` for screens.

**Keep test imports narrow.** A tiny local Redux store is usually better than importing broad app modules — the decorator-heavy API models pull `reflect-metadata` and `class-validator` into the graph, and that is where unrelated Jest/Babel parsing failures come from. A smoke test that suddenly fails to parse a file it does not use is nearly always this.

## 14.3 ESLint

`eslint.config.js` is a TypeScript-aware flat config:

- stylistic rules are warning-level
- React and React Hooks safety rules are enabled
- the repository style is tabs and single quotes

## 14.4 What the current suite covers

- auth screens and authenticated navigation
- categories, media items, groups, platforms, settings and credits smoke tests
- the shared form controls
- the browser-back guard, and the media item flow guard on the screens the form opens
- navigation routes and `navigationService`
- Redux persistence
- the REST invoker and the back-end invoker
- the Firebase user controller
- the webpack config
- the boot placeholder, against the tokens it copies
- the media items stats screen, its state slice, and the two pieces of real logic behind its charts: filling the year range including the empty years, and the bar scale the four importance boxes share ([§10.9](10-features.md#109-media-items-stats))

New logic in `app/utilities`, `app/redux` and the media-item form data helpers should come with a unit test; a new screen should come with a smoke test.

---

[← §13 Text and languages](13-text-and-languages.md) · [§15 Invariants and pitfalls →](15-invariants-and-pitfalls.md)
