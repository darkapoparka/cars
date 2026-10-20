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
	};

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

	const executeScriptTag = (sourceScript: HTMLScriptElement) =>
		new Promise<void>((resolve) => {
			const script = document.createElement('script');

			for (const attribute of Array.from(sourceScript.attributes)) {
				script.setAttribute(attribute.name, attribute.value);
			}

			script.setAttribute(replayAttribute, 'true');

			if (sourceScript.textContent) {
				script.textContent = sourceScript.textContent;
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

	const executeScriptTags = async (source: string) => {
		const scripts = parseScriptTags(source);

		if (!scripts.length) return;

		for (const script of document.querySelectorAll(`script[${replayAttribute}="true"]`)) {
			script.remove();
		}

		for (const script of scripts) {
			await executeScriptTag(script);
		}
	};

	const waitForServerRenderedScripts = async (
		isFirstAuxeroRuntimeMount: boolean,
		sourceIncludesRuntime: boolean
	) => {
		if (!isFirstAuxeroRuntimeMount) return false;

		let sawServerManagedScripts = false;
		let loadedButUninitializedAttempts = 0;

		for (let attempt = 0; attempt < 30; attempt += 1) {
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

	const runScriptsWhenNeeded = async (source: string, version: number) => {
		if (!scriptTagPattern.test(source)) return;

		await tick();
		if (version !== runVersion) return;

		const auxeroWindow = window as AuxeroWindow;
		const mountCount = auxeroWindow.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ ?? 0;
		const isFirstAuxeroRuntimeMount = mountCount === 0;
		const sourceIncludesRuntime = source.includes('__DAYNIGHT_RUNTIME__');
		auxeroWindow.__DAYNIGHT_AUXERO_RUNTIME_MOUNTS__ = mountCount + 1;

		const serverScriptsHandledThisMount = await waitForServerRenderedScripts(
			isFirstAuxeroRuntimeMount,
			sourceIncludesRuntime
		);

		if (serverScriptsHandledThisMount && !hasUninitializedAuxeroWidgets()) return;

		await executeScriptTags(source);
	};

	$effect(() => {
		const source = html;
		void pageKey;
		const version = ++runVersion;
		void runScriptsWhenNeeded(source, version);
	});
</script>
