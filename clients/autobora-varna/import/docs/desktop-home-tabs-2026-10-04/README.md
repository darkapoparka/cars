# Home tab polish — 4 October 2026

The owner questioned the Home mode icons/underlines and blog card actions. Home keeps its white discovery panel and four equal targets. Tabs now use the existing Lucide car, percent, tag and globe at a consistent 22px/2 stroke, with an accent selected icon and a red underline following the icon-and-label group. Labels, spacing, control styling and actions retain their existing owners. Blog keeps its text-and-arrow cue inside one full-card native link, leaving filled actions for search, vehicle and service conversions.

[Before/after gallery](http://127.0.0.1:6795/home-tab-polish.html) · [Live Home](http://127.0.0.1:6790/bg)

## Ownership and screenshots

DesktopHomeHero selects installed Lucide components. MobileModeTabs owns the panel treatment and keeps Arrow/Home/End behavior, equal 48px targets, neutral hover and red focus. The content wrapper uses display: contents for other appearances, preserving mobile geometry and existing icon defaults. No generated image, dependency, palette, font, UI copy or route contract was added.

| View         | Before                           | After                           |
| ------------ | -------------------------------- | ------------------------------- |
| Buy box      | [Screenshot](before-buy.png)     | [Screenshot](after-buy.png)     |
| Leasing      | [Screenshot](before-finance.png) | [Screenshot](after-finance.png) |
| Home context | [Screenshot](before-home.png)    | [Screenshot](after-home.png)    |

[Current blog cards](blog-current.png) keep their existing native link and text action. The gallery also shows Sell and Import. Before uses canonical source at the recorded baseline; after uses the frozen production build. Fonts and visible images were loaded/decoded before capture, without injected styles.

## Verification

The frozen working-source manifest covers 1679 application/configuration/test/asset paths with digest f6ee836b2aa7f1a1a29b38fe538bdfb2cbc64f18fb1e131a6ac7395afeaadae5. QA has its own npm ci, build output and disabled provider bindings. The lockfile is unchanged. [source-changes.json](source-changes.json) records the two source changes; [verification.json](verification.json) records checks, raw evidence locations and screenshot hashes.

Svelte reports zero errors/warnings. Task formatting, full ESLint, architecture, assets and production build pass. Full formatting retains the same three untouched failures: public-assets.policy.json, scripts/public-asset-retention.mjs and svelte.config.js. Full verify is not claimed. Domain unit tests were not repeated for this icon/CSS/markup follow-up.

Twenty-four before, 48 after and eight production states have no response, page-error, overflow or visible-image decoding failures. All 16 matched BG/EN Home/Sell/Import/About 320/390px PNGs and complete-page presentation records are identical. Thirty-two production mode states confirm contained icons/labels, content-width underlines, equal targets, hover and focus at 768/1024/1440/1920px. Thirty-two keyboard cases, eight accessibility scans and two JavaScript-disabled Buy fallback checks pass. Existing browser journeys pass 5 cases with 3 intentional mobile-project skips, no failures or flaky cases. The gallery passes 36 responsive/control states.

The initial mode-switch check caught a missing retained finance-action icon import. It was restored before the frozen build and successful reruns; failed diagnostic captures remain in runtime. Raw evidence and QA stay at L:/CODEX/cars/templates/import/runtime/desktop-home-tab-polish-2026-10-04/. Integration is scoped to these source/docs on Cars main, preserving inherited ignore/evidence/asset drafts and other Cars work. These standalone checks do not promote a template or deploy dealers.
