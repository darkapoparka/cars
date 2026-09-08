import pathlib,re,json
p=pathlib.Path('.');facts=json.loads((p/'../business-facts.json').read_text(encoding='utf-8'))
for f in (p/'src').rglob('*'):
 if f.suffix not in ['.svelte','.ts','.css','.html']:continue
 s=f.read_text(encoding='utf-8');b=s
 for old in ['Понеделник - Събота: 9:00 - 18:00','Делнични дни: 9:00 - 18:00 · Неделя: по уговорка','Понеделник - събота: 9:00 - 18:00','Делнични дни: 9:00 - 18:00']:
  s=s.replace(old,'Пн–Пт: 09:00–18:30 · Сб: 10:00–16:00 · Нд: почивен ден')
 s=s.replace('Проверена автокъща','АСКО 96 · София').replace('Проверен автомобил','Публикуван автомобил').replace('проверени автомобили','автомобили в София').replace('Клиентски отзиви','Услуги и информация')
 s=s.replace('/assets/images/avatar/contact-avatar.webp',facts['logo']).replace('/assets/images/chat/daynight-helper-helmet-v1.png',facts['logo'])
 s=s.replace("const demoNames = ['Александър Петров', 'Николай Димитров', 'Мария Иванова', 'Елена Георгиева'];","const demoNames = ['Автомобили', 'Замяна и изкупуване', 'Собствен лизинг', 'Контакт с АСКО 96'];")
 s=s.replace('#B00000','var(--sa-red)').replace('#8A0000','var(--sa-red-strong)') if f.suffix in ['.svelte','.css'] else s
 s=s.replace('Използвайте формата за запитване','askogroup@abv.bg')
 if s!=b:f.write_text(s,encoding='utf-8')
f=p/'src/lib/data/daynight-videos.ts';videos=[]
for id,title in [('MZryizpxa6k','Porsche Cayenne Може Всичко'),('DoIn6yzLoyY','Този Mercedes S500 има ВСИЧКО'),('rgcZmHqkdWw','Mercedes GLC 220 - Голям Багажник и Малък Разход')]:videos.append(dict(id=id,title=title,duration='',thumbnail=f'https://i.ytimg.com/vi/{id}/hqdefault.jpg',url=f'https://www.youtube.com/watch?v={id}'))
f.write_text('export const youtubeChannelUrl = "https://www.youtube.com/@asko96bulgaria";\nexport const homeVideos = '+json.dumps(videos,ensure_ascii=False,indent=2)+' as const;',encoding='utf-8')
f=p/'src/lib/components/detail/desktop/desktop-detail-reviews-data.ts';f.write_text("import {daynightReviews} from '$lib/data/daynight-reviews';\nexport type DesktopDetailReview = {id:string; name:string;date:string;text:string;avatar?:string;initials?:string;};\nexport const desktopDetailStarIndexes: number[] = [];\nexport const desktopDetailRatingRows: {id:string;label:string;percent:string}[] = [];\nexport const desktopDetailReviews: DesktopDetailReview[] = daynightReviews.slice(0,3).map(r=>({...r,date:r.label}));",encoding='utf-8')
f=p/'src/lib/components/detail/desktop/DesktopDetailReviews.svelte';s=f.read_text(encoding='utf-8').replace('>4.8<','>АСКО<').replace('Добавете отзив','Попитайте екипа').replace('Изпратете отзив','Свържете се');f.write_text(s,encoding='utf-8')
f=p/'src/lib/components/detail/desktop/DesktopDetailLocationMap.svelte';s=f.read_text(encoding='utf-8');s=re.sub(r"'https://www.google.com/maps/search/\?api=1&query=[^']+'",'daynightSite.mapUrl',s);f.write_text(s,encoding='utf-8')
# Stop advertising live messaging in the local visual demo; keep all form controls intact.
for name in ['MobileContactPage.svelte','DesktopContactPage.svelte']:
 f=p/'src/lib/components/contact'/name;s=f.read_text(encoding='utf-8');s=s.replace('Не успяхме да изпратим запитването. Моля, опитайте отново или се свържете по телефон/Viber на','Демо форма без доставка. Свържете се с АСКО 96 на').replace('Не успяхме да изпратим заявката за внос. Моля, опитайте отново или се свържете по телефон/Viber на','Демо форма без доставка. За внос се свържете с АСКО 96 на');s=s.replace('<form','<p class="text-sm">Локален демо преглед: формата не изпраща до автокъщата. За реално запитване: <a href="tel:+359899769696">0899 76 96 96</a>.</p>\n<form',1);f.write_text(s,encoding='utf-8')
f=p/'src/lib/components/chat/ChatThread.svelte';s=f.read_text(encoding='utf-8');s=s.replace('АСКО 96','АСКО 96 · демо чат');f.write_text(s,encoding='utf-8')
