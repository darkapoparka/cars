import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { openai } from '@ai-sdk/openai';
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText,
	type UIMessage
} from 'ai';
import type { RequestHandler } from './$types';
import {
	buildCopilotContext,
	copilotChatContextPrompt,
	copilotChatRequestSchema,
	copilotSystemPrompt,
	fallbackCopilotChatResponse,
	latestCopilotUserText
} from '$lib/server/admin-copilot';
import { requireEliqautoPageSession } from '$lib/server/auth';

const modelName = () => env.OPENAI_MODEL || 'gpt-5.5';
const hasOpenAiKey = () => Boolean(env.OPENAI_API_KEY?.trim());

const fallbackStreamResponse = ({
	message,
	messages,
	status = 200
}: {
	message: string;
	messages: UIMessage[];
	status?: number;
}) => {
	const stream = createUIMessageStream<UIMessage>({
		execute: ({ writer }) => {
			const messageId = `eliqauto-copilot-${Date.now()}`;
			const textId = `${messageId}-text`;

			writer.write({ type: 'start', messageId });
			writer.write({ type: 'start-step' });
			writer.write({ type: 'text-start', id: textId });
			writer.write({ type: 'text-delta', delta: message, id: textId });
			writer.write({ type: 'text-end', id: textId });
			writer.write({ type: 'finish-step' });
			writer.write({ type: 'finish', finishReason: 'stop' });
		},
		originalMessages: messages
	});

	return createUIMessageStreamResponse({ status, stream });
};

export const POST: RequestHandler = async ({ request, url }) => {
	requireEliqautoPageSession(request, 'admin/copilot', url.searchParams);

	const body = await request.json().catch(() => undefined);
	const parsed = copilotChatRequestSchema.safeParse(body);

	if (!parsed.success) {
		error(400, 'Copilot chat expects AI SDK UI messages');
	}

	const messages = parsed.data.messages as UIMessage[];
	const cms = buildCopilotContext();
	const fallbackMessage = fallbackCopilotChatResponse({
		cms,
		message: latestCopilotUserText(messages)
	});

	if (!hasOpenAiKey()) {
		return fallbackStreamResponse({ message: fallbackMessage, messages });
	}

	try {
		const result = streamText({
			messages: await convertToModelMessages(messages),
			model: openai(modelName()),
			system: [copilotSystemPrompt(), copilotChatContextPrompt(cms)].join('\n\n')
		});

		return result.toUIMessageStreamResponse();
	} catch {
		return fallbackStreamResponse({ message: fallbackMessage, messages, status: 502 });
	}
};
