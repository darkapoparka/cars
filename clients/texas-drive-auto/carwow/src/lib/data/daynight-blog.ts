export type DayNightArticleCategory = 'News' | 'Tips' | 'Buyer-arranged funding' | 'Paperwork' | 'Makes' | 'Buying' | 'Selling';
export type DayNightArticleKind = 'news' | 'guide';

export type DayNightArticleSection = {
	heading: string;
	paragraphs: string[];
};

export type DayNightArticle = {
	slug: string;
	title: string;
	description: string;
	category: DayNightArticleCategory;
	kind: DayNightArticleKind;
	date: string;
	author: string;
	image: string;
	readMinutes: number;
	summary: string[];
	sections: DayNightArticleSection[];
	tags: string[];
	body: string[];
};

type DayNightArticleInput = Omit<DayNightArticle, 'body'>;

function article(input: DayNightArticleInput): DayNightArticle {
	return {
		...input,
		body: [
			input.description,
			...input.summary,
			...input.sections.flatMap((section) => section.paragraphs)
		]
	};
}

export const daynightArticles: DayNightArticle[] = [
	article({
		slug: 'dnevni-novini-daynight-auto-obnovena-nalichnost',
		title: 'How to check Texas Drive Auto inventory',
		description:
			'How to confirm current availability and prepare a vehicle or viewing inquiry.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-28',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-44.jpg',
		readMinutes: 3,
		summary: [
			'Preview inventory may not reflect current availability. Confirm directly with the dealership.',
			'For current information, contact the dealership with your budget or preferred make.',
			'Ask about viewing arrangements, paperwork, and next steps for your chosen vehicle.'
		],
		sections: [
			{
				heading: 'A guide to checking availability',
				paragraphs: [
					'This is an introduction to checking inventory, not an announcement of specific vehicle arrivals.',
					'This guide offers clear information for shoppers who check inventory often.'
				]
			},
			{
				heading: 'How to confirm current availability',
				paragraphs: [
					'If you have a specific make, engine, budget, or body style in mind, contact the dealership before visiting.',
					'Ask the dealership to confirm availability, viewing arrangements, paperwork, and registration details. No dealer financing or payment plans are offered; buyer-arranged funding is separate.'
				]
			}
		],
		tags: ['news', 'inventory', 'Dallas']
	}),
	article({
		slug: 'novi-avtomobili-v-nalichnost-daynight-auto',
		title: 'How to check a vehicle before a viewing',
		description: 'Tips for reviewing a listing, confirming availability, and preparing for a viewing.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-27',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-20.jpg',
		readMinutes: 3,
		summary: [
			'Start with the listing photos, price, mileage, and features.',
			'Contact the team about the specific vehicle you’re viewing.',
			'If you’re interested in a vehicle, confirm availability before visiting.'
		],
		sections: [
			{
				heading: 'Confirm the listing details',
				paragraphs: [
					'Availability can change, so confirm your selected vehicle before visiting.',
					'Include the make, model, and listing to request information about the vehicle you’re interested in.'
				]
			},
			{
				heading: 'Interested in a vehicle?',
				paragraphs: [
					'Review the photos, price, mileage, and key features on the inventory page.',
					'Then request a viewing and ask about paperwork, registration, and pickup. Any funding must be arranged independently; no dealer financing or payment plans are offered.'
				]
			}
		],
		tags: ['new arrivals', 'inventory', 'viewing']
	}),
	article({
		slug: 'kak-da-kupim-upotrebyavan-avtomobil',
		title: 'How to reduce risk when buying a used car',
		description:
			'A practical checklist for reviewing vehicle history, paperwork, condition, and independently arranged funding before buying.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-26',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-18.jpg',
		readMinutes: 5,
		summary: [
			'Set your budget, vehicle type, fuel preference, and expected ownership costs.',
			'Check the history, paperwork, visible condition, and whether the vehicle matches its description.',
			'Before finalizing a purchase, have a clear plan for registration, maintenance, and pickup.'
		],
		sections: [
			{
				heading: '1. Define your needs',
				paragraphs: [
					'Before a viewing, decide on your budget, body style, fuel type, mileage range, and expected ownership costs.',
					'This helps you compare vehicles realistically instead of choosing based only on photos or the lowest price.'
				]
			},
			{
				heading: '2. Check history and paperwork',
				paragraphs: [
					'Review service records, vehicle background, and visible condition, and check that the vehicle matches its listing in person.',
					'For a recently imported vehicle, confirm any required document translations, registration steps, and insurance.'
				]
			},
			{
				heading: '3. Take your time at the viewing',
				paragraphs: [
					'Ask for a test drive and an inspection by a mechanic you trust.',
					'Ask Texas Drive Auto what paperwork and registration assistance is available and where to view the vehicle. No dealer financing or payment plans are offered.'
				]
			}
		],
		tags: ['buying', 'viewing', 'used car']
	}),
	article({
		slug: 'lizing-upotrebyavan-avtomobil-plovdiv',
		title: 'Independently arranged funding for a used car',
		description:
			'What to prepare when arranging your own funding, how to assess monthly payments, and why total cost matters more than the lowest payment.',
		category: 'Buyer-arranged funding',
		kind: 'guide',
		date: '2026-05-25',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-21.jpg',
		readMinutes: 4,
		summary: [
			'Consider the down payment, term, monthly payment, fees, and insurance together when comparing independent lenders.',
			'Budget for maintenance, tires, registration, and liability insurance.',
			'Check the total cost, not just the lowest monthly payment.'
		],
		sections: [
			{
				heading: 'How to compare independent lender offers',
				paragraphs: [
					'When arranging funding independently, the monthly payment is only part of the decision. Understand the down payment, term, fees, and total amount payable.',
					'A suitable offer fits your actual budget and leaves room for maintenance.'
				]
			},
			{
				heading: 'What to know about funding',
				paragraphs: [
					'Texas Drive Auto offers no dealer financing or payment plans. Buyers must arrange any funding independently.',
					'For a specific vehicle, confirm the purchase details and any independently arranged funding terms before making a final decision.'
				]
			}
		],
		tags: ['independent funding', 'buyer-arranged funding', 'Dallas']
	}),
	article({
		slug: 'dokumenti-registratsia-nov-vnos',
		title: 'Paperwork and registration for a recently imported vehicle',
		description:
			'Steps to check after choosing a recently imported vehicle and what you can prepare in advance.',
		category: 'Paperwork',
		kind: 'guide',
		date: '2026-05-24',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-24.jpg',
		readMinutes: 4,
		summary: [
			'Check the vehicle background, available paperwork, and mechanical condition before paying.',
			'Plan for any required document translations, registration, insurance, and initial maintenance.',
			'An organized process helps avoid delays between viewing and driving.'
		],
		sections: [
			{
				heading: 'What to check in advance',
				paragraphs: [
					'For a recently imported vehicle, check the available paperwork, vehicle background, and mechanical condition before paying.',
					'Make sure you know which steps are complete and which remain after purchase.'
				]
			},
			{
				heading: 'What comes after choosing a vehicle',
				paragraphs: [
					'After purchase, confirm any required document translations, registration, insurance, and maintenance for the specific vehicle.',
					'Ask Texas Drive Auto whether paperwork or registration assistance is available and what you need to complete before pickup.'
				]
			}
		],
		tags: ['paperwork', 'registration', 'recently imported']
	}),
	article({
		slug: 'bmw-mercedes-audi-upotrebyavani',
		title: 'Used BMW, Mercedes, and Audi: what to check',
		description:
			'A practical guide to choosing a used luxury vehicle from popular brands.',
		category: 'Makes',
		kind: 'guide',
		date: '2026-05-23',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-30.jpg',
		readMinutes: 5,
		summary: [
			'With a luxury vehicle, mechanical condition matters more than the lowest price.',
			'Check the transmission, suspension, electronics, interior, and service history.',
			'Compare maintenance costs before making a final decision.'
		],
		sections: [
			{
				heading: 'Why luxury vehicles need closer attention',
				paragraphs: [
					'BMW, Mercedes-Benz, and Audi can be good choices, but maintenance and history are crucial.',
					'A low purchase price can lead to expensive repairs if maintenance has been skipped or mechanical problems are hidden.'
				]
			},
			{
				heading: 'What to check during a viewing',
				paragraphs: [
					'Check the transmission, suspension, electronics, maintenance records, and actual interior condition.',
					'Ask Texas Drive Auto whether any BMW, Mercedes-Benz, or Audi vehicles are currently available to view and compare in person.'
				]
			}
		],
		tags: ['BMW', 'Mercedes', 'Audi']
	}),
	article({
		slug: 'dizel-benzin-hibrid-elektricheski',
		title: 'Diesel, gas, hybrid, or electric',
		description: 'How to choose a fuel type based on mileage, city driving, budget, and expected costs.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-22',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-32.jpg',
		readMinutes: 5,
		summary: [
			'Diesel can make sense for high mileage, but check the emissions systems.',
			'Gas vehicles can suit shorter trips and offer simpler maintenance.',
			'Hybrid and electric vehicles need additional checks of battery condition and charging operation.'
		],
		sections: [
			{
				heading: 'Choose for your actual driving',
				paragraphs: [
					'The best choice depends on your routes, annual mileage, maintenance budget, and the specific vehicle.',
					'Gas or hybrid vehicles often suit city driving, while diesel can work well for longer highway trips.'
				]
			},
			{
				heading: 'What to check',
				paragraphs: [
					'For diesel vehicles, check maintenance records, the turbo, filters, and emissions systems.',
					'For hybrid or electric vehicles, check the battery, charging operation, history, and real-world range.'
				]
			}
		],
		tags: ['diesel', 'gas', 'hybrid']
	}),
	article({
		slug: 'kak-da-podgotvim-avtomobil-za-prodazhba',
		title: 'How to prepare a car for sale or a possible trade-in',
		description:
			'What to prepare before asking Texas Drive Auto whether appraisals, vehicle purchases, or trade-ins are available.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-21',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-31.jpg',
		readMinutes: 4,
		summary: [
			'Gather photos, basic vehicle details, paperwork, and maintenance information.',
			'Describe the condition accurately to support a more informed appraisal.',
			'If a trade-in is available, set a clear budget for your next vehicle.'
		],
		sections: [
			{
				heading: 'What to prepare for an appraisal inquiry',
				paragraphs: [
					'For a preliminary appraisal inquiry, useful details include photos, year, mileage, engine, transmission, trim level, and maintenance information.',
					'Accurate information helps an appraiser give a more realistic initial assessment.'
				]
			},
			{
				heading: 'Selling or trading in a vehicle?',
				paragraphs: [
					'If you’re considering a trade-in, outline your next vehicle preferences: make, budget, body style, and fuel type.',
					'Ask whether trade-ins are accepted and how current inventory and your vehicle’s condition would affect the options.'
				]
			}
		],
		tags: ['selling', 'trade-in', 'appraisal']
	}),
	article({
		slug: 'kakvo-oznachava-proveren-avtomobil',
		title: 'What does an inspected vehicle mean when buying?',
		description:
			'A brief explanation of what a vehicle inspection should cover and why it matters.',
		category: 'Tips',
		kind: 'guide',
		date: '2026-05-20',
		author: 'Texas Drive Auto',
		image: '/assets/images/blog/post-23.jpg',
		readMinutes: 4,
		summary: [
			'A thorough check should include paperwork, visible condition, a test drive, and a mechanical inspection.',
			'History and service records provide context but don’t replace an inspection.',
			'Weigh the price, condition, and expected ownership costs together.'
		],
		sections: [
			{
				heading: 'An inspection is more than a quick look',
				paragraphs: [
					'A vehicle may look good in photos, but a thorough check includes paperwork, visible condition, a test drive, and a mechanic’s assessment.',
					'Especially with more expensive models, check maintenance records, electronics, suspension, and wear items.'
				]
			},
			{
				heading: 'How to decide',
				paragraphs: [
					'A good purchase balances price, condition, history, future costs, and a convenient process.',
					'What information is available from Texas Drive Auto to help compare these factors before buying?'
				]
			}
		],
		tags: ['inspection', 'viewing', 'condition']
	})
];

export const getDayNightArticleBySlug = (slug: string) =>
	daynightArticles.find((article) => article.slug === slug);

export const getDayNightArticleIndex = (slug: string) =>
	daynightArticles.findIndex((article) => article.slug === slug);
