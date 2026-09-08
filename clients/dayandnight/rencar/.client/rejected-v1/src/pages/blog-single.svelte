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
          <h3 class="breadcrumb-title">Blog Single</h3>
          <ul class="breadcrumb-menu">
            <li><a href="/index.html">Home</a></li>
            <li class="active">Blog Single</li>
          </ul>
        </div>
      </div>
      

      
      <div class="blog-single py-120">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-8">
              <div class="blog-single-wrap">
                <div class="blog-single-content">
                  <div class="blog-thumb-img">
                    <img src="/assets/img/blog/single.jpg" alt="thumb">
                  </div>
                  <div class="blog-info">
                    <div class="blog-meta">
                      <div class="blog-meta-left">
                        <ul>
                          <li><i class="far fa-user-tie-hair"></i><a href="#top">Jean R Gunter</a></li>
                          <li><i class="far fa-comments"></i>3.2k Comments</li>
                          <li><i class="far fa-thumbs-up"></i>1.4k Like</li>
                        </ul>
                      </div>
                      <div class="blog-meta-right">
                        <a href="#top" class="share-link"><i class="far fa-share-alt"></i>Share</a>
                      </div>
                    </div>
                    <div class="blog-details">
                      <h3 class="blog-details-title mb-20">It is a long established fact that a reader</h3>
                      <p class="mb-10">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                        voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
                        velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                      </p>
                      <p class="mb-10">
                        But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
                        give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the
                        master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
                        because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.
                      </p>
                      <blockquote class="blockqoute">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
                        layout. The point of using orem psum is that it has a more-or-less the majority have suffered alteration normal
                        distribution.
                        <h4 class="blockqoute-author">Mark Crawford</h4>
                        <i class="fal fa-quote-right blockqoute-icon"></i>
                      </blockquote>
                      <p class="mb-20">
                        In a free hour when our power of choice is untrammelled and when nothing prevents our being able to do what we like
                        best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims
                        of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances
                        accepted. The wise man therefore always holds in these matters to this principle of selection.
                      </p>

                      <div class="row">
                        <div class="col-md-6 mb-20">
                          <img src="/assets/img/blog/01.jpg" alt="">
                        </div>
                        <div class="col-md-6 mb-20">
                          <img src="/assets/img/blog/02.jpg" alt="">
                        </div>
                      </div>
                      <p class="mb-20">
                        Power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is
                        to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the
                        obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The
                        wise man therefore always holds in these matters to this principle of selection.
                      </p>
                      <hr>
                      <div class="blog-details-tag pb-20">
                        <h4>Tags :</h4>
                        <ul>
                          <li><a href="#top">Rental</a></li>
                          <li><a href="#top">Booking</a></li>
                          <li><a href="#top">Online</a></li>
                        </ul>
                      </div>
                    </div>
                    <div class="blog-author">
                      <div class="blog-author-img">
                        <img src="/assets/img/blog/author.jpg" alt="">
                      </div>
                      <div class="author-info">
                        <h4>Author</h4>
                        <h3 class="author-name">Shelly Frederick</h3>
                        <p>
                          It is a long established fact that a reader will be distracted by the abcd readable content of a page when looking
                          at its layout that more less.
                        </p>
                        <div class="author-social">
                          <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                          <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                          <a href="#top" aria-label="instagram"><i class="fab fa-instagram"></i></a>
                          <a href="#top" aria-label="whatsapp"><i class="fab fa-whatsapp"></i></a>
                          <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="blog-comment">
                    <h3>Comments (20)</h3>
                    <div class="blog-comment-wrap">
                      <div class="blog-comment-item">
                        <img src="/assets/img/blog/com-1.jpg" alt="thumb">
                        <div class="blog-comment-content">
                          <h4>Rosa Fossum</h4>
                          <span><i class="far fa-clock"></i> Jan 23, 2026</span>
                          <p>
                            There are many variations of passages the majority have suffered in some injected humour or randomised words
                            which don't look even slightly believable.
                          </p>
                          <a href="#top"><i class="far fa-reply"></i> Reply</a>
                        </div>
                      </div>
                      <div class="blog-comment-item reply">
                        <img src="/assets/img/blog/com-2.jpg" alt="thumb">
                        <div class="blog-comment-content">
                          <h4>Timothy Stone</h4>
                          <span><i class="far fa-clock"></i> Jan 23, 2026</span>
                          <p>
                            There are many variations of passages the majority have suffered in some injected humour or randomised words
                            which don't look even slightly believable.
                          </p>
                          <a href="#top"><i class="far fa-reply"></i> Reply</a>
                        </div>
                      </div>
                      <div class="blog-comment-item">
                        <img src="/assets/img/blog/com-3.jpg" alt="thumb">
                        <div class="blog-comment-content">
                          <h4>Stacey Anthony</h4>
                          <span><i class="far fa-clock"></i> Jan 23, 2026</span>
                          <p>
                            There are many variations of passages the majority have suffered in some injected humour or randomised words
                            which don't look even slightly believable.
                          </p>
                          <a href="#top"><i class="far fa-reply"></i> Reply</a>
                        </div>
                      </div>
                    </div>
                    <div class="blog-comment-form">
                      <h3>Leave A Comment</h3>
                      <form action="#">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group">
                              <div class="form-icon">
                                <i class="far fa-user-tie"></i>
                                <input type="text" class="form-control" name="name" placeholder="Your Name*" required="" aria-label="Your Name*">
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group">
                              <div class="form-icon">
                                <i class="far fa-envelope"></i>
                                <input type="email" class="form-control" name="email" placeholder="Your Email*" required="" aria-label="Your Email*">
                              </div>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group">
                              <div class="form-icon">
                                <i class="far fa-pen"></i>
                                <textarea name="message" cols="30" rows="5" class="form-control" placeholder="Your Comment*" required="" aria-label="Your Comment*"></textarea>
                              </div>
                            </div>
                            <button type="submit" class="theme-btn">Post Comment <i class="far fa-paper-plane"></i></button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <aside class="blog-sidebar">
                
                <div class="widget search">
                  <h4 class="widget-title">Search</h4>
                  <div class="search-form">
                    <form action="#">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="Search Here..." aria-label="Search Here...">
                        <button type="submit" aria-label="Search"><i class="far fa-search"></i></button>
                      </div>
                    </form>
                  </div>
                </div>

                
                <div class="widget category">
                  <h4 class="widget-title">Category</h4>
                  <div class="category-list">
                    <a href="#top"><i class="far fa-arrow-right"></i>Car Rental<span>(10)</span></a>
                    <a href="#top"><i class="far fa-arrow-right"></i>New Cars Model<span>(15)</span></a>
                    <a href="#top"><i class="far fa-arrow-right"></i>Car Rent Tips<span>(20)</span></a>
                    <a href="#top"><i class="far fa-arrow-right"></i>How To Rent<span>(30)</span></a>
                    <a href="#top"><i class="far fa-arrow-right"></i>Car Drive Tips<span>(25)</span></a>
                  </div>
                </div>

                
                <div class="widget recent-post">
                  <h4 class="widget-title">Recent Post</h4>
                  <div class="recent-post-item">
                    <div class="recent-post-img">
                      <img src="/assets/img/blog/bs-1.jpg" alt="thumb">
                    </div>
                    <div class="recent-post-info">
                      <h5><a href="#top">There are many variatio of majority.</a></h5>
                      <span><i class="far fa-clock"></i>Jan 23, 2026</span>
                    </div>
                  </div>
                  <div class="recent-post-item">
                    <div class="recent-post-img">
                      <img src="/assets/img/blog/bs-2.jpg" alt="thumb">
                    </div>
                    <div class="recent-post-info">
                      <h5><a href="#top">There are many variatio of majority.</a></h5>
                      <span><i class="far fa-clock"></i>Jan 23, 2026</span>
                    </div>
                  </div>
                  <div class="recent-post-item">
                    <div class="recent-post-img">
                      <img src="/assets/img/blog/bs-3.jpg" alt="thumb">
                    </div>
                    <div class="recent-post-info">
                      <h5><a href="#top">There are many variatio of majority.</a></h5>
                      <span><i class="far fa-clock"></i>Jan 23, 2026</span>
                    </div>
                  </div>
                </div>

                
                <div class="widget social">
                  <h4 class="widget-title">Follow Us</h4>
                  <div class="social-link">
                    <a href="#top" aria-label="facebook f"><i class="fab fa-facebook-f"></i></a>
                    <a href="#top" aria-label="x twitter"><i class="fab fa-x-twitter"></i></a>
                    <a href="#top" aria-label="dribbble"><i class="fab fa-dribbble"></i></a>
                    <a href="#top" aria-label="whatsapp"><i class="fab fa-whatsapp"></i></a>
                    <a href="#top" aria-label="youtube"><i class="fab fa-youtube"></i></a>
                  </div>
                </div>

                
                <div class="widget tag">
                  <h4 class="widget-title">Popular Tags</h4>
                  <div class="tag-list">
                    <a href="#top">Car</a>
                    <a href="#top">Rental</a>
                    <a href="#top">Drive</a>
                    <a href="#top">Insurance</a>
                    <a href="#top">Offer</a>
                    <a href="#top">Tips</a>
                    <a href="#top">Booking</a>
                    <a href="#top">Online</a>
                  </div>
                </div>
              </aside>
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
    

    
    
    
    
    
    
    
    
    
    
    
    
    
  

