<script lang="ts">
	import { resolve } from '$app/paths';
	import { footerNavItems, daynightSite } from '$lib/data/daynight-site';

	const buyingLinks = footerNavItems.slice(0, 4);
	const supportLinks = footerNavItems.slice(4, 8);
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={daynightSite.logoLight} alt={daynightSite.name} />
			<p>
				Публикувани автомобили в Варна със съдействие за оглед, документи, регистрация, финансиране
				и бартер.
			</p>
		</div>
		<div>
			<p class="footer-title">Автомобили</p>
			<ul>
				{#each buyingLinks as link (link.href)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Поддръжка</p>
			<ul>
				{#each supportLinks as link (link.href)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Контакти</p>
			<p>{daynightSite.phoneLabel}</p>
			{#if daynightSite.email}<p>{daynightSite.email}</p>{/if}
			<p>{daynightSite.location}</p>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {daynightSite.shortName}. Всички права запазени.</span>
			<div>
				<a href={resolve('/terms')}>Условия</a>
				<a href={resolve('/contact')}>Поверителност</a>
				<a href={resolve('/contact')}>Контакти</a>
			</div>
		</div>
	</div>
</footer>
