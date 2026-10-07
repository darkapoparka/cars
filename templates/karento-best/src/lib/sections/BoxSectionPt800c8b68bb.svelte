<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { chart } from "#lib/vendor.ts";
  import { dropdownClose } from "#lib/interactions.ts";
  let expanded4 = $state(false);
  let selected5 = $state("Status");
  let expanded6 = $state(false);
  let selected7 = $state("Sort");
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
                ><a href="/account/wishlist" aria-label="My Wishlist"
                  ><i class="fi fi-rr-heart me-1"></i> My Wishlist</a
                ></li
              >
              <li class="py-2"
                ><a
                  href="/account/wallet"
                  aria-current="page"
                  aria-label="My Wallet"
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
        <div class="row mb-3">
          <div class="col-xl-4 mb-2 mb-lg-0">
            <div class="card shadow-none">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <span class="avatar avatar-xl rounded-circle bg-primary me-3">
                    <i class="fi fi-rr-bookmark fs-36"></i>
                  </span>
                  <div>
                    <p>Wallet Balance</p>
                    <h5><span>$12,500</span></h5>
                    <p
                      ><span class="text-success"
                        ><i class="fi fi-rr-arrow-small-up"></i>45%</span
                      > This Week</p
                    >
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
                    <p>Total Credit</p>
                    <h5><span>$18256</span></h5>
                    <p
                      ><span class="text-danger"
                        ><i class="fi fi-rr-arrow-small-down"></i>15%</span
                      > This Week</p
                    >
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
                    <p>Total transactions</p>
                    <h5><span>65</span></h5>
                    <p
                      ><span class="text-success"
                        ><i class="fi fi-rr-arrow-small-up"></i>8%</span
                      > last Month</p
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-lg-6">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1">Add Amount</p>
              </div>
              <div class="card-body">
                <p class="mb-3"
                  >Add funds to your account. Ready for any transaction.</p
                >
                <input
                  type="text"
                  class="form-control"
                  placeholder="$"
                  aria-label="$"
                />

                <div class="mt-3">
                  <div class="credit-card-details">
                    <div class="card-form">
                      <div class="row">
                        <div class="col-lg-6">
                          <div class="mb-2">
                            <label class="form-label" for="field-0c8b68bb-0"
                              >Card Holder Name</label
                            >
                            <div class="user-icon">
                              <span class="input-icon fs-14"
                                ><i class="fi fi-rr-user"></i></span
                              >
                              <input
                                type="email"
                                class="form-control"
                                placeholder="Mr"
                                id="field-0c8b68bb-0"
                                aria-label="Mr"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="mb-2">
                            <label class="form-label" for="field-0c8b68bb-1"
                              >Card Number</label
                            >
                            <div class="user-icon">
                              <span class="input-icon fs-14"
                                ><i class="fi fi-rr-credit-card"></i></span
                              >
                              <input
                                type="email"
                                class="form-control"
                                placeholder="*** *** *** ***"
                                id="field-0c8b68bb-1"
                                aria-label="*** *** *** ***"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="mb-3">
                            <label class="form-label" for="field-0c8b68bb-2"
                              >Expire Date</label
                            >
                            <div class="user-icon">
                              <span class="input-icon fs-14"
                                ><i class="fi fi-rr-calendar-lines"></i></span
                              >
                              <input
                                type="email"
                                class="form-control"
                                placeholder="MM / YYYY"
                                id="field-0c8b68bb-2"
                                aria-label="MM / YYYY"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-6">
                          <div class="mb-3">
                            <label class="form-label" for="field-0c8b68bb-3"
                              >CVV</label
                            >
                            <div class="user-icon">
                              <span class="input-icon fs-14"
                                ><i class="fi fi-rr-qr-scan"></i></span
                              >
                              <input
                                type="email"
                                class="form-control"
                                placeholder="***"
                                id="field-0c8b68bb-3"
                                aria-label="***"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center justify-content-start">
                    <a
                      href="#!"
                      class="btn btn-primary"
                      aria-label="Add Payment">Add Payment</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1"
                  >Transaction data analysis</p
                >
              </div>
              <div class="card-body">
                <div id="chart-2" use:chart></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5"
                    >Transactions List</span
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
                      use:dropdownClose={{ close: () => (expanded4 = false) }}
                    >
                      <a
                        href="#!"
                        class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-label="Status"
                        onclick={() => (expanded4 = !expanded4)}
                        aria-expanded={expanded4}
                      >
                        <i class="fi fi-rr-steering-wheel me-2"
                        ></i>{selected5}</a
                      >
                      <ul
                        class={"dropdown-menu small dropdown-menu-end p-2 " +
                          (expanded4 ? "show" : "")}
                      >
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Pending"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded4 = false;
                              selected5 = "Pending";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Pending
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Completed"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded4 = false;
                              selected5 = "Completed";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Completed
                          </a>
                        </li>
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Cancelled"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded4 = false;
                              selected5 = "Cancelled";
                            }}
                          >
                            <i class="ti ti-point-filled me-1"></i>Cancelled
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="dropdown"
                      use:dropdownClose={{ close: () => (expanded6 = false) }}
                    >
                      <a
                        href="#!"
                        class="dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                        aria-label="Sort"
                        onclick={() => (expanded6 = !expanded6)}
                        aria-expanded={expanded6}
                      >
                        <i class="fi fi-rr-filter-list me-2"></i>{selected7}</a
                      >
                      <ul
                        class={"dropdown-menu small dropdown-menu-end p-2 " +
                          (expanded6 ? "show" : "")}
                      >
                        <li>
                          <a
                            href="#!"
                            class="dropdown-item rounded-1"
                            aria-label="Newest"
                            onclick={(event) => {
                              event.preventDefault();
                              expanded6 = false;
                              selected7 = "Newest";
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
                              expanded6 = false;
                              selected7 = "Oldest";
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
                              expanded6 = false;
                              selected7 = "Paid";
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
                              expanded6 = false;
                              selected7 = "Unpaid";
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
                              expanded6 = false;
                              selected7 = "Cancelled";
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
                <div class="table-responsive">
                  <table class="table">
                    <thead class="thead-light">
                      <tr>
                        <th>Payment Type</th>
                        <th>Credit / Debit</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-gray-9 fw-medium">Card</td>
                        <td>Debit</td>
                        <td>15 May 2025, 10:00 AM</td>
                        <td><span class="text-danger">-$256</span></td>
                        <td>$11,569</td>
                        <td>
                          <span
                            class="badge badge-success rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Completed</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-gray-9 fw-medium">Paypal</td>
                        <td>Credit</td>
                        <td>20 May 2025, 11:20 AM</td>
                        <td><span class="text-success">+$3000</span></td>
                        <td>$11,569</td>
                        <td>
                          <span
                            class="badge badge-secondary rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Pending</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-gray-9 fw-medium">Stripe</td>
                        <td>Credit</td>
                        <td>22 May 2025, 02:40 PM</td>
                        <td><span class="text-success">+$4000</span></td>
                        <td>$12,497</td>
                        <td>
                          <span
                            class="badge badge-success rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Completed</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="text-gray-9 fw-medium">Card</td>
                        <td>Debit</td>
                        <td>12 Jun 2025, 05:15 PM</td>
                        <td><span class="text-danger">-$600</span></td>
                        <td>$14,284</td>
                        <td>
                          <span
                            class="badge badge-danger rounded-pill d-inline-flex align-items-center fs-10"
                          >
                            <i class="fi fi-rr-caret-right me-1"></i>
                            Cancelled
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-gray-9 fw-medium">Card</td>
                        <td>Debit</td>
                        <td>17 Jun 2025, 09:30 AM</td>
                        <td><span class="text-success">+$11,569</span></td>
                        <td>$13,025</td>
                        <td>
                          <span
                            class="badge badge-success rounded-pill d-inline-flex align-items-center fs-10"
                            ><i class="fi fi-rr-caret-right me-1"
                            ></i>Completed</span
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
