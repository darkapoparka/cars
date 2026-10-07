<svelte:options preserveWhitespace={true} />

<script lang="ts">
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
                ><a
                  href="/dashboard/add-listing"
                  aria-current="page"
                  aria-label="Add Listing"
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
        <div class="row mb-3">
          <div class="col-xl-12 d-flex">
            <div class="card shadow-none flex-fill">
              <div class="card-header">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="neutral-1000 text-md-bold fs-5">Pricing</span>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Tour price ($)"
                        aria-label="Tour price ($)"
                      />
                    </div>
                  </div>
                </div>
                <div class="row mb-2">
                  <p class="text-md-bold neutral-1000 mb-12">Extra Services</p>
                </div>

                <div class="box-extra-services">
                  <div class="item-extra-service">
                    <div class="item-extra-1">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Service title 1"
                        aria-label="Service title 1"
                      />
                    </div>
                    <div class="item-extra-2">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Price ($)"
                        aria-label="Price ($)"
                      />
                    </div>
                    <div class="item-extra-3"
                      ><a
                        class="btn-remove"
                        href="#!"
                        aria-label="View details"
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M12.7778 10.1111V15.4444"
                            stroke=""
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M9.22217 10.1111V15.4444"
                            stroke=""
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M5.66699 6.55556V17.2222C5.66699 18.2041 6.46293 19 7.44477 19H14.5559C15.5377 19 16.3337 18.2041 16.3337 17.2222V6.55556"
                            stroke=""
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M3.88916 6.55556H18.1114"
                            stroke=""
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                          <path
                            d="M6.55566 6.55556L8.33344 3H13.6668L15.4446 6.55556"
                            stroke=""
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg></a
                      ></div
                    >
                  </div>
                </div>
                <div class="text-end pe-5">
                  <a class="btn btn-addmore" href="#!" aria-label="Add More"
                    >Add More</a
                  >
                </div>

                <div class="box-button-save mt-15">
                  <button
                    class="btn btn btn-primary"
                    aria-label="Save Changes"
                    type="button">Save Changes</button
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
                  <span class="neutral-1000 text-md-bold fs-5">Car details</span
                  >
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12 mb-3">
                    <div class="list-image-upload">
                      <div class="box-upload-image">
                        <div class="item-upload-image">
                          <input type="file" name="file" aria-label="file" />
                          <div class="upload-info">
                            <div class="icon-upload">
                              <svg
                                width="22"
                                height="23"
                                viewBox="0 0 22 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                              >
                                <path
                                  d="M8 10.25C6.48 10.25 5.25 9.02 5.25 7.5C5.25 5.98 6.48 4.75 8 4.75C9.52 4.75 10.75 5.98 10.75 7.5C10.75 9.02 9.52 10.25 8 10.25ZM8 6.25C7.31 6.25 6.75 6.81 6.75 7.5C6.75 8.19 7.31 8.75 8 8.75C8.69 8.75 9.25 8.19 9.25 7.5C9.25 6.81 8.69 6.25 8 6.25Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M14 22.25H8C2.57 22.25 0.25 19.93 0.25 14.5V8.5C0.25 3.07 2.57 0.75 8 0.75H12C12.41 0.75 12.75 1.09 12.75 1.5C12.75 1.91 12.41 2.25 12 2.25H8C3.39 2.25 1.75 3.89 1.75 8.5V14.5C1.75 19.11 3.39 20.75 8 20.75H14C18.61 20.75 20.25 19.11 20.25 14.5V9.5C20.25 9.09 20.59 8.75 21 8.75C21.41 8.75 21.75 9.09 21.75 9.5V14.5C21.75 19.93 19.43 22.25 14 22.25Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M17 8.24994C16.59 8.24994 16.25 7.90994 16.25 7.49994V1.49994C16.25 1.19994 16.43 0.919939 16.71 0.809939C16.99 0.699939 17.31 0.759939 17.53 0.969939L19.53 2.96994C19.82 3.25994 19.82 3.73994 19.53 4.02994C19.24 4.31994 18.76 4.31994 18.47 4.02994L17.75 3.30994V7.49994C17.75 7.90994 17.41 8.24994 17 8.24994Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M14.9999 4.24994C14.8099 4.24994 14.6199 4.17994 14.4699 4.02994C14.1799 3.73994 14.1799 3.25994 14.4699 2.96994L16.4699 0.969941C16.7599 0.679941 17.2399 0.679941 17.5299 0.969941C17.8199 1.25994 17.8199 1.73994 17.5299 2.02994L15.5299 4.02994C15.3799 4.17994 15.1899 4.24994 14.9999 4.24994Z"
                                  fill=""
                                ></path>
                                <path
                                  d="M1.6698 19.2001C1.4298 19.2001 1.1898 19.0801 1.0498 18.8701C0.819805 18.5301 0.909805 18.0601 1.2498 17.8301L6.1798 14.5201C7.2598 13.8001 8.7498 13.8801 9.7298 14.7101L10.0598 15.0001C10.5598 15.4301 11.4098 15.4301 11.8998 15.0001L16.0598 11.4301C17.1198 10.5201 18.7898 10.5201 19.8598 11.4301L21.4898 12.8301C21.7998 13.1001 21.8398 13.5701 21.5698 13.8901C21.2998 14.2001 20.8198 14.2401 20.5098 13.9701L18.8798 12.5701C18.3798 12.1401 17.5398 12.1401 17.0398 12.5701L12.8798 16.1401C11.8198 17.0501 10.1498 17.0501 9.0798 16.1401L8.7498 15.8501C8.2898 15.4601 7.52981 15.4201 7.01981 15.7701L2.0998 19.0801C1.9598 19.1601 1.8098 19.2001 1.6698 19.2001Z"
                                  fill=""
                                ></path>
                              </svg>
                            </div>
                            <div class="text-upload">
                              <p class="text-sm-medium neutral-500"
                                >Upload Image</p
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="preview-images">
                        <div class="list-preview">
                          <div class="image-preview">
                            <div class="box-image-preview"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-1.png"
                                alt="Travilla"
                              /><a
                                class="btn-delete-image"
                                href="#!"
                                aria-label="View details"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    d="M9.3335 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M6.6665 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4 4.66667V12.6667C4 13.403 4.59695 14 5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M2.6665 4.66667H13.3332"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4.6665 4.66667L5.99984 2H9.99984L11.3332 4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                  </path>
                                </svg></a
                              ></div
                            >
                          </div>
                          <div class="image-preview">
                            <div class="box-image-preview"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-2.png"
                                alt="Travilla"
                              /><a
                                class="btn-delete-image"
                                href="#!"
                                aria-label="View details"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    d="M9.3335 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M6.6665 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4 4.66667V12.6667C4 13.403 4.59695 14 5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M2.6665 4.66667H13.3332"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4.6665 4.66667L5.99984 2H9.99984L11.3332 4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                  </path>
                                </svg></a
                              ></div
                            >
                          </div>
                          <div class="image-preview">
                            <div class="box-image-preview"
                              ><img
                                src="/assets/imgs/cars-listing/cars-listing-6/car-3.png"
                                alt="Travilla"
                              /><a
                                class="btn-delete-image"
                                href="#!"
                                aria-label="View details"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  focusable="false"
                                >
                                  <path
                                    d="M9.3335 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M6.6665 7.33333V11.3333"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4 4.66667V12.6667C4 13.403 4.59695 14 5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M2.6665 4.66667H13.3332"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M4.6665 4.66667L5.99984 2H9.99984L11.3332 4.66667"
                                    stroke=""
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  >
                                  </path>
                                </svg></a
                              ></div
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Listing Title *"
                        aria-label="Listing Title *"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Model *"
                        aria-label="Model *"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Type *"
                        aria-label="Type *"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Condition *"
                        aria-label="Condition *"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Stock Number"
                        aria-label="Stock Number"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Mileage"
                        aria-label="Mileage"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Transmission"
                        aria-label="Transmission"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <textarea
                        class="form-control"
                        placeholder="Description"
                        rows="6"
                        aria-label="Description"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12 mb-3">
                    <h6>Features</h6>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />A/C:
                      Front
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />Backup
                      Camera
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />Cruise
                      Control
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />Audio
                      system
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input
                        type="checkbox"
                        aria-label="Preview field"
                      />Touchscreen display
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />GPS
                      navigation
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />Phone
                      connectivity
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input
                        type="checkbox"
                        aria-label="Preview field"
                      />Breakfast
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />In-car
                      Wi-Fi
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input
                        type="checkbox"
                        aria-label="Preview field"
                      />Anti-lock brake system (ABS):
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input type="checkbox" aria-label="Preview field" />Brake
                      assist (BA)
                    </label>
                  </div>
                  <div class="col-lg-6">
                    <label class="lbl-checkbox text-md-medium neutral-500">
                      <input
                        type="checkbox"
                        aria-label="Preview field"
                      />Airbags
                    </label>
                  </div>
                </div>
                <div class="box-button-save mt-15">
                  <button
                    class="btn btn-primary"
                    aria-label="Save Changes"
                    type="button">Save Changes</button
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
                  <span class="neutral-1000 text-md-bold fs-5">Car details</span
                  >
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Country"
                        aria-label="Country"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Country"
                        aria-label="Country"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="State"
                        aria-label="State"
                      />
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="City"
                        aria-label="City"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Address"
                        aria-label="Address"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Address 2"
                        aria-label="Address 2"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <div class="map-tour">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120835.65146929219!2d2.5873635107259836!3d47.992147406516835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5878d50e09eab%3A0x40b82c3688c4a20!2s77460%20Souppes-sur-Loing%2C%20Ph%C3%A1p!5e0!3m2!1svi!2s!4v1715095452879!5m2!1svi!2s"
                          width="100%"
                          height="363"
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
                <div class="box-button-save mt-15">
                  <button
                    class="btn btn btn-primary"
                    aria-label="Save Changes"
                    type="button">Save Changes</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
