# Mobile card actions — 9 October 2026

Applied to the Auto Best homepage: services now says **Виж услугите / See services** at ordinary mobile widths, including 320px, and both services and advice actions sit about **15–16px** above their card edge.

The earlier screenshot was the current Auto Best homepage at 390px. The old 20rem container rule shortened the services label to Виж / View on narrower phones, which explains the different text at 320px. The [preceding spacing review](../mobile-services-spacing-2026-10-09/README.md) was a browser-only preview; this change is now saved in the application source.

| At 390px | Before | After |
| --- | --- | --- |
| Services bottom gap | 23px | 15px |
| Services card height | 127.6px | 119.6px |
| Advice bottom gap | 29px | 15px |
| Advice card height | 285.5px | 271.5px |

The button frames stay 40px with the existing 28px painted pill, type, arrow and artwork. Services reduces its copy's bottom padding from the 16px spacing role to 8px. Advice already has a 6px outer frame and a 6px action paint inset, so its inner bottom padding reduces from 16px to 2px. These layers now produce the same comfortable visible edge spacing. Advice cards remain equally tall within the carousel, and their complete links retain the localized article destinations.

The full services label fits on one line at the checked mobile widths. Its existing 14rem reflow still stacks copy and artwork for enlarged text. Cards remain 12px, the floating dock remains 16px, and desktop/tablet geometry is unchanged.

## Matched screenshots

| State | Before | After |
| --- | --- | --- |
| Advice, 390px | [Before](before-advice-390.png) | [After](after-advice-390.png) |
| Services, 390px | [Before](before-services-390.png) | [After](after-services-390.png) |
| Advice, 320px | [Before](before-advice-320.png) | [After](after-advice-320.png) |
| Services and full label, 320px | [Before](before-services-320.png) | [After](after-services-320.png) |
| Both sections, 390px | [Before](before-combined-390.png) | [After](after-combined-390.png) |

Both screenshot sets use the same locale, viewport, content and loaded artwork. Individual card captures show the actual height change.

## Verification

- 20 mobile scenarios passed: Bulgarian/English at 320, 360, 390, 430 and 767px, each with normal and 200% root text size. Checks cover the full label, its single line, label fit, card overflow, visible edge gap, 12px corners, 16px dock and unchanged destinations.
- Eight tablet/desktop comparisons at 768, 992, 1440 and 1920px matched every visible element's dimensions, font, padding, border widths, colors and radius against the verified baseline in both languages.
- Four live checks at http://127.0.0.1:6461 passed at 320/390px in BG/EN, including actual clicks from Прочети / Read to the localized article and from the services action to About #process.
- Svelte check passed with 0 errors and 0 warnings. Production build, locale/source prebuild checks, token policy and CSS policy passed. The Svelte analyzer reported its existing wrapper-link advisories; localized href/resolve behavior is retained and the live navigation checks passed.

Only the two listed homepage components changed during this implementation; the other runtime source files match the prior verified hashes. Existing shared work is preserved. The temporary production previews closed after testing; the development server at 6461 remains available. No commit, publication or dealer deployment was performed.

[Before measurements](before.json) · [After measurements](after.json) · [Live checks](live.json) · [Summary](summary.json) · [Source change hashes](source-changes.json)
