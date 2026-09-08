from pathlib import Path
import json,hashlib,shutil
from PIL import Image,ImageDraw,ImageFont
out=Path('J:/cars/audits/2026-09-08/auto-best-improvements')
root=Path('J:/cars/templates/auto-best')
f=out/'REPORT.md';s=f.read_text(encoding='utf-8').replace('M02/M03, D02','M02, D02').replace('M08, D04','M03, D04').replace('M05/M06, D06','M05, D06').replace('| D07 |','| M06, D07 |').replace('M01/error-route context','M08').replace('M10, D01','M01/M10, D01');f.write_text(s,encoding='utf-8')
# Update only Auto Best's catalog entry; other templates retain their exact text.
catalog=Path('J:/cars/catalog.json');s=catalog.read_text(encoding='utf-8');(out/'before-catalog.json').write_text(s,encoding='utf-8')
start=s.index('      "key": "auto-best"');end=s.index('\n    },',start)
segment=s[start:end].replace('2026.09.06-refresh-1','2026.09.08-polish-1').replace('"src/lib/config/brand.ts",','"src/lib/config/brand.ts",\n        "src/lib/config/template.ts",\n        "src/lib/styles/tokens.css",').replace('Polished native SvelteKit derivative. One retained composition; retired variants redirect. Current working files include local polish beyond HEAD.','Audited mobile/desktop polish with vehicle context, stock-driven discovery and modular data/style ownership. Source branding and sample stock retained; preview only.')
after=s[:start]+segment+s[end:]
assert json.loads(s)['templates'][1:]==json.loads(after)['templates'][1:]
catalog.write_text(after,encoding='utf-8')
evidence=out/'evidence';evidence.mkdir(exist_ok=True)
shutil.copy2(root/'artifacts/validate.log',evidence/'validate.log')
for name in ['domain','route-smoke','journey-smoke','mobile-filter-smoke','enquiry-smoke','desktop-discovery-smoke']:
 shutil.copy2(root/f'artifacts/{name}/report.json',evidence/f'{name}.json')
files=list((root/'src').rglob('*'))+list((root/'scripts').rglob('*'))+[root/name for name in ['package.json','package-lock.json','svelte.config.js','TEMPLATE.md','AGENTS.md','ARCHITECTURE.md','.template/template.json']]
manifest=[{'path':str(p.relative_to(root)).replace('\\','/'),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in files if p.is_file()]
(out/'after-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
old={item['path']:item for item in json.loads((out/'before-manifest.json').read_text(encoding='utf-8'))}
changes=[dict(item,status='added' if item['path'] not in old else 'changed') for item in manifest if item['path'] not in old or item['sha256']!=old[item['path']]['sha256']]
(out/'changes.json').write_text(json.dumps(changes,indent=2),encoding='utf-8')
font=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',23)
def comparison(left,right,target,limit=None):
 a=Image.open(left).convert('RGB');b=Image.open(right).convert('RGB')
 if limit:
  a.thumbnail((limit,10000));b.thumbnail((limit,10000))
 canvas=Image.new('RGB',(a.width+b.width+48,max(a.height,b.height)+82),'#f4f5f7');d=ImageDraw.Draw(canvas)
 d.text((16,18),'Before',fill='#202329',font=font);d.text((a.width+32,18),'After',fill='#202329',font=font)
 canvas.paste(a,(16,62));canvas.paste(b,(a.width+32,62));canvas.save(target)
comparison(out/'before/390-leasing-top.png',out/'after/390-leasing-top.png',out/'mobile-enquiry-comparison.png')
comparison(out/'before/1440-article.png',out/'after/1440-article.png',out/'desktop-article-comparison.png',720)
# These crops use the baseline audit's recorded heading coordinates for identical source files.
baseline=json.loads(Path('J:/cars/audits/2026-09-08/auto-best/evidence/routes.json').read_text(encoding='utf-8'))
home=next(r for r in baseline if r['key']=='home' and r['width']==390)
before=Image.open(out/'before/390-home.png')
for key,needle,height in [('brands','По марка',310),('bodies','По тип купе',458)]:
 heading=next(h for h in home['page']['headings'] if needle in h['text'])
 y=int(heading['y'])-12
 before.crop((0,y,390,y+height)).save(out/f'before/390-{key}.png')
 comparison(out/f'before/390-{key}.png',out/f'after/390-{key}.png',out/f'mobile-{key}-comparison.png')
desktop=Path('C:/Users/radev/Desktop/Auto-Best-Improvements-2026-09-08');desktop.mkdir(exist_ok=True)
for name in ['comparison.html','REPORT.md','mobile-enquiry-comparison.png','mobile-brands-comparison.png','mobile-bodies-comparison.png','desktop-article-comparison.png']:
 shutil.copy2(out/name,desktop/name)
for name in ['before','after','evidence']:
 shutil.copytree(out/name,desktop/name,dirs_exist_ok=True)
print(json.dumps({'changedFiles':len(changes),'desktop':str(desktop),'reports':{name:len(json.loads((evidence/f'{name}.json').read_text()) .get('results',[])) for name in ['route-smoke','journey-smoke','mobile-filter-smoke','enquiry-smoke','desktop-discovery-smoke']}},indent=2))
