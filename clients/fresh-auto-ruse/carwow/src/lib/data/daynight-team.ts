import { daynightSite } from './daynight-site';
export const daynightTeamDisclosure = 'Няма потвърдени данни за служители. Показан е бизнес контактът, не конкретен човек.';

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

export const daynightTeam: DayNightTeamMember[] = [{slug:'prodazhbi-showroom',name:daynightSite.name,role:'Публикуван бизнес контакт',phone:daynightSite.phone,email:daynightSite.email,image:daynightSite.logoDark,bio:'За наличност, цена, адрес и удобен час за оглед използвайте публикувания телефон.',detail:'Този профил представлява търговеца. Не твърди самоличност, опит или оценка на конкретен служител.'}];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
