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
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
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
	const helps = $derived({
		origin: copy.countryHelp,
		bodyType: copy.typeHelp,
		make: copy.makeHelp,
		model: copy.modelHelp
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
	<nav class="import-browse__countries" aria-label={copy.countryHelp}>
		<button
			type="button"
			aria-label={copy.filters}
			aria-haspopup="dialog"
			aria-expanded={open}
			onclick={openFilters}
		>
			<SlidersHorizontal size={18} aria-hidden="true" />
		</button>
		{#each importCountries as market (market.value)}
			<a
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
	description={overview ? copy.preferences : helps[field]}
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
		{#if overview}
			<div class="import-preferences__categories">
				{#each pills as pill (pill.key)}
					<button
						type="button"
						class:active={Boolean(criteria[pill.key])}
						aria-label={criteria[pill.key] ? `${labels[pill.key]}: ${pill.text}` : labels[pill.key]}
						title={pill.text}
						onclick={() => openField(pill.key)}
					>
						<span
							><strong>{labels[pill.key]}</strong>{#if criteria[pill.key]}<small>{pill.text}</small
								>{/if}</span
						>
						<ChevronDown size={15} aria-hidden="true" />
					</button>
				{/each}
			</div>
		{:else}
			<button class="import-preferences__back" type="button" onclick={() => (overview = true)}>
				<ChevronLeft size={18} aria-hidden="true" />{copy.back}
			</button>
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
		{/if}
	</form>
	{#snippet footer()}
		<div class="import-preferences__actions">
			<button
				type="button"
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
		display: flex;
		gap: var(--bc-space-2);
		overflow-x: auto;
		padding: 2px 0;
		scrollbar-width: none;
	}
	.import-browse__countries::-webkit-scrollbar {
		display: none;
	}
	/* Market pills share the same height, padding, typography and radius.
	   Labels and flags determine their width, including the unrestricted market,
	   so translations follow the same sizing rule within the scrolling rail. */
	.import-browse__countries :is(a, button) {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-width: var(--bc-control-height-chip);
		max-width: 180px;
		min-height: var(--bc-control-height-chip);
		padding: 0 12px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-filter)/var(--bc-leading-filter)
			var(--bc-font-body);
		text-decoration: none;
		cursor: pointer;
	}
	.import-browse__countries button {
		width: var(--bc-control-height-chip);
		padding: 0;
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
	.import-browse__countries img,
	.import-preferences__choices img {
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
		font-size: var(--bc-mobile-body);
		cursor: pointer;
		min-width: 0;
		white-space: nowrap;
	}
	.import-browse__empty :global(svg) {
		flex: 0 0 auto;
	}
	.import-browse a {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: var(--bc-control-height-chip);
		color: var(--bc-copy);
		font-size: var(--bc-text-quick-pill);
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
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}
	.import-preferences__categories button {
		display: flex;
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
		padding: 0 12px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-filter)/var(--bc-leading-filter)
			var(--bc-font-body);
		cursor: pointer;
	}
	.import-preferences__categories button.active {
		border-color: var(--bc-accent);
	}
	.import-preferences__categories button > span {
		display: flex;
		min-width: 0;
		gap: 6px;
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
		font-size: var(--bc-mobile-meta);
	}
	.import-preferences__categories :global(svg) {
		flex: 0 0 auto;
	}
	.import-preferences__back {
		display: flex;
		width: fit-content;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		gap: 6px;
		padding: 0 4px;
		border: 0;
		border-radius: var(--bc-radius-control);
		background: transparent;
		color: var(--bc-ink);
		font: var(--bc-weight-control) var(--bc-text-filter)/var(--bc-leading-filter)
			var(--bc-font-body);
		cursor: pointer;
	}
	.import-preferences label {
		font-size: var(--bc-mobile-label);
	}
	.import-preferences input {
		min-height: var(--bc-control-height-standard);
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
		min-width: 0;
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-standard);
		padding: 0 12px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-white);
		color: var(--bc-ink);
		text-align: left;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-filter);
		line-height: var(--bc-leading-filter);
		cursor: pointer;
	}
	.import-preferences__choices button span {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		font-size: var(--bc-text-control);
		line-height: var(--bc-leading-control);
		cursor: pointer;
		white-space: nowrap;
		min-width: 0;
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
	.import-browse__countries :is(a, button):focus-visible {
		--control-focus-offset: -3px;
	}
</style>
