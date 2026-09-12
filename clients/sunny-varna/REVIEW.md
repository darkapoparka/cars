# СЪНИ — source implementation checkpoint

2026-09-09 follow-up: the owner will run runtime and browser tests locally. The three full independent template applications now exist. This first source-copy checkpoint is **in-progress**, not completed personalization. Retained master UI, components, routes, responsive styles, package manifests and lockfiles; Modern includes all apps and workspace packages. No deployment or shared-origin/FAB integration.

## Local review after personalization

From the coordinator's Cars checkout, after reviewing/fetching this branch into the coordinator's chosen isolated review location:

```powershell
./scripts/start-client.ps1 -Client sunny-varna -Prepare
./scripts/start-client.ps1 -Client sunny-varna
```

Do not switch or overwrite a dirty shared checkout. The launcher checks its selected ports; no listeners have been started by this cloud session.

Expected local entries (not yet exercised):
- Auto Best: http://127.0.0.1:6631/
- Modern: http://127.0.0.1:6632/cars
- Carwow: http://127.0.0.1:6633/

Retained checks: Auto Best `npm ci` then `npm run validate`; Modern Node >=22.22 <23 / pnpm 11.4.0, `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck`, `pnpm --filter web build` in documented local static-demo environment; Carwow Node 24, `npm ci`, `npm run check`, `npm run build`. None is claimed run here. Details and local-only environment guidance remain in each retained TEMPLATE.md.
