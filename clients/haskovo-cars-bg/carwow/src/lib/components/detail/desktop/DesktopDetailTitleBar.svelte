<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();
	const garage = getGarageContext();
	const isSaved = $derived(garage.isFavorite(vehicle.slug));
	const isCompared = $derived(garage.isCompared(vehicle.slug));
	let shareState = $state('');

	async function shareVehicle() {
		const url = globalThis.location?.href ?? resolve(`/inventory/${vehicle.slug}`);
		const title = `${vehicle.shortTitle} - ${vehicle.priceEur}`;

		try {
			if (navigator.share) {
				await navigator.share({ title, text: vehicle.conditionLine, url });
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(url);
				shareState = 'Копирано';
				window.setTimeout(() => (shareState = ''), 1600);
			}
		} catch {
			shareState = '';
		}
	}
</script>

{#snippet leftArrow()}
	<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
		<path
			d="M12.5 4.375L6.875 10L12.5 15.625"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M6.875 10H13.125"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M10 6.875V13.125"
			stroke="#1C1C1C"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet reserveIcon()}
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.4678 5.375C21.0008 5.37677 22.4707 5.98632 23.5547 7.07031C24.6387 8.15431 25.2482 9.62423 25.25 11.1572C25.2495 14.517 22.7235 17.7209 19.8545 20.2334C17.1857 22.5706 14.4559 24.1025 14 24.3506C13.5441 24.1025 10.8143 22.5706 8.14551 20.2334C5.27653 17.7209 2.75049 14.517 2.75 11.1572C2.75177 9.62423 3.36132 8.15431 4.44531 7.07031C5.52908 5.98655 6.99861 5.37703 8.53125 5.375C10.4976 5.375 12.1694 6.21605 13.2002 7.58887L14 8.65332L14.7998 7.58887C15.8304 6.21627 17.5018 5.37528 19.4678 5.375Z"
			stroke="#1C1C1C"
			stroke-width="2"
		/>
	</svg>
{/snippet}

{#snippet shareIcon()}
	<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.2537 17.5C18.67 17.4998 18.0922 17.6168 17.5545 17.8439C17.0168 18.0711 16.5302 18.4038 16.1234 18.8224L11.0812 15.5816C11.4778 14.5645 11.4778 13.4355 11.0812 12.4185L16.1234 9.17768C16.8807 9.9535 17.8992 10.4205 18.9813 10.488C20.0634 10.5556 21.132 10.219 21.98 9.54337C22.828 8.8678 23.395 7.90141 23.5709 6.83157C23.7469 5.76174 23.5194 4.66468 22.9324 3.75309C22.3455 2.84149 21.4409 2.18031 20.3942 1.89773C19.3475 1.61516 18.2331 1.73131 17.2671 2.22368C16.3012 2.71605 15.5525 3.54955 15.1661 4.56259C14.7798 5.57563 14.7834 6.69604 15.1762 7.70659L10.134 10.9474C9.52682 10.324 8.74754 9.89589 7.89578 9.71771C7.04403 9.53954 6.15849 9.61942 5.35236 9.94713C4.54624 10.2749 3.85616 10.8355 3.37033 11.5575C2.8845 12.2794 2.625 13.1298 2.625 14C2.625 14.8702 2.8845 15.7206 3.37033 16.4426C3.85616 17.1645 4.54624 17.7252 5.35236 18.0529C6.15849 18.3806 7.04403 18.4605 7.89578 18.2823C8.74754 18.1042 9.52682 17.676 10.134 17.0527L15.1762 20.2935C14.8384 21.1647 14.7884 22.1211 15.0335 23.0228C15.2787 23.9245 15.8061 24.724 16.5384 25.3042C17.2708 25.8845 18.1698 26.215 19.1036 26.2474C20.0374 26.2798 20.9571 26.0124 21.728 25.4843C22.4988 24.9562 23.0803 24.1952 23.3874 23.3127C23.6944 22.4301 23.7108 21.4725 23.4342 20.58C23.1577 19.6875 22.6026 18.907 21.8503 18.3527C21.098 17.7985 20.1881 17.4997 19.2537 17.5ZM19.2537 3.50002C19.7729 3.50002 20.2804 3.65398 20.712 3.94242C21.1437 4.23086 21.4802 4.64082 21.6789 5.12048C21.8775 5.60014 21.9295 6.12794 21.8282 6.63714C21.727 7.14634 21.4769 7.61407 21.1098 7.98118C20.7427 8.34829 20.275 8.5983 19.7658 8.69959C19.2566 8.80087 18.7288 8.74889 18.2491 8.55021C17.7695 8.35153 17.3595 8.01508 17.0711 7.5834C16.7826 7.15172 16.6287 6.6442 16.6287 6.12503C16.6287 5.42883 16.9052 4.76115 17.3975 4.26887C17.8898 3.77659 18.5575 3.50002 19.2537 3.50002ZM7.00368 16.625C6.4845 16.625 5.97699 16.4711 5.54531 16.1826C5.11363 15.8942 4.77718 15.4842 4.5785 15.0046C4.37982 14.5249 4.32783 13.9971 4.42912 13.4879C4.53041 12.9787 4.78041 12.511 5.14753 12.1439C5.51464 11.7768 5.98237 11.5268 6.49157 11.4255C7.00077 11.3242 7.52857 11.3762 8.00822 11.5748C8.48788 11.7735 8.89785 12.11 9.18629 12.5417C9.47473 12.9733 9.62868 13.4809 9.62868 14C9.62868 14.6962 9.35212 15.3639 8.85984 15.8562C8.36755 16.3485 7.69987 16.625 7.00368 16.625ZM19.2537 24.5C18.7345 24.5 18.227 24.3461 17.7953 24.0576C17.3636 23.7692 17.0272 23.3592 16.8285 22.8796C16.6298 22.3999 16.5778 21.8721 16.6791 21.3629C16.7804 20.8537 17.0304 20.386 17.3975 20.0189C17.7646 19.6518 18.2324 19.4018 18.7416 19.3005C19.2508 19.1992 19.7786 19.2512 20.2582 19.4498C20.7379 19.6485 21.1478 19.985 21.4363 20.4167C21.7247 20.8483 21.8787 21.3559 21.8787 21.875C21.8787 22.5712 21.6021 23.2389 21.1098 23.7312C20.6176 24.2235 19.9499 24.5 19.2537 24.5Z"
			fill="#1C1C1C"
		/>
	</svg>
{/snippet}

<div class="title-section pdp-title-card__main">
	<a href={resolve('/inventory')} class="pdp-nav-button pdp-nav-button--back">
		{@render leftArrow()}
		<span>Назад</span>
	</a>
	<h1 class="daynight-pdp-title">{vehicle.shortTitle} {vehicle.year}</h1>
	<div class="pdp-title-actions flex items-center justify-end gap-12">
		<a
			href={resolve('/compare')}
			class="btn-icon-circle hover-stroke-white"
			class:is-active={isCompared}
			title={isCompared ? 'Виж сравнение' : 'Добави и виж сравнение'}
			aria-label={isCompared ? 'Виж сравнение' : 'Добави и виж сравнение'}
			onclick={() => {
				if (!isCompared) garage.toggleCompare(vehicle.slug);
			}}
		>
			{@render compareIcon()}
		</a>

		<button
			type="button"
			class="btn-icon-circle hover-stroke-white"
			class:is-active={isSaved}
			title={isSaved ? 'Премахни от запазени' : 'Запази автомобила'}
			aria-label={isSaved ? 'Премахни от запазени' : 'Запази автомобила'}
			aria-pressed={isSaved}
			onclick={() => garage.toggleFavorite(vehicle.slug)}
		>
			{@render reserveIcon()}
		</button>

		<button
			type="button"
			class="btn-icon-circle hover-fill-white"
			title="Сподели автомобила"
			aria-label="Сподели автомобила"
			onclick={shareVehicle}
		>
			{@render shareIcon()}
		</button>
	</div>
	{#if shareState}
		<span class="pdp-share-status" role="status" aria-live="polite">{shareState}</span>
	{/if}
</div>

<style>
	.pdp-title-card__main {
		align-items: center;
		display: grid !important;
		gap: 16px;
		grid-template-columns: auto minmax(0, 1fr) auto;
		width: 100%;
	}

	.pdp-nav-button {
		align-items: center;
		background: #f3f5f8;
		border: 1px solid #e0e5ec;
		border-radius: 999px;
		box-shadow: 0 4px 12px rgba(16, 24, 40, 0.045);
		color: #242a33;
		display: inline-flex;
		font-size: 16px;
		font-weight: 600;
		gap: 6px;
		height: 40px;
		justify-content: center;
		letter-spacing: 0;
		line-height: 1;
		padding: 0 14px;
		text-decoration: none;
		transition:
			background 0.16s ease,
			border-color 0.16s ease,
			box-shadow 0.16s ease,
			color 0.16s ease;
	}

	.pdp-nav-button:hover {
		background: #e9edf3;
		border-color: #d4dbe5;
		box-shadow: 0 7px 18px rgba(16, 24, 40, 0.07);
		color: #111827;
	}

	.daynight-pdp-title {
		font-size: 40px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.24;
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
		white-space: normal;
	}

	.btn-icon-circle {
		box-sizing: border-box;
		padding: 0;
		color: #1c1c1c;
		cursor: pointer;
		appearance: none;
	}

	.btn-icon-circle.is-active {
		border-color: rgba(176, 0, 0, 0.24);
		background: #fff0f1;
		color: var(--sa-red);
	}

	.btn-icon-circle.is-active :global(svg path) {
		stroke: currentColor;
	}

	.btn-icon-circle.is-active :global(svg path:last-child) {
		fill: currentColor;
	}

	.pdp-nav-button--back {
		flex: 0 0 auto;
	}

	.pdp-title-actions {
		flex: 0 0 auto;
	}

	.pdp-share-status {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		border-radius: 999px;
		background: #1c1c1c;
		padding: 7px 10px;
		color: #fff;
		font-size: 12px;
		font-weight: 700;
		white-space: nowrap;
	}

	.title-section {
		position: relative;
	}
</style>
