<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import AuxeroVehicleDetailFeatureTabs from './AuxeroVehicleFeatureTabs.svelte';
	import AuxeroVehicleDetailGallery from './AuxeroVehicleDetailGallery.svelte';
	import AuxeroVehicleDetailSidebar from './AuxeroVehicleDetailSidebar.svelte';
	import AuxeroVehicleDetailStaticContent from './AuxeroVehicleDetailStaticContent.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	const accountFavoritesHref = resolve('/account');
	const compareHref = resolve('/compare');
	const contactHref = resolve('/contact');
</script>

{#snippet compareIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19575)">
			<path
				d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.875 10H13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10 6.875V13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
{/snippet}

{#snippet favoriteIcon()}
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.4678 5.375C21.0008 5.37677 22.4707 5.98632 23.5547 7.07031C24.6387 8.15431 25.2482 9.62423 25.25 11.1572C25.2495 14.517 22.7235 17.7209 19.8545 20.2334C17.1857 22.5706 14.4559 24.1025 14 24.3506C13.5441 24.1025 10.8143 22.5706 8.14551 20.2334C5.27653 17.7209 2.75049 14.517 2.75 11.1572C2.75177 9.62423 3.36132 8.15431 4.44531 7.07031C5.52908 5.98655 6.99861 5.37703 8.53125 5.375C10.4976 5.375 12.1694 6.21605 13.2002 7.58887L14 8.65332L14.7998 7.58887C15.8304 6.21627 17.5018 5.37528 19.4678 5.375Z"
			stroke="#1C1C1C"
			stroke-width="2"
		/>
	</svg>
{/snippet}

{#snippet shareIcon()}
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.2537 17.5C18.67 17.4998 18.0922 17.6168 17.5545 17.8439C17.0168 18.0711 16.5302 18.4038 16.1234 18.8224L11.0812 15.5816C11.4778 14.5645 11.4778 13.4355 11.0812 12.4185L16.1234 9.17768C16.8807 9.9535 17.8992 10.4205 18.9813 10.488C20.0634 10.5556 21.132 10.219 21.98 9.54337C22.828 8.8678 23.395 7.90141 23.5709 6.83157C23.7469 5.76174 23.5194 4.66468 22.9324 3.75309C22.3455 2.84149 21.4409 2.18031 20.3942 1.89773C19.3475 1.61516 18.2331 1.73131 17.2671 2.22368C16.3012 2.71605 15.5525 3.54955 15.1661 4.56259C14.7798 5.57563 14.7834 6.69604 15.1762 7.70659L10.134 10.9474C9.52682 10.324 8.74754 9.89589 7.89578 9.71771C7.04403 9.53954 6.15849 9.61942 5.35236 9.94713C4.54624 10.2749 3.85616 10.8355 3.37033 11.5575C2.8845 12.2794 2.625 13.1298 2.625 14C2.625 14.8702 2.8845 15.7206 3.37033 16.4426C3.85616 17.1645 4.54624 17.7252 5.35236 18.0529C6.15849 18.3806 7.04403 18.4605 7.89578 18.2823C8.74754 18.1042 9.52682 17.676 10.134 17.0527L15.1762 20.2935C14.8384 21.1647 14.7884 22.1211 15.0335 23.0228C15.2787 23.9245 15.8061 24.724 16.5384 25.3042C17.2708 25.8845 18.1698 26.215 19.1036 26.2474C20.0374 26.2798 20.9571 26.0124 21.728 25.4843C22.4988 24.9562 23.0803 24.1952 23.3874 23.3127C23.6944 22.4301 23.7108 21.4725 23.4342 20.58C23.1577 19.6875 22.6026 18.907 21.8503 18.3527C21.098 17.7985 20.1881 17.4997 19.2537 17.5Z"
			fill="#1C1C1C"
		/>
	</svg>
{/snippet}

<div class="listing-details" data-daynight-slug={detail.slug} data-daynight-detail="true">
	<div class="listing-details--content">
		<div class="title-section mb-40">
			<h1 class="h2 capitalize">{detail.title}</h1>
			<div class="flex items-center justify-end gap-12">
				<a
					href={compareHref}
					class="btn-icon-circle hover-stroke-white open-modal daynight-pdp-compare"
					data-modal-id="#CompareModal"
					data-daynight-compare={detail.slug}
					role="button"
					aria-label={`${detail.copy.compare} ${detail.title}`}
					title={detail.copy.compare}
				>
					{@render compareIcon()}
				</a>

				<a
					href={accountFavoritesHref}
					class="btn-icon-circle hover-stroke-white daynight-favorite"
					role="button"
					aria-label={`${detail.copy.savePrefix} ${detail.title}`}
				>
					{@render favoriteIcon()}
				</a>

				<a
					href={contactHref}
					class="btn-icon-circle hover-fill-white"
					aria-label={`Попитай Promosale Varna за ${detail.title}`}
				>
					{@render shareIcon()}
				</a>
			</div>
		</div>

		<AuxeroVehicleDetailGallery
			images={detail.galleryImages}
			title={detail.title}
			copy={detail.copy}
		/>

		<section class="daynight-pdp-info-panel" aria-labelledby="daynight-pdp-info-title">
			<p class="h4 mb-16" id="daynight-pdp-info-title">{detail.copy.getToKnow}</p>
			<AuxeroVehicleDetailFeatureTabs
				description={detail.description}
				descriptionLabel={detail.copy.description}
				tabs={detail.featureTabs}
			/>
		</section>

		<AuxeroVehicleDetailStaticContent {detail} />
	</div>

	<AuxeroVehicleDetailSidebar {detail} />
</div>

<!-- Closing CTA lives outside the two-column row so it spans the full
     container instead of leaving a dead right column under the sidebar. -->
<section class="daynight-pdp-closing" aria-label="Искаш оглед?">
	<div class="daynight-pdp-closing__copy">
		<p class="daynight-pdp-closing__title">Искаш оглед?</p>
		<p class="daynight-pdp-closing__text">
			Изпрати запитване и Promosale Varna ще върне конкретен отговор за {detail.title}.
		</p>
	</div>
	<a href={contactHref} class="daynight-pdp-closing__btn">Попитай за автомобила</a>
</section>

<style>
	.daynight-pdp-closing {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		margin-top: 40px;
		border-radius: 8px;
		background: linear-gradient(135deg, #1c1c1c 0%, #1c1c1c 58%, #1c1c1c 100%);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
		padding: 30px 32px;
	}

	.daynight-pdp-closing__copy {
		min-width: 0;
	}

	/* Explicit ink on every text node: the global `* { color: #1c1c1c }` rule
	   would otherwise paint them invisible on the dark band. */
	.daynight-pdp-closing__title {
		margin: 0 0 6px;
		color: #ffffff !important;
		font-size: 28px;
		font-weight: 700;
		line-height: 36px;
	}

	.daynight-pdp-closing__text {
		margin: 0;
		color: rgba(255, 255, 255, 0.78) !important;
		font-size: 16px;
		line-height: 24px;
	}

	.daynight-pdp-closing__btn {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		border-radius: 8px;
		background: var(--bc-accent);
		color: #ffffff !important;
		font-size: 16px;
		font-weight: 600;
		padding: 0 28px;
		white-space: nowrap;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;
	}

	.daynight-pdp-closing__btn:focus-visible {
		background: #b9161c;
		color: #ffffff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-pdp-closing__btn:hover {
			background: #b9161c;
			color: #ffffff !important;
		}
	}
</style>
