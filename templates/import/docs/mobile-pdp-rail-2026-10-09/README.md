# Mobile PDP rail — 9 October 2026

English mobile vehicle detail tabs now read **Info / Specs / Extras**. Bulgarian
retains **Инфо / Данни / Екстри**. The existing `features` content ID and equipment
panel remain unchanged; only its English display label is shorter.

The selected tab stays on white and uses the retained 600 font face, with the
existing underline. Other tabs stay at 400. All labels remain
18px, all tab targets remain 44px high, and the three columns stay equal. A
visible keyboard outline distinguishes focus from selection; hovering another
tab no longer paints a second selection underline.

The initial grey and shadow previews were followed by a matched comparison of
grey versus white with identical label weight. The owner selected white with
the stronger label. The final treatment adds no shadow or vertical space to
the rail; the specification cards retain their grey backgrounds.

Inquire and Call retain the prior **17px / 400** text adjustment inside 44px
buttons. The earlier single-row title, quieter price, smaller top control faces
and bottom navigation work stay intact.

## Changed paths

- `src/lib/server/vehicle-detail.ts`: mobile English display label.
- `src/lib/components/detail/AuxeroVehicleMobilePdp.svelte`: mobile selected,
  hover and focus styles.
- `tests/localization-interactions.e2e.ts`: expected English tab name.

The source remains local and uncommitted on `main`. Other dirty work is preserved;
no template release or dealer deployment is included.

## Evidence

- Final white tabs: [BG 390px before/after](white-tabs-before-after-bg-390.png),
  [EN 390px](white-tabs-before-after-en-390.png),
  [BG 320px](white-tabs-before-after-bg-320.png) and
  [EN 320px](white-tabs-before-after-en-320.png).
- [White-tab measurements](white-tabs-after-metrics.json) verify all three
  selected states in BG/EN at 320/390px with 18px text, 600 selected weight,
  44px targets, transparent backgrounds over the white drawer, the 3px
  underline and unchanged tab geometry. No page errors or horizontal overflow
  were recorded. Both 1440px desktop captures match their fresh before captures
  pixel-for-pixel. These captures use canonical dev with no injected styles.
- The earlier captures below document the initial grey treatment before the
  owner's white-tab selection.
- [BG 390px before/after](before-after-bg-390.png)
- [EN 390px before/after](before-after-en-390.png)
- [BG 320px before/after](before-after-bg-320.png)
- [EN 320px before/after](before-after-en-320.png)
- `after-*` captures show all three selected states in both locales, at 390×844,
  320×844 and 320×540. Desktop BG/EN is captured at 1440×1000.
- [Initial rail measurements](final-metrics.json) come from canonical dev with no
  injected styles. Captures wait for the selected class and a settled paint.
  The panel remains 353.05px high at 844px phone height and 152.41px at 540px.
  Both desktop screenshots match the previous capture pixel-for-pixel.

## Checks and runtime

Scoped ESLint, Prettier and `git diff --check` passed. Svelte autofixer reports
the same two localized resolver-alias findings and effect-review suggestions as
before; those handlers are outside this label/style change.

Five existing mobile PDP tests passed in the final run: BG/EN at 320/390px for
gallery, Specs, Extras/equipment and demo inquiry submission, plus rendering
before hydration. Keyboard Tab/Enter checks show a visible focus outline and
select the intended panel.

The later white-background follow-up repeats the selected-tab render checks in
both locales at 320/390px and desktop preservation checks at 1440px. The prior
interaction suite was not repeated for this single CSS value change.

Initial verification was interrupted when the dev server stopped, and a second
server dropped during pending inquiry requests. Those failed-run artifacts are
preserved in the runtime directory. The final run uses a background Node 24.21.0
preview-mode dev process at port 6791 with explicit empty database/AI credentials
and separate local fixtures. Its process ID is recorded in `dev.pid`; stdout and
stderr are saved. The dev log also records `derived_inert` warnings during browser
teardown; no page-error events were recorded in the captures.

A new production build was not run for this display-label/CSS refinement. The
earlier full build belongs to its original receipt; the current result is local
rendered and interaction evidence.

Runtime scripts, logs and source backups are under
`L:/CODEX/cars/runtime/import-mobile-pdp-rail-20261009/`.
Dev remains at `http://127.0.0.1:6791/bg/inventory/21754658377544573`.
