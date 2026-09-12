# Day & Night Showroom / Spartak — Design & UI/UX Repair Contract

Branch: `gpt-pro`

This project is the Day & Night showroom-style variant derived from Agency OS `showroom`.

It has a useful architectural strength: the homepage can render materially different desktop and mobile presentations while sharing the same data. Preserve that. Its first send-readiness problems are not fancy design problems — they are content integrity and final visual polish.

## Canonical references

When the Agency OS template repo is available locally, read:

- `agency-os-templates/verticals/automotive/DESIGN.md`
- `agency-os-templates/verticals/automotive/RESPONSIVE.md`
- `agency-os-templates/verticals/automotive/AGENT-UI-RULES.md`
- `agency-os-templates/verticals/automotive/templates/showroom/DESIGN.md`
- this repository's `AGENTS.md`
- `AGENCY_BRIEF.md`

## Current design assessment

Strengths:

- dedicated `DesktopHome` and `MobileHome` presentation surfaces;
- intentional responsive loading behavior;
- production-style Svelte/Tailwind architecture;
- inventory/detail/admin foundation;
- visual regression tooling/baselines;
- credible showroom-style design direction.

Current send blockers called out by project documentation:

- source/template inventory may still need replacement;
- placeholder email must be removed/replaced unless verified;
- all visible lead data needs final confirmation.

Treat these as UI release blockers, not back-office details.

## P0 — Content integrity before visual polish

Verify and fix:

- Day & Night name/logo;
- phone;
- address/location;
- email: no `demo@...` placeholder in public UI;
- inventory and vehicle images;
- social/marketplace links;
- team/dealer identity;
- metadata;
- stale source names/asset identity;
- visible demo-only language.

Do not claim this variant ready until this pass is complete.

## Non-negotiables

- Preserve separate desktop/mobile homepage composition when it remains useful.
- Do not collapse `DesktopHome` and `MobileHome` into one monolithic component for code neatness.
- Preserve the current behavior that avoids unnecessary desktop-only CSS/assets on phones where implemented.
- Preserve inventory/detail/search behavior unless QA proves a defect.
- Use existing Tailwind/token layers.
- No fake reviews, warranty, finance, stock, team or business claims.
- UI work stays on `gpt-pro` until accepted.

## Visual target

This should be the **showroom-focused alternative**:

- physical-dealer credibility;
- inventory-forward;
- strong real vehicle/showroom media;
- clear location/contact;
- more bespoke than a marketplace shell;
- simpler and less template-heavy than an old automotive theme.

It should remain visibly distinct from AutoDeal and Modern.

## Repair order after P0

### P1 — Protect both homepage baselines

Review separately:

- desktop at 1440/1920;
- mobile at 390.

Do not assume a shared change is safe because only one component tree was visually checked.

### P2 — Desktop polish

Focus on demonstrated defects:

- hero crop/scale;
- section rhythm;
- inventory density;
- overly narrow or overly wide text blocks;
- contact/location prominence;
- redundant modules;
- stale visual remnants from source styling.

Use width deliberately. Keep strong image/inventory moments. Do not turn the page into a new card-based Modern clone.

### P3 — Mobile polish

Keep vehicle browsing and contact fast.

Check:

- mobile header/search;
- 44px+ targets;
- card image/title/price hierarchy;
- comparison/favorite controls where exposed;
- sticky UI and safe area;
- page length;
- body overflow;
- drawer/menu behavior.

Do not load desktop-only design work onto mobile unnecessarily.

### P4 — About/services/team

Use verified evidence of the actual business.

Prefer:

- showroom/location imagery;
- real team information where approved;
- actual service/finance/trade-in offerings;
- direct contact.

Do not compensate for missing proof with generic icon cards or fake metrics.

### P5 — Contact

Desktop should combine business identity, details, location and enquiry efficiently. Mobile should surface phone/map immediately.

Avoid a huge empty hero containing only a phone number. Avoid form-only conversion when a direct call is appropriate.

### P6 — Inventory/detail

Preserve established information architecture. Fix only real defects in crop, density, title/price hierarchy, desktop gallery/info balance, mobile order, or action duplication.

## Visual regression workflow

This repo already has visual regression infrastructure. Use it.

For intentional changes:

1. inspect existing baseline;
2. implement the bounded repair;
3. manually review 390 + 1440 output;
4. update baseline only after visual approval;
5. run visual verification again.

Do not blindly regenerate baselines to make a failing diff disappear.

## Anti-patterns forbidden

- visual polish before fixing placeholder/stale content;
- merging desktop/mobile surfaces just to reduce files;
- global token rewrite;
- generic SaaS landing-page sections;
- decorative gradients/glass/glow;
- fake showroom proof;
- duplicating Modern's marketplace identity;
- adding sections because the homepage feels short.

## Required QA

At minimum:

- 390x844;
- 1440x1050;
- 1920x1080;
- existing visual regression suite after intentional baseline review.

Also smoke Home, Inventory, representative Detail, About/Contact and public navigation.

## Outreach-ready definition

Ready only when:

- placeholder/stale contact content is gone;
- representative inventory is lead-correct or truthfully demo-safe;
- both desktop and mobile homepage surfaces have been manually reviewed;
- visual regression changes are intentional;
- support pages match the showroom identity;
- no public route exposes source/demo identity;
- this remains a distinct showroom option rather than a weaker copy of Modern/AutoDeal.
