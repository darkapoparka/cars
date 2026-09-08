# EAI-107 — About banner section shortcuts

Status: **READY FOR OWNER REVIEW**.

The About banner now has Gallery, Video, Services and Location pills beneath the existing two CTA buttons. The pills reuse the exact styling of the inventory/services shortcuts and navigate to real About sections. They are shown at the same desktop breakpoint (1024px); existing mobile shortcuts and banner remain unchanged.

Scope: `PageBanner.svelte` adds an optional typed sectionLinks prop and native fragment links. `AboutContent.svelte` supplies four links and wraps the existing video section in its scroll-offset anchor. No stylesheets, assets, copy, other page components or data changed. Exact delta against the saved baseline: 20 added lines, two removed lines across two application files.

Evidence: `artifacts/about-banner-pills-20260906/`.

- Before and after screenshots at 390, 1024, 1440 and 1920; additional About render at 1280.
- Banner stays 300px high on desktop; all pills have 44px targets and no overflow.
- Each pill tested with keyboard Enter; target lands at approximately 132px below the viewport top, clearing the sticky header. Browser Back removes the fragment and returns to the previous position.
- Thirteen preservation screenshots have zero changed bytes: Inventory, Services and Contact at four widths, plus About at 390px.
- Both Svelte autofixers report no issues or suggestions. Focused ESLint passes. `npm run check` passes with zero errors and zero warnings; `npm run build` passes. Logs are stored alongside the evidence.

Existing whole-repository lint/unit limitations are documented in the preceding EAI-107 reports; this reversible navigation change was verified through its rendered behavior and focused checks. No extra unit tests, broad fixes, commit or push. Existing dirty work preserved.

Local review: http://127.0.0.1:6404/about.
