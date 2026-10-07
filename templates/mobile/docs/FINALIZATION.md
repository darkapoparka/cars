# Mobile template: finalization and reuse

This is the Cars showroom master, maintained once under `templates/mobile`.
The standalone publishing repository is an immutable export of this source.
Preserve the reviewed design, the Next.js App Router, React, TypeScript, StyleX,
Node 22.x and the npm lockfile. Reopen engineering work for a demonstrated defect,
a required dependency patch, or an explicit product request.

## Dealer configuration

Edit `src/lib/showroom-config.ts` for the dealer's name, actual logo, verified
phone/email/address/directions/map, opening hours and social links. Existing
components continue importing `showroom` through `src/lib/showroom.ts`.
Set `contactPreview: false` and a stable `storageNamespace`, such as the dealer's
lowercase slug. The configuration validator runs during tests and builds;
personalized dealers cannot silently retain the standalone storage namespace or
example contacts. External destinations require complete HTTPS URLs without
embedded credentials. Browser titles and initial metadata use the same name.

All six browser-record keys derive from that namespace: app state, language,
Import draft, Sell draft, inventory return context and scroll-restoration intent.
Keep the namespace stable across renderer releases; changing it starts a distinct
local session. The default template uses `null` and retains every old key, so valid
existing saved data survives this update. New dealer instances never import the
template's drafts. Origin-sharing scripts can still access each other's storage:
namespaces prevent accidental mixing, not intentional access.

Replace the catalog's sample vehicles, captured finance/rating facts and all
unapproved donor-branded photos with verified dealer inventory/assets. Confirm
every offered service. Do not copy sample staff, testimonials or seller contacts
into a lead proposal. Existing provenance and historical reference screens stay
preserved; they are not a personalized dealer fact pack.

## Acceptance commands

From this template with Node 22.x:

```sh
npm ci
npm run check
npm start
```

In a second terminal, point the browser gate at that production preview:

```powershell
$env:QA_URL = 'http://127.0.0.1:6474'
$env:QA_OUTPUT = 'L:\CODEX\cars\runtime\mobile-final-review'
$env:QA_CAPTURE = '1'
npm run qa:architecture
```

Use one dev/production server per port and output directory. If the normal port
is already owned, pass an unused port to `node scripts/review-preview.mjs start`.
For concurrent work, verify a temporary exact-source export through Cars' source
utilities, then retire the verification package after retaining final evidence.

Required acceptance covers lint without warnings, strict source typechecking,
every domain suite, a production build, Chromium and WebKit, BG/EN at 320/390/1440,
all Services tabs, vehicle Details/Photos/Features, desktop menu/filter dismissal
and focus return, filtering, cross-tab saves/language, reload persistence, local
enquiry drafts, corrupt/denied/full storage, images and overflow. Application
enquiry POSTs must remain absent. Retain matched before/after renders for any
presentation-affecting change. A browser-emulated viewport is not physical-device
certification or owner visual acceptance.

The desktop menu handles Escape at the document boundary while open, including
Safari pointer clicks that leave focus outside the button. Keyboard opening,
Home/End, arrow wrapping and focus return are included in the same browser gate.

## Dependency review on 7 October 2026

Sharp is patched to 0.35.5 and the lockfile selects source-map-js 1.2.2 to address
[GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) and
[GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
Framework versions and the presentation system are retained.

The development-tool dependency `braces` has
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), with no
published patched version at this review. Its downstream audit entries affect
glob matching in the StyleX/Next development tools. Those tools process controlled
source paths here; do not expose them as an endpoint for untrusted glob patterns.
Do not downgrade Next or StyleX simply to satisfy `npm audit fix --force`.
Review the upstream patch when available. Production-only and full-toolchain
audit results must be reported separately and dated.

## Release boundary

This template retains honest local drafts. It does not deliver leads, submit
finance applications, publish listings or book appointments. Live intake requires
a separately accepted submission integration and verified dealer contacts.

The exact Cars source commit/tree/digest, test results, visual comparisons and
standalone mirror receipt identify the engineering freeze. They do not select
Mobile in `templates.lock.json`. The existing Cars release tool still excludes
Mobile: dealer-data collection/adaptation, `/variant-5` assets/routes, the shared
five-design selector and the versioned publisher need their own integration and
mounted/hosted acceptance. Use that existing workflow; do not bypass the lock or
replace the publisher with another generator. Existing dealer sites stay on their
accepted source until an explicitly requested, tested update.
