<script lang="ts">
  import EntrySegments from '$components/ui/entry/EntrySegments.svelte';
  import EntryInput from '$components/ui/entry/EntryInput.svelte';
  import EntryAction from '$components/ui/entry/EntryAction.svelte';
  import { preserveScrollOffset, trapDialogTab } from '$lib/ui/overlay';
  import { appendEnquiryPhotos, removeEnquiryPhoto, releaseEnquiryPhotos, type EnquiryPhoto } from '$lib/ui/enquiry-photos';
  import { shareEnquiry } from '$lib/ui/enquiry-share';
  import { getI18n } from '$lib/locale/context';
  import { templateMessage } from '$lib/i18n/presentation';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import { onDestroy, tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import Icon from '$components/ui/Icon.svelte';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { brand } from '$config/brand';
  import { resolveImportUrl } from '$data/company';
  import EnquiryEntryField from './EnquiryEntryField.svelte';
  import ServiceEntryField from './ServiceEntryField.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

  let { kind, importUrl = null, inlineEntry = false }: { kind: 'trade-in' | 'import'; importUrl?: string | null; inlineEntry?: boolean } = $props();
  let entryForm = $state<HTMLFormElement>();
  let entryError = $state('');
  let mobileEditor = $state<{ edit: (trigger?: HTMLElement) => Promise<void> }>();
  let mobileEntry = $state<HTMLDivElement>();

  async function chooseMobileMode() {
    await tick();
    await mobileEditor?.edit(mobileEntry?.querySelector<HTMLElement>('.dn-segmented-option[aria-pressed="true"]') ?? undefined);
  }
  async function startMobile(event: MouseEvent) {
    if (importMode === 'listing' ? !resolveImportUrl(link) : !importBrief.trim() && (!make.trim() || !model.trim())) {
      await mobileEditor?.edit(event.currentTarget as HTMLElement);
      return;
    }
    selectedLink = importMode === 'listing' ? resolveImportUrl(link)! : '';
    await show(event.currentTarget as HTMLElement, 1);
  }

  async function startInline(event: SubmitEvent) {
    event.preventDefault();
    if (!entryForm) return;
    entryError = '';
    if (importMode === 'listing' && !resolveImportUrl(link)) {
      entryError = i18n.t('service.url.error');
      entryForm.querySelector<HTMLInputElement>('[name="link"]')?.focus();
      return;
    }
    if (importMode === 'criteria' && !importBrief.trim()) {
      entryError = i18n.t('service.brief.error');
      entryForm.querySelector<HTMLTextAreaElement>('textarea')?.focus();
      return;
    }
    const nextLink = importMode === 'listing' ? resolveImportUrl(link)! : '';
    if (nextLink !== selectedLink) make = model = '';
    selectedLink = nextLink;
    await show(entryForm.querySelector<HTMLButtonElement>('button[type="submit"]')!, 1);
  }
  const selling = $derived(kind === 'trade-in');
  const title = $derived(selling ? i18n.t("m_e9c22777385c") : i18n.t("m_baac038ffb2d"));
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let heading: HTMLHeadingElement;
  const attachHeading = (node: HTMLHeadingElement) => { heading = node; };
  let entryEditor = $state<{ edit: (trigger?: HTMLElement) => Promise<void> }>();
  let returnFocus: HTMLElement | undefined;
  let releaseScroll: (() => void) | undefined;
  let step = $state(0);
  let opened = false;
  let linkDraft = $state<string | null>(null);
  let link = $derived(linkDraft ?? importUrl ?? '');
  let importMode = $state<'listing' | 'criteria'>('listing');
  let importBrief = $state('');
  let selectedLink = $state('');
  let make = $state('');
  let model = $state('');
  let year = $state('');
  let mileage = $state('');
  let budget = $state('');
  let purpose = $state('Продажба');
  let name = $state('');
  let phone = $state('');
  let notes = $state('');
  let photos = $state<EnquiryPhoto[]>([]);
  let photoError = $state('');
  let feedback = $state('');
  let completion = $state<'copied' | 'shared' | ''>('');
  let sharing = $state(false);
  const steps = $derived(selling ? [i18n.t("m_a5cdf07dbbc1"), i18n.t("m_45989de49fb7"), i18n.t("m_324b134f57c7")] : [i18n.t("m_a5cdf07dbbc1"), i18n.t("m_5bc9a8a2e214"), i18n.t("m_324b134f57c7")]);
  const summary = $derived([
    selling ? i18n.t("m_2ee4aeaeed3a", { p0: (purpose === 'Продажба' ? i18n.t("m_05e9f7818f00") : i18n.t("m_b4acafc27b89")).toLocaleLowerCase(i18n.locale) }) : i18n.t("m_baac038ffb2d"),
    selectedLink ? i18n.t("m_3d81d80b3a9d", { p0: selectedLink }) : '',
    !selling && !selectedLink && importBrief.trim() ? i18n.t("m_7f1f82d2481c", { p0: importBrief.trim() }) : '',
    i18n.t("m_fa6a6c46af78", { p0: [make.trim(), model.trim()].filter(Boolean).join(' ') || (selectedLink ? i18n.t("m_a09b0fd6d696") : i18n.t("m_5e16ae13452a")) }),
    year ? i18n.t("m_07e3a63ea0ed", { p0: selling ? i18n.t("m_89f6832560de") : i18n.t("m_349ee8568241"), p1: year }) : '',
    mileage ? i18n.t("m_a9d49d7c030f", { p0: mileage }) : '',
    budget ? i18n.t("m_8595ecd7692d", { p0: selling ? i18n.t("m_dceb61c9ef43") : i18n.t("m_84e960d40ad5"), p1: budget }) : '',
    notes.trim() ? i18n.t("m_bf55e322d7eb", { p0: notes.trim() }) : '',
    name.trim() ? i18n.t("m_0e553c290508", { p0: name.trim() }) : '',
    phone.trim() ? i18n.t("m_7e03674f09cb", { p0: phone.trim() }) : '',
    photos.length ? i18n.t("m_f5274ba7e075", { p0: photos.length }) : ''
  ].filter(Boolean).join('\n'));

  const attachDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      if (opened) restore();
    };
  };

  async function open(event: MouseEvent, withoutLink = false) {
    if (!selling && withoutLink && !importBrief.trim()) {
      await entryEditor?.edit(event.currentTarget as HTMLElement);
      return;
    }
    if (!selling && !withoutLink && !resolveImportUrl(link)) {
      await entryEditor?.edit(event.currentTarget as HTMLElement);
      return;
    }
    const nextLink = selling || withoutLink ? '' : resolveImportUrl(link) || '';
    if (nextLink !== selectedLink) step = 0;
    selectedLink = nextLink;
    await show(event.currentTarget as HTMLElement, step);
  }

  async function show(trigger: HTMLElement, nextStep: number) {
    step = nextStep;
    returnFocus = trigger;
    releaseScroll = preserveScrollOffset('--dn-enquiry-scroll');
    opened = true;
    feedback = '';
    completion = '';
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function restore() {
    if (!opened) return;
    opened = false;
    releaseScroll?.();
    releaseScroll = undefined;
    returnFocus?.isConnected && returnFocus.focus({ preventScroll: true });
  }

  async function move(next: number) {
    if (next > step && !form.reportValidity()) return;
    step = next;
    feedback = '';
    await tick();
    heading.focus();
    form.scrollTop = 0;
  }

  function addPhotos(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    try {
      const result = appendEnquiryPhotos(photos, Array.from(input.files ?? []));
      photos = result.photos;
      photoError = result.error === 'type' ? i18n.t("m_df14621607d6")
        : result.error === 'size' ? i18n.t("m_c1140eeec913")
        : result.error === 'limit' ? 'Можете да добавите до 6 снимки.' : '';
    } finally { input.value = ''; }
  }

  function removePhoto(url: string) {
    photos = removeEnquiryPhoto(photos, url);
    photoError = '';
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      completion = selling ? '' : 'copied';
      feedback = selling ? i18n.t("m_a31b0195adee") : i18n.t("m_b80eb3124705");
    } catch {
      completion = '';
      feedback = i18n.t("m_f60ca9ae19cd");
    }
  }

  async function share() {
    if (sharing) return;
    sharing = true;
    feedback = '';
    try {
      const files = photos.map(photo => photo.file);
      const result = await shareEnquiry({ title: title, text: summary, ...(files.length ? { files } : {}) });
      if (result === 'unsupported-files') feedback = 'Този браузър не може да споделя снимки. Копирайте текста и добавете снимките в избраното приложение.';
      else if (result === 'copy') await copy();
      else if (result === 'shared') {
        completion = selling ? '' : 'shared';
        feedback = selling ? i18n.t("m_09fcdf658591") : '';
      } else if (result === 'failed') {
        completion = '';
        feedback = i18n.t("m_f1eb07fa5cd0");
      }
    } finally { sharing = false; }
  }

  onDestroy(() => releaseEnquiryPhotos(photos));
</script>

{#if inlineEntry}
  <div class="dn-service-entry dn-service-entry--mobile" bind:this={mobileEntry}>
    <EntrySegments class="dn-service-entry__choices" bind:value={importMode} label={i18n.t('service.method')} onchange={chooseMobileMode} options={[{ value: 'listing', label: i18n.t('service.listing') }, { value: 'criteria', label: i18n.t('service.search') }]} />
    <ServiceEntryField id="import-service-field" mode={importMode} bind:this={mobileEditor} value={{ reference: importMode === 'listing' ? link : '', make, model, year, mileage: '', budget, brief: importBrief }} onapply={(draft) => { if (importMode === 'listing') linkDraft = draft.reference; else { ({ make, model, year, budget } = draft); importBrief = draft.brief; } }} />
    <EntryAction class="dn-service-entry__submit" type="button" dialog onclick={startMobile} aria-label={i18n.t('action.requestImport')}>{i18n.t('action.requestShort')}</EntryAction>
  </div>
  <form class="dn-service-entry dn-service-entry--desktop" bind:this={entryForm} onsubmit={startInline}>
    <EntrySegments class="dn-service-entry__choices" bind:value={importMode} label={i18n.t('service.method')} onchange={() => entryError = ''} options={[{ value: 'listing', label: i18n.t('service.listing') }, { value: 'criteria', label: i18n.t('service.search') }]} />
    {#if importMode === 'listing'}
      <div class="dn-service-entry__listing"><label><span class="dn-service-entry__sr">{i18n.t('service.url')}</span><EntryInput name="link" value={link} oninput={(event) => { linkDraft = event.currentTarget.value; entryError = ''; }} required maxlength={2048} inputmode="url" autocomplete="url" autocapitalize="none" spellcheck={false} placeholder={i18n.t('service.url')} aria-invalid={entryError ? true : undefined} aria-describedby={entryError ? 'import-entry-error' : undefined} /></label>
      {#if entryError}<p class="dn-service-entry__error" id="import-entry-error" role="alert">{entryError}</p>{/if}</div>
    {:else}
      <div><label>{i18n.t('service.brief')}<textarea class="dn-entry-field dn-entry-field--multiline" {@attach i18n.validation} name="brief" bind:value={importBrief} oninput={() => entryError = ''} required maxlength={1500} rows="3" placeholder={i18n.t('service.brief.placeholder')} aria-invalid={entryError ? true : undefined} aria-describedby={entryError ? 'import-brief-error' : undefined}></textarea></label>
      {#if entryError}<p class="dn-service-entry__error" id="import-brief-error" role="alert">{entryError}</p>{/if}</div>
    {/if}
    {#if importMode === 'criteria'}<div class="dn-service-entry__fields">
      <label>{i18n.t('service.budget')}<EntryInput name="budget" bind:value={budget} inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="25000" /></label>
      <label>{i18n.t('service.yearFrom')}<EntryInput name="year" bind:value={year} inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="2020" /></label>
    </div>
    {/if}
    <EntryAction class="dn-service-entry__submit" dialog>{i18n.t('action.requestImport')}</EntryAction>
  </form>
{:else}
<div class="dn-enquiry-entry" class:dn-enquiry-entry--import={!selling}>
  {#if selling}
    <button class="dn-enquiry-entry-action dn-compact-control dn-entry-action dn-compact-primary" type="button" onclick={open} aria-haspopup="dialog">
      {i18n.t("m_e9c22777385c")} <Icon name="arrow-right" size={15} />
    </button>
    <a class="dn-enquiry-contact" href={i18n.href(resolve('/contact'))}>{i18n.t("m_d7def4b82f7c")}</a>
  {:else}
    <div class="dn-enquiry-import-segments dn-segmented-control" role="group" aria-label={i18n.t("m_327655567493")}>
      <button class="dn-segmented-option" type="button" class:active={importMode === 'listing'} aria-pressed={importMode === 'listing'} onclick={() => importMode = 'listing'}>{i18n.t("m_9acf73f5ad78")}</button>
      <button class="dn-segmented-option" type="button" class:active={importMode === 'criteria'} aria-pressed={importMode === 'criteria'} onclick={() => importMode = 'criteria'}>{i18n.t("m_1cb0ba125f84")}</button>
    </div>

    <div class="dn-enquiry-import-field">
      <EnquiryEntryField id="enquiry-entry" kind={importMode === 'listing' ? 'listing' : 'criteria'} value={importMode === 'listing' ? link : importBrief} {budget} bind:this={entryEditor} onapply={(value, nextBudget) => { if (importMode === 'listing') linkDraft = value; else { importBrief = value; budget = nextBudget; } }} />
    </div>
    <button type="button" class="dn-enquiry-import-go dn-compact-control dn-entry-action dn-compact-primary" onclick={(event) => open(event, importMode === 'criteria')} aria-haspopup="dialog">{i18n.t("action.requestImport")} <Icon name="arrow-right" size={15} /></button>
  {/if}
</div>
{/if}

<dialog onkeydown={trapDialogTab} {@attach dialogViewport} class="dn-enquiry" class:dn-enquiry--import={!selling} aria-labelledby="enquiry-title" {@attach attachDialog} onclose={restore} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <div class="dn-enquiry-panel">
    <header class="dn-mobile-overlay-heading dn-enquiry-header">
      <div><h2 id="enquiry-title" tabindex="-1" {@attach attachHeading}>{step === 0 ? (selling ? title : i18n.t("m_302415e752d4")) : step === 1 ? (selling ? i18n.t("m_0cd108851eb3") : i18n.t("m_a7f00a2555a1")) : i18n.t("m_a12d84419d88")}</h2></div>
      <button class="dn-enquiry-close dn-icon-button" type="button" aria-label={i18n.t("m_0a778b356dc9")} onclick={() => dialog.close()}><span class="dn-mobile-overlay-icon"><MobileActionIcon name="close" /></span><span class="dn-desktop-overlay-icon"><Icon name="x" size={22} /></span></button>
    </header>
    <ol class="dn-enquiry-steps" aria-label={i18n.t("m_0781a49bafd0")}>
      {#each steps as label, index (label)}<li class:current={step === index} class:complete={step > index} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>{/each}
    </ol>

    <form class="dn-enquiry-body" bind:this={form} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        {#if selectedLink}<div class="dn-enquiry-selected-link"><Icon name="globe" size={20} /><span>{selectedLink}</span></div>{/if}
        {#if inlineEntry && !selectedLink}<label class="dn-enquiry-notes">{i18n.t('service.brief')}<textarea {@attach i18n.validation} bind:value={importBrief} required={!make.trim() || !model.trim()} maxlength={1500} rows="3"></textarea></label>{/if}
        {#if selling}
          <fieldset class="dn-enquiry-purpose"><legend>{i18n.t("m_fc067643a1cf")}</legend>{#each ['Продажба', 'Бартер'] as option (option)}<label><input {@attach i18n.validation} type="radio" bind:group={purpose} value={option} />{i18n.t(option === 'Продажба' ? 'enquiry.purpose.sell' : 'enquiry.purpose.tradeIn')}</label>{/each}</fieldset>
        {/if}
        <div class="dn-enquiry-fields" class:dn-enquiry-fields--import={!selling}>
          <label>{i18n.t("m_ccdd25d4230f")}{#if !selectedLink && !importBrief.trim()}<span aria-hidden="true"> *</span>{/if}<input {@attach i18n.validationFor(!selectedLink && !importBrief.trim())} bind:value={make} name="make" required={!selectedLink && !importBrief.trim()} maxlength={60} placeholder={i18n.t("m_17276dea547a")} autocomplete="off" /></label>
          <label>{i18n.t("m_5e2c614c23f0")}{#if !selectedLink && !importBrief.trim()}<span aria-hidden="true"> *</span>{/if}<input {@attach i18n.validationFor(!selectedLink && !importBrief.trim())} bind:value={model} name="model" required={!selectedLink && !importBrief.trim()} maxlength={80} placeholder={i18n.t("m_b56e9229b722")} autocomplete="off" /></label>
          {#if selling}
            <label>{i18n.t("m_89f6832560de")}<input {@attach i18n.validation} bind:value={year} name="year" type="text" inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder={i18n.t("m_477a6fc28dca")} /></label>
            <label>{i18n.t("m_694bea758e96")}<input {@attach i18n.validation} bind:value={mileage} name="mileage" inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder={i18n.t("m_c2e646d2a93c")} /></label>
            <label>{i18n.t("m_3af322c55a45")} <span class="dn-enquiry-optional">{i18n.t("m_d42086812b73")}</span><input {@attach i18n.validation} bind:value={budget} name="budget" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder={i18n.t("m_3241a6d5a4a1")} /></label>
          {:else}
            <label class="wide">{i18n.t("m_8acd908fb4a9")} <span class="dn-enquiry-optional">{i18n.t("m_d42086812b73")}</span><input {@attach i18n.validation} bind:value={budget} name="budget" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder={i18n.t("m_a3118f4a3ea4")} /></label>
            <label class="wide">{i18n.t("m_349ee8568241")} <span class="dn-enquiry-optional">{i18n.t("m_d42086812b73")}</span><input {@attach i18n.validation} bind:value={year} name="year" type="text" inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder={i18n.t("m_477a6fc28dca")} /></label>
          {/if}
        </div>
        <p class="dn-enquiry-note">{i18n.t("m_2448f6f6a9e0", { p0: selectedLink ? i18n.t("m_fdcadc12dfbb") : importBrief.trim() ? i18n.t("m_56b6b96fab32") : i18n.t("m_68848f2899e3") })}</p>
      {:else if step === 1}
        {#if selling}
          <div class="dn-enquiry-photos">
            <div class="dn-enquiry-photo-heading"><h3>{i18n.t("m_bda056c9ed24")}</h3><span>{photos.length}/6</span></div>
            <p>{i18n.t("m_82563c44c04c")}</p>
            <label class="dn-enquiry-upload"><Icon name="car" size={24} /><span>{i18n.t("m_ed13ae7913f0")}<small>{i18n.t("m_a17d08dfdf3e")}</small></span><input {@attach i18n.validation} type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} aria-label={i18n.t("m_e44ab8a34c3d")} /></label>
            {#if photoError}<p class="dn-enquiry-error" role="alert">{photoError}</p>{/if}
            {#if photos.length}<ul class="dn-enquiry-photo-grid">{#each photos as photo (photo.url)}<li><img src={photo.url} alt={photo.file.name} onerror={() => { removePhoto(photo.url); photoError = i18n.t("m_3ef87b0ab024"); }} /><button type="button" aria-label={i18n.t("m_ef5e8d630d53", { p0: photo.file.name })} onclick={() => removePhoto(photo.url)}><Icon name="x" size={16} /></button></li>{/each}</ul>{/if}
            <p class="dn-enquiry-note">{i18n.t("m_d6f32b7a78e8")}</p>
          </div>
        {/if}
        <label class="dn-enquiry-notes">{selling ? i18n.t("m_7dcadcfd5cfa") : i18n.t("m_5b1b33d291b9")}<textarea {@attach i18n.validation} bind:value={notes} maxlength={1500} rows="3" placeholder={selling ? i18n.t("m_fe2c654eeaf7") : i18n.t("m_4e214572c72b")}></textarea></label>
        <div class="dn-enquiry-fields dn-enquiry-contact-fields">
          <label>{i18n.t("m_dcd1d5223f73")} <span class="dn-enquiry-optional">{i18n.t("m_d42086812b73")}</span><input {@attach i18n.validation} bind:value={name} maxlength={80} autocomplete="name" /></label>
          <label>{i18n.t("m_63dceb8800b2")} <span class="dn-enquiry-optional">{i18n.t("m_d42086812b73")}</span><input {@attach i18n.validation} bind:value={phone} type="tel" maxlength={25} autocomplete="tel" /></label>
        </div>
      {:else}
        <div class="dn-enquiry-review-heading"><h3>{i18n.t("m_b727fe8a7176")}</h3><button class="dn-enquiry-text-button" type="button" onclick={() => move(0)}>{i18n.t("m_69bd6f7ec2e5")}</button></div>
        <pre class="dn-enquiry-summary">{summary}</pre>
        {#if photos.length}<div class="dn-enquiry-review-photos">{#each photos as photo (photo.url)}<img src={photo.url} alt={photo.file.name} />{/each}</div>{/if}
        <div class="dn-enquiry-review-notice"><strong>{completion ? i18n.t("m_ef7923d4d40b") : i18n.t("m_af283c91201e")}</strong><p>{templateMessage(i18n, "{p0} About директен разговор:", { p0: selling ? i18n.t("m_b17e7a14f1a9") : i18n.t("m_7122ee6ded29") })} <a href={i18n.href(brand.phoneHref)}>{brand.phone}</a>.</p></div>
        {#if completion}
          <div class="dn-enquiry-success" role="status">
            <Icon name="message" size={20} strokeWidth={1.8} />
            <div><strong>{completion === 'shared' ? i18n.t("m_b745b0b76701") : i18n.t("m_7d685602bbae")}</strong><p>{completion === 'shared' ? i18n.t("m_c38e258bf613") : i18n.t("m_c332e0355076")}</p></div>
          </div>
        {/if}
        <button class="dn-enquiry-copy" type="button" onclick={copy}>{i18n.t("m_2ac82d9b4ca8")}</button>
      {/if}
      {#if feedback}<p class="dn-enquiry-feedback" role="status">{feedback}</p>{/if}
    </form>

    <footer class="dn-enquiry-footer dn-mobile-overlay-footer">
      {#if step > 0}<button class="dn-enquiry-back dn-mobile-overlay-clear" type="button" onclick={() => move(step - 1)}><Icon name="arrow-left" size={18} />{i18n.t("m_76900f1bfd16")}</button>{/if}
      {#if step < 2}<button class="dn-enquiry-primary dn-mobile-overlay-action" type="button" onclick={() => move(step + 1)}><span class="dn-overlay-action-label">{step === 0 ? i18n.t("m_31fbef162594") : i18n.t("m_21ab579a4c37")}</span><Icon name="arrow-right" size={18} /></button>
      {:else}<button class="dn-enquiry-primary" type="button" disabled={sharing} onclick={share}><span class="dn-overlay-action-label">{sharing ? i18n.t("m_7001d98040b4") : i18n.t("m_2aaec190e1b0")}</span><Icon name="arrow-right" size={18} /></button>{/if}
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
  .dn-enquiry-primary { min-width: 0; overflow-wrap: anywhere; display: flex; width: 100%; min-height: var(--dn-control-height-default); align-items: center; justify-content: center; gap: var(--dn-entry-action-gap); padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-primary-action-surface); color: #fff; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); line-height: var(--dn-leading-control); }
  .dn-enquiry-primary:hover { background: var(--dn-primary-action-surface-hover); }
  .dn-enquiry-primary:disabled { opacity: .6; cursor: wait; }
  .dn-enquiry-contact { display: flex; width: fit-content; min-height: var(--dn-control-height-default); align-items: center; justify-content: center; margin: 8px auto 0; padding: 0 var(--dn-space-5); border-radius: var(--dn-radius-button); background: #f2f3f5; color: #24272c; font: var(--dn-compact-control-font); }
  .dn-enquiry-import-segments { width: var(--dn-entry-segment-width); margin: 0 auto var(--dn-space-3); }
  .dn-enquiry-entry-action { margin-inline: auto; }
  .dn-enquiry-import-go { margin: var(--dn-space-3) auto 0; }
  .dn-enquiry-text-button { display: inline-flex; min-height: var(--dn-control-height-default); align-items: center; gap: var(--dn-entry-action-gap); padding: 0; border: 0; background: transparent; color: #202329; font: var(--dn-compact-control-font); text-align: left; text-decoration: underline; text-underline-offset: 4px; }
  :global(body:has(.dn-enquiry[open])) { position: fixed; top: var(--dn-enquiry-scroll, 0); width: 100%; overflow: hidden; }
  .dn-enquiry { width: min(620px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 48px); margin: auto; padding: 0; border: 0; border-radius: var(--dn-radius-lg); background: #fff; color: #202329; overflow: hidden; }
  .dn-enquiry::backdrop { background: rgba(8,10,14,.65); }
  .dn-enquiry-panel { display: flex; container-type: inline-size; max-height: calc(100dvh - 48px); flex-direction: column; }
  .dn-enquiry-header { display: flex; flex: 0 0 auto; align-items: center; gap: 16px; padding: 24px 24px 18px; }
  .dn-enquiry-header > div { min-width: 0; flex: 1; }
  .dn-enquiry-header h2 { margin: 0; font-size: var(--dn-text-subheading); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); overflow-wrap: anywhere; }
  .dn-enquiry-close { border: 0; border-radius: var(--dn-radius-circle); background: #f2f3f5; color: #202329; }
  .dn-enquiry-steps { display: flex; flex: 0 0 auto; gap: 16px; margin: 0; padding: 0 24px 20px; list-style: none; border-bottom: 1px solid #e7e9ec; }
  .dn-enquiry-steps li { display: flex; min-width: 0; align-items: center; gap: 6px; color: #656b74; font-size: var(--dn-text-meta); overflow-wrap: anywhere; }
  .dn-enquiry-steps span { display: grid; flex-shrink: 0; width: max(24px, 1.5em); height: max(24px, 1.5em); place-items: center; border-radius: var(--dn-radius-circle); background: #f2f3f5; font-size: var(--dn-text-meta); }
  .dn-enquiry-steps .current { color: #202329; font-weight: var(--dn-weight-semibold); }
  .dn-enquiry-steps .current span { background: #202329; color: #fff; }
  .dn-enquiry-steps .complete span { background: #fbeaea; color: #a40000; }
  .dn-enquiry-body { min-height: 0; margin: 0; padding: 24px; overflow-y: auto; overscroll-behavior: contain; }
  .dn-enquiry-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px 14px; }
  .dn-enquiry-fields label, .dn-enquiry-notes { display: block; min-width: 0; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-enquiry-fields input, textarea { display: block; width: 100%; min-height: var(--dn-control-height-editor); margin-top: 8px; padding: var(--dn-space-2) var(--dn-space-3); box-sizing: border-box; border: 1px solid #d9dde2; border-radius: var(--dn-radius-control); background: #fff; color: #202329; font: var(--dn-entry-font); }
  input::placeholder, textarea::placeholder { color: #69717c; opacity: 1; }
  textarea { resize: vertical; }
  .wide { grid-column: 1 / -1; }
  .dn-enquiry-optional { display: inline-block; color: #656b74; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-regular); }
  .dn-enquiry-purpose { display: flex; gap: 8px; margin: 0 0 22px; padding: 0; border: 0; }
  .dn-enquiry-purpose legend { margin-bottom: 10px; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-enquiry-purpose label { display: flex; min-height: 44px; flex: 1; align-items: center; justify-content: center; gap: 8px; border: 1px solid #d9dde2; border-radius: var(--dn-radius-control); font: var(--dn-compact-control-font); cursor: pointer; }
  .dn-enquiry-purpose label:has(:checked) { border-color: #202329; background: #f2f3f5; }
  .dn-enquiry-purpose input { accent-color: #202329; }
  .dn-enquiry-note { margin: 16px 0 0; color: #656b74; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-enquiry-selected-link { display: flex; gap: 10px; margin-bottom: 20px; padding: 12px; border-radius: var(--dn-radius-control); background: #f2f3f5; font-size: var(--dn-text-meta); overflow-wrap: anywhere; }
  .dn-enquiry-selected-link :global(svg) { flex: 0 0 20px; }
  .dn-enquiry-photo-heading, .dn-enquiry-review-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h3 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-meta); }
  .dn-enquiry-photo-heading > span { color: #656b74; font-size: var(--dn-text-meta); }
  .dn-enquiry-photos > p:not(.dn-enquiry-error) { margin: 8px 0 14px; color: #656b74; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-enquiry-upload { position: relative; display: flex; min-height: 80px; align-items: center; justify-content: center; gap: 14px; padding: 12px; border: 1px dashed #aeb5bf; border-radius: var(--dn-radius-control); cursor: pointer; }
  .dn-enquiry-upload > span { font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
  .dn-enquiry-upload small { display: block; margin-top: 4px; font-size: var(--dn-text-meta); color: #656b74; font-weight: var(--dn-weight-regular); }
  .dn-enquiry-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .dn-enquiry-upload:focus-within { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  .dn-enquiry-photo-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; padding: 0; margin: 14px 0; list-style: none; }
  .dn-enquiry-photo-grid li { position: relative; min-width: 0; }
  .dn-enquiry-photo-grid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: var(--dn-radius-sm); }
  .dn-enquiry-photo-grid button { position: absolute; top: 3px; right: 3px; display: grid; width: 44px; height: 44px; place-items: center; border: 0; border-radius: var(--dn-radius-circle); background: #fff; color: #202329; }
  .dn-enquiry-contact-fields { margin-top: 20px; }
  .dn-enquiry-footer { display: flex; flex: 0 0 auto; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-enquiry-footer .dn-enquiry-primary { flex: 1 1 8rem; width: auto; }
  .dn-enquiry-back { min-width: 0; max-width: 100%; overflow-wrap: anywhere; display: flex; min-height: var(--dn-control-height-default); align-items: center; gap: var(--dn-entry-action-gap); padding: 0 4px; border: 0; background: transparent; color: #202329; font: var(--dn-compact-control-font); }
  .dn-enquiry-summary { margin: 16px 0; padding: 16px; border-radius: var(--dn-radius-control); background: #f4f5f7; color: #202329; font: inherit; font-size: var(--dn-text-body); line-height: var(--dn-leading-prose); white-space: pre-wrap; overflow-wrap: anywhere; }
  .dn-enquiry-review-photos { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; }
  .dn-enquiry-review-photos img { width: 88px; height: 66px; flex: 0 0 88px; object-fit: cover; border-radius: var(--dn-radius-media); }
  .dn-enquiry-review-notice { color: #525a66; font-size: var(--dn-text-meta); line-height: var(--dn-leading-prose); }
  .dn-enquiry-review-notice p { margin: 6px 0 0; }
  .dn-enquiry-review-notice a { color: #202329; text-decoration: underline; }
  .dn-enquiry-success { display: flex; gap: 11px; margin-top: 14px; padding: 14px; border-radius: var(--dn-radius-control); background: #202329; color: #fff; }
  .dn-enquiry-success :global(svg) { flex: 0 0 20px; margin-top: 1px; color: #ff4a4f; }
  .dn-enquiry-success strong { font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-enquiry-success p { margin: 4px 0 0; color: #d3d7dc; font-size: var(--dn-text-body); line-height: var(--dn-leading-meta); }
  .dn-enquiry-copy { min-height: var(--dn-control-height-default); margin-top: 14px; padding: 0 var(--dn-space-4); border: 1px solid #d9dde2; border-radius: var(--dn-radius-control); background: #fff; font: var(--dn-compact-control-font); }
  .dn-enquiry-error { color: #a40000; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-enquiry-feedback { padding: 12px; border-radius: var(--dn-radius-sm); background: #f2f3f5; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  @media (max-width: 767px) {
    .dn-enquiry-selected-link, .dn-enquiry-summary, .dn-enquiry-success, .dn-enquiry-feedback { border-radius: var(--dn-radius-card); }
    .dn-enquiry-review-photos img { border-radius: var(--dn-radius-sm); }
    .dn-enquiry { position: fixed; inset: 0; width: 100%; height: 100dvh; max-height: 100dvh; margin: 0; border-radius: 0; }
    .dn-enquiry-panel { height: 100%; max-height: 100%; }
    .dn-enquiry-header { padding: var(--dn-overlay-header-padding); }
    .dn-enquiry-header h2 { font-size: var(--dn-text-subheading); }
    .dn-enquiry-steps { gap: 14px; padding: 0 16px 16px; }
    .dn-enquiry-body { flex: 1; padding: var(--dn-space-5) var(--dn-overlay-gutter); }
    .dn-enquiry-fields label, .dn-enquiry-notes { font-weight: var(--dn-weight-medium); }
    .dn-enquiry-fields input, textarea { min-height: var(--dn-overlay-control-height); border: 0; background: var(--dn-entry-surface); font: var(--dn-overlay-field-font); }
    .dn-enquiry-fields input:focus, textarea:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
    .dn-enquiry-footer { padding: 12px 16px max(12px,env(safe-area-inset-bottom)); }
    .dn-enquiry-footer .dn-enquiry-primary { min-width: 0; overflow-wrap: anywhere; padding-inline: 12px; font-size: var(--dn-cta-size); }
  }
  @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .dn-enquiry[open] { animation: enquiry-enter 220ms cubic-bezier(.16,1,.3,1); }
    @keyframes enquiry-enter { from { transform: translateY(-12px); } to { transform: translateY(0); } }
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
      font-size: var(--dn-text-meta);
      flex-wrap: wrap;
      text-align: center;
    }
    .dn-enquiry--import .dn-enquiry-fields--import,
    .dn-enquiry--import .dn-enquiry-contact-fields { grid-template-columns: 1fr; gap: 14px; }
    .dn-enquiry--import .dn-enquiry-fields--import .wide { grid-column: auto; }
  }
  @media (max-width: 359px) {
    .dn-enquiry-steps { gap: 10px; }
    .dn-enquiry-steps li { font-size: var(--dn-text-meta); }
    .dn-enquiry-fields { gap: 16px 10px; }
    .dn-enquiry-contact-fields { grid-template-columns: 1fr; }
  }
  @container (max-width: 15rem) {
    .dn-enquiry--import .dn-enquiry-steps { grid-template-columns: minmax(0, 1fr); gap: var(--dn-space-2); }
    .dn-enquiry--import .dn-enquiry-steps li { flex-wrap: nowrap; justify-content: flex-start; text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-enquiry[open] { animation: none; }
  }
</style>
