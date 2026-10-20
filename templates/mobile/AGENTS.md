# Mobile template

The editable Mobile master belongs to Cars at `L:/CODEX/cars/templates/mobile`.
Follow [Cars instructions](../../AGENTS.md), [coordination](../../docs/COORDINATION.md),
and [template notes](TEMPLATE.md). The inspiration checkout remains a reference.

Retain Next.js App Router, React, TypeScript and StyleX. Use Node 22.x and the
retained npm lockfile. Keep filter/domain/storage logic separate from screens.
Preserve the copied native composition unless the owner requests adaptation.

This is a showroom candidate with Bulgarian and English UI and captured sample
listing facts. Some reference photos contain donor branding; personalize assets
and verified vehicle/contact data before dealer use. Do not connect
demo actions to real sellers, collect passwords, or imply that messages, finance
applications, appointments or vehicle publication were transmitted.

Build output is `.next-review`; the template preview uses port 6474. Follow
[proportional QA and retention](../../docs/QA.md): small edits use the existing
preview and the affected route/viewport; behavior changes add focused tests.
Run lint, typecheck, domain tests, a production build and relevant 320/390/1440px
browser checks at an integration/release checkpoint or when the change warrants
them, not after each small iteration. Reuse an owner-scoped `QA_OUTPUT` and
`QA_URL`; retire inactive generated outputs and intermediate captures at closeout.
Source-era reports are historical reference evidence, not acceptance of this copy.
Do not run historical one-shot patch scripts or wipe/restart the native AVD.

The preserved native reference is `de.mobile.android.app` 10.26 on emulator-5554.
Keep its data and other applications intact. The Cars release lock selects the
approved Mobile source for `/variant-5` in the six-design fleet. New source edits
require their own integration and release checks before lock promotion.
