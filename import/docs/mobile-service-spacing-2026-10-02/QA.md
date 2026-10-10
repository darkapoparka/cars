# Services mobile filter spacing

The filter row previously started 44px below the visible panel edge: the hero's 24px rounded cap, 16px tools padding and 4px rail padding accumulated. Services now aligns its tools with that cap and uses 8px top padding, placing the first pill 12px below the panel edge. The row moves upward 32px; the existing one-row scroll, white inactive pills, dark active state and card spacing remain.

Only the Services tools rule below 768px changes. The shared hero and other pages are outside this correction.

| View              | Before                                | After                               |
| ----------------- | ------------------------------------- | ----------------------------------- |
| Mobile 390×844    | [Before](before/services-390.jpg)     | [After](after/services-390.jpg)     |
| Mobile 320×568    | —                                     | [After](after/services-320.jpg)     |
| Desktop 1440×1000 | [Before](before/services-desktop.jpg) | [After](after/services-desktop.jpg) |

The in-app Browser measured the 44px/12px gaps on the preserved 6790 runtime and inspected both mobile widths and desktop. Production build, scoped ESLint and Prettier passed. Six existing Playwright checks passed; two desktop duplicates of mobile-only filter cases were skipped. These cover BG/EN single-row filter reachability, selection, search/reset and 200% root-font reflow at a fixed 320px viewport. No new test mirrors this small CSS change.

Verification uses the task-owned C: candidate, Node 24.21.0, the retained npm lockfile, separate build output and synthetic fixtures on preview port 6795. [Frozen input](source-snapshot.json) and [task-file hash](verified-files.json) record the source evidence. Unrelated Cars work is preserved. Local browser verification is separate from visual acceptance, physical-device checks, template promotion and dealer deployment.
