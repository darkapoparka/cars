<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { dealer } from "#lib/content.ts";

  let { text }: { text: string } = $props();
  const locale = useLocale();
  let status = $state("");
  let manual = $state(false);
  const phone =
    dealer.locations[0]?.phoneHref || `tel:${dealer.contacts.phone}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      status =
        locale.locale === "bg"
          ? "Копирано. Запитването не е изпратено."
          : "Copied. Your enquiry has not been sent.";
      manual = false;
    } catch {
      manual = true;
      status =
        locale.locale === "bg"
          ? "Изберете текста по-долу, за да го копирате."
          : "Select the text below to copy it.";
    }
  }
</script>

<div class="enquiry-handoff">
  <p>
    {locale.locale === "bg"
      ? "Обадете се, за да потвърдите наличността и условията. Можете да копирате запитването за справка."
      : "Call to confirm availability and terms. You can copy the enquiry for reference."}
  </p>
  <div class="handoff-actions">
    <button type="button" onclick={copy}
      >{locale.locale === "bg" ? "Копирай запитването" : "Copy enquiry"}</button
    >
    <a href={phone}>{locale.locale === "bg" ? "Обади се" : "Call dealership"}</a
    >
  </div>
  {#if status}<p role="status">{status}</p>{/if}
  {#if manual}<label
      >{locale.locale === "bg"
        ? "Текст на запитването"
        : "Enquiry text"}<textarea
        readonly
        value={text}
        rows="6"
        onclick={(event) => event.currentTarget.select()}
      ></textarea></label
    >{/if}
</div>

<style>
  .enquiry-handoff {
    display: grid;
    gap: 12px;
  }
  p {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 14px;
    line-height: 1.5;
  }
  .handoff-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  button,
  a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 44px;
    padding: 10px 18px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 999px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  a {
    flex: 1;
    border-color: var(--bs-neutral-1000);
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  button:focus-visible,
  a:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
  label {
    display: grid;
    gap: 8px;
    font-size: 14px;
  }
  textarea {
    width: 100%;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    padding: 12px;
    font: inherit;
  }
  @media (max-width: 359.98px) {
    .handoff-actions {
      flex-direction: column;
    }
  }
</style>
