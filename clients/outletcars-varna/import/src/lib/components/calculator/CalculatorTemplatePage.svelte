<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroCalculatorBudgetLink, AuxeroCalculatorData } from '$lib/auxero/calculator';
	import type { AuxeroFaq } from '$lib/auxero/faqs';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import FaqAccordion from '$lib/components/faqs/FaqAccordion.svelte';
	import CalculatorMobilePage from './CalculatorMobilePage.svelte';
	import CalculatorEstimator from './CalculatorEstimator.svelte';

	let {
		budgetLinks,
		calculator,
		faqs,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		budgetLinks: AuxeroCalculatorBudgetLink[];
		calculator: AuxeroCalculatorData;
		faqs: AuxeroFaq[];
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<div class="daynight-calculator-desktop-route">
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Калкулатор за внос — OUTLETCARS.BG — Варна"
	>
		<div data-daynight-calculator-page>
			<section class="pb-100">
				<div class="tf-spacing-style3"></div>
				<div class="container">
					<h1 class="h2 mb-12 text-center">Калкулатор за внос</h1>
					<p class="h7 line-height-28 text-secondary mb-40 text-center">
						Изчисли ориентировъчна крайна цена за автомобил от Европа преди точна разбивка от
						OUTLETCARS.BG — Варна.
					</p>
					<CalculatorEstimator {calculator} />
				</div>
				<div class="tf-spacing"></div>
				<h2 class="mb-40 text-center capitalize">Разгледай по бюджет</h2>
				<div class="container">
					<div
						class="lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 padding-box-20 mb-40 grid grid-cols-5 gap-20"
					>
						{#each budgetLinks as link (`${link.href}-${link.label}-${link.price}`)}
							<div class="price-box">
								<a
									href={resolve(link.href as '/inventory')}
									class="h7 font-weight-500 text-underline mb-8"
								>
									{link.label}
								</a>
								<p class="h4">{link.price}</p>
							</div>
						{/each}
					</div>
					<div class="flex justify-center">
						<a
							href={resolve('/inventory')}
							class="btn btn-line-hover effect-line-primary btn-large font-weight-600 hover-fill-white"
						>
							Виж наличните
						</a>
					</div>
				</div>
			</section>
			<section class="background-light py-100">
				<div class="container">
					<h2 class="mb-40 text-center">Въпроси за калкулатора</h2>
					<div class="max-width-930 mx-auto w-full">
						<FaqAccordion items={faqs} forceWhite />
					</div>
				</div>
			</section>
		</div>
	</AuxeroPublicShell>
</div>

<div class="daynight-calculator-mobile-route">
	<CalculatorMobilePage {budgetLinks} {calculator} {faqs} />
</div>

<style>
	.daynight-calculator-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body.auxero-template-calculator-html #wrapper) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		.daynight-calculator-desktop-route {
			display: none;
		}

		.daynight-calculator-mobile-route {
			display: block;
		}
	}
</style>
