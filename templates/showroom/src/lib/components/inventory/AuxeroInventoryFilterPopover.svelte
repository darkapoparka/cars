<script lang="ts">
	import type {
		AuxeroInventoryFilter,
		AuxeroInventoryDesktopData
	} from '$lib/auxero/inventory-desktop';
	import { Check, ChevronDown, Search, X } from '@lucide/svelte';
	import type { Attachment } from 'svelte/attachments';

	let {
		allSelectedValue,
		filter,
		onModalClose,
		onModalOpen,
		fieldDisplayMode = 'label-value',
		optionLayout = 'auto',
		presentation = 'popover'
	}: {
		allSelectedValue?: string;
		filter: AuxeroInventoryFilter;
		onModalClose?: (name: string) => void;
		onModalOpen?: (name: string) => void;
		fieldDisplayMode?: 'label-value' | 'single-title';
		optionLayout?: 'auto' | 'grid' | 'list';
		presentation?: AuxeroInventoryDesktopData['filterPresentation'];
	} = $props();

	const uid = $props.id();
	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);
	const hasImages = $derived(filter.options.some((option) => option.image));
	const searchable = $derived(filter.options.length > 8);
	const usesModal = $derived(presentation === 'modal');
	const usesGridOptions = $derived(
		!usesModal && (optionLayout === 'grid' || (optionLayout === 'auto' && hasImages))
	);
	const usesRowOptions = $derived(!usesGridOptions);

	let open = $state(false);
	let query = $state('');
	let rootElement: HTMLDivElement | undefined;
	let triggerElement: HTMLButtonElement | undefined;
	let modalLockScrollY = 0;
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
		fieldDisplayMode === 'single-title' && !allSelected ? fieldValue : filter.label
	);
	const fieldAriaLabel = $derived(
		fieldDisplayMode === 'single-title' && !allSelected
			? `${filter.label}: ${fieldValue}`
			: undefined
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
		if (focusTrigger) queueMicrotask(() => triggerElement?.focus());
	}

	function openPanel() {
		if (usesModal) {
			modalLockScrollY = window.scrollY;
			modalLockScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		}

		open = true;
		if (usesModal) onModalOpen?.(filter.name);
		window.dispatchEvent(
			new CustomEvent('eliqauto-inventory-filter-open', { detail: rootElement })
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
		if (!usesModal && filter.mode === 'single') close();
	}

	function onSearchKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') event.preventDefault();
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

		window.addEventListener('eliqauto-inventory-filter-switch', onModalFilterSwitch);

		return () => {
			if (rootElement === element) rootElement = undefined;
			window.removeEventListener('eliqauto-inventory-filter-switch', onModalFilterSwitch);
		};
	};

	const captureTrigger: Attachment<HTMLButtonElement> = (element) => {
		triggerElement = element;
		return () => {
			if (triggerElement === element) triggerElement = undefined;
		};
	};

	const activateOpenPanel: Attachment<HTMLDivElement> = (element) => {
		queueMicrotask(() =>
			element.querySelector<HTMLInputElement>('.ifp__search input')?.focus({ preventScroll: true })
		);
		const onOutsideClick = (event: MouseEvent) => {
			if (!usesModal && !element.contains(event.target as Node)) {
				close(false);
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};
		const onFieldOpen = (event: Event) => {
			if (event instanceof CustomEvent && event.detail !== element) close(false);
		};
		const previousOverflow = document.body.style.overflow;
		const previousPaddingRight = document.body.style.paddingRight;
		const previousPosition = document.body.style.position;
		const previousTop = document.body.style.top;
		const previousRight = document.body.style.right;
		const previousLeft = document.body.style.left;
		const previousWidth = document.body.style.width;
		const previousScrollY = usesModal ? modalLockScrollY : window.scrollY;
		const scrollbarWidth = usesModal
			? modalLockScrollbarWidth
			: window.innerWidth - document.documentElement.clientWidth;

		if (usesModal) {
			window.scrollTo(0, previousScrollY);
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.top = `-${previousScrollY}px`;
			document.body.style.right = '0';
			document.body.style.left = '0';
			document.body.style.width = '100%';
			if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
		}

		// Dismiss after the click lands: inline sidebar panels otherwise move the next trigger on pointerdown.
		document.addEventListener('click', onOutsideClick);
		document.addEventListener('keydown', onKey);
		window.addEventListener('eliqauto-inventory-filter-open', onFieldOpen);

		return () => {
			document.removeEventListener('click', onOutsideClick);
			document.removeEventListener('keydown', onKey);
			window.removeEventListener('eliqauto-inventory-filter-open', onFieldOpen);

			if (usesModal) {
				document.body.style.overflow = previousOverflow;
				document.body.style.paddingRight = previousPaddingRight;
				document.body.style.position = previousPosition;
				document.body.style.top = previousTop;
				document.body.style.right = previousRight;
				document.body.style.left = previousLeft;
				document.body.style.width = previousWidth;
				window.scrollTo(0, previousScrollY);
			}
		};
	};
</script>

<!--
	The option inputs stay mounted even when the picker is closed, preserving the
	existing GET form contract. Popover changes submit immediately via the parent
	form change handler; modal changes are staged until the footer submit button.
-->
<div
	class={['ifp', open && 'ifp--open', usesGridOptions && 'ifp--grid', usesModal && 'ifp--modal']}
	{@attach captureRoot}
	{@attach open && activateOpenPanel}
	data-name={filter.name}
	data-inventory-filter-field
	data-filter-mode={filter.mode}
	data-filter-presentation={presentation}
>
	<button
		type="button"
		class={['ifp__field', !allSelected && 'ifp__field--selected']}
		{@attach captureTrigger}
		aria-haspopup="dialog"
		aria-expanded={open}
		aria-label={fieldAriaLabel}
		onclick={togglePanel}
	>
		<span class="ifp__label">{fieldLabel}</span>
		{#if fieldDisplayMode !== 'single-title'}
			<span class={['ifp__value', allSelected && 'ifp__value--placeholder']}>{fieldValue}</span>
		{/if}
		<span class="ifp__chev"><ChevronDown size={20} strokeWidth={2.25} aria-hidden="true" /></span>
	</button>

	{#if usesModal && open}
		<button type="button" class="ifp__backdrop" aria-label="Затвори филтъра" onclick={() => close()}
		></button>
	{/if}

	<div
		class={['ifp__panel', usesModal && 'ifp__panel--modal']}
		role="dialog"
		aria-label={filter.label}
		aria-modal={usesModal && open ? 'true' : undefined}
		aria-hidden={!open}
	>
		<div class="ifp__head">
			<p>{filter.label}</p>
			{#if usesModal}
				<button type="button" class="ifp__close" aria-label="Затвори" onclick={() => close()}>
					<X size={18} strokeWidth={2.2} aria-hidden="true" />
				</button>
			{/if}
		</div>

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
						<span class="ifp__tick"><Check size={16} strokeWidth={2.6} aria-hidden="true" /></span>
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

	.ifp--open .ifp__field {
		border-color: var(--bc-popover-accent);
		box-shadow: none;
	}

	.ifp__field:focus-visible {
		outline: 2px solid var(--bc-popover-focus);
		outline-offset: 2px;
	}

	.ifp__label {
		overflow: hidden;
		color: var(--bc-filter-label);
		font-size: var(--bc-text-caption, 15px);
		font-weight: 600;
		line-height: var(--bc-leading-caption, 1.35);
		letter-spacing: 0;
		text-transform: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ifp__value {
		overflow: hidden;
		color: var(--bc-ink);
		font-size: var(--bc-text-control, 18px);
		font-weight: 700;
		line-height: var(--bc-leading-control, 1.25);
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
		top: clamp(252px, 32vh, 290px);
		right: 0;
		left: 0;
		z-index: 10001;
		display: none;
		width: min(500px, calc(100vw - 32px));
		max-height: calc(100vh - 292px);
		margin: 0 auto;
		padding: 16px;
		border-color: var(--bc-filter-modal-border);
		border-radius: 18px;
		background: var(--bc-popover-bg);
		box-shadow: var(--bc-filter-modal-shadow);
		transform: none;
	}

	.ifp--grid .ifp__panel {
		width: min(544px, calc(100vw - 40px));
	}

	.ifp--open .ifp__panel {
		display: grid;
		gap: 12px;
	}

	.ifp__head {
		display: none;
	}

	.ifp__panel--modal .ifp__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.ifp__head p {
		margin: 0;
		color: var(--bc-filter-heading);
		font-size: 18px;
		font-weight: 800;
		line-height: 24px;
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
		height: 46px;
		border: 1px solid var(--bc-border);
		background: var(--bc-popover-bg);
	}

	.ifp__search input {
		width: 100%;
		height: auto;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
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
		max-height: min(270px, calc(100vh - 420px));
		margin: 0 -4px;
		padding: 0 4px;
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
		font-size: var(--bc-text-micro);
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
		font-size: var(--bc-text-micro);
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
		margin: 0 -16px -16px;
		padding: 12px 16px;
		background: var(--bc-popover-bg);
		border-radius: 0 0 18px 18px;
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
			top: 24px;
			max-height: calc(100vh - 48px);
			transform: none;
		}
	}
</style>
