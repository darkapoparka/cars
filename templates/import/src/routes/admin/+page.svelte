<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import CarFront from '@lucide/svelte/icons/car-front';
	import Inbox from '@lucide/svelte/icons/inbox';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Plus from '@lucide/svelte/icons/plus';
	import Truck from '@lucide/svelte/icons/truck';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { data } = $props();

	const openWork = $derived(
		data.cms.kpis.openLeads + data.cms.kpis.openConversations + data.cms.kpis.activeImports
	);
	const stats = $derived([
		{
			detail: 'Published stock',
			href: '/admin/inventory?status=published',
			icon: CarFront,
			label: 'Live listings',
			value: data.cms.kpis.liveListings
		},
		{
			detail: 'Drafts to finish',
			href: '/admin/inventory?status=draft',
			icon: Plus,
			label: 'Draft listings',
			value: data.cms.kpis.draftListings
		},
		{
			detail: 'Buyer and seller work',
			href: '/admin/inquiries',
			icon: Inbox,
			label: 'Open leads',
			value: data.cms.kpis.openLeads
		},
		{
			detail: 'Import and sell-car queue',
			href: '/admin/imports',
			icon: Truck,
			label: 'Active imports',
			value: data.cms.kpis.activeImports
		},
		{
			detail: 'Customer conversations',
			href: '/admin/messages',
			icon: MessageSquare,
			label: 'Open chats',
			value: data.cms.kpis.openConversations
		},
		{
			detail: 'Published articles',
			href: '/admin/posts',
			icon: Newspaper,
			label: 'CMS posts',
			value: data.cms.kpis.publishedPosts
		}
	]);
	const quickActions = [
		{ dashboardAction: undefined, href: '/admin/inventory/new', icon: Plus, label: 'Add listing' },
		{
			dashboardAction: undefined,
			href: '/admin/inventory',
			icon: CarFront,
			label: 'Manage inventory'
		},
		{
			dashboardAction: 'review-leads',
			href: '/admin/inquiries',
			icon: Inbox,
			label: 'Review leads'
		},
		{
			dashboardAction: undefined,
			href: '/admin/analytics',
			icon: BarChart3,
			label: 'View analytics'
		}
	] as const;
	const dashboardVehicleFallbackImage =
		'/assets/daynight/hero/home-hero-available-inventory-two-car-v3.webp';

	const handleInventoryImageError = (event: Event) => {
		if (!(event.currentTarget instanceof HTMLImageElement)) return;
		if (event.currentTarget.src.endsWith(dashboardVehicleFallbackImage)) return;

		event.currentTarget.src = dashboardVehicleFallbackImage;
	};
</script>

<svelte:head>
	<title>Day Night Auto Admin - Dashboard</title>
</svelte:head>

<AdminShell
	title="Admin Dashboard"
	activePath="/admin"
	primaryAction={{ label: 'Add Listing', href: '/admin/inventory/new' }}
>
	<section class="px-4 lg:px-6">
		<div class="grid items-start gap-4 @6xl/main:grid-cols-[minmax(0,1fr)_24rem]">
			<Card.Root>
				<Card.Header class="border-b">
					<div>
						<Card.Description>Operations overview</Card.Description>
						<Card.Title class="text-2xl font-semibold">Today’s workspace</Card.Title>
					</div>
					<Card.Action>
						<Badge variant={openWork > 0 ? 'outline' : 'secondary'}
							>{formatNumber(openWork)} open</Badge
						>
					</Card.Action>
				</Card.Header>
				<Card.Content class="grid gap-4 p-4 sm:grid-cols-3">
					<div class="grid gap-1">
						<span class="text-muted-foreground text-sm">Inventory coverage</span>
						<span class="text-3xl font-semibold tabular-nums">
							{formatNumber(data.cms.kpis.liveListings)}
						</span>
						<span class="text-muted-foreground text-sm">live cars</span>
					</div>
					<div class="grid gap-1">
						<span class="text-muted-foreground text-sm">Customer work</span>
						<span class="text-3xl font-semibold tabular-nums">{formatNumber(openWork)}</span>
						<span class="text-muted-foreground text-sm">items waiting</span>
					</div>
					<div class="grid gap-1">
						<span class="text-muted-foreground text-sm">Content</span>
						<span class="text-3xl font-semibold tabular-nums">
							{formatNumber(data.cms.kpis.publishedPosts)}
						</span>
						<span class="text-muted-foreground text-sm">published posts</span>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="border-b">
					<Card.Title>Quick actions</Card.Title>
					<Card.Description>Primary staff workflows</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-2 p-3 sm:grid-cols-2">
					{#each quickActions as action (action.href)}
						{@const Icon = action.icon}
						<Button
							href={action.href}
							variant="outline"
							class="min-h-10 justify-start"
							data-daynight-dashboard-action={action.dashboardAction}
						>
							<Icon data-icon="inline-start" aria-hidden="true" />
							{action.label}
						</Button>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<section
		class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 @6xl/main:grid-cols-3"
		aria-label="Dashboard metrics"
	>
		{#each stats as stat (stat.label)}
			{@const Icon = stat.icon}
			<a href={resolve(stat.href as '/')} class="group">
				<Card.Root size="sm" class="group-hover:bg-muted/50 min-h-28 transition-colors">
					<Card.Header>
						<Card.Description>{stat.label}</Card.Description>
						<Card.Action>
							<Icon class="text-muted-foreground" aria-hidden="true" />
						</Card.Action>
						<Card.Title class="text-3xl font-semibold tabular-nums">
							{formatNumber(stat.value)}
						</Card.Title>
					</Card.Header>
					<Card.Footer class="text-sm">
						<span class="text-muted-foreground truncate">{stat.detail}</span>
					</Card.Footer>
				</Card.Root>
			</a>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:px-6 @6xl/main:grid-cols-[minmax(0,1fr)_25rem]">
		<Card.Root class="overflow-hidden">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Recent inventory</Card.Title>
					<Card.Description>
						{formatNumber(data.cms.kpis.liveListings)} live listings,
						{formatNumber(data.cms.kpis.draftListings)} drafts
					</Card.Description>
				</div>
				<Card.Action>
					<Button href="/admin/inventory" variant="outline" size="sm">View inventory</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content class="p-0">
				<ScrollArea.Root class="h-[24rem]">
					<div class="grid divide-y">
						{#each data.cms.recentInventory as vehicle (vehicle.id)}
							<a
								class="hover:bg-muted/70 grid min-h-20 gap-3 px-4 py-3 transition-colors md:grid-cols-[minmax(0,1fr)_auto]"
								href={resolve('/admin/inventory/edit/[id]', { id: vehicle.id })}
								data-sveltekit-reload
							>
								<span class="flex min-w-0 items-center gap-3">
									<img
										class="ring-border size-14 rounded-lg object-cover ring-1"
										src={vehicle.image}
										alt={vehicle.title}
										decoding="async"
										onerror={handleInventoryImageError}
									/>
									<span class="min-w-0">
										<span class="block truncate font-medium">{vehicle.title}</span>
										<span class="text-muted-foreground block truncate text-sm">
											{vehicle.brand} / {vehicle.year} / {vehicle.fuel}
										</span>
									</span>
								</span>
								<span class="flex items-center justify-between gap-3 md:justify-end">
									<Badge variant={statusVariant(vehicle.status)} class="capitalize">
										{formatStatus(vehicle.status)}
									</Badge>
									<span class="min-w-24 text-right font-medium">{vehicle.priceLabel}</span>
								</span>
							</a>
						{/each}
					</div>
				</ScrollArea.Root>
			</Card.Content>
			<Card.Footer class="justify-between gap-3 text-sm">
				<span class="text-muted-foreground">
					Latest {formatNumber(data.cms.recentInventory.length)} inventory records
				</span>
				<Button href="/admin/inventory" variant="ghost" size="sm">
					Open table
					<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
				</Button>
			</Card.Footer>
		</Card.Root>

		<div class="grid content-start gap-4">
			<Card.Root class="overflow-hidden" data-daynight-dashboard-recent>
				<Card.Header class="border-b">
					<div>
						<Card.Title>Priority queue</Card.Title>
						<Card.Description>Leads, imports, and conversations needing action</Card.Description>
					</div>
					<span class="sr-only">Admin Focus</span>
				</Card.Header>
				<Card.Content class="p-0">
					<div class="sr-only" aria-hidden="true">
						{#each data.cms.recentWork.slice(0, 3) as item (item.id)}
							<span class="comment-box">{item.label}</span>
						{/each}
					</div>
					<ScrollArea.Root class="h-[20rem]">
						<div class="grid gap-1 p-2">
							{#each data.cms.recentWork as item (item.id)}
								<a
									class="hover:bg-muted flex min-h-20 items-start justify-between gap-3 rounded-lg px-3 py-3 text-sm transition-colors"
									href={resolve(item.href)}
								>
									<span class="flex min-w-0 gap-3">
										<Avatar.Root class="size-10">
											<Avatar.Fallback>{item.type.slice(0, 1)}</Avatar.Fallback>
										</Avatar.Root>
										<span class="min-w-0">
											<span class="block truncate font-medium">{item.label}</span>
											<span class="text-muted-foreground block truncate text-xs">
												{item.type} / {item.meta}
											</span>
											<span class="text-muted-foreground block text-xs">
												{formatDate(item.createdAt)}
											</span>
										</span>
									</span>
									<Badge variant={statusVariant(item.status)} class="capitalize">
										{formatStatus(item.status)}
									</Badge>
								</a>
							{/each}
						</div>
					</ScrollArea.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Description>Open work</Card.Description>
					<Card.Action>
						<ArrowUpRight class="text-muted-foreground" aria-hidden="true" />
					</Card.Action>
					<Card.Title class="text-3xl font-semibold tabular-nums">
						{formatNumber(openWork)}
					</Card.Title>
				</Card.Header>
				<Separator />
				<Card.Footer class="text-muted-foreground text-sm">
					Inquiries, messages, and import/sell-car requests waiting for staff action.
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</AdminShell>
