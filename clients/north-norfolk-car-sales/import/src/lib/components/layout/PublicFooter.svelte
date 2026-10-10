<script lang="ts">
	import { siteShellCopy } from '$lib/content/site-shell';
	import { assetHref } from '$lib/utils/assets';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { site } from '$lib/config/site';
	import SocialLinks from '$lib/components/common/SocialLinks.svelte';
	import { page } from '$app/state';
	import { linkHref } from '$lib/utils/links';
	import LocaleTrigger from '$lib/locale/LocaleTrigger.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Globe2 from '@lucide/svelte/icons/globe-2';
	let { showLocale = false }: { showLocale?: boolean } = $props();
	const currentYear = new Date().getFullYear();
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
	const desktopLinkGroups = $derived([
		{ title: copy.cars, links: [{ ...links[0], label: copy.allCars }, ...links.slice(1, 4)] },
		{
			title: copy.usefulLinks,
			links: [
				{ href: '/about', label: copy.about },
				{ href: '/blog', label: copy.guides },
				{ href: '/reviews', label: copy.reviews },
				{ href: '/faqs', label: copy.questions }
			]
		}
	]);
</script>

{#snippet dealerLogo()}
	<a href={linkHref('/')}>
		<img
			src={assetHref(site.identity.logoOnDark)}
			alt={site.identity.name}
			width="1744"
			height="512"
		/>
	</a>
{/snippet}

{#snippet contactDetails()}
	<a class="site-footer__phone" href={linkHref(site.contact.phoneHref)}>
		{site.contact.phone}
	</a>
	<a
		class="site-footer__address"
		href={linkHref(site.contact.mapHref)}
		target="_blank"
		rel="noreferrer"
	>
		<span>{dealerCopy[english ? 'en' : 'bg'].address}</span>
	</a>
{/snippet}

{#snippet messageAction()}
	<a class="site-footer__message" href={linkHref(site.contact.messageHref)}>
		{copy.message}<span class="site-footer__desktop-only" aria-hidden="true"><ArrowUpRight /></span>
	</a>
{/snippet}

<footer class="site-footer">
	<div class="site-container">
		<div class="site-footer__main">
			<div class="site-footer__showroom">
				{@render dealerLogo()}
				<address class="site-footer__showroom-contact">{@render contactDetails()}</address>
				<div class="site-footer__socials"><SocialLinks tone="plain" align="center" /></div>
			</div>
			<div class="site-footer__brand">
				{@render dealerLogo()}
				<p>{dealerCopy[english ? 'en' : 'bg'].appointment}</p>
				<div class="site-footer__socials site-footer__socials--mobile">
					<SocialLinks tone="dark" align="start" />
				</div>
			</div>
			<nav class="site-footer__links--mobile" aria-label={copy.usefulLinks}>
				{#each links as link (link.href)}<a href={linkHref(link.href)}>{link.label}</a>{/each}
			</nav>
			<div class="site-footer__details">
				<nav class="site-footer__links--desktop" aria-label={copy.usefulLinks}>
					{#each desktopLinkGroups as group (group.title)}
						<div class="site-footer__link-group">
							<h2 class="site-footer__title">{group.title}</h2>
							{#each group.links as link (link.href)}<a href={linkHref(link.href)}>{link.label}</a
								>{/each}
						</div>
					{/each}
				</nav>
				<div class="site-footer__panel-bottom">
					{@render messageAction()}
				</div>
				<address class="site-footer__contact">
					{@render contactDetails()}{@render messageAction()}
				</address>
			</div>
		</div>
		<div class="site-footer__legal">
			<span class="site-footer__legal-name"
				><span class="site-footer__desktop-only">© {currentYear}</span>{site.identity.name}</span
			>
			<div class="site-footer__legal-actions">
				<nav aria-label={copy.policies}>
					<a href={linkHref('/privacy')}>{copy.privacy}</a><a href={linkHref('/terms')}
						>{copy.terms}</a
					><a href={linkHref('/cookies')}>{copy.cookies}</a>
				</nav>
				{#if showLocale}<div class="site-footer__locale">
						<Globe2 aria-hidden="true" /><LocaleTrigger compact />
					</div>{/if}
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer__desktop-only,
	.site-footer__showroom,
	.site-footer__panel-bottom,
	.site-footer__main .site-footer__links--desktop,
	.site-footer__locale {
		display: none;
	}
	.site-footer__details,
	.site-footer__legal-actions {
		display: contents;
	}
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

	@media (min-width: 768px) {
		.site-footer {
			border-top: 1px solid var(--bc-footer-border);
			padding-top: var(--bc-space-8);
			font: var(--bc-weight-body) var(--bc-text-body)/var(--bc-leading-label) var(--bc-font-body);
		}
		.site-footer > .site-container {
			max-width: var(--bc-desktop-editorial-width);
		}
		.site-footer__main {
			grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
			gap: var(--bc-space-5);
			align-items: stretch;
			padding-bottom: var(--bc-space-4);
		}
		.site-footer__brand,
		.site-footer__links--mobile,
		.site-footer__main .site-footer__contact {
			display: none;
		}
		.site-footer__desktop-only {
			display: block;
		}
		span.site-footer__desktop-only {
			display: inline-flex;
			flex-shrink: 0;
			align-items: center;
		}
		.site-footer__showroom {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			gap: var(--bc-space-4);
			min-width: 0;
			padding: var(--bc-space-6);
			border: 1px solid var(--bc-footer-border);
			border-radius: var(--bc-radius-panel);
			background: var(--bc-footer-panel);
			text-align: center;
		}
		.site-footer__showroom > a {
			display: inline-flex;
			max-width: 100%;
		}
		.site-footer__showroom img {
			max-width: 100%;
		}
		.site-footer__showroom-contact {
			align-items: center;
			gap: var(--bc-space-2);
			max-width: 100%;
		}
		.site-footer__showroom .site-footer__socials {
			margin: 0;
		}
		.site-footer__socials :global(.social-links) {
			gap: var(--bc-space-2);
		}
		.site-footer__socials :global(.social-links a) {
			width: var(--bc-control-height-secondary);
			height: var(--bc-control-height-secondary);
			flex-basis: var(--bc-control-height-secondary);
			color: var(--bc-footer-ink);
		}
		.site-footer__socials :global(.social-links a:hover) {
			background: var(--bc-footer-bg);
			color: var(--bc-footer-ink);
		}
		.site-footer__socials :global(svg) {
			width: var(--bc-control-icon-size-secondary);
			height: var(--bc-control-icon-size-secondary);
		}
		.site-footer__details {
			display: flex;
			flex-direction: column;
			gap: var(--bc-space-4);
			min-width: 0;
			padding: var(--bc-space-6);
			border: 1px solid var(--bc-footer-border);
			border-radius: var(--bc-radius-panel);
		}
		.site-footer__main .site-footer__links--desktop {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--bc-space-6);
			flex: 1;
		}
		.site-footer__link-group {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0;
			text-align: center;
		}
		.site-footer__title {
			margin: 0 0 var(--bc-space-2);
			font: var(--bc-weight-heading) var(--bc-text-label)/var(--bc-leading-label)
				var(--bc-font-body);
			color: var(--bc-footer-ink);
		}
		.site-footer__link-group > a {
			display: inline-flex;
			align-items: center;
			min-height: var(--bc-control-height-compact);
		}
		.site-footer .site-footer__phone {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: var(--bc-control-height-secondary);
			font: var(--bc-weight-heading) var(--bc-text-h5)/var(--bc-leading-h5) var(--bc-font-body);
			color: var(--bc-footer-ink);
		}
		.site-footer__message :global(svg) {
			width: var(--bc-control-icon-size-secondary);
			height: var(--bc-control-icon-size-secondary);
		}
		.site-footer__address {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: var(--bc-control-height-secondary);
			text-align: center;
		}
		.site-footer__address > span {
			text-wrap: balance;
		}
		.site-footer__panel-bottom {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			gap: var(--bc-space-5);
		}
		.site-footer .site-footer__message {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--bc-space-3);
			flex-shrink: 0;
			min-height: var(--bc-control-height-secondary);
			padding-inline: var(--bc-space-4);
			border-radius: var(--bc-radius-pill);
			background: var(--bc-footer-ink);
			color: var(--bc-ink);
			font-weight: var(--bc-weight-heading);
			text-decoration: none;
		}
		.site-footer .site-footer__message:hover {
			background: var(--bc-white);
			color: var(--bc-ink);
		}
		.site-footer a:hover {
			color: var(--bc-footer-ink);
		}
		.site-footer a:focus-visible,
		.site-footer__locale :global(a:focus-visible) {
			outline: 2px solid var(--bc-focus-contrast);
			outline-offset: var(--bc-space-1);
			border-radius: var(--bc-radius-control);
		}
		.site-footer__legal {
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			gap: var(--bc-space-6);
			border-top: 0;
			padding-top: var(--bc-space-2);
			font: var(--bc-weight-body) var(--bc-text-meta)/var(--bc-leading-meta) var(--bc-font-body);
		}
		.site-footer__legal-name {
			display: inline-flex;
			gap: var(--bc-space-1);
		}
		.site-footer__legal-actions {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			gap: var(--bc-space-6);
		}
		.site-footer__legal nav {
			gap: var(--bc-space-5);
		}
		.site-footer__legal nav a {
			display: inline-flex;
			align-items: center;
			min-height: var(--bc-control-height-secondary);
			color: var(--bc-footer-muted);
		}
		.site-footer__locale {
			display: flex;
			align-items: center;
			gap: var(--bc-space-1);
		}
		.site-footer__locale :global(svg) {
			width: var(--bc-control-icon-size-standard);
			height: var(--bc-control-icon-size-standard);
		}
		.site-footer__locale :global(a) {
			color: var(--bc-footer-ink);
			font: var(--bc-weight-heading) var(--bc-text-meta)/var(--bc-leading-meta) var(--bc-font-body);
			text-decoration: none;
		}
		.site-footer__locale :global(a:hover) {
			text-decoration: underline;
		}
	}
	@media (min-width: 768px) and (max-width: 1023.98px) {
		.site-footer__main {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
		}
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
