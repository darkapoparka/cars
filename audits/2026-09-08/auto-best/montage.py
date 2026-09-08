from PIL import Image, ImageOps, ImageDraw
from pathlib import Path
root=Path(__file__).parent/'evidence'
groups={
 'mobile-company':['mobile-about.png','mobile-contact.png','mobile-inspection.png','mobile-leasing.png','mobile-import.png','mobile-sell.png'],
 'desktop-secondary':['desktop-home.png','desktop-blog.png','desktop-contact.png','desktop-inspection.png','desktop-leasing.png','desktop-import.png','desktop-sell.png','desktop-article-1.png'],
 'mobile-vehicles':[f'mobile-vehicle-{i}.png' for i in range(1,9)],
 'desktop-vehicles':[f'desktop-vehicle-{i}.png' for i in range(1,9)],
 'mobile-articles':[f'mobile-article-{i}.png' for i in range(1,10)],
 'desktop-articles':[f'desktop-article-{i}.png' for i in range(1,10)],
 'mobile-errors':['mobile-inventory-empty.png','mobile-blog-empty.png','mobile-not-found.png','mobile-vehicle-missing.png','mobile-article-missing.png'],
 'edge-headers':['edge-320x844-.png','edge-430x932-.png','edge-768x900-.png','edge-991x900-.png','edge-992x900-.png','edge-1024x900-.png','edge-1280x900-.png','edge-1920x1080-.png']
}
for name,files in groups.items():
 cols=3 if 'articles' in name else 4
 w,h=330,1150
 canvas=Image.new('RGB',(cols*w,((len(files)+cols-1)//cols)*h),'#d5d5d5');draw=ImageDraw.Draw(canvas)
 for i,f in enumerate(files):
  if not (root/f).exists(): print('missing',f);continue
  im=Image.open(root/f).convert('RGB');im.thumbnail((w-12,h-35))
  x=(i%cols)*w;y=(i//cols)*h
  draw.text((x+6,y+5),f,fill='black');canvas.paste(im,(x+6,y+28))
 canvas.save(root/('montage-'+name+'.jpg'),quality=88)
