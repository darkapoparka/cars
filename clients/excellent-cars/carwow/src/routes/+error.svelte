<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { CarFront, House } from '@lucide/svelte';

	const isVehicleMissing = $derived(page.error?.message === 'Vehicle not found');
	const heading = $derived.by(() => {
		if (isVehicleMissing) return 'Този автомобил вече не е наличен';
		if (page.status === 404) return 'Страницата не е намерена';
		return 'Нещо се обърка';
	});
	const detail = $derived.by(() => {
		if (isVehicleMissing) return 'Обявата е свалена или продадена. Разгледай наличните автомобили.';
		if (page.status === 404) return 'Адресът е грешен или страницата е преместена.';
		return 'Опитай отново или се върни към началната страница.';
	});
</script>

<svelte:head>
	<title>{page.status} · Excellent Cars</title>
</svelte:head>

<main id="main-content" class="daynight-error" aria-labelledby="daynight-error-title">
	<div class="daynight-error__card">
		<a class="daynight-error__brand" href={resolve('/')}>
			<img src={resolve('/assets/excellent/logo-header.png')} alt="Excellent Cars" />
		</a>
		<span class="daynight-error__code">{page.status}</span>
		<h1 id="daynight-error-title">{heading}</h1>
		<p>{detail}</p>
		<div class="daynight-error__actions">
			<a class="daynight-error__action daynight-error__action--primary" href={resolve('/inventory')}>
				<CarFront size={18} strokeWidth={2.3} aria-hidden="true" />
				<span>Виж автомобилите</span>
			</a>
			<a class="daynight-error__action" href={resolve('/')}>
				<House size={18} strokeWidth={2.3} aria-hidden="true" />
				<span>Начало</span>
			</a>
		</div>
	</div>
</main>

<style>
	.daynight-error {
		display: grid;
		min-height: 100svh;
		place-items: center;
		background: #fff;
		padding: 48px 18px;
		font-family: var(--sa-font, 'Manrope', sans-serif);
	}

	.daynight-error__brand {
		display: block;
		margin-bottom: 18px;
	}

	.daynight-error__brand img {
		display: block;
		width: auto;
		height: 40px;
	}

	.daynight-error__card {
		display: grid;
		max-width: 430px;
		justify-items: center;
		gap: 10px;
		text-align: center;
	}

	.daynight-error__code {
		color: #B00000;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 2px;
	}

	.daynight-error h1 {
		margin: 0;
		color: #111827;
		font-size: 1.4rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.daynight-error p {
		margin: 0;
		color: #526071;
		font-size: 0.94rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.daynight-error__actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-top: 10px;
	}

	.daynight-error__action {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		gap: 8px;
		border-radius: 11px;
		background: #eef1f6;
		padding: 0 18px;
		color: #111827;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
	}

	.daynight-error__action :global(svg) {
		flex: 0 0 auto;
		fill: none !important;
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.daynight-error__action--primary {
		background: #B00000;
		color: #fff !important;
	}
</style>
