import json,pathlib,re,shutil
p=pathlib.Path('.'); facts=json.loads((p/'../business-facts.json').read_text(encoding='utf-8')); stock=json.loads((p/'../stock.json').read_text(encoding='utf-8'))
out=p/'static/assets/asko96';out.mkdir(parents=True,exist_ok=True)
for f in (p/'../assets').iterdir():
 if f.is_file():shutil.copy2(f,out/f.name)
repls={'DAY NIGHT AUTO GROUP':'АСКО 96','Day Night Auto Group':'АСКО 96','Day Night Auto':'АСКО 96','Day & Night Auto Group':'АСКО 96','Day & Night':'АСКО 96','DAY & NIGHT':'АСКО 96','0877733110':'0899769696','0877 733 110':'0899 76 96 96','+359877733110':'+359899769696','daynight.mobile.bg':'asko96.mobile.bg','гр. София, Студентски град, ул. Атанас Манчев 18':'гр. София, бул. „Ботевградско шосе“ 300','Студентски град · ул. Атанас Манчев 18':'Ботевградско шосе 300 · София','Студентски град':'Ботевградско шосе 300','ул. Атанас Манчев 18':'бул. „Ботевградско шосе“ 300','https://www.facebook.com/61566304063141/':facts['facebook'],'https://www.instagram.com/daynight.auto.plovdiv/':facts['youtube'],'/brand/daynight-logo-generated.png':facts['logo'],'/brand/daynight-favicon.png':facts['logo'],'/brand/daynight-og.svg':facts['showroom'],'/brand/daynight-hero-search-composed.webp':facts['showroom'],'/brand/daynight-hero-mobile-search-composed.webp':facts['showroom']}
changed=[]
for f in (p/'src').rglob('*'):
 if f.suffix not in ['.ts','.svelte','.css','.html']:continue
 s=f.read_text(encoding='utf-8');before=s
 for a,b in repls.items():s=s.replace(a,b)
 # Personalization media: source dealership/person imagery is replaced with actual ASKO showroom/stock.
 s=re.sub(r'/assets/(?:daynight-auto-v3|daynight)/[^\s\'"`)>]+',facts['showroom'],s)
 s=re.sub(r'/assets/images/(?:pages|services|import|home2)/[^\s\'"`)>]*(?:daynight|campaign)[^\s\'"`)>]*',facts['showroom'],s)
 s=re.sub(r'/assets/images/pages/daynight-[^\s\'"`)>]+',facts['showroom'],s)
 s=re.sub(r'/assets/images/home-promos/[^\s\'"`)>]+',stock[2]['images'][0],s)
 s=s.replace('aria-label="Instagram"','aria-label="YouTube"').replace("label: 'Instagram'","label: 'YouTube'").replace('input-instagram.svg','youtube-footer.svg')
 if s!=before:f.write_text(s,encoding='utf-8');changed.append(str(f))
site=p/'src/lib/data/daynight-site.ts';s=site.read_text(encoding='utf-8');s=re.sub(r'mapUrl:\s*\n?\s*\'[^\']+\'', 'mapUrl: '+json.dumps(facts['mapsUrl']),s);s=s.replace("email: ''", "email: 'askogroup@abv.bg'").replace('inventoryCount: 40','inventoryCount: 16');site.write_text(s,encoding='utf-8')
# Keep stock adapter interface but use exact verified fields.
f=p/'src/lib/data/daynight-current-inventory.ts';s=f.read_text(encoding='utf-8');head=s[:s.index('export const currentDayNightListings')];listings=[]
for v in stock:
 listings.append(dict(id=v['id'],title=v['title'],sourceUrl=v['sourceUrl'],priceEur=f"{v['priceEur']:,} €".replace(',',' '),priceBgn=f"{v['priceEur']*1.95583:,.2f} лв.".replace(',',' '),status='Публикувана обява',date=v['date'],mileage=f"{v['mileageKm']:,} км".replace(',',' '),color=v['color'],fuel=v['fuel'],power=f"{v['powerHp']} к.с.",transmission=v['transmission'],body={'Hatchback':'Хечбек','Wagon':'Комби','Sedan':'Седан','Coupe':'Купе','Van':'Ван'}.get(v['body'],v['body']),features=['Оборудването се потвърждава с АСКО 96'],image=v['images'][0]))
f.write_text(head+'export const currentDayNightListings = '+json.dumps(listings,ensure_ascii=False,indent=2)+' satisfies CurrentDayNightListing[];\n',encoding='utf-8')
(p/'src/lib/data/asko-stock.json').write_text(json.dumps(stock,ensure_ascii=False,indent=2),encoding='utf-8')
f=p/'src/lib/data/daynight-vehicles.ts';s=f.read_text(encoding='utf-8');s="import askoStock from './asko-stock.json';\n"+s;s=s.replace("const identity = getVehicleIdentity(listing);","const original = askoStock.find((vehicle) => vehicle.id === listing.id)!;\n\tconst identity = {brand: original.make, model: original.model, shortTitle: original.title};");s=s.replace("doors: body === 'Купе' ? 3 : 5,","doors: 0,");s=re.sub(r'monthly: `[^`]+`','monthly: \'Лизинг по запитване\'',s);s=s.replace('gallery: [listing.image]','gallery: original.images').replace('`DN-${listing.id.slice(-6)}`','`ASKO-${listing.id.slice(-6)}`').replace("'Наличен автомобил в София — свържете се за оглед.'","'Публикувана обява — наличността се потвърждава с АСКО 96.'").replace("const availability = isIncoming ? 'Очакван внос' : 'Наличен';","const availability = isIncoming ? 'Очакван внос' : 'Публикувана обява';");f.write_text(s,encoding='utf-8')
# Preserve testimonial card layout as sourced service highlights without fictitious customers or stars.
services=[('Автомобили','Продажба на автомобили','Разгледайте публикуваните предложения на АСКО 96. Потвърдете наличността преди посещение.'),('Замяна и изкупуване','Вашият автомобил','АСКО 96 предлага замяна и изкупуване. Свържете се с екипа за условията и оценка.'),('Внос по поръчка','По вашите критерии','Обсъдете търсения автомобил, бюджет и условия за внос с АСКО 96.'),('Собствен лизинг','Финансиране','АСКО 96 предлага собствен лизинг. Конкретните условия се уточняват индивидуално.'),('Сервизно обслужване','Следващи стъпки','Попитайте АСКО 96 за възможностите за сервизно обслужване.'),('Посещение','София','Ще намерите АСКО 96 на бул. „Ботевградско шосе“ 300 в София.')]
reviews=[dict(id=f'service-{i}',name=a,label=b,text=c,avatar=facts['logo']) for i,(a,b,c) in enumerate(services)]
f=p/'src/lib/data/daynight-reviews.ts';s=f.read_text(encoding='utf-8');head=s[:s.index('export const daynightReviews')];f.write_text(head+'export const daynightReviews = '+json.dumps(reviews,ensure_ascii=False,indent=2)+' satisfies DayNightReview[];\nexport const daynightReviewCount = daynightReviews.length;\nexport const daynightReviewCountLabel = `${daynightReviewCount} полезни акцента`;\nexport const daynightReviewLinkLabel = `Всички услуги`;\n',encoding='utf-8')
f=p/'src/lib/components/home/desktop/DesktopHomeReviews.svelte';s=f.read_text(encoding='utf-8');s=re.sub(r'const reviews: Review\[\] = \[.*?\n\t\];','const reviews: Review[] = '+json.dumps([dict(id=r['id'],description=r['text'],avatar=r['avatar'],name=r['name'],meta=r['label']) for r in reviews[:3]],ensure_ascii=False,indent=2)+';',s,flags=re.S);s=s.replace("const starIds = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'] as const;","const starIds: string[] = [];");f.write_text(s,encoding='utf-8')
for f in (p/'src').rglob('*'):
 if f.suffix not in ['.ts','.svelte']:continue
 s=f.read_text(encoding='utf-8');before=s;s=s.replace('Отзиви от клиенти','Услуги на АСКО 96').replace('Отзиви','Услуги и информация');
 if f.name=='ReviewsContent.svelte':s=s.replace('const stars = [0, 1, 2, 3, 4] as const;','const stars: number[] = [];')
 if s!=before:f.write_text(s,encoding='utf-8')
# Team cards represent contact topics, no fictional employees or photographs.
f=p/'src/lib/data/daynight-team.ts';s=f.read_text(encoding='utf-8');s=s.replace('Екип продажби АСКО 96','Продажба на автомобили').replace('Екип бартер и оценка','Замяна и изкупуване').replace('Екип документи и финансиране','Собствен лизинг').replace('Екип клиентски заявки','Контакт с АСКО 96');f.write_text(s,encoding='utf-8')
# Make the mega menu use the current real stock.
f=p/'src/lib/components/layout/site-navigation-data.ts';s=f.read_text(encoding='utf-8');s="import { cars } from '$lib/data/daynight-vehicles';\n"+s;s=re.sub(r'export const inventoryMegaMenuVehicleTiles = \[.*?\] satisfies readonly MegaMenuVehicleTile\[\];',"export const inventoryMegaMenuVehicleTiles = cars.slice(0, 8).map(car => ({label: car.shortTitle, slug: car.slug, image: car.image, meta: `${car.priceEur} · ${car.fuel}`})) satisfies readonly MegaMenuVehicleTile[];",s,flags=re.S);f.write_text(s,encoding='utf-8')
f=p/'src/lib/styles/tokens.css';s=f.read_text(encoding='utf-8');s=s.replace('--sa-red: #d71920','--sa-red: #8b6811').replace('--sa-red-strong: #a50f15','--sa-red-strong: #6f5108').replace('#fee2e2','#fff3ce').replace('#fff5f5','#fff9e7').replace('#f5c542','#d7ae35');f.write_text(s,encoding='utf-8')
(p/'.client/skin-changed-files.json').write_text(json.dumps(changed,indent=2),encoding='utf-8')
print('Updated',len(changed),'identity/media files and data adapters')
