import { daynightSite } from './daynight-site';
export const daynightTeamDisclosure = 'Теми за разговор с автокъщата. Това не са персонални профили или потвърдени отдели; всички използват единствения установен публичен телефон.';
export type DayNightTeamMember = {
	slug: string;
	name: string;
	role: string;
	phone: string;
	email: string;
	image: string;
	bio: string;
	detail: string;
};
export const daynightTeam: DayNightTeamMember[] = [
 {slug:'prodazhbi-showroom',name:'Автомобили и оглед',role:'Публичен контакт на автокъщата',phone:daynightSite.phone,email:'',image:daynightSite.logoDark,bio:'Потвърдете наличността и адреса за избрания автомобил преди посещение.',detail:'Обадете се на публикувания телефон. Работно време, възможност за тест и проверка се уточняват лично; онлайн формата не резервира час.'},
 {slug:'barter-i-ocenka',name:'Въпрос за бартер',role:'Тема за запитване, не отдел',phone:daynightSite.phone,email:'',image:daynightSite.logoDark,bio:'Някои обяви посочват договаряне на цената при бартер.',detail:'Посочете точната обява и данните за автомобила си. Не е обещана оценка, изкупуване или одобрение; условията са по индивидуална уговорка.'},
 {slug:'dokumenti-finansirane',name:'Цена и документи',role:'Тема за запитване, не отдел',phone:daynightSite.phone,email:'',image:daynightSite.logoDark,bio:'Проверете данъчните условия и документите по конкретната обява.',detail:'Поискайте крайна цена и писмени условия за всички разходи. Кредитор, лихва, гаранция и процедура за регистрация не са потвърдени в този прототип.'},
 {slug:'klientski-zapitvania',name:'Допълнителни снимки',role:'Тема за запитване, не отдел',phone:daynightSite.phone,email:'',image:daynightSite.logoDark,bio:'Посочете автомобила и конкретните детайли, които желаете да видите.',detail:'Галерията използва снимки от същата обява. Допълнителни кадри или видео следва да се поискат от продавача; не е добавен чужд YouTube канал.'}
];
export const getDayNightTeamMemberBySlug = (slug: string) => daynightTeam.find((member) => member.slug === slug);
