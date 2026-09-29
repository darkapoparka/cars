# Banner layout refinement — 2026-09-27

Sell, Finance and Services now use one responsive composition in `FeatureLanding`: two-line heading, short supporting sentence, white CTA and a separate rounded photo crop. The copy and photo are vertically centered. Existing artwork is cropped proportionally rather than stretched behind the text. Finance now has subtext; its inherited banner loan-volume claim was removed. Buy search remains above its existing banner.

Validation: `npm run check` passed (lint, TypeScript and production build). Visually inspected all three routes at 320px, 390px and 1440px, plus Sell at 768px. Sell CTA opens car details, Services opens vehicle selection, Finance opens the existing assistance login sheet. No form submitted. Screenshots are in `runtime/app-showroom-qa/banner-layout-{sell,finance,service}-390.png` from the Cars repository root.

This is local App candidate polish. Deeper reference claims, assets and demo flows still require dealer adaptation. No release or deployment was made. Existing unrelated changes and staged work were preserved.
