# Compact mobile navigation dock

The existing five mobile destinations now sit inside an inset, rounded white
dock with the shared subtle card shadow. Labels, 24px Microsoft Fluent Regular
icons, the neutral selection pill, link destinations, focus indicators and
menu behavior remain intact. Each action still has a separate target of at
least 44 by 44 CSS pixels.

The shared navigation tokens own the side inset, bottom offset and page
clearance. Safe-area insets move the entire dock above the device home area;
service pages use the same clearance within their painted background. The
vehicle-detail action bar and desktop header keep their existing treatment.

Home and Import pairs were captured at 390 by 844 CSS pixels, scroll position
zero, with the local Inter font loaded. Home has a native vertical scrollbar;
Import fills the viewport without one. Each before/after pair uses the same
canvas width. See `verification.json` for geometry and browser evidence.

Validation used Node 22.20.0: CSS policy, tokens, pinned font/icon validation,
Svelte check (zero errors and warnings), production build, six final-mobile
cases and eight mobile-polish cases against the built local preview. Native
browser inspection also checked dock target/label containment, menu dismissal
and keyboard focus return, Import background continuity and the hidden dock
on desktop. Initial dev-server navigation timeouts were rerun successfully
against the built preview. Physical-device safe-area behavior is not certified
by desktop browser checks.
