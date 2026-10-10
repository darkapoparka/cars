# Mobile Services summaries and compact CTA — 2 October 2026

The six mobile Services summaries now use short, consistent phrases without trailing periods. They fit naturally on one line at 320/360/375/390px in Bulgarian and English. No truncation or forced `nowrap` was added; enlarged text can reflow. The full desktop summaries, service destinations, context labels, rounded card actions, search and white horizontal filter pills are retained.

The shared Services/About contact banner now uses content-driven mobile height, a 24px heading, a short Call label and a rounded Map action on the same row. Its address remains visible on desktop, and the existing phone and map destinations remain available on mobile. The new mobile artwork follows the existing dark automotive banner style. See [ARTWORK.md](ARTWORK.md) for the generation prompt, reference assets and responsive exports; the built-in tool does not confirm the requested model version 2.5.

Changed implementation: `src/lib/content/service-directory.ts`, `src/lib/components/common/ContactBanner.svelte`, the existing Services regression case in `tests/mobile-secondary.e2e.ts`, and three responsive `contact-cta-mobile-v1*.webp` assets. Home/Menu artwork and the desktop contact image were retained.

## Visual evidence

Before screenshots came from the existing development server on port 6790 before edits. After screenshots came from the frozen production preview on port 6795. Paired card views use the page top; paired CTA views use the page bottom, where the shorter banner reveals more of the preceding content.

| View                          | Before                             | After                            |
| ----------------------------- | ---------------------------------- | -------------------------------- |
| Services cards, BG, 320 × 844 | [Before](before/services-320.jpg)  | [After](after/services-320.jpg)  |
| Services cards, BG, 390 × 844 | [Before](before/services-390.jpg)  | [After](after/services-390.jpg)  |
| Services CTA, BG, 320 × 844   | [Before](before/cta-320.jpg)       | [After](after/cta-320.jpg)       |
| Services CTA, BG, 390 × 844   | [Before](before/cta-390.jpg)       | [After](after/cta-390.jpg)       |
| About CTA, BG, 320 × 844      | [Before](before/about-cta-320.jpg) | [After](after/about-cta-320.jpg) |

Additional checks: [English cards at 320px](after/services-en-320.jpg), [English CTA at 320px](after/cta-en-320.jpg), [desktop CTA at 1440 × 960](after/services-desktop.jpg).

At 320px all six cards are 162px tall, and each summary occupies one line. The Bulgarian Services CTA decreased from approximately 376px to 196px at 320px, and from 348px to 165px at 390px. The About CTA decreased from 316px to 188px at 320px. The English CTA is approximately 191px tall at 320px. Both mobile banner actions have 44px height and fit on one row at normal text size.

The desktop spot check confirms a 300px banner, the existing desktop image, the inline address plus appointment note, and the original phone number and Directions labels. No horizontal overflow was observed in these views. The 200% text screenshot was also inspected: the banner grows naturally and its title remains visible.

## Verification

Using Node 24.21.0 and the retained npm lockfile in the frozen QA candidate:

- Scoped Prettier and ESLint: passed for the three changed source/test files.
- `npm run check`: passed with zero errors and zero warnings.
- `npm run build`: passed.
- `node scripts/check-assets.mjs`: passed for 891 local image signatures.
- Focused existing Playwright cases: **6 passed, 2 skipped**. The skips are the existing desktop exclusions for mobile service-filter cases. Checks cover both locales, 320/360/375/390px card title and summary line counts, compact banner height, same-row 44px actions, white horizontal filters, native GET search, service destinations, empty-search recovery and 200% root-font reflow.
- `node scripts/workspace-doctor.mjs --fetch`: completed. Unrelated working files, independent repositories and other task commits were preserved.

Focused browser command:

```text
PLAYWRIGHT_SKIP_WEBSERVER=1
PLAYWRIGHT_BASE_URL=http://127.0.0.1:6795
node node_modules/@playwright/test/cli.js test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts --grep "service filters|contact and account pages reflow" --workers=1 --reporter=list
```

`source-snapshot.json` identifies the complete working-source snapshot used by the build. `verified-files.json` records the hashes of the six task-owned implementation/test/asset files, verified against that passing candidate before saving evidence. This is local template verification; no template promotion or dealer deployment was performed.
