# NEXT CAR review commands

This checkpoint is incomplete: new media is not committed and Modern remains source-branded. These are reproducible commands, not evidence they were executed.

From J:/cars after the coordinator has inspected the branch and completed the remaining source/media work:

```powershell
./scripts/start-client.ps1 -Client next-car-banovo -Prepare
./scripts/start-client.ps1 -Client next-car-banovo
```

The default three entries are http://127.0.0.1:6631/ (Auto Best), http://127.0.0.1:6632/cars (Modern) and http://127.0.0.1:6633/ (Carwow). No listeners were started or availability claimed by this worker. Use the existing launcher only after confirming ports and ownership.

Auto Best: Node 22, npm ci, npm run validate from auto-best. Modern: retained Node 22 and pnpm 11.4.0, pnpm install --frozen-lockfile, pnpm --filter @repo/database build, pnpm --filter web typecheck, then the documented static-demo web build/launch configuration; no migration or live database. Carwow: Node 24, npm ci, npm run check, npm run build from carwow.

Representative future check routes: Auto Best /listing-grid, /listing-detail-v1/1, /about-us, /contact; Modern /cars and its actual listing/contact routes after personalization; Carwow /inventory, /inventory/porsche-cayenne-522888, /about, /contact. Check 320/390/1440 widths, actual image loading, filters/reset, return-to-list state, gallery, menu dismissal/focus and safe enquiry behavior. None of those checks is marked passed.
