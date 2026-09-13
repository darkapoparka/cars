<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroDashboardPageData } from '$lib/auxero/dashboard';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import DashboardRecentBox from './DashboardRecentBox.svelte';

	let {
		afterRecentHtml,
		beforeRecentHtml,
		dashboard,
		pageDocument
	}: {
		afterRecentHtml: string;
		beforeRecentHtml: string;
		dashboard: AuxeroDashboardPageData;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeRecentHtml}
	afterHtml={afterRecentHtml}
	title={dashboard.title}
>
	<div class="xl-grid-cols-2 sm-grid-cols-1 mb-30 grid grid-cols-4 gap-30">
		{#each dashboard.stats as stat (stat.id)}
			<a
				href={resolve(stat.href)}
				class="dashboard-cart"
				data-daynight-dashboard-stat={stat.id}
				data-daynight-stat-value={stat.value}
			>
				<div>
					<p class="h7 font-weight-500 mb-4">{stat.label}</p>
					<p class="h3">{stat.value}</p>
				</div>
				<div class="icon">
					<img src={stat.icon} alt={stat.label} />
				</div>
			</a>
		{/each}
	</div>
	<DashboardRecentBox recent={dashboard.recent} />
</AuxeroDashboardSlotShell>

<style>
	:global(body.dashboard .dashboard-content--inner) {
		padding-top: 42px !important;
	}

	/* The large page title already appears as the content heading below; the topbar
	   context header repeated it verbatim. Hide the duplicate — the role toggle
	   (Автомобили / Табло) beside it stays. */
	:global(body.dashboard .daynight-dashboard-context-heading) {
		display: none !important;
	}

	:global(body.dashboard .daynight-dashboard-context-links .menu-item-main > a),
	:global(body.dashboard .daynight-dashboard-context-links .current-menu-item > a) {
		background-color: #e3062f !important;
		border-color: #e3062f !important;
		color: #1c1c1c !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type) {
		gap: 18px !important;
		margin-bottom: 18px !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart) {
		min-height: 0;
		align-items: center !important;
		background: var(--bc-dashboard-surface) !important;
		border-color: var(--bc-dashboard-border) !important;
		border-radius: var(--bc-dashboard-card-radius) !important;
		box-shadow: none !important;
		padding: 20px 22px !important;
		transition:
			background-color var(--bc-motion-standard),
			border-color var(--bc-motion-standard) !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart:hover),
	:global(
		body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart:focus-visible
	) {
		border-color: var(--bc-dashboard-border-strong) !important;
		background: var(--bc-dashboard-card-hover) !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h7) {
		max-width: 132px;
		color: var(--bc-dashboard-heading);
		font-size: 16px;
		font-weight: 650 !important;
		line-height: 22px;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h3) {
		margin-top: 6px;
		font-size: 34px;
		font-weight: 800;
		line-height: 40px;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .icon) {
		flex: 0 0 62px !important;
		width: 62px !important;
		min-width: 62px !important;
		max-width: 62px !important;
		height: 62px !important;
		border-radius: var(--bc-dashboard-card-radius) !important;
		padding: 15px !important;
	}

	@media (max-width: 767.98px) {
		:global(body.dashboard .dashboard-content--inner) {
			padding-top: 18px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type) {
			gap: 12px !important;
			margin-bottom: 14px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart) {
			min-height: 98px;
			padding: 16px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h7) {
			max-width: none;
			font-size: 15px;
			line-height: 20px;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h3) {
			font-size: 28px;
			line-height: 34px;
		}
	}
</style>
