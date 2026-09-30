# Desktop discovery restoration

The stock-count filter introduced in the homepage data removed zero-stock types and brands from desktop, reducing the grids to four types and three brands. Desktop now uses the complete existing artwork catalog: eight types in two rows of four and twelve brands in two rows of six. Mobile continues to use stock-based shortcuts and its existing expansion behavior.

Changed source: `src/lib/data/home.ts`, `src/lib/components/home/BodyTypes.svelte`, `src/lib/components/home/BrandSection.svelte`.

Verified in the in-app browser at 1440px and 992px: both desktop sections have two rows. At 320px, body-type expansion shows four stocked types, brands retain three stocked brands plus View all, and there is no horizontal overflow.

Screenshots: `body-types-1440.png` and `brands-1440.png`.

Validation: CSS policy, domain checks, Svelte check (zero errors/warnings), and production build passed using Node 22. Existing unrelated changes were preserved. Commit/push remains blocked by the pre-existing repository `.git/index.lock`; it was not removed.
