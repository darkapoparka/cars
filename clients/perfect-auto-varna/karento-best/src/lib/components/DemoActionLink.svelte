<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import type { Attachment } from "svelte/attachments";
  import { usePreview } from "#lib/preview.svelte.ts";
  import DemoFeedback from "./DemoFeedback.svelte";
  let {
    children,
    getFeedbackContainer,
    ...attributes
  }: Omit<HTMLAnchorAttributes, "onclick"> & {
    children: Snippet;
    getFeedbackContainer?: () => HTMLElement | null | undefined;
  } = $props();
  let clicked = $state(false);
  let control = $state<HTMLAnchorElement>();
  let feedbackContainer = $state<HTMLElement>();
  let ownedContainer: HTMLElement | undefined;
  const preview = usePreview();
  const feedbackOwner = Symbol("demo action");
  function releaseOwnedFeedback() {
    if (
      ownedContainer &&
      preview.actionFeedback.get(ownedContainer) === feedbackOwner
    ) {
      preview.actionFeedback.delete(ownedContainer);
    }
    ownedContainer = undefined;
  }
  const releaseFeedback: Attachment<HTMLAnchorElement> = () =>
    releaseOwnedFeedback;
  function showFeedback(
    event: MouseEvent & { currentTarget: HTMLAnchorElement },
  ) {
    event.preventDefault();
    const container =
      getFeedbackContainer?.() ?? event.currentTarget.parentElement;
    if (!container) return;
    if (ownedContainer && ownedContainer !== container) {
      releaseOwnedFeedback();
      clicked = false;
    }
    if (!preview.actionFeedback.has(container)) {
      preview.actionFeedback.set(container, feedbackOwner);
      ownedContainer = container;
      feedbackContainer = container;
      clicked = true;
    }
  }
</script>

<a
  {...attributes}
  bind:this={control}
  {@attach releaseFeedback}
  onclick={showFeedback}>{@render children()}</a
><DemoFeedback
  visible={clicked}
  kind="action"
  container={feedbackContainer ?? control?.parentElement}
/>
