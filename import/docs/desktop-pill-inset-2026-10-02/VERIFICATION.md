# Desktop filter-arrow spacing — 2 October 2026

Inventory's quick-filter pills previously used 8px of end padding and space-between alignment, putting the arrow at the rounded edge. Desktop now reserves 16px of end padding and keeps the arrow 8px after its label. Pill-to-pill gaps remain 8px. Long selected values can truncate with their full accessible label; basic labels stay intact.

[Before](before-1440.jpg) · [After](after-1440.jpg)

Scoped formatting/lint and diff checks passed. Thirteen hydrated dev-browser states cover BG/EN at 768, 900, 1024, 1440 and 1920px, selected values at 768/1024px, and hidden desktop controls at 320/390px. No horizontal overflow was observed. Opening Make and closing with Escape restored focus to Make.

The source before the 768px desktop media query is byte-for-byte unchanged. This is a CSS-only follow-up; no new whole-source type check, production build or full browser suite is claimed. Detailed measurements are in [geometry.json](geometry.json) and [verification.json](verification.json). The canonical dev server remains on 6790.
