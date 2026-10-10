<script lang="ts">
  import type { Snippet } from "svelte";
  import ResponsiveDisclosure from "./ResponsiveDisclosure.svelte";
  let {
    title,
    class: className,
    children,
  }: { title: string; class: string; children: Snippet } = $props();
</script>

<div class={[className, "footer-link-column"]}>
  <ResponsiveDisclosure {title} class="footer-link-group">
    {#snippet heading()}<h6 class="text-linear-3 desktop-type-compact-card"
        >{title}</h6
      >{/snippet}
    {@render children()}
  </ResponsiveDisclosure>
</div>

<style>
  @media (max-width: 767.98px) {
    .footer-link-column {
      width: 100%;
      margin-block: 0 !important;
      color: var(--bs-neutral-0);
      --karento-disclosure-border: var(--bs-neutral-700);
    }
    h6 {
      margin: 0;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }
  }
</style>
