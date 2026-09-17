# Product overview

Auto Best is a dealership website template for browsing vehicles and starting a conversation with the dealer. Its purpose is to provide a polished starting point for independently branded client sites.

## Main visitor journeys

| Journey | Visitor experience |
| --- | --- |
| Find a car | Browse featured stock, choose a body type or make, search and refine the inventory |
| Inspect a vehicle | View the photograph, price, data, description and equipment; return to the filtered list |
| Arrange a viewing | Carry the selected vehicle into an inspection contact page or call directly |
| Discuss finance | Adjust a deposit and term to see a principal-only illustration, then contact the dealer |
| Import a vehicle | Start with a listing URL or preferences and prepare an import enquiry |
| Sell or trade in | Describe the vehicle, optionally preview photos, then copy or share the enquiry |
| Learn and visit | Read buying/import/finance articles, learn about the company and open its map/contact links |

## Interface character

The design is automotive rather than dashboard-like: large vehicle images, rounded surfaces, clear prices, compact metadata and direct actions. Desktop uses a full navigation/mega-menu composition. Mobile uses a compact discovery interface, bottom navigation and native modal sheets. The current service illustrations and image-generated banners are part of that visual identity. Details are in [Styling](docs/STYLING.md).

## Content model

The template defaults to Bulgarian text, euro prices, kilometres and a Sofia-based sample identity. Inventory, navigation, services, articles and selected videos are local TypeScript records. Content can be changed independently of the core page layouts. The [Reuse guide](REUSE_GUIDE.md) identifies every main personalization area.

## Implemented versus integrated

The template renders pages, filters inventory, maintains list-return context, calculates a simple principal illustration, opens maps/video players and prepares browser-local enquiry drafts. It does not provide inventory administration, an automatic stock feed, accounts, payments, reservations, automated valuation, finance approval, or confirmed email/CRM delivery.

Photos selected in an enquiry are local previews, not server uploads. A browser share action hands content to an application chosen by the visitor. Google Maps and YouTube are external providers; they are separate from this application.

## Template and client relationship

The master is improved once and copied for each dealer. A client copy keeps the design and behavior while replacing identity, contacts, services, stock, copy and relevant media. Existing copies do not automatically inherit later master changes.

Sample inventory and source business content are presentation inputs, not claims about a new client. Source rights and media credits are documented separately in [SOURCE_LICENSE.md](SOURCE_LICENSE.md) and [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md).
