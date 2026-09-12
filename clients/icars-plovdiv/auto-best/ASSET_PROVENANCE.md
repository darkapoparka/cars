# Runtime asset provenance

The native SvelteKit application ships **64 local media files / 5,352,525 bytes**. `npm run check:assets` enforces a one-to-one relationship between source references and files under `static/`; missing assets, unused media, or retired mirror-runtime names fail the build gate.

The cleared source and reuse boundary is recorded in `SOURCE_LICENSE.md`. The previous 229 MB mirror asset root and all unused ImageGen iterations were removed from the application tree. Their historical metadata remains in `provenance/mirror-manifest.json` and their content remains recoverable from Git history.

## Asset classes

### Owner-requested mobile service banners — 2026-09-05

- `day-night-sell-banner-v1.webp`: ImageGen illustration of a graphite estate car and keys in a fictional charcoal garage. Original: `C:/Users/radev/.codex/generated_images/01a06e17-cc86-76a2-a8d2-0267e576c5ff/exec-f6234c8c-30c3-4c01-95f0-75d1872ac16e.png`.
- `day-night-import-banner-v1.webp`: ImageGen illustration of a graphite sedan in a fictional logistics terminal. Original: `C:/Users/radev/.codex/generated_images/01a06e17-cc86-76a2-a8d2-0267e576c5ff/exec-60f194bd-e67f-416e-804a-55f5df330dc6.png`.
- Generated with the built-in image tool on explicit owner request. Original PNGs retained; runtime versions are WebP encodings at original dimensions. Decorative service illustrations, not evidence of actual stock, locations, facilities, or import operations. Used only in mobile contact-topic banners; desktop imagery retained.

- Day & Night logo and representative stock images are lead-specific media retained for this registered Sales Demo.
- The Blog, Contact, and three guide hero images are original ImageGen outputs created for this lead demo. They contain no embedded copy, third-party logo, readable plate, or watermark.
- Body silhouettes, background imagery, article imagery, vehicle-menu imagery, team portraits, and partner marks come from the cleared licensed AutoDeal reference. Team and partner material remains visibly disclosed in the UI as temporary demo presentation content.
- `favicon.ico` is the cleared reference icon used by this demo.
- Onest is bundled from `@fontsource-variable/onest@5.3.1`; the family is published under the SIL Open Font License 1.1. No remote font is requested at runtime.

```agency-os-asset-reuse
schema: agency-os-asset-reuse/v1
media-clearance: approved
font-clearance: approved
remote-font-clearance: not-applicable
```

## Complete runtime inventory

- `static/favicon.ico`
- `static/assets/images/lead/day-night-logo.png`
- `static/assets/images/lead/day-night-home-hero-v3.webp`
- `static/assets/images/lead/day-night-hero-silver-v1.webp`
- `static/assets/images/lead/day-night-hero-graphite-v1.webp`
- `static/assets/images/lead/day-night-sell-banner-v1.webp`
- `static/assets/images/lead/day-night-import-banner-v1.webp`
- `static/assets/images/lead/day-night-stock-01.webp`
- `static/assets/images/lead/day-night-stock-02.webp`
- `static/assets/images/lead/day-night-stock-03.webp`
- `static/assets/images/lead/day-night-stock-04.webp`
- `static/assets/images/lead/day-night-stock-05.webp`
- `static/assets/images/lead/day-night-stock-06.webp`
- `static/assets/images/lead/day-night-guide-import.webp`
- `static/assets/images/lead/day-night-guide-inspection.webp`
- `static/assets/images/lead/day-night-guide-leasing.webp`
- `static/assets/images/lead/day-night-blog-hero-v2.webp`
- `static/assets/images/lead/day-night-contact-hero-v2.webp`
- `static/assets/images/icon-box/car-list1.png`
- `static/assets/images/icon-box/car-list2.png`
- `static/assets/images/icon-box/car-list3.png`
- `static/assets/images/icon-box/car-list4.png`
- `static/assets/images/icon-box/car-list5.png`
- `static/assets/images/icon-box/car-list6.png`
- `static/assets/images/icon-box/car-list7.png`
- `static/assets/images/icon-box/car-list8.png`
- `static/assets/images/partner/partner1.png`
- `static/assets/images/partner/partner2.png`
- `static/assets/images/partner/partner3.png`
- `static/assets/images/partner/partner4.png`
- `static/assets/images/partner/partner5.png`
- `static/assets/images/partner/partner6.png`
- `static/assets/images/partner/parner7.png`
- `static/assets/images/partner/parner8.png`
- `static/assets/images/partner/parner9.png`
- `static/assets/images/partner/parner10.png`
- `static/assets/images/partner/parner11.png`
- `static/assets/images/partner/parner12.png`
- `static/assets/images/partner/par1.png`
- `static/assets/images/partner/par2.png`
- `static/assets/images/partner/par3.png`
- `static/assets/images/partner/par4.png`
- `static/assets/images/partner/par5.png`
- `static/assets/images/partner/par6.png`
- `static/assets/images/section/bg-4.jpg`
- `static/assets/images/section/bg-6.jpg`
- `static/assets/images/lead/day-night-editorial-banner-v2.webp`
- `static/assets/images/section/bg-12.jpg`
- `static/assets/images/section/car-slide1.png`
- `static/assets/images/section/car-slide2.png`
- `static/assets/images/section/car-slide3.png`
- `static/assets/images/img-box/team1.jpg`
- `static/assets/images/img-box/team2.jpg`
- `static/assets/images/img-box/team3.jpg`
- `static/assets/images/img-box/team4.jpg`
- `static/assets/images/blog/blog-1.jpg`
- `static/assets/images/blog/blog-2.jpg`
- `static/assets/images/blog/blog-3.jpg`
- `static/assets/images/blog/blog-4.jpg`
- `static/assets/images/blog/blog-5.jpg`
- `static/assets/images/blog/blog-6.jpg`
- `static/assets/images/blog/blog-7.jpg`
- `static/assets/images/blog/blog-8.jpg`
- `static/assets/images/blog/blog-9.jpg`

### Mobile navigation icons — Phosphor 2.1.1

The five filled SVG paths in `src/lib/components/layout/MobileNavIcon.svelte` are copied without geometry changes from the published `@phosphor-icons/core@2.1.1` package: `house-fill`, `car-profile-fill`, `tag-fill`, `globe-hemisphere-west-fill`, and `squares-four-fill`. Source: https://github.com/phosphor-icons/core. Copyright (c) 2023 Phosphor Icons; full MIT notice retained in `provenance/phosphor-icons-LICENSE.txt`. They render as inline component SVG; no runtime font, remote request, or additional static media is introduced.

Mobile dock refinement (2026-09-05): the current component uses the unmodified regular-weight house, car, tag, globe and list SVG paths from the same @phosphor-icons/core@2.1.1 package and MIT license. This supersedes the filled selection documented above.

## Photographic Home hero replacement — 2026-09-05

Owner-requested built-in ImageGen generation replaces the previous dark Home image. Runtime: `static/assets/images/lead/day-night-home-hero-v3.webp`, 1881×836, WebP quality88,114870 bytes. Source: `C:/Users/radev/.codex/generated_images/01a06e17-cc86-76a2-a8d2-0267e576c5ff/exec-e9038edb-69a6-442e-bcfd-2f334f180e69.png`. Reference-only images were the owner's other project's `apps/web/public/lead-car-left.webp` and `lead-car-right.webp` at `M:/leads-cars/projects/bulgaria/day-night-auto-group`. The cars and showroom are illustrative generated content, not representations of verified stock or the lead's actual premises. Small generated marque details may be visible. Previous runtime image preserved in `artifacts/hero-replacement/day-night-home-hero-v2.jpg`; source history remains intact. Full generation prompt: `artifacts/hero-replacement/generation-prompt.md`.

Mobile dock Hugeicons selection (2026-09-05): MobileNavIcon.svelte now uses unmodified Stroke Rounded geometry and 1.5px strokes from @hugeicons/core-free-icons@4.3.0: Home03Icon, Car01Icon, Tag01Icon, Globe02Icon and Menu01Icon. Official source: https://github.com/hugeicons/hugeicons. License retained in provenance/hugeicons-LICENSE.txt. SVG attributes are converted to native SVG casing; only these five icons are included inline, with no runtime library, font or remote asset request. This supersedes the Phosphor selection above.

## Solid desktop Home hero — 2026-09-05

Two owner-requested built-in ImageGen assets frame the headline on a CSS solid gray desktop surface. Runtime: `day-night-hero-silver-v1.webp` and `day-night-hero-graphite-v1.webp`, each1536x1024, WebP quality88. Generated final PNGs: `exec-88a12b00-ac4e-4ab9-9290-86da2ff042c9.png` and `exec-519286b4-0c3e-4cc8-94e5-9d1b21d51a02.png` in the existing generated_images thread directory. Original owner-project car images were reference inputs. Initial transparency attempts produced baked checkerboards and were rejected; corrected assets have white backgrounds and localized contact shadows, blended on the gray surface with CSS multiply. No false alpha claim. The previous panoramic image remains referenced for mobile/tablet. These are decorative vehicle illustrations, not verified listings. Runtime inventory intentionally increases62 to64 with the two new referenced assets; asset guard remains strict. Prompts: `artifacts/hero-replacement/solid-generation-prompts.md`.

### Editorial banner replacement — 2026-09-05

- Owner requested a compact, quieter background separated from article cards. Replace the old bg-8.jpg close-up with static/assets/images/lead/day-night-editorial-banner-v1.webp, generated with built-in ImageGen. The depicted workshop is fictional decorative imagery, not evidence of owned facilities.
- Original generation PNG and full prompt are recorded in artifacts/editorial-banner/prompt.md. Preserve the previous runtime image at artifacts/editorial-banner/original-bg-8.jpg and in Git history. Runtime remains 64 referenced assets; historical licensing evidence remains intact.

### Editorial drawer correction — 2026-09-05

- Owner rejected the detached workshop banner. Replace runtime v1 with day-night-editorial-banner-v2.webp, an ImageGen silver touring car at a fictional mountain overlook. Full prompt and retained original generation are in artifacts/editorial-banner/prompt-v2.md. Encode at original dimensions as WebP, quality85.
- Preserve the rejected workshop at artifacts/editorial-banner/rejected-workshop-v1.webp. Keep its original generation and earlier provenance notes as history. Runtime inventory remains64 assets.

Mobile header and discovery Hugeicons extension (2026-09-05): reuse the same @hugeicons/core-free-icons@4.3.0 MIT source archive for Location01Icon, Call02Icon, Search01Icon, FilterHorizontalIcon, ArrowUpDownIcon and Cancel01Icon. MobileNavIcon includes their unmodified Stroke Rounded geometry at20px with original1.5px strokes; existing dock icons remain22px. Header menu reuses the existing Menu01Icon. Native Svelte SVG markup only; no runtime dependency or public asset added. Replaces the previous mobile header SVGs, CSS hamburger and CSS sort-line drawing. License remains provenance/hugeicons-LICENSE.txt.

### Shared route studio imagery — 2026-09-05

- Owner authorized ImageGen assets and a Home-inspired hero system across routes. Add three conceptual studio images under static/assets/images/lead: day-night-studio-cars-v1.webp, day-night-studio-keys-v1.webp and day-night-studio-guide-v1.webp. These are decorative illustrations of automotive subjects, not evidence of specific inventory, business premises or owned facilities. Vehicle detail galleries retain the typed inventory photographs.
- Built-in ImageGen source PNGs are retained at C:/Users/radev/.codex/generated_images/01a06e17-cc86-76a2-a8d2-0267e576c5ff/: cars exec-c2eeb8f8-f80b-4107-b9ec-201551c60643.png; keys exec-d84e1f90-150e-4469-a489-c429a6836591.png; final guide exec-5ab2107d-b970-421c-ba85-bb3f76c32222.png. Convert to1200px WebP quality86. Full prompts and rejected iteration notes: artifacts/route-heroes/prompts.md.
- Existing route backgrounds remain referenced by the compact mobile layouts. Strict asset inventory increases from64 to67; retain missing/unreferenced/retired checks without exceptions.

### Centered route hero reference assets — 2026-09-05

- Owner explicitly requested the supplied About/Contact composition and the Kristian portraits from their other project. Reference inputs are the exact `about-kristian-v1.png`, `contact-kristian-phone-v1.png`, `about-showroom-v1.png` and `contact-email-v1.png` assets in the sibling `bohemcars-style/static/assets/daynight/banners` directory. Preserve that source project unchanged.
- Built-in ImageGen adapted only the backgrounds to opaque white for this project's light-gray surface, with instructions to preserve identity, pose, clothes, tattoos and object details. Exact prompts and generated source PNG paths are retained in `artifacts/route-heroes/centered-assets.json`. These are adaptations of the owner-selected reference imagery, not newly verified photographs of the person or business. The showroom remains a conceptual decorative image, not a claim about owned premises.
- Runtime outputs are `day-night-about-kristian-v1-light.webp`, `day-night-contact-kristian-phone-v1-light.webp`, `day-night-about-showroom-v1-light.webp` and `day-night-contact-email-v1-light.webp` under `static/assets/images/lead`, encoded at900px width, WebP quality88. CSS multiply blends the opaque white ground; no transparency claim. Strict runtime inventory increases67 to71 with all four assets referenced by the shared hero component.

## Selected YouTube video thumbnails — 2026-09-05

Owner requested automotive videos from https://www.youtube.com/@kristiankirilov1355/videos on the homepage. The three selected videos belong to Kristian Kirilov; their YouTube descriptions link Day & Night Auto Group. Original 720x404 thumbnails were copied without visual modification for the corresponding video cards, with direct links and click-activated YouTube privacy-enhanced players. These are third-party channel assets, not stock media or identity-neutral reusable template assets. No ownership or wider reuse license is asserted.

- `static/assets/images/lead/day-night-video-urus.jpg`: https://www.youtube.com/watch?v=6S3dLIgeAT8 — original title `НАЙ-ЖЕЛАНАТА КОЛА В БЪЛГАРИЯ | LAMBORGHINI URUS`, 23:19.
- `static/assets/images/lead/day-night-video-panamera.jpg`: https://www.youtube.com/watch?v=zG6rjLpT4u8 — original title `ПРОДАДОХ НАЙ-НОВАТА ПАНАМЕРА`, 14:33.
- `static/assets/images/lead/day-night-video-g-class.jpg`: https://www.youtube.com/watch?v=w_XaGmIWJFM — original title `КАКВА Е РАЗЛИКАТА в G-КЛАСИТЕ`, 23:03.

Exact thumbnail URLs and channel metadata: `artifacts/video-section/channel-videos.json`. Watch-page metadata and original downloads are retained under `artifacts/video-section/`. Card title capitalization is normalized; no dates, views, stock availability or vehicle facts are inferred. Strict asset count increases from the current 71 to 74 with these three referenced files; missing, unused and retired-file checks stay intact.

## Cars red / About charcoal artwork — 2026-09-06

Owner approved the discussed route palette: deep red Cars, charcoal About, existing light Home/Contact/Blog. Built-in ImageGen edited the backgrounds of existing silver Audi, graphite BMW, showroom and Kristian portrait assets; all original light assets remain unchanged. No new vehicle or person is introduced. Outputs are decorative hero artwork, not inventory evidence or a new factual showroom claim.

- `static/assets/images/lead/day-night-silver-color-v1.webp` and `day-night-graphite-color-v1.webp`: solid deep-red background variants of the existing hero vehicles.
- `static/assets/images/lead/day-night-showroom-color-v1.webp` and `day-night-portrait-color-v1.webp`: charcoal variants of the existing About artwork.

Exact built-in output PNG paths and full prompts: `artifacts/hero-colors/prompts.md`. Original generated PNGs remain at those paths. Runtime derivatives use WebP quality90 with original output dimensions. The first transparent-output attempts were rejected after metadata/visual inspection; no checkerboard output is used. Four additional explicitly referenced assets increase the strict guard from74 to78; no guard rule is removed.

## Yellow editorial artwork — 2026-09-06

Owner requested a yellow or black editorial hero as part of desktop consistency polish. Warm yellow was selected for the local preview. Built-in ImageGen adapted the backgrounds of the existing guide/car and keys illustrations; original light images remain intact. New decorative variants are `static/assets/images/lead/day-night-guide-yellow-v1.webp` and `day-night-keys-yellow-v1.webp`, 1536x1024 WebP quality90. They do not establish inventory or business facts. Full prompts, reference paths and generated PNG originals: `artifacts/desktop-hero-parity/prompts.md`. Strict inventory increases78 to80 with both new files referenced; all missing, unused and retired-media checks remain active.

## Contact social links and YouTube mark — 2026-09-06

Use Day & Night's Instagram `https://www.instagram.com/dayandnight_autogroup/` and Facebook `https://www.facebook.com/deninoshtautogroup/`, explicitly labelled as the dealership profiles in all three saved owner-channel video descriptions (watch IDs6S3dLIgeAT8, zG6rjLpT4u8, w_XaGmIWJFM). YouTube points to the owner-supplied Kristian Kirilov channel already used by the homepage videos. Extracted source descriptions: artifacts/banner-social-correction/social-source-descriptions.txt; originals remain under artifacts/video-section.

Contact reuses the existing Instagram/Facebook brand glyphs and replaces TikTok with the unmodified YouTube SVG path from Simple Icons15.16.0, https://cdn.jsdelivr.net/npm/simple-icons@15.16.0/icons/youtube.svg . Source copy under artifacts/banner-social-correction/youtube.svg; CC0 license retained in provenance/simple-icons-LICENSE.md. Marks identify outgoing platforms; no endorsement is asserted. Native SVG component only, no new public media or runtime dependency. Assets remain80/80.
## Contact red artwork and unified panel — 2026-09-06

Owner requested a stronger Contact banner palette and cleaner contact actions. Built-in ImageGen adapted the two existing white-background Contact assets for the deep red desktop banner. Original light images remain referenced by other topic routes and unchanged. New runtime files: `static/assets/images/lead/day-night-contact-phone-red-v1.webp` and `day-night-contact-email-red-v1.webp`, 900px width, WebP quality92. These remain decorative adaptations of owner-selected imagery, not newly verified photographs. Backgrounds are opaque; CSS masks soften their edges. No transparency claim.

Original PNGs retained under `C:/Users/radev/.codex/generated_images/01a07346-600e-7d30-98bd-4de7a0f098cb/`: phone `exec-3a67db00-cfe5-48cb-a1cc-5653b1b553e3.png`, laptop `exec-06f9eb2a-e608-440a-9b25-54a6bde2b701.png`. Full prompts: `artifacts/contact-brand-polish/prompts.md`. Strict referenced asset inventory increases80 to82; all missing/unreferenced/retired-media checks remain active.

## Distinct desktop hero photography — 2026-09-06

Owner requested distinct red/black Home and Cars banners, horizontal About service cards, and replacement of weak floating artwork. Three new decorative concept images were generated with built-in ImageGen, converted without cropping or compositing to WebP quality88:

- `day-night-home-black-v1.webp`: silver and graphite SUVs at the edges of a near-black studio scene; 41,178 bytes.
- `day-night-about-detail-v1.webp`: silver headlight and black leather seat crops around a charcoal centre; 90,850 bytes.
- `day-night-contact-detail-v1.webp`: headlight and steering wheel crops around a red centre; 57,966 bytes.

These are decorative generated automotive imagery, not verified inventory, staff, or dealership premises. Empty alt text is intentional. Sources remain in `C:/Users/radev/.codex/generated_images/01a0765b-ad08-7212-87fc-26d994a95432/`: `exec-e893aedb-d88d-47b9-831d-9500f2064b7f.png`, `exec-81878ded-70f5-451c-b901-ac5e853001ba.png`, and `exec-d3ff6907-066d-45dc-a6c8-f1cd4cf86630.png`. No historical artwork was overwritten or deleted. The strict asset count moves from82 to85 with all guard checks retained. Desktop picture sources select the new media; CSS crops them to the banner without image deformation or edge masks.

## Coordinated transparent vehicle system — 2026-09-06

Owner approved whole-vehicle cutouts with matching scale and studio lighting across desktop heroes and service banners. Four new built-in ImageGen originals (silver SUV, graphite SUV, black G-Class style, white Urus style) are encoded as 1000×667 alpha WebPs, without cropping or compositing. Shared Svelte components use `object-fit: contain`; no edge masks or colored backdrop blends. These are decorative concept vehicles, not stock representations. Full source filenames, prompts, encoding and reuse notes: [vehicle-cutouts-2026-09-06.md](provenance/vehicle-cutouts-2026-09-06.md).

The previous About and Contact close-up WebPs are preserved in `provenance/superseded-hero-art/`; the Home photographic image remains for the existing compact mobile treatment. Runtime inventory changes from 85 to 87 (four additions, two archived), with every missing, unreferenced and retired-asset check retained.

## True side-profile replacement — 2026-09-06

Owner explicitly requests broadside vehicles entering from the edges across the site. Four new transparent assets generated with built-in ImageGen replace the four runtime cutouts in place. The former three-quarter WebPs are preserved unchanged in `provenance/three-quarter-cutouts-2026-09-06/`. Runtime count remains87; no guard checks change. Source images, exact prompts, encoding and usage are recorded in [vehicle-side-profiles-2026-09-06.md](provenance/vehicle-side-profiles-2026-09-06.md). The shared components use these decorative assets in existing desktop heroes, mobile Home/Sell/Import heroes, and campaign banners. Actual inventory photos remain unchanged.

## Distinct route vehicle pairs — 2026-09-06

Eight owner-requested transparent side-profile cutouts provide hatchback, sports-car, sedan and coupe pairs for the desktop Inventory, About, Useful and Contact heroes. Home retains G-Class + Urus. Sources, exact prompt, encoding and alignment metadata are recorded in [hero-vehicle-pairs-2026-09-06.md](provenance/hero-vehicle-pairs-2026-09-06.md). Eight additions plus concurrent mobile artwork bring the strict runtime inventory to96, with all guard checks preserved.


## Front-facing mobile hero — 2026-09-06

The owner requests one centered, front-facing car on mobile. Reuse the earlier built-in ImageGen concept from C:/Users/radev/.codex/generated_images/01a07659-6187-72f1-93fb-86d9cab0fbbc/exec-e740c9aa-5d8c-464c-aa2b-8d7582fb33e2.png. Original and prompt notes remain in artifacts/mobile-front-preview/README.md. Encode proportionally to600x600 alpha WebP at quality90/alphaQuality100, without cropping, repainting or compositing, as static/assets/images/lead/day-night-urus-front-v1.webp. This is decorative generated imagery, not inventory photography.

This task adds one referenced runtime asset. Concurrent desktop artwork work adds eight separate assets, bringing the combined strict inventory to96. All missing, unreferenced and retired-file checks remain enabled. The mobile cutout is used by the shared Home/Sell/Import hero; desktop pair assets are preserved. Mobile campaign cards reuse existing icons instead of car cutouts.

## Front-facing collection lineup — 2026-09-06

Owner requested more complete cars and a distinct front-facing composition for the collection banner below the Home hero. New generated decorative three-car lineup, alpha-preserving1200x400 WebP; source and edit history are recorded in [collection-lineup-2026-09-06.md](provenance/collection-lineup-2026-09-06.md). Existing media preserved. Strict runtime inventory97; all missing/unreferenced/retired checks remain active.

## Larger coordinated collection/sell artwork — 2026-09-06

Owner rejected the small lineup and repeated sell G-Class. Replace the first banner pair with a larger two-car front composition and a different silver-blue coupe at a front three-quarter angle. True alpha cutouts normalized to equal visible height and wheel baseline. Prompts, originals, encoding and archived prior lineup: [browse-campaign-pair-2026-09-06.md](provenance/browse-campaign-pair-2026-09-06.md). Strict inventory98; all guard checks retained.
