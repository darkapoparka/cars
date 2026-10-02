<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { assetHref } from '$lib/utils/assets';
	import { optionLabel } from '$lib/i18n/options';
	import { mobileServiceCopy } from '$lib/content/service-mobile';
	import {
		emptyImportCriteria,
		importCountries,
		importCriteriaUrl,
		type ImportCriteria
	} from '$lib/data/import-criteria';
	import type { ImportBrowseData } from '$lib/server/import-browse';
	import MobileSheet from '$lib/components/common/MobileSheet.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';

	let {
		browse,
		criteria,
		onrequest
	}: {
		browse: ImportBrowseData;
		criteria: ImportCriteria;
		onrequest: () => void;
	} = $props();
	type Field = 'origin' | 'bodyType' | 'make' | 'model';
	const locale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const copy = $derived(mobileServiceCopy[locale]);
	let open = $state(false);
	let field = $state<Field>('origin');
	let draft = $state('');
	let query = $state('');
	let pendingHref = $state<string | null>(null);
	const id = $props.id();
	const labels = $derived({
		origin: copy.country,
		bodyType: copy.type,
		make: copy.make,
		model: copy.model
	});
	const anyLabels = $derived({
		origin: copy.anyCountry,
		bodyType: copy.anyType,
		make: copy.anyMake,
		model: copy.anyModel
	});
	const helps = $derived({
		origin: copy.countryHelp,
		bodyType: copy.typeHelp,
		make: copy.makeHelp,
		model: copy.modelHelp
	});
	const country = $derived(
		importCountries.find((value) => value.value === criteria.origin) ?? importCountries[0]
	);
	const pills = $derived([
		{
			key: 'origin' as const,
			text: criteria.origin ? optionLabel(country.label, locale) : copy.country
		},
		{
			key: 'bodyType' as const,
			text: browse.types.find((value) => value.value === criteria.bodyType)?.label ?? copy.type
		},
		{ key: 'make' as const, text: criteria.make || copy.make },
		{ key: 'model' as const, text: criteria.model || copy.model }
	]);
	const choices = $derived(
		field === 'origin'
			? importCountries.map((value) => ({
					value: value.value,
					label: value.value ? optionLabel(value.label, locale) : copy.anyCountry,
					flag: value.flagSrc
				}))
			: [
					{ value: '', label: anyLabels[field], flag: '' },
					...(field === 'bodyType'
						? browse.types.map((value) => ({ ...value, flag: '' }))
						: (field === 'make' ? browse.makes : browse.models).map((value) => ({
								value,
								label: value,
								flag: ''
							})))
				]
	);
	const visibleChoices = $derived(
		choices.filter(
			(value) => !value.value || value.label.toLowerCase().includes(query.toLowerCase())
		)
	);
	const hasPreferences = $derived(
		Boolean(criteria.origin || criteria.bodyType || criteria.make || criteria.model)
	);

	function openField(value: Field) {
		field = value;
		draft = criteria[value];
		query = '';
		open = true;
	}
	function apply() {
		const next = { ...criteria, [field]: draft.trim() };
		if (field === 'make' && draft.trim() !== criteria.make) next.model = '';
		pendingHref = importCriteriaUrl(page.url, next);
		open = false;
	}
	function finishClose() {
		if (!pendingHref) return;
		const href = pendingHref;
		pendingHref = null;
		// On a direct load the sheet can receive popstate before the router.
		// Let the router restore its shallow history entry before navigating.
		requestAnimationFrame(() => void goto(href, { noScroll: true, keepFocus: true }));
	}
</script>

<section class="import-browse" aria-label={copy.preferences}>
	<div class="import-browse__pills">
		{#each pills as pill (pill.key)}
			<button
				type="button"
				class:active={Boolean(criteria[pill.key])}
				aria-label={criteria[pill.key] ? `${labels[pill.key]}: ${pill.text}` : labels[pill.key]}
				aria-haspopup="dialog"
				aria-expanded={open && field === pill.key}
				onclick={() => openField(pill.key)}
			>
				{#if pill.key === 'origin'}<img
						src={assetHref(country.flagSrc)}
						width="20"
						height="16"
						alt=""
					/>{/if}
				<span>{pill.text}</span><ChevronDown size={15} aria-hidden="true" />
			</button>
		{/each}
	</div>
	{#if hasPreferences}
		<div class="import-browse__request">
			<button type="button" onclick={onrequest}
				>{copy.find}<ArrowRight size={18} aria-hidden="true" /></button
			>
			<a href={importCriteriaUrl(page.url, emptyImportCriteria)}>{copy.reset}</a>
		</div>
	{/if}
	{#if !browse.count}
		<div class="import-browse__empty">
			<h2>{copy.noMatches}</h2>
			<p>{copy.noMatchesHelp}</p>
			{#if !hasPreferences}<button type="button" onclick={onrequest}
					>{copy.find}<ArrowRight size={18} aria-hidden="true" /></button
				>{/if}
		</div>
	{/if}
</section>

<MobileSheet
	bind:open
	title={labels[field]}
	description={helps[field]}
	onclose={finishClose}
	contentClass="import-preferences-sheet"
>
	<form
		class="import-preferences"
		onsubmit={(event) => {
			event.preventDefault();
			apply();
		}}
	>
		{#if field === 'make' || field === 'model'}
			<label for={`import-preference-${id}`}>{labels[field]}</label>
			<input
				id={`import-preference-${id}`}
				type="search"
				maxlength={field === 'make' ? 60 : 80}
				placeholder={labels[field]}
				value={draft}
				autocomplete="off"
				oninput={(event) => {
					draft = event.currentTarget.value;
					query = draft;
				}}
			/>
		{/if}
		<div
			class="import-preferences__choices"
			class:import-preferences__choices--countries={field === 'origin'}
			role="group"
			aria-label={labels[field]}
		>
			{#each visibleChoices as choice (choice.value)}
				<button
					type="button"
					class:active={draft === choice.value}
					aria-pressed={draft === choice.value}
					onclick={() => {
						draft = choice.value;
						query = '';
					}}
				>
					{#if choice.flag}<img src={assetHref(choice.flag)} width="24" height="18" alt="" />{/if}
					<span>{choice.label}</span>{#if draft === choice.value}<Check
							size={17}
							aria-hidden="true"
						/>{/if}
				</button>
			{/each}
		</div>
	</form>
	{#snippet footer()}
		<div class="import-preferences__actions">
			<button
				type="button"
				onclick={() => {
					draft = '';
					query = '';
				}}>{copy.reset}</button
			>
			<button type="button" onclick={apply}
				>{copy.apply}<ArrowRight size={18} aria-hidden="true" /></button
			>
		</div>
	{/snippet}
</MobileSheet>

<style>
	.import-browse {
		display: grid;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-3);
	}
	.import-browse__pills {
		display: flex;
		overflow-x: auto;
		scrollbar-width: none;
		gap: var(--bc-space-2);
		padding: 2px 0;
	}
	.import-browse__pills::-webkit-scrollbar {
		display: none;
	}
	.import-browse__pills button {
		display: flex;
		flex: 0 0 auto;
		min-width: 0;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		max-width: 220px;
		padding: 0 12px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-filter)/var(--bc-leading-filter)
			var(--bc-font-body);
		cursor: pointer;
	}
	.import-browse__pills button span {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.import-browse__pills button :global(svg),
	.import-browse__pills button img {
		flex: 0 0 auto;
	}
	.import-browse__pills button.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.import-browse__request {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--bc-space-3);
	}
	.import-browse__request button,
	.import-browse__empty button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		min-height: 44px;
		padding: 0 14px;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: var(--bc-accent);
		color: white;
		font-family: var(--bc-font-body);
		font-size: var(--bc-mobile-body);
		cursor: pointer;
	}
	.import-browse a {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-label);
	}
	.import-browse__empty {
		display: grid;
		gap: var(--bc-space-2);
		padding: var(--bc-space-4);
		border-radius: var(--bc-radius-card);
		background: var(--bc-white);
	}
	.import-browse__empty h2 {
		margin: 0;
		font-size: var(--bc-mobile-card-title);
		line-height: var(--bc-mobile-card-title-leading);
	}
	.import-browse__empty p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
	}
	.import-preferences {
		display: grid;
		gap: var(--bc-space-3);
	}
	.import-preferences label {
		font-size: var(--bc-mobile-label);
	}
	.import-preferences input {
		min-height: 48px;
		width: 100%;
		min-width: 0;
		padding: 0 14px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		font-family: var(--bc-font-body);
		font-size: 18px;
	}
	.import-preferences__choices {
		display: grid;
		gap: var(--bc-space-2);
	}
	.import-preferences__choices--countries {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.import-preferences__choices button {
		display: flex;
		align-items: center;
		gap: var(--bc-space-2);
		min-height: 48px;
		padding: 10px 12px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		text-align: left;
		font-family: var(--bc-font-body);
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		cursor: pointer;
	}
	.import-preferences__choices button span {
		flex: 1;
		min-width: 0;
	}
	.import-preferences__choices button img,
	.import-preferences__choices button :global(svg) {
		flex-shrink: 0;
	}
	.import-preferences__choices button.active {
		background: var(--bc-white);
		border-color: var(--bc-accent);
		color: var(--bc-ink);
	}
	.import-preferences__actions {
		display: grid;
		grid-template-columns: minmax(80px, 1fr) 2fr;
		gap: var(--bc-space-3);
	}
	.import-preferences__actions button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--bc-space-2);
		min-height: 48px;
		padding: 0 12px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
		font-size: var(--bc-mobile-body);
		cursor: pointer;
	}
	.import-preferences__actions button:last-child {
		border-color: transparent;
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	button:focus-visible,
	a:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.import-browse__pills button:focus-visible {
		outline-offset: -3px;
	}
</style>
