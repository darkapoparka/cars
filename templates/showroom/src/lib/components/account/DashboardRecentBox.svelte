<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';

	let { recent }: { recent: AuxeroDashboardRecentData } = $props();
</script>

<div class="dashboard-box eliqauto-dashboard-overview bg-white" data-eliqauto-dashboard-recent>
	<div class="eliqauto-dashboard-overview__header">
		<div class="eliqauto-dashboard-overview__title">
			<p class="h4 mb-8">{recent.heading}</p>
			<p class="h7 text-secondary">{recent.intro}</p>
		</div>
		<a
			href={resolve(recent.primaryAction.href)}
			class="btn btn-small btn-primary-3 font-weight-600 eliqauto-dashboard-overview__primary"
		>
			<img src={recent.primaryAction.icon} alt="" aria-hidden="true" />
			{recent.primaryAction.label}
		</a>
	</div>

	<div class="eliqauto-dashboard-overview__summary" aria-label="Обобщение на таблото">
		{#each recent.summary as item (item.id)}
			<div
				class={[
					'eliqauto-dashboard-summary-item',
					item.tone && `is-${item.tone}`,
					item.value.length > 3 && 'is-label-value'
				]}
			>
				<p class="eliqauto-dashboard-summary-item__value">{item.value}</p>
				<p class="eliqauto-dashboard-summary-item__label">{item.label}</p>
			</div>
		{/each}
	</div>

	<div class="eliqauto-dashboard-recent">
		<div class="eliqauto-dashboard-recent__header">
			<p class="h5 mb-0">Приоритетна опашка</p>
			<p class="text-secondary mb-0 text-sm">{recent.items.length} последни</p>
		</div>

		<div class="eliqauto-dashboard-recent__list">
			{#each recent.items as item (item.id)}
				<article class="comment-box eliqauto-dashboard-recent-card">
					<div class="eliqauto-dashboard-recent-card__content">
						<div class="comment-box__header gap-12">
							<div class="comment-box__avatar">
								<img src={item.avatar} alt={item.name} />
							</div>
							<div class="eliqauto-dashboard-recent-card__person">
								<p class="eliqauto-dashboard-recent-card__name mb-4">{item.name}</p>
								<p class="text-secondary mb-0 text-sm">{item.dateLabel}</p>
							</div>
						</div>
						<p class="eliqauto-dashboard-recent-card__title mb-6">{item.title}</p>
						<p class="eliqauto-dashboard-meta text-secondary mb-8">{item.metaLabel}</p>
						<p class="eliqauto-dashboard-recent-card__body mb-0">{item.body}</p>
					</div>
					<div class="eliqauto-dashboard-recent-card__aside">
						<span class="eliqauto-dashboard-status">{item.statusLabel}</span>
						<a href={resolve(item.href)} class="view-details eliqauto-dashboard-recent-card__link">
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
				<div class="comment-box eliqauto-dashboard-recent-card is-empty">
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
	.eliqauto-dashboard-overview {
		display: grid;
		gap: 18px;
		border-color: var(--bc-dashboard-border);
		border-radius: var(--bc-dashboard-card-radius);
		background: var(--bc-dashboard-surface);
		box-shadow: none;
		padding: 24px;
	}

	.eliqauto-dashboard-overview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
	}

	.eliqauto-dashboard-overview__title {
		max-width: 680px;
	}

	.eliqauto-dashboard-overview__primary {
		min-height: 44px;
		border-radius: 10px;
		padding-right: 20px;
		padding-left: 20px;
		white-space: nowrap;
	}

	.eliqauto-dashboard-overview__primary img {
		width: 18px;
		height: 18px;
		object-fit: contain;
	}

	.eliqauto-dashboard-overview__summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.eliqauto-dashboard-summary-item {
		min-width: 0;
		border: 1px solid var(--bc-dashboard-border);
		border-radius: 10px;
		background: var(--bc-dashboard-card-hover);
		padding: 14px 16px;
	}

	.eliqauto-dashboard-summary-item__value {
		margin: 0 0 4px;
		color: #1c1c1c;
		font-size: 27px;
		font-weight: 600;
		line-height: 32px;
	}

	.eliqauto-dashboard-summary-item__label {
		margin: 0;
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.eliqauto-dashboard-summary-item.is-attention .eliqauto-dashboard-summary-item__value {
		color: #a51717;
	}

	.eliqauto-dashboard-summary-item.is-calm .eliqauto-dashboard-summary-item__value {
		color: var(--bc-dashboard-text);
	}

	.eliqauto-dashboard-summary-item.is-label-value .eliqauto-dashboard-summary-item__value {
		font-size: 21px;
		line-height: 27px;
	}

	.eliqauto-dashboard-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 10px;
	}

	.eliqauto-dashboard-action {
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

	.eliqauto-dashboard-action:hover,
	.eliqauto-dashboard-action:focus-visible {
		border-color: var(--bc-dashboard-border-strong);
		background: var(--bc-dashboard-action-hover);
	}

	.eliqauto-dashboard-action__icon {
		display: inline-flex;
		width: 36px;
		min-width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--bc-border);
		border-radius: 9px;
		background: #ffffff;
	}

	.eliqauto-dashboard-action__copy {
		display: grid;
		min-width: 0;
		gap: 2px;
	}

	.eliqauto-dashboard-action__label,
	.eliqauto-dashboard-action__meta {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eliqauto-dashboard-action__label {
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
	}

	.eliqauto-dashboard-action__meta,
	.eliqauto-dashboard-meta {
		color: var(--bc-muted);
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.eliqauto-dashboard-recent {
		display: grid;
		gap: 10px;
	}

	.eliqauto-dashboard-recent__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.eliqauto-dashboard-recent__list {
		display: grid;
		overflow: hidden;
		border: 1px solid var(--bc-dashboard-border);
		border-radius: 12px;
		background: var(--bc-dashboard-surface);
		padding: 0 18px;
	}

	.eliqauto-dashboard-recent-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 18px;
		margin: 0;
		border-bottom: 1px solid var(--bc-border);
		padding: 18px 0;
	}

	.eliqauto-dashboard-recent-card:last-child {
		border-bottom: 0;
	}

	.eliqauto-dashboard-recent-card.is-empty {
		display: block;
	}

	.eliqauto-dashboard-recent-card__person {
		min-width: 0;
		flex: 1;
	}

	.eliqauto-dashboard-recent-card__content {
		display: grid;
		min-width: 0;
		gap: 10px;
	}

	.eliqauto-dashboard-recent-card__name,
	.eliqauto-dashboard-recent-card__title {
		color: #1c1c1c;
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	.eliqauto-dashboard-recent-card__body {
		max-width: 760px;
		color: var(--bc-dashboard-text);
		font-size: 15px;
		font-weight: 500;
		line-height: 23px;
	}

	.eliqauto-dashboard-recent-card :global(.comment-box__header) {
		align-items: center;
		margin-bottom: 0;
	}

	.eliqauto-dashboard-recent-card :global(.comment-box__avatar) {
		width: 46px;
		min-width: 46px;
		height: 46px;
		background: #fff8f8;
	}

	.eliqauto-dashboard-recent-card :global(.comment-box__avatar img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.eliqauto-dashboard-recent-card__aside {
		display: flex;
		min-width: 126px;
		align-items: flex-end;
		flex-direction: column;
		justify-content: space-between;
		gap: 16px;
	}

	.eliqauto-dashboard-status {
		display: inline-flex;
		min-height: 28px;
		align-items: center;
		border-radius: 999px;
		background: var(--bc-dashboard-status-bg);
		color: var(--bc-dashboard-status-text);
		padding: 0 11px;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.eliqauto-dashboard-recent-card__link {
		display: inline-flex;
		min-height: 28px;
		align-items: center;
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
	}

	@media (max-width: 1199px) {
		.eliqauto-dashboard-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.eliqauto-dashboard-overview {
			gap: 16px;
			padding: 18px;
		}

		.eliqauto-dashboard-overview__header,
		.eliqauto-dashboard-recent__header {
			align-items: stretch;
			flex-direction: column;
		}

		.eliqauto-dashboard-overview__primary {
			width: 100%;
			justify-content: center;
		}

		.eliqauto-dashboard-overview__summary,
		.eliqauto-dashboard-actions {
			grid-template-columns: 1fr;
		}

		.eliqauto-dashboard-summary-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 13px 14px;
		}

		.eliqauto-dashboard-summary-item__value {
			margin: 0;
			font-size: 24px;
			line-height: 30px;
		}

		.eliqauto-dashboard-summary-item__label {
			text-align: right;
		}

		.eliqauto-dashboard-recent__list {
			padding: 0 14px;
		}

		.eliqauto-dashboard-recent-card {
			grid-template-columns: 1fr;
			gap: 14px;
			padding: 16px 0;
		}

		.eliqauto-dashboard-recent-card__aside {
			min-width: 0;
			align-items: center;
			flex-direction: row;
		}

		.eliqauto-dashboard-status {
			margin-left: 0;
		}
	}
</style>
