export type AuxeroAccountRole = 'admin' | 'agent' | 'customer';

export type AuxeroProfileSocialLink = {
	icon: string;
	id: string;
	name: string;
	value: string;
};

export type AuxeroAccountProfileFormData = {
	address: string;
	avatarImage: string;
	birthDate: string;
	company: string;
	description: string;
	email: string;
	firstName: string;
	gender: string;
	lastName: string;
	mapEmbedUrl: string;
	mapOptions: string[];
	marketplacePhone: string;
	phone: string;
	posterImage: string;
	role: AuxeroAccountRole;
	roleLabel: string;
	roleNote: string;
	socialLinks: AuxeroProfileSocialLink[];
};

export type AuxeroAccountPasswordFormData = {
	email: string;
	role: AuxeroAccountRole;
};
