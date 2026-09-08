<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroReviewCard, AuxeroReviewsPageData } from '$lib/auxero/reviews';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroReviewsGrid from './AuxeroReviewsGrid.svelte';

	let {
		cards,
		pageDocument,
		reviewsPage,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		cards: AuxeroReviewCard[];
		pageDocument: AuxeroPageDocument;
		reviewsPage: AuxeroReviewsPageData;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	const externalHref = (href: string) => ({ href });
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Отзиви — Day Night Auto"
>
	<section class="pb-100" data-daynight-reviews-page>
		<div class="container">
			<h1 class="h2">{reviewsPage.title}</h1>
			<div class="tf-spacing-style3"></div>
			<AuxeroReviewsGrid {cards} />
			<ul class="pagination daynight-reviews-pagination justify-center">
				<li>
					<a href={resolve('/reviews')} class="pagination__link active">{reviewsPage.pageLabel}</a>
				</li>
				<li>
					<a
						{...externalHref(reviewsPage.facebookHref)}
						class="pagination__link pagination__link--cta"
						target="_blank"
						rel="noreferrer"
					>
						{reviewsPage.facebookLabel}
					</a>
				</li>
			</ul>
		</div>
	</section>
</AuxeroPublicShell>

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-clients-reviews-html #wrapper),
		:global(body.auxero-template-clients-reviews-html section.pb-100) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100) {
			padding-top: 32px !important;
			padding-bottom: 92px !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100 > .tf-spacing-style4) {
			display: none !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100 > .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 14px !important;
			padding-left: 14px !important;
		}
	}

	.daynight-reviews-pagination .pagination__link--cta {
		width: auto;
		min-width: 40px;
		padding-right: 18px;
		padding-left: 18px;
		white-space: nowrap;
	}
</style>
