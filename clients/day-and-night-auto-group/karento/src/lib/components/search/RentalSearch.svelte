<script lang="ts">
  import { tick } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { MediaQuery } from "svelte/reactivity";
  import { afterNavigate } from "$app/navigation";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { dealer } from "#lib/content.ts";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileCloseButton from "#lib/components/mobile/MobileCloseButton.svelte";
  import { ownCatalogDialog } from "#lib/components/vehicle-listing/catalog-dialog.ts";

  const locale = useLocale();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const id = $props.id();
  let {
    pickup = $bindable(""),
    returning = $bindable(""),
    preference = $bindable(""),
  }: { pickup?: string; returning?: string; preference?: string } = $props();
  let open = $state(false);
  let today = $state("");
  let reviewed = $state(false);
  let pickupInput: HTMLInputElement | undefined;
  const ownPickup: Attachment<HTMLInputElement> = (node) => {
    pickupInput = node;
    return () => {
      pickupInput = undefined;
    };
  };
  const focusSummary: Attachment<HTMLHeadingElement> = (node) => {
    node.focus({ preventScroll: true });
  };
  const location = $derived(
    dealer.locations[0]?.address || dealer.locations[0]?.name || "",
  );
  const copy = $derived(
    locale.locale === "bg"
      ? {
          title: "Автомобил под наем",
          pickup: "Вземане",
          returning: "Връщане",
          vehicle: "Предпочитан автомобил",
          placeholder: "Марка, модел или тип автомобил",
          location: "Адрес на автосалона",
          note: "Наличността и цената се потвърждават от Day & Night за избраните дати.",
          next: "Преглед на запитването",
          review: "Вашето запитване",
          pending:
            "Запитването не е изпратено. Обадете се, за да проверите наличността и условията.",
          call: "Обади се за наличност",
          edit: "Редактирай",
          clear: "Изчисти",
          flexible: "Без предпочитание",
          close: "Затвори запитването",
        }
      : {
          title: "Rent a car",
          pickup: "Pick-up date",
          returning: "Return date",
          vehicle: "Vehicle preference",
          placeholder: "Make, model or vehicle type",
          location: "Dealer location",
          note: "Day & Night will confirm availability and pricing for your dates.",
          next: "Review enquiry",
          review: "Your rental enquiry",
          pending:
            "Your enquiry has not been sent. Call to confirm availability and rental terms.",
          call: "Call for availability",
          edit: "Edit",
          clear: "Clear all",
          flexible: "No preference",
          close: "Close rental enquiry",
        },
  );
  const phoneHref = $derived(
    dealer.locations[0]?.phoneHref || `tel:${dealer.contacts.phone}`,
  );

  export function openSearch() {
    const now = new Date();
    today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    reviewed = false;
    open = true;
  }

  function review(event: SubmitEvent) {
    event.preventDefault();
    reviewed = true;
  }

  async function edit() {
    reviewed = false;
    await tick();
    pickupInput?.focus({ preventScroll: true });
  }

  function formatDate(value: string) {
    return locale.date(value);
  }

  function dismissBackdrop(
    event: MouseEvent & { currentTarget: HTMLDialogElement },
  ) {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      open = false;
  }

  afterNavigate(() => {
    open = false;
  });
</script>

{#snippet body()}
  <form
    id={id + "-rental"}
    class="rental-body mobile-filter-body"
    onsubmit={review}
  >
    {#if reviewed}
      <h3
        tabindex="-1"
        aria-describedby={id + "-pending"}
        {@attach focusSummary}
      >
        {copy.review}
      </h3>
      <dl>
        <div>
          <dt>{copy.pickup}</dt>
          <dd>{formatDate(pickup)}</dd>
        </div>
        <div>
          <dt>{copy.returning}</dt>
          <dd>{formatDate(returning)}</dd>
        </div>
        <div>
          <dt>{copy.vehicle}</dt>
          <dd>{preference.trim() || copy.flexible}</dd>
        </div>
        <div>
          <dt>{copy.location}</dt>
          <dd>{location}</dd>
        </div>
      </dl>
      <p id={id + "-pending"} role="status">{copy.pending}</p>
    {:else}
      <div class="rental-dates">
        <label
          ><span>{copy.pickup}</span><input
            type="date"
            required
            min={today}
            max={returning || undefined}
            bind:value={pickup}
            {@attach ownPickup}
          /></label
        >
        <label
          ><span>{copy.returning}</span><input
            type="date"
            required
            min={pickup || today}
            bind:value={returning}
          /></label
        >
      </div>
      <label
        ><span>{copy.vehicle}</span><input
          type="text"
          maxlength="120"
          placeholder={copy.placeholder}
          bind:value={preference}
        /></label
      >
      <div class="rental-location">
        <strong>{copy.location}</strong><span>{location}</span>
      </div>
      <p>{copy.note}</p>
    {/if}
  </form>
{/snippet}

{#snippet actions()}
  {#if reviewed}
    <button type="button" class="rental-secondary" onclick={edit}
      >{copy.edit}</button
    >
    <a class="rental-primary" href={phoneHref}>{copy.call}</a>
  {:else}
    <button
      type="button"
      class="rental-secondary"
      onclick={() => {
        pickup = "";
        returning = "";
        preference = "";
      }}>{copy.clear}</button
    >
    <button type="submit" class="rental-primary" form={id + "-rental"}
      >{copy.next}</button
    >
  {/if}
{/snippet}

{#if phone.current}
  <MobileSheet
    bind:open
    title={copy.title}
    class="rental-search-sheet mobile-catalog-editor"
  >
    {#if open}{@render body()}{/if}
    {#snippet footer()}{@render actions()}{/snippet}
  </MobileSheet>
{:else if open}
  <dialog
    class="rental-dialog"
    aria-labelledby={id + "-title"}
    {@attach ownCatalogDialog}
    onclose={() => {
      open = false;
    }}
    oncancel={() => {
      open = false;
    }}
    onclick={dismissBackdrop}
  >
    <header>
      <h2 id={id + "-title"}>{copy.title}</h2>
      <MobileCloseButton
        label={copy.close}
        onclick={() => {
          open = false;
        }}
      />
    </header>
    {@render body()}
    <footer>{@render actions()}</footer>
  </dialog>
{/if}

<style>
  .rental-body {
    display: flex;
    flex-direction: column;
    gap: var(--karento-space-4, 16px);
    color: var(--bs-neutral-1000);
    text-align: left;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
  input {
    width: 100%;
    min-width: 0;
    height: 44px;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-1000);
    font: inherit;
  }
  input::placeholder {
    color: var(--bs-neutral-500);
    opacity: 1;
  }
  .rental-dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .rental-location {
    display: grid;
    gap: 4px;
    font-size: 14px;
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    color: var(--bs-neutral-500);
  }
  h3 {
    margin: 0;
    font-size: 18px;
    line-height: 26px;
  }
  dl {
    display: grid;
    gap: 16px;
    margin: 0;
  }
  dl div {
    display: grid;
    gap: 4px;
  }
  dt {
    color: var(--bs-neutral-500);
    font-size: 13px;
  }
  dd {
    margin: 0;
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  .rental-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 44px;
    margin-left: auto;
    padding: 10px 20px;
    border: 1px solid var(--bs-neutral-1000);
    border-radius: var(--karento-radius-pill, 999px);
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }
  .rental-secondary {
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: var(--bs-neutral-500);
    font: inherit;
    font-size: 14px;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }
  input:focus-visible,
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
  dialog.rental-dialog {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0 0 0 auto;
    width: min(560px, 100vw);
    height: 100dvh;
    max-height: 100dvh;
    max-width: 100vw;
    margin: 0;
    padding: 0;
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-desktop-card-radius, 20px) 0 0
      var(--karento-desktop-card-radius, 20px);
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-1000);
    overflow: hidden;
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 32%);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 28px;
    border-bottom: 1px solid var(--bs-neutral-200);
  }
  h2 {
    margin: 0;
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
  }
  .rental-dialog :global(.mobile-close-button) {
    display: grid;
    place-items: center;
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-radius-pill, 999px);
    background: var(--bs-background-card, #fff);
    color: inherit;
    cursor: pointer;
  }
  .rental-dialog .rental-body {
    flex: 1;
    min-height: 0;
    padding: 24px 28px;
    overflow-y: auto;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 28px;
    border-top: 1px solid var(--bs-neutral-200);
  }
  @media (max-width: 359.98px) {
    .rental-dates {
      grid-template-columns: 1fr;
    }
  }
</style>
