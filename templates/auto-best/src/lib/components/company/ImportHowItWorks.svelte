<script lang="ts">
  import { tick, onDestroy } from 'svelte';
  import { lockPageScroll, trapDialogTab } from '$lib/ui/overlay';
  let releaseScroll: (() => void) | undefined;
  onDestroy(() => releaseScroll?.());
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let dialog: HTMLDialogElement;
  let trigger: HTMLButtonElement;
  let heading: HTMLHeadingElement;
  let dragStart = 0;
  let dragOffset = $state(0);
  let dragging = $state(false);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`;

  async function openDrawer() {
    dragOffset = 0;
    if (dialog.open) return;
    releaseScroll = lockPageScroll();
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function closeDrawer() {
    if (dialog?.open) dialog.close();
  }

  function handleClose() {
    releaseScroll?.();
    dragOffset = 0;
    dragging = false;
    trigger?.isConnected && trigger.focus();
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
    aria-label="Как протича вносът"
    onclick={openDrawer}
    onpointerdown={startPeekDrag}
    onpointerup={endPeekDrag}
  >
    <span class="dn-import-info-drawer__handle" aria-hidden="true"></span>
    <span>Как протича вносът</span>
    <Icon name="chevron-down" size={16} />
  </button>
</div>

<dialog
  class="dn-import-info-dialog"
  bind:this={dialog}
  aria-labelledby="import-info-title"
  onclose={handleClose} onkeydown={trapDialogTab}
  onclick={(event) => { if (event.target === event.currentTarget) closeDrawer(); }}
>
  <div class="dn-import-info-sheet" class:dragging style:transform={`translateY(${dragOffset}px)`}>
    <button
      class="dn-import-info-sheet__grabber"
      type="button"
      aria-label="Плъзни надолу, за да затвориш"
      onpointerdown={startSheetDrag}
      onpointermove={moveSheetDrag}
      onpointerup={endSheetDrag}
      onpointercancel={endSheetDrag}
    ><span></span></button>

    <header class="dn-import-info-sheet__header">
      <h2 id="import-info-title" tabindex="-1" bind:this={heading}>Как протича вносът</h2>
      <button class="dn-import-info-sheet__close" type="button" aria-label="Затвори" onclick={closeDrawer}>
        <Icon name="x" size={21} />
      </button>
    </header>

    <div class="dn-import-info-sheet__body">
      <section class="dn-import-info-group" aria-labelledby="import-prepare-title">
        <h3 id="import-prepare-title">Подготви</h3>
        <div class="dn-import-info-list">
          <div><Icon name="globe" size={19} /><p><strong>Обява или критерии</strong><span>Линк към автомобил или марка и модел, които търсиш.</span></p></div>
          <div><Icon name="tag" size={19} /><p><strong>Бюджет</strong><span>Ориентир за покупката, ако вече имаш такъв.</span></p></div>
          <div><Icon name="car" size={19} /><p><strong>Предпочитания</strong><span>Година, двигател, оборудване или други важни детайли.</span></p></div>
        </div>
      </section>

      <section class="dn-import-info-group" aria-labelledby="import-next-title">
        <h3 id="import-next-title">След това</h3>
        <ol class="dn-import-info-steps">
          <li><span>1</span><p><strong>Изпращаш обявата или критериите</strong><span>Данните остават на устройството, докато не решиш да ги споделиш.</span></p></li>
          <li><span>2</span><p><strong>Уточнявате автомобила и бюджета</strong><span>Екипът обсъжда с теб конкретната заявка и предпочитанията.</span></p></li>
          <li><span>3</span><p><strong>Потвърждавате следващата стъпка</strong><span>Продължавате според избрания автомобил и конкретната сделка.</span></p></li>
        </ol>
      </section>

      <section class="dn-import-info-contact" aria-label="Контакт">
        <strong>{brand.phone}</strong>
        <span>{brand.addressLine}, {brand.city} · {brand.appointment}</span>
        <div class="dn-import-info-contact__actions">
          <a href={brand.phoneHref}><Icon name="phone" size={18} />Обади се</a>
          <a href={directionsUrl} target="_blank" rel="noreferrer"><Icon name="map-pin" size={18} />Маршрут</a>
        </div>
      </section>
    </div>
  </div>
</dialog>

<style>
  .dn-import-info-drawer { width: fit-content; margin: 16px auto 0; }
  .dn-import-info-drawer__peek {
    position: relative;
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 16px;
    border: 0;
    border-radius: var(--dn-radius-button);
    background: #171a1f;
    color: #fff;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .dn-import-info-drawer__peek :global(svg) { transform: rotate(180deg); }
  .dn-import-info-drawer__peek:focus-visible { outline: 2px solid #171a1f; outline-offset: 3px; }
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
    border-radius: 24px;
    background: transparent;
    color: #fff;
    overflow: visible;
  }
  .dn-import-info-dialog::backdrop { background: rgba(8,10,14,.88); backdrop-filter: blur(3px); }
  .dn-import-info-sheet {
    display: flex;
    max-height: min(640px, 74dvh);
    flex-direction: column;
    overflow: hidden;
    border: 0;
    border-radius: 24px;
    background: #171a1f;
    box-shadow: none;
    transition: transform 180ms cubic-bezier(.2,.8,.2,1);
  }
  .dn-import-info-sheet.dragging { transition: none; }
  .dn-import-info-sheet__grabber {
    display: grid;
    width: 100%;
    min-height: 24px;
    place-items: center;
    padding: 7px 0 2px;
    border: 0;
    background: #171a1f;
    cursor: grab;
    touch-action: none;
  }
  .dn-import-info-sheet__grabber span { width: 42px; height: 4px; border-radius: 999px; background: #737a84; }
  .dn-import-info-sheet__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 4px 20px 14px;
    background: #171a1f;
  }
  .dn-import-info-sheet__header h2 { margin: 0; color: #fff; font-size: 23px; font-weight: 700; line-height: 1.15; letter-spacing: -.025em; }
  .dn-import-info-sheet__header h2:focus { outline: none; }
  .dn-import-info-sheet__close {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: #2a2e35;
    color: #fff;
    cursor: pointer;
  }
  .dn-import-info-sheet__body {
    display: grid;
    min-height: 0;
    gap: 18px;
    padding: 0 16px 20px;
    overflow-y: auto;
    background: #171a1f;
    color: #fff;
    overscroll-behavior: contain;
  }
  .dn-import-info-group { display: grid; gap: 10px; }
  .dn-import-info-group h3 { margin: 0; color: #cdd2d8; font-size: 14px; font-weight: 700; line-height: 1.25; letter-spacing: .01em; text-align: center; }
  .dn-import-info-list { display: grid; gap: 2px; margin: 0; padding: 6px; border-radius: 18px; background: #20242a; }
  .dn-import-info-list > div {
    display: grid;
    grid-template-columns: 36px minmax(0,1fr);
    align-items: center;
    gap: 10px;
    min-height: 50px;
    padding: 8px 10px;
    border-radius: 12px;
    background: transparent;
  }
  .dn-import-info-list > div > :global(svg) { box-sizing: content-box; width: 18px; height: 18px; margin: 0; padding: 7px; border-radius: 10px; background: #2a2f36; color: #d6dbe1; }
  .dn-import-info-list p,
  .dn-import-info-steps p { display: grid; gap: 2px; margin: 0; }
  .dn-import-info-list strong,
  .dn-import-info-steps strong { color: #fff; font-size: 13px; font-weight: 700; line-height: 1.35; }
  .dn-import-info-list p > span,
  .dn-import-info-steps p > span { color: #aeb5bf; font-size: 12px; line-height: 1.45; }
  .dn-import-info-steps { display: grid; gap: 2px; margin: 0; padding: 6px; border-radius: 18px; background: #20242a; list-style: none; }
  .dn-import-info-steps li { display: grid; grid-template-columns: 28px minmax(0,1fr); align-items: center; gap: 10px; min-height: 50px; padding: 8px 10px; border-radius: 12px; background: transparent; }  .dn-import-info-steps li > span {
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border-radius: 50%;
    background: #fff;
    color: #171a1f;
    font-size: 11px;
    font-weight: 750;
  }
  .dn-import-info-contact { display: grid; gap: 5px; padding: 14px; border-radius: 18px; background: #20242a; text-align: center; }
  .dn-import-info-contact > strong { color: #fff; font-size: 18px; line-height: 1.3; }
  .dn-import-info-contact > span { color: #aeb5bf; font-size: 12px; line-height: 1.5; }
  .dn-import-info-contact__actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 9px; }
  .dn-import-info-contact__actions a {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: var(--dn-radius-button);
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
  }
  .dn-import-info-contact__actions a:first-child { background: #fff; color: #171a1f; }
  .dn-import-info-contact__actions a:last-child { border: 1px solid #4a5059; background: transparent; color: #fff; }

  @media (max-width: 767px) {
    .dn-import-info-drawer {
      position: fixed;
      left: 50%;
      bottom: calc(var(--dn-mobile-nav-height) + env(safe-area-inset-bottom) + 10px);
      z-index: 1890;
      width: min(230px, calc(100% - 72px));
      margin: 0;
      transform: translateX(-50%);
    }
    .dn-import-info-drawer__peek {
      width: 100%;
      min-height: 45px;
      padding: 14px 14px 7px;
      border-radius: 16px 16px 0 0;
      box-shadow: none;
    }
    .dn-import-info-drawer__handle {
      position: absolute;
      top: 6px;
      left: 50%;
      display: block;
      width: 34px;
      height: 3px;
      border-radius: 999px;
      background: #8b9199;
      transform: translateX(-50%);
    }
    .dn-import-info-dialog {
      inset: auto 0 0;
      width: 100%;
      max-height: calc(100dvh - max(24px, env(safe-area-inset-top)));
      margin: 0;
      border-radius: 24px 24px 0 0;
    }
    .dn-import-info-sheet {
      max-height: calc(100dvh - max(24px, env(safe-area-inset-top)));
      border-radius: 24px 24px 0 0;
    }
    .dn-import-info-sheet__header { padding: 4px 16px 12px; }
    .dn-import-info-sheet__header h2 { font-size: 21px; }
    .dn-import-info-sheet__body { gap: 18px; padding: 0 16px max(18px, env(safe-area-inset-bottom)); }
  }

  @media (max-width: 374px) {
    .dn-import-info-drawer { width: min(218px, calc(100% - 68px)); }
    .dn-import-info-drawer__peek { font-size: 12px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-import-info-sheet { transition: none; }
  }
</style>
