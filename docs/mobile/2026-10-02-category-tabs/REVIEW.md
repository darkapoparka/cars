# Mobile showroom category correction — 2 October 2026

Home retains the showroom header, search, native vehicle-category icon tabs,
horizontal quick filters and inventory. The row is Cars / Motorbikes / E-bikes /
Motorhomes / Trucks & more. Used/New condition choices are inside Filters.
Cars / Services / Contact remains the bottom navigation.

The category rail retains the original Search treatment: a full-width grey
baseline and a rounded orange active indicator, inset 2 px from each tab's edges.
Its 48 px height, 1 px baseline, 3 px indicator and 3 px rounded top corners match
the preserved `SearchScreen` styles. The saved native Search capture
`reference/android/02-search-cars.png` was inspected for comparison.

Category selection filters the actual stock and is retained in the URL. Each
category remembers its own search and make/model selections. Reset clears only
that category's filters. The native non-car make/model picker now updates the
same URL as the inventory. The sample catalog only contains cars, so the other
categories show empty inventory with a return to Cars. No stock was invented.

Canonical source: `L:/CODEX/cars/templates/mobile`, Cars `main`.
Local production preview: <http://127.0.0.1:6474/>.

## Verification

Node 22.20.0: lint, TypeScript, all 57 domain tests and the production build passed.
Build ID: `L_x-vn6lxVYOewIhSJwOw`.
The updated focused showroom suite passed 35 Chromium and 16 WebKit checks,
with no console or page errors. New checks cover all five categories, keyboard
tab selection, honest empty inventory, make/model snapshots, reload, navigation,
Reset preserving category and Used/New choices inside Filters. Existing checks
also cover quick filters, sorting, saved cars, contextual local enquiry drafts,
redirects, vehicle Back/Forward and inventory scroll restoration.

Chromium checks cover 320, 390 and 1440 px for Home, Services, Contact, Saved cars
and vehicle details; 320 × 480 filter/sort sheets; and simulated 200% text at
320 px. Representative 320/390/1440 px captures were visually inspected. The
in-app browser preview was refreshed to the updated production build, and its
computed rail and indicator geometry was checked against the Search styles.

See [verification.json](verification.json), [Home at 390 px](home-390.png),
[Home at 320 px](home-320.png) and [Filters at 320 × 480](filters-320-short.png).

This is local browser evidence. Dealer personalization, native-device parity,
template release selection and hosted deployment remain separate acceptance.
