# ELIQ AUTO Import — UI/UX Playbook

## Role of this document

This playbook describes the desired quality bar. It does **not** authorize broad visual changes. A rule becomes implementation work only when a selected task in root `tasks.md` names the affected surface.

## Product hierarchy

1. Recognize ELIQ AUTO and the relevant dealer/location context.
2. Discover or search vehicles.
3. Understand image, title, price, and core facts.
4. Open a detail or valid commercial/contact action.
5. Read secondary service/import/leasing information.

## Preserve-first design rules

- Preserve approved imagery, section order, information architecture, typography character, color identity, and working interactions unless a selected task explicitly changes them.
- Prefer small ownership-correct fixes over global overrides.
- Do not make unrelated components “consistent” by flattening their identity.
- Do not copy styling from a sibling repository unless the selected task names a behavioral pattern to reuse and the implementation is adapted to this stack.

## Visual quality

- Use deliberate spacing, alignment, readable typography, stable media dimensions, and clear hierarchy.
- Keep vehicle title and price prominent; supporting facts should be easy to compare.
- Red is an intentional action/selected-state accent, not a page-wide decoration.
- Avoid gradients, glassmorphism, glow, giant shadows, hover lift, image zoom, parallax, auto-playing decoration, and generic AI/SaaS styling.
- Long Bulgarian labels, vehicle names, and BGN prices must wrap without clipping.

## Responsive rules

- Design endpoint and intermediate widths intentionally: 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920.
- No page-level horizontal overflow.
- Fixed/sticky UI must include matching content clearance and safe-area handling.
- Mobile must not be a compressed desktop composition.
- Desktop must not be a stretched mobile screen.
- 200% browser/text zoom must remain usable on touched surfaces.

## Controls and states

- Clear label/value hierarchy.
- Distinct default, hover, focus-visible, active, selected, disabled, loading, error, and pressed states.
- Touch targets should be practically usable; around 44px where layout permits. Exact roles, floors, and exceptions live in `TYPE_SPACING_TOUCH.md` — do not invent new sizes.
- Draft/applied filter state must be explicit.
- Clear-one, clear-all, Apply, Cancel, and Reset must be predictable.
- Do not expose a control for an unimplemented mode.

## Overlays

- Reuse the existing overlay system.
- One blocking overlay at a time.
- Correct focus entry, containment where required, Escape/backdrop close, focus restoration, body-scroll restoration, dynamic viewport sizing, and safe areas.
- No arbitrary `z-index: 999999`, duplicate backdrops, or invisible stale body state.

## Vehicle cards and detail

- Stable image ratio/dimensions and deliberate crop.
- Clear title, price, and key-fact hierarchy.
- No primary action available only on hover.
- No nested interactive controls inside a full-card link.
- Missing values/images require intentional fallbacks.
- Sticky detail/contact actions must never cover content.

## Forms and conversion

- Visible labels, clear required state, inline Bulgarian validation, submitting/disabled state, success, failure, and retry.
- No double submission.
- Every visible primary CTA must have a valid or honest outcome.
- Do not fabricate inventory counts, reviews, guarantees, services, or backend behavior.

## Import/Auxero guidance

- Preserve Auxero proportions, image ratios, compact controls, card semantics, and restrained transitions.
- Prefer component-scoped styles. `auxero-guards.css` is a compatibility layer, not a dumping ground.
- Do not add global `.btn`/`.container` overrides, oversized custom CTAs, or a second modal/sheet system.
- The strong mobile layout is a preservation baseline; desktop improvements must not destabilize it.

## Change-review rule

Every selected task requires before/after screenshots of the affected surface plus preservation screenshots of named untouched surfaces. A visually different result is not automatically an improvement; it must match the task acceptance criteria.
