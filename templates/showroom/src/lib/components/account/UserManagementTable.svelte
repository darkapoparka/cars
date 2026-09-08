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

<div class="eliqauto-users-panel">
	<section class="dashboard-box eliqauto-users-card bg-white" data-eliqauto-users-table>
		<div class="eliqauto-users-card__head">
			<div class="eliqauto-users-card__title">
				<p class="h4 mb-6">Users and roles</p>
				<p class="h7 text-secondary mb-0">{users.footerText}</p>
			</div>
			<span class="eliqauto-users-count">{totalUsers} users</span>
		</div>

		<div class="eliqauto-users-summary" aria-label="Users summary">
			{#each summary as item (item.label)}
				<div class="eliqauto-users-summary__item">
					<p>{item.value}</p>
					<span>{item.label}</span>
				</div>
			{/each}
		</div>

		<div class="eliqauto-users-toolbar">
			<form class="eliqauto-users-search" method="GET" action={resolve('/admin/users')}>
				<input type="hidden" name="role" value="admin" />
				{#if selectedUserRole !== 'all'}
					<input type="hidden" name="userRole" value={selectedUserRole} />
				{/if}
				<label class="eliqauto-users-sr" for="admin-users-search">Search users</label>
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
				class="eliqauto-users-filters"
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

		<div class="eliqauto-users-table-wrap">
			<div class="cart-header eliqauto-users-table-grid">
				{#each users.headers as header (header)}
					<div>
						<p class="h7 mb-0">{header}</p>
					</div>
				{/each}
			</div>

			<div class="cart-list eliqauto-users-rows">
				{#each users.rows as row (row.id)}
					<div
						class="cart-item eliqauto-users-table-grid"
						data-eliqauto-user-id={row.id}
						data-eliqauto-user-kind={row.kind}
						data-eliqauto-user-role={row.role.toLowerCase()}
					>
						<div class="cart-item__product eliqauto-users-person">
							<div class="eliqauto-users-avatar">
								<img src={row.image} alt={row.name} />
							</div>
							<div class="eliqauto-users-person__copy">
								<p class="cart-item__title clamp-1 clamp mb-4">{row.name}</p>
								<p class="text-secondary clamp-1 clamp mb-0">{row.description}</p>
							</div>
						</div>
						<div class="cart-item__price eliqauto-users-cell">
							<span class="price clamp-1 clamp" title={row.columns[0] ?? ''}>
								{row.columns[0] ?? ''}
							</span>
						</div>
						<div class="eliqauto-users-cell">
							<span class={['eliqauto-users-role', roleTone(row.columns[1] ?? '')]}>
								{row.columns[1] ?? ''}
							</span>
						</div>
						<div class="eliqauto-users-cell">
							<span class="clamp-1 clamp" title={row.columns[2] ?? ''}>{row.columns[2] ?? ''}</span>
						</div>
						<div class="cart-item__total eliqauto-users-cell">
							<span class="eliqauto-users-status clamp-1 clamp" title={row.columns[3] ?? ''}>
								{row.columns[3] ?? ''}
							</span>
						</div>
						<div class="cart-item__action eliqauto-users-actions">
							{#each row.actions as action (action.kind)}
								<a
									href={resolve(action.href)}
									class="eliqauto-users-action action"
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
					<div class="cart-item eliqauto-users-empty">
						<p class="h6 mb-4">No users yet</p>
						<p class="text-secondary mb-0">New team and customer users will appear here.</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	{#if notes.length}
		<section class="dashboard-box eliqauto-users-notes eliqauto-users-box bg-white">
			<div class="eliqauto-users-notes__head">
				<p class="h4 mb-6">Бележки за достъп по роли</p>
				<p class="h7 text-secondary mb-0">
					Operational guidance for admin, agent, and customer access.
				</p>
			</div>
			<div class="eliqauto-users-notes__grid">
				{#each notes as note (note.title)}
					<article class="eliqauto-users-note">
						<p class="h6 mb-8">{note.title}</p>
						<p class="h7 text-secondary mb-0">{note.text}</p>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.eliqauto-users-panel {
		display: grid;
		gap: 18px;
	}

	.eliqauto-users-card {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border);
		border-radius: 14px;
		background: #ffffff;
		box-shadow: none;
		padding: 24px;
	}

	.eliqauto-users-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.eliqauto-users-card__title {
		min-width: 0;
		max-width: 720px;
	}

	.eliqauto-users-count {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: var(--bc-accent-soft);
		color: #8c1515;
		padding: 0 13px;
		font-size: 13px;
		font-weight: 800;
		line-height: 16px;
		white-space: nowrap;
	}

	.eliqauto-users-summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.eliqauto-users-summary__item {
		border: 1px solid var(--bc-border, #e4e4e4);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		padding: 13px 15px;
	}

	.eliqauto-users-summary__item p,
	.eliqauto-users-summary__item span {
		display: block;
		margin: 0;
	}

	.eliqauto-users-summary__item p {
		color: #1c1c1c;
		font-size: 24px;
		font-weight: 700;
		line-height: 30px;
	}

	.eliqauto-users-summary__item span {
		color: var(--bc-muted);
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-users-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		padding: 10px;
	}

	.eliqauto-users-search {
		display: inline-flex;
		min-width: 220px;
		min-height: 38px;
		align-items: center;
		gap: 9px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		color: var(--bc-muted);
		padding: 0 12px;
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
	}

	.eliqauto-users-search input[type='search'] {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		outline: 0;
		padding: 0;
		font: inherit;
	}

	.eliqauto-users-search button {
		display: inline-flex;
		width: 28px;
		min-width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 7px;
		background: #fbe9e9;
		color: #8c1515;
		cursor: pointer;
	}

	.eliqauto-users-sr {
		position: absolute;
		overflow: hidden;
		width: 1px;
		height: 1px;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.eliqauto-users-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
	}

	.eliqauto-users-filters button {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		color: var(--bc-dashboard-text);
		padding: 0 12px;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		font-family: inherit;
		line-height: 16px;
		cursor: pointer;
	}

	.eliqauto-users-filters button:hover,
	.eliqauto-users-filters button:focus-visible,
	.eliqauto-users-filters .state-active {
		border-color: #a51717;
		background: #fbe9e9;
		color: #8c1515;
	}

	.eliqauto-users-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
	}

	.eliqauto-users-table-grid {
		display: grid;
		grid-template-columns:
			minmax(300px, 1.6fr) minmax(190px, 1fr) minmax(110px, 0.55fr)
			minmax(190px, 1fr) minmax(120px, 0.6fr) 96px;
		min-width: 1040px;
		align-items: center;
		column-gap: 18px;
	}

	.cart-header.eliqauto-users-table-grid {
		border-bottom: 1px solid var(--bc-border);
		background: var(--bc-surface-soft);
		padding: 13px 16px;
	}

	.cart-header.eliqauto-users-table-grid p {
		color: var(--bc-muted);
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 15px;
		text-transform: uppercase;
	}

	.eliqauto-users-rows {
		display: grid;
	}

	.cart-item.eliqauto-users-table-grid {
		margin: 0;
		border-bottom: 1px solid var(--bc-border);
		background: #ffffff;
		padding: 14px 16px;
	}

	.cart-item.eliqauto-users-table-grid:last-child {
		border-bottom: 0;
	}

	.eliqauto-users-person {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 12px;
	}

	.eliqauto-users-avatar {
		overflow: hidden;
		width: 58px;
		min-width: 58px;
		height: 58px;
		border-radius: 8px;
		background: var(--bc-surface-soft);
	}

	.eliqauto-users-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.eliqauto-users-person__copy {
		min-width: 0;
	}

	.eliqauto-users-person :global(.cart-item__title),
	.eliqauto-users-person .cart-item__title {
		color: #1c1c1c;
		font-size: 17px;
		font-weight: 800;
		line-height: 22px;
	}

	.eliqauto-users-cell {
		min-width: 0;
		color: var(--bc-dashboard-text);
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.eliqauto-users-cell .price {
		display: block;
		color: var(--bc-dashboard-text);
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.eliqauto-users-role,
	.eliqauto-users-status {
		display: inline-flex;
		max-width: 100%;
		min-height: 28px;
		align-items: center;
		border-radius: 999px;
		padding: 0 10px;
		font-size: var(--bc-text-micro);
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.eliqauto-users-role {
		background: var(--bc-surface-soft);
		color: var(--bc-dashboard-text);
	}

	.eliqauto-users-role.is-admin {
		background: #fbe9e9;
		color: #8c1515;
	}

	.eliqauto-users-role.is-agent {
		background: var(--bc-accent-soft);
		color: var(--bc-accent);
	}

	.eliqauto-users-role.is-lead {
		background: #fbf4db;
		color: #8c6404;
	}

	.eliqauto-users-status {
		background: var(--bc-accent-soft);
		color: #8c1515;
	}

	.eliqauto-users-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}

	.eliqauto-users-action {
		display: inline-flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		color: #8a1414;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.eliqauto-users-action:hover,
	.eliqauto-users-action:focus-visible {
		border-color: #a51717;
		background: #fbe9e9;
		color: #8c1515;
	}

	.eliqauto-users-empty {
		padding: 20px;
	}

	.eliqauto-users-notes {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border);
		border-radius: 14px;
		background: #ffffff;
		box-shadow: none;
		padding: 24px;
	}

	.eliqauto-users-notes__head {
		max-width: 720px;
	}

	.eliqauto-users-notes__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.eliqauto-users-note {
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		padding: 16px;
	}

	.eliqauto-users-note p:last-child {
		line-height: 22px;
	}

	@media (max-width: 1199px) {
		.eliqauto-users-summary,
		.eliqauto-users-notes__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.eliqauto-users-card {
			gap: 16px;
			padding: 18px;
		}

		.eliqauto-users-card__head,
		.eliqauto-users-toolbar {
			align-items: stretch;
			flex-direction: column;
		}

		.eliqauto-users-search {
			width: 100%;
			min-width: 0;
		}

		.eliqauto-users-filters {
			justify-content: flex-start;
		}

		.eliqauto-users-summary,
		.eliqauto-users-notes__grid {
			grid-template-columns: 1fr;
		}

		.eliqauto-users-summary__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}
</style>
