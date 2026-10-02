# Import country pills — 3 October 2026

At the owner's request, the Finance landing's Cars to finance / Коли на лизинг inventory block is replaced by Import to order / Внос по заявка country pills. Germany, Canada, USA, Italy and the Netherlands are configured in `showroom.importCountries`; Other country accepts another origin.

Each pill opens `ImportCountryPicker`'s import form with the country selected. Make/model, budget in the configured currency and a listing link are optional. A custom country is required and cannot contain only whitespace. Details stay local and survive closing or changing countries. Preparing the enquiry opens the existing dealer draft/contact boundary with the country and provided details. The form does not fetch foreign listings, submit an import order or claim country availability.

The calculator remains accessible from the existing banner; priced dealer stock is selectable inside its dialog. The former landing examples, View all action and assumptions caption are removed. The existing help campaign follows the country pills. Sell and Services composition is retained.

## Local browser verification

Preview: `http://127.0.0.1:6483`, through the Codex in-app browser.

| Locale | Viewport | Result |
| --- | --- | --- |
| BG | 320 × 740 | All six country pills visible with 44px targets, no document overflow; document width and scroll width both 305px. Germany form inspected. |
| BG | 390 × 844 | Country pills wrap to two rows. Canada form, nested draft and retained values inspected. |
| BG | 768 × 1024 | All country pills fit on one row. Document width and scroll width both 753px. |
| BG | 1440 × 1000 | Country pills, calculator banner and help campaign visually inspected. |
| EN | 320 × 740 | Country names and form labels fit. Document width and scroll width both 305px. USA selection and a country-only draft verified. |

Focused checks:

- Canada pill selects Canada. Toyota Corolla, €25,000 and an example listing URL appear in the editable import draft.
- Browser Back returns from that draft to the populated form. Escape closes the form and restores focus to the Canada pill.
- Other country selects the custom-country field. Whitespace-only input fails native validation; Швейцария produces the correct draft.
- Closing and choosing Germany retains optional car details while updating the origin.
- USA produces an English import draft without requiring optional fields.
- The calculator banner opens the €25,000 example with a €396 estimate. Its car picker searches 42 priced cars; Attrage returns two matches, and selecting the 2023 car sets €24,799 and the €393 estimate.
- No application errors were observed. Development Fast Refresh reported its expected full reload after the shared showroom configuration changed.

No external messages were sent during verification.

## Final screenshots

- [Country pills, BG 320px](countries-bg-320.jpg)
- [Country pills, BG 390px](countries-bg-390.jpg)
- [Canada import form, BG 390px](import-form-bg-390.jpg)
- [Country pills, BG desktop](countries-bg-desktop.jpg)

## Source validation

`npm run check` passed with Node 22.20.0, the retained npm lockfile and separate `.next-build-check` output: lint, TypeScript and the production webpack build, including all 407 static pages. The first build attempt failed with a native V8 allocation error. After checking available system memory, the full check was retried with one build worker and completed successfully. Final output is retained in `L:/CODEX/cars/runtime/app-import-countries-2026-10-03/check-retry.log`; the failed attempt remains in `check.log` for diagnosis.

Generated `next-env.d.ts` imports were restored to the original preview paths after the build. The App-scoped whitespace check passed. `node scripts/workspace-doctor.mjs --fetch` completed; unrelated Cars client/template changes and independent admin drift were preserved.
