# Home section banner polish — 23 September 2026

Scope: desktop Home section headings and the four browse/ownership campaign cards.
The route heroes, mobile layout, existing vehicle artwork and destinations stay intact.

## Design

- Inventory, brands, editorial and video section headers use the solid charcoal
  family from the desktop Inventory hero, separating them from the white panels.
  Body types reuse the pale ice-blue start colour from mobile Import.
- Desktop sections share the light-grey page canvas; vehicle/editorial cards and
  rounded section containers are white. Inner brand, body-type and vehicle cards
  use a faint shared shadow with stronger hover depth. The Home hero uses soft
  grey; the Sell campaign card is white. Other campaign/banner colours stay intact.
- Preserve the rounded banner treatment: headings have 20px corners and the white
  card panels have 16px corners, with the established 24px overlap. There is no
  divider border or inset shadow. Surface colours provide the separation.
- Light banners use red actions; dark banners use white actions. Buttons have flat
  surfaces and no vertical hover movement. Focus outlines are white on charcoal
  and blue on light surfaces.
- All five section banners (Inventory, Body Types, Brands, Editorial and Videos)
  use the same concise “View all” label with an 18px right arrow and shared spacing.
  Accessible labels retain the destination context; video links announce the new
  tab. Selling/importing campaign actions retain their specific wording.
- All five section headers retain the shared 176px minimum height and typography.
  Vertical padding compensates for the overlapping panel so copy stays centred
  in the visible banner area. Campaign cards retain a 234px minimum height,
  matching rounded corners, and equal heights within each pair.
- Sell uses white and Import reuses the pale ice-blue surface, both with red
  actions. Collection and Leasing use charcoal with white actions. Existing
  transparent vehicle artwork remains.
- Campaign artwork scales to reserve room for action labels at laptop widths.
  Ownership artwork is slightly smaller, and desktop action labels stay on one line.
- The old graphite/crimson metallic background images are no longer requested.
  Original assets and provenance are retained; no new images or dependencies were added.

## Ownership and verification

Shared Home banner presentation and the semantic `dn-home-section-panel` style
live in `src/routes/+page.svelte`. All five card panels opt into that class;
duplicated desktop overlap, padding and corner rules are removed from their owners.
BodyTypes selects the pale-blue light variant; TrustActions owns campaign card styling.
Existing unrelated changes, including tokens and the VideoSection close-icon
size adjustment, are preserved and excluded from the task commit.

Local checks use Node 22.23.2 and the confirmed checkout listener at
`http://127.0.0.1:5174`:

- `npm run validate`: architecture, CSS, tokens, typography, assets, domain,
  locale, Svelte/type checks and production build.
- Twelve focused Home browser cases: BG/EN at 390, 768, 992, 1024, 1440 and 1920px.
  Checks cover neutral surfaces, omitted metallic image requests, text/hover/focus
  contrast, header geometry, contained actions, campaign artwork clearance,
  rounded heading/panel corners, consistent overlap, clearance above the panel,
  absence of divider borders/shadows,
  horizontal overflow and runtime errors.
- Rendered section captures inspected at laptop and wide desktop sizes.
- Before/after 390px section rectangles and background colours match exactly.
- Pre-existing working changes are compared byte-for-byte against the saved diff
  and kept out of this task's commit.

Local evidence is under `artifacts/desktop-route-audit/home-sections-*` and
`home-{section}-after*.png`. These checks include the preserved existing work;
they are not certification of an exact clean release or a dealer deployment.

The accepted design constraints are rounded banners, subtle colour contrast,
no added divider, and the existing vehicle artwork. The shared panel class is
retained, so restoring the rounding does not restore duplicated component CSS.
Current captures use `home-{section}-rounded.png` and `home-sections-rounded-*`.
The earlier divider and square-join experiments are superseded.

24 September: restored white surfaces to all five desktop section containers
through their shared page rule. CSS policy and token checks passed; live browser
checks confirmed white 16px-rounded panels on the grey canvas at 992/1440px and
no mobile overflow at 390px. Dev server verified at port 5174.
