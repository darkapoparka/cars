# Mobile header call and location refinement

The call/location pair looked uneven as bare 26px glyphs: the rounded pin dominated the handset. The comparison at port 6790 uses Lucide PhoneCall and MapPin at 18px inside subtle circles. Auto Best retains its official Hugeicons Stroke Rounded family and MIT provenance.

The mobile header now uses 22px glyphs with 2px SVG strokes and quiet 40px circles inside the existing 44px targets. The phone uses the official Calling02 geometry with call waves. Location retains Location01; other phone consumers retain Call02 and the renderer's default 1.8px stroke. The circles inherit the icon color on dark, red and light surfaces. The logo, destinations, desktop header and other mobile controls retain their contracts.

Validation on the canonical Auto Best Vite server at `http://127.0.0.1:6461`, using Node 22.20.0:

- Svelte/type check: zero errors and warnings.
- CSS policy and production build, including locale prebuild checks: passed.
- Browser inspection at 320, 390 and 430px on Bulgarian Home, Sell, Import and Advice: twelve cases without overflow, centered 22px glyphs, 40px painted circles and 44px hit targets, clear of the logo. Dock strokes remain 1.8px.
- Header Location navigates to `/bg/contact`; Call retains the configured telephone destination. Keyboard focus on Call has a visible 2px outline.
- At 991px the mobile pair remains visible; at 992 and 1440px it is hidden and the desktop header uses its existing icons. No overflow at these widths.
- Calling02, Call02 and Location01 SVG attributes match the pinned `@hugeicons/core-free-icons@4.3.5` package exactly.

Focused screenshots and DOM evidence are retained under ignored `runtime/header-icons-2026-10-03/`. Checks/build used the working tree, including pre-existing desktop/font drafts; those changes are outside this commit. These are local implementation checks, not template promotion or dealer deployment evidence.
