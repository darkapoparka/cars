<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { site } from '$lib/config/site';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import { page } from '$app/state';
	import { linkHref } from '$lib/utils/links';
	const english = $derived(page.data.locale === 'en');
	const links = $derived([
		{ href: '/inventory', label: english ? 'Cars' : 'Автомобили' },
		{ href: '/import', label: english ? 'Import' : 'Внос' },
		{ href: '/sell-your-car', label: english ? 'Sell your car' : 'Продай автомобил' },
		{ href: '/financing', label: english ? 'Financing' : 'Финансиране' },
		{ href: '/about', label: english ? 'About' : 'За нас' },
		{ href: '/contact', label: english ? 'Contact' : 'Контакти' }
	]);
</script>

<footer class="site-footer">
	<div class="site-container">
		<div class="site-footer__main">
			<div>
				<a href={linkHref('/')}
					><img
						src={assetHref(site.identity.logoOnDark)}
						alt={site.identity.name}
						width="1744"
						height="512"
					/></a
				>
				<p>{dealerCopy[english ? 'en' : 'bg'].appointment}</p>
				<div class="site-footer__socials"><SocialLinks tone="dark" align="start" /></div>
			</div>
			<nav aria-label={english ? 'Useful links' : 'Полезни връзки'}>
				{#each links as link (link.href)}<a href={linkHref(link.href)}>{link.label}</a>{/each}
			</nav>
			<address>
				<a href={linkHref(site.contact.phoneHref)}>{site.contact.phone}</a><a
					href={linkHref(site.contact.mapHref)}
					target="_blank"
					rel="noreferrer">{dealerCopy[english ? 'en' : 'bg'].address}</a
				><a href={linkHref(site.contact.messageHref)}>{english ? 'Message us' : 'Пиши ни'}</a>
			</address>
		</div>
		<div class="site-footer__legal">
			<span>{site.identity.name}</span>
			<nav aria-label={english ? 'Policies' : 'Политики'}>
				<a href={linkHref('/privacy')}>{english ? 'Privacy' : 'Поверителност'}</a><a
					href={linkHref('/terms')}>{english ? 'Terms' : 'Условия'}</a
				><a href={linkHref('/cookies')}>{english ? 'Cookies' : 'Бисквитки'}</a>
			</nav>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--bc-footer-bg);
		color: var(--bc-footer-ink);
		padding: var(--bc-section-sm) 0 var(--bc-space-6);
	}
	.site-footer__main {
		display: grid;
		grid-template-columns: 1fr 1fr 1.2fr;
		gap: var(--bc-space-8);
		padding-bottom: var(--bc-space-8);
	}
	img {
		width: 200px;
		height: auto;
	}
	p {
		color: var(--bc-footer-muted);
		margin: var(--bc-space-4) 0 0;
	}
	nav,
	address {
		display: flex;
		flex-direction: column;
		gap: var(--bc-space-3);
		font-style: normal;
	}
	.site-footer a {
		color: var(--bc-footer-link);
		text-decoration: none;
	}
	a:hover {
		color: var(--bc-white);
		text-decoration: underline;
	}
	.site-footer__socials {
		margin-top: var(--bc-space-5);
	}
	.site-footer__legal {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-5);
		border-top: 1px solid var(--bc-footer-border);
		padding-top: var(--bc-space-5);
		font-size: var(--bc-text-label);
		color: var(--bc-footer-muted);
	}
	.site-footer__legal nav {
		flex-direction: row;
		flex-wrap: wrap;
	}
	@media (max-width: 767.98px) {
		.site-footer__main {
			grid-template-columns: 1fr;
			gap: var(--bc-space-6);
		}
		.site-footer__main nav {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}
		.site-footer__legal {
			flex-direction: column;
		}
	}
</style>
