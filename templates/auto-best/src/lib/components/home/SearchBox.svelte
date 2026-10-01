<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import EntryCard from '$components/ui/entry/EntryCard.svelte';
  import EntrySegments from '$components/ui/entry/EntrySegments.svelte';
  import EntryInput from '$components/ui/entry/EntryInput.svelte';
  import EntryAction from '$components/ui/entry/EntryAction.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import VehicleQuickSearch from './VehicleQuickSearch.svelte';
  import { emptyListingDraft, listingFiltersFromDraft } from '$data/listing-draft';
  import VehicleDiscoveryForm from '$components/listing/VehicleDiscoveryForm.svelte';
  import VehicleSearchDialog from '$components/listing/VehicleSearchDialog.svelte';
  import { resolveImportUrl } from '$data/company';
  import { listingBudgetCaps, listingVehicles } from '$data/listing';
  import { formatPrice } from '$lib/locale/core';
  import { localeContract } from '$lib/locale/core';

  const budgetCaps = listingBudgetCaps();
  let desktopFilters = $state(listingFiltersFromDraft(emptyListingDraft()));
  let mode = $state<'buy' | 'import'>('buy');
  let importUrl = $state('');
  let importError = $state('');
  let importInput = $state<HTMLInputElement>();

  const compactInventoryCurrency = $derived.by(() =>
    new Intl.NumberFormat(i18n.locale, {
      style: 'currency',
      currency: localeContract.inventoryCurrency,
      currencyDisplay: 'narrowSymbol'
    }).formatToParts(0).find((part) => part.type === 'currency')?.value ?? localeContract.inventoryCurrency
  );

  function validateImport(event: SubmitEvent) {
    if (resolveImportUrl(importUrl)) return;
    event.preventDefault();
    importError = importUrl.trim() ? 'Поставете валиден линк с https:// или http://.' : 'Поставете линк към обявата, която сте избрали.';
    importInput?.focus();
  }
</script>

<section class="dn-search-wrap" aria-label={i18n.t("m_0ae7a3ecbc83")}>
  <div class="container">
    <EntryCard class="dn-search">
      <div class="dn-search__mobile-modes"><EntrySegments tabs bind:value={mode} label={i18n.t('m_a78ab3107899')} options={[{ value: 'buy', label: i18n.t('m_64e3cb0e4960'), id: 'home-buy-tab', controls: 'home-buy-search' }, { value: 'import', label: i18n.t('m_2cff9baabf56'), id: 'home-import-tab', controls: 'home-import-search' }]} /></div>
      <div id="home-buy-search" class={['dn-search__buy', { 'dn-search__buy--inactive': mode !== 'buy' }]} role="tabpanel" aria-labelledby="home-buy-tab">
        <VehicleQuickSearch />
        <EntryAction class="dn-search__mobile-all" href={i18n.href(resolve('/listing-grid'))}>{i18n.t('home.viewAllCount', { count: listingVehicles.length })}</EntryAction>
      </div>
      <div id="home-import-search" class={['dn-search__import', { 'dn-search__import--active': mode === 'import' }]} role="tabpanel" aria-labelledby="home-import-tab">
        <form class="dn-search__import-form" method="GET" action={i18n.href(resolve('/contact#contact-intent'))} novalidate onsubmit={validateImport}>
          <input type="hidden" name="topic" value="import" />
          <label class="dn-search__import-field">
            <span class="dn-sr-only">{i18n.t("m_409235f690e6")}</span>
            <span class="dn-search__import-icon" aria-hidden="true"><MobileActionIcon name="article" size={22} /></span>
            <EntryInput
              class="dn-entry-field--prominent"
              bind:element={importInput}
              bind:value={importUrl}
              type="url"
              inputmode="url"
              name="vehicle_url"
              placeholder={i18n.t("m_fbee9a117fb4")}
              maxlength={2048}
              required
              autocomplete="off"
              autocapitalize="none"
              spellcheck={false}
              aria-describedby={importError ? 'home-import-error' : undefined}
              aria-invalid={importError ? true : undefined}
              oninput={() => importError = ''}
            />
          </label>
          {#if importError}
            <p id="home-import-error" class="dn-search__import-error" role="alert">{i18n.text(importError)}</p>
          {/if}
          <EntryAction class="dn-search__mobile-all">{i18n.t('action.importShort')}</EntryAction>
        </form>
      </div>
      <div class="dn-search__desktop-form">
        <VehicleSearchDialog filters={desktopFilters}>
          {#snippet children(openFilters, filtersOpen)}
            <VehicleDiscoveryForm filters={desktopFilters} {openFilters} {filtersOpen} onDraftChange={(filters) => desktopFilters = filters} showFilterAction={false} enableSticky={false} />
          {/snippet}
        </VehicleSearchDialog>
      </div>
    </EntryCard>

  </div>
  <nav class="dn-search__mobile-shortcuts" aria-label={i18n.t("m_dea1661dff21")}>
    {#each budgetCaps as cap (cap)}
      <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve(`/listing-grid?price_max=${cap}`))} aria-label={i18n.t('inventory.budget.accessible', { amount: formatPrice(cap, i18n.locale) })}>{i18n.t('inventory.budget.short', { amount: cap / 1000, currency: compactInventoryCurrency })}</a>
    {/each}
    <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve('/listing-grid?make=Audi'))}>{i18n.t("m_ab31803df6d5")}</a>
    <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve('/listing-grid?make=Mercedes-Benz'))}>{i18n.t("m_3d0e65dfe82d")}</a>
    <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve('/listing-grid?make=BMW'))}>{i18n.t("m_c76b5628a9d1")}</a>
  </nav>
</section>

<style>
  .dn-search-wrap {
    --dn-home-search-top: var(--dn-route-hero-control-top);
    --dn-discovery-width: min(var(--dn-content), calc(100% - 48px));
    --dn-discovery-padding: 18px;
    --dn-discovery-radius: 16px;

    position: relative;
    z-index: 20;
    margin-top: calc(var(--dn-home-search-top) - var(--dn-route-hero-height));
  }

  .dn-search-wrap > .container {
    width: min(1296px, calc(100% - 80px));
  }

  .dn-search__mobile-modes,
  .dn-search__import,
  .dn-search__mobile-shortcuts {
    display: none;
  }

  .dn-search__buy {
    display: none;
  }

  @media (min-width: 992px) {
    .dn-search-wrap { --dn-discovery-width: min(var(--dn-hero-center-width), calc(100% - 48px)); margin-bottom: 34px; }
    .dn-search-wrap > .container { width: var(--dn-discovery-width); }
    .dn-search-wrap :global(.dn-search) {
      padding: var(--dn-discovery-padding);
      border: 0;
      border-radius: var(--dn-discovery-radius);
      box-shadow: 0 12px 32px rgb(32 35 41 / 6%);
    }
  }

  @media (max-width: 991px) {
    .dn-search-wrap > .container {
      width: min(100% - 24px, 760px);
    }

  }

  @media (max-width: 767px) {
    .dn-search__mobile-modes { display: block; }

    .dn-search__buy { display: contents; }
    .dn-search-wrap {
      margin-top: -52px;
      background: transparent;
    }

    .dn-search-wrap > .container {
      width: calc(100% - 24px);
    }

    .dn-search__desktop-form,
    .dn-search__buy--inactive {
      display: none;
    }

    .dn-search__import--active,
    .dn-search__import-form {
      display: grid;
      min-width: 0;
    }

    .dn-search__import-form {
      gap: var(--dn-entry-stack-gap);
    }

    .dn-search__import-field { position: relative; display: block; min-width: 0; }
    .dn-search__import-icon { position: absolute; z-index: 1; top: 0; bottom: 0; left: var(--dn-space-3); display: grid; place-items: center; color: var(--dn-entry-prominent-muted); pointer-events: none; }
    .dn-search__import-field :global(.dn-entry-input) { padding-inline-start: calc(var(--dn-space-3) + 22px + var(--dn-space-2)); }

    .dn-search__import-error {
      margin: 0;
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-body);
    }

    .dn-search__import-error {
      color: var(--dn-red);
    }

    .dn-search__mobile-shortcuts {
      display: flex;
      gap: var(--dn-entry-action-gap);
      margin: 0;
      padding: 10px 12px 0;
      overflow-x: auto;
      background: var(--dn-mobile-canvas);
      scrollbar-width: none;
    }

    .dn-search__mobile-shortcuts::-webkit-scrollbar {
      display: none;
    }

    .dn-search__mobile-shortcuts a {
      display: inline-flex;
      min-height: var(--dn-control-height-default);
      flex: 0 0 auto;
      align-items: center;
      padding: 0 15px;
      border-radius: var(--dn-radius-button);
      background: var(--dn-mobile-surface);
      color: #30363f;
      font-size: var(--dn-control-size);
      font-weight: var(--dn-control-weight);
      white-space: nowrap;
    }

  }
</style>
