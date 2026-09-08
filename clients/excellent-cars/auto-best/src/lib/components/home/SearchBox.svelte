<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import VehicleQuickSearch from './VehicleQuickSearch.svelte';
  import { parseListingFilters } from '$data/listing';
  import VehicleDiscoveryForm from '$components/listing/VehicleDiscoveryForm.svelte';
  import VehicleSearchDialog from '$components/listing/VehicleSearchDialog.svelte';
  import { resolveImportUrl } from '$data/company';

  let desktopFilters = $state(parseListingFilters(new URLSearchParams()));
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

<section class="dn-search-wrap" aria-label="Търсене на автомобил">
  <div class="container">
    <div class="dn-search">
      <div class="dn-search__mobile-modes" role="tablist" aria-label="Основна цел">
        <button
          bind:this={buyTab}
          id="home-buy-tab"
          type="button"
          role="tab"
          aria-selected={mode === 'buy'}
          aria-controls="home-buy-search"
          tabindex={mode === 'buy' ? 0 : -1}
          onclick={() => mode = 'buy'}
          onkeydown={handleModeKey}
        >Купи</button>
        <button
          bind:this={importTab}
          id="home-import-tab"
          type="button"
          role="tab"
          aria-selected={mode === 'import'}
          aria-controls="home-import-search"
          tabindex={mode === 'import' ? 0 : -1}
          onclick={() => mode = 'import'}
          onkeydown={handleModeKey}
        >Внос</button>
      </div>
      <div id="home-buy-search" class={['dn-search__buy', { 'dn-search__buy--inactive': mode !== 'buy' }]} role="tabpanel" aria-labelledby="home-buy-tab">
        <VehicleQuickSearch />
        <a class="dn-search__mobile-all" href={resolve('/listing-grid')}>
          <span>Виж всички</span>
          <Icon name="arrow-right" size={17} strokeWidth={2} />
        </a>
      </div>
      <div id="home-import-search" class={['dn-search__import', { 'dn-search__import--active': mode === 'import' }]} role="tabpanel" aria-labelledby="home-import-tab">
        <form class="dn-search__import-form" method="GET" action={resolve('/contact#contact-intent')} novalidate onsubmit={validateImport}>
          <input type="hidden" name="topic" value="import" />
          <label class="dn-search__import-field">
            <Icon name="globe" size={20} strokeWidth={1.8} />
            <span class="dn-sr-only">Линк към обява за внос</span>
            <input
              bind:this={importInput}
              bind:value={importUrl}
              type="url"
              inputmode="url"
              name="vehicle_url"
              placeholder="Поставете линк към обява"
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
            <p id="home-import-error" class="dn-search__import-error" role="alert">{importError}</p>
          {/if}
          <button class="dn-search__mobile-all" type="submit">Продължи към контакт <Icon name="arrow-right" size={17} strokeWidth={2} /></button>
        </form>
      </div>
      <div class="dn-search__desktop-form">
        <VehicleSearchDialog filters={desktopFilters}>
          {#snippet children(openFilters, filtersOpen)}
            <VehicleDiscoveryForm filters={desktopFilters} {openFilters} {filtersOpen} onDraftChange={(filters) => desktopFilters = filters} showFilterAction={false} />
          {/snippet}
        </VehicleSearchDialog>
      </div>
    </div>

  </div>
  <nav class="dn-search__mobile-shortcuts" aria-label="Бързи филтри">
    <a href={resolve('/listing-grid?price_max=15000')}>До 15 000 €</a>
    <a href={resolve('/listing-grid?price_min=15000&price_max=20000')}>15–20 000 €</a>
    <a href={resolve('/listing-grid?make=Audi')}>Audi</a>
    <a href={resolve('/listing-grid?make=Mercedes-Benz')}>Mercedes</a>
    <a href={resolve('/listing-grid?make=BMW')}>BMW</a>
  </nav>
</section>

<style>
  .dn-search-wrap {
    --dn-home-search-top: var(--dn-route-hero-control-top);

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
    background: #fff;
    box-shadow: 0 16px 42px rgba(16, 24, 40, 0.16);
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

  @media (min-width: 992px) {
    .dn-search-wrap { margin-top: -220px; margin-bottom: 34px; }
    .dn-search-wrap > .container { width: var(--dn-discovery-width); }
    .dn-search { padding: var(--dn-discovery-padding); border-radius: var(--dn-discovery-radius); box-shadow: 0 8px 28px rgb(16 24 40 / .06); }
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
    .dn-search__buy { display: contents; }
    .dn-search-wrap {
      margin-top: -52px;
      background: transparent;
    }

    .dn-search-wrap > .container {
      width: calc(100% - 24px);
    }

    .dn-search {
      display: grid;
      gap: 9px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.84);
      border-radius: 20px;
      background: var(--dn-mobile-surface);
      box-shadow: 0 18px 42px rgba(13, 18, 26, 0.2);
    }

    .dn-search__mobile-modes {
      display: grid;
      min-height: 50px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
      padding: 3px;
      border-radius: var(--dn-radius-button);
      background: #eceef1;
    }

    .dn-search__mobile-modes button {
      display: inline-flex;
      min-width: 0;
      min-height: 44px;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: 0;
      border-radius: var(--dn-radius-button);
      background: transparent;
      color: #5b626d;
      font-size: 14px;
      font-weight: 650;
      cursor: pointer;
    }

    .dn-search__mobile-modes [aria-selected='true'] {
      background: #171a20;
      color: #fff;
    }

    .dn-search :global(.dn-quick-search__trigger) {
      min-height: 52px;
      margin: 0;
      border: 0;
      background: #f1f3f5;
      color: #505762;
    }

    .dn-search__desktop-form,
    .dn-search__buy--inactive {
      display: none;
    }

    .dn-search__import--active,
    .dn-search__import-form {
      display: grid;
      min-width: 0;
      gap: 10px;
    }

    .dn-search__import-field {
      display: flex;
      min-height: 52px;
      align-items: center;
      gap: 10px;
      padding: 0 16px;
      border-radius: var(--dn-radius-button);
      background: #f1f3f5;
      color: #505762;
    }

    .dn-search__import-field input {
      width: 100%;
      min-width: 0;
      min-height: 52px;
      padding: 0;
      border: 0;
      outline: none;
      background: transparent;
      color: #30363f;
      font-size: 16px;
    }

    .dn-search__import-field input::placeholder {
      color: #505762;
      opacity: 1;
    }

    .dn-search__import-field:focus-within {
      outline: 3px solid rgba(196, 1, 1, 0.18);
      outline-offset: 2px;
    }

    .dn-search__import-error {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .dn-search__import-error {
      color: #b00012;
    }

    .dn-search__mobile-shortcuts {
      display: flex;
      gap: 8px;
      margin: 0;
      padding: 14px 12px 0;
      overflow-x: auto;
      background: var(--dn-mobile-canvas);
      scrollbar-width: none;
    }

    .dn-search__mobile-shortcuts::-webkit-scrollbar {
      display: none;
    }

    .dn-search__mobile-shortcuts a {
      display: inline-flex;
      min-height: 44px;
      flex: 0 0 auto;
      align-items: center;
      padding: 0 15px;
      border-radius: var(--dn-radius-button);
      background: var(--dn-mobile-surface);
      color: #30363f;
      font-size: 13px;
      font-weight: 650;
      white-space: nowrap;
    }

    .dn-search__mobile-all {
      display: flex;
      width: fit-content;
      max-width: 100%;
      min-height: 44px;
      justify-self: center;
      align-items: center;
      justify-content: center;
      gap: 7px;
      margin-top: 0;
      padding: 0 24px;
      border: 0;
      border-radius: var(--dn-radius-button);
      background: var(--dn-red);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .dn-search__mobile-all:focus-visible {
      outline: 3px solid rgba(196, 1, 1, 0.25);
      outline-offset: 2px;
    }
  }
</style>

