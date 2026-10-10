<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardNotification } from "#lib/data/dashboard.ts";
  let { notification }: { notification: DashboardNotification } = $props();
</script>

<div class="d-flex align-items-center mb-3"
  ><span class={notification.badgeClass}
    ><i class={notification.iconClass}></i></span
  ><div class="flex-fill overflow-hidden"
    ><div class="d-flex justify-content-between align-items-center"
      ><p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
        >{locale.text(notification.title)}</p
      ><p class="fs-8 text-primary-dark text-nowrap desktop-type-meta"
        >{locale.text(notification.time)}</p
      ></div
    ><p class="fs-8 two-line-ellipsis neutral-500 desktop-type-meta"
      >{locale.text(notification.lead)}{#if notification.emphasis}<span
          class="text-md-bold neutral-700">{notification.emphasis}</span
        >{#if notification.tail !== undefined}{locale.text(
            notification.tail,
          )}{/if}{/if}</p
    ></div
  ></div
>
