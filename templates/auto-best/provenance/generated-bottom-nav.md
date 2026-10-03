# Generated bottom-navbar artwork

The owner requested implementation of the refined imagegen set on 3 October 2026 after reviewing it at 24px beside Fluent. Home, Cars, Sell, Import and Menu now use this set on ordinary routes through `BottomNavIcon.svelte`.

The source is [one transparent 2172 by 724 PNG](../static/assets/images/template/generated-bottom-nav-v3.png), generated with the built-in image_gen tool and refined twice. [Prompt records](../docs/generated-nav-icons-2026-10-03/prompts.json) and [measured bounds](../docs/generated-nav-icons-2026-10-03/pixel-inspection.json) are retained. The delivered PNG is byte-for-byte identical to the refined v3 output; no external raster editing or SVG tracing was performed.

[The manifest](generated-bottom-nav.json) pins the SHA-256, dimensions and five glyph bounds. Each glyph uses the same scale and is centered in a 24px frame; the globe has a 20px ink height. CSS alpha masks paint with `currentColor` for the existing selected/inactive states. The same geometry is used in both states. The artwork is a raster asset rather than library SVG geometry.

Header/menu and other mobile-action icons retain the [official Fluent Regular sources and notices](fluent-icons.md). Inter, destination labels, links, touch targets and focus behavior retain their existing owners. Keep these records with template copies. This local implementation does not promote an immutable template release or deploy a dealer.
