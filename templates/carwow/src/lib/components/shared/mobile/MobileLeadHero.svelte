<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { onMount } from 'svelte';
	import '$lib/styles/mobile-hero-pill.css';
	import '$lib/styles/mobile-entry-hero.css';
	import { ArrowRight, ChevronRight, CircleHelp, Link2, ScanLine } from '@lucide/svelte';
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';
	let {
		kind,
		title,
		value = $bindable(''),
		vinValue = $bindable(''),
		mode = $bindable<'primary' | 'secondary'>('primary'),
		onSubmit,
		onManual,
		onInfo
	}: {
		kind: 'sell' | 'import';
		title: string;
		value?: string;
		vinValue?: string;
		mode?: 'primary' | 'secondary';
		onSubmit: () => void;
		onManual: () => void;
		onInfo: () => void;
	} = $props();
	let interactive = $state(false);
	let inputError = $state('');
	onMount(() => {
		interactive = true;
	});
	const labels = $derived(kind === 'sell' ? ['VIN / Номер', 'Данни'] : ['Линк', 'VIN']);
	const isVin = $derived(kind === 'import' && mode === 'secondary');
	const inputLabel = $derived(
		kind === 'sell' ? 'Регистрационен номер или VIN' : isVin ? 'VIN' : 'Линк към обява'
	);
	const id = $props.id();
	function selectMode(next: 'primary' | 'secondary') {
		mode = next;
		inputError = '';
	}
	function tabKey(event: KeyboardEvent, index: number) {
		let next: number;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = 1;
		else return;
		event.preventDefault();
		selectMode(next === 0 ? 'primary' : 'secondary');
		(event.currentTarget as HTMLElement).parentElement
			?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
			[next]?.focus();
	}
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		inputError = '';
		if (kind === 'import') {
			if (isVin) {
				vinValue = vinValue.trim().toUpperCase();
				if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vinValue))
					inputError = 'Въведи VIN от 17 букви и цифри (без I, O и Q).';
			} else {
				value = value.trim();
				try {
					const url = new URL(value);
					if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
				} catch {
					inputError = 'Постави пълен линк към обява, започващ с https://.';
				}
			}
		}
		if (inputError) {
			(event.currentTarget as HTMLFormElement).querySelector('input')?.focus();
			return;
		}
		onSubmit();
	}
</script>

<header class="mobile-lead-hero mobile-entry-hero">
	<MobileHeroBar />
	<h1>{title}</h1>
	<div
		class="mobile-lead-hero__tabs mobile-entry-hero__tabs"
		role="tablist"
		aria-label={kind === 'sell' ? i18n.t('copy.1450138aa03a') : i18n.t('copy.33e4ad07a6c6')}
	>
		{#each labels as label, index (label)}
			<button
				type="button"
				role="tab"
				id={id + '-tab-' + index}
				aria-controls={id + '-panel'}
				aria-selected={mode === (index === 0 ? 'primary' : 'secondary')}
				tabindex={mode === (index === 0 ? 'primary' : 'secondary') ? 0 : -1}
				onclick={() => selectMode(index === 0 ? 'primary' : 'secondary')}
				onkeydown={(event) => tabKey(event, index)}>{i18n.text(label)}</button
			>
		{/each}
	</div>
	<div
		class="mobile-lead-hero__entry"
		role="tabpanel"
		id={id + '-panel'}
		aria-labelledby={id + '-tab-' + (mode === 'primary' ? 0 : 1)}
	>
		{#if kind === 'sell' && mode === 'secondary'}
			<button
				class="mobile-lead-hero__manual mobile-entry-hero__search"
				type="button"
				disabled={!interactive}
				aria-label={i18n.t('copy.c1a5ff7001ab')}
				onclick={onManual}
			>
				<span>{i18n.t('copy.5601767a86c8')}</span><span
					class="mobile-lead-hero__go mobile-entry-hero__go"
					><ArrowRight size={21} aria-hidden="true" /></span
				>
			</button>
		{:else if kind === 'import' && !isVin}
			<button
				class="mobile-lead-hero__search mobile-lead-hero__link mobile-entry-hero__search"
				type="button"
				disabled={!interactive}
				aria-label={i18n.t('copy.fbee9a117fb4')}
				aria-haspopup="dialog"
				onclick={onManual}
			>
				<span class="mobile-lead-hero__input-icon" aria-hidden="true"><Link2 size={21} /></span>
				<span class="mobile-lead-hero__link-label" class:is-filled={Boolean(value.trim())}
					>{value.trim() || i18n.t('copy.fbee9a117fb4')}</span
				>
				<span class="mobile-lead-hero__go mobile-entry-hero__go" aria-hidden="true"
					><ArrowRight size={21} /></span
				>
			</button>
		{:else}
			<form
				class="mobile-lead-hero__search mobile-entry-hero__search"
				onsubmit={handleSubmit}
				novalidate
			>
				<span class="mobile-lead-hero__input-icon" aria-hidden="true">
					{#if kind === 'sell' || isVin}<ScanLine size={21} />{:else}<Link2 size={21} />{/if}
				</span>
				<input
					{@attach i18n.validation}
					disabled={!interactive}
					value={isVin ? vinValue : value}
					oninput={(event) => {
						if (isVin) vinValue = event.currentTarget.value;
						else value = event.currentTarget.value;
						inputError = '';
					}}
					type="text"
					inputmode={kind === 'import' && !isVin ? 'url' : 'text'}
					enterkeyhint="go"
					autocomplete="off"
					placeholder={kind === 'sell'
						? i18n.t('copy.bdd1fdd92f67')
						: isVin
							? i18n.t('copy.59e2e63d9ecd')
							: i18n.t('copy.fbee9a117fb4')}
					aria-label={i18n.text(inputLabel)}
					aria-invalid={inputError ? true : undefined}
					aria-describedby={inputError ? id + '-error' : undefined}
				/>
				<button
					class="mobile-lead-hero__go mobile-entry-hero__go"
					disabled={!interactive}
					type="submit"
					aria-label={i18n.t('copy.ffe5cca7d0b3')}
					><ArrowRight size={21} aria-hidden="true" /></button
				>
			</form>
		{/if}
		{#if inputError}<p class="mobile-lead-hero__error" id={id + '-error'} role="alert">
				{i18n.text(inputError)}
			</p>{/if}
	</div>
	<div class="mobile-lead-hero__help">
		{#if kind === 'sell'}
			<button
				class="mobile-hero-pill"
				type="button"
				disabled={!interactive}
				aria-haspopup="dialog"
				onclick={(event) => {
					event.currentTarget.focus({ preventScroll: true });
					onSubmit();
				}}
				><span>{i18n.t('copy.d915896778d0')}</span><ChevronRight
					size={14}
					aria-hidden="true"
				/></button
			>
		{:else}
			<button
				class="mobile-hero-pill"
				type="button"
				disabled={!interactive}
				aria-haspopup="dialog"
				onclick={(event) => {
					event.currentTarget.focus({ preventScroll: true });
					onInfo();
				}}
				><CircleHelp size={14} aria-hidden="true" /><span>{i18n.t('copy.4dbb828642ef')}</span
				></button
			>
		{/if}
	</div>
</header>

<style>
	h1 {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.mobile-lead-hero__search {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) var(--sa-mobile-pill-h);
		align-items: center;
		gap: 9px;
		padding: 4px 4px 4px 15px;
	}
	.mobile-lead-hero__input-icon {
		display: grid;
		place-items: center;
		color: #65717e;
	}
	.mobile-lead-hero__search input {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-mobile-type-input) / 1.2 var(--sa-font);
		outline: 0;
		padding: 0;
	}
	.mobile-lead-hero__search input::placeholder {
		color: #66717f;
		opacity: 1;
	}
	.mobile-lead-hero__link {
		width: 100%;
		border: 0;
		font-family: var(--sa-font);
		text-align: left;
		cursor: pointer;
	}
	.mobile-lead-hero__link-label {
		overflow: hidden;
		min-width: 0;
		color: #66717f;
		font-size: var(--sa-mobile-type-input);
		font-weight: var(--sa-weight-medium);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mobile-lead-hero__link-label.is-filled {
		color: var(--sa-ink);
	}
	.mobile-lead-hero__go {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border: 0;
		border-radius: 50%;
		color: #fff;
		padding: 0;
		cursor: pointer;
	}
	.mobile-lead-hero__go :global(svg),
	.mobile-lead-hero__go :global(svg *) {
		stroke: #fff !important;
	}
	.mobile-lead-hero__manual {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		color: #66717f;
		padding: 4px 4px 4px 17px;
		font: var(--sa-weight-medium) var(--sa-text-base) / 1.2 var(--sa-font);
		text-align: left;
		cursor: pointer;
	}
	.mobile-lead-hero__manual > span:first-child {
		flex: 1;
	}
	.mobile-lead-hero__help {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
	}
	.mobile-lead-hero__error {
		grid-column: 1 / -1;
		margin: 12px 0 0;
		font-size: var(--sa-text-caption);
		line-height: 1.4;
		color: #fff;
	}
	button:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
	.mobile-lead-hero__tabs button:focus-visible {
		outline-offset: -3px;
	}
	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}
</style>
