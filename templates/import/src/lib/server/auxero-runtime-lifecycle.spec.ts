import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { parse } from 'svelte/compiler';
import { describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: { TEMPLATE_MODE: 'preview' } }));
import { renderAuxeroTemplate } from './auxero-template';

type Owner = { active: boolean; controller?: AbortController };
type Listener = { type: string; handler: (event: object) => unknown; signal?: AbortSignal };
type SourceScript = {
	attributes: { name: string; value: string }[];
	textContent: string;
	src: string;
};
type Script = SourceScript & {
	setAttribute: (name: string, value: string) => void;
	addEventListener: (type: string, handler: () => void) => void;
	remove: () => void;
	__DAYNIGHT_RUNTIME_OWNER__?: Owner;
	events: Record<string, () => void>;
};
type FakeForm = {
	values: [string, string][];
	className: string;
	classList: { contains: (name: string) => boolean };
	status: { textContent: string };
	matches: (selector: string) => boolean;
	hasAttribute: (name: string) => boolean;
	querySelector: () => { textContent: string };
};

function environment() {
	const listeners: Listener[] = [],
		scripts: Script[] = [],
		timers: (() => void)[] = [];
	const storage = new Map<string, string>();
	const fetch = vi.fn<
		(
			url: string,
			options?: RequestInit
		) => Promise<{
			ok: boolean;
			json: () => Promise<{ ok: boolean }>;
		}>
	>(async () => ({
		ok: true,
		json: async () => ({ ok: true })
	}));
	const formReads = vi.fn();
	const addListener = (
		type: string,
		handler: Listener['handler'],
		options?: { signal?: AbortSignal }
	) => {
		listeners.push({ type, handler, signal: options?.signal });
	};
	const window: Record<string, unknown> = {
		location: new URL('https://example.invalid/agents?role=customer'),
		__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__: 1,
		addEventListener: addListener,
		dispatchEvent: () => true,
		setTimeout: (callback: () => void) => {
			timers.push(callback);
			return timers.length;
		},
		setInterval: () => 0
	};
	const document = {
		currentScript: null as Script | null,
		documentElement: { lang: 'en', hasAttribute: () => true },
		readyState: 'complete',
		addEventListener: addListener,
		querySelector: () => null,
		getElementById: () => null,
		querySelectorAll: (selector: string) => (selector.includes('script[') ? scripts : []),
		body: {
			className: '',
			classList: { add: () => {}, remove: () => {} },
			append: (script: Script) => {
				scripts.push(script);
				if (!script.src) {
					document.currentScript = script;
					try {
						runInNewContext(script.textContent, globals);
					} finally {
						document.currentScript = null;
					}
				}
			}
		},
		createElement: (name: string) => {
			if (name === 'template') {
				const template = {
					innerHTML: '',
					content: {
						querySelectorAll: () =>
							[...template.innerHTML.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map(
								(match) => ({
									attributes: [...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => ({
										name: x[1],
										value: x[2]
									})),
									textContent: match[2],
									src: match[1].match(/src="([^"]*)"/)?.[1] ?? ''
								})
							)
					}
				};
				return template;
			}
			const script: Script = {
				attributes: [],
				textContent: '',
				src: '',
				events: {},
				setAttribute: (name, value) => {
					script.attributes.push({ name, value });
					if (name === 'src') script.src = value;
				},
				addEventListener: (type, handler) => {
					script.events[type] = handler;
				},
				remove: () => {
					const index = scripts.indexOf(script);
					if (index >= 0) scripts.splice(index, 1);
				}
			};
			return script;
		}
	};
	const globals = {
		window,
		document,
		fetch,
		AbortController,
		URL,
		URLSearchParams,
		console,
		CustomEvent: class {
			constructor(
				readonly type: string,
				readonly options: unknown
			) {}
		},
		localStorage: {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => storage.set(key, value),
			removeItem: (key: string) => storage.delete(key)
		},
		FormData: class {
			values: [string, string][];
			constructor(form: FakeForm) {
				formReads();
				this.values = form.values;
			}
			entries() {
				return this.values;
			}
		},
		requestAnimationFrame: (callback: () => void) => callback()
	};
	const submit = async (kind: string) => {
		const form: FakeForm = {
			values: [
				['NewPassword', 'synthetic-not-real'],
				['email', 'demo@example.invalid']
			],
			className: kind,
			classList: { contains: (name) => name === kind },
			status: { textContent: '' },
			matches: (selector) => selector.split(',').some((value) => value.trim() === '.' + kind),
			hasAttribute: () => false,
			querySelector: () => form.status
		};
		const preventDefault = vi.fn();
		for (const listener of [...listeners])
			if (listener.type === 'submit' && !listener.signal?.aborted) {
				await listener.handler({ target: form, preventDefault });
			}
		return { form, preventDefault };
	};
	return { globals, window, document, fetch, formReads, listeners, scripts, timers, submit };
}

function emittedRuntime() {
	const html = renderAuxeroTemplate('sale-agents.html', {
		routePath: 'agents',
		searchParams: new URLSearchParams('role=customer')
	});
	if (!html) throw new Error('Missing maintained agents template');
	const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
		.map((x) => x[1])
		.find((x) => x.includes('__DAYNIGHT_RUNTIME__'));
	if (!script) throw new Error('Missing actual emitted runtime');
	return script;
}

function component(env: ReturnType<typeof environment>, html: string) {
	const source = readFileSync(
		new URL('../components/layout/AuxeroRuntimeScripts.svelte', import.meta.url),
		'utf8'
	);
	const ast = parse(source, { modern: true });
	const code = ast
		.instance!.content.body.filter((node) => node.type !== 'ImportDeclaration')
		.map((node) => {
			const position = node as { start?: number; end?: number };
			if (typeof position.start !== 'number' || typeof position.end !== 'number')
				throw new Error('Missing source position');
			return source.slice(position.start, position.end);
		})
		.join('\n');
	const effects: (() => (() => void) | void)[] = [];
	runInNewContext(stripTypeScriptTypes(code), {
		...env.globals,
		tick: async () => {},
		$props: () => ({ html, pageKey: 'test' }),
		$effect: (callback: () => (() => void) | void) => effects.push(callback)
	});
	return {
		mount: () => {
			const cleanup = effects[0]();
			return () => cleanup?.();
		}
	};
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
const startRuntime = async (env: ReturnType<typeof environment>) => {
	runInNewContext(emittedRuntime(), env.globals);
	await flush();
	env.fetch.mockClear();
};

describe('legacy runtime account navigation boundary', () => {
	it.each(['profile', 'password'])(
		'blocks %s payload/API access after a legacy page navigation',
		async (route) => {
			const env = environment();
			await startRuntime(env);
			env.window.location = new URL('https://example.invalid/account/' + route);
			const { form, preventDefault } = await env.submit('daynight-' + route + '-form');
			expect(preventDefault).toHaveBeenCalledOnce();
			expect(env.formReads).not.toHaveBeenCalled();
			expect(env.fetch).not.toHaveBeenCalled();
			expect(form.status.textContent).toBe(
				route === 'profile'
					? 'Demo only. Profile changes are not saved.'
					: 'Demo only. Passwords are not changed or stored.'
			);
		}
	);
	it('uses the current document locale rather than a previous route locale', async () => {
		const env = environment();
		await startRuntime(env);
		env.document.documentElement.lang = 'bg';
		const { form } = await env.submit('daynight-password-form');
		expect(form.status.textContent).toBe('Само демо. Паролите не се променят и не се съхраняват.');
		expect(env.formReads).not.toHaveBeenCalled();
	});
	it('preserves a valid legacy newsletter request', async () => {
		const env = environment();
		await startRuntime(env);
		await env.submit('daynight-newsletter-form');
		expect(env.formReads).toHaveBeenCalledOnce();
		expect(env.fetch).toHaveBeenCalledOnce();
		expect(env.fetch.mock.calls[0]?.[0]).toBe('/api/messages');
	});
});

describe('actual runtime component ownership lifecycle', () => {
	it('removes the legacy listener when navigating to account forms without a replacement runtime', async () => {
		const env = environment();
		const cleanup = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		await flush();
		const controller = env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ as AbortController;
		expect(controller.signal.aborted).toBe(false);
		env.window.location = new URL('https://example.invalid/account/profile');
		cleanup();
		expect(controller.signal.aborted).toBe(true);
		env.fetch.mockClear();
		for (const route of ['profile', 'password']) {
			env.window.location = new URL('https://example.invalid/account/' + route);
			const { form, preventDefault } = await env.submit('daynight-' + route + '-form');
			expect(form.status.textContent).toBe('');
			expect(preventDefault).not.toHaveBeenCalled();
		}
		expect(env.formReads).not.toHaveBeenCalled();
		expect(env.fetch).not.toHaveBeenCalled();
	});
	it('cleans the old navigation listener and never aborts a newer mount', async () => {
		const env = environment(),
			old = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		await flush();
		const oldController = env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ as AbortController;
		expect(oldController.signal.aborted).toBe(false);
		const next = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		await flush();
		const newController = env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ as AbortController;
		expect(newController).not.toBe(oldController);
		old();
		expect(oldController.signal.aborted).toBe(true);
		expect(newController.signal.aborted).toBe(false);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBe(newController);
		next();
		expect(newController.signal.aborted).toBe(true);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBeUndefined();
		env.fetch.mockClear();
		await env.submit('daynight-profile-form');
		expect(env.formReads).not.toHaveBeenCalled();
		expect(env.fetch).not.toHaveBeenCalled();
	});
	it('adopts and releases only the first current server-rendered runtime', async () => {
		const env = environment();
		runInNewContext(emittedRuntime(), env.globals);
		const controller = env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ as AbortController;
		env.window.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ = 0;
		env.window.__DAYNIGHT_BODY_SCRIPTS_LOADED__ = true;
		const cleanup = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		await flush();
		cleanup();
		expect(controller.signal.aborted).toBe(true);
	});
	it('cancels a replay before tick without installing a controller', async () => {
		const env = environment(),
			cleanup = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		cleanup();
		await flush();
		expect(env.scripts).toHaveLength(0);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBeUndefined();
	});
	it('does not adopt or abort another controller after a cancelled server-script wait', async () => {
		const env = environment();
		env.window.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ = 0;
		const cleanup = component(env, '<script>' + emittedRuntime() + '</script>').mount();
		await flush();
		expect(env.timers.length).toBeGreaterThan(0);
		cleanup();
		const newer = new AbortController();
		env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ = newer;
		env.timers.shift()!();
		await flush();
		expect(env.scripts).toHaveLength(0);
		expect(newer.signal.aborted).toBe(false);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBe(newer);
	});
	it('blocks a hydration-delayed runtime from its closed lexical owner', async () => {
		const env = environment();
		const cleanup = component(
			env,
			'<script>window.startLate = () => {' + emittedRuntime() + '};</script>'
		).mount();
		await flush();
		cleanup();
		const newer = new AbortController();
		env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ = newer;
		(env.window.startLate as () => void)();
		expect(newer.signal.aborted).toBe(false);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBe(newer);
	});
	it('does not continue queued scripts after unmount during an external script load', async () => {
		const env = environment(),
			cleanup = component(
				env,
				'<script src="/existing-widget.js"></script><script>' + emittedRuntime() + '</script>'
			).mount();
		await flush();
		expect(env.scripts).toHaveLength(1);
		cleanup();
		env.scripts[0].events.load();
		await flush();
		expect(env.scripts).toHaveLength(1);
		expect(env.window.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__).toBeUndefined();
	});
});
