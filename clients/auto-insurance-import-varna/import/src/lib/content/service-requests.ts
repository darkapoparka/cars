import type { Locale } from '$lib/locale/core';
import type { ServiceRequestKind } from '$lib/domain/service-request';

type RequestCopy = {
	name: string;
	phone: string;
	preferredDate: string;
	viewingNote: string;
	viewingReferenceError: string;
	demoNote: string;
	liveNote: string;
	privacy: string;
	pending: string;
	done: string;
	error: string;
	fields: Record<
		ServiceRequestKind,
		{
			title: string;
			description: string;
			label: string;
			placeholder: string;
			submit: string;
		}
	>;
	errors: Record<'name' | 'phone' | 'reference' | 'message' | 'preferredDate', string>;
};

export const serviceRequestCopy: Record<Locale, RequestCopy> = {
	bg: {
		name: 'Име',
		phone: 'Телефон',
		preferredDate: 'Предпочитан ден и час (по желание)',
		viewingNote: 'Ще уточним възможния час по телефона.',
		viewingReferenceError: 'Посочи автомобил или линк към обява.',
		demoNote: 'Демо заявка — използвай примерни данни.',
		liveNote: 'Запазването е отделно от известяването. За отговор се свържи с търговеца.',
		privacy: 'Поверителност',
		pending: 'Запазване…',
		done: 'Готово',
		error: 'Заявката не е запазена. Опитай отново.',
		fields: {
			'vin-check': {
				title: 'Проверка на обява / VIN',
				description: 'Изпрати обявата или VIN, за да уточним проверката.',
				label: 'Линк към обява или VIN',
				placeholder: 'https://… или 17-символен VIN',
				submit: 'Заяви проверка'
			},
			registration: {
				title: 'Документи и регистрация',
				description: 'Кажи с какви документи или регистрация да помогнем.',
				label: 'Какво ти е необходимо?',
				placeholder: 'Напр. регистрация на внесен автомобил…',
				submit: 'Изпрати запитване'
			},
			viewing: {
				title: 'Уговори оглед',
				description: 'Посочи автомобила и кога би искал да го видиш.',
				label: 'Автомобил или линк към обява',
				placeholder: 'Напр. BMW X5 или линк към обявата',
				submit: 'Заяви оглед'
			}
		},
		errors: {
			name: 'Въведи име с поне 2 символа.',
			phone: 'Въведи валиден телефон.',
			reference: 'Въведи валиден линк или 17-символен VIN.',
			message: 'Опиши необходимото с поне 5 символа.',
			preferredDate: 'Провери избрания ден и час.'
		}
	},
	en: {
		name: 'Name',
		phone: 'Phone',
		preferredDate: 'Preferred date and time (optional)',
		viewingNote: 'We will discuss the available time by phone.',
		viewingReferenceError: 'Enter the vehicle or listing link.',
		demoNote: 'Demo request: use sample data.',
		liveNote: 'Saving is separate from notification. Contact the dealer for a response.',
		privacy: 'Privacy',
		pending: 'Saving…',
		done: 'Done',
		error: 'The request was not saved. Please try again.',
		fields: {
			'vin-check': {
				title: 'Listing / VIN check',
				description: 'Send the listing or VIN so we can discuss the check.',
				label: 'Listing link or VIN',
				placeholder: 'https://… or a 17-character VIN',
				submit: 'Request a check'
			},
			registration: {
				title: 'Documents and registration',
				description: 'Tell us which documents or registration you need help with.',
				label: 'What do you need?',
				placeholder: 'E.g. registering an imported car…',
				submit: 'Send enquiry'
			},
			viewing: {
				title: 'Arrange a viewing',
				description: 'Tell us which car you would like to see and when.',
				label: 'Vehicle or listing link',
				placeholder: 'E.g. BMW X5 or a listing link',
				submit: 'Request a viewing'
			}
		},
		errors: {
			name: 'Enter a name with at least 2 characters.',
			phone: 'Enter a valid phone number.',
			reference: 'Enter a valid listing link or 17-character VIN.',
			message: 'Describe what you need in at least 5 characters.',
			preferredDate: 'Check the date and time.'
		}
	}
};
