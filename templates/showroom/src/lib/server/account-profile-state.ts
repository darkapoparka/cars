import type {
	AuxeroAccountPasswordFormData,
	AuxeroAccountProfileFormData
} from '$lib/auxero/account-forms';
import { eliqautoAssets, eliqautoBrand, eliqautoContact } from '$lib/data/eliqauto';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import {
	accountAvatarByRole,
	accountContext,
	type AccountContext
} from './account-dashboard-state';

const accountNameParts = (context: AccountContext) => {
	const [firstName, ...lastParts] = context.session.name.split(' ');

	return {
		firstName: firstName || eliqautoBrand.name,
		lastName: lastParts.join(' ') || context.roleLabel
	};
};

export const accountProfileMapEmbedUrl =
	'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s';

export const accountProfileFormData = (context: AccountContext): AuxeroAccountProfileFormData => {
	const { firstName, lastName } = accountNameParts(context);

	return {
		address: eliqautoContact.addressLabel,
		avatarImage: accountAvatarByRole[context.session.role],
		birthDate: '1994-03-22',
		company: eliqautoBrand.name,
		description: `${eliqautoBrand.tagline}. ${eliqautoContact.appointmentNote}.`,
		email: context.session.email,
		firstName,
		gender: 'Male',
		lastName,
		mapEmbedUrl: accountProfileMapEmbedUrl,
		mapOptions: [
			eliqautoContact.addressLabel,
			`${eliqautoContact.addressLabel} - appointment area`,
			`${eliqautoContact.addressLabel} - import handoff`
		],
		marketplacePhone: eliqautoContact.marketplacePhoneLabel,
		phone: eliqautoContact.primaryPhoneLabel,
		posterImage: eliqautoAssets.footerImage,
		role: context.session.role,
		roleLabel: context.roleLabel,
		roleNote: `Signed in locally as ${context.roleLabel}. Role-aware pages use this profile context.`,
		socialLinks: [
			{
				icon: '/assets/icons/input-facebook.svg',
				id: 'Facebook',
				name: 'Facebook',
				value: eliqautoContact.facebookHref
			},
			{ icon: '/assets/icons/input-skype.svg', id: 'skype', name: 'skype', value: '' },
			{ icon: '/assets/icons/input-x.svg', id: 'xUrl', name: 'xUrl', value: '' },
			{ icon: '/assets/icons/input-telegram.svg', id: 'telegram', name: 'telegram', value: '' },
			{ icon: '/assets/icons/input-instagram.svg', id: 'instagram', name: 'instagram', value: '' },
			{
				icon: '/assets/icons/input-youtube.svg',
				id: 'youtube',
				name: 'youtube',
				value: eliqautoContact.youtubeHref
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
