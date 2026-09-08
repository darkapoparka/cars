from pathlib import Path
import json,hashlib,shutil
from PIL import Image,ImageDraw,ImageFont
out=Path('J:/cars/audits/2026-09-08/auto-best-improvements');root=Path('J:/cars/templates/auto-best');desktop=Path('C:/Users/radev/Desktop/Auto-Best-Improvements-2026-09-08')
for name in ['after-manifest.json','changes.json']:
 records=json.loads((out/name).read_text(encoding='utf-8'))
 for record in records:
  f=root/record['path'];record['sha256']=hashlib.sha256(f.read_bytes()).hexdigest();record['bytes']=f.stat().st_size
 (out/name).write_text(json.dumps(records,indent=2),encoding='utf-8')
shutil.copy2(root/'artifacts/validate.log',out/'evidence/validate.log')
for name in ['final-surfaces.json','gallery-check.json']:shutil.copy2(out/name,out/'evidence'/name)
font=ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf',23)
for key,left,right,limit in [('mobile-enquiry','before/390-leasing-top.png','after/390-leasing-top.png',None),('mobile-brands','before/390-brands.png','after/390-brands.png',None),('mobile-bodies','before/390-bodies.png','after/390-bodies.png',None),('desktop-article','before/1440-article.png','after/1440-article.png',720)]:
 a=Image.open(out/left).convert('RGB');b=Image.open(out/right).convert('RGB')
 if limit:a.thumbnail((limit,10000));b.thumbnail((limit,10000))
 canvas=Image.new('RGB',(a.width+b.width+48,max(a.height,b.height)+82),'#f4f5f7');draw=ImageDraw.Draw(canvas)
 draw.text((16,18),'Before',fill='#202329',font=font);draw.text((a.width+32,18),'After',fill='#202329',font=font)
 canvas.paste(a,(16,62));canvas.paste(b,(a.width+32,62));canvas.save(out/f'{key}-comparison.png');shutil.copy2(out/f'{key}-comparison.png',desktop/f'{key}-comparison.png')
report=(out/'REPORT.md').read_text(encoding='utf-8').replace('../auto-best/README.md','J:/cars/audits/2026-09-08/auto-best/README.md').replace('../../../templates/auto-best/ARCHITECTURE.md','J:/cars/templates/auto-best/ARCHITECTURE.md')
(out/'REPORT.md').write_text(report,encoding='utf-8');(desktop/'REPORT.md').write_text(report,encoding='utf-8')
for folder in ['after','evidence']:shutil.copytree(out/folder,desktop/folder,dirs_exist_ok=True)
catalog=Path('J:/cars/catalog.json');s=catalog.read_text(encoding='utf-8');s=s.replace('"updated": "2026-09-06"','"updated": "2026-09-08"',1);catalog.write_text(s,encoding='utf-8')
print('Final evidence and comparison images refreshed.')
