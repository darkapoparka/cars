# Compact Mobile cards and upright typography

4 October 2026. Showroom vehicle cards use one row of year, mileage and fuel
badges across inventory, Saved and related vehicles. Power and transmission stay
in the vehicle details. The badge row cannot wrap; exceptionally long future
values can truncate with their full text retained in the badge title. No resize
listener, state or dependency was added.

At 320px, all four sample inventory cards are 274.375px tall instead of 300.375px:
26px shorter with unchanged photo frames, padding, white surfaces and shadows.
At 390px the old five badges already fit on one line, so the card height remains
318.125px. [Measurements](card-surfaces.json) include the shared Saved and related
card views.

Below 700px, the existing `Mobile UI` alias now uses pinned local Inter v4.1
instead of Manrope. The former rounded Cyrillic treatment was a font choice;
the rendered text used normal font style. The replacement has upright Cyrillic,
including Bulgarian Ѝ/ѝ, and shares one family for Bulgarian/English labels,
vehicle names and prices. Existing sizes, weights and desktop font roles remain.

The binary is the reviewed Auto Best subset, copied without modification after
verifying SHA-256 `b13b7d28b8dac8d22e9d5411707ae293315c4fc31615b253914d06361947de90`.
It retains weight 100–900 and optical size 14–32 axes. The 234,852-byte file,
coverage/provenance manifest and OFL license are bundled under Mobile's
`public/fonts`. There is no external font service or new runtime dependency.

## Matched screenshots

Bulgarian, the same browser and filter, with matching viewport dimensions and
scroll positions. Before uses the existing production preview at 6474; after
uses the completed separate production build at 6478. The accepted local result
is subsequently served at 6474.

| View                          | Before                           | After                          |
| ----------------------------- | -------------------------------- | ------------------------------ |
| Inventory, 320 x 844          | [Before](cars-320-before.jpg)    | [After](cars-320-after.jpg)    |
| Inventory, 390 x 844          | [Before](cars-before.jpg)        | [After](cars-after.jpg)        |
| Price editor, 390 x 844       | [Before](price-before.jpg)       | [After](price-after.jpg)       |
| Services, 390 x 844           | [Before](services-before.jpg)    | [After](services-after.jpg)    |
| Contact, 390 x 844            | [Before](contact-before.jpg)     | [After](contact-after.jpg)     |
| Vehicle, 390 x 844            | [Before](vehicle-before.jpg)     | [After](vehicle-after.jpg)     |
| Related vehicles, 320 x 844   | [Before](related-320-before.jpg) | [After](related-320-after.jpg) |
| Desktop inventory, 1440 x 900 | [Before](desktop-before.jpg)     | [After](desktop-after.jpg)     |

[Saved at 320px](saved-320-after.jpg) confirms the same three readable badges.
The temporary saved vehicle was removed after inspection. The screenshot API
captures the browser's visible content region; the narrow comparison was
recaptured after a height mismatch, and paired image dimensions were verified.

## Validation

Node 22 source lint, TypeScript, formatting of touched files, all 91 existing
domain/localization tests and a production build of 51 routes passed.
[Browser checks](browser-checks.json) record 28 passing grouped checks in Chromium
and WebKit with no browser errors, covering Bulgarian/English at 320/390/1440px,
image rendering, overflow, focus, sticky controls, overlays and local enquiry
behavior. The existing suite now checks every rendered showroom card's three
badges for one row and complete readability in that route/viewport matrix.

Local source/browser verification does not establish native parity, release-lock
acceptance or dealer publication. Unrelated checkout work is preserved.
