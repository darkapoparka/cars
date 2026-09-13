<script lang="ts">
	import { resolve } from '$app/paths';
	import { MessageSquare, Search, ShieldCheck } from '@lucide/svelte';
	import type {
		AuxeroUserManagementData,
		AuxeroUserManagementNote
	} from '$lib/auxero/user-management';

	let {
		notes = [],
		searchQuery = '',
		selectedUserRole = 'all',
		users
	}: {
		notes?: AuxeroUserManagementNote[];
		searchQuery?: string;
		selectedUserRole?: string;
		users: AuxeroUserManagementData;
	} = $props();

	let totalUsers = $derived(users.rows.length);
	let adminUsers = $derived(users.rows.filter((row) => row.role.toLowerCase() === 'admin').length);
	let leadUsers = $derived(users.rows.filter((row) => row.role.toLowerCase() === 'lead').length);
	let activeUsers = $derived(
		users.rows.filter((row) => (row.columns[3] ?? '').toLowerCase().includes('active')).length
	);

	let summary = $derived([
		{ label: 'Total users', value: String(totalUsers) },
		{ label: 'Admins', value: String(adminUsers) },
		{ label: 'Leads', value: String(leadUsers) },
		{ label: 'Active', value: String(activeUsers) }
	]);
	const roleFilters = [
		{ id: 'all', label: 'All' },
		{ id: 'admin', label: 'Admin' },
		{ id: 'agent', label: 'Agent' },
		{ id: 'customer', label: 'Customer' },
		{ id: 'lead', label: 'Lead' }
	];

	const roleTone = (role: string) => {
		const normalizedRole = role.toLowerCase();

		if (normalizedRole === 'admin') return 'is-admin';
		if (normalizedRole === 'agent') return 'is-agent';
		if (normalizedRole === 'lead') return 'is-lead';

		return 'is-customer';
	};

	let trimmedSearchQuery = $derived(searchQuery.trim());
</script>

<div class="daynight-users-panel">
	<section class="dashboard-box daynight-users-card bg-white" data-daynight-users-table>
		<div class="daynight-users-card__head">
			<div class="daynight-users-card__title">
				<p class="h4 mb-6">Users and roles</p>
				<p class="h7 text-secondary mb-0">{users.footerText}</p>
			</div>
			<span class="daynight-users-count">{totalUsers} users</span>
		</div>

		<div class="daynight-users-summary" aria-label="Users summary">
			{#each summary as item (item.label)}
				<div class="daynight-users-summary__item">
					<p>{item.value}</p>
					<span>{item.label}</span>
				</div>
			{/each}
		</div>

		<div class="daynight-users-toolbar">
			<form class="daynight-users-search" method="GET" action={resolve('/admin/users')}>
				<input type="hidden" name="role" value="admin" />
				{#if selectedUserRole !== 'all'}
					<input type="hidden" name="userRole" value={selectedUserRole} />
				{/if}
				<label class="daynight-users-sr" for="admin-users-search">Search users</label>
				<input
					id="admin-users-search"
					type="search"
					name="q"
					value={searchQuery}
					placeholder="Search users"
					autocomplete="off"
				/>
				<button type="submit" aria-label="Search users">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
			</form>
			<form
				class="daynight-users-filters"
				method="GET"
				action={resolve('/admin/users')}
				aria-label="Role filters"
			>
				<input type="hidden" name="role" value="admin" />
				{#if trimmedSearchQuery}
					<input type="hidden" name="q" value={trimmedSearchQuery} />
				{/if}
				{#each roleFilters as filter (filter.id)}
					<button
						type="submit"
						name="userRole"
						value={filter.id}
						class={[selectedUserRole === filter.id && 'state-active']}
						aria-pressed={selectedUserRole === filter.id}
					>
						{filter.label}
					</button>
				{/each}
			</form>
		</div>

		<div class="daynight-users-table-wrap">
			<div class="cart-header daynight-users-table-grid">
				{#each users.headers as header (header)}
					<div>
						<p class="h7 mb-0">{header}</p>
					</div>
				{/each}
			</div>

			<div class="cart-list daynight-users-rows">
				{#each users.rows as row (row.id)}
					<div
						class="cart-item daynight-users-table-grid"
						data-daynight-user-id={row.id}
						data-daynight-user-kind={row.kind}
						data-daynight-user-role={row.role.toLowerCase()}
					>
						<div class="cart-item__product daynight-users-person">
							<div class="daynight-users-avatar">
								<img src={row.image} alt={row.name} />
							</div>
							<div class="daynight-users-person__copy">
								<p class="cart-item__title clamp-1 clamp mb-4">{row.name}</p>
								<p class="text-secondary clamp-1 clamp mb-0">{row.description}</p>
							</div>
						</div>
						<div class="cart-item__price daynight-users-cell">
							<span class="price clamp-1 clamp" title={row.columns[0] ?? ''}>
								{row.columns[0] ?? ''}
							</span>
						</div>
						<div class="daynight-users-cell">
							<span class={['daynight-users-role', roleTone(row.columns[1] ?? '')]}>
								{row.columns[1] ?? ''}
							</span>
						</div>
						<div class="daynight-users-cell">
							<span class="clamp-1 clamp" title={row.columns[2] ?? ''}>{row.columns[2] ?? ''}</span>
						</div>
						<div class="cart-item__total daynight-users-cell">
							<span class="daynight-users-status clamp-1 clamp" title={row.columns[3] ?? ''}>
								{row.columns[3] ?? ''}
							</span>
						</div>
						<div class="cart-item__action daynight-users-actions">
							{#each row.actions as action (action.kind)}
								<a
									href={resolve(action.href)}
									class="daynight-users-action action"
									aria-label={action.ariaLabel}
									title={action.label}
								>
									{#if action.kind === 'message'}
										<MessageSquare size={17} strokeWidth={2.1} aria-hidden="true" />
									{:else}
										<ShieldCheck size={17} strokeWidth={2.1} aria-hidden="true" />
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{:else}
					<div class="cart-item daynight-users-empty">
						<p class="h6 mb-4">No users yet</p>
						<p class="text-secondary mb-0">New team and customer users will appear here.</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	{#if notes.length}
		<section class="dashboard-box daynight-users-notes daynight-users-box bg-white">
			<div class="daynight-users-notes__head">
				<p class="h4 mb-6">Бележки за достъп по роли</p>
				<p class="h7 text-secondary mb-0">
					Operational guidance for admin, agent, and customer access.
				</p>
			</div>
			<div class="daynight-users-notes__grid">
				{#each notes as note (note.title)}
					<article class="daynight-users-note">
						<p class="h6 mb-8">{note.title}</p>
						<p class="h7 text-secondary mb-0">{note.text}</p>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.daynight-users-panel {
		display: grid;
		gap: 18px;
	}

	.daynight-users-card {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border) !important;
		border-radius: 14px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		padding: 24px !important;
	}

	.daynight-users-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.daynight-users-card__title {
		min-width: 0;
		max-width: 720px;
	}

	.daynight-users-count {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid #dfe9d3;
		border-radius: 999px;
		background: #f3f8e9;
		color: #b9161c;
		padding: 0 13px;
		font-size: 13px;
		font-weight: 800;
		line-height: 16px;
		white-space: nowrap;
	}

	.daynight-users-summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.daynight-users-summary__item {
		border: 1px solid var(--bc-border, #e4e4e4);
		border-radius: 8px;
		background: #fee2e2;
		padding: 13px 15px;
	}

	.daynight-users-summary__item p,
	.daynight-users-summary__item span {
		display: block;
		margin: 0;
	}

	.daynight-users-summary__item p {
		color: #1c1c1c;
		font-size: 24px;
		font-weight: 700;
		line-height: 30px;
	}

	.daynight-users-summary__item span {
		color: #687064;
		font-size: 12px;
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-users-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #fee2e2;
		padding: 10px;
	}

	.daynight-users-search {
		display: inline-flex;
		min-width: 220px;
		min-height: 38px;
		align-items: center;
		gap: 9px;
		border: 1px solid #fee2e2;
		border-radius: 8px;
		background: #ffffff;
		color: #687064;
		padding: 0 12px;
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
	}

	.daynight-users-search input[type='search'] {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		outline: 0;
		padding: 0;
		font: inherit;
	}

	.daynight-users-search button {
		display: inline-flex;
		width: 28px;
		min-width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 7px;
		background: #fee2e2;
		color: #b9161c;
		cursor: pointer;
	}

	.daynight-users-sr {
		position: absolute;
		overflow: hidden;
		width: 1px;
		height: 1px;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.daynight-users-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
	}

	.daynight-users-filters button {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid #fee2e2;
		border-radius: 8px;
		background: #ffffff;
		color: #1c1c1c;
		padding: 0 12px;
		font-size: 12px;
		font-weight: 800;
		font-family: inherit;
		line-height: 16px;
		cursor: pointer;
	}

	.daynight-users-filters button:hover,
	.daynight-users-filters button:focus-visible,
	.daynight-users-filters .state-active {
		border-color: #e3062f;
		background: #fee2e2;
		color: #b9161c;
	}

	.daynight-users-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
	}

	.daynight-users-table-grid {
		display: grid;
		grid-template-columns:
			minmax(300px, 1.6fr) minmax(190px, 1fr) minmax(110px, 0.55fr)
			minmax(190px, 1fr) minmax(120px, 0.6fr) 96px;
		min-width: 1040px;
		align-items: center;
		column-gap: 18px;
	}

	.cart-header.daynight-users-table-grid {
		border-bottom: 1px solid var(--bc-border);
		background: #f3f7ed;
		padding: 13px 16px;
	}

	.cart-header.daynight-users-table-grid p {
		color: #53613a;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		text-transform: uppercase;
	}

	.daynight-users-rows {
		display: grid;
	}

	.cart-item.daynight-users-table-grid {
		margin: 0 !important;
		border-bottom: 1px solid var(--bc-border) !important;
		background: #ffffff;
		padding: 14px 16px !important;
	}

	.cart-item.daynight-users-table-grid:last-child {
		border-bottom: 0 !important;
	}

	.daynight-users-person {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 12px;
	}

	.daynight-users-avatar {
		overflow: hidden;
		width: 58px;
		min-width: 58px;
		height: 58px;
		border-radius: 8px;
		background: #eef3e7;
	}

	.daynight-users-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.daynight-users-person__copy {
		min-width: 0;
	}

	.daynight-users-person :global(.cart-item__title),
	.daynight-users-person .cart-item__title {
		color: #1c1c1c;
		font-size: 17px;
		font-weight: 800;
		line-height: 22px;
	}

	.daynight-users-cell {
		min-width: 0;
		color: #31362d;
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.daynight-users-cell .price {
		display: block;
		color: #31362d !important;
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.daynight-users-role,
	.daynight-users-status {
		display: inline-flex;
		max-width: 100%;
		min-height: 28px;
		align-items: center;
		border-radius: 999px;
		padding: 0 10px;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.daynight-users-role {
		background: #eef3e7;
		color: #1c1c1c;
	}

	.daynight-users-role.is-admin {
		background: #fee2e2;
		color: #b9161c;
	}

	.daynight-users-role.is-agent {
		background: #eef4ec;
		color: #306247;
	}

	.daynight-users-role.is-lead {
		background: #fbf4db;
		color: #8c6404;
	}

	.daynight-users-status {
		background: #f3f8e9;
		color: #b9161c;
	}

	.daynight-users-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}

	.daynight-users-action {
		display: inline-flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid #fee2e2;
		border-radius: 8px;
		background: #ffffff;
		color: #8caf24;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.daynight-users-action:hover,
	.daynight-users-action:focus-visible {
		border-color: #e3062f;
		background: #fee2e2;
		color: #b9161c;
	}

	.daynight-users-empty {
		padding: 20px !important;
	}

	.daynight-users-notes {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border) !important;
		border-radius: 14px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		padding: 24px !important;
	}

	.daynight-users-notes__head {
		max-width: 720px;
	}

	.daynight-users-notes__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.daynight-users-note {
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #fee2e2;
		padding: 16px;
	}

	.daynight-users-note p:last-child {
		line-height: 22px;
	}

	@media (max-width: 1199px) {
		.daynight-users-summary,
		.daynight-users-notes__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.daynight-users-card {
			gap: 16px;
			padding: 18px !important;
		}

		.daynight-users-card__head,
		.daynight-users-toolbar {
			align-items: stretch;
			flex-direction: column;
		}

		.daynight-users-search {
			width: 100%;
			min-width: 0;
		}

		.daynight-users-filters {
			justify-content: flex-start;
		}

		.daynight-users-summary,
		.daynight-users-notes__grid {
			grid-template-columns: 1fr;
		}

		.daynight-users-summary__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}
</style>
