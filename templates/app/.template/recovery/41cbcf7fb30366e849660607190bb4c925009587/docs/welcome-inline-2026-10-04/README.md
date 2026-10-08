# Inline welcome utility row — 4 October 2026

Superseded by the [bottom sheet and compact promotion correction](../welcome-promotions-2026-10-04/README.md). The owner rejected the inline row because its runtime appearance shifted the page. The captures below preserve that trial.

The owner rejected the floating greeting because its treatment was worse. Home now puts the optional welcome in normal document flow, after the discovery tabs and before the dealer panel. A single 44px row contains the configured dealer name in regular 14px text, a small alternate-language pill and close. It uses the shared page gutters, a quiet grey surface and 12px separation from the adjacent phone sections. There is no repeated logo, extra browse action, floating card or backdrop.

The language link uses the configured enabled locales and the existing localized Home route. BG shows EN with the native accessible name English; EN shows БГ with the native accessible name Български. Single-locale configurations omit the language link. Both controls retain 44px targets. The row scrolls with the page and leaves the inventory and bottom navigation unobstructed.

The existing optional `dealer.welcomeEnabled` flag, dealer/mount dismissal key, storage fallback and explicit `?welcome=1` review behavior remain. Close removes the preview flag and remembers dismissal. Escape belongs to an open drawer; normal page focus remains available.

| View | Rejected floating banner | Inline welcome |
| --- | --- | --- |
| Bulgarian 390 × 844, scroll 0 | [Before](bg-390-before.jpg) | [After](bg-390-after.jpg) |
| Bulgarian 1440 × 900, scroll 0 | [Before](bg-1440-before.jpg) | [After](bg-1440-after.jpg) |

Further captures: [Bulgarian 320px](bg-320-after.jpg) and [English 390px](en-390-after.jpg). [Review in Bulgarian](http://127.0.0.1:6483/bg?welcome=1).

Focused checks passed at BG 320/390/768/1440px and EN 320/390/1440px. The current greeting fits one line in a 44px row at every inspected width, both targets remain 44px, and the dealer panel stays 12px below the utility row. No horizontal overflow, modal or background inert state was observed. The language link switched to `/en?welcome=1` with the English document language and the Bulgarian alternate link. Tab began at the normal skip-navigation link. The welcome scrolled above the viewport, Close cleared the review flag, and a settled reload retained dismissal. An open location drawer owned Escape; a subsequent Escape dismissed the greeting. See [measurements and interaction results](verification.json).

`npm run check` passed on the final source with Node 22.20.0: ESLint, TypeScript and the isolated Webpack production build generated 407 pages. No console errors were recorded during the settled verification window. The live preview's type references were restored, the temporary QA tab was closed and viewport overrides were reset. The original browser tab shows the inline review.

This remains optional local App demo UI. The prior sheet and floating-banner receipts remain as history; template promotion and dealer deployment are separate work.
