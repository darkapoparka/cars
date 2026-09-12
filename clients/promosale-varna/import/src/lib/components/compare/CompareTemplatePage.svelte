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
		window.dispatchEvent(new CustomEvent('daynight:compare-open-picker'));
	};
</script>

{#if dashboardShell}
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeCompareHtml}
		afterHtml={afterCompareHtml}
		title="My Compare"
	>
		<div class="dashboard-box daynight-dashboard-compare bg-white">
			<div class="daynight-dashboard-compare-scroll overflow-x-auto">
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
		title={locale === 'bg'
			? 'Сравни автомобили — Promosale Varna'
			: 'Compare Vehicles — Promosale Varna'}
	>
		<section class="daynight-compare-page pb-100">
			<div class="tf-spacing-style3"></div>
			<div class="container">
				<h1 class="daynight-compare-mobile-title">
					{locale === 'bg' ? 'Сравни автомобили' : 'Compare vehicles'}
				</h1>
				<div class="daynight-compare-hero mb-40">
					<div class="daynight-compare-hero__copy">
						<p class="daynight-compare-hero__eyebrow">
							{locale === 'bg' ? 'Сравнение' : 'Compare'}
						</p>
						<h1 class="h2">
							{locale === 'bg'
								? 'Сравни автомобили от Promosale Varna'
								: 'Compare Promosale Varna vehicles'}
						</h1>
						<p>
							{locale === 'bg'
								? 'Прегледай цена, пробег, история, оборудване и наличност в една ясна таблица.'
								: 'Review price, mileage, history, equipment, and availability in one clear table.'}
						</p>
						<button
							type="button"
							class="btn btn-primary-3 btn-large font-weight-600 daynight-compare-hero__cta"
							onclick={openComparePicker}
						>
							<span>{locale === 'bg' ? 'Добави автомобили' : 'Add vehicles'}</span>
							<span aria-hidden="true">→</span>
						</button>
					</div>
					<div class="daynight-compare-hero__visual" aria-hidden="true">
						<img
							class="daynight-compare-hero__art"
							src="/assets/daynight/compare/compare-hero-faceoff-v2.webp"
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
		color: #1c1c1c !important;
	}

	:global(.daynight-dashboard-compare-scroll) {
		overflow-x: auto;
	}

	.daynight-compare-hero {
		position: relative;
		display: grid;
		min-height: 250px;
		grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
		align-items: center;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: #1c1c1c;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 32px 36px;
	}

	.daynight-compare-mobile-title {
		display: none;
	}

	.daynight-compare-hero::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			90deg,
			rgb(10 10 10 / 0.97) 0%,
			rgb(10 10 10 / 0.82) 34%,
			rgb(10 10 10 / 0) 66%
		);
		content: '';
		pointer-events: none;
	}

	.daynight-compare-hero__copy {
		position: relative;
		z-index: 2;
		max-width: 540px;
	}

	.daynight-compare-hero__eyebrow {
		margin: 0 0 8px;
		color: #ffffff !important;
		font-size: 14px;
		font-weight: 650;
		letter-spacing: 0.04em;
		line-height: 20px;
		text-transform: uppercase;
	}

	.daynight-compare-hero h1 {
		margin: 0 0 12px;
		color: #ffffff !important;
		font-size: 42px;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.12;
	}

	.daynight-compare-hero__copy p:not(.daynight-compare-hero__eyebrow) {
		margin: 0;
		color: rgba(255, 255, 255, 0.78) !important;
		font-size: 16px;
		font-weight: 500;
		line-height: 24px;
	}

	.daynight-compare-hero__cta {
		width: fit-content !important;
		min-width: 210px;
		margin-top: 22px;
		gap: 8px;
		min-height: 56px;
		border-color: var(--bc-accent) !important;
		background: var(--bc-accent) !important;
		color: #ffffff !important;
		font-size: 18px !important;
		font-weight: 600 !important;
	}

	.daynight-compare-hero__cta:hover,
	.daynight-compare-hero__cta:focus-visible {
		border-color: var(--bc-accent-hover) !important;
		background: var(--bc-accent-hover) !important;
		color: #ffffff !important;
		transform: none !important;
	}

	.daynight-compare-hero__cta::before,
	.daynight-compare-hero__cta::after {
		display: none !important;
	}

	.daynight-compare-hero__visual {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	.daynight-compare-hero__visual::after {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 72% 54%, rgb(185 22 28 / 0.3), transparent 44%);
		content: '';
		mix-blend-mode: color;
		pointer-events: none;
	}

	.daynight-compare-hero__art {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		filter: grayscale(1) saturate(0.12) contrast(1.05);
		object-fit: cover;
		object-position: center;
	}

	:global(body.auxero-template-compare-html .daynight-compare-hero h1),
	:global(body.auxero-template-compare-html .daynight-compare-hero p) {
		color: inherit !important;
	}

	:global(body.auxero-template-compare-html .daynight-compare-hero h1) {
		color: #ffffff !important;
	}

	:global(body.auxero-template-compare-html .daynight-compare-hero p) {
		color: rgba(255, 255, 255, 0.78) !important;
	}

	:global(
		body.auxero-template-compare-html .daynight-compare-hero .daynight-compare-hero__eyebrow
	) {
		color: #ffffff !important;
	}

	:global(.daynight-dashboard-compare .daynight-compare-table) {
		min-width: 900px;
		width: max-content;
	}

	:global(.daynight-dashboard-compare .daynight-compare-table td:first-child) {
		min-width: 220px;
	}

	:global(.daynight-dashboard-compare .daynight-compare-table td:not(:first-child)) {
		min-width: 270px;
	}

	:global(.daynight-dashboard-compare .daynight-compare-table td:first-child img) {
		flex: 0 0 24px;
		height: 24px;
		object-fit: contain;
		width: 24px;
	}

	@media (max-width: 767px) {
		:global(body.auxero-template-compare-html #wrapper),
		:global(body.auxero-template-compare-html section.pb-100) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		/* The theme's #wrapper overflow:hidden creates a clip scroll-container
		   that silently kills the appbar's position:sticky; clip gives the same
		   horizontal containment without breaking stickiness. */
		:global(body.auxero-template-compare-html #wrapper) {
			overflow: clip !important;
		}

		:global(body.auxero-template-compare-html .header-wrapper-style-4) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html .footer),
		:global(body.auxero-template-compare-html .site-footer) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html section.pb-100) {
			padding-top: 0 !important;
			padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .tf-spacing-style3) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 > .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 0 !important;
			padding-left: 0 !important;
		}

		:global(body.auxero-template-compare-html .title-section) {
			justify-content: flex-start !important;
			margin-bottom: 10px !important;
			text-align: left !important;
		}

		.daynight-compare-hero {
			display: none;
		}

		.daynight-compare-mobile-title {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.daynight-compare-hero__visual {
			display: none;
		}

		.daynight-compare-hero__cta {
			display: none !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2) {
			margin-bottom: 0 !important;
			color: #111111 !important;
			font-size: 24px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-compare-html section.pb-100 .title-section h1 + p),
		:global(body.auxero-template-compare-html section.pb-100 .title-section h2 + p) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html .daynight-compare-hero h1) {
			margin-bottom: 0 !important;
			color: #111111 !important;
			font-size: 24px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
			text-align: left !important;
		}

		:global(body.auxero-template-compare-html .daynight-compare-hero h1 + p) {
			display: none !important;
		}

		:global(
			body.auxero-template-compare-html .daynight-compare-hero .daynight-compare-hero__eyebrow
		) {
			display: none !important;
		}

		:global(body.auxero-template-compare-html .card-details) {
			/* clip, not hidden — hidden would break the sticky appbar inside. */
			overflow: clip !important;
			border: 0 !important;
			border-radius: 0 !important;
			background: transparent !important;
			padding: 0 !important;
			box-shadow: none !important;
		}

		:global(.daynight-dashboard-compare .daynight-compare-table) {
			min-width: 560px;
		}

		:global(.daynight-dashboard-compare .daynight-compare-table td:first-child) {
			min-width: 120px;
		}

		:global(.daynight-dashboard-compare .daynight-compare-table td:not(:first-child)) {
			min-width: 220px;
		}
	}
</style>
