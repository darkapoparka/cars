# Contact, Sell and Import presentation recovery

## Scope and source

Live template: `J:/cars/templates/auto-best`, development URL `http://127.0.0.1:6461`.

This corrects the rejected contact/map and Sell/Import presentation without resetting the template. The former click-to-load pin placeholder was introduced by the implementation pass. The template also lacked the newer Sell/Import entry segments present in the independent source reference. Those are separate issues; the homepage recovery did not cause both.

The original map markup was recovered from the pre-implementation snapshot. The newer Sell/Import entry structure was compared with the original source on M: and integrated selectively, not copied wholesale. No files on M: were changed.

## Restored presentation

- Real, lazy-loaded Google Maps iframe with the existing directions link. The contact location title and map share a white rounded container. The pin-only preview and extra show-map action are removed.
- Complete original generated Sell/Import scene images: SUV with coins/banknotes, and SUV with ship/transporter. The previous repeated support-object crops are removed. Homepage and desktop hero compositions remain unchanged.
- Mobile Sell: Sale/Trade-in segments, evaluation entry and How it works.
- Mobile Import: Link/Information segments, link field or vehicle-description entry, and How it works. Both primary entry rows are 44px and the two entry cards match in height at 320, 390 and 430px.
- Dark enquiry and How it works dialogs, using the existing scroll-lock and keyboard helpers. No white surround was added to the dialogs.

## Retained functionality

Whitespace/year validation, photo limits, draft retention, clipboard/share failure handling, finance handoff, existing responsive exports and shared configuration are retained. The source photo/brand/business data was not replaced. No new images were generated, no application dependencies were added, and no enquiry was sent.

Exactly five existing source files changed and one small help component was added. All other 100 existing source files matched the start-of-pass hashes, including the homepage All controls, YouTube component, PDP and financing components.

## Evidence

`J:/cars/runtime/auto-best-contact-recovery-20260912-062009/` holds the before-source backup, before/after captures, changed-file hashes and test logs. Use `after-verified/` and `chromium/` for successful captures; the initial `after/` attempt occurred during a compile error and is not passing evidence.
