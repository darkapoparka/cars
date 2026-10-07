<svelte:options preserveWhitespace={true} />

<script lang="ts">
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
                ><a href="/account/wallet" aria-label="My Wallet"
                  ><i class="fi fi-rr-money me-1"></i> My Wallet</a
                ></li
              >
              <li class="py-2"
                ><a
                  href="/account/profile"
                  aria-current="page"
                  aria-label="My Profile"
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
          <div class="col-xl-12">
            <div class="card shadow-none flex-fill mb-3">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1"
                  >Update your profile</p
                >
              </div>
              <div class="card-body">
                <div class="box-avatar-profile d-flex align-items-center">
                  <div class="image-avatar me-3">
                    <img
                      src="/assets/imgs/section-1/img-2.png"
                      alt="Travilla"
                    />
                  </div>
                  <button
                    class="btn btn-primary me-3"
                    aria-label="Change avatar"
                    type="button">Change avatar</button
                  >
                  <i class="fi fi-rr-trash"></i>
                </div>

                <div class="row mt-3">
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-0">Full Name *</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Steven Job"
                        id="field-49bbf3aa-0"
                        aria-label="Steven Job"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-1">Email *</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="stevenjob@gmail.com"
                        id="field-49bbf3aa-1"
                        aria-label="stevenjob@gmail.com"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-2">Contact number *</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Contact number"
                        value="01 - 234 567 89"
                        id="field-49bbf3aa-2"
                        aria-label="Contact number"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-3">Personal website</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="https://alithemes.com"
                        id="field-49bbf3aa-3"
                        aria-label="https://alithemes.com"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-4">Bio</label
                      >
                      <textarea
                        class="form-control"
                        placeholder="Your comment"
                        rows="6"
                        id="field-49bbf3aa-4"
                        aria-label="Your comment"
                        >{"We are AliThemes , a creative and dedicated group of individuals who love web development almost as much as we love our customers. We are passionate team with the mission for achieving the perfection in web design."}</textarea
                      >
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-5">Languages</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder=""
                        value="English, French"
                        id="field-49bbf3aa-5"
                        aria-label="field-49bbf3aa-5"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-6">Nationality</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Tour Experience"
                        value="France"
                        id="field-49bbf3aa-6"
                        aria-label="Tour Experience"
                      />
                    </div>
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

            <div class="card shadow-none flex-fill mb-3">
              <div class="card-header">
                <p class="neutral-1000 text-md-bold fs-5 py-1"
                  >Contact Information</p
                >
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-7">Country</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Country"
                        value="United States of America"
                        id="field-49bbf3aa-7"
                        aria-label="Country"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-8">City</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="City"
                        value="Chicago"
                        id="field-49bbf3aa-8"
                        aria-label="City"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-9">Complete Address</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Complete Address"
                        value="205 North Michigan Avenue, Suite 810, Chicago, 60601, USA"
                        id="field-49bbf3aa-9"
                        aria-label="Complete Address"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-10">Find On Map</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Find On Map"
                        value="205 North Michigan Avenue, Suite 810, Chicago, 60601, USA"
                        id="field-49bbf3aa-10"
                        aria-label="Find On Map"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-11">Latitude</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Address"
                        id="field-49bbf3aa-11"
                        aria-label="Address"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="form-group">
                      <label
                        class="text-sm-medium neutral-500 mb-10"
                        for="field-49bbf3aa-12">Longitude</label
                      >
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Address 2"
                        id="field-49bbf3aa-12"
                        aria-label="Address 2"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="form-group">
                      <span
                        class="d-inline-block text-sm-medium neutral-500 mb-10"
                        >Google Map</span
                      >
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
                    class="btn btn-primary"
                    aria-label="Save Changes"
                    type="button">Save Changes</button
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-6">
                <div class="card shadow-none flex-fill">
                  <div class="card-header">
                    <p class="neutral-1000 text-md-bold fs-5 py-1"
                      >Social Network</p
                    >
                  </div>

                  <div class="card-body">
                    <div class="row mb-3">
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-13">Facebook</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="https://www.facebook.com"
                            id="field-49bbf3aa-13"
                            aria-label="https://www.facebook.com"
                          />
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-14">Twitter</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="https://twitter.com"
                            id="field-49bbf3aa-14"
                            aria-label="https://twitter.com"
                          />
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-15">Instagram</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="https://www.instagram.com"
                            id="field-49bbf3aa-15"
                            aria-label="https://www.instagram.com"
                          />
                        </div>
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
              <div class="col-lg-6">
                <div class="card shadow-none flex-fill">
                  <div class="card-header">
                    <p class="neutral-1000 text-md-bold fs-5 py-1"
                      >Change Password</p
                    >
                  </div>

                  <div class="card-body">
                    <div class="row mb-3">
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-16">Old Password</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="password"
                            placeholder="*************"
                            id="field-49bbf3aa-16"
                            aria-label="*************"
                          />
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-17">New Password</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="password"
                            placeholder="*************"
                            id="field-49bbf3aa-17"
                            aria-label="*************"
                          />
                        </div>
                      </div>
                      <div class="col-lg-12">
                        <label
                          class="lbl-checkbox text-sm-medium neutral-500"
                          for="field-49bbf3aa-18">Confirm new password</label
                        >
                        <div class="form-group">
                          <input
                            class="form-control"
                            type="password"
                            placeholder="*************"
                            id="field-49bbf3aa-18"
                            aria-label="*************"
                          />
                        </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
