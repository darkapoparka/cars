<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardPreviewImage } from "#lib/data/dashboard.ts";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  let { image }: { image: DashboardPreviewImage } = $props();
</script>

<div class="image-preview">
  <div class="box-image-preview"
    ><img src={image.src} alt={image.alt} /><DemoActionLink
      class="btn-delete-image"
      href="#!"
      aria-label={locale.t("ui.dashboard-image-preview.view-details")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M9.3335 7.33333V11.3333"
          stroke=""
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M6.6665 7.33333V11.3333"
          stroke=""
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M4 4.66667V12.6667C4 13.403 4.59695 14 5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V4.66667"
          stroke=""
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M2.6665 4.66667H13.3332"
          stroke=""
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M4.6665 4.66667L5.99984 2H9.99984L11.3332 4.66667"
          stroke=""
          stroke-linecap="round"
          stroke-linejoin="round"
        >
        </path>
      </svg></DemoActionLink
    ></div
  >
</div>
