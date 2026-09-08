<script lang="ts">
	import type { HomeFiveHeroSelect, HomeFiveHeroSelectOption } from '$lib/auxero/home-five';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Check, ChevronDown, Search, X } from '@lucide/svelte';

	let {
		select,
		selected = $bindable([]),
		mode = 'multi',
		variant = 'list',
		searchable = false,
		options,
		isEnglish = false,
		emptyHint = ''
	}: {
		select: HomeFiveHeroSelect;
		selected?: string[];
		mode?: 'single' | 'multi';
		variant?: 'grid' | 'list';
		searchable?: boolean;
		options?: HomeFiveHeroSelectOption[];
		isEnglish?: boolean;
		emptyHint?: string;
	} = $props();

	let open = $state(false);
	let query = $state('');

	const triggerId = $derived(`${select.id}-popover-trigger`);
	const opts = $derived(options ?? select.options);
	const matches = (option: HomeFiveHeroSelectOption) => {
		const needle = query.trim().toLowerCase();
		if (!needle) return true;
		return (
			option.label.toLowerCase().includes(needle) ||
			(option.shortLabel ?? '').toLowerCase().includes(needle)
		);
	};
	const visibleOptions = $derived(searchable ? opts.filter(matches) : opts);
	const searchSubject = $derived.by(() =>
		select.title
			.toLowerCase()
			.replace(/^(избери|choose|select)\s+/i, '')
			.trim()
	);
	const searchPlaceholder = $derived(
		isEnglish ? `Search ${searchSubject}...` : `Търси ${searchSubject}...`
	);
	const selectionHint = $derived(
		mode === 'single'
			? isEnglish
				? 'Choose one option.'
				: 'Избери една опция.'
			: isEnglish
				? 'Choose one or more options.'
				: 'Избери една или повече опции.'
	);

	const labelFor = (value: string) => {
		const option = opts.find((candidate) => candidate.value === value);
		return option?.shortLabel ?? option?.label ?? value;
	};
	const summary = $derived.by(() => {
		if (!selected.length) return select.defaultLabel;
		if (selected.length === 1) return labelFor(selected[0]);
		return isEnglish ? `${selected.length} selected` : `${selected.length} избрани`;
	});

	const isOn = (value: string) => selected.includes(value);
	const toggle = (value: string) => {
		if (mode === 'single') {
			selected = selected[0] === value ? [] : [value];
			open = false;
			return;
		}
		selected = isOn(value) ? selected.filter((entry) => entry !== value) : [...selected, value];
	};
	const clear = () => {
		selected = [];
	};

	function handleOpenChange(nextOpen: boolean) {
		open = nextOpen;
		if (!nextOpen) query = '';
	}

	const doneLabel = $derived(
		selected.length
			? `${isEnglish ? 'Done' : 'Готово'} (${selected.length})`
			: isEnglish
				? 'Done'
				: 'Готово'
	);
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
	<div class={['hfp', open && 'hfp--open', variant === 'grid' && 'hfp--grid']}>
		<!-- Hidden inputs keep the existing GET form contract (name → value pairs) intact. -->
		{#if selected.length === 0}
			<input type="hidden" name={select.name} value="" />
		{:else}
			{#each selected as value (value)}
				<input type="hidden" name={select.name} {value} />
			{/each}
		{/if}

		<Dialog.Trigger id={triggerId} class="hfp__field">
			<span class="hfp__label">{select.title}</span>
			<span class={['hfp__value', !selected.length && 'hfp__value--placeholder']}>{summary}</span>
			<span class="hfp__chev"><ChevronDown size={18} strokeWidth={2.25} aria-hidden="true" /></span>
		</Dialog.Trigger>
	</div>

	<Dialog.Content class="hfp__dialog" overlayClass="hfp__overlay" showCloseButton={false}>
		<Dialog.Header class="hfp__head">
			<div>
				<Dialog.Title class="hfp__title">{select.title}</Dialog.Title>
				<Dialog.Description class="hfp__description">{selectionHint}</Dialog.Description>
			</div>
			<Dialog.Close>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon-sm"
						class="hfp__close"
						aria-label={isEnglish ? 'Close' : 'Затвори'}
					>
						<X size={22} strokeWidth={2.15} aria-hidden="true" />
					</Button>
				{/snippet}
			</Dialog.Close>
		</Dialog.Header>

		<div class="hfp__body">
			{#if searchable}
				<div class="hfp__search">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
					<Input
						type="search"
						autocomplete="off"
						placeholder={searchPlaceholder}
						bind:value={query}
						class="hfp__search-input"
					/>
				</div>
			{/if}

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
							<span class="hfp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span
							>
						</button>
					{/each}
				</div>
			{/if}

			{#if mode === 'multi' && visibleOptions.length > 0}
				<Dialog.Footer class="hfp__foot">
					<Button type="button" variant="secondary" class="hfp__clear" onclick={clear}>
						{isEnglish ? 'Clear' : 'Изчисти'}
					</Button>
					<Button type="button" class="hfp__done" onclick={() => (open = false)}>
						{doneLabel}
					</Button>
				</Dialog.Footer>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.hfp {
		position: relative;
		flex: 1 1 0;
		min-width: 120px;
		font-family: var(--bc-font-body);
	}

	.hfp--open {
		z-index: 2;
	}

	:global(.hfp__field) {
		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
		min-height: 62px;
		align-content: center;
		gap: 3px;
		border: 1px solid transparent;
		border-radius: var(--bc-radius-md);
		background: var(--bc-popover-bg);
		padding: 9px 38px 8px 12px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		z-index: 2;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			border-radius 0.16s ease,
			box-shadow 0.16s ease;
	}

	:global(.hfp__field:hover) {
		border-color: var(--bc-popover-border-hover);
	}

	.hfp--open :global(.hfp__field) {
		border-color: var(--bc-border);
		border-radius: var(--bc-radius-md);
		box-shadow: none;
	}

	:global(.hfp__field:focus-visible) {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp__label {
		overflow: hidden;
		color: var(--bc-popover-muted);
		font-size: var(--bc-text-label, 14px);
		font-weight: 700;
		line-height: var(--bc-leading-label, 1.25);
		letter-spacing: 0;
		text-transform: uppercase;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value {
		overflow: hidden;
		color: var(--bc-ink);
		font-size: var(--bc-text-control, 18px);
		font-weight: 650;
		line-height: var(--bc-leading-control, 1.25);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__value--placeholder {
		color: var(--bc-popover-muted-strong);
		font-weight: 500;
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
		color: var(--bc-popover-icon);
		transform: translateY(-50%) rotate(180deg);
	}

	:global(.hfp__overlay) {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: rgb(12 12 13 / 0.64);
	}

	:global(.hfp__dialog) {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 81;
		display: grid;
		gap: 0;
		width: min(760px, calc(100vw - 40px));
		max-width: none;
		max-height: min(760px, calc(100dvh - 40px));
		border: 0;
		border-radius: 16px;
		background: var(--bc-popover-bg);
		padding: 0;
		box-shadow: 0 28px 80px rgb(0 0 0 / 0.32);
		overflow: hidden;
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
		transform: translate(-50%, -50%);
		outline: 0;
	}

	:global(.hfp__dialog[data-open]) {
		animation: hfp-modal-in 0.18s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes hfp-modal-in {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-50% + 10px)) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	:global(.hfp__head) {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
		padding: 24px 26px 10px;
	}

	:global(.hfp__title) {
		margin: 0;
		color: var(--bc-ink);
		font-size: 25px;
		font-weight: var(--bc-weight-bold, 700);
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	:global(.hfp__description) {
		margin: 5px 0 0;
		color: var(--bc-popover-muted-strong);
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
	}

	:global(.hfp__close) {
		display: grid;
		width: 42px;
		height: 42px;
		flex: 0 0 42px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--bc-popover-surface);
		color: var(--bc-ink);
		cursor: pointer;
		transition: background-color 0.16s ease;
	}

	:global(.hfp__close:hover) {
		background: var(--bc-popover-chip-hover);
	}

	:global(.hfp__close:focus-visible) {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.hfp__body {
		display: grid;
		min-height: 0;
		grid-template-rows: auto minmax(0, 1fr) auto;
		padding: 20px 26px 24px;
		overflow: hidden;
	}

	.hfp__search {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--bc-popover-surface);
		padding: 0 14px;
		height: 46px;
		color: var(--bc-subtle);
	}

	.hfp__search:focus-within {
		border-color: var(--bc-popover-focus);
		background: var(--bc-white);
	}

	:global(.hfp__search-input) {
		width: 100%;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		padding: 0;
		color: var(--bc-ink);
		font: inherit;
		font-size: 15px;
		font-weight: 400;
		outline: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	:global(.hfp__search-input::-webkit-search-cancel-button),
	:global(.hfp__search-input::-webkit-search-decoration) {
		appearance: none;
		-webkit-appearance: none;
	}

	.hfp__grid {
		display: grid;
		min-height: 0;
		max-height: 430px;
		gap: 10px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__grid::-webkit-scrollbar,
	.hfp__list::-webkit-scrollbar {
		width: 6px;
	}

	.hfp__grid::-webkit-scrollbar-track,
	.hfp__list::-webkit-scrollbar-track {
		background: transparent;
	}

	.hfp__grid::-webkit-scrollbar-thumb,
	.hfp__list::-webkit-scrollbar-thumb {
		border-radius: 999px;
		background: rgb(28 28 28 / 0.28);
	}

	.hfp__chip {
		display: flex;
		min-height: 88px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--bc-popover-chip-bg);
		padding: 6px;
		color: var(--bc-popover-chip-ink);
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__chip:hover {
		border-color: var(--bc-popover-chip-border-hover);
		background: var(--bc-popover-chip-hover);
	}

	.hfp__chip[aria-pressed='true'] {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.hfp__chip img {
		width: 58px;
		height: 34px;
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
		font-weight: 800;
	}

	.hfp__chiplabel {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hfp__list {
		display: grid;
		min-height: 0;
		max-height: 430px;
		gap: 8px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding-right: 6px;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.hfp__row {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: var(--bc-popover-chip-bg);
		padding: 10px 13px;
		color: var(--bc-popover-chip-ink);
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.25;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.hfp__row:hover {
		background: var(--bc-popover-chip-hover);
	}

	.hfp__row[aria-pressed='true'] {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.hfp__rowlabel {
		flex: 1 1 auto;
	}

	.hfp__row small {
		color: var(--bc-popover-subtle);
		font-size: var(--bc-text-micro);
		font-weight: 500;
	}

	.hfp__tick {
		display: flex;
		color: var(--bc-ink);
		opacity: 0;
	}

	.hfp__row[aria-pressed='true'] .hfp__tick {
		opacity: 1;
	}

	.hfp__hint {
		margin: 6px 2px;
		color: var(--bc-popover-hint);
		font-size: 13.5px;
		font-weight: 600;
	}

	:global(.hfp__foot) {
		display: grid;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		grid-template-columns: 140px 180px;
		margin-top: 18px;
		padding: 0;
	}

	:global(.hfp__foot [data-slot='button']) {
		width: 100%;
		border: 0;
		border-radius: 9px;
		min-height: 44px;
		padding: 0 13px;
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.15;
		white-space: nowrap;
		cursor: pointer;
	}

	:global(.hfp__clear) {
		background: var(--bc-popover-clear-bg);
		color: var(--bc-popover-clear-ink);
	}

	:global(.hfp__done) {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	:global(.hfp__done:hover) {
		background: var(--bc-accent-hover);
	}

	:global(.hfp__clear:hover) {
		background: var(--bc-popover-chip-hover);
	}

	:global(.hfp__foot [data-slot='button']:focus-visible) {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.hfp__dialog[data-open]) {
			animation: none;
		}
	}

	@media (max-width: 767.98px) {
		.hfp {
			min-width: 100%;
		}

		:global(.hfp__dialog) {
			width: calc(100vw - 24px);
			max-height: calc(100dvh - 24px);
			border-radius: 14px;
		}

		:global(.hfp__head) {
			padding: 20px 18px 16px;
		}

		:global(.hfp__title) {
			font-size: 22px;
		}

		.hfp__body {
			padding: 16px 18px 18px;
		}

		.hfp__grid,
		.hfp__list {
			max-height: none;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.hfp__chip {
			min-height: 78px;
		}

		:global(.hfp__foot) {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
		}
	}
</style>
