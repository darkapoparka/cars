<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import { linkHref as resolve } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
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
		onnavigate
	}: {
		pathname?: string;
		onnavigate: (event: MouseEvent, href: string) => void;
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

<a
	class="mobile-navigation-menu__feature"
	href={resolve(localHref('/sell-your-car') as '/')}
	onclick={(event) => onnavigate(event, localHref('/sell-your-car'))}
>
	<div class="mobile-navigation-menu__feature-copy">
		<strong>{english ? 'Sell your car' : 'Продай автомобил'}</strong>
		<small>{english ? 'Request an appraisal' : 'Заяви оценка на автомобила'}</small>
	</div>
	<span class="mobile-navigation-menu__feature-arrow" aria-hidden="true">
		<ArrowRight size={18} strokeWidth={2.35} />
	</span>
	<img
		class="mobile-navigation-menu__feature-image"
		src={assetHref('/assets/daynight/home2/home2-action-consultant.webp')}
		alt=""
		aria-hidden="true"
		loading="lazy"
	/>
</a>

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

<LocaleTrigger />
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
	.mobile-navigation-menu__feature {
		position: relative;
		isolation: isolate;
		display: flex;
		min-height: var(--bc-mobile-menu-feature-height);
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		overflow: hidden;
		border-radius: var(--bc-radius-control);
		background: var(--bc-ink);
		padding: var(--bc-space-3)
			calc(
				var(--bc-mobile-menu-feature-height) + var(--bc-control-height-compact) + var(--bc-space-6)
			)
			var(--bc-space-3) var(--bc-space-3);
		color: var(--bc-white);
		text-decoration: none !important;
		transition: background-color var(--bc-motion-hover);
	}

	.mobile-navigation-menu__feature::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(90deg, transparent 54%, rgb(17 17 17 / 0.42) 100%);
		content: '';
	}

	.mobile-navigation-menu__feature-copy {
		position: relative;
		z-index: 1;
		display: grid;
		gap: var(--bc-space-1);
		min-width: 0;
	}

	.mobile-navigation-menu__feature strong,
	.mobile-navigation-menu__feature small {
		display: block;
		min-width: 0;
	}

	.mobile-navigation-menu__feature strong {
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-control);
	}

	.mobile-navigation-menu__feature small {
		color: rgb(255 255 255 / 0.78);
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-meta-leading);
	}

	.mobile-navigation-menu__feature-arrow {
		position: absolute;
		top: 50%;
		right: var(--bc-space-3);
		z-index: 2;
		display: grid;
		width: var(--bc-control-height-compact);
		height: var(--bc-control-height-compact);
		place-items: center;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-white);
		color: var(--bc-ink);
		transform: translateY(-50%);
	}

	.mobile-navigation-menu__feature-arrow :global(svg),
	.mobile-navigation-menu__feature-arrow :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.mobile-navigation-menu__feature-image {
		position: absolute;
		right: calc(var(--bc-control-height-compact) + var(--bc-space-1));
		bottom: -11px;
		z-index: 0;
		display: block;
		width: calc(var(--bc-mobile-menu-feature-height) + var(--bc-space-3));
		height: calc(var(--bc-mobile-menu-feature-height) + var(--bc-space-3));
		object-fit: contain;
		object-position: right bottom;
		pointer-events: none;
		user-select: none;
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

	.mobile-navigation-menu__feature:focus-visible {
		background: var(--bc-ink);
		color: var(--bc-white);
	}

	@media (hover: hover) and (pointer: fine) {
		.mobile-navigation-menu__feature:hover {
			background: var(--bc-dark-hover);
			color: var(--bc-white);
		}
	}
</style>
