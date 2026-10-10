<svelte:options runes={true} />

<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";
  import MobileIconButton from "./MobileIconButton.svelte";

  let {
    label,
    onclick,
    class: className = "",
  }: {
    label: string;
    onclick: MouseEventHandler<HTMLButtonElement>;
    class?: string;
  } = $props();
</script>

<MobileIconButton
  class={`mobile-close-button ${className}`}
  icon="close"
  {label}
  {onclick}
/>
