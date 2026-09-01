# §13 — Text and languages

*[Index](README.md) · [← §12 Styling](12-styling.md)*

---

## 13.1 Every user-facing string is in the bundle

`app/resources/lang/lang-en.json` holds every string the user can read. **Nothing user-facing is hardcoded in a component.**

`app/utilities/i18n.ts` initializes `i18n-js` with locale `en` and fallbacks enabled.

Developer-facing text — console output, log messages, errors only a bug can raise — stays in the module that owns it and stays in English. It is not user-facing and does not belong in the bundle.

**Validation messages are user-facing.** A yup rule whose message a field displays takes one from the bundle, because yup's own default is developer text built from the field key ([§11.6](11-interface.md#116-form-validation-feedback)). `common.validation` holds the wording that suits any field; anything phrased around one field lives under that entity, in `mediaItem.details.validation` and `tvShowSeason.details.validation`.

**Wording that changes with the media type is a key per `mediaType`**, not a `switch` in a component: `mediaItem.list.countByType.*`, `mediaItem.stats.perYear.title.*` and `mediaItem.stats.byStatus.values.*.*` all follow that shape. It is what lets the generic media-item components stay generic ([§8.5](08-domain-model.md#85-generic-media-item)) while still saying "watched", "read" or "played".

## 13.2 Why it stays, with one language

The app ships English only and offers no language selector. The bundle is kept anyway because it is the thing that keeps a second language from being a rewrite: the cost of adding a key today is nearly zero, and the cost of extracting several hundred inline strings later is not.

It also gives the error layer somewhere to go. `ErrorHandlerComponent` turns an `AppError` into a message by looking it up here, which is what lets the whole app raise typed errors and still show readable text ([§6.4](06-redux.md#64-error-handling-and-the-async-pattern)).

`error.flash` is split accordingly: `messages` holds one description per `AppError` constant, naming the operation that failed, and `hints` holds the short lowercase fragments that explain the cause, phrased to be appended to a description by `messageWithHint`. **A hint is a fragment, not a sentence**: it starts lowercase, carries no final punctuation, and has to read correctly after any of the descriptions.

---

[← §12 Styling](12-styling.md) · [§14 Testing →](14-testing.md)
