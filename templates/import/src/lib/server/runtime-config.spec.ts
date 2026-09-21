import { describe, expect, it } from 'vitest';
import { parseRuntimeConfig } from './runtime-config';

describe('runtime capability isolation', () => {
	it('keeps accidental credentials inert in the default preview', () => {
		const config = parseRuntimeConfig({
			DATABASE_URL: 'postgresql://test.invalid/test',
			OPENAI_API_KEY: 'test-key',
			TEMPLATE_AI_ENABLED: 'true'
		});
		expect(config.mode).toBe('preview');
		expect(config.inquiryStorage).toBe('demo');
		expect(config.aiEnabled).toBe(false);
	});
	it('never falls back to demos when live configuration is incomplete', () => {
		const config = parseRuntimeConfig({
			TEMPLATE_MODE: 'live',
			TEMPLATE_ADMIN_ENABLED: 'true',
			TEMPLATE_AI_ENABLED: 'true',
			OPENAI_API_KEY: 'test-key'
		});
		expect(config.inquiryStorage).toBe('unavailable');
		expect(config.adminEnabled).toBe(false);
		expect(config.aiEnabled).toBe(false);
		expect(config.cmsEnabled).toBe(false);
		expect(config.uploadsEnabled).toBe(false);
	});
	it('requires a separate explicit AI decision after live staff configuration', () => {
		const source = {
			TEMPLATE_MODE: 'live',
			TEMPLATE_ADMIN_ENABLED: 'true',
			DATABASE_URL: 'postgresql://test.invalid/test',
			TEMPLATE_ADMIN_EMAIL: 'staff@example.invalid',
			TEMPLATE_ADMIN_PASSWORD: 'long-test-password-only',
			OPENAI_API_KEY: 'test-key'
		};
		expect(parseRuntimeConfig(source).aiEnabled).toBe(false);
		expect(parseRuntimeConfig({ ...source, TEMPLATE_AI_ENABLED: 'true' }).aiEnabled).toBe(true);
	});
	it('rejects invalid modes instead of interpreting them as preview', () => {
		expect(() => parseRuntimeConfig({ TEMPLATE_MODE: 'production' })).toThrow('TEMPLATE_MODE');
	});
});
