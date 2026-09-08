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

export const daynightTeam: DayNightTeamMember[] = [{slug:'prodazhbi-showroom',name:'ELIT AUTO IMPORT EXPORT',role:'Контакт с автокъщата',phone:'0887777887',email:'',image:'/assets/elit/cover.png',bio:'Внос от Европа, САЩ и Япония. Автомобили във Варна.',detail:'Свържете се за наличност, оглед, доставка и проверка в сервиз по избор.'}];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
