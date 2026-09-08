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
			kicker: 'Helpful',
			title: 'Basic request',
			price: 'No fee',
			features: [
				'Vehicle details',
				'Submit dealership inquiries',
				'Access 5 Car Brochure',
				'Contact an advisor',
				'Inquiry tracking',
				'Request additional photos',
				'Listings Active for 7 Days',
				'Response from the Texas Drive Auto team'
			]
		},
		{
			id: 'inspection',
			kicker: 'Helpful',
			title: 'Viewing',
			price: 'On request',
			features: [
				'Photos and description',
				'Submit dealership inquiries',
				'Access 5 Car Brochure',
				'Contact an advisor',
				'Inquiry tracking',
				'Request additional photos',
				'Expiry 1 month',
				'Contact the team'
			]
		},
		{
			id: 'full-support',
			kicker: 'Helpful',
			title: 'Ask about available assistance',
			price: 'On request',
			active: true,
			features: [
				'Team assessment',
				'Submit 50 dealership inquiries',
				'Access 5 Car Specification',
				'Contact an advisor',
				'Inquiry tracking',
				'Additional details as needed',
				'Listings Active for 2 Months',
				'Response from the Texas Drive Auto team'
			]
		},
		{
			id: 'custom-service',
			kicker: 'Helpful',
			title: 'Individual service',
			price: 'On request',
			features: [
				'Personal assistance',
				'Submit 150 dealership inquiries',
				'Access 5 Vehicle Detail',
				'Contact an advisor',
				'Inquiry tracking',
				'Additional details as needed',
				'Listings Active for 2 Months',
				'Response from the Texas Drive Auto team'
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
			Submit request
		</a>
	</div>
{/snippet}

<div class="dashboard-content--inner flat-tabs" data-custom="true">
	<div class="title-section mb-30 gap-12">
		<p class="h3">New sale request</p>
		<a
			href={resolve('/sell-your-car/request')}
			class="btn btn-line btn-large font-weight-600 px-24"
		>
			Send to Texas Drive Auto
		</a>
	</div>

	<div class="dashboard-box style-3 mb-30 bg-white">
		<p class="h4 mb-20">Vehicle details</p>
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
				<p class="h4 mb-20 text-center">Request to Texas Drive Auto</p>

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
