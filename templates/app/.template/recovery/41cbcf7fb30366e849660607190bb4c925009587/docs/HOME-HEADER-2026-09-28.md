# Mobile home identity row — 28 September 2026

Removed the dedicated dealer-name/location row from the mobile home header at the owner's request. Home opts into DiscoveryHeader.hideMobileIdentity; other consumers keep their current behavior. Desktop keeps the AppShell identity/navigation and tablet retains its existing row.

The home spacer and expanded filter offset are 112px plus the safe-area inset, down from 156px. The compact filter offset is 68px plus the inset, matching the measured compact header. No empty space is retained for the hidden row.

`npm run check` passed on Node 22.20.0 (exit 0; runtime/app-menu-polish/check-home-header-final.log). Checked 320px, 390px and desktop 1440px. Browser measurements: mobile identity display none, expanded header 112px, compact header bottom 68px and filter top 68px. Search navigation works and no captured console errors. Desktop inspection caught and corrected a StyleX display override; final desktop identity row is hidden as before. Screenshots: home-no-identity-390.png, home-no-identity-320.png, home-no-identity-scrolled-390.png and home-no-identity-desktop.png under runtime/app-menu-polish. Viewport reset; preview serves the final build on port 6473.

Changed source: components/DiscoveryHeader.tsx and app/[locale]/page.tsx. Source remains local in the existing Cars main checkout. The existing index lock, untracked App master and remote drift described in MENU-CARD-POLISH-2026-09-28.md remain; no commit, push or partner deployment was performed.
