# Bohemcars CMS v1 Complete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Bohemcars inventory CMS spine so staff can manage listings through status, completeness, media, publishing, and Copilot workflows.

**Architecture:** Add one shared server-side inventory quality/workflow module, expose its output through admin CMS row shaping, then update inventory and editor admin pages to consume that shared data. Keep durable local JSON persistence as the v1 backend and preserve public Auxero rendering boundaries.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Tailwind 4, shadcn-svelte, local JSON persistence, AI SDK Copilot fallback helpers, Vitest.

---

## File Structure

- Create `src/lib/server/cms-workflow.ts`: status options, status transitions, completeness scoring, media helpers, duplicate payload helpers.
- Modify `src/lib/server/admin-cms.ts`: attach workflow/completeness metadata to `AdminInventoryRow`.
- Modify `src/lib/server/inventory.ts`: add duplicate, status update, preview selection, gallery removal, document removal helpers.
- Modify `src/routes/admin/inventory/+page.server.ts`: richer status filters and command actions.
- Modify `src/routes/admin/inventory/+page.svelte`: command center UI.
- Modify `src/lib/components/admin/AdminListingEditor.svelte`: editor sidebar, media previews, publish checklist, sticky save actions.
- Modify `src/routes/admin/inventory/edit/[id]/+page.server.ts`: parse media/publishing intent.
- Modify `src/routes/admin/inventory/new/+page.server.ts`: support richer statuses.
- Modify `src/lib/server/admin-copilot.ts`: use shared completeness helper.
- Test `src/lib/server/cms-workflow.spec.ts`: completeness and status rules.
- Extend `src/lib/server/cms-persistence.spec.ts`: media removal/preview selection/duplicate.
- Extend `src/routes/api/backend-api.spec.ts`: inventory status workflow actions where API-relevant.

## Task 1: Shared CMS Workflow Module

**Files:**

- Create: `src/lib/server/cms-workflow.ts`
- Test: `src/lib/server/cms-workflow.spec.ts`

- [ ] **Step 1: Write failing completeness tests**

Create tests that assert:

```ts
expect(scoreInventoryCompleteness(completeRow).level).toBe('complete');
expect(scoreInventoryCompleteness(incompleteRow).missing).toContain('transmission');
expect(scoreInventoryCompleteness(incompleteRow).score).toBeLessThan(100);
expect(cmsListingStatusOptions.map((status) => status.value)).toEqual([
	'draft',
	'intake',
	'media_ready',
	'published',
	'reserved',
	'sold',
	'archived'
]);
```

- [ ] **Step 2: Run focused test**

Run:

```bash
npm run test:unit -- --run src/lib/server/cms-workflow.spec.ts
```

Expected: fails because the module does not exist.

- [ ] **Step 3: Implement workflow module**

Define:

```ts
export type CmsListingStatus =
	| 'draft'
	| 'intake'
	| 'media_ready'
	| 'published'
	| 'reserved'
	| 'sold'
	| 'archived';

export type CmsCompletenessLevel = 'blocked' | 'needs_work' | 'ready' | 'complete';

export type CmsCompleteness = {
	level: CmsCompletenessLevel;
	missing: string[];
	score: number;
	warnings: string[];
};
```

Implement `normalizeCmsListingStatus`, `cmsListingStatusOptions`, `scoreInventoryCompleteness`, and `publicListingStatuses`.

- [ ] **Step 4: Run focused test**

Run:

```bash
npm run test:unit -- --run src/lib/server/cms-workflow.spec.ts
```

Expected: pass.

## Task 2: Attach Workflow Metadata To Admin Rows

**Files:**

- Modify: `src/lib/server/admin-cms.ts`
- Modify: `src/lib/server/admin-copilot.ts`
- Test: `src/lib/server/cms-workflow.spec.ts`

- [ ] **Step 1: Extend row type**

Add:

```ts
completeness: CmsCompleteness;
statusLabel: string;
statusTone: string;
mediaCount: number;
documentCount: number;
```

- [ ] **Step 2: Populate metadata**

Use `scoreInventoryCompleteness(rowLike)` inside `getAdminInventoryRows`.

- [ ] **Step 3: Update Copilot incomplete helper**

Replace local missing-field logic with `listing.completeness.missing`, keeping the same public function name `getIncompleteListings`.

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test:unit -- --run src/lib/server/cms-workflow.spec.ts src/routes/admin/copilot/chat/copilot-chat-api.spec.ts
```

Expected: pass.

## Task 3: Inventory Actions

**Files:**

- Modify: `src/lib/server/inventory.ts`
- Modify: `src/routes/admin/inventory/+page.server.ts`
- Extend: `src/lib/server/cms-persistence.spec.ts`

- [ ] **Step 1: Write tests**

Add tests for:

```ts
const duplicate = duplicateInventoryListing(existing.id);
expect(duplicate?.title).toContain('Copy');

const updated = updateInventoryListingStatus(existing.id, 'sold');
expect(updated?.status).toBe('sold');
```

- [ ] **Step 2: Implement helpers**

Add `duplicateInventoryListing(id)` and `updateInventoryListingStatus(id, status)` with admin-listing-only durable updates.

- [ ] **Step 3: Add page actions**

Add actions:

```ts
duplicate;
status;
archive;
```

`archive` delegates to the status helper with `archived`.

- [ ] **Step 4: Run focused tests**

Run:

```bash
npm run test:unit -- --run src/lib/server/cms-persistence.spec.ts
```

Expected: pass.

## Task 4: Inventory Command Center UI

**Files:**

- Modify: `src/routes/admin/inventory/+page.svelte`

- [ ] **Step 1: Add status filters**

Use all `cmsListingStatusOptions` values plus `all`.

- [ ] **Step 2: Add summary cards**

Cards:

```text
Live
Draft/Intake
Reserved/Sold
Needs work
```

- [ ] **Step 3: Add table columns**

Add columns for completeness, media, and workflow action menu/buttons.

- [ ] **Step 4: Run Svelte autofixer**

Run:

```bash
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/+page.svelte
```

Expected: no hard issues.

## Task 5: Editor Publishing And Media Polish

**Files:**

- Modify: `src/lib/components/admin/AdminListingEditor.svelte`
- Modify: `src/routes/admin/inventory/edit/[id]/+page.server.ts`

- [ ] **Step 1: Add sidebar quality panel**

Show completeness score, missing fields, media count, document count, source, updated date, and status.

- [ ] **Step 2: Add media preview controls**

For CMS-owned listings, render preview image, gallery image list, document list, set-preview radio/buttons, and remove checkboxes.

- [ ] **Step 3: Parse media controls server-side**

In edit action, read:

```text
selectedPreviewImage
removeGalleryImages[]
removeDocumentIds[]
```

Update only the local JSON record.

- [ ] **Step 4: Run Svelte autofixer**

Run:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/admin/AdminListingEditor.svelte
```

Expected: no hard issues.

## Task 6: Verification

**Files:** all touched files.

- [ ] **Step 1: Run checks**

```bash
npm run check
npm run lint
npm run test:unit -- --run
npm run build
```

- [ ] **Step 2: Browser verify**

Use `agent-browser` or Playwright to verify:

```text
/admin/inventory?role=admin
/admin/inventory?role=admin&status=published
/admin/inventory/new?role=admin
/admin/copilot?role=admin
```

Expected: inventory command center loads, filters work, editor renders, Copilot still chats.

## Self-Review

- Every design requirement in the approved first slice maps to a task.
- No task depends on public Auxero styling changes.
- No global `.btn` or `.container` changes are introduced.
- Media deletion is reference-based and safely scoped.
- Plan avoids full CRM/settings rebuild until the inventory spine is complete.
