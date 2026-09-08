# Аутомаркет Варна

Prospect Fast Skin demos requested by the owner on 2026-09-07. No sale, dealer approval, outreach or CRM registration is implied.

All three independent projects were created with `scripts/new-client.mjs`, after its dry run, from the current `2026.09.06-refresh-1` masters. No ASKO source was cloned. The retained frameworks, routes, layouts, typography, navigation and responsive compositions are the masters' own.

## Verified business facts

- Name: АУТОМАРКЕТ ВАРНА; original AUTOMARKET logo from the dealer's Mobile.bg profile.
- Phone: **0886 424 400**, `tel:+359886424400`.
- Location: Varna, Vladislav Varnenchik; **Tsar Osvoboditel boulevard, 300 metres to the right after Dom na Kamiona towards the airport**. This is a distance and landmark description, not house number 300.
- About page: imports of used cars from the EU. Listings advertise delivery by request, trade-in with additional payment, registration/transit-number assistance, countrywide transport and financing enquiries through partners.
- No published opening hours, email, independently matched website or official social accounts established. Visits and current terms require a phone conversation.
- Map is a name/landmark search; an exact geocoded entrance is not verified.

Sources inspected 2026-09-07: [dealer profile](https://automarket.mobile.bg/), [contact](https://automarket.mobile.bg/contacts), [about](https://automarket.mobile.bg/about). Local page text and individual listing captures are in `evidence/`.

## Stock and media

One shared sample: **16 advertised sale vehicles**, 80 locally saved gallery photos, accurate advertised EUR prices, year, mileage, fuel, transmission and equipment. `stock.json` records the original URL and raw specifications for every entry. This is a dated representative sample from a 46-ad category, not a live inventory feed. Availability, condition and terms are dealer claims to reconfirm.

`assets/provenance.json` records every downloaded image URL. Original source watermarks remain. Both profile images are wordmarks; neither is claimed as a showroom photograph. The larger original logo is used without adding a dark padded badge. Its low source resolution is a known limit. Black/red branding follows the original logo.

Generic template car cutouts, body-type illustrations and decorative graphics remain in hero/promotional positions. They are illustrations, not this dealer's advertised stock. Old dealer stock, portrait/showroom media, contact details, social channels and testimonial claims were replaced in the wired source. Existing licence/provenance documents are retained as historical source records.

## Projects and local review

| Variant | Folder | Entry | State |
|---|---|---|---|
| Auto Best | `J:/cars/clients/automarket-varna/auto-best` | http://127.0.0.1:6656/ | See BUILD-STATUS.md and .client/project.json |
| Modern | `J:/cars/clients/automarket-varna/modern` | http://127.0.0.1:6657/cars | See BUILD-STATUS.md and .client/project.json |
| Carwow | `J:/cars/clients/automarket-varna/carwow` | http://127.0.0.1:6658/ | See BUILD-STATUS.md and .client/project.json |

Auto Best is the primary conventional dealer direction. Modern is the stock-first alternative; Carwow retains its fuller desktop and compact mobile layout. One actual homepage is offered per project.

Forms, finance calculators, account/chat and other source sample controls remain demonstrations. No email, CRM, finance provider or message delivery has been configured or certified. No external enquiry was submitted. Main genuine contact is the verified phone and official dealer listing links.

All heavy validation and browser jobs use `J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1`. Per-variant `qa-*.ps1` scripts start only the assigned port, perform browser checks and stop their own server in `finally`. They are precise reproducible local QA/restart commands. During the batch, run only through the shared mutex and keep one job queued at a time.

Example:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File J:/cars/audits/2026-09-07/varna-leads/with-build-slot.ps1 -ScriptPath J:/cars/clients/automarket-varna/qa-auto-best.ps1
```

Modern uses Node 22.23.2/pnpm 11.4.0 and existing public demo mode. Its API/app origins are configuration only: 6659/6660. No servers or production credentials exist for those origins. Auto Best uses Node 22.23.2; Carwow requires Node 24.

Public URLs are null. Nothing was committed, pushed, published, sent to the dealership or written to Agency OS.

The source PWA manifest is personalized. The original wide logo is retained without inventing a square dealer emblem; install-icon presentation remains a local-demo limitation.

Auto Best make shortcuts now select brands represented in the stock sample; generic OEM SVG assets were reused from this client's Carwow copy with its retained provenance.

## Final verification 2026-09-08

See qa-final/FINAL.md for exact framework and browser outcomes, final corrections and limitations. Source UI retained. Previews stopped after verification. No public preview, CRM registration or outreach.

Final targeted numeric/contact supplement: all source prices and mileage are finite and match stock.json; under EUR 20,000 renders 14 vehicles and under 100,000 km renders 1. Phone links, retained real Viber links where configured, and mobile gallery photo change passed. Exact framework timestamps and evidence are in qa-final/FINAL.md.
