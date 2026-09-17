# Native storefront migration status

The active storefront is native Svelte 5. The former HTML-string renderer and `.template-ref` kit are removed. The catch-all route only preserves historical dashboard redirects and returns normal 404s for unknown paths.

Current implementation ownership is documented in `docs/ARCHITECTURE.md`. Validation commands and evidence boundaries are in `docs/QA.md`. The September cleanup report is `docs/refactor-2026-09-12/REPORT.md`.

The original migration plan is retained at `docs/legacy/native-migration-plan.md` as historical evidence, not an executable backlog. Do not recreate its renderer, runtime DOM patching, raw template page union, or duplicate dashboard components.
