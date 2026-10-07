<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { demoSubmit } from "#lib/interactions.ts";
</script>

<div class="container pt-140 pb-170">
  <div class="row">
    <div class="col-lg-5 mx-auto">
      <div class="border rounded-3 px-md-5 px-3 ptb-50">
        <div class="login-content">
          <div class="text-center">
            <p
              class="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center"
              >Sign in</p
            >
            <h4 class="neutral-1000">Welcome back</h4>
          </div>
          <div class="form-login mt-30">
            <form
              action="/dashboard"
              data-demo-signin="true"
              method="get"
              onsubmit={demoSubmit}
              ><p class="text-sm-medium neutral-500 mb-20"
                >Template preview: choose your dashboard. No credentials are
                required.</p
              >
              <div class="form-group"
                ><label
                  class="text-sm-bold neutral-1000 mb-10"
                  for="demo-account-type">Account type</label
                >
                <select
                  class="form-control"
                  id="demo-account-type"
                  name="area"
                  aria-label="area"
                >
                  <option value="owner">Dealership owner</option><option
                    value="member">Member</option
                  >
                </select>
              </div>
              <div class="form-group mb-0"
                ><button
                  class="btn btn-primary w-100"
                  type="submit"
                  aria-label="Sign in to demo"
                  >Sign in to demo <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M8 15L15 8L8 1M15 8L1 8"
                      stroke=""
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg></button
                ></div
              >
              <p class="text-sm-medium neutral-500 text-center mt-20"
                >New here? <a
                  class="neutral-1000"
                  href="/register"
                  aria-label="Create an account">Create an account</a
                ></p
              ></form
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
