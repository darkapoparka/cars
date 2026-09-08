import pathlib,json,datetime
p=pathlib.Path('.')
f=p/'.client/project.json';r=json.loads(f.read_text(encoding='utf-8'));r.update(state='local-review-ready',selectedHome='main',offeredHomes=['/'],localUrl='http://127.0.0.1:6613/',updatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),businessName='АСКО 96',stockSnapshot='2026-09-06',stockCount=16)
r['qa'].update(desktop=True,mobile=True,identity=True,contactPath=True,frameworkCheck='npm run check: 0 errors, 0 warnings',build='npm run build: passed final 2026-09-07',routeMatrix='.client/qa-routes.json',finalRecheck='.client/qa-final.json',interactions='.client/qa-interactions.json',viewports=[390,1440],identityScope='Offered home and primary public routes, metadata, phone/map/social destinations. Internal source identifiers preserved.',autofixer='44 changed Svelte files reviewed; final six components also checked. External href false positives and inherited bind:this suggestions retained.')
r['changes']=['Official ASKO96 wordmark and full-logo favicon; gold accent and readable surface variants','16 real source-backed vehicle listings, 52 photos and galleries; unknown features explicitly referred to dealer','Real ASKO showroom, contacts, hours, maps, Facebook and three verified ASKO YouTube videos','Source fabricated testimonials replaced with factual service cards; fictitious team names/photos replaced by contact/service topics','Forms and chat identified as local demos; no credentials copied or backend configured','Source stock mega menu and hidden financing phone replaced with current ASKO content']
r['knownGaps']=['Local visual demo only; no public deployment or message delivery configured. No external form submissions or messages sent.','Inventory is a selected published snapshot; ASKO must confirm availability, equipment and financial terms. Citroen fuel follows the source listing verbatim.','Generic decorative Audi/BMW hero cutouts and body/budget illustrations remain from template; they are not presented as ASKO inventory. Real listing photos are ASKO.','Main and offered public routes verified. Historical legacy/presentation/admin sample routes and unreferenced source assets remain in retained template codebase; they are not offered as lead homepage variants.','Viber links derive from the verified phone; account availability and actual phone/message delivery not tested.','Browser emulation at390/1440 is local QA, not physical-device or hosted acceptance.']
r['runtime']={'pid':28564,'port':6613,'node':'24.18.0','launcher':'J:/cars/scripts/start-preview.ps1','folder':'J:/cars/clients/asko-96/carwow'}
f.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(p/'CLIENT.md').write_text('''# ASKO96 / Carwow local demo

Independent Fast Skin from Carwow 2026.09.06-refresh-1. Primary homepage: `/`. Local review: http://127.0.0.1:6613/.

The native source layouts, navigation, responsive compositions and interactions are retained. ASKO96 supplied identity, real published stock/photos, showroom, source-backed contact details and three verified YouTube videos replace the source dealer content. Gold and charcoal use the existing color boundaries. Testimonial card positions now contain factual service information; no ASKO customer reviews or named employees were invented.

Canonical research: ../business-facts.json, ../stock.json, ../videos-research.json and ../assets/provenance.json. The 16 listings are a selected snapshot from 2026-09-06. Confirm current availability and financial terms with ASKO96.

## Validation

- Retained npm lockfile installed with Node24.18.0; npm run check passes with zero errors and warnings; final npm run build passes.
- Svelte autofixer reviewed44 changed public components plus final six components. Remaining suggestions concern inherited bind:this and false positives for external URLs, not invalid Svelte.
- 30 route/viewport visits at390 and1440 passed HTTP200 with no page errors, broken visible images or horizontal overflow. Follow-up final12 visits verified corrected branding, old-phone removal and form notices.
- Toyota mobile brand filter leaves one correct listing; Audi desktop filter leaves3 listings. Detail navigation, real telephone destinations, import navigation and menu close verified. Mobile menu exits after its inherited animation (approximately1.6seconds), matching source6517.
- YouTube iframes were scrolled into view; all three show the verified ASKO channel video thumbnails. No videos were submitted or messages sent.

Evidence: .client/qa-routes.json, .client/qa-final.json, .client/qa-interactions.json, .client/autofixer.json, .client/build.log. Final screenshots: .client/final-390-home.png, .client/final-1440-home.png and .client/youtube-1440.png; route screenshots accompany them.

## Boundaries

Local demo forms/chat have no real delivery configuration. No backend credentials, public deployment or CRM registration were added. Source generic decorative hero/body/budget car illustrations remain; actual stock uses ASKO photographs. Legacy/presentation/admin sample routes and unreferenced source assets remain part of the retained codebase and are not offered homepage variants. Viber account availability and physical-device acceptance remain unverified.
''',encoding='utf-8')
print('Client metadata and brief saved')
