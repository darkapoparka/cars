<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { shareVehiclePage, type ShareResult } from "#lib/i18n/share.ts";
  import { dealer } from "#lib/content.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import {
    referenceHeading,
    type DetailHeading,
  } from "#lib/data/vehicle-detail.ts";
  let {
    heading = referenceHeading,
    showActions = true,
    showMap = true,
    primary = false,
  }: {
    heading?: DetailHeading;
    showActions?: boolean;
    showMap?: boolean;
    primary?: boolean;
  } = $props();
  let shareFeedback = $state<ShareResult | null>(null);
  async function shareVehicle() {
    shareFeedback = null;
    const result = await shareVehiclePage(
      locale.shareUrl(new URL(location.href)),
      heading.titleKey ? locale.t(heading.titleKey) : heading.title,
      {
        share: navigator.share?.bind(navigator),
        writeText: navigator.clipboard?.writeText.bind(navigator.clipboard),
      },
    );
    if (result === "copied" || result === "unavailable") shareFeedback = result;
  }
  const phone = new MediaQuery("(max-width: 767.98px)");
  const title = $derived(
    phone.current
      ? (heading.mobileTitle ?? heading.title)
      : heading.titleKey
        ? locale.t(heading.titleKey)
        : heading.title,
  );
</script>

<div class="tour-header">
  {#if !dealer.businessPreview && heading.rating}<div class="tour-rate">
      <div class="rate-element">
        <span class="rating"
          >{heading.rating}
          <span class="text-sm-medium neutral-500"
            >{locale.text(heading.reviewCount)}</span
          ></span
        >
      </div>
    </div>{/if}
  <div class="row">
    <div class="col-lg-8">
      <div class="tour-title-main">
        {#if primary}<h1 class="neutral-1000 desktop-type-detail">{title}</h1>
        {:else}<h4 class="neutral-1000 desktop-type-detail">{title}</h4>{/if}
      </div>
    </div>
  </div>
  <div class="tour-metas">
    <div class="tour-meta-left">
      <p
        class="text-md-medium neutral-1000 mr-20 tour-location desktop-type-meta"
      >
        <svg
          class="invert"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M7.99967 0C4.80452 0 2.20508 2.59944 2.20508 5.79456C2.20508 9.75981 7.39067 15.581 7.61145 15.8269C7.81883 16.0579 8.18089 16.0575 8.38789 15.8269C8.60867 15.581 13.7943 9.75981 13.7943 5.79456C13.7942 2.59944 11.1948 0 7.99967 0ZM7.99967 8.70997C6.39211 8.70997 5.0843 7.40212 5.0843 5.79456C5.0843 4.187 6.39214 2.87919 7.99967 2.87919C9.6072 2.87919 10.915 4.18703 10.915 5.79459C10.915 7.40216 9.6072 8.70997 7.99967 8.70997Z"
            fill="#101010"
          ></path>
        </svg>
        {heading.location}
      </p>
      {#if showMap}{#if dealer.businessPreview}<a
            class="text-md-medium neutral-1000 mr-30 desktop-type-meta"
            href={locale.href(
              "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(
                  dealer.locations[0]?.address || heading.location,
                ),
            )}
            target="_blank"
            rel="noopener noreferrer"
            >{locale.t("ui.vehicle-heading.show-on-map")}</a
          >{:else}<DemoActionLink
            class="text-md-medium neutral-1000 mr-30 desktop-type-meta"
            href="#!"
            aria-label={locale.t("ui.vehicle-heading.show-on-map")}
            >{locale.t("ui.vehicle-heading.show-on-map")}</DemoActionLink
          >{/if}{/if}
      {#if heading.fleetCode}<p
          class="text-md-medium neutral-1000 tour-code mr-15 desktop-type-meta"
        >
          <svg
            class="invert"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.2729 0.273646C13.4097 0.238432 13.5538 0.24262 13.6884 0.28573L18.5284 1.83572L18.5474 1.84209C18.8967 1.96436 19.1936 2.19167 19.4024 2.4875C19.5891 2.75202 19.7309 3.08694 19.7489 3.46434C19.7494 3.47622 19.7497 3.4881 19.7497 3.49998V15.5999C19.7625 15.8723 19.7102 16.1395 19.609 16.3754C19.6059 16.3827 19.6026 16.39 19.5993 16.3972C19.476 16.6613 19.3017 16.8663 19.1098 17.0262C19.1023 17.0324 19.0947 17.0385 19.087 17.0445C18.8513 17.2258 18.5774 17.3363 18.2988 17.3734L18.2927 17.3743C18.0363 17.4063 17.7882 17.3792 17.5622 17.3133C17.5379 17.3081 17.5138 17.3016 17.4901 17.294L13.4665 16.0004L6.75651 17.7263C6.62007 17.7614 6.47649 17.7574 6.34221 17.7147L1.47223 16.1647C1.46543 16.1625 1.45866 16.1603 1.45193 16.1579C1.0871 16.0302 0.813939 15.7971 0.613929 15.5356C0.608133 15.528 0.602481 15.5203 0.596973 15.5125C0.395967 15.2278 0.277432 14.8905 0.260536 14.5357C0.259972 14.5238 0.259689 14.5119 0.259689 14.5V2.39007C0.246699 2.11286 0.301239 1.83735 0.420015 1.58283C0.544641 1.31578 0.724533 1.10313 0.942417 0.93553C1.17424 0.757204 1.45649 0.6376 1.7691 0.61312C2.03626 0.583264 2.30621 0.616234 2.56047 0.712834L6.56277 1.99963L13.2729 0.273646ZM13.437 1.78025L6.72651 3.50634C6.58929 3.54162 6.44493 3.53736 6.31011 3.49398L2.08011 2.13402C2.06359 2.1287 2.04725 2.12282 2.03113 2.11637C2.00054 2.10413 1.96854 2.09972 1.93273 2.10419C1.91736 2.10611 1.90194 2.10756 1.88649 2.10852C1.88649 2.10852 1.88436 2.10866 1.88088 2.11001C1.8771 2.11149 1.86887 2.11532 1.85699 2.12447C1.81487 2.15686 1.79467 2.18421 1.77929 2.21715C1.76189 2.25446 1.75611 2.28942 1.75823 2.32321C1.7592 2.33879 1.75969 2.35439 1.75969 2.36999V14.4772C1.76448 14.5336 1.78316 14.5879 1.81511 14.6367C1.86704 14.7014 1.90866 14.7272 1.94108 14.7398L6.59169 16.2199L13.3028 14.4937C13.44 14.4584 13.5844 14.4626 13.7192 14.506L17.8938 15.8482C17.9184 15.8537 17.9428 15.8605 17.9669 15.8685C18.0209 15.8865 18.0669 15.8902 18.1034 15.8862C18.1214 15.8833 18.1425 15.8759 18.1629 15.8623C18.1981 15.8309 18.2196 15.8024 18.2346 15.7738C18.2473 15.7399 18.2533 15.7014 18.2511 15.6668C18.2502 15.6512 18.2497 15.6356 18.2497 15.62V3.52464C18.2453 3.48222 18.2258 3.42174 18.1769 3.3525C18.147 3.3102 18.1062 3.2784 18.0582 3.26022L13.437 1.78025Z"
              fill="#101010"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.55957 2.01953C6.97375 2.01953 7.30957 2.35532 7.30957 2.76953V16.9195C7.30957 17.3338 6.97375 17.6695 6.55957 17.6695C6.14533 17.6695 5.80957 17.3338 5.80957 16.9195V2.76953C5.80957 2.35532 6.14533 2.01953 6.55957 2.01953Z"
              fill="#101010"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.4893 0.330078C13.9035 0.330078 14.2393 0.665862 14.2393 1.08008V15.2301C14.2393 15.6443 13.9035 15.9801 13.4893 15.9801C13.0751 15.9801 12.7393 15.6443 12.7393 15.2301V1.08008C12.7393 0.665862 13.0751 0.330078 13.4893 0.330078Z"
              fill="#101010"
            ></path>
          </svg>
          {locale.t("ui.vehicle-heading.fleet-code")}
        </p>
        <DemoActionLink
          class="text-md-medium neutral-1000 desktop-type-meta"
          href="#!"
          aria-label={heading.fleetCode}>{heading.fleetCode}</DemoActionLink
        >{/if}
    </div>
    {#if showActions}<div class="tour-meta-right">
        <button
          type="button"
          class="btn btn-share desktop-type-control"
          onclick={shareVehicle}
          aria-label={locale.t("share.vehicle")}
        >
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M13 11.5332C12.012 11.5332 11.1413 12.0193 10.5944 12.7584L5.86633 10.3374C5.94483 10.0698 6 9.79249 6 9.49989C6 9.10302 5.91863 8.72572 5.77807 8.37869L10.7262 5.40109C11.2769 6.04735 12.0863 6.46655 13 6.46655C14.6543 6.46655 16 5.12085 16 3.46655C16 1.81225 14.6543 0.466553 13 0.466553C11.3457 0.466553 10 1.81225 10 3.46655C10 3.84779 10.0785 4.20942 10.2087 4.54515L5.24583 7.53149C4.69563 6.90442 3.8979 6.49989 3 6.49989C1.3457 6.49989 0 7.84559 0 9.49989C0 11.1542 1.3457 12.4999 3 12.4999C4.00433 12.4999 4.8897 11.9996 5.4345 11.2397L10.147 13.6529C10.0602 13.9331 10 14.2249 10 14.5332C10 16.1875 11.3457 17.5332 13 17.5332C14.6543 17.5332 16 16.1875 16 14.5332C16 12.8789 14.6543 11.5332 13 11.5332Z"
              fill=""
            ></path>
          </svg>
          {locale.t("share.action")}
        </button>
        {#if shareFeedback}<p
            class="text-sm-medium neutral-500 desktop-type-meta"
            role="status"
            >{locale.t(
              shareFeedback === "copied" ? "share.copied" : "share.unavailable",
            )}</p
          >{/if}
        <DemoActionLink
          class="btn btn-wishlish desktop-type-control"
          href="#!"
          aria-label={locale.t("action.wishlist")}
        >
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.2222 2.3638C4.34203 0.243977 7.65342 0.0419426 10.0004 1.7577C12.3473 0.0419426 15.6587 0.243977 17.7786 2.3638C20.1217 4.70695 20.1217 8.50594 17.7786 10.8491L12.1217 16.5059C10.9501 17.6775 9.05063 17.6775 7.87906 16.5059L2.2222 10.8491C-0.120943 8.50594 -0.120943 4.70695 2.2222 2.3638Z"
              fill=""
            ></path>
          </svg>
          {locale.t("action.wishlist")}
        </DemoActionLink>
      </div>{/if}
  </div>
</div>
