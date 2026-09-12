from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, shutil, subprocess
from PIL import Image, ImageDraw, ImageFont
root = Path('J:/cars/templates/auto-best')
out = root / 'docs/implementation/2026-09-12-mobile'
def load(path):
    raw = Path(path).read_bytes()
    return json.loads(raw.decode('utf-16' if raw[:2] in [b'\xff\xfe', b'\xfe\xff'] else 'utf-8-sig'))
suites = load(out/'production-tests.json')
webkit_suites = load(out/'webkit-tests.json')
assert isinstance(suites,list) and len(suites)==9 and all(item['exit']==0 for item in suites), suites
assert isinstance(webkit_suites,list) and len(webkit_suites)==2 and all(item['exit']==0 for item in webkit_suites), webkit_suites
reports = {}
for engine in ['chromium','webkit']:
    for group in ['mobile-quality','mobile-resilience']:
        report = load(root/f'artifacts/{group}-{engine}/report.json')
        assert all(item['passed'] for item in report['results']), (group,engine)
        reports[f'{group}-{engine}'] = report
capture = load(root/'artifacts/mobile-changes-chromium/report.json')
assert len(capture['results']) == 70
render = load(root/'artifacts/mobile-render-check/report.json')
assert all(item['passed'] for item in render['results'])
stage = Path('J:/cars/runtime/auto-best-production-check-20260912')
source = list((root/'src').rglob('*')) + [root/name for name in ['svelte.config.js','package.json','package-lock.json']]
hashes = {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in source if p.is_file()}
assert all((stage/p).is_file() and hashlib.sha256((stage/p).read_bytes()).hexdigest()==digest for p,digest in hashes.items()), 'Built source and live working copy must match'
(out/'source-verification.json').write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'builtCopyMatchesSource':True,'files':hashes},indent=2),encoding='utf-8')
lines = ['# Final automated QA results', '', f'Generated: {datetime.now(timezone.utc).isoformat()}', '',
    'Main dev URL: `http://127.0.0.1:6461`. Automated production checks: `http://127.0.0.1:6462`.',
    'The isolated built copy matches every source file and relevant build/package configuration; see `source-verification.json`.', '',
    '## Gates', '', '| Check | Result |', '| --- | --- |',
    '| Architecture / assets / domain | Passed in `production-build.log` |',
    '| Svelte and TypeScript | 0 errors, 0 warnings; fail-on-warnings enabled |',
    '| Production build | Passed; isolated from the live dev server |',
    '| Dependency audit | 0 reported vulnerabilities; `dependency-audit-current.json` |']
for item in suites: lines.append(f"| Chromium: {item['suite']} | Passed |")
for item in webkit_suites: lines.append(f"| WebKit: {item['suite']} | Passed |")
lines += ['', '## Route, state and visual coverage', '',
    'The existing route/journey suites exercise all eight vehicle detail records, all nine articles, core routes, enquiry topics, filtered return destinations, no-results and invalid IDs/404s. The new screenshot pass adds 70 route/viewport combinations at 320, 390, 430, 767, 768, 992 and 1440 CSS pixels.',
    'Five additional active-state captures cover PDP panels, the calculator, Sell and Import drawers, and shared search. Screenshot success is not a substitute for design approval.', '']
for name,report in reports.items():
    lines.append(f"`{name}`: {sum(row['passed'] for row in report['results'])}/{len(report['results'])} checks passed; run {report['generatedAt']}.")
lines += ['', 'The quality suite includes route and open-modal accessibility, nested focus/scroll, whitespace/year validation, finance context and cold-image budgets. The resilience suite covers finance return/edit, blocked stock images including pre-hydration failures, short viewports, clipboard denial/share cancellation, and actual production CSP/noindex behavior.', '',
    '## Cold-image payload', '', '| Browser | Pixel density | Initial image bodies | Full-scroll image bodies |', '| --- | --- | ---: | ---: |']
for engine in ['chromium','webkit']:
    for row in reports[f'mobile-quality-{engine}']['results']:
        if row['name'].startswith('cold mobile'):
            e=row['evidence']; lines.append(f"| {engine} | {row['name'].split('DPR ')[1]} | {e['initialBytes']:,} bytes | {e['fullBytes']:,} bytes |")
lines += ['', 'All initial captures are below the 1.5 MB image budget. The original local audit recorded about 12.2 MB of initial image transfer. The old transfer metric includes response overhead while these new measurements count response bodies; use this as a payload comparison, not a field-performance or speed score.', '',
    '## Text growth and constrained network', '',
    'Six route families passed a 200% computed-font-size stress test without document-wide horizontal overflow. The test is not native OS text sizing. Fixed mobile actions were additionally changed to grow with wrapped labels and reserve their measured height.', '']
for row in render['results']:
    if 'performance' in row: lines.append(f"Local production synthetic run: {row['test']}; observed LCP {row['performance']['lcp']:.0f} ms, CLS {row['performance']['cls']:.5f}. This is one laboratory run, not field Core Web Vitals or an INP result.")
lines += ['', '## Reproduction', '',
    'Use the template-pinned Node 22 runtime. Set `BASE_URL` to the confirmed preview before browser suites. Standard `npm run quality` includes validation, existing smoke suites, mobile quality and resilience. Do not build into the live dev server\'s generated output concurrently; use the isolated staging workflow recorded by `prepare-production.py`.', '',
    '```powershell', "$env:BASE_URL='http://127.0.0.1:6462'", "$env:PRODUCTION_ASSERTIONS='1'", 'npm run smoke', 'npm run check:mobile', 'npm run check:resilience', "$env:PLAYWRIGHT_ENGINE='webkit'", 'npm run check:mobile', 'npm run check:resilience', '```', '',
    '## Explicit limitations', '',
    'Physical iPhone/Android keyboard, upload picker and native share-sheet delivery, VoiceOver/TalkBack, and final human content/artwork approval remain unverified. WebKit automation is not a physical Safari session. Clipboard/sharing rejection and cancellation tests use controlled browser stubs; no customer enquiry was sent.',
    'Automated accessibility excludes third-party iframe contents and retains incomplete/manual-review rules in its JSON. No claim of universal WCAG compliance is made. The built preview is local, not a public production deployment. Sample-stock/noindex guards remain enabled.', '',
    'Earlier failed exploratory logs are retained for diagnosis. The authoritative completed suite results are `production-tests.json` and `webkit-tests.json`, with the corresponding final logs and artifact report timestamps.', '',
    '## Screenshots', '',
    '![Current mobile panels, dark enquiry, and shared search](screenshots/mobile-overview.jpg)', '',
    '[PDP first screen](screenshots/pdp-first-screen.png) · [Financing panels](screenshots/pdp-banners-390.png) · [Dark Sell drawer](screenshots/sell-drawer-390.png) · [Import drawer](screenshots/import-drawer-390.png) · [Full homepage](screenshots/home-390.png)']
(out/'QA-RESULTS.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
shots=out/'screenshots'; shots.mkdir(exist_ok=True)
for name in ['home-390.png','home-320.png','pdp-banners-390.png','finance-drawer-390.png','sell-drawer-390.png','import-drawer-390.png','shared-search-390.png']:
    shutil.copy2(root/'artifacts/mobile-changes-chromium'/name,shots/name)
shutil.copy2(root/'artifacts/mobile-quality-chromium/route-_listing_detail_v1_1.png',shots/'pdp-first-screen.png')
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
board=Image.new('RGB',(1202,904),'#f1f2f4'); draw=ImageDraw.Draw(board)
for index,(name,title) in enumerate([('pdp-banners-390.png','PDP: financing and seller'),('sell-drawer-390.png','Sell: dark enquiry drawer'),('shared-search-390.png','Home and inventory: shared filters')]):
    draw.text((12+index*398,14),title,font=font,fill='#14171d')
    board.paste(Image.open(shots/name).convert('RGB'),(8+index*398,48))
board.save(shots/'mobile-overview.jpg',quality=92)
print('QA-RESULTS.md, source verification and selected screenshots written; all required final suites passed.')
