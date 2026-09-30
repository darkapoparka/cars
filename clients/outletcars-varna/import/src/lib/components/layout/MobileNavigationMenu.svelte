<script lang="ts">
	import CommerceBanner from '$lib/components/common/CommerceBanner.svelte';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { linkHref as resolve } from '$lib/utils/links';
	import Calculator from '@lucide/svelte/icons/calculator';
	import CarFront from '@lucide/svelte/icons/car-front';
	import GitCompare from '@lucide/svelte/icons/git-compare';
	import Heart from '@lucide/svelte/icons/heart';
	import Info from '@lucide/svelte/icons/info';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
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

<CommerceBanner
	title={english ? 'Sell your car' : 'Продай колата си'}
	action={english ? 'Request a valuation' : 'Заяви оценка'}
	image="/assets/daynight/services/sell-commerce"
	compact
	href={resolve(localHref('/sell-your-car') as '/')}
	onclick={(event) => onnavigate(event, localHref('/sell-your-car'))}
/>

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

<LocaleTrigger variant="button" beforeOpen={beforeLocaleOpen} />
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

<style>
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
