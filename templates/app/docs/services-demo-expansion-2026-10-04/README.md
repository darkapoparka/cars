# Services demo expansion - 4 October 2026

The owner's request adds three matching service examples to the existing Servicing and Diagnostics catalogue: Tyres / Гуми, Brakes / Спирачки and Air con / Климатик. Each new card uses original built-in imagegen photography, the existing card layout, three concise checks and a compact Demo / Демо photo badge. The single catalogue configuration also supplies the three new quick pills and the selected service in the existing enquiry draft.

## Rendered evidence

| Viewport | Before | After |
| --- | --- | --- |
| Bulgarian 390 x 844 | [Before](before-bg-390.jpg) | [After](after-bg-390.jpg) |
| Bulgarian 1440 x 900 | [Before](before-bg-1440.jpg) | [After](after-bg-1440.jpg) |

The matched top-of-page screenshots show the expanded category rail. [The new desktop cards](new-cards-bg-1440.jpg) show all three generated photos in their actual card crops. [The tyre card at 390px](tyres-bg-390.jpg), [tyres at 320px](tyres-bg-320.jpg), [brakes at 320px](brakes-bg-320.jpg), [air conditioning at 320px](air-conditioning-bg-320.jpg) and [English air conditioning at 390px](air-conditioning-en-390.jpg) show selected quick pills and localized checks. [Keyboard focus on the last pill](pill-focus-bg-320.jpg) shows the focus ring inside the scrolling rail.

The screenshot API captures the visible page area inside the browser; paired image dimensions match (375 x 812 for the 390px override and 1425 x 891 for the 1440px override). The viewport sizes above are the CSS viewport overrides used for responsive verification.

## Verification

- Live in-app browser checks at `http://127.0.0.1:6483`: Bulgarian 320, 390, 768 and 1440px; English 320, 390 and 1440px.
- All seven layouts have five cards, six quick pills, three demo badges, loaded service photos and no page overflow. Photos retain a 2:1 crop. All titles and check rows fit on one line, including Bulgarian at 320px. Card dimensions match within each viewport.
- All three new pills filter the matching card. Bulgarian and English search combine with category selection and match translated checks. Clearing search retains the category; the empty-result reset clears search and restores all five cards.
- All six localized card journeys open the correct existing enquiry draft with the service prefilled. Back restores the query and category. Keyboard activation of the English tyre card works. No enquiry was submitted.
- Keyboard Tab reaches the last mobile pill, scrolls it fully into view and shows the existing focus ring.
- `npm run check` passed: ESLint, TypeScript and the production build, using Node 22.20.0 and isolated `.next-build-check` output. The live dev output and `next-env.d.ts` were preserved.
- No browser application errors were recorded. The development log contains the expected Fast Refresh full-reload warning from editing the shared catalogue.

[Measured layouts and interaction records](verification.json) retain the focused browser evidence. [Selected image files and exact prompts](../../public/showroom/services/DEMO-PROMPTS-2026-10-04.md) record asset generation and the tyre valve correction. Selected PNG originals and optimized WebP copies are retained in the source tree. The browser viewport override was reset after verification.

This receipt covers the local App template implementation and its build. It does not record a dealer publication or template release selection.
