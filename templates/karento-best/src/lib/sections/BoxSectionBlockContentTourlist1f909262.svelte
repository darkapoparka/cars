<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import VehicleCard5d183a372b from "#lib/cards/VehicleCard5d183a372b.svelte";
  import { range } from "#lib/vendor.ts";
  let filterOpen0 = $state(true);
  let filterOpen1 = $state(true);
  let filterOpen2 = $state(true);
  let filterOpen3 = $state(true);
  let filterOpen4 = $state(true);
  let filterOpen5 = $state(true);
  let filterOpen6 = $state(true);
</script>

<section class="box-section block-content-tourlist background-body">
  <div class="container">
    <div class="box-content-main pt-20">
      <div class="content-right">
        <div class="box-grid-tours">
          <div class="row">
            <div class="col-lg-3 col-md-6">
              <VehicleCard5d183a372b
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Hyundai Sonata SEL Plus",
                  location: "New South Wales, Australia",
                  mileage: "25,100 miles",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$72.15",
                  pricePeriod: "/ day",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: "4.96 ",
                }}
              /></div
            >
            <div class="col-lg-3 col-md-6">
              <VehicleCard5d183a372b
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Buick Enclave Avenir",
                  location: "New South Wales, Australia",
                  mileage: "25,100 miles",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$69.56",
                  pricePeriod: "/ day",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: "4.96 ",
                }}
              /></div
            >
            <div class="col-lg-3 col-md-6">
              <VehicleCard5d183a372b
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Chevrolet Silverado",
                  location: "New South Wales, Australia",
                  mileage: "25,100 miles",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$253.0",
                  pricePeriod: "/ day",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: "4.96 ",
                }}
              /></div
            >
            <div class="col-lg-3 col-md-6">
              <VehicleCard5d183a372b
                card={{
                  sample: true,
                  image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
                  imageAlt: "Carento",
                  href: "/vehicle",
                  title: "Subaru Outback Limited XT",
                  location: "New South Wales, Australia",
                  mileage: "25,100 miles",
                  transmission: "Automatic",
                  fuel: "Diesel",
                  seats: "7 seats",
                  price: "$75.86",
                  pricePeriod: "/ day",
                  action: "Book Now",
                  reviews: "(672 reviews)",
                  rating: "4.96 ",
                }}
              /></div
            >
          </div>
        </div>
      </div>
      <div class="content-left order-lg-first d-none">
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen0 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen0}
                  onclick={() => (filterOpen0 = !filterOpen0)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen0 = !filterOpen0;
                    }
                  }}>Show on map</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter mb-15"
                style:display={filterOpen0 ? undefined : "none"}
              >
                <div class="pt-0">
                  <div class="box-map-small">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5249.611419370571!2d2.3406913487788334!3d48.86191519358772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bdebd2!2sLes%20Halles%2C%2075001%20Pa%20ri%2C%20Ph%C3%A1p!5e0!3m2!1svi!2s!4v1711728202093!5m2!1svi!2s"
                      width="100%"
                      height="160"
                      style="border:0;"
                      allowfullscreen
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      title="Location map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen1 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen1}
                  onclick={() => (filterOpen1 = !filterOpen1)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen1 = !filterOpen1;
                    }
                  }}>Filter Price</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen1 ? undefined : "none"}
              >
                <div class="pt-20">
                  <div class="box-slider-range">
                    <div id="slider-range" use:range></div>
                    <div class="box-value-price"
                      ><span class="text-md-medium neutral-1000">$0</span><span
                        class="text-md-medium neutral-1000">$500</span
                      ></div
                    >
                    <input
                      class="value-money"
                      type="hidden"
                      aria-label="Preview field"
                    />
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-between pt-20 border-top">
                <a
                  href="#!"
                  class="d-flex align-items-center"
                  aria-label="View details"
                >
                  <div class="background-100 icon-shape p-1 rounded-1 me-2">
                    <svg
                      class=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="9"
                      height="9"
                      viewBox="0 0 9 9"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <line
                        x1="1.20074"
                        y1="1.5141"
                        x2="7.59837"
                        y2="7.91174"
                        stroke="black"
                        stroke-width="0.904762"
                      ></line>
                      <line
                        x1="1.01337"
                        y1="7.91156"
                        x2="7.411"
                        y2="1.51393"
                        stroke="black"
                        stroke-width="0.904762"
                      ></line>
                    </svg>
                  </div>
                  <span class="text-sm-medium neutral-1000">Clear</span>
                </a>
                <a
                  href="#!"
                  class="btn btn-primary px-3 py-2"
                  aria-label="Apply"
                >
                  <img
                    src="/assets/imgs/template/icons/user.svg"
                    alt="Carento"
                  />
                  Apply
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen2 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen2}
                  onclick={() => (filterOpen2 = !filterOpen2)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen2 = !filterOpen2;
                    }
                  }}>Car type</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen2 ? undefined : "none"}
              >
                <ul class="list-filter-checkbox">
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                        >All
                      </span><span class="checkmark"></span>
                    </label><span class="number-item">198</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Sedans</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">32</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                        >SUVs
                      </span><span class="checkmark"></span>
                    </label><span class="number-item">13</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Coupes</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Hatchbacks</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">35</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Convertibles</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">56</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Trucks</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                </ul>
                <div class="box-see-more mt-20 mb-25">
                  <a class="link-see-more" href="#!" aria-label="See more">
                    See more
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z"
                        fill=""
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen3 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen3}
                  onclick={() => (filterOpen3 = !filterOpen3)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen3 = !filterOpen3;
                    }
                  }}>Car Amenities</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen3 ? undefined : "none"}
              >
                <ul class="list-filter-checkbox">
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">All</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">32</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Leather upholstery</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">13</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Heated seats</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Sunroof/Moonroof</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Keyless entry/start</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">35</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Heads-up display</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">56</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Adaptive cruise control</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                </ul>
                <div class="box-see-more mt-20 mb-25">
                  <a class="link-see-more" href="#!" aria-label="See more">
                    See more
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z"
                        fill=""
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen4 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen4}
                  onclick={() => (filterOpen4 = !filterOpen4)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen4 = !filterOpen4;
                    }
                  }}>Fuel Type</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen4 ? undefined : "none"}
              >
                <ul class="list-filter-checkbox">
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">All</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">32</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Plug-in Hybrid (PHEV)</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">13</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Hybrid (HEV)</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Electric Vehicle (EV)</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Diesel</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">35</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Gasoline/Petrol</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">56</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Hydrogen</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen5 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen5}
                  onclick={() => (filterOpen5 = !filterOpen5)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen5 = !filterOpen5;
                    }
                  }}>Review Score</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen5 ? undefined : "none"}
              >
                <ul class="list-filter-checkbox">
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                      >
                        <img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /></span
                      ><span class="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                      >
                        <img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /></span
                      ><span class="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                      >
                        <img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /></span
                      ><span class="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                      >
                        <img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /></span
                      ><span class="checkmark"></span>
                    </label>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium"
                      >
                        <img
                          src="/assets/imgs/template/icons/star-yellow.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/template/icons/star-grey.svg"
                          alt="Carento"
                        /></span
                      ><span class="checkmark"></span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-left border-1 background-body">
          <div class="box-filters-sidebar">
            <div class="block-filter border-1">
              <h6
                class={"text-lg-bold item-collapse neutral-1000" +
                  (filterOpen6 ? "" : " collapsed-item")}
                ><span
                  role="button"
                  tabindex="0"
                  aria-expanded={filterOpen6}
                  onclick={() => (filterOpen6 = !filterOpen6)}
                  onkeydown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      filterOpen6 = !filterOpen6;
                    }
                  }}>Booking Location</span
                ></h6
              >
              <div
                class="box-collapse scrollFilter"
                style:display={filterOpen6 ? undefined : "none"}
              >
                <ul class="list-filter-checkbox">
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Maldives Haven</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">198</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Santorini Retreat</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">32</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Parisian Plaza</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">13</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Tokyo Tower View</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">23</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Caribbean Cove</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">35</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Swiss Alps Lodge</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">56</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">New York Cityscape</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Dubai Oasis</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">Barcelona Beachfront</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                  <li>
                    <label class="cb-container">
                      <input type="checkbox" aria-label="Preview field" /><span
                        class="text-sm-medium">London Luxe</span
                      ><span class="checkmark"></span>
                    </label><span class="number-item">76</span>
                  </li>
                </ul>
                <div class="box-see-more">
                  <a class="link-see-more" href="#!" aria-label="See more">
                    See more
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z"
                        fill=""
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="background-100 pt-55 pb-55">
    <div class="container">
      <div
        class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
      >
        <ul class="carouselTicker__list">
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/jaguar.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/jaguar-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/honda.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/honda-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/chevrolet.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/chevrolet-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/acura.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/acura-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bmw.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bmw-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/toyota.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/toyota-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt="Carento"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
