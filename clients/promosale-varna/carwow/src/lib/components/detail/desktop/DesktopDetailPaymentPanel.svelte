<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	type PaymentMode = 'cash' | 'finance';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let activePaymentMode = $state<PaymentMode>('finance');
	let isVatDropdownOpen = $state(false);

	const vatRows = $derived([
		{ id: 'price', label: i18n.t('copy.bbae2b0a216e'), value: i18n.stock(vehicle.priceBgn) },
		{ id: 'tax', label: i18n.t('copy.76624ccd4357'), value: i18n.text('уточняват се') },
		{ id: 'total', label: i18n.t('copy.b57f86f937c9'), value: i18n.stock(vehicle.priceBgn) }
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
						{i18n.t('copy.5f8a8d446cf5')}
					</button>
				</li>
				<li class={activePaymentMode === 'finance' ? 'active' : undefined}>
					<button
						type="button"
						class="pdp-sidebar-tab"
						onclick={() => selectPaymentMode('finance')}
						onkeydown={(event) => handlePaymentKeydown(event, 'finance')}
					>
						{i18n.t('copy.6e55eeb12cce')}
					</button>
				</li>
			</ul>
		</div>

		<div class="content-tab visible">
			<div class={['content-inner', activePaymentMode === 'cash' && 'active']}>
				<p class="h5 mb-4">{i18n.t('copy.bbae2b0a216e')}</p>
				<p class="pdp-payment-price mb-4">
					<span class="pdp-payment-price__cash">{vehicle.priceEur}</span>
				</p>
				<p class="text-secondary mb-16">{i18n.t('copy.8ea4d30f38f1')}</p>

				<p class="flex items-center gap-8">
					<img
						src={i18n.asset('/assets/icons/Info.svg')}
						alt=""
						aria-hidden="true"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					<a href={i18n.href(resolve('/terms'))} class="text-underline text-highlight"
						>{i18n.t('copy.879dd3a420c9')}</a
					>
				</p>
			</div>

			<div class={['content-inner', activePaymentMode === 'finance' && 'active']}>
				<p class="h5 mb-4">{i18n.t('copy.bbae2b0a216e')}</p>
				<p class="pdp-payment-price pdp-payment-price--stacked mb-4">
					<span class="pdp-payment-price__cash">{vehicle.priceEur}</span>
					<span class="pdp-payment-price__monthly">{i18n.spec(vehicle.monthly)}</span>
				</p>
				<p class="text-secondary mb-4">{i18n.t('copy.ec632c0e2888')}</p>
				<p class="text-secondary mb-16">{i18n.t('copy.8f14e90acd70')}</p>

				<div class={['core-dropdown flex items-center gap-8', isVatDropdownOpen && 'active']}>
					<img
						src={i18n.asset('/assets/icons/Info.svg')}
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
						{i18n.t('copy.879dd3a420c9')}
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
		font-size: var(--sa-type-page);
		font-weight: var(--sa-weight-strong);
		line-height: 1.08;
	}

	.pdp-payment-price__monthly {
		color: #4b5563;
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-medium);
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
