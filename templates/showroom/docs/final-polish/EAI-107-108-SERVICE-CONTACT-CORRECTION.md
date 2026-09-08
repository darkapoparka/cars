# EAI-107 / EAI-108 — Service and contact layout correction

Owner correction, 2026-09-06. Status: READY FOR OWNER REVIEW.

The rejected About section repeated showroom photography in three tall service cards. It now uses the same two action banners as Home, linking to inventory and vehicle valuation. The six activity descriptions remain in an expandable panel, followed by the existing four categories containing all 27 services.

The rejected Contact layout separated its details from a full-width map. The details and map now form one contained panel with a directions button, hours and three phone links. Desktop uses adjacent columns; mobile stacks the information and map. The map retains the verified coordinates and now renders the showroom's immediate surroundings.

## Scope

- `src/lib/components/about/AboutIntroSection.svelte`
- `src/lib/components/home/HomeFiveActionBand.svelte`: optional copy, destination and compact-spacing props; existing Home defaults preserved.
- `src/lib/components/contact/ContactCleanPage.svelte`: location section only.
- Ledger, this report and scoped evidence.

No assets generated or replaced. Existing Home vehicle cutouts are reused. Gallery photographs, video players, the About hero, shared contact data and inquiry handling remain unchanged.

## Evidence

Directory: `artifacts/service-contact-correction-20260906/`.

| Route / surface               | Viewport    | Before                     | After                     |
| ----------------------------- | ----------- | -------------------------- | ------------------------- |
| `/about`, services            | 1440 × 1000 | `before/services-1440.png` | `after/services-1440.png` |
| `/contact`, location          | 1440 × 1000 | `before/contact-1440.png`  | `after/contact-1440.png`  |
| `/`, action-band preservation | 1440 × 1000 | `before/home-action.png`   | `after/home-action.png`   |
| `/about`, services            | 390 × 1000  | —                          | `after/services-390.png`  |
| `/contact`, location          | 390 × 1000  | —                          | `after/contact-390.png`   |

- Before/after service and Contact screenshots at 1440px.
- After screenshots at 390px; no horizontal page overflow at either capture width.
- Home action-band before/after screenshots are pixel-identical (1440 × 302, raw RGB comparison).
- Before source snapshots preserve the immediate pre-correction state independently of the shared dirty checkout.
- All three Svelte autofixer checks returned zero issues or suggestions.
- Existing browser regression suite: 11 passing tests. Gallery navigation/fallback/focus, all service categories, company information, map controls, opt-in videos, header across nine widths, shared contact truth, and desktop/mobile inquiry journeys. Inquiry requests were intercepted; no leads were sent.

Focused ESLint and formatting passed for all three changed application files. Typecheck passed with zero errors and warnings. Production build passed (existing inherited CSS asset warnings remain).

The new activity accordion additionally passed keyboard open/close, six destination checks and both banner links at 320, 768 and 1440 pixels. No horizontal overflow or page errors at those widths. The tablet map was inspected after its lazy iframe finished loading; see `after/contact-768-settled.png`.

Full unit suite: 188 passing and 36 failing tests across eight failing files, the same counts as the immediate EAI-108 baseline. Full lint initially reported 137 formatting warnings, including four new evidence scripts; those four scripts were formatted afterward. Existing repository-wide formatting failures remain outside this correction. This is scoped verification, not a clean full-repository release qualification.

Immediate-source diff: three application files, 210 additions and 184 deletions. The shared component change is 29 additions and four deletions; the rest replaces the two rejected sections within their existing owners. No unrelated application file is included.

Checkout: `codex/home-desktop-polish-0904`, HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`. Changes remain local and uncommitted with existing owner work preserved. Nothing pushed.
