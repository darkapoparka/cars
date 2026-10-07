<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dropdownClose } from "#lib/interactions.ts";
  import VehicleCardbb21e60ea2 from "#lib/cards/VehicleCardbb21e60ea2.svelte";
  let expanded0 = $state(false);
  let selected1 = $state("Car type");
  let expanded2 = $state(false);
  let selected3 = $state("Sort");
</script>

<section class="box-section background-body pt-80 pb-110 dashboard">
  <div class="container"
    ><div class="karento-dashboard-notice" role="note">
      <strong>Owner dashboard · Demo</strong>
      <span>Preview screens with sample data. Changes are not saved.</span>
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-4">
        <div class="card user-sidebar mb-4">
          <div class="card-header user-sidebar-header">
            <div class="profile-content rounded-pill">
              <div class="d-flex align-items-center justify-content-between">
                <div
                  class="d-flex align-items-center justify-content-center py-2"
                >
                  <a
                    href="/vehicles"
                    class="item-brand me-2"
                    aria-label="View details"
                  >
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
                  </a>
                  <div>
                    <p class="fw-bold fs-5">Honda London</p>
                    <span class="fs-14 text-gray-6">Since 2019</span>
                  </div>
                </div>
                <div>
                  <div class="d-flex align-items-center justify-content-center">
                    <a
                      href="/dashboard/settings"
                      class="p-1 rounded-circle align-items-center justify-content-center btn-edit"
                      aria-label="View details"
                    >
                      <i class="fi fi-rr-pencil fs-7"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body user-sidebar-body">
            <ul class="dashboard-sidebar-menu" aria-label="Owner dashboard">
              <li class="py-2"
                ><a href="/dashboard" aria-label="Dealer Overview"
                  ><i class="fi fi-rr-home me-1"></i> Dealer Overview</a
                ></li
              >
              <li class="py-2"
                ><a
                  href="/dashboard/listings"
                  aria-current="page"
                  aria-label="Listings"
                  ><i class="fi fi-rr-calendar me-1"></i> Listings</a
                ></li
              >
              <li class="py-2"
                ><a href="/dashboard/add-listing" aria-label="Add Listing"
                  ><i class="fi fi-rr-heart me-1"></i> Add Listing</a
                ></li
              >
              <li class="py-2"
                ><a href="/dashboard/earnings" aria-label="Earnings"
                  ><i class="fi fi-rr-money me-1"></i> Earnings</a
                ></li
              >
              <li class="py-2"
                ><a href="/dashboard/settings" aria-label="Settings"
                  ><i class="fi fi-rr-settings me-1"></i> Settings</a
                ></li
              >
            </ul>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-8">
        <div
          class="alert alert-info alert-dismissible d-flex align-items-center border-0 mb-4 fade show mb-4"
        >
          <i class="fi fi-rr-info me-2 mt-1"></i>
          <p class="mb-0"> Join the year-end sale to boost your sales now </p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        <div class="row">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5"
                    >Booking List</span
                  >
                  <div class="fillter d-flex gap-2">
                    <div class="input-icon-start position-relative">
                      <span class="icon-addon">
                        <i class="fi fi-rr-search"></i>
                      </span>
                      <input
                        type="text"
                        class="input-small"
                        placeholder="Search"
                        aria-label="Search"
                      />
                    </div>
                    <div
                      class="dropdown"
                      use:dropdownClose={{ close: () => (expanded0 = false) }}
                    >
                      <a
                        href="#!"
                        class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-label="Car type"
                        onclick={() => (expanded0 = !expanded0)}
                        aria-expanded={expanded0}
                      >
                        <i class="fi fi-rr-steering-wheel me-2"
                        ></i>{selected1}</a
                      >
                      <ul
                        class={"dropdown-menu small dropdown-menu-end p-2 " +
                          (expanded0 ? "show" : "")}
                      >
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Sedan"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded0 = false;
                              selected1 = "Sedan";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Sedan
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Coupe"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded0 = false;
                              selected1 = "Coupe";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Coupe
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Hatchback"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded0 = false;
                              selected1 = "Hatchback";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Hatchback
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="dropdown"
                      use:dropdownClose={{ close: () => (expanded2 = false) }}
                    >
                      <a
                        href="#!"
                        class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-label="Sort"
                        onclick={() => (expanded2 = !expanded2)}
                        aria-expanded={expanded2}
                      >
                        <i class="fi fi-rr-filter-list me-2"></i>{selected3}</a
                      >
                      <ul
                        class={"dropdown-menu small dropdown-menu-end p-2 " +
                          (expanded2 ? "show" : "")}
                      >
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Newest"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded2 = false;
                              selected3 = "Newest";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Newest
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Oldest"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded2 = false;
                              selected3 = "Oldest";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Oldest
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Paid"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded2 = false;
                              selected3 = "Paid";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Paid
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Unpaid"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded2 = false;
                              selected3 = "Unpaid";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Unpaid
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Cancelled"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded2 = false;
                              selected3 = "Cancelled";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Cancelled
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="box-grid-tours">
                  <div class="row">
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "GMC Sierra 2500HD Denali",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$98.67",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "Ford Mustang GT Premium",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$89.32",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "Mazda MX-5 Miata Club",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$89.56",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "Subaru Impreza WRX STI",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$658.0",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "Porsche 911 Carrera S",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$125.0",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <VehicleCardbb21e60ea2
                        card={{
                          sample: true,
                          image:
                            "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
                          imageAlt: "Carento",
                          href: "/vehicle",
                          title: "Toyota Camry LE Hybrid",
                          location: "New South Wales, Australia",
                          mileage: "25,100 miles",
                          transmission: "Automatic",
                          fuel: "Diesel",
                          seats: "7 seats",
                          price: "$32.47",
                          pricePeriod: "/ day",
                          action: "",
                          reviews: "(672 reviews)",
                          rating: "4.96 ",
                        }}
                      /></div
                    >
                  </div>
                </div>
                <nav aria-label="Page navigation example">
                  <ul class="pagination">
                    <li class="page-item">
                      <a class="page-link" href="#!" aria-label="Previous">
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
                      </a>
                    </li>
                    <li class="page-item"
                      ><a class="page-link" href="#!" aria-label="1">1</a></li
                    >
                    <li class="page-item"
                      ><a class="page-link active" href="#!" aria-label="2">2</a
                      ></li
                    >
                    <li class="page-item"
                      ><a class="page-link" href="#!" aria-label="3">3</a></li
                    >
                    <li class="page-item"
                      ><a class="page-link" href="#!" aria-label="4">4</a></li
                    >
                    <li class="page-item"
                      ><a class="page-link" href="#!" aria-label="5">5</a></li
                    >
                    <li class="page-item"
                      ><a class="page-link" href="#!" aria-label="...">...</a
                      ></li
                    >
                    <li class="page-item">
                      <a class="page-link" href="#!" aria-label="Next">
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
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
