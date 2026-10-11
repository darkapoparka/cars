# App surfaces and vehicle drawer source candidate

The owner accepted the soft-grey treatment and requested App source publication on 11 October 2026. This candidate standardizes light-page search, quick pills, neutral icon actions and Menu groups through the existing StyleX tokens. Original grey service cards remain; grey/dark banners and photo actions retain white controls. The monthly card amount keeps its configured currency and uses muted supporting text. No page background or approved composition was changed.

Collection vehicle links open the shared detail component in a responsive drawer. Filter state, scroll, focus, Back/Forward, reload and canonical sharing are retained. Static reference snapshots are requested for the selected template vehicle only; dealer drawers use configured inventory. Services loses its top-level header back action. UK App personalization keeps descriptive illustration alt text and one configured inventory/detail notice while removing repeated image stamps.

Current-source integration checks passed using Node 22.23.2: full ESLint, TypeScript, 149 App regressions, 11 UK personalization tests, dealer validation, and production compilation/static generation of 431 pages. The build reuses the task's bounded output on C: through its existing preview-independent output path after L: exhausted its free space. Generated QA type paths are excluded from publication.

Focused final live-preview checks covered Home, Cars, Menu, Services, alternative Services/Sell/Leasing, Saved and Search. Cars/Menu fit 320px; final surfaces were inspected at 390px and desktop Services/compact Menu at 1440px. Category selection and dark selected sort were verified. Monthly card typography was inspected at 390px and checked for overflow at 320px.

Earlier drawer browser reports passed at 320/390/1440px: six drawer checks, three share/filtered-return checks and twelve Home Back checks. Those reports predate the final surface/monthly cosmetic correction and remain supporting behavior evidence, not a hosted receipt for the new source.

Bounded local evidence is retained in `runtime/app-surfaces-20261011`: `HANDOFF.md`, compact browser reports, final grey Cars/Menu captures, the retired white comparison, and the matched monthly before/after pair. The handoff records exact file hashes and the immutable source publication. Preserve shared generator files' upstream Mobile mileage corrections.

This is source delivery for the all-six release pilot. Global `templates.lock.json` remains unchanged. No dealer is refreshed or deployed by this source publication; mounted single-Worker hosted qualification and fleet release selection remain with the fleet integrator under the current contract. The dirty shared local checkout could not fast-forward without overwriting unrelated work, so source publication uses a fresh GitHub main parent and expected-head lease, without changing the shared local index/ref.
