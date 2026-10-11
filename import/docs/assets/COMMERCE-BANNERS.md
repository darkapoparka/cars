# Commerce banner artwork

The owner's reference is the rendered Cars App template at `http://localhost:3001/bg/`. Campaign banners use the same charcoal composition, clear automotive subjects, live HTML headings and white pill actions. Article covers use the reference's bright silver/white service artwork. Assets illustrate services, not available inventory or an actual dealer location.

The existing reference images are Cars-owned generated artwork. Their source paths and generation records remain in `templates/app/public/showroom/black/ASSETS.json`, `PROMPTS.md` and `SELL-PROMPTS.md`. The App originals and all superseded Import assets remain intact.

| Import asset under `static/assets/daynight/`       | Reference under `templates/app/public/showroom/black/` | Consumers                                      |
| -------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| `services/sell-commerce{,-small,-large}.webp`      | `home-exchange-v1.png`                                 | Sell service, menu, desktop home sale campaign |
| `banners/commerce-collection{,-small,-large}.webp` | `home-collection-v1.png`                               | Shared selection/import campaign               |
| `banners/commerce-visit{,-small,-large}.webp`      | `home-visit-v1.png`                                    | Homepage consultation, shared contact banner   |
| `banners/commerce-finance{,-small,-large}.webp`    | `home-finance-v1.png`                                  | Desktop home finance campaign                  |
| `blog/article-inspection.webp`                     | `sell-history-tool-v1.png`                             | Import inspection guide                        |
| `blog/article-appraisal.webp`                      | `sell-photo-tool-v1.png`                               | Customer appraisal guide                       |
| `blog/article-registration.webp`                   | New built-in image generation described below          | Registration guide                             |

Campaign exports preserve the complete source composition at widths 360, 720 and 1080, WebP quality 85. Article exports preserve the complete composition at width 1320, quality 85. Article cards use `object-fit: contain` so documents, wheels and service props remain visible. Blog detail and metadata consume the same centralized `posts[].image` paths.

`CommerceBanner.svelte` is shared by homepage campaigns and the menu. It preserves existing destinations and adds English locale queries consistently. The Sell card retains its valuation dialog callback and VIN/manual entry modes.

## Registration cover

Mode: built-in `image_gen`, opaque background, one style reference. No CLI/API fallback.

Reference: `L:/CODEX/cars/templates/app/public/showroom/black/sell-history-tool-v1.png`.

Original: `C:/Users/radev/.codex/generated_images/01a0f0be-6d76-7612-9860-81094b9562f8/exec-6222bd93-47c7-4374-b9d8-2147ef53b816.png`.

Project output: `static/assets/daynight/blog/article-registration.webp`.

### Exact prompt

Use case: design-led automotive commerce article cover. Reference image is a STYLE AND MATERIAL REFERENCE, not an edit target: match its clean pearl-white studio environment, photographic silver crossover, neutral silver/charcoal 3D service props, gentle contact shadows and restrained curved gray backdrop. Create ONE new wide 16:9 article cover about preparing a car's registration documents. A realistic complete unbranded silver crossover front three-quarter view in the lower middle, occupying 60% of width. Behind and above the car on the right, one neatly stacked white document folder with a large simple charcoal checkmark and one modest black key fob beside it. Car and objects form a clear product campaign composition, comfortably inside the frame with breathing room. This should read like a carefully composited automotive ecommerce service graphic, consistent with the supplied reference, bright and recognizable at small card size. No people, no hands, no money, no calculator, no cinematic dealership setting. No readable text, numbers, fake plates, typography, logos, badges or watermark. Avoid excessive sparkles, disconnected floating props or cartoon cars. Natural photographic automotive detailing and premium simple studio lighting. No UI controls; article title will be HTML.
