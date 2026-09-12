<script lang="ts">
  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';

  let dialog: HTMLDialogElement;
  let trigger: HTMLButtonElement;

  function close() {
    if (dialog?.open) dialog.close();
  }
</script>

<section class="dn-pdp-import" aria-label="Внос по заявка">
  <button bind:this={trigger} class="dn-pdp-import__banner" type="button" onclick={() => dialog.showModal()} aria-haspopup="dialog" aria-label="Как работи вносът?">
    <img src="/assets/images/lead/import-how-generated-v1.webp" alt="Как работи вносът? Обява или критерии · 3 бързи стъпки" width="900" height="300" loading="lazy" decoding="async" />
  </button>
</section>

<dialog class="dn-pdp-import-dialog" bind:this={dialog} aria-labelledby="pdp-import-title" onclose={() => trigger?.focus()} onclick={(event) => { if (event.target === event.currentTarget) close(); }}>
  <div class="dn-pdp-import-sheet">
    <header>
      <h2 id="pdp-import-title">Как работи вносът?</h2>
      <button type="button" onclick={close} aria-label="Затвори"><Icon name="x" size={21} /></button>
    </header>    <ol>
      <li><span>01</span><strong>Обява или критерии</strong></li>
      <li><span>02</span><strong>Уточняваме автомобила</strong></li>
      <li><span>03</span><strong>Потвърждаваме следващата стъпка</strong></li>
    </ol>
    <a class="dn-pdp-import-sheet__cta" href={resolve('/contact?topic=import')}>Заяви внос <Icon name="arrow-right" size={17} /></a>
  </div>
</dialog>

<style>
  .dn-pdp-import { min-width: 0; }
  .dn-pdp-import__banner { display: block; width: 100%; padding: 0; overflow: hidden; border: 0; border-radius: 16px; background: #171a1f; cursor: pointer; }
  .dn-pdp-import__banner img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 1; object-fit: cover; }
  .dn-pdp-import__banner:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  .dn-pdp-import-dialog { width: min(520px, calc(100% - 32px)); max-width: none; margin: auto; padding: 0; border: 0; border-radius: 22px; background: transparent; color: #202329; }
  .dn-pdp-import-dialog::backdrop { background: rgba(8,10,14,.64); backdrop-filter: blur(2px); }
  .dn-pdp-import-sheet { padding: 20px; border-radius: 22px; background: #fff; }
  .dn-pdp-import-sheet header { display: flex; align-items: center; gap: 14px; }
  .dn-pdp-import-sheet h2 { flex: 1; margin: 0; font-size: 22px; line-height: 1.2; letter-spacing: -.025em; }
  .dn-pdp-import-sheet header button { display: grid; width: 42px; height: 42px; place-items: center; border: 0; border-radius: 50%; background: #f1f2f4; color: #202329; cursor: pointer; }  .dn-pdp-import-sheet ol { display: grid; gap: 14px; margin: 24px 0 0; padding: 0; list-style: none; }
  .dn-pdp-import-sheet li { display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 12px; }
  .dn-pdp-import-sheet li > span { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; background: #202329; color: #fff; font-size: 11px; font-weight: 750; }
  .dn-pdp-import-sheet li strong { font-size: 15px; line-height: 1.35; }
  .dn-pdp-import-sheet__cta { display: flex; min-height: 48px; align-items: center; justify-content: center; gap: 8px; margin-top: 22px; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 14px; font-weight: 700; }
  @media (max-width: 767px) {
    .dn-pdp-import { margin: 12px 12px 0; }
    .dn-pdp-import-dialog { inset: auto 0 0; width: 100%; margin: 0; border-radius: 24px 24px 0 0; }
    .dn-pdp-import-sheet { padding: 20px 16px max(22px,env(safe-area-inset-bottom)); border-radius: 24px 24px 0 0; }
    .dn-pdp-import-sheet h2 { font-size: 21px; }
  }
</style>
