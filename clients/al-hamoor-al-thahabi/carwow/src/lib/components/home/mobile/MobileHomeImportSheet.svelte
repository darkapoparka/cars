<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
				<span>{i18n.t('copy.c03ea035b67c')}</span>
				<strong id="mh-import-title">{i18n.t('copy.3d1ecec672e9')}</strong>
			</div>
			<button type="button" aria-label={i18n.t('copy.1ef1a425356f')} onclick={closeSearch}>
				<X size={19} strokeWidth={2.5} />
			</button>
		</header>

		<div class="mh-search-sheet__body">
			<div class="mh-sell-grid">
				<label class="mh-sell-field mh-sell-field--wide">
					<span>{i18n.t('copy.9d6369bfff6b')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						bind:value={importQuery}
						placeholder={i18n.t('copy.80ba3c91385e')}
						autocomplete="off"
						aria-label={i18n.t('copy.3f19b19dc555')}
					/>
				</label>
				<label class="mh-sell-field">
					<span>{i18n.t('copy.b7fccee005ae')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						bind:value={importMake}
						placeholder={i18n.t('copy.c76b5628a9d1')}
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field">
					<span>{i18n.t('copy.37858c8efede')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						bind:value={importModel}
						placeholder={i18n.t('copy.06b4fefb71dd')}
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field">
					<span>{i18n.t('copy.5adb14a9dc09')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						inputmode="numeric"
						bind:value={importYear}
						placeholder="2019"
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field">
					<span>{i18n.t('copy.84e960d40ad5')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						inputmode="numeric"
						bind:value={importBudget}
						placeholder={i18n.t('copy.41da32a56c4f')}
						autocomplete="off"
					/>
				</label>
				<label class="mh-sell-field mh-sell-field--wide">
					<span>{i18n.t('copy.822f9fd9ba2d')}</span>
					<input
						{@attach i18n.validation}
						type="tel"
						bind:value={importPhone}
						placeholder={daynightSite.phoneLabel}
						autocomplete="tel"
					/>
				</label>
				<label class="mh-sell-field mh-sell-field--wide">
					<span>{i18n.t('copy.fbee9a117fb4')}</span>
					<input
						{@attach i18n.validation}
						type="text"
						inputmode="url"
						bind:value={importSourceUrl}
						placeholder={i18n.t('copy.97a949d64838')}
						autocomplete="url"
					/>
				</label>
			</div>

			<p class="mh-import-note">
				{i18n.t('copy.37ff80bbbe37')}
			</p>
		</div>

		<a class="mh-search-sheet__go" href={i18n.href(resolve(importLeadHref))}
			>{i18n.t('copy.de7b798538bd')}</a
		>
		<a class="mh-search-sheet__ghost" href={i18n.href(phoneHref)}>
			<PhoneCall size={17} strokeWidth={2.45} aria-hidden="true" />
			<span>{i18n.t('copy.d40e5119596a')}</span>
		</a>
	</div>
</MobileFullSheet>
