<script lang="ts">
  import { flushSync } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { MediaQuery } from "svelte/reactivity";
  import { afterNavigate } from "$app/navigation";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileCloseButton from "#lib/components/mobile/MobileCloseButton.svelte";
  import { ownCatalogDialog } from "#lib/components/vehicle-listing/catalog-dialog.ts";

  let {
    make,
    model,
    makes,
    models,
    open = $bindable(false),
    field = $bindable<"make" | "model">("make"),
    onselect,
    onkeyword,
  }: {
    make: string;
    model: string;
    makes: readonly string[];
    models: readonly string[];
    open?: boolean;
    field?: "make" | "model";
    onselect: (field: "make" | "model", value: string) => void;
    onkeyword?: () => void;
  } = $props();
  const locale = useLocale();
  const phone = new MediaQuery("(max-width:767.98px)");
  const id = $props.id();
  let query = $state("");
  let left = $state(16);
  let top = $state(16);
  let searchInput: HTMLInputElement | undefined;
  let panel: HTMLFormElement | undefined;
  let dialog: HTMLDialogElement | undefined;
  const title = $derived(
    locale.t(field === "make" ? "catalog.make" : "catalog.model"),
  );
  const searchLabel = $derived(
    locale.t(field === "make" ? "catalog.searchMakes" : "catalog.searchModels"),
  );
  const allLabel = $derived(
    locale.t(field === "make" ? "catalog.allMakes" : "catalog.allModels"),
  );
  const options = $derived(field === "make" ? makes : models);
  const selected = $derived(field === "make" ? make : model);
  const visible = $derived(
    options.filter((value) =>
      value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    ),
  );
  const ownSearch: Attachment<HTMLInputElement> = (node) => {
    searchInput = node;
    return () => {
      searchInput = undefined;
    };
  };
  const ownPanel: Attachment<HTMLFormElement> = (node) => {
    panel = node;
    return () => {
      panel = undefined;
    };
  };
  const ownDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      dialog = undefined;
    };
  };

  export function show(next: "make" | "model", trigger: HTMLButtonElement) {
    if (next === "model" && !make) return;
    trigger.focus({ preventScroll: true });
    const anchor = trigger.getBoundingClientRect();
    field = next;
    query = "";
    left = Math.max(16, Math.min(anchor.left, window.innerWidth - 376));
    top = anchor.bottom + 8;
    flushSync(() => {
      open = true;
    });
    if (!phone.current && dialog) {
      const height = dialog.getBoundingClientRect().height;
      top =
        anchor.bottom + height + 16 <= window.innerHeight
          ? anchor.bottom + 8
          : Math.max(16, anchor.top - height - 8);
    }
    searchInput?.focus({ preventScroll: true });
  }

  function choose(value: string) {
    onselect(field, value);
    open = false;
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      open = false;
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = [
      ...(panel?.querySelectorAll<HTMLButtonElement>(".choice-option") ?? []),
    ];
    const index = buttons.findIndex((button) => button === event.target);
    if (index < 0 && !["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : index < 0
            ? event.key === "ArrowDown"
              ? 0
              : buttons.length - 1
            : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
              buttons.length;
    buttons[next]?.focus();
  }
  function backdrop(event: MouseEvent & { currentTarget: HTMLDialogElement }) {
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
  afterNavigate(() => (open = false));
</script>

{#snippet body()}
  <form
    class="choice-body"
    {@attach ownPanel}
    onsubmit={(event) => {
      event.preventDefault();
      if (query.trim() && visible[0]) choose(visible[0]);
    }}
  >
    <label class="visually-hidden" for={id + "-search"}>{searchLabel}</label
    ><input
      id={id + "-search"}
      class="choice-search"
      onkeydown={keyboard}
      type="search"
      placeholder={searchLabel}
      autocomplete="off"
      bind:value={query}
      {@attach ownSearch}
    />
    <div class="choice-options" role="group" aria-label={title}>
      {#each ["", ...visible] as value (value)}<button
          class="choice-option"
          onkeydown={keyboard}
          type="button"
          data-value={value}
          aria-pressed={selected === value}
          onclick={() => choose(value)}
          ><span>{value || allLabel}</span>{#if selected === value}<span
              aria-hidden="true">✓</span
            >{/if}</button
        >{/each}
      {#if !visible.length}<p role="status">
          {locale.locale === "bg" ? "Няма съвпадения." : "No matches."}
        </p>{/if}
    </div>
  </form>
{/snippet}
{#snippet keywords()}
  <button type="button" class="keyword-link" onclick={onkeyword}
    >{locale.locale === "bg"
      ? "Търсене по ключова дума"
      : "Search by keyword"}</button
  >
{/snippet}

{#if phone.current}
  <MobileSheet
    bind:open={
      () => open && phone.current,
      (value) => {
        if (phone.current) open = value;
      }
    }
    {title}
    class="sale-choice-sheet"
    >{#if open}{@render body()}{/if}{#snippet footer()}{#if onkeyword}{@render keywords()}{/if}{/snippet}</MobileSheet
  >
{:else if open}
  <dialog
    class="sale-choice-dialog"
    style:left={left + "px"}
    style:top={top + "px"}
    aria-labelledby={id + "-title"}
    {@attach ownCatalogDialog}
    {@attach ownDialog}
    onclose={() => {
      if (!phone.current) open = false;
    }}
    oncancel={() => (open = false)}
    onclick={backdrop}
  >
    <header>
      <h2 id={id + "-title"}>{title}</h2>
      <MobileCloseButton
        label={locale.locale === "bg" ? "Затвори" : "Close"}
        onclick={() => (open = false)}
      />
    </header>
    {@render body()}
    {#if onkeyword}<footer>{@render keywords()}</footer>{/if}
  </dialog>
{/if}

<style>
  .choice-body {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 12px;
    min-height: 0;
    max-height: 65dvh;
    padding: 12px 16px 20px;
  }
  .choice-search {
    display: block;
    width: 100%;
    min-width: 0;
    height: 44px;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 16px;
  }
  .choice-options {
    overflow-y: auto;
    min-height: 0;
  }
  .choice-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 15px;
    text-align: left;
    cursor: pointer;
  }
  .choice-option[aria-pressed="true"] {
    background: var(--bs-neutral-100);
    font-weight: 600;
  }
  @media (hover: hover) {
    .choice-option:hover {
      background: var(--bs-neutral-100);
    }
  }
  input:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: -2px;
  }
  p {
    margin: 12px;
    color: var(--bs-neutral-500);
    font-size: 14px;
  }
  .sale-choice-dialog {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    position: fixed;
    inset: auto;
    width: 360px;
    max-width: calc(100vw - 32px);
    max-height: calc(100dvh - 32px);
    margin: 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 16px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  footer {
    padding: 0 16px 12px;
  }
  .keyword-link {
    min-height: 44px;
    padding: 8px 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
  }
  .sale-choice-dialog::backdrop {
    background: rgb(0 0 0 / 15%);
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px 0;
  }
  h2 {
    margin: 0;
    font-size: 20px;
    line-height: 1.3;
  }
  header :global(.mobile-close-button) {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
</style>
