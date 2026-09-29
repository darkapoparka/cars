<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import type { HomeFiveHeroSelect, HomeFiveHeroSelectOption } from '$lib/auxero/home-five';
	import type { Component } from 'svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';
	let {
		select,
		selected = $bindable([]),
		mode = 'multi',
		variant = 'list',
		searchable = false,
		options,
		isEnglish = false,
		emptyHint = '',
		dialogTitle = '',
		dialogDescription = '',
		searchPlaceholder = '',
		compact = false,
		prominent = false,
		icon: Icon
	}: {
		select: HomeFiveHeroSelect;
		selected?: string[];
		mode?: 'single' | 'multi';
		variant?: 'grid' | 'list';
		searchable?: boolean;
		options?: HomeFiveHeroSelectOption[];
		isEnglish?: boolean;
		emptyHint?: string;
		dialogTitle?: string;
		dialogDescription?: string;
		searchPlaceholder?: string;
		compact?: boolean;
		prominent?: boolean;
		icon?: Component<{ size?: number; strokeWidth?: number }>;
	} = $props();
	let open = $state(false);
	let query = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);
	function focusSearch(event: Event) {
		if (searchable && searchInput) {
			event.preventDefault();
			searchInput.focus({ preventScroll: true });
		}
	}
	const id = $props.id();
	const opts = $derived((options ?? select.options).filter((option) => option.value));
	const visibleOptions = $derived(
		opts.filter(
			(option) =>
				!searchable ||
				(option.label + ' ' + (option.shortLabel ?? ''))
					.toLocaleLowerCase()
					.includes(query.trim().toLocaleLowerCase())
		)
	);
	const summary = $derived(
		selected.length === 0
			? select.defaultLabel
			: selected.length === 1
				? (opts.find((option) => option.value === selected[0])?.shortLabel ??
					opts.find((option) => option.value === selected[0])?.label ??
					selected[0])
				: selected.length + (isEnglish ? ' selected' : nt('ui50'))
	);
	function setOpen(value: boolean) {
		open = value;
		if (!value) query = '';
	}
	function toggle(value: string) {
		selected =
			mode === 'single'
				? selected.includes(value)
					? []
					: [value]
				: selected.includes(value)
					? selected.filter((item) => item !== value)
					: [...selected, value];
		if (mode === 'single') setOpen(false);
	}
</script>

<div class="hfp" class:hfp--open={open}>
	{#each selected as value (value)}<input type="hidden" name={select.name} {value} />{/each}
	<button
		type="button"
		class="hfp__field"
		class:hfp__field--compact={compact}
		class:hfp__field--prominent={prominent}
		class:hfp__field--selected={selected.length > 0}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-label={select.title + ': ' + summary}
		onclick={() => setOpen(true)}
	>
		{#if compact && Icon}<span class="hfp__field-icon" aria-hidden="true"
				><Icon size={18} strokeWidth={1.75} /></span
			>{/if}
		{#if !compact}<span class="hfp__label">{select.title}</span>{/if}
		<span class="hfp__value" class:hfp__value--placeholder={!selected.length}
			>{compact && !selected.length ? select.title : summary}</span
		>
		<ChevronDown size={20} aria-hidden="true" />
	</button>
</div>
<Modal
	bind:open={() => open, setOpen}
	title={dialogTitle || select.title}
	description={dialogDescription || undefined}
	wide={variant === 'grid' && opts.length > 6}
	bodyTone="muted"
	class="filter-picker-dialog"
	onOpenAutoFocus={focusSearch}
>
	<div class="hfp-picker">
		{#if searchable}
			<label class="hfp__search" for={id + '-search'}>
				<Search size={20} aria-hidden="true" />
				<span class="sr-only"
					>{searchPlaceholder || (isEnglish ? 'Search options' : nt('ui46'))}</span
				>
				<input
					id={id + '-search'}
					bind:this={searchInput}
					type="search"
					autocomplete="off"
					bind:value={query}
					placeholder={searchPlaceholder || (isEnglish ? 'Search options' : nt('ui46'))}
				/>
			</label>
		{/if}
		<div class:hfp__grid={variant === 'grid'} class:hfp__list={variant === 'list'}>
			{#each visibleOptions as option (option.value)}
				<button
					type="button"
					class="hfp__option"
					class:hfp__chip={variant === 'grid'}
					class:hfp__row={variant === 'list'}
					aria-pressed={selected.includes(option.value)}
					onclick={() => toggle(option.value)}
				>
					{#if variant === 'grid'}
						{#if option.image}<img
								src={assetHref(option.image)}
								alt=""
								width="56"
								height="40"
								loading="lazy"
							/>{:else}<span class="hfp__mono" aria-hidden="true"
								>{(option.shortLabel ?? option.label).charAt(0)}</span
							>{/if}
					{/if}
					<span class="hfp__option-label"
						>{variant === 'grid' ? (option.shortLabel ?? option.label) : option.label}</span
					>
					{#if option.countLabel}<small>{option.countLabel}</small>{/if}
					<span class="hfp__tick" aria-hidden="true"><Check size={18} /></span>
				</button>
			{:else}<p class="hfp__hint" role="status">
					{emptyHint || (isEnglish ? 'No matching options' : nt('ui47'))}
				</p>{/each}
		</div>
	</div>
	{#snippet footer()}
		<div class="hfp__foot">
			<Action variant="secondary" disabled={!selected.length} onclick={() => (selected = [])}
				>{isEnglish ? 'Clear' : nt('ui48')}</Action
			>
			<Action onclick={() => setOpen(false)}
				>{isEnglish ? 'Done' : nt('ui49')}{selected.length
					? ' (' + selected.length + ')'
					: ''}</Action
			>
		</div>
	{/snippet}
</Modal>

<style>
	.hfp {
		min-width: 0;
	}
	.hfp__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		width: 100%;
		min-height: calc(var(--bc-control-height-standard) + var(--bc-space-6));
		align-content: center;
		gap: var(--bc-space-1) var(--bc-space-3);
		border: 1px solid var(--picker-field-border, var(--bc-border-strong));
		border-radius: var(--bc-radius-control);
		background: var(--picker-field-background, var(--bc-white));
		color: var(--bc-ink);
		padding: var(--bc-space-3) var(--bc-space-4);
		text-align: left;
	}
	.hfp__field:hover,
	.hfp--open .hfp__field {
		border-color: var(--bc-accent);
	}
	.hfp__field--selected {
		border-color: var(--bc-accent);
		background: var(--bc-surface);
	}
	.hfp__label {
		grid-column: 1;
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-label);
	}
	.hfp__value {
		grid-column: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: var(--bc-text-entry);
		font-weight: var(--bc-weight-control);
		line-height: var(--bc-leading-filter);
	}
	.hfp__value--placeholder {
		font-weight: var(--bc-weight-control);
	}
	.hfp__field :global(svg) {
		grid-column: 2;
		grid-row: 1 / 3;
		align-self: center;
		color: var(--bc-copy);
	}
	.hfp-picker {
		display: grid;
		gap: var(--bc-space-4);
		padding: var(--bc-space-5);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
	}
	.hfp__search {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-route-pill-height);
		padding-inline: var(--bc-space-4);
		background: var(--bc-white);
		border: 1px solid var(--bc-route-pill-border);
		border-radius: var(--bc-radius-control);
		color: var(--bc-muted);
	}
	.hfp__search input {
		min-width: 0;
		width: 100%;
		min-height: var(--bc-route-pill-height);
		background: transparent;
		border: 0;
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
	}
	.hfp__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.hfp__list {
		display: grid;
		gap: var(--bc-space-2);
	}
	.hfp__option {
		position: relative;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: var(--bc-surface);
		color: var(--bc-ink);
		font-size: var(--bc-text-filter);
		line-height: var(--bc-leading-filter);
		text-align: left;
	}
	.hfp__option:hover {
		border-color: var(--bc-border-strong);
		background: var(--bc-surface-hover);
	}
	.hfp__option[aria-pressed='true'] {
		background: var(--bc-surface-hover);
		border-color: var(--bc-accent);
		box-shadow: inset 0 0 0 1px var(--bc-accent);
	}
	.hfp__chip {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: calc(var(--bc-route-pill-height) * 2);
		gap: var(--bc-space-2);
		padding: var(--bc-space-4);
		text-align: center;
	}
	.hfp__chip img {
		width: 56px;
		height: 40px;
		object-fit: contain;
	}
	.hfp__mono {
		font-size: var(--bc-text-h4);
		font-weight: var(--bc-weight-heading);
	}
	.hfp__row {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-route-pill-height);
		padding: var(--bc-space-3) var(--bc-space-4);
	}
	.hfp__row .hfp__option-label {
		flex: 1;
	}
	.hfp__tick {
		display: flex;
		color: var(--bc-accent);
		opacity: 0;
	}
	.hfp__chip .hfp__tick {
		position: absolute;
		top: var(--bc-space-2);
		right: var(--bc-space-2);
	}
	.hfp__option[aria-pressed='true'] .hfp__tick {
		opacity: 1;
	}
	small {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	.hfp__hint {
		margin: 0;
		color: var(--bc-copy);
	}
	.hfp__foot {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-3);
	}
	@media (max-width: 479px) {
		.hfp__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* The search wrapper, not its inset input, owns the visible focus ring. */
	.hfp__search:focus-within {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
	}
	.hfp__search input:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}

	.hfp__field--compact {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-primary);
		height: var(--bc-control-height-primary);
		padding: 0 var(--bc-space-3);
		border-color: var(--bc-border-strong);
		background: var(--bc-surface-raised);
		border-radius: var(--bc-radius-md);
	}
	.hfp__field--compact .hfp__value {
		flex: 1;
		font-size: var(--bc-text-filter);
	}
	.hfp__field-icon {
		display: inline-flex;
		flex: 0 0 auto;
	}
	.hfp__field--compact :global(svg) {
		flex: 0 0 auto;
	}
	.hfp__field--compact.hfp__field--selected {
		border-color: var(--bc-accent);
		background: var(--bc-surface);
	}
	.hfp__field--prominent {
		border-color: var(--bc-route-pill-border);
		background: var(--bc-bg-strong);
	}
	.hfp__field--compact.hfp__field--prominent.hfp__field--selected {
		background: var(--bc-bg-strong);
	}
	.hfp__field--prominent .hfp__value {
		color: var(--bc-ink);
		font-size: var(--bc-text-entry);
		font-weight: var(--bc-weight-heading);
	}
	.hfp__field--prominent :global(svg) {
		color: var(--bc-ink);
	}
	@media (min-width: 768px) {
		.hfp__search:focus-within {
			outline-offset: 0;
			border-color: var(--bc-focus);
		}
		.hfp__grid {
			grid-template-columns: 1fr;
			gap: var(--bc-space-1);
		}
		.hfp-picker {
			padding: 0;
			border: 0;
			border-radius: 0;
		}
		.hfp__search {
			min-height: var(--bc-control-height-primary);
			border-radius: var(--bc-radius-md);
			background: var(--bc-surface-raised);
		}
		.hfp__search input {
			background: transparent;
			font-size: var(--bc-text-control);
		}
		.hfp__list {
			gap: var(--bc-space-1);
		}
		.hfp__row {
			min-height: var(--bc-control-height-primary);
			padding: var(--bc-space-2) var(--bc-space-3);
			border-color: transparent;
			background: transparent;
			border-radius: var(--bc-radius-md);
		}
		.hfp__chip {
			min-height: var(--bc-control-height-primary);
			padding: var(--bc-space-2) var(--bc-space-3);
			flex-direction: row;
			justify-content: flex-start;
			gap: var(--bc-space-3);
			text-align: left;
			background: transparent;
			border-radius: var(--bc-radius-md);
			border-color: transparent;
		}
		.hfp__chip img {
			width: 36px;
			height: 28px;
		}
		.hfp__option:hover,
		.hfp__option[aria-pressed='true'] {
			background: var(--bc-bg-strong);
			border-color: transparent;
			box-shadow: none;
		}
		.hfp__chip .hfp__option-label {
			flex: 1;
		}
		.hfp__tick,
		.hfp__chip .hfp__tick {
			position: static;
			order: -1;
			display: grid;
			place-items: center;
			opacity: 1;
			width: var(--bc-space-5);
			height: var(--bc-space-5);
			flex: none;
			border: 1px solid var(--bc-muted);
			border-radius: var(--bc-radius-sm);
			color: var(--bc-white);
		}
		.hfp__tick :global(svg) {
			opacity: 0;
			width: 14px;
			height: 14px;
		}
		.hfp__option[aria-pressed='true'] .hfp__tick {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
		}
		.hfp__option[aria-pressed='true'] .hfp__tick :global(svg) {
			opacity: 1;
		}
	}
</style>
