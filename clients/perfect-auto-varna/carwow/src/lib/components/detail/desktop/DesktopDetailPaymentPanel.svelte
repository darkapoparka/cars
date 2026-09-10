<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	type PaymentMode = 'cash' | 'finance';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let activePaymentMode = $state<PaymentMode>('finance');
	let isVatDropdownOpen = $state(false);

	const vatRows = $derived([
		{ id: 'price', label: 'Цена:', value: vehicle.priceBgn },
		{ id: 'tax', label: 'Данък върху МПС:', value: 'уточняват се' },
		{ id: 'total', label: 'Цена с данък:', value: vehicle.priceBgn }
	]);

	function selectPaymentMode(mode: PaymentMode) {
		activePaymentMode = mode;
	}

	function handlePaymentKeydown(event: KeyboardEvent, mode: PaymentMode) {
		if (event.key !== 'Enter' && event.key !== ' ') {
			return;
		}

		event.preventDefault();
		selectPaymentMode(mode);
	}

	function toggleVatDropdown() {
		isVatDropdownOpen = !isVatDropdownOpen;
	}
</script>

<div class="listing-details--sidebar-box mb-40">
	<div class="flat-tabs">
		<div class="mb-15 overflow-x-auto">
			<ul class="menu-tab menu-tab-style5 grid-cols-2">
				<li class={activePaymentMode === 'cash' ? 'active' : undefined}>
					<button
						type="button"
						class="pdp-sidebar-tab"
						onclick={() => selectPaymentMode('cash')}
						onkeydown={(event) => handlePaymentKeydown(event, 'cash')}
					>
						В брой
					</button>
				</li>
				<li class={activePaymentMode === 'finance' ? 'active' : undefined}>
					<button
						type="button"
						class="pdp-sidebar-tab"
						onclick={() => selectPaymentMode('finance')}
						onkeydown={(event) => handlePaymentKeydown(event, 'finance')}
					>
						Финансиране
					</button>
				</li>
			</ul>
		</div>

		<div class="content-tab visible">
			<div class={['content-inner', activePaymentMode === 'cash' && 'active']}>
				<p class="h5 mb-4">Цена:</p>
				<p class="pdp-payment-price mb-4">
					<span class="pdp-payment-price__cash">{vehicle.priceEur}</span>
				</p>
				<p class="text-secondary mb-16">Цена без данъци и такси</p>

				<p class="flex items-center gap-8">
					<img
						src="/variant-3/assets/icons/Info.svg"
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					<a href={resolve('/terms')} class="text-underline text-highlight">Автомобил по ДДС</a>
				</p>
			</div>

			<div class={['content-inner', activePaymentMode === 'finance' && 'active']}>
				<p class="h5 mb-4">Цена:</p>
				<p class="pdp-payment-price pdp-payment-price--stacked mb-4">
					<span class="pdp-payment-price__cash">{vehicle.priceEur}</span>
					<span class="pdp-payment-price__monthly">{vehicle.monthly}</span>
				</p>
				<p class="text-secondary mb-4">Вноска без данъци и такси</p>
				<p class="text-secondary mb-16">Първоначална вноска · 72 мес. · 7.89% ГПР</p>

				<div class={['core-dropdown flex items-center gap-8', isVatDropdownOpen && 'active']}>
					<img
						src="/variant-3/assets/icons/Info.svg"
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					<button
						type="button"
						class="pdp-vat-toggle text-underline text-highlight"
						id="coreDropdownBtn"
						aria-expanded={isVatDropdownOpen}
						aria-controls="coreDropdownMenu"
						onclick={toggleVatDropdown}
					>
						Автомобил по ДДС
					</button>
					<div class="core-dropdown__menu" id="coreDropdownMenu">
						<ul class="core-dropdown__list">
							{#each vatRows as row (row.id)}
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">{row.label}</p>
									<p class="font-weight-600">{row.value}</p>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.pdp-sidebar-tab {
		all: unset;
		cursor: pointer;
		display: block;
		text-align: center;
		width: 100%;
	}

	.pdp-vat-toggle {
		background: transparent;
		border: 0;
		color: inherit;
		cursor: pointer;
		font: inherit;
		padding: 0;
	}

	.pdp-payment-price {
		align-items: baseline;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 0;
	}

	.pdp-payment-price--stacked {
		align-items: flex-start;
		flex-direction: column;
		gap: 4px;
	}

	.pdp-payment-price__cash {
		color: #1c1c1c;
		font-size: 32px;
		font-weight: 700;
		line-height: 1.08;
	}

	.pdp-payment-price__monthly {
		color: #4b5563;
		font-size: 18px;
		font-weight: 500;
		line-height: 1.3;
	}

	.content-tab > .content-inner {
		left: 0;
		opacity: 0;
		position: absolute;
		top: 0;
		transform: scale(0.9) translate(0, 0%);
		transition: none;
		visibility: hidden;
		width: 100%;
		z-index: -1;
	}

	.content-tab > .content-inner.active {
		opacity: 1;
		position: relative;
		transform: scale(1) translate(0, 0%);
		transition: none;
		visibility: visible;
		z-index: 1;
	}
</style>
