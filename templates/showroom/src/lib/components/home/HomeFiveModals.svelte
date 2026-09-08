<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeaderData,
		HomeFiveModalVehicle,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import AuthModal from '$lib/components/forms/AuthModal.svelte';
	import type { HomePageCopy } from '$lib/i18n/messages';

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
	const searchPlaceholder = $derived(header?.ui.searchPlaceholder ?? 'Search Eliq Auto inventory');
</script>

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
				data-eliqauto-search-form="inventory"
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
	<div id="CompareModal" class="modal modal-bottom">
		<div class="bg-modal"></div>
		<div class="modal-content">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<div class="compare-modal-content">
						<div class="compare-items" id="compareItems">
							<div class="compare-item-list">
								{#each modals.comparePreview as vehicle (vehicle.slug)}
									{@render comparePreviewItem(vehicle)}
								{/each}
							</div>

							<div class="compare-action">
								<a href={resolve('/compare')} class="btn btn-primary btn-large font-weight-600">
									{copy.vehicleCard.compare}
								</a>
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

{#snippet closeButton()}
	<button class="close-modal" type="button" aria-label="Затвори">
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
	<div class="compare-item flex items-center gap-12">
		<button class="compare-item-remove" type="button" aria-label={copy.vehicleCard.compare}>
			<img src={closeIcon} alt="car" class="radius-50" width="16" height="16" decoding="async" />
		</button>
		<div class="compare-item-image">
			<img
				src={vehicle.image}
				alt={vehicle.title}
				class="radius-50"
				width="64"
				height="64"
				loading="lazy"
				decoding="async"
			/>
		</div>
		<div class="compare-item-info">
			<p class="h7 font-weight-500 mb-8">{vehicle.title}</p>
			<div class="flex gap-4">
				<div class="flex items-center gap-4">
					<img
						src="/assets/icons/icon-gauge.svg"
						alt={copy.vehicleCard.mileageAlt}
						width="16"
						height="16"
					/>
					<span class="text-sm">{vehicle.mileageLabel}</span>
				</div>
				<div class="flex items-center gap-4">
					<img
						src="/assets/icons/calendar.svg"
						alt={copy.vehicleCard.yearAlt}
						width="16"
						height="16"
					/>
					<span class="text-sm">{vehicle.year}</span>
				</div>
				<div class="flex items-center gap-4">
					<img
						src="/assets/icons/gaspump.svg"
						alt={copy.vehicleCard.fuelAlt}
						width="16"
						height="16"
					/>
					<span class="text-sm">{vehicle.fuel}</span>
				</div>
				<div class="flex items-center gap-4">
					<img
						src="/assets/icons/auto.svg"
						alt={copy.vehicleCard.transmissionAlt}
						width="16"
						height="16"
					/>
					<span class="text-sm">{vehicle.transmission}</span>
				</div>
			</div>
		</div>
	</div>
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
	:global(#SearchModal.search-modal:not(.active)) {
		opacity: 0;
		pointer-events: none;
		transition: none;
		visibility: hidden;
	}

	:global(#SearchModal.search-modal.active) {
		pointer-events: auto;
	}
</style>
