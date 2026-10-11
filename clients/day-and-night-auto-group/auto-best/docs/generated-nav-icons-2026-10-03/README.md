# Generated bottom-navbar trial history

The owner rejected the refined v3 set on 4 October 2026. The canonical Auto Best source now uses official Fluent Regular SVGs in its bottom navbar. The implementation and verification below describe the previous generated trial and preserve its evidence; they do not represent current visual acceptance.

During the trial, `src/lib/components/layout/BottomNavIcon.svelte` rendered Home, Cars, Sell, Import and Menu from `static/assets/images/template/generated-bottom-nav-v3.png`. The archived PNG is unchanged and pinned by `provenance/generated-bottom-nav.json`. Five alpha-mask windows shared one scale and centered their measured bounds inside 24px frames. Existing destination colors, active pills, labels, links, focus and touch areas stayed with the header. Other mobile actions used Fluent Regular, and typography retained Inter.

## Verification

`npm run validate` passed: architecture, CSS policy, tokens, typography/visual-system pins, 191 static media assets, domain rules, locale/source audits, zero Svelte errors/warnings and the production build with the retained Vercel/public-assets adapter.

The existing `scripts/mobile-polish-smoke.mjs` suite also passed [all eight cases](mobile-polish-report.json) against the owned development server: Bulgarian and English at 320, 390, 430 and 1440px, including the generated-dock mask/frame/baseline checks and navigation/menu behavior.

[Current browser results](implementation-checks.json) cover seven ordinary-route layouts:

- BG Home at 320px and 390px.
- EN Home at 320px and 390px.
- EN Cars, Sell and Import at 390px, with their correct selected destination.

Each case retains five 24px glyphs, targets of at least 44px, fitting labels and no horizontal overflow. The BG 320px menu opens with its generated glyph active, closes on Escape and returns focus to Menu. Cars navigation retains the English route. At 1440px the dock is hidden, Inter remains active and there is no horizontal overflow. No captured browser errors were present.

![Implemented Bulgarian navbar at 390px](implemented-bg-390.jpg)

The interactive [comparison](http://127.0.0.1:6499/generated) retains the Fluent baseline and actual generated captures. Earlier `browser-checks.json` and `source-restoration.json` describe the temporary trial before implementation; `implementation-checks.json` is the current record.

## Source delivery

Canonical repository: `L:/CODEX/cars`, branch `main`, starting HEAD `598b46c34e010d2ce185c33b167fb4314460454d`, remote `https://github.com/darkapoparka/cars.git`. The existing shared index lock delayed staging and was preserved; its writer then completed unrelated About/Import commits and released it. Icon work is scoped separately. No template promotion or dealer deployment occurred.

Task source changes include the dock renderer, pinned PNG/provenance, visual-system guard, updated mobile-polish checks and one added media-inventory count. AGENTS, styling, asset provenance and source-license paragraphs record the dock-specific generated set. The pending Fluent implementation is included with its official sources and notices. Only icon-related documentation lines and a +1 media count are selected from shared files; the local 191-file inventory also contains six unrelated pending desktop/service assets. The build and rendered checks above describe the current working source, which includes those separate drafts.

During the full L: drive condition, the prior Fluent recovery patch was moved intact to `C:/Users/radev/AppData/Local/Temp/auto-best-generated-nav-implementation-20261003/fluent-task-only.patch`, with SHA-256 `31a78fa73831a52ef02c789f653bb5406a12743855a647f8d940ba47803d67ea`. The PNG was moved within the project from the trial evidence folder to its reusable static-asset owner. The source image and prompt records were preserved.
