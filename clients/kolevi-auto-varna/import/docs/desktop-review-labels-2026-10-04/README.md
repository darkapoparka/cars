# Desktop testimonial labels — 4 October 2026

The owner asked for short, single-line text beneath testimonial names. Home now uses Клиент, Внос and Продажба. Reviews uses Клиент, Покупка, Доставка and Оглед, selected from existing review content. English uses the same concise categories. Names, avatars, quotes, card styling and mobile copy are unchanged.

[Before/after comparison](http://127.0.0.1:6795/review-labels.html) · [Live Home](http://127.0.0.1:6790/bg) · [Live Reviews](http://127.0.0.1:6790/bg/reviews)

## Ownership

Typed roleKind metadata lives beside the existing review data. BG/EN labels have one owner in src/lib/content/reviews.ts; ReviewCard renders the localized desktop label on Home and Reviews. From 768px it uses one line with the existing typography tokens. Original role strings remain available to compatibility consumers and the mobile card; Home keeps its compact mobile label. No palette, font, asset, testimonial claim or interaction contract changed.

## Screenshots

| View              | Before                           | After                           |
| ----------------- | -------------------------------- | ------------------------------- |
| Home testimonials | [Screenshot](before-home.png)    | [Screenshot](after-home.png)    |
| Reviews grid      | [Screenshot](before-reviews.png) | [Screenshot](after-reviews.png) |

Before uses canonical Import source at 6861dad21711ef36b0954df33eccc456e094ba3d. After uses the frozen production build. Captures wait for fonts and visible images to decode; no screenshot styles are injected.

## Verification

The frozen source manifest covers 1679 application/configuration/test/asset paths with digest 834ee026103be0246b045b31f12b372738ff149b6f24f097de837fb3e123b714. The QA copy has its own npm ci and build output, without environment-secret, Git or deployment bindings. [source-changes.json](source-changes.json) records the six changed source hashes and retained lockfile hash; [verification.json](verification.json) records checks and screenshot hashes.

Svelte reports zero errors/warnings. Scoped formatting/lint, full ESLint, architecture, assets, 124 unit tests and the production build pass. Full npm run verify stops on the same three untouched formatting files: public-assets.policy.json, scripts/public-asset-retention.mjs and svelte.config.js. Subsequent gates passed separately.

Twenty-eight before and twenty-eight after responsive states, plus four production captures, have no response, page-error, overflow or image-decoding failures. All twelve matched BG/EN mobile Home/Reviews/About PNGs and complete-page presentation records at 320/390px are identical. Seventy-two label measurements across 768/1024/1440/1920px confirm one fully visible line. Four JavaScript-disabled page checks and four WCAG A/AA accessibility scans pass. The existing desktop/mobile review-avatar and article-navigation browser journey passes both cases without failures or retries.

Raw evidence and frozen QA remain at C:/Users/radev/.codex/tmp/cars-import-review-labels-2026-10-04/. Only task-owned source/docs are integrated on Cars main; inherited ignore/evidence/asset drafts and other Cars work are preserved. These standalone master checks do not constitute owner visual acceptance, template promotion or dealer deployment.

The initial build failed with ENOSPC while copying static assets. The complete task-owned QA directory was moved to L:\CODEX\cars\templates\import\runtime\desktop-review-labels-2026-10-04\qa, retaining its original C: path through a junction. A junction-based retry encountered a C:/L: Vite manifest path mismatch; building directly from the physical L: directory passed. All three attempt logs are preserved. No user data or other task output was removed.

Integration encountered an unchanged zero-byte index lock from 00:20:32. After confirming no active Git index writer, it was moved intact to this task's runtime recovery directory with inspection metadata. The existing index and unrelated staged/unstaged work were preserved.
