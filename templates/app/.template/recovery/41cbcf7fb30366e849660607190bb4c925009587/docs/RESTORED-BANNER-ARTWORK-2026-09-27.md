# Restored banner artwork — 2026-09-27

Owner rejected the inset photo cards and monochrome treatment. ShowroomBanner now places original artwork directly behind the copy: the silver studio scene on Home, and the original blue/curved photographic artwork on Sell, Finance and Services. Removed the image viewport wrapper and grayscale filter. Shared heading, description, button spacing and phone minimum height remain; no eyebrow label. Home retains search below the banner. Finance copy shortened to keep two lines on phones. Artwork masks blend edges and hide a baked partial letter in the Services source without changing asset files.

Validation: final npm run check passed on Node 22.23.2 (lint, TypeScript and production build). Inspected all four routes at 320, 390 and 1440px, Services at 768px. Confirmed loaded desktop imagery after responsive image optimization. All four CTA destinations verified without submitting a form. No console errors observed. Screenshots: Cars runtime/app-showroom-qa/restored-home-final.png and restored-sell-final.png.

Local preview remains on port 6473. No release or deployment. No index mutation, commit or push; existing unrelated staged work and untracked App candidate preserved. This supersedes the earlier neutral thumbnail-card visual direction; historical QA notes remain historical.
