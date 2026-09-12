<script lang="ts">
  import { preserveScrollOffset, trapDialogTab } from '$lib/ui/overlay';
  import { validateVehicleIdentity, type VehicleIdentityErrors } from '$data/enquiry';
  import { setIdentityValidity, clearIdentityError } from '$lib/ui/enquiry-validation';
  import { resolve } from '$app/paths';
  import { tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';
  import { resolveImportUrl } from '$data/company';

  let { importUrl = null }: { importUrl?: string | null } = $props();
  const title = $derived('Запитване за внос');
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let heading: HTMLHeadingElement;
  let linkInput = $state<HTMLInputElement>();
  let returnFocus: HTMLElement | undefined;
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  let fieldErrors = $state<VehicleIdentityErrors>({});
  let step = $state(0);
  let opened = false;
  let linkDraft = $state<string | null>(null);
  let link = $derived(linkDraft ?? importUrl ?? '');
  let linkError = $state('');
  let infoError = $state('');
  let importMode = $state<'listing' | 'criteria'>('listing');
  let importBrief = $state('');
  let selectedLink = $state('');
  let make = $state('');
  let model = $state('');
  let year = $state('');
  let budget = $state('');
  let name = $state('');
  let phone = $state('');
  let notes = $state('');
  let feedback = $state('');
  let completion = $state<'copied' | 'shared' | ''>('');
  let sharing = $state(false);
  const steps = $derived(['Автомобил', 'Контакт', 'Преглед']);
  const summary = $derived([
    'Запитване за внос',
    selectedLink ? `Обява: ${selectedLink}` : '',
    !selectedLink && importBrief.trim() ? `Критерии: ${importBrief.trim()}` : '',
    `Автомобил: ${[make.trim(), model.trim()].filter(Boolean).join(' ') || (selectedLink ? 'По избраната обява' : 'По описаните критерии')}`, 
    year ? `${'Година от'}: ${year}` : '',
    budget ? `${'Бюджет'}: ${budget} EUR` : '',
    notes.trim() ? `Допълнително: ${notes.trim()}` : '',
    name.trim() ? `Име: ${name.trim()}` : '',
    phone.trim() ? `Телефон: ${phone.trim()}` : '',
  ].filter(Boolean).join('\n'));

  const attachDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      if (opened) restore(false);
    };
  };

  async function open(event: MouseEvent, withoutLink = false) {
    if (withoutLink && !importBrief.trim()) {
      infoError = 'Опишете накратко какъв автомобил търсите.';
      return;
    }
    if (!withoutLink && !resolveImportUrl(link)) {
      linkError = link.trim() ? 'Въведете валиден линк с https:// или http://.' : 'Поставете линк към обява.';
      linkInput?.focus();
      return;
    }
    infoError = '';
    const nextLink = withoutLink ? '' : resolveImportUrl(link) || '';
    if (nextLink !== selectedLink) step = 0;
    selectedLink = nextLink;
    returnFocus = event.currentTarget as HTMLElement;
    releaseOffset = preserveScrollOffset('--dn-enquiry-scroll');
    opened = true;
    feedback = '';
    completion = '';
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function restore(restoreScroll = true) {
    if (!opened) return;
    opened = false;
    releaseOffset?.(restoreScroll);
    if (restoreScroll && returnFocus?.isConnected) returnFocus.focus();
  }

  async function move(next: number) {
    if (next > step) {
      fieldErrors = validateVehicleIdentity(make, model, Boolean((selectedLink || importBrief.trim())), year).errors;
      setIdentityValidity(form, fieldErrors);
      if (!form.reportValidity()) return;
    }
    step = next;
    feedback = '';
    await tick();
    heading.focus();
    form.scrollTop = 0;
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      completion = 'copied';
      feedback = 'Текстът е копиран и е готов за изпращане към екипа.';
    } catch {
      completion = '';
      feedback = 'Копирането не е достъпно. Маркирайте текста от прегледа.';
    }
  }

  async function share() {
    sharing = true;
    feedback = '';
    try {
      if (!navigator.share) {
        await copy();
        return;
      }
      await navigator.share({ title, text: summary });
      completion = 'shared';
      feedback = '';
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        completion = '';
        feedback = 'Споделянето не успя. Можете да копирате текста и да опитате отново.';
      }
    } finally { sharing = false; }
  }

</script>

<div class="dn-enquiry-entry" class:dn-enquiry-entry--import={true}>
  
    <div class="dn-enquiry-import-segments" role="group" aria-label="Начин за заявка">
      <button type="button" class:active={importMode === 'listing'} aria-pressed={importMode === 'listing'} onclick={() => { importMode = 'listing'; linkError = ''; infoError = ''; }}>Линк</button>
      <button type="button" class:active={importMode === 'criteria'} aria-pressed={importMode === 'criteria'} onclick={() => { importMode = 'criteria'; linkError = ''; infoError = ''; }}>Инфо</button>
    </div>

    {#if importMode === 'listing'}
      <label class="dn-sr-only" for="enquiry-listing-link">Линк към обява за внос</label>
      <div class="dn-enquiry-import-field">
        <Icon name="globe" size={20} strokeWidth={1.8} />
        <input id="enquiry-listing-link" bind:this={linkInput} value={link} oninput={(event) => { linkDraft = event.currentTarget.value; linkError = ''; }} type="url" inputmode="url" maxlength={2048} placeholder="Поставете линк към обява" autocomplete="off" autocapitalize="none" spellcheck={false} aria-invalid={linkError ? true : undefined} aria-describedby={linkError ? 'enquiry-link-error' : undefined} />
        <button type="button" class="dn-enquiry-import-go" onclick={open} aria-label="Продължи с обявата" aria-haspopup="dialog"><Icon name="arrow-right" size={20} strokeWidth={2} /></button>
      </div>
      {#if linkError}<p class="dn-enquiry-error" id="enquiry-link-error" role="alert">{linkError}</p>{/if}
    {:else}
      <div class="dn-enquiry-import-info">
        <label class="dn-sr-only" for="enquiry-import-info">Опишете автомобила, който търсите</label>
        <textarea id="enquiry-import-info" bind:value={importBrief} oninput={() => infoError = ''} maxlength={500} rows="2" placeholder="Напр. BMW X5, дизел, 2020+, xDrive…"></textarea>
        <div class="dn-enquiry-import-info__footer">
          <label><span>Бюджет до, €</span><input bind:value={budget} inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="40000" /></label>
          <button type="button" class="dn-enquiry-import-go" onclick={(event) => open(event, true)} aria-label="Продължи с описанието" aria-haspopup="dialog"><Icon name="arrow-right" size={20} strokeWidth={2} /></button>
        </div>
      </div>
      {#if infoError}<p class="dn-enquiry-error" role="alert">{infoError}</p>{/if}
    {/if}
    <a class="dn-enquiry-import-call" href={brand.phoneHref} aria-label={`Обади се на ${brand.phone}`}>
      <Icon name="phone" size={17} />
      <span>Обади се · {brand.phone}</span>
    </a>
  
</div>

<dialog class="dn-enquiry" class:dn-enquiry--import={true} aria-labelledby="enquiry-title" {@attach attachDialog} onclose={() => restore()} onkeydown={trapDialogTab} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <div class="dn-enquiry-panel">
    <header class="dn-enquiry-header">
      <div><h2 id="enquiry-title" tabindex="-1" bind:this={heading}>{step === 0 ? ('Автомобил за внос') : step === 1 ? ('Контакт и предпочитания') : 'Преглед на запитването'}</h2></div>
      <button class="dn-enquiry-close" type="button" aria-label="Затвори запитването" onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
    </header>
    <ol class="dn-enquiry-steps" aria-label="Стъпки на запитването">
      {#each steps as label, index (label)}<li class:current={step === index} class:complete={step > index} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>{/each}
    </ol>

    <form class="dn-enquiry-body" bind:this={form} oninput={(event) => fieldErrors = clearIdentityError(event, fieldErrors)} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        {#if selectedLink}<div class="dn-enquiry-selected-link"><Icon name="globe" size={20} /><span>{selectedLink}</span></div>{/if}
        
        <div class="dn-enquiry-fields" class:dn-enquiry-fields--import={true}>
          <label>Марка{#if !selectedLink && !importBrief.trim()}<span aria-hidden="true"> *</span>{/if}<input bind:value={make} name="make" aria-invalid={fieldErrors.make ? true : undefined} required={!selectedLink && !importBrief.trim()} maxlength={60} placeholder="Напр. Audi" autocomplete="off" /></label>
          <label>Модел{#if !selectedLink && !importBrief.trim()}<span aria-hidden="true"> *</span>{/if}<input bind:value={model} name="model" aria-invalid={fieldErrors.model ? true : undefined} required={!selectedLink && !importBrief.trim()} maxlength={80} placeholder="Напр. A6 Avant" autocomplete="off" /></label>
          
            <label class="wide">Бюджет до, € <span class="dn-enquiry-optional">по желание</span><input bind:value={budget} name="budget" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="Напр. 40000" /></label>
            <label class="wide">Година от <span class="dn-enquiry-optional">по желание</span><input bind:value={year} name="year" aria-invalid={fieldErrors.year ? true : undefined} type="text" inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="Напр. 2020" /></label>
          
        </div>
        <p class="dn-enquiry-note">{selectedLink ? 'Добавете предпочитания, ако се различават от обявата.' : importBrief.trim() ? 'Описанието от „Инфо“ е добавено към заявката. Допълнете само ако е нужно.' : '* Задължителни полета.'} Данните остават в тази страница до споделяне.</p>
      {:else if step === 1}
        
        <label class="dn-enquiry-notes">{'Предпочитания и допълнителна информация'}<textarea bind:value={notes} maxlength={1500} rows="3" placeholder={'Двигател, оборудване, държава, срок…'}></textarea></label>
        <div class="dn-enquiry-fields dn-enquiry-contact-fields">
          <label>Име <span class="dn-enquiry-optional">по желание</span><input bind:value={name} maxlength={80} autocomplete="name" /></label>
          <label>Телефон <span class="dn-enquiry-optional">по желание</span><input bind:value={phone} type="tel" maxlength={25} autocomplete="tel" /></label>
        </div>
      {:else}
        <div class="dn-enquiry-review-heading"><h3>Всичко на едно място</h3><button class="dn-enquiry-text-button" type="button" onclick={() => move(0)}>Редактирай</button></div>
        <pre class="dn-enquiry-summary">{summary}</pre>
        
        <div class="dn-enquiry-review-notice"><strong>{completion ? 'Запитването е подготвено.' : 'Запитването още не е изпратено.'}</strong><p>{'Изберете „Сподели запитването“ или копирайте текста към предпочитано приложение.'} За директен разговор: <a href={brand.phoneHref}>{brand.phone}</a>.</p></div>
        {#if completion}
          <div class="dn-enquiry-success" role="status">
            <Icon name="message" size={20} strokeWidth={1.8} />
            <div><strong>{completion === 'shared' ? 'Споделянето приключи' : 'Текстът е копиран'}</strong><p>{completion === 'shared' ? 'Ако приложението поиска потвърждение, завършете изпращането там.' : 'Поставете текста в приложението, през което искате да се свържете с екипа.'}</p></div>
          </div>
        {/if}
        <button class="dn-enquiry-copy" type="button" onclick={copy}>Копирай текста</button>
      {/if}
      {#if feedback}<p class="dn-enquiry-feedback" role="status">{feedback}</p>{/if}
    </form>

    <footer class="dn-enquiry-footer">
      {#if step > 0}<button class="dn-enquiry-back" type="button" onclick={() => move(step - 1)}><Icon name="arrow-left" size={18} />Назад</button>{/if}
      {#if step < 2}<button class="dn-enquiry-primary" type="button" onclick={() => move(step + 1)}>{step === 0 ? 'Продължи' : 'Прегледай запитването'}<Icon name="arrow-right" size={18} /></button>
      {:else}<button class="dn-enquiry-primary" type="button" disabled={sharing} onclick={share}>{sharing ? 'Отваряне…' : 'Сподели запитването'}<Icon name="arrow-right" size={18} /></button>{/if}
    </footer>
  </div>
</dialog>

<style>
  .dn-enquiry-entry { margin-top: 24px; }
  .dn-enquiry-entry--import { margin-top: 20px; }
  @media (max-width: 991px) {
    .dn-enquiry-entry { text-align: center; }
    .dn-enquiry-entry--import { text-align: left; }
  }
  button { cursor: pointer; font: inherit; }
  .dn-enquiry-primary { display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: center; gap: 12px; padding: 12px 20px; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 16px; font-weight: 600; line-height: 1.4; }
  .dn-enquiry-primary:hover { background: var(--dn-red-hover); }
  .dn-enquiry-primary:disabled { opacity: .6; cursor: wait; }
  .dn-enquiry-entry > p { margin: 10px 0 0; color: #5d626b; font-size: 14px; }
  .dn-enquiry-import-segments { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 4px; margin-bottom: 12px; padding: 4px; border-radius: var(--dn-radius-button); background: #eef0f2; }
  .dn-enquiry-import-segments button { min-height: 40px; border: 0; border-radius: var(--dn-radius-button); background: transparent; color: #666d77; font-size: 14px; font-weight: 700; }
  .dn-enquiry-import-segments button.active { background: #fff; color: #202329; box-shadow: 0 1px 4px rgba(17,22,29,.08); }
  .dn-enquiry-import-segments button:focus-visible { outline: 2px solid #202329; outline-offset: 2px; }
  .dn-enquiry-import-field { display: flex; min-height: 54px; align-items: center; gap: 10px; padding: 4px 4px 4px 16px; border-radius: var(--dn-radius-button); background: var(--dn-home-panel); color: var(--dn-muted); }
  .dn-enquiry-import-field input { width: 100%; min-width: 0; min-height: 46px; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: inherit; font-size: 16px; }
  .dn-enquiry-import-field input::placeholder { color: var(--dn-muted); opacity: 1; }
  .dn-enquiry-import-field:focus-within { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  .dn-enquiry-import-go { display: grid; width: 46px; height: 46px; flex: 0 0 46px; place-items: center; padding: 0; border: 0; border-radius: 50%; background: var(--dn-red); color: #fff; }
  .dn-enquiry-import-go:hover, .dn-enquiry-import-go:focus-visible { background: var(--dn-red-hover); }
  .dn-enquiry-import-info { overflow: hidden; border-radius: 18px; background: var(--dn-home-panel); }
  .dn-enquiry-import-info > textarea { display: block; width: 100%; min-height: 72px; margin: 0; padding: 14px 16px 8px; box-sizing: border-box; border: 0; outline: 0; resize: none; background: transparent; color: var(--dn-ink); font: inherit; font-size: 15px; line-height: 1.45; }
  .dn-enquiry-import-info > textarea::placeholder { color: var(--dn-muted); opacity: 1; }
  .dn-enquiry-import-info:focus-within { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  .dn-enquiry-import-info__footer { display: flex; align-items: end; gap: 10px; padding: 8px 4px 4px 16px; }
  .dn-enquiry-import-info__footer label { min-width: 0; flex: 1; color: #737a84; font-size: 10px; font-weight: 650; line-height: 1.2; }
  .dn-enquiry-import-info__footer label > span { display: block; margin-bottom: 2px; }
  .dn-enquiry-import-info__footer input { width: 100%; min-height: 28px; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dn-ink); font: inherit; font-size: 15px; font-weight: 600; }
  .dn-enquiry-import-info__footer .dn-enquiry-import-go { margin-left: auto; }
  .dn-enquiry-import-call { display: flex; width: fit-content; min-height: 44px; align-items: center; justify-content: center; gap: 7px; margin: 10px auto 0; padding: 8px 16px; border-radius: var(--dn-radius-button); background: #f1f2f4; color: #2d3238; font-size: 13px; font-weight: 650; text-decoration: none; }
  .dn-enquiry-import-call:is(:hover,:focus-visible) { background: #e7e9ec; }
  .dn-enquiry-text-button { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; padding: 8px 0; border: 0; background: transparent; color: #202329; font-size: 14px; font-weight: 600; text-align: left; text-decoration: underline; text-underline-offset: 4px; }
  :global(body:has(.dn-enquiry[open])) { position: fixed; top: var(--dn-enquiry-scroll, 0); width: 100%; overflow: hidden; }
  .dn-enquiry { width: min(620px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 48px); margin: auto; padding: 0; border: 0; border-radius: 20px; background: #fff; color: #202329; overflow: hidden; }
  .dn-enquiry::backdrop { background: rgba(8,10,14,.65); }
  .dn-enquiry-panel { display: flex; max-height: calc(100dvh - 48px); flex-direction: column; }
  .dn-enquiry-header { display: flex; flex: 0 0 auto; align-items: center; gap: 16px; padding: 24px 24px 18px; }
  .dn-enquiry-header > div { min-width: 0; flex: 1; }
  .dn-enquiry-header h2 { margin: 0; font-size: 24px; line-height: 1.25; letter-spacing: -.025em; }
  .dn-enquiry-close { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; border: 0; border-radius: 50%; background: #f2f3f5; color: #202329; }
  .dn-enquiry-steps { display: flex; flex: 0 0 auto; gap: 16px; margin: 0; padding: 0 24px 20px; list-style: none; border-bottom: 1px solid #e7e9ec; }
  .dn-enquiry-steps li { display: flex; align-items: center; gap: 6px; color: #656b74; font-size: 13px; }
  .dn-enquiry-steps span { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: #f2f3f5; font-size: 12px; }
  .dn-enquiry-steps .current { color: #202329; font-weight: 700; }
  .dn-enquiry-steps .current span { background: #202329; color: #fff; }
  .dn-enquiry-steps .complete span { background: #fbeaea; color: #a40000; }
  .dn-enquiry-body { min-height: 0; margin: 0; padding: 24px; overflow-y: auto; overscroll-behavior: contain; }
  .dn-enquiry-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px 14px; }
  .dn-enquiry-fields label, .dn-enquiry-notes { display: block; min-width: 0; font-size: 14px; font-weight: 600; }
  .dn-enquiry-fields input, textarea { display: block; width: 100%; min-height: 50px; margin-top: 8px; padding: 12px; box-sizing: border-box; border: 1px solid #d9dde2; border-radius: 12px; background: #fff; color: #202329; font: inherit; font-size: 16px; font-weight: 400; }
  input::placeholder, textarea::placeholder { color: #69717c; opacity: 1; }
  textarea { resize: vertical; }
  .wide { grid-column: 1 / -1; }
  .dn-enquiry-optional { display: inline-block; color: #656b74; font-size: 12px; font-weight: 400; }
  .dn-enquiry-note { margin: 16px 0 0; color: #656b74; font-size: 13px; line-height: 1.5; }
  .dn-enquiry-selected-link { display: flex; gap: 10px; margin-bottom: 20px; padding: 12px; border-radius: 12px; background: #f2f3f5; font-size: 14px; overflow-wrap: anywhere; }
  .dn-enquiry-selected-link :global(svg) { flex: 0 0 20px; }
  .dn-enquiry-review-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h3 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.4; }
  .dn-enquiry-contact-fields { margin-top: 20px; }
  .dn-enquiry-footer { display: flex; flex: 0 0 auto; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-enquiry-back { display: flex; min-height: 48px; align-items: center; gap: 6px; padding: 0 4px; border: 0; background: transparent; color: #202329; font-size: 14px; font-weight: 600; }
  .dn-enquiry-summary { margin: 16px 0; padding: 16px; border-radius: 12px; background: #f4f5f7; color: #202329; font: inherit; font-size: 15px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
  .dn-enquiry-review-notice { color: #525a66; font-size: 14px; line-height: 1.6; }
  .dn-enquiry-review-notice p { margin: 6px 0 0; }
  .dn-enquiry-review-notice a { color: #202329; text-decoration: underline; }
  .dn-enquiry-success { display: flex; gap: 11px; margin-top: 14px; padding: 14px; border-radius: 12px; background: #202329; color: #fff; }
  .dn-enquiry-success :global(svg) { flex: 0 0 20px; margin-top: 1px; color: #ff4a4f; }
  .dn-enquiry-success strong { font-size: 14px; line-height: 1.35; }
  .dn-enquiry-success p { margin: 4px 0 0; color: #d3d7dc; font-size: 13px; line-height: 1.45; }
  .dn-enquiry-copy { min-height: 44px; margin-top: 14px; padding: 10px 16px; border: 1px solid #d9dde2; border-radius: 12px; background: #fff; font-size: 14px; font-weight: 600; }
  .dn-enquiry-error, .dn-enquiry-entry > .dn-enquiry-error { color: #a40000; font-size: 14px; line-height: 1.5; }
  .dn-enquiry-feedback { padding: 12px; border-radius: 10px; background: #f2f3f5; font-size: 14px; line-height: 1.5; }
  @media (max-width: 767px) {
    .dn-enquiry-import-field { min-height: 44px; gap: 8px; padding: 0 0 0 14px; }
    .dn-enquiry-import-field input { min-height: 44px; }
    .dn-enquiry-import-go { width: 44px; height: 44px; flex-basis: 44px; }
    .dn-enquiry { inset: auto 0 0; width: 100%; height: calc(100dvh - max(24px,env(safe-area-inset-top))); max-height: 900px; margin: 0; border-radius: 24px 24px 0 0; }
    .dn-enquiry-panel { height: 100%; max-height: 100%; }
    .dn-enquiry-header { padding: 20px 16px 16px; }
    .dn-enquiry-header h2 { font-size: 22px; }
    .dn-enquiry-steps { gap: 14px; padding: 0 16px 16px; }
    .dn-enquiry-body { flex: 1; padding: 20px 16px; }
    .dn-enquiry-footer { padding: 12px 16px max(12px,env(safe-area-inset-bottom)); }
    .dn-enquiry-footer .dn-enquiry-primary { padding-inline: 12px; font-size: 15px; }
  }
  @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .dn-enquiry[open] { animation: enquiry-enter 220ms cubic-bezier(.16,1,.3,1); }
    @keyframes enquiry-enter { from { transform: translateY(32px); } to { transform: translateY(0); } }
  }
  @media (max-width: 767px) {
    .dn-enquiry--import .dn-enquiry-steps {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0;
      padding: 0 12px 14px;
    }
    .dn-enquiry--import .dn-enquiry-steps li {
      justify-content: center;
      gap: 5px;
      min-width: 0;
      font-size: 12px;
      white-space: nowrap;
    }
    .dn-enquiry--import .dn-enquiry-fields--import,
    .dn-enquiry--import .dn-enquiry-contact-fields { grid-template-columns: 1fr; gap: 14px; }
    .dn-enquiry--import .dn-enquiry-fields--import .wide { grid-column: auto; }
  }
  @media (max-width: 359px) {
    .dn-enquiry-steps { gap: 10px; }
    .dn-enquiry-steps li { font-size: 12px; }
    .dn-enquiry-fields { gap: 16px 10px; }
    .dn-enquiry-contact-fields { grid-template-columns: 1fr; }
  }
</style>
