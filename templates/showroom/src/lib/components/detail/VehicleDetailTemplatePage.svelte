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
	title={`${detail.title} — Eliq Auto`}
>
	<section class="eliqauto-pdp-desktop pb-100">
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
	:global(.eliqauto-pdp-desktop) {
		background: var(--bc-surface);
	}

	:global(.eliqauto-pdp-desktop .tf-spacing-style4) {
		height: 24px;
	}

	@media (min-width: 768px) {
		:global(.eliqauto-pdp-desktop .listing-details) {
			align-items: start;
			display: grid;
			gap: 32px;
			grid-template-columns: minmax(0, 1fr) minmax(360px, 400px);
		}

		:global(.eliqauto-pdp-desktop .listing-details--content),
		:global(.eliqauto-pdp-desktop .listing-details--sidebar) {
			min-width: 0;
			width: auto;
		}

		:global(.eliqauto-pdp-desktop .listing-details--sidebar) {
			position: sticky;
			top: 104px;
		}
	}

	:global(.eliqauto-pdp-desktop .title-section) {
		align-items: center;
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		display: grid;
		gap: 16px;
		grid-template-columns: auto minmax(0, 1fr) auto;
		margin-bottom: 24px;
		padding: 22px 24px;
	}

	:global(.eliqauto-pdp-desktop .title-section h1) {
		color: var(--bc-ink);
		font-size: clamp(34px, 2.6vw, 42px);
		font-weight: 750;
		letter-spacing: -0.02em;
		line-height: 1.08;
		margin-bottom: 0;
		max-width: none;
		min-width: 0;
	}

	:global(.eliqauto-pdp-desktop .title-section > div) {
		flex: 0 0 auto;
	}

	:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		box-sizing: border-box;
		color: #1c1c1c;
		flex: 0 0 48px;
		width: 48px;
		height: 48px;
		line-height: 1;
		padding: 0;
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare) {
		background: var(--bc-surface-raised);
		border-color: var(--bc-border);
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare svg path) {
		fill: none;
		stroke: #1c1c1c;
	}

	:global(
		.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true'] svg path
	) {
		stroke: var(--bc-accent-contrast);
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite svg path) {
		fill: none;
		stroke: #1c1c1c;
	}

	:global(
		.eliqauto-pdp-desktop
			.title-section
			.btn-icon-circle:not(.eliqauto-favorite):not(.eliqauto-pdp-compare)
			svg
			path
	) {
		fill: #1c1c1c;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle:hover) {
			background: var(--bc-surface-hover);
			border-color: var(--bc-border-strong);
			color: var(--bc-ink);
		}

		:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare:hover) {
			background: var(--bc-surface-hover);
			border-color: var(--bc-border-strong);
			color: var(--bc-ink);
		}

		:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']:hover) {
			background: var(--bc-accent-hover);
			border-color: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
		}

		:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare:hover svg path) {
			stroke: var(--bc-ink);
		}

		:global(
			.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']:hover svg path
		) {
			stroke: var(--bc-accent-contrast);
		}

		:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite:hover svg path) {
			stroke: var(--bc-hover-accent-ink);
		}

		:global(
			.eliqauto-pdp-desktop
				.title-section
				.btn-icon-circle:not(.eliqauto-favorite):not(.eliqauto-pdp-compare):hover
				svg
				path
		) {
			fill: var(--bc-hover-accent-ink);
		}
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-gallery-main) {
		background: var(--bc-surface-raised);
		border-radius: var(--bc-radius-lg);
		height: clamp(520px, 44vw, 600px);
		margin-bottom: 14px;
	}

	:global(.eliqauto-pdp-desktop .listing-details-item) {
		background: var(--bc-surface-raised);
		border-radius: var(--bc-radius-lg);
	}

	:global(.eliqauto-pdp-desktop .listing-details-item .img-main) {
		height: 100%;
		width: 100%;
	}

	:global(.eliqauto-pdp-desktop .listing-details-thumb) {
		background: var(--bc-surface-raised);
		border-radius: var(--bc-radius-md);
	}

	:global(.eliqauto-pdp-desktop .listing-details-thumb img) {
		border-radius: var(--bc-radius-md);
	}

	:global(.eliqauto-pdp-desktop .swiper-listing-details-thumbs) {
		padding-bottom: 46px;
	}

	:global(.eliqauto-pdp-desktop .listing-details-item--button) {
		background: var(--bc-ink);
		border: 1px solid var(--bc-ink);
		border-radius: var(--bc-radius-md);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .listing-details-item--button:hover) {
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .listing-details--content > .h4),
	:global(.eliqauto-pdp-desktop .listing-details--content > p.h4),
	:global(.eliqauto-pdp-desktop .listing-details--content > div + .h4) {
		color: var(--bc-ink);
	}

	:global(.eliqauto-pdp-desktop .listing-details--content > .divider) {
		display: none;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		margin-bottom: 40px;
		padding: 24px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel > .h4) {
		margin-bottom: 16px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .flat-tabs) {
		margin-bottom: 0;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .content-tab) {
		min-width: 0;
	}

	/* The shared template animates tab panels with `transition: all 0.5s` from
	   `scale(0.9)`, so a click looks sluggish/half-rendered for half a second and
	   reads as "didn't register" — prompting a second click. Snap the swap to a
	   fast opacity fade with no transform, scoped to the PDP tab panels only
	   (the feature tabs and the cash/finance buy-box toggle). */
	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .content-inner),
	:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .content-inner.active),
	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .content-inner),
	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .content-inner.active) {
		transform: none;
		transition: opacity 120ms ease;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .content-inner),
		:global(.eliqauto-pdp-desktop .eliqauto-pdp-info-panel .content-inner.active),
		:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .content-inner),
		:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .content-inner.active) {
			transition: none;
		}
	}

	/* Cash/finance toggle: the pill markup is a <li> styled by the template, so
	   the click target is a <button> filling it. Move the pill padding onto the
	   button so the whole pill is clickable, and keep the active label white
	   despite the global ink reset. */
	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li:not(.item)) {
		padding: 0;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .eliqauto-buybox-mode) {
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
		.eliqauto-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li.active
			.eliqauto-buybox-mode
	) {
		color: #ffffff;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .eliqauto-buybox-mode:focus-visible) {
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
		border-radius: 999px;
	}

	/* Buy-box CTAs: the template's default is heavy black full-pills that clash
	   with the flat 8px card language. Primary = brand red, secondary = clean
	   outline, with a clear hierarchy. */
	:global(.eliqauto-pdp-desktop .eliqauto-buybox-action) {
		min-height: 48px;
		border-radius: 8px;
		border: 1px solid transparent;
		font-weight: 600;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child:focus-visible
	) {
		background: var(--bc-accent-hover);
		border-color: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child:hover
		) {
			background: var(--bc-accent-hover);
			border-color: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child) {
		background: var(--bc-surface-raised);
		border-color: var(--bc-border-strong);
		color: var(--bc-ink);
	}

	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child:focus-visible
	) {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child:hover
		) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box),
	:global(.eliqauto-pdp-desktop .financing-calculator),
	:global(.eliqauto-pdp-desktop .rating-box),
	:global(.eliqauto-pdp-desktop .comment-box) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		box-shadow: none;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box) {
		margin-bottom: 28px;
		padding: 24px;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box:first-child) {
		background: var(--bc-surface-raised);
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5) {
		background: var(--bc-surface);
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		padding: 4px;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li) {
		border-radius: 999px;
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li.active) {
		background: #1c1c1c;
		color: #ffffff;
	}

	:global(.eliqauto-pdp-desktop .car-overview-list-style2 li) {
		border-color: var(--bc-border);
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
	}

	/* Tabular figures keep specs and the stock reference reading as clean data
	   rather than raw scraped text; min-width:0 lets the value ellipsize instead
	   of forcing the label to wrap. */
	:global(.eliqauto-pdp-desktop .car-overview-list-style2 li > span) {
		font-variant-numeric: tabular-nums;
		min-width: 0;
		overflow-wrap: anywhere;
		padding-left: 12px;
	}

	/* The stock reference is the last row and a long identifier — de-emphasise it
	   (smaller, muted) so it reads like a reference code and fits on one line
	   instead of wrapping or bleeding past the card. */
	:global(.eliqauto-pdp-desktop .car-overview-list-style2 li:last-child > span) {
		font-size: 14px;
		color: #5b5b5b;
		align-self: center;
	}

	:global(.eliqauto-pdp-desktop .listing-details--contact .verify) {
		background: var(--bc-accent-soft);
		border-radius: 999px;
		padding: 4px 10px;
		width: max-content;
	}

	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3:hover) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
		}
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4) {
		align-items: stretch;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--bc-border);
		border-radius: 0;
		display: flex;
		gap: 0;
		overflow-x: auto;
		padding: 0;
		width: 100%;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li) {
		border-radius: 0;
		flex: 0 0 auto;
		min-width: max-content;
		padding: 12px 14px 11px;
		text-align: center;
		transition:
			background-color 160ms ease,
			box-shadow 160ms ease;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(:last-child)) {
		margin-right: 0;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li::before) {
		display: none;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active) {
		background: transparent;
		box-shadow: inset 0 -2px 0 var(--bc-ink);
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active span) {
		color: var(--bc-ink);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover),
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within) {
			background: var(--bc-surface);
			box-shadow: inset 0 -2px 0 var(--bc-border-strong);
		}

		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover span),
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within span) {
			color: var(--bc-ink);
		}

		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active:hover),
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active:focus-within) {
			background: var(--bc-surface);
			box-shadow: inset 0 -2px 0 var(--bc-ink);
		}
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-tab-description) {
		line-height: 1.8;
		margin: 0;
		max-width: 920px;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs + .h4),
	:global(.eliqauto-pdp-desktop .flat-tabs + .divider + .h4) {
		margin-top: 34px;
	}

	/* PDP controls use one intentional interaction language: neutral at rest,
	   ink-and-white on hover/focus, and an accent only for a persisted selection. */
	:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle) {
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle:focus-visible),
	:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle:active) {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
		color: var(--bc-accent-contrast);
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .title-section .btn-icon-circle:hover) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	:global(
		.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']:focus-visible
	),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']:active) {
		background: var(--bc-accent-hover);
		border-color: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true']:hover) {
			background: var(--bc-accent-hover);
			border-color: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite[aria-pressed='true']) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	:global(
		.eliqauto-pdp-desktop .title-section .eliqauto-favorite[aria-pressed='true']:focus-visible
	),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite[aria-pressed='true']:active) {
		background: var(--bc-accent-hover);
		border-color: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite[aria-pressed='true']:hover) {
			background: var(--bc-accent-hover);
			border-color: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
		}
	}

	:global(
		.eliqauto-pdp-desktop
			.title-section
			.btn-icon-circle:not(.eliqauto-favorite):not(.eliqauto-pdp-compare):focus-visible
			svg
			path
	),
	:global(
		.eliqauto-pdp-desktop
			.title-section
			.btn-icon-circle:not(.eliqauto-favorite):not(.eliqauto-pdp-compare):active
			svg
			path
	) {
		fill: currentColor;
	}

	:global(
		.eliqauto-pdp-desktop
			.title-section
			.btn-icon-circle:not(.eliqauto-favorite):not(.eliqauto-pdp-compare):hover
			svg
			path
	) {
		fill: currentColor;
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare:focus-visible svg path),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare:active svg path),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite:focus-visible svg path),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite:active svg path) {
		fill: none;
		stroke: currentColor;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare:hover svg path),
		:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite:hover svg path) {
			fill: none;
			stroke: currentColor;
		}
	}

	:global(.eliqauto-pdp-desktop .title-section .eliqauto-pdp-compare[aria-pressed='true'] svg path),
	:global(.eliqauto-pdp-desktop .title-section .eliqauto-favorite[aria-pressed='true'] svg path) {
		fill: none;
		stroke: var(--bc-accent-contrast);
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li) {
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}

	:global(
		.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 .eliqauto-buybox-mode
	) {
		border-radius: 999px;
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}

	:global(
		.eliqauto-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li:not(.active):focus-within
	),
	:global(
		.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li:not(.active):active
	) {
		background: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li:not(.active):hover
		) {
			background: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(
		.eliqauto-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li:not(.active):focus-within
			.eliqauto-buybox-mode
	),
	:global(
		.eliqauto-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li:not(.active):active
			.eliqauto-buybox-mode
	),
	:global(
		.eliqauto-pdp-desktop
			.listing-details--sidebar-box
			.menu-tab-style5
			li:not(.active):hover
			.eliqauto-buybox-mode
	) {
		color: var(--bc-accent-contrast);
	}

	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .eliqauto-buybox-mode:focus-visible),
	:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .eliqauto-buybox-mode:active) {
		background: var(--bc-ink);
		color: var(--bc-accent-contrast);
		outline: 2px solid var(--bc-accent);
		outline-offset: 2px;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .listing-details--sidebar-box .eliqauto-buybox-mode:hover) {
			background: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child:focus-visible
	),
	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child:active
	),
	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child:focus-visible
	),
	:global(
		.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child:active
	) {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:first-child:hover
		),
		:global(
			.eliqauto-pdp-desktop .eliqauto-buybox-actions .eliqauto-buybox-action:last-child:hover
		) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3),
	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-4) {
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3:focus-visible),
	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3:active),
	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-4:focus-visible),
	:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-4:active) {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-3:hover),
		:global(.eliqauto-pdp-desktop .listing-details--contact .btn-primary-4:hover) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	:global(.eliqauto-pdp-desktop .listing-details--contact .eliqauto-seller-identity .content > a) {
		color: var(--bc-ink);
		transition: color 160ms ease;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .listing-details--contact .eliqauto-seller-identity .content > a:hover
		),
		:global(
			.eliqauto-pdp-desktop
				.listing-details--contact
				.eliqauto-seller-identity
				.content
				> a:focus-visible
		) {
			color: var(--bc-accent);
		}
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li) {
		border-radius: 6px 6px 0 0;
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active span) {
		color: var(--bc-ink);
	}

	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active:hover),
	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active:focus-within),
	:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li.active:active) {
		background: transparent;
		border-radius: 6px 6px 0 0;
		box-shadow: inset 0 -2px 0 var(--bc-ink);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover),
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within) {
			background: var(--bc-surface);
			border-radius: 6px 6px 0 0;
			box-shadow: inset 0 -2px 0 var(--bc-border-strong);
		}

		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover span),
		:global(.eliqauto-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within span) {
			color: var(--bc-ink);
		}
	}

	:global(.eliqauto-pdp-desktop .financing-calculator) {
		padding: 26px;
	}

	:global(.eliqauto-pdp-desktop .financing-calculator input),
	:global(.eliqauto-pdp-desktop .financing-calculator select),
	:global(.eliqauto-pdp-desktop .send-inquiry input),
	:global(.eliqauto-pdp-desktop .send-inquiry select),
	:global(.eliqauto-pdp-desktop .send-inquiry textarea) {
		background: var(--bc-surface-raised);
		border-color: var(--bc-border);
		border-radius: 8px;
	}

	:global(.eliqauto-pdp-desktop .rating-box) {
		padding: 26px;
	}

	:global(.eliqauto-pdp-desktop .comment-box) {
		padding: 24px;
	}

	@media (max-width: 1199.98px) {
		:global(.eliqauto-pdp-desktop .listing-details) {
			gap: 24px;
			grid-template-columns: minmax(0, 1fr) minmax(340px, 360px);
		}

		:global(.eliqauto-pdp-desktop .title-section) {
			grid-template-columns: auto minmax(0, 1fr);
			row-gap: 16px;
		}

		:global(.eliqauto-pdp-desktop .title-section > div:last-child) {
			grid-column: 1 / -1;
			justify-content: flex-start;
		}
	}

	@media (max-width: 767.98px) {
		:global(.eliqauto-pdp-desktop) {
			display: none;
		}
	}
</style>
