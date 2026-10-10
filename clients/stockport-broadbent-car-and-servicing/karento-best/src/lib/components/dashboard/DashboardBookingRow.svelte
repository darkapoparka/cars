<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import type { DashboardBooking } from "#lib/data/dashboard.ts";
  let {
    booking,
    showActions = false,
  }: { booking: DashboardBooking; showActions?: boolean } = $props();
</script>

<tr>
  <td
    ><DemoActionLink
      href="#!"
      class="text-primary-dark fw-medium"
      aria-label={booking.id}>{booking.id}</DemoActionLink
    >
  </td>
  <td>
    <div class="d-flex align-items-center">
      <a
        href={locale.href(booking.vehicleHref)}
        class="avatar avatar-lg"
        aria-label={locale.t("ui.dashboard-booking-row.view-details")}
        ><img src={booking.image} class="img-fluid" alt={booking.imageAlt} /></a
      >
      <div class="ms-2">
        <p class="text-dark mb-0 fw-medium fs-14"
          ><a
            href={locale.href(booking.vehicleHref)}
            aria-label={booking.vehicleLabel}>{booking.vehicleTitle}</a
          >
        </p>
        <span class="fs-14 fw-normal neutral-500 desktop-type-meta"
          >{locale.text(booking.vehicleType)}</span
        >
      </div>
    </div>
  </td>
  <td>{locale.text(booking.travellers)}</td>
  <td>{locale.text(booking.days)}</td>
  <td>{booking.price}</td>
  <td>{booking.date}</td>
  <td>
    <span class={booking.statusClass}
      ><i class={booking.statusIcon}></i>{locale.text(booking.status)}</span
    >
  </td>
  {#if showActions}<td>
      <div class="d-flex align-items-center">
        <DemoActionLink
          href="#!"
          class="dashboard-booking-action"
          data-bs-toggle="modal"
          data-bs-target={booking.actionTarget}
          aria-label={locale.t("ui.dashboard-booking-row.view-details")}
          ><i class="fi fi-rr-arrow-up-right-from-square" aria-hidden="true"
          ></i></DemoActionLink
        >
      </div>
    </td>{/if}
</tr>
