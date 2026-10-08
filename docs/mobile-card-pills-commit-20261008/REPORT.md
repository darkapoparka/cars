# Mobile template integration — 8 October 2026

The Mobile template combines the existing work from the showroom review and
launch audit sessions. The card specification facts had been rendered as plain
text with dot separators. Year, mileage and fuel now use separate neutral gray
badges with 6px corners, their existing type sizes, and wrapping for narrow cards.
The badges use `colors.badgeSurface` (`#f3f3f3`) with a dark-theme counterpart.

The integrated changes also include the generated fictional guest avatar and
Radix profile menu, saved-car and language settings destinations, contact card
and enquiry context improvements, Services search/arrow/spacing fixes, search
overlay tabs and suggestions, category rail polish, smaller lossless WebP
artwork derivatives, Next.js 16.3.8, the Windows preview output fix, desktop Sell
progress preview, and updated architecture QA. Approved PNG masters remain.

Validation used Node 22.20.0 against the canonical `templates/mobile` checkout:

- ESLint and TypeScript passed for the final badge treatment.
- All 152 domain tests passed.
- The final isolated Next.js production build passed; the live dev output was
  kept separate and generated declaration/configuration preimages were restored.
- HTTP checks passed for Home, Services, Import, Sell, vehicle Contact and
  Settings on port 6474. The served Home contained 16 cards and 48 standalone
  specification badges. Its stylesheet supplied neutral `#f3f3f3` fill and 6px
  corners.
- The fetched Cars branch was aligned with `origin/main` before integration.
  Unrelated repository changes and generated local build-path edits are excluded
  from the scoped commit.

No fresh browser screenshots or 320/390/1440 geometry checks were performed in
this integration turn because the earlier localhost browser access was rejected
by policy. HTTP markup and stylesheet checks do not establish visual acceptance.
This is a source integration, not a dealer deployment or template release.

The ignored validation receipts are in
`runtime/mobile-card-pills-commit-20261008/`.
