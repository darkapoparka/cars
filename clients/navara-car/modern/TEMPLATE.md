# Modern — Navara Car copy

Template key: modern. Version: 2026.09.06-refresh-1.
Source: templates/modern at a3b9ec746fd2ff4f7fa075021afc90be5ff9f302 in darkapoparka/cars.
Source tree: 66bfb8196bbce18832ada6b34b02dda97baba25b.

The actual complete Next.js workspace was copied as independent Git files. Source TEMPLATE.md and historical provenance remain available at the source commit. Source QA does not apply to this copy.

Retain Node >=22.22.0 <23 and pnpm 11.4.0. Install at this workspace root with pnpm install --frozen-lockfile. Generate the retained Prisma client with pnpm --filter @repo/database build; this does not require provisioning a database. Check with pnpm --filter web typecheck and pnpm --filter web build. Start from apps/web with pnpm exec next dev --hostname 127.0.0.1 --port 6602. Entry: /cars. Read ../HANDOFF.md for the static-preview environment and distinct origins; no production integrations are configured.
