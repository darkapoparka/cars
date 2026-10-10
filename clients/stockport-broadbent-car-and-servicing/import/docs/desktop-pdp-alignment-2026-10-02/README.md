# Desktop PDP alignment

The paired Основни данни and Детайли cards now stretch to the same height through their existing grid. When stacked, they retain natural heights. Their accepted grey rows, field content and typography are preserved; no fixed card height or empty field was added.

The seller banner uses an 18px appointment line. Its map icon has a centered circular slot, and the icon and destination arrow align vertically with the address block. The configured identity, artwork, copy and map destination are preserved.

The desktop sidebar finance select uses a decorative chevron centered in the same grid cell as the native select, inset by the shared 16px spacing token. The select keeps its native options/binding and an explicit generated label ID. Number fields hide the browser's spin arrows while preserving typing, number semantics, limits and keyboard stepping. Changes to finance control appearance are scoped to desktop sidebar layout.

## Evidence and verification

- [Before at 1440 × 1000](before-1440.jpg) and [after at 1440 × 1000](after-1440.jpg), both at scroll position 808 on `/bg/inventory/21778067767337633`.
- [After at 768 × 1000](after-768.jpg) and [recorded checks](verification.json).
- Desktop at 768, 1024, 1280, 1440 and 1920: no horizontal overflow; equal 285px facts cards when paired; 48px finance controls with aligned lower-row inputs. The chevron and both seller icons have zero center offset at all tested widths.
- Price keyboard step remains 100 and interest step remains 0.1. The BG term select is accessible by its exact label. At a price of 33,000, down payment of 6,600, 60 months and 6% annual interest, the display updates to 26,400 financed, 510 per month and 37,223 total, matching the retained formula and presentation rounding. Defaults were restored afterward.
- EN term label/selection works and appointment copy renders at 18px.
- Mobile PDP at 320 and 390 retains its independent component; none of these three desktop components render. The full Financing page at 320, 390 and 1440 retains native controls, with no custom chevron or horizontal overflow.
- Final Svelte check: zero errors/warnings. Scoped ESLint and Prettier checks pass; architecture check passes with 57 native route modules and 215 reachable modules. Fresh loads after the generated-ID correction record zero console errors/warnings.
- Workspace doctor fetched main before integration with no source drift; unrelated dirty work and other commits were preserved.

These are focused local development checks. No production build, template release or dealer deployment was performed; owner visual acceptance remains separate.
