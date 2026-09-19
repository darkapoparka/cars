<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { parseVehicleReference } from '$data/vehicle-reference';

  let { id, kind, value, budget = '', onapply }: {
    id: string;
    kind: 'reference' | 'listing' | 'criteria';
    value: string;
    budget?: string;
    onapply: (value: string, budget: string) => void;
  } = $props();
  const copy = $derived({
    reference: { title: 'Обява или VIN', label: 'Линк към обява или VIN', placeholder: 'Линк или VIN' },
    listing: { title: 'Обява за внос', label: 'Линк към обява за внос', placeholder: 'Линк към обява' },
    criteria: { title: 'Какъв автомобил търсиш?', label: 'Описание на автомобила за внос', placeholder: 'Опиши какво търсиш' }
  }[kind]);
  const summary = $derived(value.trim() ? [value.trim(), kind === 'criteria' && budget ? `до ${budget} €` : ''].filter(Boolean).join(' · ') : '');
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let trigger: HTMLButtonElement;
  let draft = $state('');
  let budgetDraft = $state('');
  let error = $state('');
  let errorField = $state<'entry-value' | 'entry-budget'>('entry-value');
  let returnFocus: HTMLElement | undefined;
  let scrollY = 0;
  let opened = false;

  export async function edit(returnTo?: HTMLElement) {
    draft = value;
    budgetDraft = budget;
    error = '';
    returnFocus = returnTo ?? trigger;
    scrollY = window.scrollY;
    document.body.style.setProperty('--dn-entry-editor-scroll', `-${scrollY}px`);
    opened = true;
    dialog.showModal();
    await tick();
    form.querySelector<HTMLInputElement | HTMLTextAreaElement>('[name="entry-value"]')?.focus();
  }

  function restore() {
    if (!opened) return;
    opened = false;
    document.body.style.removeProperty('--dn-entry-editor-scroll');
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }

  function save(event: SubmitEvent) {
    event.preventDefault();
    let nextValue = draft.trim();
    if (kind !== 'criteria' && nextValue) {
      const parsed = parseVehicleReference(nextValue);
      if (!parsed || (kind === 'listing' && parsed.kind !== 'listing')) {
        errorField = 'entry-value';
        error = kind === 'reference' ? 'Добави валиден линк към обява или VIN от 17 знака.' : 'Добави валиден линк към обява.';
        form.querySelector<HTMLInputElement>('[name="entry-value"]')?.focus();
        return;
      }
      nextValue = parsed.value;
    }
    if (kind === 'criteria' && budgetDraft.trim() && !/^[0-9]{1,8}$/.test(budgetDraft.trim())) {
      errorField = 'entry-budget';
      error = 'Въведи бюджета като цяло число в евро.';
      form.querySelector<HTMLInputElement>('[name="entry-budget"]')?.focus();
      return;
    }
    onapply(nextValue, budgetDraft.trim());
    dialog.close();
  }

  onDestroy(() => {
    if (dialog?.open) dialog.close();
    restore();
  });
</script>

<button {id} class="dn-entry-editor-trigger dn-entry-field" type="button" bind:this={trigger} onclick={() => edit()} aria-haspopup="dialog" aria-controls={`${id}-dialog`} aria-label={`${copy.label}${summary ? `: ${summary}` : ''}`}>
  <span class:dn-entry-editor-placeholder={!summary}>{summary || copy.placeholder}</span>
</button>

<dialog {@attach dialogViewport} id={`${id}-dialog`} class="dn-entry-editor" bind:this={dialog} aria-labelledby={`${id}-title`} onclose={restore} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <header>
    <h2 id={`${id}-title`}>{copy.title}</h2>
    <button type="button" class="dn-entry-editor-close" aria-label="Затвори редактора" onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
  </header>
  <form bind:this={form} onsubmit={save} novalidate>
    <div class="dn-entry-editor-fields">
      <label class="dn-sr-only" for={`${id}-value`}>{copy.label}</label>
      {#if kind === 'criteria'}
        <textarea id={`${id}-value`} name="entry-value" bind:value={draft} oninput={() => error = ''} maxlength={500} rows="5" placeholder="Напр. BMW X5, дизел, 2020+, xDrive…"></textarea>
      {:else}
        <input id={`${id}-value`} name="entry-value" bind:value={draft} oninput={() => error = ''} maxlength={2048} inputmode={kind === 'listing' ? 'url' : 'text'} autocomplete="off" autocapitalize="none" spellcheck={false} placeholder={copy.placeholder} aria-invalid={error && errorField === 'entry-value' ? true : undefined} aria-describedby={error && errorField === 'entry-value' ? `${id}-error` : undefined} />
      {/if}
      {#if kind === 'criteria'}
        <label class="dn-entry-editor-budget-label" for={`${id}-budget`}>Бюджет до, € <span>по желание</span></label>
        <input id={`${id}-budget`} name="entry-budget" bind:value={budgetDraft} oninput={() => error = ''} inputmode="numeric" maxlength={8} placeholder="40000" aria-invalid={error && errorField === 'entry-budget' ? true : undefined} aria-describedby={error && errorField === 'entry-budget' ? `${id}-error` : undefined} />
      {/if}
      {#if error}<p class="dn-entry-editor-error" id={`${id}-error`} role="alert">{error}</p>{/if}
    </div>
    <footer>
      <button type="button" class="dn-entry-editor-cancel" onclick={() => dialog.close()}>Отказ</button>
      <button type="submit" class="dn-entry-editor-save">Запази</button>
    </footer>
  </form>
</dialog>

<style>
  .dn-entry-editor-trigger { display: flex; width: 100%; height: var(--dn-entry-height); align-items: center; padding-inline: var(--dn-space-4); text-align: left; font: var(--dn-entry-font); cursor: pointer; }
  .dn-entry-editor-trigger span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .dn-entry-editor-placeholder { color: var(--dn-muted); }
  :global(body:has(.dn-entry-editor[open])) { position: fixed; top: var(--dn-entry-editor-scroll, 0); width: 100%; overflow: hidden; }
  .dn-entry-editor { width: min(520px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 32px); padding: 0; border: 0; border-radius: var(--dn-radius-lg); background: var(--dn-white); color: var(--dn-ink); overflow: hidden; }
  .dn-entry-editor[open] { display: flex; flex-direction: column; }
  .dn-entry-editor::backdrop { background: rgb(0 0 0 / 55%); }
  header { display: flex; flex-shrink: 0; align-items: center; gap: var(--dn-space-3); padding: var(--dn-space-5) var(--dn-space-6) var(--dn-space-3); }
  h2 { flex: 1; margin: 0; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-entry-editor-close { display: grid; width: var(--dn-control-hit-height); height: var(--dn-control-hit-height); flex-shrink: 0; place-items: center; border: 0; border-radius: var(--dn-pill); background: var(--dn-home-panel); color: var(--dn-ink); cursor: pointer; }
  form { display: flex; min-height: 0; flex-direction: column; }
  .dn-entry-editor-fields { overflow-y: auto; overscroll-behavior: contain; padding: var(--dn-space-3) var(--dn-space-6) var(--dn-space-6); }
  label { display: block; margin-bottom: var(--dn-space-2); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-meta); }
  label span { color: var(--dn-muted); font-weight: var(--dn-weight-regular); }
  input, textarea { display: block; width: 100%; min-height: var(--dn-entry-height); padding: var(--dn-space-3); border: 1px solid var(--dn-entry-line); border-radius: var(--dn-radius-control); background: var(--dn-entry-surface); color: var(--dn-ink); font: var(--dn-entry-font); }
  textarea { resize: vertical; }
  input { border-radius: var(--dn-pill); text-overflow: ellipsis; }
  p { margin: var(--dn-space-2) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-entry-editor-budget-label { margin-top: var(--dn-space-5); }
  .dn-entry-editor-error { color: var(--dn-red); }
  footer { display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; gap: var(--dn-space-3); padding: var(--dn-space-3) var(--dn-space-6); border-top: 1px solid var(--dn-line); }
  footer button { min-height: var(--dn-entry-action-height); padding: var(--dn-space-2) var(--dn-space-6); border: 0; border-radius: var(--dn-radius-button); cursor: pointer; }
  .dn-entry-editor-cancel { background: var(--dn-home-panel); color: var(--dn-ink); font: var(--dn-control-font); }
  .dn-entry-editor-save { min-width: 132px; background: var(--dn-red); color: var(--dn-white); font: var(--dn-cta-font); }
  .dn-entry-editor-save:hover { background: var(--dn-red-hover); }
  .dn-entry-editor :is(button,input,textarea):focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  @media (max-width: 767px) {
    .dn-entry-editor { inset: var(--dn-form-dialog-top) 0 auto; width: 100%; height: var(--dn-form-dialog-height); max-height: var(--dn-form-dialog-height); margin: 0; border-radius: 0; }
    form, .dn-entry-editor-fields { flex: 1; min-height: 0; }
    header { padding-inline: var(--dn-space-4); }
    .dn-entry-editor-fields { padding-inline: var(--dn-space-4); }
    footer { padding: var(--dn-space-3) var(--dn-space-4) max(var(--dn-space-3), env(safe-area-inset-bottom)); }
  }
</style>
