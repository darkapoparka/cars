import { eliqautoConsultants, eliqautoContact } from './eliqauto';
import type { Agent } from '$lib/types/agent';

export type { Agent } from '$lib/types/agent';

const bios: Record<string, string> = {
	'eliqauto-sales':
		'Помага с налични автомобили, огледи, клиентски автомобили и следващата практична стъпка.',
	'eliqauto-import':
		'Координира запитвания за внос и лизинг 100%, проверка на източника, транспорт и ориентир за крайна цена.',
	'eliqauto-inspection':
		'Преглежда история, документи, готовност за регистрация, технически детайли и контекст за обслужване.'
};

export const agents: Agent[] = eliqautoConsultants.map((consultant, index) => ({
	slug: consultant.slug,
	name: consultant.name,
	title: consultant.title,
	phone: eliqautoContact.primaryPhoneLabel,
	email: eliqautoContact.emailLabel,
	image: consultant.image,
	rating: 4.9,
	sales: [157, 126, 98][index] ?? 75,
	bio: bios[consultant.slug]
}));

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
