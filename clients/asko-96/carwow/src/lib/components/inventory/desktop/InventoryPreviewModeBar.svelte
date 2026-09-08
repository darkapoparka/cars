<script lang="ts">
	type InventoryLayoutMode = 'grid' | 'sidebar';
	type InventoryFilterUxMode = 'popover' | 'modal';

	let {
		layoutMode = 'grid',
		filterUxMode = 'popover',
		onLayoutChange,
		onFilterUxChange
	}: {
		layoutMode?: InventoryLayoutMode;
		filterUxMode?: InventoryFilterUxMode;
		onLayoutChange?: (mode: InventoryLayoutMode) => void;
		onFilterUxChange?: (mode: InventoryFilterUxMode) => void;
	} = $props();

	const layoutOptions = [
		{ value: 'grid' as const, label: 'Лента', hint: 'Филтри над автомобилите' },
		{ value: 'sidebar' as const, label: 'Странично', hint: 'Филтри в лява колона' }
	];

	const filterOptions = [
		{ value: 'popover' as const, label: 'Меню', hint: 'Падащи менюта в страницата' },
		{ value: 'modal' as const, label: 'Прозорец', hint: 'Филтри в отделен прозорец' }
	];
</script>

<section class="daynight-preview-bar" aria-label="Режим за преглед на филтрите">
	<div class="daynight-preview-bar__inner">
		<div class="daynight-preview-bar__groups">
			<div class="daynight-preview-seg" role="group" aria-label="Оформление на филтрите">
				<span class="daynight-preview-seg__caption">Оформление</span>
				<div class="daynight-preview-seg__track">
					{#each layoutOptions as option (option.value)}
						<button
							type="button"
							class={['daynight-preview-seg__btn', { active: layoutMode === option.value }]}
							aria-pressed={layoutMode === option.value}
							title={option.hint}
							onclick={() => onLayoutChange?.(option.value)}
						>
							<span>{option.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="daynight-preview-seg" role="group" aria-label="Начин на отваряне на филтрите">
				<span class="daynight-preview-seg__caption">Филтри</span>
				<div class="daynight-preview-seg__track">
					{#each filterOptions as option (option.value)}
						<button
							type="button"
							class={['daynight-preview-seg__btn', { active: filterUxMode === option.value }]}
							aria-pressed={filterUxMode === option.value}
							title={option.hint}
							onclick={() => onFilterUxChange?.(option.value)}
						>
							<span>{option.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.daynight-preview-bar {
		background: #fff;
		border: 0;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: none;
		margin: 0;
		margin-left: calc(50% - 50vw);
		position: relative;
		width: 100vw;
		z-index: 20;
	}

	.daynight-preview-bar__inner {
		align-items: center;
		display: flex;
		justify-content: center;
		margin: 0 auto;
		max-width: 1560px;
		min-height: 52px;
		padding-block: 6px;
		width: calc(100% - 48px);
	}

	.daynight-preview-bar__groups {
		align-items: flex-end;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
		justify-self: center;
	}

	.daynight-preview-seg {
		display: grid;
		gap: 5px;
	}

	.daynight-preview-seg__caption {
		color: #667085;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.2;
		padding-left: 2px;
		text-transform: uppercase;
	}

	.daynight-preview-seg__track {
		align-items: center;
		background: #fff;
		border: 1px solid #d9dee7;
		border-radius: 8px;
		display: inline-flex;
		gap: 3px;
		padding: 3px;
	}

	.daynight-preview-seg__btn {
		align-items: center;
		appearance: none;
		background: transparent;
		border: 0;
		border-radius: 6px;
		color: #101828 !important;
		cursor: pointer;
		display: inline-flex;
		font: inherit;
		font-size: 16px;
		font-weight: 600;
		gap: 7px;
		line-height: 1;
		min-height: 32px;
		padding: 0 14px;
		transition:
			background-color 120ms ease,
			color 150ms ease,
			opacity 120ms ease;
	}

	.daynight-preview-seg__btn span {
		color: inherit !important;
	}

	.daynight-preview-seg__btn:hover {
		background: #f3f5f8;
		color: #101828 !important;
	}

	/* Blue = selected state; red stays reserved for commerce CTAs. */
	.daynight-preview-seg__btn.active {
		background: var(--sa-red);
		box-shadow: none;
		color: #fff !important;
	}

	.daynight-preview-seg__btn:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}

	@media (max-width: 991px) {
		.daynight-preview-bar__inner {
			flex-wrap: wrap;
			width: calc(100% - 32px);
		}

		.daynight-preview-bar__groups {
			justify-content: center;
			width: 100%;
		}

		.daynight-preview-seg {
			flex: 1 1 200px;
		}

		.daynight-preview-seg__track {
			display: flex;
		}

		.daynight-preview-seg__btn {
			flex: 1 1 0;
			justify-content: center;
		}
	}

	@media (max-width: 575px) {
		.daynight-preview-bar {
			display: none;
		}
	}
</style>
