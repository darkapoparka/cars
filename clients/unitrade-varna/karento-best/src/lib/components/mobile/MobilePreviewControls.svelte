<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Attachment } from "svelte/attachments";

  let {
    enabled = true,
    children,
    class: className = "",
  }: {
    enabled?: boolean;
    children: Snippet<[(() => HTMLElement | undefined) | undefined]>;
    class?: string;
  } = $props();

  let feedbackHost: HTMLDivElement | undefined;
  const ownFeedbackHost: Attachment<HTMLDivElement> = (node) => {
    feedbackHost = node;
    return () => {
      feedbackHost = undefined;
    };
  };
  function getFeedbackContainer() {
    return feedbackHost;
  }
</script>

{#if enabled}
  <div class={["mobile-preview-controls", className]}>
    {@render children(getFeedbackContainer)}
    <div class="mobile-preview-feedback" {@attach ownFeedbackHost}></div>
  </div>
{:else}
  {@render children(undefined)}
{/if}
