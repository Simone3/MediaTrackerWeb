# §5 — Navigation

*[Index](README.md) · [← §4 Configuration](04-configuration.md)*

Navigation here is four things at once: React Router matching, Redux action dispatches, saga side effects, and a global `navigationService`. **If a screen opens or redirects unexpectedly, the cause is almost always [§5.4](#54-saga-driven-navigation), not a click handler.**

---

## 5.1 Route map

`app/utilities/navigation-routes.ts` maps the screen identifiers in `app/utilities/screens.ts` to paths.

| Screen/Section | Path |
| --- | --- |
| `AppSections.Unauthenticated` | `/auth` |
| `AppSections.Authenticated` | `/app` |
| `AppSections.Media` | `/media` |
| `AppSections.Settings` | `/settings` |
| `AppScreens.AuthLoading` | `/auth/loading` |
| `AppScreens.UserLogin` | `/auth/login` |
| `AppScreens.UserSignup` | `/auth/signup` |
| `AppScreens.CategoriesList` | `/media/categories` |
| `AppScreens.CategoryDetails` | `/media/categories/details` |
| `AppScreens.MediaItemsList` | `/media/items` |
| `AppScreens.MediaItemDetails` | `/media/items/details` |
| `AppScreens.TvShowSeasonsList` | `/media/tv-show-seasons` |
| `AppScreens.TvShowSeasonDetails` | `/media/tv-show-seasons/details` |
| `AppScreens.GroupsList` | `/media/groups` |
| `AppScreens.GroupDetails` | `/media/groups/details` |
| `AppScreens.OwnPlatformsList` | `/media/platforms` |
| `AppScreens.OwnPlatformDetails` | `/media/platforms/details` |
| `AppScreens.Settings` | `/settings` |
| `AppScreens.Credits` | `/settings/credits` |

**No path carries an entity ID.** A details route says which *kind* of thing is being edited; *which* thing it is comes from Redux. That is the port's model, and it is the reason a details URL opened cold has nothing to render ([§15.1](15-invariants-and-pitfalls.md#151-category-context-is-required-for-most-media-flows)).

## 5.2 Router composition

`app/components/containers/navigation/*`

- **`AppNavigationContainer`** owns `BrowserRouter` and bridges React Router's `navigate()` into `navigationService`, so code outside the component tree can still navigate.
- **`ConnectedAuthenticationNavigator`** chooses the auth-loading, unauthenticated, or authenticated subtree from Redux ([§7](07-authentication.md)).
- **`AuthenticatedNavigator`** switches between `/media/*` and `/settings/*`.
- **`MediaNavigator`** owns every media, category, group, platform and season route, and wraps the six screens the media item form opens in `MediaItemUnsavedChangesGuardContainer` ([§15.3](15-invariants-and-pitfalls.md#153-dirty-form-protection-is-browser-oriented)).
- **`SettingsNavigator`** owns settings and the nested credits screen.

## 5.3 `navigationService`

`app/utilities/navigation-service.ts` is the global handle sagas use:

- `navigate(routeName)` converts a screen ID to a path and pushes it
- `back()` uses `navigate(-1)` semantics through the router
- **`setParam()` is intentionally a stub that only logs to the console**

`setParam()` is a leftover of the React Native navigator's API. It was not ported because the web app carries screen context in Redux instead of in route params. **Do not build logic that depends on it** — it will silently do nothing.

## 5.4 Saga-driven navigation

`app/redux/sagas/navigation/navigation.ts` is where most screen changes actually happen.

| Action | Effect |
| --- | --- |
| `SELECT_CATEGORY` | navigate to the media items list |
| `LOAD_*_DETAILS`, `LOAD_NEW_*_DETAILS` | navigate to the matching details screen |
| `COMPLETE_SAVING_*` | go back |
| `REQUEST_GROUP_SELECTION` | open the groups list |
| `REQUEST_OWN_PLATFORM_SELECTION` | open the own-platforms list |
| `SELECT_GROUP` | go back |
| `SELECT_OWN_PLATFORM` | go back |
| `START_TV_SHOW_SEASONS_HANDLING` | open the seasons list |
| `COMPLETE_TV_SHOW_SEASONS_HANDLING` | go back |

**The pattern is the same throughout: a component dispatches an intent, a reducer records it, and the navigation saga moves the screen.** That is why adding a `navigate()` call to a click handler usually produces a double navigation rather than the intended one — the saga was already going to handle it.

## 5.5 Scroll position

Every screen change happens inside the same document, so the browser never resets the scroll offset on its own when a screen is *opened*: a details screen pushed from a scrolled-down list would render under the viewport offset the list was left at. `ScrollToTopOnNewScreen`, in `app/components/containers/navigation/app-navigator.tsx`, scrolls the window back to the top on every `PUSH` and `REPLACE` navigation to correct that.

**It deliberately does nothing on `POP`.** `history.scrollRestoration` is left at its default `'auto'`, so going back — including the saga-driven `back()` calls in [§5.4](#54-saga-driven-navigation) — lets the browser put the previous screen back at the exact offset the user left it at. Scrolling to the top there too would break that.

The effect keys off `location.key` rather than the path, because [no path carries an entity ID](#51-route-map): two different media items share `/media/items/details`, and a path-keyed effect would not fire if the same path were ever pushed twice in a row.

There is no `<ScrollRestoration>` in the tree: that component requires a data router, and [§5.2](#52-router-composition) uses a plain `BrowserRouter`.

---

[← §4 Configuration](04-configuration.md) · [§6 Redux state →](06-redux.md)
