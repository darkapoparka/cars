# Optional welcome banner — 4 October 2026

This is the preserved floating-banner trial. The owner rejected it. The current greeting is a smaller [inline welcome utility row](../welcome-inline-2026-10-04/README.md) above the dealer panel. Preview links below now show that replacement.

The first welcome trial interrupted browsing with a dimmed page, repeated dealer logo, mandatory language choice and a full-width action. Home now has a compact, nonmodal greeting using the configured dealer name, a quiet localized browse link and a small close circle. Both controls retain 44px targets. Language remains available in the existing menu.

The inspected greeting is 92px high, down from the 268px sheet, with 18px corners, a white surface, a light border and a restrained shadow. It floats above the phone/tablet navigation with 84px plus safe-area bottom clearance; at desktop widths it sits at the bottom right with a 360px width. The page keeps its search, navigation, scrolling and normal keyboard focus. Long dealer names can wrap rather than clipping.

`dealer.welcomeEnabled` is optional and is enabled in this template demo. Existing dealer configurations without that field keep the greeting disabled. Dismissal is remembered per dealer and mount, with an in-memory fallback if storage is unavailable. Closing clears `?welcome=1`; the review flag still allows repeated visual previews. Escape dismisses the greeting only when no modal is active, preserving drawer behavior. The browse link uses the current locale and dismisses the greeting before opening Cars.

| View | Before: sheet trial | After: welcome banner |
| --- | --- | --- |
| Bulgarian 390 × 844, scroll 0 | [Before](bg-390-before.jpg) | [After](bg-390-after.jpg) |
| Bulgarian 1440 × 900, scroll 0 | [Before](bg-1440-before.jpg) | [After](bg-1440-after.jpg) |

Further captures: [Bulgarian 320px](bg-320-after.jpg), [Bulgarian tablet](bg-768-after.jpg) and [English 390px](en-390-after.jpg). Removing modal scroll locking restores the native scrollbar in the after views.

Focused checks cover BG 320/390/768/1440px and EN 320/390/1440px. The current demo headings fit one line, targets are at least 44px high, and no horizontal overflow, focus trapping or background inert state was observed. The phone/tablet greeting clears the navigation by 22px. Background scrolling, close/reload persistence, Escape, explicit review reopening and keyboard browsing to `/en/cars` passed. An open location drawer kept ownership of Escape; the greeting remained visible after closing that drawer. Back after browsing returned to the dismissed Home. See the [recorded DOM measurements and interactions](verification.json).

`npm run check` passed on the final banner source with Node 22.20.0: ESLint, TypeScript and the isolated Webpack production build generated 407 pages. Locale additions were checked for duplicate keys. The live preview's type references were restored after the build. A transient development import error occurred while renaming the owned component; no errors occurred in the settled final verification window.

The first build attempt ran out of C: disk space while writing its cache. Automatic review blocked recursive cache deletion. A safer recovery preserved nine failed or superseded generated cache fragments (32,805,806 bytes) in `runtime/welcome-banner-build-cache-20261004`, with every source and destination verified inside the named task directories. The rerun passed. No source, Git lock, live preview cache or user recovery data was removed.

The earlier sheet screenshots and receipt remain as history. This is a local App source change; template promotion and dealer deployment are separate work. [Review in Bulgarian](http://127.0.0.1:6483/bg?welcome=1).
