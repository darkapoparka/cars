<script lang="ts">
	import { MapPin, Phone, Plus } from '@lucide/svelte';
	import {
		daynightDealerFooterGroups,
		daynightFooterBottomLinks
	} from '$lib/components/layout/daynight-footer-data';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { footerSocialLinks, type FooterSocialIcon } from './mobile-home-data';
	let { showContact = true }: { showContact?: boolean } = $props();
</script>

<footer class="mh-footer">
	<a
		class="mh-footer__brand"
		href={resolve('/')}
		aria-label={`${daynightSite.shortName} — начална страница`}
	>
		<img
			class="mh-footer__logo"
			src={resolve(daynightSite.logoLight)}
			alt={daynightSite.name}
			loading="lazy"
		/>
	</a>
	{#if showContact}
		<div class="mh-footer__contact">
			<a class="mh-footer__phone" href={daynightSite.phoneHref}
				><Phone size={19} strokeWidth={2} /><span>{daynightSite.phoneLabel}</span></a
			>
			<a
				class="mh-footer__loc"
				href={daynightSite.mapUrl}
				target="_blank"
				rel="external noopener noreferrer"
				><MapPin size={19} strokeWidth={2} /><span>{daynightSite.location}</span></a
			>
		</div>
		<div class="mh-footer__hours">
			<span>Работно време</span>
			<p>{daynightSite.hoursLabel}</p>
		</div>
	{/if}
	<div class="mh-footer__groups">
		{#each daynightDealerFooterGroups as group (group.title)}
			<details>
				<summary>{group.title}<Plus size={18} strokeWidth={2} /></summary>
				<nav aria-label={group.title}>
					{#each group.links as link (link.href)}<a href={resolve(link.href)}>{link.label}</a
						>{/each}
				</nav>
			</details>
		{/each}
	</div>
	<nav class="mh-footer__social" aria-label="Социални канали и обяви">
		{#snippet footerSocialIcon(icon: FooterSocialIcon)}
			{#if icon === 'facebook'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M11.4 18.75V10.63H14.13L14.54 7.46H11.4V5.43C11.4 4.51 11.66 3.88 12.98 3.88H14.66V1.04C14.36 1 13.36 0.92 12.2 0.92C9.78 0.92 8.13 2.39 8.13 5.11V7.46H5.39V10.63H8.13V18.75H11.4Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linejoin="round"
					/>
				</svg>
			{:else if icon === 'instagram'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<rect
						x="2.5"
						y="2.5"
						width="15"
						height="15"
						rx="4.5"
						stroke="currentColor"
						stroke-width="1.4"
					/>
					<circle cx="10" cy="10" r="3.35" stroke="currentColor" stroke-width="1.4" />
					<circle cx="14.2" cy="5.8" r="0.9" fill="currentColor" />
				</svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M5 17H3.8C3.36 17 3 16.64 3 16.2V13.28C3 12.41 3.56 11.64 4.39 11.37L6.25 10.77L8 6.85C8.33 6.13 9.04 5.66 9.83 5.66H14.17C14.96 5.66 15.67 6.13 16 6.85L17.75 10.77L19.61 11.37C20.44 11.64 21 12.41 21 13.28V16.2C21 16.64 20.64 17 20.2 17H19"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M6.25 10.75H17.75"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M8.5 17C8.5 18.1 7.6 19 6.5 19C5.4 19 4.5 18.1 4.5 17C4.5 15.9 5.4 15 6.5 15C7.6 15 8.5 15.9 8.5 17Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M19.5 17C19.5 18.1 18.6 19 17.5 19C16.4 19 15.5 18.1 15.5 17C15.5 15.9 16.4 15 17.5 15C18.6 15 19.5 15.9 19.5 17Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		{/snippet}

		{#each footerSocialLinks as item (item.label)}
			{#if item.external}
				<a
					class="mh-footer__social-link"
					href={item.href}
					target="_blank"
					rel="external noopener noreferrer"
					title={item.title}
					aria-label={item.title}
				>
					{@render footerSocialIcon(item.icon)}
				</a>
			{:else}
				<a
					class="mh-footer__social-link"
					href={resolve(item.href)}
					title={item.title}
					aria-label={item.title}
				>
					{@render footerSocialIcon(item.icon)}
				</a>
			{/if}
		{/each}
	</nav>
	<div class="mh-footer__bottom">
		<span>© {new Date().getFullYear()} {daynightSite.shortName}</span>
		<nav aria-label="Правна информация">
			{#each daynightFooterBottomLinks as link (link.href)}<a href={resolve(link.href)}
					>{link.label}</a
				>{/each}
		</nav>
	</div>
</footer>

<style>
	/* Keep this dark surface independent of the home page's blanket text colour. */
	.mh-footer :global(*) {
		color: inherit;
	}
	.mh-footer {
		display: grid;
		gap: 20px;
		margin-top: 24px;
		padding: 28px var(--sa-mobile-gutter-wide) calc(24px + 62px + env(safe-area-inset-bottom));
		background: #1c1c1c;
		color: #fff;
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-regular);
		line-height: var(--sa-mobile-leading-body);
	}
	.mh-footer a {
		color: inherit;
		text-decoration: none;
	}
	.mh-footer a:focus-visible,
	.mh-footer summary:focus-visible {
		outline: 2px solid white;
		outline-offset: 3px;
	}
	.mh-footer__brand {
		display: flex;
		align-items: center;
		justify-self: start;
		min-height: var(--sa-mobile-action-h);
	}
	.mh-footer__logo {
		display: block;
		width: 180px;
		height: auto;
	}
	.mh-footer__contact {
		display: grid;
		gap: 8px;
	}
	.mh-footer__phone,
	.mh-footer__loc {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 12px 16px;
		border-radius: var(--sa-r-md);
	}
	.mh-footer__phone {
		justify-content: center;
		background: var(--sa-red);
		font-weight: var(--sa-weight-medium);
	}
	.mh-footer__loc {
		background: #242424;
	}
	.mh-footer__contact :global(svg) {
		flex-shrink: 0;
	}
	.mh-footer__hours {
		display: grid;
		gap: 4px;
	}
	.mh-footer__hours > span {
		color: #b7bec5;
		font-size: var(--sa-mobile-type-meta);
	}
	.mh-footer__hours p {
		margin: 0;
	}
	.mh-footer__groups {
		display: grid;
		gap: 8px;
	}
	.mh-footer__groups details {
		background: #242424;
		border-radius: var(--sa-r-md);
		overflow: hidden;
	}
	.mh-footer__groups summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 48px;
		padding: 12px 16px;
		list-style: none;
		cursor: pointer;
		font-weight: var(--sa-weight-medium);
	}
	.mh-footer__groups summary::-webkit-details-marker {
		display: none;
	}
	.mh-footer__groups summary :global(svg) {
		flex-shrink: 0;
	}
	.mh-footer__groups details[open] summary :global(svg) {
		transform: rotate(45deg);
	}
	.mh-footer__groups nav {
		display: grid;
		padding: 0 16px 8px;
	}
	.mh-footer__groups nav a {
		display: flex;
		align-items: center;
		min-height: var(--sa-mobile-action-h);
		padding: 8px 0;
		color: #d2d7dc;
	}
	.mh-footer__social {
		display: flex;
		gap: 12px;
	}
	.mh-footer__social-link {
		display: grid;
		place-items: center;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		border: 1px solid #464646;
		border-radius: 50%;
	}
	.mh-footer__social-link:hover {
		background: #303030;
	}
	.mh-footer__bottom {
		display: grid;
		gap: 4px;
		color: #b7bec5;
		font-size: var(--sa-mobile-type-meta);
	}
	.mh-footer__bottom nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
	}
	.mh-footer__bottom a {
		display: inline-flex;
		align-items: center;
		min-height: var(--sa-mobile-action-h);
	}
</style>
