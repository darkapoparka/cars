<script lang="ts">
	import type { HomeFiveHeroSelect, HomeFiveHeroSelectOption } from '$lib/auxero/home-five';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Check, ChevronDown, Search, X } from '@lucide/svelte';
	import type { Attachment } from 'svelte/attachments';

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
		searchPlaceholder = ''
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
	} = $props();

	let open = $state(false);
	let query = $state('');
	let dialogSearchInput: HTMLInputElement | null = null;

	const triggerId = $derived(`${select.id}-popover-trigger`);
	const opts = $derived(options ?? select.options);
	const dialogSize = $derived(opts.length <= 4 ? 'compact' : opts.length <= 6 ? 'medium' : 'large');
	const matches = (option: HomeFiveHeroSelectOption) => {
		const needle = query.trim().toLowerCase();
		if (!needle) return true;
		return (
			option.label.toLowerCase().includes(needle) ||
			(option.shortLabel ?? '').toLowerCase().includes(needle)
		);
	};
	const visibleOptions = $derived(searchable ? opts.filter(matches) : opts);

	const labelFor = (value: string) => {
		const option = opts.find((candidate) => candidate.value === value);
		return option?.shortLabel ?? option?.label ?? value;
	};
	const summary = $derived.by(() => {
		if (!selected.length) return select.defaultLabel;
		if (selected.length === 1) return labelFor(selected[0]);
		return isEnglish ? `${selected.length} selected` : `${selected.length} избрани`;
	});
	const resolvedDialogDescription = $derived(
		dialogDescription ||
			(isEnglish
				? mode === 'multi'
					? 'Choose one or more options.'
					: 'Choose one option.'
				: mode === 'multi'
					? 'Избери една или повече опции.'
					: 'Избери една опция.')
	);

	const isOn = (value: string) => selected.includes(value);
	const toggle = (value: string) => {
		if (mode === 'single') {
			selected = selected[0] === value ? [] : [value];
			close();
			return;
		}
		selected = isOn(value) ? selected.filter((entry) => entry !== value) : [...selected, value];
	};
	const clear = () => {
		selected = [];
	};

	function setOpen(value: boolean) {
		const shouldRestoreFocus = open && !value;
		open = value;
		if (!value) {
			query = '';
			if (shouldRestoreFocus) {
				queueMicrotask(() => document.getElementById(triggerId)?.focus());
			}
		}
	}

	function close() {
		setOpen(false);
	}

	const captureDialogSearch: Attachment<HTMLInputElement> = (element) => {
		dialogSearchInput = element;
		return () => {
			if (dialogSearchInput === element) dialogSearchInput = null;
		};
	};
	const focusDialogSearch = (event: Event) => {
		if (!searchable || !dialogSearchInput) return;
		event.preventDefault();
		queueMicrotask(() => dialogSearchInput?.focus());
	};

	const doneLabel = $derived(
		selected.length
			? `${isEnglish ? 'Done' : 'Готово'} (${selected.length})`
			: isEnglish
				? 'Done'
				: 'Готово'
	);
</script>

{#snippet fieldContents()}
	<span class="hfp__label">{select.title}</span>
	<span class={['hfp__value', !selected.length && 'hfp__value--placeholder']}>{summary}</span>
	<span class="hfp__chev"><ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" /></span>
{/snippet}

{#snippet pickerContents()}
	{#if searchable}
		<div class="hfp__search">
			<Search size={17} strokeWidth={2.1} aria-hidden="true" />
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="search"
				autocomplete="off"
				placeholder={searchPlaceholder ||
					(isEnglish
						? `Search ${select.title.toLowerCase()}…`
						: `Търси ${select.title.toLowerCase()}…`)}
				aria-label={searchPlaceholder || (isEnglish ? 'Search options' : 'Търси в опциите')}
				bind:value={query}
				autofocus
				{@attach captureDialogSearch}
			/>
		</div>
	{/if}

	<div class="hfp__results" aria-live="polite">
		{#if visibleOptions.length === 0}
			<p class="hfp__hint">{emptyHint || (isEnglish ? 'No matches' : 'Няма съвпадения')}</p>
		{:else if variant === 'grid'}
			<div class="hfp__grid">
				{#each visibleOptions as option (option.value)}
					<button
						type="button"
						class="hfp__chip"
						aria-pressed={isOn(option.value)}
						onclick={() => toggle(option.value)}
					>
						{#if option.image}
							<img src={option.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
						{:else}
							<span class="hfp__mono">{(option.shortLabel ?? option.label).charAt(0)}</span>
						{/if}
						<span class="hfp__chiplabel">{option.shortLabel ?? option.label}</span>
					</button>
				{/each}
			</div>
		{:else}
			<div class="hfp__list">
				{#each visibleOptions as option (option.value)}
					<button
						type="button"
						class="hfp__row"
						aria-pressed={isOn(option.value)}
						onclick={() => toggle(option.value)}
					>
						<span class="hfp__rowlabel">{option.label}</span>
						{#if option.countLabel}<small>{option.countLabel}</small>{/if}
						<span class="hfp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if mode === 'multi'}
		<div class="hfp__foot hfp__foot--dialog">
			<button type="button" class="hfp__clear" onclick={clear} disabled={!selected.length}>
				{isEnglish ? 'Clear' : 'Изчисти'}
			</button>
			<button type="button" class="hfp__done" onclick={close}>{doneLabel}</button>
		</div>
	{/if}
{/snippet}

<div class={['hfp', open && 'hfp--open', variant === 'grid' && 'hfp--grid']}>
	<!-- Hidden inputs keep the existing GET form contract (name → value pairs) intact. -->
	{#if selected.length === 0}
		<input type="hidden" name={select.name} value="" />
	{:else}
		{#each selected as value (value)}
			<input type="hidden" name={select.name} {value} />
		{/each}
	{/if}

	<Dialog.Root bind:open={() => open, setOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<button {...props} id={triggerId} class="hfp__field" aria-expanded={open}>
					{@render fieldContents()}
				</button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content
			class={`hfp-dialog__content hfp-dialog__content--${dialogSize}`}
			overlayClass="hfp-dialog__overlay"
			showCloseButton={false}
			onOpenAutoFocus={focusDialogSearch}
		>
			<div class="hfp-dialog__head">
				<div>
					<Dialog.Title class="hfp-dialog__title">{dialogTitle || select.title}</Dialog.Title>
					<Dialog.Description class="hfp-dialog__description">
						{resolvedDialogDescription}
					</Dialog.Description>
				</div>
				<Dialog.Close>
					{#snippet child({ props })}
						<button
							{...props}
							class="hfp-dialog__close"
							aria-label={isEnglish ? 'Close selection' : 'Затвори избора'}
						>
							<X size={20} strokeWidth={2.2} aria-hidden="true" />
						</button>
					{/snippet}
				</Dialog.Close>
			</div>
			<div class="hfp-dialog__body">{@render pickerContents()}</div>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style>
	.hfp {
		position: relative;
		flex: 1 1 0;
		min-width: 120px;
	}

	.hfp__field {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 62px;
		align-content: center;
		gap: 3px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-popover-bg);
		padding: 9px 38px 8px 12px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease;
	}

	.hfp__field:hover {
		border-color: var(--bc-popover-border-hover);
	}

	.hfp--open .hfp__field {
		border-color: var(--bc-popover-accent);
		box-shadow: 0 0 0 3px var(--bc-popover-accent-ring);
	}

	.hfp__field:focus-visible {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp__label {
		overflow: hidden;
		color: var(--bc-popover-muted);
		font-size: 11px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value {
		overflow: hidden;
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 700;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value--placeholder {
		color: var(--bc-popover-muted);
		font-weight: 600;
	}

	.hfp__chev {
		position: absolute;
		top: 50%;
		right: 12px;
		display: flex;
		color: var(--bc-popover-icon);
		transform: translateY(-50%);
		transition: transform 0.18s ease;
	}

	.hfp--open .hfp__chev {
		color: var(--bc-popover-icon-active);
		transform: translateY(-50%) rotate(180deg);
	}

	:global(.hfp-dialog__overlay) {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: rgb(9 12 15 / 0.62);
		backdrop-filter: blur(3px);
	}

	:global(.hfp-dialog__content) {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 70;
		display: flex;
		width: min(720px, calc(100vw - 32px));
		max-width: min(720px, calc(100vw - 32px));
		max-height: min(760px, calc(100vh - 48px));
		flex-direction: column;
		gap: 0;
		overflow: hidden;
		border: 1px solid var(--bc-popover-border);
		border-radius: 16px;
		background: var(--bc-popover-bg);
		padding: 0;
		color: var(--bc-ink);
		box-shadow: 0 30px 90px rgb(0 0 0 / 0.35);
		transform: translate(-50%, -50%);
	}

	:global(.hfp-dialog__content--medium) {
		width: min(600px, calc(100vw - 32px));
		max-width: min(600px, calc(100vw - 32px));
	}

	:global(.hfp-dialog__content--compact) {
		width: min(480px, calc(100vw - 32px));
		max-width: min(480px, calc(100vw - 32px));
	}

	.hfp-dialog__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		padding: 24px 24px 20px;
	}

	:global(.hfp-dialog__title) {
		color: var(--bc-ink);
		font-size: 24px;
		font-weight: 650;
		line-height: 1.2;
		letter-spacing: 0;
	}

	:global(.hfp-dialog__description) {
		max-width: 58ch;
		margin-top: 7px;
		color: var(--bc-popover-muted);
		font-size: 14.5px;
		font-weight: 400;
		line-height: 1.5;
	}

	:global(.hfp-dialog__close) {
		display: grid;
		width: 40px;
		height: 40px;
		flex: 0 0 40px;
		place-items: center;
		border: 0;
		border-radius: 10px;
		background: var(--bc-popover-clear-bg);
		color: var(--bc-ink);
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	:global(.hfp-dialog__close:hover) {
		background: var(--bc-popover-accent);
		color: var(--bc-white);
	}

	:global(.hfp-dialog__close:focus-visible) {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp-dialog__body {
		--hfp-option-hover: color-mix(in srgb, var(--bc-popover-chip-bg) 94%, var(--bc-ink));
		display: flex;
		min-height: 0;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 20px 24px 0;
	}

	.hfp-dialog__body .hfp__results {
		min-height: 0;
		flex: 1 1 auto;
	}

	.hfp-dialog__body .hfp__grid {
		max-height: min(420px, calc(100vh - 310px));
	}

	.hfp-dialog__body .hfp__list {
		max-height: min(412px, calc(100vh - 310px));
	}

	.hfp__search {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 11px;
		border-radius: 10px;
		background: var(--bc-popover-surface);
		padding: 0 12px;
		height: 44px;
		color: var(--bc-subtle);
	}

	.hfp__search:focus-within {
		box-shadow: 0 0 0 2px rgb(185 22 28 / 0.24);
	}

	.hfp__search input {
		width: 100%;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none !important;
		padding: 0;
		color: var(--bc-ink);
		font: inherit;
		font-size: 15px;
		font-weight: 400;
		outline: 0 !important;
		appearance: none;
		-webkit-appearance: none;
	}

	.hfp__search input::-webkit-search-cancel-button,
	.hfp__search input::-webkit-search-decoration {
		appearance: none;
		-webkit-appearance: none;
	}

	.hfp__grid {
		display: grid;
		max-height: 286px;
		gap: 8px;
		grid-template-columns: repeat(3, 1fr);
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__chip {
		display: flex;
		min-height: 76px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1.5px solid transparent;
		border-radius: 11px;
		background: var(--bc-popover-chip-bg);
		padding: 6px;
		color: var(--bc-popover-chip-ink);
		font: inherit;
		font-size: 13px;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__chip:hover:not([aria-pressed='true']) {
		background: var(--hfp-option-hover);
	}

	.hfp__chip[aria-pressed='true'] {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.hfp__chip:focus-visible,
	.hfp__row:focus-visible {
		border-color: var(--bc-popover-focus);
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp__chip img {
		max-width: 42px;
		max-height: 26px;
		object-fit: contain;
	}

	.hfp__mono {
		display: grid;
		width: 34px;
		height: 30px;
		place-items: center;
		border-radius: 8px;
		background: var(--bc-popover-mono-bg);
		color: var(--bc-white);
		font-size: 15px;
		font-weight: 650;
	}

	.hfp__chiplabel {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__list {
		display: grid;
		max-height: 300px;
		gap: 4px;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__row {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 10px;
		border: 1.5px solid transparent;
		border-radius: 10px;
		background: var(--bc-popover-chip-bg);
		padding: 12px 13px;
		color: var(--bc-popover-chip-ink);
		font: inherit;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.3;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__row:hover:not([aria-pressed='true']) {
		background: var(--hfp-option-hover);
	}

	.hfp__row[aria-pressed='true'] {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.hfp__rowlabel {
		flex: 1 1 auto;
	}

	.hfp__row small {
		color: var(--bc-popover-muted);
		font-size: 12.5px;
		font-weight: 400;
		line-height: 1;
	}

	.hfp__tick {
		display: flex;
		color: var(--bc-popover-icon-active);
		opacity: 0;
	}

	.hfp__row[aria-pressed='true'] .hfp__tick {
		opacity: 1;
	}

	.hfp__hint {
		margin: 6px 2px;
		color: var(--bc-popover-hint);
		font-size: 14px;
		font-weight: 400;
	}

	.hfp__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: 10px;
		padding-top: 10px;
	}

	.hfp__foot button {
		border: 0;
		border-radius: 8px;
		min-height: 44px;
		padding: 0 17px;
		font: inherit;
		font-size: 15px;
		font-weight: 500;
		line-height: 1.2;
		cursor: pointer;
	}

	.hfp__foot button:focus-visible {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp__foot button:disabled {
		cursor: default;
		opacity: 0.48;
	}

	.hfp__foot--dialog {
		margin: 16px -24px 0;
		padding: 16px 24px;
	}

	.hfp__clear {
		background: var(--bc-popover-clear-bg);
		color: var(--bc-popover-clear-ink);
	}

	.hfp__done {
		background: var(--bc-ink);
		color: var(--bc-white);
	}

	@media (max-width: 767.98px) {
		.hfp {
			min-width: 100%;
		}

		:global(.hfp-dialog__content) {
			width: calc(100vw - 20px);
			max-width: calc(100vw - 20px);
			max-height: calc(100dvh - 20px);
		}

		.hfp-dialog__head {
			padding: 20px 18px 16px;
		}

		.hfp-dialog__body {
			padding: 16px 18px 0;
		}

		.hfp__foot--dialog {
			margin-inline: -18px;
			padding-inline: 18px;
		}
	}
</style>
