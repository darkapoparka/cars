# All services banner action — 4 October 2026

Historical first CTA pass. The owner subsequently rejected its shrinking 3:2 artwork split. The [responsive correction and current evidence](../services-banner-responsive-2026-10-04/README.md) supersede that layout and its long supporting copy; the black CTA and original hero restoration are retained.

The owner requested a black action with white text and better-fitting supporting copy in the mobile All services card. The card now uses the shared compact pill, a 44px interaction frame with a 40px painted surface, pinned Fluent arrow and token-based 14px type. It remains one accessible link to the existing localized About services section; the visual pill adds no nested interactive element.

The supporting text now includes viewing, import, trade-in and leasing, with balanced natural wrapping. The copy/art columns use a 3:2 ratio so the action label fits one line at 320px. Height follows content; the illustration keeps its natural proportions. The card remains hidden at 768px and above. This task changes the card component and its existing locale messages. The previously requested original hero restoration is preserved.

Native Codex in-app browser evidence: [before BG 390](before-bg-390.png), [after BG 390](after-bg-390.png), [BG 320](after-bg-320.png), [EN 320](after-en-320.png). [Measurements](browser-audit.json) confirm matching 390px viewport/scroll/card top and width, a 44px action, white text on the ink surface, unclipped single-line labels at 320px, no nested actions, preserved original Home hero source, and a working About #process destination. Card height grows naturally from 150.25px to 167.625px. No console errors or warnings were observed.

Node 22.20.0 npm run validate passed the source policies, locale checks, Svelte diagnostics (zero errors/warnings) and production build. [Mobile polish](mobile-polish-report.json) passed all eight BG/EN cases at 320, 390, 430 and 1440px. [Focused Home reflow](reflow-report.json) passed both 320px BG/EN enlarged-text/text-spacing cases. [Validation summary](validation.json). These results apply to the current local working checkout, which includes pre-existing drafts; they are not template promotion or dealer deployment evidence.

[Pending scoped integration](INTEGRATION.md) includes this change and the earlier hero restoration while preserving unrelated drafts.
