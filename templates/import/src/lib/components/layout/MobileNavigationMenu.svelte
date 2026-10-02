<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { linkHref as resolve } from '$lib/utils/links';
	import Calculator from '@lucide/svelte/icons/calculator';
	import CarFront from '@lucide/svelte/icons/car-front';
	import GitCompare from '@lucide/svelte/icons/git-compare';
	import Heart from '@lucide/svelte/icons/heart';
	import Info from '@lucide/svelte/icons/info';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import UserRound from '@lucide/svelte/icons/user-round';
	import Wrench from '@lucide/svelte/icons/wrench';
	import MobileMenuAction from '$lib/components/common/MobileMenuAction.svelte';
	import { site } from '$lib/config/site';
	import { page } from '$app/state';

	let {
		pathname = '/',
		onnavigate,
		beforeLocaleOpen
	}: {
		pathname?: string;
		onnavigate: (event: MouseEvent, href: string) => void;
		beforeLocaleOpen: () => HTMLElement | undefined | Promise<HTMLElement | undefined>;
	} = $props();

	const english = $derived(page.data.locale === 'en');
	const localHref = (href: string) => href + (english ? '?lang=en' : '');
	const menuSections = $derived([
		{
			title: english ? 'Cars' : 'Автомобили',
			links: [
				{ href: '/inventory', label: english ? 'All cars' : 'Всички коли', icon: CarFront },
				{
					href: '/sell-your-car',
					label: english ? 'Sell your car' : 'Продай колата си',
					icon: CarFront
				},
				{ href: '/import', label: english ? 'Import a car' : 'Подбрани автомобили', icon: Wrench },
				{
					href: '/compare',
					label: english ? 'Compare cars' : 'Сравни автомобили',
					icon: GitCompare
				},
				{
					href: '/account/favorites',
					label: english ? 'Saved cars' : 'Любими автомобили',
					icon: Heart
				},
				{
					href: '/calculator',
					label: english ? 'Import calculator' : 'Калкулатор за внос',
					icon: Calculator
				}
			]
		},
		{
			title: site.identity.name,
			links: [
				{ href: '/services', label: english ? 'Services' : 'Услуги', icon: Wrench },
				{ href: '/about', label: english ? 'About us' : 'За нас', icon: Info },
				{ href: '/contact', label: english ? 'Contact' : 'Контакти', icon: PhoneCall },
				{
					href: '/account/messages',
					label: english ? 'Messages' : 'Съобщения',
					icon: MessageCircle
				},
				{ href: '/account', label: english ? 'Account' : 'Вход / профил', icon: UserRound }
			]
		}
	] as const);

	const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
</script>

<section class="mobile-navigation-menu__banner" aria-label={site.identity.name}>
	<img
		class="mobile-navigation-menu__art"
		src={assetHref('/assets/daynight/banners/commerce-visit-small.webp')}
		alt=""
		width="360"
		height="203"
	/>
	<img
		class="mobile-navigation-menu__logo"
		src={assetHref(site.identity.logoOnDark)}
		alt={site.identity.name}
		width="220"
		height="58"
	/>
	<div class="mobile-navigation-menu__contact">
		<a href={site.contact.mapHref} target="_blank" rel="noreferrer">
			<MapPin size={16} strokeWidth={1.8} aria-hidden="true" /><span
				>{dealerCopy[english ? 'en' : 'bg'].address}</span
			>
		</a>
		<a href={site.contact.phoneHref} class="mobile-navigation-menu__phone">
			<PhoneCall size={16} strokeWidth={1.8} aria-hidden="true" /><span>{site.contact.phone}</span>
		</a>
	</div>
</section>

<div
	class="mobile-navigation-menu__actions"
	role="group"
	aria-label={english ? 'Quick contact' : 'Бърз контакт'}
>
	<MobileMenuAction
		href={site.contact.phoneHref}
		label={english ? 'Call' : 'Обади се'}
		icon={PhoneCall}
		variant="primary"
	/>
	<MobileMenuAction
		href={site.contact.messageHref}
		label={english ? 'Message' : 'Пиши ни'}
		icon={MessageCircle}
		variant="secondary"
	/>
</div>

<div class="mobile-navigation-menu__sections">
	{#each menuSections as section, sectionIndex (section.title)}
		<section aria-labelledby={`mobile-menu-section-${sectionIndex}`}>
			<h2 id={`mobile-menu-section-${sectionIndex}`}>{section.title}</h2>
			<div class="mobile-navigation-menu__links">
				{#each section.links as link (link.href)}
					<MobileMenuAction
						href={resolve(localHref(link.href) as '/')}
						label={link.label}
						icon={link.icon}
						active={isActive(link.href)}
						onclick={(event) => onnavigate(event, localHref(link.href))}
					/>
				{/each}
			</div>
		</section>
	{/each}
</div>
<div class="mobile-navigation-menu__locale">
	<LocaleTrigger variant="button" beforeOpen={beforeLocaleOpen} />
</div>

<style>
	.mobile-navigation-menu__banner {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 12px;
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background: var(--bc-mobile-dark);
		padding: 18px;
		color: var(--bc-white);
	}
	.mobile-navigation-menu__banner::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(90deg, rgb(9 10 11 / 0.95), rgb(9 10 11 / 0.72));
		content: '';
	}
	.mobile-navigation-menu__art {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.mobile-navigation-menu__logo {
		width: min(180px, 100%);
		height: 48px;
		object-fit: contain;
		object-position: left center;
	}
	.mobile-navigation-menu__contact {
		display: grid;
		gap: 2px;
	}
	.mobile-navigation-menu__contact a {
		display: grid;
		grid-template-columns: 16px minmax(0, 1fr);
		align-items: center;
		gap: 8px;
		min-height: 44px;
		color: inherit;
		font-size: 0.875rem;
		line-height: 1.286;
		text-decoration: none;
	}
	.mobile-navigation-menu__contact span {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.mobile-navigation-menu__contact .mobile-navigation-menu__phone {
		font-size: 1.125rem;
		line-height: 1.2223;
	}
	.mobile-navigation-menu__locale {
		position: static;
		padding-top: var(--bc-space-2);
	}
	.mobile-navigation-menu__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-2);
	}

	.mobile-navigation-menu__sections {
		display: grid;
		gap: var(--bc-space-3);
	}

	.mobile-navigation-menu__sections section {
		display: grid;
		gap: var(--bc-space-2);
	}

	.mobile-navigation-menu__sections h2 {
		margin: 0;
		color: var(--bc-muted);
		font-family: var(--bc-font-body);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-heading);
		letter-spacing: 0;
		line-height: var(--bc-mobile-meta-leading);
		text-transform: uppercase;
	}

	.mobile-navigation-menu__links {
		display: grid;
		gap: var(--bc-space-2);
	}
</style>
