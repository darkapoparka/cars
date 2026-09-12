<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatNumber, formatStatus, statusVariant } from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();
	const roles = ['all', 'admin', 'agent', 'customer', 'lead'];
	const statuses = ['active', 'paused'];
</script>

<svelte:head>
	<title>OUTLETCARS.BG — Варна Admin - Users</title>
</svelte:head>

<AdminShell title="Users" activePath="/admin/users">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6" aria-label="User summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Total users</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.totalUsers)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Active accounts</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.activeUsers)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Filtered records</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.users.length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="px-4 lg:px-6" data-daynight-users-table>
		<Card.Root class="overflow-hidden">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Accounts and leads</Card.Title>
					<Card.Description
						>Admin, agent, customer, and lead records visible to OUTLETCARS.BG — Варна.</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				<form class="flex flex-col gap-3 md:flex-row" method="GET">
					<Input
						name="q"
						value={data.searchQuery}
						placeholder="Search name, email, phone, context"
					/>
					<input type="hidden" name="userRole" value={data.selectedUserRole} />
					<Button type="submit" variant="outline">Search</Button>
				</form>
				<div class="flex flex-wrap gap-2">
					{#each roles as roleName (roleName)}
						<Button
							href={`/admin/users?userRole=${roleName}${data.searchQuery ? `&q=${encodeURIComponent(data.searchQuery)}` : ''}`}
							variant={data.selectedUserRole === roleName ? 'default' : 'outline'}
							size="sm"
							class="capitalize"
						>
							{roleName}
						</Button>
					{/each}
				</div>
			</Card.Content>
			<Card.Content class="p-0">
				<div class="max-h-[calc(100svh-22rem)] min-h-[28rem] overflow-auto">
					<Table.Root class="min-w-[64rem]">
						<Table.Header class="bg-card sticky top-0 z-10 shadow-[0_1px_0_var(--border)]">
							<Table.Row>
								<Table.Head>User</Table.Head>
								<Table.Head>Role</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head class="hidden lg:table-cell">Context</Table.Head>
								<Table.Head class="text-right">Manage</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.users as user (user.id)}
								<Table.Row data-daynight-user-id={user.id} data-daynight-user-role={user.role}>
									<Table.Cell>
										<div class="min-w-64">
											<p class="m-0 font-medium">{user.name}</p>
											<p class="text-muted-foreground m-0 text-xs">{user.email}</p>
											<p class="text-muted-foreground m-0 text-xs">{user.phone}</p>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant="outline" class="capitalize">{user.roleLabel}</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={statusVariant(user.status)} class="capitalize">
											{user.statusLabel}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-muted-foreground hidden max-w-72 text-xs lg:table-cell">
										{user.context}
									</Table.Cell>
									<Table.Cell class="min-w-[28rem]">
										{#if user.kind === 'account'}
											<form method="POST" class="grid gap-2">
												<input type="hidden" name="id" value={user.id} />
												<div class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
													<Input name="name" value={user.name} />
													<Input name="phone" value={user.phone} />
													<Button type="submit" size="sm" variant="outline">Save</Button>
												</div>
												<select
													name="status"
													class="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm capitalize outline-none focus-visible:ring-3"
												>
													{#each statuses as statusName (statusName)}
														<option value={statusName} selected={user.status === statusName}>
															{formatStatus(statusName)}
														</option>
													{/each}
												</select>
											</form>
										{:else}
											<Button href="/admin/inquiries" variant="outline" size="sm">Open lead</Button>
										{/if}
									</Table.Cell>
								</Table.Row>
							{:else}
								<Table.Row>
									<Table.Cell colspan={5} class="p-6 text-center text-sm text-muted-foreground">
										No users match this filter.
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
			<Card.Footer class="text-muted-foreground justify-between border-t text-xs">
				<span>{formatNumber(data.users.length)} records shown</span>
				<span>Account edits stay in the table row</span>
			</Card.Footer>
		</Card.Root>
	</section>
</AdminShell>
