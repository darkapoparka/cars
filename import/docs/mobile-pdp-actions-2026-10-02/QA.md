# Mobile PDP action polish — 2 October 2026

The mobile vehicle drawer keeps its two actions immediately below the price/title and above the content tabs. Both remain outside the scrollable tab panel. The labels now use the existing 16px mobile label role, with proportional line height and equal explicit padding; both retain their 44px minimum tap height and 12px corners. Icons retain their dimensions rather than shrinking in a narrow flex row. No copy, route, phone destination, enquiry handler, gallery, drawer snap point or desktop source was changed by this task.

## Rendered evidence

- Matched original browser JPEGs at 320 × 844 and 390 × 844 on `/bg/inventory/21754658377544573`.
- Before: live development server on port 6790. After: the frozen production preview on port 6795.
- Both labels fit on one line at both normal-text mobile widths. Both buttons measure 44px high; their widths and vertical placement are unchanged. No document horizontal overflow was observed.
- Native browser interaction opened the enquiry sheet and closed it with Escape, returning focus to the enquiry button. The call link retains `tel:0877733110`; no call was placed.
- The independent desktop composition was inspected at 1440 × 1000. Its screenshot is included for context.
- Original screenshot bytes are preserved; no image edits or generated UI were used. Geometry and computed typography are recorded in `measurements.json`.

## Checks

The existing QA candidate was refreshed from the working source, using Node 24.21.0 and the retained npm lockfile. Build output was isolated from the active development server. `source-snapshot.json` records the frozen input, and `verified-files.json` confirms that the task-owned component still matches the tested candidate.

- Scoped Prettier and ESLint: passed.
- `npm run check`: 0 errors, 0 warnings.
- `npm run build`: passed. Existing nonfatal CSS/build timing notices remain.
- Existing mobile localization tests for gallery, specifications, equipment and synthetic enquiry submission: 4 passed, EN/BG at 320px and 390px.
- Existing mobile keyboard reachability and enquiry focus tests: 2 passed, 320px and 390px.
- Existing desktop PDP gallery/enquiry test: 1 passed.
- `node scripts/workspace-doctor.mjs --fetch`: completed. Unrelated Cars and Cars Admin changes were preserved.

## Scope

This is local template polish, not a template release or dealer deployment. Other work in the shared checkout, including separate desktop detail edits, is excluded from this task's commit. The checks cover the frozen source and this component; they do not certify physical devices, enlarged text, all routes, current unrelated edits, or real enquiry delivery.
