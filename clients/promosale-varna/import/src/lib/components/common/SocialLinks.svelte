<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import { assetHref } from '$lib/utils/assets';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site, type SocialLink } from '$lib/config/site';
	import { siteShellCopy } from '$lib/content/site-shell';
	import { socialBrandMarks } from './social-brand-marks';
	let {
		links = site.socials ?? [],
		tone = 'light',
		align = 'center'
	}: {
		links?: readonly SocialLink[];
		tone?: 'light' | 'dark' | 'glass' | 'plain';
		align?: 'start' | 'center';
	} = $props();
</script>

{#if links.length}
	<nav
		class="social-links"
		class:social-links--dark={tone === 'dark'}
		class:social-links--glass={tone === 'glass'}
		class:social-links--plain={tone === 'plain'}
		class:social-links--start={align === 'start'}
		aria-label={siteShellCopy[page.data.locale === 'en' ? 'en' : 'bg'].socialMedia}
	>
		{#each links as link (link.platform)}
			<a
				href={linkHref(link.href)}
				aria-label={link.label}
				title={link.label}
				target="_blank"
				rel="noopener noreferrer"
			>
				{#if tone === 'glass' || tone === 'plain'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d={socialBrandMarks[link.platform]} />
					</svg>
				{:else}
					<img
						src={assetHref(base + '/assets/icons/brands/' + link.platform + '.svg')}
						alt=""
						width="24"
						height="24"
					/>
				{/if}
			</a>
		{/each}
	</nav>
{/if}

<style>
	.social-links {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
	}
	.social-links--start {
		justify-content: flex-start;
	}
	.social-links a {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-primary);
		height: var(--bc-control-height-primary);
		flex: 0 0 var(--bc-control-height-primary);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-control);
		color: var(--bc-ink);
		text-decoration: none;
		transition:
			background-color var(--bc-motion-fast),
			color var(--bc-motion-fast);
	}
	.social-links a:hover {
		background: var(--bc-surface-hover);
		color: var(--bc-ink);
	}
	.social-links--dark a {
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.social-links--dark a:hover {
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.social-links--plain a {
		background: transparent;
	}
	.social-links img,
	.social-links svg {
		width: 24px;
		height: 24px;
		display: block;
		object-fit: contain;
	}
	@media (min-width: 768px) {
		.social-links a:hover,
		.social-links--dark a:hover {
			background: var(--bc-control-hover);
		}
		.social-links--glass a {
			border: 1px solid transparent;
			background: var(--bc-desktop-hero-quiet-surface);
			color: var(--bc-desktop-hero-ink);
		}
		.social-links--glass a:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
	}
</style>
