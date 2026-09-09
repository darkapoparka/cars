import { z } from 'zod';
import type { UIMessage } from 'ai';
import type { AdminInventoryRow } from './admin-cms';
import { getAdminCmsOverview } from './admin-cms';

export const copilotTaskSchema = z.enum([
	'daily-snapshot',
	'inventory-summary',
	'incomplete-listings',
	'draft-description',
	'lead-summary'
]);

export type CopilotTask = z.infer<typeof copilotTaskSchema>;

export const copilotChatRequestSchema = z
	.object({
		messages: z
			.array(
				z
					.object({
						id: z.string(),
						parts: z.array(z.object({ type: z.string() }).passthrough()),
						role: z.enum(['system', 'user', 'assistant'])
					})
					.passthrough()
			)
			.default([])
	})
	.passthrough();

export type CopilotContext = ReturnType<typeof getAdminCmsOverview>;

export const copilotQuickPrompts = [
	{
		label: 'Daily snapshot',
		prompt:
			'Generate a CEO-ready daily snapshot from live inventory, draft stock, leads, and imports.'
	},
	{
		label: 'Listing gaps',
		prompt: 'Which inventory listings are incomplete, and what should the team fix first?'
	},
	{
		label: 'Draft copy',
		prompt:
			'Draft a polished vehicle description for the most recent draft listing using only CMS specs.'
	},
	{
		label: 'Lead summary',
		prompt:
			'Summarize the current leads, import requests, and customer conversations that need attention.'
	}
] as const;

const taskLabels: Record<CopilotTask, string> = {
	'daily-snapshot': 'CEO-ready daily snapshot',
	'inventory-summary': 'Inventory summary',
	'incomplete-listings': 'Incomplete listing audit',
	'draft-description': 'Vehicle description draft',
	'lead-summary': 'Lead and import summary'
};

export const getIncompleteListings = (cms: CopilotContext) =>
	cms.inventory
		.map((listing) => ({ listing, missing: listing.completeness.missing }))
		.filter((item) => item.missing.length > 0)
		.slice(0, 8);

const listingLine = (listing: AdminInventoryRow) =>
	`${listing.title} (${listing.status}) - ${listing.priceLabel}, ${listing.mileage}, ${listing.fuel}, ${listing.transmission}, VIN ${listing.vin}`;

const leadLine = (lead: CopilotContext['inquiries'][number]) =>
	`${lead.contactName}: ${lead.status}, ${lead.vehicleTitle ?? lead.source} - ${lead.message}`;

const importLine = (submission: CopilotContext['imports'][number]) =>
	`${submission.contactName}: ${submission.status}, ${submission.title}, ${submission.expectedPrice} - ${submission.message}`;

const normalize = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9а-я]+/gi, ' ')
		.trim();

const messageText = (message: UIMessage) =>
	message.parts
		.filter((part) => part.type === 'text')
		.map((part) => part.text)
		.join('\n')
		.trim();

const findListingFromText = (cms: CopilotContext, text: string) => {
	const normalizedText = normalize(text);

	return cms.inventory.find((listing) => {
		const candidates = [
			listing.id,
			listing.slug,
			listing.title,
			listing.vin,
			listing.stockNumber,
			`${listing.brand} ${listing.model}`
		]
			.filter(Boolean)
			.map(normalize);

		return candidates.some((candidate) => candidate && normalizedText.includes(candidate));
	});
};

export const buildCopilotContext = () => getAdminCmsOverview();

export const copilotSystemPrompt = () =>
	[
		'You are Promosale Varna AI Copilot, an admin-only assistant for the Promosale Varna CMS.',
		'Use only the supplied CMS context. Do not invent private data, credentials, or hidden system details.',
		'Never expose secrets, environment variables, session tokens, or implementation internals.',
		'Write concise, CEO-ready Bulgarian-market dealership operations notes in English.'
	].join('\n');

export const copilotChatContextPrompt = (cms: CopilotContext) => {
	const incomplete = getIncompleteListings(cms);

	return [
		'Live CMS context for this admin chat request:',
		`KPIs: ${JSON.stringify(cms.kpis)}`,
		`Recent inventory:\n${cms.inventory.slice(0, 12).map(listingLine).join('\n')}`,
		`Incomplete listings:\n${incomplete
			.map((item) => `${item.listing.title}: missing ${item.missing.join(', ')}`)
			.join('\n')}`,
		`Open inquiries:\n${cms.inquiries.slice(0, 8).map(leadLine).join('\n')}`,
		`Imports/submissions:\n${cms.imports.slice(0, 8).map(importLine).join('\n')}`,
		'Only answer from this context. If the admin asks for something outside it, say what CMS data is missing.'
	]
		.filter(Boolean)
		.join('\n\n');
};

export const copilotWelcomeMessage = (cms: CopilotContext) =>
	[
		`I am watching ${cms.kpis.liveListings} live listings, ${cms.kpis.draftListings} drafts, ${cms.kpis.openLeads} open leads, and ${cms.kpis.activeImports} active import records.`,
		'Ask for a daily snapshot, listing gap audit, vehicle description, or lead summary.'
	].join(' ');

export const latestCopilotUserText = (messages: UIMessage[]) => {
	const latest = [...messages].reverse().find((message) => message.role === 'user');

	return latest ? messageText(latest) : '';
};

export const copilotUserPrompt = ({
	cms,
	listingId,
	notes,
	task
}: {
	cms: CopilotContext;
	listingId?: string;
	notes?: string;
	task: CopilotTask;
}) => {
	const selectedListing = listingId
		? cms.inventory.find((listing) => listing.id === listingId || listing.slug === listingId)
		: undefined;
	const incomplete = getIncompleteListings(cms);

	return [
		`Task: ${taskLabels[task]}`,
		`KPIs: ${JSON.stringify(cms.kpis)}`,
		`Recent inventory: ${cms.inventory.slice(0, 10).map(listingLine).join('\n')}`,
		`Incomplete listings: ${incomplete
			.map((item) => `${item.listing.title}: missing ${item.missing.join(', ')}`)
			.join('\n')}`,
		`Open inquiries: ${cms.inquiries.slice(0, 8).map(leadLine).join('\n')}`,
		`Imports/submissions: ${cms.imports.slice(0, 8).map(importLine).join('\n')}`,
		selectedListing ? `Selected listing: ${JSON.stringify(selectedListing)}` : '',
		notes ? `Admin notes: ${notes}` : '',
		'Return 4-7 sharp bullets or a compact paragraph when drafting copy.'
	]
		.filter(Boolean)
		.join('\n\n');
};

export const fallbackCopilotResponse = ({
	cms,
	listingId,
	notes,
	task
}: {
	cms: CopilotContext;
	listingId?: string;
	notes?: string;
	task: CopilotTask;
}) => {
	const incomplete = getIncompleteListings(cms);
	const selectedListing = listingId
		? cms.inventory.find((listing) => listing.id === listingId || listing.slug === listingId)
		: undefined;

	if (task === 'draft-description' && selectedListing) {
		return [
			`${selectedListing.title} is available through Promosale Varna with ${selectedListing.mileage} recorded mileage and ${selectedListing.transmission.toLowerCase()} transmission.`,
			`Key specification: ${selectedListing.fuel}, ${selectedListing.engine}, ${selectedListing.color}, stock ${selectedListing.stockNumber}.`,
			`Position it as a transparent, document-ready listing and add final inspection, service, and ownership notes before publishing.`
		].join('\n');
	}

	if (task === 'incomplete-listings') {
		return incomplete.length
			? incomplete
					.map((item) => `- ${item.listing.title}: add ${item.missing.join(', ')}.`)
					.join('\n')
			: 'No obvious listing gaps were found in the current CMS inventory.';
	}

	if (task === 'lead-summary') {
		return [
			`${cms.kpis.openLeads} open leads, ${cms.kpis.activeImports} active import/submission records, and ${cms.kpis.openConversations} open conversations need attention.`,
			...cms.recentWork
				.slice(0, 4)
				.map((item) => `- ${item.type}: ${item.label} (${item.status}) - ${item.body}`)
		].join('\n');
	}

	if (task === 'inventory-summary') {
		return [
			`${cms.kpis.liveListings} listings are published and ${cms.kpis.draftListings} remain in draft.`,
			`Top CMS action: review ${incomplete.length} incomplete listing records before promoting more stock.`,
			...cms.recentInventory.slice(0, 4).map((listing) => `- ${listingLine(listing)}`)
		].join('\n');
	}

	return [
		`Daily snapshot: ${cms.kpis.liveListings} live listings, ${cms.kpis.draftListings} draft listings, ${cms.kpis.openLeads} open leads, and ${cms.kpis.activeImports} active import/submission records.`,
		incomplete.length
			? `Quality queue: ${incomplete.length} listings need richer specs, media, or publishing data.`
			: 'Quality queue: no obvious listing completion gaps.',
		notes ? `Operator note: ${notes}` : 'Operator note: no extra admin notes supplied.'
	].join('\n');
};

export const fallbackCopilotChatResponse = ({
	cms,
	message
}: {
	cms: CopilotContext;
	message: string;
}) => {
	const normalizedMessage = normalize(message);
	const incomplete = getIncompleteListings(cms);
	const selectedListing = findListingFromText(cms, message);
	const draftListing =
		selectedListing ??
		cms.inventory.find((listing) => listing.status === 'draft') ??
		cms.inventory[0];
	const wantsDescription =
		/\b(description|copy|advert|ad|listing text)\b/i.test(message) ||
		/\bdraft (a|the|vehicle|listing|description|copy)\b/i.test(message);
	const wantsIncomplete = /\b(incomplete|missing|gap|gaps|audit|fix|finish|publish)\b/i.test(
		message
	);
	const wantsLeads = /\b(lead|leads|inquir|conversation|message|import|seller|submission)\b/i.test(
		message
	);
	const wantsInventory = /\b(inventory|stock|cars|vehicle|vehicles|live|draft)\b/i.test(message);
	const wantsDaily = /\b(snapshot|daily|ceo|today|summary|brief)\b/i.test(message);

	if (wantsDescription && draftListing) {
		return fallbackCopilotResponse({
			cms,
			listingId: draftListing.id,
			task: 'draft-description'
		});
	}

	if (wantsIncomplete) {
		return fallbackCopilotResponse({ cms, task: 'incomplete-listings' });
	}

	if (wantsLeads) {
		return fallbackCopilotResponse({ cms, task: 'lead-summary' });
	}

	if (wantsInventory) {
		return fallbackCopilotResponse({ cms, task: 'inventory-summary' });
	}

	if (wantsDaily || !normalizedMessage) {
		return fallbackCopilotResponse({ cms, task: 'daily-snapshot' });
	}

	return [
		`Local Copilot mode is using live CMS data: ${cms.kpis.liveListings} published listings, ${cms.kpis.draftListings} drafts, ${cms.kpis.openLeads} open leads, and ${cms.kpis.activeImports} active import/submission records.`,
		incomplete.length
			? `The fastest operational win is to complete ${incomplete.length} listing records with missing specs, media, or publishing details.`
			: 'The current listing set has no obvious completion gaps.',
		'Try asking for a daily snapshot, incomplete listing audit, vehicle description draft, or lead/import summary.'
	].join('\n');
};
