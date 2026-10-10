# Tinted desktop heroes — 4 October 2026

This follow-up implements the requested hero containers in the Import master. It replaces the earlier shared hero/body colour and plain About/Contact action rows. It is actual source rendered by a frozen production build, with no injected CSS.

From 768px, all `PageIntro` routes use an inset frame with 24px rounded corners and the blue-grey `--bc-desktop-hero-surface` (`#e5edf4`). The header and page canvas remain grey (`#f2f4f7`); discovery panels and content cards remain white. About and Contact use `DesktopHeroActions` to compose the existing `DesktopDiscoveryPanel`, containing both primary actions and their secondary destinations. Article headings use the shared tint within their existing desktop card. Product details retain their existing framed composition and the preceding Sofia banner alignment.

The shared heading anchor, responsive minimum height, vehicle artwork, native links and content/configuration owners remain intact. Mobile heroes and About's independent mobile composition retain their previous visible presentation.

| Page    | Before                           | After                           |
| ------- | -------------------------------- | ------------------------------- |
| About   | [Screenshot](about-before.jpg)   | [Screenshot](about-after.jpg)   |
| Contact | [Screenshot](contact-before.jpg) | [Screenshot](contact-after.jpg) |

Verified with Node 24.21.0 and the retained npm lockfile:

- Svelte: zero errors and warnings; scoped Prettier, ESLint and architecture checks passed; production build passed.
- Production captures: 17 routes at 1440px, each containing the rounded tinted hero, with HTTP 200, no page errors and no horizontal overflow. Routes cover Home, Inventory, Services, About, Contact, Import, Sell, Financing, Favorites, Compare, Reviews, FAQs, Blog, Article, Locale, Privacy and Calculator.
- Seven focused browser tests passed, covering shared BG/EN hero frames at 768/1440/1920px, native page actions, Home artwork tabs at 768/1024/1440/1920px, buying-panel contrast, About socials and Contact form/layout/accessibility. The initial combined run passed five tests; the two 24-navigation hero tests exhausted their 45-second budget during concurrent capture. Both passed on a separate run with a 120-second limit in 18 seconds, with no source changes.
- Matched production mobile evidence: eight affected routes in BG/EN at 320/390px, 32 comparisons with identical complete visible presentation and local pixels. Iframes are masked and remote photo pixels excluded consistently. Existing Home lazy/remote image misses occur identically before and after; external image delivery is outside this comparison.

[Verification and source hashes](verification.json) record the eight current source/test inputs, which match the frozen build copy. Full captures and probes remain in ignored `runtime/tinted-heroes-2026-10-04/`. [Desktop styling](../DESKTOP-STYLING.md), [Architecture](../ARCHITECTURE.md) and [QA](../QA.md) describe the current owners.

This is local implementation evidence. It does not promote a template release or deploy a dealer. The shared Git lock was preserved until it cleared independently; source integration uses a scoped Import commit on `main`. The reviewed path manifest and recoverable binary patch are at `runtime/desktop-continuation/integration-manifest.json` and `owned-final.patch`. Verification JSON records the earlier capture-time Git state.
