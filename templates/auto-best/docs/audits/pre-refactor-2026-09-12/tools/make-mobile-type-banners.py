from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(r'J:\cars\templates\auto-best')
OUT = ROOT / 'static' / 'assets' / 'images' / 'generated'
OUT.mkdir(parents=True, exist_ok=True)
W, H = 600, 420
FONT_B = r'C:\Windows\Fonts\segoeuib.ttf'
FONT_R = r'C:\Windows\Fonts\segoeui.ttf'

def font(path, size): return ImageFont.truetype(path, size)
def load(rel): return Image.open(ROOT / 'static' / rel.lstrip('/')).convert('RGBA')
def cover_gradient():
    im = Image.new('RGB', (W, H), '#0b0d10')
    px = im.load()
    for y in range(H):
        for x in range(W):
            r = int(11 + 22 * (x / W) * (y / H))
            g = int(13 + 5 * (y / H))
            b = int(16 + 8 * (x / W))
            px[x, y] = (r, g, b)
    glow = Image.new('RGBA', (W, H), (0,0,0,0)); gd = ImageDraw.Draw(glow)
    gd.ellipse((360, 70, 760, 470), fill=(196,1,1,105)); glow = glow.filter(ImageFilter.GaussianBlur(75))
    return Image.alpha_composite(im.convert('RGBA'), glow)

def add_car(base, rel, box):
    car = load(rel); car.thumbnail((box[2]-box[0], box[3]-box[1]), Image.Resampling.LANCZOS)
    x = box[0] + (box[2]-box[0]-car.width)//2; y = box[1] + (box[3]-box[1]-car.height)//2
    base.alpha_composite(car, (x,y))

def card(filename, title, subtitle, rel):
    base = cover_gradient(); d = ImageDraw.Draw(base)
    d.text((34, 30), title, font=font(FONT_B, 48), fill='white')
    d.text((36, 92), subtitle, font=font(FONT_R, 25), fill='#d9dde4', spacing=4)
    add_car(base, rel, (88, 150, 575, 372))
    d.ellipse((34, 318, 104, 388), outline='#e51b32', width=4, fill=(12,14,18,205))
    d.text((56, 329), '→', font=font(FONT_R, 37), fill='white')
    base.convert('RGB').save(OUT / filename, quality=89, optimize=True)

card('body-suv-mobile.jpg', 'SUV', 'Сила във\nвсеки път', '/assets/images/lead/day-night-cutout-urus-v1.webp')
card('body-wagon-mobile.jpg', 'Комби', 'Повече\nпространство', '/assets/images/template/body-wagon-v1.png')
card('body-coupe-mobile.jpg', 'Купе', 'Стил без\nкомпромис', '/assets/images/lead/day-night-cutout-porsche-v1.webp')

base = cover_gradient(); d = ImageDraw.Draw(base)
d.text((34, 30), 'Всички\nтипове', font=font(FONT_B, 44), fill='white', spacing=0)
d.text((36, 137), 'Разгледайте\nцялата гама', font=font(FONT_R, 24), fill='#d9dde4', spacing=3)
add_car(base, '/assets/images/lead/day-night-cutout-urus-v1.webp', (225, 145, 575, 330))
add_car(base, '/assets/images/lead/day-night-cutout-porsche-v1.webp', (150, 225, 440, 388))
d.ellipse((34, 318, 104, 388), outline='#e51b32', width=4, fill=(12,14,18,205))
d.text((56, 329), '→', font=font(FONT_R, 37), fill='white')
base.convert('RGB').save(OUT / 'body-all-mobile.jpg', quality=89, optimize=True)
print(OUT)
