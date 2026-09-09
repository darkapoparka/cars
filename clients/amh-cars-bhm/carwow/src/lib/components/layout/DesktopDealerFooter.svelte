<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRight, Mail, MapPin, Phone } from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import { youtubeChannelUrl } from '$lib/data/daynight-videos';
	import { daynightFooterBottomLinks } from './daynight-footer-data';
	const mapLink = { href: daynightSite.mapUrl, target: '_blank', rel: 'noopener noreferrer' } as const;
	const youtubeLink = { href: youtubeChannelUrl, target: '_blank', rel: 'noopener noreferrer' } as const;

	const groups = [
		{ title: 'Бързи връзки', links: [
			{ href: '/about', label: 'За нас' },
			{ href: '/team', label: 'Нашият екип' },
			{ href: '/services', label: 'Услуги' },
			{ href: '/faq', label: 'Често задавани въпроси' },
			{ href: '/blog', label: 'Блог' },
			{ href: '/contact', label: 'Контакти' }
		] },
		{ title: 'Покупка и продажба', links: [
			{ href: '/inventory', label: 'Намери автомобил' },
			{ href: '/sell-your-car', label: 'Продай или замени' },
			{ href: '/financing', label: 'Лизинг и финансиране' },
			{ href: '/inventory/map', label: 'Карта на автомобилите' },
			{ href: '/calculator', label: 'Калкулатор за финансиране' },
			{ href: '/reviews', label: 'Отзиви от клиенти' }
		] }
	] as const;
</script>

<footer class="dealer-footer" data-desktop-dealer-footer>
	<div class="dealer-footer__container">
		<div class="dealer-footer__grid">
			<div class="dealer-footer__brand">
				<a href={resolve('/')} aria-label="Day Night Auto — начална страница">
					<img src={daynightSite.logoLight} width="220" height="68" alt="Day Night Auto Group" loading="lazy" />
				</a>
				<div class="dealer-footer__hours">
					<p>Работно време:</p>
					<span>{daynightSite.hoursLabel}</span>
				</div>
			</div>
			{#each groups as group (group.title)}
				<nav aria-label={group.title}>
					<h2>{group.title}</h2>
					<ul>
						{#each group.links as link (link.href)}
							<li><a href={resolve(link.href)}>{link.label}</a></li>
						{/each}
					</ul>
				</nav>
			{/each}
			<div class="dealer-footer__contact">
				<a class="dealer-footer__contact-row" href={`tel:${daynightSite.phone}`}>
					<Phone size={19} /><strong>{daynightSite.phoneLabel}</strong><ArrowUpRight size={15} />
				</a>
				<a class="dealer-footer__contact-row" href={resolve('/contact')}>
					<Mail size={19} /><span>Онлайн запитване</span><ArrowUpRight size={15} />
				</a>
				<a class="dealer-footer__contact-row" {...mapLink}>
					<MapPin size={19} /><span>{daynightSite.location}</span><ArrowUpRight size={15} />
				</a>
				<div class="dealer-footer__socials" aria-label="Социални мрежи">
					<a href="https://www.facebook.com/61566304063141/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/input-facebook.svg" width="21" height="21" alt="" /></a>
					<a {...youtubeLink} aria-label="YouTube"><img src="/assets/icons/youtube-footer.svg" width="21" height="21" alt="" /></a>
					<a href="https://www.instagram.com/daynight.auto.plovdiv/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><img src="/assets/icons/input-instagram.svg" width="21" height="21" alt="" /></a>
				</div>
			</div>
		</div>
		<div class="dealer-footer__bottom">
			<p>©2026 Day Night Auto Group. Всички права запазени.</p>
			<nav aria-label="Правна информация">
				{#each daynightFooterBottomLinks as link (link.label)}
					<a href={resolve(link.href)}>{link.label}</a>
				{/each}
			</nav>
		</div>
	</div>
</footer>

<style>
	.dealer-footer { background: #1c1c1c; border-radius: 32px 32px 0 0; color: #fff; font-family: var(--sa-font-sans, inherit); }
	.dealer-footer__container { box-sizing: border-box; max-width: 1384px; margin: 0 auto; padding: 40px 32px 24px; }
	.dealer-footer__grid { display: grid; grid-template-columns: 1.15fr .9fr 1.05fr 1.1fr; align-items: start; gap: 40px; }
	.dealer-footer a { color: #c5c7cb; text-decoration: none; }
	.dealer-footer :global(span), .dealer-footer :global(svg), .dealer-footer :global(svg *) { color: inherit !important; }
	.dealer-footer :global(span), .dealer-footer :global(strong) { font-size: inherit !important; line-height: inherit; }
	.dealer-footer .dealer-footer__hours { color: #fff; }
	.dealer-footer .dealer-footer__hours span { font-size: 14px; }
	.dealer-footer .dealer-footer__contact-row { color: #c5c7cb; font-size: 14px; }
	.dealer-footer .dealer-footer__bottom p { color: #b8bbc0; font-size: 12px; }
	.dealer-footer .dealer-footer__bottom a { font-size: 12px; }
	.dealer-footer a:hover { color: #fff; }
	.dealer-footer a:focus-visible { outline: 2px solid #f5c64e; outline-offset: 5px; border-radius: 4px; }
	.dealer-footer__brand img { display: block; width: 220px; height: 68px; object-fit: contain; }
	.dealer-footer__hours { margin-top: 28px; font-size: 14px; line-height: 1.8; }
	.dealer-footer__hours p { color: #b8bbc0; margin: 0 0 8px; }
	.dealer-footer__hours span { display: block; }
	.dealer-footer h2 { margin: 4px 0 20px; font-size: 13px; line-height: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0; color: #fff; }
	.dealer-footer ul { list-style: none; margin: 0; padding: 0; }
	.dealer-footer li a { display: flex; align-items: center; min-height: 40px; font-size: 14px; line-height: 1.5; }
	.dealer-footer li a:hover { text-decoration: underline; text-underline-offset: 4px; }
	.dealer-footer__contact { background: #242426; border: 1px solid #3a3a3d; border-radius: 18px; padding: 16px; }
	.dealer-footer__contact-row { display: grid; grid-template-columns: 19px minmax(0, 1fr) 15px; gap: 10px; align-items: center; min-height: 48px; font-size: 14px; line-height: 1.65; }
	.dealer-footer__contact-row strong { color: #fff; font-weight: 700; }
	.dealer-footer__socials { display: flex; gap: 8px; border-top: 1px solid #3a3a3d; margin-top: 14px; padding-top: 12px; }
	.dealer-footer__socials a { display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid #48484b; border-radius: 9px; }
	.dealer-footer__socials a:hover { background: #343436; border-color: #777; }
	.dealer-footer__socials :global(img) { filter: grayscale(1) brightness(0) invert(1); }
	.dealer-footer__bottom { display: flex; align-items: center; justify-content: space-between; gap: 24px; border-top: 1px solid #3a3a3d; margin-top: 36px; padding-top: 22px; font-size: 12px; line-height: 1.6; color: #b8bbc0; }
	.dealer-footer__bottom p { margin: 0; }
	.dealer-footer__bottom nav { display: flex; gap: 24px; }
	.dealer-footer__bottom a { display: inline-flex; min-height: 32px; align-items: center; }
	@media (min-width: 992px) and (max-width: 1599px) {
		.dealer-footer__bottom { padding-right: 64px; }
	}
	@media (min-width: 992px) and (max-width: 1199px) {
		.dealer-footer__grid { gap: 24px; grid-template-columns: 1fr .85fr 1fr 1.15fr; }
		.dealer-footer__brand img { width: 185px; height: 60px; }
		.dealer-footer__contact { padding: 12px; }
	}
	@media (max-width: 991px) { .dealer-footer { display: none; } }
</style>

