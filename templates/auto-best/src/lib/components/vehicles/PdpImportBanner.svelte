<script lang="ts">
  import { trapDialogTab } from '$lib/ui/overlay';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import { leadSite } from '$config/lead-site';

  let dialog: HTMLDialogElement;
  let trigger: HTMLButtonElement;

  function close() {
    if (dialog?.open) dialog.close();
  }
</script>

<section class="dn-pdp-import" aria-label={i18n.t("m_d621a3c98e0f")}>
  <button bind:this={trigger} class="dn-pdp-import__banner" type="button" onclick={() => dialog.showModal()} aria-haspopup="dialog" aria-label={i18n.t("m_84a753e287b1")}>
    <img src={leadSite.artwork.pdp.importGuide} alt={i18n.t("m_745ac4d5e340")} width="900" height="300" loading="lazy" decoding="async" />
  </button>
</section>

<dialog onkeydown={trapDialogTab} class="dn-pdp-import-dialog" bind:this={dialog} aria-labelledby="pdp-import-title" onclose={() => trigger?.focus()} onclick={(event) => { if (event.target === event.currentTarget) close(); }}>
  <div class="dn-pdp-import-sheet">
    <header>
      <h2 id="pdp-import-title">{i18n.t("m_84a753e287b1")}</h2>
      <button class="dn-icon-button" type="button" onclick={close} aria-label={i18n.t("m_7d9eb7acb13e")}><Icon name="x" size={21} /></button>
    </header>    <ol>
      <li><span>01</span><strong>{i18n.t("m_1ca1a6c6bb44")}</strong></li>
      <li><span>02</span><strong>{i18n.t("m_8d2e23bb3cc1")}</strong></li>
      <li><span>03</span><strong>{i18n.t("m_7472d98583c8")}</strong></li>
    </ol>
    <a class="dn-pdp-import-sheet__cta" href={i18n.href(resolve('/contact?topic=import'))}>{i18n.t("m_e451c2bb4d64")} <Icon name="arrow-right" size={17} /></a>
  </div>
</dialog>

<style>
  .dn-pdp-import { min-width: 0; }
  .dn-pdp-import__banner { display: block; width: 100%; padding: 0; overflow: hidden; border: 0; border-radius: 16px; background: var(--dn-theme-hero-surface); cursor: pointer; }
  .dn-pdp-import__banner img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 1; object-fit: cover; }
  .dn-pdp-import__banner:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  .dn-pdp-import-dialog { width: min(520px, calc(100% - 32px)); max-width: none; margin: auto; padding: 0; border: 0; border-radius: 22px; background: transparent; color: #202329; }
  .dn-pdp-import-dialog::backdrop { background: rgba(8,10,14,.64); backdrop-filter: blur(2px); }
  .dn-pdp-import-sheet { padding: 20px; border-radius: 22px; background: #fff; }
  .dn-pdp-import-sheet header { display: flex; align-items: center; gap: 14px; }
  .dn-pdp-import-sheet h2 { flex: 1; margin: 0; font-size: var(--dn-text-subheading); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-pdp-import-sheet header button { border: 0; border-radius: 50%; background: #f1f2f4; color: #202329; }  .dn-pdp-import-sheet ol { display: grid; gap: 14px; margin: 24px 0 0; padding: 0; list-style: none; }
  .dn-pdp-import-sheet li { display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 12px; }
  .dn-pdp-import-sheet li > span { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; background: #202329; color: #fff; font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
  .dn-pdp-import-sheet li strong { font-size: var(--dn-text-body); line-height: var(--dn-leading-meta); }
  .dn-pdp-import-sheet__cta { display: flex; min-height: 48px; align-items: center; justify-content: center; gap: 8px; margin-top: 22px; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); }
  @media (max-width: 767px) {
    .dn-pdp-import { margin: 12px 12px 0; }
    .dn-pdp-import-dialog { inset: auto 0 0; width: 100%; margin: 0; border-radius: 24px 24px 0 0; }
    .dn-pdp-import-sheet { padding: 20px 16px max(22px,env(safe-area-inset-bottom)); border-radius: 24px 24px 0 0; }
    .dn-pdp-import-sheet h2 { font-size: var(--dn-text-card); }
  }
</style>
