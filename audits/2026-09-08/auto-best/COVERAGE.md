# Auto Best — coverage and evidence

8 September 2026. Target: J:/cars/templates/auto-best at http://127.0.0.1:6461.

## Full primary route matrix

31 route/state captures per layout: 390×844 and 1440×900. All eight vehicles and all nine articles are included. Full-page captures were visually reviewed individually or in labelled contact sheets; representative pages and interaction states were also inspected at larger scale. The three supplemental articles per layout are in supplemental-articles.json.

| State | Route | HTTP | Mobile full page | Desktop full page |
|---|---|---:|---|---|
| home | `/` | 200 | [image](evidence/mobile-home.png) | [image](evidence/desktop-home.png) |
| inventory | `/listing-grid` | 200 | [image](evidence/mobile-inventory.png) | [image](evidence/desktop-inventory.png) |
| vehicle-1 | `/listing-detail-v1/1` | 200 | [image](evidence/mobile-vehicle-1.png) | [image](evidence/desktop-vehicle-1.png) |
| vehicle-2 | `/listing-detail-v1/2` | 200 | [image](evidence/mobile-vehicle-2.png) | [image](evidence/desktop-vehicle-2.png) |
| vehicle-3 | `/listing-detail-v1/3` | 200 | [image](evidence/mobile-vehicle-3.png) | [image](evidence/desktop-vehicle-3.png) |
| vehicle-4 | `/listing-detail-v1/4` | 200 | [image](evidence/mobile-vehicle-4.png) | [image](evidence/desktop-vehicle-4.png) |
| vehicle-5 | `/listing-detail-v1/5` | 200 | [image](evidence/mobile-vehicle-5.png) | [image](evidence/desktop-vehicle-5.png) |
| vehicle-6 | `/listing-detail-v1/6` | 200 | [image](evidence/mobile-vehicle-6.png) | [image](evidence/desktop-vehicle-6.png) |
| vehicle-7 | `/listing-detail-v1/7` | 200 | [image](evidence/mobile-vehicle-7.png) | [image](evidence/desktop-vehicle-7.png) |
| vehicle-8 | `/listing-detail-v1/8` | 200 | [image](evidence/mobile-vehicle-8.png) | [image](evidence/desktop-vehicle-8.png) |
| about | `/about-us` | 200 | [image](evidence/mobile-about.png) | [image](evidence/desktop-about.png) |
| blog | `/blog` | 200 | [image](evidence/mobile-blog.png) | [image](evidence/desktop-blog.png) |
| article-1 | `/blog-detail/1` | 200 | [image](evidence/mobile-article-1.png) | [image](evidence/desktop-article-1.png) |
| article-2 | `/blog-detail/2` | 200 | [image](evidence/mobile-article-2.png) | [image](evidence/desktop-article-2.png) |
| article-3 | `/blog-detail/3` | 200 | [image](evidence/mobile-article-3.png) | [image](evidence/desktop-article-3.png) |
| article-4 | `/blog-detail/4` | 200 | [image](evidence/mobile-article-4.png) | [image](evidence/desktop-article-4.png) |
| article-5 | `/blog-detail/5` | 200 | [image](evidence/mobile-article-5.png) | [image](evidence/desktop-article-5.png) |
| article-6 | `/blog-detail/6` | 200 | [image](evidence/mobile-article-6.png) | [image](evidence/desktop-article-6.png) |
| article-7 | `/blog-detail/7` | 200 | [image](evidence/mobile-article-7.png) | [image](evidence/desktop-article-7.png) |
| article-8 | `/blog-detail/8` | 200 | [image](evidence/mobile-article-8.png) | [image](evidence/desktop-article-8.png) |
| article-9 | `/blog-detail/9` | 200 | [image](evidence/mobile-article-9.png) | [image](evidence/desktop-article-9.png) |
| contact | `/contact` | 200 | [image](evidence/mobile-contact.png) | [image](evidence/desktop-contact.png) |
| inspection | `/contact?topic=inspection` | 200 | [image](evidence/mobile-inspection.png) | [image](evidence/desktop-inspection.png) |
| leasing | `/contact?topic=leasing` | 200 | [image](evidence/mobile-leasing.png) | [image](evidence/desktop-leasing.png) |
| sell | `/contact?topic=trade-in` | 200 | [image](evidence/mobile-sell.png) | [image](evidence/desktop-sell.png) |
| import | `/contact?topic=import` | 200 | [image](evidence/mobile-import.png) | [image](evidence/desktop-import.png) |
| inventory-empty | `/listing-grid?q=zzzz-no-match` | 200 | [image](evidence/mobile-inventory-empty.png) | [image](evidence/desktop-inventory-empty.png) |
| blog-empty | `/blog?q=zzzz-no-match` | 200 | [image](evidence/mobile-blog-empty.png) | [image](evidence/desktop-blog-empty.png) |
| not-found | `/audit-missing` | 404 | [image](evidence/mobile-not-found.png) | [image](evidence/desktop-not-found.png) |
| vehicle-missing | `/listing-detail-v1/999` | 404 | [image](evidence/mobile-vehicle-missing.png) | [image](evidence/desktop-vehicle-missing.png) |
| article-missing | `/blog-detail/999` | 404 | [image](evidence/mobile-article-missing.png) | [image](evidence/desktop-article-missing.png) |

Intentional 404s also generate expected browser console resource errors. The non-error captures had no recorded page JavaScript errors or broken visible images and no document-wide horizontal overflow. This is local Chrome evidence, not complete accessibility or real-device certification.

## Additional widths

| Viewport | Routes checked | Overflow |
|---|---:|---|
| 320×844 | 8 | None measured |
| 430×932 | 8 | None measured |
| 768×900 | 2 | None measured |
| 991×900 | 2 | None measured |
| 992×900 | 2 | None measured |
| 1024×900 | 8 | None measured |
| 1280×900 | 8 | None measured |
| 1920×1080 | 8 | None measured |
| 844×390 | 8 | None measured |

Total: 54 route/viewport combinations. See [measurements and screenshot filenames](evidence/edges.json). Primary routes were home, inventory, vehicle 2, About, blog, contact, Sell and Import; 768/991/992 transition checks used home and inventory. Edge probes were viewport checks, not physical-device emulation.

## Internal links and redirects

84 URL entries were checked from rendered internal links and a sampled legacy/machine-route set. All had successful final HTTP responses; query variants are separate entries. [Exact list](evidence/linked-urls.json). This does not mean every possible legacy alias received a visual review.

## Interaction coverage

| Family | Evidence/result | Limits |
|---|---|---|
| Mobile full filters and nested pickers | Dedicated suite PASS at 320×677, 390×844, 430×932, 700×390 | Chrome; hardware keyboard/viewport emulation |
| Sell/Import enquiry | Dedicated suite PASS at 320, 390, 844 and 1440; fields, images, invalid files, review, draft retention, focus, sharing fallback | Clipboard/share mocked; no real message or upload |
| Desktop discovery | Dedicated suite PASS for home/inventory at 1024, 1440, 1920; drafts, sticky bar, filter access, focus | Local dev runtime |
| Detail calculator | Deposit/term update, max clamp; main estimate confirmed; selected car lost on handoff | No actual credit offer calculation or provider flow |
| Visible Back | Filtered BMW results → vehicle 4 → Back loses filters | Browser Back is a separate behavior |
| Main mobile menu | Initial focus, 19 Tabs, Escape and trigger return PASS | No inert background; screen reader not certified |
| Desktop mega-menu | ArrowDown opens/focuses link; Escape closes and returns focus | Full assistive-technology matrix not tested |
| Home Buy/Import tabs | ArrowRight selects Import | Chrome keyboard observation |
| Blog search/category | Search and category preserve each other | Article Back resets index context |
| Video | First video plays mobile/desktop; stop returns focus | Remaining two videos not individually played; all previews captured |
| Maps | About/detail/contact settled maps rendered mobile/desktop | Pin/address identity was not independently confirmed with the business |
| Focus styles | Missing focus token reproduced | Full contrast/screen-reader/zoom certification not performed |
| Quick brand change | Independent Audi/model → BMW sequence PASS; old model cleared, sort preserved | General suite's earlier timeout remains unresolved |

## Validation commands and outcome

- Supported Node 22.23.2; 'npm run validate': PASS (architecture, assets, Svelte 0 errors/0 warnings, production build). [Log](evidence/validate.log).
- Header Svelte autofixer: no issues/suggestions. [Log](evidence/svelte-header-review.log). Only Header received this analyzer run; the Svelte check covered the app.
- Three dedicated smoke scripts: PASS. [Log](evidence/existing-smokes.log). Audit runner copies change only base URL/Chrome/output plumbing.
- General 'sveltekit-smoke': 28 desktop PASS records, mobile home baseline FAIL, then mobile picker timeout at source line 1549; aggregate suite report not produced. [Log](evidence/sveltekit-smoke.log). The runner caught the exception; a zero wrapper exit must not be interpreted as suite success.
- No application source tests were rewritten, no dependencies upgraded and no server data submissions made.

## Evidence handling

Fast full-page captures may show blank lazy maps and a fixed dock near the top. Settled map screenshots and followup.json supersede the initial blank states. Initial interactions.json contains a few URLs read before navigation settled; finalized navigation URLs are in followup.json. There are no findings based only on those early URLs.

Browser evidence scripts: [primary capture](capture.mjs), [interactions](interactions.mjs), [edge captures](edges.mjs), [settled/focus probes](followup.mjs), [qualification probes](final-probes.mjs), [existing-suite runner](run-existing.mjs).
