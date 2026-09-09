import { daynightSite } from '$lib/data/daynight-site';
export type PublicStaticRoute={path:string;title:string;description:string;sitemap:boolean};
export const DAY_SITE_TITLE=`${daynightSite.name} · София`;
export const DEFAULT_DESCRIPTION=`${daynightSite.name}: демо каталог с датирани автомобилни обяви. Наличността, цената и огледът се потвърждават с дилъра.`;
const dealer=(text:string)=>text.replaceAll('{dealer}',daynightSite.name);
export const PUBLIC_STATIC_ROUTES:PublicStaticRoute[]=[
 {path:'',title:`${DAY_SITE_TITLE} — обяви и контакт`,description:DEFAULT_DESCRIPTION,sitemap:true},
 {path:'inventory',title:`Обявени автомобили | ${DAY_SITE_TITLE}`,description:dealer('Датирана извадка от обявите на {dealer}. Не е потвърдена текуща складова наличност.'),sitemap:true},
 {path:'inventory/map',title:`Карта и обяви | ${DAY_SITE_TITLE}`,description:'Местоположение на автокъщата и датирани обяви. Потвърдете къде се намира конкретният автомобил преди посещение.',sitemap:true},
 {path:'services',title:`Информация и услуги | ${DAY_SITE_TITLE}`,description:dealer('Информация за контакт с {dealer} и въпроси по конкретна обява. Допълнителните услуги се уточняват директно.'),sitemap:true},
 {path:'sell-your-car',title:`Въпроси за продажба или замяна | ${DAY_SITE_TITLE}`,description:'Подгответе въпроси за евентуална продажба или замяна. Демото не е оферта за изкупуване.',sitemap:true},
 {path:'sell-your-car/request',title:`Подготовка на информация | ${DAY_SITE_TITLE}`,description:'Демо форма за подготовка на информация. Няма свързана услуга за изпращане или автоматична оценка.',sitemap:true},
 {path:'sell-car',title:`Въпроси за продажба или замяна | ${DAY_SITE_TITLE}`,description:'Съвместим маршрут на шаблона; не е потвърдена оферта за изкупуване.',sitemap:false},
 {path:'sell-car/request',title:`Подготовка на информация | ${DAY_SITE_TITLE}`,description:'Съвместим демо маршрут; не изпраща реална заявка.',sitemap:false},
 {path:'about',title:`За автокъщата | ${DAY_SITE_TITLE}`,description:dealer('Публикуван бизнес контакт и обяви на {dealer}. Демо проект, без твърдение за одобрение от дилъра.'),sitemap:true},
 {path:'about/daynight-auto-plovdiv',title:`Профил на автокъщата | ${DAY_SITE_TITLE}`,description:dealer('Запазен compatibility адрес на шаблона за профила на {dealer}; няма връзка със стария source dealer.'),sitemap:true},
 {path:'contact',title:`Контакти | ${DAY_SITE_TITLE}`,description:`Публикуван телефон ${daynightSite.phoneLabel}. ${daynightSite.location}. Уговорете оглед директно с дилъра.`,sitemap:true},
 {path:'financing',title:`Финансиране | ${DAY_SITE_TITLE}`,description:'Финансовите условия се потвърждават по конкретна оферта. Демото не е кредитна оферта и не обещава одобрение.',sitemap:true},
 {path:'reviews',title:`Информация за отзивите | ${DAY_SITE_TITLE}`,description:dealer('Няма предоставени потвърдени клиентски отзиви за {dealer}; демото не публикува измислени оценки.'),sitemap:true},
 {path:'calculator',title:`Примерен финансов калкулатор | ${DAY_SITE_TITLE}`,description:'Ориентировъчна математическа сметка по въведени стойности; не е оферта или одобрение.',sitemap:false},
 {path:'compare',title:`Сравнение на обяви | ${DAY_SITE_TITLE}`,description:'Сравнение по публикувани цени и характеристики; seller-provided data is not independently verified.',sitemap:false},
 {path:'team',title:`Бизнес контакт | ${DAY_SITE_TITLE}`,description:dealer('Публикуваният контакт на {dealer}, без измислени имена или портрети на служители.'),sitemap:true},
 {path:'team/prodazhbi-daynight-auto',title:`Контакт с автокъщата | ${DAY_SITE_TITLE}`,description:'Съвместим стар route адрес, който показва същия бизнес контакт, не отделен служител.',sitemap:false},
 {path:'team/showroom-contact',title:`Контакт с автокъщата | ${DAY_SITE_TITLE}`,description:'Публикуван бизнес контакт за въпроси по конкретна обява.',sitemap:true},
 {path:'blog',title:`Насоки за разглеждане | ${DAY_SITE_TITLE}`,description:'Информационна демо секция; съдържанието не доказва авторство или услуги на дилъра.',sitemap:true},
 {path:'blog/kak-da-kupim-upotrebyavan-avtomobil',title:`Въпроси при избор на употребяван автомобил | ${DAY_SITE_TITLE}`,description:'Общи въпроси за преглед на обява и документи; не е техническа експертиза.',sitemap:false},
 {path:'faq',title:`Често задавани въпроси | ${DAY_SITE_TITLE}`,description:'Цени, оглед, финансиране и ограничения на демо формите.',sitemap:true},
 {path:'terms',title:`Информация за демо прегледа | ${DAY_SITE_TITLE}`,description:dealer('Ограничения на непотвърден демо проект; не са официални договорни условия на {dealer}.'),sitemap:true}
];
export const PUBLIC_SITEMAP_ROUTES=PUBLIC_STATIC_ROUTES.filter(route=>route.sitemap);
export function normalizePublicRoutePath(routePath:string){return routePath.replace(/^\/+|\/+$/g,'');}
export function getPublicStaticRoute(routePath:string){const normalized=normalizePublicRoutePath(routePath);return PUBLIC_STATIC_ROUTES.find(route=>route.path===normalized);}
