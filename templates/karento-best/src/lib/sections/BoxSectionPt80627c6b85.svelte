<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { slider } from "#lib/vendor.ts";
  import { demoSubmit } from "#lib/interactions.ts";
</script>

<section class="box-section background-body pt-80">
  <div class="container">
    <div class="text-center mb-40">
      <div
        class="background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex"
      >
        <a href="/" class="neutral-700 text-md-medium" aria-label="Home">Home</a
        >
        <span>
          <img
            src="/assets/imgs/template/icons/arrow-right.svg"
            alt="Carento"
          />
        </span>
        <a href="#!" class="neutral-1000 text-md-bold" aria-label="News">News</a
        >
      </div>
      <h3 class="my-3 neutral-1000">Inside &amp; Trending</h3>
    </div>
    <div class="box-swiper">
      <div class="swiper-container swiper-group-1 position-relative" use:slider>
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <a class="d-block" href="/news/article" aria-label="View details"
              ><div
                class="item-banner-slide-review karento-news-hero d-flex align-items-center rounded-12"
              >
                <div class="position-relative z-1 karento-news-hero-copy">
                  <span class="text-primary text-md-bold">Road Trips</span>
                  <h3 class="mt-20 mb-20 color-white">
                    How to Choose the Perfect <br class="d-none d-md-block" />
                    Rental Car for Your Trip
                  </h3>
                  <div class="card-meta-user">
                    <div class="box-author-small">
                      <img
                        src="/assets/imgs/blog/blog-grid/avatar.png"
                        alt="carento"
                      />
                      <p class="text-sm-bold">By Jimmy Dave</p>
                    </div>
                    <div class="date-post">
                      <p class="text-sm-medium">12 January 2024</p>
                    </div>
                  </div>
                  <p class="text-lg-medium color-white mt-3">
                    The Tucson Plug-in Hybrid is easy to drive and provides a <br
                    />
                    sufficient all-electric range.
                  </p>
                </div>
              </div></a
            >
          </div>
          <div class="swiper-slide">
            <a class="d-block" href="/news/article" aria-label="View details"
              ><div
                class="item-banner-slide-review karento-news-hero banner2 d-flex align-items-center rounded-12"
              >
                <div class="position-relative z-1 karento-news-hero-copy">
                  <span class="text-primary text-md-bold">Road Trips</span>
                  <h3 class="mt-20 mb-20 color-white">
                    How to Choose the Perfect <br class="d-none d-md-block" />
                    Rental Car for Your Trip
                  </h3>
                  <div class="card-meta-user">
                    <div class="box-author-small">
                      <img
                        src="/assets/imgs/blog/blog-grid/avatar.png"
                        alt="carento"
                      />
                      <p class="text-sm-bold">By Jimmy Dave</p>
                    </div>
                    <div class="date-post">
                      <p class="text-sm-medium">12 January 2024</p>
                    </div>
                  </div>
                  <p class="text-lg-medium color-white mt-3">
                    The Tucson Plug-in Hybrid is easy to drive and provides a <br
                    />
                    sufficient all-electric range.
                  </p>
                </div>
              </div></a
            >
          </div>
        </div>
        <div class="position-absolute end-0 bottom-0 p-40">
          <div
            class="box-button-slider box-button-slider-team justify-content-end"
          >
            <div
              class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
              tabindex="0"
              role="button"
              aria-label="Previous slide"
              aria-controls="swiper-wrapper-9c1b729b91027a37b"
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
                <path
                  d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666"
                  stroke=""
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
            <div
              class="swiper-button-next swiper-button-next-style-1 swiper-button-next-2"
              tabindex="0"
              role="button"
              aria-label="Next slide"
              aria-controls="swiper-wrapper-9c1b729b91027a37b"
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
                <path
                  d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992"
                  stroke=""
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-wrap align-items-center justify-content-center gap-3 pt-55 pb-60"
    >
      <span class="text-md-bold neutral-1000"> CATEGORY: </span>
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Industry News"
        >Industry News</a
      >
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Rental Advice"
        >Rental Advice</a
      >
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Road Trips"
        >Road Trips</a
      >
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Car Review"
        >Car Review</a
      >
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Travel Tips"
        >Travel Tips</a
      >
      <a href="#!" class="btn btn-white px-3 py-2" aria-label="Customer Stories"
        >Customer Stories</a
      >
    </div>
    <h3 class="text-center mb-65 neutral-1000">Latest News</h3>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-3.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Car Review</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar1.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-4.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Travel Tips</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar2.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-5.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Industry News</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar3.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-6.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Car Updates</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar4.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-7.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Rental Advice</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="Top 10 Travel Hacks for Budget-Conscious Adventurers"
                >Top 10 Travel Hacks for Budget-Conscious Adventurers</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar5.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-8.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Road Trips</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="Top 10 Travel Hacks for Budget-Conscious Adventurers"
                >Top 10 Travel Hacks for Budget-Conscious Adventurers</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar6.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-9.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Car Review</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="Top 10 Travel Hacks for Budget-Conscious Adventurers"
                >Top 10 Travel Hacks for Budget-Conscious Adventurers</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar7.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-10.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Car Review</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="Top 10 Travel Hacks for Budget-Conscious Adventurers"
                >Top 10 Travel Hacks for Budget-Conscious Adventurers</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar3.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-11.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Discovery</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar5.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-12.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Industry News</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar3.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-13.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Industry News</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar2.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12">
        <div class="card-news background-card mb-4">
          <div class="card-image">
            <a class="d-block" href="/news/article" aria-label="Read article"
              ><img
                src="/assets/imgs/blog/blog-grid/img-14.png"
                alt="Carento"
              /></a
            >
          </div>
          <div class="card-info">
            <span
              class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold"
              >Industry News</span
            >
            <div class="card-meta"
              ><span class="post-date neutral-1000">18 Sep 2024</span><span
                class="post-time neutral-1000">6 mins</span
              ><span class="post-comment neutral-1000">38 comments</span></div
            >
            <div class="card-title"
              ><a
                class="text-xl-bold neutral-1000 d-block"
                href="/news/article"
                aria-label="The Continued Growth of Delivery and Ride share-2024"
                >The Continued Growth of Delivery and Ride share-2024</a
              ></div
            >
            <div class="card-program">
              <div class="endtime">
                <div class="card-author">
                  <img
                    class="rounded-circle border border-primary"
                    src="/assets/imgs/blog/blog-grid/avatar8.png"
                    alt="Carento"
                  />
                  <p class="text-sm-bold neutral-1000">Jimmy Dave</p>
                </div>
                <div class="card-button"
                  ><a
                    class="btn btn-gray"
                    href="/news/article"
                    aria-label="Keep Reading">Keep Reading</a
                  ></div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
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
            ><a class="page-link" href="#!" aria-label="2">2</a></li
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
            ><a class="page-link" href="#!" aria-label="...">...</a></li
          >
          <li class="page-item">
            <a class="page-link active" href="#!" aria-label="Next">
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
    <div class="section-box box-subscriber background-body pt-85">
      <div class="container">
        <div class="block-subscriber">
          <div class="subscriber-left">
            <span class="btn btn-primary">Get instant discounts</span>
            <h4 class="mt-15 mb-30 neutral-1000"
              >Sign up to unlock secret deals instantly!</h4
            >
            <form class="form-subscriber" action="#" onsubmit={demoSubmit}>
              <input
                class="form-control"
                type="text"
                placeholder="Your Email"
                aria-label="Your Email"
              />
              <input
                class="btn btn-submit"
                type="submit"
                value="Subscribe"
                aria-label="Preview field"
              />
            </form>
            <p class="text-sm-medium neutral-500 mt-15"
              >No ads. No trails. No commitments</p
            >
          </div>
          <div class="subscriber-right"></div>
        </div>
      </div>
    </div>
  </div>
</section>
