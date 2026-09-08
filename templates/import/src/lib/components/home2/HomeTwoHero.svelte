<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeroData } from '$lib/auxero/home-five';
	import { Search } from '@lucide/svelte';

	let {
		hero
	}: {
		hero?: HomeFiveHeroData;
	} = $props();

	const serviceTabs = [
		{ href: '/inventory', label: 'Намери автомобил' },
		{ href: '/sell-your-car', label: 'Продай автомобил' },
		{ href: '/import', label: 'Подбрани автомобили' }
	] as const;
</script>

{#if hero}
	<section class="home2-hero" aria-labelledby="home2-title">
		<img
			class="home2-hero__scene"
			src="/assets/daynight/hero/home-hero-available-inventory-two-car-v13.webp"
			alt=""
			loading="eager"
			aria-hidden="true"
		/>

		<h1 id="home2-title">Сменяш автомобила? Day Night Auto помага</h1>

		<form
			class="home2-search"
			action={resolve('/inventory')}
			method="get"
			data-daynight-search-form="inventory"
			aria-label="Търсене на автомобил"
		>
			<div class="home2-search__tabs" aria-label="Основни действия">
				{#each serviceTabs as tab (tab.href)}
					<a
						href={resolve(tab.href as '/inventory')}
						class={tab.href === '/inventory' ? 'active' : undefined}
					>
						{tab.label}
					</a>
				{/each}
			</div>

			<label class="home2-search__input">
				<span class="home2-search__label">Търси в наличните автомобили</span>
				<input
					name="q"
					type="search"
					placeholder="Търси по марка, модел или тип"
					autocomplete="off"
				/>
				<button
					type="submit"
					aria-label={`${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`}
				>
					<Search size={26} strokeWidth={2.6} />
				</button>
			</label>

			<p>
				или остави ни да помогнем
				<a href={resolve('/inventory')}
					>{hero.searchSubmitPrefix.toLowerCase()} {hero.totalMatches} {hero.searchSubmitSuffix}</a
				>
			</p>
		</form>
	</section>
{/if}

<style>
	.home2-hero {
		background: #080a09;
		isolation: isolate;
		min-height: 386px;
		overflow: hidden;
		position: relative;
	}

	.home2-hero::after {
		background:
			linear-gradient(180deg, rgb(4 6 7 / 0.58), rgb(4 6 7 / 0.18) 44%, rgb(4 6 7 / 0.58)),
			radial-gradient(circle at 50% 34%, rgb(227 6 47 / 0.2), transparent 35%);
		content: '';
		inset: 0;
		pointer-events: none;
		position: absolute;
		z-index: -1;
	}

	.home2-hero__scene {
		height: auto;
		inset: 0;
		min-height: 100%;
		object-fit: cover;
		object-position: center center;
		position: absolute;
		width: 100%;
		z-index: -2;
	}

	.home2-hero h1 {
		color: #ffffff;
		font-family: 'Arial Black', Impact, Inter, ui-sans-serif, system-ui, sans-serif;
		font-size: clamp(36px, 3.1vw, 48px);
		font-weight: 1000;
		left: 50%;
		letter-spacing: 0;
		line-height: 0.98;
		margin: 0;
		position: absolute;
		text-align: center;
		text-shadow: 0 14px 34px rgb(0 0 0 / 0.45);
		text-transform: uppercase;
		text-wrap: balance;
		top: 100px;
		transform: translateX(-50%);
		width: min(1280px, calc(100% - 56px));
		z-index: 1;
	}

	.home2-search {
		background: #17191d;
		border-radius: 8px;
		bottom: 0;
		box-shadow: 0 16px 36px rgb(12 12 12 / 0.18);
		color: #ffffff;
		left: 50%;
		overflow: hidden;
		position: absolute;
		transform: translateX(-50%);
		width: min(690px, calc(100% - 36px));
		z-index: 3;
	}

	.home2-search__tabs {
		align-items: center;
		border-bottom: 1px solid rgb(255 255 255 / 0.12);
		display: flex;
		gap: 20px;
		height: 56px;
		justify-content: center;
	}

	.home2-search__tabs a {
		align-items: center;
		color: #ffffff;
		display: flex;
		font-size: 18px;
		font-weight: 950;
		justify-content: center;
		line-height: 1;
		min-height: 56px;
		position: relative;
		text-align: center;
	}

	.home2-search__tabs a.active,
	.home2-search__tabs a:hover {
		background: transparent;
		color: #ffffff;
	}

	.home2-search__tabs a::after {
		background: transparent;
		bottom: 0;
		content: '';
		height: 2px;
		left: 50%;
		position: absolute;
		transform: translateX(-50%);
		transition: width 160ms ease;
		width: 0;
	}

	.home2-search__tabs a.active::after,
	.home2-search__tabs a:hover::after {
		background: #ffffff;
		width: 92px;
	}

	.home2-search__input {
		align-items: center;
		background: #ffffff;
		border-radius: 999px;
		display: flex;
		height: 53px;
		margin: 13px auto;
		overflow: hidden;
		position: relative;
		width: min(520px, 100%);
	}

	.home2-search__label {
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

	.home2-search__input input {
		border: 0;
		color: #121214;
		flex: 1 1 auto;
		font-size: 19px;
		font-weight: 650;
		height: 54px;
		min-width: 0;
		outline: 0;
		padding: 0 20px;
	}

	.home2-search__input input::placeholder {
		color: #8a888d;
	}

	.home2-search__input button {
		align-items: center;
		background: #E3062F;
		border: 0;
		border-radius: 50%;
		color: #101514;
		cursor: pointer;
		display: flex;
		flex: 0 0 auto;
		height: 52px;
		justify-content: center;
		margin-right: 1px;
		width: 52px;
	}

	.home2-search p {
		align-items: center;
		color: #ffffff;
		display: flex;
		font-size: 14px;
		font-weight: 800;
		gap: 8px;
		justify-content: center;
		line-height: 1;
		margin: 4px 0 15px;
	}

	.home2-search p a {
		align-items: center;
		border: 1px solid #ffffff;
		border-radius: 5px;
		color: #ffffff;
		display: inline-flex;
		font-weight: 950;
		min-height: 36px;
		padding: 0 13px;
	}

	.home2-search p a:hover {
		background: #ffffff;
		color: #121214;
	}

	@media (max-width: 1199px) {
		.home2-hero h1 {
			font-size: 38px;
		}
	}

	@media (max-width: 760px) {
		.home2-hero {
			min-height: 536px;
		}

		.home2-hero h1 {
			font-size: 39px;
			top: 96px;
		}

		.home2-search {
			bottom: 24px;
		}

		.home2-search__tabs {
			flex-wrap: wrap;
			gap: 10px;
		}

		.home2-search__tabs a {
			font-size: 15px;
		}

		.home2-search__input {
			width: calc(100% - 28px);
		}
	}
</style>
