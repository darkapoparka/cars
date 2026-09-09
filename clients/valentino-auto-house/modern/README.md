# VALENTINO AUTO HOUSE — Modern

Independent FULL Modern workspace copied from published master 2026.09.06-refresh-1. This checkpoint is in progress: source copying is complete; dealer personalization and verification are not yet complete.

Source commit: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca. Source tree: 66bfb8196bbce18832ada6b34b02dda97baba25b.

Retain apps/, packages/, pnpm-lock.yaml and pnpm-workspace.yaml together. Use the retained Node 22 requirement and pnpm 11.4.0. From this directory run `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, then `pnpm --filter web typecheck`. Start the public application from apps/web in the existing static demo mode; entry `/cars`. No live database, migrations, provider configuration, server or public preview is claimed.

See `.client/project.json`, `../CLIENT.md` and final `../REVIEW.md` when present. Source documentation is historical context, not current client QA or dealer approval.
