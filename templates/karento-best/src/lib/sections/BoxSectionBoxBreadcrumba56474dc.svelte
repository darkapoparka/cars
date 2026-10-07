<svelte:options preserveWhitespace={true} />

<script lang="ts">
  let { centered = false }: { centered?: boolean } = $props();
</script>

<section
  class="box-section box-breadcrumb background-body"
  class:karento-product-breadcrumb={centered}
  role="navigation"
  aria-label="Breadcrumb"
>
  <div class="container">
    <ul class="breadcrumbs">
      <li>
        <a href="/" aria-label="Home">Home</a>
        <span class="arrow-right">
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 11L6 6L1 1"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </li>
      <li>
        <a href="/vehicles" aria-label="Vehicles">Vehicles</a>
        <span class="arrow-right">
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 11L6 6L1 1"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </li>
      <li
        ><span class="text-breadcrumb" aria-current="page"
          >Hyundai Accent 2025
        </span></li
      >
    </ul>
  </div>
</section>
