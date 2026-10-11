# Import country flags

The five original 4:3 SVGs come from [lipis/flag-icons](https://github.com/lipis/flag-icons), retrieved on 4 October 2026 at commit `086f7e97d657358203916dbe84f61c2bccaa81eb`. They are retained unchanged. `sources.json` records each immutable source URL and SHA-256 hash; `LICENSE.flag-icons.txt` retains the MIT notice.

`lib/showroom.ts` configures each import country's local asset. `FilterPill` displays the SVG at 20 × 15px with a small corner radius. The image is decorative because the translated country name already labels the control. Assets use the shared `assetPath` helper for mounted dealer previews. Add a matching permitted flag asset and provenance when adding a country.
