# Manufacturer emblems — 1 October 2026

These retained/local files identify actual inventory makes. No manufacturer emblem is AI-generated. Dealer identity continues to use each lead's own retained logo.

- Audi, BMW, Chevrolet, Hyundai, Mercedes-Benz and Nissan: original detailed App badges at `public/reference-assets/brand-<make>.png` (`brand-mercedes.png` for Mercedes-Benz). Toyota, Honda, Ford and Kia use the original `sell-brand-1.png`, `sell-brand-2.png`, `sell-brand-7.png` and `sell-brand-8.png`. These files were already retained in the App import; their bytes are unchanged. They include their own circle frame, so the consumer does not add another border or shrink the complete frame inside another circle.
- Volkswagen, Tesla, Peugeot, Opel and Smart: local `*-badge-small.png` copies of the corresponding [Car Logos Dataset](https://github.com/filippofilip95/car-logos-dataset) thumbnail PNGs, downloaded from `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/<slug>.png`. These ready-sized upstream images preserve smooth detail in the narrow brand strip; the larger optimized copies remain alongside them. Their transparent color/chrome artwork supplements makes absent from the original reference badges. The strip positions the symbol above the separate make label without rewriting the image bytes. Haval, JAC and Lexus use the same dataset's existing local PNGs. Upstream image sources are recorded in [the dataset metadata](https://github.com/filippofilip95/car-logos-dataset/blob/master/logos/data.json).
- Land Rover, Mazda and Volvo: existing Cars Carwow master SVG assets at `templates/carwow/static/assets/images/brand/mobile/`, retained unchanged.
- Jeep, MG, Mitsubishi and Suzuki: local [Simple Icons](https://github.com/simple-icons/simple-icons) SVGs downloaded from `https://cdn.jsdelivr.net/npm/simple-icons@16/icons/<slug>.svg`.

The earlier flat replacements for the original badges remain preserved as unused draft assets. They are not selected by `lib/brand-logos.ts` for makes with original detailed badges.

`lib/brand-logos.ts` maps makes to these assets. It covers all current template and Navara inventory makes. When another client introduces a new make, add its real sourced emblem and inspect it in the strip; do not insert a generic car icon.

Optical normalization (1 October): source bytes are unchanged. lib/brand-logos.ts records source dimensions and tightly bounded symbol view boxes, rendered with SVG image elements inside consistent circles. Tesla, Peugeot and Lexus show their complete symbol without repeating the source image's wordmark beneath the separate UI label. Suzuki/Mitsubishi use a smaller optical size; wide marks use a wider slot. Original framed App assets remain unchanged.
