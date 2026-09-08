import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCopilotContext, fallbackCopilotChatResponse } from '$lib/server/admin-copilot';
import { POST } from './+server';

const chatBody = (text: string) => ({
	messages: [
		{
			id: 'test-user-message',
			parts: [{ type: 'text', text }],
			role: 'user'
		}
	]
});

const chatEvent = (body: object) => {
	const url = 'http://localhost/admin/copilot/chat?role=admin';

	return {
		request: new Request(url, {
			body: JSON.stringify(body),
			headers: { 'content-type': 'application/json' },
			method: 'POST'
		}),
		url: new URL(url)
	} as Parameters<typeof POST>[0];
};

describe('admin Copilot chat endpoint', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('streams a safe local CMS answer when OPENAI_API_KEY is not configured', async () => {
		vi.stubEnv('OPENAI_API_KEY', '');

		const response = await POST(chatEvent(chatBody('Summarize inventory and draft stock.')));
		const stream = await response.text();

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/event-stream');
		expect(stream).toContain('listings are published');
		expect(stream).toContain('remain in draft');
	});

	it('routes natural-language fallback prompts to the listing gap audit', () => {
		const cms = buildCopilotContext();
		const response = fallbackCopilotChatResponse({
			cms,
			message: 'Which listings are incomplete and missing publishing data?'
		});

		expect(response).toMatch(/add|No obvious listing gaps/i);
		expect(response).not.toContain('OPENAI_API_KEY');
	});
});
