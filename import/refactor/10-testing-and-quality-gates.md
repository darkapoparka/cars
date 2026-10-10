# 10 — Testing, accessibility and quality gates

## Existing baseline

The current three tracked unit-test files contain 14 tests. Type checking passes. The audit found five Prettier failures and an independent ESLint error in `CalculatorEstimator.svelte`. Playwright test discovery reports zero tests. No tracked CI workflow was found. Exact command outcomes and environmental limits are recorded in [verification](evidence/verification.md).

Do not confuse a configured test runner with tests, or a successful compile with a coherent design. Keep the current inquiry/authorization tests and add coverage around the behaviour being migrated.

## Test pyramid appropriate to this application

| Layer              | Required coverage                                                                                                      | Avoid                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Pure unit          | Query parse/serialize, facet dependencies, sorting, normalization, finance, configuration validation                   | Mounting a complete page to test arithmetic or alias parsing            |
| Component/browser  | Buttons/links, tabs, filter trigger/content, drawer focus/scroll/history integration, card variants, form error states | Testing only internal variable values instead of user-visible behaviour |
| Server integration | Authorization per operation, demo/live mode matrix, validation, storage/delivery failure, uploads and idempotency      | Real credentials, paid provider calls or live customer records          |
| End-to-end         | Supported routes, transitions, URL state, detail return, form completion with mocks, mobile navigation                 | One enormous happy-path test that conceals which contract failed        |
| Visual             | Approved reference surfaces and high-risk states under stable rendering                                                | Blanket screenshot regeneration or an unrestricted pixel threshold      |

Use the existing Vitest and Playwright stack. Add the minimum browser/component test support needed; a separate Storybook/design-system service is not a prerequisite. Keep fixtures isolated from production routes and data. Prefer role/name locators and stable user contracts over brittle DOM selectors inherited from Auxero.

## Tiered browser matrix

**Every visible change:** reference route at 390px and 1,440px; relevant keyboard, focus and interaction state; compare against the protected mobile baseline.

**Every shared-shell/token release:** home, inventory, detail, import, sell, financing and contact at 390/1,440; targeted overflow/layout checks at 320, 430, 767/768/769, 1,024, 1,280 and 1,920. Check 991/992 where current layout rules still use that boundary. Test long labels/content and 200% zoom. Do not run every route × every state × every width without a reason; target the shared contract and its exceptions.

**Release qualification:** supported secondary public routes, retained account/admin surfaces with synthetic authenticated roles, canonical/raw redirects, 404/error states, Bulgarian/English, Chromium plus relevant WebKit/Firefox cases, and the separate mounted Cars matrix. The first two tiers do not replace this release pass.

## Required interaction cases

Inventory: URL round trip; repeated/malformed/legacy parameters; single/multiple filters; dependent model clearing; zero results; stale count response; sort/view changes; load-more; hard refresh; back/forward; detail-return scroll and revealed count.

Overlays: open with pointer/keyboard; initial focus; tab containment; Escape; outside interaction policy; browser back once; nested opening; route change while open; scroll lock; valid focus restoration; missing descriptions; long options; virtual keyboard and safe area.

Forms: empty and invalid values; phone-only/email-only according to schema; review/step navigation; preserved values after error; duplicate submit; offline/unavailable service; retry; correct demo versus durable success copy; authorized/unauthorized uploads; no real delivery side effects.

Cards/detail: missing/long facts; absent price/finance; image loading/error; gallery keyboard/close; action/link separation; reserved/sold states; consistent formatting across pages; sticky actions do not cover focus.

## Accessibility acceptance

Use semantic landmarks, a correct heading hierarchy, labelled controls, meaningful errors and keyboard-accessible navigation. Shared icon actions need accessible names. Popovers/dialogs need the appropriate primitive semantics rather than merely matching their visual shape.

Check actual focus visibility and scroll position beneath sticky headers and bottom bars. Preserve focus when a filtered list changes. A focus-ring rule is not enough if the focused item is obscured or removed. Test text zoom/reflow, reduced motion, contrast for every semantic surface, long translated labels and non-colour state cues.

The product prefers generous mobile hit areas without enlarging every visible badge/control. Measure target boundaries and spacing; do not infer conformance from the glyph size. Automated accessibility checks are useful but do not establish full conformance without keyboard and assistive-technology review.

## Visual baseline discipline

Pin the chosen browser version, operating-system environment, viewport, fixture data, locale, fonts and motion policy. Wait for the intended rendered state and required images/fonts rather than using an arbitrary long timeout. Mock volatile remote assets where necessary while retaining a separate real-asset smoke check.

Store screenshots as regression references only after human review. Record the reason for every accepted change. A narrow mask for a genuinely volatile value is acceptable; masking the whole toolbar/gallery to stop failures is not. The exploratory installed-Chrome audit is not a pinned CI golden baseline.

## CI and command contract

Retain `npm ci` and the lockfile. Split format checking from ESLint so both report independently. Preserve `svelte-check`, unit tests and production build, then run the supported browser suite with the appropriate installed browsers. `verify` must either include the full intended gate or be named/documented as a narrower local check.

A proposed CI sequence is:

```text
npm ci
npm run check
format check and ESLint as separately reported steps
npm run test:unit -- --run
npm run build
install the pinned Playwright browsers for the CI operating system
npm run test:e2e
collect test reports, traces, relevant screenshots and asset-size reports
```

These are target responsibilities, not new scripts already implemented by this audit. Ensure server startup/teardown, synthetic environment variables and port ownership are deterministic. Do not reuse an unrelated running server in CI. Preserve useful failure artifacts without uploading secrets, local CMS contents or private documents.

## Refactor ratchets

For migrated routes, prohibit new imports from the legacy template/runtime layer, new route-qualified child styling and unapproved hardcoded brand values. Track remaining consumers and important/global counts, but review their meaning rather than setting an arbitrary repository-wide count target.

Establish initial JS/CSS/load-data measurements after a successful clean production build. No unexplained regression above the agreed budget; exceptions require a visible trade-off decision. Check required token resolution, duplicate active IDs, active stylesheet owners and initial content with JavaScript disabled.

## Release gate

All relevant automated checks pass; every supported route family has its representative visual/interaction evidence; mobile regressions are rejected; live capabilities have passed mode/auth/storage tests; cleanup has reachability proof; two-brand qualification passes; mounted Cars QA is separately complete; and the owner approves the desktop/mobile result. Record any deferred capability as disabled or explicitly limited, not silently “done.”
