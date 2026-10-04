# Centered menu language footer — 4 October 2026

Requested change: move English/Bulgarian to a centered bottom segment, make it slimmer, and remove the independent-preview paragraph from the menu.

Implemented in `app/[locale]/more/page.tsx`: a flexible minimum-viewport-height page, a normal-flow footer with automatic top spacing, and the existing localized links and active-locale semantics. The visible rail is configured at 36px, each label pill at 32px and text at 13px regular weight. The links keep 44px hit targets and dark inset keyboard-focus outlines. There is no fixed language overlay to cover menu rows on short screens. The visible Language heading and menu notice are removed. Existing menu links, configured contacts and dealer identity remain in place.

The 6483 development preview was restarted with Node 22.20.0 through Next's webpack dev command. Its log reports Ready and the port is listening. This establishes runtime startup, not rendered route acceptance.

`npm run check` passed: ESLint, TypeScript and the isolated `.next-build-check` production webpack build, including all 407 generated pages. The generated `next-env.d.ts` imports were restored to the live `.next/dev/types` paths afterward. Scoped `git diff --check` also passed.

Browser access was rejected by automatic browser security review, which reported a URL-protocol restriction for the existing local preview. No workaround, alternate browser surface or raw browser command was used. Screenshots and rendered BG/EN checks at 320px, 390px and desktop remain pending manual review. Earlier screenshots and verification records in this folder cover the preceding grouping/text-only revisions.

At the original check, the shared Cars `.git/index.lock` blocked the commit. During the owner's subsequent request to publish this preview, the unchanged empty lock was confirmed orphaned: no Git writer or open handle remained. The lock and previous index were preserved under `runtime/app-publish-20261004/git-recovery/` before recovering normal scoped commits. Fetched Cars main had no drift and the staged index was empty. Publication status is recorded separately; this implementation check did not promote a template release or update dealers.
