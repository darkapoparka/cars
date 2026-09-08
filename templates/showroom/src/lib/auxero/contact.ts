import { eliqautoContact } from '$lib/data/eliqauto';

export type AuxeroContactInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	type: 'email' | 'tel' | 'text';
};

export type AuxeroContactFormData = {
	fields: AuxeroContactInputField[];
	messageLabel: string;
	messagePlaceholder: string;
	submitLabel: string;
	subtitle: string;
	title: string;
};

export type AuxeroContactPageInfo = {
	addressLabel: string;
	description: string;
	emailHref: string;
	emailLabel: string;
	eyebrow: string;
	mapHref: string;
	mapSrc: string;
	officeLabel: string;
	phoneHref: string;
	phoneLabel: string;
	secondaryPhoneHref: string;
	secondaryPhoneLabel: string;
	socials: Array<{
		href: string;
		icon: string;
		label: string;
	}>;
	title: string;
	workNote: string;
};

export const contactPageInfo: AuxeroContactPageInfo = {
	addressLabel: eliqautoContact.addressCopyLabel,
	description: 'Свържете се с нас за оглед, покупка, внос или собствено финансиране на автомобил.',
	emailHref: eliqautoContact.emailHref,
	emailLabel: eliqautoContact.emailLabel,
	eyebrow: 'Контакт',
	mapHref: eliqautoContact.mapHref,
	mapSrc: eliqautoContact.mapEmbedUrl,
	officeLabel: 'Шоурум ELIQ AUTO',
	phoneHref: eliqautoContact.primaryPhoneHref,
	phoneLabel: eliqautoContact.primaryPhoneLabel,
	secondaryPhoneHref: eliqautoContact.marketplacePhoneHref,
	secondaryPhoneLabel: eliqautoContact.marketplacePhoneLabel,
	socials: [
		{ href: eliqautoContact.facebookHref, icon: 'input-facebook.svg', label: 'Facebook' },
		{ href: eliqautoContact.viberHref, icon: 'ChatCircleDots.svg', label: 'Viber' },
		{ href: eliqautoContact.youtubeHref, icon: 'input-youtube.svg', label: 'YouTube' }
	],
	title: 'Свържете се с Eliqauto',
	workNote: eliqautoContact.appointmentNote
};

export const contactFormData: AuxeroContactFormData = {
	fields: [
		{
			active: true,
			id: 'Firstname',
			label: 'Име',
			name: 'Firstname',
			placeholder: 'Вашето име',
			type: 'text'
		},
		{
			active: false,
			id: 'Lastname',
			label: 'Фамилия',
			name: 'Lastname',
			placeholder: 'Вашата фамилия',
			type: 'text'
		},
		{
			active: false,
			id: 'SendInquiryemail',
			label: 'Имейл',
			name: 'SendInquiryemail',
			placeholder: 'Вашият имейл',
			type: 'email'
		},
		{
			active: false,
			id: 'SendInquiryphone',
			label: 'Телефон',
			name: 'SendInquiryphone',
			placeholder: 'Вашият телефон',
			type: 'tel'
		}
	],
	messageLabel: 'Съобщение',
	messagePlaceholder: 'Автомобил, VIN, линк към обява, бюджет или въпрос',
	submitLabel: 'Изпрати съобщение',
	subtitle: 'Име и телефон са достатъчни — опишете автомобила, VIN или въпроса в съобщението.',
	title: 'Пишете ни за автомобил'
};
