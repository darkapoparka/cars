<script lang="ts">
	import { resolve } from '$app/paths';
	import { ChevronDown, Mail, MapPin, PhoneCall } from '@lucide/svelte';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import type { HomeFiveHeaderData, HomeFiveHeaderSocial } from '$lib/auxero/home-five';
	import SiteMegaMenu from './SiteMegaMenu.svelte';
	import SiteSearchModal from './SiteSearchModal.svelte';

	// Clean Svelte 5 + Tailwind v4 public header — the keystone shared header for the
	// Auxero → clean migration. Reproduces the live themed HomeFiveHeader 1:1:
	//   • ink topbar, white text, Eliq red accent icons
	//     contact icons, language dropdown + 5 social icons
	//   • 145px desktop main row / 94px sticky / 64px mobile appbar
	//   • hover/focus mega-menu panels (SiteMegaMenu = inner content)
	//   • search modal wired to the search glyph
	// Off-token visible colors that have no matching bc token are kept as exact hex
	// (and commented). Zero, no app.css / theme-class dependency.
	let {
		header,
		variant = 'light',
		pathname
	}: {
		header: HomeFiveHeaderData;
		/** `home` = transparent bar over the dark hero; `light` = white bar (/compare-clean). */
		variant?: 'home' | 'light';
		/** Current path used to mark the active nav item (falls back to `item.active`). */
		pathname?: string;
	} = $props();

	const isHome = $derived(variant === 'home');

	// External (tel:/mailto:/https:) hrefs bypass `resolve`; internal start with `/`.
	const linkHref = (href: string) => (href.startsWith('/') ? resolve(href as '/') : href);
	const isActive = (href: string, fallback: boolean) =>
		pathname ? pathname === href || (href !== '/' && pathname.startsWith(`${href}/`)) : fallback;

	let searchOpen = $state(false);
	let langOpen = $state(false);

	function closeLanguage() {
		langOpen = false;
	}
	// Outside-click / Escape close for the language menu. Reacts to `langOpen` and
	// touches the live document — the one acceptable $effect here.
	$effect(() => {
		if (!langOpen) return;
		const onPointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (target instanceof Element && target.closest('[data-language-switch]')) return;
			langOpen = false;
		};
		const onKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') langOpen = false;
		};
		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<!-- ===== inline SVG glyphs (themed paths, currentColor) ===== -->
{#snippet searchIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M16.5 13.5L19.5 16.5L16.5 19.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4.5 16.5H19.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M7.5 10.5L4.5 7.5L7.5 4.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M19.5 7.5H4.5"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet heartIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M12 21C12 21 2.25 15.75 2.25 9.5625C2.25 8.21984 2.78337 6.93217 3.73277 5.98277C4.68217 5.03337 5.96984 4.5 7.3125 4.5C9.43031 4.5 11.2444 5.65406 12 7.5C12.7556 5.65406 14.5697 4.5 16.6875 4.5C18.0302 4.5 19.3178 5.03337 20.2672 5.98277C21.2166 6.93217 21.75 8.21984 21.75 9.5625C21.75 15.75 12 21 12 21Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet userIcon()}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3 20.25C4.81594 17.1122 8.11406 15 12 15C15.8859 15 19.1841 17.1122 21 20.25"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet socialIcon(link: HomeFiveHeaderSocial)}
	{#if link.icon === 'x'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M3.75 3.125H7.5L16.25 16.875H12.5L3.75 3.125Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.89687 11.2129L3.75 16.8746"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M16.2484 3.125L11.1016 8.78672"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if link.icon === 'instagram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<path
				d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<path
				d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z"
				fill="currentColor"
			/>
		</svg>
	{:else if link.icon === 'youtube'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M17.5 7.5C17.5 6.39543 16.6046 5.5 15.5 5.5H4.5C3.39543 5.5 2.5 6.39543 2.5 7.5V12.5C2.5 13.6046 3.39543 14.5 4.5 14.5H15.5C16.6046 14.5 17.5 13.6046 17.5 12.5V7.5Z"
				stroke="currentColor"
				stroke-width="1.5"
			/>
			<path d="M8.75 7.75L12.5 10L8.75 12.25V7.75Z" fill="currentColor" />
		</svg>
	{:else if link.icon === 'telegram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M6.24939 10.5366L13.301 16.7186C13.3822 16.7903 13.4806 16.8396 13.5867 16.8618C13.6927 16.8839 13.8027 16.8781 13.9058 16.845C14.0089 16.8118 14.1016 16.7524 14.1749 16.6726C14.2481 16.5928 14.2994 16.4953 14.3236 16.3897L17.4994 2.59521C17.5025 2.58138 17.5018 2.56696 17.4973 2.55351C17.4928 2.54006 17.4848 2.52807 17.474 2.51884C17.4633 2.50961 17.4502 2.50348 17.4362 2.5011C17.4223 2.49873 17.4079 2.5002 17.3947 2.50537L1.56189 8.70146C1.4636 8.73929 1.38023 8.80798 1.3243 8.89722C1.26837 8.98646 1.2429 9.09143 1.2517 9.19638C1.26051 9.30133 1.30312 9.4006 1.37313 9.47927C1.44315 9.55794 1.5368 9.61178 1.64001 9.63271L6.24939 10.5366Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.25 10.5375L17.4539 2.50781"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<!-- chat / facebook fallback bubble -->
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M6.25 11.25L8.75 8.75L11.25 11.25L13.75 8.75"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.24382 16.4932C7.81923 17.405 9.67248 17.7127 11.458 17.359C13.2436 17.0053 14.8396 16.0143 15.9484 14.5708C17.0573 13.1273 17.6033 11.3298 17.4847 9.51341C17.3662 7.69704 16.5911 5.98577 15.304 4.69866C14.0169 3.41156 12.3056 2.63646 10.4892 2.51789C8.67284 2.39932 6.87533 2.94537 5.43182 4.05422C3.98831 5.16308 2.99733 6.75906 2.64363 8.54461C2.28993 10.3302 2.59766 12.1834 3.50944 13.7588L2.5321 16.6768C2.49538 16.7869 2.49005 16.9051 2.51671 17.0181C2.54337 17.131 2.60097 17.2344 2.68306 17.3165C2.76514 17.3985 2.86847 17.4561 2.98145 17.4828C3.09443 17.5095 3.2126 17.5041 3.32273 17.4674L6.24382 16.4932Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
{/snippet}

<header class={['font-bc-body', isHome ? 'absolute inset-x-0 top-0 z-50' : 'sticky top-0 z-50']}>
	<!-- ============================= TOP BAR (desktop) =============================
	     Shared ink surface, white text, 50px tall. -->
	<div class="hidden bg-bc-ink md:block">
		<div
			class="mx-auto flex h-[50px] w-full max-w-[1920px] items-center justify-between px-4 lg:px-[45px]"
		>
			<!-- Left: address + phone (Eliq red accent icons) | divider | language -->
			<div class="flex items-center gap-6">
				<div class="flex items-center gap-6">
					<a
						href={linkHref(header.contact.addressHref)}
						class="group/contact flex items-center gap-2 text-[15px] font-medium text-white transition-colors hover:text-white"
					>
						<!-- Eliq red accent; turns white on hover -->
						<span
							class="text-bc-accent-bright-soft transition-colors group-hover/contact:text-white"
						>
							<MapPin size={20} strokeWidth={2.25} aria-hidden="true" />
						</span>
						{header.contact.addressLabel}
					</a>
					<a
						href={linkHref(header.contact.phoneHref)}
						class="group/contact flex items-center gap-2 text-[15px] font-medium text-white transition-colors hover:text-white"
					>
						<span
							class="text-bc-accent-bright-soft transition-colors group-hover/contact:text-white"
						>
							<PhoneCall size={18} strokeWidth={2.2} aria-hidden="true" />
						</span>
						{header.contact.phoneLabel}
					</a>
				</div>

				<!-- vertical divider (hidden on large per themed lg-hidden) -->
				<span class="h-6 w-px bg-white/25 lg:hidden" aria-hidden="true"></span>

				<!-- language dropdown -->
				<div class="relative" data-language-switch>
					<button
						type="button"
						aria-haspopup="menu"
						aria-expanded={langOpen}
						onclick={() => (langOpen = !langOpen)}
						class="flex items-center gap-1.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
					>
						{header.language.current}
						<ChevronDown
							size={14}
							strokeWidth={2}
							aria-hidden="true"
							class="transition-transform {langOpen ? 'rotate-180' : ''}"
						/>
					</button>
					{#if langOpen}
						<div
							role="menu"
							class="absolute top-full left-0 z-30 mt-2 min-w-[140px] overflow-hidden rounded-bc-md border border-bc-border bg-white py-1 text-bc-ink shadow-bc-panel"
						>
							{#each header.language.options as option (option)}
								<button
									type="button"
									role="menuitem"
									onclick={closeLanguage}
									class={[
										'flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-bc-surface-soft hover:text-bc-accent',
										option === header.language.current
											? 'font-bold text-bc-accent'
											: 'text-bc-ink-soft'
									]}
								>
									{option}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Right: email + social icons -->
			<div class="flex items-center gap-6">
				<a
					href={linkHref(header.contact.emailHref)}
					class="flex items-center gap-2 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
				>
					<Mail size={16} strokeWidth={2} aria-hidden="true" />
					{header.contact.emailLabel}
				</a>
				<ul class="flex items-center gap-4 border-l border-white/25 pl-6">
					{#each header.socialLinks as link (link.label)}
						<li>
							<a
								href={linkHref(link.href)}
								target={link.target}
								rel={link.target === '_blank' ? 'noreferrer' : undefined}
								aria-label={link.label}
								class="flex text-white transition-opacity hover:opacity-80"
							>
								{@render socialIcon(link)}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- ============================= MAIN NAV (desktop) ============================
	     145px tall on desktop; collapses to the 64px mobile appbar below md. -->
	<div
		class={['border-b', isHome ? 'border-transparent bg-transparent' : 'border-bc-border bg-white']}
	>
		<div
			class="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between gap-5 px-3 md:h-[95px] md:px-4 lg:px-[45px]"
		>
			<!-- Logo -->
			<a href={linkHref(header.logo.href)} class="flex shrink-0 items-center">
				<img
					src={isHome ? eliqautoAssets.logoDark : header.logo.src}
					alt={header.logo.alt}
					width="1285"
					height="235"
					decoding="async"
					class={[
						'block w-auto',
						// mobile: 142px wide appbar wordmark; desktop: capped 58px tall
						'h-auto max-w-[142px] md:max-h-[58px] md:max-w-[240px]'
					]}
				/>
			</a>

			<!-- Primary nav with mega-menu panels -->
			<nav
				class="hidden flex-1 items-center justify-center md:flex md:self-stretch"
				aria-label="Eliqauto"
			>
				<ul class="flex h-full items-center gap-7">
					{#each header.navigation as item (item.href)}
						{@const active = isActive(item.href, item.active)}
						<li class={[item.megaMenu && 'group/nav', 'relative flex h-full items-center']}>
							<a
								href={linkHref(item.href)}
								aria-current={active ? 'page' : undefined}
								aria-haspopup={item.megaMenu ? 'true' : undefined}
								class={[
									'flex items-center gap-1 text-[16px] leading-[1.38] font-semibold transition-colors',
									isHome
										? active
											? 'text-white'
											: 'text-white/85 hover:text-white'
										: active
											? 'text-bc-accent'
											: 'text-bc-ink hover:text-bc-accent'
								]}
							>
								{item.label}
								{#if item.megaMenu}
									<ChevronDown
										size={15}
										strokeWidth={2.2}
										aria-hidden="true"
										class="transition-transform group-hover/nav:rotate-180"
									/>
								{/if}
							</a>

							{#if item.megaMenu}
								{#if item.megaMenu.variant === 'inventory'}
									<!-- Inventory mega: wide fixed panel dropped under the header, hover/focus revealed -->
									<div
										class="invisible fixed inset-x-0 top-[124px] z-30 mx-auto w-[min(1410px,calc(100vw-60px))] max-w-[1410px] overflow-hidden rounded-[18px] border border-[#eceff3] bg-white opacity-0 shadow-[0_30px_70px_rgba(0,0,0,0.34)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100"
									>
										<SiteMegaMenu menu={item.megaMenu} ui={header.ui} />
									</div>
								{:else}
									<!-- Container mega: smaller centered dropdown -->
									<div
										class="invisible absolute top-[72px] left-1/2 z-30 w-[min(280px,90vw)] -translate-x-1/2 rounded-bc-lg border border-[#eceff3] bg-white opacity-0 shadow-[0_30px_70px_rgba(0,0,0,0.34)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100"
									>
										<SiteMegaMenu menu={item.megaMenu} ui={header.ui} />
									</div>
								{/if}
							{/if}
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Desktop actions -->
			<div class="hidden items-center gap-5 md:flex">
				<button
					type="button"
					aria-label={header.ui.searchPlaceholder}
					onclick={() => (searchOpen = true)}
					class={[
						'flex h-6 w-6 items-center justify-center transition-colors',
						isHome
							? 'text-white hover:text-bc-accent-bright-soft'
							: 'text-bc-ink hover:text-bc-accent'
					]}
				>
					{@render searchIcon()}
				</button>

				<a
					href={resolve('/compare')}
					aria-label={header.ui.compare}
					class={[
						'relative flex h-6 w-6 items-center justify-center transition-colors',
						isHome
							? 'text-white hover:text-bc-accent-bright-soft'
							: 'text-bc-ink hover:text-bc-accent'
					]}
				>
					{@render compareIcon()}
					{#if header.actionBadges.compare > 0}
						<!-- action badge = Eliq red, white ring, white ink -->
						<span
							class="absolute -top-1.5 -right-2.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-bc-accent-bright-soft px-1 text-bc-micro font-bold text-bc-ink shadow-[0_4px_12px_rgba(28,28,28,0.14)]"
						>
							{header.actionBadges.compare}
						</span>
					{/if}
				</a>

				<a
					href={resolve('/account/favorites')}
					aria-label={header.ui.wishlist}
					class={[
						'relative flex h-6 w-6 items-center justify-center transition-colors',
						isHome
							? 'text-white hover:text-bc-accent-bright-soft'
							: 'text-bc-ink hover:text-bc-accent'
					]}
				>
					{@render heartIcon()}
					{#if header.actionBadges.wishlist > 0}
						<span
							class="absolute -top-1.5 -right-2.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-bc-accent-bright-soft px-1 text-bc-micro font-bold text-bc-ink shadow-[0_4px_12px_rgba(28,28,28,0.14)]"
						>
							{header.actionBadges.wishlist}
						</span>
					{/if}
				</a>

				<a
					href={resolve('/account')}
					class="ml-1 flex h-[52px] items-center gap-2 rounded-[12px] bg-bc-accent px-7 text-[16px] font-semibold text-white transition-colors hover:bg-bc-hover-accent"
				>
					{@render userIcon()}
					{header.ui.signIn}
				</a>
			</div>

			<!-- Mobile appbar: two 44px round white discs (map → address, call → phone) -->
			<div class="flex items-center gap-2 md:hidden">
				<a
					href={linkHref(header.contact.addressHref)}
					aria-label={header.contact.addressLabel}
					title={header.contact.addressLabel}
					class={[
						'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
						isHome
							? // home: white disc with a neutral inset hairline over the dark hero
								'bg-white text-bc-ink shadow-[inset_0_0_0_1px_rgb(24_24_27/0.14)]'
							: 'bg-white text-bc-ink hover:bg-bc-surface-soft'
					]}
				>
					<MapPin size={isHome ? 19 : 18} strokeWidth={2.35} aria-hidden="true" />
				</a>
				<a
					href={linkHref(header.contact.phoneHref)}
					aria-label={header.contact.phoneLabel}
					title={header.contact.phoneLabel}
					class={[
						'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
						isHome
							? 'text-bc-ink shadow-[inset_0_0_0_1px_rgb(24_24_27/0.14)]'
							: 'bg-white text-bc-ink hover:bg-bc-surface-soft'
					]}
				>
					<PhoneCall size={isHome ? 19 : 18} strokeWidth={2.35} aria-hidden="true" />
				</a>
			</div>
		</div>
	</div>
</header>

<!-- Search modal — opened from the search glyph -->
<SiteSearchModal bind:open={searchOpen} placeholder={header.ui.searchPlaceholder} />
