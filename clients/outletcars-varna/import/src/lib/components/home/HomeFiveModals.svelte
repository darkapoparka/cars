<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeaderData,
		HomeFiveModalVehicle,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import AuthModal from '$lib/components/forms/AuthModal.svelte';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';

	let {
		copy,
		header,
		modals
	}: {
		copy: HomePageCopy;
		header?: HomeFiveHeaderData;
		modals?: HomeFiveModalsData;
	} = $props();

	const closeIcon = '/assets/icons/close-modal.svg';
	const searchPlaceholder = $derived(
		header?.ui.searchPlaceholder ?? 'Search OUTLETCARS.BG — Варна inventory'
	);
	const garage = getGarageContext();
	const isEnglish = $derived(copy.compareTitle === 'Compare Top Rated Vehicles');
	const pickerTitle = $derived(isEnglish ? 'Choose vehicles' : 'Избери автомобили');
	const pickerHint = $derived(
		isEnglish
			? 'Select at least two vehicles to compare.'
			: 'Избери поне два автомобила, за да ги сравниш.'
	);

	const toggleCompare = (slug: string) => {
		if (garage.isCompared(slug)) {
			garage.removeCompare(slug);
			return;
		}

		garage.addCompare(slug);
	};

	const closeComparePicker = () => garage.closeComparePicker();
	const handleCompareKeydown = (event: KeyboardEvent) => {
		if (!garage.comparePickerOpen) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closeComparePicker();
			return;
		}

		if (event.key !== 'Tab') return;
		const compareModalElement = document.getElementById('CompareModal');
		if (!compareModalElement) return;
		const focusable = Array.from(
			compareModalElement.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		).filter((element) => !element.hasAttribute('aria-hidden'));
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last?.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};
</script>

<svelte:window onkeydown={handleCompareKeydown} />

{#if modals}
	<!-- Modal -->
	<div id="CardModal" class="modal">
		<div class="bg-modal"></div>
		<div class="modal-content">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<div class="card-details">
						<div class="mb-40 flex">
							<div class="w-24"></div>
							<div class="grid w-76 grid-cols-2 gap-60">
								{@render cardModalVehicle(modals.cardCompare.left)}
								{@render cardModalVehicle(modals.cardCompare.right)}
							</div>
						</div>

						<table class="card-details--table">
							<tbody>
								{#each modals.cardCompare.rows as row (row.label)}
									<tr>
										<td>
											<div class="flex items-center gap-8">
												<img src={`/assets/icons/${row.icon}`} alt={row.label} />
												<span>{row.label}:</span>
											</div>
										</td>
										<td>{row.left}</td>
										<td>{row.right}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /Modal -->

	<!-- LoginModal -->
	<AuthModal variant="login" {closeIcon} />
	<!-- /LoginModal -->

	<!-- ForgotPasswordModal -->
	<AuthModal variant="forgot-password" {closeIcon} />
	<!-- /ForgotPasswordModal -->

	<!-- Search Modal -->
	<div id="SearchModal" class="search-modal">
		<div class="search-modal__overlay"></div>
		<div class="search-modal__content">
			<button
				class="search-modal__close"
				id="searchModalClose"
				type="button"
				aria-label="Затвори търсенето"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 6L6 18M6 6L18 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<h2 class="search-modal__title">{searchPlaceholder}</h2>
			<form
				class="search-modal__form"
				action="/inventory"
				method="get"
				data-daynight-search-form="inventory"
			>
				<div class="search-modal__input-wrapper">
					<input
						type="text"
						class="search-modal__input"
						name="q"
						placeholder={searchPlaceholder}
						autocomplete="off"
						id="searchModalInput"
					/>
					<button type="submit" class="search-modal__submit" aria-label={searchPlaceholder}>
						{@render searchIcon()}
					</button>
				</div>
			</form>
		</div>
	</div>
	<!-- /Search Modal -->

	<!-- SignUpModal -->
	<AuthModal variant="signup" {closeIcon} />
	<!-- /SignUpModal -->

	<!-- CompareModal (Bottom Modal) -->
	<div
		id="CompareModal"
		class={['modal modal-bottom', garage.comparePickerOpen && 'active']}
		role="dialog"
		aria-modal="true"
		aria-labelledby="daynight-compare-picker-title"
		aria-hidden={!garage.comparePickerOpen}
	>
		<button
			class="bg-modal"
			type="button"
			tabindex="-1"
			aria-label={isEnglish ? 'Close vehicle picker' : 'Затвори избора на автомобили'}
			onclick={closeComparePicker}
		></button>
		<div class="modal-content daynight-compare-picker__dialog">
			{@render closeButton(closeComparePicker)}
			<div class="modal-container daynight-compare-picker">
				<div class="modal-inner">
					<div class="compare-modal-content">
						<div class="daynight-compare-picker__heading">
							<div>
								<h2 id="daynight-compare-picker-title">{pickerTitle}</h2>
								<p>{pickerHint}</p>
							</div>
							<span>{garage.compare.length}/4</span>
						</div>
						<div class="compare-items" id="compareItems">
							<div class="compare-item-list">
								{#each modals.comparePreview as vehicle (vehicle.slug)}
									{@render comparePreviewItem(vehicle)}
								{/each}
							</div>

							<div class="compare-action">
								{#if garage.compare.length >= 2}
									<a
										href={resolve('/compare')}
										class="btn btn-primary btn-large font-weight-600"
										onclick={() => garage.closeComparePicker(false)}
									>
										{copy.vehicleCard.compare} ({garage.compare.length})
									</a>
								{:else}
									<span class="daynight-compare-picker__disabled" aria-disabled="true">
										{isEnglish ? 'Choose 2 vehicles' : 'Избери 2 автомобила'}
									</span>
								{/if}
							</div>
						</div>

						<div
							class="compare-empty-state text-center"
							id="compareEmptyState"
							style="display: none;"
						>
							<p class="text-muted">{copy.compareEmpty}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /CompareModal -->
{/if}

{#snippet closeButton(onclose?: () => void)}
	<button class="close-modal" type="button" aria-label="Затвори" onclick={onclose}>
		<img src={closeIcon} alt="" width="16" height="16" decoding="async" />
	</button>
{/snippet}

{#snippet cardModalVehicle(vehicle: HomeFiveModalVehicle)}
	<div>
		<img
			class="radius-16 mb-10"
			src={vehicle.image}
			alt={vehicle.title}
			width="660"
			height="440"
			loading="lazy"
			decoding="async"
		/>
		<p class="h4 text-center">{vehicle.title}</p>
	</div>
{/snippet}

{#snippet comparePreviewItem(vehicle: HomeFiveModalVehicle)}
	<button
		class={[
			'compare-item daynight-compare-picker__vehicle',
			garage.isCompared(vehicle.slug) && 'is-selected'
		]}
		type="button"
		aria-pressed={garage.isCompared(vehicle.slug)}
		onclick={() => toggleCompare(vehicle.slug)}
	>
		<span class="compare-item-image">
			<img
				src={vehicle.image}
				alt={vehicle.title}
				width="220"
				height="146"
				loading="lazy"
				decoding="async"
			/>
		</span>
		<span class="compare-item-info">
			<strong>{vehicle.title}</strong>
			<span>{vehicle.year} · {vehicle.fuel} · {vehicle.mileageLabel}</span>
		</span>
		<span class="daynight-compare-picker__check" aria-hidden="true">
			{garage.isCompared(vehicle.slug) ? '✓' : '+'}
		</span>
	</button>
{/snippet}

{#snippet searchIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<style>
	:global(#CompareModal .daynight-compare-picker__dialog) {
		max-width: 1040px;
	}

	:global(#CompareModal .bg-modal) {
		border: 0;
		padding: 0;
	}

	:global(#CompareModal .daynight-compare-picker) {
		border-radius: 16px;
		padding: 28px;
	}

	.daynight-compare-picker__heading {
		align-items: flex-start;
		display: flex;
		gap: 24px;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.daynight-compare-picker__heading h2 {
		color: #1c1c1c;
		font-size: 28px;
		font-weight: 700;
		line-height: 34px;
		margin: 0 0 6px;
	}

	.daynight-compare-picker__heading p {
		color: #6f7769;
		font-size: 15px;
		line-height: 21px;
		margin: 0;
	}

	.daynight-compare-picker__heading > span {
		background: #f2f2f2;
		border-radius: 8px;
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 700;
		line-height: 20px;
		padding: 7px 10px;
	}

	:global(#CompareModal .compare-items) {
		align-items: stretch;
		display: grid;
		gap: 24px;
		grid-template-columns: minmax(0, 1fr) 220px;
	}

	:global(#CompareModal .compare-item-list) {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		overflow: visible;
		padding: 0;
		width: auto;
	}

	:global(#CompareModal .daynight-compare-picker__vehicle) {
		appearance: none;
		background: #ffffff;
		border: 1px solid var(--bc-border);
		border-radius: 10px;
		color: #1c1c1c;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		font: inherit;
		min-width: 0;
		padding: 10px;
		position: relative;
		text-align: left;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease;
	}

	:global(#CompareModal .daynight-compare-picker__vehicle:hover),
	:global(#CompareModal .daynight-compare-picker__vehicle:focus-visible),
	:global(#CompareModal .daynight-compare-picker__vehicle.is-selected) {
		background: #f7f7f7;
		border-color: #1c1c1c;
		outline: none;
	}

	:global(#CompareModal .compare-item-image) {
		align-items: center;
		aspect-ratio: 3 / 2;
		background: #f4f4f4;
		border-radius: 8px;
		display: flex;
		overflow: hidden;
		width: 100%;
	}

	:global(#CompareModal .compare-item-image img) {
		height: 100%;
		object-fit: contain;
		width: 100%;
	}

	:global(#CompareModal .compare-item-info) {
		display: grid;
		gap: 5px;
		padding-top: 10px;
	}

	:global(#CompareModal .compare-item-info strong) {
		font-size: 14px;
		line-height: 19px;
		overflow-wrap: anywhere;
	}

	:global(#CompareModal .compare-item-info > span) {
		color: #6f7769;
		font-size: 12px;
		line-height: 17px;
	}

	.daynight-compare-picker__check {
		align-items: center;
		background: #1c1c1c;
		border: 2px solid #ffffff;
		border-radius: 50%;
		color: #ffffff;
		display: inline-flex;
		font-size: 16px;
		font-weight: 700;
		height: 30px;
		justify-content: center;
		position: absolute;
		right: 16px;
		top: 16px;
		width: 30px;
	}

	:global(#CompareModal .is-selected .daynight-compare-picker__check) {
		background: var(--bc-accent);
	}

	:global(#CompareModal .compare-action) {
		align-items: stretch;
		display: flex;
		width: auto;
	}

	:global(#CompareModal .compare-action .btn),
	.daynight-compare-picker__disabled {
		align-items: center;
		border-radius: 8px;
		display: flex;
		font-size: 15px;
		font-weight: 700;
		justify-content: center;
		min-height: 52px;
		padding: 12px 18px;
		text-align: center;
		width: 100%;
	}

	.daynight-compare-picker__disabled {
		background: #ededed;
		color: #8b8b8b;
	}

	:global(#SearchModal.search-modal:not(.active)) {
		opacity: 0 !important;
		pointer-events: none !important;
		transition: none !important;
		visibility: hidden !important;
	}

	:global(#SearchModal.search-modal.active) {
		pointer-events: auto !important;
	}

	@media (max-width: 767px) {
		:global(#CompareModal.modal-bottom) {
			padding-bottom: 0;
		}

		:global(#CompareModal .daynight-compare-picker__dialog) {
			max-height: min(88dvh, 760px);
			padding: 0;
		}

		:global(#CompareModal .daynight-compare-picker) {
			border-radius: 16px 16px 0 0;
			padding: 22px 16px calc(18px + env(safe-area-inset-bottom));
		}

		.daynight-compare-picker__heading {
			margin-bottom: 18px;
		}

		.daynight-compare-picker__heading h2 {
			font-size: 23px;
			line-height: 29px;
		}

		.daynight-compare-picker__heading p {
			font-size: 14px;
			line-height: 19px;
		}

		:global(#CompareModal .compare-items) {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}

		:global(#CompareModal .compare-item-list) {
			display: flex;
			gap: 12px;
			overflow-x: auto;
			padding-bottom: 4px;
			scroll-snap-type: x proximity;
		}

		:global(#CompareModal .daynight-compare-picker__vehicle) {
			flex: 0 0 min(74vw, 260px);
			scroll-snap-align: start;
		}
	}
</style>
