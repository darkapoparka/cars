<script lang="ts">
	import { daynightSite as brand } from '$lib/data/daynight-site';
	import { getI18n } from '$lib/locale/context';
	import { countries } from '$lib/locale/core';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const i18n = getI18n();
	const names = $derived(new Intl.DisplayNames([i18n.locale], { type: 'region' }));
	const ordered = $derived([
		i18n.state.suggestedCountry,
		...countries
			.filter((code) => code !== i18n.state.suggestedCountry)
			.sort((a, b) => (names.of(a) ?? a).localeCompare(names.of(b) ?? b, i18n.locale))
	]);
</script>

<svelte:head
	><title>{i18n.t('locale.title')} — {brand.name}</title><meta
		name="description"
		content={i18n.t('locale.description')}
	/></svelte:head
>
<main id="main-content" class="locale-settings" aria-labelledby="locale-settings-title">
	<h1 id="locale-settings-title">{i18n.t('locale.title')}</h1>
	<p>{i18n.t('locale.description')}</p>
	<p>
		{i18n.t('locale.suggestion', {
			country: names.of(i18n.state.suggestedCountry) ?? i18n.state.suggestedCountry
		})}
	</p>
	<form method="post" action={i18n.endpoint('/api/preferences')}>
		<input type="hidden" name="returnTo" value={data.returnTo} />
		<label for="settings-country">{i18n.t('locale.country')}</label>
		<select
			{@attach i18n.validation}
			id="settings-country"
			name="country"
			value={i18n.state.country}
			required
		>
			{#each ordered as code (code)}<option value={code}
					>{names.of(code) ?? code}{code === i18n.state.suggestedCountry
						? ` — ${i18n.t('locale.suggested')}`
						: ''}</option
				>{/each}
		</select>
		<label for="settings-language">{i18n.t('locale.language')}</label>
		<select
			{@attach i18n.validation}
			id="settings-language"
			name="locale"
			value={i18n.locale}
			required
		>
			<option value="en" lang="en">English</option><option value="bg" lang="bg">Български</option>
		</select>
		<p>{i18n.t('locale.facts')}</p>
		<p>{i18n.t('locale.moreLanguages')}</p>
		<div class="locale-settings-actions">
			<button name="action" value="dismiss" type="submit">{i18n.t('locale.dismiss')}</button><button
				name="action"
				value="save"
				type="submit">{i18n.t('locale.save')}</button
			>
		</div>
		<a href={data.returnTo}>{i18n.t('locale.back')}</a>
	</form>
</main>

<style>
	.locale-settings {
		width: min(520px, calc(100% - 32px));
		margin: 40px auto;
		padding: 24px;
		border: 1px solid #d7dee6;
		border-radius: 16px;
		background: #fff;
		color: #172432;
		box-sizing: border-box;
	}
	.locale-settings h1 {
		font-size: var(--sa-text-panel-title);
		line-height: var(--sa-leading-tight);
		margin: 0 0 16px;
	}
	.locale-settings p {
		font-size: var(--sa-text-base);
		line-height: var(--sa-leading-normal);
		margin: 12px 0;
	}
	.locale-settings form {
		display: grid;
		gap: 12px;
	}
	.locale-settings label {
		font-weight: var(--sa-weight-semibold);
	}
	.locale-settings select {
		width: 100%;
		min-width: 0;
		min-height: 48px;
		padding: 10px;
		border: 1px solid #c5ced7;
		border-radius: 8px;
		background: #fff;
		color: inherit;
		font: inherit;
		font-size: var(--sa-text-base);
	}
	.locale-settings-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	.locale-settings button {
		flex: 1;
		min-width: 140px;
		min-height: 48px;
		padding: 12px;
		border: 1px solid #c5ced7;
		border-radius: 8px;
		background: #fff;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}
	.locale-settings button[value='save'] {
		background: #142331;
		color: #fff;
		border-color: #142331;
	}
	.locale-settings a {
		min-height: 44px;
		display: flex;
		align-items: center;
		color: inherit;
		text-decoration: underline;
	}
	.locale-settings :is(button, select, a):focus-visible {
		outline: 3px solid #337aaa;
		outline-offset: 3px;
	}
</style>
