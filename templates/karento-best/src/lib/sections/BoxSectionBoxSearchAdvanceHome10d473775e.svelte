<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { selectCategory } from "#lib/interactions.ts";
  import { dropdownClose } from "#lib/interactions.ts";
  import CalendarInput from "#lib/components/CalendarInput.svelte";
  let expanded1 = $state(false);
  let selected2 = $state("New York, USA");
  let expanded4 = $state(false);
  let selected5 = $state("Delaware, USA");
</script>

<section class="box-section box-search-advance-home10 background-body">
  <div class="container">
    <div class="box-search-advance background-card">
      <div class="box-top-search">
        <div class="left-top-search">
          <a
            class="category-link text-sm-bold btn-click active"
            href="#!"
            aria-label="All cars"
            onclick={selectCategory}>All cars</a
          >
          <a
            class="category-link text-sm-bold btn-click"
            href="#!"
            aria-label="New cars"
            onclick={selectCategory}>New cars</a
          >
          <a
            class="category-link text-sm-bold btn-click"
            href="#!"
            aria-label="Used cars"
            onclick={selectCategory}>Used cars</a
          >
        </div>
        <div class="right-top-search d-none d-md-flex">
          <a
            class="text-sm-medium need-some-help"
            href="/contact"
            aria-label="Need help?">Need help?</a
          >
        </div>
      </div>
      <div class="box-bottom-search background-card">
        <div class="item-search">
          <label class="text-sm-bold neutral-500" for="field-d473775e-0"
            >Pick Up Location</label
          >
          <div
            class="dropdown"
            use:dropdownClose={{ close: () => (expanded1 = false) }}
          >
            <button
              class="btn btn-secondary dropdown-toggle btn-dropdown-search location-search"
              type="button"
              data-bs-toggle="dropdown"
              id="field-d473775e-0"
              aria-label="New York, USA"
              onclick={() => (expanded1 = !expanded1)}
              aria-expanded={expanded1}>{selected2}</button
            >
            <ul class={"dropdown-menu " + (expanded1 ? "show" : "")}>
              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Paris, France"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded1 = false;
                    selected2 = "Paris, France";
                  }}>Paris, France</a
                >
              </li>

              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Tokyo, Japan"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded1 = false;
                    selected2 = "Tokyo, Japan";
                  }}>Tokyo, Japan</a
                >
              </li>

              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="New York City, USA"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded1 = false;
                    selected2 = "New York City, USA";
                  }}>New York City, USA</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="item-search item-search-2">
          <label class="text-sm-bold neutral-500" for="field-d473775e-3"
            >Drop Off Location</label
          >
          <div
            class="dropdown"
            use:dropdownClose={{ close: () => (expanded4 = false) }}
          >
            <button
              class="btn btn-secondary dropdown-toggle btn-dropdown-search location-search"
              type="button"
              data-bs-toggle="dropdown"
              id="field-d473775e-3"
              aria-label="Delaware, USA"
              onclick={() => (expanded4 = !expanded4)}
              aria-expanded={expanded4}>{selected5}</button
            >
            <ul class={"dropdown-menu " + (expanded4 ? "show" : "")}>
              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Paris, France"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded4 = false;
                    selected5 = "Paris, France";
                  }}>Paris, France</a
                >
              </li>

              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="Tokyo, Japan"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded4 = false;
                    selected5 = "Tokyo, Japan";
                  }}>Tokyo, Japan</a
                >
              </li>

              <li>
                <a
                  class="dropdown-item"
                  href="#!"
                  aria-label="New York City, USA"
                  onclick={(event) => {
                    event.preventDefault();
                    expanded4 = false;
                    selected5 = "New York City, USA";
                  }}>New York City, USA</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="item-search item-search-3">
          <label class="text-sm-bold neutral-500" for="field-d473775e-6"
            >Pick Up Date &amp; Time</label
          >
          <div class="box-calendar-date">
            <CalendarInput
              class="search-input datepicker"
              placeholder=""
              value="Thu, Oct 01 2024"
              id="field-d473775e-6"
              aria-label="Pick Up Date & Time"
            />
          </div>
        </div>
        <div class="item-search bd-none">
          <label class="text-sm-bold neutral-500" for="field-d473775e-7"
            >Return Date &amp; Time</label
          >
          <div class="box-calendar-date">
            <CalendarInput
              class="search-input datepicker"
              placeholder=""
              value="Mon, Oct 07 2024"
              id="field-d473775e-7"
              aria-label="Return Date & Time"
            />
          </div>
        </div>
        <div class="item-search bd-none d-flex justify-content-end">
          <button
            class="btn btn-brand-2 text-nowrap"
            aria-label="Find a Vehicle"
            type="button"
          >
            <svg
              class="me-2"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            Find a Vehicle
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
