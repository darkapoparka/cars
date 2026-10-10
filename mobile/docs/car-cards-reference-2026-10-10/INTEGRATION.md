# Mobile source integration — 10 October 2026

This checkpoint covers the compact vehicle cards, two-column phone grid,
four/five-column desktop grid, sticky phone search/filter/sort toolbar, shorter
Bulgarian labels, shared desktop hero frame, Services category pills and compact
Contact layout. Forms and saving retain their local showroom-demo behavior.

## Source checks

Using Node 22.20.0 and the existing dependency installation:

- Full source ESLint passed with zero warnings.
- All 156 existing domain tests passed.
- Prettier and whitespace checks passed for the 17 source/document files.
- The production build passed, including TypeScript and all 124 static pages.
- Home, Services, Contact and the BMW 540 enquiry context returned HTTP 200 on
  the existing port 6474 preview after the build.

Build command: `NEXT_DIST_DIR=.next-review-local node scripts/review-preview.mjs build`.
The output was separate from the active `.next-preview-6474` development preview.
Build-generated `next-env.d.ts` was restored to its exact pre-build contents;
`tsconfig.json` remained unchanged. Automatic safety review blocked the cleanup command, so the single reused
`.next-review-local` output remains local. Dependency installations, active
previews and recovery evidence remain intact.

## Visual evidence

[The review ledger](REVIEW.md) records the retained matched comparisons and
source hashes for the individual card and toolbar iterations. Its larger capture
set preserves the distinct owner-requested revisions already linked in the review
conversation; it is declared design-review evidence rather than intermediate logs.
Older local comparison folders remain preserved.

The most recent hero/Services/Contact edits have source and HTTP checks only.
Rendered verification remains incomplete because the automatic browser safety
review rejected access to the local URL. No browser workaround was used.
This source integration does not promote a template release or deploy a dealer.

Production build ID: `JoGdR_SfBsqQ25g6gFJp4`.
