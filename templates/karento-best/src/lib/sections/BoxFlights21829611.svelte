<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dropdownClose } from "#lib/interactions.ts";
  import { slider } from "#lib/vendor.ts";
  import VehicleCarda90dcc4c70 from "#lib/cards/VehicleCarda90dcc4c70.svelte";
  let expanded0 = $state(false);
  let expanded2 = $state(false);
  let expanded4 = $state(false);
  let expanded6 = $state(false);
</script>

<section class="section-box box-flights background-body">
  <div class="container">
    <div class="row align-items-end">
      <div class="col-lg-6 mb-30 text-center text-lg-start">
        <h2 class="neutral-1000">Popular Vehicles</h2>
        <p class="text-xl-medium neutral-500"
          >Favorite vehicles based on customer reviews</p
        >
      </div>
      <div class="col-lg-6 mb-30">
        <div
          class="d-flex align-items-center justify-content-center justify-content-lg-end popular-categories"
        >
          <div
            class="dropdown dropdown-filter"
            use:dropdownClose={{ close: () => (expanded0 = false) }}
          >
            <button
              class="btn btn-dropdown dropdown-toggle m-0"
              id="dropdownCategory"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="View details"
              onclick={() => (expanded0 = !expanded0)}
              aria-expanded={expanded0}><span>Categories</span></button
            >
            <ul
              aria-labelledby="dropdownCategory"
              class={"dropdown-menu dropdown-menu-light " +
                (expanded0 ? "show" : "")}
            >
              <li
                ><a
                  class="dropdown-item active"
                  href="#!"
                  aria-label="Sedan"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Sedan</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="SUVs"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>SUVs</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Coupes"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Coupes</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Hatchbacks"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Hatchbacks</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Trucks"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Trucks</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Minivan"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Minivan</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Sport"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Sport</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Cross-over"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded0 = false;
                  }}>Cross-over</a
                ></li
              >
            </ul>
          </div>
          <div
            class="dropdown dropdown-filter"
            use:dropdownClose={{ close: () => (expanded2 = false) }}
          >
            <button
              class="btn btn-dropdown dropdown-toggle m-0"
              id="dropdownCategory"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="View details"
              onclick={() => (expanded2 = !expanded2)}
              aria-expanded={expanded2}><span>Fuel Type</span></button
            >
            <ul
              aria-labelledby="dropdownCategory"
              class={"dropdown-menu dropdown-menu-light " +
                (expanded2 ? "show" : "")}
            >
              <li
                ><a
                  class="dropdown-item active"
                  href="#!"
                  aria-label="Plug-in Hybrid (PHEV)"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Plug-in Hybrid (PHEV)</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Hybrid (HEV)"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Hybrid (HEV)</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Electric Vehicle (EV)"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Electric Vehicle (EV)</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Diesel"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Diesel</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Gasoline/Petrol"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Gasoline/Petrol</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Hydrogen"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded2 = false;
                  }}>Hydrogen</a
                ></li
              >
            </ul>
          </div>
          <div
            class="dropdown dropdown-filter"
            use:dropdownClose={{ close: () => (expanded4 = false) }}
          >
            <button
              class="btn btn-dropdown dropdown-toggle m-0"
              id="dropdownCategory"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="View details"
              onclick={() => (expanded4 = !expanded4)}
              aria-expanded={expanded4}><span>Review / Rating</span></button
            >
            <ul
              aria-labelledby="dropdownCategory"
              class={"dropdown-menu dropdown-menu-light " +
                (expanded4 ? "show" : "")}
            >
              <li
                ><a
                  class="dropdown-item active"
                  href="#!"
                  aria-label="Newest"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded4 = false;
                  }}>Newest</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Oldest"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded4 = false;
                  }}>Oldest</a
                ></li
              >
            </ul>
          </div>
          <div
            class="dropdown dropdown-filter"
            use:dropdownClose={{ close: () => (expanded6 = false) }}
          >
            <button
              class="btn btn-dropdown dropdown-toggle m-0"
              id="dropdownCategory"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="View details"
              onclick={() => (expanded6 = !expanded6)}
              aria-expanded={expanded6}><span>Price range</span></button
            >
            <ul
              aria-labelledby="dropdownCategory"
              class={"dropdown-menu dropdown-menu-light " +
                (expanded6 ? "show" : "")}
            >
              <li
                ><a
                  class="dropdown-item active"
                  href="#!"
                  aria-label="$10 - $100"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded6 = false;
                  }}>$10 - $100</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="$100 - $1.000"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded6 = false;
                  }}>$100 - $1.000</a
                ></li
              >
              <li
                ><a
                  class="dropdown-item"
                  href="#!"
                  aria-label="$1.000 - $10.000"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded6 = false;
                  }}>$1.000 - $10.000</a
                ></li
              >
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="block-flights">
      <div class="box-swiper mt-30">
        <div
          class="swiper-container swiper-group-2 swiper-group-journey"
          use:slider
        >
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-1.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Audi A3 1.6 TDI S line",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /><VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-2.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "BMW 320d xDrive M",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /><VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-3.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Mercedes-Benz C220d",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /></div
            >
            <div class="swiper-slide">
              <VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-4.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Volkswagen Golf GTD",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /><VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-5.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Volvo S60 D4 R-Design",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /><VehicleCarda90dcc4c70
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-3/car-6.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Jaguar XE 2.0d R-Sport",
                  location: "",
                  mileage: "72.491km",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$35.62",
                  pricePeriod: "From",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: " 4.96 ",
                }}
              /></div
            >
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <a
        class="btn btn-brand-2 text-nowrap"
        href="/vehicles"
        aria-label="Load More Cars"
      >
        <svg
          class="me-2"
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <g clip-path="url(#clip0_117_4717)">
            <path
              d="M4.4024 14.0977C1.60418 11.2899 1.60418 6.71576 4.4024 3.90794L5.89511 5.40064V0.90332H1.39779L3.13528 2.64081C-0.378102 6.1494 -0.378102 11.8562 3.13528 15.3696C5.35275 17.5823 8.43896 18.403 11.2996 17.8175V15.9648C8.91413 16.584 6.26949 15.9648 4.4024 14.0977Z"
              fill="#101010"
            ></path>
            <path
              d="M15.864 2.64036C13.6465 0.418093 10.5603 -0.402657 7.69971 0.182907V2.03559C10.0852 1.41643 12.7346 2.04519 14.5969 3.90748C17.4047 6.71531 17.4047 11.2894 14.5969 14.0973L13.1042 12.6045V17.1067H17.6063L15.8688 15.3692C19.3774 11.8558 19.3774 6.14894 15.864 2.64036Z"
              fill="#101010"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_117_4717">
              <rect
                width="18"
                height="18"
                fill="white"
                transform="translate(0.5)"
              ></rect>
            </clipPath>
          </defs>
        </svg>
        Load More Cars
      </a>
    </div>
  </div>
</section>
