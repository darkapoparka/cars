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

export const agents: Agent[] = [{slug:'prodazhbi-daynight-auto',name:daynightSite.name,title:'Публикуван бизнес контакт',phone:daynightSite.phoneLabel,email:daynightSite.email,image:daynightSite.logoDark,rating:0,sales:0,bio:'Свържете се с търговеца за избрания автомобил. Няма потвърдени данни за служители, рейтинг или брой продажби.'}];

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
