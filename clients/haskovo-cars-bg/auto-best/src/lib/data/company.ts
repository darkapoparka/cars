import { brand } from '$config/brand';
export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index:string; icon:CompanyServiceIcon; title:string; description:string; href:string; cta:string };
type ContactTopicId = 'general' | 'inspection';
export type ContactTopic = { id:ContactTopicId; label:string; title:string; description:string; mobileDescription?:string };
export const contactPreparation: Partial<Record<ContactTopicId,{title:string;items:string[]}>> = {
  inspection:{title:'Уговорете оглед',items:['Автомобилът, който искате да видите','Удобен ден и час','Потвърждение на наличността по телефона']}
};
export function resolveImportUrl(value:string|null):string|null{const candidate=value?.trim();if(!candidate||candidate.length>2048)return null;try{const url=new URL(candidate);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return null;return url.href}catch{return null}}
export const companyServices: CompanyService[] = [
  {index:'01',icon:'inspection',title:`Оглед в ${brand.city}`,description:'Свържете се предварително, за да потвърдите конкретния автомобил и удобен час.',href:'/contact?topic=inspection',cta:'Уговорете оглед'}
];
export const contactTopics: ContactTopic[] = [
  {id:'general',label:'Общ въпрос',title:'Разговор с автокъщата',description:`За наличност, цена, състояние или друг въпрос към ${brand.name}.`},
  {id:'inspection',label:'Оглед',title:`Оглед в ${brand.city}`,description:'Потвърдете наличността и часа за посещение директно по телефона.'}
];
export const resolveContactTopic=(value:string|null)=>contactTopics.find(topic=>topic.id===value)??contactTopics[0];
export const showroomCoordinates={latitude:41.9344,longitude:25.5554} as const;
