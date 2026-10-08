# Service package banner headers

Routine service and Comprehensive care use original generated photographic banner headers. Both use the same charcoal background, curved silver edge, right-hand subject placement and 2:1 source dimensions. Text remains editable HTML.

The shared header reserves 160–180px on mobile and 180–240px on larger screens using the same responsive rule for both cards. This space is reserved before images load. Both cards retain their white checklist and Learn more action. The images are decorative because the headings and checklist provide the service information.

Sources: `components/FeatureContent.tsx`, `lib/showroom-art.ts`, and `public/showroom/black/service-{routine,comprehensive}-header-v1.png`. Exact generation prompts are in `public/showroom/black/SERVICE-PACKAGE-PROMPTS.md`.

Before screenshot: `../../../runtime/app-showroom-qa/service-packages-before.png`.

Validation: `npm run check` passed (ESLint, TypeScript and production build), log `../../../runtime/app-showroom-qa/service-packages-final-check.log`. Preview restarted on port 6473. Visually checked 320px, 390px, 768px and 1440px; both headings stay on one line above the photograph, both images load, paired header heights match and the page has no horizontal overflow. Both Learn more actions open their matching information sheet; no console errors were observed.

After screenshots are in `../../../runtime/app-showroom-qa/service-packages-after-{320,390,768,desktop}.png`. The original reference checkout and unrelated staged Cars changes were not modified.
