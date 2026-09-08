import { daynightConsultants, daynightContact } from './daynight';
import type { Agent } from '$lib/types/agent';

export type { Agent } from '$lib/types/agent';

const bios: Record<string, string> = {
	'daynight-sales':
		'Помага с налични автомобили, огледи, клиентски автомобили и следващата практична стъпка.',
	'daynight-import':
		'Координира запитвания за подбор на автомобили, проверка на източника, транспорт и ориентир за крайна цена.',
	'daynight-inspection':
		'Преглежда история, документи, готовност за регистрация, технически детайли и контекст за обслужване.'
};

export const agents: Agent[] = daynightConsultants.map((consultant, index) => ({
	slug: consultant.slug,
	name: consultant.name,
	title: consultant.title,
	phone: daynightContact.primaryPhoneLabel,
	email: daynightContact.emailLabel,
	image: consultant.image,
	rating: 4.9,
	sales: [157, 126, 98][index] ?? 75,
	bio: bios[consultant.slug]
}));

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
