<script lang="ts">
	import { siteShellCopy } from '$lib/content/site-shell';
	import { assetHref } from '$lib/utils/assets';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { site } from '$lib/config/site';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import { page } from '$app/state';
	import { linkHref } from '$lib/utils/links';
	const english = $derived(page.data.locale === 'en');
	const copy = $derived(siteShellCopy[english ? 'en' : 'bg']);
	const links = $derived([
		{ href: '/inventory', label: copy.cars },
		{ href: '/import', label: copy.import },
		{ href: '/sell-your-car', label: copy.sellCar },
		{ href: '/financing', label: copy.financing },
		{ href: '/about', label: copy.about },
		{ href: '/contact', label: copy.contact }
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
			<nav aria-label={copy.usefulLinks}>
				{#each links as link (link.href)}<a href={linkHref(link.href)}>{link.label}</a>{/each}
			</nav>
			<address>
				<a href={linkHref(site.contact.phoneHref)}>{site.contact.phone}</a><a
					href={linkHref(site.contact.mapHref)}
					target="_blank"
					rel="noreferrer">{dealerCopy[english ? 'en' : 'bg'].address}</a
				><a class="site-footer__message" href={linkHref(site.contact.messageHref)}>{copy.message}</a
				>
			</address>
		</div>
		<div class="site-footer__legal">
			<span class="site-footer__legal-name">{site.identity.name}</span>
			<nav aria-label={copy.policies}>
				<a href={linkHref('/privacy')}>{copy.privacy}</a><a href={linkHref('/terms')}
					>{copy.terms}</a
				><a href={linkHref('/cookies')}>{copy.cookies}</a>
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
		.site-footer {
			border-radius: 24px 24px 0 0;
		}
		.site-footer a.site-footer__message {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			align-self: flex-start;
			min-height: var(--bc-control-height-primary);
			padding: 8px 18px;
			border: 1px solid var(--bc-footer-border);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-control);
			color: var(--bc-ink);
			font-weight: var(--bc-weight-heading);
			text-decoration: none;
		}
		.site-footer a.site-footer__message:hover {
			background: var(--bc-surface-hover);
		}
		.site-footer__legal-name {
			display: none;
		}
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
