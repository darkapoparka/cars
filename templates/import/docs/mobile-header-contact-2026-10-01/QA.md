# Import mobile header contact actions — 1 October 2026

Canonical source: `L:/CODEX/cars/templates/import`, Cars `main`. This is reusable master polish; dealer configuration and deployments are unchanged.

## Changes

- The shared mobile header has two controls: Contact and Map. The separate generic chat control was already a Viber link and is now consolidated into Contact.
- Contact opens the existing mobile sheet with the configured phone number, a telephone link and the configured messaging link. The current master labels the latter `Viber`; other configured messaging protocols retain the generic localized message label.
- Existing direct map links and route-specific location drawer callbacks are preserved. Desktop retains its direct telephone link.
- Enlarged-text QA exposed an existing homepage search grid expanding to 514px at a 320px viewport before Contact opened. A `minmax(0, 1fr)` track now contains the search module. Normal-size and desktop composition are preserved.

The implementation reuses `MobileSheet`, `MobileIconAction` and `MobileMenuAction`; no phone, address, messaging URL or map URL was changed.

## Verification

Node `24.21.0`, retained npm lockfile. The existing independent QA copy was refreshed from the complete working source, including other preserved drafts, with its own retained installation and output. All 1,794 source/asset/configuration files matched the canonical source before adding this receipt. SHA-256 digest: `cd7f3f0bd086a6a0a1ea890cc003020c06b8bdda7da950447d33ec387d919a5f`.

- `npm run check`: zero errors and warnings.
- Scoped ESLint, Prettier and `git diff --check` for both changed Svelte files: passed.
- Dev Chromium: 17 checks passed with zero page errors. BG/EN home, Contact and Import were checked at 320/390px. Checks cover the two 44px header targets, configured telephone/Viber/map URLs, sheet focus and scroll lock, Escape and browser-back dismissal, close-button focus restoration at 200% root text size, and no overflow or clipped contact labels. Sell's location callbacks passed in both languages at 320px. Desktop's direct telephone link and layout were checked at 1440px.
- Included BG/EN 320px open-sheet Axe scans detected zero WCAG-tagged violations.

- Frozen `npm run build`: passed with the Vercel adapter. Retained legacy `@reference` warnings and build-timing notices are non-fatal.
- Frozen production preview: the same 17 checks passed with zero page errors, including both open-sheet Axe scans, enlarged text and keyboard/history behavior.

- Existing `tests/mobile-navigation.e2e.ts`, Chromium mobile with one worker: four passed, zero failures or skips. Coverage includes menu focus/back, Contact navigation without stale overlays, and Sell/Import route interactions at 320/390px.

Captures: [header before](header-before-320.png), [header after](header-after-320.png) and [contact sheet](contact-sheet-320.png). [Production measurements](header-checks.json) and [source manifest](source-manifest.json) preserve the evidence.

## Preservation and limits

The canonical dev preview remains on <http://127.0.0.1:6790/bg>. The task's temporary production server was stopped after verification. Only `MobileAppbar.svelte` and the single mobile search-grid declaration in `HomeFiveHero.svelte` belong to this implementation. Concurrent homepage/inventory/style drafts and assets were preserved; this task does not approve or release them. `workspace-doctor.mjs --fetch` confirmed current Cars tracking refs and recorded the unrelated dirty checkouts.

The first longer Viber label clipped at enlarged text and was shortened. The original search overflow was measured before and after opening Contact and corrected in its owning grid. An early QA harness incorrectly expected an iframe in Sell's existing text/location drawer; it was corrected to verify the actual configured map and telephone links. An initial build was stopped before completing while these fixes were made; it is not passing build evidence.

An initial type check caught an incomplete concurrent `ArticleCard`/homepage change; its owner completed that separate change and the subsequent check passed. The browser CLI verified before/after views but later failed to connect while closing its session; the session has no remaining PID/port records. Final interaction checks use independently closed Playwright browsers. The earlier repository-wide formatting/lint gaps in recovery artifacts remain documented in [the first receipt](../mobile-card-hierarchy-2026-10-01/QA.md).

Telephone and Viber links were inspected without launching a native app or sending a message. Native handoff requires the corresponding installed application and is separate from browser verification. No mounted variant, public alias, physical-device acceptance, template promotion or dealer rollout is claimed.

The retained QA directory is `L:/CODEX/cars/runtime/import-mobile-hierarchy-20261001/source`. Earlier automatic approval review rejected deletion with `blocked by policy`; this task reused that directory and preserves it for permitted cleanup. It is QA output with no branch or worktree.
