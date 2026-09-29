import nodeAdapter from '@sveltejs/adapter-node';
import vercelAdapter from '@sveltejs/adapter-vercel';

const localeBase = process.env.DAY_LOCALE_BASE ?? '';
if (!['', '/variant-3'].includes(localeBase)) throw new Error('Unsupported Carwow mount');

const useNodePreviewAdapter = process.env.DAY_PREVIEW_ADAPTER === 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Locale links wrap resolve(); keep its SSR output absolute at every route depth.
		paths: { base: localeBase, relative: false },
		// Deploy target is Vercel (project: daynight-preview). adapter-vercel emits the
		// .vercel/output the platform serves, so SSR routes/APIs become serverless
		// functions. (adapter-node is the swap-in for a self-hosted Node server.)
		adapter: useNodePreviewAdapter ? nodeAdapter({ out: 'build' }) : vercelAdapter()
	}
};

export default config;
