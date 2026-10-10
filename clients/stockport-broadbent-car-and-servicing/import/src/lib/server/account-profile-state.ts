import type {
	AuxeroAccountPasswordFormData,
	AuxeroAccountProfileFormData
} from '$lib/auxero/account-forms';
import { daynightAssets, daynightBrand, daynightContact } from '$lib/data/daynight';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import {
	accountAvatarByRole,
	accountContext,
	type AccountContext
} from './account-dashboard-state';

const accountNameParts = (context: AccountContext) => {
	const [firstName, ...lastParts] = context.session.name.split(' ');

	return {
		firstName: firstName || daynightBrand.name,
		lastName: lastParts.join(' ') || context.roleLabel
	};
};

export const accountProfileMapEmbedUrl =
	'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s';

export const accountProfileFormData = (context: AccountContext): AuxeroAccountProfileFormData => {
	const { firstName, lastName } = accountNameParts(context);
	const roleLabel = context.isAdmin ? context.roleLabel : 'Клиент';

	return {
		address: daynightContact.addressLabel,
		avatarImage: accountAvatarByRole[context.session.role],
		birthDate: '1994-03-22',
		company: daynightBrand.name,
		description: `${daynightBrand.tagline}. ${daynightContact.appointmentNote}.`,
		email: context.session.email,
		firstName,
		gender: 'Male',
		lastName,
		mapEmbedUrl: accountProfileMapEmbedUrl,
		mapOptions: [
			daynightContact.addressLabel,
			`${daynightContact.addressLabel} - appointment area`,
			`${daynightContact.addressLabel} - import handoff`
		],
		marketplacePhone: daynightContact.marketplacePhoneLabel,
		phone: daynightContact.primaryPhoneLabel,
		posterImage: daynightAssets.footerImage,
		role: context.session.role,
		roleLabel,
		roleNote: context.isAdmin
			? `Signed in locally as ${context.roleLabel}. Role-aware pages use this profile context.`
			: 'Влезли сте като клиент. Данните се използват само в този демо профил.',
		socialLinks: [
			{
				icon: '/assets/icons/input-facebook.svg',
				id: 'Facebook',
				name: 'Facebook',
				value: daynightContact.facebookHref
			},
			{ icon: '/assets/icons/input-skype.svg', id: 'skype', name: 'skype', value: '' },
			{ icon: '/assets/icons/input-x.svg', id: 'xUrl', name: 'xUrl', value: '' },
			{ icon: '/assets/icons/input-telegram.svg', id: 'telegram', name: 'telegram', value: '' },
			{ icon: '/assets/icons/input-instagram.svg', id: 'instagram', name: 'instagram', value: '' },
			{
				icon: '/assets/icons/input-youtube.svg',
				id: 'youtube',
				name: 'youtube',
				value: daynightContact.youtubeHref
			}
		]
	};
};

export const accountPasswordFormData = (
	context: AccountContext
): AuxeroAccountPasswordFormData => ({
	email: context.session.email,
	role: context.session.role
});

export const getAccountProfileFormData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountProfileFormData(accountContext(templateFile, options));

export const getAccountPasswordFormData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountPasswordFormData(accountContext(templateFile, options));
