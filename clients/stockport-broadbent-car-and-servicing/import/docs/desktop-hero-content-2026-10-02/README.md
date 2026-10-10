# About and Contact desktop hero follow-up

The later [black right-hand action follow-up](action-update/README.md) supersedes the grey button treatment. The [final desktop polish](final-polish-2026-10-03/README.md) adds quieter About socials and portrait crops, and removes Contact's repeated channel cards. The live comparison gallery shows that final update; this receipt and its original screenshots retain the earlier hero-content implementation evidence.

The owner requested social icons below About's white action panel and useful content in Contact's empty hero center. About now shows the configured Facebook, Instagram and TikTok links. Contact now shows the localized dealer address, a Google Maps directions link and the configured Viber message shortcut. Centered headings, white primary-action panels, red actions and automotive artwork keep their existing positions.

## Ownership

- About composes the existing `SocialLinks` through `PageIntro`'s `desktopSecondaryActions` slot, with 48px targets.
- `ContactHeroDetails.svelte` composes the localized dealer address and existing `Action` glass buttons. Directions/channel labels and destinations retain `contact-desktop.ts`, `dealer-copy.ts` and site configuration as their owners.
- New presentation consumes existing spacing, typography, surfaces, radius and action tokens. No new brand colors, dealer values, font scale or route-specific override system was introduced.
- Mobile's About trial, Contact composition, footer and existing primary actions are preserved.
- Existing desktop and typography tests now cover the requested hero social placement and Contact's configured destinations; their prior no-hero-social expectations are superseded by this request.

## Before and after

[Interactive gallery](http://127.0.0.1:6794/hero-content/) · [Portable gallery](screenshots.html)

| Route      | Before                              | After                              |
| ---------- | ----------------------------------- | ---------------------------------- |
| About BG   | [Screenshot](before/about-bg.png)   | [Screenshot](after/about-bg.png)   |
| Contact BG | [Screenshot](before/contact-bg.png) | [Screenshot](after/contact-bg.png) |
| About EN   | [Screenshot](before/about-en.png)   | [Screenshot](after/about-en.png)   |
| Contact EN | [Screenshot](before/contact-en.png) | [Screenshot](after/contact-en.png) |

Desktop images are matched at 1440 × 680px. Before captures came from the canonical development server; final after captures use the frozen production preview. Mobile full-page captures are retained for BG at 390px. Detailed BG/EN element probes cover both routes at 320/390/768/1024/1440/1920px.

## Verification

Node 24.21.0 and the retained npm lockfile were used. The existing frozen QA directory is `C:/Users/radev/AppData/Local/Temp/cars-import-desktop-contact-about-services-2026-10-02`; the active canonical preview at 6790 was preserved.

- Svelte/TypeScript: 0 errors, 0 warnings.
- Scoped ESLint and Prettier: passed.
- Architecture: 57 native routes, 227 reachable modules and one Tailwind generation entry.
- Asset signatures and production build: passed.
- Existing browser suites: **73 passed, 27 intentional viewport skips, 0 failures** across desktop-page-patterns, typography-contact, smoke and mobile-secondary, using the frozen production preview.
- Unit tests: **124 passed in 18 files**. Windows memory exhaustion interrupted the first unit attempt; its log was retained and the unchanged source passed after memory pressure cleared.
- Production responsive inspection: **24 states, 0 overflow, broken images or page errors**. All **8 mobile states match the baseline exactly** for visible content, links, images, typography, colors, spacing and geometry. All **16 desktop states retain the exact hero frame and title presentation**.
- Manual browser checks: configured destinations, keyboard order/visible focus, About-to-Contact navigation, Contact enquiry anchor/input and Axe checks passed in BG/EN.
- The five source/test owners match the frozen tested bytes. The npm lockfile is unchanged; detailed hashes and retained logs are in `verification.json`.

`before-matrix.json`, `after-matrix.json`, `preservation.json` and `interactions.json` retain viewport, element, focus and destination evidence. Keyboard checks reach every new link in DOM order with a visible outline. About social URLs match the existing footer; Contact directions and message URLs match the existing location/channel owners. About-to-Contact navigation and the Contact enquiry anchor/input were exercised. Axe's WCAG 2 A/AA and 2.1 AA rules report no violations in either public main region, in both languages.

External Maps rendering and launching the installed Viber app are outside this local browser verification. No external message was sent. This follow-up does not establish mounted/hosted acceptance, a template release or dealer rollout.

## Git integration

Work remains in the saved Cars `main` checkout. The scope includes only these hero owners, their existing tests, authoritative documentation and this receipt. The final handoff records the scoped commit and non-force push result. The Cars workspace doctor fetched current tracking refs before integration; unrelated Cars Admin divergence was preserved. Inherited Import ignore edits, older untracked drafts and unrelated Cars changes remain outside this task's scope.
