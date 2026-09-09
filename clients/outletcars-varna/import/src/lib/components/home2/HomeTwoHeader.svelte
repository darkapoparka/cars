<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeaderData } from '$lib/auxero/home-five';
	import { CircleUserRound, Menu, PhoneCall } from '@lucide/svelte';

	let { header }: { header?: HomeFiveHeaderData } = $props();

	const home2Navigation = [
		{ href: '/inventory', label: 'Автомобили' },
		{ href: '/sell-your-car', label: 'Продай' },
		{ href: '/import', label: 'Внос' },
		{ href: '/services', label: 'Услуги' },
		{ href: '/reviews', label: 'Отзиви' },
		{ href: '/contact', label: 'Контакти' }
	] as const;

	const menuLinks = [
		{ href: '/calculator', label: 'Калкулатор' },
		{ href: '/agents', label: 'Консултанти' },
		{ href: '/blog', label: 'Съвети' },
		{ href: '/about', label: 'За OUTLETCARS.BG — Варна' }
	] as const;
</script>

{#if header}
	<header class="home2-header">
		<div class="home2-header__inner">
			<a class="home2-header__logo" href={resolve('/home2')} aria-label="OUTLETCARS.BG — Варна Home2">
				<img
					src="/dealer/logo-on-light-v2.svg"
					alt={header.logo.alt}
				/>
			</a>

			<nav class="home2-header__nav" aria-label="Основна навигация">
				{#each home2Navigation as item (item.href)}
					<a href={resolve(item.href as '/')}>{item.label}</a>
				{/each}
			</nav>

			<div class="home2-header__actions">
				<a
					class="home2-header__action"
					href={resolve('/contact')}
					aria-label={header.contact.phoneLabel}
					title={header.contact.phoneLabel}
				>
					<PhoneCall size={21} strokeWidth={2.6} aria-hidden="true" />
					<span>Телефон</span>
				</a>
				<a
					href={resolve('/account')}
					class="home2-header__action open-modal"
					data-modal-id="#LoginModal"
					aria-label={header.ui.signIn}
					title={header.ui.signIn}
				>
					<CircleUserRound size={21} strokeWidth={2.6} aria-hidden="true" />
					<span>Вход</span>
				</a>
				<details class="home2-header__menu">
					<summary aria-label="Още страници" title="Меню">
						<Menu size={25} strokeWidth={2.7} aria-hidden="true" />
						<span>Меню</span>
					</summary>
					<div class="home2-header__menu-panel">
						{#each menuLinks as item (item.href)}
							<a href={resolve(item.href as '/')}>{item.label}</a>
						{/each}
					</div>
				</details>
			</div>
		</div>
	</header>
{/if}

<style>
	.home2-header {
		color: #ffffff;
		left: 0;
		padding: 18px 24px 0;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 5;
	}

	.home2-header__inner {
		align-items: center;
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
		margin: 0 auto;
		max-width: 1320px;
		min-height: 52px;
	}

	.home2-header__logo {
		align-items: center;
		color: #ffffff;
		display: flex;
		min-height: 40px;
		width: fit-content;
	}

	.home2-header__logo img {
		display: block;
		height: auto;
		max-height: 40px;
		object-fit: contain;
		width: 188px;
	}

	.home2-header__nav {
		align-items: center;
		display: flex;
		gap: 34px;
		justify-content: center;
		min-width: 0;
		place-self: center;
	}

	.home2-header__nav a {
		color: #ffffff;
		font-size: 15px;
		font-weight: 800;
		line-height: 1;
		text-shadow: 0 3px 14px rgb(0 0 0 / 0.75);
		white-space: nowrap;
	}

	.home2-header__nav a:hover,
	.home2-header__nav a:focus-visible {
		color: #E3062F;
	}

	.home2-header__actions {
		align-items: center;
		display: flex;
		backdrop-filter: blur(14px);
		background: rgb(7 10 9 / 0.2);
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		gap: 3px;
		justify-content: flex-end;
		justify-self: end;
		padding: 4px;
	}

	.home2-header__action,
	.home2-header__menu summary {
		align-items: center;
		appearance: none;
		background: transparent;
		border: 0;
		border-radius: 999px;
		color: #ffffff;
		cursor: pointer;
		display: flex;
		flex: 0 0 auto;
		height: 42px;
		justify-content: center;
		line-height: 0;
		min-height: 42px;
		min-width: 42px;
		padding: 0;
		position: relative;
		text-shadow: none;
		width: 42px;
	}

	.home2-header__action span,
	.home2-header__menu summary span {
		border: 0;
		clip: rect(0, 0, 0, 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	.home2-header__action:hover,
	.home2-header__menu summary:hover,
	.home2-header__action:focus-visible,
	.home2-header__menu summary:focus-visible {
		background: var(--bc-hover-accent);
		color: var(--bc-hover-accent-ink);
		outline: 0;
	}

	.home2-header__action :global(svg),
	.home2-header__menu summary :global(svg) {
		color: #ffffff !important;
		stroke: #ffffff !important;
	}

	.home2-header__action :global(svg *),
	.home2-header__menu summary :global(svg *) {
		stroke: #ffffff !important;
	}

	.home2-header__action:hover span,
	.home2-header__menu summary:hover span {
		color: var(--bc-hover-accent-ink);
	}

	.home2-header__action:hover :global(svg),
	.home2-header__menu summary:hover :global(svg),
	.home2-header__action:hover :global(svg *),
	.home2-header__menu summary:hover :global(svg *) {
		color: var(--bc-hover-accent-ink) !important;
		stroke: var(--bc-hover-accent-ink) !important;
	}

	.home2-header__menu {
		position: relative;
	}

	.home2-header__menu summary {
		list-style: none;
	}

	.home2-header__menu summary::-webkit-details-marker {
		display: none;
	}

	.home2-header__menu-panel {
		background: rgb(17 19 15 / 0.96);
		border: 1px solid rgb(255 255 255 / 0.12);
		border-radius: 8px;
		box-shadow: 0 18px 36px rgb(0 0 0 / 0.22);
		display: grid;
		gap: 2px;
		min-width: 190px;
		padding: 8px;
		position: absolute;
		right: 0;
		top: calc(100% + 10px);
	}

	.home2-header__menu-panel a {
		border-radius: 6px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 10px 12px;
	}

	.home2-header__menu-panel a:hover {
		background: rgb(255 255 255 / 0.08);
		color: #E3062F;
	}

	@media (max-width: 1199px) {
		.home2-header__inner {
			grid-template-columns: minmax(160px, 1fr) auto;
		}

		.home2-header__nav {
			display: none;
		}
	}
</style>
