import type {
	AuxeroMessageBubble,
	AuxeroMessageContact,
	AuxeroMessageThreadData
} from '$lib/auxero/messages';
import { daynightContact } from '$lib/data/daynight';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import {
	accountAvatarByRole,
	accountContext,
	formatDashboardDate,
	type AccountContext
} from './account-dashboard-state';
import { listInquiriesForRole } from './inquiries';
import { listMessagesForRole } from './messages';
import type { DayNightInquiryRecord } from './db';

type Conversation = Omit<AuxeroMessageContact, 'active'>;

const customerMessageText = (message: string) => {
	const translations: Record<string, string> = {
		'Please send appointment options and inspection notes.':
			'Изпратете възможни часове за оглед и бележките от проверката.'
	};

	return translations[message] ?? message;
};

const visibleInquiryRecords = (context: AccountContext): DayNightInquiryRecord[] => {
	const records = listInquiriesForRole(context.session.role === 'agent' ? 'agent' : 'admin');
	const seedLead = records.find((record) => record.id === 'inquiry-seed-1');

	if (!seedLead) return records.slice(0, 3);

	return [...records.filter((record) => record.id !== seedLead.id).slice(0, 2), seedLead];
};

const conversations = (context: AccountContext): Conversation[] => {
	const records = context.isAdmin
		? visibleInquiryRecords(context).map((inquiry, index) => ({
				avatar: accountAvatarByRole[index === 1 ? 'agent' : 'customer'],
				badge: inquiry.status === 'new' ? 1 : undefined,
				email: inquiry.contactEmail,
				id: inquiry.id,
				name: inquiry.contactName,
				preview: inquiry.vehicleTitle ?? inquiry.message,
				time: index === 2 ? 'Yesterday' : `${16 - index}:24`
			}))
		: listMessagesForRole(context.session.role).map((message, index) => ({
				avatar: accountAvatarByRole.agent,
				badge: message.status === 'open' ? 1 : undefined,
				email: daynightContact.emailLabel,
				id: `${message.threadId}-${message.id}`,
				name: message.threadId === 'daynight-sales' ? 'Екип продажби' : 'Екип Promosale Varna',
				preview: customerMessageText(message.message),
				time: index === 0 ? '16:24' : 'Вчера'
			}));

	return records.slice(0, 3);
};

const fallbackConversation = (context: AccountContext): Conversation => ({
	avatar: accountAvatarByRole[context.isAdmin ? 'customer' : 'agent'],
	badge: context.isAdmin ? 1 : undefined,
	email: daynightContact.emailLabel,
	id: context.isAdmin ? 'daynight-lead-queue' : 'daynight-sales',
	name: context.isAdmin ? 'Promosale Varna Lead Queue' : 'Екип продажби',
	preview: context.isAdmin
		? 'New Promosale Varna inquiries will appear here.'
		: 'Разговорите ви с Promosale Varna ще се показват тук.',
	time: context.isAdmin ? 'Today' : 'Днес'
});

export const accountMessageContactsData = (context: AccountContext): AuxeroMessageContact[] => {
	const records = conversations(context);
	const activeIndex = records.length > 1 ? 1 : 0;
	const contacts = records.length > 0 ? records : [fallbackConversation(context)];

	return contacts.map((conversation, index) => ({
		...conversation,
		active: index === activeIndex
	}));
};

export const accountMessageThreadData = (context: AccountContext): AuxeroMessageThreadData => {
	const contacts = accountMessageContactsData(context);
	const activeContact = contacts.find((contact) => contact.active) ?? contacts[0];
	const messages: AuxeroMessageBubble[] = context.isAdmin
		? visibleInquiryRecords(context).map((inquiry, index) => ({
				id: inquiry.id,
				sent: index % 2 === 1,
				text: inquiry.message,
				time: formatDashboardDate(inquiry.createdAt, 'Today')
			}))
		: listMessagesForRole(context.session.role)
				.slice(0, 3)
				.map((message, index) => ({
					id: message.id,
					sent: index % 2 === 1,
					text: customerMessageText(message.message),
					time: formatDashboardDate(message.createdAt, 'Today')
				}));

	const fallbackMessage: AuxeroMessageBubble = {
		id: context.isAdmin ? 'daynight-lead-queue-empty' : 'daynight-sales-empty',
		sent: false,
		text: context.isAdmin
			? 'New Promosale Varna inquiries will appear here for triage.'
			: 'Историята на разговорите ви с Promosale Varna ще се показва тук.',
		time: context.isAdmin ? 'Today' : 'Днес'
	};

	return {
		activeContact,
		contacts,
		contextHref: context.isAdmin ? '/admin/inquiries' : '/contact',
		heading: context.isAdmin ? 'Inquiries & Messages' : 'Съобщения',
		messages: [
			...(messages.length ? messages : [fallbackMessage]),
			{
				id: 'daynight-thread-response',
				sent: true,
				text: context.isAdmin
					? 'Thanks. Promosale Varna can review source history, viewing availability, documents, and import timing before you commit.'
					: 'Благодарим. Можем да проверим историята, документите, наличността за оглед и срока за внос преди решение.',
				time: context.isAdmin ? 'Today, 10:12' : 'Днес, 10:12'
			}
		]
	};
};

export const getAccountMessageThreadData = (
	templateFile: string,
	options: AuxeroRenderOptions = {}
) => accountMessageThreadData(accountContext(templateFile, options));
