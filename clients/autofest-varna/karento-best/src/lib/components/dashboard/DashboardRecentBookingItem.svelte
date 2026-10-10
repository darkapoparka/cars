<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardRecentBooking } from "#lib/data/dashboard.ts";
  let { booking }: { booking: DashboardRecentBooking } = $props();
</script>

<div class="card shadow-none mb-2">
  <div class="card-body">
    <div class="d-flex align-items-center flex-wrap row-gap-2">
      <a
        href={locale.href("/vehicle")}
        class="thumb-1 flex-shrink-0 me-2"
        aria-label={locale.t("ui.dashboard-recent-booking-item.view-details")}
      >
        <img src={booking.image} class="img-fluid" alt={booking.imageAlt} />
      </a>
      <div class="flex-fill">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
            ><a href={locale.href("/vehicle")} aria-label={booking.label}
              >{booking.title}<span
                class="text-gray-5 fw-normal fs-8 desktop-type-meta"
                >{locale.text(booking.location)}</span
              ></a
            >
          </p>
          <span class="badge badge-purple badge-sm neutral-500 rounded-pill"
            ><i class="ti ti-point-filled me-1"></i>{locale.t(
              "ui.dashboard-recent-booking-item.paid",
            )}</span
          >
        </div>
        <div class="d-flex align-items-center flex-wrap">
          <p
            class="fs-8 d-flex align-items-center border-end pe-2 me-2 mb-0 desktop-type-meta"
            ><i class="isax isax-calendar-25 me-2"></i>{locale.text(
              booking.date,
            )}</p
          >
          <p class="fs-8 d-flex align-items-center desktop-type-meta"
            ><i class="isax isax-timer5 me-2"></i>{locale.text(booking.time)}</p
          >
        </div>
      </div>
    </div>
  </div>
</div>
