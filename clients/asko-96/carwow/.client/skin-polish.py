import pathlib,re
p=pathlib.Path('.')
for f in (p/'src').rglob('*'):
 if f.suffix not in ['.svelte','.css','.ts']:continue
 s=f.read_text(encoding='utf-8');b=s
 s=s.replace('Понеделник–петък 9:00 – 18:00','Понеделник–петък 09:00–18:30').replace('Огледи през уикенда с уговорка','Събота 10:00–16:00 · Неделя: почивен ден').replace('Виж всички отзиви','Разгледай услугите').replace('title="Instagram"','title="YouTube"').replace("title: 'Instagram'","title: 'YouTube'")
 s=s.replace('/assets/asko96/asko96-logo.png','/assets/asko96/asko96-wordmark.png')
 if f.suffix in ['.svelte','.css']:
  for color in ['#c91620','#d71920','#c8102e','#b00000','#ba0032','#bd002a','#c3002f']:
   s=re.sub(re.escape(color), '#8b6811',s,flags=re.I)
  s=s.replace('#a50d20','#6f5108')
 s=s.replace('<SiteChromeIcon name="instagram" />','<img src="/assets/icons/youtube-footer.svg" width="20" height="20" alt="" />').replace('<DayNightFooterIcon name="instagram" />','<img src="/assets/icons/youtube-footer.svg" width="20" height="20" alt="" />')
 if f.name=='MobileHome.svelte':s=re.sub(r"(\{:else if icon === 'instagram'\})\s*<svg.*?</svg>",r'\1<img src="/assets/icons/youtube-footer.svg" width="20" height="20" alt="" />',s,flags=re.S)
 if s!=b:f.write_text(s,encoding='utf-8')
f=p/'src/lib/styles/tokens.css';s=f.read_text(encoding='utf-8');s+='''\n/* ASKO96 supplied white wordmark: preserve native logo sizing, adapt contrast to the existing surfaces. */
img[src*="asko96-wordmark"], img[srcset*="asko96-wordmark"] { filter: brightness(0); }
footer img[src*="asko96-wordmark"], footer img[srcset*="asko96-wordmark"], .chat-launcher img[src*="asko96-wordmark"], .site-chrome-nav-row img[srcset*="asko96-wordmark"] { filter: none; }
''';f.write_text(s,encoding='utf-8')
