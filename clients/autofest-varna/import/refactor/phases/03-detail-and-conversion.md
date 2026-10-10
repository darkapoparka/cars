# 03 — Detail and conversion flows

**Status:** Planned — not implemented by this audit.  
**Findings:** F07, F11–F14, F18.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** migrate the highest-value product and inquiry journeys using the shared foundations. Depends on Phase 02 shell/data contracts.

### P03-1 — Vehicle detail sections

Share one public detail view model across desktop/mobile and extract meaningful gallery, summary, facts, finance and contact sections. Preserve large useful imagery and approved artwork. Replace desktop section-specific surface/type patches with role-based components. Review sticky summary behaviour and one coherent reviews section.

**Paths:** `components/detail/AuxeroVehicleDetail.svelte`, gallery/static-content/mobile PDP components, inventory `[slug]` route/load and detail adapters.

### P03-2 — One finance policy

Unify `public-vehicles.ts` monthly estimates and `utils/format.ts` calculation behind explicit terms/assumptions. Fix missing/non-finite/invalid inputs and locale formatting with tests. Keep finance estimates visually secondary where appropriate; do not change their meaning merely to align a card.

**Paths:** `components/calculator/CalculatorEstimator.svelte`, calculator/financing routes and shared card/detail consumers.

### P03-3 — Import flow

Share schema/values/step content between `ImportRequestWizard`, `ImportRequestMobilePage`, `ImportRequestTemplatePage` and the desktop `ServiceFormCard` path. Preserve Link/VIN semantics, input and tab alignment. Remove the hidden desktop runtime on mobile. Keep how-it-works content subordinate to the task.

### P03-4 — Sell flow

Share validation/submission logic and meaningful step content across sell desktop/mobile. Preserve full-screen mobile form behaviour and give desktop a bounded, deliberate form composition. Align labels, errors, controls and review/submit states. Leave live uploads disabled until their security/storage contract is qualified.

### P03-5 — Submission reliability

Use one service per actual flow behind page actions/API consumers, truthful demo/live results, safe errors and duplicate-submit protection. Test invalid input, server outage, retries, step navigation, focus and reopening without real outbound delivery.

### Exit and handoff

Detail and each conversion flow have separate reviewed screenshots, synthetic end-to-end evidence and a list of retired style/runtime consumers. Card/detail/calculator finance values agree under the same terms. Keyboard/gallery/overlay/safe-area behaviour remains correct. Roll back the individual feature slice if data semantics or submission safety regress; do not hide the regression with different success text.
