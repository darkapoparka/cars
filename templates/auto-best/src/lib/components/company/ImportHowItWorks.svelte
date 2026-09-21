<script lang="ts">
  import { trapDialogTab } from '$lib/ui/overlay';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { tick } from 'svelte';
  import Icon from '$components/ui/Icon.svelte';

  let dialog: HTMLDialogElement;
  let trigger: HTMLButtonElement;
  let heading: HTMLHeadingElement;
  let dragStart = 0;
  let dragOffset = $state(0);
  let dragging = $state(false);

  async function openDrawer() {
    dragOffset = 0;
    dialog.showModal();
    await tick();
    heading.focus({ preventScroll: true });
  }

  function closeDrawer() {
    if (dialog?.open) dialog.close();
  }

  function handleClose() {
    dragOffset = 0;
    dragging = false;
    trigger?.isConnected && trigger.focus({ preventScroll: true });
  }

  function startPeekDrag(event: PointerEvent) {
    dragStart = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function endPeekDrag(event: PointerEvent) {
    if (dragStart - event.clientY > 22) {
      event.preventDefault();
      void openDrawer();
    }
    dragStart = 0;
  }

  function startSheetDrag(event: PointerEvent) {
    dragging = true;
    dragStart = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function moveSheetDrag(event: PointerEvent) {
    if (!dragging) return;
    dragOffset = Math.max(0, event.clientY - dragStart);
  }

  function endSheetDrag() {
    if (!dragging) return;
    dragging = false;
    if (dragOffset > 72) closeDrawer();
    else dragOffset = 0;
  }
</script>

<div class="dn-import-info-drawer">
  <button
    class="dn-import-info-drawer__peek"
    type="button"
    bind:this={trigger}
    aria-haspopup="dialog"
    aria-label={i18n.t("m_0dc54277231e")}
    onclick={openDrawer}
    onpointerdown={startPeekDrag}
    onpointerup={endPeekDrag}
  >
    <span class="dn-import-info-drawer__handle" aria-hidden="true"></span>
    <span>{i18n.t("m_15f4f5be4ade")}</span>
    <Icon name="chevron-down" size={16} />
  </button>
</div>

<dialog onkeydown={trapDialogTab}
  class="dn-import-info-dialog"
  bind:this={dialog}
  aria-labelledby="import-info-title"
  onclose={handleClose}
  onclick={(event) => { if (event.target === event.currentTarget) closeDrawer(); }}
>
  <div class="dn-import-info-sheet" class:dragging style:transform={`translateY(${dragOffset}px)`}>
    <button
      class="dn-import-info-sheet__grabber"
      type="button"
      aria-label={i18n.t("m_be060a506520")}
      onpointerdown={startSheetDrag}
      onpointermove={moveSheetDrag}
      onpointerup={endSheetDrag}
      onpointercancel={endSheetDrag}
    ><span></span></button>

    <header class="dn-import-info-sheet__header">
      <h2 id="import-info-title" tabindex="-1" bind:this={heading}>{i18n.t("m_0dc54277231e")}</h2>
      <button class="dn-import-info-sheet__close dn-icon-button" type="button" aria-label={i18n.t("m_7d9eb7acb13e")} onclick={closeDrawer}>
        <Icon name="x" size={18} />
      </button>
    </header>

    <div class="dn-import-info-sheet__body">
      <section class="dn-import-info-group dn-import-info-prepare" aria-labelledby="import-prepare-title">
        <h3 id="import-prepare-title">{i18n.t("m_23809ef4ac0b")}</h3>
        <ol class="dn-import-info-list">
          <li><span aria-hidden="true">1.</span><p><strong>{i18n.t("m_cb657904a3c8")}</strong><span>{i18n.t("m_69c046d0d68a")}</span></p></li>
          <li><span aria-hidden="true">2.</span><p><strong>{i18n.t("m_84e960d40ad5")}</strong><span>{i18n.t("m_088c620063d9")}</span></p></li>
          <li><span aria-hidden="true">3.</span><p><strong>{i18n.t("m_71d928c81483")}</strong><span>{i18n.t("m_d94e043d8dcf")}</span></p></li>
        </ol>
      </section>

      <section class="dn-import-info-group dn-import-info-process" aria-labelledby="import-next-title">
        <h3 id="import-next-title">{i18n.t("m_f388d3f655d4")}</h3>
        <ol class="dn-import-info-steps">
          <li><span aria-hidden="true">1.</span><p><strong>{i18n.t("m_e1acf5864937")}</strong></p></li>
          <li><span aria-hidden="true">2.</span><p><strong>{i18n.t("m_66f7d8b839bb")}</strong></p></li>
          <li><span aria-hidden="true">3.</span><p><strong>{i18n.t("m_8f02b9b0cf35")}</strong></p></li>
        </ol>
      </section>

      <footer class="dn-import-info-actions">
        <button type="button" onclick={closeDrawer}>{i18n.t("m_ed51f4a53cda")} <Icon name="arrow-right" size={18} /></button>
      </footer>
    </div>
  </div>
</dialog>

<style>
  .dn-import-info-drawer { width: fit-content; margin: var(--dn-space-4) auto 0; }
  .dn-import-info-drawer__peek {
    position: relative;
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: var(--dn-space-2);
    padding: var(--dn-space-2) var(--dn-space-4);
    border: 0;
    border-radius: var(--dn-radius-button);
    background: var(--dn-ink);
    color: var(--dn-white);
    font: inherit;
    font-size: var(--dn-control-size);
    font-weight: var(--dn-control-weight);
    cursor: pointer;
  }
  .dn-import-info-drawer__peek :global(svg) { transform: rotate(180deg); }
  .dn-import-info-drawer__peek:focus-visible { outline: 2px solid var(--dn-ink); outline-offset: 3px; }
  .dn-import-info-drawer__handle { display: none; }

  :global(body:has(.dn-import-info-dialog[open])) { overflow: hidden; }
  :global(body:has(.dn-import-info-dialog[open]) .dn-mobile-bottom-nav) { visibility: hidden; pointer-events: none; }
  .dn-import-info-dialog {
    width: min(620px, calc(100% - 28px));
    max-width: none;
    max-height: min(640px, 74dvh);
    margin: auto;
    padding: 0;
    border: 0;
    border-radius: var(--dn-radius-lg);
    background: transparent;
    color: var(--dn-ink);
    overflow: visible;
  }
  .dn-import-info-dialog::backdrop { background: rgba(8,10,14,.52); backdrop-filter: blur(3px); }
  .dn-import-info-sheet {
    display: flex;
    max-height: min(640px, 74dvh);
    flex-direction: column;
    overflow: hidden;
    border: 0;
    border-radius: var(--dn-radius-lg);
    background: var(--dn-white);
    box-shadow: none;
    transition: transform 180ms cubic-bezier(.2,.8,.2,1);
  }
  .dn-import-info-sheet.dragging { transition: none; }
  .dn-import-info-sheet__grabber {
    display: grid;
    width: 100%;
    min-height: 24px;
    place-items: center;
    padding: var(--dn-space-2) 0 var(--dn-space-half);
    border: 0;
    background: var(--dn-white);
    cursor: grab;
    touch-action: none;
  }
  .dn-import-info-sheet__grabber span { width: 42px; height: 4px; border-radius: var(--dn-pill); background: var(--dn-muted); }
  .dn-import-info-sheet__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--dn-space-3);
    padding: var(--dn-space-1) var(--dn-space-5) var(--dn-space-4);
    background: var(--dn-white);
  }
  .dn-import-info-sheet__header h2 { min-width: 0; white-space: nowrap; margin: 0; color: var(--dn-ink); font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-import-info-sheet__header h2:focus { outline: none; }
  .dn-import-info-sheet__close { border: 0; border-radius: 50%; background: var(--dn-surface); color: var(--dn-ink); }
  .dn-import-info-sheet__body {
    display: grid;
    min-height: 0;
    gap: var(--dn-space-5);
    padding: 0 var(--dn-space-4) var(--dn-space-5);
    overflow-y: auto;
    background: var(--dn-white);
    color: var(--dn-ink);
    overscroll-behavior: contain;
  }
  .dn-import-info-group { display: grid; gap: var(--dn-space-3); }
  .dn-import-info-group h3 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); text-align: left; }
  .dn-import-info-list { display: grid; gap: var(--dn-space-4); margin: 0; padding: 0; background: transparent; list-style: none; }
  .dn-import-info-list > li { display: block; min-height: 50px; }
  .dn-import-info-list p,
  .dn-import-info-steps p { display: contents; }
  .dn-import-info-list strong,
  .dn-import-info-steps strong { color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
  .dn-import-info-list p > span { display: block; margin-top: var(--dn-space-half); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-import-info-steps { display: grid; gap: var(--dn-space-4); margin: 0; padding: 0; background: transparent; list-style: none; }
  .dn-import-info-steps li { display: block; }  .dn-import-info-list li > span, .dn-import-info-steps li > span { margin-inline-end: var(--dn-space-2); font-variant-numeric: tabular-nums; color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
  .dn-import-info-actions { display: flex; justify-content: center; padding-top: 0; }
  .dn-import-info-actions button {
    display: inline-flex;
    width: min(200px, 100%);
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: var(--dn-space-2);
    padding: 0 var(--dn-space-5);
    border: 0;
    border-radius: var(--dn-radius-button);
    background: var(--dn-red);
    color: var(--dn-white);
    font: var(--dn-control-font);
    white-space: nowrap;
    cursor: pointer;
  }
  .dn-import-info-actions button:hover { background: var(--dn-red-hover); }
  .dn-import-info-actions button:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }

  .dn-import-info-prepare { padding: var(--dn-space-4); border-radius: var(--dn-radius); background: var(--dn-mobile-canvas); color: var(--dn-ink); gap: var(--dn-space-3); }
  .dn-import-info-prepare h3 { color: var(--dn-ink); }
  .dn-import-info-prepare strong { color: var(--dn-ink); }
  .dn-import-info-prepare p > span { color: var(--dn-muted); }
  .dn-import-info-sheet__header, .dn-import-info-sheet__grabber { flex-shrink: 0; }
  @media (max-width: 767px) {
    .dn-import-info-sheet__header h2 { font-size: var(--dn-text-card); }
    .dn-import-info-drawer {
      position: fixed;
      left: 50%;
      bottom: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom));
      z-index: 1890;
      width: min(300px, calc(100% - 48px));
      margin: 0;
      transform: translateX(-50%);
    }
    .dn-import-info-drawer__peek {
      width: 100%;
      min-height: 52px;
      padding: var(--dn-space-4) var(--dn-space-4) var(--dn-space-2);
      border-radius: var(--dn-radius) var(--dn-radius) 0 0;
      border: 1px solid var(--dn-ink);
      border-bottom: 0;
      box-shadow: none;
    }
    .dn-import-info-drawer__handle {
      position: absolute;
      top: 6px;
      left: 50%;
      display: block;
      width: 34px;
      height: 3px;
      border-radius: var(--dn-pill);
      background: var(--dn-muted-on-ink);
      transform: translateX(-50%);
    }
    .dn-import-info-dialog {
      inset: auto 0 0;
      width: 100%;
      max-height: min(700px, calc(100dvh - max(84px, env(safe-area-inset-top))));
      margin: 0;
      border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    }
    .dn-import-info-sheet {
      max-height: min(700px, calc(100dvh - max(84px, env(safe-area-inset-top))));
      border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    }
    .dn-import-info-sheet__header { padding: var(--dn-space-1) var(--dn-space-4) var(--dn-space-3); }
    .dn-import-info-sheet__body { gap: var(--dn-space-4); padding: 0 var(--dn-space-4) max(var(--dn-space-4), env(safe-area-inset-bottom)); }
    .dn-import-info-group { gap: var(--dn-space-2); }
    .dn-import-info-list, .dn-import-info-steps { gap: var(--dn-space-3); }
    .dn-import-info-list > li { min-height: 0; }
  }

  .dn-import-info-process { padding: var(--dn-space-4); border-radius: var(--dn-radius); background: var(--dn-ink); }
  .dn-import-info-process :is(h3, strong) { color: var(--dn-white); }
  .dn-import-info-process li > span { color: var(--dn-white); }

  @media (prefers-reduced-motion: reduce) {
    .dn-import-info-sheet { transition: none; }
  }
</style>
