import type { DayNightArticle, DayNightArticleSection } from './daynight-blog';

// Authored, file-based editorial content for the standalone template.
// A configured CMS remains authoritative; an empty CMS never falls back here.
function guide(slug: string, title: string, description: string, image: string, category: DayNightArticle['category'], tags: string[], sections: DayNightArticleSection[]): DayNightArticle {
	const body = sections.flatMap(section => section.paragraphs);
	return { slug, title, description, image, category, tags, sections, body,
		kind: 'guide', date: '2026-09-08', author: '',
		readMinutes: Math.max(1, Math.ceil(body.join(' ').split(/\s+/).length / 180)),
		summary: [description, body.at(-1) ?? description] };
}

export const editorialGuides: DayNightArticle[] = [
	guide('kak-da-kupim-upotrebyavan-avtomobil', 'Used-car inspection: where to start',
		'A practical inspection checklist — from phone questions to an independent shop inspection.',
		'/assets/images/blog/post-18.jpg', 'Buying', ['viewing', 'buying'], [
		{ heading: 'Before you go', paragraphs: [
			'Confirm that the vehicle is available and allow enough time to inspect it in daylight. Request the VIN, photos of service documents with personal information hidden, and details of known issues. Write down the answers so you can compare them with what you find in person.',
			'Ask in advance whether a test drive and independent inspection are possible. If you want to see a cold start, arrange that before your visit.' ] },
		{ heading: 'Inspect the vehicle in a consistent order', paragraphs: [
			'Start with a walk around the exterior, then inspect the trunk and interior. Photograph any issues with permission. Check whether the seats, seat belts, windows, air conditioning, and listed equipment can be demonstrated.',
			'Compare the VIN and odometer reading with the documents provided. Differences in paint, noises, or warning lights call for questions and a professional inspection; they are not enough to diagnose a problem yourself.' ] },
		{ heading: 'Leave the mechanical assessment to a professional', paragraphs: [
			'Prepare a list of concerns for the shop and request a written summary of its findings. Clarify which checks were completed and which were not possible.',
			'After the inspection, compare the findings with the original description. Making a decision is easier when you have specific answers about the vehicle instead of a general assurance that everything is fine.' ] }
	]),
	guide('vaprosi-predi-ogled', 'What to ask before traveling to see a car',
		'A short checklist of questions and photos that can save you a wasted trip.',
		'/assets/images/blog/post-20.jpg', 'Buying', ['listings', 'viewing'], [
		{ heading: 'Confirm which vehicle you are discussing', paragraphs: [
			'Send the link to the specific listing. Confirm the trim, engine, transmission, and location. Ask whether the photos show its current condition and whether you can see it on the agreed day.',
			'Ask about the number of keys, available service records, and equipment that matters to you. Do not assume that every feature offered for the model is included on this particular vehicle.' ] },
		{ heading: 'Request specific photos', paragraphs: [
			'Instead of saying “send more photos,” specify what is missing: all seats, the trunk, dashboard, tires, or a particular issue. For a scratch, a close-up and a wider photo showing its location are useful.',
			'A short video can demonstrate a feature, but it does not replace an in-person inspection. Avoid drawing firm conclusions from sound recorded on a phone alone.' ] },
		{ heading: 'Confirm the appointment', paragraphs: [
			'Write down the address, time, and contact phone number. Ask how much time is reserved and whether an independent shop inspection can be arranged during the same visit.',
			'Send your most important questions in one message. A clear list makes it easier to respond and gives you a handy reference for the inspection.' ] }
	]),
	guide('sravnyavane-na-avtomobilni-obyavi', 'How to compare three listings without getting lost in the features',
		'Organize the key differences: trim, condition, history, and equipment.',
		'/assets/images/blog/post-32.jpg', 'Buying', ['comparison', 'listings'], [
		{ heading: 'Use the same criteria', paragraphs: [
			'For each vehicle, record the model, year, engine, transmission, mileage, and asking price. Different generations or trims can look similar in photos, so confirm the exact version.',
			'Separate your preferences into must-haves and extras. For example, room for a child seat or trunk space may matter more in everyday use than a panoramic roof.' ] },
		{ heading: 'Track missing information too', paragraphs: [
			'Add columns for service history, known issues, keys, and the most recent service. If something is not listed, write “unspecified” instead of assuming it is included or working.',
			'Ask every seller the same sequence of questions. This makes the answers easier to compare and keeps attractive photos from overshadowing important details.' ] },
		{ heading: 'Update your comparison after the inspection', paragraphs: [
			'Add your own notes and the independent inspection results beside each listing. Separate confirmed facts from questions that still need answers.',
			'Narrow your choices to vehicles that meet your needs and have enough information available. A long feature list alone does not describe the condition of a particular vehicle.' ] }
	]),
	guide('testovo-shofirane-kakvo-da-proverite', 'Test drive: what to check beforehand',
		'Prepare a route and questions to make the most of your time behind the wheel.',
		'/assets/images/blog/post-31.jpg', 'Buying', ['test drive', 'viewing'], [
		{ heading: 'Agree on the arrangements', paragraphs: [
			'Before visiting, ask whether a test drive is possible, who will accompany you, and what requirements you must meet. Confirm the duration and route in advance.',
			'First, adjust the seat, steering wheel, and mirrors while the vehicle is parked. Check that you can see the dashboard clearly and comfortably reach the main controls.' ] },
		{ heading: 'Pay attention to everyday comfort', paragraphs: [
			'Notice visibility, cabin noise, and how the car feels during normal acceleration and braking. Try parking in a suitable place if it is part of the agreed route.',
			'Do not make abrupt or risky maneuvers as a “test.” Adjust menus and check equipment while parked. If you notice anything unusual, discuss it with the person accompanying you.' ] },
		{ heading: 'Write down your impressions right away', paragraphs: [
			'After returning, note what felt comfortable and what you want checked. A specific description such as “noise during this maneuver” is more useful to the shop than a general impression.',
			'A test drive helps you decide whether the vehicle suits you. It does not replace a mechanical inspection or prove that there are no hidden problems.' ] }
	]),
	guide('kak-da-podgotvim-avtomobil-za-prodazhba', 'Preparing to sell: what to gather before listing',
		'Documents, equipment details, and clear condition information in one organized package.',
		'/assets/images/blog/post-30.jpg', 'Selling', ['selling', 'preparation'], [
		{ heading: 'Gather the information in one place', paragraphs: [
			'Confirm the exact vehicle trim, odometer reading, number of keys, and equipment list. Review the service records and note when the documented work was performed.',
			'Hide personal information on documents and invoices in public photos. Keep the originals available for review at an appropriate meeting instead of sharing them unnecessarily.' ] },
		{ heading: 'Describe the condition precisely', paragraphs: [
			'List known issues with the body, interior, and equipment. Specify which feature does not work or which part has visible damage instead of using vague descriptions.',
			'Clean the vehicle and remove personal belongings. The goal is to let the buyer inspect it comfortably without concealing wear or problems.' ] },
		{ heading: 'Prepare a consistent listing', paragraphs: [
			'Organize the text into short sections: basic details, equipment, history, and known issues. Check that the photos and text describe the same current condition.',
			'Explain how and when a viewing can be arranged. If anything changes, update the listing so you don’t have to repeat the same details to each prospective buyer.' ] }
	]),
	guide('snimki-na-avtomobil-za-obyava', 'Car listing photos: the essential shots',
		'Show the vehicle clearly with consistent photos and visible flaws.',
		'/assets/images/blog/post-23.jpg', 'Selling', ['photos', 'listings'], [
		{ heading: 'Start with a full view', paragraphs: [
			'Choose a spacious location with even daylight. Clean the lens and capture the entire vehicle from the front, rear, both sides, and at an angle.',
			'Keep a similar distance and height for exterior shots. Avoid strong filters or edits that change the color or hide details.' ] },
		{ heading: 'Show the areas buyers will ask about', paragraphs: [
			'Include photos of the front and rear seats, dashboard, trunk, and key equipment. Keep bags, documents, and other personal belongings out of the frame.',
			'For each visible flaw, take a close-up and another photo from farther away. This shows both the detail and its location on the vehicle.' ] },
		{ heading: 'Review your photos before uploading', paragraphs: [
			'Delete blurry and duplicate shots. Arrange the remaining photos from exterior views to the interior, equipment, and details. Check that each image is oriented correctly.',
			'Photos should help buyers decide what else to ask and whether to schedule a viewing. A complete, clear set is more useful than many nearly identical shots.' ] }
	])
];
