"""Export the approved-for-demo ImageGen-derived outlines. No font dependency."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, re, shutil, hashlib
HERE=Path(__file__).resolve().parent
CLIENT=HERE.parent.parent
G=json.loads((HERE/'logo-geometry.json').read_text('utf8'))
SCALE=4
YELLOW='#FFE500'
INK='#121417'
def paint(image, paths, fill):
    for path in paths:
        mask=Image.new('L',image.size,0)
        pen=ImageDraw.Draw(mask)
        for index, ring in enumerate(re.findall(r'M([^M]+)',path)):
            pairs=re.findall(r'(-?\d+) (-?\d+)',ring)
            pen.polygon([(int(x)*SCALE,int(y)*SCALE) for x,y in pairs],fill=255 if index==0 else 0)
        image.paste(Image.new('RGBA',image.size,fill),(0,0),mask)
exports={}
for surface,color in [('light',INK),('dark',YELLOW)]:
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 696 438" role="img" aria-label="OUTLET CARS.BG"><title>OUTLET CARS.BG</title><rect x="10" y="10" width="676" height="196" rx="2" fill="'+YELLOW+'"/>'
    svg+=''.join(f'<path fill="{INK}" fill-rule="evenodd" d="{p}"/>' for p in G['top'])
    svg+=''.join(f'<path fill="{color}" fill-rule="evenodd" d="{p}"/>' for p in G['bottom'])+'</svg>\n'
    name=f'logo-on-{surface}-v2'
    (HERE/(name+'.svg')).write_text(svg,'utf8')
    image=Image.new('RGBA',(696*SCALE,438*SCALE),(0,0,0,0))
    ImageDraw.Draw(image).rounded_rectangle((40,40,2744,824),radius=8,fill=YELLOW)
    paint(image,G['top'],INK); paint(image,G['bottom'],color)
    image.resize((1392,876),Image.Resampling.LANCZOS).save(HERE/(name+'.png'),optimize=True)
# The O from the generated wordmark remains readable at browser-tab size.
icon_svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect x="24" y="24" width="464" height="464" rx="84" fill="'+YELLOW+'"/><path transform="translate(74.35 19.75) scale(2.1)" fill="'+INK+'" fill-rule="evenodd" d="'+G['top'][-1]+'"/></svg>\n'
(HERE/'icon-v2.svg').write_text(icon_svg,'utf8')
letter=Image.new('RGBA',(696*SCALE,438*SCALE),(0,0,0,0)); paint(letter,[G['top'][-1]],INK)
letter=letter.crop((40*SCALE,33*SCALE,134*SCALE,193*SCALE)).resize((395,672),Image.Resampling.LANCZOS)
icon=Image.new('RGBA',(1024,1024),(0,0,0,0)); ImageDraw.Draw(icon).rounded_rectangle((48,48,976,976),radius=168,fill=YELLOW)
icon.alpha_composite(letter,((1024-395)//2,(1024-672)//2))
for size in [32,48,180,192,512]: icon.resize((size,size),Image.Resampling.LANCZOS).save(HERE/f'icon-{size}-v2.png',optimize=True)
icon.resize((256,256),Image.Resampling.LANCZOS).save(HERE/'favicon-v2.ico',sizes=[(16,16),(32,32),(48,48)])
original=CLIENT/'assets/logo.png'
if original.exists() and not (HERE/'published-original.png').exists(): shutil.copyfile(original,HERE/'published-original.png')
shutil.copyfile(HERE/'logo-on-light-v2.png',original)
for variant in ['auto-best','carwow','import']:
    public=CLIENT/variant/'static'; dealer=public/'dealer'
    for name in ['logo-on-light-v2.svg','logo-on-dark-v2.svg','logo-on-light-v2.png','logo-on-dark-v2.png','icon-v2.svg','favicon-v2.ico','icon-32-v2.png','icon-180-v2.png','icon-192-v2.png','icon-512-v2.png']:
        shutil.copyfile(HERE/name,dealer/name)
    for old,new in [('logo.png','logo-on-light-v2.png'),('logo-light.png','logo-on-dark-v2.png'),('logo-dark.png','logo-on-light-v2.png'),('favicon.png','icon-32-v2.png'),('apple-touch-icon.png','icon-180-v2.png'),('favicon.ico','favicon-v2.ico')]: shutil.copyfile(HERE/new,dealer/old)
    shutil.copyfile(HERE/'favicon-v2.ico',public/'favicon.ico')
    exports[variant]={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in dealer.glob('*v2*')}
(HERE/'exports.json').write_text(json.dumps(exports,indent=2)+'\n','utf8')
print('Integrated transparent outlined SVG, 2x PNG and icons into all three Outletcars applications.')
