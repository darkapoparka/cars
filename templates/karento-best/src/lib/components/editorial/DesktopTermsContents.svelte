<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  const sections = [
    ["Acceptance", "terms.acceptance.title"],
    ["Services", "terms.services.title"],
    ["Responsibility", "terms.responsibilities.title"],
    ["Account", "terms.account.title"],
    ["Payment", "terms.payment.title"],
    ["Cancellations", "terms.cancellation.title"],
    ["Limitation", "terms.liability.title"],
    ["Privacy", "terms.privacy.title"],
    ["changetem", "terms.changes.title"],
  ] as const;
</script>

<nav class="desktop-terms-contents" aria-label={locale.t("terms.onThisPage")}>
  <h6 class="desktop-type-card">{locale.t("terms.onThisPage")}</h6>
  <ul>
    {#each sections as [id, label] (id)}
      <li
        ><a
          class="desktop-type-body-small"
          href={locale.href("#" + id)}
          aria-current={page.url.hash === "#" + id ? "location" : undefined}
          >{locale.t(label)}</a
        ></li
      >
    {/each}
    <li
      ><a class="desktop-type-body-small" href={locale.href("/contact")}
        >{locale.t("terms.contact")}
        <span aria-hidden="true">↗</span></a
      ></li
    >
  </ul>
</nav>

<style>
  h6 {
    margin-bottom: 16px;
    font-size: 20px;
    line-height: 1.3;
  }
  ul {
    display: grid;
    gap: 4px;
    margin: 0;
    padding: 0;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 40px;
    padding: 8px 10px;
    border-radius: 10px;
    color: var(--bs-neutral-600);
    font-size: 14px;
    line-height: 1.5;
  }
  a:hover,
  a[aria-current="location"] {
    background: var(--bs-neutral-100);
    color: var(--bs-neutral-1000);
  }
  a[aria-current="location"] {
    font-weight: 700;
  }
  a:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 2px;
  }
  @media (min-width: 992px) {
    .desktop-terms-contents a.desktop-type-body-small[aria-current="location"] {
      font-weight: var(--karento-type-control-weight) !important;
    }
  }

  @media (min-width: 992px) {
    h6 {
      margin-bottom: var(--karento-desktop-space-4);
    }
    ul {
      gap: var(--karento-desktop-space-1);
    }
    a {
      gap: var(--karento-desktop-space-2);
      min-height: var(--karento-desktop-control-height);
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-3);
      border-radius: var(--karento-desktop-control-radius);
    }
  }
</style>
