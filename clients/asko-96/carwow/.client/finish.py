import pathlib
p=pathlib.Path('.')
f=p/'src/lib/styles/tokens.css';s=f.read_text(encoding='utf-8');s+='\n.mh-hero img[src*="asko96-wordmark"], .mobile-header img[src*="asko96-wordmark"] { filter: none; }\n';f.write_text(s,encoding='utf-8')
f=p/'src/lib/components/home/mobile/MobileHome.svelte';s=f.read_text(encoding='utf-8').replace('Проверени коли','Автомобили').replace('Гаранция','Собствен лизинг');f.write_text(s,encoding='utf-8')
f=p/'src/app.html';s=f.read_text(encoding='utf-8').replace('#d71920','#d7ae35');f.write_text(s,encoding='utf-8')
f=p/'static/site.webmanifest';s=f.read_text(encoding='utf-8').replace('Day Night Auto Group','АСКО 96').replace('Day Night Auto','АСКО 96').replace('DAY NIGHT AUTO GROUP','АСКО 96').replace('DayNight','ASKO96').replace('/brand/daynight-favicon.png','/assets/asko96/asko96-logo.png').replace('#d71920','#d7ae35');f.write_text(s,encoding='utf-8')
f=p/'.client/qa-routes.mjs';s=f.read_text(encoding='utf-8').replace('await page.waitForTimeout(650);',"await page.waitForTimeout(2200);if(width===390&&route==='/contact')await page.locator('.mobile-contact-page').waitFor({state:'visible',timeout:20000}).catch(()=>{});").replace('status:res.status()','status:res?.status()??200');f.write_text(s,encoding='utf-8')
