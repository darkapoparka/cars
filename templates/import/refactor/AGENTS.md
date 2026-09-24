# Refactor execution instructions

This file applies to this `refactor/` documentation subtree. Its implementation guidance must be explicitly read when working on the application; placing an `AGENTS.md` here does **not** automatically give it scope over `src/`. The repository-root `AGENTS.md`, `TEMPLATE.md` and `docs/CARS-INTEGRATION.md` remain authoritative.

## Scope and authority

The initiating request authorizes an audit and written plan. Unchecked tasks are not authorization to rewrite application code, migrate databases, enable paid providers, contact leads, commit, push or deploy. Obtain the relevant implementation instruction before executing a phase. Preserve the current owner’s mobile work and existing untracked files.

Use the existing `main` checkout. Do not create another branch or Git worktree unless explicitly requested. One task owns application writes and generated build output at a time. A temporary audit copy is not a release source or a new worktree. Do not overwrite an existing running preview’s output to obtain a convenient test result.

## Start of an implementation task

Read the relevant phase and its linked design/data/security contracts, not every historical audit. Inspect `git status`, the current head and the working-tree diff. Re-check current dependency documentation when changing APIs; this audit is dated, not a permanently current version catalogue. Record which files are already dirty. Never stash, reset, format or delete another task’s work to obtain a clean tree.

Choose one work packet and state its boundaries. Establish the appropriate baseline tests and screenshots before editing. A failing existing check must be distinguished from a new regression; do not suppress a rule or weaken an assertion simply to make a task pass.

## Implementation rules

- Prefer the existing SvelteKit application and existing primitive libraries. Do not introduce a monorepo, design-system package, generic configuration renderer, service locator, event bus or replacement state library for this refactor.
- Share semantic tokens, domain behaviour and actual repeated interactions. Do not force desktop and mobile into identical markup, or make all controls the same size.
- Keep the current mobile control, drawer, navigation and card patterns until a deliberate, reviewed replacement has demonstrated parity. No extra eyebrow labels, duplicate headings, filler count rows, decorative red rules or unsolicited replacement imagery.
- Do not add route selectors that reach into another component’s internals. Temporary compatibility rules require an owning route, removal task and test. A new `!important` outside a documented accessibility/compatibility exception needs review.
- Use `$derived` for derived values; use effects for external side effects with cleanup. Keep request/user state out of shared server module state. Keep private credentials and database access in server-only modules.
- Use the existing role-based control hierarchy. Preserve compact metadata, readable input labels, large useful imagery and the price/monthly-payment hierarchy.
- Use synthetic fixtures and mocked delivery in tests. Do not use real phone numbers/email addresses as recipients, send live inquiries, upload private files or make paid AI requests during QA.
- A missing reference in one grep is not proof of dead code. Check routes, globs, raw HTML, CSS URLs, generated assets and Cars packaging before deletion.

## Required handoff

Report the work-packet ID, changed paths, retired paths, commands and exact outcomes, routes/widths inspected, remaining failures, owner-review items and any compatibility adapter still needed. Include before/after screenshots for visible changes. Say explicitly when a build, browser, mounted path, delivery provider or security condition was not tested.

A task is complete only when its exit criteria are met or a specific blocker is recorded. Do not label the application “perfect” or certify all accessibility/security/performance properties from a narrow test. Do not update reference screenshots to accept an unexplained difference.

## Documentation maintenance

Keep finding IDs stable. Close findings with evidence rather than deleting their history. Update the relevant phase status and verification record when work actually happens. Avoid duplicating the same acceptance criteria across new documents. Changes to global rules belong in the root instructions only through a separate, deliberate edit.
