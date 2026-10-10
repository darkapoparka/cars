<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    dashboardAudiences,
    type DashboardAudience,
  } from "#lib/data/dashboard.ts";
  let {
    audience,
    activeHref,
  }: { audience: DashboardAudience; activeHref: string } = $props();
  const profile = $derived(dashboardAudiences[audience]);
</script>

<div class="card user-sidebar mb-4">
  <div class="card-header user-sidebar-header">
    <div class="profile-content rounded-pill">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center justify-content-center py-2">
          {#if audience === "member"}
            <img
              src={profile.avatar}
              alt=""
              class="img-fluid avatar avatar-lg rounded-circle me-3"
            />
          {:else}
            <a
              href={locale.href("/vehicles")}
              class="item-brand me-2"
              aria-label={locale.t("ui.dashboard-sidebar.view-details")}
            >
              <img
                class="light-mode"
                src={profile.brandLight}
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src={profile.brandDark}
                alt={locale.t("image.illustrative")}
              />
            </a>
          {/if}
          <div
            ><p class="fw-bold fs-5 desktop-type-card">{profile.name}</p><span
              class="fs-14 text-gray-6 desktop-type-meta"
              >{locale.text(profile.since)}</span
            ></div
          >
        </div>
        <div
          ><div class="d-flex align-items-center justify-content-center"
            ><a
              href={locale.href(profile.settingsHref)}
              class="p-1 rounded-circle align-items-center justify-content-center btn-edit"
              aria-label={locale.t("ui.dashboard-sidebar.view-details")}
              ><i class="fi fi-rr-pencil fs-7"></i></a
            ></div
          ></div
        >
      </div>
    </div>
  </div>
  <div class="card-body user-sidebar-body">
    <ul class="dashboard-sidebar-menu" aria-label={locale.text(profile.label)}>
      {#each profile.links as link (link.href)}
        <li class="py-2"
          ><a
            class="desktop-type-nav"
            href={locale.href(link.href)}
            aria-current={activeHref === link.href ? "page" : undefined}
            aria-label={locale.text(link.label)}
            ><i class={link.icon}></i> {locale.text(link.label)}</a
          ></li
        >
      {/each}
    </ul>
  </div>
</div>
