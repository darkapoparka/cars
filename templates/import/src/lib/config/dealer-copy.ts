import { daynightContact } from './dealer';
export const dealerCopy = {
	bg: { appointment: daynightContact.appointmentNote },
	en: { appointment: 'Viewings by appointment. Please call before visiting.' }
} as const;
