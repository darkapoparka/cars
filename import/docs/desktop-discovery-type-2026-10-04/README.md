# Discovery typography — 4 October 2026

The owner asked whether hover should gain an underline and whether desktop discovery typography was consistent. Hover keeps the soft neutral background, selection keeps its red underline and keyboard focus keeps its red outline. An inactive hover does not change the selected tab or gain a second underline.

The actual before audit found Home tabs at 22px despite the intended 20px panel contract, and Home Sell/Import fields at 18px while Buy, Inventory and Services entry fields used 20px. MobileModeTabs now uses the existing entry token for its panel appearance; other appearances retain their defaults. DesktopHomeHero applies that entry role and control leading to its Sell/Import wrapper, and the native input inherits it. Primary entries, placeholders and Home panel tabs now share 20px/400 Sofia Sans; primary actions retain 20px/400, compact actions retain 18px/400 and dense Inventory labels retain 16px/400. The earlier 3D receipt's 20px label statement was corrected to match its recorded 22px metrics.

[Before/after gallery](http://127.0.0.1:6795/home-type-polish.html) · [Live Home](http://127.0.0.1:6790/bg)

| View         | Before                          | After                          |
| ------------ | ------------------------------- | ------------------------------ |
| Buy tabs     | [Screenshot](before-buy.png)    | [Screenshot](after-buy.png)    |
| Import entry | [Screenshot](before-import.png) | [Screenshot](after-import.png) |

[Current hover](hover-current.png) shows Buy selected while Leasing receives the neutral hover background. No artwork, colour, copy or route rule changed. Before is the canonical baseline; after is the frozen production build. Fonts and visible images were loaded before screenshots, without injected CSS.

## Verification

The manifest covers 1683 matched application/configuration/test/asset paths with SHA-256 9962526ebda48dc7d6ea11ae0425e5a90777f396634d863a2f775e09be19d54b. Physical QA at C:/Users/radev/.codex/tmp/cars-import-discovery-type-2026-10-04/qa has a fresh npm ci, its own output and disabled provider bindings. The lockfile is unchanged. [Source hashes](source-changes.json) and [verification details](verification.json) retain raw evidence locations and screenshot hashes.

Svelte reports zero errors/warnings. Task formatting, full ESLint, architecture, assets and production build pass. Full formatting retains the same three untouched issues: public-assets.policy.json, scripts/public-asset-retention.mjs and svelte.config.js; full verify is not claimed. Domain units were not repeated for this CSS follow-up.

Typography was inspected in 66 before and 66 after states across eight route heroes. The production matrix covers 88 BG/EN states at 768/1024/1440/1920px, checking 168 visible entry/tab controls against their 20px/400 role. Conversion form first states pass 12 route/locale/width cases with 36 readable regular-weight values. The capture matrix covers 24 before, 48 after and eight production Home states without response, page-error or horizontal-overflow failures. All 16 Home/Sell/Import/About 320/390 mobile PNGs and full-page presentation records match exactly.

Thirty-two production mode states preserve selected-only underlines, inactive hover backgrounds, contained artwork, equal targets and keyboard focus. Thirty-two keyboard cases, eight accessibility scans, two no-JavaScript checks and four mobile request checks pass. Existing typography/search browser cases pass 9, with 3 intentional mobile-project skips and no failures or flaky cases. Gallery controls pass 36 responsive states.

Work is scoped to the existing desktop owners, their browser coverage and documentation on Cars main. Inherited ignore edits, older untracked evidence/artwork and other Cars drafts remain preserved. Local checks and source integration remain separate from owner visual approval, template promotion and dealer deployment.
