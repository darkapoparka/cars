<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardPreferenceGroup } from "#lib/data/dashboard.ts";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let { group, idBase }: { group: DashboardPreferenceGroup; idBase: string } =
    $props();
</script>

<div class="row mb-3">
  <div class="col-lg-6">
    {#if group.logo}<div class="d-flex align-items-center"
        ><div class="image-logo"
          ><img
            src={group.logo}
            alt={group.logoAlt}
            class={group.logoClass}
          /></div
        ><div class="ms-3"
          ><p class="fw-bold fs-6 desktop-type-compact-card"
            >{locale.text(group.title)}</p
          ><p class="neutral-500">{locale.text(group.description)}</p></div
        ></div
      >
    {:else}<p class="fw-bold fs-6 desktop-type-compact-card"
        >{locale.text(group.title)}</p
      ><p class="neutral-500">{locale.text(group.description)}</p>{/if}
  </div>
  <div class="col-lg-6"
    ><div class={group.toggleContainerClass}>
      {#each group.toggles as toggle (toggle.suffix)}<div
          class={group.toggleClass}
          >{#if phone.current}<label class="dashboard-preference-control">
              <span class="fw-bold desktop-type-label"
                >{locale.text(toggle.label)}</span
              >
              <span class="form-check form-switch"
                ><input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id={idBase + toggle.suffix}
                  checked={toggle.checked}
                  aria-label={locale.text(toggle.label)}
                /></span
              >
            </label>
          {:else}<label
              class="fw-bold desktop-type-label"
              for={idBase + toggle.suffix}>{locale.text(toggle.label)}</label
            ><div class="form-check form-switch"
              ><input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id={idBase + toggle.suffix}
                checked={toggle.checked}
                aria-label={toggle.ariaLabel}
              /></div
            >{/if}</div
        >{/each}
    </div></div
  >
</div>

<style>
  @media (max-width: 767.98px) {
    .dashboard-preference-control {
      display: grid;
      min-width: var(--karento-touch-target);
      min-height: var(--karento-touch-target);
      cursor: pointer;
    }
    .dashboard-preference-control .form-check {
      display: block;
      margin-bottom: 0;
    }
  }
</style>
