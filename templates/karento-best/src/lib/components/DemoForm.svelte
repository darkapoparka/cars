<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";
  import DemoFeedback from "./DemoFeedback.svelte";
  let {
    children,
    onpreview,
    ...attributes
  }: Omit<HTMLFormAttributes, "onsubmit"> & {
    children: Snippet;
    onpreview?: () => void;
  } = $props();
  let submitted = $state(false);
</script>

<form
  {...attributes}
  method="dialog"
  onsubmit={(event) => {
    event.preventDefault();
    submitted = true;
    onpreview?.();
  }}>{@render children()}<DemoFeedback visible={submitted} kind="form" /></form
>
