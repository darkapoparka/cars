export const desktopSellProcessSteps = [
	{
		title: 'Describe your vehicle',
		copy: 'Enter a license plate number or VIN and vehicle details.'
	},
	{
		title: 'Describe its condition',
		copy: 'Add photos and note any issues.'
	},
	{
		title: 'Ask about an appraisal',
		copy: 'Ask whether vehicle purchases or trade-ins are available.'
	},
	{ title: 'Viewing and paperwork', copy: 'Ask about a viewing and confirm the final terms.' }
] as const;

export const desktopSellBenefits = [
	'Ask how condition, history and market prices would affect an appraisal.',
	'Ask whether trade-ins toward an in-stock vehicle are available.',
	'Ask about paperwork, registration, and vehicle handoff.'
] as const;

export const desktopSellFaqItems = [
	{
		question: 'What documents are needed?',
		answer:
			'Ask which title, registration, and identification documents are needed for your situation before a vehicle inspection.'
	},
	{
		question: 'Can I trade in toward an in-stock vehicle?',
		answer:
			'Trade-in availability and terms are not confirmed in this preview. Ask about eligibility, any price difference, and next steps.'
	},
	{
		question: 'When will I hear back?',
		answer:
			'This preview does not send your vehicle details or photos. Contact the dealership to ask about an inspection, an estimate, and available options.'
	},
	{
		question: 'What if my vehicle is leased?',
		answer:
			'Ask your leasing company about required documents, the remaining balance, and any restrictions before discussing a sale.'
	}
] as const;
