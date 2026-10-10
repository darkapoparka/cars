<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  let {
    title,
    bodyClass = "box-collapse scrollFilter",
    children,
    footer,
  }: {
    title: string;
    bodyClass?: string;
    children: Snippet;
    footer?: Snippet;
  } = $props();
  let open = $state(true);
  function toggleFromKeyboard(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open = !open;
    }
  }
</script>

<div class="sidebar-left border-1 background-body">
  <div class="box-filters-sidebar">
    <div class="block-filter border-1">
      <h6
        class={[
          "text-lg-bold item-collapse neutral-1000 desktop-type-compact-card",
          { "collapsed-item": !open },
        ]}
        ><span
          role="button"
          tabindex="0"
          aria-expanded={open}
          onclick={() => (open = !open)}
          onkeydown={toggleFromKeyboard}>{title}</span
        ></h6
      >
      <div class={bodyClass} style:display={open ? undefined : "none"}>
        {@render children()}
      </div>
      {@render footer?.()}
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .sidebar-left {
      border-radius: var(--karento-desktop-card-radius);
      padding: var(--karento-desktop-panel-padding);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
  }
</style>
