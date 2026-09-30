# PDP content and mobile spacing verification

Verified locally on 2026-09-30 at `/bg/cars/2022-kia-seltos-lx-3696`, with English reflow also checked.

The final version follows the existing menu/filter patterns: compact rounded content controls, labeled specifications on white, a simple equipment section, and two 56px condition/service request rows. The accepted 140px mobile ownership banner and 53px purchase bar are retained. There is no phone section rail. The payment card has one continuous surface and one calculator action; the extra terms paragraph is removed.

Information / Exterior / Interior switch the content below the price card. Inline images open the selected photo and preserve the existing photo viewer. The equipment feature no longer appears as a condition heading. The equipment preview uses up to three classified items from the same captured equipment data as the full feature page; a generic condition highlight such as “Great condition” no longer substitutes for that list. Missing reports are presented as concise availability statuses, with their rows opening the existing enquiry draft.

## Final evidence

- `refined-top-390.jpg`: price/payment card and rounded content controls.
- `refined-details-320.jpg` and `refined-details-390.jpg`: specifications, equipment, and concise report rows.
- `refined-details-en-320.jpg`: English narrow layout.
- `refined-fortuner-320.jpg`: the same layout with the Fortuner's actual equipment preview.
- `refined-short-phone-320.jpg`: the final action clears the fixed purchase bar at 320×568.
- `refined-interior-inline-390.jpg`: category content within the PDP.
- `refined-desktop-information.jpg`, `refined-desktop-photos.jpg`, and `refined-tablet-768.jpg`: wider layout and content states.
- `verification.json`: observed viewport, focus, interaction, and contrast results.

The `before-*` images preserve the starting layout. The `after-*` images preserve the intermediate card-heavy pass that the owner rejected; they are comparison evidence, not the final styling. Final screenshots start with `refined-`.

## Checks

`npm run check` passed under Node 22.20.0: ESLint, TypeScript, and the production webpack build with 407 generated pages. The check used `.next-build-check` to preserve the running development output. Generated TypeScript configuration changes were recorded in ignored runtime evidence and restored to their exact pre-check contents.

In the in-app browser:

- 320px, 390px, 768px, and 1440px layouts checked. No horizontal document overflow observed. English was checked at 320px.
- Roving tab focus, ArrowLeft/Right, Home/End, wrapping, and Tab entry into the visible panel checked. Modified Home/End shortcuts retain normal document navigation.
- Inline category switching keeps the PDP URL. Selecting the second exterior image opens the second image of the five-image category. Escape restores focus to its trigger.
- Both purchase actions and the condition request row open the existing unsent enquiry draft. Escape restores focus. No message or booking was sent.
- Payment calculator opens by keyboard. Selecting three years and moving the deposit slider updates the illustrative amount; Escape restores focus to the payment row.
- Equipment navigation reaches the correct feature page, and Bulgarian search for `Круиз` filters to cruise control.
- Classified equipment previews checked on Kia and Fortuner: Kia shows cruise control, roof rails, and rear bumper spoiler; Fortuner shows front fog lights, cruise control, and rear parking sensors. English equipment reflow also checked at 320px.
- Text contrast sampled from rendered styles: spec labels and record statuses 6.05:1; spec values 16.24:1; selected content control 16.24:1; price note 5.60:1.
- No browser JavaScript errors observed. Development logs retain Fast Refresh and ownership-image LCP advice; no production performance or full WCAG certification is claimed.
- Desktop section navigation clears the booking panel: section bar ends at 200px and the sticky booking panel begins at 216px.

## Integration

Local working folder: `L:/CODEX/cars/templates/app`, within Cars `main`. `workspace-doctor.mjs --fetch` reported the parent Cars repository ahead 0 / behind 0 at the integration check. Shared HEAD was `807e2d6ee`.

Scoped commit/push is pending while `L:/CODEX/cars/.git/index.lock` is held. The lock was present at the final inspection, with nine unrelated staged paths unchanged. Do not remove the lock, reset, mass-stage, or create another master. Once the shared index is available, commit only the three PDP source files, `VehicleDetailTabs.tsx`, the two locale catalogs, and the three PDP QA directories, then push normally after rechecking main drift.

This is local App candidate polish. It does not select a template release, update dealer copies, or deploy a client.
