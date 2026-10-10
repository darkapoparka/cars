export type AuxeroPageBanner = {
	actions?: {
		href: string;
		label: string;
		variant?: 'primary' | 'secondary';
	}[];
	description: string;
	eyebrow: string;
	image: string;
	title: string;
};
