# Mobile dock and services spacing review

This was the initial browser-only review. The owner subsequently requested [the applied services and advice spacing change](../mobile-card-actions-spacing-2026-10-09/README.md), which also retains the full services label on narrow phones. The dock remains 16px.

Recommendation: retain the floating navigation dock's **16px** corners and the services card's **12px** corners. The dock has a separate navigation role; equal radii are not required.

The services card has sufficient room for its heading, description, action and illustration. Its visible action is 28px tall, with a 40px layout frame inside the full-card link. The 16px bottom padding plus 6px action-paint inset and border produce **23px** of visible space below the action.

The preview changes only the copy's mobile bottom padding from `--dn-space-4` (16px) to `--dn-space-2` (8px). This gives **15–16px** below the action while preserving its dimensions, type, artwork, link and 12px outer corners. The card naturally becomes about 6–8px shorter; no taller card is needed.

**Preview only: application source is unchanged.** The browser contexts were closed after comparison. This review does not apply the spacing change or the 12px dock trial to the project.

| Comparison at 390px | Current | Preview |
| --- | --- | --- |
| Services card | [23px bottom gap](card-before-390.png) | [15px bottom gap](card-tight-gap-preview-390.png) |
| Floating dock | [16px corners](dock-16-390.png) | [12px trial](dock-12-preview-390.png) |

The tighter-spacing preview passed eight browser checks in BG/EN at 320, 390, 440 and 767px. The artwork was loaded before capture, and the checks confirm unchanged font and action dimensions, 12px card corners, 16px dock corners and no card overflow. See [measurements](comparison.json). Initial full-page captures were used for geometry inspection; the matched `card-*` screenshots above include the loaded artwork.
