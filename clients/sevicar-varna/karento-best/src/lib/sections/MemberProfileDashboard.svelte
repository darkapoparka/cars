<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardMemberProfileCard from "#lib/components/dashboard/DashboardMemberProfileCard.svelte";
  import DashboardContactCard from "#lib/components/dashboard/DashboardContactCard.svelte";
  import DashboardSocialCard from "#lib/components/dashboard/DashboardSocialCard.svelte";
  import DashboardPasswordCard from "#lib/components/dashboard/DashboardPasswordCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account/profile">
  <div class="row">
    <div class="col-xl-12">
      <DashboardMemberProfileCard />

      <DashboardContactCard
        fields={[
          dashboardFields.memberCountry,
          dashboardFields.memberCity,
          dashboardFields.memberAddress,
          dashboardFields.memberMap,
          dashboardFields.memberLatitude,
          dashboardFields.memberLongitude,
        ]}
      />

      <div class="row">
        <div class="col-lg-6">
          <DashboardSocialCard
            fields={[
              dashboardFields.memberFacebook,
              dashboardFields.memberTwitter,
              dashboardFields.memberInstagram,
            ]}
          />
        </div>
        <div class="col-lg-6">
          <DashboardPasswordCard
            fields={[
              dashboardFields.memberOldPassword,
              dashboardFields.memberNewPassword,
              dashboardFields.memberConfirmPassword,
            ]}
          />
        </div>
      </div>
    </div>
  </div>
</DashboardShell>
