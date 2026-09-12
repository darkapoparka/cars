from pathlib import Path
from PIL import Image
import hashlib,json
B=Path(__file__).resolve().parents[2]
checks=[]
for variant in ['auto-best','carwow','import']:
    public=B/variant/'static/dealer'
    for surface in ['light','dark']:
        stem='logo-on-'+surface+'-v2'
        svg=(public/(stem+'.svg')).read_text('utf8')
        assert '<image' not in svg and '<text' not in svg and '<filter' not in svg
        assert svg.count('<path ')==13 and '0 0 696 438' in svg
        image=Image.open(public/(stem+'.png')).convert('RGBA')
        alpha=image.getchannel('A'); assert alpha.getextrema()==(0,255)
        assert all(alpha.getpixel(p)==0 for p in [(0,0),(1391,0),(0,875),(1391,875),(10,400)])
        assert (public/(stem+'.svg')).read_bytes()==(B/'assets/branding'/(stem+'.svg')).read_bytes()
        checks.append({'variant':variant,'surface':surface,'transparent':True,'outlined':True,'size':image.size})
    for size in [180,192,512]:
        icon=Image.open(public/f'icon-{size}-v2.png'); assert icon.size==(size,size)
    assert (public/'favicon-v2.ico').stat().st_size>100
    for p in (B/variant/'src').rglob('*'):
        if p.is_file() and p.suffix in ['.svelte','.ts','.css','.html','.json']:
            assert '/dealer/logo.png' not in p.read_text('utf8'), str(p)
result={'checks':checks,'passed':True}
(B/'assets/branding/asset-checks.json').write_text(json.dumps(result,indent=2)+'\n','utf8')
print(json.dumps(result))
