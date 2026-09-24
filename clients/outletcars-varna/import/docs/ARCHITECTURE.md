# Current Import architecture

## Public storefront

The public storefront lives in src/routes/(site). Route files load typed data and compose Svelte components. They do not extract HTML from the original purchased template. The root layout owns the per-layout garage context; the public group owns its header, footer, metadata and skip link. Both desktop and mobile inventory have server-rendered content. Separate compositions are intentional where mobile interaction differs.

src/lib/config/dealer.ts is the dealer adaptation source. src/lib/config/site.ts defines and validates the public identity, contact, language, finance and theme contract. src/lib/content holds public editorial/service copy; src/lib/data holds inventory and other content. src/lib/domain owns pure financial estimates, inquiry/intake schemas, card presentation and URL-query logic. Server-only loading and persistence remain under src/lib/server. Reusable browser behaviours are in src/lib/browser.

`InventoryToolbar.svelte` owns desktop inventory triggers, sorting and view controls. Quick filters and All filters open `InventoryFiltersDialog.svelte`, which owns persistent category tabs, draft selections, dependent model options, live counts and canonical GET submission. `DesktopFilterPicker.svelte` owns a pinned search field and independently scrolling choices; `DesktopFilterRange.svelte` keeps numeric fields above its scrolling presets. The dialog shell keeps category navigation and actions stationary. Mobile inventory keeps its separate sheet composition. Changes to shared overlay styling must be scoped to desktop media queries when mobile preservation is required.

## Styling ownership

`PageIntro.svelte` owns image hero geometry through `--bc-desktop-page-hero-height`, primary and secondary desktop action slots, and a responsive desktop image source. About, Contact and Services supply actions, socials or quick filters without duplicating banner layouts. Mobile retains the existing imagery, content-driven banners and contact composition. `Action.svelte` owns the reusable glass treatment for controls on dark imagery. `SearchField.svelte` provides the shared search control. The services directory reads stable service IDs from `content/services.ts` and localized descriptions of included work, quick filters and destinations from `content/service-directory.ts`; its GET search also renders filtered results without JavaScript. Navigation active indicators belong to the text link, independently of the dropdown trigger. Generated desktop banner provenance is recorded in [Desktop banners](assets/DESKTOP-BANNERS.md).

src/lib/styles/app.css is the only Tailwind generation entry. It includes shared base styles, semantic tokens, form contracts and the Tailwind theme mappings. tokens.css owns design values; components own their composition. Utilities are not a second source of brand values. Portal content inherits the root theme. The native storefront does not load the legacy app.css or script-replay runtime.

Use Action for buttons/links, Modal for desktop dialogs, and the retained MobileSheet/mobile navigation primitives for touch overlays. Keep control roles compact; typography, radii and spacing changes must be reviewed visually rather than expanded globally. Do not remove legitimate layout-specific dimensions merely to obtain a zero-literal metric.

## Deliberately retained legacy area

Legacy account/agent and alternate-preview routes still use the Auxero compatibility modules. LegacyLayoutAssets isolates their CSS from the public route group. They are not dead files merely because the new storefront no longer imports them. Do not delete the renderer, .template-ref, licenses, or their assets until those last route consumers are migrated or explicitly retired with compatibility redirects. Native route dependencies are checked transitively by npm run check:architecture.

## Preview and live are different capabilities

TEMPLATE_MODE defaults to preview. Database and AI credentials alone cannot enable live features. Preview stores synthetic requests and never claims notification delivery. Live inquiry storage requires its explicit configuration; storage failures do not silently fall back to demos.

The file-backed CMS and uploads are demonstration features. Live-mode gates apply to both page actions and the filesystem service, not only JSON endpoints. Staff forms and public API parsing have bounded request sizes. Upload filename extensions must agree with the allowed media family. This is not a production malware-scanning or private-document service.

Configured live staff sessions still use the retained process-local session implementation. Durable/revocable production sessions, production upload storage and external notification/provider qualification remain release blockers for those capabilities. Do not advertise them as completed production integrations.

## Verification

Use Node 24 from .node-version and the retained npm lockfile. npm run verify covers Svelte checking, formatting, ESLint, the native dependency boundary, local image signatures and unit tests. npm run build verifies the Vercel adapter output. npm run test:e2e covers desktop/mobile smoke, forms, URL state, dialogs/navigation, accessibility and regressions. The managed browser test server is deliberately configured with synthetic preview data and no provider credentials.

Do not rebuild into the output directory of a preview another task is reviewing. Use a temporary verification copy containing the complete current working source, including untracked files, with its own npm ci and no .env/.git/deployment bindings. This is QA output, not a second source branch or worktree. Test the frozen build, then record the source digest and any gaps in docs/localization/HANDOFF.md.

Cars still owns mounted /variant-2 compatibility, immutable release selection and dealer deployment. A standalone local build does not prove those boundaries. No template commit is automatic visual approval or a dealer rollout.
