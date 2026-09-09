# CAR MAX / Modern — in progress

Full independent workspace copied from `templates/modern` at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`, version `2026.09.06-refresh-1`. Source-business content/media still require personalization. Do not deploy or send this checkpoint.

Use Node >=22.22.0 <23 and pnpm 11.4.0. From this directory: `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck`. Prisma generation is local; no database migration or provisioning is required. The public web application is in `apps/web`, entry `/cars`.

For isolated local preview use the documented static-demo environment in TEMPLATE.md with distinct client web/API/app origins; do not reuse another listener. Proposed web port 6632 has not been checked. Do not run a Next build and dev server against the same output directory.

No install, generation, typecheck, build or browser test has run for this copy. `.client/project.json` records current false QA flags. Source runbooks and TEMPLATE.md describe historical source work, not CAR MAX acceptance.
