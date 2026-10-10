# UK dealer presentation board — 10 October 2026

Private presentation guide for the sister presenting Cars proposals. This is preparation, not an instruction to contact anyone. Lead evidence is recorded separately.

Open the [interactive board](uk-sales-board-2026-10-10.html) in Chrome or Edge. In Windows File Explorer, right-click the HTML file, choose **Open with**, then choose your browser. The standalone board needs no account or additional application. Read this Markdown guide in Codex or a Markdown editor alongside it.

## The offer

“We can give your dealership a clear, branded online showroom: your cars, photographs, useful details, location and contact options. We have six designs to help you choose a presentation that fits your business. Then we agree the stock, pages and integrations you actually need.”

Start with the dealer's business and customers. Show one recommended design first; offer the other choices when useful. Avoid opening six designs before explaining the value.

## Choose a design

The positioning below is our recommendation. Features describe existing template interfaces; a personalized release must still be checked.

| Design | Suggested fit | Features to show | One sentence to say |
| --- | --- | --- | --- |
| **Auto Best** | Independent dealer with stock and supporting services | Grouped inventory filters; vehicle details and contact journeys; configurable showroom and service artwork | “Your customers can browse the cars, understand your services and find the next step in one showroom.” |
| **Modern** | Dealer wanting stock and photography to lead | Type/Make/Model search; removable filter chips and sorting; saved cars and vehicle gallery | “Customers can narrow the choice, inspect a car and reach your business quickly.” |
| **Import** | Dealer that genuinely offers sourcing or imports | Inventory and import journeys; saved cars; comparison of 2–4 vehicles | “Customers can compare available cars or explain the car they want you to source.” |
| **App** | Dealer wanting familiar phone browsing | Illustrated Buy/Sell/Finance/Services journeys; detailed filters; Exterior/Interior/Close-ups photo albums and Viewing/Save actions | “The phone journey makes browsing, saving and inspecting the photographs easy to follow.” |
| **Mobile** | Dealer receiving many visitors from social media on phones | Cars as the home screen; categories and quick filters; saved cars and retained browsing criteria | “A visitor from a social post lands straight in the showroom and can find the relevant car.” |
| **Signature** | Premium or specialist dealer needing a fuller business presentation | Vehicles and galleries; Services/Import/News/FAQ/Contact; alternative mobile discovery home | “Your stock sits within a complete business presentation, with clear details and contact information.” |

**Signature** is the owner-selected public design name. Its internal source key remains `karento-best`; each dealer proposal uses that dealer's own branding. App and Signature each have an alternative mobile home; these remain six design families. See [Signature identity](../templates/karento-best/docs/SIGNATURE-IDENTITY-2026-10-09.md) and [alternate-home boundaries](karento/SIGNATURE-LOCAL-DRAFTS-2026-10-10.md).

Feature references: [Auto Best](../templates/auto-best/REUSE_GUIDE.md), [Modern](../templates/modern/TEMPLATE.md), [Import](../templates/import/TEMPLATE.md), [App](../templates/app/TEMPLATE.md), [Mobile](../templates/mobile/TEMPLATE.md), [Signature](../templates/karento-best/README.md).

## A 90-second demonstration

1. **0–15 seconds:** State the dealer's main need and why this design fits. Point to their identity and the first useful action.
2. **15–35 seconds:** Browse the stock and apply one relevant filter. Show the result changing.
3. **35–60 seconds:** Open one actual car. Show photographs, price, mileage and the available factual details.
4. **60–75 seconds:** Show the contact or viewing entry and the location. Explain honestly whether it currently opens a draft or a working contact destination.
5. **75–90 seconds:** Explain what will be personalized and ask which part matters most. Agree one concrete next step, such as a scoped proposal.

Use verified stock when available. If the proposal uses illustrative cars, say so before the stock demonstration. Demonstrate on a phone when that is how the dealer's customers usually arrive.

## Three discovery questions

- “Where do most enquiries arrive today, and what do people usually ask before arranging a viewing?”
- “How many cars do you normally advertise, and who updates prices, photographs and sold status?”
- “Which services do you actually provide, and how should a website visitor contact you?”

## Three respectful objection replies

| Dealer says | Suggested reply |
| --- | --- |
| “Facebook is enough.” | “Keep using Facebook. A permanent showroom link can help visitors see all your current stock, car details and location from each post. We can show that journey and you can decide whether it helps.” |
| “We already have a website.” | “Let's look at the journey your customers use most. If it already works well, we should preserve it. A useful proposal would address a specific gap, such as phone browsing or stock updates.” |
| “What is the price?” | “We will give you a clear fixed quote once we agree the stock volume, pages, updates and integrations. Hosting and ongoing support will be stated separately. We should confirm that scope before giving you a figure.” |

Do not promise more sales, guaranteed search rankings, finance approval or a delivery date that has not been agreed. Do not disparage the dealer's existing website.

## What is real in a demonstration

The templates demonstrate browsing, filtering, photographs and interface journeys. Several enquiry flows save local drafts or display truthful preview feedback. A draft is not a delivered enquiry or a confirmed reservation.

The shared Admin site is a demonstration. Signature account, shop, booking, wallet and dashboard screens contain demo behavior. Real authentication, protected records, email delivery, payments, inventory synchronization and finance offers require separately agreed implementation and verification. Only present services, reviews, staff, warranties and stock supported by the dealer's facts. See [App enquiry limits](../templates/app/TEMPLATE.md) and [Signature reuse limits](../templates/karento-best/REUSE.md).

## Source and release status

This board was checked against the current Cars files and template chats on **10 October 2026**. The approved lock contains the following October 9 source snapshots; further polish in the chats must be reconciled before claiming that it is included in a dealer release.

| Family | Approved source commit |
| --- | --- |
| Auto Best | `2afd974c23d4f4cfb290ed99a00f46074793be3a` |
| Modern | `827d75b9a53666c6feb09f04e3f8e7f255e95a30` |
| Import | `a51f329b0b9e8e4d21665e16abf2734505d02e07` |
| App | `e75bdac63f3d81771f51c18d4434ee98e01330a2` |
| Mobile | `876590474d01178413feccf3153a0859230158a1` |

[The release lock](../templates.lock.json) selects actual approved sources. App's master production deployment was verified **READY through the Vercel API today**; that establishes its provider state, not acceptance of a combined six-design dealer release or a fleet refresh.

Signature has 25 personalized local drafts and a successful representative local Promosale build/journey qualification. Its draft candidate is `03b70f633d1ab3191379b8d976a9dd35a84271bc`. Those drafts have made **zero dealer deployments**. Final source selection, combined mounting, provider runtime checks and hosted acceptance remain release work. See [the exact preparation record](karento/SIGNATURE-LOCAL-DRAFTS-2026-10-10.md).

## A proper UK configuration

- **Business location:** verified UK address, town, postcode, map/directions and telephone links in `+44` format. Use country code `GB` for the UK dealer profile; do not infer the dealer's location from the visitor.
- **Language:** English by default, with `en-GB` formatting and reviewed UK wording. Explicit URL language and saved preference take precedence over supported browser-language suggestions and the dealer default. Preserve the preference for that dealer and design mount.
- **Currency:** display the actual listing currency, normally GBP for these dealers. Country or language selection must never silently convert prices. Mobile currently has a hardcoded EUR formatter; that needs a dealer-owned currency boundary.
- **Mileage:** retain whether the source record is in miles or kilometres. Use a consistent unit contract for cards, details, search, sorting and filters; convert only with a known source unit. Import and Auto Best currently include kilometre presentation.
- **Country hint:** on Cloudflare, a trusted request country hint can suggest a language or region. Manual choices win. Avoid an automatic IP-based redirect or a location-permission prompt just to browse a single dealer's showroom. Auto Best's current server hint is Vercel-specific and needs an adapter boundary.

Relevant boundaries: [Auto Best locale facts](../templates/auto-best/src/lib/config/locale.ts), [Auto Best server hint](../templates/auto-best/src/lib/locale/server.ts), [Modern locale configuration](../templates/modern/apps/web/lib/locale-configuration.ts), [Mobile currency](../templates/mobile/src/lib/locale.ts), [Import units](../templates/import/src/lib/i18n/vehicle-units.ts).

## Next delivery checkpoint

Research and presentation preparation can proceed while template polishing finishes. After final accepted source selection, use the existing Cars workflow to personalize the UK dealer facts and stock, assemble the six families and qualify one Cloudflare pilot before wider publication. Check the actual mounted routes, assets, contact behavior, UK presentation and public origin. Source push, build success, provider READY state and hosted visual acceptance are separate evidence.

The owner intends Cloudflare for these UK proposals. This board makes no deployment, paid-plan purchase, DNS change or outreach authorization. Follow [Workflow](WORKFLOW.md), [Hosting and release decision](HOSTING-AND-RELEASE-DECISION-2026-10-04.md), [Lead publishing](LEAD-PUBLISHING.md) and the current six-design release records at that checkpoint.
