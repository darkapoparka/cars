<script lang="ts">
	import { Phone, Mail, MapPin, ArrowUpRight, Plus } from '@lucide/svelte';
	import { daynightContact } from '$lib/data/daynight';
	import { resolve } from '$app/paths';
	import type { HomeFiveFooterData, HomeFiveFooterSocial } from '$lib/auxero/home-five';

	let { footer }: { footer?: HomeFiveFooterData } = $props();

	const socialLinks = $derived(footer?.socialLinks.filter((social) => social.href.trim()) ?? []);

	const externalHref = (href: string) => ({ href });
</script>

{#snippet socialIcon(icon: HomeFiveFooterSocial['icon'])}
	{#if icon === 'facebook'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.5502 20V10.8777H14.6109L15.0701 7.32156H11.5502V5.05147C11.5502 4.0222 11.8348 3.32076 13.3125 3.32076L15.194 3.31999V0.13923C14.8686 0.0969453 13.7517 0 12.4517 0C9.73708 0 7.87861 1.65697 7.87861 4.69927V7.32156H4.80859V10.8777H7.87861V20H11.5502Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'x'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M11.8616 8.46864L19.147 0H17.4206L11.0947 7.3532L6.04225 0H0.214844L7.85515 11.1193L0.214844 20H1.94134L8.62162 12.2348L13.9574 20H19.7848L11.8612 8.46864H11.8616ZM9.49695 11.2173L8.72283 10.1101L2.56342 1.29967H5.21521L10.1859 8.40994L10.96 9.51718L17.4214 18.7594H14.7696L9.49695 11.2177V11.2173Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'instagram'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.9996 0H4.99988C2.25019 0 0 2.25019 0 4.99988V15.0001C0 17.7491 2.25019 20 4.99988 20H14.9996C17.7493 20 19.9995 17.7491 19.9995 15.0001V4.99988C19.9995 2.25019 17.7493 0 14.9996 0ZM18.3328 15.0001C18.3328 16.8376 16.8381 18.3333 14.9996 18.3333H4.99988C3.16218 18.3333 1.66671 16.8376 1.66671 15.0001V4.99988C1.66671 3.16193 3.16218 1.66671 4.99988 1.66671H14.9996C16.8381 1.66671 18.3328 3.16193 18.3328 4.99988V15.0001Z"
				fill="white"
			/>
			<path
				d="M15.4179 5.83392C16.1083 5.83392 16.6679 5.27429 16.6679 4.58395C16.6679 3.89361 16.1083 3.33398 15.4179 3.33398C14.7276 3.33398 14.168 3.89361 14.168 4.58395C14.168 5.27429 14.7276 5.83392 15.4179 5.83392Z"
				fill="white"
			/>
			<path
				d="M9.99988 5C7.23793 5 5 7.23818 5 9.99988C5 12.7606 7.23793 15.0002 9.99988 15.0002C12.761 15.0002 14.9998 12.7606 14.9998 9.99988C14.9998 7.23818 12.761 5 9.99988 5ZM9.99988 13.3335C8.15915 13.3335 6.66671 11.8411 6.66671 9.99988C6.66671 8.15866 8.15915 6.66671 9.99988 6.66671C11.8406 6.66671 13.333 8.15866 13.333 9.99988C13.333 11.8411 11.8406 13.3335 9.99988 13.3335Z"
				fill="white"
			/>
		</svg>
	{:else if icon === 'viber'}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 2C6.5 2 2 5.8 2 10.5c0 2.6 1.4 4.9 3.5 6.5-.1 1-.5 2.3-1.2 3.2 1.5-.2 3-.8 4.2-1.7 1.1.3 2.3.5 3.5.5 5.5 0 10-3.8 10-8.5S17.5 2 12 2ZM8 11.7a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm4 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"
				fill="white"
			/>
		</svg>
	{:else}
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15.4163 11.3756L10.9163 8.37563C10.8033 8.30025 10.6719 8.25697 10.5363 8.2504C10.4006 8.24382 10.2657 8.27421 10.146 8.33831C10.0263 8.40241 9.9262 8.49783 9.85645 8.61436C9.7867 8.7309 9.74991 8.86419 9.75 9V15C9.74991 15.1358 9.7867 15.2691 9.85645 15.3856C9.9262 15.5022 10.0263 15.5976 10.146 15.6617C10.2657 15.7258 10.4006 15.7562 10.5363 15.7496C10.6719 15.743 10.8033 15.6998 10.9163 15.6244L15.4163 12.6244C15.5191 12.5559 15.6035 12.4631 15.6618 12.3542C15.7202 12.2452 15.7507 12.1236 15.7507 12C15.7507 11.8764 15.7202 11.7548 15.6618 11.6458C15.6035 11.5369 15.5191 11.4441 15.4163 11.3756Z"
				fill="white"
			/>
			<path
				d="M21.9684 6.5175C21.8801 6.17189 21.7109 5.85224 21.4747 5.58491C21.2385 5.31758 20.9421 5.11024 20.61 4.98C17.3962 3.73875 12.2812 3.75 12 3.75C11.7188 3.75 6.60375 3.73875 3.39 4.98C3.0579 5.11024 2.76153 5.31758 2.52534 5.58491C2.28915 5.85224 2.1199 6.17189 2.03156 6.5175C1.78875 7.45313 1.5 9.16313 1.5 12C1.5 14.8369 1.78875 16.5469 2.03156 17.4825C2.11977 17.8283 2.28895 18.1481 2.52515 18.4156C2.76136 18.6831 3.0578 18.8906 3.39 19.0209C6.46875 20.2088 11.2875 20.25 11.9381 20.25H12.0619C12.7125 20.25 17.5341 20.2088 20.61 19.0209C20.9422 18.8906 21.2386 18.6831 21.4748 18.4156C21.711 18.1481 21.8802 17.8283 21.9684 17.4825C22.2113 16.545 22.5 14.8369 22.5 12C22.5 9.16313 22.2113 7.45313 21.9684 6.5175Z"
				fill="white"
			/>
		</svg>
	{/if}
{/snippet}

{#if footer}
	<footer class="dn-footer">
		<div class="dn-footer__grid">
			<div class="dn-footer__brand">
				<a href={resolve('/')}><img src={footer.logo.src} alt={footer.logo.alt} /></a>
				<p class="dn-footer__muted">{footer.labels.openingHours}</p>
				{#each footer.hours as hours (hours)}<p>{hours}</p>{/each}
			</div>
			{#each [{ title: footer.labels.quickLinks, links: footer.quickLinks }, { title: footer.labels.buyingSelling, links: footer.buyingLinks }] as group (group.title)}
				<nav aria-label={group.title}>
					<h2>{group.title}</h2>
					<ul>
						{#each group.links as link (link.href)}<li>
								<a href={resolve(link.href as '/')}>{link.label}</a>
							</li>{/each}
					</ul>
				</nav>
			{/each}
			<div class="dn-footer__contact">
				<a {...externalHref(daynightContact.primaryPhoneHref)}
					><Phone size={18} /><strong>{daynightContact.primaryPhoneLabel}</strong><ArrowUpRight
						size={15}
					/></a
				>
				<a {...externalHref(daynightContact.emailHref)}
					><Mail size={18} /><span>{daynightContact.emailLabel}</span><ArrowUpRight size={15} /></a
				>
				<a href={resolve('/contact')}
					><MapPin size={18} /><span>{footer.contact.address}</span><ArrowUpRight size={15} /></a
				>
				<div class="dn-footer__socials">
					{#each socialLinks as social (social.label)}
						<a
							{...externalHref(social.href)}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}>{@render socialIcon(social.icon)}</a
						>
					{/each}
				</div>
			</div>
		</div>
		<div class="dn-footer__bottom">
			<p>{footer.copyright}</p>
			<div>
				{#each footer.legalLinks as link (link.label)}<a href={resolve(link.href as '/')}
						>{link.label}</a
					>{/each}
			</div>
		</div>
	</footer>

	<footer class="dn-footer-mobile">
		<a class="dn-footer-mobile__brand" href={resolve(footer.logo.href as '/')}>
			<img src={footer.logo.src} alt={footer.logo.alt} width="180" height="48" loading="lazy" />
		</a>
		<div class="dn-footer-mobile__contact">
			<a class="dn-footer-mobile__phone" {...externalHref(daynightContact.primaryPhoneHref)}>
				<Phone size={19} aria-hidden="true" />
				<span>{daynightContact.primaryPhoneLabel}</span>
			</a>
			<a class="dn-footer-mobile__address" href={resolve('/contact')}>
				<MapPin size={18} aria-hidden="true" />
				<span>{footer.contact.address}</span>
			</a>
		</div>
		<div class="dn-footer-mobile__hours">
			<p>{footer.labels.openingHours}</p>
			{#each footer.hours as hours (hours)}<p>{hours}</p>{/each}
		</div>
		<div class="dn-footer-mobile__links">
			{#each [{ title: footer.labels.quickLinks, links: footer.quickLinks }, { title: footer.labels.buyingSelling, links: footer.buyingLinks }] as group (group.title)}
				<details>
					<summary>{group.title}<Plus size={18} aria-hidden="true" /></summary>
					<nav aria-label={group.title}>
						{#each group.links as link (link.href)}
							<a href={resolve(link.href as '/')}>{link.label}</a>
						{/each}
					</nav>
				</details>
			{/each}
		</div>
		{#if socialLinks.length}
			<div class="dn-footer-mobile__socials">
				{#each socialLinks as social (social.label)}
					<a
						{...externalHref(social.href)}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={social.label}
					>
						{@render socialIcon(social.icon)}
					</a>
				{/each}
			</div>
		{/if}
		<div class="dn-footer-mobile__bottom">
			<p>{footer.copyright}</p>
			<div>
				{#each footer.legalLinks as link (link.label)}
					<a href={resolve(link.href as '/')}>{link.label}</a>
				{/each}
			</div>
		</div>
	</footer>
{/if}

<style>
	.dn-footer {
		display: none;
	}
	@media (min-width: 768px) {
		.dn-footer-mobile {
			display: none;
		}
		.dn-footer {
			display: block;
			background: var(--bc-footer-bg);
			color: var(--bc-footer-ink);
			border-radius: 30px 30px 0 0;
			padding: 40px 32px 24px;
		}
		.dn-footer__grid {
			max-width: 1320px;
			margin: auto;
			display: grid;
			grid-template-columns: 1.15fr 0.85fr 1fr 1.1fr;
			gap: 40px;
			align-items: start;
		}
		.dn-footer a {
			color: var(--bc-footer-link);
			text-decoration: none;
		}
		.dn-footer a:hover {
			color: white;
			text-decoration: underline;
		}
		.dn-footer a:focus-visible {
			outline: 2px solid white;
			outline-offset: 4px;
			border-radius: 4px;
		}
		.dn-footer__brand img {
			width: 220px;
			height: 64px;
			object-fit: contain;
			object-position: left;
			margin-bottom: 28px;
		}
		.dn-footer p {
			margin: 0;
			font-size: 15px;
			line-height: 1.65;
		}
		.dn-footer .dn-footer__muted {
			color: var(--bc-footer-muted);
			margin-bottom: 8px;
		}
		.dn-footer h2 {
			color: white;
			font-size: 16px;
			font-weight: 650;
			line-height: 24px;
			margin: 0 0 20px;
		}
		.dn-footer ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}
		.dn-footer li a {
			display: flex;
			align-items: center;
			min-height: 40px;
			font-size: 15px;
		}
		.dn-footer__contact {
			border: 1px solid var(--bc-footer-border);
			border-radius: 16px;
			background: var(--bc-footer-panel);
			padding: 16px;
		}
		.dn-footer__contact > a {
			display: flex;
			align-items: center;
			gap: 10px;
			min-height: 48px;
			font-size: 15px;
			overflow-wrap: anywhere;
		}
		.dn-footer__contact > a :global(svg) {
			flex-shrink: 0;
		}
		.dn-footer__contact > a :global(svg:last-child) {
			margin-left: auto;
		}
		.dn-footer__contact strong {
			color: white;
		}
		.dn-footer__socials {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			border-top: 1px solid var(--bc-footer-border);
			padding-top: 12px;
			margin-top: 12px;
		}
		.dn-footer__socials a {
			width: 40px;
			height: 40px;
			border: 1px solid var(--bc-footer-icon-border);
			border-radius: 8px;
			display: grid;
			place-items: center;
		}
		.dn-footer__bottom {
			max-width: 1320px;
			margin: 32px auto 0;
			border-top: 1px solid var(--bc-footer-border);
			padding-top: 22px;
			display: flex;
			justify-content: space-between;
			gap: 20px;
			color: var(--bc-footer-muted);
		}
		.dn-footer__bottom p,
		.dn-footer__bottom a {
			font-size: 14px;
		}
		.dn-footer__bottom > div {
			display: flex;
			flex-wrap: wrap;
			gap: 24px;
		}
	}
	@media (min-width: 768px) and (max-width: 1100px) {
		.dn-footer__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 28px;
		}
		.dn-footer__bottom {
			flex-wrap: wrap;
		}
	}

	@media (max-width: 767px) {
		.dn-footer-mobile {
			background: var(--bc-footer-bg);
			color: var(--bc-footer-ink);
			padding: 28px 16px 16px;
		}

		.dn-footer-mobile a,
		.dn-footer-mobile span {
			color: inherit;
		}

		.dn-footer-mobile a:focus-visible,
		.dn-footer-mobile summary:focus-visible {
			outline: 2px solid var(--bc-focus-contrast);
			outline-offset: 3px;
			border-radius: 4px;
		}

		.dn-footer-mobile a:hover {
			color: var(--bc-white);
		}

		.dn-footer-mobile__brand {
			display: inline-flex;
			margin-bottom: 16px;
		}

		.dn-footer-mobile__brand img {
			width: 180px;
			height: 48px;
			object-fit: contain;
			object-position: left;
		}

		.dn-footer-mobile__contact {
			display: grid;
			gap: 8px;
		}

		.dn-footer-mobile__contact a {
			display: flex;
			align-items: center;
			gap: 12px;
			min-height: 48px;
			padding: 12px 16px;
			border-radius: var(--bc-radius-control);
		}

		.dn-footer-mobile__contact :global(svg) {
			flex-shrink: 0;
			color: inherit;
		}

		.dn-footer-mobile__phone {
			justify-content: center;
			background: var(--bc-accent);
			font-size: 18px;
			font-weight: 700;
			line-height: 24px;
		}

		.dn-footer-mobile__address {
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
			background: var(--bc-footer-panel);
			font-weight: var(--bc-weight-body);
		}

		.dn-footer-mobile__hours {
			margin: 16px 0 20px;
		}

		.dn-footer-mobile__hours p {
			margin: 0;
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
			font-weight: var(--bc-weight-body);
		}

		.dn-footer-mobile__hours p:first-child {
			color: var(--bc-footer-muted);
			margin-bottom: 4px;
		}

		.dn-footer-mobile__links {
			display: grid;
			gap: 8px;
		}

		.dn-footer-mobile__links details {
			background: var(--bc-footer-panel);
			border-radius: var(--bc-radius-control);
		}

		.dn-footer-mobile__links summary {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			min-height: 48px;
			padding: 12px 16px;
			font-size: var(--bc-text-control);
			font-weight: var(--bc-weight-heading);
			list-style: none;
			cursor: pointer;
			line-height: var(--bc-leading-control);
		}

		.dn-footer-mobile__links summary::-webkit-details-marker {
			display: none;
		}

		.dn-footer-mobile__links details[open] summary :global(svg) {
			transform: rotate(45deg);
		}

		.dn-footer-mobile__links nav {
			display: grid;
			padding: 0 16px 12px;
		}

		.dn-footer-mobile__links nav a {
			display: flex;
			align-items: center;
			min-height: 44px;
			color: var(--bc-footer-link);
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
			font-weight: var(--bc-weight-body);
		}

		.dn-footer-mobile__socials {
			display: flex;
			gap: 12px;
			margin: 16px 0;
		}

		.dn-footer-mobile__socials a {
			display: grid;
			place-items: center;
			width: 44px;
			height: 44px;
			border: 1px solid var(--bc-footer-icon-border);
			border-radius: 50%;
		}

		.dn-footer-mobile__bottom {
			padding-top: 8px;
			color: var(--bc-footer-muted);
		}

		.dn-footer-mobile__bottom p {
			margin: 0 0 4px;
			font-size: var(--bc-mobile-meta);
			line-height: var(--bc-mobile-meta-leading);
			font-weight: var(--bc-weight-body);
		}

		.dn-footer-mobile__bottom > div {
			display: flex;
			flex-wrap: wrap;
			column-gap: 16px;
		}

		.dn-footer-mobile__bottom a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
			font-size: var(--bc-mobile-meta);
			line-height: var(--bc-mobile-meta-leading);
			font-weight: var(--bc-weight-body);
		}
	}
</style>
