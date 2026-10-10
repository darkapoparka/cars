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
	import MobileChoiceRow from '$lib/components/common/MobileChoiceRow.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Search from '@lucide/svelte/icons/search';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';

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
	let overview = $state(true);
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
	const country = $derived(
		importCountries.find((market) => market.value === criteria.origin) ?? importCountries[0]
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
		overview = false;
		field = value;
		draft = criteria[value];
		query = '';
		open = true;
	}
	function openFilters() {
		overview = true;
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
	<nav class="import-browse__countries mobile-quick-rail" aria-label={copy.countryHelp}>
		<button
			type="button"
			class="mobile-quick-pill mobile-quick-pill--icon"
			aria-label={copy.filters}
			aria-haspopup="dialog"
			aria-expanded={open}
			onclick={openFilters}
		>
			<SlidersHorizontal size={18} aria-hidden="true" />
		</button>
		{#each importCountries as market (market.value)}
			<a
				class="mobile-quick-pill"
				href={importCriteriaUrl(page.url, { ...criteria, origin: market.value })}
				data-sveltekit-noscroll
				class:active={criteria.origin === market.value}
				aria-current={criteria.origin === market.value ? 'page' : undefined}
				title={market.value ? optionLabel(market.label, locale) : copy.anyCountry}
			>
				{#if market.value}<img src={assetHref(market.flagSrc)} width="20" height="15" alt="" />{/if}
				<span>{market.value ? optionLabel(market.label, locale) : copy.all}</span>
			</a>
		{/each}
	</nav>
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
	title={overview ? copy.filters : labels[field]}
	onclose={finishClose}
	surface="selection"
	backLabel={copy.back}
	onback={overview ? undefined : () => (overview = true)}
	mode={!overview && (field === 'make' || field === 'model') ? 'full' : 'sheet'}
	contentClass={`mobile-filter-surface import-preferences-sheet ${!overview && (field === 'make' || field === 'model') ? 'import-preferences-sheet--searchable' : ''}`}
>
	<form
		class="import-preferences"
		onsubmit={(event) => {
			event.preventDefault();
			apply();
		}}
	>
		{#if overview}
			<div class="import-preferences__categories">
				{#each pills as pill (pill.key)}
					<button
						type="button"
						class="mobile-disclosure-row"
						class:active={Boolean(criteria[pill.key])}
						aria-label={criteria[pill.key] ? `${labels[pill.key]}: ${pill.text}` : labels[pill.key]}
						title={pill.text}
						onclick={() => openField(pill.key)}
					>
						<span
							><strong>{labels[pill.key]}</strong>{#if criteria[pill.key]}<small>{pill.text}</small
								>{/if}</span
						>
						<ChevronRight size={18} aria-hidden="true" />
					</button>
				{/each}
			</div>
		{:else}
			{#if field === 'make' || field === 'model'}
				<label class="import-preferences__search" for={`import-preference-${id}`}>
					<Search size={22} aria-hidden="true" />
					<span class="sr-only">{labels[field]}</span>
					<input
						id={`import-preference-${id}`}
						type="search"
						maxlength={field === 'make' ? 60 : 80}
						placeholder={labels[field]}
						value={draft}
						autocomplete="off"
						enterkeyhint="done"
						onkeydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								event.currentTarget.blur();
							}
						}}
						oninput={(event) => {
							draft = event.currentTarget.value;
							query = draft;
						}}
					/>
				</label>
			{/if}
			<div
				class="import-preferences__choices mobile-choice-list"
				role="group"
				aria-label={labels[field]}
			>
				{#each visibleChoices as choice (choice.value)}
					<MobileChoiceRow
						label={choice.label}
						selected={draft === choice.value}
						image={choice.flag}
						imageKind="flag"
						onselect={() => {
							draft = choice.value;
							query = '';
						}}
					/>
				{/each}
			</div>
		{/if}
	</form>
	{#snippet footer()}
		<div class="mobile-filter-actions">
			<button
				type="button"
				class="mobile-filter-action mobile-filter-action--clear"
				onclick={() => {
					if (overview) {
						pendingHref = importCriteriaUrl(page.url, emptyImportCriteria);
						open = false;
					} else {
						draft = '';
						query = '';
					}
				}}>{copy.reset}</button
			>
			<button
				type="button"
				class="mobile-filter-action mobile-filter-action--apply"
				onclick={() => {
					if (overview) open = false;
					else apply();
				}}
				>{overview ? copy.done : copy.apply}{#if !overview}<ArrowRight
						size={18}
						aria-hidden="true"
					/>{/if}</button
			>
		</div>
	{/snippet}
</MobileSheet>

<style>
	.import-browse {
		display: grid;
		gap: var(--bc-space-2);
		margin-bottom: var(--bc-space-3);
	}
	.import-browse__countries {
		--bc-text-filter: var(--bc-text-quick-pill);
		--bc-leading-filter: var(--bc-leading-quick-pill);
	}
	.import-browse__countries a {
		min-width: var(--bc-control-height-chip);
		max-width: 180px;
	}
	.import-browse__empty button :global(svg) {
		width: var(--bc-control-icon-size-standard);
		height: var(--bc-control-icon-size-standard);
		flex: 0 0 auto;
	}

	.import-browse__countries a.active {
		background: var(--bc-accent);
		color: var(--bc-white);
	}
	.import-browse__countries span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.import-browse__countries img {
		position: static;
		inset: auto;
		width: 20px;
		height: 15px;
		flex: 0 0 20px;
		object-fit: cover;
		border-radius: 2px;
	}
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
		font-size: var(--bc-text-cta);
		cursor: pointer;
		min-width: 0;
		white-space: nowrap;
	}
	.import-browse__empty :global(svg) {
		flex: 0 0 auto;
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
	.import-preferences__categories {
		display: flex;
		flex-direction: column;
	}

	.import-preferences__categories button > span {
		display: flex;
		min-width: 0;
		gap: var(--bc-space-3);
		align-items: baseline;
	}
	.import-preferences__categories strong,
	.import-preferences__categories small {
		min-width: 0;
		overflow: hidden;
		font: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.import-preferences__categories small {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-label);
		margin-left: auto;
	}
	.import-preferences__categories :global(svg) {
		flex: 0 0 auto;
	}

	.import-preferences__search {
		display: flex;
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		flex: 0 0 auto;
		align-items: center;
		gap: var(--bc-space-2);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-bg-strong);
		padding: 0 var(--bc-space-4);
	}
	.import-preferences__search :global(svg) {
		width: var(--bc-control-icon-size-standard);
		height: var(--bc-control-icon-size-standard);
		flex: 0 0 auto;
		color: var(--bc-copy);
	}
	.import-preferences__search input[type='search'] {
		--control-focus-outline: none;
		--control-focus-shadow: none;
		width: 100%;
		min-width: 0;
		height: var(--bc-control-height-standard);
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		padding: 0 !important;
		color: var(--bc-ink);
		font: var(--bc-weight-body) var(--bc-text-search)/var(--bc-leading-search) var(--bc-font-body);
		outline: 0;
	}
	.import-preferences__search:focus-within {
		box-shadow: inset 0 0 0 2px var(--bc-accent);
	}
	:global(.import-preferences-sheet--searchable .bc-mobile-sheet__body) {
		display: flex;
		overflow: hidden;
	}
	:global(.import-preferences-sheet--searchable) .import-preferences {
		display: flex;
		min-height: 0;
		flex: 1;
		flex-direction: column;
	}
	:global(.import-preferences-sheet--searchable) .import-preferences__choices {
		min-height: 0;
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	button:focus-visible,
	a:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}
	.import-browse__countries :is(a, button):focus-visible {
		--control-focus-offset: -3px;
	}
</style>
