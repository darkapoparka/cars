exec(open('J:/cars/audits/2026-09-08/auto-best-improvements/edit.py',encoding='utf-8').read().split("edit('src/app.css'")[0])
p='src/lib/components/listing/VehicleDiscoveryForm.svelte'
edit(p,'import { bodyLabel,','import { activeFilterCount, listingHiddenFields, bodyLabel,')
transform(p,lambda s:re.sub(r'let activeCount = \$derived\(Object.entries.*?;', 'let activeCount = $derived(activeFilterCount(pending));',s))
transform(p,lambda s:re.sub(r'  let hiddenFields = \$derived\(\[.*?\]\);',"  let hiddenFields = $derived(listingHiddenFields(filters, ['make', 'model', 'body', 'price_max', 'year_min', 'mileage_max', 'equipment']));",s,count=1,flags=re.S))
edit('src/lib/components/home/BodyTypes.svelte',"image={'/assets/images/icon-box/car-list8.png'}",'image="/assets/images/icon-box/car-list8.png"')
edit('AGENTS.md','`nFor shared','\nFor shared')
transform('src/lib/components/home/Hero.svelte',lambda s:s.replace('  @media (max-width: 991px) {\n  }\n\n','').replace('\n\n\n\n','\n\n'))
import json
f=root/'.template/template.json';data=json.loads(f.read_text(encoding='utf-8'));data['version']='2026.09.08-polish-1';data['brandFiles'].insert(1,'src/lib/config/template.ts');data['brandFiles'].append('src/lib/styles/tokens.css');data['note']='Audit-backed mobile/desktop polish and domain/component refactor. Source identity and sample stock retained; preview only.';data['improvementEvidence']='J:/cars/audits/2026-09-08/auto-best-improvements/REPORT.md';f.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
edit('TEMPLATE.md','2026.09.06-refresh-1` · family','2026.09.08-polish-1` · family')
edit('TEMPLATE.md','The current copy passed validation: 73 native application/config files; 85 guarded and referenced assets; zero Svelte errors/warnings. Identity is centralized more than in the captured-page templates. Inventory and hero data still belong to the source dealer and must be replaced per client.','The 8 September improvement release adds vehicle-aware contact context, retained list state, stock-driven discovery, optional sample sections and modular data/style ownership. Inventory and hero data still belong to the source dealer and must be replaced per client. See the release evidence below for current validation counts.')
transform('TEMPLATE.md',lambda s:s+'''\n## Improvement release 2026.09.08-polish-1

See [ARCHITECTURE.md](ARCHITECTURE.md) for ownership and the [implementation report](J:/cars/audits/2026-09-08/auto-best-improvements/REPORT.md) for findings disposition and current tests. Matched screenshots are in [comparison.html](J:/cars/audits/2026-09-08/auto-best-improvements/comparison.html).

Before browser checks set `$env:BASE_URL='http://127.0.0.1:6461'` after confirming listener ownership. Run `npm run smoke`; `npm run quality` includes browser qualification as well as validation. `template.ts` defaults to preview/noindex, with sample team and partner sections off. Stock is explicitly unverified sample data; publication requires identity and record-level verification. Existing client copies are unchanged.
''')
