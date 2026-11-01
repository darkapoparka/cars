<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import type { Attachment } from "svelte/attachments";
  const phone = new MediaQuery("(max-width: 767.98px)");
  import {
    dashboardAudiences,
    type DashboardAudience,
  } from "#lib/data/dashboard.ts";
  let {
    audience,
    activeHref,
  }: { audience: DashboardAudience; activeHref: string } = $props();
  const profile = $derived(dashboardAudiences[audience]);
  const revealCurrent: Attachment<HTMLUListElement> = (node) => {
    const reveal = () => {
      if (!phone.current) return;
      const current = node.querySelector<HTMLElement>('[aria-current="page"]');
      if (!current) return;
      const rail = node.getBoundingClientRect();
      const item = current.getBoundingClientRect();
      if (item.left < rail.left) node.scrollLeft += item.left - rail.left;
      else if (item.right > rail.right)
        node.scrollLeft += item.right - rail.right;
    };
    const observer = new ResizeObserver(reveal);
    observer.observe(node);
    $effect(() => {
      void activeHref;
      void locale.locale;
      if (!phone.current) return;
      const frame = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(frame);
    });
    return () => observer.disconnect();
  };
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
              class="p-1 rounded-circle align-items-center justify-content-center btn-edit dashboard-profile-edit"
              aria-label={locale.t(
                phone.current
                  ? "account.settings"
                  : "ui.dashboard-sidebar.view-details",
              )}
              >{#if phone.current}<MobileIcon
                  name="edit"
                  size="action"
                />{:else}<i class="fi fi-rr-pencil fs-7"></i>{/if}</a
            ></div
          ></div
        >
      </div>
    </div>
  </div>
  <div class="card-body user-sidebar-body">
    <ul
      class="dashboard-sidebar-menu"
      aria-label={locale.text(profile.label)}
      {@attach revealCurrent}
    >
      {#each profile.links as link (link.href)}
        <li class="py-2"
          ><a
            class="desktop-type-nav"
            href={locale.href(link.href)}
            aria-current={activeHref === link.href ? "page" : undefined}
            aria-label={locale.text(link.label)}
            ><i class={link.icon} aria-hidden="true"></i>
            {locale.text(link.label)}</a
          ></li
        >
      {/each}
    </ul>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .dashboard-profile-edit {
      position: relative;
    }
    .dashboard-profile-edit::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      transform: translate(-50%, -50%);
      content: "";
    }
  }
</style>
