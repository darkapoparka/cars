<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import { pageDescriptions } from '$lib/content/seo';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { countries, safeReturnPath } from '$lib/locale/core';
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	const names = $derived(new Intl.DisplayNames([i18n.locale], { type: 'region' }));
</script>

<svelte:head
	><title>{i18n.t('title')}</title><meta
		name="description"
		content={pageDescriptions.settings[i18n.locale]}
	/></svelte:head
>
<main id="main-content" class="site-container site-section">
	<h1>{i18n.t('title')}</h1>
	<p>{i18n.t('description')}</p>
	<p>
		{i18n.t('suggestion', {
			country: names.of(i18n.state.suggestedCountry) ?? i18n.state.suggestedCountry
		})}
	</p>
	<form method="POST" action={linkHref(base + '/api/preferences')}>
		<input
			type="hidden"
			name="returnTo"
			value={safeReturnPath(page.url.searchParams.get('returnTo'), page.url.origin) ??
				base + '/' + i18n.locale}
		/>
		<label
			>{i18n.t('country')}<select name="country" value={i18n.state.country}
				>{#each [i18n.state.suggestedCountry, ...countries.filter((c) => c !== i18n.state.suggestedCountry)] as country (country)}<option
						value={country}>{names.of(country)}</option
					>{/each}</select
			></label
		>
		<label
			>{i18n.t('language')}<select name="locale" value={i18n.locale}
				><option value="en" lang="en">English</option><option value="bg" lang="bg">Български</option
				></select
			></label
		>
		<p>{i18n.t('facts')}</p>
		<button name="action" value="save">{i18n.t('save')}</button><button
			name="action"
			value="dismiss">{i18n.t('dismiss')}</button
		>
	</form>
</main>

<style>
	form {
		display: grid;
		gap: 20px;
		grid-template-columns: minmax(0, 1fr);
		width: min(100%, 560px);
	}
	label {
		min-width: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
	}
	select,
	button {
		min-height: 44px;
		min-width: 0;
		width: 100%;
		max-width: 100%;
		padding: 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
	}
</style>
