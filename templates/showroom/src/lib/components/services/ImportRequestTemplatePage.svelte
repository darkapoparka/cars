<script lang="ts">
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
		form,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
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
		eyebrow: 'Eliqauto внос',
		image: '/assets/eliqauto/services/import-canada-banner-generated.webp',
		title: 'Внос и лизинг'
	};
</script>

<div class="eliqauto-import-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Внос и лизинг — Eliqauto"
	>
		<div class="eliqauto-import-page" data-eliqauto-import>
			<PageBanner
				{banner}
				leftCutout={{
					src: '/assets/eliqauto/compare/audi-a5-cutout-v1.webp',
					variant: 'vehicle'
				}}
				cutout={{
					src: '/assets/eliqauto/compare/bmw-750-cutout-v1.webp',
					variant: 'vehicle'
				}}
			/>

			<section class="background-light py-100">
				<div class="container">
					<div class="lg-grid-cols-1 grid grid-cols-2 gap-30">
						<div class="eliqauto-import-page__copy">
							<p class="eliqauto-import-page__eyebrow">Бърза проверка</p>
							<h2>Изпрати линк или VIN</h2>

							<div class="eliqauto-import-page__steps">
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

<div class="eliqauto-import-mobile-route">
	<ImportRequestMobilePage {form} />
</div>

<style>
	.eliqauto-import-mobile-route {
		display: none;
	}

	.eliqauto-import-page {
		background: var(--bc-bg);
	}

	.eliqauto-import-page :global(.background-light) {
		background: var(--bc-bg);
	}

	.eliqauto-import-page__copy {
		align-self: start;
	}

	.eliqauto-import-page__eyebrow {
		margin: 0 0 8px;
		color: var(--primary);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 20px;
		text-transform: uppercase;
	}

	.eliqauto-import-page__copy h2 {
		max-width: 620px;
		margin: 0 0 16px;
		color: #111111;
		font-size: clamp(34px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 1.08;
	}

	.eliqauto-import-page__steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.eliqauto-import-page__steps article {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 18px;
	}

	.eliqauto-import-page__steps article:hover {
		background: var(--bc-surface-hover);
	}

	.eliqauto-import-page__steps span {
		display: block;
		margin-bottom: 8px;
		color: var(--primary);
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 20px;
		text-transform: uppercase;
	}

	.eliqauto-import-page__steps h3 {
		margin: 0 0 8px;
		color: #111111;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 24px;
	}

	.eliqauto-import-page__steps p {
		margin: 0;
		color: #5f5f5f;
		font-size: 15px;
		line-height: 23px;
	}

	.eliqauto-import-page :global(.services-center-form) {
		align-self: start;
	}

	@media (max-width: 991px) {
		.eliqauto-import-page__steps {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767.98px) {
		:global(body[class*='auxero-template-'] #wrapper) {
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		.eliqauto-import-desktop-route {
			display: none;
		}

		.eliqauto-import-mobile-route {
			display: block;
		}
	}
</style>
