<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';

	let { recent }: { recent: AuxeroDashboardRecentData } = $props();
</script>

<div class="dashboard-box daynight-dashboard-overview bg-white" data-daynight-dashboard-recent>
	<div class="daynight-dashboard-overview__header">
		<div class="daynight-dashboard-overview__title">
			<p class="h4 mb-8">{recent.heading}</p>
			<p class="h7 text-secondary">{recent.intro}</p>
		</div>
		<a
			href={resolve(recent.primaryAction.href)}
			class="btn btn-small btn-primary-3 font-weight-600 daynight-dashboard-overview__primary"
		>
			<img src={recent.primaryAction.icon} alt="" aria-hidden="true" />
			{recent.primaryAction.label}
		</a>
	</div>

	<div class="daynight-dashboard-overview__summary" aria-label="Обобщение на таблото">
		{#each recent.summary as item (item.id)}
			<div
				class={[
					'daynight-dashboard-summary-item',
					item.tone && `is-${item.tone}`,
					item.value.length > 3 && 'is-label-value'
				]}
			>
				<p class="daynight-dashboard-summary-item__value">{item.value}</p>
				<p class="daynight-dashboard-summary-item__label">{item.label}</p>
			</div>
		{/each}
	</div>

	<div class="daynight-dashboard-recent">
		<div class="daynight-dashboard-recent__header">
			<p class="h5 mb-0">Приоритетна опашка</p>
			<p class="text-secondary mb-0 text-sm">{recent.items.length} последни</p>
		</div>

		<div class="daynight-dashboard-recent__list">
			{#each recent.items as item (item.id)}
				<article class="comment-box daynight-dashboard-recent-card">
					<div class="daynight-dashboard-recent-card__content">
						<div class="comment-box__header gap-12">
							<div class="comment-box__avatar">
								<img src={item.avatar} alt={item.name} />
							</div>
							<div class="daynight-dashboard-recent-card__person">
								<p class="daynight-dashboard-recent-card__name mb-4">{item.name}</p>
								<p class="text-secondary mb-0 text-sm">{item.dateLabel}</p>
							</div>
						</div>
						<p class="daynight-dashboard-recent-card__title mb-6">{item.title}</p>
						<p class="daynight-dashboard-meta text-secondary mb-8">{item.metaLabel}</p>
						<p class="daynight-dashboard-recent-card__body mb-0">{item.body}</p>
					</div>
					<div class="daynight-dashboard-recent-card__aside">
						<span class="daynight-dashboard-status">{item.statusLabel}</span>
						<a href={resolve(item.href)} class="view-details daynight-dashboard-recent-card__link">
							{item.actionLabel}
							<img
								class="ml-4"
								src="/assets/icons/CaretCircleRight.svg"
								alt=""
								aria-hidden="true"
							/>
						</a>
					</div>
				</article>
			{:else}
				<div class="comment-box daynight-dashboard-recent-card is-empty">
					<p class="h5 mb-8">В момента няма нищо за внимание</p>
					<p class="h7 line-height-28 mb-0">
						Нови запитвания, съобщения и обяви ще се появят тук веднага щом постъпят.
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.daynight-dashboard-overview {
		display: grid;
		gap: 18px;
		border-color: var(--bc-dashboard-border) !important;
		border-radius: var(--bc-dashboard-card-radius) !important;
		background: var(--bc-dashboard-surface) !important;
		box-shadow: none !important;
		padding: 24px !important;
	}

	.daynight-dashboard-overview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
	}

	.daynight-dashboard-overview__title {
		max-width: 680px;
	}

	.daynight-dashboard-overview__primary {
		min-height: 44px;
		border-radius: 10px;
		padding-right: 20px;
		padding-left: 20px;
		white-space: nowrap;
	}

	.daynight-dashboard-overview__primary img {
		width: 18px;
		height: 18px;
		object-fit: contain;
	}

	.daynight-dashboard-overview__summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.daynight-dashboard-summary-item {
		min-width: 0;
		border: 1px solid var(--bc-dashboard-border);
		border-radius: 10px;
		background: var(--bc-dashboard-card-hover);
		padding: 14px 16px;
	}

	.daynight-dashboard-summary-item__value {
		margin: 0 0 4px;
		color: #1c1c1c;
		font-size: 27px;
		font-weight: 600;
		line-height: 32px;
	}

	.daynight-dashboard-summary-item__label {
		margin: 0;
		color: #687064;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.daynight-dashboard-summary-item.is-attention .daynight-dashboard-summary-item__value {
		color: #E3062F;
	}

	.daynight-dashboard-summary-item.is-calm .daynight-dashboard-summary-item__value {
		color: #1C1C1C;
	}

	.daynight-dashboard-summary-item.is-label-value .daynight-dashboard-summary-item__value {
		font-size: 21px;
		line-height: 27px;
	}

	.daynight-dashboard-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 10px;
	}

	.daynight-dashboard-action {
		display: flex;
		min-width: 0;
		min-height: 58px;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--bc-dashboard-border);
		border-radius: 10px;
		background: var(--bc-dashboard-action-bg);
		padding: 10px 13px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.daynight-dashboard-action:hover,
	.daynight-dashboard-action:focus-visible {
		border-color: var(--bc-dashboard-border-strong);
		background: var(--bc-dashboard-action-hover);
	}

	.daynight-dashboard-action__icon {
		display: inline-flex;
		width: 36px;
		min-width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid #e3eadc;
		border-radius: 9px;
		background: #ffffff;
	}

	.daynight-dashboard-action__copy {
		display: grid;
		min-width: 0;
		gap: 2px;
	}

	.daynight-dashboard-action__label,
	.daynight-dashboard-action__meta {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.daynight-dashboard-action__label {
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
	}

	.daynight-dashboard-action__meta,
	.daynight-dashboard-meta {
		color: #687064;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.daynight-dashboard-recent {
		display: grid;
		gap: 10px;
	}

	.daynight-dashboard-recent__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.daynight-dashboard-recent__list {
		display: grid;
		overflow: hidden;
		border: 1px solid var(--bc-dashboard-border);
		border-radius: 12px;
		background: var(--bc-dashboard-surface);
		padding: 0 18px;
	}

	.daynight-dashboard-recent-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 18px;
		margin: 0 !important;
		border-bottom: 1px solid var(--bc-border) !important;
		padding: 18px 0 !important;
	}

	.daynight-dashboard-recent-card:last-child {
		border-bottom: 0 !important;
	}

	.daynight-dashboard-recent-card.is-empty {
		display: block;
	}

	.daynight-dashboard-recent-card__person {
		min-width: 0;
		flex: 1;
	}

	.daynight-dashboard-recent-card__content {
		display: grid;
		min-width: 0;
		gap: 10px;
	}

	.daynight-dashboard-recent-card__name,
	.daynight-dashboard-recent-card__title {
		color: #1c1c1c;
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	.daynight-dashboard-recent-card__body {
		max-width: 760px;
		color: #31362d;
		font-size: 15px;
		font-weight: 500;
		line-height: 23px;
	}

	.daynight-dashboard-recent-card :global(.comment-box__header) {
		align-items: center;
		margin-bottom: 0 !important;
	}

	.daynight-dashboard-recent-card :global(.comment-box__avatar) {
		width: 46px;
		min-width: 46px;
		height: 46px;
		background: #FEE2E2;
	}

	.daynight-dashboard-recent-card :global(.comment-box__avatar img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.daynight-dashboard-recent-card__aside {
		display: flex;
		min-width: 126px;
		align-items: flex-end;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
	}

	.daynight-dashboard-status {
		display: inline-flex;
		min-height: 28px;
		align-items: center;
		border-radius: 999px;
		background: var(--bc-dashboard-status-bg);
		color: var(--bc-dashboard-status-text);
		padding: 0 11px;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.daynight-dashboard-recent-card__link {
		display: inline-flex;
		min-height: 28px;
		align-items: center;
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
	}

	@media (max-width: 1199px) {
		.daynight-dashboard-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.daynight-dashboard-overview {
			gap: 16px;
			padding: 18px !important;
		}

		.daynight-dashboard-overview__header,
		.daynight-dashboard-recent__header {
			align-items: stretch;
			flex-direction: column;
		}

		.daynight-dashboard-overview__primary {
			width: 100%;
			justify-content: center;
		}

		.daynight-dashboard-overview__summary,
		.daynight-dashboard-actions {
			grid-template-columns: 1fr;
		}

		.daynight-dashboard-summary-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 13px 14px;
		}

		.daynight-dashboard-summary-item__value {
			margin: 0;
			font-size: 24px;
			line-height: 30px;
		}

		.daynight-dashboard-summary-item__label {
			text-align: right;
		}

		.daynight-dashboard-recent__list {
			padding: 0 14px;
		}

		.daynight-dashboard-recent-card {
			grid-template-columns: 1fr;
			gap: 14px;
			padding: 16px 0 !important;
		}

		.daynight-dashboard-recent-card__aside {
			min-width: 0;
			align-items: center;
			flex-direction: row;
		}

		.daynight-dashboard-status {
			margin-left: 0;
		}
	}
</style>
