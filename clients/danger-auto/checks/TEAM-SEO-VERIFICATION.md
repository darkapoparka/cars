# DANGER AUTO — Carwow content checkpoint

Source commits: `6b35e33e68acae5de46fb664d355d19f850b370d` (FAQ/reviews) and `43a6ba1db28b38f9cded3ea287b66ccd216be548` (business contact and metadata). Overall client state remains **in-progress**.

## Executed checks

Working copy of the scoped files: `/mnt/data/session08-work/clients/danger-auto`. This was an independent runner, not the Windows Cars checkout. Node `v22.16.0`; preinstalled TypeScript `5.8.3`.

- `node checks/faq-review-contract.mjs`: exit 0, 12 assertions passed, none failed. Exact input hashes in `FAQ-REVIEW-RESULTS.json`.
- `NODE_PATH="$(npm root -g)" node checks/team-seo-contract.mjs`: exit 0, 28 assertions passed, none failed. The temporary global module path only located the runner's preinstalled TypeScript. Exact input hashes in `TEAM-SEO-RESULTS.json`.
- `tsc --project checks/tsconfig.content.json --pretty false`: exit 0, no diagnostics. Strict semantic checking of seven named data/metadata modules and their JSON input only; not the Svelte components or framework loader.

After installing the retained Carwow dependencies, the Node scripts locate its TypeScript package automatically. The equivalent local semantic check from `carwow/` is `npx --no-install tsc --project ../checks/tsconfig.content.json --pretty false`. This reproduction command is guidance, not a claim it ran here.

The source tests execute actual inventory/configuration modules. Component script parsing is TypeScript syntax checking only. Two inverse-patch checks restore the exact original component blob hashes; they are source-preservation evidence, not screenshots or visual acceptance. The upload hash check caught an extra CSS parenthesis before branch publication; that unreferenced candidate blob was not included in a branch commit. Published component hashes match the tested files.

## Route and content changes

The existing staff listing/detail components retain their markup, grids, typography, controls and breakpoints. Their only style changes prevent business-identity artwork from being cropped. One clearly identified business contact replaces fictional staff and portraits. Five legacy profile addresses resolve to that same contact, not additional employees. Actual HTTP/prerender behavior is not browser-tested.

The original 21 public metadata entries remain, with a canonical `/team/showroom-contact` entry added. Titles, descriptions and vehicle metadata identify DANGER AUTO, distinguish seller claims from independent verification, and do not promise enquiry delivery or in-house finance. Unsupported reviews are empty data, not invented testimonials. Other review/rating consumers still need a complete rendered sweep.

## Not executed or completed

No lockfile installation, full Auto Best validation, Modern Prisma/web typecheck/build, Carwow Svelte check/build, HTTP route test, or browser inspection at 320/390/1440 pixels was performed in this checkpoint. No local server was launched. Final logo/favicons and permitted local stock imagery are still missing. No successful image-generation output is claimed. Modern consumers, remaining supporting pages, copied exclusions and full-app metadata need further review. All per-app visual/identity/contact QA flags remain false; no dealer approval, deployment or message delivery is implied.
