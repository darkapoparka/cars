# Home search and quick-filter correction, 9 October 2026

The prior mobile sizing change shrank the Home search field and removed the inset around its search icon. It also made the quick-filter button circular beside rounded rectangular price links.

Restore the original 48px search field, 44px search tap target and inset 36px dark circle with its original 20px icon and 2.25px stroke. The Home quick-filter button now uses the same row styling as the price links: 44px high, white fill, no border and 12px corners. Its 20px utility icon and filter action remain intact.

Only MobileSearchControl.svelte and HomeFiveHero.svelte change. Existing 44px mobile utility controls remain as reviewed.

Rendered BG/EN checks passed at 320px and 390px on the local dev server and frozen production build. The matched 1440px desktop Home screenshot has zero changed pixels. Five existing Home/filter/sort interaction tests passed. Sync, Svelte diagnostics (zero errors and warnings), scoped lint/format, architecture, assets and production build passed under Node 24.21.0.

The images compare actual local pages before and after the correction without injected CSS. Metrics and grouped verification are recorded alongside them; full screenshots and logs are retained in the ignored runtime/import-home-control-repair-20261009 folder. Other tasks' uncommitted files are preserved and excluded from this source delivery.

- [390px comparison](before-after-bg-390.png)
- [320px comparison](before-after-bg-320.png)
- [Rendered measurements](metrics.json)
- [Verification](verification.json)
