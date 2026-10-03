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

Build output is `.next-review`; the template preview uses port 6474. Run lint,
typecheck, domain tests, a production build and focused browser checks at 320,
390 and 1440 pixels. Use `QA_URL` and `QA_OUTPUT` for copied browser suites.
Source-era reports are historical reference evidence, not acceptance of this copy.
Do not run historical one-shot patch scripts or wipe/restart the native AVD.

The preserved native reference is `de.mobile.android.app` 10.26 on emulator-5554.
Keep its data and other applications intact. Mobile does not enter the approved
release lock or dealer variants until its integration and release checks pass.
