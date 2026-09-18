# Removed template runtime — 12 September 2026

The raw `.template-ref` HTML kit, string renderer, legacy dashboard UI, and unused Swiper/Fancybox distribution files were removed after confirming that no native application route loaded them. Historical staff URLs remain redirects. The active storefront and its existing styles are retained.

Source lineage remains in `.template/source-manifest.json`, `.template/template.json`, `.template/source-readme.md`, and `docs/REPO-SPLIT.md`. This removal does not establish new redistribution or multi-client asset rights. Existing attribution files, including the mobile icon license, remain in the repository.

The old one-off mobile probes are superseded by the reproducible browser audit and Playwright regression suite. Original source and the complete dirty working tree were backed up outside the repository before editing; the local audit records that location.

## Retained notice from the removed Swiper distribution

```text
/**
 * Swiper 6.8.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2021 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: August 3, 2021
 */
```
