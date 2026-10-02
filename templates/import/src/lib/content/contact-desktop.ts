import type { Locale } from '$lib/locale/core';
import type { SiteConfig } from '$lib/config/site';
import { daynightAssets } from '$lib/config/dealer';
import { dealerCopy } from '$lib/config/dealer-copy';

const copy: Record<Locale, { phone: string; visit: string; message: string }> = {
	bg: { phone: 'Обади се', visit: 'Посети ни', message: 'Пиши ни' },
	en: { phone: 'Call us', visit: 'Visit us', message: 'Message us' }
};

export function desktopContactChannels(site: SiteConfig, locale: Locale) {
	return [
		{
			kind: 'phone',
			href: site.contact.phoneHref,
			title: copy[locale].phone,
			text: site.contact.phone,
			image: daynightAssets.contactPhoneBanner,
			external: false
		},
		{
			kind: 'visit',
			href: site.contact.mapHref,
			title: copy[locale].visit,
			text: dealerCopy[locale].address,
			image: daynightAssets.contactVisitBanner,
			external: true
		},
		{
			kind: 'message',
			href: site.contact.messageHref,
			title: copy[locale].message,
			text: 'Viber',
			image: daynightAssets.contactMessageBanner,
			external: false
		}
	];
}
