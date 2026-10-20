# 07 — Two-brand reuse and release qualification

**Status:** Planned — not implemented by this audit.  
**Findings:** F23, F26–F28.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** prove this is reusable source, not just a polished one-off demo. Depends on the relevant migration, testing and safety gates.

### P07-1 — Complete configuration wiring

Connect the typed public site/content/theme configuration to all supported routes, head data, navigation, errors and safe API responses. Separate private runtime configuration. Remove unintended dealer literals from shared components. Do not add a generic layout-builder or runtime tenant service.

### P07-2 — Two fictional brands

Run the approved brand A/B fixtures with different name/logo proportions, accent contrast, contact lengths, languages and optional content. Use `.invalid` domains and mock delivery. Assert no unintended sample identity in visible text, metadata, sitemap, structured data and fallback states. Shared components must not change between fixtures.

### P07-3 — Full standalone qualification

Run clean install, type/lint/unit/build/browser gates with the selected runtime and pinned browsers. Review remaining advisories by exposure. Complete the public and retained admin/account route matrix, keyboard/focus/zoom cases and asset/performance checks. Obtain explicit desktop/mobile visual approval.

### P07-4 — Cars compatibility checkpoint

Provide an immutable candidate source revision and source-shape change notes to the Cars release workflow. Test actual mounted `/variant-2/` behaviour, assets, service routes, locale/raw links, requests, redirects and switcher through that packaging layer. Compare Cars-only refinements before replacing a snapshot. Standalone success is not mounted evidence.

### P07-5 — Handoff and promotion boundary

Record the approved runtime/dependency set, completed phases, known limitations, configuration contract, provenance, migration notes and rollback. Existing dealers remain on their selected lock until deliberately updated. Template release approval, dealer publication and real provider/delivery verification are separate actions requiring authorization.

### Exit and handoff

Both fictional configurations pass without editing shared components; standalone and actual mounted evidence exists; the owner approves the UI; every enabled live capability is qualified; and the release record points to immutable source. This phase does not authorize deployment, contact with leads or automatic propagation into existing dealer sites.
