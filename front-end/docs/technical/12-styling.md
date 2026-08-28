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

---

[← §11 Interface](11-interface.md) · [§13 Text and languages →](13-text-and-languages.md)
