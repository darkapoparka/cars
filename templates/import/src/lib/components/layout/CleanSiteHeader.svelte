<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Globe2, MapPin, PhoneCall } from '@lucide/svelte';
	import { daynightAssets } from '$lib/data/daynight';
	import type { HomeFiveHeaderData } from '$lib/auxero/home-five';
	import SiteMegaMenu from './SiteMegaMenu.svelte';
	import SiteSearchModal from './SiteSearchModal.svelte';

	// Clean Svelte 5 + Tailwind v4 public header — the keystone shared header for the
	// Auxero → clean migration. It shares one restrained dark desktop row with the
	// themed HomeFiveHeader: brand left, navigation centered, essential actions right.
	// Full contact details and social links remain in the footer instead of a utility strip.
	//   • hover/focus mega-menu panels (SiteMegaMenu = inner content)
	//   • search modal wired to the search glyph
	// Off-token visible colors that have no matching bc token are kept as exact hex
	// (and commented). Zero !important, no app.css / theme-class dependency.
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
	const languageCode = (option: string) => (option === 'English' || option === 'Английски' ? 'en' : 'bg');
	const languageHref = (option: string) => {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('lang', languageCode(option));
		return `${page.url.pathname}?${params.toString()}`;
	};
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
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

<header
	class={[
		'font-bc-body',
		isHome ? 'absolute inset-x-0 top-0 z-50' : 'sticky top-0 z-50 bg-[#090a0b] md:bg-transparent'
	]}
>
	<!-- ============================= MAIN NAV (desktop) ============================
	     One 94px dark row on desktop; collapses to the existing mobile appbar below md. -->
	<div class="border-b-0 bg-[#090a0b] md:border-b md:border-white/10">
		<div
			class="mx-auto flex h-14 w-full max-w-[1920px] items-center justify-between gap-3 px-[15px] min-[1400px]:px-10 md:h-[94px] md:gap-5"
		>
			<!-- Logo -->
			<a href={linkHref(header.logo.href)} class="flex min-w-0 flex-[0_1_288px] items-center">
				<img
					src={daynightAssets.logoDark}
					alt={header.logo.alt}
					width="1285"
					height="235"
					decoding="async"
					class={[
						'block w-auto',
						// mobile follows the homepage's 168x48 brand slot; desktop keeps the full mark.
						'h-auto max-h-12 max-w-[168px] md:max-h-14 md:max-w-[360px]'
					]}
				/>
			</a>

			<!-- Primary nav with mega-menu panels -->
			<nav
				class="hidden flex-1 items-center justify-center md:flex md:self-stretch"
				aria-label="Day Night Auto"
			>
				<ul class="flex h-full items-center gap-4 min-[1400px]:gap-3">
					{#each header.navigation as item (item.href)}
						{@const active = isActive(item.href, item.active)}
						<li class={[item.megaMenu && 'group/nav', 'relative flex h-full items-center']}>
							<a
								href={linkHref(item.href)}
								aria-current={active ? 'page' : undefined}
								class={[
									'relative flex h-full items-center gap-px text-[20px] font-medium transition-colors',
									active
										? "text-white after:absolute after:bottom-[28px] after:left-0 after:h-0.5 after:w-full after:bg-bc-accent after:content-['']"
										: 'text-white/78 hover:text-white focus-visible:text-white'
								]}
							>
								{item.label}
							</a>

							{#if item.megaMenu}
								{#if item.megaMenu.variant === 'inventory'}
									<!-- Inventory mega: wide fixed panel dropped under the header, hover/focus revealed -->
									<div
										class="invisible fixed inset-x-0 top-[94px] z-30 mx-auto hidden w-[min(1410px,calc(100vw-60px))] max-w-[1410px] overflow-hidden rounded-b-[18px] border border-[#eceff3] bg-white opacity-0 shadow-[0_30px_70px_rgba(0,0,0,0.34)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100"
									>
										<SiteMegaMenu menu={item.megaMenu} ui={header.ui} />
									</div>
								{:else}
									<!-- Container mega: smaller centered dropdown -->
									<div
										class="invisible absolute top-full left-1/2 z-30 hidden w-[min(280px,90vw)] -translate-x-1/2 rounded-bc-lg border border-[#eceff3] bg-white opacity-0 shadow-[0_30px_70px_rgba(0,0,0,0.34)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out group-focus-within/nav:visible group-focus-within/nav:opacity-100 group-hover/nav:visible group-hover/nav:opacity-100"
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
			<div class="hidden flex-[0_1_430px] items-center justify-end gap-1 md:flex">
				<a
					href={linkHref(header.contact.phoneHref)}
					aria-label={header.contact.phoneLabel}
					title={header.contact.phoneLabel}
					class="hidden h-11 w-11 shrink-0 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white xl:flex"
				>
					<PhoneCall size={21} strokeWidth={1.8} aria-hidden="true" />
				</a>

				<div class="relative hidden xl:block" data-language-switch>
					<button
						type="button"
						aria-haspopup="menu"
						aria-expanded={langOpen}
						aria-label={`${header.language.current} — смени езика`}
						title={header.language.current}
						onclick={() => (langOpen = !langOpen)}
						class="flex h-11 w-11 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white"
					>
						<Globe2 size={21} strokeWidth={1.8} aria-hidden="true" />
					</button>
					{#if langOpen}
						<div
							role="menu"
							class="absolute top-full right-0 z-30 mt-2 min-w-[140px] overflow-hidden rounded-bc-md border border-bc-border bg-white py-1 text-bc-ink shadow-bc-panel"
						>
							{#each header.language.options as option (option)}
								<a
									href={resolve(languageHref(option) as '/')}
									role="menuitem"
									aria-current={option === header.language.current ? 'true' : undefined}
									onclick={closeLanguage}
									class={[
										'flex w-full items-center px-4 py-2 text-left text-sm transition-colors hover:bg-bc-surface-soft',
										option === header.language.current
											? 'font-bold text-bc-accent-contrast'
											: 'text-bc-ink-soft'
									]}
								>
									{option}
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<a
					href={resolve('/account')}
					aria-label={header.ui.signIn}
					title={header.ui.signIn}
					class="flex h-11 w-11 shrink-0 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white"
				>
					{@render userIcon()}
				</a>

				<span class="mx-2 h-6 w-px bg-white/14" aria-hidden="true"></span>

				<div class="flex items-center gap-1">
					<button
						type="button"
						aria-label={header.ui.searchPlaceholder}
						onclick={() => (searchOpen = true)}
						class="flex h-11 w-11 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white"
					>
						{@render searchIcon()}
					</button>

					<a
						href={resolve('/compare')}
						aria-label={header.ui.compare}
						class="relative flex h-11 w-11 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white"
					>
						{@render compareIcon()}
						{#if header.actionBadges.compare > 0}
							<span
								class="absolute -top-1.5 -right-[9px] flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#b9161c] text-[10px] leading-none font-bold text-white shadow-[0_4px_12px_rgba(28,28,28,0.14)]"
							>
								{header.actionBadges.compare}
							</span>
						{/if}
					</a>

					<a
						href={resolve('/account/favorites')}
						aria-label={header.ui.wishlist}
						class="relative flex h-11 w-11 items-center justify-center text-white/82 transition-colors hover:text-white focus-visible:text-white"
					>
						{@render heartIcon()}
						{#if header.actionBadges.wishlist > 0}
							<span
								class="absolute -top-1.5 -right-[9px] flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#b9161c] text-[10px] leading-none font-bold text-white shadow-[0_4px_12px_rgba(28,28,28,0.14)]"
							>
								{header.actionBadges.wishlist}
							</span>
						{/if}
					</a>
				</div>
			</div>

			<!-- Mobile appbar: two 44px round white discs (map → address, call → phone) -->
			<div class="-mr-[3px] flex translate-y-0.5 items-center gap-2 md:hidden">
				<a
					href={linkHref(header.contact.addressHref)}
					aria-label={header.contact.addressLabel}
					title={header.contact.addressLabel}
					class={[
						'flex h-11 w-11 items-center justify-center rounded-full bg-[#17191b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26)] transition-colors hover:bg-[#222528]'
					]}
				>
					<MapPin size={isHome ? 19 : 18} strokeWidth={2.35} aria-hidden="true" />
				</a>
				<a
					href={linkHref(header.contact.phoneHref)}
					aria-label={header.contact.phoneLabel}
					title={header.contact.phoneLabel}
					class={[
						'flex h-11 w-11 items-center justify-center rounded-full bg-[#17191b] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26)] transition-colors hover:bg-[#222528]'
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
