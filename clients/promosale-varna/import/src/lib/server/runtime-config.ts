import { env } from '$env/dynamic/private';

export type RuntimeMode = 'preview' | 'live';
export type RuntimeEnvironment = Record<string, string | undefined>;

/** Explicit mode prevents accidentally installed credentials from enabling a live service. */
export function parseRuntimeConfig(source: RuntimeEnvironment) {
	const mode = source.TEMPLATE_MODE?.trim() || 'preview';
	if (mode !== 'preview' && mode !== 'live')
		throw new Error('TEMPLATE_MODE must be preview or live');
	const live = mode === 'live';
	const databaseConfigured = Boolean(source.DATABASE_URL?.trim());
	const adminRequested = source.TEMPLATE_ADMIN_ENABLED === 'true';
	const adminConfigured =
		databaseConfigured &&
		Boolean(source.TEMPLATE_ADMIN_EMAIL?.trim()) &&
		(source.TEMPLATE_ADMIN_PASSWORD?.length ?? 0) >= 16;
	return {
		mode: mode as RuntimeMode,
		inquiryStorage: !live
			? ('demo' as const)
			: databaseConfigured
				? ('database' as const)
				: ('unavailable' as const),
		adminEnabled: !live || (adminRequested && adminConfigured),
		aiEnabled:
			live &&
			adminRequested &&
			adminConfigured &&
			source.TEMPLATE_AI_ENABLED === 'true' &&
			Boolean(source.OPENAI_API_KEY?.trim()),
		// File-backed CMS/account demos are intentionally not a production storage adapter.
		cmsEnabled: !live,
		uploadsEnabled: !live
	};
}

export const runtimeConfig = () => parseRuntimeConfig(env);
export const isPreviewMode = () => runtimeConfig().mode === 'preview';
