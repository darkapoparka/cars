<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { demoAction } from "#lib/interactions.ts";
  let annualPrice = $state(false);
</script>

<section class="section-pricing-1 pt-80 pb-100 background-body border-bottom">
  <div class="container">
    <div class="row pb-40 z-1 justify-content-center">
      <div class="col-lg-auto align-self-end">
        <h3 class="text-center neutral-1000">Membership Plans</h3>
        <div class="d-flex justify-content-center align-items-center mt-3">
          <fieldset class="karento-billing-control" data-billing-control>
            <legend class="visually-hidden">Billing period</legend>
            <label class="karento-billing-option"
              ><input
                class="visually-hidden"
                type="radio"
                name="billing-period"
                value="monthly"
                checked={!annualPrice}
                onchange={() => (annualPrice = false)}
              /><span>Monthly</span></label
            >
            <label class="karento-billing-option"
              ><input
                class="visually-hidden"
                type="radio"
                name="billing-period"
                value="annual"
                checked={annualPrice}
                onchange={() => (annualPrice = true)}
              /><span>Annual</span></label
            >
          </fieldset>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-sm-6 mb-lg-0 mb-4">
        <div class="h-100 p-4 border rounded-12">
          <h6 class="text-lg-bold neutral-1000">Basic</h6>
          <div class="d-flex">
            <span class="heading-3 neutral-1000">$</span>
            <h3 class="neutral-1000 mb-0 text-price-standard"
              >{annualPrice ? "228" : "19"}</h3
            >
            <span
              class="neutral-500 text-md-medium align-self-end text-type-standard"
              >{annualPrice ? "/ year" : "/ month"}</span
            >
          </div>
          <p class="text-sm-medium neutral-1000"
            >For most businesses that want to optimize web queries</p
          >
          <ul class="list-unstyled mb-0 py-4 border-top mt-4">
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Access to standard vehicles</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >24/7 customer support</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Basic insurance coverage</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2 text-400"
                >Online booking</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2 text-400"
                >Standard roadside assistance</p
              >
            </li>
            <li class="d-flex align-items-center">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2 text-400"
                >One free vehicle per month</p
              >
            </li>
          </ul>
          <button
            class="btn btn-primary2 w-100 d-flex justify-content-between"
            aria-label="Get Started Now"
            onclick={demoAction}
            type="button"
          >
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="fill-dark"
                d="M17.4177 5.41797L16.3487 6.48705L21.1059 11.2443H0V12.7562H21.1059L16.3487 17.5134L17.4177 18.5825L24 12.0002L17.4177 5.41797Z"
                fill="#111827"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6 mb-lg-0 mb-4">
        <div class="h-100 p-4 border rounded-12">
          <h6 class="text-lg-bold neutral-1000">Standard</h6>
          <div class="d-flex">
            <span class="heading-3 neutral-1000">$</span>
            <h3 class="neutral-1000 mb-0 text-price-standard"
              >{annualPrice ? "348" : "29"}</h3
            >
            <span
              class="neutral-500 text-md-medium align-self-end text-type-standard"
              >{annualPrice ? "/ year" : "/ month"}</span
            >
          </div>
          <p class="text-sm-medium neutral-1000"
            >For most businesses that want to optimize web queries</p
          >
          <ul class="list-unstyled mb-0 py-4 border-top mt-4">
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >All Basic Plan features</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Access to premium vehicles</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Flexible rental terms</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2">GPS included</p>
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Free additional driver</p
              >
            </li>
            <li class="d-flex align-items-center">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Unlimited vehicle swaps</p
              >
            </li>
          </ul>
          <button
            class="btn btn-primary2 w-100 d-flex justify-content-between"
            aria-label="Get Started Now"
            onclick={demoAction}
            type="button"
          >
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="fill-dark"
                d="M17.4177 5.41797L16.3487 6.48705L21.1059 11.2443H0V12.7562H21.1059L16.3487 17.5134L17.4177 18.5825L24 12.0002L17.4177 5.41797Z"
                fill="dark"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6 mb-lg-0 mb-4">
        <div class="h-100 p-4 border rounded-12">
          <h6 class="text-lg-bold neutral-1000">Premium</h6>
          <div class="d-flex">
            <span class="heading-3 neutral-1000">$</span>
            <h3 class="neutral-1000 mb-0 text-price-business"
              >{annualPrice ? "588" : "49"}</h3
            >
            <span
              class="neutral-500 text-md-medium align-self-end text-type-business"
              >{annualPrice ? "/ year" : "/ month"}</span
            >
          </div>
          <p class="text-sm-medium neutral-1000"
            >For most businesses that want to optimize web queries</p
          >
          <ul class="list-unstyled mb-0 py-4 border-top mt-4">
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >All Standard Plan features</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Luxury vehicle options</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Complimentary upgrades</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Enhanced insurance coverage</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Free airport pickup, drop-off</p
              >
            </li>
            <li class="d-flex align-items-center">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Exclusive deals and offers</p
              >
            </li>
          </ul>
          <button
            class="btn btn-primary2 w-100 d-flex justify-content-between"
            aria-label="Get Started Now"
            onclick={demoAction}
            type="button"
          >
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="fill-dark"
                d="M17.4177 5.41797L16.3487 6.48705L21.1059 11.2443H0V12.7562H21.1059L16.3487 17.5134L17.4177 18.5825L24 12.0002L17.4177 5.41797Z"
                fill="#111827"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="col-lg-3 col-sm-6 mb-lg-0 mb-4">
        <div class="h-100 p-4 border rounded-12">
          <h6 class="text-lg-bold neutral-1000">VIP</h6>
          <div class="d-flex">
            <span class="heading-3 neutral-1000">$</span>
            <h3 class="neutral-1000 mb-0 text-price-enterprise"
              >{annualPrice ? "1,188" : "99"}</h3
            >
            <span
              class="neutral-500 text-md-medium align-self-end text-type-enterprise"
              >{annualPrice ? "/ year" : "/ month"}</span
            >
          </div>
          <p class="text-sm-medium neutral-1000"
            >For most businesses that want to optimize web queries</p
          >
          <ul class="list-unstyled mb-0 py-4 border-top mt-4">
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >All Premium Plan features</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >VIP transfer service</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Personal concierge</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Unlimited mileage</p
              >
            </li>
            <li class="d-flex align-items-center mb-3">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >Luxury vehicle upgrades</p
              >
            </li>
            <li class="d-flex align-items-center">
              <svg
                class="karento-plan-check"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                  d="m8 13 3.25 3.25L18 9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
              <p class="text-sm-medium neutral-1000 m-0 ms-2"
                >24/7 account manager</p
              >
            </li>
          </ul>
          <button
            class="btn btn-primary2 w-100 d-flex justify-content-between"
            aria-label="Get Started Now"
            onclick={demoAction}
            type="button"
          >
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="fill-dark"
                d="M17.4177 5.41797L16.3487 6.48705L21.1059 11.2443H0V12.7562H21.1059L16.3487 17.5134L17.4177 18.5825L24 12.0002L17.4177 5.41797Z"
                fill="#111827"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="rotate-center ellipse-rotate-success position-absolute z-0"></div>
  <div class="rotate-center-rev ellipse-rotate-primary position-absolute z-0"
  ></div>
</section>
