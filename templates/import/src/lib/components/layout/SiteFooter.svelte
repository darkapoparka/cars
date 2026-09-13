<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightAssets, daynightBrand, daynightContact } from '$lib/data/daynight';

	const buyingLinks = [
		{ href: '/inventory', label: 'Намери автомобил' },
		{ href: '/inventory?view=map', label: 'Карта на наличните' },
		{ href: '/compare', label: 'Сравни автомобили' },
		{ href: '/calculator', label: 'Калкулатор за внос' }
	] as const;
	const supportLinks = [
		{ href: '/services', label: 'Услуги' },
		{ href: '/sell-your-car', label: 'Продай автомобил' },
		{ href: '/agents', label: 'Консултанти' },
		{ href: '/contact', label: 'Контакт с Day Night Auto' }
	] as const;
</script>

<footer class="site-footer">
	<div class="site-footer__top container">
		<div class="site-footer__brand">
			<img src={daynightAssets.logoDark} alt="Day Night Auto" />
			<p>
				{daynightBrand.tagline}. Проверка на източник, съдействие при внос, продажба на автомобили и
				огледи с уговорка.
			</p>
		</div>
		<div>
			<p class="footer-title">Покупка с Day Night Auto</p>
			<ul>
				{#each buyingLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Съдействие</p>
			<ul>
				{#each supportLinks as link (link)}
					<li><a href={resolve(link.href)}>{link.label}</a></li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="footer-title">Day Night Auto онлайн</p>
			<div class="app-buttons">
				<a href={resolve('/contact')}>{daynightContact.primaryPhoneLabel}</a>
				<a href={resolve('/contact')}>Viber</a>
			</div>
		</div>
	</div>
	<div class="site-footer__bottom">
		<div class="container">
			<span>©2026 {daynightBrand.name}. Всички права запазени.</span>
			<div>
				<a href={resolve('/terms')}>Общи условия</a>
				<a href={resolve('/privacy')}>Поверителност</a>
				<a href={resolve('/cookies')}>Бисквитки</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: #030403;
		color: #ffffff;
		font-family: var(--bc-font-body);
		letter-spacing: 0;
	}

	.site-footer * {
		box-sizing: border-box;
	}

	.site-footer a {
		text-decoration: none;
	}

	.site-footer__top,
	.site-footer__bottom .container {
		width: min(calc(100% - 40px), 1840px);
		margin-inline: auto;
	}

	.site-footer__top {
		display: grid;
		grid-template-columns: 1.7fr 1fr 1fr 1fr;
		gap: 38px;
		padding: 72px 0;
	}

	.site-footer__brand img {
		display: block;
		width: 180px;
		max-width: 100%;
		height: auto;
		margin-bottom: 18px;
	}

	.site-footer p,
	.site-footer a,
	.site-footer span,
	.site-footer li {
		color: rgb(255 255 255 / 0.68);
	}

	.site-footer p {
		margin-top: 0;
		line-height: 1.65;
	}

	.footer-title {
		margin: 0 0 18px;
		color: #ffffff !important;
		font-weight: 800;
	}

	.site-footer ul {
		display: grid;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.app-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.app-buttons a {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		border-radius: 8px;
		background: rgb(255 255 255 / 0.1);
		padding: 0 16px;
		font-weight: 800;
	}

	.site-footer__bottom {
		border-top: 1px solid rgb(255 255 255 / 0.12);
		padding: 20px 0;
	}

	.site-footer__bottom .container {
		display: flex;
		justify-content: space-between;
		gap: 18px;
	}

	.site-footer__bottom div div {
		display: flex;
		gap: 20px;
	}

	@media (max-width: 1180px) {
		.site-footer__top {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.site-footer__top {
			grid-template-columns: 1fr;
			padding: 52px 0;
		}

		.site-footer__bottom .container {
			flex-direction: column;
		}
	}
</style>
