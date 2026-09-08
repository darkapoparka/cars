<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy, Locale } from '$lib/i18n/messages';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroCompareTable from './AuxeroCompareTable.svelte';

	let {
		afterCompareHtml = '',
		allVehicles,
		beforeCompareHtml = '',
		dashboardShell = false,
		locale,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml = '',
		vehicles
	}: {
		afterCompareHtml?: string;
		allVehicles: AuxeroCompareVehicle[];
		beforeCompareHtml?: string;
		dashboardShell?: boolean;
		locale: Locale;
		pageDocument: AuxeroPageDocument;
		shellCopy?: HomePageCopy;
		shellFooter?: HomeFiveFooterData;
		shellHeader?: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml?: string;
		vehicles: AuxeroCompareVehicle[];
	} = $props();

	const openComparePicker = () => {
		window.dispatchEvent(new CustomEvent('eliqauto:compare-open-picker'));
	};
</script>

{#if dashboardShell}
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeCompareHtml}
		afterHtml={afterCompareHtml}
		title="My Compare"
	>
		<div class="dashboard-box eliqauto-dashboard-compare bg-white">
			<div class="eliqauto-dashboard-compare-scroll overflow-x-auto">
				<AuxeroCompareTable {allVehicles} {locale} useStoredSelection={false} {vehicles} />
			</div>
		</div>
	</AuxeroDashboardSlotShell>
{:else if shellCopy && shellFooter && shellHeader}
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title={locale === 'bg' ? 'Сравни автомобили — Eliqauto' : 'Compare Vehicles — Eliqauto'}
	>
		<section class="eliqauto-compare-page pb-100">
			<div class="tf-spacing-style3"></div>
			<div class="container">
				<div class="eliqauto-compare-hero mb-40">
					<div class="eliqauto-compare-hero__copy">
						<p class="eliqauto-compare-hero__eyebrow">
							{locale === 'bg' ? 'Сравнение' : 'Compare'}
						</p>
						<h1 class="h2">
							{locale === 'bg' ? 'Сравни автомобили от Eliqauto' : 'Compare Eliqauto vehicles'}
						</h1>
						<p>
							{locale === 'bg'
								? 'Прегледай цена, пробег, история, оборудване и наличност в една ясна таблица.'
								: 'Review price, mileage, history, equipment, and availability in one clear table.'}
						</p>
						<button
							type="button"
							class="btn btn-primary-3 btn-large font-weight-600 eliqauto-compare-hero__cta"
							onclick={openComparePicker}
						>
							<span>{locale === 'bg' ? 'Добави автомобили' : 'Add vehicles'}</span>
							<span aria-hidden="true">→</span>
						</button>
					</div>
					<div class="eliqauto-compare-hero__visual" aria-hidden="true">
						<img
							class="eliqauto-compare-hero__art"
							src="/assets/eliqauto/compare/compare-hero-faceoff-v2.webp"
							alt=""
							loading="lazy"
						/>
					</div>
				</div>
				<div class="card-details">
					<AuxeroCompareTable {allVehicles} {locale} {vehicles} />
				</div>
			</div>
		</section>
	</AuxeroPublicShell>
{/if}

<style>
	:global(body.auxero-template-compare-html section.pb-100 .title-section h1),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h2),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h1 + p),
	:global(body.auxero-template-compare-html section.pb-100 .title-section h2 + p) {
		color: #1c1c1c;
	}

	:global(.eliqauto-dashboard-compare-scroll) {
		overflow-x: auto;
	}

	.eliqauto-compare-hero {
		position: relative;
		display: grid;
		min-height: 250px;
		grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
		align-items: center;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: #2a0c0c;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 32px 36px;
	}

	.eliqauto-compare-hero::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			90deg,
			rgb(14 24 12 / 0.96) 0%,
			rgb(14 24 12 / 0.8) 34%,
			rgb(14 24 12 / 0) 66%
		);
		content: '';
		pointer-events: none;
	}

	.eliqauto-compare-hero__copy {
		position: relative;
		z-index: 2;
		max-width: 540px;
	}

	.eliqauto-compare-hero__eyebrow {
		margin: 0 0 8px;
		color: var(--bc-accent-on-dark);
		font-size: 14px;
		font-weight: 800;
		line-height: 20px;
		text-transform: uppercase;
	}

	.eliqauto-compare-hero h1 {
		margin: 0 0 12px;
		color: #ffffff;
		font-size: clamp(44px, 3.5vw, 52px);
		font-weight: 700;
		line-height: 1.16;
		letter-spacing: 0;
	}

	.eliqauto-compare-hero__copy p:not(.eliqauto-compare-hero__eyebrow) {
		margin: 0;
		color: rgba(255, 255, 255, 0.78);
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
	}

	.eliqauto-compare-hero__cta {
		width: fit-content;
		min-width: 210px;
		margin-top: 22px;
		gap: 8px;
		border-color: #a51717;
		background: #a51717;
		color: #ffffff;
	}

	.eliqauto-compare-hero__cta span {
		color: #ffffff;
	}

	.eliqauto-compare-hero__cta:hover,
	.eliqauto-compare-hero__cta:focus-visible {
		border-color: #ffffff;
		background: #ffffff;
		color: #2a0c0c;
		transform: none;
	}

	.eliqauto-compare-hero__cta:hover span,
	.eliqauto-compare-hero__cta:focus-visible span {
		color: #2a0c0c;
	}

	.eliqauto-compare-hero__cta::before,
	.eliqauto-compare-hero__cta::after {
		display: none;
	}

	.eliqauto-compare-hero__visual {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.eliqauto-compare-hero__art {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	:global(body.auxero-template-compare-html .eliqauto-compare-hero h1),
	:global(body.auxero-template-compare-html .eliqauto-compare-hero p) {
		color: inherit;
	}

	:global(body.auxero-template-compare-html .eliqauto-compare-hero h1) {
		color: #ffffff;
	}

	:global(body.auxero-template-compare-html .eliqauto-compare-hero p) {
		color: rgba(255, 255, 255, 0.78);
	}

	:global(
		body.auxero-template-compare-html .eliqauto-compare-hero .eliqauto-compare-hero__eyebrow
	) {
		color: var(--bc-accent-on-dark);
	}

	:global(.eliqauto-dashboard-compare .eliqauto-compare-table) {
		min-width: 900px;
		width: max-content;
	}

	:global(.eliqauto-dashboard-compare .eliqauto-compare-table td:first-child) {
		min-width: 220px;
	}

	:global(.eliqauto-dashboard-compare .eliqauto-compare-table td:not(:first-child)) {
		min-width: 270px;
	}

	:global(.eliqauto-dashboard-compare .eliqauto-compare-table td:first-child img) {
		flex: 0 0 24px;
		height: 24px;
		object-fit: contain;
		width: 24px;
	}

	@media (max-width: 767px) {
		:global(body.auxero-template-compare-html #wrapper),
		:global(body.auxero-template-compare-html section.pb-100) {
			background: var(--bc-bg);
			background-color: var(--bc-bg);
		}

		/* The theme's #wrapper overflow:hidden creates a clip scroll-container
		   that silently kills the appbar's position:sticky; clip gives the same
		   horizontal containment without breaking stickiness. */
		:global(body.auxero-template-compare-html #wrapper) {
			overflow: clip;
		}

		:global(body.auxero-template-compare-html .header-wrapper-style-4) {
			display: none;
		}

		:global(body.auxero-template-compare-html .footer),
		:global(body.auxero-template-compare-html .site-footer) {
			display: none;
		}

		:global(body.auxero-template-compare-html section.pb-100) {
			padding-top: 0;
			padding-bottom: calc(80px + env(safe-area-inset-bottom));
		}

		:global(body.auxero-template-compare-html section.pb-100 .tf-spacing-style3) {
			display: none;
		}

		:global(body.auxero-template-compare-html section.pb-100 > .container) {
			width: 100%;
			max-width: none;
			padding-right: 0;
			padding-left: 0;
		}

		:global(body.auxero-template-compare-html .title-section) {
			justify-content: flex-start;
			margin-bottom: 10px;
			text-align: left;
		}

		.eliqauto-compare-hero {
			display: none;
		}

		.eliqauto-compare-hero__visual {
			display: none;
		}

		.eliqauto-compare-hero__cta {
			display: none;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2) {
			margin-bottom: 0;
			color: #111111;
			font-size: 24px;
			font-weight: 700;
			line-height: 28px;
			text-align: left;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1 + p),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2 + p) {
			display: none;
		}

		:global(body.auxero-template-compare-html .eliqauto-compare-hero h1) {
			margin-bottom: 0;
			color: #111111;
			font-size: 24px;
			font-weight: 700;
			line-height: 28px;
			text-align: left;
		}

		:global(body.auxero-template-compare-html .eliqauto-compare-hero h1 + p) {
			display: none;
		}

		:global(
			body.auxero-template-compare-html .eliqauto-compare-hero .eliqauto-compare-hero__eyebrow
		) {
			display: none;
		}

		:global(body.auxero-template-compare-html .card-details) {
			/* clip, not hidden — hidden would break the sticky appbar inside. */
			overflow: clip;
			border: 0;
			border-radius: 0;
			background: transparent;
			padding: 0;
			box-shadow: none;
		}

		:global(.eliqauto-dashboard-compare .eliqauto-compare-table) {
			min-width: 560px;
		}

		:global(.eliqauto-dashboard-compare .eliqauto-compare-table td:first-child) {
			min-width: 120px;
		}

		:global(.eliqauto-dashboard-compare .eliqauto-compare-table td:not(:first-child)) {
			min-width: 220px;
		}
	}
</style>
