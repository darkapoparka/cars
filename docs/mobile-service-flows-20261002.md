# Mobile showroom service flows — 2 October 2026

## Current behavior

Services retains the same white, branded header as Cars and now uses the same
search component below it. The existing underline rail shows **All / Import /
Sell your car**, with text instead of vehicle icons. Search finds offerings by
their title, description and keywords, including buyout/import terms, and keeps
the query in the URL. Selecting a service tab clears the catalogue search.

All includes the existing six offerings plus Import a car and Sell your car.
Financing and Parts remain ordinary offerings in All. Their existing
`/services?tab=financing` and `?tab=parts` URLs and contextual enquiry links are
retained; their detail views select All in the three-tab rail.

Import provides a make/model/budget form, optional year/listing link, and a sample
import gallery using the existing BMW 540 and X3 images. The gallery is a template
example, not a claim that this fictional showroom completed those imports.
Sell your car provides make/model/year/mileage fields, optional expected price
and condition, and a buyout/part-exchange enquiry summary. Both forms collapse
optional contact details and a note to keep the mobile layout shorter.

Forms validate inputs and save independent, versioned browser drafts. Saving
also prepares the matching Contact enquiry draft. Reload restores saved form
values; Import, Sell, general, vehicle, Financing and Parts drafts keep separate
contexts. No provider, submission, valuation calculation or finance approval is
connected. Unavailable/corrupt storage does not report a successful save.

The bottom bar now uses unmodified Google Material Symbols Rounded at 24px:
car, service grid and phone. The oval icon backgrounds are removed. Source URLs,
verified Git blob hashes and the Apache 2.0 license are retained in
`templates/mobile/public/icons/showroom/`.

Filters now uses the same 44px minimum height, 24px corner radius, grey fill and
selected styling as the other quick pills. The dark rectangular override is
removed. Cars/Services/Contact destinations and inventory filter/sort/Back
context are preserved.

## Implementation boundaries

- Service offerings and optional tab visibility: `src/lib/showroom-services.ts`.
- Request validation, bounded draft schema and summaries: `src/lib/service-requests.ts`.
- Forms and local draft handling: `src/components/ShowroomServiceRequest.tsx`.
- Shared search geometry: `src/components/ShowroomSearch.tsx`.
- Sample gallery: `src/components/ShowroomImportExamples.tsx`.
- Services layout: `src/components/ShowroomPages.tsx`.
- Navigation symbols: `src/components/ShowroomNavIcon.tsx` and `AppShell.tsx`.

Paths above are relative to the Mobile master at `templates/mobile`.
Dealer source, template release pins, registered Vercel projects and public aliases
were not changed. Mobile remains a local template candidate.

## Verification

Passed using the pinned Node 22.20.0 runtime:

- ESLint with zero warnings and TypeScript `--noEmit`.
- All 65 domain tests, including offering visibility, service search and legacy
  links, request validation, bounded decoding, draft isolation and summaries.
- Production build via `scripts/review-preview.mjs build`, final build ID
  `fo_tTRnD42YmWiVhjiT6-`.
- Formatting and `git diff --check`.
- Syntax check of the updated `scripts/qa-showroom.mjs` browser suite.
- HTTP 200 on port 6474 for Cars, Services, Import, Sell, Financing, Parts,
  buyout search, Import/Sell Contact contexts, all three new symbols and both
  sample gallery photos.
- Downloaded symbol hashes match the official upstream Git blobs.
- React review: semantic labels/fieldsets, keyboard-compatible native optional
  disclosure, focus on validation errors, primitive external-store snapshots,
  versioned local data and functional updates for batched field changes.
- `workspace-doctor.mjs --fetch`; unrelated source and independent repositories
  were preserved.

The first service-search implementation used a Unicode property escape that the
retained Next/Babel build could not compile. Replacing it with the combining-mark
range restored the live preview and production build without restarting the
server or clearing caches.

The browser suite now covers All/Import/Sell keyboard navigation, search recovery,
draft validation/reload/isolation, enquiry context, legacy service links and the
new routes at 320/390/1440px and 200% text. It was **not executed**: browser
automation remains blocked by the earlier local-URL policy rejection. No alternate
browser surface was used. Fresh rendered checks, before/after UI screenshots and
owner visual acceptance remain pending; source/build/HTTP checks do not establish
them. The dev server remains running on port 6474.
