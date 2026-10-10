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

## Which design to show first

These recommendations from the [saved lead research](../leads/uk-2026-10-10.md) choose the opening demonstration. All six designs remain available for every dealer.

| Dealer | Opening design |
| --- | --- |
| Broadbent Car and Servicing | Modern |
| Motors Castle | Mobile |
| Trade Car Sales | App |
| Square One Motors | Modern |
| Car Market Yorkshire | App |
| S A Motors | Import, only if import or sourcing services are confirmed |
| AS Motor Group | Modern |
| Cherry Tree Cars Ltd | Auto Best |
| Norton Grange Trade Cars | Mobile |
| North Norfolk Car Sales | Modern |

The first four (Broadbent, Motors Castle, Trade Car Sales and Square One Motors) remain the priority to qualify. Buying interest, budget and permission to use dealer stock remain unconfirmed. Confirm that S A Motors offers import or sourcing services before choosing Import as its opening demonstration.

## A 90-second demonstration

1. **0–15 seconds:** State the dealer's main need and why this design fits. Point to their identity and the first useful action.
2. **15–35 seconds:** Browse the stock and apply one relevant filter. Show the result changing.
3. **35–60 seconds:** Open one retained listing sample. Show its price, mileage and factual details, and identify the picture as an illustration.
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

All ten UK projects now have committed, personalized six-design source packages. All **60 application builds and ten Cloudflare router dry-runs passed**. 10 of 10 private package publications verified. Public previews and hosted acceptance remain pending until Cloudflare device approval and hosted checks are complete.

The exact approved source versions used by this batch are:

| Family | Approved source commit |
| --- | --- |
| Auto Best | `2afd974c23d4f4cfb290ed99a00f46074793be3a` |
| Modern | `827d75b9a53666c6feb09f04e3f8e7f255e95a30` |
| Import | `a51f329b0b9e8e4d21665e16abf2734505d02e07` |
| App | `70c2b80671e217ab299549a938a537c0b9559611` |
| Mobile | `876590474d01178413feccf3153a0859230158a1` |
| Signature | `cc130e432a41a3a60cc80bc2b3461c6416893b4a` |

The [release selection evidence](qa/uk-approved-six-selection-2026-10-10.json) binds these versions. Newer template drafts are outside this batch. The [delivery checkpoint](uk-cloudflare-batch-2026-10-10.md) and [repository evidence](qa/uk-publishing-repositories-2026-10-10.json) show the actual per-dealer source, build and publication records.

## A proper UK configuration

- **Business identity:** each package uses the retained dealer facts, raster logo and real PNG/ICO icons. Country is GB. Unpublished telephone, email and street-address values stay blank; an existing town can identify the display location.
- **Language:** English is the default, with en-GB presentation. Native en/bg catalogs and explicit language/preferences remain part of the six-design contract.
- **Currency:** actual advertised prices remain GBP. Choosing a language or country never converts a listing price.
- **Mileage:** original miles are retained for display. Where native filters require canonical kilometres, their bounds use the corresponding conversion.
- **Images and availability:** the 71 records are dated listing samples, with availability unconfirmed. Vehicle pictures are labelled generated category illustrations, not photographs of the advertised vehicles.

Source and compilation checks cover these dealer adaptations. The mounted public journeys still need their actual hosted review. Use the [UK integration record](qa/uk-personalization-integration-2026-10-10.json) and current [batch checkpoint](uk-cloudflare-batch-2026-10-10.md) when explaining the evidence.

## Next delivery checkpoint

**Build ready · Cloudflare device approval required.** The board shows build readiness and actual private-project links. Every public preview action stays disabled until deployment, hosted browser checks, visual review and Cloudflare Free runtime qualification are recorded.

After normal Cloudflare device approval succeeds, deliver the already compiled pilot one target at a time, verify its seven actual Worker receipts, then inspect the six public designs at phone and desktop widths. Demonstrations must keep the dated-stock, generated-image and non-sending form disclosures.

Continue using the existing Cars release, source ownership, payload verification and remote reconciliation workflow. These UK projects target Cloudflare; existing Vercel projects remain outside this batch. No outreach has been sent.
