# App UI audit publication — 10 October 2026

The copy, accessibility and loading fixes are live on the existing [App catalogue](https://cars-template-app.vercel.app/bg/cars?brand=Audi). This publishes the reviewed App master preview.

| Publication identity | Verified value |
| --- | --- |
| Cars source commit | [70c2b80671e217ab299549a938a537c0b9559611](https://github.com/darkapoparka/cars/commit/70c2b80671e217ab299549a938a537c0b9559611) |
| Source subtree | `templates/app` |
| Source tree | `d3cb91b496d8d04f9c9c9ed57aaf4d430a958710` |
| Export policy | `cars-source-v1` |
| Exact source digest | `012d4701d226951cfbac7d978a1c0bff2339f1b1ae54c88f38c3a485861dab1f` |
| Publishing commit | [dcfe33bde79c6d2569804e3000e8816688334608](https://github.com/darkapoparka/cars-template-app/commit/dcfe33bde79c6d2569804e3000e8816688334608) |
| Publishing parent | `55f6f1634ebcc9ba40dfa2d4a13feacf30f0d9d9` |
| Existing Vercel project | `cars-template-app`, `prj_TnD7adaf0u3zjwhmV2xRxx9mWkOu` |
| Deployment | `dpl_FRSX2fEennkC5E6TiaDna2xzSDTy`, production READY |
| Immutable hosted URL | [cars-template-9c5xgddsh-tyj5.vercel.app](https://cars-template-9c5xgddsh-tyj5.vercel.app/) |
| Production ready | 10 October 2026, 02:12:53 UTC |

Both commits were pushed without force. The publishing tree contains 1,639 source files and its normalized fingerprint matches the exact Cars subtree. The prior mirror source matched its recorded Cars source before replacement; publishing history, integration metadata and the App quality workflow were preserved. The existing Git integration performed one Vercel deployment. The template release lock and dealer refresh workflow were outside this publication scope.

The fixes remove repeated demo notices, unsupported staff/contact/location details and duplicated draft wording. Responsive vehicle and emblem images, matching WOFF2 fonts, deferred alternative-home chrome and Next's production overlay shim reduce resource transfer. Labels, landmarks, heading order, live announcements and contrast are corrected. Reviewed desktop hero and vehicle-detail refinements are included in the tested source.

The [App quality workflow](https://github.com/darkapoparka/cars-template-app/actions/runs/38015879393) passed installation, full application checks, the production dependency audit, browser journeys and both journey route checks. Local integration evidence records 135 unit tests, 36 browser journeys, eight final focused journeys, 57 page accessibility scans and 21 dialog scans.

Hosted verification passed 18 browser journeys at 390/1440 pixels and 15 focused WCAG A/AA accessibility scans at 320/390/1440 pixels. Both locales and layouts, filtering, sorting/reload, empty results, filtered-list return, saved cars and enquiry drafts were covered. The scans found zero automated violations, page errors or unintended overflow. The deployment-scoped Vercel error/fatal log query returned no entries in the checked 15-minute window.

Lighthouse 13.5.0 used the same Audi route and simulated mobile/desktop profiles before and after publication. These are single-run lab measurements at different times, with ordinary run-to-run variability.

| Measurement | Mobile before | Mobile hosted | Desktop before | Desktop hosted |
| --- | ---: | ---: | ---: | ---: |
| Performance score | 72 | 83 | 95 | 100 |
| Accessibility score | 98 | 100 | 100 | 100 |
| Best practices score | 100 | 100 | 100 | 100 |
| Largest contentful paint | 6.1 s | 3.6 s | 1.4 s | 0.8 s |
| Total blocking time | 180 ms | 300 ms | 30 ms | 0 ms |
| Transferred resources | 1.56 MB | 0.60 MB | 1.56 MB | 0.61 MB |

Mobile loading and client execution still need improvement. These results do not establish full WCAG conformance, physical-device acceptance or field Core Web Vitals. Reference inventory still requires reviewed prices/currency and verified dealer content before a real dealer release.

The detailed report, four matched before/hosted-after captures, raw Lighthouse reports and compact source/deployment/check receipts are retained locally in ignored `templates/app/runtime/ui-audit-20261010/`. The temporary audit preview is stopped. The earlier generated-output cleanup was rejected by automatic review with "blocked by policy"; its inactive build and intermediate evidence remain retained. A separately verified abandoned empty index lock was preserved as a recovery file before the scoped commit.
