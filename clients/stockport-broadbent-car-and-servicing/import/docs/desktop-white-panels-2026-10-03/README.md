# White desktop panels — 3 October 2026

The owner requested clearer white cards and a better buy-box colour on the continuous cool off-white desktop canvas. The public desktop hierarchy now uses the existing raised-white role for discovery panels and cards, the cool canvas for inset controls, dark ink for text and the existing red for primary actions, selection and keyboard focus. A quiet border and the existing subtle shadow separate the panel from the page.

## Before and after

[Live Home](http://127.0.0.1:6790/bg) · [Home, Inventory and Services comparison](http://127.0.0.1:6795/white-panels.html). These are local review URLs.

| Page      | Before                                    | After                                         |
| --------- | ----------------------------------------- | --------------------------------------------- |
| Home      | [Tinted panel](before-home.png)           | [White panel](after-home.png)                 |
| Inventory | [Tinted panel](before-inventory.png)      | [White panel](after-inventory.png)            |
| Services  | [Tinted panel](before-services.png)       | [White panel](after-services.png)             |
| Full Home | [Previous surfaces](before-home-full.png) | [White panels and cards](after-home-full.png) |

Before screenshots show the actual application before this change. After screenshots come from the frozen production build without injected styles. Production captures wait for every rendered image to load and decode; an initial capture that preceded external listing-photo loading is retained separately in the ignored runtime evidence. Images were not edited. External Google Maps pixels are excluded consistently, while its frame and configured directions destination remain.

## Shared owners

- `src/lib/styles/tokens.css`: the existing desktop scope starts at 768px. `--bc-desktop-panel-surface` aliases raised white; `--bc-desktop-control-surface` aliases the cool canvas. Discovery framing consumes the existing editorial border and subtle shadow. Cards already consume raised white.
- `DesktopDiscoveryPanel.svelte`: desktop controls inherit the shared inset fill and stronger control border inside the quiet outer frame. Its mobile default remains.
- `HeroFilterDialog.svelte`: prominent desktop Home filters consume the same control fill as Home search and Inventory filters.
- `MobileModeTabs.svelte`: only the explicit desktop panel appearance uses the inset fill on hover and the existing red focus token. Four modes, roving keyboard navigation, selected underline, 20px labels and 48px targets retain their existing owners.

No route palette overrides, inline copy, new markup or duplicated content were introduced. Header, hero and page retain their continuous canvas. Typography, artwork, imagery, responsive geometry, URL/form contracts and the mobile About trial retain their owners. The maintained contracts are [Desktop styling](../DESKTOP-STYLING.md), [Architecture](../ARCHITECTURE.md) and [QA](../QA.md).

## Verification

The retained frozen QA copy is `runtime/desktop-white-panels-2026-10-03/qa/`, with its own dependency installation, build output and synthetic preview fixtures. The canonical development server was not rebuilt or stopped. Node remains 24.21.0; the retained npm lockfile is unchanged.

[Source snapshot](source-snapshot.json) contains 1,677 current application, configuration, test and asset paths, including existing untracked application assets. Every path matches the canonical source and tested snapshot. Manifest digest: `7e1cf8d1469db805ebd626ec1f11b1f9a2fa2b8f20149d82a27bdd41c8ceb602`.

[Verification records](verification.json) retain the actual results:

- Svelte: zero errors and warnings. Task-scoped Prettier and ESLint, architecture, asset checks and the frozen production build pass.
- Before: 40 BG/EN states at 320/390/1440px. After: 100 BG/EN states at 320/390/768/1024/1440/1920px. Production: 20 BG/EN desktop states at 1440px. All have expected responses, no page errors, broken decoded images or horizontal overflow.
- The desktop matrix covers all four Home modes, default/selected/empty Inventory, Services, About and Contact. Mobile covers those five routes without desktop-only mode/filter variations.
- All 20 matched mobile screenshots and computed presentation records at 320/390px are identical, including About. These are matched development captures; production captures are recorded separately.
- Existing `desktop-search`, `storefront-controls`, `typography-contact` and `accessibility` browser suites pass 35 tests, intentionally skip 13 and have zero failures or retries. They cover canonical search/GET queries, selections, dialog dismissal/focus, control reflow, typography and accessibility.
- Twelve additional BG/EN Home keyboard records verify Arrow/Home/End navigation, selection, visible 3px red focus and 48px targets. Two surface records confirm pure-white panels, consistent inset search/filter/hover fills, dark text, red actions and the restrained shadow.
- The comparison gallery passes 14 records at 390/1440px, covering all page/variant images, full Home toggling, keyboard activation and zero page errors or overflow.

The full `npm run verify` command still stops on three unchanged formatting files: `public-assets.policy.json`, `scripts/public-asset-retention.mjs` and `svelte.config.js`. The prior full-suite receipt also retains the old All filters `strong`-class assertion in `tests/style-parity.e2e.ts:44`; that unrelated test was not changed or rerun here. Unit tests were not repeated for this CSS-only follow-up; the preceding complete theme pass records 124 passing unit tests. No gate was weakened.

Raw desktop geometry comparisons retain one 20px vertical difference in the empty English Inventory results frame; its discovery-panel geometry matches. This receipt does not claim every desktop page is pixel-identical. All matched mobile states remain identical, and the responsive/interaction checks pass.

Existing ignore edits, historical drafts, untracked assets, other templates' work and recovery evidence are preserved. This is a scoped change to the canonical Import master on Cars `main`. Template promotion, hosted verification, dealer deployment and owner visual acceptance remain separate.
