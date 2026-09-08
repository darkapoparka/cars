# ELIQ AUTO — Type, Spacing, Hierarchy & Touch Contract

**Status:** canonical. This is the only size/spacing/touch document.  
**Owner prompt:** site-wide desktop + all public pages.  
**Do not invent new sizes.** If a surface needs a value, pick a role from this file.

Related: `UI_UX_PLAYBOOK.md` (visual quality bar), this file (measurable numbers).

---

## 1. What was wrong

The site already had tokens in `src/lib/styles/eliqauto.css`, but most surfaces ignored them. The result on desktop:

| Zone | What you saw |
|---|---|
| Hero title, section bands | Large, confident, readable |
| Filter labels, card specs, badges, “vs”, finance links | 10–12px, thin, easy to read as pixelated |
| Header search / compare / heart | **24×24px** hit boxes |
| Top-bar social + mega-menu links | **28px** hit boxes (commented as “WCAG”, still too small) |
| Primary CTAs (Вход, Покажи, Виж детайли) | 48–52px — these were already fine |
| Body | Mix of 16px and template 12px `.text-xs` |

Pixelation was not a missing font. Geist Variable (with Cyrillic) is loaded. The blur came from:

1. Global `-webkit-font-smoothing: antialiased` on Windows (thins stems at small sizes).
2. Type below 13px, especially uppercase + weight 400–500.
3. 24px icon buttons that look like 16px glyphs with no padding.

---

## 2. Roles, not one-off pixels

Every piece of text uses **one role**. Size is a consequence of the role.

| Role | Token | Mobile | Desktop (≥1200) | Weight | Use |
|---|---|---|---|---|---|
| Display | `--bc-text-h1` | clamp in component | 68px | 580–600 | Hero only |
| Section | `--bc-text-h2` | 26–32px | 40px | 700 | Section bands |
| Title | `--bc-text-h4` / card title | 16–18px | 22px | 600 | Vehicle names, page titles |
| Body | `--bc-text-body` | 16px | 18px | 400–500 | Paragraphs, form copy |
| Control | `--bc-text-control` | 16px | 16px | 600 | Buttons, nav, inputs |
| Caption | `--bc-text-caption` | 14px | 15px | 500–600 | Specs, helper, footer links |
| Micro | `--bc-text-micro` | **13px** | **14px** | 600 | Overlines, chips, timestamps |

**Hard floor:** nothing a visitor must read is below **13px**. Desktop micro is 14px.

**Hard ceiling for UI copy:** do not use display sizes (40px+) for card titles, filter chrome, or navigation.

### Allowed exceptions

| Exception | Max smallness | Condition |
|---|---|---|
| Numeric count badge on a 44px parent (cart/compare/heart) | 11px | Parent hit box is ≥44px; badge is not the target |
| Map pin numerals, legal superscripts | 11px | Decorative / legal mark only |

If it is a label, spec, price, link, or button — it is **not** an exception.

---

## 3. Touch and control geometry

| Token | Value | Rule |
|---|---|---|
| `--bc-touch` | **44px** | Minimum hit box for any public control |
| `--bc-touch-compact` | 40px | Desktop-only (`pointer: fine`) overflow menus if 44px breaks the row |
| Visible glyph | 20–24px | Icon *drawing* size inside a 44px hit box |

Apply to: links that act as buttons, `<button>`, `<select>`, text inputs, textarea, filter pills, header icons, bottom nav, “Сравни”, “Изчисти”, tabs, checkbox/radio **rows**.

Do **not** grow: count badges, chevrons inside a 44px parent, decorative bullets.

Pattern for icon-only controls:

```css
.icon-btn {
	display: inline-flex;
	width: var(--bc-touch);
	height: var(--bc-touch);
	align-items: center;
	justify-content: center;
	padding: 0;
}
.icon-btn svg { width: 22px; height: 22px; }
```

Primary CTAs stay 48–52px. Do not shrink them to 44.

`.btn.btn-small` (template) is 38px in `app.css`. The contract raises it to 44px. Do not reintroduce 38px.

---

## 4. Spacing scale

Base unit: **4px**. Use these gaps/padding values only:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

Tokens:

| Token | Value | Use |
|---|---|---|
| `--bc-space-1` … `--bc-space-6` | 4 / 8 / 12 / 16 / 24 / 32 | Component gaps |
| `--bc-section-sm/md/lg` | existing clamps | Section padding |
| `--bc-page-x` | 15px | Inherited Auxero page gutter — do not “fix” to 16 |
| `--bc-card-padding` | 20px | Card interior |
| `--bc-control-x` / `--bc-control-y` | 16 / 12 | Control padding |

Rhythm:

- Related items: 8–12px.
- Groups: 20–32px.
- Sections: `--bc-section-*`.
- More space **above** a heading than below it.

Do not add a second card wrapper to create space. Use gap.

---

## 5. Hierarchy (squint test)

On every public page, in this order:

1. **Recognize** ELIQ AUTO (logo, not a 12px eyebrow).
2. **Page job** (hero / page title).
3. **Decide** (vehicle image → title → price).
4. **Act** (primary CTA in accent red).
5. Supporting facts (caption), then chrome (header, footer).

Red is for selected/action only. Specs and meta stay `--bc-copy` / `--bc-muted`, never 11px gray.

Long Bulgarian strings wrap. Never `font-size: 0` + `::before` to fake a heading.

---

## 6. Font rendering (anti-pixelation)

| Rule | Value |
|---|---|
| Face | Geist Variable (already includes Cyrillic) |
| Smoothing | **`auto`** (subpixel). Not `antialiased` / `grayscale` on body |
| Synthesis | `font-synthesis: none` — no fake bold/italic |
| Tracking | 0 on UI; headings may use −0.025em, never below −0.04em |
| Transform | Never `scale()` text or `zoom` on type |
| All-caps | Caption/micro only; add tracking ≤ 0.04em and weight ≥ 600 |

`antialiased` is allowed on display headings ≥ 32px if a specific surface needs it. Default is `auto`.

---

## 7. Where it is implemented

| Layer | File | Job |
|---|---|---|
| Tokens | `src/lib/styles/eliqauto.css` | Role sizes, `--bc-touch`, spacing, smoothing |
| Tailwind aliases | `src/lib/styles/eliqauto.tailwind.css` | `text-bc-micro`, `text-bc-caption`, `text-bc-control` |
| Enforcement | `src/lib/styles/eliqauto.type-contract.css` | Floors for `.text-xs`, `.btn-small`, icon buttons |
| Template overrides | `src/routes/auxero-guards.css` | Inventory 10–12px leftovers |
| Components | owning `.svelte` files | Replace hardcoded 10/11/12px with tokens |

Unlayered project CSS beats layered `app.css`. Component styles still win over the contract — so components must use tokens, not `10px`.

---

## 8. Page checklist (desktop + mobile)

Every public route must pass:

- [ ] No readable text < 13px (11px badge exception only).
- [ ] Interactive hit box ≥ 44×44px, or 44px in the missing axis with ≥ 24px in the other only for inline text links in prose.
- [ ] Body 16/18px, controls 16px, vehicle title ≥ 16px, price ≥ 18px.
- [ ] Section heading clearly larger than card title.
- [ ] Filter / form labels caption, values control.
- [ ] 1440×900 and 390×844: no collision, no clipped type, no horizontal page scroll.
- [ ] 200% zoom still usable.

Routes in scope: `/`, `/inventory`, `/inventory/[slug]`, `/contact`, `/about`, `/compare`, `/services`, `/import`, `/sell-your-car`, `/faqs`, `/blog`, `/financing`, `/agents`, `/reviews`, `/calculator`, `/terms`, `/offer`.

Admin (`/admin/*`) keeps denser product UI but still no 10px copy. Account uses the same floors on public-facing cards.

---

## 9. Verification

Evidence folder: `artifacts/final-polish/type-spacing-touch/`

```bash
node artifacts/final-polish/type-spacing-touch/capture.mjs before
node artifacts/final-polish/type-spacing-touch/capture.mjs after
```

`summary.json` counts remaining `<13px` text nodes and `<40px` hit boxes. Counts will not hit zero (prose links, count badges, hidden template nodes). They must drop, and named public controls must pass the 44px rule by inspection.

---

## 10. Stop conditions

- Do not redesign section order, cards, or color.
- Do not add gradients, glow, lift, or a second type family.
- Do not change `--bc-page-x` (15px Auxero gutter).
- If a control cannot reach 44px without breaking an approved composition, expand the hit box with padding + negative margin — do not leave a 24px target.
