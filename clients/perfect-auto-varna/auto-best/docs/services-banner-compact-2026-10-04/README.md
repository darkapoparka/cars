# Compact services action — 4 October 2026

This evidence records the preceding layout correction. The subsequent [CTA shape follow-up](../services-banner-cta-shape-2026-10-04/README.md) supersedes its 36px painted pill and 600 text weight with a 28px painted action and 500 weight. The final owner correction inherits the shared rounded button shape; the layout and image geometry stay the same.

The owner requested “Виж →” on very small screens, a slightly smaller visual pill and less dominant left-side copy. The previous 17.5rem container threshold caused the illustration to move below the text at 300px, even when shortened copy could fit beside it. `MobileServicesOverview.svelte` now keeps two columns at normal 280–430px viewports. Its existing 8rem illustration and approved silver crop remain unchanged.

At container widths up to 20rem, the localized visual action reads “Виж” / “View” with the official Fluent arrow. The title/supporting line use the template's existing body/caption roles. Wider cards keep the full action label and lead/meta type. The shared compact renderer paints a 36px pill inside a 40px visual frame, rather than the previous 40px pill inside 44px. The whole card remains the single keyboard-focusable localized About `#process` link, with no nested interactive control and a substantially larger hit area. The supporting line remains one line in both locales. At 280px, the Bulgarian title wraps naturally to two lines; it is not truncated.

The font-relative stacking threshold is now 14rem: ordinary narrow screens retain the side-by-side layout, while enlarged text can reflow instead of being clipped. At a native 300px viewport, card height decreases from 228.5625px to 122.34375px; the illustration stays 128px wide and 80.953px tall. The viewport, card top/width and scroll position match in the screenshots:

| Before BG 300px | After BG 300px |
| --- | --- |
| [Before](before-bg-300.png) | [After](after-bg-300.png) |

Additional native screenshots: [BG 280px](after-bg-280.png), [BG 320px](after-bg-320.png), [BG 390px](after-bg-390.png), [EN 300px](after-en-300.png). [Browser measurements](browser-audit.json) cover BG/EN at 280, 300, 320, 349 and 390px, artwork dimensions, line counts, painted height, overflow and destinations. Tapping the short English action reached `/en/about-us#process`.

[Validation](validation.json) passed the source policies, locale integrity, Svelte diagnostics with zero errors/warnings, and production build. Both [enlarged-text/text-spacing reflow](reflow-report.json) cases passed. The broader mobile-polish runner stalled before its first result and was stopped after verifying ownership of its Node/headless Chrome processes; its [diagnostic](mobile-polish-report.json) is retained, and the previous run's eight passing cases were not reused as current evidence. Focused native browser evidence covers the affected card in ten BG/EN viewport cases. A brief development hot-reload error occurred while the new locale key was being generated; the completed catalog and a fresh browser load verify the final state without errors. The earlier original mobile hero restoration is preserved. This master change does not promote a template release or deploy dealers.
