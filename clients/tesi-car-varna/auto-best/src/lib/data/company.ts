import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index:string; icon:CompanyServiceIcon; title:string; description:string; href:string; cta:string };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id:ContactTopicId; label:string; title:string; description:string; mobileDescription?:string };

export const contactPreparation: Partial<Record<ContactTopicId,{title:string;items:string[]}>> = {
  inspection:{title:'Подгответе за посещението',items:['Автомобилът, който искате да видите','Удобен ден и час','Потвърждение по телефона']},
  import:{title:'Критерии за автомобил',items:['Марка и модел','Бюджет и предпочитания','Линк към обява, ако имате']},
  leasing:{title:'Запитване за лизинг',items:['Автомобилът от обявата','Предпочитан срок и вноска','Актуални условия от финансиращата страна']},
  'trade-in':{title:'Регистрация и транзитни номера',items:['Данни за автомобила','Документи, с които разполагате','Уточнете необходимото съдействие по телефона']}
};

export function resolveImportUrl(value:string|null):string|null {
  const candidate=value?.trim();
  if(!candidate||candidate.length>2048)return null;
  try{const url=new URL(candidate);if(!['http:','https;'].includes(url.protocol)||url.username||url.password)return null;return url.href}catch{return null}
}

export const companyServices: CompanyService[] = [
  {index:'01',icon:'inspection',title:`Оглед във ${brand.city}`,description:'Уговорете предварително посещение за конкретен автомобил от текущите обяви.',href:'/contact?topic=inspection',cta:'Уговорете оглед'},
  {index:'02',icon:'import',title:'Внос от Швейцария',description:'Текущите обяви описват автомобили, внесени от Швейцария.',href:'/contact?topic=import',cta:'Попитайте за внос'},
  {index:'03',icon:'leasing',title:'Запитване за лизинг',description:'Лизинг е отбелязан в част от текущите обяви; конкретните условия се потвърждават при запитване.',href:'/contact?topic=leasing',cta:'Попитайте за лизинг'},
  {index:'04',icon:'trade-in',title:'Регистрация и транзитни номера',description:'Теси Кар публикува съдействие при регистрация или транзитни номера в КАТ Варна.',href:'/contact?topic=trade-in',cta:'Попитайте за съдействие'}
];

export const contactTopics: ContactTopic[] = [
  {id:'general',label:'Общ въпрос',title:'Свържете се с Теси Кар',description:'За наличност, оглед, лизинг или друг въпрос за автомобил от текущите обяви.'},
  {id:'inspection',label:'Оглед',title:`Оглед във ${brand.city}`,description:'Уговорете предварително посещение за конкретен автомобил и потвърдете наличността.'},
  {id:'import',label:'Внос',title:'Внос от Швейцария',description:'Попитайте за автомобилите, които Теси Кар предлага като внос от Швейцария.'},
  {id:'leasing',label:'Лизинг',title:'Запитване за лизинг',description:'Потвърдете актуалните условия за избрания автомобил при запитване.'},
  {id:'trade-in',label:'Регистрация',title:'Регистрация и транзитни номера',description:'Попитайте какво съдействие е възможно за регистрация или транзитни номера в КАТ Варна.'}
];

export const resolveContactTopic=(value:string|null)=>contactTopics.find(topic=>topic.id===value)??contactTopics[0];
