/*============================================================
Template Name   : Rencar
Description     : Car Rental And Booking HTML5 Template
Author          : LunarTemp
Version         : 1.0
==============================================================*/

(function ($) {
  "use strict";

  // multi level dropdown menu
  $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
    if (!$(this).next().hasClass("show")) {
      $(this).parents(".dropdown-menu").first().find(".show").removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass("show");

    $(this)
      .parents("li.nav-item.dropdown.show")
      .on("hidden.bs.dropdown", function (e) {
        $(".dropdown-submenu .show").removeClass("show");
      });
    return false;
  });

  //Header Search
  if ($(".search-box-outer").length) {
    $(".search-box-outer").on("click", function () {
      $("body").addClass("search-active");
    });
    $(".close-search").on("click", function () {
      $("body").removeClass("search-active");
    });
  }

  // data-background
  $(function () {
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
    });
  });

  // sidebar popup
  $(".sidebar-btn").on("click", function () {
    $(".sidebar-popup").addClass("open");
    $(".sidebar-wrapper").addClass("open");
  });
  $(".close-sidebar-popup, .sidebar-popup").on("click", function () {
    $(".sidebar-popup").removeClass("open");
    $(".sidebar-wrapper").removeClass("open");
  });

  // Sections stay visible; the owner requested no scroll-reveal choreography.

  // hero slider
  $(".hero-slider").owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 0,
    autoplay: false,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    items: 1,
    navText: ["<i class='far fa-long-arrow-left'></i>", "<i class='far fa-long-arrow-right'></i>"],
  });

  // city slider
  $(".city-slider").owlCarousel({
    items: 4,
    loop: true,
    margin: 25,
    smartSpeed: 400,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    navText: ["<i class='far fa-angle-left'></i>", "<i class='far fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // brand-slider
  $(".brand-slider").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    navText: ["<i class='icofont-long-arrow-left'></i>", "<i class='icofont-long-arrow-right'></i>"],
    dots: false,
    autoplay: false,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 6,
      },
    },
  });

  // service slider
  $(".service-slider").owlCarousel({
    loop: true,
    margin: 30,
    smartSpeed: 400,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    navText: ["<i class='far fa-angle-left'></i>", "<i class='far fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 3,
      },
    },
  });

  // car slider
  $(".car-slider").owlCarousel({
    items: 4,
    loop: true,
    margin: 15,
    smartSpeed: 400,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    navText: ["<i class='far fa-angle-left'></i>", "<i class='far fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // car single slider
  $(".car-single-slider").owlCarousel({
    items: 1,
    loop: true,
    smartSpeed: 400,
    nav: true,
    dots: false,
    navText: ["<i class='far fa-angle-left'></i>", "<i class='far fa-angle-right'></i>"],
  });

  $(".car-single-dots img").on("click", function () {
    var index = $(this).data("index");
    $(".car-single-slider").trigger("to.owl.carousel", [index, 300]);
  });

  // cartype slider
  $(".cartype-slider").owlCarousel({
    items: 6,
    loop: true,
    margin: 15,
    smartSpeed: 400,
    nav: true,
    dots: false,
    autoplay: false,
    autoplayHoverPause: true,
    navText: ["<i class='far fa-angle-left'></i>", "<i class='far fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 4,
      },
      1200: {
        items: 6,
      },
    },
  });

  // testimonial-slider
  $(".testimonial-slider").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: true,
    autoplay: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // preloader
  $(function () {
    $(".preloader").fadeOut("slow");
  });

  // fun fact counter
  $(".counter").countTo();
  $(".counter-box").appear(
    function () {
      $(".counter").countTo();
    },
    {
      accY: -100,
    }
  );

  // magnific popup init
  $(".popup-gallery").magnificPopup({
    delegate: ".popup-img",
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  // progress bar
  $(function () {
    var progressBar = $(".progress");
    if (progressBar.length) {
      progressBar.each(function () {
        var Self = $(this);
        Self.appear(function () {
          var progressValue = Self.data("value");
          Self.find(".progress-bar").animate(
            {
              width: progressValue + "%",
            },
            1000
          );
        });
      });
    }
  });

  // case filter
  $(function () {
    if ($(".filter-box").children().length > 0) {
      $(".filter-box").isotope({
        itemSelector: ".filter-item",
        masonry: {
          columnWidth: 1,
        },
      });

      $(".filter-btn").on("click", "li", function () {
        var filterValue = $(this).attr("data-filter");
        $(".filter-box").isotope({ filter: filterValue });
      });

      $(".filter-btn li").each(function () {
        $(this).on("click", function () {
          $(this).siblings("li.active").removeClass("active");
          $(this).addClass("active");
        });
      });
    }
  });

  // scroll to top
  $(window).on("scroll", function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      $("#scroll-top").addClass("active");
    } else {
      $("#scroll-top").removeClass("active");
    }
  });

  $("#scroll-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500);
    return false;
  });

  // navbar fixed top
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("fixed-top");
    } else {
      $(".navbar").removeClass("fixed-top");
    }
  });

  // countdown
  $("[data-countdown]").each(function () {
    let finalDate = $(this).data("countdown");
    $(this).countdown(finalDate, function (event) {
      $(this).html(
        event.strftime(
          '<div class="time-wrap">' +
            '<span class="time"><span>%-D</span><span class="unit">Day%!D</span></span>' +
            ' <span class="divider">:</span> ' +
            '<span class="time"><span>%H</span><span class="unit">Hour%!H</span></span>' +
            ' <span class="divider">:</span> ' +
            '<span class="time"><span>%M</span><span class="unit">Min%!M</span></span>' +
            ' <span class="divider">:</span> ' +
            '<span class="time"><span>%S</span><span class="unit">Sec%!S</span></span>' +
            "</div>"
        )
      );
    });
  });

  // flatpickr date & time
  document.querySelectorAll(".date-picker")?.forEach((el) => {
    const dateTime = el.dataset.datetime === "true";
    flatpickr(el, {
      enableTime: dateTime,
      time_24hr: false,
      dateFormat: dateTime ? "d M Y, h:i K" : "d M Y",
      prevArrow: "<i class='far fa-chevron-left'></i>",
      nextArrow: "<i class='far fa-chevron-right'></i>",
      disableMobile: true,
    });
  });

  // slimselect
  document.querySelectorAll(".select")?.forEach((select) => {
    const slimSearch = select.dataset.slimSearch === "true";
    new SlimSelect({
      select: select,
      settings: {
        showSearch: slimSearch,
        searchPlaceholder: "Search...",
      },
    });
  });

  // copywrite date
  let date = new Date().getFullYear();
  $("#date").html(date);

  // auth password view
  $(".password-view").on("click", function () {
    var pwd = document.getElementById("password");
    if (pwd.type === "password") {
      pwd.type = "text";
      $(this).addClass("show");
    } else {
      pwd.type = "password";
      $(this).removeClass("show");
    }
  });

  // profile image btn
  $(".profile-img-btn").on("click", function () {
    $(".profile-img-file").click();
  });

  // bootstrap tooltip enable
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
})(jQuery);
