<script lang="ts" module>
  export type ServiceEntryDraft = { reference: string; make: string; model: string; year: string; mileage: string; budget: string; brief: string };
</script>

<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { getI18n } from '$lib/locale/context';
  import { preserveScrollOffset, trapDialogTab } from '$lib/ui/overlay';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { parseVehicleReference } from '$data/vehicle-reference';
  import { resolveImportUrl } from '$data/company';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

  let { id, mode, value, onapply }: { id: string; mode: 'sell' | 'listing' | 'criteria'; value: ServiceEntryDraft; onapply: (draft: ServiceEntryDraft) => void } = $props();
  const i18n = getI18n();
  const title = $derived(i18n.t(mode === 'listing' ? 'service.url' : mode === 'sell' ? 'service.entry.vehicleTitle' : 'service.entry.criteriaTitle'));
  const placeholder = $derived(i18n.t(mode === 'sell' ? 'service.entry.vehicle' : mode === 'listing' ? 'service.url' : 'service.entry.criteria'));
  const summary = $derived(mode === 'listing' ? value.reference : [value.make, value.model, value.year].filter(Boolean).join(' ') || value.reference || value.brief);
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let trigger: HTMLButtonElement;
  let draft = $state<ServiceEntryDraft>({ reference: '', make: '', model: '', year: '', mileage: '', budget: '', brief: '' });
  let error = $state('');
  let opened = false;
  let returnFocus: HTMLElement;
  let releaseScroll: ((restoreScroll?: boolean) => void) | undefined;

  export async function edit(returnTo?: HTMLElement) {
    draft = { ...value };
    error = '';
    returnFocus = returnTo ?? trigger;
    if (!opened) releaseScroll = preserveScrollOffset('--dn-service-editor-scroll');
    opened = true;
    dialog.showModal();
    await tick();
    if (!dialog?.open || !dialog.isConnected) return;
    form.querySelector<HTMLInputElement>('input')?.focus();
  }
  function restore() { release(true); }

  function release(restoreScroll: boolean) {
    if (!opened) return;
    opened = false;
    releaseScroll?.(restoreScroll);
    releaseScroll = undefined;
    if (restoreScroll && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }
  function save(event: SubmitEvent) {
    event.preventDefault();
    const reference = draft.reference.trim();
    if (reference && !(mode === 'listing' ? resolveImportUrl(reference) : parseVehicleReference(reference))) {
      error = i18n.t(mode === 'listing' ? 'service.url.error' : 'm_4b200427f69a');
      form.querySelector<HTMLInputElement>('[name="reference"]')?.focus();
      return;
    }
    onapply(Object.fromEntries(Object.entries(draft).map(([key, text]) => [key, text.trim()])) as ServiceEntryDraft);
    dialog.close();
  }
  onDestroy(() => { release(false); if (dialog?.open) dialog.close(); });
</script>

<button {id} class="dn-service-entry__field dn-entry-field dn-entry-field--prominent" bind:this={trigger} type="button" onclick={() => edit()} aria-haspopup="dialog" aria-controls={`${id}-dialog`} aria-label={`${placeholder}${summary ? `: ${summary}` : ''}`} title={summary || placeholder}>
  <MobileActionIcon name={mode === 'listing' ? 'article' : 'search'} size={22} />
  <span class:placeholder={!summary}>{summary || placeholder}</span>
</button>

<dialog id={`${id}-dialog`} class="dn-service-editor" bind:this={dialog} {@attach dialogViewport} onkeydown={trapDialogTab} aria-labelledby={`${id}-title`} onclose={restore} onclick={(event) => { if (event.target === dialog) dialog.close(); }}>
    <header class="dn-mobile-overlay-heading dn-mobile-overlay-header"><h2 id={`${id}-title`}>{title}</h2><button class="dn-icon-button dn-overlay-close" type="button" aria-label={i18n.t('m_aea2bd97046c')} onclick={() => dialog.close()}><MobileActionIcon name="close" size={22} /></button></header>
  <form bind:this={form} onsubmit={save}>
    <div class="dn-service-editor__fields">
      {#if mode === 'listing'}
        <label>{i18n.t('service.url')}<input {@attach i18n.validation} name="reference" bind:value={draft.reference} oninput={() => error = ''} required maxlength={2048} inputmode="url" autocomplete="url" autocapitalize="none" spellcheck={false} placeholder={i18n.t('service.url.placeholder')} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} /></label>
      {:else}
        <label>{i18n.t('m_ccdd25d4230f')}<input {@attach i18n.validationFor(draft.reference.trim(), draft.brief.trim())} name="make" bind:value={draft.make} required={!draft.reference.trim() && !draft.brief.trim()} pattern={'.*\\S.*'} maxlength={60} placeholder={i18n.t('service.make.placeholder')} /></label>
        <label>{i18n.t('m_5e2c614c23f0')}<input {@attach i18n.validationFor(draft.reference.trim(), draft.brief.trim())} name="model" bind:value={draft.model} required={!draft.reference.trim() && !draft.brief.trim()} pattern={'.*\\S.*'} maxlength={80} placeholder={i18n.t('service.model.placeholder')} /></label>
        <div class="dn-service-editor__pair">
          <label>{i18n.t(mode === 'sell' ? 'm_89f6832560de' : 'service.yearFrom')}<input {@attach i18n.validation} name="year" bind:value={draft.year} inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="2020" /></label>
          {#if mode === 'sell'}<label>{i18n.t('m_694bea758e96')}<input {@attach i18n.validation} name="mileage" bind:value={draft.mileage} inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder="85000" /></label>
          {:else}<label>{i18n.t('service.budget')}<input {@attach i18n.validation} name="budget" bind:value={draft.budget} inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="25000" /></label>{/if}
        </div>
        {#if mode === 'sell'}<label>{i18n.t('service.reference')}<input {@attach i18n.validation} name="reference" bind:value={draft.reference} oninput={() => error = ''} maxlength={2048} autocomplete="off" autocapitalize="none" spellcheck={false} placeholder={i18n.t('service.url.placeholder')} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} /></label>
        {:else}<label>{i18n.t('service.entry.preferences')}<textarea {@attach i18n.validation} name="brief" bind:value={draft.brief} maxlength={1500} rows="3" placeholder={i18n.t('service.brief.placeholder')}></textarea></label>{/if}
      {/if}
      {#if error}<p id={`${id}-error`} role="alert">{error}</p>{/if}
    </div>
    <footer class="dn-mobile-overlay-footer"><button class="dn-service-editor__cancel dn-mobile-overlay-clear" type="button" onclick={() => dialog.close()}>{i18n.t('m_19766ed6ccb2')}</button><button class="dn-service-editor__save dn-mobile-overlay-action" type="submit">{i18n.t('m_1509f561f241')}</button></footer>
  </form>
</dialog>

<style>
  .dn-service-entry__field { display: flex; align-items: center; gap: var(--dn-space-2); width: 100%; min-height: var(--dn-entry-height); padding: var(--dn-space-2) var(--dn-space-3); color: var(--dn-entry-prominent-ink); font: var(--dn-entry-prominent-font); text-align: left; cursor: pointer; }
  .dn-service-entry__field > span { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-service-entry__field > :global(svg), .placeholder { color: var(--dn-entry-prominent-muted); }
  :global(body:has(.dn-service-editor[open])) { position: fixed; top: var(--dn-service-editor-scroll, 0); width: 100%; overflow: hidden; }
  .dn-service-editor { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: 100dvh; margin: 0; padding: 0; border: 0; border-radius: 0; background: var(--dn-white); color: var(--dn-ink); overflow: hidden; }
  .dn-service-editor[open] { display: flex; flex-direction: column; }
  .dn-service-editor::backdrop { background: rgb(0 0 0 / 55%); }
  header { display: flex; align-items: center; flex-shrink: 0; gap: var(--dn-space-3); padding: var(--dn-overlay-header-padding); border-bottom: 1px solid var(--dn-line); }
  h2 { flex: 1; min-width: 0; margin: 0; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); overflow-wrap: anywhere; }
  header button { border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); }
  form { display: flex; flex: 1; min-height: 0; flex-direction: column; }
  .dn-service-editor__fields { display: grid; gap: var(--dn-space-4); flex: 1; min-height: 0; align-content: start; padding: var(--dn-space-5) var(--dn-space-4); overflow-y: auto; overscroll-behavior: contain; }
  label { display: grid; min-width: 0; gap: var(--dn-space-2); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-meta); }
  input, textarea { width: 100%; min-width: 0; min-height: var(--dn-control-height-editor); padding: var(--dn-space-2) var(--dn-space-3); border: 0; border-radius: var(--dn-radius-control); background: var(--dn-entry-surface); color: var(--dn-ink); font: var(--dn-overlay-field-font); }
  textarea { resize: vertical; }
  .dn-service-editor__pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-3); }
  p { margin: 0; color: var(--dn-red); font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  footer { display: flex; flex-shrink: 0; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-4) max(var(--dn-space-3), env(safe-area-inset-bottom)); border-top: 1px solid var(--dn-line); }
  footer button { min-width: 0; min-height: var(--dn-overlay-control-height); padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-radius-button); overflow-wrap: anywhere; cursor: pointer; }
  .dn-service-editor__cancel { background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-overlay-option-font); }
  .dn-service-editor__save { background: var(--dn-primary-action-surface); color: var(--dn-white); font: var(--dn-overlay-action-font); }
  .dn-service-editor :is(button,input,textarea):focus-visible, .dn-service-entry__field:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  @media (max-width: 767px) {
    .dn-service-editor { inset: var(--dn-form-dialog-top) 0 auto; height: var(--dn-form-dialog-height); max-height: var(--dn-form-dialog-height); }
    form { overflow-y: auto; overscroll-behavior: contain; }
    .dn-service-editor__fields { flex: 0 0 auto; padding: var(--dn-space-3) var(--dn-overlay-gutter) var(--dn-space-5); overflow: visible; }
    input, textarea { min-height: var(--dn-overlay-control-height); border: 0; background: var(--dn-entry-surface); }
    .dn-service-editor :is(input, textarea):focus-visible { outline: 2px solid var(--dn-focus); outline-offset: -2px; }
    footer { border-top: 0; }
  }
</style>
