# Auto Best — mobile finalization audit

Audit date: 12 September 2026. Repository: `J:\cars`, branch `main`, HEAD `adc16cc3e3ae430c1f53e64dd7086ce632e29e38`, plus the pre-existing dirty working tree. Template: `templates/auto-best`. Development URL: `http://127.0.0.1:6461`.

## Verdict

The template is buildable and its main journeys work, but mobile is not ready for sign-off. Do not rewrite it. Repair the release gates and concrete interaction defects, consolidate ownership while touching those areas, then finalize one mobile visual contract. Desktop redesign remains a later phase; shared-component regressions must still be prevented now.

This pass adds audit documentation, reproducible audit scripts, and evidence only. It does not implement the proposed UI changes, replace artwork, publish stock, connect a lead backend, commit, push, or deploy. Existing application edits are preserved.

## Start here

- [Mobile finalization plan](MOBILE-FINALIZATION-PLAN.md): execution order, affected owners, and acceptance criteria.
- [Mobile visual audit](MOBILE-VISUAL-AUDIT.md): route-by-route observations and design decisions.
- [Codebase audit](CODEBASE-AUDIT.md): defects, data ownership, Svelte/CSS structure, and the no-hardcoding contract.
- [QA coverage](QA-COVERAGE.md): exact test outcomes, evidence, reproduction, and remaining device verification.
- [Desktop later](DESKTOP-LATER.md): deferred desktop work and shared-code guardrails.

## Measured baseline

92 application source files / 13,819 lines were inventoried and hashed: 57 Svelte, 23 TypeScript, 11 CSS, and one HTML file. All public route families, all eight sample vehicle pages, and all nine articles were included in the mobile/browser review. The broad sweep ran 156 route/viewport combinations at 11 widths; all 102 discovered internal links returned 200. It recorded no page JavaScript exceptions, broken local images, or document-wide horizontal overflow. Expected invalid routes returned 404.

Domain checks and production build passed. Svelte reported zero errors and four warnings. The aggregate `validate` command failed at the asset gate. Existing route/journey, enquiry, mobile-filter, and desktop-discovery smoke suites passed; the separate home-hierarchy suite failed on a stale four-anchor assumption. See QA coverage rather than treating the successful checks as universal correctness.

## First defects to address

The homepage quick-search dialog permits background scrolling; required Sell make/model fields accept whitespace; budget tile counts disagree with inclusive filter boundaries at EUR 60,000 and EUR 70,000; listing/PDP secondary text fails measured contrast; mobile body artwork leaks into the desktop presentation; the cold mobile homepage fetched 12,203,050 bytes of image assets before scrolling. The PDP still contains a conventional calculator and seller card, not the previously discussed financing/seller image banners.

Evidence lives in `evidence/`. The PNG/JPEG files are local browser captures, not regenerated UI mockups. Browser checks use Chromium emulation; real iPhone Safari, native keyboards/share sheets, assistive technology, and production performance remain explicit sign-off tasks. This audit does not claim perfection, complete WCAG certification, or production readiness.
