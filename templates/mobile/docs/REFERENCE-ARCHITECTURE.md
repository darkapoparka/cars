# Architecture

## Source and routing

Canonical checkout: `L:/inspiration/mobile-de-app`. Next.js 16 App Router, React, TypeScript and StyleX remain the application stack. `src/app` resolves route/query parameters; `src/components` owns the native-style screens. Vehicle, message, gallery, checklist and dealer routes accept known fixture identifiers. `localReturnPath` only admits approved local return routes.

## Native data and visual references

`src/lib/native-data` contains Android resource definitions for car model groups, category make lists, conditional advanced filters, country labels and the checklist guide. `native-taxonomy.ts` selects the correct vehicle-class resource catalog. `native-filter-fields.ts` applies purchase/leasing, electric and condition-dependent visibility. `make-selection.ts` maintains independent include/exclude/model/variant criteria per make.

`catalog.ts` contains four local car fixtures, not the live marketplace. The X6 includes 20 captured photographs, 26 technical-data rows and 70 equipment entries. Other listing content remains incomplete. Counts reflect the actual local inventory.

`public/icons/native-vector` contains native-reference vectors. SVGs must remain UTF-8 XML; `qa:icons` checks both local decoding and actual browser image decoding. A 200 response alone does not prove a mask/image can render. No screen is a screenshot background.

## State ownership

`store.ts` owns first-write hydration, mutations and cross-tab synchronization through `useSyncExternalStore`; `persistence.ts` validates stored data. Browser key: `mobile-reference-v1`. Independent category filters, make-scoped selections, parked IDs/timestamps/notes, saved searches, followed dealers, remembered images, local drafts and preferences survive navigation.

`enquiry.ts` owns calendar/registration validation, dependency clearing, captured trade-in choices and time labels derived from captured opening hours. `EnquiryEditor` works on a temporary copy: only Add updates the parent enquiry state. Cancel leaves the previously applied values intact. Contact details and enquiry selections are not persisted or transmitted; Send stores only the message body as a local draft.

`Modal` uses native HTML dialogs and centralized reference-counted scroll locking. Cancel events stop at the topmost dialog so Escape cannot close a parent editor unexpectedly. `NativeChoicePage`, `NativeOptionSheet` and `CalendarDialog` provide the distinct observed selection presentations.

## Verification and service boundary

Run source checks before an immutable production-browser pass. Keep report timestamps and build identifiers together; `docs/PARITY.md` records current coverage and remaining gaps. The native account/marketplace backend, real seller contact, appointment scheduling, publication, finance, map, insurance and mobee services are not connected. A local demo or successful test is not proof of native authenticated parity.

## Make/model drafts

`model-picker.ts` isolates draft selection, mixed-family state and family variant propagation. `modelVariants` and `excludedModelVariants` preserve individual-model constraints without changing legacy generic variants. `native-taxonomy.ts` distinguishes repeated labels using internal leaf keys; human-facing summaries use `modelLabel`. `SelectedMakeList` renders included and excluded constraints separately. Removing a make clears its scoped maps, including from result chips. The picker has independent header/list/footer geometry and an accessible make-list scrollbar.

## Live-reference data additions

The catalog keeps stable base IDs and merges typed supplemental content from native-data/listing-details.json. All four galleries contain captured sets of 20/32/16/4 images. technicalData, features, technicalDiagrams and plain-text descriptions retain native evidence. financeMonthly is separate from monthly lease quotes; leaseTerms enables the observed buying/leasing detail presentation. DealerLogo uses the independent captured-dealer identity map. The public asset manifest is part of immutable release acceptance. Latest evidence: docs/audits/live-ui-20260928.
