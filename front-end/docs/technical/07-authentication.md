# §7 — Authentication

*[Index](README.md) · [← §6 Redux state](06-redux.md)*

---

## 7.1 The flow

Auth state lives in Redux and starts as `REQUIRES_CHECK`.

1. the app starts on `AuthLoadingScreenComponent`
2. the `CHECK_USER_LOGIN_STATUS` saga asks `userController.getCurrentUser()`
3. the reducer turns the result into `AUTHENTICATED` or `UNAUTHENTICATED`
4. `ConnectedAuthenticationNavigator` switches to the matching subtree ([§5.2](05-navigation.md#52-router-composition))

**A failed login-status check still falls back to `UNAUTHENTICATED`.** An error here must not leave the user stuck on the loading screen forever; sending them to login is always recoverable, and the next check happens on the next load.

This runs on every load, including a reload with persisted state, because persistence deliberately resets `userGlobal` to its initial value ([§6.3](06-redux.md#63-the-persistence-contract)).

## 7.2 Real authentication

`app/controllers/implementations/real/entities/user.ts`

- Firebase Web Auth, on a **named** Firebase app: `media-tracker-web`
- **waits for the first `onAuthStateChanged` event before reading `currentUser`** — Firebase reports `null` until it has restored the session, so reading eagerly would log every returning user out
- login and signup are email + password
- the access token comes from `firebaseUser.getIdToken()` and goes into the `Authorization` header of every back-end call
- **the SDK error travels intact to the saga**, which wraps it with `withDetails()`: that is what lets the toast say *why* a login or a signup was rejected instead of only that it was ([§6.4](06-redux.md#64-error-handling-and-the-async-pattern))

Which Firebase project is used is a config decision ([§4](04-configuration.md)).

## 7.3 Mock authentication

`app/controllers/implementations/mocks/entities/user.ts`

- keeps a mocked current user in browser `localStorage`
- seeded with one user, `test@test.test`
- returns `-fake-access-token-`

Note the asymmetry with [§6.3](06-redux.md#63-the-persistence-contract): the mocked *user* is in `localStorage` and outlives the tab, while the Redux session is in `sessionStorage` and does not.

## 7.4 Logging out

Settings opens a confirmation dialog and dispatches `LOG_USER_OUT`. On completion the root reducer resets the entire Redux store ([§6.1](06-redux.md#61-root-wiring)), which is also what stops persistence from writing — it only runs while the status is `AUTHENTICATED`.

---

[← §6 Redux state](06-redux.md) · [§8 Domain model →](08-domain-model.md)
