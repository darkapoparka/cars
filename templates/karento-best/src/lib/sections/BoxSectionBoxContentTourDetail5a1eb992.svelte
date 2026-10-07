<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  const accordionPreview = usePreview();
  const panelOpen0 = $derived(
    accordionPreview.panels["#collapseOverview"] === undefined
      ? true
      : accordionPreview.panels["#collapseOverview"] === "#collapseOverview",
  );
  const panelOpen1 = $derived(
    accordionPreview.panels["#collapseItinerary"] === undefined
      ? true
      : accordionPreview.panels["#collapseItinerary"] === "#collapseItinerary",
  );
  const panelOpen2 = $derived(
    accordionPreview.panels["#collapseQuestion"] === undefined
      ? true
      : accordionPreview.panels["#collapseQuestion"] === "#collapseQuestion",
  );
  const panelOpen3 = $derived(
    accordionPreview.panels["#collapseReviews"] === undefined
      ? true
      : accordionPreview.panels["#collapseReviews"] === "#collapseReviews",
  );
  const panelOpen4 = $derived(
    accordionPreview.panels["#collapseAddReview"] === undefined
      ? true
      : accordionPreview.panels["#collapseAddReview"] === "#collapseAddReview",
  );
</script>

<section class="box-section box-content-tour-detail background-body pt-0">
  <div class="container">
    <div class="row pt-30">
      <div class="col-lg-8">
        <div class="box-collapse-expand">
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOverview"
              aria-controls="collapseOverview"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen0 ? "" : " collapsed")}
              aria-expanded={panelOpen0}
              onclick={() =>
                (accordionPreview.panels["#collapseOverview"] = panelOpen0
                  ? null
                  : "#collapseOverview")}
            >
              <h6>Overview</h6>
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseOverview"
              class={"collapse" + (panelOpen0 ? " show" : "")}
            >
              <div class="card card-body">
                <p
                  >Introducing the epitome of modern sophistication in the realm
                  of compact SUVs – the Seltos K3. Dressed in a captivating blue
                  hue that exudes elegance and flair, this dynamic vehicle
                  stands as a testament to innovation and style. With its sleek
                  design accentuated by striking dark wheels, the Seltos K3 is
                  not merely a mode of transportation but a statement of refined
                  taste and contemporary living.</p
                >
                <p
                  >Prepare to embark on a journey where cutting-edge technology
                  meets unparalleled comfort, all wrapped in a package of
                  unparalleled aesthetics. Join us as we delve into the world of
                  the Seltos K3, where every detail is crafted to elevate your
                  driving experience to new heights.</p
                >
              </div>
            </div>
          </div>
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseItinerary"
              aria-controls="collapseItinerary"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen1 ? "" : " collapsed")}
              aria-expanded={panelOpen1}
              onclick={() =>
                (accordionPreview.panels["#collapseItinerary"] = panelOpen1
                  ? null
                  : "#collapseItinerary")}
            >
              <h6>About this item</h6>
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseItinerary"
              class={"collapse" + (panelOpen1 ? " show" : "")}
            >
              <div class="card card-body">
                <ul class="list-checked-green">
                  <li>8 Spoke Design w/ Milled Aluminum Accents.</li>
                  <li>RC Carbon Fiber Center Cap.</li>
                  <li>Single Piece Aluminum Construction.</li>
                  <li>Matte Black Coat w/ Machined Accents.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseQuestion"
              aria-controls="collapseQuestion"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen2 ? "" : " collapsed")}
              aria-expanded={panelOpen2}
              onclick={() =>
                (accordionPreview.panels["#collapseQuestion"] = panelOpen2
                  ? null
                  : "#collapseQuestion")}
            >
              <h6>Question &amp; Answers</h6>
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseQuestion"
              class={"collapse" + (panelOpen2 ? " show" : "")}
            >
              <div class="card card-body">
                <div class="list-questions">
                  <div class="item-question">
                    <div class="head-question">
                      <p class="text-md-bold neutral-1000"
                        >Is The High Roller suitable for all ages?</p
                      >
                    </div>
                    <div class="content-question">
                      <p class="text-sm-medium neutral-800"
                        >Absolutely! The High Roller offers a family-friendly
                        experience suitable for visitors of all ages. Children
                        must be accompanied by an adult.</p
                      >
                    </div>
                  </div>
                  <div class="item-question active">
                    <div class="head-question">
                      <p class="text-md-bold neutral-1000"
                        >Can I bring food or drinks aboard The High Roller?</p
                      >
                    </div>
                    <div class="content-question">
                      <p class="text-sm-medium neutral-800"
                        >Outside food and beverages are not permitted on The
                        High Roller. However, there are nearby dining options at
                        The LINQ Promenade where you can enjoy a meal before or
                        after your ride.</p
                      >
                    </div>
                  </div>
                  <div class="item-question">
                    <div class="head-question">
                      <p class="text-md-bold neutral-1000"
                        >Is The High Roller wheelchair accessible?</p
                      >
                    </div>
                    <div class="content-question">
                      <p class="text-sm-medium neutral-800"
                        >es, The High Roller cabins are wheelchair accessible,
                        making it possible for everyone to enjoy the
                        breathtaking views of Las Vegas.</p
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseReviews"
              aria-controls="collapseReviews"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen3 ? "" : " collapsed")}
              aria-expanded={panelOpen3}
              onclick={() =>
                (accordionPreview.panels["#collapseReviews"] = panelOpen3
                  ? null
                  : "#collapseReviews")}
            >
              <h6>Rate &amp; Reviews</h6>
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseReviews"
              class={"collapse" + (panelOpen3 ? " show" : "")}
            >
              <div class="card card-body">
                <div class="head-reviews">
                  <div class="review-left">
                    <div class="review-info-inner">
                      <h6 class="neutral-1000">4.95 / 5</h6>
                      <p class="text-sm-medium neutral-400">(672 reviews)</p>
                      <div class="review-rate"
                        ><img
                          src="/assets/imgs/page/tour-detail/star.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/page/tour-detail/star.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/page/tour-detail/star.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/page/tour-detail/star.svg"
                          alt="Carento"
                        /><img
                          src="/assets/imgs/page/tour-detail/star.svg"
                          alt="Carento"
                        /></div
                      >
                    </div>
                  </div>
                  <div class="review-right">
                    <div class="review-progress">
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Price</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-90"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>4.8/5</p>
                        </div>
                      </div>
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Service</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-90"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>4.2/5</p>
                        </div>
                      </div>
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Safety</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-95"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>4.9/5</p>
                        </div>
                      </div>
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Entertainment</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-85"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>4.7/5</p>
                        </div>
                      </div>
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Accessibility</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-100"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>5/5</p>
                        </div>
                      </div>
                      <div class="item-review-progress">
                        <div class="text-rv-progress">
                          <p class="text-sm-bold">Support</p>
                        </div>
                        <div class="bar-rv-progress">
                          <div class="progress">
                            <div class="progress-bar w-100"></div>
                          </div>
                        </div>
                        <div class="text-avarage">
                          <p>5/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list-reviews">
                  <div class="item-review">
                    <div class="head-review">
                      <div class="author-review">
                        <img
                          src="/assets/imgs/blog/blog-details/avatar-1.png"
                          alt="Carento"
                        />
                        <div class="author-info">
                          <p class="text-lg-bold">Sarah Johnson</p>
                          <p class="text-sm-medium neutral-500"
                            >December 4, 2024 at 3:12 pm</p
                          >
                        </div>
                      </div>
                      <div class="rate-review"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        /></div
                      >
                    </div>
                    <div class="content-review">
                      <p class="text-sm-medium neutral-800"
                        >We had a fantastic time on The High Roller. The views
                        were amazing, and the ride was very smooth. It's a great
                        way to see Las Vegas from a different perspective. The
                        staff were friendly and helpful. Definitely worth it!
                        The High Roller was one of the highlights of our Las
                        Vegas trip.</p
                      >
                    </div>
                  </div>
                  <div class="item-review">
                    <div class="head-review">
                      <div class="author-review">
                        <img
                          src="/assets/imgs/blog/blog-details/avatar-2.png"
                          alt="Carento"
                        />
                        <div class="author-info">
                          <p class="text-lg-bold">Michael Smith</p>
                          <p class="text-sm-medium neutral-500"
                            >December 4, 2024 at 3:12 pm</p
                          >
                        </div>
                      </div>
                      <div class="rate-review"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        /></div
                      >
                    </div>
                    <div class="content-review">
                      <p class="text-sm-medium neutral-800"
                        >Took my family on The High Roller, and we all loved it!
                        The kids were amazed by the views, and the adults
                        enjoyed the experience just as much. It's suitable for
                        all ages and definitely a highlight of our trip to
                        Vegas. Don't miss your chance to see Las Vegas from a
                        whole new perspective and create memories that will last
                        a lifetime!</p
                      >
                    </div>
                  </div>
                  <div class="item-review">
                    <div class="head-review">
                      <div class="author-review">
                        <img
                          src="/assets/imgs/blog/blog-details/avatar-3.png"
                          alt="Carento"
                        />
                        <div class="author-info">
                          <p class="text-lg-bold">Emily Williams</p>
                          <p class="text-sm-medium neutral-500"
                            >December 4, 2024 at 3:12 pm</p
                          >
                        </div>
                      </div>
                      <div class="rate-review"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        />
                        <img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-white.svg"
                          alt="Carento"
                        /></div
                      >
                    </div>
                    <div class="content-review">
                      <p class="text-sm-medium neutral-800"
                        >The views from The High Roller were absolutely
                        stunning! It's a fantastic way to see the Strip and the
                        surrounding area. The cabins are spacious and
                        comfortable, and the audio commentary adds an extra
                        layer of enjoyment. Highly recommend!</p
                      >
                    </div>
                  </div>
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
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAddReview"
              aria-controls="collapseAddReview"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen4 ? "" : " collapsed")}
              aria-expanded={panelOpen4}
              onclick={() =>
                (accordionPreview.panels["#collapseAddReview"] = panelOpen4
                  ? null
                  : "#collapseAddReview")}
            >
              <h6>Add a review</h6>
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseAddReview"
              class={"collapse" + (panelOpen4 ? " show" : "")}
            >
              <div class="card card-body">
                <div class="box-type-reviews">
                  <div class="row">
                    <div class="col-lg-4">
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Price</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Service</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Safety</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Entertainment</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Accessibility</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                      <div class="box-type-review">
                        <p class="text-sm-bold text-type-rv">Support</p>
                        <p class="rate-type-review"
                          ><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /><img
                            src="/assets/imgs/page/tour-detail/star-big.svg"
                            alt="Carento"
                          /></p
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="box-form-reviews">
                  <h6 class="text-md-bold neutral-1000 mb-15">Leave feedback</h6
                  >
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Your name"
                          aria-label="Your name"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input
                          class="form-control"
                          type="text"
                          placeholder="Email address"
                          aria-label="Email address"
                        />
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <textarea
                          class="form-control"
                          placeholder="Your comment"
                          aria-label="Your comment"
                        ></textarea>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <buttuon class="btn btn-primary">
                        Submit review
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
                      </buttuon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sidebar-left border-1 background-card">
          <h6 class="text-xl-bold neutral-1000">Listed by</h6>
          <div class="box-sidebar-content">
            <div class="box-agent-support border-bottom pb-3 mb-3">
              <div class="card-author">
                <div class="me-2"
                  ><img
                    src="/assets/imgs/template/icons/car-1.png"
                    alt="Carento"
                  /></div
                >
                <div class="card-author-info">
                  <p class="text-lg-bold neutral-1000">Emily Rose</p>
                  <p class="text-sm-medium neutral-500">Las Vegas, USA</p>
                </div>
              </div>
            </div>
            <div class="box-info-contact">
              <p class="text-md-medium mobile-phone neutral-1000"
                ><span class="text-md-bold">Mobile:</span> 1-222-333-4444</p
              >
              <p class="text-md-medium email neutral-1000"
                ><span class="text-md-bold">Email:</span> emily-rose@gmail.com</p
              >
              <p class="text-md-medium whatsapp neutral-1000"
                ><span class="text-md-bold">WhatsApp:</span> 1-222-333-4444</p
              >
              <p class="text-md-medium fax neutral-1000"
                ><span class="text-md-bold">Fax:</span> 1-222-333-4444</p
              >
            </div>
            <div class="box-link-bottom">
              <a
                class="btn btn-primary py-3 w-100 rounded-3"
                href="#!"
                aria-label="All items by this dealer"
              >
                All items by this dealer
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
        <div class="sidebar-banner">
          <div class="p-4 background-body border rounded-3">
            <p class="text-xl-bold neutral-1000 mb-4">Related Products</p>
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 border rounded-3 overflow-hidden">
                <a href="#!" aria-label="View details">
                  <img
                    src="/assets/imgs/shop/shop-details/other-item1.png"
                    alt="Carento"
                  />
                </a>
              </div>
              <div class="position-relative">
                <a
                  href="#!"
                  class="text-md-bold neutral-1000"
                  aria-label="R1 Concepts® – eLINE Series Plain Brake Rotors"
                  >R1 Concepts® – eLINE Series Plain Brake Rotors</a
                >
                <p class="text-md-bold text-success">$20.00</p>
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 border rounded-3 overflow-hidden">
                <a href="#!" aria-label="View details">
                  <img
                    src="/assets/imgs/shop/shop-details/other-item2.png"
                    alt="Carento"
                  />
                </a>
              </div>
              <div class="position-relative">
                <a
                  href="#!"
                  class="text-md-bold neutral-1000"
                  aria-label="PIRELLI TIRES® – P4 FOUR SEASONS PLUS"
                  >PIRELLI TIRES® – P4 FOUR SEASONS PLUS</a
                >
                <p class="text-md-bold text-success">$160.00</p>
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 border rounded-3 overflow-hidden">
                <a href="#!" aria-label="View details">
                  <img
                    src="/assets/imgs/shop/shop-details/other-item3.png"
                    alt="Carento"
                  />
                </a>
              </div>
              <div class="position-relative">
                <a
                  href="#!"
                  class="text-md-bold neutral-1000"
                  aria-label="Mobil 1 Extended Performance Full Synthetic Motor Oil"
                  >Mobil 1 Extended Performance Full Synthetic Motor Oil</a
                >
                <p class="text-md-bold text-success">$33.00</p>
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 border rounded-3 overflow-hidden">
                <a href="#!" aria-label="View details">
                  <img
                    src="/assets/imgs/shop/shop-details/other-item4.png"
                    alt="Carento"
                  />
                </a>
              </div>
              <div class="position-relative">
                <a
                  href="#!"
                  class="text-md-bold neutral-1000"
                  aria-label="HRE FlowForm® – FT01 Tarma Honda 2024"
                  >HRE FlowForm® – FT01 Tarma Honda 2024</a
                >
                <p class="text-md-bold text-success">$250.00</p>
              </div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="me-3 border rounded-3 overflow-hidden">
                <a href="#!" aria-label="View details">
                  <img
                    src="/assets/imgs/shop/shop-details/other-item5.png"
                    alt="Carento"
                  />
                </a>
              </div>
              <div class="position-relative">
                <a
                  href="#!"
                  class="text-md-bold neutral-1000"
                  aria-label="Mobil Delvac 1300 Super Heavy Duty Synthetic"
                  >Mobil Delvac 1300 Super Heavy Duty Synthetic</a
                >
                <p class="text-md-bold text-success">$44.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="background-100 pt-55 pb-55 mt-100">
    <div class="container">
      <div
        class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
      >
        <ul class="carouselTicker__list">
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/jaguar.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/jaguar-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
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
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/chevrolet.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/chevrolet-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/acura.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/acura-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bmw.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bmw-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/toyota.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/toyota-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt="Carento"
              />
            </div>
          </li>
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt="Carento"
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt="Carento"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
