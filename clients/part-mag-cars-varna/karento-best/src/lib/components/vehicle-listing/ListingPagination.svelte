<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<nav aria-label={locale.t("ui.listing-pagination.page-navigation-example")}>
  <ul class="pagination">
    <li class="page-item">
      <DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label={locale.t("ui.listing-pagination.previous")}
      >
        <span aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668"
              stroke=""
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </DemoActionLink>
    </li>
    <li class="page-item"
      ><DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label="1">1</DemoActionLink
      ></li
    >
    <li class="page-item"
      ><DemoActionLink
        class="page-link active desktop-type-control"
        href="#!"
        aria-label="2">2</DemoActionLink
      ></li
    >
    <li class="page-item"
      ><DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label="3">3</DemoActionLink
      ></li
    >
    <li class="page-item"
      ><DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label="4">4</DemoActionLink
      ></li
    >
    <li class="page-item"
      ><DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label="5">5</DemoActionLink
      ></li
    >
    <li class="page-item"
      ><DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label="...">...</DemoActionLink
      ></li
    >
    <li class="page-item">
      <DemoActionLink
        class="page-link desktop-type-control"
        href="#!"
        aria-label={locale.t("ui.listing-pagination.next")}
      >
        <span aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992"
              stroke=""
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </DemoActionLink>
    </li>
  </ul>
</nav>
