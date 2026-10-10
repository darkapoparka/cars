import type { Locale } from '$lib/locale/core';
import type { SiteConfig } from '$lib/config/site';
import { daynightAssets } from '$lib/config/dealer';
import { dealerCopy } from '$lib/config/dealer-copy';

export const contactDesktopCopy: Record<
	Locale,
	{
		title: string;
		details: string;
		phone: string;
		enquiry: string;
		visit: string;
		message: string;
		location: string;
		directions: string;
		mapTitle: string;
	}
> = {
	bg: {
		title: 'Контакти',
		details: 'Връзка с нас',
		phone: 'Обади се',
		enquiry: 'Запитване',
		visit: 'Посети ни',
		message: 'Пиши ни',
		location: 'Нашият адрес',
		directions: 'Как да стигнеш',
		mapTitle: 'Карта на адреса ни в София'
	},
	en: {
		title: 'Contact us',
		details: 'Contact details',
		phone: 'Call us',
		enquiry: 'Enquiry',
		visit: 'Visit us',
		message: 'Message us',
		location: 'Our location',
		directions: 'Get directions',
		mapTitle: 'Map of our Sofia address'
	}
};

export function desktopContactChannels(site: SiteConfig, locale: Locale) {
	return [
		{
			kind: 'phone',
			href: site.contact.phoneHref,
			title: contactDesktopCopy[locale].phone,
			text: site.contact.phone,
			image: daynightAssets.contactPhoneBanner,
			external: false
		},
		{
			kind: 'visit',
			href: site.contact.mapHref,
			title: contactDesktopCopy[locale].visit,
			text: dealerCopy[locale].address,
			image: daynightAssets.contactVisitBanner,
			external: true
		},
		{
			kind: 'message',
			href: site.contact.messageHref,
			title: contactDesktopCopy[locale].message,
			text: 'Viber',
			image: daynightAssets.contactMessageBanner,
			external: false
		}
	];
}
