<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeaderData, HomeFiveHeaderMegaMenu } from '$lib/auxero/home-five';

	// Clean Svelte 5 + Tailwind v4 mega-menu PANEL CONTENT only. The parent header
	// owns open/hover/positioning — this component renders the inner panel 1:1 with
	// the live themed `.daynight-mega*` styling, token-pure with bc-* utilities.
	// Off-token visible colors (#B9161C green underline, #5c5e62 gray, #e7e7e7 /
	// #eceff3 / #e5e7eb borders, #1C1C1C / #667085 footer copy, #f7f7f7 hover) are
	// kept as exact hex because 1:1 wins until tokens are reconciled.
	let {
		menu,
		ui
	}: {
		menu: HomeFiveHeaderMegaMenu;
		ui: HomeFiveHeaderData['ui'];
	} = $props();
</script>

{#snippet sectionChevron()}
	<svg
		class="ml-1 inline-block h-3 w-3 align-middle text-bc-muted"
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		<path
			d="M9 6L15 12L9 18"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#if menu.variant === 'inventory'}
	<!-- daynight-mega__content: flex row, gap 44px, padding 30/42/32 -->
	<div class="flex w-full items-stretch gap-11 px-[42px] pt-[30px] pb-8">
		<!-- daynight-mega__vehicle-panel: column, grows, space-between -->
		<div class="flex min-w-0 flex-1 flex-col justify-between">
			<!-- daynight-mega__vehicles: 4-col grid, gap 18px 26px -->
			<div
				class="grid w-full gap-x-[26px] gap-y-[18px]"
				style="grid-template-columns: repeat(4, minmax(150px, 1fr));"
			>
				{#each menu.vehicles as vehicle (vehicle.href)}
					<a
						href={resolve(vehicle.href as '/')}
						class="flex min-w-0 flex-col items-center rounded-bc-md px-2 pt-1 pb-2 text-center no-underline transition-colors hover:bg-[#f7f7f7]"
					>
						<!-- image-wrap: height 112px, align-items end, object-contain -->
						<span class="mb-[7px] flex h-28 w-full items-end justify-center">
							<img
								src={vehicle.image}
								alt={vehicle.label}
								width="280"
								height="170"
								loading="lazy"
								decoding="async"
								class="block h-full max-w-full object-contain"
							/>
						</span>
						<span
							class="mb-0.5 block text-[17px] leading-6 font-semibold whitespace-nowrap text-bc-ink"
						>
							{vehicle.label}
						</span>
						<!-- meta gray #5c5e62 (no matching bc token) -->
						<span class="mb-2 block text-[13px] leading-[18px] whitespace-nowrap text-[#5c5e62]">
							{vehicle.meta}
						</span>
						<!-- actions: green underline #B9161C (no matching bc token) -->
						<span class="flex justify-center gap-[14px]">
							<span
								class="text-[13px] leading-[18px] text-[#B9161C] underline underline-offset-[3px]"
							>
								{ui.megaView}
							</span>
							<span
								class="text-[13px] leading-[18px] text-[#B9161C] underline underline-offset-[3px]"
							>
								{ui.megaDetails}
							</span>
						</span>
					</a>
				{/each}
			</div>

			<!-- footer: border-top #eceff3, flex row, gap 22px -->
			<div
				class="mt-6 flex w-full flex-none items-center gap-[22px] border-t border-[#eceff3] pt-4"
			>
				<a
					href={resolve(menu.footer.ctaHref as '/')}
					class="inline-flex h-[50px] items-center rounded-bc-md bg-bc-accent px-6 text-[15px] font-semibold whitespace-nowrap text-bc-accent-contrast transition-colors hover:bg-bc-accent-contrast hover:text-white"
				>
					{menu.footer.ctaLabel}
				</a>
				<!-- footer-copy: border-left #e5e7eb, strong #1C1C1C, span #667085 (no matching bc tokens) -->
				<div class="flex flex-col gap-0.5 border-l border-[#e5e7eb] pl-[22px]">
					<strong class="text-[15px] leading-[22px] text-[#1C1C1C]">{menu.footer.title}</strong>
					<span class="text-[13px] leading-5 text-[#667085]">{menu.footer.copy}</span>
				</div>
			</div>
		</div>

		<!-- links panel: flex 0 0 360px, border-left #e7e7e7, 2-col grid, gap 22px -->
		<div
			class="grid flex-none basis-[360px] grid-cols-2 gap-[22px] border-l border-[#e7e7e7] pl-[34px]"
		>
			{#each menu.sections as section (section.title)}
				<div class="min-w-0">
					<p class="mb-3 text-[15px] leading-[22px] font-semibold text-bc-ink">
						{section.title}
						{@render sectionChevron()}
					</p>
					<ul class="flex flex-col gap-2.5">
						{#each section.links as link (link.href)}
							<li>
								<!-- link gray #5c5e62 (no matching bc token) -->
								<a
									href={resolve(link.href as '/')}
									class="text-[14px] leading-5 text-[#5c5e62] transition-colors hover:text-bc-accent"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<!-- container variant: simple list of links -->
	<ul class="flex w-full flex-col gap-1 p-3">
		{#each menu.links as link (link.href)}
			<li>
				<a
					href={resolve(link.href as '/')}
					class="block rounded-bc-md px-3 py-2 text-[15px] leading-6 font-semibold text-bc-ink transition-colors hover:bg-[#f7f7f7] hover:text-bc-accent"
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
{/if}
