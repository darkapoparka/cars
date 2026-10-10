<script lang="ts">
	import { Popover } from 'bits-ui';
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import type { HomeFiveHeroSelect, HomeFiveHeroSelectOption } from '$lib/auxero/home-five';
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';
	import { siteShellCopy } from '$lib/content/site-shell';
	import Action from '$lib/components/common/Action.svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	let {
		select,
		selected = $bindable([]),
		options,
		mode = 'multi',
		searchable = false,
		searchPlaceholder = '',
		title = '',
		english = false
	}: {
		select: HomeFiveHeroSelect;
		selected?: string[];
		options?: HomeFiveHeroSelectOption[];
		mode?: 'single' | 'multi';
		searchable?: boolean;
		searchPlaceholder?: string;
		title?: string;
		english?: boolean;
	} = $props();
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(english ? 'en' : 'bg', key);
	const shellCopy = $derived(siteShellCopy[english ? 'en' : 'bg']);
	const id = $props.id();
	const desktop = new MediaQuery('(min-width: 768px)', true);
	let open = $state(false);
	let draft = $state<string[]>([]);
	let query = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);
	let trigger = $state<HTMLButtonElement | null>(null);
	let menuHeight = $state(520);
	let restoreTriggerFocus = true;
	const opts = $derived((options ?? select.options).filter((option) => option.value));
	const visibleOptions = $derived(
		opts.filter((option) =>
			(option.label + ' ' + (option.shortLabel ?? ''))
				.toLocaleLowerCase()
				.includes(query.trim().toLocaleLowerCase())
		)
	);
	const summary = $derived(
		!selected.length
			? select.defaultLabel
			: selected.length === 1
				? (opts.find((option) => option.value === selected[0])?.shortLabel ??
					opts.find((option) => option.value === selected[0])?.label ??
					selected[0])
				: selected.length + nt('ui50')
	);
	function setOpen(value: boolean) {
		if (value) {
			restoreTriggerFocus = true;
			draft = [...selected];
			measureMenuHeight();
		}
		query = '';
		open = value;
	}
	function measureMenuHeight() {
		if (!trigger) return;
		const room = window.innerHeight - trigger.getBoundingClientRect().bottom - 24;
		menuHeight = room >= 200 ? Math.min(520, room) : 520;
	}
	onMount(() => {
		window.addEventListener('resize', measureMenuHeight);
		return () => window.removeEventListener('resize', measureMenuHeight);
	});
	function toggle(value: string) {
		draft = draft.includes(value)
			? draft.filter((item) => item !== value)
			: mode === 'single'
				? [value]
				: [...draft, value];
	}
	function apply() {
		selected = draft.filter((value) => opts.some((option) => option.value === value));
		setOpen(false);
	}
	function focusSearch(event: Event) {
		if (searchable && searchInput) {
			event.preventDefault();
			searchInput.focus({ preventScroll: true });
		}
	}
	function restoreFocus(event: Event) {
		event.preventDefault();
		if (restoreTriggerFocus) trigger?.focus({ preventScroll: true });
	}
	$effect(() => {
		if (!desktop.current && open) {
			restoreTriggerFocus = false;
			setOpen(false);
		}
	});
</script>

<div class="desktop-home-filter">
	{#each selected as value (value)}<input type="hidden" name={select.name} {value} />{/each}
	<Popover.Root bind:open={() => open, setOpen}>
		<Popover.Trigger
			bind:ref={trigger}
			class={['hfp__field', 'desktop-home-filter__trigger', selected.length && 'is-selected']}
			aria-label={select.title + ': ' + summary}
			title={select.title + ': ' + summary}
		>
			<span class="desktop-home-filter__text">
				{#if selected.length}<span class="desktop-home-filter__label">{select.title}</span>{/if}
				<span class="hfp__value desktop-home-filter__value"
					>{selected.length ? summary : select.title}</span
				>
			</span>
			<ChevronDown size={16} aria-hidden="true" />
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				class="desktop-home-filter__menu"
				role="dialog"
				style={`--home-filter-menu-height: ${menuHeight}px`}
				aria-labelledby={id + '-title'}
				side="bottom"
				align="start"
				sideOffset={8}
				collisionPadding={16}
				onOpenAutoFocus={focusSearch}
				onCloseAutoFocus={restoreFocus}
				onInteractOutside={() => (restoreTriggerFocus = false)}
			>
				<header class="desktop-home-filter__header">
					<h2 id={id + '-title'}>{title || select.title}</h2>
					<Popover.Close class="desktop-home-filter__close" aria-label={shellCopy.close}>
						<X size={18} aria-hidden="true" />
					</Popover.Close>
				</header>
				{#if searchable}
					<label class="desktop-home-filter__search" for={id + '-search'}>
						<Search size={18} aria-hidden="true" />
						<span class="sr-only">{searchPlaceholder}</span>
						<input
							id={id + '-search'}
							bind:this={searchInput}
							type="search"
							autocomplete="off"
							bind:value={query}
							placeholder={searchPlaceholder}
						/>
					</label>
				{/if}
				<div class="desktop-home-filter__options">
					{#each visibleOptions as option (option.value)}
						<button
							type="button"
							class="desktop-home-filter__option"
							aria-pressed={draft.includes(option.value)}
							onclick={() => toggle(option.value)}
						>
							<span class="desktop-home-filter__check" aria-hidden="true"><Check size={14} /></span>
							{#if option.image}<img
									src={assetHref(option.image)}
									alt=""
									width="36"
									height="28"
									loading="lazy"
								/>{/if}
							<span class="desktop-home-filter__option-label"
								>{option.shortLabel ?? option.label}</span
							>
							{#if option.countLabel}<small>{option.countLabel}</small>{/if}
						</button>
					{:else}
						<p class="desktop-home-filter__empty" role="status">
							{nt('ui47')}
						</p>
					{/each}
				</div>
				<footer class="desktop-home-filter__footer">
					<Action variant="quiet" disabled={!draft.length} onclick={() => (draft = [])}
						>{nt('ui48')}</Action
					>
					<Action onclick={apply}>{nt('ui49')}</Action>
				</footer>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</div>

<style>
	.desktop-home-filter {
		min-width: 0;
	}
	@media (min-width: 768px) {
		:global(.desktop-home-filter__trigger) {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--bc-space-3);
			width: 100%;
			height: var(--bc-control-height-standard);
			padding: 4px var(--bc-space-4);
			border: 1px solid transparent;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
			color: var(--bc-ink);
			text-align: left;
			font-family: var(--bc-font-body);
			cursor: pointer;
		}
		:global(.desktop-home-filter__trigger:hover),
		:global(.desktop-home-filter__trigger[data-state='open']) {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
		:global(.desktop-home-filter__trigger.is-selected) {
			border-color: transparent;
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
		}
		:global(.desktop-home-filter__trigger.is-selected:hover) {
			background: var(--bc-accent-hover);
		}
		:global(.desktop-home-filter__trigger > svg) {
			flex: none;
			color: var(--bc-muted);
		}
		:global(.desktop-home-filter__trigger.is-selected > svg) {
			color: inherit;
		}
		.desktop-home-filter__text {
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-width: 0;
		}
		.desktop-home-filter__label {
			font-size: var(--bc-text-meta);
			line-height: 14px;
			opacity: 0.75;
		}
		.desktop-home-filter__value {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: var(--bc-text-body);
			font-weight: var(--bc-weight-control);
			line-height: 20px;
		}
		:global(.desktop-home-filter__menu) {
			z-index: var(--bc-z-popover);
			display: flex;
			flex-direction: column;
			gap: var(--bc-space-3);
			width: min(360px, calc(100vw - 32px));
			max-height: min(
				var(--home-filter-menu-height, 520px),
				var(--bits-popover-content-available-height)
			);
			padding: var(--bc-space-4);
			overflow: hidden;
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-panel);
			background: var(--bc-surface-raised);
			color: var(--bc-ink);
			box-shadow: var(--bc-shadow-panel);
			outline: none;
		}
		.desktop-home-filter__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--bc-space-3);
			flex: none;
		}
		.desktop-home-filter__header h2 {
			margin: 0;
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-entry);
			font-weight: var(--bc-weight-control);
			line-height: 1.3;
		}
		:global(.desktop-home-filter__close) {
			display: grid;
			place-items: center;
			flex: none;
			width: 36px;
			height: 36px;
			border: 0;
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
			color: var(--bc-ink);
			cursor: pointer;
		}
		:global(.desktop-home-filter__close:hover) {
			background: var(--bc-surface-hover);
		}
		.desktop-home-filter__search {
			display: flex;
			align-items: center;
			gap: var(--bc-space-3);
			flex: none;
			padding: 0 var(--bc-space-3);
			border: 1px solid transparent;
			border-radius: var(--bc-radius-pill);
			color: var(--bc-muted);
			background: var(--bc-control);
		}
		.desktop-home-filter__search:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
		.desktop-home-filter__search:focus-within {
			outline: 2px solid var(--bc-focus);
			outline-offset: 0;
		}
		.desktop-home-filter__search input {
			width: 100%;
			min-width: 0;
			height: var(--bc-control-height-standard);
			border: 0;
			background: transparent;
			color: var(--bc-ink);
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-body);
		}
		.desktop-home-filter__search input:focus-visible {
			outline: none !important;
			box-shadow: none !important;
		}
		.desktop-home-filter__options {
			min-height: 0;
			overflow-y: auto;
			overscroll-behavior: contain;
			display: grid;
			gap: var(--bc-space-1);
		}
		.desktop-home-filter__option {
			display: flex;
			align-items: center;
			gap: var(--bc-space-3);
			min-height: var(--bc-control-height-standard);
			padding: var(--bc-space-2) var(--bc-space-3);
			border: 0;
			border-radius: var(--bc-radius-md);
			background: transparent;
			color: var(--bc-ink);
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-body);
			text-align: left;
			cursor: pointer;
		}
		.desktop-home-filter__option:hover {
			background: var(--bc-control-hover);
		}
		.desktop-home-filter__option[aria-pressed='true'] {
			background: var(--bc-control-selected-surface);
		}
		.desktop-home-filter__option[aria-pressed='true']:hover {
			background: var(--bc-control-selected-hover);
		}
		.desktop-home-filter__check {
			display: grid;
			place-items: center;
			flex: none;
			width: 20px;
			height: 20px;
			border: 1px solid var(--bc-muted);
			border-radius: var(--bc-radius-sm);
			color: var(--bc-accent-contrast);
		}
		.desktop-home-filter__check :global(svg) {
			opacity: 0;
		}
		.desktop-home-filter__option[aria-pressed='true'] .desktop-home-filter__check {
			background: var(--bc-accent);
			border-color: var(--bc-accent);
		}
		.desktop-home-filter__option[aria-pressed='true'] .desktop-home-filter__check :global(svg) {
			opacity: 1;
		}
		.desktop-home-filter__option img {
			flex: none;
			object-fit: contain;
		}
		.desktop-home-filter__option-label {
			flex: 1;
			min-width: 0;
		}
		.desktop-home-filter__option small {
			color: var(--bc-muted);
			font-size: var(--bc-text-label);
		}
		.desktop-home-filter__empty {
			margin: var(--bc-space-3);
			color: var(--bc-muted);
			font-size: var(--bc-text-body);
		}
		.desktop-home-filter__footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--bc-space-3);
			flex: none;
			padding-top: var(--bc-space-1);
		}
		.desktop-home-filter__footer :global(.site-action) {
			--action-height: var(--bc-control-height-compact);
			--action-radius: var(--bc-radius-pill);
			--action-text: var(--bc-text-label);
			padding: 0 var(--bc-space-4);
		}
		.desktop-home-filter__footer :global(.quiet) {
			padding: 0 var(--bc-space-2);
		}
	}
	@media (max-width: 767.98px) {
		:global(.desktop-home-filter__menu) {
			display: none;
		}
	}
</style>
