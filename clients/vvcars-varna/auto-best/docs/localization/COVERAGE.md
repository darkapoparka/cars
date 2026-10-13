# Auto Best route and state coverage

This is the acceptance map, not an assertion that an unrecorded run passed. Exact run results, timestamps and source hashes are retained in `evidence/` and summarized in `HANDOFF.md`. Every public family below is tested in English and Bulgarian; the primary route/journey widths are 320, 390 and 1440 CSS pixels.

| Public family | Routes | Required states and evidence suite |
| --- | --- | --- |
| Home | `/en`, `/bg` | Buy/import tabs, search, body/brand discovery, menus, country/language prompt, mobile/desktop copy and metadata. `qa-locales`, `qa-locale-journeys`, `journey-smoke`, `typography-smoke`. |
| Inventory | `/{locale}/listing-grid` | Applied and pending filters, make/model dependency, body-style versus Coupe option, query, ranges, equipment, sort, chips, zero matches, nested Apply/Cancel and focus. `qa-locales`, `mobile-filter-smoke`, `desktop-discovery-smoke`, `phase4-smoke`, `overlay-proportions-smoke`. |
| Vehicle details | `/{locale}/listing-detail-v1/1` through `/8` | Every retained vehicle, localized vocabulary/formatting, finance controls and invalid deposit, information/equipment/description tabs, contact context, anchored list return and mobile actions. `qa-locales`, `qa-locale-ssr`, `journey-smoke`, `qa-locale-journeys`. |
| Contact and inspection | `/{locale}/contact`, `?topic=inspection` | Dealer-owned city/address, appointment copy, map accessibility, vehicle context, navigation and metadata. `qa-locales`, `qa-locale-ssr`, `journey-smoke`. |
| Sell/trade-in regression | `/{locale}/contact?topic=trade-in` | Both purposes, link/VIN/manual entry, validation, photo type/size/count errors, contact details, review/edit, clipboard success/denial, sharing pending/failure, dismiss and retained draft. `qa-locale-completion`, `qa-locale-journeys`, `enquiry-smoke`, `typography-smoke`. |
| Import | `/{locale}/contact?topic=import` | Listing-link and criteria modes, invalid URL/budget/year, entry editor, review/edit, copy/share states, guide drawer and short labels. Same enquiry suites plus final UI fit checks. |
| Finance | `/{locale}/contact?topic=leasing` and vehicle detail calculator | Informational leasing preparation, explicit demo limits, real local calculator estimate updates and labeled validation. The contact route intentionally has no lending application form. |
| About | `/{locale}/about-us` | Retained composition, translated preparation/company copy, dealer display fields and metadata. Optional unverified team/partner sections remain disabled. |
| Editorial | `/{locale}/blog`, `/{locale}/blog-detail/1` through `/9` | All nine articles, search/category, empty results, related reading, filtered and anchored returns, localized metadata. `qa-locales`, `qa-locale-ssr`, `journey-smoke`. |
| Preferences | `/{locale}/locale-settings`, `/api/preferences` | Native SSR form, first visit, manual reopen, independent country/language choices, dismiss versus save, reload, focus trap/return, query/anchor preservation and no-JS. `qa-locale-preferences`, `qa-locale-storage`, `qa-locale-races`, `qa-locale-journeys`. |
| Errors and resources | Missing routes/IDs, disabled-language paths, robots/sitemap/static/API URLs | Localized 404s, unsupported languages hidden/rejected, resource destinations not rewritten, non-preference business writes denied. `qa-locales`, `qa-locale-http`, `qa-locale-legacy`. |

## HTTP, storage and concurrency contract

The serial suite includes bounded, deliberately concurrent requests to prove server isolation. Conflicting explicit paths, query hints, saved cookies, browser preferences and approximate country suggestions must not leak or override explicit URL language. Legacy aliases retain queries and terminate without loops. Security tests cover same-origin validation, supported types/fields, body-size limits, host-only secure cookies and private/no-store responses.

Storage-denial tests distinguish JavaScript storage failure from combined cookie/storage rejection. Explicit localized URLs still work; persistent country and prompt state cannot survive when all storage is rejected. No-JavaScript acceptance covers server-rendered language and the native preference form, not JavaScript-only enquiry editors.

Race tests use controlled preference latency for save/cancel, immediate dismissal, stale external destinations and reopening during a pending dismissal. Copy/share failure and busy states are simulated browser APIs; this is not verified real enquiry delivery.

## Deliberate exclusions

Only this standalone Auto Best template is released here. Cross-design FAB journeys, mounted dealer packaging, the separate English-only Admin application, dealer deployments and other template masters are not performed. The standalone app does not have a cross-design FAB; its six locale/viewport FAB cases are explicit skips, not passes. Arabic, German, Ukrainian, Turkish, Romanian and Greek remain hidden until complete catalogs and native acceptance exist; Arabic additionally requires RTL review.
