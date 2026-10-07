<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dropdownClose } from "#lib/interactions.ts";
  import { chart } from "#lib/vendor.ts";
  let expanded0 = $state(false);
  let selected1 = $state("Fillter");
  let expanded2 = $state(false);
  let selected3 = $state("All");
  let expanded4 = $state(false);
  let selected5 = $state("Fillter");
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
                ><a
                  href="/account"
                  aria-current="page"
                  aria-label="Member Overview"
                  ><i class="fi fi-rr-home me-1"></i> Member Overview</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/bookings" aria-label="My Bookings"
                  ><i class="fi fi-rr-calendar me-1"></i> My Bookings</a
                ></li
              >
              <li class="py-2"
                ><a href="/account/wishlist" aria-label="My Wishlist"
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
        <div
          class="alert alert-success alert-dismissible d-flex align-items-center border-0 mb-4 fade show"
        >
          <i class="fi fi-rr-info me-2 mt-1"></i>
          <p class="mb-0">
            Grand opening promotion ends in 3 hours. Hurry up and book your car!
          </p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        <div class="row">
          <div class="col-xl-4 mb-2 mb-lg-0">
            <div class="card shadow-none">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-xl rounded-circle bg-primary me-3">
                    <i class="fi fi-rr-bookmark fs-36"></i>
                  </span>
                  <div>
                    <h5
                      ><span class="karento-static-count" data-count="25"
                        >25</span
                      ></h5
                    >
                    <p>Total Bookings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 mb-2 mb-lg-0">
            <div class="card shadow-none">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-xl rounded-circle bg-danger me-3">
                    <i class="fi fi-rr-research-arrows-circle"></i>
                  </span>
                  <div>
                    <h5
                      >$<span class="karento-static-count" data-count="28"
                        >28</span
                      >K</h5
                    >
                    <p>Total Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-4">
            <div class="card shadow-none">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-xl rounded-circle bg-warning me-3">
                    <i class="fi fi-rr-wallet"></i>
                  </span>
                  <div>
                    <h5
                      >$<span class="karento-static-count" data-count="2458"
                        >2458</span
                      ></h5
                    >
                    <p>Wallet balance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5"
                    >Bookings Statistics</span
                  >
                  <div
                    class="dropdown"
                    use:dropdownClose={{ close: () => (expanded0 = false) }}
                  >
                    <a
                      href="#!"
                      class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                      aria-label="Fillter"
                      onclick={() => (expanded0 = !expanded0)}
                      aria-expanded={expanded0}
                    >
                      <i class="fi fi-rr-filter-list me-2"></i>{selected1}</a
                    >
                    <ul
                      class={"dropdown-menu small dropdown-menu-end p-2 " +
                        (expanded0 ? "show" : "")}
                    >
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="All"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded0 = false;
                            selected1 = "All";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>All
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="Recent"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded0 = false;
                            selected1 = "Recent";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Recent
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="card shadow-none mb-2">
                  <div class="card-body">
                    <div id="chart" use:chart></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-xl-5 d-flex mb-3 mb-lg-0">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5"
                    >Notifications</span
                  >
                  <div
                    class="dropdown"
                    use:dropdownClose={{ close: () => (expanded2 = false) }}
                  >
                    <a
                      href="#!"
                      class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                      aria-label="All"
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
                          aria-label="All"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded2 = false;
                            selected3 = "All";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>All
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="Recent"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded2 = false;
                            selected3 = "Recent";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Recent
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <span
                    class="avatar avatar-lg bg-primary rounded-circle flex-shrink-0 me-2 lh-1"
                  >
                    <i class="fi fi-rr-calendar-clock"></i>
                  </span>
                  <div class="flex-fill overflow-hidden">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <p class="fs-6 text-truncate text-md-bold"
                        >Reservation Confirmed</p
                      >
                      <p class="fs-8 text-primary-dark text-nowrap"
                        >2 mins ago</p
                      >
                    </div>
                    <p class="fs-8 two-line-ellipsis neutral-500"
                      >Your car rental reservation
                      <span class="text-md-bold neutral-700">#12345</span> has been
                      successfully confirmed.
                    </p>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-3">
                  <span
                    class="avatar avatar-lg bg-warning rounded-circle flex-shrink-0 me-2 lh-1"
                  >
                    <i class="fi fi-rr-money-check-edit"></i>
                  </span>
                  <div class="flex-fill overflow-hidden">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <p class="fs-6 text-truncate text-md-bold"
                        >Payment Successful</p
                      >
                      <p class="fs-8 text-primary-dark text-nowrap"
                        >25 mins ago</p
                      >
                    </div>
                    <p class="fs-8 two-line-ellipsis neutral-500"
                      >Payment for your upcoming rental has been processed
                      successfully.
                    </p>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-3">
                  <span
                    class="avatar avatar-lg bg-info rounded-circle flex-shrink-0 me-2 lh-1"
                  >
                    <i class="fi fi-rr-bolt"></i>
                  </span>
                  <div class="flex-fill overflow-hidden">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <p class="fs-6 text-truncate text-md-bold"
                        >New Promotion Alert</p
                      >
                      <p class="fs-8 text-primary-dark text-nowrap"
                        >2 hours ago</p
                      >
                    </div>
                    <p class="fs-8 two-line-ellipsis neutral-500"
                      >Enjoy
                      <span class="text-md-bold neutral-700">20%</span> off on all
                      SUV rentals booked this weekend.
                    </p>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-3">
                  <span
                    class="avatar avatar-lg bg-danger rounded-circle flex-shrink-0 me-2 lh-1"
                  >
                    <i class="fi fi-rr-bell-ring"></i>
                  </span>
                  <div class="flex-fill overflow-hidden">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <p class="fs-6 text-truncate text-md-bold"
                        >Vehicle Ready for Pickup</p
                      >
                      <p class="fs-8 text-primary-dark text-nowrap"
                        >4 days ago</p
                      >
                    </div>
                    <p class="fs-8 two-line-ellipsis neutral-500"
                      >The vehicle you reserved is ready for pickup at the
                      designated location.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-7 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5"
                    >Recent Bookings</span
                  >
                  <div
                    class="dropdown"
                    use:dropdownClose={{ close: () => (expanded4 = false) }}
                  >
                    <a
                      href="#!"
                      class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                      aria-label="Fillter"
                      onclick={() => (expanded4 = !expanded4)}
                      aria-expanded={expanded4}
                    >
                      <i class="fi fi-rr-filter-list me-2"></i>{selected5}</a
                    >
                    <ul
                      class={"dropdown-menu small dropdown-menu-end p-2 " +
                        (expanded4 ? "show" : "")}
                    >
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="All"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded4 = false;
                            selected5 = "All";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>All
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="Recent"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded4 = false;
                            selected5 = "Recent";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Recent
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="card shadow-none mb-2">
                  <div class="card-body">
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                      <a
                        href="/vehicle"
                        class="thumb-1 flex-shrink-0 me-2"
                        aria-label="View details"
                      >
                        <img
                          src="/assets/imgs/cars-listing/cars-listing-6/car-1.png"
                          class="img-fluid"
                          alt="Img"
                        />
                      </a>
                      <div class="flex-fill">
                        <div
                          class="d-flex justify-content-between align-items-center mb-1"
                        >
                          <p class="fs-6 text-truncate text-md-bold"
                            ><a
                              href="/vehicle"
                              aria-label="GMC Sierra
                                                                    2500HD Denali"
                              >GMC Sierra 2500HD Denali
                              <span class="text-gray-5 fw-normal fs-8"
                                >( Australia )</span
                              ></a
                            >
                          </p>
                          <span
                            class="badge badge-purple badge-sm neutral-500 rounded-pill"
                            ><i class="ti ti-point-filled me-1"></i>Paid</span
                          >
                        </div>
                        <div class="d-flex align-items-center flex-wrap">
                          <p
                            class="fs-8 d-flex align-items-center border-end pe-2 me-2 mb-0"
                            ><i class="isax isax-calendar-25 me-2"></i>Date : 01
                            Jan 2025</p
                          >
                          <p class="fs-8 d-flex align-items-center"
                            ><i class="isax isax-timer5 me-2"></i>Time: 06:30 AM</p
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card shadow-none mb-2">
                  <div class="card-body">
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                      <a
                        href="/vehicle"
                        class="thumb-1 flex-shrink-0 me-2"
                        aria-label="View details"
                      >
                        <img
                          src="/assets/imgs/cars-listing/cars-listing-6/car-2.png"
                          class="img-fluid"
                          alt="Img"
                        />
                      </a>
                      <div class="flex-fill">
                        <div
                          class="d-flex justify-content-between align-items-center mb-1"
                        >
                          <p class="fs-6 text-truncate text-md-bold"
                            ><a
                              href="/vehicle"
                              aria-label="Ford
                                                                    Mustang GT Premium"
                              >Ford Mustang GT Premium
                              <span class="text-gray-5 fw-normal fs-8"
                                >( Australia )</span
                              ></a
                            >
                          </p>
                          <span
                            class="badge badge-purple badge-sm neutral-500 rounded-pill"
                            ><i class="ti ti-point-filled me-1"></i>Paid</span
                          >
                        </div>
                        <div class="d-flex align-items-center flex-wrap">
                          <p
                            class="fs-8 d-flex align-items-center border-end pe-2 me-2 mb-0"
                            ><i class="isax isax-calendar-25 me-2"></i>Date : 01
                            Jan 2025</p
                          >
                          <p class="fs-8 d-flex align-items-center"
                            ><i class="isax isax-timer5 me-2"></i>Time: 06:30 AM</p
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card shadow-none mb-2">
                  <div class="card-body">
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                      <a
                        href="/vehicle"
                        class="thumb-1 flex-shrink-0 me-2"
                        aria-label="View details"
                      >
                        <img
                          src="/assets/imgs/cars-listing/cars-listing-6/car-3.png"
                          class="img-fluid"
                          alt="Img"
                        />
                      </a>
                      <div class="flex-fill">
                        <div
                          class="d-flex justify-content-between align-items-center mb-1"
                        >
                          <p class="fs-6 text-truncate text-md-bold"
                            ><a
                              href="/vehicle"
                              aria-label="Subaru
                                                                    Impreza WRX STI"
                              >Subaru Impreza WRX STI
                              <span class="text-gray-5 fw-normal fs-8"
                                >( Australia )</span
                              ></a
                            >
                          </p>
                          <span
                            class="badge badge-purple badge-sm neutral-500 rounded-pill"
                            ><i class="ti ti-point-filled me-1"></i>Paid</span
                          >
                        </div>
                        <div class="d-flex align-items-center flex-wrap">
                          <p
                            class="fs-8 d-flex align-items-center border-end pe-2 me-2 mb-0"
                            ><i class="isax isax-calendar-25 me-2"></i>Date : 01
                            Jan 2025</p
                          >
                          <p class="fs-8 d-flex align-items-center"
                            ><i class="isax isax-timer5 me-2"></i>Time: 06:30 AM</p
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card shadow-none mb-2">
                  <div class="card-body">
                    <div class="d-flex align-items-center flex-wrap row-gap-2">
                      <a
                        href="/vehicle"
                        class="thumb-1 flex-shrink-0 me-2"
                        aria-label="View details"
                      >
                        <img
                          src="/assets/imgs/cars-listing/cars-listing-6/car-4.png"
                          class="img-fluid"
                          alt="Img"
                        />
                      </a>
                      <div class="flex-fill">
                        <div
                          class="d-flex justify-content-between align-items-center mb-1"
                        >
                          <p class="fs-6 text-truncate text-md-bold"
                            ><a
                              href="/vehicle"
                              aria-label="Mazda MX-5
                                                                    Miata Club"
                              >Mazda MX-5 Miata Club
                              <span class="text-gray-5 fw-normal fs-8"
                                >( Australia )</span
                              ></a
                            >
                          </p>
                          <span
                            class="badge badge-purple badge-sm neutral-500 rounded-pill"
                            ><i class="ti ti-point-filled me-1"></i>Paid</span
                          >
                        </div>
                        <div class="d-flex align-items-center flex-wrap">
                          <p
                            class="fs-8 d-flex align-items-center border-end pe-2 me-2 mb-0"
                            ><i class="isax isax-calendar-25 me-2"></i>Date : 01
                            Jan 2025</p
                          >
                          <p class="fs-8 d-flex align-items-center"
                            ><i class="isax isax-timer5 me-2"></i>Time: 06:30 AM</p
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-xl-12">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1"
                  >Viewed products</p
                >
              </div>
              <div class="card-body">
                <div class="box-grid-tours">
                  <div class="row">
                    <div class="col-lg-4 col-md-6">
                      <div class="card-journey-small background-card">
                        <div class="card-image">
                          <a class="wish" href="#!" aria-label="View details">
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
                                d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z"
                                stroke=""
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </a>
                          <img
                            src="/assets/imgs/shop/shop-list/product2.png"
                            alt="Carento"
                          />
                        </div>
                        <div class="card-info p-3 pt-30 border-top">
                          <div class="card-rating">
                            <div class="card-left"></div>
                            <div class="card-right">
                              <span class="rating text-xs-medium rounded-pill"
                                >4.9 5 <span class="text-xs-medium neutral-500"
                                  >(672 reviews)</span
                                ></span
                              >
                            </div>
                          </div>
                          <div class="card-title"
                            ><a
                              class="text-lg-bold neutral-1000"
                              href="/shop/product"
                              aria-label="Thinkware F770 Dash Cam Dual Channel Wifi"
                              >Thinkware F770 Dash Cam Dual Channel Wifi</a
                            ></div
                          >
                          <div class="card-program">
                            <ul class="list-style-disc ps-3 pe-4">
                              <li class="text-xs-medium neutral-1000"
                                >Mobil Delvac 1300 Super Heavy Duty Synthetic
                                Blend</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Confident driving in all weather conditions</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Visual Alignment Indicators</li
                              >
                            </ul>
                            <div class="endtime pt-3 mt-3 border-top">
                              <div class="card-price">
                                <h6
                                  class="text-md-medium neutral-500 text-decoration-line-through"
                                >
                                  $68.53</h6
                                >
                              </div>
                              <a
                                href="#!"
                                class="card-button pe-3"
                                aria-label="View details"
                                ><img
                                  src="/assets/imgs/shop/shop-list/stock.png"
                                  alt="Carento"
                                /></a
                              >
                            </div>
                            <div class="endtime">
                              <div class="card-price">
                                <h6 class="text-lg-bold neutral-1000">$98.67</h6
                                >
                              </div>
                              <div class="card-button"
                                ><a
                                  class="btn btn-primary"
                                  href="/shop/product"
                                  aria-label="Buy Now">Buy Now</a
                                ></div
                              >
                            </div>
                          </div>
                        </div>
                      </div></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <div class="card-journey-small background-card">
                        <div class="card-image">
                          <a class="wish" href="#!" aria-label="View details">
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
                                d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z"
                                stroke=""
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </a>
                          <img
                            src="/assets/imgs/shop/shop-list/product3.png"
                            alt="Carento"
                          />
                        </div>
                        <div class="card-info p-3 pt-30 border-top">
                          <div class="card-rating">
                            <div class="card-left"></div>
                            <div class="card-right">
                              <span class="rating text-xs-medium rounded-pill"
                                >4.9 5 <span class="text-xs-medium neutral-500"
                                  >(672 reviews)</span
                                ></span
                              >
                            </div>
                          </div>
                          <div class="card-title"
                            ><a
                              class="text-lg-bold neutral-1000"
                              href="/shop/product"
                              aria-label="Mobil Delvac 1300 Super Heavy Duty Synthetic
                                                                    Blend"
                              >Mobil Delvac 1300 Super Heavy Duty Synthetic
                              Blend</a
                            ></div
                          >
                          <div class="card-program">
                            <ul class="list-style-disc ps-3 pe-4">
                              <li class="text-xs-medium neutral-1000"
                                >Mobil Delvac 1300 Super Heavy Duty Synthetic
                                Blend</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Confident driving in all weather conditions</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Visual Alignment Indicators</li
                              >
                            </ul>
                            <div class="endtime pt-3 mt-3 border-top">
                              <div class="card-price">
                                <h6
                                  class="text-md-medium neutral-500 text-decoration-line-through"
                                >
                                  $68.53</h6
                                >
                              </div>
                              <a
                                href="#!"
                                class="card-button pe-3"
                                aria-label="View details"
                                ><img
                                  src="/assets/imgs/shop/shop-list/stock.png"
                                  alt="Carento"
                                /></a
                              >
                            </div>
                            <div class="endtime">
                              <div class="card-price">
                                <h6 class="text-lg-bold neutral-1000">$98.67</h6
                                >
                              </div>
                              <div class="card-button"
                                ><a
                                  class="btn btn-primary"
                                  href="/shop/product"
                                  aria-label="Buy Now">Buy Now</a
                                ></div
                              >
                            </div>
                          </div>
                        </div>
                      </div></div
                    >
                    <div class="col-lg-4 col-md-6">
                      <div class="card-journey-small background-card">
                        <div class="card-image">
                          <a class="wish" href="#!" aria-label="View details">
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
                                d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z"
                                stroke=""
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </a>
                          <img
                            src="/assets/imgs/shop/shop-list/product4.png"
                            alt="Carento"
                          />
                        </div>
                        <div class="card-info p-3 pt-30 border-top">
                          <div class="card-rating">
                            <div class="card-left"></div>
                            <div class="card-right">
                              <span class="rating text-xs-medium rounded-pill"
                                >4.9 5 <span class="text-xs-medium neutral-500"
                                  >(672 reviews)</span
                                ></span
                              >
                            </div>
                          </div>
                          <div class="card-title"
                            ><a
                              class="text-lg-bold neutral-1000"
                              href="/shop/product"
                              aria-label="Spyder® – Projector Headlight Misubisi 2024"
                              >Spyder® – Projector Headlight Misubisi 2024</a
                            >
                          </div>
                          <div class="card-program">
                            <ul class="list-style-disc ps-3 pe-4">
                              <li class="text-xs-medium neutral-1000"
                                >Mobil Delvac 1300 Super Heavy Duty Synthetic
                                Blend</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Confident driving in all weather conditions</li
                              >
                              <li class="text-xs-medium neutral-1000"
                                >Visual Alignment Indicators</li
                              >
                            </ul>
                            <div class="endtime pt-3 mt-3 border-top">
                              <div class="card-price">
                                <h6
                                  class="text-md-medium neutral-500 text-decoration-line-through"
                                >
                                  $68.53</h6
                                >
                              </div>
                              <a
                                href="#!"
                                class="card-button pe-3"
                                aria-label="View details"
                                ><img
                                  src="/assets/imgs/shop/shop-list/stock.png"
                                  alt="Carento"
                                /></a
                              >
                            </div>
                            <div class="endtime">
                              <div class="card-price">
                                <h6 class="text-lg-bold neutral-1000">$98.67</h6
                                >
                              </div>
                              <div class="card-button"
                                ><a
                                  class="btn btn-primary"
                                  href="/shop/product"
                                  aria-label="Buy Now">Buy Now</a
                                ></div
                              >
                            </div>
                          </div>
                        </div>
                      </div></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-xl-12">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1">Premium Brands</p
                >
              </div>
              <div class="card-body">
                <div
                  class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
                >
                  <ul class="carouselTicker__list">
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
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
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                    <li class="carouselTicker__item">
                      <a
                        href="/vehicles"
                        class="item-brand"
                        aria-label="View details"
                      >
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
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
