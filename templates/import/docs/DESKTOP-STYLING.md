# Import desktop styling direction

This is the maintained public desktop direction, recorded on 2 October 2026. It captures the owner's accepted About styling and the boundaries for applying it across the car storefront. The requested implementation and its route/state evidence are recorded in [the desktop receipt](desktop-editorial-2026-10-02/README.md). This contract remains separate from owner acceptance, template promotion and dealer deployment.

## Visual anchor and references

The owner accepted the calmer [About preview](http://127.0.0.1:6790/bg/about). Its desktop implementation was introduced in Cars commit `10a9fcf7995d127bfda12b66b7ffd246563c6609`. [The receipt and screenshots](desktop-about-studio-2026-10-02/README.md) preserve the baseline. The separate [mobile About trial](mobile-about-editorial-2026-10-02/README.md) remains subject to the owner's visual review.

Use the following local references deliberately:

| Reference                                                                       | Use in Cars                                                                                                                  | Boundary                                                                                                                                                                                 |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Treido Studio admin](http://127.0.0.1:6418/admin-preview?lang=bg&store=studio) | Calm neutral surfaces, readable hierarchy, restrained borders and shadows, compact controls, consistent spacing              | A Shopify-derived local reference. Preserve Cars' brand, navigation and automotive composition.                                                                                          |
| [Treido storefront](http://127.0.0.1:6418/)                                     | Product image framing, card hierarchy, quiet saved controls and grouping                                                     | The inspected storefront uses a narrow feed. It does not establish the width or layout of a desktop dealership.                                                                          |
| [Cars reference at 6464](http://127.0.0.1:6464/bg/services)                     | Reviewed automotive imagery and campaign composition, also inspect its Home                                                  | Existing copied assets have provenance in [the company reference manifest](assets/DESKTOP-COMPANY-REFERENCE-2026-10-02.json). Recheck the listener and source before taking more assets. |
| [Import About](http://127.0.0.1:6790/bg/about)                                  | The accepted adaptation: centered car hero, red primary action, neutral canvas, framed photos, compact process cards and map | Adapt the same hierarchy to each page's purpose; do not duplicate About's exact content layout everywhere.                                                                               |

The Treido reference source is `L:/PLATFORMS/treido-eu-global/app/apps/web/src/features/sellers/admin.module.css`. Treat reference projects as read-only. Ports are local references and must be verified in the new session. These observations do not claim current upstream Shopify parity.

## Keep the automotive identity

The requested About/Contact hero follow-up uses `PageIntro`'s existing secondary-actions slot below the white primary action panel: configured social icons on About; address, directions and message shortcuts on Contact. Use existing tokens and contact/content owners, retain the shared title/artwork anchors and preserve mobile. See [the hero follow-up receipt](desktop-hero-content-2026-10-02/README.md).

About and Contact pair the red left hero action with the existing `Action` `strong` variant on the right: the shared ink surface and white text. Grey secondary actions retain their existing roles elsewhere. [The action-color receipt](desktop-hero-content-2026-10-02/action-update/README.md) records this follow-up and mobile preservation.

Keep the centered dark hero, recognizable vehicle artwork, dealer identity, red primary actions, existing Home/Inventory discovery patterns, vehicle photographs, prices, specifications and finance hierarchy. Maintain common hero typography, anchor, height and artwork baseline through `PageIntro` and `HeroCars`. Search, quick filters and Make/Model belong inside the discovery panel. Hero content must have clearance from decorative cars and grow when it needs more room.

Use the accepted About surfaces as the starting point: neutral canvas, white cards, quiet borders and shadows, inset media, clear type roles and deliberate spacing. Let inventory remain a useful four-column car catalogue at wide desktop sizes. Keep search, filters and stock browsing prominent. Admin navigation, green branding, generic onboarding illustrations and narrow shopping-feed composition do not belong in this dealer template.

## Values and composition have owners

`src/lib/styles/tokens.css` owns reusable design values. `--bc-editorial-*` tokens contain the shared neutral surfaces. From 768px, public `.site-shell` and `.site-dialog` aliases adopt them for canvas, copy, borders, shadows, discovery frames and card/media radii. Component consumers implement their own composition; the mobile theme and legacy/admin shells retain their existing values. About's mobile trial remains an explicit route opt-in.

Components own layout and interaction. Prefer the existing `Action`, `DesktopDiscoveryPanel`, `DesktopSearchControl`, `InventoryFilter`, `InventoryDisplayControls`, `VehicleInformationSection`, form, modal and mobile primitives. Add a small explicit variant only where the component's responsibility warrants it. Keep useful component dimensions, breakpoints, borders, aspect ratios and data-driven grid counts. Avoid hundreds of tokens for unrelated geometry or a metric requiring zero numeric literals.

The hardcoding to remove is repeated brand values, competing CSS overrides, copied component markup, inline localized UI copy, duplicated route/filter rules, and literal dealer identity, phones or addresses outside their owners. Do not replace typed data and native links/forms with abstractions that conceal the product behavior.

| Concern                                                                      | Authoritative owner                                                |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Dealer identity, contact details, languages, theme and finance configuration | `src/lib/config/dealer.ts`, validated `src/lib/config/site.ts`     |
| Public copy and localized UI labels                                          | `src/lib/content/`; About UI labels now live in `about-page.ts`    |
| Inventory data and compatibility content                                     | `src/lib/data/`, retained `src/lib/auxero/` facades where consumed |
| Queries, selections, finance estimates and other pure rules                  | `src/lib/domain/`                                                  |
| Shared values and typography                                                 | `src/lib/styles/tokens.css`, [Typography](TYPOGRAPHY.md)           |
| Native page composition and reusable UI                                      | `src/routes/(site)/`, `src/lib/components/`                        |
| Assets, crops, origin and licensing                                          | `static/`, content artwork maps, existing asset provenance         |

## Desktop product rules to retain and refine

- **Heroes:** one centered heading anchor and artwork baseline across Home, Inventory, Services, About, Contact and conversion routes. Retain Home's mode tabs. Keep search above Make/Model/filter pills where composed together, with the circular search action inset in its input. Pill text, chevron and padding must remain balanced for selected and long labels.
- **Inventory:** all quick filters and applied filters stay within the hero panel. Results own their total, one Sort by disclosure and one View disclosure. Retain working GET queries, dependent models, selection persistence, no-results recovery and Back/history behavior.
- **Vehicle cards:** one desktop title line, consistent height, ellipsis and full title tooltip. Year, fuel and transmission share a readable metadata row; complete mileage aligns to the right as text. Use the same rules on Home, Inventory, Favorites and related cars. Avoid redundant mileage overlays and unused vertical space.
- **Vehicle details:** title and subtle Save/Compare controls share a row aligned with the purchase column. Description, basic specifications, details and equipment have distinct readable containers. Facts cards share height when paired and size naturally when stacked. Finance follows the purchase card in the right column. Preserve gallery, enquiry, finance calculations and full equipment disclosure.
- **Services:** four equal cards from 1024px, two at narrower desktop widths, clear one-line titles, concise descriptions and aligned actions. Retain the shared discovery box and use reviewed car-related imagery with appropriate crops.
- **About and Contact:** use the accepted neutral framing, consistent content edges, concise process steps, real configured location/map and clear contact actions. Keep centered automotive heroes. The seller banner must have legible appointment copy and properly aligned controls.
- **Typography and spacing:** retain self-hosted Sofia Sans and the existing Cyrillic/Latin assets. Distinguish headings, body copy, metadata and actions. Start from About's 28px body-font section headings, 20px team names, 18px process titles and 16px copy; choose roles intentionally for other content. Keep 44–48px action targets and normal control weights. Wrap/reflow rather than reducing type to squeeze controls together.
- **Imagery:** reuse approved photographs and automotive banners. Generate only genuinely missing assets, after inspecting references, with crops and provenance recorded. Avoid decorative AI imagery that does not help a car buyer or resemble the established campaign style.

## Audit and implementation scope for the new session

The next request is a complete **public desktop** audit and implementation pass. Preserve mobile, including the current About trial, unless the owner explicitly broadens scope. Shared changes must retain mobile computed presentation and behavior.

Inventory the native public routes before editing. Cover Home's Buy/Sell/Import states; Inventory filters, sort, views and empty results; several vehicle details including long names and different specifications; Services and service detail; About; Contact; Import; Sell; Financing/calculators; Favorites; Compare; Reviews; FAQ; Blog and article; locale, policy and error pages; public navigation, menus, dialogs and forms. Check the retained account/legacy/admin boundaries and record their ownership and any actual defects; a public styling pass does not authorize a private/backend rewrite.

Capture before evidence and state-specific defects. Implement shared fixes in their existing owners, then inspect their consumers. Keep a concise route/state checklist showing completed fixes, verified states and remaining limitations. Do not stop at an audit report when implementation is authorized.

Use the existing checkout at `L:/CODEX/cars/templates/import`, Cars `main`, Node 24 from `.node-version` and the retained npm lockfile. Confirm physical paths, current Git status, remote, HEAD, listener ownership and free space before writing. Other Cars templates and dealer checkouts have concurrent work. Preserve their changes, Import's inherited ignore edits and untracked drafts. No new branch or editable copy unless requested. Run the Cars workspace doctor before integration.

## Verification and completion

Inspect BG and EN desktop at 768, 1024, 1440 and 1920px and compare mobile at 320/390px. Exercise selected, long, empty, loading, validation and disclosure states where they apply. Check keyboard focus, dismissals, URLs/history, primary actions, readable contrast, image loading and overflow.

Run proportionate existing checks, including Svelte, scoped formatting/ESLint, architecture, assets, relevant unit tests and production build. A full desktop audit also needs the existing relevant browser journeys. Build a frozen QA snapshot with its own output when live preview owns the checkout's output. Never weaken a failing gate to call the UI complete. Save a compact evidence receipt in `docs/`, retain recovery evidence and protect secrets.

Finish with task-owned scoped commits and a non-force push to `main`, as required by the owner's workflow. Keep implementation, local verification, owner visual approval, template release and dealer deployment separate. This request does not authorize a template promotion, dealer rollout or outreach.
