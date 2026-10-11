<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Attachment } from "svelte/attachments";
  import { usePreview } from "#lib/preview.svelte.ts";
  import DemoFeedback from "./DemoFeedback.svelte";
  let {
    children,
    ...attributes
  }: Omit<HTMLButtonAttributes, "onclick"> & { children: Snippet } = $props();
  let clicked = $state(false);
  let control = $state<HTMLButtonElement>();
  const preview = usePreview();
  const feedbackOwner = Symbol("demo action");
  const releaseFeedback: Attachment<HTMLButtonElement> = (node) => {
    const parent = node.parentElement;
    return () => {
      if (parent && preview.actionFeedback.get(parent) === feedbackOwner) {
        preview.actionFeedback.delete(parent);
      }
    };
  };
  function showFeedback(
    event: MouseEvent & { currentTarget: HTMLButtonElement },
  ) {
    event.preventDefault();
    const parent = event.currentTarget.parentElement;
    if (parent && !preview.actionFeedback.has(parent)) {
      preview.actionFeedback.set(parent, feedbackOwner);
      clicked = true;
    }
  }
</script>

<button
  {...attributes}
  bind:this={control}
  {@attach releaseFeedback}
  onclick={showFeedback}>{@render children()}</button
><DemoFeedback
  visible={clicked}
  kind="action"
  container={control?.parentElement}
/>
