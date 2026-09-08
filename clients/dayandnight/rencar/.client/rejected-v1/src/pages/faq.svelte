<svelte:options runes={true} />

    
    <div class="preloader">
      <div class="loader-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    

    
    <header class="header header-2">
      
      <div class="header-top">
        <div class="container">
          <div class="header-top-wrap">
            <div class="header-top-left">
              <div class="header-top-list">
                <ul>
                  <li>
                    <a href="mailto:info@example.com"><i class="far fa-envelopes"></i> info@example.com</a>
                  </li>
                  <li>
                    <a href="tel:+21236547898"><i class="far fa-phone-volume"></i> +2 123 654 7898</a>
                  </li>
                  <li>
                    <a href="#top"><i class="far fa-alarm-clock"></i> Sun - Fri (08AM - 10PM)</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="header-top-right">
              <div class="header-top-list">
                <a href="/login.html"><i class="far fa-sign-in"></i>Login</a>
              </div>
              <div class="header-top-lang">
                <div class="dropdown">
                  <a href="#top" class="top-lang dropdown-toggle" data-bs-toggle="dropdown"><i class="fal fa-globe"></i> Eng</a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#top">English</a></li>
                    <li><a class="dropdown-item" href="#top">German</a></li>
                    <li><a class="dropdown-item" href="#top">Russian</a></li>
                    <li><a class="dropdown-item" href="#top">Spanish</a></li>
                  </ul>
                </div>
              </div>
              <div class="header-top-social">
                <span>Follow Us: </span>
                <a href="#top" aria-label="facebook"><i class="fab fa-facebook"></i></a>
                <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                <a href="#top" aria-label="instagram"><i class="fab fa-instagram"></i></a>
                <a href="#top" aria-label="linkedin"><i class="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      
      <div class="main-navigation">
        <nav class="navbar navbar-expand-lg">
          <div class="container position-relative">
            <a class="navbar-brand" href="/index.html" aria-label="Rencar home">
              <img src="/assets/img/logo/logo.png" alt="logo">
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
                <a href="/index.html" class="offcanvas-brand" id="offcanvasNavbarLabel" aria-label="Rencar home">
                  <img src="/assets/img/logo/logo.png" alt="">
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
        <a href="/index.html" class="sidebar-popup-logo" aria-label="Rencar home">
          <img src="/assets/img/logo/logo.png" alt="">
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
                  <a href="tel:+21236547898">+2 123 654 7898</a>
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
      
      <div class="site-breadcrumb ng-mt" style="background: url(/assets/img/breadcrumb/01.jpg)">
        <div class="container">
          <h3 class="breadcrumb-title">Faq's</h3>
          <ul class="breadcrumb-menu">
            <li><a href="/index.html">Home</a></li>
            <li class="active">Faq's</li>
          </ul>
        </div>
      </div>
      

      
      <div class="faq-area py-120">
        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <div class="faq-content">
                <div class="site-heading mb-4 wow fadeInUp" data-wow-delay=".2s">
                  <span class="site-title-tagline"><i class="far fa-car"></i> Faq's</span>
                  <h3 class="site-title">General <span>frequently</span> asked questions</h3>
                  <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
                  injected humour, or randomised words which don't look even.
                  </p>
                </div>
                <div class="faq-img wow fadeInUp" data-wow-delay=".2s">
                  <img src="/assets/img/faq/01.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="accordion" id="accordionExample">
                <div class="accordion-item wow fadeInUp" data-wow-delay=".1s">
                  <h4 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                      <span><i class="far fa-question"></i></span> How Long Does A Service Take ?
                    </button>
                  </h4>
                  <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure
                      of the moment so blinded by desire ante odio dignissim quam vitae pulvinar turpis.
                    </div>
                  </div>
                </div>
                <div class="accordion-item wow fadeInUp" data-wow-delay=".2s">
                  <h4 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                      <span><i class="far fa-question"></i></span> How Can I Become A Member ?
                    </button>
                  </h4>
                  <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure
                      of the moment so blinded by desire ante odio dignissim quam vitae pulvinar turpis.
                    </div>
                  </div>
                </div>
                <div class="accordion-item wow fadeInUp" data-wow-delay=".3s">
                  <h4 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                      <span><i class="far fa-question"></i></span> What Payment Gateway You Support ?
                    </button>
                  </h4>
                  <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure
                      of the moment so blinded by desire ante odio dignissim quam vitae pulvinar turpis.
                    </div>
                  </div>
                </div>
                <div class="accordion-item wow fadeInUp" data-wow-delay=".4s">
                  <h4 class="accordion-header" id="headingFour">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                      <span><i class="far fa-question"></i></span> How Can I Cancel My Request ?
                    </button>
                  </h4>
                  <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                      We denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure
                      of the moment so blinded by desire ante odio dignissim quam vitae pulvinar turpis.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>

    
    <footer class="footer-area footer-2 pb-40">
      <div class="footer-shape">
        <img src="/assets/img/shape/02.png" alt="">
      </div>
      <div class="footer-widget">
        <div class="container">
          <div class="footer-widget-wrap pt-100 pb-50">
            <div class="row g-4">
              <div class="col-lg-5">
                <div class="footer-widget-box about-us">
                  <a href="#top" class="footer-logo" aria-label="Rencar home">
                    <img src="/assets/img/logo/logo-light.png" alt="">
                  </a>
                  <p>
                    We are many variations of passages available but the majority have suffered alteration some form by injected humour
                    words believable.
                  </p>
                  <div class="footer-payment mt-30">
                    <h4>We Accept Payment Gateway</h4>
                    <div class="payment-wrap">
                      <div class="payment-img">
                        <img class="paypal" src="/assets/img/payment/paypal.png" alt="">
                      </div>
                      <div class="payment-img">
                        <img class="master" src="/assets/img/payment/master-card.png" alt="">
                      </div>
                      <div class="payment-img">
                        <img class="visa" src="/assets/img/payment/visa.png" alt="">
                      </div>
                      <div class="payment-img">
                        <img class="google" src="/assets/img/payment/google-pay.png" alt="">
                      </div>
                      <div class="payment-img">
                        <img class="amex" src="/assets/img/payment/american-express.png" alt="">
                      </div>
                      <div class="payment-img">
                        <img class="discover" src="/assets/img/payment/discover.png" alt="">
                      </div>
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
                        <p>25/AB Milford Road, New York, USA</p>
                      </div>
                    </li>
                    <li>
                      <div class="icon">
                        <i class="far fa-phone"></i>
                      </div>
                      <div class="content">
                        <h5>Call Us</h5>
                        <a href="tel:+21236547898">+2 123 654 7898</a>
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
              <p class="copyright-text">© Copyright <span id="date"></span> <a href="#top"> Rencar </a> All Rights Reserved.</p>
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
    

    
    
    
    
    
    
    
    
    
    
    
    
    
  

