<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { footerNavItems, daynightSite } from '$lib/data/daynight-site';

	const buyingLinks = footerNavItems.slice(0, 4);
	const supportLinks = footerNavItems.slice(4, 8);
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={i18n.asset(daynightSite.logoLight)} alt={daynightSite.name} />
			<p>
				{i18n.t('copy.dcf650f3ce72')}
				{i18n.dealer('city')}
				{i18n.t('copy.90f942a6751f')}
			</p>
		</div>
		<div>
			<p class="footer-title">{i18n.t('copy.f698657835c5')}</p>
			<ul>
				{#each buyingLinks as link (link.href)}
					<li><a href={i18n.href(resolve(link.href))}>{i18n.text(link.label)}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">{i18n.t('copy.bdc2eadebfde')}</p>
			<ul>
				{#each supportLinks as link (link.href)}
					<li><a href={i18n.href(resolve(link.href))}>{i18n.text(link.label)}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">{i18n.t('copy.18a85f67cf6a')}</p>
			<p>{daynightSite.phoneLabel}</p>
			{#if daynightSite.email}<p>{daynightSite.email}</p>{/if}
			<p>{i18n.dealer('address')}</p>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {daynightSite.shortName}{i18n.t('copy.cef751176d99')}</span>
			<div>
				<a href={i18n.href(resolve('/terms'))}>{i18n.t('copy.908b6d3a8368')}</a>
				<a href={i18n.href(resolve('/contact'))}>{i18n.t('copy.73323852dfb2')}</a>
				<a href={i18n.href(resolve('/contact'))}>{i18n.t('copy.18a85f67cf6a')}</a>
			</div>
		</div>
	</div>
</footer>
