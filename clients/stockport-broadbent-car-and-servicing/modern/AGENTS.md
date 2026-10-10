# Dealer project: stockport-broadbent-car-and-servicing / modern

This is an independent personalized dealer copy. Canonical editable source is Cars clients/stockport-broadbent-car-and-servicing/. The dedicated dealer repository is a publishing mirror. Make lasting fixes in canonical source or the versioned packaging layer and regenerate; preserve unmatched mirror fixes first. This copy is not a reusable template master.

Read local CLIENT.md and dealer.json (or their parent-directory copies), .client/project.json when present, and the relevant technical TEMPLATE.md. Shared policy: [Cars workflow](https://github.com/darkapoparka/cars/blob/70ecf182c266225b9413e59a4a402d9e8e2834a0/docs/WORKFLOW.md) and [publishing](https://github.com/darkapoparka/cars/blob/70ecf182c266225b9413e59a4a402d9e8e2834a0/docs/LEAD-PUBLISHING.md).

Preserve this dealer identity, exact repository/domain and offered designs. Apply sourced facts to real data modules; metadata alone does not change the application. Protect layout and interactions during an ordinary correction. Sample forms do not prove delivery. Audit requests are read-only; publication never authorizes outreach.

## Variant commands

### modern

Run from this variant directory. Node >=22.22.0 <23; pnpm 11.4.0; retain the whole workspace. Use an explicitly free port and verify its owner.

```sh
pnpm install --frozen-lockfile
pnpm --filter @repo/database build
pnpm --filter web exec next dev -H 127.0.0.1 -p 6602
pnpm --filter web typecheck
pnpm --filter web build
```

Published entry: /variant-2/cars. Exact template identity is in .client/project.json.
Read docs/QA.md for the static-demo environment before starting or building.

## Verification

For affected designs check entry, inventory, a real detail, contact/enquiry destination, navigation/filter and menu dismissal at 390 and 1440 px. In a mounted preview test the actual design switcher, deep links, assets, back navigation and console; include 320 px for the switcher. Do not submit external test messages. Record exact commit, deployment, date and evidence; owner review remains separate from agent QA.

The explicit locale contract is in localization/contract.json at the dealer root. These are source copies awaiting personalization and reviewed native adoption; no build, hosting or dealer QA receipt is created here.
