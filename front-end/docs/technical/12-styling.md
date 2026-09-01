# §12 — Styling

*[Index](README.md) · [← §11 Interface](11-interface.md)*

---

## 12.1 One global stylesheet

`app/web/styles.css` is the whole stylesheet. There is no CSS framework, no CSS-in-JS, no preprocessor and no per-component file — the port kept the mobile app's single centralized sheet, and `index.tsx` imports it once ([§1.4](01-architecture.md#14-boot-flow)).

Adding styles means adding to that file, consistently with what is already there.

## 12.2 Semantic custom properties

The sheet is organised around semantic CSS custom properties rather than literal colors: surfaces, text, borders, accents, states. What that buys is a theme that can be adjusted in one place, which is exactly what a full-bleed dark shell needs.

It also covers the shared skeleton and loading styles, so a new screen's loading state should look like every other one without inventing anything.

**Use the tokens. Avoid raw hex and `rgba()` in components** — a literal color in a component is invisible to the theme and will drift from it.

### The status colors are used twice

The five `--color-media-item-status-*` tokens paint the badges on the list rows, and the stats screen borrows four of them for its own figures and for the donut ([§10.9](10-features.md#109-media-items-stats)). One of the two uses needed something the other did not: `--color-media-item-status-new` is a translucent white overlay, which reads correctly on a row but lets the card show through a ring segment, so `--color-media-item-status-new-solid` sits beside it as the opaque grey the donut paints *Not started* with. **They are meant to look like the same colour** — changing one without the other makes the two screens disagree about what "not started" looks like.

## 12.3 Colors that come from config

Two kinds of color are deliberately *not* tokens:

- **Category and own-platform color presets** come from config ([§4.4](04-configuration.md#44-what-else-config-owns)) because they are data the user picks from, not theme decisions. The color picker offers them and the chosen value is stored on the entity.
- **Static accent presets** exist for a few flows, TV show seasons among them.

Own-platform badges combine the two worlds: the icon is a CSS mask, and the stored platform color paints through it via `buildOwnPlatformMaskStyle(...)` ([§10.6](10-features.md#106-own-platforms)). The `url(...)` it builds is unquoted and holds an inline SVG data URI, which is why the build escapes those aggressively ([§3.5](03-build-and-run.md#35-images-are-inlined-into-the-bundle)).

## 12.4 The boot placeholder

`public/index.html` carries an inline `<style>` block and a small `#root` placeholder: the app background and the same full-screen spinner the first React screen renders ([§1.4](01-architecture.md#14-boot-flow)).

It exists because the stylesheet travels *inside* the bundle — `index.tsx` imports `styles.css` and `style-loader` injects it at runtime — so until the bundle has downloaded, parsed and executed there is neither markup nor styling and the page is a white rectangle. The placeholder paints on the first frame instead, out of the HTML alone.

**It is the one place allowed to repeat literal token values**, precisely because it has to work without the stylesheet: `--color-background-app`, `--color-scrim-strong`, `--color-surface-overlay-border` and `--color-accent`, plus the `.loading-indicator-container-full-screen` and `.loading-indicator-spinner` geometry. `tests/boot-placeholder.test.ts` reads both files and fails when a copy drifts from the token it mirrors, so **changing one of those tokens means changing the template too**.

Nothing tears the placeholder down: React clears `#root` on its first commit. The spinner fades in a beat late, so a warm cache goes straight from the background into the app without a spinner blinking on and off.

## 12.5 Hover effects are gated on a hovering pointer

Almost every interactive surface lifts by a pixel and brightens on `:hover`. On a touch screen that reads as a defect: the browser emulates hover under the finger, so scrolling a list drags the emulated hover from row to row and each row it passes animates its 0.2s lift. The list trembles under the finger, and a tapped control keeps its hover state afterwards.

So **every hover effect lives inside a `@media (hover: hover)` block**, kept next to the component it belongs to rather than collected at the end of the sheet. Two consequences to keep in mind when adding one:

- A rule that pairs `:hover` with `:focus-visible` has to be split. The `:focus-visible` half stays outside the query — keyboard focus is not a pointer and must keep working on a touch device — and only the `:hover` half moves in, which means repeating the declarations.
- Keep the block where the ungated rule was. Several of these effects are deliberately overridden by a later rule of equal specificity (the selection styling on `.entity-management-list-row`, the `transform: none` reset for `.media-item-row-options` under `max-width: 960px`), and source order is what decides those.

The gate is the pointer capability, not the viewport width: a desktop window narrowed past the mobile breakpoint still has a mouse and keeps its hover effects. It resolves per *primary* pointer, so a laptop with both a trackpad and a touch screen reports `hover: hover` and can still tremble when scrolled by finger. Fixing that would take runtime `pointerType` detection driving a class on the root element, which the sheet deliberately does not do.

## 12.6 The root scroller keeps its native overscroll

`html` and `body` deliberately carry no `overscroll-behavior`, so the document scroller keeps every default the browser gives it — including **pull-to-refresh on mobile**, which users expect from any page that scrolls.

They used to carry `overscroll-behavior-y: none`, added while fixing a desktop Chrome artifact: elastic overscroll dragged the app shell away from the viewport edge and revealed the old light page background as a white strip above and below it. That was a background bug, and it was fixed as one — `html`, `body` and `#root` are painted `--color-background-app`, and the light gradient of the classic authenticated pages sits on `.app-shell-content` instead of on the whole document ([§12.2](#122-semantic-custom-properties)). Overscroll now bounces against the shell color and there is nothing to see, so the property was removed and the mobile gesture came back.

Which means: **do not reach for `overscroll-behavior` on the root to hide something showing through at the edges.** What shows through is a background that is wrong, and suppressing the scroll gesture to hide it costs pull-to-refresh on every phone. `contain` is no cheaper than `none` here — both disable the gesture on the root scroller; only `auto` keeps it. The property is still the right tool one level down, on a scrollable panel that should not chain its scroll to the page behind it.

## 12.7 The invalid control state

`.text-input`, `.select-input` and `.textarea-input` turn red through `[aria-invalid='true']`, not through a class. The attribute has to be there anyway for screen readers, so keying the styling off it means a control cannot be visually invalid without also being announced as invalid — and the shared controls pass it through already, so no component had to grow an `invalid` prop.

The inline message under the control is `.field-error`, painted `--color-text-on-dark-danger`. Both live next to the control rules rather than with the danger buttons, and `tests/form-control-styles.test.ts` asserts them.

The states compose: the invalid focus rule wins on specificity, so a focused invalid control keeps the red border and swaps the accent focus ring for `--color-danger-soft`.

---

[← §11 Interface](11-interface.md) · [§13 Text and languages →](13-text-and-languages.md)
