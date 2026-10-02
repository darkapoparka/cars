# Mobile PDP sections for the browser

Implementation started 2 October 2026; checks completed 3 October 2026.
Scope: `templates/mobile`, the local showroom candidate served on port 6474.

## Behavior

The title, price, finance entry and Contact / Enquire actions scroll naturally.
After the main actions scroll above the 60px header, a compact price + Enquire
bar appears at the bottom. It retains buying/leasing context and the selected
vehicle in the enquiry link, with space for the device safe area.

The lower information area retains its grey gutters and rounded white panels.
Three equal-width underline tabs organize it:

- Details: mileage and other summary facts, technical data and description.
  All specifications retains its existing dialog and focus return.
- Photos: the retained photographs in an inline grid, with the existing native
  full-screen photo dialog, zoom, gestures and arrow controls. One-photo cars
  use a full-width tile.
- Features: all equipment inline, with existing highlight badges.

Only the tab rail sticks below the header, within the information section.
There is no nested page scroller or draggable drawer. The showroom contact card,
similar cars and sample disclosure remain below the selected panel.

Sections use whitelisted URL fragments. Selecting a tab replaces the current
history entry while preserving Next's router state and the inventory Back entry.
The separate gallery returns to the selected section via a whitelisted parameter.
Inline photo opening adds a same-URL history entry: Back closes the viewer,
Forward reopens its last photo, and Escape/Close dismisses that entry and restores
focus. Invalid or stale photo state does not open a viewer.

## Verification

Node runtime: `L:/Toolchains/Node/22.20.0/node.exe`.

- TypeScript: passed.
- ESLint across `src` with zero warnings: passed.
- Domain tests: 86 passed, including five navigation/history tests.
- Browser QA source extends the existing showroom suite with PDP tabs, inventory
  Back, inline viewer Back/Forward, focus return, reload, gallery return, enquiry
  context and 320/390/1440px panel checks. It was not executed.
- Prettier, focused diff whitespace and browser QA script syntax: passed.
- Production build: passed with `node scripts/review-preview.mjs build`, the
  existing L: output/cache and task temporary directory. Build ID:
  `yvk49vMpb6IiBNOFkOybd`. All 50 static pages generated successfully.
- The generated-config guard verified complete contents before/after building
  and restored only the build's TypeScript additions. Dev preview restarted on
  port 6474 (owned Node 22 listener PID 13432 at the final status check).
- Status-only HTTP HEAD checks: 200 for Home, all four vehicle detail routes,
  `/vehicle/bmw-x6/gallery?returnSection=photos`, `/contact?vehicle=bmw-x6`,
  `/services` and `/services?tab=import`. No response bodies were inspected.
- `node scripts/workspace-doctor.mjs --fetch`: passed. Cars was up to date with
  fetched main. Other template/client drafts and independent Admin divergence
  were reported and preserved. No intervening commit overlapped this Mobile work.

Automatic approval review rejected localhost browser inspection under Browser URL
policy. No alternate browser surface was used. There are no new app screenshots,
rendered geometry measurements, WebKit results or mobile/desktop visual acceptance
for this change. Source, domain tests, compilation and HTTP readiness are separate
from rendered acceptance.

## Source and runtime boundaries

The maintained source is `L:/CODEX/cars/templates/mobile` on Cars `main`. No second
editable source copy, template release selection, dealer refresh or deployment
was created. Unrelated work and the shared Git index are preserved.
The production build used the scoped working-tree sources before their commit;
intervening main commits touched other template paths only.

Production output uses the existing physical
`.next-overlay-card-tabs-20261002` directory and the existing task cache on L:.
Dev uses its separate `.next-preview-6474` output and cache. Task temporary files
use `runtime/mobile-pdp-sections-20261002/temp` on L: due to limited C: free space.
Generated Next TypeScript files are excluded from the source commit; recovery
baselines and generated junctions are retained.
