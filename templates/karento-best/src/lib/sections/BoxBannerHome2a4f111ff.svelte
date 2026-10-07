<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import Gallery from "#lib/components/Gallery.svelte";
  import { quantity } from "#lib/interactions.ts";
  import { demoAction } from "#lib/interactions.ts";
</script>

<section class="section-box box-banner-home2 background-body">
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <div class="container-banner-activities">
          <Gallery
            slides={[
              "/assets/imgs/shop/shop-details/img-1.png",
              "/assets/imgs/shop/shop-details/img-1.png",
              "/assets/imgs/shop/shop-details/img-1.png",
              "/assets/imgs/shop/shop-details/img-1.png",
              "/assets/imgs/shop/shop-details/img-1.png",
            ].map((src) => ({ src, alt: "Carento" }))}
            thumbnails={[
              "/assets/imgs/shop/shop-details/thumb-1.png",
              "/assets/imgs/shop/shop-details/thumb-2.png",
              "/assets/imgs/shop/shop-details/thumb-3.png",
              "/assets/imgs/shop/shop-details/thumb-4.png",
              "/assets/imgs/shop/shop-details/thumb-1.png",
              "/assets/imgs/shop/shop-details/thumb-2.png",
              "/assets/imgs/shop/shop-details/thumb-3.png",
              "/assets/imgs/shop/shop-details/thumb-4.png",
            ].map((src) => ({ src, alt: "Carento" }))}
            boxClass="box-banner-activities border rounded-3 overflow-hidden"
            thumbnailClass="banner-slide border p-0 mx-2 rounded-3"
            label="Product photos"
          >
            <div class="box-button-abs">
              <a
                class="btn btn-white-md popup-youtube"
                href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                aria-label="Video Clips"
              >
                <img
                  src="/assets/imgs/page/activities/video.svg"
                  alt="Carento"
                />Video Clips</a
              >
            </div>
          </Gallery>
        </div>
      </div>
      <div class="col-lg-6 ps-lg-4">
        <div class="tour-header karento-product-buybox">
          <div class="d-flex flex-wrap align-items-center gap-4 mb-3">
            <div class="tour-rate mb-0">
              <div class="rate-element">
                <span class="rating"
                  >4.96 <span class="text-sm-medium neutral-500"
                    >(672 reviews)</span
                  ></span
                >
              </div>
            </div>
            <a href="#!" class="text-md-medium neutral-500" aria-label="SKU"
              >SKU <span
                class="text-md-bold neutral-1000 ms-1 text-decoration-underline"
                >LVA-4125</span
              >
            </a>
            <a href="#!" aria-label="View details">
              <img src="/assets/imgs/shop/shop-list/stock.png" alt="Carento" />
            </a>
          </div>
          <div class="tour-title-main">
            <h5 class="neutral-1000">
              Mobil Delvac 1300 Super Heavy Duty Synthetic Blend
            </h5>
          </div>
          <div class="d-flex align-items-center gap-3 border-bottom pb-4 mb-4">
            <span
              class="text-24-medium neutral-500 text-decoration-line-through"
            >
              $68.53
            </span>
            <h4 class="neutral-1000">$48.25</h4>
          </div>
          <ul class="list-style-disc ps-3 pe-4">
            <li class="text-md-medium neutral-1000"
              >Mobil Delvac 1300 Super Heavy Duty Synthetic Blend</li
            >
            <li class="text-md-medium neutral-1000"
              >Confident driving in all weather conditions</li
            >
            <li class="text-md-medium neutral-1000"
              >Visual Alignment Indicators</li
            >
          </ul>
          <div class="tour-metas mt-4 border-top pt-4">
            <div class="tour-meta-left mb-0">
              <div class="add-to-cart me-3">
                <div class="detail-qty" use:quantity>
                  <a href="#!" class="qty-down ps-2" aria-label="View details">
                    <svg
                      class="invert"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M15.125 12.375H6.875C6.51033 12.375 6.16059 12.2301 5.90273 11.9723C5.64487 11.7144 5.5 11.3647 5.5 11C5.5 10.6353 5.64487 10.2856 5.90273 10.0277C6.16059 9.76987 6.51033 9.625 6.875 9.625H15.125C15.4897 9.625 15.8394 9.76987 16.0973 10.0277C16.3551 10.2856 16.5 10.6353 16.5 11C16.5 11.3647 16.3551 11.7144 16.0973 11.9723C15.8394 12.2301 15.4897 12.375 15.125 12.375Z"
                        fill="#101010"
                      ></path>
                    </svg>
                  </a>
                  <input
                    type="text"
                    name="quantity"
                    class="qty-val w-100px pl-45"
                    value="1"
                    min="1"
                    aria-label="quantity"
                  />
                  <a href="#!" class="qty-up pe-2" aria-label="View details">
                    <svg
                      class="invert"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M15.5833 10.0833H11.9167V6.41667C11.9167 6.17355 11.8201 5.94039 11.6482 5.76849C11.4763 5.59658 11.2431 5.5 11 5.5C10.7569 5.5 10.5237 5.59658 10.3518 5.76849C10.1799 5.94039 10.0833 6.17355 10.0833 6.41667V10.0833H6.41667C6.17355 10.0833 5.94039 10.1799 5.76849 10.3518C5.59658 10.5237 5.5 10.7569 5.5 11C5.5 11.2431 5.59658 11.4763 5.76849 11.6482C5.94039 11.8201 6.17355 11.9167 6.41667 11.9167H10.0833V15.5833C10.0833 15.8264 10.1799 16.0596 10.3518 16.2315C10.5237 16.4034 10.7569 16.5 11 16.5C11.2431 16.5 11.4763 16.4034 11.6482 16.2315C11.8201 16.0596 11.9167 15.8264 11.9167 15.5833V11.9167H15.5833C15.8264 11.9167 16.0596 11.8201 16.2315 11.6482C16.4034 11.4763 16.5 11.2431 16.5 11C16.5 10.7569 16.4034 10.5237 16.2315 10.3518C16.0596 10.1799 15.8264 10.0833 15.5833 10.0833Z"
                        fill="#101010"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
              <button
                type="submit"
                class="btn btn-primary rounded-3 gap-2 button-add-to-cart"
                aria-label="Add to cart"
                onclick={demoAction}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g clip-path="url(#clip0_20_23536)">
                    <path
                      d="M16 2H2.828L2.8 1.766C2.7427 1.27961 2.50892 0.831155 2.14299 0.505652C1.77706 0.180149 1.30442 0.000227862 0.814667 0L0 0V1.33333H0.814667C0.977956 1.33335 1.13556 1.3933 1.25758 1.50181C1.3796 1.61032 1.45756 1.75983 1.47667 1.922L2.53333 10.9007C2.59063 11.3871 2.82441 11.8355 3.19034 12.161C3.55627 12.4865 4.02891 12.6664 4.51867 12.6667H13.3333V11.3333H4.51867C4.35528 11.3333 4.19759 11.2733 4.07555 11.1646C3.95351 11.056 3.87562 10.9063 3.85667 10.744L3.76933 10H14.5573L16 2ZM13.4427 8.66667H3.61267L2.98533 3.33333H14.4047L13.4427 8.66667Z"
                      fill="#101010"
                    ></path>
                    <path
                      d="M4.66732 15.9997C5.4037 15.9997 6.00065 15.4027 6.00065 14.6663C6.00065 13.93 5.4037 13.333 4.66732 13.333C3.93094 13.333 3.33398 13.93 3.33398 14.6663C3.33398 15.4027 3.93094 15.9997 4.66732 15.9997Z"
                      fill="#101010"
                    ></path>
                    <path
                      d="M11.3333 15.9997C12.0697 15.9997 12.6667 15.4027 12.6667 14.6663C12.6667 13.93 12.0697 13.333 11.3333 13.333C10.597 13.333 10 13.93 10 14.6663C10 15.4027 10.597 15.9997 11.3333 15.9997Z"
                      fill="#101010"
                    ></path>
                  </g>
                </svg>
                Add to cart
              </button>
            </div>
            <div class="tour-meta-right mb-0 mt-3 mt-md-0">
              <a class="btn btn-share" href="#!" aria-label="Share">
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M13 11.5332C12.012 11.5332 11.1413 12.0193 10.5944 12.7584L5.86633 10.3374C5.94483 10.0698 6 9.79249 6 9.49989C6 9.10302 5.91863 8.72572 5.77807 8.37869L10.7262 5.40109C11.2769 6.04735 12.0863 6.46655 13 6.46655C14.6543 6.46655 16 5.12085 16 3.46655C16 1.81225 14.6543 0.466553 13 0.466553C11.3457 0.466553 10 1.81225 10 3.46655C10 3.84779 10.0785 4.20942 10.2087 4.54515L5.24583 7.53149C4.69563 6.90442 3.8979 6.49989 3 6.49989C1.3457 6.49989 0 7.84559 0 9.49989C0 11.1542 1.3457 12.4999 3 12.4999C4.00433 12.4999 4.8897 11.9996 5.4345 11.2397L10.147 13.6529C10.0602 13.9331 10 14.2249 10 14.5332C10 16.1875 11.3457 17.5332 13 17.5332C14.6543 17.5332 16 16.1875 16 14.5332C16 12.8789 14.6543 11.5332 13 11.5332Z"
                    fill=""
                  ></path>
                </svg>
                Share
              </a>
              <a
                class="btn btn-wishlish"
                href="#!"
                aria-label="Wishlist"
                onclick={demoAction}
              >
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
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.2222 2.3638C4.34203 0.243977 7.65342 0.0419426 10.0004 1.7577C12.3473 0.0419426 15.6587 0.243977 17.7786 2.3638C20.1217 4.70695 20.1217 8.50594 17.7786 10.8491L12.1217 16.5059C10.9501 17.6775 9.05063 17.6775 7.87906 16.5059L2.2222 10.8491C-0.120943 8.50594 -0.120943 4.70695 2.2222 2.3638Z"
                    fill=""
                  ></path>
                </svg> Wishlist
              </a>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2 mt-4">
            <span class="text-md-medium neutral-500">Categories:</span>
            <span class="text-md-medium neutral-1000"
              >Cleaning Oils, Motor Oils, Oils &amp; Fluids</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
