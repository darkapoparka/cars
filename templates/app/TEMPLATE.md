# App template contract

## Preserve the approved frontend

The committed primary design and the `/2` mobile alternative are the visual baseline. Preserve typography, spacing, artwork, card composition, borders, responsive breakpoints, sticky behavior and desktop layout. Use existing StyleX tokens and shared controls; do not introduce another styling system. Architecture-only changes must preserve rendered markup and style definitions unless a specific visible correction is approved and shown before/after.

The alternative journey is a route alias, not another independently maintained frontend. Home, inventory, saved, menu, search, selling, finance, service and store links stay within the selected journey. Vehicle details and enquiry content remain shared. Locale and mount handling must go through the existing routing boundary rather than hardcoded absolute URLs.

## Public dealer data

`dealer.json` contains public presentation configuration only, never CRM notes, private lead metadata, credentials or customer submissions. `dealer-inventory.json` is that dealer's stock. `dealer-import-inventory.json` holds separately sourced import opportunities. Do not substitute template examples when dealer data is missing. Keep import examples out of local stock and do not reinterpret or convert source prices by merely changing their currency label.

Respect `mode`, enabled/default locales, observed inventory facts, verified contact destinations and preview notices. Template demonstrations do not authorize real warranties, service-history claims, finance approval, reservations or purchases. Enquiry drafts are not completed submissions. Actual integrations need separately agreed validation, server-side handling, consent and failure behavior.

Saved/recent cars are browser-local. The original unmounted template keys remain compatible; dealer and mounted instances are isolated by mode, dealer ID and mount. `/2` and the primary journey intentionally share the same dealer shortlist. Unknown price, mileage or monthly values must not be presented as bargains by numeric filters.

## Code and verification

Use Node 22.x and the lockfile. `npm run check` is the common local/CI gate; do not remove meaningful checks to make a refactor pass. Keep domain contracts, routing policy and persistence rules independent of presentation. Full reference-detail snapshots remain outside client import graphs. Never duplicate application state into unrelated components when the URL or a shared store already owns it.

Exercise both journeys at 320 and 390 pixels and at desktop width. Check saved state, filters, back navigation, dialogs, enquiry drafts and supported locales. Test mounted paths before approving a generated client release. Capture screenshots before and after appearance-sensitive changes, and inspect console errors, broken images and horizontal overflow. A successful build or screenshot capture alone is not proof of visual or behavioral parity.

## Publishing and housekeeping

Cars `templates/app` remains the canonical generator source, and the standalone repository is a publishing snapshot. Reconcile standalone changes before exporting again. Preserve unrelated local changes; never reset a shared checkout, force-push, or roll out all dealers as part of a template cleanup. Approval and template-version pins belong to the existing Cars release workflow.

Keep current architecture, publishing instructions and asset provenance. Store temporary QA outputs under ignored `runtime/`; stop their processes and remove disposable compiler outputs after verification. Do not commit screenshots and logs for every polishing iteration. Historical captures, scripts and design notes remain recoverable from Git history; see `docs/HISTORY.md`. Do not delete public assets, inventory fixtures or `.template` recovery records as if they were disposable logs.
