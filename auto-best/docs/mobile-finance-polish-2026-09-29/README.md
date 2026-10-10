# Solid mobile detail banners

29 September 2026. Auto Best master, listing-detail-v1/1.

Final owner direction: solid colors, compact horizontal rows, minimal copy and real CTA buttons. No generated banner imagery remains in the application.

Finance uses one label and a Calculate button opening the existing modal. Dealer contact uses the transparent dealer logo and a Viewing info link retaining vehicle and inspection context. Both use one shared CTA style with 44px minimum height. Removed decorative overlays, fixed tall campaign compositions, stacked contact copy and duplicate phone text. Desktop contact uses the same compact row; desktop finance retains its calculator.

Verification: CSS policy, typography, assets, Svelte (zero errors/warnings), locale build/audits and production build passed with Node 22.23.3. Browser: EN 390px and 320px, BG 320px; calculator opens and Escape closes it; no horizontal overflow at 320px. Original before and final screenshots are 390x844 at scrollY 240.

Evidence: before-390.png and solid-after-390.png. Local master only; no dealer deployment or owner acceptance is implied. Unrelated Cars work and AGENTS.md edits preserved.

Follow-up: finance now sits outside the information card, on its own red surface with a white CTA. Related cars use the localized View more heading and a rounded white mobile container. Verified the selected Mercedes vehicle calculator at 390px; screenshots red-finance-390.png and view-more-390.png. CSS/typography and Svelte checks passed. Browser control timed out during the additional narrow-width pass.

Compact controls follow-up: both banner CTAs now reuse dn-compact-control from base.css. Measured 44px hit height, 2px top/bottom paint inset (40px visible pill), white surface, token ink rgb(20,23,29), no shadow. Banner spacing/corners also use existing tokens. Checked EN 390 and BG 320 without overflow; evidence compact-buttons-390.png. Token, CSS policy, typography and Svelte checks pass.
