<script lang="ts">
	import { base } from '$app/paths';
	import { containDialogTab } from './focus';
	import { onMount, tick } from 'svelte';
	import { countries, isLocale, safeReturnPath, localeContract, type Locale } from './core';
	import { getI18n } from './context';
	const i18n = getI18n();
	let dialog: HTMLDialogElement;
	let locale = $state<Locale>(i18n.locale);
	let country = $state(i18n.state.country);
	let busy = $state(false);
	let ready = $state(false);
	let error = $state(false);
	let firstVisit = $state(false);
	let opener: HTMLElement | null = null;
	let requestVersion = 0;
	let pendingRequest: AbortController | null = null;
	function invalidateRequest() {
		requestVersion += 1;
		pendingRequest?.abort();
		pendingRequest = null;
		busy = false;
	}
	const regionNames = $derived(new Intl.DisplayNames([i18n.locale], { type: 'region' }));
	const regionOptions = $derived([
		i18n.state.suggestedCountry,
		...countries
			.filter((code) => code !== i18n.state.suggestedCountry)
			.sort((a, b) => (regionNames.of(a) ?? a).localeCompare(regionNames.of(b) ?? b, i18n.locale))
	]);
	function locallyDismissed() {
		try {
			return localStorage.getItem('cars.prompt.' + localeContract.promptVersion) === 'dismissed';
		} catch {
			return false;
		}
	}
	function rememberDismissal() {
		try {
			localStorage.setItem('cars.prompt.' + localeContract.promptVersion, 'dismissed');
		} catch {
			/* Preferences can still travel in the explicit URL. */
		}
	}
	async function open(first: boolean, target?: HTMLElement) {
		invalidateRequest();
		firstVisit = first;
		error = false;
		locale = i18n.locale;
		country = i18n.state.country;
		opener =
			target ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
		const version = requestVersion;
		await tick();
		if (version === requestVersion && !dialog.open) dialog.showModal();
	}
	function close() {
		dialog.close();
		if (opener?.isConnected && opener !== document.body && opener.getClientRects().length)
			opener.focus({ preventScroll: true });
		else i18n.restoreFocus();
	}
	async function submit(action: 'save' | 'dismiss') {
		if (busy && action === 'save') return;
		// The latest user intent owns UI state. Closing never waits for the network,
		// and an earlier save response must not navigate after dismissal/reopening.
		invalidateRequest();
		const version = requestVersion;
		if (action === 'dismiss') {
			rememberDismissal();
			close();
		}
		busy = true;
		error = false;
		const controller = new AbortController();
		pendingRequest = controller;
		const timeout = setTimeout(() => controller.abort(), 8000);
		try {
			const response = await fetch(base + '/api/preferences', {
				method: 'POST',
				credentials: 'same-origin',
				signal: controller.signal,
				keepalive: action === 'dismiss',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action,
					locale,
					country,
					returnTo: location.pathname + location.search + location.hash
				})
			});
			if (!response.ok) throw new Error('Preference request rejected');
			const result: unknown = await response.json();
			const destination =
				result && typeof result === 'object' && 'destination' in result
					? safeReturnPath(result.destination, location.origin)
					: null;
			if (!destination) throw new Error('Invalid preference destination');
			if (action === 'save' && version === requestVersion) {
				rememberDismissal();
				const target = new URL(destination, location.origin);
				if (target.pathname === location.pathname && target.search === location.search) {
					if (target.hash !== location.hash) history.replaceState(history.state, '', target.href);
					location.reload();
				} else location.assign(target.href);
			}
		} catch {
			if (action === 'save' && version === requestVersion) error = true;
		} finally {
			clearTimeout(timeout);
			if (version === requestVersion) {
				pendingRequest = null;
				busy = false;
			}
		}
	}
	onMount(() => {
		const handler = (event: Event) =>
			void open(false, (event as CustomEvent<{ opener?: HTMLElement }>).detail?.opener);
		window.addEventListener('cars:locale-open', handler);
		ready = true;
		if (!i18n.state.promptDismissed && !locallyDismissed()) void open(true);
		return () => {
			window.removeEventListener('cars:locale-open', handler);
			invalidateRequest();
		};
	});
</script>

<dialog
	onkeydown={(event) => containDialogTab(event, dialog)}
	bind:this={dialog}
	class="cars-locale-dialog"
	data-locale-dialog
	data-locale-ready={ready}
	aria-labelledby="cars-locale-title"
	aria-describedby="cars-locale-description"
	oncancel={(event) => {
		event.preventDefault();
		void submit('dismiss');
	}}
>
	<button
		type="button"
		class="cars-locale-close"
		aria-label={i18n.t('close')}
		onclick={() => submit('dismiss')}>×</button
	>
	<p class="cars-locale-eyebrow">{localeContract.dealerName}</p>
	<h2 id="cars-locale-title">{i18n.t(firstVisit ? 'welcome' : 'title')}</h2>
	<p id="cars-locale-description">{i18n.t('description')}</p>
	<p class="cars-locale-suggestion">
		{i18n.t('suggestion', {
			country: regionNames.of(i18n.state.suggestedCountry) ?? i18n.state.suggestedCountry
		})}
	</p>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			void submit('save');
		}}
		aria-busy={busy}
	>
		<label for="cars-locale-country">{i18n.t('country')}</label>
		<select id="cars-locale-country" name="country" bind:value={country} required>
			{#each regionOptions as code (code)}<option value={code}
					>{regionNames.of(code) ?? code}{code === i18n.state.suggestedCountry
						? ` — ${i18n.t('suggested')}`
						: ''}</option
				>{/each}
		</select>
		<label for="cars-locale-language">{i18n.t('language')}</label>
		<select id="cars-locale-language" name="locale" bind:value={locale} required>
			<option value="en" lang="en">English</option><option value="bg" lang="bg">Български</option>
		</select>
		<p class="cars-locale-facts">{i18n.t('facts')}</p>
		<p class="cars-locale-unavailable">{i18n.t('available')}</p>
		{#if error}<p role="alert" class="cars-locale-error">{i18n.t('error')}</p>{/if}
		<div class="cars-locale-actions">
			<button type="button" onclick={() => submit('dismiss')}>{i18n.t('dismiss')}</button>
			<button type="submit" disabled={busy || !isLocale(locale)}
				>{i18n.t(busy ? 'saving' : 'save')}</button
			>
		</div>
	</form>
</dialog>

<style>
	.cars-locale-dialog {
		box-sizing: border-box;
		width: min(480px, calc(100vw - 24px));
		max-width: calc(100vw - 24px);
		max-height: calc(100dvh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
		overflow-y: auto;
		margin: auto;
		padding: 28px 24px 24px;
		border: 1px solid #dce1e6;
		border-radius: 20px;
		background: #fff;
		color: #16202c;
		font: var(--bc-weight-body) var(--bc-text-body)/var(--bc-leading-body) var(--bc-font-body);
		box-shadow: 0 24px 80px #0005;
		overscroll-behavior: contain;
		z-index: 2147483000;
	}
	.cars-locale-dialog::backdrop {
		background: #10202b99;
		backdrop-filter: blur(3px);
	}
	.cars-locale-dialog h2 {
		margin: 8px 32px 12px 0;
		font-size: var(--bc-text-h3);
		line-height: 1.2;
		font-weight: var(--bc-weight-heading);
	}
	.cars-locale-dialog p {
		font-size: inherit;
		line-height: inherit;
		margin: 12px 0;
	}
	.cars-locale-dialog .cars-locale-eyebrow {
		font-size: var(--bc-text-label);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin: 0;
		color: #647180;
	}
	.cars-locale-close {
		position: absolute;
		top: 12px;
		right: 12px;
		min-height: 44px;
		min-width: 44px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		font-size: var(--bc-text-h3);
		line-height: 1;
		cursor: pointer;
	}
	.cars-locale-dialog form {
		display: grid;
		gap: 8px;
	}
	.cars-locale-dialog label {
		font-size: var(--bc-text-label);
		font-weight: var(--bc-weight-heading);
		margin-top: 8px;
	}
	.cars-locale-dialog select {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 48px;
		padding: 10px 12px;
		border: 1px solid #c5cdd6;
		border-radius: 10px;
		background: #fff;
		color: #16202c;
		font: inherit;
		font-size: inherit;
	}
	.cars-locale-suggestion {
		padding: 10px 12px;
		border-radius: 10px;
		background: #f2f5f8;
	}
	.cars-locale-dialog .cars-locale-facts {
		margin: 10px 0 0;
	}
	.cars-locale-dialog .cars-locale-unavailable {
		margin: 0;
		color: #647180;
		font-size: inherit;
	}
	.cars-locale-error {
		color: #a31019;
	}
	.cars-locale-actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 12px;
	}
	.cars-locale-actions button {
		flex: 1;
		min-width: 100px;
		min-height: 48px;
		padding: 10px 12px;
		border: 1px solid #c5cdd6;
		border-radius: 10px;
		background: #fff;
		color: #16202c;
		font: inherit;
		font-size: inherit;
		line-height: inherit;
		font-weight: inherit;
		cursor: pointer;
	}
	.cars-locale-actions button[type='submit'] {
		background: #142331;
		color: #fff;
		border-color: #142331;
	}
	.cars-locale-actions button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.cars-locale-dialog :is(button, select):focus-visible {
		outline: 3px solid #337aaa;
		outline-offset: 3px;
	}
	@media (max-width: 390px) {
		.cars-locale-dialog {
			padding: 24px 16px 16px;
			border-radius: 16px;
		}
		.cars-locale-dialog h2 {
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
		}
		.cars-locale-dialog p {
			font-size: inherit;
		}
	}
	@media (max-width: 639px) {
		.cars-locale-dialog {
			position: fixed;
			inset: auto 0 0;
			width: 100%;
			max-width: 100%;
			margin: 0;
			max-height: calc(100dvh - 16px - env(safe-area-inset-top));
			border-radius: 20px 20px 0 0;
			padding-bottom: max(20px, env(safe-area-inset-bottom));
		}
	}
</style>
