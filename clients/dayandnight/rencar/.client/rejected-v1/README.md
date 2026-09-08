# Day & Night · Rencar

An independent dealer prototype using Rencar's five homepage compositions with Day & Night's logo, red/black/white palette and media from the current Auto Best preview on port 5173. Home 2 is the recommended entrance.

**[Open the demo](http://127.0.0.1:6601/)** · **[Compare all five homes](http://127.0.0.1:6601/variants.html)**

| Home | Direction | Preview |
|---|---|---|
| 1 | Dark cinematic hero, G-Class and red panel | [Home 1](http://127.0.0.1:6601/index.html) |
| 2 | Balanced copy and large vehicle silhouette; default | [Home 2](http://127.0.0.1:6601/index-2.html) |
| 3 | Centered headline and prominent model search | [Home 3](http://127.0.0.1:6601/index-3.html) |
| 4 | Dark hero with search beside the copy | [Home 4](http://127.0.0.1:6601/index-4.html) |
| 5 | Large Day & Night wordmark and Urus silhouette | [Home 5](http://127.0.0.1:6601/index-5.html) |

The five compositions share the vehicle catalog, detail view, services, about page and direct contact journey. Search/filter/sort choices are stored in the URL and retained through detail and related-model navigation. Rental dates, age fields, daily prices, booking totals and checkout are replaced by dealer discovery and enquiries.

This is the owner's requested trial before shared template polishing. The Rencar master remains a rental baseline. This adaptation is for local review; it has not been published or registered as a new Agency OS demo.

## Run and verify

Tested with Node 24.18.0. Install from the retained lockfile using `npm ci`.

From this project, `npm run dev` uses **6601 with strict port ownership**. If that port already runs this project, use the existing preview. From J:/cars, the equivalent startup command is:

```powershell
./scripts/start-preview.ps1 -Client dayandnight -Template rencar -Port 6601
```

```powershell
npm run check
npm run build
npm run qa:routes
npm run qa:interactions
npm run qa:responsive
```

Browser scripts use local Chrome through Playwright and expect this client's preview at 6601. [QA.md](./.client/QA.md) records the exact scope and results; screenshots and machine-readable evidence are under `.client/qa/`.

## Editing boundaries

- `src/client/data.js`: identity, contacts, services, models, image paths and variant URLs.
- `src/client/client.css`: shared Day & Night colors and responsive client surfaces.
- `src/client/Home.svelte` and `Home.css`: five Rencar-derived hero compositions and shared homepage sections.
- Other `src/client/*.svelte`: native dealer navigation, search, catalog, details, contact and comparison page.
- `src/App.svelte`: explicit client route allowlist. Original rental/account/blog components in `src/pages/` are retained as source material and are not mounted by the client app.
- `public/daynight/`: 18 copied owner-supplied media files; `variants/` contains unmodified screenshots of this prototype.

Do not run the original page generator or capture/verify-source scripts as a client build step: they describe the old Rencar reference. See [TEMPLATE.md](./TEMPLATE.md) for lineage and future reuse.

## Facts and media

The [public contact page](https://daynight.mobile.bg/contacts) was checked on 2026-09-06: **0877 733 110**, Sofia, Studentski grad, ul. Atanas Manchev 18. Visits are presented by arrangement. The donor preview contains a different phone number, so its contact value was not copied.

Six models are a visual showcase, with **“По запитване”** pricing and a link to [current dealer listings](https://daynight.mobile.bg/). They are not synchronized live stock records. Cutouts, studio/showroom scenes and service banners are illustrative assets from the owner's existing concept, not evidence of real premises or availability. Original notes and the exact SHA-256 import manifest are in `.client/provenance/`.

Enquiries use direct telephone and the public dealer contact profile. No message submission, reservation, finance approval or checkout completion is simulated. A public preview needs a separate requested deployment and verification before outreach.
