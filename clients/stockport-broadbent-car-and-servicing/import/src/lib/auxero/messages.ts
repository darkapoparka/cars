export type AuxeroMessageContact = {
	active: boolean;
	avatar: string;
	badge?: number;
	email: string;
	id: string;
	name: string;
	preview: string;
	time: string;
};

export type AuxeroMessageBubble = {
	id: string;
	sent: boolean;
	text: string;
	time: string;
};

export type AuxeroMessageThreadData = {
	activeContact: AuxeroMessageContact;
	contacts: AuxeroMessageContact[];
	contextHref: '/admin/inquiries' | '/contact';
	heading: string;
	messages: AuxeroMessageBubble[];
};
