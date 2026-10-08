# Shared landing banner — 2026-09-27

Buy, Sell, Finance and Services now render components/ShowroomBanner.tsx. Removed Buy's separate promotion typography, oversized background-art layout and eyebrow text. All four use the same grid, padding, heading, paragraph reserve, image viewport and CTA style. Responsive minimum height is 180px on phones, 276px on tablets and 284px on desktop. Buy's car is proportionally reduced within the image viewport so the entire vehicle fits. Existing service banner composition and destinations are preserved. Search stays below Buy's banner.

Validation: npm run check passed (lint, typecheck and production build, Node 22.23.2). Visually checked all four pages at 320, 390 and 1440px; Buy also checked at 768px. Buy measured 180px high at 390px with a 160px top coordinate. The other pages were compared visually; browser measurement calls for those pages timed out. All four primary actions verified: inventory, sell details, finance login sheet and service vehicle selection. No submissions. No browser console errors observed.

Evidence in Cars runtime/app-showroom-qa/: shared-buy-390.png and shared-sell-390.png. Local production preview remains on port 6473. No release, deployment, index mutation, commit or push; App remains an untracked candidate within the shared checkout with unrelated staged work preserved.
