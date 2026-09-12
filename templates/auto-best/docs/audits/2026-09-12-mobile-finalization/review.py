from pathlib import Path
from PIL import Image, ImageDraw
import json
root=Path(__file__).parent
out=root/'evidence'
data=json.loads((out/'browser-routes.json').read_text(encoding='utf-8'))['results']
links=json.loads((out/'internal-links.json').read_text(encoding='utf-8'))
print('routes',len(data),'status errors',[(r['width'],r['route'],r.get('status')) for r in data if r.get('status') not in (200,404)])
print('exceptions',[(r['width'],r['route'],r.get('failure')) for r in data if r.get('failure')])
print('console errors',[(r['width'],r['route'],r['consoleErrors']) for r in data if r['consoleErrors']][:15])
print('bad links',[r for r in links if r.get('status')!=200])
for r in data:
 if r['width']==390 and r['route'] in ['/', '/listing-grid','/listing-detail-v1/1','/contact','/about-us','/blog']:
  resources=r['dom']['resources'];print(r['route'],'height',r['dom']['height'],'local transferred bytes',sum(a['bytes'] for a in resources),'largest',sorted(resources,key=lambda x:x['bytes'],reverse=True)[:6])
groups={
 'core':['/listing-grid','/contact','/contact?topic=leasing&vehicle=4','/about-us','/blog','/blog-detail/1'],
 'details':[f'/listing-detail-v1/{i}' for i in range(1,9)],
 'articles':[f'/blog-detail/{i}' for i in range(1,10)],
 'narrow':['/','/listing-grid','/contact?topic=trade-in','/contact?topic=import','/listing-detail-v1/1'],
 'empty':['/listing-grid?q=no-match-xyz','/blog?q=no-match-xyz','/missing-page'],
}
for group,routes in groups.items():
 width=320 if group=='narrow' else 390
 rows=[r for route in routes for r in data if r['width']==width and r['route']==route and 'screenshot' in r]
 for start in range(0,len(rows),3):
  batch=rows[start:start+3]; imgs=[Image.open(out/r['screenshot']).convert('RGB') for r in batch]
  if not imgs:continue
  # Full-height columns preserve source pixels; image reader can inspect each section.
  sheet=Image.new('RGB',(width*len(imgs),max(i.height for i in imgs)+28),'white');draw=ImageDraw.Draw(sheet)
  for j,(im,r) in enumerate(zip(imgs,batch)):
   sheet.paste(im,(j*width,28));draw.text((j*width+4,6),r['route'][:55],fill='black')
  sheet.save(out/f'{group}-{start//3+1}.jpg',quality=90)
print('Contact sheets created')
