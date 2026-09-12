<script lang="ts">
	import { resolve } from '$app/paths';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Activity from '@lucide/svelte/icons/activity';
	import CarFront from '@lucide/svelte/icons/car-front';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Clock3 from '@lucide/svelte/icons/clock-3';
	import Inbox from '@lucide/svelte/icons/inbox';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import LogOut from '@lucide/svelte/icons/log-out';
	import MessageSquareText from '@lucide/svelte/icons/message-square-text';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import Settings from '@lucide/svelte/icons/settings';
	import Truck from '@lucide/svelte/icons/truck';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Snippet } from 'svelte';

	type AdminPath =
		| '/admin'
		| '/admin/listings'
		| '/admin/listings/new'
		| '/admin/imports'
		| '/admin/leads'
		| '/admin/conversations'
		| '/admin/analytics'
		| '/admin/assistant'
		| '/admin/posts'
		| '/admin/posts/new'
		| '/admin/settings';

	type PrimaryAction = {
		label: string;
		href: AdminPath;
	};

	type Props = {
		title: string;
		eyebrow?: string;
		activePath?: AdminPath;
		primaryAction?: PrimaryAction;
		children: Snippet;
	};

	let {
		title,
		eyebrow = 'Admin',
		activePath = '/admin',
		primaryAction,
		children
	}: Props = $props();

	const navItems = [
		{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
		{ label: 'Inventory', path: '/admin/listings', icon: CarFront },
		{ label: 'Imports', path: '/admin/imports', icon: Truck },
		{ label: 'Leads', path: '/admin/leads', icon: Inbox },
		{ label: 'Conversations', path: '/admin/conversations', icon: MessageSquareText },
		{ label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
		{ label: 'Assistant', path: '/admin/assistant', icon: MessageSquareText },
		{ label: 'Posts', path: '/admin/posts', icon: Newspaper },
		{ label: 'Settings', path: '/admin/settings', icon: Settings }
	] as const;
</script>

<main class="admin-app-shell bg-background text-foreground min-h-svh">
	<Sidebar.Provider style="--sidebar-width: 18rem; --header-height: 4.25rem;" class="min-h-svh">
		<Sidebar.Root collapsible="offcanvas" variant="inset">
			<Sidebar.Header class="px-3 pt-3">
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							size="lg"
							class="text-sidebar-foreground hover:bg-sidebar-accent data-active:bg-sidebar-accent h-14"
						>
							{#snippet child({ props })}
								<a href={resolve('/admin')} {...props}>
									<span
										class="border-sidebar-border bg-sidebar-accent grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border"
									>
										<img
											class="h-7 w-auto object-contain"
											src={resolve('/dealer/logo-dark.svg')}
											alt=""
										/>
									</span>
									<span class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-semibold">Мания</span>
										<span class="text-sidebar-foreground/60 truncate text-xs">CMS workspace</span>
									</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Header>

			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel class="text-sidebar-foreground/50">Manage</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each navItems as item (item.path)}
								{@const Icon = item.icon}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={item.path === activePath}
										tooltipContent={item.label}
										class="text-sidebar-foreground/78 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground"
									>
										{#snippet child({ props })}
											<a href={resolve(item.path)} {...props}>
												<Icon aria-hidden="true" />
												<span>{item.label}</span>
												{#if item.path === activePath}
													<ChevronRight
														class="text-sidebar-primary-foreground/70 ms-auto"
														aria-hidden="true"
													/>
												{/if}
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>

			<Sidebar.Footer class="gap-3 px-3 pb-3">
				<div class="border-sidebar-border bg-sidebar-accent/55 rounded-lg border p-3">
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2 text-sm font-medium">
							<Activity aria-hidden="true" />
							<span>Marketplace feeds</span>
						</div>
						<Badge variant="outline" class="border-sidebar-border text-sidebar-foreground"
							>Stable</Badge
						>
					</div>
					<p class="text-sidebar-foreground/60 mt-2 text-xs leading-5">
						Inventory, leads, imports, and content are managed from this workspace.
					</p>
				</div>
				<form method="POST" action="/admin/logout">
					<Button
						variant="ghost"
						class="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground w-full justify-start"
						type="submit"
					>
						<LogOut data-icon="inline-start" aria-hidden="true" />
						Sign out
					</Button>
				</form>
			</Sidebar.Footer>
		</Sidebar.Root>

		<Sidebar.Inset>
			<header
				class="bg-card/90 flex h-[var(--header-height)] shrink-0 items-center gap-3 border-b px-4 lg:px-6"
			>
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
				<div class="min-w-0 flex-1">
					<p class="text-muted-foreground flex items-center gap-1 truncate text-xs font-medium">
						<span>Мания</span>
						<ChevronRight aria-hidden="true" />
						<span>{eyebrow}</span>
					</p>
					<h1 class="truncate text-lg font-semibold">{title}</h1>
				</div>
				<form
					class="relative hidden w-full max-w-sm md:block"
					method="GET"
					action={resolve('/admin/listings')}
				>
					<Search
						class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
						aria-hidden="true"
					/>
					<Input
						class="bg-background pl-8"
						name="q"
						placeholder="Search inventory, lot, fuel"
						autocomplete="off"
					/>
				</form>
				<div class="hidden items-center gap-2 lg:flex">
					<Badge variant="outline" class="gap-1">
						<Clock3 aria-hidden="true" />
						Live CMS
					</Badge>
					<Button href={resolve('/admin/leads?status=new')} variant="outline" size="sm">
						<Inbox data-icon="inline-start" aria-hidden="true" />
						New leads
					</Button>
				</div>
				{#if primaryAction}
					<Button href={resolve(primaryAction.href)} size="sm">
						<Plus data-icon="inline-start" aria-hidden="true" />
						{primaryAction.label}
					</Button>
				{/if}
			</header>

			<div class="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</main>
