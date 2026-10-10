# 02 — Stack, current documentation and upgrade policy

## Method

The manifest, lockfile and current source imports were inspected on 19 September 2026. Context7 was used for the three architecture-critical documentation families: SvelteKit state/data ownership, Tailwind v4 theme mapping/cascade and Bits UI dialog composition. Official documentation was also checked directly for Svelte effects/shallow routing/forms, adapter behaviour, testing, Zod, Drizzle/Neon, shadcn theming, Vaul and image output.

The table distinguishes **installed/locked** versions from **registry candidates** reported by `npm outdated --json` at audit time. “Latest” is not an implementation target by itself. Documentation at a project’s default URL may describe APIs newer than the installed version; check the installed package types and its release notes before using a new API. These observations will age.

## Dependency decisions

| Family                                     | Locked baseline                 | Registry observation at audit time                                 | Decision                                                                                                                         |
| ------------------------------------------ | ------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Svelte                                     | 5.55.9                          | 5.57.1 available in current range                                  | Keep Svelte 5; test a compatible patch update separately                                                                         |
| SvelteKit                                  | 2.61.1                          | 2.70.3 wanted/latest                                               | Keep Kit 2; security and runtime compatibility review first; an update is not proof of a zero-advisory tree                      |
| Svelte Vite plugin                         | 7.1.2                           | 7.3.0                                                              | Upgrade with a tested Kit/Svelte/Vite set                                                                                        |
| Vite                                       | 8.0.14                          | 8.3.0                                                              | Prioritize applicable Windows development-server advisories; keep loopback-only during QA                                        |
| Tailwind / Vite integration                | 4.3.0 / 4.3.0                   | 4.3.3 / 4.3.3                                                      | Keep paired versions; use CSS-first v4 configuration, not a v3 configuration rewrite                                             |
| TypeScript                                 | 6.0.3                           | Latest 7.0.2 is outside current range                              | Hold the major change until toolchain compatibility is proven; strict mode already exists                                        |
| Bits UI                                    | 2.18.1                          | 2.19.2                                                             | Keep accessible headless primitives; wrap only reusable product contracts                                                        |
| Vaul Svelte                                | 1.0.0-next.7                    | Registry `latest` is 0.3.2; wanted remains next.7                  | Do not automatically downgrade a prerelease line because a dist-tag says latest; verify peer compatibility and gesture behaviour |
| shadcn-svelte                              | 1.3.0                           | 1.7.0                                                              | Existing generated components are application-owned source; a CLI update does not safely regenerate them                         |
| tailwind-variants / merge / clsx           | 3.2.2 / 3.6.0 / 2.1.1           | 3.3.1 / 3.7.0 / no newer result                                    | Retain small helpers where used; test custom semantic utility conflicts                                                          |
| Lucide / Hugeicons / Tabler                | 1.17.0 / 4.3.2 + 1.1.5 / 3.44.0 | Lucide 1.47.0; Hugeicons core 4.3.4; Tabler 3.47.0                 | Consolidate consumers before considering updates/removal; preserve logos/artwork                                                 |
| Vitest                                     | 4.1.7                           | Wanted 4.1.11; latest major 5.0.1                                  | Review same-major security update first; do not combine test-runner major migration with visual refactoring                      |
| Playwright                                 | 1.60.0                          | 1.63.0                                                             | Pin browser/runtime set with the chosen version; create actual tests before treating installation as coverage                    |
| ESLint / TS ESLint                         | 10.4.0 / 8.59.4                 | 10.11.0 / 8.70.0                                                   | Preserve flat config, scope browser/server globals and incrementally adopt useful typed rules                                    |
| Prettier / Svelte plugin / Tailwind plugin | 3.8.3 / 3.5.2 / 0.7.4           | 3.9.8 / 4.1.1 / 0.8.1                                              | Keep formatting changes separate; plugin majors need compatibility checks                                                        |
| Zod                                        | 4.4.3                           | 4.6.5                                                              | Reuse Zod 4 at untrusted boundaries; do not add a second schema library                                                          |
| Drizzle ORM / Kit                          | 0.45.2 / 0.31.10                | No newer entries in this outdated response                         | Keep inquiry persistence contract; investigate tooling advisories without accepting a forced downgrade                           |
| Neon serverless driver                     | 1.1.0                           | No newer entry in this outdated response                           | Keep server-only, select transport/transaction semantics for actual needs                                                        |
| AI SDK / Svelte / OpenAI provider          | 6.0.197 / 4.0.197 / 3.0.68      | Wanted 6.0.286 / 4.0.286 / 3.0.114; newer major family also exists | Align the installed family, isolate optional admin capability, do not enable or call a provider during refactor QA               |
| Sharp                                      | 0.34.5                          | 0.35.4 outside current manifest range                              | Explicit security/codec upgrade review; regression-test active asset output before replacing files                               |
| adapter-auto                               | 7.0.1                           | No newer entry in this outdated response                           | Keep portability unless the supported release target warrants an explicit adapter; document the decision                         |

`@fontsource-variable/geist` is used by a route family while storefront tokens use local Sofia Sans assets. Fonts require a product/scope decision, not an accidental global font replacement. Existing font files must not be copied into public audit downloads.

## Documentation conclusions applied to this repository

**SvelteKit:** keep user state request-local on the server, return typed load data, use context for per-tree client state and use URLs for shareable filters. Existing garage context is a good example. Form actions remain a supported path for progressively enhanced forms; newer/experimental remote APIs are not a reason to rewrite every form.

**Svelte 5:** use runes deliberately, particularly derived values when route props change. An effect is appropriate for a real external side effect, not for copying state into another state variable. Retain cleanup for subscriptions, observers and event listeners.

**Tailwind v4:** regular custom properties own runtime/brand values; `@theme` defines utility namespaces. The existing `@theme inline` approach is appropriate for aliases to semantic custom properties. One utility pipeline and an explicit cascade are more important than converting every selector to a long utility string.

**Bits/Vaul:** the primitive already handles much of dialog focus and scroll behaviour. Build product wrappers around that contract rather than layering another general focus manager on top. Verify Vaul’s installed prerelease instead of assuming documentation for a different dist-tag is compatible.

**Testing:** Vitest projects separate execution environments; they do not create browser/component coverage automatically. Playwright screenshot assertions need stable browsers, fonts, viewport, data and rendering state. Screenshots require human review and must not be regenerated to hide a regression.

**Validation/storage:** Zod parsing belongs at untrusted boundaries. A database driver and ORM do not by themselves solve authorization, transactions, persistence of every feature, or deployment filesystem limitations. Keep runtime-mode checks independent of whether one database URL happens to exist.

## Official reference index

Reviewed references are deliberately linked to the owning projects rather than third-party recipes. Check these again during implementation.

| ID  | Reference                                                                                        | Relevant decision                                                  |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| S1  | [SvelteKit state management](https://svelte.dev/docs/kit/state-management)                       | Request-local state, context, URL versus ephemeral state           |
| S2  | [SvelteKit load](https://svelte.dev/docs/kit/load)                                               | Typed server/public data boundaries                                |
| S3  | [SvelteKit form actions](https://svelte.dev/docs/kit/form-actions)                               | Progressive form handling; no obligatory remote-function migration |
| S4  | [Svelte `$effect`](https://svelte.dev/docs/svelte/$effect)                                       | External effects and cleanup                                       |
| S5  | [SvelteKit shallow routing](https://svelte.dev/docs/kit/shallow-routing)                         | Overlay/history ownership without replacing router state           |
| S6  | [SvelteKit Vercel adapter](https://svelte.dev/docs/kit/adapter-vercel)                           | Deployment-specific verification, not portability assumptions      |
| T1  | [Tailwind theme variables](https://tailwindcss.com/docs/theme)                                   | Theme namespaces and inline mappings                               |
| T2  | [Tailwind functions and directives](https://tailwindcss.com/docs/functions-and-directives)       | CSS-first integration and stylesheet references                    |
| B1  | [Bits UI dialog](https://www.bits-ui.com/docs/components/dialog)                                 | Portal, focus and scroll ownership                                 |
| B2  | [Bits UI transitions](https://www.bits-ui.com/docs/transitions)                                  | Wrapper composition without duplicating the primitive              |
| B3  | [Vaul Svelte repository](https://github.com/huntabyte/vaul-svelte)                               | Installed prerelease compatibility and component ownership         |
| B4  | [shadcn-svelte theming](https://www.shadcn-svelte.com/docs/theming)                              | Semantic CSS-variable bridge for generated UI source               |
| Q1  | [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)                      | Deterministic screenshot comparisons                               |
| Q2  | [Vitest projects](https://vitest.dev/guide/projects)                                             | Server and browser test environment separation                     |
| Q3  | [typescript-eslint configuration](https://typescript-eslint.io/getting-started/)                 | Flat config and deliberate typed-rule adoption                     |
| D1  | [Zod basics](https://zod.dev/basics)                                                             | Safe parsing and typed boundary results                            |
| D2  | [Drizzle with Neon](https://orm.drizzle.team/docs/connect-neon)                                  | Serverless database integration choices                            |
| P1  | [Vite deployment guide](https://vite.dev/guide/static-deploy)                                    | Preview is not proof of production deployment correctness          |
| P2  | [Sharp output options](https://sharp.pixelplumbing.com/api-output/)                              | Explicit image output choices, not universal WebP conversion       |
| A1  | [W3C target size, minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)      | Minimum criterion versus a stronger product touch-target policy    |
| A2  | [W3C focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum) | Sticky headers, docks and overlay focus visibility                 |

Context7 library IDs used: `/websites/svelte_dev_kit`, `/tailwindlabs/tailwindcss.com`, `/websites/bits-ui`.

## Upgrade procedure

Capture the current lockfile and checks, inspect actual dependency paths, choose a coherent same-major family where possible, read relevant release notes, perform the upgrade in a separately reviewable change, then run type/lint/unit/build/browser tests. Review native-image output and Windows dev-server behaviour where applicable. Re-run both full and production-filtered advisory reports, but make the deployment exposure decision from the built artifact and enabled capabilities.

Never couple broad formatting, framework majors, component regeneration, a new theme and route deletion in one change. Never treat `npm outdated` absence as proof that a package has no maintenance or security risk.
