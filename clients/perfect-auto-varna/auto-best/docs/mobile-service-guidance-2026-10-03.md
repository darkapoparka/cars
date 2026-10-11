# Mobile Sell/Import guidance, 3 October 2026

Sell and Import use a compact white **How it works** card below the mobile form, with shared 20px corners, a subtle shadow and 16px padding. An official Hugeicons arrow is vertically centered beside both copy lines. Sell reads **Viewing, valuation and terms** / **Оглед, оценка и условия**. Import reads **Checks, transport and budget** / **Проверки, транспорт и бюджет**. Both the numbered stage preview and the subsequent transparent row were rejected; `stages/` and `plain-row/` captures are not the final design.

The entire card opens the retained white bottom drawer with preparation advice, three service steps and the existing brief demo disclosure. Escape, close, backdrop, drag, keyboard dismissal and the enquiry action return focus to the card. Form drafts survive these interactions. The mobile guide closes when entering the desktop layout at 768px; desktop retains the existing process disclosure.

The card has a 12px gap below the form. Its explanation fits one complete line at 320px and wraps with enlarged text. Mobile form titles are visually hidden through the opt-in `EntryCard.hideTitleOnMobile` property, preserving their heading text and section labels for assistive technology. Sell/Import segmented choices match Home's centered `min(100%, 15rem)` width and 8px option padding. Header location/call glyphs are 26px inside their existing 44px targets, retaining official Hugeicons geometry. Calling remains available from the header.

Import uses the existing configured charcoal `--dn-theme-hero-surface-mid` (#202329) for its mobile hero. Sell retains the configured red workflow hero; both primary actions keep the brand accent. The change is scoped below 768px and does not alter the asset, logo or desktop theme.

The lower mobile page keeps the faint template background through `leadSite.artwork.serviceBackground`. A single bottom-aligned layer, up to 400px tall, fades from an opaque canvas into an 8% image contribution. It preserves the proportions of the existing 46KB `home-section-body-backdrop-v1.webp`; no raster was edited or added. The asset is already tracked and has retained generation provenance. Desktop service pages do not load this mobile layer.

## Verification

Runtime: Node 22.20.0, existing Vite listener PID 26468 at `http://127.0.0.1:6461` in the canonical Auto Best checkout. Source checks/build describe the current working tree, which also includes preserved desktop drafts; they are not an immutable template-release claim.

- Svelte/type check: 0 errors, 0 warnings. CSS policy, tokens, typography, generated locale and source locale checks passed.
- Production build passed; final output is `runtime/mobile-service-guidance-2026-10-03/card/build.log`.
- Locale tests: 27 passed earlier in this task; the existing preview copy is unchanged in this correction, and prebuild locale checks passed again.
- `service-entry-overlay-smoke.mjs`: all six BG/EN cases at 320/390/430px passed. It checks white card/arrow geometry, compact centered tabs, accessible hidden titles, readable supporting copy, preparation/process content, focus containment/return, dismissal, draft preservation, breakpoint release and the complete enquiry flow. No outbound form requests occur.
- Focused `mobile-reflow-smoke.mjs`: all 24 service page and guide drawer cases passed in BG/EN at 320/390/430px with normal text, 200% root text and text spacing. Filter: `contact\?topic=(trade-in|import) reflow|(import-guide|sell-guide) dialog reflow`.
- Geometry and background requests: all 24 cases passed, including six actual Home tab measurements, 16 mobile locale/topic/viewport combinations at 320x667, 320x568, 390x844 and 430x932, and both 1440px desktop topics. Service tabs match Home's 240px width in every normal mobile case. The guide card is about 82px high, matches the form width and has zero measured arrow-center offset. It fits above the dock at 320x667 without scrolling. At 320x568 BG and EN Import fit without scrolling; EN Sell needs 14px of scroll to fully expose the card. Neither the page nor its controls overflow. Desktop retains visible form titles and the existing disclosure, with the mobile background omitted.
- Earlier broad mobile suites stopped on Home fixture expectations before reaching this work. This task does not claim a passing complete mobile suite or a valid pixel-identical desktop comparison.

Final page screenshots and `final-fit.json` are under ignored `runtime/mobile-service-guidance-2026-10-03/card/`. Existing drawer captures and other comparison evidence remain in the parent folder and `artifacts/`.

## Source scope

Repository `L:/CODEX/cars`, remote `https://github.com/darkapoparka/cars.git`, branch `main`. The plain-row correction began from `6da21aa97fe75a8b4fb3eaeee01eee1442db6583`, matching fetched main. Workspace doctor with `--fetch` completed; unrelated dealer, template, admin, dependency, asset and desktop work was preserved.

Task-owned paths:

- `src/lib/components/company/{ServiceLanding,ServiceProcessPreview,TradeInInfoDrawer,ImportHowItWorks}.svelte`
- `src/lib/components/company/service-entry.css` and the opt-in mobile title property in `src/lib/components/ui/entry/EntryCard.svelte`
- The two mobile glyph-size changes in `src/lib/components/layout/Header.svelte`
- Only the `serviceBackground` type/property additions in `src/lib/config/lead-site.ts`
- `localization/common.json`, `localization/generated-manifest.json`, `src/lib/locale/catalog.ts`
- `scripts/{mobile-polish-smoke,mobile-reflow-smoke,service-entry-overlay-smoke,typography-smoke}.mjs`
- Only the mobile service introduction and two affected suite rows in `docs/TESTING.md`, plus this note
- Only the mobile header-glyph and service-guide paragraphs in `docs/STYLING.md`

The pre-existing shared index lock was preserved while present. It was absent at the start of this correction. Shared-file staging must include only the listed configuration and styling hunks. No dealer refresh or deployment is part of this change; owner visual acceptance remains separate from local validation.

The shared index lock is now absent. Last inspected main before staging is `b941218c9ad4e10d7e078342fd6eac8da9aebbad`, matching fetched `origin/main`. Reviewed staging includes only the task-owned paths above and seven specific shared-file hunks across configuration, styling and testing documentation. Unrelated font, desktop, asset, dependency, dealer and template drafts remain outside this scope.
