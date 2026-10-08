# Optional welcome sheet — 4 October 2026

This is the preserved sheet trial. The owner rejected its composition; the current Home uses the smaller, nonmodal [welcome banner](../welcome-banner-2026-10-04/README.md). The preview links below now show that replacement. The earlier lock-blocked handoff at the end is historical.

The App template demo has a compact first-visit greeting with its configured dealer logo/name, BG/EN language choice and one action to browse cars. It is 268px tall in the inspected Drive24 configuration, floats 12px above the bottom edge on phones and centers at a maximum width of 400px on wider screens. Language and close controls have 44px targets; the black primary pill is 48px tall.

`lib/dealer.json` enables the demo with `welcomeEnabled: true`. The optional field defaults to off in existing dealer configurations. The greeting uses `DealerBrand`, the configured name and enabled locales; no dealer identity is hardcoded. A single-locale configuration hides the language prompt and controls.

Dismissal is remembered in local storage using a versioned dealer/mount key, with an in-memory fallback when storage is unavailable. Language links use the existing localized Home routes and preference cookie. The main action opens Cars in the selected language. The sheet uses `useModal` for keyboard focus, background isolation and scroll locking; automatic opening adds no history entry.

For review, [open the Bulgarian welcome preview](http://127.0.0.1:6483/bg?welcome=1) or [the English preview](http://127.0.0.1:6483/en?welcome=1). The explicit review flag bypasses remembered dismissal and is removed when the sheet closes.

| Mobile 390 × 844, scroll 0 | Evidence |
| --- | --- |
| Before | [Homepage](bg-390-before.jpg) |
| First-visit render | [Initial greeting](bg-390-after.jpg) |
| Final greeting | [After](bg-390-final.jpg) |

The native scrollbar is present in the unobstructed before view; modal scroll locking removes it in the after view. Further captures: [Bulgarian 320px](bg-320-after.jpg), [Bulgarian desktop](bg-1440-after.jpg), [English 390px](en-390-after.jpg).

Focused checks cover BG 320/390/768/1440px and EN 320/390/1440px, plus the default 1280px preview. Every inspected sheet fitted its viewport, its configured logo loaded, controls retained their hit targets and no horizontal overflow was observed. Language switching updated the route, document language and selected control. Tab/Shift+Tab stayed inside the sheet. Escape, close and backdrop dismissal restored scrolling and removed the review flag. Dismissal stayed effective after refresh and Back. The primary action opened `/en/cars` with the vehicle list visible; background inert state and scroll locking were cleared. Reopening the review link after both Escape and close passed. See [verification results](verification.json).

`npm run check` passed on the final source with Node 22.20.0 and a scoped 2048MB heap: ESLint, TypeScript and the isolated Webpack production build (407 pages). Locale additions were checked for duplicate keys, and the existing Explore cars/Explore our cars translations were retained. No browser console errors were recorded. The live preview's type references were restored after the build. The temporary QA tab was closed and viewport overrides were reset.

Source and evidence are ready locally in `L:/CODEX/cars` on `main` at `32c1e85a04f5624282d5fa42bb4b2f44af62a508`. At closeout, the shared `.git/index.lock` was 0 bytes and last written at 12:08:13 local time; it was preserved and prevented a scoped commit/push. The staged index was empty. Pending scope is `templates/app/TEMPLATE.md`, `templates/app/app/[locale]/page.tsx`, `templates/app/components/WelcomeSheet.tsx`, `templates/app/lib/dealer-config.ts`, `templates/app/lib/dealer.json`, both App locale JSON files and this evidence directory. When the shared index is available, review those paths, stage only that scope, commit on main and make a non-force push after checking remote ancestry.
