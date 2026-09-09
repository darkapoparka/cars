# Plus Auto review — in-progress source checkpoint

These are expected local routes from the retained masters, NOT tested preview links. No server was started, no port is claimed available and no application QA passed in this session. Do not send this source-branded checkpoint to the dealer.

## Coordinator review

The working checkout remains the coordinator-owned J:/cars on main. Fetch this branch and inspect its diff before integrating; do not overwrite dirty work or launch another session in that checkout.

After deliberate integration, use the existing launcher from J:/cars:

```powershell
./scripts/start-client.ps1 -Client plus-auto-ruse -Prepare
./scripts/start-client.ps1 -Client plus-auto-ruse
```

Expected entries with the launcher's default trio ports:
- Auto Best: http://127.0.0.1:6631/ — clients/plus-auto-ruse/auto-best
- Modern: http://127.0.0.1:6632/cars — clients/plus-auto-ruse/modern/apps/web
- Carwow: http://127.0.0.1:6633/ — clients/plus-auto-ruse/carwow

Confirm listeners and physical working paths first. These URLs are instructions, not running services.

## Retained check commands — not run

Auto Best (Node 22.12+ in Node 22): `npm ci`; `npm run validate` in auto-best.

Modern (documented Node >=22.22.0 <23; pnpm 11.4.0): `pnpm install --frozen-lockfile`; `pnpm --filter @repo/database build`; `pnpm --filter web typecheck`; `pnpm --filter web build` in the full modern root. Retain static demo mode, set AUTOMARKET_PUBLIC_DATA_MODE=demo and distinct local NEXT_PUBLIC_WEB_URL/API_URL/APP_URL as the launcher does. Prisma generation is local only: no migrations or database provisioning. Do not run Next build and dev together.

Carwow (retained .nvmrc: Node 24): `npm ci`; `npm run check`; `npm run build` in carwow. Use the existing launcher rather than the inherited fixed-port dev wrapper.

Before claiming readiness: finish identity/content/assets, compare each application with its master at 390/1440 px, check 320px headers, catalogue/detail/contact, filters/reset/back state, gallery, menu dismissal/focus, images/overflow/console and enquiry destination without sending an external message.
