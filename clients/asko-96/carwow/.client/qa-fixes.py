import pathlib,re
p=pathlib.Path('.')
for f in (p/'src').rglob('*'):
 if f.suffix not in ['.svelte','.ts','.html']:continue
 s=f.read_text(encoding='utf-8');b=s
 s=s.replace('Day Night','АСКО 96').replace('Ден и Нощ Ауто Груп','АСКО 96').replace('+359888626117','+359899769696').replace('/brand/daynight-team-placeholder.svg','/assets/asko96/asko96-showroom.jpg')
 s=re.sub(r'/assets/images/(?:sell|services)/[^\s\'"`)>]+','/assets/asko96/asko96-showroom.jpg',s)
 if f.name=='DesktopYellowRouteHero.svelte':s=s.replace("resolve('/assets/daynight-contact/contact-support-cutouts.webp')","side === 'left' ? leftCarSrc : rightCarSrc")
 if s!=b:f.write_text(s,encoding='utf-8')
f=p/'static/site.webmanifest';s=f.read_text(encoding='utf-8').replace('Ден и Нощ Ауто Груп','АСКО 96');f.write_text(s,encoding='utf-8')
for rel in ['contact/MobileContactPage.svelte','sell/MobileSellYourCarPage.svelte','sell/DesktopSellYourCarPage.svelte']:
 f=p/'src/lib/components'/rel;s=f.read_text(encoding='utf-8');
 s=s.replace('<form\n\t\t\t\t\t\tclass="mobile-contact-form"','<p class="text-sm">Демо форма без доставка. За реално запитване: 0899 76 96 96.</p>\n\t\t\t\t\t<form\n\t\t\t\t\t\tclass="mobile-contact-form"')
 if '/sell/' in '/'+rel:
  s=s.replace('<form','<p class="text-sm">Демо форма без доставка. За реална оценка: 0899 76 96 96.</p>\n<form')
 f.write_text(s,encoding='utf-8')
