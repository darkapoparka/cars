<script lang="ts">
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import { desktopSortOptions, type DesktopSortKey } from './desktop-inventory-sort';

	let { buttonLabel }: { buttonLabel?: string } = $props();

	// The map page mounts this dropdown WITHOUT the inventory context (it has no
	// reactive grid to sort), so the context is optional — fall back to local state
	// there. On /inventory it drives the shared store; the grid re-derives reactively.
	const inventory = (() => {
		try {
			return getDesktopInventoryContext();
		} catch {
			return undefined;
		}
	})();

	let localSort = $state<DesktopSortKey>('best-match');
	const selectedValue = $derived(inventory ? inventory.sort : localSort);
	const selectedLabel = $derived(
		desktopSortOptions.find((option) => option.value === selectedValue)?.label ?? 'Най-подходящи'
	);
	const triggerLabel = $derived(buttonLabel ?? selectedLabel);

	let isOpen = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(value: DesktopSortKey) {
		if (inventory) {
			inventory.sort = value;
		} else {
			localSort = value;
		}
		isOpen = false;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (
			isOpen &&
			event.target instanceof Element &&
			!event.target.closest('.daynight-sort-dropdown')
		) {
			isOpen = false;
		}
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:document onclick={handleDocumentClick} onkeydown={handleDocumentKeydown} />

<div class={['core-dropdown', 'daynight-sort-dropdown', isOpen && 'is-open']}>
	<button
		class="core-dropdown__button"
		type="button"
		id="coreDropdownBtn"
		aria-expanded={isOpen}
		aria-label={buttonLabel ? `${buttonLabel}: ${selectedLabel}` : undefined}
		title={buttonLabel ? `${buttonLabel}: ${selectedLabel}` : undefined}
		onclick={toggleDropdown}
	>
		<span class="core-dropdown__selected">{triggerLabel}</span>
		<img src="/assets/icons/chevron-down-primary.svg" alt="chevron" class="core-dropdown__icon" />
	</button>
	<div class="core-dropdown__menu" id="coreDropdownMenu">
		<ul class="core-dropdown__list">
			{#each desktopSortOptions as option (option.value)}
				<li class="core-dropdown__item">
					<button
						type="button"
						class={option.value === selectedValue
							? 'core-dropdown__option active'
							: 'core-dropdown__option'}
						data-value={option.value}
						onclick={() => selectOption(option.value)}
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.core-dropdown__option {
		appearance: none;
		background: transparent;
		border: 0;
		font: inherit;
		text-align: left;
		width: 100%;
	}

	.daynight-sort-dropdown .core-dropdown__menu {
		background: #fff;
		border: 1px solid #e6eaf0;
		border-radius: 10px;
		box-shadow: 0 10px 22px rgba(16, 24, 40, 0.1);
		/* Overlay the menu instead of letting it reserve space in the toolbar flow.
		   app.css used to supply `position: absolute` on `.core-dropdown__menu`; it was
		   dropped with the legacy stack, so set it here (root is position: relative). */
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		z-index: 30;
		min-width: 100%;
		opacity: 0;
		pointer-events: none;
		transform: translateY(-4px);
		transition: none;
		visibility: hidden;
	}

	.daynight-sort-dropdown.is-open .core-dropdown__menu {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
		transition:
			opacity 110ms ease-out,
			transform 110ms ease-out;
		visibility: visible;
	}
</style>
