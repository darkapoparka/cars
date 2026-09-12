<script lang="ts">
	import { resolve } from '$app/paths';
	import { footerNavItems, daynightSite } from '$lib/data/daynight-site';

	const buyingLinks = footerNavItems.slice(0, 4);
	const supportLinks = footerNavItems.slice(4, 8);
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={daynightSite.logoDark} alt={daynightSite.name} />
			<p>{daynightSite.previewNotice}</p>
		</div>
		<div>
			<p class="footer-title">Vehicles</p>
			<ul>
				{#each buyingLinks as link (link.href)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Information</p>
			<ul>
				{#each supportLinks as link (link.href)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Contact</p>
			<p>{daynightSite.phoneLabel}</p>
			{#if daynightSite.email}<p>{daynightSite.email}</p>{/if}
			<p>{daynightSite.location}</p>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {daynightSite.shortName}. Independent private design preview.</span>
			<div>
				<a href={resolve('/terms')}>Preview terms</a>
				<a href={resolve('/contact')}>Preview information</a>
				<a href={resolve('/contact')}>Contact</a>
			</div>
		</div>
	</div>
</footer>
