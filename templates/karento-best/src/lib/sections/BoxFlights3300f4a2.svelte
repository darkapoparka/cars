<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import VehicleCard9aea63a66a from "#lib/cards/VehicleCard9aea63a66a.svelte";
  import VehicleCard0a53180f9f from "#lib/cards/VehicleCard0a53180f9f.svelte";
</script>

<section class="section-box box-flights background-body">
  <div class="container">
    <div class="row align-items-end mb-10">
      <div class="col-md-8">
        <h3 class="neutral-1000">Featured Listings</h3>
        <p class="text-lg-medium neutral-500"
          >Find the perfect ride for any occasion</p
        >
      </div>
      <div class="col-md-4 mt-md-0 mt-4">
        <div class="d-flex justify-content-end">
          <a class="btn btn-primary" href="/vehicles" aria-label="View More">
            View More
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
                d="M8 15L15 8L8 1M15 8L1 8"
                stroke=""
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="row pt-30">
      <div class="col-lg-3 col-md-6">
        <VehicleCard9aea63a66a
          card={{
            sample: true,
            image: "/assets/imgs/cars-listing/cars-listing-2/car-1.png",
            imageAlt: "Carento",
            href: "/vehicle",
            title: "Volkswagen Golf GTD",
            location: "Manchester, England",
            mileage: "25,100 miles",
            transmission: "Automatic",
            fuel: "Diesel",
            seats: "7 seats",
            price: "$498.25",
            pricePeriod: "",
            action: "Book Now",
            reviews: "(672 reviews)",
            rating: "4.96 ",
          }}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleCard0a53180f9f
          card={{
            sample: true,
            image: "/assets/imgs/cars-listing/cars-listing-2/car-2.png",
            imageAlt: "Carento",
            href: "/vehicle",
            title: "Volvo S60 D4 R-Design",
            location: "New South Wales, Australia",
            mileage: "25,100 miles",
            transmission: "Automatic",
            fuel: "Diesel",
            seats: "7 seats",
            price: "$498.25",
            pricePeriod: "",
            action: "Book Now",
            reviews: "(672 reviews)",
            rating: "4.96 ",
          }}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleCard0a53180f9f
          card={{
            sample: true,
            image: "/assets/imgs/cars-listing/cars-listing-2/car-3.png",
            imageAlt: "Carento",
            href: "/vehicle",
            title: "Jaguar XE 2.0d R-Sport",
            location: "Manchester, England",
            mileage: "25,100 miles",
            transmission: "Automatic",
            fuel: "Diesel",
            seats: "7 seats",
            price: "$498.25",
            pricePeriod: "",
            action: "Book Now",
            reviews: "(672 reviews)",
            rating: "4.96 ",
          }}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleCard0a53180f9f
          card={{
            sample: true,
            image: "/assets/imgs/cars-listing/cars-listing-2/car-4.png",
            imageAlt: "Carento",
            href: "/vehicle",
            title: "Lexus IS 300h F Sport",
            location: "Manchester, England",
            mileage: "25,100 miles",
            transmission: "Automatic",
            fuel: "Diesel",
            seats: "7 seats",
            price: "$498.25",
            pricePeriod: "",
            action: "Book Now",
            reviews: "(672 reviews)",
            rating: "4.96 ",
          }}
        /></div
      >
    </div>
  </div>
</section>
