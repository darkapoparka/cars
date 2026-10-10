<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardField } from "#lib/data/dashboard.ts";
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import { MediaQuery } from "svelte/reactivity";
  import type { HTMLInputAttributes } from "svelte/elements";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  let { field }: { field: DashboardField } = $props();
  const phoneTypes = new Map<string, HTMLInputAttributes["type"]>([
    [dashboardFields.memberEmail.id, "email"],
    [dashboardFields.ownerEmail.id, "email"],
    [dashboardFields.memberContactNumber.id, "tel"],
    [dashboardFields.ownerContactNumber.id, "tel"],
    ...[
      dashboardFields.memberWebsite,
      dashboardFields.ownerWebsite,
      dashboardFields.memberFacebook,
      dashboardFields.ownerFacebook,
      dashboardFields.memberTwitter,
      dashboardFields.ownerTwitter,
      dashboardFields.memberInstagram,
      dashboardFields.ownerInstagram,
    ].map((item) => [item.id, "url"] as const),
  ]);
  const inputType = $derived(
    phone.current ? (phoneTypes.get(field.id ?? "") ?? field.type) : field.type,
  );
  const controlName = $derived(
    locale.text(
      (phone.current || desktop.current) && field.label
        ? field.label
        : field.ariaLabel,
    ),
  );
  const inputMode = $derived<HTMLInputAttributes["inputmode"]>(
    !phone.current
      ? undefined
      : inputType === "email"
        ? "email"
        : inputType === "tel"
          ? "tel"
          : inputType === "url"
            ? "url"
            : undefined,
  );
</script>

{#snippet label()}
  {#if field.label}<label
      class={[field.labelClass, "desktop-type-label"]}
      for={field.id}>{locale.text(field.label)}</label
    >{/if}
{/snippet}
<div class={field.columnClass}>
  {#if field.labelOutside}{@render label()}{/if}
  <div class="form-group">
    {#if !field.labelOutside}{@render label()}{/if}
    {#if field.control === "textarea"}
      <textarea
        class="form-control"
        placeholder={locale.text(field.placeholder)}
        rows={field.rows}
        id={field.id}
        aria-label={controlName}>{field.value ?? ""}</textarea
      >
    {:else}
      <input
        class="form-control"
        type={inputType}
        inputmode={inputMode}
        placeholder={locale.text(field.placeholder)}
        value={field.value}
        id={field.id}
        aria-label={controlName}
      />
    {/if}
  </div>
</div>
