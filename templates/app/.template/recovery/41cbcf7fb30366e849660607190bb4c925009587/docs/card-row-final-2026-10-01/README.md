# Final card row and compact search - 1 October 2026

Supersedes the wrapping-badge layout recorded in `../card-correction-2026-10-01/`. The owner identified inconsistent one-, two- and three-row facts in the live Navara list.

The three facts now occupy one full-width flex row below the image and details. The badges never wrap into separate rows; long descriptions can wrap at word boundaries inside their own badge. Titles use regular 400 weight (15px mobile); prices remain 20px/700 with the euro symbol. There are no forced card minimum heights or space-between gaps. The shared search field is 44px tall with 16px regular text and a 20px icon.

Canonical code lives in `templates/app`; the same components are mirrored into the existing Navara App copy for localhost review. No fleet rollout or Vercel deployment is part of this correction.

## Checks

- Node 22.20.0; `npm run check` for master and Navara (ESLint, TypeScript, production webpack build).
- Navara at 320px and 390px: all nine cards have one badge row, three visible facts and equal 125px heights; no horizontal page overflow. Search remains 44px before and after filtering.
- Searching Mercedes returns one car; clearing restores nine.
- Master inventory: all 48 cards retain one badge row and no clipped badge text at narrow/mobile and desktop widths. Longer labels wrap within a badge without splitting words.
- Screenshots include the Mercedes/Opel/Audi section from the owner's report and the compact search at the top of the feed.

Production preview outputs are isolated from previous runs. Historical screenshots and builds are preserved.
`npm run check` passed on the master. Navara lint/typecheck passed; its production build was rerun successfully after a transient Windows write error on generated next-env.d.ts. Final preview output: .next-card-word-check.

## Commit status
Scoped staging was not started because L:/CODEX/cars/.git/index.lock remained present (0 bytes, 11:10:24 local) while other Git status/push processes were active. No lock was removed or bypassed and no other staged work was touched. Canonical source and evidence remain in the working tree; commit and push are pending the index becoming available.
