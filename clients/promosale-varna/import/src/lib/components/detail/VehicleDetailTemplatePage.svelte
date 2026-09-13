<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroVehicleDetail from './AuxeroVehicleDetail.svelte';
	import AuxeroVehicleMobileIsland from './AuxeroVehicleMobileIsland.svelte';

	let {
		detail,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		detail: AuxeroVehicleDetailData;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title={`${detail.title} — Day Night Auto`}
>
	<section class="daynight-pdp-desktop pb-100">
		<div class="tf-spacing-style4"></div>
		<div class="container">
			{#key detail.slug}
				<AuxeroVehicleDetail {detail} />
			{/key}
		</div>
	</section>

	<AuxeroVehicleMobileIsland {detail} />
</AuxeroPublicShell>

<style>
	:global(.daynight-pdp-desktop) {
		background: var(--bc-bg);
	}

	:global(.daynight-pdp-desktop .tf-spacing-style4) {
		height: 32px;
	}

	@media (min-width: 768px) {
		:global(.daynight-pdp-desktop .listing-details) {
			align-items: start;
			display: grid;
			gap: 32px;
			grid-template-columns: minmax(0, 1fr) minmax(360px, 370px);
		}

		:global(.daynight-pdp-desktop .listing-details--content),
		:global(.daynight-pdp-desktop .listing-details--sidebar) {
			min-width: 0;
			width: auto;
		}

		:global(.daynight-pdp-desktop .listing-details--sidebar) {
			position: static;
		}

		:global(.daynight-pdp-desktop .daynight-buybox-card) {
			position: sticky;
			top: 110px;
			z-index: 4;
		}
	}

	:global(.daynight-pdp-desktop .title-section) {
		align-items: center;
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		margin-bottom: 24px;
		padding: 24px;
	}

	:global(.daynight-pdp-desktop .title-section h1) {
		color: #1c1c1c;
		font-family: var(--bc-font-heading);
		font-size: clamp(2rem, 3.2vw, 3rem);
		font-weight: 700;
		letter-spacing: var(--bc-tracking-display);
		line-height: 1.05;
		margin-bottom: 0;
		max-width: 650px;
		min-width: 0;
	}

	:global(.daynight-pdp-desktop .title-section .daynight-pdp-heading) {
		flex: 1 1 auto;
		min-width: 0;
	}

	:global(.daynight-pdp-desktop .title-section .daynight-pdp-heading + div) {
		flex: 0 0 auto;
	}

	:global(.daynight-pdp-desktop .daynight-pdp-headline-meta) {
		margin: 8px 0 0;
		color: var(--bc-muted);
		font-size: 14px;
		font-weight: 500;
		line-height: 1.45;
	}

	:global(.daynight-pdp-desktop .title-section .btn-icon-circle) {
		background: var(--bc-surface);
		border: 1px solid var(--bc-border);
		box-sizing: border-box;
		color: #1c1c1c;
		flex: 0 0 48px;
		width: 48px;
		height: 48px;
		line-height: 1;
		padding: 0;
	}

	:global(.daynight-pdp-desktop .title-section .daynight-pdp-compare) {
		background: var(--bc-surface);
		border-color: var(--bc-border);
	}

	:global(.daynight-pdp-desktop .title-section .daynight-pdp-compare svg path) {
		fill: none !important;
		stroke: #1c1c1c !important;
	}

	:global(.daynight-pdp-desktop .title-section .daynight-favorite svg path) {
		fill: none !important;
		stroke: #1c1c1c !important;
	}

	:global(
		.daynight-pdp-desktop
			.title-section
			.btn-icon-circle:not(.daynight-favorite):not(.daynight-pdp-compare)
			svg
			path
	) {
		fill: #1c1c1c !important;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-pdp-desktop .title-section .btn-icon-circle:hover) {
			background: var(--bc-hover-accent);
			border-color: var(--bc-hover-accent);
			color: var(--bc-hover-accent-ink);
		}

		:global(.daynight-pdp-desktop .title-section .daynight-pdp-compare:hover) {
			background: var(--bc-hover-accent);
			border-color: var(--bc-hover-accent);
			color: var(--bc-hover-accent-ink);
		}

		:global(.daynight-pdp-desktop .title-section .daynight-pdp-compare:hover svg path) {
			stroke: var(--bc-hover-accent-ink) !important;
		}

		:global(.daynight-pdp-desktop .title-section .daynight-favorite:hover svg path) {
			stroke: var(--bc-hover-accent-ink) !important;
		}

		:global(
			.daynight-pdp-desktop
				.title-section
				.btn-icon-circle:not(.daynight-favorite):not(.daynight-pdp-compare):hover
				svg
				path
		) {
			fill: var(--bc-hover-accent-ink) !important;
		}
	}

	:global(.daynight-pdp-desktop .daynight-pdp-gallery-main) {
		background: var(--bc-surface);
		border-radius: 8px;
		height: clamp(480px, 38vw, 540px);
		margin-bottom: 14px;
	}

	:global(.daynight-pdp-desktop .listing-details-item) {
		background: var(--bc-surface);
		border-radius: 8px;
	}

	:global(.daynight-pdp-desktop .listing-details-item .img-main) {
		height: 100%;
		width: 100%;
	}

	:global(.daynight-pdp-desktop .listing-details-thumb) {
		background: var(--bc-surface);
		border-radius: 8px;
	}

	:global(.daynight-pdp-desktop .listing-details-thumb img) {
		border-radius: 8px;
	}

	:global(.daynight-pdp-desktop .swiper-listing-details-thumbs) {
		padding-bottom: 32px;
	}

	:global(.daynight-pdp-desktop .swiper-listing-details-thumbs .swiper-slide) {
		width: 104px !important;
	}

	:global(.daynight-pdp-desktop .listing-details-thumb) {
		height: 68px;
		overflow: hidden;
	}

	:global(.daynight-pdp-desktop .listing-details-thumb img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	:global(.daynight-pdp-desktop .listing-details-item--button) {
		background: rgba(28, 28, 28, 0.8);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: var(--bc-radius-control) !important;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-pdp-desktop .listing-details-item--button:hover) {
			background: var(--bc-accent);
			color: #ffffff;
		}
	}

	:global(.daynight-pdp-desktop .listing-details--content > .h4),
	:global(.daynight-pdp-desktop .listing-details--content > p.h4),
	:global(.daynight-pdp-desktop .listing-details--content > div + .h4) {
		color: #1c1c1c;
	}

	:global(.daynight-pdp-desktop .listing-details--content > .h4),
	:global(.daynight-pdp-desktop .listing-details--content > p.h4),
	:global(.daynight-pdp-desktop .listing-details--sidebar-box > .h5),
	:global(.daynight-pdp-desktop .listing-details--sidebar-box .h5) {
		font-family: var(--bc-font-heading);
		font-weight: 600;
		letter-spacing: var(--bc-tracking-tight);
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .content-inner > .h4) {
		font-size: var(--bc-text-price);
		font-variant-numeric: tabular-nums;
		line-height: var(--bc-leading-price);
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .text-secondary),
	:global(.daynight-pdp-desktop .daynight-pdp-info-panel .text-secondary) {
		font-size: var(--bc-text-body);
		line-height: 1.55;
	}

	:global(.daynight-pdp-desktop .listing-details--content > .divider) {
		display: none;
	}

	:global(.daynight-pdp-desktop .daynight-pdp-info-panel) {
		background: #ffffff;
		border: 1px solid #dde0e4;
		border-radius: 8px;
		margin-bottom: 40px;
		padding: 24px;
	}

	:global(.daynight-pdp-desktop .daynight-pdp-info-panel > .h4) {
		margin-bottom: 16px;
	}

	:global(.daynight-pdp-desktop .daynight-pdp-info-panel .flat-tabs) {
		margin-bottom: 0;
	}

	:global(.daynight-pdp-desktop .daynight-pdp-info-panel .content-tab) {
		min-width: 0;
	}

	/* The shared template animates tab panels with `transition: all 0.5s` from
	   `scale(0.9)`, so a click looks sluggish/half-rendered for half a second and
	   reads as "didn't register" — prompting a second click. Snap the swap to a
	   fast opacity fade with no transform, scoped to the PDP tab panels only
	   (the feature tabs and the cash/finance buy-box toggle). */
	:global(.daynight-pdp-desktop .daynight-pdp-info-panel .content-inner),
	:global(.daynight-pdp-desktop .daynight-pdp-info-panel .content-inner.active),
	:global(.daynight-pdp-desktop .listing-details--sidebar-box .content-inner),
	:global(.daynight-pdp-desktop .listing-details--sidebar-box .content-inner.active) {
		transform: none;
		transition: opacity 120ms ease;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.daynight-pdp-desktop .daynight-pdp-info-panel .content-inner),
		:global(.daynight-pdp-desktop .daynight-pdp-info-panel .content-inner.active),
		:global(.daynight-pdp-desktop .listing-details--sidebar-box .content-inner),
		:global(.daynight-pdp-desktop .listing-details--sidebar-box .content-inner.active) {
			transition: none;
		}
	}

	/* Cash/finance toggle: the pill markup is a <li> styled by the template, so
	   the click target is a <button> filling it. Move the pill padding onto the
	   button so the whole pill is clickable, and keep the active label white
	   despite the global ink reset. */
	:global(.daynight-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li:not(.item)) {
		padding: 0;
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .daynight-buybox-mode) {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 40px;
		padding: 8px 16px;
		color: #4b4b4b;
		font-weight: 600;
	}

	:global(
		.daynight-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li.active
			.daynight-buybox-mode
	) {
		color: #ffffff;
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .daynight-buybox-mode:focus-visible) {
		outline: 2px solid var(--bc-focus);
		outline-offset: 2px;
		border-radius: 999px;
	}

	/* Buy-box CTAs: the template's default is heavy black full-pills that clash
	   with the flat 8px card language. Primary = brand green, secondary = clean
	   outline, with a clear hierarchy. */
	:global(.daynight-pdp-desktop .daynight-buybox-action) {
		min-height: 48px;
		border-radius: var(--bc-radius-control);
		border: 1px solid transparent;
		font-weight: 600;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
	}

	:global(.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:first-child) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: #ffffff;
	}

	:global(
		.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:first-child:focus-visible
	) {
		background: #1c1c1c;
		border-color: #1c1c1c;
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:first-child:hover
		) {
			background: #1c1c1c;
			border-color: #1c1c1c;
			color: #ffffff;
		}
	}

	:global(.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:last-child) {
		background: #ffffff;
		border-color: var(--bc-border);
		color: #1c1c1c;
	}

	:global(
		.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:last-child:focus-visible
	) {
		background: #1c1c1c;
		border-color: #1c1c1c;
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.daynight-pdp-desktop .daynight-buybox-actions .daynight-buybox-action:last-child:hover
		) {
			background: #1c1c1c;
			border-color: #1c1c1c;
			color: #ffffff;
		}
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		box-shadow: none;
		margin-bottom: 28px;
		padding: 24px;
	}

	:global(.daynight-pdp-desktop .rating-box) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		box-shadow: none;
	}

	:global(.daynight-pdp-desktop .comment-box) {
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		box-shadow: none;
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .menu-tab-style5) {
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid #dde0e4;
		border-radius: 999px;
		padding: 4px;
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li) {
		border-radius: 999px;
	}

	:global(.daynight-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li.active) {
		background: #1c1c1c;
		color: #ffffff;
	}

	:global(.daynight-pdp-desktop .car-overview-list-style2 li) {
		border-color: var(--bc-border);
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
	}

	/* Tabular figures keep specs and the stock reference reading as clean data
	   rather than raw scraped text; min-width:0 lets the value ellipsize instead
	   of forcing the label to wrap. */
	:global(.daynight-pdp-desktop .car-overview-list-style2 li > span) {
		font-variant-numeric: tabular-nums;
		min-width: 0;
		overflow-wrap: anywhere;
		padding-left: 12px;
	}

	/* The stock reference is the last row and a long identifier — de-emphasise it
	   (smaller, muted) so it reads like a reference code and fits on one line
	   instead of wrapping or bleeding past the card. */
	:global(.daynight-pdp-desktop .car-overview-list-style2 li:last-child > span) {
		font-size: 14px;
		color: #5b5b5b;
		align-self: center;
	}

	:global(.daynight-pdp-desktop .listing-details--contact .verify) {
		background: var(--bc-accent-tint);
		border: 1px solid rgb(185 22 28 / 0.18);
		border-radius: 999px;
		padding: 4px 10px;
		width: max-content;
	}

	:global(.daynight-pdp-desktop .listing-details--contact .verify .text-highlight) {
		color: var(--bc-accent) !important;
	}

	:global(.daynight-pdp-desktop .listing-details--contact .btn-primary-3) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-pdp-desktop .listing-details--contact .btn-primary-3:hover) {
			background: #1c1c1c;
			border-color: #1c1c1c;
		}
	}

	:global(.daynight-pdp-desktop .listing-details--contact .daynight-viber-action) {
		background: #ffffff !important;
		border: 1px solid var(--bc-border) !important;
		color: var(--bc-ink) !important;
	}

	:global(.daynight-pdp-desktop .listing-details--contact .daynight-viber-action img) {
		filter: brightness(0) saturate(100%);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-pdp-desktop .listing-details--contact .daynight-viber-action:hover) {
			background: var(--bc-surface) !important;
			border-color: var(--bc-border-strong) !important;
		}
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4) {
		align-items: stretch;
		background: var(--bc-surface);
		border: 1px solid #dde0e4;
		border-radius: 8px;
		border-bottom: 1px solid #dde0e4;
		display: flex;
		gap: 6px;
		padding: 6px;
		width: 100%;
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li) {
		border-radius: 8px;
		flex: 1 1 0;
		padding: 9px 10px;
		text-align: center;
		transition:
			background-color 160ms ease,
			box-shadow 160ms ease;
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li:not(:last-child)) {
		margin-right: 0;
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li::before) {
		display: none;
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li.active) {
		background: var(--bc-accent) !important;
	}

	:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li.active span) {
		color: #ffffff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover),
		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within) {
			background: #f3f4f6 !important;
			box-shadow: inset 0 0 0 1px rgba(227, 6, 47, 0.34) !important;
		}

		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover span),
		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within span) {
			color: #1c1c1c !important;
		}

		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li.active:hover),
		:global(.daynight-pdp-desktop .flat-tabs .menu-tab-style4 li.active:focus-within) {
			background: var(--bc-accent) !important;
			box-shadow: inset 0 0 0 1px rgba(227, 6, 47, 0.22) !important;
		}
	}

	:global(.daynight-pdp-desktop .daynight-pdp-tab-description) {
		font-size: var(--bc-text-body);
		line-height: 1.7;
		margin: 0;
		max-width: 70ch;
	}

	:global(.daynight-pdp-desktop .flat-tabs + .h4),
	:global(.daynight-pdp-desktop .flat-tabs + .divider + .h4) {
		margin-top: 34px;
	}

	:global(.daynight-pdp-desktop .financing-calculator) {
		padding: 26px;
	}

	:global(.daynight-pdp-desktop .financing-calculator input),
	:global(.daynight-pdp-desktop .financing-calculator select),
	:global(.daynight-pdp-desktop .send-inquiry input),
	:global(.daynight-pdp-desktop .send-inquiry select),
	:global(.daynight-pdp-desktop .send-inquiry textarea) {
		background: rgba(255, 255, 255, 0.86);
		border-color: var(--bc-border);
		border-radius: 8px;
	}

	:global(.daynight-pdp-desktop .widget-gg-map) {
		border-radius: 8px;
		height: 420px;
	}

	:global(.daynight-pdp-desktop .widget-gg-map iframe) {
		height: 420px;
	}

	:global(.daynight-pdp-desktop .rating-box) {
		padding: 26px;
	}

	:global(.daynight-pdp-desktop .comment-box) {
		padding: 24px;
	}

	@media (max-width: 1199.98px) {
		:global(.daynight-pdp-desktop .listing-details) {
			gap: 34px;
			grid-template-columns: minmax(0, 1fr) 360px;
		}

		:global(.daynight-pdp-desktop .title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
	}

	@media (max-width: 767.98px) {
		:global(.daynight-pdp-desktop-breadcrumb),
		:global(.daynight-pdp-desktop) {
			display: none;
		}
	}
</style>
