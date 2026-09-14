<script lang="ts">
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestSteps } from '$lib/auxero/services';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import ImportRequestMobilePage from './ImportRequestMobilePage.svelte';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		serviceVehicles,
		form,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		serviceVehicles: HomeFiveVehicleCardData[];
		form: AuxeroServiceFormData;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const banner = {
		description: 'Изпрати линк или VIN. Проверяваме автомобила преди да поемеш ангажимент.',
		eyebrow: 'Promosale Varna внос',
		image: '/assets/daynight/services/premium-cars-banner-generated.webp',
		title: 'Подбрани автомобили'
	};
</script>

<div class="daynight-import-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Подбрани автомобили — Promosale Varna"
	>
		<div class="daynight-import-page" data-daynight-import>
			<PageBanner {banner} />

			<section class="background-light py-100">
				<div class="container">
					<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
						<div class="daynight-import-page__copy">
							<p class="daynight-import-page__eyebrow">Бърза проверка</p>
							<h2>Изпрати линк или VIN</h2>

							<div class="daynight-import-page__steps">
								{#each importRequestSteps as step, index (step.title)}
									<article>
										<span>Стъпка {index + 1}</span>
										<h3>{step.title}</h3>
										<p>{step.text}</p>
									</article>
								{/each}
							</div>
						</div>

						<ServiceFormCard {form} />
					</div>
				</div>
			</section>
		</div>
	</AuxeroPublicShell>
</div>

<div class="daynight-import-mobile-route">
	<ImportRequestMobilePage {serviceVehicles} {form} />
</div>

<style>
	.daynight-import-mobile-route {
		display: none;
	}

	.daynight-import-page {
		background: var(--bc-bg);
	}

	.daynight-import-page :global(.background-light) {
		background: var(--bc-bg) !important;
	}

	.daynight-import-page__copy {
		align-self: start;
	}

	.daynight-import-page__eyebrow {
		margin: 0 0 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 18px;
		text-transform: uppercase;
	}

	.daynight-import-page__copy h2 {
		max-width: 620px;
		margin: 0 0 16px;
		color: #111111;
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.daynight-import-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.daynight-import-page__steps article {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 18px;
	}

	.daynight-import-page__steps article:hover {
		background: var(--bc-surface-hover);
	}

	.daynight-import-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-import-page__steps h3 {
		margin: 0 0 8px;
		color: #111111;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 24px;
	}

	.daynight-import-page__steps p {
		margin: 0;
		color: #5f5f5f;
		font-size: 14px;
		line-height: 21px;
	}

	.daynight-import-page :global(.services-center-form) {
		align-self: start;
	}

	@media (max-width: 991px) {
		.daynight-import-page__steps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767.98px) {
		:global(body[class*='auxero-template-'] #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.daynight-import-desktop-route {
			display: none;
		}

		.daynight-import-mobile-route {
			display: block;
		}
	}
</style>
