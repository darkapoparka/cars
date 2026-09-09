# Al Basma Motors — Session 04 handoff

Three independent Fast Skin applications are implemented in `clients/al-basma-motors`: `auto-best`, full-workspace `modern`, and `carwow`. The original template compositions/routes/dependencies are retained; the dealer identity, Sharjah contact data, AED/km stock sample and local Al Basma asset pack are wired into the apps.

Sources observed 8–9 September 2026: `https://albasmamotors.com/`, its current car detail pages, and the retained source notes in `business-facts.json` / `stock.json`. The sample is dated and is not a live availability guarantee.

Branding: published Al Basma artwork is stored locally under each app's `/dealer/brand` directory with source/provenance notes. It is used only for this unpublished owner-review concept; public redistribution permission is not established.

Safe demo behavior: no CRM/payment provider is connected, no external enquiry was submitted, and no deployment or dealer contact occurred. Unsupported finance/review/staff claims were removed from the lead data consumers.

Runtime verification remains to be executed after this commit. Until framework and 390/1440 browser checks are actually run, `.client/project.json` intentionally keeps QA flags false and state `personalized-unverified`.
