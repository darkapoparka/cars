<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';
	import SiteChromeIcon from './SiteChromeIcon.svelte';
	import { getStorefrontInventorySummaryContext } from './storefront-inventory-summary-context';
	import {
		inventoryMegaMenuLinkColumns,
		inventoryMegaMenuVehicleTiles,
		type MegaMenuColumn,
		type MegaMenuVehicleTile
	} from './site-navigation-data';

	const getStorefrontSummary = getStorefrontInventorySummaryContext();
	const storefrontSummary = $derived(getStorefrontSummary());
	const activeSlugs = $derived(new Set(storefrontSummary?.activeSlugs ?? []));
	const megaVehicleTiles = $derived(
		inventoryMegaMenuVehicleTiles.filter((tile) => activeSlugs.has(tile.slug))
	);
	const vehicleCount = $derived(storefrontSummary?.total ?? 0);

	const topItemClasses = 'group/menu-item flex min-h-[58px] items-center';
	const topLinkClasses =
		'flex h-[58px] items-center gap-1.5 px-3.5 !text-sa-nav !font-normal !leading-sa-nav text-sa-surface no-underline transition-none hover:bg-transparent hover:text-sa-surface focus-visible:bg-transparent focus-visible:text-sa-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sa-surface/50 group-focus-within/menu-item:bg-transparent group-focus-within/menu-item:text-sa-surface max-[1180px]:px-2.5 max-[1180px]:!text-sa-base';
	const chevronClasses = 'size-[18px] text-current [&_path]:stroke-current';
	const megaMenuClasses =
		'invisible pointer-events-none absolute left-1/2 top-[calc(100%+1px)] z-[1000] flex w-[min(1410px,calc(100vw-60px))] max-w-[1410px] -translate-x-1/2 flex-col overflow-hidden rounded-b-sa-md border border-sa-ink/10 bg-sa-surface p-0 opacity-0 shadow-sa-md transition duration-150 ease-sa group-hover/menu-item:visible group-hover/menu-item:pointer-events-auto group-hover/menu-item:opacity-100 group-focus-within/menu-item:visible group-focus-within/menu-item:pointer-events-auto group-focus-within/menu-item:opacity-100';
	const columnClasses = 'min-w-0';
	const columnTitleClasses =
		'm-0 mb-2.5 text-[15px] leading-5 font-semibold text-sa-ink';
	const columnListClasses = 'm-0 flex list-none flex-col gap-1 p-0';
	const columnLinkClasses =
		'inline-flex rounded-sa-xs px-2 py-1.5 text-sm leading-5 font-normal text-sa-muted no-underline transition duration-150 ease-sa hover:bg-sa-bg hover:text-sa-red focus-visible:bg-sa-bg focus-visible:text-sa-red';
	const vehicleTileClasses =
		'flex min-w-0 flex-col items-center rounded-sa-xs px-2 py-1 text-center text-sa-ink no-underline transition duration-150 ease-sa hover:bg-sa-bg focus-visible:bg-sa-bg';
</script>

{#snippet megaColumn(column: MegaMenuColumn)}
	<div class={columnClasses}>
		<p class={columnTitleClasses}>{column.title}</p>
		<ul class={columnListClasses}>
			{#each column.links as link (link.href)}
				<li><a class={columnLinkClasses} href={resolve(link.href)}>{link.label}</a></li>
			{/each}
		</ul>
	</div>
{/snippet}

{#snippet vehicleTile(vehicle: MegaMenuVehicleTile)}
	<a class={vehicleTileClasses} href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
		<span class="mb-1.5 flex h-28 w-full items-end justify-center">
			<img
				class="block h-full max-w-full object-contain"
				src={desktopOnlyImagePlaceholder}
				srcset={desktopOnlySrcset(vehicle.image, 560)}
				sizes={desktopOnlySizes('180px')}
				alt={vehicle.label}
			/>
		</span>
		<span
			class="mb-0.5 block w-full truncate text-sa-nav-sub leading-sa-nav-sub font-medium text-sa-ink"
			>{vehicle.label}</span
		>
		<span class="mb-2 block w-full truncate text-sa-sm leading-[18px] text-sa-muted"
			>{vehicle.meta}</span
		>
		<span class="flex justify-center text-sa-sm leading-[18px] font-semibold text-sa-ink">
			View details
		</span>
	</a>
{/snippet}

<li class={topItemClasses}>
	<a class={topLinkClasses} href={resolve('/inventory')}>
		Vehicles
		<SiteChromeIcon name="chevron-down" class={chevronClasses} />
	</a>
	<div class={megaMenuClasses} data-daynight-mega-menu>
		<div class="flex w-full items-stretch gap-8 px-[42px] pt-[30px] pb-8">
			<div class="flex min-w-0 flex-1 flex-col justify-between">
				<div class="grid w-full grid-cols-4 gap-x-[26px] gap-y-[12px]">
					{#each megaVehicleTiles as vehicle (vehicle.slug)}
						{@render vehicleTile(vehicle)}
					{/each}
				</div>
				<div
					class="mt-[22px] flex items-center justify-between gap-[18px] border-t border-sa-line pt-[18px]"
				>
					<a
						class="inline-flex min-h-11 items-center justify-center rounded-sa-xs bg-sa-blue px-4 text-sa-nav-sub leading-sa-nav-sub font-medium text-sa-surface no-underline transition duration-150 ease-sa hover:bg-sa-red focus-visible:bg-sa-red"
						href={resolve('/inventory')}>View all vehicles</a
					>
					<div class="grid gap-0.5 text-right">
						<strong class="text-sa-base leading-6 font-medium text-sa-ink"
							>{vehicleCount} vehicles listed in this preview</strong
						>
						<span class="text-sa-base leading-6 text-sa-muted"
							>Filter by make, price, fuel, mileage and features.</span
						>
					</div>
				</div>
			</div>
			<div
				class="grid w-[304px] flex-[0_0_304px] grid-cols-2 gap-x-3.5 gap-y-4 border-l border-sa-line pl-6"
			>
				{#each inventoryMegaMenuLinkColumns as column (column.title)}
					{@render megaColumn(column)}
				{/each}
			</div>
		</div>
	</div>
</li>
