<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardOwnerProfileCard from "#lib/components/dashboard/DashboardOwnerProfileCard.svelte";
  import DashboardContactCard from "#lib/components/dashboard/DashboardContactCard.svelte";
  import DashboardSocialCard from "#lib/components/dashboard/DashboardSocialCard.svelte";
  import DashboardPasswordCard from "#lib/components/dashboard/DashboardPasswordCard.svelte";
</script>

<DashboardShell audience="owner" activeHref="/dashboard/settings">
  <div class="row mb-3">
    <div class="col-xl-12">
      <div class="card shadow-none flex-fill mb-3">
        <div class="bg-overlay overflow-hidden">
          <img
            class="w-100 h-100 img-banner"
            src="/assets/imgs/page-header/banner8.png"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-xl-12">
      <DashboardOwnerProfileCard />

      <DashboardContactCard
        fields={[
          dashboardFields.ownerCountry,
          dashboardFields.ownerCity,
          dashboardFields.ownerAddress,
          dashboardFields.ownerMap,
          dashboardFields.ownerLatitude,
          dashboardFields.ownerLongitude,
        ]}
      />

      <div class="row">
        <div class="col-lg-6">
          <DashboardSocialCard
            fields={[
              dashboardFields.ownerFacebook,
              dashboardFields.ownerTwitter,
              dashboardFields.ownerInstagram,
            ]}
          />
        </div>
        <div class="col-lg-6">
          <DashboardPasswordCard
            fields={[
              dashboardFields.ownerOldPassword,
              dashboardFields.ownerNewPassword,
              dashboardFields.ownerConfirmPassword,
            ]}
          />
        </div>
      </div>
    </div>
  </div>
</DashboardShell>
