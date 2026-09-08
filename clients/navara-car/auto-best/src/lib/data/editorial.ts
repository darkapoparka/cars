import { brand } from '$config/brand';
import source from './navara-data.json';

export type BlogCategory = 'Оглед' | 'Документи' | 'Лизинг' | 'Каталог' | 'Въпроси';
export type BlogPost = {
  id: number; title: string; text: string; category: BlogCategory; tag: string;
  image: string; sections: Array<{ title: string; paragraphs: string[] }>;
};
export type BlogFilters = { q: string; category: BlogCategory | '' };

/** Editorial context for this dated preview; these are not dealer testimonials or service guarantees. */
export const blogPosts: BlogPost[] = [
  {
    id: 1, title: 'Обява и наличност: как да използвате селекцията',
    text: source.inventoryNotice, category: 'Каталог', tag: '08.09.2026', image: source.vehicles[0].images[0],
    sections: [
      { title: 'Девет конкретни обяви', paragraphs: ['Тази демонстрация показва девет автомобила от публикувания каталог на Навара кар, наблюдавани на 08.09.2026 г. Данните и цените са от обявите на продавача, а не от свързана складова система.'] },
      { title: 'Потвърдете преди пътуване', paragraphs: ['Изберете автомобил и отворете източника в неговата страница. Преди да пътувате, попитайте по публикувания телефон дали обявата е актуална, къде е автомобилът и каква е цената към момента.'] }
    ]
  },
  {
    id: 2, title: 'Регистрация и документи',
    text: source.business.services[1].description, category: 'Документи', tag: 'Регистрация', image: source.vehicles[1].images[0],
    sections: [
      { title: 'Какво е посочено в обявите', paragraphs: [source.business.services[1].description] },
      { title: 'Уточнете конкретния автомобил', paragraphs: ['Попитайте какви документи придружават избрания автомобил, какво точно включва съдействието и какви разходи са отделни от обявената цена. Тази страница не определя административни срокове или официални изисквания.'] }
    ]
  },
  {
    id: 3, title: 'Лизинг: въпроси, а не предварителна оферта',
    text: 'Част от обявите са означени с „Лизинг“. Публикувани потвърдени финансови условия не са установени.', category: 'Лизинг', tag: 'Условия', image: source.vehicles[4].images[0],
    sections: [
      { title: 'Проверете дали се отнася за избраната обява', paragraphs: [source.business.services[2].description] },
      { title: 'Поискайте конкретна писмена оферта', paragraphs: ['Преди ангажимент уточнете действителния доставчик, общата сума, вноските, срока и включените разходи. Демонстрационните контроли в сайта не са одобрение за кредит или предложение от Навара кар.'] }
    ]
  },
  {
    id: 4, title: 'Избор между градски автомобил, SUV и комби',
    text: 'Използвайте филтрите, за да сравните публикуваните данни за автомобилите в селекцията.', category: 'Каталог', tag: 'Избор', image: source.vehicles[3].images[0],
    sections: [
      { title: 'Започнете от конкретното предложение', paragraphs: ['В селекцията присъстват Micra, Polo, Fortwo и B 250 e, както и SUV модели Qashqai, Mokka и e-2008. Audi A4 е представен като комби, а Tesla Model 3 — като седан.'] },
      { title: 'Сравнявайте еднакви данни', paragraphs: ['Картите и страниците на автомобилите използват един и същ набор от цени в евро, години и пробег в километри. Оборудването е описано по обявата и подлежи на потвърждение при оглед.'] }
    ]
  },
  {
    id: 5, title: `Къде е ${brand.name} във Варна?`,
    text: brand.address, category: 'Оглед', tag: 'Варна', image: source.vehicles[4].images[1],
    sections: [
      { title: 'Публикуван адрес и ориентир', paragraphs: [brand.address, source.business.directions] },
      { title: 'Работното време се уточнява', paragraphs: ['Профилът не посочва работно време. Обадете се на 0899 192 300 преди посещение. Картата в демонстрацията е търсене по публикувания адрес, а не независимо потвърдена точна географска точка.'] }
    ]
  },
  {
    id: 6, title: 'Въпрос за друг автомобил или бартер',
    text: 'Не приемайте непотвърдена услуга за налична само защото има демонстрационен формуляр.', category: 'Въпроси', tag: 'Уточняване', image: source.vehicles[6].images[0],
    sections: [
      { title: 'Първо потвърдете възможността', paragraphs: ['Изкупуване, бартер и внос по индивидуална поръчка не са потвърдени услуги в този преглед. Попитайте продавача дали може да съдейства, преди да изпращате информация за собствен автомобил.'] },
      { title: 'Без автоматично изпращане', paragraphs: ['Подготовката на текст в тази демонстрация не създава заявка в система на автокъщата и не е потвърждение за получено съобщение. Не въвеждайте лични документи или платежни данни.'] }
    ]
  },
  {
    id: 7, title: 'Електромобилите в тази селекция',
    text: 'Model 3 Performance, e-2008 Allure и B 250 e са публикуваните електрически предложения в примера.', category: 'Каталог', tag: 'Електрически', image: source.vehicles[2].images[0],
    sections: [
      { title: 'Обявени данни', paragraphs: ['Обявите посочват 75 kWh за Tesla Model 3, 50 kWh за Peugeot e-2008 и 31 kWh за Mercedes-Benz B 250 e. Това са стойности, публикувани от продавача, а не измервания, извършени за демонстрацията.'] },
      { title: 'Потвърдете състоянието отделно', paragraphs: ['Поискайте наличните документи за състоянието на батерията, оборудването за зареждане и конкретния автомобил. Тук не се обещават реален пробег с едно зареждане, батерийна гаранция или независимо измерено състояние.'] }
    ]
  },
  {
    id: 8, title: 'Какво да уточните при оглед',
    text: 'Историята, състоянието, документите и важните екстри се потвърждават за конкретния автомобил.', category: 'Оглед', tag: 'Въпроси', image: source.vehicles[7].images[0],
    sections: [
      { title: 'Носете линка към избраната обява', paragraphs: ['Така продавачът може да разпознае конкретното предложение. Уточнете публикувания пробег, състоянието, наличната сервизна информация и важните за вас функции.'] },
      { title: 'Обявата не заменя проверката', paragraphs: ['Снимките и описанието в тази демонстрация са свързани с конкретни публикувани обяви. Те не удостоверяват липса на ремонти, произшествия или други забележки.'] }
    ]
  },
  {
    id: 9, title: 'Как работят контактите в демонстрацията',
    text: source.previewNotice, category: 'Въпроси', tag: 'Демонстрация', image: source.vehicles[8].images[0],
    sections: [
      { title: 'Публикуван телефон, без автоматична доставка', paragraphs: ['Бутонът за телефон използва публикувания номер на Навара кар. Сайтът не осъществява обаждане самостоятелно и няма настроена услуга за доставяне на съобщения до автокъщата.'] },
      { title: 'Вашият преглед остава преглед', paragraphs: ['Записването или копирането на текст, разглеждането на галерия и използването на филтрите не резервират автомобил. Потвърждение за оглед, цена или сделка може да даде само продавачът.'] }
    ]
  }
];

export const blogCategories: BlogCategory[] = ['Оглед', 'Документи', 'Лизинг', 'Каталог', 'Въпроси'];
const legacyCategories: Record<string, BlogCategory> = { 'Внос': 'Документи', 'Бартер': 'Въпроси', 'Насоки': 'Каталог' };
const isBlogCategory = (value: string | null): value is BlogCategory =>
  Boolean(value && blogCategories.includes(value as BlogCategory));
export const parseBlogFilters = (params: URLSearchParams): BlogFilters => {
  const value = params.get('category');
  return { q: params.get('q')?.trim() ?? '', category: isBlogCategory(value) ? value : legacyCategories[value ?? ''] ?? '' };
};
const normalize = (value: string) => value.trim().toLocaleLowerCase('bg-BG');
export const filterBlogPosts = (posts: BlogPost[], filters: BlogFilters) => {
  const query = normalize(filters.q);
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) return false;
    if (!query) return true;
    return normalize(`${post.title} ${post.text} ${post.category} ${post.tag}`).includes(query);
  });
};
export const blogFilterHref = (filters: BlogFilters, category: BlogCategory | '') => {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (category) params.set('category', category);
  const query = params.toString();
  return query ? `/blog?${query}` : '/blog';
};
