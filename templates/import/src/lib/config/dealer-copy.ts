import { daynightContact } from './dealer';
export const dealerCopy = {
	bg: {
		appointment: daynightContact.appointmentNote,
		address: daynightContact.addressLabel
	},
	en: {
		appointment: 'Viewings by appointment. Please call before visiting.',
		address: '18 Atanas Manchev Street, Studentski Grad, Sofia'
	}
} as const;
