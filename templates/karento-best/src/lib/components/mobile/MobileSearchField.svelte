<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import MobileIcon from "./MobileIcon.svelte";
  import type { Attachment } from "svelte/attachments";

  let {
    value = $bindable(""),
    label,
    placeholder = label,
    class: className = "",
  }: {
    value?: string;
    label: string;
    placeholder?: string;
    class?: string;
  } = $props();

  const id = $props.id();
  let input: HTMLInputElement | undefined;
  const ownInput: Attachment<HTMLInputElement> = (node) => {
    input = node;
    return () => {
      input = undefined;
    };
  };

  function clear() {
    value = "";
    input?.focus({ preventScroll: true });
  }
</script>

<div class={["mobile-text-search", className]} role="search" aria-label={label}>
  <label class="visually-hidden" for={id}>{label}</label>
  <MobileIcon name="search" size={20} />
  <input
    {id}
    type="search"
    {placeholder}
    autocomplete="off"
    enterkeyhint="search"
    {@attach ownInput}
    bind:value
  />
  {#if value}<button
      type="button"
      aria-label={locale.t("ui.mobile-search-field.clear-search")}
      onclick={clear}
    >
      <MobileIcon name="close" />
    </button>{/if}
</div>
