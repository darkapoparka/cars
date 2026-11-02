<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { shopSortOptions } from "#lib/data/desktop-shop.ts";
  import {
    ownCatalogDialog,
    containCatalogTab,
  } from "#lib/components/vehicle-listing/catalog-dialog.ts";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  let {
    value,
    onapply,
    onclose,
  }: { value: string; onapply: (value: string) => void; onclose: () => void } =
    $props();
  const locale = useLocale();
  let draft = $derived(value);
  const id = $props.id();
</script>

<dialog
  aria-labelledby={id}
  {@attach ownCatalogDialog}
  {onclose}
  onkeydown={containCatalogTab}
  oncancel={(event) => {
    event.preventDefault();
    onclose();
  }}
>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      onapply(draft);
    }}
  >
    <header>
      <h2 {id}>{locale.t("ui.desktop-shop-catalog.sort-products")}</h2>
      <button
        type="button"
        class="close-sort"
        onclick={onclose}
        aria-label={locale.locale === "bg"
          ? "Затвори подреждането"
          : "Close sort"}><MobileIcon name="close" size={20} /></button
      >
    </header>
    <fieldset>
      <legend class="visually-hidden"
        >{locale.t("ui.desktop-shop-catalog.sort-products")}</legend
      >
      {#each shopSortOptions as option (option.value)}<label
          ><input
            type="radio"
            name="shop-sort"
            value={option.value}
            bind:group={draft}
          />{locale.t(option.labelKey)}</label
        >{/each}
    </fieldset>
    <footer>
      <button type="submit"
        >{locale.locale === "bg" ? "Приложи" : "Apply"}</button
      >
    </footer>
  </form>
</dialog>

<style>
  dialog {
    width: min(440px, calc(100% - 24px));
    max-height: 90dvh;
    margin: auto;
    padding: 0;
    overflow: auto;
    border: 0;
    border-radius: 18px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 40%);
  }
  form {
    display: flex;
    flex-direction: column;
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--bs-neutral-200);
  }
  h2 {
    flex: 1;
    margin: 0;
    font-size: 18px;
    line-height: 24px;
  }
  .close-sort {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--bs-neutral-100);
    color: inherit;
    cursor: pointer;
  }
  fieldset {
    margin: 0;
    padding: 12px 16px;
    border: 0;
  }
  label {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    margin: 0;
    font-size: 14px;
    cursor: pointer;
  }
  input {
    width: 18px;
    height: 18px;
    accent-color: var(--bs-neutral-1000);
  }
  footer {
    padding: 12px 16px;
    border-top: 1px solid var(--bs-neutral-200);
  }
  footer button {
    width: 100%;
    min-height: 44px;
    border: 0;
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
</style>
