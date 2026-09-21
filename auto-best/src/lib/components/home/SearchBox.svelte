<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleQuickSearch from './VehicleQuickSearch.svelte';
  import { emptyListingDraft, listingFiltersFromDraft } from '$data/listing-draft';
  import VehicleDiscoveryForm from '$components/listing/VehicleDiscoveryForm.svelte';
  import VehicleSearchDialog from '$components/listing/VehicleSearchDialog.svelte';
  import { resolveImportUrl } from '$data/company';

  let desktopFilters = $state(listingFiltersFromDraft(emptyListingDraft()));
  let mode = $state<'buy' | 'import'>('buy');
  let importUrl = $state('');
  let importError = $state('');
  let buyTab: HTMLButtonElement;
  let importTab: HTMLButtonElement;
  let importInput: HTMLInputElement;

  function handleModeKey(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    mode = event.key === 'Home' ? 'buy' : event.key === 'End' ? 'import' : mode === 'buy' ? 'import' : 'buy';
    (mode === 'buy' ? buyTab : importTab).focus();
  }

  function validateImport(event: SubmitEvent) {
    if (resolveImportUrl(importUrl)) return;
    event.preventDefault();
    importError = importUrl.trim() ? 'Поставете валиден линк с https:// или http://.' : 'Поставете линк към обявата, която сте избрали.';
    importInput.focus();
  }
</script>

<section class="dn-search-wrap" aria-label={i18n.t("m_0ae7a3ecbc83")}>
  <div class="container">
    <div class="dn-search">
      <div class="dn-search__mobile-modes dn-segmented-control" role="tablist" aria-label={i18n.t("m_a78ab3107899")}>
        <button
          class="dn-segmented-option"
          bind:this={buyTab}
          id="home-buy-tab"
          type="button"
          role="tab"
          aria-selected={mode === 'buy'}
          aria-controls="home-buy-search"
          tabindex={mode === 'buy' ? 0 : -1}
          onclick={() => mode = 'buy'}
          onkeydown={handleModeKey}
        >{i18n.t("m_64e3cb0e4960")}</button>
        <button
          class="dn-segmented-option"
          bind:this={importTab}
          id="home-import-tab"
          type="button"
          role="tab"
          aria-selected={mode === 'import'}
          aria-controls="home-import-search"
          tabindex={mode === 'import' ? 0 : -1}
          onclick={() => mode = 'import'}
          onkeydown={handleModeKey}
        >{i18n.t("m_2cff9baabf56")}</button>
      </div>
      <div id="home-buy-search" class={['dn-search__buy', { 'dn-search__buy--inactive': mode !== 'buy' }]} role="tabpanel" aria-labelledby="home-buy-tab">
        <VehicleQuickSearch />
        <a class="dn-search__mobile-all dn-compact-control dn-entry-action dn-compact-primary" href={i18n.href(resolve('/listing-grid'))}>
          <span>{i18n.t("m_30a64216eaea")}</span>
          <Icon name="arrow-right" size={18} strokeWidth={1.7} />
        </a>
      </div>
      <div id="home-import-search" class={['dn-search__import', { 'dn-search__import--active': mode === 'import' }]} role="tabpanel" aria-labelledby="home-import-tab">
        <form class="dn-search__import-form" method="GET" action={i18n.href(resolve('/contact#contact-intent'))} novalidate onsubmit={validateImport}>
          <input type="hidden" name="topic" value="import" />
          <label class="dn-search__import-field dn-entry-field">
            <Icon name="globe" size={18} strokeWidth={1.5} />
            <span class="dn-sr-only">{i18n.t("m_409235f690e6")}</span>
            <input {@attach i18n.validation}
              class="dn-entry-field__input"
              bind:this={importInput}
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
          <button class="dn-search__mobile-all dn-compact-control dn-entry-action dn-compact-primary" type="submit">{i18n.t("action.importShort")} <Icon name="arrow-right" size={18} strokeWidth={1.7} /></button>
        </form>
      </div>
      <div class="dn-search__desktop-form">
        <VehicleSearchDialog filters={desktopFilters}>
          {#snippet children(openFilters, filtersOpen)}
            <VehicleDiscoveryForm filters={desktopFilters} {openFilters} {filtersOpen} onDraftChange={(filters) => desktopFilters = filters} showFilterAction={false} enableSticky={false} />
          {/snippet}
        </VehicleSearchDialog>
      </div>
    </div>

  </div>
  <nav class="dn-search__mobile-shortcuts" aria-label={i18n.t("m_dea1661dff21")}>
    <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve('/listing-grid?price_max=60000'))}>{i18n.t("m_502e576bacf3")}</a>
    <a class="dn-compact-control dn-compact-pill dn-quick-pill" href={i18n.href(resolve('/listing-grid?price_min=60000&price_max=70000'))}>{i18n.t("m_8d9512ccead1")}</a>
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

  .dn-search {
    position: relative;
    padding: 12px 16px 16px;
    border-radius: 18px;
    background: var(--dn-white);
    border: 1px solid var(--dn-line);
    color: var(--dn-ink);
  }

  .dn-search__mobile-modes,
  .dn-search__import,
  .dn-search__mobile-shortcuts,
  .dn-search__mobile-all {
    display: none;
  }

  .dn-search__buy {
    display: none;
  }

  .dn-search :is(button, a):focus-visible {
    outline: 3px solid var(--dn-focus);
    outline-offset: 3px;
  }

  @media (min-width: 992px) {
    .dn-search-wrap { margin-top: -220px; margin-bottom: 34px; }
    .dn-search-wrap > .container { width: var(--dn-discovery-width); }
    .dn-search { padding: var(--dn-discovery-padding); border-radius: var(--dn-discovery-radius); }
  }

  @media (min-width: 1440px) {
    .dn-search-wrap { --dn-discovery-width: min(1040px, calc(100vw - 560px)); }
  }

  @media (max-width: 1199px) {
    .dn-search-wrap > .container {
      width: calc(100% - 48px);
    }
  }

  @media (max-width: 991px) {
    .dn-search-wrap > .container {
      width: min(100% - 24px, 760px);
    }

    .dn-search {
      padding: 14px;
      border-radius: 16px;
    }

  }

  @media (max-width: 767px) {
    .dn-search__mobile-modes {
      display: grid;
      width: var(--dn-entry-segment-width);
      justify-self: center;
    }
    .dn-search__buy { display: contents; }
    .dn-search-wrap {
      margin-top: -52px;
      background: transparent;
    }

    .dn-search-wrap > .container {
      width: calc(100% - 24px);
    }

    .dn-search {
      --dn-entry-height: var(--dn-control-height-default);
      --dn-home-search-stack-gap: var(--dn-space-2);
      display: grid;
      gap: var(--dn-home-search-stack-gap);
      padding: var(--dn-space-3) var(--dn-space-4);
      border: 0;
      border-radius: 20px;
      background: var(--dn-white);
    }

    .dn-search :global(.dn-quick-search__trigger) {
      margin: 0;
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
      gap: var(--dn-home-search-stack-gap);
    }

    .dn-search__import-field {
      display: flex;
      align-items: center;
      gap: var(--dn-entry-icon-gap);
      padding: 0 16px;
    }

    .dn-search__import-field > :global(.dn-icon) {
      color: var(--dn-muted);
    }

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

    .dn-search__mobile-shortcuts a { flex: 0 0 auto; }

    .dn-search__mobile-all { display: inline-flex; max-width: 100%; justify-self: center; margin-top: 0; }


    .dn-search__mobile-all:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 2px;
    }
  }
</style>
