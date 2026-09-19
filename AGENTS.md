# Dealer project: priselci

This is an independent personalized dealer copy. Canonical editable source is Cars clients/priselci/. The dedicated dealer repository is a publishing mirror. Make lasting fixes in canonical source or the versioned packaging layer and regenerate; preserve unmatched mirror fixes first. This copy is not a reusable template master.

Read local CLIENT.md and dealer.json (or their parent-directory copies), .client/project.json when present, and the relevant technical TEMPLATE.md. Shared policy: [Cars workflow](https://github.com/darkapoparka/cars/blob/b64156c9771a22a71d91da57b22b8caec576017f/docs/WORKFLOW.md) and [publishing](https://github.com/darkapoparka/cars/blob/b64156c9771a22a71d91da57b22b8caec576017f/docs/LEAD-PUBLISHING.md).

Preserve this dealer identity, exact repository/domain and offered designs. Apply sourced facts to real data modules; metadata alone does not change the application. Protect layout and interactions during an ordinary correction. Sample forms do not prove delivery. Audit requests are read-only; publication never authorizes outreach.

## Variant commands

### auto-best

Run from auto-best/. Node 22.12+ on the 22 line; npm/package-lock.json. Use an explicitly free port and verify its owner.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 6601 --strictPort
npm run check && npm run build
```

Published entry: /. Exact template identity is in .client/project.json.

### modern

Run from modern/. Node >=22.22.0 <23; pnpm 11.4.0; retain the whole workspace. Use an explicitly free port and verify its owner.

```sh
pnpm install --frozen-lockfile
pnpm --filter @repo/database build
pnpm --filter web exec next dev -H 127.0.0.1 -p 6602
pnpm --filter web typecheck
pnpm --filter web build
```

Published entry: /variant-2/cars. Exact template identity is in .client/project.json.
Read docs/QA.md for the static-demo environment before starting or building.

### carwow

Run from carwow/. Use the locked Node runtime; npm/package-lock.json. Use an explicitly free port and verify its owner.

```sh
npm ci
npm exec vite dev -- --host 127.0.0.1 --port 6603 --strictPort
npm run check && npm run build
```

Published entry: /variant-3/. Exact template identity is in .client/project.json.

## Verification

For affected designs check entry, inventory, a real detail, contact/enquiry destination, navigation/filter and menu dismissal at 390 and 1440 px. In a mounted preview test the actual design switcher, deep links, assets, back navigation and console; include 320 px for the switcher. Do not submit external test messages. Record exact commit, deployment, date and evidence; owner review remains separate from agent QA.
