<script lang="ts">
	import { resolve } from '$app/paths';

	type PackageTab = {
		value: string;
		title: string;
		description: string;
	};

	type PackageCard = {
		id: string;
		kicker: string;
		title: string;
		price: string;
		features: string[];
		active?: boolean;
	};

	const tabs: PackageTab[] = [
		{
			value: '0',
			title: 'Basic plan package',
			description: '08/10 Active Listing Quota, Listing displayed for 15 days'
		},
		{
			value: '1',
			title: 'Standard plan package',
			description: '08/10 Active Listing Quota, Listing displayed for 15 days'
		}
	];

	const cards: PackageCard[] = [
		{
			id: 'basic-request',
			kicker: 'Полезно',
			title: 'Основна заявка',
			price: 'Без такса',
			features: [
				'Данни за автомобила',
				'Apply for заявки към автокъщата',
				'Access 5 Car Brochure',
				'Контакт с консултант',
				'Проследяване на запитване',
				'Допълнителни снимки при нужда',
				'Listings Active for 7 Days',
				'Отговор от екипа на Dealers Point'
			]
		},
		{
			id: 'inspection',
			kicker: 'Полезно',
			title: 'Оглед',
			price: 'По заявка',
			features: [
				'Снимки и описание',
				'Apply for заявки към автокъщата',
				'Access 5 Car Brochure',
				'Контакт с консултант',
				'Проследяване на запитване',
				'Допълнителни снимки при нужда',
				'Expiry 1 month',
				'Контакт с екипа'
			]
		},
		{
			id: 'full-support',
			kicker: 'Полезно',
			title: 'Пълно съдействие',
			price: 'По заявка',
			active: true,
			features: [
				'Оценка от екипа',
				'Apply for 50 заявки към автокъщата',
				'Access 5 Car Specification',
				'Контакт с консултант',
				'Проследяване на запитване',
				'Допълнителни уточнения при нужда',
				'Listings Active for 2 Months',
				'Отговор от екипа на Dealers Point'
			]
		},
		{
			id: 'custom-service',
			kicker: 'Полезно',
			title: 'Индивидуална услуга',
			price: 'По заявка',
			features: [
				'Индивидуално съдействие',
				'Apply for 150 заявки към автокъщата',
				'Access 5 Vehicle Detail',
				'Контакт с консултант',
				'Проследяване на запитване',
				'Допълнителни уточнения при нужда',
				'Listings Active for 2 Months',
				'Отговор от екипа на Dealers Point'
			]
		}
	];

	const contentPanels = ['basic', 'standard'] as const;
	let selectedPackage = $state('0');
</script>

{#snippet packageCard(card: PackageCard)}
	<div class={card.active ? 'package-box active' : 'package-box'}>
		<p class="tag">{card.kicker}</p>
		<p class="h7 text-secondary font-weight-500 mb-8">{card.title}</p>

		<h2 class="mb-20">{card.price}</h2>

		<ul class="list mb-20 flex flex-col gap-12">
			{#each card.features as feature (feature)}
				<li>
					<img
						src={resolve('/assets/icons/check-2.svg')}
						alt="check"
						data-daynight-img="1"
						decoding="async"
						loading="eager"
					/>
					{feature}
				</li>
			{/each}
		</ul>

		<a
			href={resolve('/sell-your-car/request')}
			class="btn btn-line-style-2 effect-line-primary btn-large font-weight-600"
		>
			Изпрати заявка
		</a>
	</div>
{/snippet}

<div class="dashboard-content--inner flat-tabs" data-custom="true">
	<div class="title-section mb-30 gap-12">
		<p class="h3">Нова заявка за продажбаs</p>
		<a
			href={resolve('/sell-your-car/request')}
			class="btn btn-line btn-large font-weight-600 px-24"
		>
			Изпрати към Dealers Point
		</a>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Данни за автомобила</p>
		<div class="menu-tab menu-tab-package flex flex-wrap items-center justify-between gap-30">
			{#each tabs as tab (tab.value)}
				<label
					class={selectedPackage === tab.value
						? 'filter-radio-style-3 item-menu active flex items-center'
						: 'filter-radio-style-3 item-menu flex items-center'}
				>
					<input
						type="radio"
						name="AddPackage"
						value={tab.value}
						checked={selectedPackage === tab.value}
						onchange={() => {
							selectedPackage = tab.value;
						}}
					/>
					<span class="label-focus flex w-full">
						<span class="h4 font-weight-600 mb-4 flex capitalize">{tab.title}</span>
						<span class="text-secondary">{tab.description}</span>
					</span>
				</label>
			{/each}
		</div>
	</div>

	<div class="content-tab">
		{#each contentPanels as panel, index (panel)}
			<div
				class={selectedPackage === String(index)
					? 'dashboard-box style-2 content-inner active bg-white'
					: 'dashboard-box style-2 content-inner bg-white'}
			>
				<p class="h4 mb-20 text-center">Заявка към Dealers Point</p>

				<div
					class="xl-grid-cols-2 sm-grid-cols-1 listing-grid2-columns md-grid-cols-1 grid grid-cols-4 gap-30"
				>
					{#each cards as card (card.id)}
						{@render packageCard(card)}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
