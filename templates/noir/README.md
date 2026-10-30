# Noir

A dark, minimal luxury dealer template in Svelte 5 and SvelteKit 3. It was written from scratch for Day & Night Auto Group's request for a more luxurious site, and takes its direction (cinematic dark hero, brand row, minimal stock grid, numbered services, enquiry-first car pages) from premium showroom sites without copying any of them.

It has four pages, each in Bulgarian and English:

| Page | Route (default locale / other locale) |
| --- | --- |
| Home | `/` · `/en/` |
| Collection with search, filters and sorting | `/collection/` · `/en/collection/` |
| Car page with specification, equipment, enquiry and similar cars | `/collection/<id>/` · `/en/collection/<id>/` |
| Contact | `/contact/` · `/en/contact/` |

Visitors can switch between a Night (default) and Day theme; the choice is kept in `localStorage`.

## Run

Node 22.17 or newer.

```sh
npm ci
npm run dev        # http://127.0.0.1:6470
npm run check      # svelte-check, strict TypeScript
npm run build      # static site in build/
```

The build is fully prerendered with `@sveltejs/adapter-static` and uses relative asset paths. To mount it under a sub-path, set `BASE_PATH`, for example `BASE_PATH=/variant-7 npm run build`.

## Personalizing for a dealer

Everything dealer-specific sits behind three boundaries:

- `src/lib/config/site.ts`: name, wordmark, accent colour, phone, address, map link, default locale and theme.
- `data/stock.source.json`: the dealer's stock export. Run `npm run stock` to normalize it into `src/lib/data/vehicles.json` (make/model split, numbers parsed, "arriving soon" detected). Photos go in `static/stock/<id>.webp`.
- `src/lib/i18n/messages.ts`: all interface copy in both languages, including services, sell steps and FAQ.

The enquiry forms validate but never send anything; they show a preview notice instead. Wire them to a real endpoint before going live.

## Structure

```
src/app.css                 design tokens (night/day), type scale, buttons, shared utilities
src/params.ts               [[lang]] matcher: only the non-default locale gets a URL prefix
src/lib/config/site.ts      dealer configuration
src/lib/data/vehicles.ts    typed inventory, attribute translations, price/km/hp formatting
src/lib/i18n/               messages and locale-aware links
src/lib/components/         Header, Footer, VehicleCard, EnquiryForm, ThemeToggle, Wordmark
src/lib/reveal.ts           scroll-reveal attachment (no-op without JavaScript or with reduced motion)
src/routes/[[lang=lang]]/   pages
```

## Known gaps

- The Day & Night export only has 280 × 210 photos. Cards look fine, but the car page shows the photo framed on a stage instead of full-bleed. Full-resolution listing photos and a gallery per car are the biggest visual upgrade left.
- Not yet registered in `catalog.json`, `templates.lock.json` or the six-design packaging; it previews standalone only.
- Services, sell steps and FAQ copy are sensible defaults and should be confirmed with the dealer.

See [docs/PROVENANCE.md](docs/PROVENANCE.md) for where the fonts, artwork and stock data come from.
