<svelte:options runes={true} />

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let {
    visible,
    kind,
    container,
  }: {
    visible: boolean;
    kind: "form" | "action";
    container?: HTMLElement | null;
  } = $props();
  const portal: Attachment<HTMLOutputElement> = (node) => {
    if (!container) return;
    container.append(node);
    return () => node.remove();
  };
</script>

{#if visible}<output
    {@attach portal}
    data-demo-feedback={kind === "form" ? "" : undefined}
    data-demo-action={kind === "action" ? "" : undefined}
    class="text-sm-medium neutral-500 desktop-type-body-small"
    >{kind === "form" ? locale.t("demo.form") : locale.t("demo.action")}</output
  >{/if}
