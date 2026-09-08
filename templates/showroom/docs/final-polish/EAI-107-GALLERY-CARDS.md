# EAI-107 — Gallery and amenities hierarchy

Removed the detached photo-count caption and separate gallery action. One native button, “Всички 16 снимки”, now sits on the photo grid and opens the existing gallery. Four compact amenity cards sit directly below the photos, with the existing red icons, clear titles, subdued descriptions and the same 10px corners as adjacent About cards.

Scope: `src/lib/components/about/AboutGallerySection.svelte` only; 19 insertions and 42 deletions against the saved immediate baseline. No data, images, shared styles, banner or other route components changed. The dialog implementation and all 16 photos remain intact.

Preservation screenshots: `preserved-about-390.png`, `preserved-about-1440.png` and `preserved-contact-1440.png` match the preceding banner-refinement baseline exactly (900px viewport height); results in `preservation.json`.

Evidence: `artifacts/about-gallery-cards-20260906/`. Before screenshots: `before/gallery-390.png`, `before/gallery-1440.png`. After screenshots: `gallery-{320,390,768,1024,1440,1920}.png`, all captured on `/about` with 1000px viewport height. Desktop and mobile screenshots visually inspected. No horizontal overflow at any of the six widths; gallery action is 48px high.

Four existing Playwright tests pass: all originals load, keyboard navigation and wrapping, focus trap/restoration, Escape and outside-click close, mobile swipe, thumbnail navigation, failed-image recovery and remaining About controls. Log: `interactions.log`. Prettier passes; Svelte autofixer reports no issues, with one existing optional suggestion to replace the dialog close-button binding. That binding remains for its tested focus behavior.

Status: **READY FOR OWNER REVIEW**. Focused ESLint, Svelte check (zero errors/warnings) and production build pass. The UI scanner only flags the existing `backdrop-filter: none` reset; no glass effect is used. Dialog markup, state/handlers and desktop dialog styles match the saved baseline exactly. Existing whole-repository lint/unit limitations remain documented in EAI-107-ABOUT-CONTENT.md. Existing dirty work preserved; no commit or push.
