# Shared silver service artwork — 4 October 2026

The owner subsequently rejected the hero substitutions in this pass. The [hero restoration](../front-hero-restoration-2026-10-04/README.md) restores the original front-facing Home and Sell/Import artwork while preserving the service-card updates. The hero screenshots and measurements below document this earlier state.

The owner requested one bright silver vehicle family across mobile Sell/Leasing cards, desktop About trade-in/leasing cards, and the remaining service illustration placements. The older dark sedan has been replaced with the silver estate from the approved Home services overview. Two ImageGen edits preserve the valuation/finance props; a third provides a standalone estate for the shared mobile Sell/Import hero.

The dealer-owned source registry is <code>leadSite.artwork.serviceIllustrations</code>. Measured delivery dimensions/crops live in <code>serviceIllustrationArtwork</code>; Home actions, About, service menus, discovery, banners and hero car consumers reuse those entries. Existing layouts, card CSS, copy, links, typography and icons are unchanged. Hero framing uses the existing aspect ratios and transparent letterboxing rather than stretching the art. Superseded images remain as provenance sources.

## Matched native browser evidence

Screenshots were captured in the Codex in-app browser without CSS overrides, at matched viewport sizes and scroll positions. [Browser measurements](browser-audit.json) confirm identical card rectangles on desktop About, mobile Home and desktop Home, plus identical mobile Home hero and Sell hero/form frames. No console errors or warnings were observed.

| Surface | Before | After |
| --- | --- | --- |
| About services, BG 1440 × 900 | [Before](about-before-bg-1440.jpg) | [After](about-after-bg-1440.jpg) |
| Home service cards, BG 374 × 884 | [Before](home-before-bg-374.jpg) | [After](home-after-bg-374.jpg) |
| Home header, BG 374 × 884 | [Before](home-header-before-bg-374.jpg) | [After](home-header-after-bg-374.jpg) |
| Sell header, BG 374 × 884 | [Before](sell-before-bg-374.jpg) | [After](sell-after-bg-374.jpg) |
| Desktop Home, BG 1440 × 900 full page | [Before](home-desktop-before-bg-1440.jpg) | [After](home-desktop-after-bg-1440.jpg) |

## Verification

Node 22.20.0 <code>npm run validate</code> passed architecture, CSS, token, pinned Inter/Fluent, typography, asset, domain, Svelte and locale checks, and the production build. Svelte reported zero errors and zero warnings. The working asset inventory contains 199 files, including two pre-existing desktop draft assets; the task-owned scoped inventory adds five silver-family assets to the committed baseline.

- [Hero composition](hero-report.json): 8/8 BG/EN cases at 320, 390, 430 and 1440. Sell and Import share the exact decoded transparent car pixels and matching geometry while retaining their existing route-specific backgrounds/side props.
- [Mobile polish](mobile-polish-report.json): 8/8 BG/EN cases at 320, 390, 430 and 1440, including four Home artwork pins, the services overview link/placement, navigation and existing interaction checks.
- [Focused desktop routes](desktop-report.json): 8/8 Home/About BG/EN cases at 1024 and 1440.
- [Validation summary](validation.json): all 24 browser cases and the production validation passed.

Validation exercised the local working checkout, which contains pre-existing desktop/content drafts. Guarded staging in <code>runtime/silver-service-system-20261004/</code> combines this task with the earlier uncommitted Home silver-card slice and preserves those unrelated drafts. This is local master work, not an immutable template promotion or a dealer deployment.

[Asset provenance, prompts, references and hashes](../../provenance/silver-service-system-2026-10-04.md). The earlier [Home silver-card evidence](../home-silver-cards-2026-10-04/README.md) is retained as history.
