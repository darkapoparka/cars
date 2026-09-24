<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import { assetHref } from '$lib/utils/assets';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { site, type SocialLink } from '$lib/config/site';
	let {
		links = site.socials ?? [],
		tone = 'light',
		align = 'center'
	}: {
		links?: readonly SocialLink[];
		tone?: 'light' | 'dark';
		align?: 'start' | 'center';
	} = $props();
</script>

{#if links.length}
	<nav
		class="social-links"
		class:social-links--dark={tone === 'dark'}
		class:social-links--start={align === 'start'}
		aria-label={page.data.locale === 'en' ? 'Social media' : 'Социални мрежи'}
	>
		{#each links as link (link.platform)}
			<a
				href={linkHref(link.href)}
				aria-label={link.label}
				title={link.label}
				target="_blank"
				rel="noopener noreferrer"
			>
				<img
					src={assetHref(base + '/assets/icons/brands/' + link.platform + '.svg')}
					alt=""
					width="24"
					height="24"
				/>
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
	.social-links img {
		width: 24px;
		height: 24px;
		display: block;
		object-fit: contain;
	}
</style>
