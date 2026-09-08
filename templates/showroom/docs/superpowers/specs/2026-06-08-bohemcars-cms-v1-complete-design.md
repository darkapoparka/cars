# Bohemcars CMS v1 Complete Design

## Goal

Turn the current Bohemcars admin area into a believable small-dealership CMS and operating workspace, while preserving Auxero public-page fidelity and keeping all public inventory rendering compatible with the existing template.

## Scope

This design covers the first completion slice:

- Inventory command center
- Vehicle editor UX polish
- Media and publishing workflow
- AI Copilot hooks tied to inventory quality

CRM/import/user/settings polish is intentionally next-slice work. Those pages should continue to function, but the inventory spine must become complete first because public listings, leads, imports, and Copilot summaries all depend on it.

## Product Model

Bohemcars is not a generic blog CMS. It needs a focused dealership operating system:

- Staff create or import vehicle records.
- Each record moves through an operational status flow.
- The CMS flags incomplete listings before publishing.
- Media and documents are attached to listings with clear validation.
- Published listings appear on the public Auxero inventory/detail pages.
- Leads and imports can reference real vehicle records.
- The Copilot can audit live CMS state and draft dealership-ready copy.

## Status Workflow

The listing status flow should be:

```text
draft -> intake -> media_ready -> published -> reserved -> sold -> archived
```

Rules:

- `draft`: record exists but is not ready for public display.
- `intake`: vehicle is being inspected or entered.
- `media_ready`: specs are mostly complete and media is ready.
- `published`: visible on public inventory/detail pages.
- `reserved`: visible but should signal pending/reserved in admin state.
- `sold`: retained for reporting and audit, not shown as active stock.
- `archived`: hidden from normal admin and public inventory views.

Current records using only `draft`, `published`, or `archived` remain valid. New UI should introduce the richer statuses without breaking existing persistence.

## Inventory Command Center

The admin inventory page should become the core workspace:

- Summary cards for live, draft/intake, reserved/sold, and incomplete records.
- Search over title, brand, model, VIN, stock number, fuel, transmission, location, and price.
- Status filter pills for all workflow states.
- Table rows with thumbnail, vehicle identity, status badge, source, completeness score, media count, price, updated date, and actions.
- Actions for edit, public preview, duplicate, publish/unpublish style status changes, mark sold, and archive when allowed.
- Archived records stay available only when filtering archived.
- Static Auxero inventory records remain read-only except for edit/preview affordances that do not imply durable CMS ownership.

## Completeness Model

Create a shared server-side helper that evaluates each admin inventory row:

- Required identity: title, brand, model, year, VIN or stock number.
- Required specs: body type, fuel, transmission, mileage, engine, color.
- Required commercial data: price label or numeric price, location.
- Required content: description and at least three features.
- Required media: preview image and at least three gallery images.
- Optional but recommended: source URL and documents.

The helper returns:

- `score`: 0-100
- `level`: `blocked`, `needs_work`, `ready`, or `complete`
- `missing`: string list
- `warnings`: string list

The Copilot, inventory table, editor sidebar, and tests must use this same helper.

## Vehicle Editor UX

Keep the current shadcn-svelte tabbed editor, but make it operational:

- Sticky save bar with Save draft, Save changes, Publish/Move status, and Preview when available.
- Right sidebar showing status, source, updated date, completeness score, missing fields, media counts, and document counts.
- Publishing tab explains concrete blockers using the shared completeness helper.
- Media tab shows existing preview image, gallery thumbnails, and documents before upload inputs.
- Features tab keeps checkbox shortcuts but also supports custom newline features.
- Fields stay bound with Svelte 5 runes and no legacy `on:` syntax.

## Media Workflow

Current upload handling is enough for v1 storage, but the admin UI needs better control:

- Staff can see existing preview image, gallery images, and uploaded documents.
- Staff can upload additional gallery images and documents.
- Staff can select an existing gallery image as preview without re-uploading.
- Staff can remove gallery images and documents from a CMS-owned listing.
- File validation remains server-side.
- Uploads stay under `static/uploads/cms/...`.

Deletion should remove references from the JSON record. Physical file deletion can be best-effort, but must never delete outside `static/uploads/cms`.

## AI Copilot Integration

The chat page stays admin-only. Inventory editor and command center can link to Copilot prompts:

- Audit incomplete listings.
- Draft description from current listing specs.
- Generate daily CEO snapshot.
- Summarize lead/import queues.

The Copilot must never expose secrets and must use only CMS context.

## Data Boundaries

- Durable local JSON persistence remains the v1 source of truth.
- Public Auxero data shaping stays in `src/lib/auxero` or `src/lib/server`.
- Public vehicle cards and pages remain Auxero-faithful.
- Admin pages can use shadcn-svelte.
- No global `.btn` or `.container` overrides.

## Tests

Add or extend tests for:

- Completeness scoring.
- Status filter/search behavior.
- Duplicate/archive/status transitions.
- Media removal and preview selection.
- Public inventory only showing valid published records.
- Copilot fallback using the shared completeness helper.

## Verification

For edited Svelte files:

```bash
npx @sveltejs/mcp svelte-autofixer <file>
```

Then run:

```bash
npm run check
npm run lint
npm run test:unit -- --run
npm run build
```

Browser verification should cover:

- `/admin/inventory?role=admin`
- `/admin/inventory/new?role=admin`
- `/admin/inventory/edit/<id>?role=admin`
- `/admin/copilot?role=admin`

## Self-Review

- No placeholder requirements remain.
- The design is limited to the inventory/CMS spine and does not attempt full CRM rebuild.
- The status workflow and completeness helper are shared, testable, and compatible with current data.
- Public Auxero fidelity rules remain explicit.
