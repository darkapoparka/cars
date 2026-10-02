# Boxcars showroom banner

Generated on 2 October 2026 with the built-in imagegen tool. This is an illustrative showroom concept, not verified dealer premises or an inventory photograph. The tool manages the image model; no CLI or separate API model was selected.

Runtime asset: `public/media/showroom/boxcars-showroom-v1.webp` — opaque 960 x 540 WebP, quality 90, 95,868 bytes.

Original: `C:/Users/radev/.codex/generated_images/01a0f987-7986-7983-bb45-6c1286ac06ad/exec-9851d61c-b7b0-4625-a487-3c3781aaf7c4.png` — 1672 x 941. The original is preserved. Export used a centred 16:9 resize, with no creative retouching.

Reference: `public/media/services/boxcar-browse-v1.webp`, viewed locally before generation. This matches the white estate / slate-blue SUV finish and palette of the existing service artwork.

## Final prompt

Use case: photorealistic automotive website showroom banner. Create an original premium dealership interior concept for the Boxcars demo, using the attached two-car cutout ONLY as the reference for realistic vehicle finish, understated styling and the white / slate-blue palette. A bright contemporary glass-fronted car showroom with soft natural daylight, clean light-grey polished concrete floor, slim dark metal window frames, a restrained deep slate-blue architectural accent, and two unbadged contemporary European vehicles: a pearl-white sporty estate on the left and a slate-blue compact SUV on the right. Both are fully visible from gentle front three-quarter views, parked side by side with realistic wheel contact and natural shadows, a little breathing space between them. Eye-level commercial automotive photography, believable scale and subtle reflections, crisp premium materials. The cars form a compact central grouping with all roofs, mirrors, bumpers and wheels inside the central 75 percent of the canvas. Compose for a WIDE 16:9 crop of a LANDSCAPE canvas, with important content inside the central 56 percent of the canvas height: this will be a small 278-pixel-wide banner, so make the vehicles large enough to read clearly, and keep the background architectural and uncluttered. Calm blue-grey, white and warm-neutral tones; natural photographic contrast, no artificial glow. This is an illustrative showroom concept, not a photograph of verified dealer premises. No people, text, signs, logos, brand badges, watermarks, writing on number plates, finance symbols, icons, UI, borders or frames. Do not bake in Boxcars lettering: the dealer name will be live HTML under the image. Output an opaque, coherent photographic image with a real showroom background, not transparent cutouts or a collage.

## Application and personalization

`src/data/brand.ts` owns the optional `showroomBanner` image and descriptive alt text. Replace it with a permitted dealer image during personalization, or set it to null. `src/components/ShowroomCard.svelte` renders the configured image with the live dealer name, short viewing copy and a contact action. The name and any real logo remain HTML/original assets rather than generated lettering.

Vehicle details show this card inside the desktop price sidebar. At 760 px and below the dealer card moves after Features, before the finance estimate, leaving the gallery near the top. Only one version is visible at each width. Contact opens `/contact/?intent=viewing` and preselects Arranging a viewing; enquiry and repayment actions retain their existing behavior.

No dealer address, phone, staff, testimonials, inventory availability or social profiles were invented.
