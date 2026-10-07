<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dropdownClose } from "#lib/interactions.ts";
  import { chart } from "#lib/vendor.ts";
  let expanded0 = $state(false);
  let selected1 = $state("Fillter");
  let expanded2 = $state(false);
  let selected3 = $state("Fillter");
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
                ><a href="/dashboard/listings" aria-label="Listings"
                  ><i class="fi fi-rr-calendar me-1"></i> Listings</a
                ></li
              >
              <li class="py-2"
                ><a href="/dashboard/add-listing" aria-label="Add Listing"
                  ><i class="fi fi-rr-heart me-1"></i> Add Listing</a
                ></li
              >
              <li class="py-2"
                ><a
                  href="/dashboard/earnings"
                  aria-current="page"
                  aria-label="Earnings"
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
        <div class="row mb-3">
          <div class="col-lg-3 mb-3 mb-lg-0">
            <div class="card shadow-none flex-fill bg-1">
              <div class="box-earning px-3 py-4 text-center">
                <span class="avatar rounded-circle bg-primary me-3">
                  <i class="fi fi-rr-piggy-bank"></i>
                </span>
                <p>Balances</p>
                <h6>$125.987</h6>
                <a href="#!" aria-label="View Transactions">View Transactions</a
                >
              </div>
            </div>
          </div>
          <div class="col-lg-9">
            <div class="card shadow-none flex-fill bg-3">
              <div class="box-earning px-3 py-4">
                <span class="neutral-1000 text-md-bold fs-5"
                  >Withdraw &amp; transfer</span
                >
                <div class="row">
                  <div class="col-lg-3 me-2 me-lg-0">
                    <p class="fs-8 two-line-ellipsis neutral-500">Bank Name</p>
                    <p class="fs-6 text-truncate text-md-bold">Agrik Bank Inc</p
                    >
                  </div>
                  <div class="col-lg-4 me-2 me-lg-0">
                    <p class="fs-8 two-line-ellipsis neutral-500">Card number</p
                    >
                    <p class="fs-6 text-truncate text-md-bold"
                      >1658 - 2563 - 2356 - 2533</p
                    >
                  </div>
                  <div class="col-lg-3 me-2 me-lg-0">
                    <p class="fs-8 two-line-ellipsis neutral-500"
                      >Name on card</p
                    >
                    <p class="fs-6 text-truncate text-md-bold">JOND DAVICE</p>
                  </div>
                  <div class="col-lg-2 me-2 me-lg-0">
                    <p class="fs-8 two-line-ellipsis neutral-500">PIN</p>
                    <p class="fs-6 text-truncate text-md-bold">256</p>
                  </div>
                </div>
                <div class="d-flex gap-5 justify-content-between w-100 mt-4">
                  <a
                    class="d-flex align-items-center gap-1 text-primary-dark"
                    href="#!"
                    aria-label="Add new card"
                    ><i class="fi fi-rr-add"></i>Add new card</a
                  >
                  <a
                    class="d-flex align-items-center gap-1 text-primary-dark"
                    href="#!"
                    aria-label="Withdraw to bank"
                    ><i class="fi fi-rr-bank"></i>Withdraw to bank</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5">Earnings</span>
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
                          aria-label="Success"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded0 = false;
                            selected1 = "Success";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Success
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="Pending"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded0 = false;
                            selected1 = "Pending";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Pending
                        </a>
                      </li>
                      <li>
                        <a
                          href="#!"
                          class="dropdown-item rounded-1"
                          aria-label="Canceled"
                          onclick={(event) => {
                            event.preventDefault();
                            expanded0 = false;
                            selected1 = "Canceled";
                          }}
                        >
                          <i class="ti ti-point-filled me-1"></i>Canceled
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <p>Total Earnings</p>
                <div class="d-flex align-items-end gap-3">
                  <h6 class="text-primary-dark">$125.987</h6>
                  <span
                    ><span class="text-success me-2"
                      ><i class="fi fi-rr-arrow-small-up"></i>5%</span
                    >vs last years</span
                  >
                </div>

                <div class="card shadow-none mb-2 mt-3">
                  <div class="card-body">
                    <div id="chart-3" use:chart></div>
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
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5">Transaction</span
                  >

                  <div
                    class="dropdown"
                    use:dropdownClose={{ close: () => (expanded2 = false) }}
                  >
                    <a
                      href="#!"
                      class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                      aria-label="Fillter"
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
                <p class="neutral-500">Updated every several minutes</p>

                <div class="table-responsive">
                  <table class="table datatable table-striped">
                    <thead class="thead-light">
                      <tr>
                        <th>ID</th>
                        <th>Car &amp; Type</th>
                        <th>Travellers</th>
                        <th>Days</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          ><a
                            href="#!"
                            class="text-primary-dark fw-medium"
                            aria-label="#CR-5236">#CR-5236</a
                          >
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <a
                              href="/vehicle"
                              class="avatar avatar-lg"
                              aria-label="View details"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-7.png"
                                class="img-fluid"
                                alt="img"
                              /></a
                            >
                            <div class="ms-2">
                              <p class="text-dark mb-0 fw-medium fs-14"
                                ><a href="/vehicle" aria-label="Infiniti QX60"
                                  >Infiniti QX60
                                </a></p
                              >
                              <span class="fs-14 fw-normal neutral-500"
                                >Hatchback</span
                              >
                            </div>
                          </div>
                        </td>
                        <td> 2 Adults, 2 Child </td>
                        <td>5 Days</td>
                        <td>$2,380</td>
                        <td>12 Jul 2025</td>
                        <td>
                          <span
                            class="badge badge-warning rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Pending</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          ><a
                            href="#!"
                            class="text-primary-dark fw-medium"
                            aria-label="#CR-1256">#CR-1256</a
                          >
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <a
                              href="/vehicle"
                              class="avatar avatar-lg"
                              aria-label="View details"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-8.png"
                                class="img-fluid"
                                alt="img"
                              /></a
                            >
                            <div class="ms-2">
                              <p class="text-dark mb-0 fw-medium fs-14"
                                ><a href="/vehicle" aria-label="Toyota 86 Coupe"
                                  >Toyota 86 Coupe</a
                                ></p
                              >
                              <span class="fs-14 fw-normal neutral-500"
                                >Sedan</span
                              >
                            </div>
                          </div>
                        </td>
                        <td> 2 Adults, 1 Child </td>
                        <td>3 Days</td>
                        <td>$1,400</td>
                        <td>26 Jul 2025</td>
                        <td>
                          <span
                            class="badge badge-success rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Completed</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          ><a
                            href="#!"
                            class="text-primary-dark fw-medium"
                            aria-label="#CR-2356">#CR-2356</a
                          >
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <a
                              href="/vehicle"
                              class="avatar avatar-lg"
                              aria-label="View details"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-9.png"
                                class="img-fluid"
                                alt="img"
                              /></a
                            >
                            <div class="ms-2">
                              <p class="text-dark mb-0 fw-medium fs-14"
                                ><a href="/vehicle" aria-label="Jeep Wrangler"
                                  >Jeep Wrangler</a
                                ></p
                              >
                              <span class="fs-14 fw-normal neutral-500"
                                >Coupe</span
                              >
                            </div>
                          </div>
                        </td>
                        <td> 2 Adults, 2 Child </td>
                        <td>2 Days</td>
                        <td>$1,810</td>
                        <td>10 Aug 2025</td>
                        <td>
                          <span
                            class="badge badge-success rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Completed</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          ><a
                            href="#!"
                            class="text-primary-dark fw-medium"
                            aria-label="#CR-5414">#CR-5414</a
                          >
                        </td>
                        <td>
                          <div class="d-flex align-items-center">
                            <a
                              href="/vehicle"
                              class="avatar avatar-lg"
                              aria-label="View details"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-10.png"
                                class="img-fluid"
                                alt="img"
                              /></a
                            >
                            <div class="ms-2">
                              <p class="text-dark mb-0 fw-medium fs-14"
                                ><a href="/vehicle" aria-label="Jaguar XK"
                                  >Jaguar XK</a
                                ></p
                              >
                              <span class="fs-14 fw-normal neutral-500"
                                >Sedan</span
                              >
                            </div>
                          </div>
                        </td>
                        <td> 3 Adults, 1 Child </td>
                        <td>2 Days</td>
                        <td>$1,450</td>
                        <td>22 Aug 2025</td>
                        <td>
                          <span
                            class="badge badge-danger rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Canceled</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
