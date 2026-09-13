import type { Agent } from '$lib/data/agents';
import { daynightContact } from '$lib/data/daynight';
import { vehicles } from '$lib/data/vehicles';
import { inventoryCardsFromVehicles, type AuxeroInventoryVehicleCard } from './inventory';

export type AuxeroAgentDetailContent = {
	bio: string;
	image: string;
	inventoryCards: AuxeroInventoryVehicleCard[];
	inventoryHeading: string;
	name: string;
	sidebar: AuxeroAgentDetailSidebar;
	summary: string;
	verifiedLabel: string;
};

export type AuxeroAgentDetailSidebar = {
	address: string;
	callHref: string;
	callLabel: string;
	consentLabel: string;
	formTitle: string;
	mapSrc: string;
	messagePlaceholder: string;
	phone: string;
	subjectOptions: string[];
	submitLabel: string;
	termsLabel: string;
	viberHref: string;
	viberLabel: string;
};

const agentDetailSummary =
	'Day Night Auto води всеки разговор практично: детайли за източника, оглед и състояние, стъпки по внос или регистрация и записване на огледи се потвърждават преди следващата стъпка.';

export const agentDetailFromAgent = (agent: Agent): AuxeroAgentDetailContent => {
	const matchingVehicles = vehicles.filter((vehicle) => vehicle.agentSlug === agent.slug);
	const visibleVehicles = matchingVehicles.slice(0, 3);
	const inventoryVehicles = visibleVehicles.length ? visibleVehicles : vehicles.slice(0, 3);
	const inventoryCount = matchingVehicles.length || vehicles.length;

	return {
		bio: agent.bio,
		image: agent.image,
		inventoryCards: inventoryCardsFromVehicles(inventoryVehicles),
		inventoryHeading: `Автомобили в Day Night Auto (${inventoryCount})`,
		name: agent.name,
		sidebar: {
			address: daynightContact.addressLabel,
			callHref: daynightContact.primaryPhoneHref,
			callLabel: 'Обади се на Day Night Auto',
			consentLabel:
				'Да, искам да получавам известия за цени и полезна информация при избор на автомобил.',
			formTitle: `Изпрати запитване до ${agent.name}`,
			mapSrc: daynightContact.mapEmbedUrl,
			messagePlaceholder: 'Напишете запитването си тук',
			phone: daynightContact.primaryPhoneLabel,
			subjectOptions: ['Наличност на автомобила', 'Запазване на оглед', 'Внос и финансиране'],
			submitLabel: 'Изпрати запитване',
			termsLabel: 'Общи условия.',
			viberHref: daynightContact.viberHref,
			viberLabel: 'Пиши във Viber'
		},
		summary: agentDetailSummary,
		verifiedLabel: 'Потвърден консултант на Day Night Auto'
	};
};
