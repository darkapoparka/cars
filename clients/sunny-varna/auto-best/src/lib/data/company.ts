import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = {index:string;icon:CompanyServiceIcon;title:string;description:string;href:string;cta:string};
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = {id:ContactTopicId;label:string;title:string;description:string;mobileDescription?:string};

/** Questions for the seller, not confirmed services or submitted enquiries. */
export const contactPreparation:Partial<Record<ContactTopicId,{title:string;items:string[]}>> = {
  'trade-in':{title:'Подгответе за разговора',items:['Марка, модел и година','Пробег и състояние','Снимки или линк към обява']},
  import:{title:'Какво искате да уточните?',items:['Конкретният автомобил или обява','Документи и произход','Въпроси за регистрацията']},
  leasing:{title:'Попитайте за възможностите',items:['Избраният автомобил','Какви начини на плащане се приемат','Всички условия и разходи в писмена оферта']},
  inspection:{title:'Уговорете посещението',items:['Избраният автомобил','Удобен ден и час','Потвърждение на наличността по телефона']}
};
export function resolveImportUrl(value:string|null):string|null {
  const candidate=value?.trim();
  if(!candidate||candidate.length>2048)return null;
  try {const url=new URL(candidate);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return null;return url.href;} catch{return null;}
}
export const companyServices:CompanyService[] = [
  {index:'01',icon:'inspection',title:`Оглед в ${brand.city}`,description:'Попитайте за наличност, адрес и удобен час.',href:'/contact?topic=inspection',cta:'Попитайте за оглед'},
  {index:'02',icon:'import',title:'Произход и документи',description:'Уточнете данните за избрания автомобил с продавача.',href:'/contact?topic=import',cta:'Задайте въпрос'},
  {index:'03',icon:'leasing',title:'Начини на плащане',description:'Потвърдете дали се предлага финансиране и при какви условия.',href:'/contact?topic=leasing',cta:'Обсъдете възможностите'},
  {index:'04',icon:'trade-in',title:'Вашият автомобил',description:'Попитайте дали автокъщата разглежда предложения за продажба или замяна.',href:'/contact?topic=trade-in',cta:'Подгответе запитване'}
];
export const contactTopics:ContactTopic[] = [
  {id:'general',label:'Общ въпрос',title:'Разговор с автокъщата',description:`Въпрос за обява, наличност или посещение на ${brand.name}.`},
  {id:'inspection',label:'Оглед',title:`Оглед в ${brand.city}`,description:'Уточнете наличността, адреса и удобния час директно по телефона.'},
  {id:'import',label:'Произход',title:'Произход и документи',description:'Попитайте за произхода, регистрацията и документите на избрания автомобил.',mobileDescription:'Добавете обява и конкретните си въпроси.'},
  {id:'leasing',label:'Плащане',title:'Начини на плащане',description:'Тази демонстрация не представлява кредитна или лизингова оферта. Уточнете възможностите с продавача.'},
  {id:'trade-in',label:'Вашият автомобил',title:'Въпрос за продажба или замяна',description:'Опишете автомобила си и попитайте дали автокъщата разглежда такъв тип предложения.',mobileDescription:'Подгответе данните на автомобила си за разговор.'}
];
export const resolveContactTopic=(value:string|null)=>contactTopics.find(topic=>topic.id===value)??contactTopics[0];
// No verified coordinates: the map component uses the published address query.
export const showroomCoordinates={latitude:null,longitude:null} as const;
