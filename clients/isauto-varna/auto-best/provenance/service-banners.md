# Mobile Sell and Import banners

Reused at the owner's request from the running Cars App template on port 3001:

- Sell: `templates/app/public/showroom/black/home-exchange-v1.png`
- Import: `templates/app/public/showroom/black/home-collection-v1.png`

These are the existing homepage promotion assets referenced by `templates/app/lib/showroom-art.ts`, not newly generated artwork. The App source provenance remains in `public/showroom/black/ASSETS.json`.

The Auto Best copies are encoded as 960px WebP at quality 90, preserving the entire composition and aspect ratio. They are selected independently through `leadSite.artwork.serviceBanners`; desktop assets stay unchanged.
