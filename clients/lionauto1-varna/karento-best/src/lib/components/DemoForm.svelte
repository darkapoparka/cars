<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";
  import DemoFeedback from "./DemoFeedback.svelte";
  let {
    children,
    ...attributes
  }: Omit<HTMLFormAttributes, "onsubmit"> & { children: Snippet } = $props();
  let submitted = $state(false);
</script>

<form
  {...attributes}
  onsubmit={(event) => {
    event.preventDefault();
    submitted = true;
  }}>{@render children()}<DemoFeedback visible={submitted} kind="form" /></form
>
