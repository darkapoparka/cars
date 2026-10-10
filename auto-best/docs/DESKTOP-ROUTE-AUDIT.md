# Desktop route audit — 23 September 2026

Scope: Home, `/listing-grid`, `/about-us`, `/blog`, and general `/contact` in the
standalone Auto Best master. Local review uses `http://127.0.0.1:5174` and Node
22.23.2. Both Bulgarian and English are covered.

## Final direction — cutout refinement

After comparing the generated scenes with the existing visual language, the owner
approved restoring cutouts on Home and Inventory, returning Contact to a neutral
treatment, and keeping About's warm architectural scene and Blog unchanged.
This supersedes the four-scene revision documented below.

- Home: pale grey surface, dark typography, original G-Class/Urus cutouts.
- Inventory: solid charcoal surface, white typography, original Golf/A45 cutouts.
- Contact: its original neutral charcoal surface and M4/RS5 cutouts.
- About: retained warm architectural scene and red primary action.
- Blog: retained its accepted neutral surface and artwork.

Home and Inventory's cutouts have a shared 120–160px body height and a baseline
50px above the banner bottom. Their inner edges remain outside the search lane.
They load only at 1440px and above, where there is room beside the controls;
smaller desktop widths prioritize the full-size search panel and readable copy.
All five desktop banners remain 540px tall. Mobile artwork and geometry stay intact.

The three unused generated scenes remain archived with their provenance but are
not rendered or downloaded. About alone requests a generated scene on desktop.
The shared cutout component no longer needs the temporary desktop-disable prop.

Final verification: `npm run validate` passed, all 50 BG/EN route/viewport cases
passed, and all eight journey cases passed. The route suite now verifies cutout
loading and clearance from search controls as well as About-only scene requests.
Rendered desktop captures were inspected at 1024, 1440 and 1920px. Logs and
screenshots use the `cutouts-` prefix under `artifacts/desktop-route-audit/`.
The 23 pre-existing dirty paths remain excluded and match the preservation snapshot.
These results apply to the local working preview, not an exact clean release.

## Earlier four-scene revision

The owner accepted Blog and requested more character in the other banners after
the initial audit. This revision supersedes the solid-only palette below. Home
now uses an ivory automotive studio, Inventory a graphite studio, About warm
architectural materials, and Contact a slate-blue evening showroom scene. Blog
retains its approved neutral treatment. Red remains the primary-action accent.

`DesktopHeroScene.svelte` renders the selected scene from
`leadSite.artwork.desktopHeroScenes`. Responsive picture sources load only at
992px and above; phones retain their existing artwork. Each scene fills the
shared 540px banner, with a crop below the navigation at 992–1199px to keep the
architecture and vehicles in view. Home and About use dark text; Inventory and Contact retain
light text. About's primary action is red and its social controls use light circles
with dark icons. The old desktop cutouts are omitted where a scene is rendered.

The four 2172×724 WebP assets total approximately 505 KiB (only one loads per
route). They were generated with the built-in image tool and encoded at quality
88 without resizing or compositing. Exact prompts and conceptual-image limits
are in [the generation record](../provenance/desktop-hero-scenes-2026-09-23.json).
Saved assets are `static/assets/images/lead/auto-best-desktop-{home,inventory,about,contact}-v1.webp`.

Verification retains the title/control geometry, Onest, overflow, image and focus
checks; it now also verifies the correct scene is requested on each desktop route
and none is requested on mobile. Tests wait for actual fonts and images rather
than external map/video network idleness.

### Revision verification

- `npm run validate`: passed, including production build and zero Svelte errors/warnings.
- Desktop route audit: all 50 BG/EN cases passed at 390, 992, 1024, 1440 and 1920px.
- Desktop discovery: all six route/width cases passed.
- Journey regression: all eight cases passed, including responsive media requests.
- Hero title/lead contrast sampled against the rendered image crops at 992, 1024,
  1440 and 1920px: minimum 3.96:1 for large titles and 5.02:1 for supporting text.
  This is a targeted hero check, not a whole-site accessibility certification.
- Reviewed rendered scenes at laptop and wide desktop sizes. No horizontal overflow,
  broken visible images, or runtime errors were found in the route audit.
- `git diff --check` passed; all 23 pre-existing dirty paths match the saved diff
  byte-for-byte and are excluded from the revision commit.

Revision logs and crop/contrast evidence are under `artifacts/desktop-route-audit/`
(`scenes-*-final.log`, `scene-contrast.json`, `scene-*-{width}.png`). These checks
apply to the local working preview with the preserved existing work present.

## Initial audit findings

| Area | Finding | Result |
| --- | --- | --- |
| Hero geometry | All five were already 540px at 1440px, but repeated route heights and absolute copy positioning made the contract fragile. | Shared height remains 540px; title and description use normal flex flow above the shared 320px control baseline. Vehicle placement derives from the hero height. |
| Palette | Inventory used layered gradients; Blog introduced yellow outside the requested desktop neutral/red family. | Solid red Inventory, solid grey Blog, existing black Home and charcoal About/Contact. Existing vehicle cutouts remain. |
| Typography | Hero descriptions used smaller body type with very long measures; About service actions used metadata type. | 18px hero descriptions with a 760px maximum measure, balanced wrapping, and 16px/500 service controls. Titles retain 48px/600, or 42px at 992–1199px. |
| Discovery alignment | Home and Inventory had different center-lane width rules. | One shared responsive lane for Home, Inventory and wide Blog search. |
| Hover/focus | Blog's shared inactive-category background overrode its hover background while the text turned white. About's hover action nearly merged with its dark hero. | Category hover retains red behind white text; neutral actions stay visibly light; Blog search gains a clear focus outline. |
| Loading/code | About, Blog and Contact eagerly requested hero photos hidden at every breakpoint. | Removed those image elements and obsolete media/overlay rules. Retained original assets and provenance; tablet Inventory artwork remains. |
| Regression test | The journey test clicked at 5px/5px, outside the rounded desktop card. | Click at 12px/12px checks the visible card surface without bypassing browser hit testing. |

## Initial visual review

Reviewed the complete pages: navigation and hero, Home campaign/vehicle/body/brand/
editorial/video sections, Inventory cards and controls, About service cards and map,
Blog cards and filters, Contact actions and map, and the shared footer. Existing
section artwork and white/grey card patterns are retained. No generated assets or
additional font family were needed. Native lazy images are scrolled into view before
the final full-page captures; unrequested lazy-image placeholders are not missing assets.

Desktop rules live in `src/lib/styles/composition.css` and the existing route sheets.
Typography values still come from `src/lib/styles/tokens.css`. No new global theme,
duplicate hero component, package dependency, lockfile or locale copy was introduced.
Phone layouts retain their existing palette and geometry.

## Initial verification

- `npm run validate`: architecture, CSS policy, token graph, typography, assets,
  domain checks, Svelte/TypeScript diagnostics, locale prebuild checks and production build.
- `node scripts/desktop-routes-smoke.mjs`: 50 BG/EN route/viewport cases at 390,
  992, 1024, 1440 and 1920px. Checks equal desktop heights, solid surfaces, heading
  and control separation, real Onest glyph rendering through Chrome's font inspector,
  overflow, images, runtime errors, Blog hover and search focus.
- `node scripts/desktop-discovery-smoke.mjs`: desktop filter drafts, sticky search,
  dismissal and focus return at 1024, 1440 and 1920px.
- `node scripts/journey-smoke.mjs`: vehicle/article return state, finance context,
  stock discovery, menu focus/resize and viewport-specific hero media loading.
- `git diff --check`; pre-existing changes compared against the initial saved diff.

Reports and full-page screenshots: `artifacts/desktop-routes-smoke/`,
`artifacts/desktop-discovery-smoke/`, `artifacts/journey-smoke/`. Build logs and the
initial preservation snapshot are under `artifacts/desktop-route-audit/`.

These are local working-preview checks, including the 23 pre-existing dirty paths
preserved during this task. They do not certify an exact clean release commit,
mounted Cars preview, live dealer deployment, or form delivery. Google Maps and
YouTube remain external providers. Owner visual acceptance and template promotion
are separate from this implementation.
