# ASKO96 / Carwow local demo

Independent Fast Skin from Carwow 2026.09.06-refresh-1. Primary homepage: `/`. Local review: http://127.0.0.1:6613/.

The native source layouts, navigation, responsive compositions and interactions are retained. ASKO96 supplied identity, real published stock/photos, showroom, source-backed contact details and three verified YouTube videos replace the source dealer content. Gold and charcoal use the existing color boundaries. Testimonial card positions now contain factual service information; no ASKO customer reviews or named employees were invented.

Canonical research: ../business-facts.json, ../stock.json, ../videos-research.json and ../assets/provenance.json. The 16 listings are a selected snapshot from 2026-09-06. Confirm current availability and financial terms with ASKO96.

## Validation

- Retained npm lockfile installed with Node24.18.0; npm run check passes with zero errors and warnings; final npm run build passes.
- Svelte autofixer reviewed44 changed public components plus final six components. Remaining suggestions concern inherited bind:this and false positives for external URLs, not invalid Svelte.
- 30 route/viewport visits at390 and1440 passed HTTP200 with no page errors, broken visible images or horizontal overflow. Follow-up final12 visits verified corrected branding, old-phone removal and form notices.
- Toyota mobile brand filter leaves one correct listing; Audi desktop filter leaves3 listings. Detail navigation, real telephone destinations, import navigation and menu close verified. Mobile menu exits after its inherited animation (approximately1.6seconds), matching source6517.
- YouTube iframes were scrolled into view; all three show the verified ASKO channel video thumbnails. No videos were submitted or messages sent.

Evidence: .client/qa-routes.json, .client/qa-final.json, .client/qa-interactions.json, .client/autofixer.json, .client/build.log. Final screenshots: .client/final-390-home.png, .client/final-1440-home.png and .client/youtube-1440.png; route screenshots accompany them.

## Boundaries

Local demo forms/chat have no real delivery configuration. No backend credentials, public deployment or CRM registration were added. Source generic decorative hero/body/budget car illustrations remain; actual stock uses ASKO photographs. Legacy/presentation/admin sample routes and unreferenced source assets remain part of the retained codebase and are not offered homepage variants. Viber account availability and physical-device acceptance remain unverified.
