<script lang="ts">
	import { PhoneCall, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	let { open = $bindable(false) }: { open?: boolean } = $props();
	const importRequestPath = '/contact' as const;
	type ImportLeadHref = typeof importRequestPath | `${typeof importRequestPath}?${string}`;
	const phoneHref = daynightSite.phoneHref;
	function closeSearch() {
		open = false;
	}
	let importQuery = $state('');
	let importMake = $state('');
	let importModel = $state('');
	let importYear = $state('');
	let importBudget = $state('');
	let importSourceUrl = $state('');
	let importPhone = $state('');

	const importLeadHref = $derived.by((): ImportLeadHref => {
		const params = new SvelteURLSearchParams();
		params.set('intent', 'import');
		if (importQuery.trim()) params.set('q', importQuery.trim());
		if (importMake.trim()) params.set('make', importMake.trim());
		if (importModel.trim()) params.set('model', importModel.trim());
		if (importYear.trim()) params.set('year', importYear.trim());
		if (importBudget.trim()) params.set('budget', importBudget.trim());
		if (importSourceUrl.trim()) params.set('sourceUrl', importSourceUrl.trim());
		if (importPhone.trim()) params.set('phone', importPhone.trim());
		const qs = params.toString();
		return `${importRequestPath}?${qs}`;
	});
</script>

<MobileFullSheet bind:open labelledBy="mh-import-title">
	<div class="mh-search-sheet mh-search-sheet--sell mh-sheet-scope">
		<header>
			<div>
				<span>Внос по поръчка</span>
				<strong id="mh-import-title">Внос на автомобил</strong>
			</div>
			<button type="button" aria-label="Затвори" onclick={closeSearch}>
				<X size={19} strokeWidth={2.5} />
			</button>
		</header>

		<div class="mh-search-sheet__body">
			<div class="mh-sell-grid">
				<label class="mh-sell-field mh-sell-field--wide">
					<span>Какво търсите</span>
					<input
						type="text"
						bind:value={importQuery}
						placeholder="BMW X5, дизел, до 2020..."
						autocomplete="off"
						aria-label="Търсен автомобил за внос"
					/>
				</label>
				<label class="mh-sell-field">
					<span>Марка</span>
					<input type="text" bind:value={importMake} placeholder="BMW" autocomplete="off" />
				</label>
				<label class="mh-sell-field">
					<span>Модел</span>
					<input type="text" bind:value={importModel} placeholder="X5" autocomplete="off" />
				</label>
				<label class="mh-sell-field">
					<span>Година от</span>
					<input
						type="text"
						inputmode="numeric"
						bind:value={importYear}
						placeholder="2019"
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field">
					<span>Бюджет</span>
					<input
						type="text"
						inputmode="numeric"
						bind:value={importBudget}
						placeholder="30 000 EUR"
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field mh-sell-field--wide">
					<span>Телефон</span>
					<input
						type="tel"
						bind:value={importPhone}
						placeholder={daynightSite.phoneLabel}
						autocomplete="tel"
					/>
				</label>
				<label class="mh-sell-field mh-sell-field--wide">
					<span>Линк към обява</span>
					<input
						type="text"
						inputmode="url"
						bind:value={importSourceUrl}
						placeholder="mobile.de, autoscout24..."
						autocomplete="url"
					/>
				</label>
			</div>

			<p class="mh-import-note">
				Оставете насока за марка, модел и бюджет. Екипът ще Ви изпрати варианти за внос и следващи
				стъпки.
			</p>
		</div>

		<a class="mh-search-sheet__go" href={resolve(importLeadHref)}>Изпрати заявка →</a>
		<a class="mh-search-sheet__ghost" href={phoneHref}>
			<PhoneCall size={17} strokeWidth={2.45} aria-hidden="true" />
			<span>Обади се</span>
		</a>
	</div>
</MobileFullSheet>
