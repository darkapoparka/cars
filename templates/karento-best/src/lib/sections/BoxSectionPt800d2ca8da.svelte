<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dropdownClose } from "#lib/interactions.ts";
  let expanded0 = $state(false);
  let selected1 = $state("Car type");
  let expanded2 = $state(false);
  let selected3 = $state("Sort");
</script>

<section class="box-section background-body pt-80 pb-110 dashboard">
  <div class="container"
    ><div class="karento-dashboard-notice" role="note">
      <strong>Member account · Demo</strong>
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
                  <img
                    src="/assets/imgs/section-1/img-2.png"
                    alt=""
                    class="img-fluid avatar avatar-lg rounded-circle me-3"
                  />
                  <div>
                    <p class="fw-bold fs-5">Steven Jobs</p>
                    <span class="fs-14 text-gray-6">Since 16 Aprill 2015</span>
                  </div>
                </div>
                <div>
                  <div class="d-flex align-items-center justify-content-center">
                    <a
                      href="/account/settings"
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
            <ul class="dashboard-sidebar-menu" aria-label="Member account">
              <li class="py-2"
                ><a href="/account" aria-label="Member Overview"
                  ><i class="fi fi-rr-home me-1"></i> Member Overview</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/bookings" aria-label="My Bookings"
                  ><i class="fi fi-rr-calendar me-1"></i> My Bookings</a
                ></li
              >
              <li class="py-2"
                ><a
                  href="/account/wishlist"
                  aria-current="page"
                  aria-label="My Wishlist"
                  ><i class="fi fi-rr-heart me-1"></i> My Wishlist</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/wallet" aria-label="My Wallet"
                  ><i class="fi fi-rr-money me-1"></i> My Wallet</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/profile" aria-label="My Profile"
                  ><i class="fi fi-rr-user me-1"></i> My Profile</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/settings" aria-label="Settings"
                  ><i class="fi fi-rr-settings me-1"></i> Settings</a
                ></li
              >
            </ul>
          </div>
        </div>
      </div>
      <div class="col-xl-9 col-lg-8">
        <div class="row">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5">My Wishlist</span
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
                <div class="row box-grid-hotels">
                  <div class="col-xl-12 col-lg-12">
                    <div
                      class="card-flight card-hotel card-property background-card border"
                    >
                      <div class="card-image">
                        <a href="/vehicle" aria-label="View details"
                          ><img
                            src="/assets/imgs/cars-listing/cars-listing-9/car-list.png"
                            alt="Carento"
                          /></a
                        >
                      </div>
                      <div class="card-info p-md-40 p-3">
                        <span class="sale-lbl">-25%</span>
                        <div class="tour-rate">
                          <div class="rate-element">
                            <span class="rating"
                              >4.96 <span class="text-sm-medium neutral-500"
                                >(672 reviews)</span
                              ></span
                            >
                          </div>
                        </div>
                        <div class="card-title"
                          ><a
                            class="heading-6 neutral-1000"
                            href="/vehicle"
                            aria-label="Mini Cooper S Hardtop 2 Door"
                            >Mini Cooper S Hardtop 2 Door</a
                          ></div
                        >
                        <div class="card-program">
                          <div class="card-location mb-25">
                            <p class="text-location text-md-medium neutral-500"
                              >Manchester, England</p
                            >
                          </div>
                          <div class="card-facilities">
                            <div class="item-facilities">
                              <p class="room text-md-medium neutral-1000"
                                >Unlimited mileage</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="size text-md-medium neutral-1000"
                                >Automatic</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="parking text-md-medium neutral-1000"
                                >3 Large bags</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bed text-md-medium neutral-1000"
                                >Diesel</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bathroom text-md-medium neutral-1000"
                                >7 seats</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="pet text-md-medium neutral-1000">SUVs</p
                              >
                            </div>
                          </div>
                          <div class="endtime">
                            <div class="card-price">
                              <p class="text-md-medium neutral-500 mr-5">From</p
                              >
                              <h6 class="heading-6 neutral-1000">$202.87</h6>
                              <p class="text-md-medium neutral-500">/ night</p>
                            </div>
                            <div class="card-button"
                              ><a
                                class="btn btn-primary"
                                href="/vehicle"
                                aria-label="Book
                                                                        Now"
                                >Book Now</a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12">
                    <div
                      class="card-flight card-hotel card-property background-card border"
                    >
                      <div class="card-image">
                        <a href="/vehicle" aria-label="View details"
                          ><img
                            src="/assets/imgs/cars-listing/cars-listing-9/car-list2.png"
                            alt="Carento"
                          /></a
                        >
                      </div>
                      <div class="card-info p-md-40 p-3">
                        <span class="sale-lbl">-25%</span>
                        <div class="tour-rate">
                          <div class="rate-element">
                            <span class="rating"
                              >4.96 <span class="text-sm-medium neutral-500"
                                >(672 reviews)</span
                              ></span
                            >
                          </div>
                        </div>
                        <div class="card-title"
                          ><a
                            class="heading-6 neutral-1000"
                            href="/vehicle"
                            aria-label="Volvo XC90 T6 Inscription"
                            >Volvo XC90 T6 Inscription</a
                          ></div
                        >
                        <div class="card-program">
                          <div class="card-location mb-25">
                            <p class="text-location text-md-medium neutral-500"
                              >Manchester, England</p
                            >
                          </div>
                          <div class="card-facilities">
                            <div class="item-facilities">
                              <p class="room text-md-medium neutral-1000"
                                >Unlimited mileage</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="size text-md-medium neutral-1000"
                                >Automatic</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="parking text-md-medium neutral-1000"
                                >3 Large bags</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bed text-md-medium neutral-1000"
                                >Diesel</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bathroom text-md-medium neutral-1000"
                                >7 seats</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="pet text-md-medium neutral-1000">SUVs</p
                              >
                            </div>
                          </div>
                          <div class="endtime">
                            <div class="card-price">
                              <p class="text-md-medium neutral-500 mr-5">From</p
                              >
                              <h6 class="heading-6 neutral-1000">$778.35</h6>
                              <p class="text-md-medium neutral-500">/ night</p>
                            </div>
                            <div class="card-button"
                              ><a
                                class="btn btn-primary"
                                href="/vehicle"
                                aria-label="Book
                                                                        Now"
                                >Book Now</a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12">
                    <div
                      class="card-flight card-hotel card-property background-card border"
                    >
                      <div class="card-image">
                        <a href="/vehicle" aria-label="View details"
                          ><img
                            src="/assets/imgs/cars-listing/cars-listing-9/car-list3.png"
                            alt="Carento"
                          /></a
                        >
                      </div>
                      <div class="card-info p-md-40 p-3">
                        <span class="sale-lbl">-25%</span>
                        <div class="tour-rate">
                          <div class="rate-element">
                            <span class="rating"
                              >4.96 <span class="text-sm-medium neutral-500"
                                >(672 reviews)</span
                              ></span
                            >
                          </div>
                        </div>
                        <div class="card-title"
                          ><a
                            class="heading-6 neutral-1000"
                            href="/vehicle"
                            aria-label="Cadillac Escalade ESV Premium Luxury"
                            >Cadillac Escalade ESV Premium Luxury</a
                          ></div
                        >
                        <div class="card-program">
                          <div class="card-location mb-25">
                            <p class="text-location text-md-medium neutral-500"
                              >Manchester, England</p
                            >
                          </div>
                          <div class="card-facilities">
                            <div class="item-facilities">
                              <p class="room text-md-medium neutral-1000"
                                >Unlimited mileage</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="size text-md-medium neutral-1000"
                                >Automatic</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="parking text-md-medium neutral-1000"
                                >3 Large bags</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bed text-md-medium neutral-1000"
                                >Diesel</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bathroom text-md-medium neutral-1000"
                                >7 seats</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="pet text-md-medium neutral-1000">SUVs</p
                              >
                            </div>
                          </div>
                          <div class="endtime">
                            <div class="card-price">
                              <p class="text-md-medium neutral-500 mr-5">From</p
                              >
                              <h6 class="heading-6 neutral-1000">$779.58</h6>
                              <p class="text-md-medium neutral-500">/ night</p>
                            </div>
                            <div class="card-button"
                              ><a
                                class="btn btn-primary"
                                href="/vehicle"
                                aria-label="Book
                                                                        Now"
                                >Book Now</a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12">
                    <div
                      class="card-flight card-hotel card-property background-card border"
                    >
                      <div class="card-image">
                        <a href="/vehicle" aria-label="View details"
                          ><img
                            src="/assets/imgs/cars-listing/cars-listing-9/car-list4.png"
                            alt="Carento"
                          /></a
                        >
                      </div>
                      <div class="card-info p-md-40 p-3">
                        <span class="sale-lbl">-25%</span>
                        <div class="tour-rate">
                          <div class="rate-element">
                            <span class="rating"
                              >4.96 <span class="text-sm-medium neutral-500"
                                >(672 reviews)</span
                              ></span
                            >
                          </div>
                        </div>
                        <div class="card-title"
                          ><a
                            class="heading-6 neutral-1000"
                            href="/vehicle"
                            aria-label="Honda Civic Si Coupe"
                            >Honda Civic Si Coupe</a
                          ></div
                        >
                        <div class="card-program">
                          <div class="card-location mb-25">
                            <p class="text-location text-md-medium neutral-500"
                              >Manchester, England</p
                            >
                          </div>
                          <div class="card-facilities">
                            <div class="item-facilities">
                              <p class="room text-md-medium neutral-1000"
                                >Unlimited mileage</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="size text-md-medium neutral-1000"
                                >Automatic</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="parking text-md-medium neutral-1000"
                                >3 Large bags</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bed text-md-medium neutral-1000"
                                >Diesel</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bathroom text-md-medium neutral-1000"
                                >7 seats</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="pet text-md-medium neutral-1000">SUVs</p
                              >
                            </div>
                          </div>
                          <div class="endtime">
                            <div class="card-price">
                              <p class="text-md-medium neutral-500 mr-5">From</p
                              >
                              <h6 class="heading-6 neutral-1000">$601.13</h6>
                              <p class="text-md-medium neutral-500">/ night</p>
                            </div>
                            <div class="card-button"
                              ><a
                                class="btn btn-primary"
                                href="/vehicle"
                                aria-label="Book
                                                                        Now"
                                >Book Now</a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12">
                    <div
                      class="card-flight card-hotel card-property background-card border"
                    >
                      <div class="card-image">
                        <a href="/vehicle" aria-label="View details"
                          ><img
                            src="/assets/imgs/cars-listing/cars-listing-9/car-list5.png"
                            alt="Carento"
                          /></a
                        >
                      </div>
                      <div class="card-info p-md-40 p-3">
                        <span class="sale-lbl">-25%</span>
                        <div class="tour-rate">
                          <div class="rate-element">
                            <span class="rating"
                              >4.96 <span class="text-sm-medium neutral-500"
                                >(672 reviews)</span
                              ></span
                            >
                          </div>
                        </div>
                        <div class="card-title"
                          ><a
                            class="heading-6 neutral-1000"
                            href="/vehicle"
                            aria-label="Kia
                                                                Telluride SX"
                            >Kia Telluride SX</a
                          ></div
                        >
                        <div class="card-program">
                          <div class="card-location mb-25">
                            <p class="text-location text-md-medium neutral-500"
                              >Manchester, England</p
                            >
                          </div>
                          <div class="card-facilities">
                            <div class="item-facilities">
                              <p class="room text-md-medium neutral-1000"
                                >Unlimited mileage</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="size text-md-medium neutral-1000"
                                >Automatic</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="parking text-md-medium neutral-1000"
                                >3 Large bags</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bed text-md-medium neutral-1000"
                                >Diesel</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="bathroom text-md-medium neutral-1000"
                                >7 seats</p
                              >
                            </div>
                            <div class="item-facilities">
                              <p class="pet text-md-medium neutral-1000">SUVs</p
                              >
                            </div>
                          </div>
                          <div class="endtime">
                            <div class="card-price">
                              <p class="text-md-medium neutral-500 mr-5">From</p
                              >
                              <h6 class="heading-6 neutral-1000">$450.54</h6>
                              <p class="text-md-medium neutral-500">/ night</p>
                            </div>
                            <div class="card-button"
                              ><a
                                class="btn btn-primary"
                                href="/vehicle"
                                aria-label="Book
                                                                        Now"
                                >Book Now</a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
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
