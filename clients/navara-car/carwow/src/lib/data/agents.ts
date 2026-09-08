import { daynightSite } from './daynight-site';
import { daynightTeam } from './daynight-team';

export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number;
	sales: number;
	bio: string;
}

export const agents: Agent[] = [
	{
		slug: 'prodazhbi-daynight-auto',
		name: daynightTeam[0]?.name ?? 'Навара кар Sales Team',
		title: daynightTeam[0]?.role ?? 'Консултанти продажби',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[0]?.image ?? daynightSite.logoDark,
		rating: 4.9,
		sales: daynightSite.inventoryCount,
		bio:
			daynightTeam[0]?.bio ??
			'Екипът съдейства при избор на автомобил, оглед, документи, бартер и финансиране.'
	},
	{
		slug: 'barter-i-ocenka',
		name: daynightTeam[1]?.name ?? 'Навара кар Trade-In Team',
		title: daynightTeam[1]?.role ?? 'Оценка, покупка и бартер',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[1]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[1]?.bio ??
			'Екипът приема заявки за продажба или замяна на автомобил и подготвя следващите стъпки за оглед.'
	},
	{
		slug: 'dokumenti-finansirane',
		name: daynightTeam[2]?.name ?? 'Екип документи и финансиране',
		title: daynightTeam[2]?.role ?? 'Документи и финансиране',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[2]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[2]?.bio ??
			'Екипът съдейства с документи, регистрация, финансиране и практични стъпки след избора на автомобил.'
	},
	{
		slug: 'klientski-zapitvania',
		name: daynightTeam[3]?.name ?? 'Екип клиентски заявки',
		title: daynightTeam[3]?.role ?? 'Огледи и следващи стъпки',
		phone: daynightSite.phoneLabel,
		email: daynightSite.email,
		image: daynightTeam[3]?.image ?? daynightSite.logoDark,
		rating: 4.8,
		sales: 0,
		bio:
			daynightTeam[3]?.bio ??
			'Екипът координира клиентските запитвания, огледите и следващите стъпки до посещението на място.'
	}
];

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
