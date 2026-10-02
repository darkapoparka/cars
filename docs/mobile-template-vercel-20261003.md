# Mobile showroom test deployment

Published 3 October 2026 (Europe/Sofia) for the owner's phone testing.

- [Home](https://cars-template-mobile.vercel.app/)
- [BMW X6 PDP](https://cars-template-mobile.vercel.app/vehicle/bmw-x6)
- [Private GitHub publishing mirror](https://github.com/darkapoparka/cars-template-mobile)

## Source and hosting

The editable master is `L:/CODEX/cars/templates/mobile` in
`darkapoparka/cars`. The hosted snapshot was exported from Cars commit
`e673d0313f85064c51200d9d6090c590e7a4f950`, subtree
`0643a9a67cd352e60e1d26aec2ebfd3614324294`.

The existing `exportCommit` and `fingerprintCommit` utilities from
`scripts/lib/workflow.mjs` produced and checked the payload under the
`cars-source-v1` policy. Its normalized digest is
`873218f02c504f076be6cc8aba5cb0560b5e059c5a0899d3fadee99b1cdd4ba9`.
The export contains 685 source files totaling 22,765,403 bytes. Dependencies,
builds, caches, generated Next configuration, donor credentials and native
reference captures are excluded. A `.cars-template-source.json` receipt is the
686th publishing file.

The private publishing repository is `darkapoparka/cars-template-mobile`,
GitHub repository ID `1402374380`. Its initial `main` commit is
`9322e02b8d1356e1096081da93f61b895274fba7`. The repository is an export mirror;
future product edits belong in the Cars master and must preserve mirror history.

Vercel project `cars-template-mobile`, ID
`prj_PsCXLysg0t3owguVyrnnXQXa7x1r`, belongs to team `tyj` (`tyj5`). It builds
the repository root as Next.js on Node 22.x with `npm ci` and `npm run build`.
The connected production branch is `main`.

One Git-source production deployment was requested at the publishing commit:
`dpl_9NCqQ4htdoZ9oBqWfAgXz5D4XgKQ`. Vercel reports `READY`; its provider Git
source SHA and GitHub commit SHA both equal the publishing commit above. The
immutable deployment hostname is
`cars-template-mobile-3ox00itdg-tyj5.vercel.app`, and the public alias is
`cars-template-mobile.vercel.app`. No deployment-protection settings were changed.

The existing `darkapoparka/cars-app-mobile` repository and Vercel project contain
the separate AutoMarket marketplace app. They were inspected to establish
ownership and preserved. This showroom preview has its own repository/project.

## Verification

The deployed source previously passed TypeScript, ESLint, formatting and 86
domain tests. Its local production build generated all 50 static pages. The new
Vercel Git build completed successfully as the `READY` deployment above.

Unauthenticated HTTP HEAD checks on the public alias returned 200 without a
redirect for Home, `/vehicle/bmw-x6`, its gallery with `returnSection=photos`,
`/services?tab=import`, `/services?tab=sell` and `/contact?vehicle=bmw-x6`.

Focused checks in the Codex in-app browser used the deployed HTTPS origin:

- At 390px, Details / Photos / Features switched their content and URL section.
  The information tab rail and compact price/enquiry bar appeared while the
  lower content was in view.
- Inline photo opening displayed the full-screen viewer. Next advanced to photo
  2; browser Back closed it, Forward reopened photo 2, and Escape closed it with
  focus restored to the original photo button.
- The technical-data dialog opened at 390px and 320px. Its inner table scrolled
  to the last rows while Close remained visible. Escape and Close restored focus
  to the technical-data opener.
- At 320px, the PDP tabs measured approximately 96.33px each in a 289px rail.
  Services All / Import / Sell measured approximately 101.67px each in a 305px
  rail. Both groups fit their available width with three equal columns.
- The 320px Make & model overlay selected BMW, expanded X Series and selected X6.
  Show 1 car applied the selection. Opening that car, switching to Photos and
  using the PDP Back action retained the filtered inventory URL and one result.
- Home search opened the unified editor at its focused search field. Escape
  dismissed it and restored the search trigger.
- At 390px, Germany filtered the illustrative import gallery. Import opened its
  enquiry overlay; moving from Car to Details retained Germany as the country.
  Escape returned to the starter. Temporary make/model test values were cleared.
- At 320px, Sell opened its enquiry overlay. Browser Back closed it and restored
  the starter's focus. No enquiry was submitted.
- At 1440px, the PDP and its inline three-column photo grid rendered. No warnings
  or errors were captured in the inspected browser flow. The temporary viewport
  override was reset, and the live PDP was left open for the owner.

Screenshots and filtered delivery receipts are retained under the ignored
`runtime/mobile-vercel-20261003/` directory, including `screenshots/` and
`public-route-checks.json`. The existing localhost browser suite was not executed;
its earlier inspection restriction remains recorded in
[the PDP implementation report](mobile-pdp-browser-sections-20261002.md).
The public deployment was tested through its own HTTPS origin.

These are focused hosted browser checks. Real-phone Safari/Chrome, software
keyboard and touch/zoom behavior, WebKit automation and the owner's visual
acceptance remain pending. Sample inventory, captured finance facts and local
enquiry drafts retain their existing preview disclosures.

## Scope

`node scripts/workspace-doctor.mjs --fetch` refreshed repository evidence before
and after deployment. Cars had no ahead/behind drift at the fetched checks;
unrelated template/client drafts and independent Admin divergence were preserved.
No Mobile product-source commits intervened after the exported snapshot during
deployment verification. The subsequent hosting documentation changes do not
alter the hosted product behavior.

Mobile remains a library candidate. No template lock was promoted, dealer copy
refreshed, public outreach sent or other Vercel project redeployed.
