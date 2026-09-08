<svelte:options runes={true} />

    
    <div class="preloader">
      <div class="loader-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    

    
    <header class="header">
      
      <div class="main-navigation">
        <nav class="navbar navbar-expand-lg">
          <div class="container position-relative">
            <a class="navbar-brand" href="/index.html" aria-label="Day &amp; Night home">
              <img src="/daynight/day-night-logo.png" alt="logo">
            </a>
            <div class="mobile-menu-right">
              <div class="mobile-menu-btn">
                <button type="button" class="nav-right-link search-box-outer" aria-label="Search"><i class="far fa-search"></i></button>
              </div>
              <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar">
              <div class="offcanvas-header">
                <a href="/index.html" class="offcanvas-brand" id="offcanvasNavbarLabel" aria-label="Day &amp; Night home">
                  <img src="/daynight/day-night-logo.png" alt="">
                </a>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i class="far fa-xmark"></i>
                </button>
              </div>
              <div class="offcanvas-body gap-xl-4">
                <ul class="navbar-nav justify-content-end flex-grow-1">
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle active" href="#top" data-bs-toggle="dropdown">Home</a>
                    <ul class="dropdown-menu fade-down">
                      <li><a class="dropdown-item" href="/index.html">Home Demo 01</a></li>
                      <li><a class="dropdown-item" href="/index-2.html">Home Demo 02</a></li>
                      <li><a class="dropdown-item" href="/index-3.html">Home Demo 03</a></li>
                      <li><a class="dropdown-item" href="/index-4.html">Home Demo 04</a></li>
                      <li><a class="dropdown-item" href="/index-5.html">Home Demo 05</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#top" data-bs-toggle="dropdown">Cars</a>
                    <ul class="dropdown-menu fade-down">
                      <li><a class="dropdown-item" href="/car.html">Cars One</a></li>
                      <li><a class="dropdown-item" href="/car-2.html">Cars Two</a></li>
                      <li><a class="dropdown-item" href="/car-single.html">Car Single</a></li>
                      <li><a class="dropdown-item" href="/car-type.html">Car Type</a></li>
                      <li><a class="dropdown-item" href="/car-brand.html">Car Brands</a></li>
                      <li><a class="dropdown-item" href="/car-booking.html">Car Booking</a></li>
                      <li><a class="dropdown-item" href="/car-checkout.html">Car Checkout</a></li>
                      <li><a class="dropdown-item" href="/car-booking-confirm.html">Booking Confirm</a></li>
                    </ul>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#top" data-bs-toggle="dropdown">Pages</a>
                    <ul class="dropdown-menu fade-down">
                      <li><a class="dropdown-item" href="/about.html">About Us</a></li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#top">My Account</a>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="/dashboard.html">Dashboard</a></li>
                          <li><a class="dropdown-item" href="/profile.html">My Profile</a></li>
                          <li><a class="dropdown-item" href="/profile-booking.html">My Booking</a></li>
                          <li><a class="dropdown-item" href="/profile-cancel-booking.html">Cancel Booking</a></li>
                          <li><a class="dropdown-item" href="/profile-wishlist.html">My Wishlist</a></li>
                          <li><a class="dropdown-item" href="/profile-payment.html">Payment History</a></li>
                          <li><a class="dropdown-item" href="/profile-setting.html">Settings</a></li>
                        </ul>
                      </li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#top">Authentication</a>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="/login.html">Login</a></li>
                          <li><a class="dropdown-item" href="/register.html">Register</a></li>
                          <li><a class="dropdown-item" href="/forgot-password.html">Forgot Password</a></li>
                        </ul>
                      </li>
                      <li><a class="dropdown-item" href="/team.html">Our Team</a></li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#top">Drivers</a>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="/driver.html">Drivers</a></li>
                          <li><a class="dropdown-item" href="/driver-single.html">Driver Single</a></li>
                        </ul>
                      </li>
                      <li class="dropdown-submenu">
                        <a class="dropdown-item dropdown-toggle" href="#top">Extra Pages</a>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="/coming-soon.html">Coming Soon</a></li>
                          <li><a class="dropdown-item" href="/booking-cancel-policy.html">Booking Cancel Policy</a></li>
                          <li><a class="dropdown-item" href="/terms.html">Terms Of Service</a></li>
                          <li><a class="dropdown-item" href="/privacy.html">Privacy Policy</a></li>
                          <li><a class="dropdown-item" href="/mail-success.html">Mail Success</a></li>
                        </ul>
                      </li>
                      <li><a class="dropdown-item" href="/book-ride.html">Book A Ride</a></li>
                      <li><a class="dropdown-item" href="/car-rate.html">Our Car Rate</a></li>
                      <li><a class="dropdown-item" href="/gallery.html">Gallery</a></li>
                      <li><a class="dropdown-item" href="/help.html">Help Center</a></li>
                      <li><a class="dropdown-item" href="/faq.html">Faq's</a></li>
                      <li><a class="dropdown-item" href="/testimonial.html">Testimonials</a></li>
                      <li><a class="dropdown-item" href="/404.html">404 Error</a></li>
                    </ul>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#top" data-bs-toggle="dropdown">Services</a>
                    <ul class="dropdown-menu fade-down">
                      <li><a class="dropdown-item" href="/service.html">Services One</a></li>
                      <li><a class="dropdown-item" href="/service-2.html">Services Two</a></li>
                      <li><a class="dropdown-item" href="/service-single.html">Service Single</a></li>
                    </ul>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#top" data-bs-toggle="dropdown">Blog</a>
                    <ul class="dropdown-menu fade-down">
                      <li><a class="dropdown-item" href="/blog.html">Blog</a></li>
                      <li><a class="dropdown-item" href="/blog-single.html">Blog Single</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a class="nav-link" href="/contact.html">Contact</a></li>
                </ul>
                
                <div class="nav-right">
                  <div class="search-btn">
                    <button type="button" class="nav-right-link search-box-outer" aria-label="Search"><i class="far fa-search"></i></button>
                  </div>
                  <div class="nav-btn">
                    <a href="/book-ride.html" class="theme-btn"><span class="far fa-car"></span> Book A Car</a>
                  </div>
                  <button type="button" class="sidebar-btn nav-right-link" data-bs-toggle="offcanvas" data-bs-target="#sidebarPopup" aria-label="sidebar btn nav right link">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
    </header>
    

    
    <div class="search-popup">
      <button class="close-search" type="button" aria-label="close search"><span class="far fa-times"></span></button>
      <form action="#">
        <div class="form-group">
          <input type="search" name="search-field" class="form-control" placeholder="Search Here..." required="" aria-label="Search Here...">
          <button type="submit" aria-label="Search"><i class="far fa-search"></i></button>
        </div>
      </form>
    </div>
    

    
    <div class="sidebar-popup offcanvas offcanvas-end" tabindex="-1" id="sidebarPopup">
      <div class="offcanvas-header">
        <a href="/index.html" class="sidebar-popup-logo" aria-label="Day &amp; Night home">
          <img src="/daynight/day-night-logo.png" alt="">
        </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
          <i class="far fa-xmark"></i>
        </button>
      </div>
      <div class="sidebar-popup-wrap offcanvas-body">
        <div class="sidebar-popup-content">
          <div class="sidebar-popup-about">
            <h4>About Us</h4>
            <p>
              There are many variations of passages available sure there majority have suffered alteration in some form by inject humour or
              randomised words which don't look even slightly believable.
            </p>
          </div>
          <div class="sidebar-popup-contact">
            <h4>Contact Info</h4>
            <ul>
              <li>
                <div class="icon">
                  <i class="far fa-envelope"></i>
                </div>
                <div class="content">
                  <h5>Email</h5>
                  <a href="mailto:info@example.com">info@example.com</a>
                </div>
              </li>
              <li>
                <div class="icon">
                  <i class="far fa-phone"></i>
                </div>
                <div class="content">
                  <h5>Phone</h5>
                  <a href="tel:+359877733110">0877 733 110</a>
                </div>
              </li>
              <li>
                <div class="icon">
                  <i class="far fa-location-dot"></i>
                </div>
                <div class="content">
                  <h5>Address</h5>
                  <a href="#top">25/B Milford Road, New York</a>
                </div>
              </li>
            </ul>
          </div>
          <div class="sidebar-popup-social">
            <h4>Follow Us</h4>
            <a href="#top" aria-label="facebook"><i class="fab fa-facebook"></i></a>
            <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
            <a href="#top" aria-label="instagram"><i class="fab fa-instagram"></i></a>
            <a href="#top" aria-label="linkedin"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </div>
    

    <main class="main">
      
      <div class="hero-section hs-3">
        <div class="hero-single" style="background-image: url(/assets/img/shape/04.png)">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-12 col-lg-8 mx-auto">
                <div class="hero-content text-center">
                  <h3 class="hero-title">
                    Изберете своя <span>модел</span>
                  </h3>
                  <p>
                    There are many variations of passages available the majority have suffered alteration in some form Internet tend to
                    repeat injected humour words look even slightly believable.
                  </p>
                </div>
              </div>
            </div>
            <div class="booking-form pt-20 pb-50">
              <div class="container px-0">
                <div class="booking-form-wrap">
                  <div class="shape"></div>
                  <h4 class="title">Book Your Ride</h4>
                  <form action="#">
                    <div class="row g-3">
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-location-dot"></i>
                            <select class="select" name="pu-location" data-slim-search="true" aria-label="Pick Up Location">
                              <option value="">Pick Up Location</option>
                              <option value="1">Broadway, New York</option>
                              <option value="2">Brooklyn, New York</option>
                              <option value="3">Cooper Square, New York</option>
                              <option value="4">Metrotech Center, New York</option>
                              <option value="5">East 10th Street, New York</option>
                              <option value="6">Washington Pl, New York</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-calendar-range"></i>
                            <input type="text" class="form-control date-picker" data-datetime="true" name="pu-date" placeholder="Pick Up Date &amp; Time" aria-label="Pick Up Date &amp; Time">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-location-dot"></i>
                            <select class="select" data-slim-search="true" name="do-location" aria-label="Drop Off Location">
                              <option value="">Drop Off Location</option>
                              <option value="1">Broadway, New York</option>
                              <option value="2">Brooklyn, New York</option>
                              <option value="3">Cooper Square, New York</option>
                              <option value="4">Metrotech Center, New York</option>
                              <option value="5">East 10th Street, New York</option>
                              <option value="6">Washington Pl, New York</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-calendar-range"></i>
                            <input type="text" class="form-control date-picker" data-datetime="true" name="do-date" placeholder="Drop Off Date &amp; Time" aria-label="Drop Off Date &amp; Time">
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-circle-half-stroke"></i>
                            <select class="select" data-slim-search="true" name="brands" aria-label="Car Brands">
                              <option value="">Car Brands</option>
                              <option value="1">BMW</option>
                              <option value="2">Toyota</option>
                              <option value="3">Honda</option>
                              <option value="4">Ford</option>
                              <option value="5">Volkswagen</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-3">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-car"></i>
                            <select class="select" data-slim-search="true" name="car-model" aria-label="Choose Car Model">
                              <option value="">Choose Car Model</option>
                              <option value="1">All Model</option>
                              <option value="2">BMW SUV M8, 2025</option>
                              <option value="2">Toyota SUV RAV4, 2025</option>
                              <option value="3">Honda CR-V, 2024</option>
                              <option value="4">Ford F-150, 2025</option>
                              <option value="5">Volkswagen VW, 2025</option>
                              <option value="6">Hyundai SUV Creta, 2024</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-2">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-user-tie-hair"></i>
                            <select class="select" name="passenger" aria-label="Traveler">
                              <option value="">Traveler</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-2">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-user-pilot"></i>
                            <select class="select" name="driver-age" aria-label="Driver Age">
                              <option value="">Driver Age</option>
                              <option value="1">Any Age</option>
                              <option value="2">25-30</option>
                              <option value="3">30-35</option>
                              <option value="4">35-40</option>
                              <option value="5">40-45</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-2">
                        <button class="theme-btn" type="submit">Book Car<i class="fas fa-arrow-right"></i></button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="hero-img">
              <img src="/assets/img/hero/02.png" alt="">
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="feature-area pt-120">
        <div class="container">
          <div class="feature-wrap">
            <div class="row g-4">
              <div class="col-md-6 col-lg-4">
                <div class="feature-item wow fadeInUp" data-wow-delay=".2s">
                  <div class="feature-content">
                    <span class="count">01</span>
                    <div class="feature-icon">
                      <img src="/assets/img/icon/car-book.svg" alt="">
                    </div>
                    <div class="feature-info">
                      <h4>More Easy Booking Process</h4>
                      <p>It is long established fact that reader will be distracted by the readable content layout.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="feature-item wow fadeInUp" data-wow-delay=".4s">
                  <div class="feature-content">
                    <span class="count">02</span>
                    <div class="feature-icon">
                      <img src="/assets/img/icon/choose-car.svg" alt="">
                    </div>
                    <div class="feature-info">
                      <h4>Wide Selection Of Top Quality Cars</h4>
                      <p>It is long established fact that reader will be distracted by the readable content layout.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="feature-item wow fadeInUp" data-wow-delay=".6s">
                  <div class="feature-content">
                    <span class="count">03</span>
                    <div class="feature-icon">
                      <img src="/assets/img/icon/support.svg" alt="">
                    </div>
                    <div class="feature-info">
                      <h4>24/7 Online Customers Support</h4>
                      <p>It is long established fact that reader will be distracted by the readable content layout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="brand-area pt-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i>Car Brands</span>
                <h3 class="site-title">Most popular <span>brands</span></h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="brand-slider owl-carousel wow fadeInUp" data-wow-delay=".2s">
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/01.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Toyota</h4>
                <span>69 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/02.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Ferrari</h4>
                <span>20 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/03.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Hyundai</h4>
                <span>80 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/04.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Mercedes Benz</h4>
                <span>46 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/05.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>BMW</h4>
                <span>29 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/06.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Nissan</h4>
                <span>15 Cars</span>
              </div>
            </a>
            <a href="/car.html" class="brand-item">
              <div class="brand-img">
                <img src="/assets/img/brand/03.png" alt="thumb">
              </div>
              <div class="brand-content">
                <h4>Honda</h4>
                <span>35 Cars</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      

      
      <div class="about-area py-120">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="about-left wow fadeInLeft" data-wow-delay=".2s">
                <div class="shape wow fadeInRight" data-wow-delay=".2s"></div>
                <div class="about-img">
                  <div class="row g-3">
                    <div class="col-6">
                      <div class="img-1 mb-3">
                        <img src="/daynight/day-night-about-showroom-v1-light.webp" alt="">
                      </div>
                      <div class="img-3">
                        <img src="/daynight/day-night-studio-keys-v1.webp" alt="">
                      </div>
                    </div>
                    <div class="col-6 align-self-center">
                      <div class="img-2">
                        <img src="/daynight/day-night-showroom-color-v1.webp" alt="">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="about-experience">
                  <h4>30<span>+</span></h4>
                  <p>Years Of Experience</p>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="about-right wow fadeInUp" data-wow-delay=".2s">
                <div class="site-heading mb-3">
                  <span class="site-title-tagline"><i class="far fa-car"></i> About Us</span>
                  <h3 class="site-title">We Provide <span>Quality Car Rental</span> Services</h3>
                </div>
                <p class="about-text">
                  There are many variations of passages available but the majority have suffered alteration in some form by injected humour
                  randomised words which don't look even slightly believable. If you are going to use passage.
                </p>
                <div class="about-content">
                  <div class="row g-3">
                    <div class="col-md-7">
                      <div class="about-item">
                        <div class="icon">
                          <img src="/assets/img/icon/money.svg" alt="">
                        </div>
                        <div class="content">
                          <h4>Affordable Car Rate</h4>
                          <p>It is a long established fact that reader will to using content.</p>
                        </div>
                      </div>
                      <div class="about-item">
                        <div class="icon">
                          <img src="/assets/img/icon/driver.svg" alt="">
                        </div>
                        <div class="content">
                          <h4>Personal Driver</h4>
                          <p>It is a long established fact that reader will to using content.</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <ul class="about-list">
                        <li><img src="/assets/img/icon/check.svg" alt="">Comfort</li>
                        <li><img src="/assets/img/icon/check.svg" alt="">Automatic</li>
                        <li><img src="/assets/img/icon/check.svg" alt="">Remote</li>
                        <li><img src="/assets/img/icon/check.svg" alt="">Hybrid</li>
                        <li><img src="/assets/img/icon/check.svg" alt="">Wireless</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <a href="/about.html" class="theme-btn">Discover More<i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="car-type-area bg pt-70 pb-80">
        <div class="container">
          <div class="row">
            <div class="col-6 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Car Type</span>
                <h3 class="site-title">Let's check <span>car type</span></h3>
              </div>
            </div>
          </div>
          <div class="cartype-slider owl-carousel wow fadeInUp" data-wow-delay=".2s">
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/01.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Sedan</h4>
                    <p>120 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/02.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Compact</h4>
                    <p>30 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/03.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Convertible</h4>
                    <p>40 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/04.png" alt="">
                  </div>
                  <div class="info">
                    <h4>SUV</h4>
                    <p>50 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/05.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Crossover</h4>
                    <p>29 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/06.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Wagon</h4>
                    <p>17 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/07.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Sports</h4>
                    <p>80 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/08.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Pickup</h4>
                    <p>60 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/09.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Family MPV</h4>
                    <p>75 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/10.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Coupe</h4>
                    <p>149 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/11.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Electric</h4>
                    <p>36 Cars</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="item">
              <a href="/car.html" class="car-type-item">
                <div class="content">
                  <div class="icon">
                    <img src="/assets/img/car-type/12.png" alt="">
                  </div>
                  <div class="info">
                    <h4>Luxury</h4>
                    <p>20 Cars</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="service-area py-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Our Services</span>
                <h3 class="site-title">Let's check our <span>services</span></h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".2s">
                <span class="count">01</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/car.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Car Rent With Driver</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/01.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".4s">
                <span class="count">02</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/car-business.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Business Car Rental</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/02.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".6s">
                <span class="count">03</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/luxuary-car.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Luxury Car Rental</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/03.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".2s">
                <span class="count">04</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/private-car.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Private Car Rental</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/04.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".4s">
                <span class="count">05</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/airport-car.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Airport Transfer</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/05.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="service-item wow fadeInUp" data-wow-delay=".4s">
                <span class="count">06</span>
                <div class="service-icon">
                  <img src="/assets/img/icon/wedding-car.svg" alt="">
                </div>
                <div class="service-content">
                  <h4><a href="/service-single.html">Wedding Ceremony</a></h4>
                  <p>
                    It is long established fact that reader will distract majority have suffered alteration the readable content layout.
                  </p>
                  <a href="/service-single.html" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-img">
                  <img src="/assets/img/service/06.jpg" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="video-area">
        <div class="video-content" style="background-image: url(/assets/img/video/01.jpg)">
          <div class="video-wrap">
            <a class="play-btn popup-youtube" href="https://www.youtube.com/watch?v=jLS3DrTJrpI" aria-label="Play video">
              <i class="fas fa-play"></i>
            </a>
          </div>
        </div>
      </div>
      

      
      <div class="counter-area ng-mt">
        <div class="container">
          <div class="counter-wrap">
            <div class="row g-4">
              <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="counter-box">
                  <div class="icon">
                    <img src="/assets/img/icon/car-rent-2.svg" alt="">
                  </div>
                  <div class="content">
                    <div class="info">
                      <span class="counter" data-count="+" data-to="150" data-speed="3000">150</span>
                      <span class="unit">k</span>
                    </div>
                    <h4 class="title">Available Cars</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="counter-box">
                  <div class="icon">
                    <img src="/assets/img/icon/happy.svg" alt="">
                  </div>
                  <div class="content">
                    <div class="info">
                      <span class="counter" data-count="+" data-to="115" data-speed="3000">115</span>
                      <span class="unit">k</span>
                    </div>
                    <h4 class="title">Happy Clients</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="counter-box">
                  <div class="icon">
                    <img src="/assets/img/icon/driver.svg" alt="">
                  </div>
                  <div class="content">
                    <div class="info">
                      <span class="counter" data-count="+" data-to="50" data-speed="3000">50</span>
                      <span class="unit">k</span>
                    </div>
                    <h4 class="title">Experts Drivers</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="counter-box">
                  <div class="icon">
                    <img src="/assets/img/icon/car-checklist.svg" alt="">
                  </div>
                  <div class="content">
                    <div class="info">
                      <span class="counter" data-count="+" data-to="120" data-speed="3000">120</span>
                      <span class="unit">k</span>
                    </div>
                    <h4 class="title">Road Trip Done</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="car-rate py-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Car Rate</span>
                <h3 class="site-title">We Provide <span>Best Car Rate</span> For You</h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="row g-4 g-xl-5">
            <div class="col-md-6 col-lg-4">
              <div class="rate-item wow fadeInUp" data-wow-delay=".2s">
                <div class="rate-img">
                  <img src="/assets/img/rate/01.png" alt="">
                </div>
                <div class="rate-header">
                  <h4>Basic Pakage</h4>
                  <p>One Time Payment</p>
                </div>
                <div class="rate-content">
                  <div class="rate-icon">
                    <img src="/assets/img/icon/car-tag.svg" alt="">
                  </div>
                  <div class="rate-feature">
                    <ul>
                      <li><i class="far fa-check-double"></i> Time Duration: <span>10 Days</span></li>
                      <li><i class="far fa-check-double"></i> Base Charge: <span>$2.30</span></li>
                      <li><i class="far fa-check-double"></i> Distance Allowance: <span>5000m</span></li>
                      <li><i class="far fa-check-double"></i> Up To 50 kms: <span>$1.38/km</span></li>
                      <li><i class="far fa-check-double"></i> Booking Fee: <span>$0.99</span></li>
                    </ul>
                  </div>
                  <div class="rate-btn">
                    <a href="/car-rate.html" class="theme-btn2">Choose Plan <i class="fas fa-arrow-right"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="rate-item wow fadeInUp" data-wow-delay=".4s">
                <div class="rate-img">
                  <img src="/assets/img/rate/01.png" alt="">
                </div>
                <div class="rate-header">
                  <h4>Standard Pakage</h4>
                  <p>One Time Payment</p>
                </div>
                <div class="rate-content">
                  <div class="rate-icon">
                    <img src="/assets/img/icon/car-tag.svg" alt="">
                  </div>
                  <div class="rate-feature">
                    <ul>
                      <li><i class="far fa-check-double"></i> Time Duration: <span>20 Days</span></li>
                      <li><i class="far fa-check-double"></i> Base Charge: <span>$2.30</span></li>
                      <li><i class="far fa-check-double"></i> Distance Allowance: <span>5000m</span></li>
                      <li><i class="far fa-check-double"></i> Up To 50 kms: <span>$1.38/km</span></li>
                      <li><i class="far fa-check-double"></i> Booking Fee: <span>$0.99</span></li>
                    </ul>
                  </div>
                  <div class="rate-btn">
                    <a href="/car-rate.html" class="theme-btn2">Choose Plan <i class="fas fa-arrow-right"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="rate-item wow fadeInUp" data-wow-delay=".6s">
                <div class="rate-img">
                  <img src="/assets/img/rate/01.png" alt="">
                </div>
                <div class="rate-header">
                  <h4>Premium Pakage</h4>
                  <p>One Time Payment</p>
                </div>
                <div class="rate-content">
                  <div class="rate-icon">
                    <img src="/assets/img/icon/car-tag.svg" alt="">
                  </div>
                  <div class="rate-feature">
                    <ul>
                      <li><i class="far fa-check-double"></i> Time Duration: <span>30 Days</span></li>
                      <li><i class="far fa-check-double"></i> Base Charge: <span>$2.30</span></li>
                      <li><i class="far fa-check-double"></i> Distance Allowance: <span>5000m</span></li>
                      <li><i class="far fa-check-double"></i> Up To 50 kms: <span>$1.38/km</span></li>
                      <li><i class="far fa-check-double"></i> Booking Fee: <span>$0.99</span></li>
                    </ul>
                  </div>
                  <div class="rate-btn">
                    <a href="/car-rate.html" class="theme-btn2">Choose Plan <i class="fas fa-arrow-right"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="car-area car-bg pb-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Our Cars</span>
                <h3 class="site-title">Let's check our <span>cars</span></h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="car-slider owl-carousel wow fadeInUp" data-wow-delay=".2s">
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Sedan</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/01.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sedan rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Sports</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/02.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">SUV</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/03.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Compact</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/04.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Pickup</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/05.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Coupe</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/06.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Electric</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/07.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="car-item">
                <div class="car-top">
                  <span class="type">Luxury</span>
                  <a href="#top" class="favorite-btn" aria-label="Add to wishlist"><i class="far fa-heart"></i></a>
                </div>
                <div class="car-img">
                  <img src="/assets/img/car/08.png" alt="">
                </div>
                <div class="car-content">
                  <h4><a href="/car-single.html">Toyota sub rav4</a></h4>
                  <div class="car-rate">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>5.0 (58.5k Review)</span>
                  </div>
                  <ul class="info-list">
                    <li><i class="far fa-steering-wheel"></i>Automatic</li>
                    <li><i class="far fa-user-tie"></i>4 Traveler</li>
                    <li><i class="far fa-car"></i>Model: 2025</li>
                    <li><i class="far fa-gas-pump"></i>Hybrid</li>
                    <li><i class="far fa-road"></i>10.15km / 1-litre</li>
                  </ul>
                </div>
                <div class="car-bottom">
                  <span class="car-price">$80 <sub>/day</sub></span>
                  <a href="#top" class="theme-btn">Details<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="choose-area choose-bg py-80">
        <div class="text-shape">rental</div>
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-6">
              <div class="choose-content">
                <div class="col-7 col-md-8 col-lg-12">
                  <div class="site-heading mb-0 wow fadeInUp" data-wow-delay=".2s">
                    <span class="site-title-tagline"><i class="far fa-car"></i> Why Choose Us</span>
                    <h3 class="site-title">We deliver <span>expertise you</span> can trust</h3>
                    <p>
                      It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
                      layout.
                    </p>
                  </div>
                </div>
                <div class="choose-content-wrap">
                  <div class="choose-item wow fadeInUp" data-wow-delay=".2s">
                    <div class="icon">
                      <img src="/assets/img/icon/money.svg" alt="">
                    </div>
                    <div class="info">
                      <h4>Best Price Guaranteed</h4>
                      <p>There are many variations of have suffered alteration some layout by words look even slightly injected humour.</p>
                    </div>
                  </div>
                  <div class="choose-item wow fadeInUp" data-wow-delay=".3s">
                    <div class="icon">
                      <img src="/assets/img/icon/car-time.svg" alt="">
                    </div>
                    <div class="info">
                      <h4>24 Hour Car Delivery</h4>
                      <p>There are many variations of have suffered alteration some layout by words look even slightly injected humour.</p>
                    </div>
                  </div>
                  <div class="choose-item wow fadeInUp" data-wow-delay=".4s">
                    <div class="icon">
                      <img src="/assets/img/icon/driver.svg" alt="">
                    </div>
                    <div class="info">
                      <h4>Experience Drivers</h4>
                      <p>There are many variations of have suffered alteration some layout by words look even slightly injected humour.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="choose-img">
                <img src="/assets/img/choose/01.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="car-city pt-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Cars By City</span>
                <h3 class="site-title">Explore our <span>car by</span> city</h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="city-slider owl-carousel wow fadeInUp" data-wow-delay=".2s">
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/01.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <div class="info">
                  <h4><a href="#top">New York City</a></h4>
                  <span>39 Cars Available</span>
                </div>
              </div>
            </div>
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/02.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <div class="info">
                  <h4><a href="#top">Los Angeles City</a></h4>
                  <span>83 Cars Available</span>
                </div>
              </div>
            </div>
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/03.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <div class="info">
                  <h4><a href="#top">San Antonio City</a></h4>
                  <span>69 Cars Available</span>
                </div>
              </div>
            </div>
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/04.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <h4><a href="#top">Houston City</a></h4>
                <span>40 Cars Available</span>
              </div>
            </div>
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/05.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <h4><a href="#top">Chicago City</a></h4>
                <span>15 Cars Available</span>
              </div>
            </div>
            <div class="city-item">
              <div class="city-img">
                <img src="/assets/img/city/06.jpg" alt="">
                <a href="/car.html" class="theme-btn2">Explore <i class="fas fa-arrow-right"></i></a>
              </div>
              <div class="city-content">
                <h4><a href="#top">Denver City</a></h4>
                <span>36 Cars Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="car-destination py-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Destination</span>
                <h3 class="site-title">Explore our popular <span>destination</span></h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".1s">
                <div class="content">
                  <span class="from-city">New York</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Los Angeles</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".2s">
                <div class="content">
                  <span class="from-city">New York</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">San Antonio</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".3s">
                <div class="content">
                  <span class="from-city">New York</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Seattle</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".1s">
                <div class="content">
                  <span class="from-city">New York</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Phoenix</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".2s">
                <div class="content">
                  <span class="from-city">New York</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Chicago</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".3s">
                <div class="content">
                  <span class="from-city">Los Angeles</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Phoenix</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".1s">
                <div class="content">
                  <span class="from-city">Chicago</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">New York</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".2s">
                <div class="content">
                  <span class="from-city">Los Angeles</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Seattle</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="destination-item wow fadeInUp" data-wow-delay=".3s">
                <div class="content">
                  <span class="from-city">Houston</span>
                  <i class="fas fa-long-arrow-right"></i>
                  <span class="to-city">Denver</span>
                </div>
                <a href="/car.html" class="theme-btn" aria-label="arrow right"><i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="testimonial-area ts-bg py-100">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Testimonials</span>
                <h3 class="site-title">What Our Client <span>Say's About Us</span></h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="testimonial-slider owl-carousel owl-theme wow fadeInUp" data-wow-delay=".25s">
            <div class="testimonial-item">
              <div class="content">
                <div class="icon">
                  <img src="/assets/img/icon/quote.svg" alt="">
                </div>
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <div class="quote">
                  <p>
                    There are many variations of passage available the majority have suffered of alteration of the some humour words look
                    even slightly form by the injected to default model believable.
                  </p>
                </div>
                <div class="author">
                  <div class="author-img">
                    <img src="/assets/img/testimonial/01.jpg" alt="">
                  </div>
                  <div class="author-info">
                    <h4>Niesha Phips</h4>
                    <p>Customer</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="content">
                <div class="icon">
                  <img src="/assets/img/icon/quote.svg" alt="">
                </div>
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <div class="quote">
                  <p>
                    There are many variations of passage available the majority have suffered of alteration of the some humour words look
                    even slightly form by the injected to default model believable.
                  </p>
                </div>
                <div class="author">
                  <div class="author-img">
                    <img src="/assets/img/testimonial/02.jpg" alt="">
                  </div>
                  <div class="author-info">
                    <h4>Eugene Ivan</h4>
                    <p>Customer</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="content">
                <div class="icon">
                  <img src="/assets/img/icon/quote.svg" alt="">
                </div>
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <div class="quote">
                  <p>
                    There are many variations of passage available the majority have suffered of alteration of the some humour words look
                    even slightly form by the injected to default model believable.
                  </p>
                </div>
                <div class="author">
                  <div class="author-img">
                    <img src="/assets/img/testimonial/03.jpg" alt="">
                  </div>
                  <div class="author-info">
                    <h4>Martha Brown</h4>
                    <p>Customer</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="content">
                <div class="icon">
                  <img src="/assets/img/icon/quote.svg" alt="">
                </div>
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <div class="quote">
                  <p>
                    There are many variations of passage available the majority have suffered of alteration of the some humour words look
                    even slightly form by the injected to default model believable.
                  </p>
                </div>
                <div class="author">
                  <div class="author-img">
                    <img src="/assets/img/testimonial/04.jpg" alt="">
                  </div>
                  <div class="author-info">
                    <h4>Robert Dese</h4>
                    <p>Customer</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="content">
                <div class="icon">
                  <img src="/assets/img/icon/quote.svg" alt="">
                </div>
                <div class="rating">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <div class="quote">
                  <p>
                    There are many variations of passage available the majority have suffered of alteration of the some humour words look
                    even slightly form by the injected to default model believable.
                  </p>
                </div>
                <div class="author">
                  <div class="author-img">
                    <img src="/assets/img/testimonial/05.jpg" alt="">
                  </div>
                  <div class="author-info">
                    <h4>Buchan Conie</h4>
                    <p>Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="team-area py-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Our Drivers</span>
                <h3 class="site-title">Meet With <span>Our Expert</span> Drivers</h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="row g-4 g-lg-5">
            <div class="col-md-6 col-lg-3">
              <div class="team-item wow fadeInUp" data-wow-delay=".2s">
                <div class="team-img">
                  <img src="/assets/img/team/01.jpg" alt="thumb">
                  <div class="team-social-wrap">
                    <div class="team-social-btn">
                      <button type="button" aria-label="share alt"><i class="far fa-share-alt"></i></button>
                    </div>
                    <div class="team-social">
                      <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                      <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                      <a href="#top" aria-label="linkedin in"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
                <div class="team-content">
                  <h4><a href="/driver-single.html">Rodrigues Christy</a></h4>
                  <span>Expert Driver</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="team-item wow fadeInUp" data-wow-delay=".4s">
                <div class="team-img">
                  <img src="/assets/img/team/02.jpg" alt="thumb">
                  <div class="team-social-wrap">
                    <div class="team-social-btn">
                      <button type="button" aria-label="share alt"><i class="far fa-share-alt"></i></button>
                    </div>
                    <div class="team-social">
                      <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                      <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                      <a href="#top" aria-label="linkedin in"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
                <div class="team-content">
                  <h4><a href="/driver-single.html">Matthew Hong</a></h4>
                  <span>Expert Driver</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="team-item wow fadeInUp" data-wow-delay=".6s">
                <div class="team-img">
                  <img src="/assets/img/team/03.jpg" alt="thumb">
                  <div class="team-social-wrap">
                    <div class="team-social-btn">
                      <button type="button" aria-label="share alt"><i class="far fa-share-alt"></i></button>
                    </div>
                    <div class="team-social">
                      <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                      <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                      <a href="#top" aria-label="linkedin in"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
                <div class="team-content">
                  <h4><a href="/driver-single.html">Anita Bentley</a></h4>
                  <span>Expert Driver</span>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div class="team-item wow fadeInUp" data-wow-delay=".8s">
                <div class="team-img">
                  <img src="/assets/img/team/04.jpg" alt="thumb">
                  <div class="team-social-wrap">
                    <div class="team-social-btn">
                      <button type="button" aria-label="share alt"><i class="far fa-share-alt"></i></button>
                    </div>
                    <div class="team-social">
                      <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                      <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                      <a href="#top" aria-label="linkedin in"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                    </div>
                  </div>
                </div>
                <div class="team-content">
                  <h4><a href="/driver-single.html">Beverly Dyer</a></h4>
                  <span>Expert Driver</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="download-area pb-120">
        <div class="container">
          <div class="download-wrap wow fadeInUp" data-wow-delay=".25s">
            <div class="row">
              <div class="col-lg-6 align-self-center">
                <div class="download-content">
                  <div class="site-heading mb-4">
                    <span class="site-title-tagline justify-content-start"> <i class="far fa-car"></i> Download Our App </span>
                    <h4 class="site-title mb-10">Day &amp; Night Android <span>and IOS App is</span> Available!</h4>
                    <p>
                      There are many variations of passages available but the majority have suffered in some form going to use a passage by
                      injected humour.
                    </p>
                  </div>
                  <div class="download-btn">
                    <a href="#top" class="google-play">
                      <i class="fab fa-google-play"></i>
                      <div class="content">
                        <span>Get It On</span>
                        <h5>Google Play</h5>
                      </div>
                    </a>
                    <a href="#top" class="app-store">
                      <i class="fab fa-app-store"></i>
                      <div class="content">
                        <span>Get It On</span>
                        <h5>App Store</h5>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="download-img">
                  <img src="/assets/img/download/01.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="blog-area pb-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 mx-auto">
              <div class="site-heading text-center wow fadeInUp" data-wow-delay=".2s">
                <span class="site-title-tagline"><i class="far fa-car"></i> Our Blog</span>
                <h3 class="site-title">Our Latest <span>News And</span> Blog</h3>
                <div class="heading-divider"></div>
              </div>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4">
              <div class="blog-item wow fadeInUp" data-wow-delay=".2s">
                <div class="blog-date">Jan 10, 2026</div>
                <div class="blog-img">
                  <img src="/assets/img/blog/01.jpg" alt="Thumb">
                </div>
                <div class="blog-meta">
                  <ul>
                    <li>
                      <a href="#top"><i class="far fa-user-circle"></i> By Alicia Davis</a>
                    </li>
                    <li>
                      <a href="#top"><i class="far fa-comments"></i> 2.5k Comments</a>
                    </li>
                  </ul>
                </div>
                <div class="blog-info">
                  <h4 class="blog-title">
                    <a href="/blog-single.html">There are many variations of passages available.</a>
                  </h4>
                  <p>It is a long established fact that a reader will majority have suffered distracted readable.</p>
                  <a class="theme-btn" href="/blog-single.html">Read More<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="blog-item wow fadeInUp" data-wow-delay=".4s">
                <div class="blog-date">Jan 12, 2026</div>
                <div class="blog-img">
                  <img src="/assets/img/blog/02.jpg" alt="Thumb">
                </div>
                <div class="blog-meta">
                  <ul>
                    <li>
                      <a href="#top"><i class="far fa-user-circle"></i> By Alicia Davis</a>
                    </li>
                    <li>
                      <a href="#top"><i class="far fa-comments"></i> 1.2k Comments</a>
                    </li>
                  </ul>
                </div>
                <div class="blog-info">
                  <h4 class="blog-title">
                    <a href="/blog-single.html">Generator internet repeat word chunk necessary.</a>
                  </h4>
                  <p>It is a long established fact that a reader will majority have suffered distracted readable.</p>
                  <a class="theme-btn" href="/blog-single.html">Read More<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="blog-item wow fadeInUp" data-wow-delay=".6s">
                <div class="blog-date">Jan 14, 2026</div>
                <div class="blog-img">
                  <img src="/assets/img/blog/03.jpg" alt="Thumb">
                </div>
                <div class="blog-meta">
                  <ul>
                    <li>
                      <a href="#top"><i class="far fa-user-circle"></i> By Alicia Davis</a>
                    </li>
                    <li>
                      <a href="#top"><i class="far fa-comments"></i> 2.8k Comments</a>
                    </li>
                  </ul>
                </div>
                <div class="blog-info">
                  <h4 class="blog-title">
                    <a href="/blog-single.html">Survive only five but that also leap into layout.</a>
                  </h4>
                  <p>It is a long established fact that a reader will majority have suffered distracted readable.</p>
                  <a class="theme-btn" href="/blog-single.html">Read More<i class="fas fa-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>

    
    <footer class="footer-area">
      <div class="footer-shape">
        <img src="/assets/img/shape/06.png" alt="">
      </div>
      <div class="footer-widget">
        <div class="container">
          <div class="footer-widget-wrap pt-100 pb-70">
            <div class="row g-4">
              <div class="col-lg-5">
                <div class="footer-widget-box about-us">
                  <a href="#top" class="footer-logo" aria-label="Day &amp; Night home">
                    <img src="/daynight/day-night-logo.png" alt="">
                  </a>
                  <p>
                    We are many variations of passages available but the majority have suffered alteration some form by injected humour
                    words believable.
                  </p>
                  <div class="footer-newsletter mt-30">
                    <h4>Subscribe Our Newsletter</h4>
                    <div class="newsletter-form">
                      <form action="#">
                        <div class="form-group">
                          <div class="form-icon">
                            <i class="far fa-envelopes"></i>
                            <input type="email" class="form-control" placeholder="Your Email" aria-label="Your Email">
                            <button class="theme-btn" type="submit">Subscribe <span class="far fa-paper-plane"></span></button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6 col-lg-2">
                <div class="footer-widget-box list">
                  <h4 class="footer-widget-title">Company</h4>
                  <ul class="footer-list">
                    <li>
                      <a href="/about.html"><i class="far fa-angle-double-right"></i>About Us</a>
                    </li>
                    <li>
                      <a href="/blog.html"><i class="far fa-angle-double-right"></i>Update News</a>
                    </li>
                    <li>
                      <a href="/testimonial.html"><i class="far fa-angle-double-right"></i>Testimonials</a>
                    </li>
                    <li>
                      <a href="/contact.html"><i class="far fa-angle-double-right"></i>Contact Us</a>
                    </li>
                    <li>
                      <a href="/terms.html"><i class="far fa-angle-double-right"></i>Terms Of Service</a>
                    </li>
                    <li>
                      <a href="/privacy.html"><i class="far fa-angle-double-right"></i>Privacy policy</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-6 col-lg-2">
                <div class="footer-widget-box list">
                  <h4 class="footer-widget-title">Quick Links</h4>
                  <ul class="footer-list">
                    <li>
                      <a href="/book-ride.html"><i class="far fa-angle-double-right"></i>Book A Ride</a>
                    </li>
                    <li>
                      <a href="/faq.html"><i class="far fa-angle-double-right"></i>FAQ's</a>
                    </li>
                    <li>
                      <a href="/help.html"><i class="far fa-angle-double-right"></i>Booking Tips</a>
                    </li>
                    <li>
                      <a href="/help.html"><i class="far fa-angle-double-right"></i>Help &amp; Support</a>
                    </li>
                    <li>
                      <a href="/car.html"><i class="far fa-angle-double-right"></i>Our Cars</a>
                    </li>
                    <li>
                      <a href="/contact.html"><i class="far fa-angle-double-right"></i>Join Our Team</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3">
                <div class="footer-widget-box">
                  <h4 class="footer-widget-title">Get In Touch</h4>
                  <ul class="footer-contact">
                    <li>
                      <div class="icon">
                        <i class="far fa-location-dot"></i>
                      </div>
                      <div class="content">
                        <h5>Our Address</h5>
                        <p>ул. „Атанас Манчев“ 18, София</p>
                      </div>
                    </li>
                    <li>
                      <div class="icon">
                        <i class="far fa-phone"></i>
                      </div>
                      <div class="content">
                        <h5>Call Us</h5>
                        <a href="tel:+359877733110">0877 733 110</a>
                      </div>
                    </li>
                    <li>
                      <div class="icon">
                        <i class="far fa-envelope"></i>
                      </div>
                      <div class="content">
                        <h5>Mail Us</h5>
                        <a href="mailto:info@example.com">info@example.com</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="copyright">
          <div class="row">
            <div class="col-md-6 align-self-center">
              <p class="copyright-text">© Copyright <span id="date"></span> <a href="#top"> Day &amp; Night </a> All Rights Reserved.</p>
            </div>
            <div class="col-md-6 align-self-center">
              <ul class="footer-social">
                <li>
                  <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                </li>
                <li>
                  <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                </li>
                <li>
                  <a href="#top" aria-label="linkedin in"><i class="fab fa-linkedin-in"></i></a>
                </li>
                <li>
                  <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
    

    
    <a href="#top" id="scroll-top" aria-label="Back to top"><i class="far fa-arrow-up"></i></a>
    

    
    
    
    
    
    
    
    
    
    
    
    
    
  

