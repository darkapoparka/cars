# Services card consistency — 4 October 2026

The owner identified that the lower Грижа за колата / Car care panel looked different from the service cards. It was a separate dark campaign composition, with an overlaid illustration and white action, beneath the two photographic catalogue cards. Its copy repeated servicing and inspections, and View services opened the generic service enquiry form. The banner also remained below filtered and empty catalogue states.

The Services landing page now ends with its service catalogue. The two configured choices, Servicing and Diagnostics, use matching card heights, 2:1 photos, one-line headings, three check rows, 20px corners and whole-card links. Removing the duplicate campaign leaves one consistent set of service choices and a clean empty state. The source change removes the care campaign mount from `components/FeatureContent.tsx`; `TEMPLATE.md` records the revised page order and supersedes the earlier care-panel instruction. Existing artwork and historical receipts remain in the repository.

| View | Before | After |
| --- | --- | --- |
| Bulgarian, 390 x 884 viewport, scrolled page end | [Before](before-390.jpg) | [After](after-390.jpg) |
| Bulgarian, 1440 x 900 viewport, scrolled page end | [Before](before-1440.jpg) | [After](after-1440.jpg) |
| Bulgarian, 320px viewport | - | [After](after-320.jpg) |
| Bulgarian, 768px viewport | - | [After](after-768.jpg) |
| English, 320px viewport | - | [After](after-en-320.jpg) |
| English, 390px viewport | - | [After](after-en-390.jpg) |
| English, 1440px viewport | - | [After](after-en-1440.jpg) |
| Bulgarian, 320px empty search/category intersection | - | [After](empty-320.jpg) |

[Recorded measurements and interactions](verification.json) cover Bulgarian at 320px, 390px, 768px and 1440px, and English at 320px, 390px and 1440px. Both cards have matching dimensions at each width, loaded photos, one-line titles and three check rows. No document horizontal overflow or care campaign remains. Hover changes the active card's background as intended. The category strip retains its shared horizontal scrolling and 44px targets on small screens.

The Bulgarian Diagnostics category shows the diagnostics card. Combining that category with масло produces the empty state without a campaign underneath. Виж всички услуги resets search/category and restores input focus. Searching масло under All returns Servicing; Enter opens `/bg/service/details?service=routine` with Периодично обслужване prefilled, and Back restores the query and filtered card. Keyboard Tab reaches the next card with a visible 2px outline. The English diagnostics and destination checks are recorded in the verification file. No enquiry was submitted.

English computer search returns Diagnostics; its card opens `/en/service/details?service=diagnostics` with Inspection and diagnostics prefilled. Back restores computer and the filtered card. Browser diagnostics contain no errors or warnings. The final Bulgarian Services preview is restored with no query/category filter, and the temporary viewport override is reset. Two automation selectors were corrected to the actual localized labels before recording the successful empty-state and enquiry checks.

`npm run check` passed using Node 22.20.0: ESLint, TypeScript and the webpack production build generated all 407 pages. The existing isolated `.next-build-check` output was used; development `next-env.d.ts` was preserved. The canonical checkout is `L:/CODEX/cars/templates/app` on Cars `main`, and the existing local preview listens on port 6483. Source delivery is scoped to `components/FeatureContent.tsx`, `TEMPLATE.md` and this evidence folder. Unrelated shared work is preserved; no dealer release or hosted deployment is included.
