<script lang="ts">
  import { preserveScrollOffset } from '$lib/ui/overlay';
  import { onDestroy } from 'svelte';
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  onDestroy(() => releaseOffset?.(false));
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { tick, type Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { bodyLabel, listingParams, listingFilterOptions as options, listingModelsForMake, parseListingFilters, type ListingFilters } from '$data/listing';
  import Icon from '$components/ui/Icon.svelte';

  let { children, filters, onApply, fullScreen = false, id = 'dn-quick-filter' }: { children: Snippet<[(event: MouseEvent, field: string, title: string) => void, boolean]>; filters?: ListingFilters; onApply?: (filters: ListingFilters) => void; fullScreen?: boolean; id?: string } = $props();
  const params = $derived(filters ? listingParams(filters) : page.url.searchParams);
  let dialog: HTMLDialogElement;
  let heading: HTMLHeadingElement;
  let searchInput: HTMLInputElement;
  let trigger: HTMLElement;

  let opened = $state(false);
  let field = $state('make');
  let title = $state('Марка');
  let selected = $state('');
  let minimum = $state('');
  let maximum = $state('');
  let equipment = $state<string[]>([]);
  let search = $state('');
  const attachDialog: Attachment<HTMLDialogElement> = node => { dialog = node; };
  const attachHeading: Attachment<HTMLHeadingElement> = node => { heading = node; };
  const attachSearch: Attachment<HTMLInputElement> = node => { searchInput = node; };
  const range = $derived(field === 'price' || field === 'year');
  const searchable = $derived(!range && field !== 'mileage_max' && field !== 'sort');
  const searchLabel = $derived(field === 'make' ? 'Търси марка' : field === 'model' ? 'Търси модел' : `Търси в ${title.toLocaleLowerCase('bg-BG')}`);
  const optionLabel = (option: string) => field === 'body' ? bodyLabel(option) || 'Всички' : field === 'sort' ? options.sorts.find(([value]) => value === (option || 'default'))?.[1] ?? option : option === 'new' ? 'Нови' : option === 'used' ? 'Употребявани' : option || 'Всички';
  const matchesSearch = (option: string) => search.trim().toLocaleLowerCase('bg-BG').split(/\s+/).every(term => optionLabel(option).toLocaleLowerCase('bg-BG').includes(term));
  const invalid = $derived(range && minimum !== '' && maximum !== '' && Number(minimum) > Number(maximum));
  const choices = $derived.by((): readonly string[] => {
    switch (field) {
      case 'sort': return options.sorts.map(([value]) => value === 'default' ? '' : value);
      case 'make': return options.makes;
      case 'model': return listingModelsForMake(params.get('make') ?? '');
      case 'body': return options.bodies;
      case 'fuel': return options.fuels;
      case 'transmission': return options.transmissions;
      case 'version': return options.versions;
      case 'condition': return ['', 'used', 'new'];
      case 'equipment': return options.equipment;
      default: return [];
    }
  });
  const visibleChoices = $derived(choices.filter(matchesSearch));
  const preserved = $derived([...params.entries()].filter(([key]) => {
    if (range) return key !== `${field}_min` && key !== `${field}_max`;
    if (field === 'make' && key === 'model' && selected !== params.get('make')) return false;
    return key !== field;
  }));

  async function open(event: MouseEvent, nextField: string, nextTitle: string) {
    trigger = event.currentTarget as HTMLElement;
    field = nextField;
    title = nextTitle;
    search = '';
    selected = params.get(field) ?? '';
    minimum = params.get(`${field}_min`) ?? '';
    maximum = params.get(`${field}_max`) ?? '';
    equipment = params.getAll('equipment');
    if (!onApply) releaseOffset = preserveScrollOffset('--dn-quick-scroll');
    opened = true;
    await tick();
    dialog.showModal();
    heading.focus();
  }
  function restore() {
    opened = false;
    if (!onApply) {
      releaseOffset?.();
    }
    if (trigger?.isConnected) trigger.focus();
  }
  function clear() { selected = ''; minimum = ''; maximum = ''; equipment = []; search = ''; }
  function submit(event: SubmitEvent) {
    if (onApply) {
      event.preventDefault();
      const values = new URLSearchParams();
      for (const [key, value] of new FormData(event.currentTarget as HTMLFormElement)) if (typeof value === 'string') values.append(key, value);
      onApply(parseListingFilters(values));
    }
    dialog.close();
  }
  function clean(event: FormDataEvent) {
    for (const key of new Set(event.formData.keys())) {
      if (event.formData.getAll(key).every(value => value === '')) event.formData.delete(key);
    }
  }
</script>

{@render children(open, opened)}

<dialog {id} class={['dn-quick-sheet', { searchable, 'full-screen': fullScreen, standalone: !onApply }]} aria-labelledby={`${id}-title`} {@attach attachDialog} onclose={restore} onclick={event => { if (event.target === event.currentTarget) dialog.close(); }}>
  <form method="GET" action={resolve('/listing-grid')} onformdata={clean} onsubmit={submit}>
    <header>
      <h2 id={`${id}-title`} tabindex="-1" {@attach attachHeading}>{title}</h2>
      <button type="button" class="close" aria-label="Затвори избора" onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
    </header>
    {#if searchable}
      <div class="search-wrap">
        <div class="search-field">
          <Icon name="search" size={20} />
          <input type="search" {@attach attachSearch} bind:value={search} aria-label={searchLabel} placeholder={`${searchLabel}…`} autocomplete="off" onkeydown={event => { if (event.key === 'Enter') event.preventDefault(); if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } }} />
          {#if search}<button type="button" class="clear-search" aria-label="Изчисти търсенето" onclick={() => { search = ''; searchInput.focus(); }}><Icon name="x" size={18} /></button>{/if}
        </div>
      </div>
    {/if}
    <div class="content">
      {#if range}
        <div class="range">
          <label>От{field === 'price' ? ' (€)' : ''}<input type="number" inputmode="numeric" name={`${field}_min`} bind:value={minimum} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder="Без минимум" /></label>
          <label>До{field === 'price' ? ' (€)' : ''}<input type="number" inputmode="numeric" name={`${field}_max`} bind:value={maximum} min={field === 'year' ? 1900 : 0} max={field === 'year' ? new Date().getFullYear() + 1 : undefined} step="1" placeholder="Без максимум" /></label>
        </div>
        {#if invalid}<p role="alert">Началната стойност трябва да е по-ниска от крайната.</p>{/if}
      {:else if field === 'mileage_max'}
        <label class="mileage">Максимален пробег (км)<input type="number" inputmode="numeric" name={field} bind:value={selected} min="0" step="1" placeholder="Без ограничение" /></label>
      {:else}
        {#key field}
        <fieldset>
          <legend class="dn-sr-only">{title}</legend>
          {#each choices as option (option)}
            <label class="choice" hidden={!matchesSearch(option)}>
              <span>{optionLabel(option)}</span>
              {#if field === 'equipment'}<input type="checkbox" name="equipment" value={option} bind:group={equipment} />
              {:else}<input type="radio" name={field} value={option} checked={selected === option} onchange={() => selected = option} />{/if}
            </label>
          {/each}
        </fieldset>
        {/key}
        {#if visibleChoices.length === 0}
          <div class="empty" role="status"><strong>Няма съвпадения</strong><p>Опитайте с друго име или изчистете търсенето.</p></div>
        {/if}
      {/if}
    </div>
    {#each preserved as [name, value], index (`${name}-${index}`)}<input type="hidden" {name} {value} />{/each}
    <footer>
      <button class="clear" type="button" onclick={clear}>Изчисти</button>
      <button class="apply" type="submit" disabled={invalid}>Приложи<Icon name="arrow-right" size={18} /></button>
    </footer>
  </form>
</dialog>

<style>
  :global(body:has(.dn-quick-sheet.standalone[open])) { position: fixed; top: var(--dn-quick-scroll, 0); width: 100%; overflow: hidden; }
  .dn-quick-sheet { width: min(480px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 32px); margin: auto; padding: 0; overflow: hidden; border: 0; border-radius: 20px; background: #fff; color: var(--dn-ink); }
  .dn-quick-sheet::backdrop { background: rgb(8 10 14 / .6); }
  form { display: flex; flex-direction: column; max-height: calc(100dvh - 32px); margin: 0; }
  .searchable form { height: min(600px, calc(100dvh - 32px)); }
  header { display: flex; flex: 0 0 auto; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 20px 12px; }
  h2 { margin: 0; font-size: 22px; line-height: 1.3; letter-spacing: -.025em; }
  h2:focus { outline: none; }
  button { font: inherit; cursor: pointer; }
  .close { display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; background: #f2f3f5; color: inherit; }
  .content { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0 16px 16px; }
  .searchable .content { flex: 1; }
  .search-wrap { flex: 0 0 auto; padding: 0 16px 10px; }
  .search-field { display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 0 4px 0 16px; border-radius: var(--dn-pill); background: #f1f2f4; color: #69717c; }
  .search-field:focus-within { outline: 2px solid #0b57d0; outline-offset: 2px; }
  .search-field input { flex: 1; width: 100%; min-width: 0; height: 50px; padding: 0; border: 0; outline: none; background: transparent; color: #24272c; font: 400 16px var(--dn-font); }
  .search-field input:focus, .search-field input:focus-visible { border: 0; outline: none; background: transparent; box-shadow: none; }
  .search-field input::-webkit-search-cancel-button { display: none; }
  .clear-search { display: grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; padding: 0; border: 0; border-radius: var(--dn-pill); background: transparent; color: #24272c; }
  .clear-search:hover { background: #e4e7ea; }
  fieldset { display: grid; gap: 8px; padding: 0; margin: 0; border: 0; }
  .choice { display: flex; box-sizing: border-box; min-height: 52px; padding: 12px 16px; gap: 16px; justify-content: space-between; align-items: center; border: 0; border-radius: 14px; background: #f1f2f4; color: #24272c; font-size: 15px; font-weight: 600; cursor: pointer; }
  .choice[hidden] { display: none; }
  .choice:hover { background: #e4e7ea; }
  .choice:has(:checked) { background: #171a20; color: #fff; }
  .choice:focus-within { outline: 2px solid #0b57d0; outline-offset: -2px; }
  .choice input { width: 20px; height: 20px; flex: 0 0 20px; margin: 0; accent-color: #171a20; }
  .choice:has(:checked) input { accent-color: #fff; }
  .empty { padding: 24px 12px; color: #24272c; text-align: center; }
  .empty strong { font-size: 16px; }
  .empty p { margin: 8px 0 0; color: #656b74; font-size: 14px; line-height: 1.5; }
  .range { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 8px; }
  .range label, .mileage { display: block; min-width: 0; font-size: 14px; font-weight: 600; }
  input[type=number] { display: block; width: 100%; min-width: 0; box-sizing: border-box; margin-top: 8px; padding: 12px; height: 52px; border: 1px solid #d9dde2; border-radius: 12px; background: #fff; color: inherit; font: 400 16px var(--dn-font); }
  input::placeholder { color: #69717c; }
  p[role=alert] { color: #a40000; font-size: 14px; margin: 12px 0 0; }
  footer { display: flex; flex: 0 0 auto; align-items: center; gap: 20px; padding: 12px 16px max(16px, env(safe-area-inset-bottom)); }
  .clear { min-height: 48px; padding: 0; border: 0; background: transparent; color: inherit; text-decoration: underline; text-underline-offset: 4px; font-size: 14px; }
  .apply { display: flex; flex: 1; min-height: 48px; align-items: center; justify-content: center; gap: 12px; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-weight: 600; }
  .apply:hover { background: var(--dn-red-hover); }
  .apply:disabled { opacity: .5; cursor: default; }
  @media (max-width: 767px) {
    .dn-quick-sheet { inset: auto 0 0; width: 100%; max-height: calc(100dvh - max(24px, env(safe-area-inset-top))); margin: 0; border-radius: 24px 24px 0 0; }
    form { max-height: calc(100dvh - max(24px, env(safe-area-inset-top))); }
  }
  @media (max-width: 767px) {
    .dn-quick-sheet.full-screen { inset: 0; height: 100dvh; max-height: 100dvh; border-radius: 0; }
    .full-screen form { height: 100%; max-height: 100%; }
    .full-screen .content { flex: 1; }
    .full-screen header { padding-top: max(16px, env(safe-area-inset-top)); }
  }
  @media (prefers-reduced-motion: no-preference) {
    .dn-quick-sheet[open] { animation: sheet-enter 200ms cubic-bezier(.16, 1, .3, 1); }
    @keyframes sheet-enter { from { transform: translateY(28px); } to { transform: translateY(0); } }
  }
</style>
