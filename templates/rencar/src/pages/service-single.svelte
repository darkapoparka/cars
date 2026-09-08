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
          <h3 class="breadcrumb-title">Service Single</h3>
          <ul class="breadcrumb-menu">
            <li><a href="/index.html">Home</a></li>
            <li class="active">Service Single</li>
          </ul>
        </div>
      </div>
      

      
      <div class="service-single py-120">
        <div class="container">
          <div class="service-single-wrap">
            <div class="row">
              <div class="col-xl-4 col-lg-4">
                <div class="service-sidebar">
                  <div class="widget">
                    <h4 class="title">All Services</h4>
                    <div class="category">
                      <a href="#top"><i class="far fa-angle-double-right"></i>Car Rent With Driver</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Business Car Rental</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Luxury Car Rental</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Private Car Rental</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Airport Transfer</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Wedding Ceremony</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Hospital Transfer</a>
                      <a href="#top"><i class="far fa-angle-double-right"></i>Whole City Tour</a>
                    </div>
                  </div>
                  <div class="widget">
                    <h4 class="title">Download</h4>
                    <div class="service-download">
                      <a href="#top"><i class="far fa-file-pdf"></i> Download Brochure</a>
                      <a href="#top"><i class="far fa-file-alt"></i> Download Application</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-8 col-lg-8">
                <div class="service-details">
                  <div class="mb-30">
                    <img src="/assets/img/service/single.jpg" alt="thumb">
                  </div>
                  <div class="content">
                    <h3 class="mb-20">Car Rent With Driver</h3>
                    <p class="mb-20">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                      eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                      voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                      voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                      velit, sed quia non numquam eius modi tempora incidunt ut labore et.
                    </p>
                    <p class="mb-20">
                      But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give
                      you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the
                      master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
                      because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor
                      again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because
                      occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example
                    </p>

                    <div class="row">
                      <div class="col-md-6 mb-20">
                        <img src="/assets/img/service/01.jpg" alt="">
                      </div>
                      <div class="col-md-6 mb-20">
                        <img src="/assets/img/service/02.jpg" alt="">
                      </div>
                    </div>
                    <p class="mb-20">
                      Power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to
                      be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of
                      business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore
                      always holds in these matters to this principle of selection.
                    </p>
                    <div class="my-4">
                      <div class="mb-3">
                        <h3 class="mb-3">Our Work Process</h3>
                        <p>
                          Aliquam facilisis rhoncus nunc, non vestibulum mauris volutpat non. Vivamus tincidunt accumsan urna, vel aliquet
                          nunc commodo tristique. Nulla facilisi. Phasellus vel ex nulla. Nunc tristique sapien id mauris efficitur, porta
                          scelerisque nisl dignissim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
                          curae; Sed at mollis tellus. Proin consequat, orci nec bibendum viverra, ante orci suscipit dolor, et condimentum
                          felis dolor ac lectus.
                        </p>
                      </div>
                      <ul class="list">
                        <li><i class="far fa-check-double"></i>Fusce justo risus placerat in risus eget tincidunt consequat elit.</li>
                        <li><i class="far fa-check-double"></i>Nunc fermentum sem sit amet dolor laoreet placerat.</li>
                        <li><i class="far fa-check-double"></i>Nullam rhoncus dictum diam quis ultrices.</li>
                        <li><i class="far fa-check-double"></i>Integer quis lorem est uspendisse eu augue porta ullamcorper dictum.</li>
                        <li><i class="far fa-check-double"></i>Quisque tristique neque arcu ut venenatis felis malesuada et.</li>
                      </ul>
                    </div>
                    <div class="mt-4">
                      <h3 class="mb-3">Why Choose Our Services ?</h3>
                      <p>
                        Quisque a nisl id sem sollicitudin volutpat. Cras et commodo quam, vel congue ligula. Orci varius natoque penatibus
                        et magnis dis parturient montes, nascetur ridiculus mus. Cras quis venenatis neque. Donec volutpat tellus lobortis
                        mi ornare eleifend. Fusce eu nisl ut diam ultricies accumsan. Integer lobortis vestibulum nunc id porta. Curabitur
                        aliquam arcu sed ex dictum, a facilisis urna porttitor. Fusce et mattis nisl. Sed iaculis libero consequat justo
                        auctor iaculis. Vestibulum sed ex et magna tristique bibendum. Sed hendrerit neque nec est suscipit, id faucibus
                        dolor convallis.
                      </p>
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
    

    
    
    
    
    
    
    
    
    
    
    
    
    
  

