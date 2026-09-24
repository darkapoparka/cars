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
<div class="dn-tradein-info-drawer">
  <button
    class="dn-tradein-info-drawer__peek"
    type="button"
    bind:this={trigger}
    aria-haspopup="dialog"
    onclick={openDrawer}
    onpointerdown={startPeekDrag}
    onpointerup={endPeekDrag}
  >
    <span class="dn-tradein-info-drawer__handle" aria-hidden="true"></span>
    <span>{i18n.t("m_15f4f5be4ade")}</span>
    <Icon name="chevron-down" size={16} />
  </button>
</div>

<dialog onkeydown={trapDialogTab}
  class="dn-tradein-info-dialog"
  bind:this={dialog}
  aria-labelledby="tradein-info-title"
  onclose={handleClose}
  onclick={(event) => { if (event.target === event.currentTarget) closeDrawer(); }}
>
  <div class="dn-tradein-info-sheet" class:dragging style:transform={`translateY(${dragOffset}px)`}>
    <button
      class="dn-tradein-info-sheet__grabber"
      type="button"
      aria-label={i18n.t("m_be060a506520")}
      onpointerdown={startSheetDrag}
      onpointermove={moveSheetDrag}
      onpointerup={endSheetDrag}
      onpointercancel={endSheetDrag}
    ><span></span></button>

    <header class="dn-tradein-info-sheet__header">
      <h2 id="tradein-info-title" tabindex="-1" bind:this={heading}>{i18n.t("m_15f4f5be4ade")}</h2>
      <button class="dn-tradein-info-sheet__close dn-icon-button" type="button" aria-label={i18n.t("m_7d9eb7acb13e")} onclick={closeDrawer}>
        <Icon name="x" size={21} />
      </button>
    </header>

    <div class="dn-tradein-info-sheet__body">
      <section class="dn-tradein-info-group dn-tradein-info-prepare" aria-labelledby="tradein-prepare-title">
        <h3 id="tradein-prepare-title">{i18n.t("m_23809ef4ac0b")}</h3>
        <ol class="dn-tradein-info-list">
          <li><span aria-hidden="true">1.</span><p><strong>{i18n.t("m_0f15110a1c1d")}</strong><span>{i18n.t("m_29ddaf947e7e")}</span></p></li>
          <li><span aria-hidden="true">2.</span><p><strong>{i18n.t("m_3a10ff4055b4")}</strong><span>{i18n.t("m_c7daea9bff26")}</span></p></li>
          <li><span aria-hidden="true">3.</span><p><strong>{i18n.t("m_dceb61c9ef43")}</strong><span>{i18n.t("m_31e7e145d1ab")}</span></p></li>
        </ol>
      </section>

      <section class="dn-tradein-info-group dn-tradein-info-process" aria-labelledby="tradein-next-title">
        <h3 id="tradein-next-title">{i18n.t("m_f388d3f655d4")}</h3>
        <ol class="dn-tradein-info-steps">
          <li><span aria-hidden="true">1.</span><p><strong>{i18n.t("m_c04a33c821e7")}</strong></p></li>
          <li><span aria-hidden="true">2.</span><p><strong>{i18n.t("m_39dffe73a926")}</strong></p></li>
          <li><span aria-hidden="true">3.</span><p><strong>{i18n.t("m_40e24d85be1c")}</strong></p></li>
        </ol>
      </section>

      <footer class="dn-tradein-info-actions">
        <button type="button" onclick={closeDrawer}>{i18n.t("m_ed51f4a53cda")} <Icon name="arrow-right" size={18} /></button>
      </footer>
    </div>
  </div>
</dialog>

<style>
  .dn-tradein-info-drawer { width: fit-content; margin: var(--dn-space-4) auto 0; }
  .dn-tradein-info-drawer__peek {
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
  .dn-tradein-info-drawer__peek :global(svg) { transform: rotate(180deg); }
  .dn-tradein-info-drawer__handle { display: none; }

  :global(body:has(.dn-tradein-info-dialog[open])) { overflow: hidden; }
  :global(body:has(.dn-tradein-info-dialog[open]) .dn-mobile-bottom-nav) { visibility: hidden; pointer-events: none; }
  .dn-tradein-info-dialog {
    width: min(620px, calc(100% - 28px));
    max-width: none;
    max-height: min(620px, 70dvh);
    margin: auto;
    padding: 0;
    border: 0;
    border-radius: var(--dn-radius-lg);
    background: transparent;
    color: var(--dn-ink);
    overflow: visible;
  }
  .dn-tradein-info-dialog::backdrop { background: rgba(8,10,14,.52); backdrop-filter: blur(3px); }
  .dn-tradein-info-sheet {
    display: flex;
    max-height: min(620px, 70dvh);
    flex-direction: column;
    overflow: hidden;
    border: 0;
    border-radius: var(--dn-radius-lg);
    background: var(--dn-white);
    box-shadow: none;
    transition: transform 180ms cubic-bezier(.2,.8,.2,1);
  }
  .dn-tradein-info-sheet.dragging { transition: none; }
  .dn-tradein-info-sheet__grabber {
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
  .dn-tradein-info-sheet__grabber span { width: 42px; height: 4px; border-radius: var(--dn-pill); background: var(--dn-muted); }
  .dn-tradein-info-sheet__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--dn-space-3);
    padding: var(--dn-space-1) var(--dn-space-5) var(--dn-space-4);
    background: var(--dn-white);
    color: var(--dn-ink);
  }
  .dn-tradein-info-sheet__header h2 { min-width: 0; white-space: nowrap; margin: 0; color: var(--dn-ink); font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-tradein-info-sheet__header h2:focus { outline: none; }
  .dn-tradein-info-sheet__close { border: 0; border-radius: 50%; background: var(--dn-surface); color: var(--dn-ink); }
  .dn-tradein-info-sheet__body {
    display: grid;
    min-height: 0;
    gap: var(--dn-space-5);
    padding: 0 var(--dn-space-4) var(--dn-space-5);
    overflow-y: auto;
    background: var(--dn-white);
    color: var(--dn-ink);
    overscroll-behavior: contain;
  }
  .dn-tradein-info-group { display: grid; gap: var(--dn-space-3); }
  .dn-tradein-info-group h3 { margin: 0; color: var(--dn-ink); font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); text-align: left; }
  .dn-tradein-info-list { display: grid; gap: var(--dn-space-4); margin: 0; padding: 0; background: transparent; list-style: none; }
  .dn-tradein-info-list > li { display: block; min-height: 50px; }
  .dn-tradein-info-list p,
  .dn-tradein-info-steps p { display: contents; }
  .dn-tradein-info-list strong,
  .dn-tradein-info-steps strong { color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
  .dn-tradein-info-list p > span { display: block; margin-top: var(--dn-space-half); color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-tradein-info-steps { display: grid; gap: var(--dn-space-4); margin: 0; padding: 0; background: transparent; list-style: none; }
  .dn-tradein-info-steps li { display: block; }
  .dn-tradein-info-list li > span, .dn-tradein-info-steps li > span { margin-inline-end: var(--dn-space-2); font-variant-numeric: tabular-nums; color: var(--dn-ink); font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-card); }
  .dn-tradein-info-prepare { padding: var(--dn-space-4); border-radius: var(--dn-radius); background: var(--dn-mobile-canvas); color: var(--dn-ink); gap: var(--dn-space-3); }
  .dn-tradein-info-prepare h3 { color: var(--dn-ink); }
  .dn-tradein-info-prepare strong { color: var(--dn-ink); }
  .dn-tradein-info-prepare p > span { color: var(--dn-muted); }
  .dn-tradein-info-sheet__header, .dn-tradein-info-sheet__grabber { flex-shrink: 0; }
  .dn-tradein-info-actions { display: flex; justify-content: center; padding-top: 0; }
  .dn-tradein-info-actions button {
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
  .dn-tradein-info-actions button:hover { background: var(--dn-red-hover); }
  .dn-tradein-info-actions button:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }

  @media (max-width: 767px) {
    .dn-tradein-info-sheet__header h2 { font-size: var(--dn-text-card); }
    .dn-tradein-info-drawer {
      position: fixed;
      left: 50%;
      bottom: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom));
      z-index: 1890;
      width: min(300px, calc(100% - 48px));
      margin: 0;
      transform: translateX(-50%);
    }
    .dn-tradein-info-drawer__peek {
      width: 100%;
      min-height: 52px;
      padding: var(--dn-space-4) var(--dn-space-4) var(--dn-space-2);
      border: 1px solid var(--dn-ink);
      border-bottom: 0;
      border-radius: var(--dn-radius) var(--dn-radius) 0 0;
      background: var(--dn-ink);
      color: var(--dn-white);
      box-shadow: none;
    }
    .dn-tradein-info-drawer__handle {
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
    .dn-tradein-info-dialog {
      inset: auto 0 0;
      width: 100%;
      max-height: min(700px, calc(100dvh - max(84px, env(safe-area-inset-top))));
      margin: 0;
      border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    }
    .dn-tradein-info-sheet {
      max-height: min(700px, calc(100dvh - max(84px, env(safe-area-inset-top))));
      border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
    }
    .dn-tradein-info-sheet__header { padding: var(--dn-space-1) var(--dn-space-4) var(--dn-space-3); }
    .dn-tradein-info-sheet__body { gap: var(--dn-space-4); padding: 0 var(--dn-space-4) max(var(--dn-space-4), env(safe-area-inset-bottom)); }
    .dn-tradein-info-group { gap: var(--dn-space-2); }
    .dn-tradein-info-list, .dn-tradein-info-steps { gap: var(--dn-space-3); }
    .dn-tradein-info-list > li { min-height: 0; }
  }

  .dn-tradein-info-process { padding: var(--dn-space-4); border-radius: var(--dn-radius); background: var(--dn-ink); }
  .dn-tradein-info-process :is(h3, strong) { color: var(--dn-white); }
  .dn-tradein-info-process li > span { color: var(--dn-white); }

  @media (prefers-reduced-motion: reduce) {
    .dn-tradein-info-sheet { transition: none; }
  }
</style>
