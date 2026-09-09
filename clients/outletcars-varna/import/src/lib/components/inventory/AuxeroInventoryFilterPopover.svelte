<script lang="ts">
	import type {
		AuxeroInventoryFilter,
		AuxeroInventoryDesktopData
	} from '$lib/auxero/inventory-desktop';
	import {
		Car,
		CarFront,
		Check,
		ChevronDown,
		Cog,
		Euro,
		Fuel,
		Gauge,
		Search,
		SlidersHorizontal,
		Tag,
		X
	} from '@lucide/svelte';
	import type { Attachment } from 'svelte/attachments';

	let {
		allSelectedValue,
		allFiltersTrigger = false,
		filter,
		fieldTitle,
		modalFilters = [],
		onModalClose,
		onModalOpen,
		fieldDisplayMode = 'label-value',
		optionLayout = 'auto',
		presentation = 'popover',
		showFieldIcon = false
	}: {
		allSelectedValue?: string;
		allFiltersTrigger?: boolean;
		filter: AuxeroInventoryFilter;
		fieldTitle?: string;
		modalFilters?: AuxeroInventoryFilter[];
		onModalClose?: (name: string) => void;
		onModalOpen?: (name: string) => void;
		fieldDisplayMode?: 'label-value' | 'single-title';
		optionLayout?: 'auto' | 'grid' | 'list';
		presentation?: AuxeroInventoryDesktopData['filterPresentation'] | 'sidebar';
		showFieldIcon?: boolean;
	} = $props();

	const uid = $props.id();
	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);
	const hasImages = $derived(filter.options.some((option) => option.image));
	const searchable = $derived(filter.options.length > 8);
	const usesModal = $derived(presentation === 'modal');
	const usesSidebar = $derived(presentation === 'sidebar');
	const usesGridOptions = $derived(
		!usesModal && (optionLayout === 'grid' || (optionLayout === 'auto' && hasImages))
	);
	const usesRowOptions = $derived(!usesGridOptions);

	let open = $state(false);
	let panelMounted = $state(false);
	let query = $state('');
	let rootElement: HTMLDivElement | undefined;
	let triggerElement: HTMLButtonElement | undefined;
	let modalLockScrollbarWidth = 0;

	const isChecked = (value: string) =>
		value
			? filter.selectedValues.some((selected) => selected.toLowerCase() === value.toLowerCase())
			: allSelected;

	const isAllFilterValue = (value: string) => !value.trim();

	const matches = (label: string) => {
		const needle = query.trim().toLowerCase();

		return !needle || label.toLowerCase().includes(needle);
	};

	const fieldValue = $derived(
		allSelected ? (allSelectedValue ?? filter.placeholder) : filter.selectedSummary
	);
	const fieldLabel = $derived(
		fieldTitle ?? (fieldDisplayMode === 'single-title' && !allSelected ? fieldValue : filter.label)
	);
	const fieldAriaLabel = $derived(
		fieldTitle
			? allSelected
				? fieldTitle
				: `${fieldTitle}: ${fieldValue}`
			: fieldDisplayMode === 'single-title' && !allSelected
				? `${filter.label}: ${fieldValue}`
				: undefined
	);
	const totalSelectedCount = $derived(
		modalFilters.reduce((total, modalFilter) => total + modalFilter.selectedValues.length, 0)
	);
	const allOptionLabel = $derived(allSelectedValue ?? filter.placeholder);
	const listClass = $derived(
		usesModal ? 'ifp__modal-list' : usesGridOptions ? 'ifp__grid' : 'ifp__list'
	);
	const showDone = $derived(usesModal);

	function close(focusTrigger = true) {
		open = false;
		query = '';
		if (usesModal) onModalClose?.(filter.name);
		if (focusTrigger) queueMicrotask(() => triggerElement?.focus({ preventScroll: true }));
	}

	function openPanel() {
		panelMounted = true;
		if (usesModal) {
			modalLockScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		}

		open = true;
		if (usesModal) onModalOpen?.(filter.name);
		window.dispatchEvent(
			new CustomEvent('daynight-inventory-filter-open', { detail: rootElement })
		);
	}

	function togglePanel() {
		if (open) {
			close();
			return;
		}

		openPanel();
	}

	function clearField() {
		const inputs = Array.from(rootElement?.querySelectorAll<HTMLInputElement>('.ifp__input') ?? []);
		const allInput = inputs.find((input) => isAllFilterValue(input.value));

		for (const input of inputs) {
			input.checked = input === allInput;
		}

		allInput?.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function onPick() {
		if (!usesModal && filter.mode === 'single') close(false);
	}

	function onSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') event.preventDefault();
	}

	function switchModalFilter(name: string) {
		if (name === filter.name) return;

		query = '';
		close(false);
		queueMicrotask(() => {
			window.dispatchEvent(
				new CustomEvent('daynight-inventory-filter-switch', { detail: { name } })
			);
		});
	}

	const captureRoot: Attachment<HTMLDivElement> = (element) => {
		rootElement = element;
		const onModalFilterSwitch = (event: Event) => {
			if (!usesModal || !(event instanceof CustomEvent)) return;

			const targetName = event.detail?.name;
			if (typeof targetName !== 'string') return;

			if (targetName === filter.name) {
				openPanel();
				return;
			}

			close(false);
		};

		window.addEventListener('daynight-inventory-filter-switch', onModalFilterSwitch);

		return () => {
			if (rootElement === element) rootElement = undefined;
			window.removeEventListener('daynight-inventory-filter-switch', onModalFilterSwitch);
		};
	};

	const captureTrigger: Attachment<HTMLButtonElement> = (element) => {
		triggerElement = element;
		return () => {
			if (triggerElement === element) triggerElement = undefined;
		};
	};

	const activateOpenPanel: Attachment<HTMLDivElement> = (element) => {
		queueMicrotask(() => {
			const initialFocus =
				element.querySelector<HTMLInputElement>('.ifp__search input') ??
				element.querySelector<HTMLButtonElement>('.ifp__close');

			initialFocus?.focus({ preventScroll: true });
		});
		const onPointerDown = (event: PointerEvent) => {
			if (!usesModal && !usesSidebar && !element.contains(event.target as Node)) {
				close(false);
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				close();
				return;
			}

			if (!usesModal || event.key !== 'Tab') return;

			const focusable = Array.from(
				element.querySelectorAll<HTMLElement>(
					'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)
			).filter((item) => !item.hidden && item.getClientRects().length > 0);
			const first = focusable[0];
			const last = focusable.at(-1);

			if (!first || !last) return;

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};
		const onFieldOpen = (event: Event) => {
			if (event instanceof CustomEvent && event.detail !== element) close(false);
		};
		const previousOverflow = document.body.style.overflow;
		const previousPaddingRight = document.body.style.paddingRight;
		const scrollbarWidth = usesModal ? modalLockScrollbarWidth : 0;

		if (usesModal) {
			document.body.style.overflow = 'hidden';
			if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKey);
		window.addEventListener('daynight-inventory-filter-open', onFieldOpen);

		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKey);
			window.removeEventListener('daynight-inventory-filter-open', onFieldOpen);

			if (usesModal) {
				document.body.style.overflow = previousOverflow;
				document.body.style.paddingRight = previousPaddingRight;
			}
		};
	};
</script>

<!-- Closed, unopened pickers keep only selected-value proxies for the GET form. -->
<div
	class={[
		'ifp',
		open && 'ifp--open',
		usesGridOptions && 'ifp--grid',
		usesModal && 'ifp--modal',
		allFiltersTrigger && 'ifp--all-filters'
	]}
	{@attach captureRoot}
	{@attach open && activateOpenPanel}
	data-name={filter.name}
	data-inventory-filter-field
	data-filter-mode={filter.mode}
	data-filter-presentation={presentation}
>
	<button
		type="button"
		class={[
			'ifp__field',
			(!allSelected || (allFiltersTrigger && totalSelectedCount > 0)) && 'ifp__field--selected',
			showFieldIcon && 'ifp__field--with-icon'
		]}
		{@attach captureTrigger}
		aria-haspopup={usesSidebar ? undefined : 'dialog'}
		aria-controls={`${uid}-filter-panel`}
		aria-expanded={open}
		aria-label={fieldAriaLabel}
		onclick={togglePanel}
	>
		{#if showFieldIcon}
			<span class="ifp__field-icon" aria-hidden="true">
				{#if filter.name === 'brand'}
					<Tag size={18} strokeWidth={1.8} />
				{:else if filter.name === 'model'}
					<CarFront size={19} strokeWidth={1.8} />
				{:else if filter.name === 'priceTo'}
					<Euro size={18} strokeWidth={1.9} />
				{:else if filter.name === 'mileageTo'}
					<Gauge size={19} strokeWidth={1.8} />
				{:else if filter.name === 'fuel'}
					<Fuel size={18} strokeWidth={1.8} />
				{:else if filter.name === 'transmission'}
					<Cog size={19} strokeWidth={1.8} />
				{:else if filter.name === 'bodyType'}
					<Car size={19} strokeWidth={1.8} />
				{:else}
					<SlidersHorizontal size={19} strokeWidth={1.8} />
				{/if}
			</span>
		{/if}
		<span class="ifp__label">{fieldLabel}</span>
		{#if allFiltersTrigger && totalSelectedCount > 0}
			<span class="ifp__field-count">{totalSelectedCount}</span>
		{/if}
		{#if fieldDisplayMode !== 'single-title'}
			<span class={['ifp__value', allSelected && 'ifp__value--placeholder']}>{fieldValue}</span>
		{/if}
		<span class="ifp__chev">
			<ChevronDown size={18} strokeWidth={1.9} aria-hidden="true" />
		</span>
	</button>

	{#if panelMounted}
		{#if usesModal && open}
			<button
				type="button"
				class="ifp__backdrop"
				aria-label="Затвори филтъра"
				onclick={() => close()}
			></button>
		{/if}

		<div
			class={['ifp__panel', usesModal && 'ifp__panel--modal']}
			id={`${uid}-filter-panel`}
			role={usesSidebar ? 'region' : 'dialog'}
			aria-label={filter.label}
			aria-modal={usesModal && open ? 'true' : undefined}
			aria-hidden={!open}
		>
			<div class="ifp__head">
				<div>
					<span>Филтри</span>
					<p>Намерете точния автомобил</p>
				</div>
				{#if usesModal}
					<button type="button" class="ifp__close" aria-label="Затвори" onclick={() => close()}>
						<X size={18} strokeWidth={2.2} aria-hidden="true" />
					</button>
				{/if}
			</div>

			{#if usesModal && modalFilters.length > 0}
				<div class="ifp__modal-tabs" role="tablist" aria-label="Категории филтри">
					{#each modalFilters as modalFilter (modalFilter.name)}
						<button
							type="button"
							role="tab"
							class={['ifp__modal-tab', modalFilter.name === filter.name && 'active']}
							aria-selected={modalFilter.name === filter.name}
							onclick={() => switchModalFilter(modalFilter.name)}
						>
							<span>{modalFilter.label}</span>
							{#if modalFilter.selectedValues.length > 0}
								<small>{modalFilter.selectedValues.length}</small>
							{/if}
						</button>
					{/each}
				</div>
				<p class="ifp__active-filter-label">{filter.label}</p>
			{/if}

			{#if searchable}
				<div class="ifp__search">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
					<input
						type="search"
						id={`${uid}-filter-search`}
						autocomplete="off"
						aria-label={`Търси ${filter.label.toLowerCase()}`}
						placeholder={`Търси ${filter.label.toLowerCase()}...`}
						bind:value={query}
						onkeydown={onSearchKeydown}
					/>
				</div>
			{/if}

			<div class={listClass}>
				<label
					class={usesRowOptions ? 'ifp__row' : 'ifp__chip ifp__chip--all'}
					hidden={Boolean(query)}
				>
					<input
						class="ifp__input"
						type={inputType}
						name={filter.name}
						value=""
						checked={allSelected}
						data-inventory-filter-input
						onchange={onPick}
					/>
					{#if usesRowOptions}
						<span class="ifp__control" aria-hidden="true"></span>
						<span class="ifp__rowlabel">{allOptionLabel}</span>
						<span class="ifp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span>
					{:else}
						<span class="ifp__chiplabel">{allOptionLabel}</span>
					{/if}
				</label>

				{#each filter.options as option (option.value)}
					<label
						class={usesRowOptions ? 'ifp__row' : 'ifp__chip'}
						hidden={searchable && !matches(option.label)}
					>
						<input
							class="ifp__input"
							type={inputType}
							name={filter.name}
							value={option.value}
							checked={isChecked(option.value)}
							data-inventory-filter-input
							onchange={onPick}
						/>
						{#if usesRowOptions}
							<span class="ifp__control" aria-hidden="true"></span>
							{#if option.image}
								<img
									class="ifp__rowimage"
									src={option.image}
									alt=""
									aria-hidden="true"
									loading="lazy"
									decoding="async"
								/>
							{/if}
							<span class="ifp__rowlabel">{option.label}</span>
							{#if typeof option.count === 'number'}<small>{option.count}</small>{/if}
							<span class="ifp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span
							>
						{:else}
							{#if option.image}
								<img src={option.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
							{/if}
							<span class="ifp__chiplabel">{option.label}</span>
							{#if typeof option.count === 'number'}
								<small class="ifp__chipcount">{option.count}</small>
							{/if}
						{/if}
					</label>
				{/each}
			</div>

			{#if searchable && query.trim() && !filter.options.some((option) => matches(option.label))}
				<p class="ifp__empty" role="status">Няма намерени опции.</p>
			{/if}

			{#if showDone}
				<div class="ifp__foot">
					{#if usesModal}
						<button type="button" class="ifp__clear" onclick={clearField}>Изчисти</button>
					{/if}
					<button
						class="ifp__done"
						type={usesModal ? 'submit' : 'button'}
						onclick={() => close(false)}
					>
						Готово
					</button>
				</div>
			{/if}
		</div>
	{:else}
		{#each filter.selectedValues as selectedValue (selectedValue)}
			<input type="hidden" name={filter.name} value={selectedValue} />
		{/each}
	{/if}
</div>

<style>
	.ifp {
		position: relative;
	}

	.ifp--open {
		z-index: 120;
	}

	.ifp__field {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 58px;
		align-content: center;
		gap: 2px;
		border: 1px solid var(--bc-filter-field-border);
		border-radius: 10px;
		background: var(--bc-popover-bg);
		padding: 8px 38px 8px 14px;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.ifp__field:hover {
		border-color: var(--bc-filter-field-hover-border);
		background: var(--bc-filter-field-hover-bg);
	}

	.ifp--all-filters .ifp__field {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent);
		color: var(--bc-white);
	}

	.ifp--all-filters .ifp__field:hover {
		border-color: var(--bc-popover-accent);
		background: var(--bc-filter-done-hover);
		color: var(--bc-white);
	}

	.ifp--open .ifp__field {
		border-color: var(--bc-filter-field-border);
		box-shadow: none;
	}

	.ifp--all-filters .ifp__label,
	.ifp--all-filters .ifp__value,
	.ifp--all-filters .ifp__chev {
		color: var(--bc-white);
	}

	.ifp__field:focus-visible {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.ifp__label {
		overflow: hidden;
		color: var(--bc-filter-label);
		font-size: 11px;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__field-icon {
		position: absolute;
		top: 50%;
		left: 13px;
		display: inline-grid;
		width: 32px;
		height: 32px;
		place-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 9px;
		background: var(--bc-white);
		color: #5f5f5f;
		transform: translateY(-50%);
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.ifp__field:hover .ifp__field-icon,
	.ifp--open .ifp__field-icon,
	.ifp__field--selected .ifp__field-icon {
		border-color: var(--bc-border);
		background: var(--bc-popover-accent-soft);
		color: var(--bc-ink);
	}

	.ifp--all-filters .ifp__field-icon {
		border-color: rgb(255 255 255 / 0.28);
		background: rgb(255 255 255 / 0.14);
		color: var(--bc-white);
	}

	.ifp__field-count {
		position: absolute;
		top: 50%;
		right: 43px;
		display: inline-grid;
		min-width: 22px;
		height: 22px;
		place-items: center;
		border-radius: 999px;
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
		transform: translateY(-50%);
	}

	.ifp__value {
		overflow: hidden;
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 650;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__value--placeholder {
		color: var(--bc-popover-muted-strong);
		font-weight: 550;
	}

	.ifp__chev {
		position: absolute;
		top: 50%;
		right: 12px;
		display: flex;
		color: var(--bc-popover-icon);
		transform: translateY(-50%);
		transition: transform 0.18s ease;
	}

	.ifp--open .ifp__chev {
		color: var(--bc-popover-icon-active);
		transform: translateY(-50%) rotate(180deg);
	}

	.ifp__backdrop {
		position: fixed;
		inset: 0;
		z-index: 10000;
		border: 0;
		background: var(--bc-filter-backdrop);
		cursor: default;
	}

	.ifp__panel {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		z-index: 1001;
		display: none;
		box-sizing: border-box;
		width: min(520px, calc(100vw - 40px));
		max-width: calc(100vw - 40px);
		border: 1px solid var(--bc-filter-panel-border);
		border-radius: 12px;
		background: var(--bc-popover-bg);
		padding: 13px;
		box-shadow: var(--bc-filter-panel-shadow);
	}

	.ifp__panel--modal {
		position: fixed;
		top: 50%;
		right: 0;
		left: 0;
		z-index: 10001;
		display: none;
		width: min(760px, calc(100vw - 48px));
		max-height: calc(100dvh - 48px);
		margin: 0 auto;
		padding: 0;
		border-color: var(--bc-filter-modal-border);
		border-radius: 20px;
		background: var(--bc-popover-bg);
		box-shadow: var(--bc-filter-modal-shadow);
		overflow: hidden;
		transform: translateY(-50%);
	}

	.ifp--grid .ifp__panel {
		width: min(544px, calc(100vw - 40px));
	}

	.ifp--open .ifp__panel {
		display: grid;
		gap: 12px;
	}

	.ifp--open .ifp__panel--modal {
		gap: 0;
		grid-template-rows: auto auto auto auto minmax(0, 1fr) auto;
	}

	.ifp__head {
		display: none;
	}

	.ifp__panel--modal .ifp__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		border-bottom: 1px solid var(--bc-popover-footer-line);
		padding: 22px 24px 18px;
	}

	.ifp__head p {
		margin: 0;
		color: var(--bc-filter-heading);
		font-size: 24px;
		font-weight: 700;
		line-height: 30px;
	}

	.ifp__head span {
		display: block;
		margin-bottom: 2px;
		color: var(--bc-popover-accent);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.ifp__close {
		display: inline-grid;
		width: 34px;
		height: 34px;
		place-items: center;
		border: 1px solid var(--bc-filter-close-border);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-filter-close-bg);
		color: var(--bc-filter-close-ink);
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.ifp__close:hover {
		background: var(--bc-filter-close-hover-bg);
		color: var(--bc-ink);
	}

	.ifp__search {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 10px;
		background: var(--bc-popover-surface);
		padding: 0 12px;
		height: 44px;
		color: var(--bc-subtle);
	}

	.ifp__panel--modal .ifp__search {
		height: 48px;
		margin: 0 24px 14px;
		border: 1px solid var(--bc-border);
		background: var(--bc-popover-bg);
	}

	.ifp__modal-tabs {
		display: grid;
		gap: 8px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-bottom: 1px solid var(--bc-popover-footer-line);
		background: #f5f6f7;
		padding: 14px 24px;
	}

	.ifp__modal-tab {
		display: inline-flex;
		min-width: 0;
		min-height: 42px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid #dde0e4;
		border-radius: 10px;
		background: #ffffff;
		color: #353535;
		cursor: pointer;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
		padding: 7px 10px;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	.ifp__modal-tab:hover {
		border-color: var(--bc-popover-accent);
		background: #fff1f2;
		color: #1c1c1c;
	}

	.ifp__modal-tab.active {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent);
		color: #ffffff;
	}

	.ifp__modal-tab small {
		display: inline-grid;
		min-width: 20px;
		height: 20px;
		place-items: center;
		border-radius: 999px;
		background: rgb(28 28 28 / 0.1);
		color: inherit;
		font-size: 11px;
		font-weight: 700;
		line-height: 1;
	}

	.ifp__active-filter-label {
		margin: 16px 24px 10px;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 650;
		line-height: 22px;
	}

	.ifp__search input {
		width: 100%;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none !important;
		padding: 0;
		color: var(--bc-ink);
		font: inherit;
		font-size: 14.5px;
		font-weight: 500;
		outline: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	.ifp__search input::-webkit-search-cancel-button,
	.ifp__search input::-webkit-search-decoration {
		appearance: none;
		-webkit-appearance: none;
	}

	.ifp__grid {
		display: grid;
		max-height: min(640px, calc(100vh - 180px));
		gap: 8px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.ifp__list,
	.ifp__modal-list {
		display: grid;
		max-height: min(640px, calc(100vh - 180px));
		gap: 4px;
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.ifp__modal-list {
		max-height: min(320px, calc(100dvh - 390px));
		margin: 0 20px;
		padding: 0 4px 8px;
	}

	.ifp__input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.ifp__chip {
		display: flex;
		min-height: 62px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1.5px solid transparent;
		border-radius: 11px;
		background: var(--bc-popover-chip-bg);
		padding: 6px;
		color: var(--bc-popover-chip-ink);
		font-size: 12.5px;
		font-weight: 600;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.ifp__chip:hover {
		border-color: var(--bc-popover-chip-border-hover);
		background: var(--bc-popover-chip-hover);
	}

	.ifp__chip:has(.ifp__input:checked) {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.ifp__chip img {
		max-width: 42px;
		max-height: 26px;
		object-fit: contain;
	}

	.ifp__mono {
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

	.ifp__chiplabel {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__chipcount {
		color: var(--bc-subtle);
		font-size: 11px;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.01em;
	}

	.ifp__chip:has(.ifp__input:checked) .ifp__chipcount {
		color: var(--bc-filter-chip-count-active);
	}

	.ifp__chip--all {
		min-height: 46px;
		flex-direction: row;
		grid-column: 1 / -1;
		gap: 8px;
	}

	.ifp__row {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 42px;
		align-items: center;
		gap: 10px;
		border: 1.5px solid transparent;
		border-radius: 10px;
		background: var(--bc-popover-chip-bg);
		padding: 10px 13px;
		color: var(--bc-popover-chip-ink);
		font-size: 14.5px;
		font-weight: 600;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.ifp__panel--modal .ifp__row {
		min-height: 44px;
		background: transparent;
		padding: 8px 8px;
		color: var(--bc-filter-modal-row-ink);
		font-size: 15px;
		font-weight: 600;
	}

	.ifp__row:hover {
		background: var(--bc-popover-chip-hover);
	}

	.ifp__panel--modal .ifp__row:hover {
		background: var(--bc-filter-modal-row-hover);
	}

	.ifp__row:has(.ifp__input:checked) {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent-soft);
	}

	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) {
		border-color: transparent;
		background: var(--bc-filter-modal-row-selected);
	}

	.ifp__control {
		display: inline-grid;
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		place-items: center;
		border: 1px solid var(--bc-filter-control-border);
		border-radius: 5px;
		background: var(--bc-popover-bg);
	}

	.ifp__panel--modal .ifp__control {
		display: inline-grid;
	}

	.ifp__row:has(.ifp__input:checked) .ifp__control,
	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) .ifp__control {
		border-color: var(--bc-popover-accent);
		background: var(--bc-popover-accent);
	}

	.ifp__row:has(.ifp__input:checked) .ifp__control::after,
	.ifp__panel--modal .ifp__row:has(.ifp__input:checked) .ifp__control::after {
		width: 9px;
		height: 6px;
		border-bottom: 2px solid var(--bc-white);
		border-left: 2px solid var(--bc-white);
		content: '';
		transform: rotate(-45deg);
	}

	.ifp__rowimage {
		width: 28px;
		height: 18px;
		object-fit: contain;
	}

	.ifp__rowlabel {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__row small {
		flex: 0 0 auto;
		color: var(--bc-popover-subtle);
		font-size: 12px;
		font-weight: 700;
	}

	.ifp__tick {
		display: flex;
		color: var(--bc-popover-icon-active);
		opacity: 0;
	}

	.ifp__row:has(.ifp__input:checked) .ifp__tick {
		opacity: 1;
	}

	.ifp__panel--modal .ifp__tick {
		display: none;
	}

	.ifp__foot {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
		border-top: 1px solid var(--bc-popover-footer-line);
		padding-top: 11px;
	}

	.ifp__panel--modal .ifp__foot {
		justify-content: space-between;
		margin: 0;
		padding: 14px 24px;
		background: var(--bc-popover-bg);
		border-radius: 0 0 20px 20px;
	}

	.ifp__done,
	.ifp__clear {
		border: 0;
		border-radius: 9px;
		padding: 10px 18px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	.ifp__done {
		background: var(--bc-ink);
		color: var(--bc-white);
	}

	.ifp__clear {
		background: var(--bc-popover-clear-bg);
		color: var(--bc-popover-clear-ink);
	}

	.ifp__done:hover {
		background: var(--bc-filter-done-hover);
	}

	.ifp__clear:hover {
		background: var(--bc-filter-clear-hover);
	}

	@media (max-width: 575px) {
		.ifp__panel--modal {
			top: 50%;
			width: calc(100vw - 24px);
			max-height: calc(100vh - 48px);
			transform: translateY(-50%);
		}

		.ifp__modal-tabs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	.ifp__empty {
		margin: 0;
		padding: 12px 4px;
		color: var(--bc-muted);
		font-size: 14px;
	}
</style>
