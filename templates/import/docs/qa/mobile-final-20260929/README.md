# Import mobile final pass — 29–30 September 2026

Scope: the existing working-tree storefront at `http://127.0.0.1:5174/en`, with manual browser review at 320px and 390px, a 1440px desktop preservation check, and isolated production-preview regression tests. This is local QA, not a template promotion, dealer deployment, WCAG certification or owner visual acceptance.

## Corrections

- Removed the focus trap from the persistent **nonmodal** mobile vehicle panel. Save and Photos are keyboard reachable; the modal inquiry sheet retains its focus containment and restores focus on dismissal.
- Allowed inventory model names to occupy two lines and gave specifications more width at 320px. Prices, mileage, transmission and listing badges remain readable.
- Fixed the English Account menu link: `/account?lang=en` must stay outside the native public `/en` prefix. The legacy account demo remains Bulgarian and is not a localized public storefront page.
- Prioritized the first visible home vehicle photo. Desktop-only hero artwork and its preloads now use the desktop media condition.
- Derived a 600px WebP from the existing `daynight-logo-generated.png` with Sharp, quality 90, effort 6: 736,865 bytes to 41,894 bytes (94.3% smaller). The original reviewed image is retained; no new identity was generated.
- Inline production CSS chunks up to 256KiB, including the shared storefront stylesheet, to avoid the measured first-paint request chain. This trades a larger compressed HTML response for fewer blocking requests; styles are no longer separately reusable from HTTP cache on an initial document. Development retains external styles because the Tailwind/Vite development pipeline rejected the inline form.
- Corrected stale desktop-only navigation selectors and hydration timing in existing locale interaction tests.

## Coverage

The public route matrix includes Home, inventory, a vehicle detail, Contact, Import, Sell, Financing, Calculator, About, Services, Blog, an article, Reviews, FAQs, Privacy, Terms, Cookies, Favorites, Compare and Locale settings. The new route scans use axe tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa` and check 320px page reflow.

Interaction coverage includes menu open/close, country/language preferences, English/Bulgarian navigation, search and filters, sorting, saved cars, populated comparison with remove/clear, vehicle galleries and inquiry sheets, calculator/finance inputs, both Import/Sell modes, contact validation/demo receipt/reset, keyboard focus and all nine FAQ disclosures. External phone, messaging, maps and social destinations were inspected without contacting anyone. Demo forms do not deliver real enquiries.

The broad production run before the final performance changes passed 110 tests with 43 viewport-specific skips. Its one failure was the obsolete desktop navigation selector in the mobile locale history test; the selector was corrected for the final run. The initial unit run passed all 117 tests in 16 files. Final asset validation passed all 810 images; architecture validation passed 57 native route modules, 187 reachable modules and one Tailwind generation entry. Svelte reported zero errors and zero warnings; scoped ESLint passed.

Final production build completed with the Vercel adapter (Node 24.21.0). The targeted 74-case browser run passed 72 cases on its first run. The English 320px Import case timed out during cold startup, then passed; the image-download regression detected the second hidden desktop hero, which was corrected with lazy loading. Both cases passed on the final rebuilt production preview. There are no unresolved failures in that 74-case selection. All 20 English WCAG/reflow scans and the populated comparison scan reported zero automated violations. The English/Bulgarian route matrix and form journeys cover 320, 390 and 1440px. The final home browser inspection recorded no console errors.

After the final CSS inlining change, the production build passed again and all 26 cases in `tests/mobile-final.e2e.ts` passed without retries, including the 20 page scans, account links, image downloads, populated comparison and keyboard focus regressions. The final 390px screenshot below is from that production build and retains the reviewed layout.

Commands used for the final browser selection and rerun:

```text
PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:6794
playwright test tests/mobile-final.e2e.ts tests/localization.e2e.ts tests/localization-interactions.e2e.ts --project=mobile --workers=1
playwright test tests/mobile-final.e2e.ts tests/localization.e2e.ts tests/localization-interactions.e2e.ts --project=mobile --workers=1 --last-failed
```

## Loading result and remaining limitation

The final [Lighthouse receipt](performance.json) uses the same simulated mobile settings as the baseline (150ms RTT, about 1.6Mbps throughput, 4x CPU slowdown).

| Metric                   |          Before |           Final |
| ------------------------ | --------------: | --------------: |
| Performance score        |              55 |              72 |
| Accessibility score      |             100 |             100 |
| Best practices score     |              96 |             100 |
| First contentful paint   |            5.3s |            2.7s |
| Largest contentful paint |           13.1s |            7.0s |
| Total blocking time      |           320ms |            80ms |
| Cumulative layout shift  |         0.00035 |         0.00035 |
| Downloaded data          | 2,060,998 bytes | 1,187,567 bytes |

The measured transfer reduction is 42.4%. Application CSS no longer appears in the render-blocking request list; the remaining font declaration stylesheet is 582 transferred bytes. The LCP photo is discoverable in server HTML, eager and high priority. **Slow-network simulated LCP still remains too high at 7.0 seconds. This is not a claim of fast-loading acceptance or a perfect performance score.** The page still downloads six font faces (about 348KB combined), other initial assets and remote inventory imagery; a further font/asset budget pass remains useful. The unthrottled observed image timing must not be confused with the reported simulated LCP.

## Evidence and preservation

- [320px home](home-320.png)
- [390px home](home-390.png)
- [320px inventory](inventory-320.png)
- [1440px desktop preservation](home-1440.png)
- [Source digest and frozen-copy comparison](source.json)

The frozen QA copy under Cars `runtime/` uses Node 24.21.0 and the retained npm lockfile. It includes the pre-existing local Import drafts that the requested preview renders. Those drafts in AGENTS, ArticleCard, YouTubeSection, HomePage, native copy and two FeaturedVehicles CSS declarations are preserved and excluded from this task's commit. Other Cars templates and the shared index also contained unrelated work. This report does not claim that a clean checkout of the task commit reproduces those unrelated drafts.

The machine ran out of memory during the initial full ESLint command and a later production rebuild. The final `npm run verify` passed Svelte and full Prettier checks, then stopped on three pre-existing `runtime/mobile-polish/source-after-*.svelte` evidence files outside the TypeScript project. Those ignored files were preserved. Full application ESLint passed with `--ignore-pattern 'runtime/**'`; all 117 unit tests passed again. This is not a claim that the unmodified aggregate verify command passed. A bounded-worker rebuild stalled; the accepted final build used normal worker settings and a 4GB Node heap limit. Existing legacy dashboard `@reference` minifier warnings are separate from errors.

Automated accessibility checks cover only machine-testable rules. Real-device Safari, VoiceOver/TalkBack, field INP/Core Web Vitals and a public deployment were not tested. Lighthouse numbers are simulated mobile lab results on a local production preview; they are not measurements of the Vite development server or real users. Criteria: [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) and [Core Web Vitals](https://web.dev/articles/vitals).
