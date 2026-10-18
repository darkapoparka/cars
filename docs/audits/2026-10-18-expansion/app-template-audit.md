**Six template files only.** Preserve published producer fix `025c0a4c667f7f0692410c184980d406e76f18a6`; neither producer nor producer-test hunks are included. No new audit/build or source changes.

Exact original additions/deletions below; unchanged context is omitted to fit the limit. Check with `git apply --unidiff-zero --check PATCH` from the Cars root. Newer main has not been requalified.

```diff
--- a/templates/app/README.md
+++ b/templates/app/README.md
@@ -28,1 +28,1 @@
-Branding and copy beyond dealer identity live in `lib/showroom.ts`, `lib/showroom-art.ts`, locale dictionaries and the shared StyleX tokens. Service catalogue content lives in `lib/service-catalogue.ts`. Review these client-specific claims and imagery rather than assuming three JSON files approve every service or benefit.
+Dealer-specific copy and imagery also live in `lib/showroom.ts`, `lib/showroom-art.ts` and locale dictionaries. Service catalogue content lives in `lib/service-catalogue.ts`. Review these claims and imagery before release. Preserve the template palette, composition and shared StyleX tokens when personalizing a dealer.
@@ -30,1 +30,1 @@
-Desktop navigation exposes About us at `/stores`, after Services. Its compact title banner leads to equal-width Location and Contacts panels using the configured address, phone, email, website and WhatsApp. Optional `aboutText` supplies the banner subtitle; `socialLinks` is an array of public `{label, url}` profiles, with empty URL slots for Facebook, Instagram, Mobile.bg and Cars.bg in the template configuration. Replace them with the dealer's verified profile URLs. Template mode previews missing profiles with links to those platforms' homepages and shows a masked sample phone and reserved-domain email when no contacts are configured. Dealer mode omits empty profiles and does not show demo contacts. Optional `mapEmbedUrl` accepts a Google Maps or OpenStreetMap embed URL. Otherwise a Google Maps view is built from the configured address. Template mode without a location shows a Sofia map with a small location-preview caption and no showroom marker, plus three illustrative team roles; dealer mode without a location shows an empty panel. The makes strip uses the actual catalogue, without claiming manufacturer partnerships. Supply verified contact facts and social profiles before a dealer release. Phones share this content through a compact About us header, stacked panels and two-column profile pills. The profiles use a white inset panel with grey pills at every viewport. Tablets keep two location/contact columns. Fixed 64px demo portraits align with fictional profile names, single-line consultant roles and service details, with the arrow at the bottom right; phones and tablets use a horizontal team rail, while desktop keeps three columns. The contact card has a three-dot menu opening a shared Share panel with Copy link and native sharing where available. The share panel preserves the current locale and journey URL and uses the shared dialog dismissal and focus behavior.
+About us at `/stores` uses the configured address, phone, email, website and WhatsApp. Optional `aboutText` supplies its subtitle; `socialLinks` contains public `{label, url}` profiles. Both template and dealer modes omit empty profiles and contact actions, with unavailable text when no contacts are configured. Optional `mapEmbedUrl` accepts a Google Maps or OpenStreetMap embed URL; otherwise the map uses the configured address. With neither, the location panel shows its unavailable state. No sample contacts, platform homepage links, default city map or fictional team are added. Supply verified contact facts and social profiles before a dealer release. The makes strip uses the actual catalogue without claiming manufacturer partnerships. The contact card's Share panel offers Copy link and native sharing where available, preserving the current locale and journey URL.
--- a/templates/app/components/DealerEnquirySheet.tsx
+++ b/templates/app/components/DealerEnquirySheet.tsx
@@ -22,1 +22,2 @@
-  const whatsapp = dealer.whatsappUrl ? dealer.whatsappUrl + (dealer.whatsappUrl.includes('?') ? '&' : '?') + 'text=' + encodeURIComponent(message) : '';
+  const whatsapp = dealer.whatsappUrl ? new URL(dealer.whatsappUrl) : null;
+  whatsapp?.searchParams.set('text', message);
@@ -30,1 +31,1 @@
-        {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" {...stylex.props(s.action)}><MessageCircle size={19}/>{tx('Open WhatsApp draft')}</a> : null}
+        {whatsapp ? <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" {...stylex.props(s.action)}><MessageCircle size={19}/>{tx('Open WhatsApp draft')}</a> : null}
--- a/templates/app/components/ImportCountryPicker.tsx
+++ b/templates/app/components/ImportCountryPicker.tsx
@@ -10,0 +11,1 @@
+import {hasPublishedPrice} from '@/lib/vehicle-values';
@@ -45,1 +46,1 @@
-      setDetails({country: knownCountry ? '' : listing.countryCode, model: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`, budget: String(listing.vehicle.price), listing: listing.vehicle.sourceUrl || ''});
+      setDetails({country: knownCountry ? '' : listing.countryCode, model: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`, budget: hasPublishedPrice(listing.vehicle) && Number.isInteger(listing.vehicle.price) ? String(listing.vehicle.price) : '', listing: listing.vehicle.sourceUrl || ''});
--- a/templates/app/components/InventoryClient.tsx
+++ b/templates/app/components/InventoryClient.tsx
@@ -25,0 +26,1 @@
+import {inventoryNameKey} from '@/lib/inventory-identity';
@@ -146,1 +147,1 @@
-  <LandingContentFrame enabled={home}><main data-landing-content={home||undefined} {...stylex.props(home&&landingContent.panel,s.content,home&&s.homeContent,!home&&!luxe&&s.compactContent)}>{!home?<aside {...stylex.props(s.sidebar)}><div {...stylex.props(s.sidebarHeading)}><h2 {...stylex.props(s.sideTitle)}>{tx('Make')}</h2><button type="button" onClick={()=>open('filters')} {...stylex.props(s.sectionClear)}>{tx('All filters')}</button></div><label data-search-field {...stylex.props(searchField.field,s.sidebarSearch)}><Search size={18} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input aria-label={tx("Search sidebar brands")} placeholder={tx("Search brand")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} {...stylex.props(searchField.input)}/></label><div {...stylex.props(s.sidebarOptions)}>{makes.filter(make=>(vehicles.some(car=>car.make===make)||filters.brands.includes(make))&&make.toLowerCase().includes(brandSearch.toLowerCase())).map(make=><label key={make} {...stylex.props(s.sideOption,filters.brands.includes(make)&&s.sideOptionSelected)}><input type="checkbox" className="cars24-filter-checkbox" checked={filters.brands.includes(make)} onChange={()=>setFilters({...filters,brands:toggle(filters.brands,make),models:filters.models.filter(model=>!model.startsWith(`${make}::`))})}/><span {...stylex.props(s.sideEmblem)}><BrandEmblem make={make}/></span><span {...stylex.props(s.sideMake)}>{tx(displayMake(make))}</span><span aria-hidden="true" {...stylex.props(s.sideCount)}>{countMatches({...clearDesktopFilter(filters,'BRAND'),brands:[make]})}</span></label>)}</div>{brandSearch&&!makes.some(make=>vehicles.some(car=>car.make===make)&&make.toLowerCase().includes(brandSearch.toLowerCase()))?<p role="status" {...stylex.props(s.sidebarEmpty)}>{tx('No brands found')}</p>:null}<button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Clear all filters")}</button></aside>:null}
+  <LandingContentFrame enabled={home}><main data-landing-content={home||undefined} {...stylex.props(home&&landingContent.panel,s.content,home&&s.homeContent,!home&&!luxe&&s.compactContent)}>{!home?<aside {...stylex.props(s.sidebar)}><div {...stylex.props(s.sidebarHeading)}><h2 {...stylex.props(s.sideTitle)}>{tx('Make')}</h2><button type="button" onClick={()=>open('filters')} {...stylex.props(s.sectionClear)}>{tx('All filters')}</button></div><label data-search-field {...stylex.props(searchField.field,s.sidebarSearch)}><Search size={18} aria-hidden="true" {...stylex.props(searchField.icon)}/><input data-search-input aria-label={tx("Search sidebar brands")} placeholder={tx("Search brand")} autoComplete="off" autoCapitalize="none" spellCheck={false} value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} {...stylex.props(searchField.input)}/></label><div {...stylex.props(s.sidebarOptions)}>{makes.filter(make=>(vehicles.some(car=>inventoryNameKey(car.make)===inventoryNameKey(make))||filters.brands.includes(make))&&make.toLowerCase().includes(brandSearch.toLowerCase())).map(make=><label key={make} {...stylex.props(s.sideOption,filters.brands.includes(make)&&s.sideOptionSelected)}><input type="checkbox" className="cars24-filter-checkbox" checked={filters.brands.includes(make)} onChange={()=>setFilters({...filters,brands:toggle(filters.brands,make),models:filters.models.filter(model=>!model.startsWith(`${make}::`))})}/><span {...stylex.props(s.sideEmblem)}><BrandEmblem make={make}/></span><span {...stylex.props(s.sideMake)}>{tx(displayMake(make))}</span><span aria-hidden="true" {...stylex.props(s.sideCount)}>{countMatches({...clearDesktopFilter(filters,'BRAND'),brands:[make]})}</span></label>)}</div>{brandSearch&&!makes.some(make=>vehicles.some(car=>inventoryNameKey(car.make)===inventoryNameKey(make))&&make.toLowerCase().includes(brandSearch.toLowerCase()))?<p role="status" {...stylex.props(s.sidebarEmpty)}>{tx('No brands found')}</p>:null}<button type="button" onClick={reset} {...stylex.props(s.reset)}>{tx("Clear all filters")}</button></aside>:null}
--- a/templates/app/lib/brand-logos.ts
+++ b/templates/app/lib/brand-logos.ts
@@ -42,1 +42,1 @@
-  return logos[make.trim().toLowerCase()];
+  return logos[make.trim().toLowerCase().replace(/^mercedes\s+benz$/, 'mercedes-benz')];
--- a/templates/app/tests/domain.test.ts
+++ b/templates/app/tests/domain.test.ts
@@ -13,0 +14,1 @@
+import {brandLogo} from '../lib/brand-logos';
@@ -137,0 +139,5 @@
+  it('uses the retained Mercedes-Benz emblem for the supported spaced make spelling', () => {
+    const emblem = brandLogo('Mercedes-Benz');
+    assert.ok(emblem);
+    for (const make of ['Mercedes Benz', ' mercedes  benz ', 'MERCEDES-BENZ']) assert.equal(brandLogo(make), emblem);
+  });
```

**Original validation — Node 22.20.0 / npm 11.3.0, retained lockfile:**

- `npm ci`: passed.
- `npm run check`: passed lint, types, **150 tests / 15 suites**, configuration/asset validation and production build.
- `npm audit --omit=dev --audit-level=high --json`: **0 production vulnerabilities**.
- `npm run qa:routes`: **50/50 HTTP 200**.
- Component probes: **24 passed**; focused App workflow **20/20** and branding/FAB contracts **58/58** passed. CSS byte-identical, **75,435 bytes**. Full fleet workflow incomplete due to missing prerequisites; no mounted/visual acceptance.

**Browser CI:** run **38597880561** had **102 passed / 4 skipped / 2 failed** at the initial image wait, before navigation/return assertions. Nine Toyota JPEGs decoded; **23/23** baseline asset/optimizer requests returned 200 and decoded. A separate canonical same-SHA retry passed, supporting intermittency without identifying the cause. The exact local desktop cases stopped at launch: Chromium **v1248** was absent after invalid-archive downloads. No browser page execution; no tests weakened. These are original results, not checks of `025c0a4…` or `d796d9d…`.

[cars-app-final-audit.zip](sandbox:/workspace/scratch/0359e76ba368/cars-app-final-audit.zip) — original report, patch and evidence. This historical eight-file bundle contains producer hunks superseded by your published fix. Use only the six-file patch above for reconciliation. No commit/push/promotion/deployment performed.

