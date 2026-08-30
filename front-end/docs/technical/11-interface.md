# §11 — Interface

*[Index](README.md) · [← §10 Features](10-features.md)*

The container/presentational split the app inherited, and the shared pieces that keep it from multiplying.

---

## 11.1 Containers

`app/components/containers/**`. A container typically:

- maps Redux state to props
- maps dispatch functions to props
- renders almost nothing itself
- **throws early if required global context is missing**

That last one is deliberate. A media-item container without `categoryGlobal.selectedCategory` cannot produce a correct screen, and failing at the boundary is easier to trace than rendering a half-empty one ([§15.1](15-invariants-and-pitfalls.md#151-category-context-is-required-for-most-media-flows)). What the user sees when one of those throws is [§11.5](#115-the-screen-error-boundary).

## 11.2 Presentational components

`app/components/presentational/**`. These own:

- the markup
- local dialog state
- the `componentDidMount` / `componentDidUpdate` fetch triggers
- the Formik forms
- responsive behaviour

Most are still class components. **That is not a backlog item** — the lifecycle-driven fetch pattern is what the port uses, and rewriting a working screen to hooks buys nothing on its own ([§1.2](01-architecture.md#12-it-is-a-port-and-it-still-reads-like-one)).

## 11.3 Shared building blocks

Reach for these before writing a screen-specific variant:

| Component | What it is |
| --- | --- |
| `generic/authenticated-page-header` | The sticky top header of the authenticated shell |
| `generic/entity-management-screen` | The manage-and-pick screen used by groups and platforms |
| `generic/entity-management-list` | The list inside it, used by groups, platforms and TV show seasons. Rows carry no inline buttons: each one owns a `...` control that opens `generic/responsive-action-menu` with the actions the screen supplies, the way the category list does |
| `generic/entity-search-bar` | The client-side search field the group and platform screens put above their list. It only filters what is already in the store: there is no fetch behind it |
| `generic/entity-details-frame` | The standard details shell |
| `generic/responsive-action-menu` | Popover on desktop, bottom sheet on mobile |
| `generic/browser-back-navigation-guard` | Dirty-form protection, wired to the media item flow by `MediaItemUnsavedChangesGuardContainer` ([§15.3](15-invariants-and-pitfalls.md#153-dirty-form-protection-is-browser-oriented)) |
| `generic/error-boundary` | The React error boundary around every screen, mounted by `ScreenErrorBoundary` ([§11.5](#115-the-screen-error-boundary)) |
| `generic/same-name-confirmation` | The duplicate-name dialog the sagas trigger |
| `generic/confirm-dialog` | The generic confirmation |
| `generic/pill-button` | |
| `generic/input`, `generic/select`, `generic/textarea`, `generic/clearable-input` | The form controls |
| `generic/color-picker` | Fed by the config color presets ([§12.3](12-styling.md#123-colors-that-come-from-config)) |
| `generic/responsive-header-add-button` | |
| `generic/media-switcher` | |

**Category details is the one screen that predates `EntityDetailsFrameComponent`** and still uses its own header/form shell ([§10.1](10-features.md#101-categories)). It is the exception, not the pattern to copy.

## 11.4 Responsive behaviour

Layout responsiveness is CSS. Where behaviour has to change — not just appearance — use `MOBILE_LAYOUT_BREAKPOINT` from `app/utilities/layout.ts`. **Do not introduce a second hardcoded breakpoint**; two numbers that are supposed to agree eventually will not.

`ResponsiveActionMenuComponent` is currently the only shared component that switches behaviour on it.

The authenticated experience is a shared sticky top header over a full-bleed dark shell. Preserve that structure rather than reintroducing per-screen navigation chrome or a light-shell variant.

## 11.5 The screen error boundary

`generic/error-boundary`, mounted by `ScreenErrorBoundary` in `containers/navigation/app-navigator.tsx` between `BrowserRouter` and the authentication navigator ([§5.2](05-navigation.md#52-router-composition)).

**It exists because a container throw is not a contained failure.** The containers of [§11.1](#111-containers) throw from `mapStateToProps`, which runs during render, and React unmounts the whole root on an uncaught render error: without a boundary the entire app disappears and the user is left on a blank page with only a console message. The boundary turns that into an error screen with a way back to the home screen.

Two props carry everything it needs from the router:

- **`resetKey`** is `useLocation().key`. The boundary clears its error whenever the key changes, so opening a new screen — including through the recovery button and through browser back — gets a fresh attempt at rendering. Without it the fallback would outlive the screen that caused it.
- **`recover`** navigates to the media section, whose catch-all lands on the categories list ([§5.1](05-navigation.md#51-route-map)).

**This is a safety net, not the answer to the cold-URL problem.** What keeps a directly opened route from reaching a screen it cannot render is the context guard ([§5.6](05-navigation.md#56-screens-that-cannot-be-opened-cold)); the boundary is what remains behind it, for the container throws that should now be unreachable from a URL. It also does not catch what is not a render error: saga failures still take the toast path of [§6.4](06-redux.md#64-error-handling-and-the-async-pattern).

---

[← §10 Features](10-features.md) · [§12 Styling →](12-styling.md)
