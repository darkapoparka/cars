# Regression Baseline & Safety Net — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock in a verified, reproducible regression baseline on a feature branch and add a thin smoke net across the 8 in-scope desktop pages, so every later polish change is provably safe.

**Architecture:** Leverage the existing strong Playwright suite (`project1.e2e.ts` already pins the vehicle card structure + the Compare modal flow) rather than building new infra. Add one new `*.e2e.ts` smoke file that visits each in-scope page, blocks the slow third-party hosts (`focus.bg`, `code.jquery.com`) so pages reach network-idle deterministically, and asserts each renders the Bohemcars shell with no uncaught JS errors. Visual diffing is done per phase via the saved Chrome DevTools screenshots in `outputs/qa/desktop/`.

**Tech Stack:** SvelteKit 2 + Svelte 5, Tailwind 4, Vitest (unit), Playwright (e2e, runs against the production preview on `127.0.0.1:4197`).

**Baseline (measured 2026-06-03, commit `c99cf9c`):** `check` ✅ · `test:unit` ✅ 183/183 · `build` ✅ · `lint` ⚠️ ESLint clean, Prettier flags only `.claude/settings.local.json`, `inv-snapshot.md`, and this spec's `.md` · `test:e2e` ⚠️ 9 passed / **1 pre-existing failure** at `project1.e2e.ts:1083` (account/admin branding — out of scope). The gate for all later work: **no new failures vs this baseline.**

---

## File Structure

- Create: `src/routes/desktop-polish-smoke.e2e.ts` — smoke coverage for the 8 in-scope pages (the regression net for pages the existing suite barely covers). One responsibility: "every in-scope page still renders without breaking."
- Create: `docs/superpowers/plans/baseline-2026-06-03.md` — the recorded baseline manifest.
- Modify (optional tidy, Task 4): `.prettierignore` — exclude local artifacts so `npm run lint` is green.

---

### Task 1: Feature branch + baseline manifest

**Files:**

- Create: `docs/superpowers/plans/baseline-2026-06-03.md`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b desktop-polish
```

- [ ] **Step 2: Write the baseline manifest**

Create `docs/superpowers/plans/baseline-2026-06-03.md`:

```markdown
# Regression Baseline — 2026-06-03

Branch base: `c99cf9c`. Measured via the project's own scripts.

| Gate         | Command                      | Result                                                                                                                                                                 |
| ------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types/Svelte | `npm run check`              | PASS                                                                                                                                                                   |
| Unit         | `npm run test:unit -- --run` | PASS (27 files, 183 tests)                                                                                                                                             |
| Build        | `npm run build`              | PASS                                                                                                                                                                   |
| Lint         | `npm run lint`               | ESLint PASS; Prettier flags only `.claude/settings.local.json`, `inv-snapshot.md`, `docs/superpowers/specs/2026-06-03-desktop-polish-design.md` (formatting, non-code) |
| E2E          | `npm run test:e2e`           | 9 PASS / 1 FAIL                                                                                                                                                        |

Pre-existing e2e failure (NOT caused by this work, out of desktop-polish scope):
`project1.e2e.ts:1083 › account and admin routes are role-aware and branded` —
expects body to contain "Bohemcars Автомобили"; account dashboard renders "Dashboard … Автомобили".

**Gate for all desktop-polish work:** no NEW failures vs this table. The 1 pre-existing
e2e failure stays tracked separately (see follow-up).
```

- [ ] **Step 3: Commit the spec + manifest**

```bash
git add docs/superpowers/specs/2026-06-03-desktop-polish-design.md docs/superpowers/plans/2026-06-03-regression-baseline-safety-net.md docs/superpowers/plans/baseline-2026-06-03.md
git commit -m "docs: desktop polish spec + plan + measured regression baseline"
```

---

### Task 2: Smoke net for the 8 in-scope pages

**Files:**

- Create: `src/routes/desktop-polish-smoke.e2e.ts`
- Test command: `npx playwright test desktop-polish-smoke`

- [ ] **Step 1: Write the smoke test**

Create `src/routes/desktop-polish-smoke.e2e.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';

// Abort slow/unreliable third-party hosts so pages reach network-idle deterministically.
// These same hosts hung the page during manual QA; they are removed for good in the
// image-migration plan, after which this guard is a no-op.
async function blockThirdParty(page: Page) {
	await page.route('**/*', (route) => {
		const url = route.request().url();
		if (/focus\.bg|code\.jquery\.com/i.test(url)) return route.abort();
		return route.continue();
	});
}

function collectPageErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	return errors;
}

const STATIC_ROUTES = [
	'/',
	'/inventory',
	'/about',
	'/contact',
	'/agents',
	'/calculator',
	'/compare'
];

for (const path of STATIC_ROUTES) {
	test(`smoke: ${path} renders the Bohemcars shell without uncaught errors`, async ({ page }) => {
		const errors = collectPageErrors(page);
		await blockThirdParty(page);
		const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
		expect(resp?.status() ?? 0, `${path} HTTP status`).toBeLessThan(400);
		await expect(page.locator('body')).toContainText('Bohemcars');
		await expect(page.locator('body')).not.toContainText('Aurexo');
		await expect(page.locator('body')).not.toContainText('ThemeForest');
		expect(errors, `uncaught JS errors on ${path}: ${errors.join(' | ')}`).toEqual([]);
	});
}

test('smoke: a vehicle detail page renders the Bohemcars shell without uncaught errors', async ({
	page
}) => {
	const errors = collectPageErrors(page);
	await blockThirdParty(page);
	await page.goto('/inventory', { waitUntil: 'domcontentloaded' });
	const href = await page.locator('a[href*="/inventory/"]').first().getAttribute('href');
	expect(href, 'first inventory card href').toBeTruthy();
	const target = '/' + href!.replace(/^[./]+/, '');
	const resp = await page.goto(target, { waitUntil: 'domcontentloaded' });
	expect(resp?.status() ?? 0, 'pdp HTTP status').toBeLessThan(400);
	await expect(page.locator('body')).toContainText('Bohemcars');
	expect(errors, `uncaught JS errors on pdp: ${errors.join(' | ')}`).toEqual([]);
});
```

- [ ] **Step 2: Run the smoke test, expect PASS**

Run: `npx playwright test desktop-polish-smoke`
Expected: `8 passed` (7 static routes + 1 PDP). If a page throws an uncaught error, that is a real finding — capture it before continuing (do not weaken the assertion to hide it).

- [ ] **Step 3: Commit**

```bash
git add src/routes/desktop-polish-smoke.e2e.ts
git commit -m "test: smoke net for the 8 in-scope desktop pages"
```

---

### Task 3: Confirm the full baseline still holds

- [ ] **Step 1: Run the full gate**

Run: `npm run check && npm run test:unit -- --run && npm run build && npm run test:e2e`
Expected: `check` PASS · unit 183 PASS · build PASS · e2e now **17 passed / 1 failed** (9 existing + 8 smoke pass; the 1 pre-existing `:1083` failure unchanged).

- [ ] **Step 2: If anything other than the known `:1083` test fails, stop and investigate.** The smoke net + existing suite are the regression gate from here on.

---

### Task 4 (optional tidy — "finalized" polish): make `npm run lint` green

**Files:**

- Create: `.prettierignore`

- [ ] **Step 1: Exclude local artifacts from Prettier**

Create `.prettierignore` (or append if it exists):

```
inv-snapshot.md
.claude/
```

- [ ] **Step 2: Format the spec/plan docs that are ours to format**

Run: `npx prettier --write docs/superpowers/specs/2026-06-03-desktop-polish-design.md docs/superpowers/plans/2026-06-03-regression-baseline-safety-net.md docs/superpowers/plans/baseline-2026-06-03.md`

- [ ] **Step 3: Verify lint is green**

Run: `npm run lint`
Expected: exit 0 (ESLint + Prettier both clean).

- [ ] **Step 4: Commit**

```bash
git add .prettierignore docs/superpowers
git commit -m "chore: prettier-ignore local artifacts; format desktop-polish docs"
```

---

## Self-Review

- **Spec coverage:** This plan implements the spec's "Regression safety (hard requirement)" section — baseline-first (Task 1), the regression net (Task 2), the green-gate definition (Task 3), and the "finalized" lint cleanup (Task 4). It does not yet implement design tokens / card unification / localization / modernization / per-page elevation — those are deliberately separate downstream plans.
- **Placeholder scan:** No TBD/TODO; all test code and commands are complete and runnable.
- **Type consistency:** Helper names (`blockThirdParty`, `collectPageErrors`) and the `STATIC_ROUTES` array are used consistently; the PDP test derives its slug at runtime to avoid brittle hardcoding.
- **Known limitation (stated, not hidden):** the smoke net asserts shell + no-uncaught-errors, not pixel fidelity. Pixel/layout regression is caught per phase via the saved Chrome DevTools before/after screenshots in `outputs/qa/desktop/` plus the existing DOM-fidelity assertions in `project1.e2e.ts`.

## Follow-up (out of this plan's scope)

- Pre-existing e2e failure `project1.e2e.ts:1083` (account/admin branding). Decide separately whether to fix the account dashboard branding or update the assertion.
