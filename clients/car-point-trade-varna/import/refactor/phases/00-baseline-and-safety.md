# 00 — Baseline and safety

**Status:** Planned — not implemented by this audit.  
**Findings:** F16–F21, F28.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** make changes measurable and prevent live capability from inheriting preview assumptions. No visual redesign in this packet.

### P00-1 — Record the exact starting point

Inspect current status/head and preserve the existing mobile edits. Capture route inventory, dependency versions, style/asset metrics and screenshots for the supported public reference set. Establish clean-install/build verification without overwriting another task’s preview output. Record environmental failures separately from application failures.

**Paths:** `package.json`, lockfile, `svelte.config.js`, `vite.config.ts`, `playwright.config.ts`, root instructions, `docs/QA.md`; evidence under this folder.

### P00-2 — Make checks explicit

Separate Prettier and ESLint reporting. Address the five baseline formatting failures and the unused `_active` binding in a small authorized cleanup rather than a whole-repo format. Retain the three existing unit tests and add browser test discovery with real smoke cases. Record/pin the runtime and required browser installation. Add a CI workflow with check, lint, unit, build and browser stages.

**Do not:** suppress existing errors globally or claim `verify` covers build/E2E while its script omits them.

### P00-3 — Characterize protected behaviour

Add tests/fixtures for mobile overlay back/focus/scroll, inventory URL aliases and detail return, representative card content, and current inquiry database failure behaviour. Capture a mobile no-JavaScript inventory case as a known regression to fix in Phase 02. Use mocked delivery and synthetic fixtures.

### P00-4 — Contain mode/provider risks

Introduce the minimum explicit server-side preview/live/capability validation. A key alone must not enable AI/delivery; missing required live auth/storage must not re-enable prototype access. Gate direct server endpoints as well as visible navigation. Keep disabled optional features disabled rather than building an entire production CMS in this phase.

**Paths:** `server/inquiry-config.ts`, `server/auth.ts`, `server/api-auth.ts`, relevant inquiry/auth/admin endpoints, especially `admin/copilot/chat/+server.ts`.

### P00-5 — Triage dependency advisories

Capture full and production-filtered reports, trace actual use and prioritize compatible security updates. Review Vite on Windows, framework/serialization, AI utility and image-processing exposure. No forced automated downgrade or unrelated framework major migration.

### Exit and handoff

A reproducible baseline, real test discovery, explicit check results, a configuration-matrix test and advisory disposition exist. Existing mobile work is unchanged except separately authorized fixes. Report any production/mounted environment still untested. Roll back a safety patch if it grants unintended access; do not restore unsafe live capability merely to make a demo work.
