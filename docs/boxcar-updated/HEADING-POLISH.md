# Boxcar heading alignment

The later [compact PDP polish](COMPACT-PDP.md) places desktop Save/Compare beside the title and groups thumbnails on a white surface. Its receipt records the latest source hashes and source handoff. The checks below describe the earlier stacked title card and centered supporting pages.

Completed locally on 2 October 2026 in `templates/boxcar-updated`, preview [port 6455](http://127.0.0.1:6455/vehicle/bentley-bentayga-bronze/).

The PDP keeps a small centered Back link instead of repeating the vehicle name in a full breadcrumb. It preserves the filtered inventory URL, or the supplied home/saved return destination. The title, vehicle summary and Save/Compare controls share a white card whose width exactly matches the gallery. Its top aligns with the separate purchase card, and it ends before the sidebar. Grey action surfaces show the selected state clearly. Phones order the title, purchase actions and photo with consistent 24 px gaps.

Contact and Sell Your Car now use centered page titles matching About. Supporting breadcrumbs use the same centered alignment and wrap on narrow screens. About's introduction and the liked homepage service cards retain their composition. The large-text phone title avoids splitting the model name mid-word; long selected action labels wrap inside their controls.

## Verification

- Svelte check passed with zero errors and zero warnings. Final Vite production build passed with 161 modules.
- Chromium and WebKit: 1440, 1024, 768, 390 and 320 px, default and selected Save/Compare states, plus 320 px with 200% root text. All 22 heading states passed containment, gallery-width, purchase alignment, mobile order and overflow checks.
- All 17 PDPs passed desktop and 320 px geometry checks in both engines: 68 route/layout checks. About, Contact, selling, inventory and the supporting journeys passed 64 breadcrumb/layout checks.
- Four desktop/phone journeys passed filtered Back navigation, correct enquiry vehicle and focus restoration, calculator price retention, viewing intent and gallery open/Escape dismissal. Phone finance results also fit with 200% root text.
- After the final large-text title adjustment, a focused rerun passed all 22 heading states and four journeys. The final source hashes are recorded in that focused receipt; the preceding full receipt records the catalogue and supporting-page coverage.
- Homepage/service sources and assets, plus all ten original homepage source hashes, match their prior receipts. No JavaScript errors were observed. These are local browser checks, not a whole-site accessibility certification.

[Full browser results](heading-polish-results.json) · [Final focused results and source hashes](heading-polish-focused-results.json) · [Desktop PDP](pdp-heading-1440.png) · [320 px PDP](pdp-heading-320.png) · [Centered Contact](contact-centered-1440.png).

## Source handoff

The application changes are confined to `src/pages/VehicleDetail.svelte`, `src/styles.css` and `src/inner-pages.css`. The earlier service-art, showroom and PDP surface changes remain preserved. No dealer copy, approved template release or Vercel deployment changed.

At the end of this heading pass the shared `L:/CODEX/cars/.git/index.lock` was present, so the scoped source handoff remained pending. The lock was not removed or bypassed. Cars remained on `main`; `workspace-doctor --fetch` confirmed its inspected HEAD `f190421c4a2a80630a2170ec5c52a27a3c1df05b` matched fetched main. The then-current 39-file combined allowlist is in the ignored `runtime/boxcar-heading-polish/owned-paths.json`; the later compact PDP record above owns the current handoff and expanded scope. Local source, build and browser verification completed independently of that handoff.

Reload an already-open PDP after these changes: this preview updated CSS automatically but required a reload to replace the mounted Svelte page structure.
