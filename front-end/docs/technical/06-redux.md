# §6 — Redux state

*[Index](README.md) · [← §5 Navigation](05-navigation.md)*

The slices, what survives a reload, and the two patterns every async flow follows.

---

## 6.1 Root wiring

- reducer: `app/redux/reducers/root.ts`
- saga: `app/redux/sagas/root.ts`

**The root reducer resets the entire store on `COMPLETE_LOGGING_USER_OUT`.** That is the only global reset, and it is what guarantees no previous user's data survives a logout.

## 6.2 State slices

`app/redux/state/state.ts`

| Slice | Purpose | Persisted? |
| --- | --- | --- |
| `error` | global flash error | reset on persistence |
| `userGlobal` | authenticated user + auth status | reset to initial `REQUIRES_CHECK` on persistence |
| `userOperations` | auth request statuses | reset on persistence |
| `categoryGlobal` | selected category | persisted |
| `categoriesList` | categories list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `categoryDetails` | category form state | entity persists, save status resets |
| `mediaItemsList` | current media list, mode, search/filter/sort | entity list persists, status resets to `REQUIRES_FETCH` |
| `mediaItemDetails` | current media item form + draft + catalog state | entity/draft persist, save/catalog statuses reset |
| `groupGlobal` | selected group | persisted |
| `groupsList` | groups list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `groupDetails` | group form state | entity persists, save status resets |
| `ownPlatformGlobal` | selected platform | persisted |
| `ownPlatformsList` | platform list + highlighted row | list data persists, status resets to `REQUIRES_FETCH` |
| `ownPlatformDetails` | platform form state | entity persists, save status resets |
| `tvShowSeasonsList` | local season-editing list + completion timestamp | persisted |
| `tvShowSeasonDetails` | current season form state | persisted, save status resets |

The `*Global` slices are the cross-screen context the routes deliberately do not carry ([§5.1](05-navigation.md#51-route-map)): the category a media list belongs to, and the group or platform a form is waiting on ([§15.2](15-invariants-and-pitfalls.md#152-groupplatform-selections-are-global-transient-state)).

## 6.3 The persistence contract

`app/redux/persistence.ts`, session key `media-tracker-redux-state`.

- **`sessionStorage`, not `localStorage`** — a persisted session dies with the tab.
- **Only persists while `userGlobal.status === 'AUTHENTICATED'`.**
- **Dates are encoded as `{ _type: 'Date', _value: iso }`** and revived on load, because JSON has no date type and the store carries real `Date` objects ([§6.5](#65-redux-holds-non-plain-values)).
- **Invalid payloads are cleared** rather than partially applied.
- **Persisted auth is not trusted.** `mapStateForPersistence()` resets `userGlobal` to its initial state, so a reload always re-checks the login status through the controller instead of believing what was in storage ([§7.1](07-authentication.md#71-the-flow)).

### What a reload deliberately loses

- list slices come back as `REQUIRES_FETCH`
- highlighted items are cleared
- media-item list mode `SET_FILTERS` becomes `NORMAL`

**This is the point of the design, not a gap in it.** Persistence keeps the user's *context* — which category they were in, which item they were editing, the draft they had not saved — while making the *data* reload for real. Do not "optimize" a persisted list slice to come back as `FETCHED`; a browser refresh is expected to behave like a refresh ([§15.5](15-invariants-and-pitfalls.md#155-persistence-intentionally-invalidates-lists)).

## 6.4 Error handling and the async pattern

Global errors take one path:

1. a saga (or anything else) dispatches `setError(...)`
2. `ErrorHandlerContainer` reads `state.error.error`
3. `ErrorHandlerComponent` converts the `AppError` to an i18n message
4. a toast shows for 3 seconds
5. the Redux error is cleared immediately after being surfaced

Most CRUD flows follow one shape:

1. an action generator emits the intent action
2. the saga dispatches `START_*`
3. the saga calls the controller
4. the saga dispatches `COMPLETE_*` or `FAIL_*`
5. reducers update the status flags the UI renders from
6. the navigation saga may react to the completion action ([§5.4](05-navigation.md#54-saga-driven-navigation))

**Duplicate-name confirmation lives in sagas, not in forms** — for categories, groups, own platforms and media items alike. The saga discovers the conflict, sets `saveStatus` to `REQUIRES_CONFIRMATION`, and the form reacts by opening `SameNameConfirmationComponent`. Putting that check in the form would mean four copies of it and a form that has to know how to query.

## 6.5 Redux holds non-plain values

The store carries `Date` objects and other values a strict serializable check would reject, and `initializeRedux()` turns those checks off for both actions and state ([§1.4](01-architecture.md#14-boot-flow)).

The trade is explicit: the app keeps working with real dates everywhere instead of ISO strings, and pays for it with a custom persistence encoder and no framework warning when something unserializable is added. Redux Toolkit will not catch that mistake here.

---

[← §5 Navigation](05-navigation.md) · [§7 Authentication →](07-authentication.md)
