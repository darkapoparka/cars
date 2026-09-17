import { env } from '$env/dynamic/private';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	buildAssistantSystemPrompt,
	getAssistantSnapshot,
	getAssistantWorkQueue,
	searchAssistantInventory,
	searchAssistantPosts
} from '$lib/server/repositories/admin-assistant';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';

const vehicleStatusSchema = z.enum(['all', 'draft', 'published', 'sold', 'archived']);
const postStatusSchema = z.enum(['all', 'draft', 'published', 'archived']);
const postTypeSchema = z.enum(['all', 'news', 'blog']);
const workQueueKindSchema = z.enum(['leads', 'imports', 'both']);

const messageSchema = z
	.object({
		id: z.string().optional(),
		role: z.enum(['system', 'user', 'assistant']),
		parts: z.array(z.unknown()).optional()
	})
	.passthrough();

const requestSchema = z.object({
	messages: z.array(messageSchema).min(1).max(24)
});

type AdminCapabilities = Awaited<ReturnType<typeof requireAdminDealer>>['capabilities'];

function canUseAdminAssistant(capabilities: AdminCapabilities) {
	return (
		capabilities.settings || (capabilities.inventory && capabilities.content && capabilities.sales)
	);
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const { db, dealerId, capabilities, profile } = await requireAdminDealer(locals);

	if (!canUseAdminAssistant(capabilities)) {
		return json({ error: 'This account cannot use the admin assistant.' }, { status: 403 });
	}

	let limit;

	try {
		limit = await rateLimit(createRateLimitKey('admin-assistant', profile.id), 25, 60_000, {
			db
		});
	} catch (error) {
		console.error('Admin assistant rate limit failed:', error);
		return json({ error: 'Admin assistant is temporarily unavailable.' }, { status: 503 });
	}

	if (!limit.allowed) {
		return json(
			{ error: 'Too many assistant requests. Try again shortly.' },
			{ status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
		);
	}

	const apiKey = env.OPENAI_API_KEY;

	if (!apiKey) {
		return json(
			{ error: 'OPENAI_API_KEY is not configured for the admin assistant.' },
			{ status: 503 }
		);
	}

	const parsedBody = requestSchema.safeParse(await request.json().catch(() => null));

	if (!parsedBody.success) {
		return json({ error: 'Invalid assistant request.' }, { status: 400 });
	}

	const snapshot = await getAssistantSnapshot(db, dealerId);
	const openai = createOpenAI({ apiKey });

	const assistantTools = {
		getInventory: tool({
			description:
				'Read AVANGARD AUTO inventory records by status or search query. Returns admin links, public links, specs, pricing, and QA issues.',
			inputSchema: z.object({
				status: vehicleStatusSchema.default('all'),
				query: z.string().trim().max(80).optional(),
				limit: z.number().int().min(1).max(20).default(8)
			}),
			execute: async (input) => searchAssistantInventory(db, dealerId, input)
		}),
		getPosts: tool({
			description:
				'Read AVANGARD AUTO posts and news records by status, type, or search query. Returns admin/public links and editorial metadata.',
			inputSchema: z.object({
				status: postStatusSchema.default('all'),
				type: postTypeSchema.default('all'),
				query: z.string().trim().max(80).optional(),
				limit: z.number().int().min(1).max(20).default(8)
			}),
			execute: async (input) => searchAssistantPosts(db, dealerId, input)
		}),
		getWorkQueue: tool({
			description:
				'Read current lead and import request queues. Use this for sales follow-up, import pipeline summaries, and priority triage.',
			inputSchema: z.object({
				kind: workQueueKindSchema.default('both'),
				limit: z.number().int().min(1).max(15).default(6)
			}),
			execute: async (input) => getAssistantWorkQueue(db, dealerId, input)
		}),
		prepareListingDraftContext: tool({
			description:
				'Gather source data for a listing copy draft. This tool never writes to the CMS; it returns context and an explicit confirmation requirement.',
			inputSchema: z.object({
				query: z
					.string()
					.trim()
					.max(80)
					.describe('Vehicle id, slug, lot, make/model, or title fragment.'),
				targetLanguage: z.enum(['bg', 'en']).default('bg'),
				angle: z
					.string()
					.trim()
					.max(120)
					.optional()
					.describe('Optional positioning angle, e.g. family SUV, premium sedan, budget car.')
			}),
			execute: async (input) => {
				const inventory = await searchAssistantInventory(db, dealerId, {
					query: input.query,
					limit: 3
				});

				return {
					action: 'draft_listing_copy',
					requiresConfirmationBeforeWrite: true,
					confirmationPath: 'Open the listing editor, review the draft, then save the form.',
					targetLanguage: input.targetLanguage,
					angle: input.angle ?? null,
					sourceRecords: inventory.items
				};
			}
		}),
		preparePostDraftContext: tool({
			description:
				'Gather CMS context for a post/news draft. This tool never writes to the CMS; it returns a draft brief and confirmation requirement.',
			inputSchema: z.object({
				topic: z.string().trim().min(3).max(160),
				type: z.enum(['news', 'blog']).default('news'),
				targetLanguage: z.enum(['bg', 'en']).default('bg'),
				relatedInventoryQuery: z.string().trim().max(80).optional()
			}),
			execute: async (input) => {
				const relatedInventory = input.relatedInventoryQuery
					? await searchAssistantInventory(db, dealerId, {
							query: input.relatedInventoryQuery,
							limit: 4
						})
					: { totalMatched: 0, items: [] };

				return {
					action: 'draft_post',
					requiresConfirmationBeforeWrite: true,
					confirmationPath: 'Create or open a post in the CMS, review the draft, then save.',
					topic: input.topic,
					type: input.type,
					targetLanguage: input.targetLanguage,
					relatedInventory: relatedInventory.items
				};
			}
		})
	};

	const messages = parsedBody.data.messages.slice(-16) as UIMessage[];
	const result = streamText({
		model: openai(env.OPENAI_ADMIN_ASSISTANT_MODEL || 'gpt-5.1'),
		system: buildAssistantSystemPrompt(snapshot),
		messages: await convertToModelMessages(messages, { tools: assistantTools }),
		tools: assistantTools,
		stopWhen: stepCountIs(3),
		maxOutputTokens: 1400,
		maxRetries: 1
	});

	return result.toUIMessageStreamResponse();
};
