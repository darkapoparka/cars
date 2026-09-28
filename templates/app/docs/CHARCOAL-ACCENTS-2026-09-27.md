# Shared charcoal accents

The legacy `violet`, `violetDark`, `violetSoft`, `blue` and `blueDark` StyleX token names now resolve to charcoal and light neutral surfaces. Names remain compatible with existing components. This updates the Saved empty state, login actions, filter selections, journey progress, finance browse button and detail actions without modifying their geometry or behavior.

The remaining hardcoded purple carousel surface and Sell journey chip now consume these tokens. The finance calculator's faint purple background is neutral. Menu icons retain their original image files and receive a scoped grayscale style; submenu copy and surfaces are neutral. The optional blue campaign artwork configuration remains available, but the active showroom configuration is black.

No spacing, corner radii, typography, route destinations, state logic or inventory data were changed. Evidence and build output are in Cars `runtime/app-showroom-qa/accents-*`.

Verification: `npm run check` passed on Node 22.23.2. Saved page heading, buttons and heart geometry matched the before measurements exactly at 390px. Saved and Menu have no horizontal overflow at 320, 390, 768 and 1440px. Menu finance expansion, location dialog, login open/close and saving/removing one car passed. The empty shortlist was restored after verification. Sell journey active steps resolve to charcoal; browser error log was empty.
