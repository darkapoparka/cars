<script lang="ts">
	import { resolve } from '$app/paths';
	import { Edit3, MessageSquare, Trash2 } from '@lucide/svelte';
	import type { AuxeroAccountListingsData } from '$lib/auxero/account-listings';

	let { listings }: { listings: AuxeroAccountListingsData } = $props();
</script>

<section class="dash-card" data-daynight-account-listings>
	<div class="dash-card__head">
		<div>
			<h2 class="dash-card__title">
				{listings.isSubmissions ? 'Submitted vehicles' : 'Inventory list'}
			</h2>
			<p class="dash-card__subtitle">{listings.footerText}</p>
		</div>
		{#if listings.pagination}
			<span class="dash-role-pill">Page 1</span>
		{/if}
	</div>

	<div class="dash-table-wrap">
		<table class="dash-table">
			<thead>
				<tr>
					{#each listings.headers as header (header)}
						<th>{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each listings.rows as row (row.id)}
					<tr
						data-daynight-slug={row.kind === 'inventory' ? row.id : undefined}
						data-daynight-submission-id={row.kind === 'submission' ? row.id : undefined}
					>
						<td>
							{#if row.kind === 'inventory'}
								<a
									href={resolve('/admin/inventory/edit/[id]', { id: row.id })}
									class="dash-table__vehicle"
									data-sveltekit-reload
								>
									<div class="dash-table__image">
										<img src={row.image} alt={row.title} />
									</div>
									<div class="min-w-0">
										<p class="dash-table__name">{row.title}</p>
										<p class="dash-table__meta">{row.description}</p>
										{#if row.priceLabel}
											<p class="m-0 mt-1 text-sm font-black text-[var(--dash-primary)]">
												{row.priceLabel}
											</p>
										{/if}
									</div>
								</a>
							{:else}
								<div class="dash-table__vehicle">
									<div class="dash-table__image">
										<img src={row.image} alt={row.title} />
									</div>
									<div class="min-w-0">
										<p class="dash-table__name">{row.title}</p>
										<p class="dash-table__meta">{row.description}</p>
										{#if row.titleMeta}
											<p class="m-0 mt-1 text-sm font-black text-[var(--dash-primary)]">
												{row.titleMeta}
											</p>
										{/if}
									</div>
								</div>
							{/if}
						</td>
						{#each row.columns as column, index (`${row.id}-${index}`)}
							<td>
								<span class={index === 0 ? 'dash-table__strong' : ''}>{column}</span>
							</td>
						{/each}
						<td>
							<div class="dash-actions">
								{#each row.actions as action (action.kind)}
									{#if action.kind === 'remove'}
										<button
											type="button"
											class="dash-action dash-action--danger"
											aria-label={action.ariaLabel}
										>
											<Trash2 size={16} strokeWidth={2.1} aria-hidden="true" />
										</button>
									{:else if action.kind === 'edit-inventory'}
										<a
											href={resolve('/admin/inventory/edit/[id]', { id: row.id })}
											class="dash-action"
											aria-label={action.ariaLabel}
											data-sveltekit-reload
										>
											<Edit3 size={16} strokeWidth={2.1} aria-hidden="true" />
										</a>
									{:else if action.kind === 'edit-submission'}
										<a
											href={resolve('/account/listings/edit/[id]', { id: row.id })}
											class="dash-action"
											aria-label={action.ariaLabel}
										>
											<Edit3 size={16} strokeWidth={2.1} aria-hidden="true" />
										</a>
									{:else if action.kind === 'message'}
										<a
											href={resolve('/account/messages')}
											class="dash-action"
											aria-label={action.ariaLabel}
										>
											<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
										</a>
									{/if}
								{/each}
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan={listings.headers.length}>
							<div class="dash-empty">
								<p class="m-0 text-base font-black text-[var(--dash-heading)]">No vehicles yet</p>
								<p class="m-0 mt-2 text-sm font-semibold text-[var(--dash-muted)]">
									New inventory and submitted vehicles will appear here.
								</p>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if listings.pagination}
		<div
			class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--dash-border)] p-4"
		>
			<div class="flex gap-2">
				{#each listings.pagination as item, index (item)}
					<a
						href={resolve('/admin/inventory')}
						class={index === 0
							? 'dash-primary-button min-w-10 px-0'
							: 'dash-secondary-button min-w-10 px-0'}
					>
						{item}
					</a>
				{/each}
			</div>
			<p class="m-0 text-sm font-bold text-[var(--dash-muted)]">{listings.footerText}</p>
		</div>
	{/if}
</section>
