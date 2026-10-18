<script lang="ts">
	import { tick } from 'svelte';

	type Props = {
		html: string;
		pageKey?: string;
	};

	type AuxeroWindow = Window & {
		__DAYNIGHT_AUXERO_BODY_LOADER_EXECUTED__?: number;
		__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__?: number;
		__DAYNIGHT_BODY_SCRIPTS_LOADED__?: boolean;
		__DAYNIGHT_RUNTIME__?: unknown;
		__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__?: AbortController;
	};
	type RuntimeOwner = { active: boolean; controller?: AbortController };

	let { html, pageKey = '' }: Props = $props();

	const replayAttribute = 'data-daynight-runtime-replay';
	const scriptTagPattern = /<script\b/i;
	let runVersion = 0;

	const wait = (milliseconds: number) =>
		new Promise((resolve) => {
			window.setTimeout(resolve, milliseconds);
		});

	const hasUninitializedAuxeroWidgets = () =>
		Boolean(
			document.querySelector(
				'.swiper-container:not(.swiper-container-initialized):not(.daynight-native-scroll)'
			)
		);

	const parseScriptTags = (source: string) => {
		const template = document.createElement('template');
		template.innerHTML = source;

		return Array.from(template.content.querySelectorAll('script'));
	};

	const releaseRuntimeOwner = (owner: RuntimeOwner) => {
		owner.active = false;
		owner.controller?.abort();
		const auxeroWindow = window as AuxeroWindow;
		if (auxeroWindow.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__ === owner.controller) {
			delete auxeroWindow.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__;
		}
	};

	const executeScriptTag = (sourceScript: HTMLScriptElement, owner: RuntimeOwner) =>
		new Promise<void>((resolve) => {
			if (!owner.active) return resolve();
			const script = document.createElement('script') as HTMLScriptElement & {
				__DAYNIGHT_RUNTIME_OWNER__?: RuntimeOwner;
			};

			for (const attribute of Array.from(sourceScript.attributes)) {
				script.setAttribute(attribute.name, attribute.value);
			}

			script.setAttribute(replayAttribute, 'true');

			if (sourceScript.textContent) {
				// The emitted runtime may start after hydration. Retain this mount's
				// lease lexically so a cancelled replay cannot install listeners later.
				script.__DAYNIGHT_RUNTIME_OWNER__ = owner;
				script.textContent = sourceScript.textContent.includes('__DAYNIGHT_RUNTIME__')
					? `{ const daynightRuntimeOwner = document.currentScript.__DAYNIGHT_RUNTIME_OWNER__;\n${sourceScript.textContent}\n}`
					: sourceScript.textContent;
			}

			if (sourceScript.src) {
				script.addEventListener('load', () => resolve(), { once: true });
				script.addEventListener('error', () => resolve(), { once: true });
			}

			document.body.append(script);

			if (!sourceScript.src) {
				resolve();
			}
		});

	const executeScriptTags = async (source: string, owner: RuntimeOwner) => {
		const scripts = parseScriptTags(source);

		if (!owner.active || !scripts.length) return;

		for (const script of document.querySelectorAll(`script[${replayAttribute}="true"]`)) {
			script.remove();
		}

		for (const script of scripts) {
			if (!owner.active) return;
			await executeScriptTag(script, owner);
		}
	};

	const waitForServerRenderedScripts = async (
		isFirstAuxeroRuntimeMount: boolean,
		sourceIncludesRuntime: boolean,
		owner: RuntimeOwner
	) => {
		if (!isFirstAuxeroRuntimeMount) return false;

		let sawServerManagedScripts = false;
		let loadedButUninitializedAttempts = 0;

		for (let attempt = 0; attempt < 30; attempt += 1) {
			if (!owner.active) return false;
			const auxeroWindow = window as AuxeroWindow;
			const bodyScriptsLoaded = Boolean(auxeroWindow.__DAYNIGHT_BODY_SCRIPTS_LOADED__);
			const runtimeReady = Boolean(auxeroWindow.__DAYNIGHT_RUNTIME__);
			const widgetsNeedReplay = hasUninitializedAuxeroWidgets();
			sawServerManagedScripts =
				sawServerManagedScripts ||
				runtimeReady ||
				Boolean(auxeroWindow.__DAYNIGHT_AUXERO_BODY_LOADER_EXECUTED__) ||
				bodyScriptsLoaded;

			if (sourceIncludesRuntime && runtimeReady) {
				return true;
			}

			if (
				!sourceIncludesRuntime &&
				sawServerManagedScripts &&
				!widgetsNeedReplay &&
				bodyScriptsLoaded
			) {
				return true;
			}

			if (sawServerManagedScripts && bodyScriptsLoaded && widgetsNeedReplay) {
				loadedButUninitializedAttempts += 1;

				if (loadedButUninitializedAttempts >= 2) {
					return false;
				}
			}

			if (!sawServerManagedScripts && attempt >= 14) {
				return false;
			}

			await wait(100);
		}

		return false;
	};

	const runScriptsWhenNeeded = async (source: string, version: number, owner: RuntimeOwner) => {
		if (!scriptTagPattern.test(source)) return;

		await tick();
		if (!owner.active || version !== runVersion) return;

		const auxeroWindow = window as AuxeroWindow;
		const mountCount = auxeroWindow.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ ?? 0;
		const isFirstAuxeroRuntimeMount = mountCount === 0;
		const sourceIncludesRuntime = source.includes('__DAYNIGHT_RUNTIME__');
		auxeroWindow.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ = mountCount + 1;
		if (isFirstAuxeroRuntimeMount && sourceIncludesRuntime) {
			owner.controller = auxeroWindow.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__;
		}

		const serverScriptsHandledThisMount = await waitForServerRenderedScripts(
			isFirstAuxeroRuntimeMount,
			sourceIncludesRuntime,
			owner
		);
		if (!owner.active || version !== runVersion) return;
		if (isFirstAuxeroRuntimeMount && sourceIncludesRuntime && serverScriptsHandledThisMount) {
			owner.controller ??= auxeroWindow.__DAYNIGHT_RUNTIME_ABORT_CONTROLLER__;
		}

		if (serverScriptsHandledThisMount && !hasUninitializedAuxeroWidgets()) return;

		await executeScriptTags(source, owner);
	};

	$effect(() => {
		const source = html;
		void pageKey;
		const version = ++runVersion;
		const owner: RuntimeOwner = { active: true };
		void runScriptsWhenNeeded(source, version, owner);
		return () => {
			runVersion += 1;
			releaseRuntimeOwner(owner);
		};
	});
</script>
