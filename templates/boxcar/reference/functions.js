(function ($) {
    "use strict";

    if (!$.apusThemeExtensions)
        $.apusThemeExtensions = {};
    
    function ApusThemeCore() {
        var self = this;
        // self.init();
    };

    ApusThemeCore.prototype = {
        /**
         *  Initialize
         */
        init: function() {
            var self = this;
            
            self.preloadSite();

            self.activeAccordion();

            // slick init
            self.initSlick($("[data-carousel=slick]"));

            // isoto
            self.initIsotope();

            // Unveil init
            setTimeout(function(){
                self.layzyLoadImage();
            }, 200);

            self.initHeaderSticky('main-sticky-header');

            // back to top
            self.backToTop();
            
            self.commentForm();

            // popup image
            self.popupImage();

            $('[data-toggle="tooltip"]').tooltip();

            self.initMobileMenu();

            self.mainMenuInit();
            
            $(document.body).on('click', '.nav [data-toggle="dropdown"]', function(e){
                e.preventDefault();
                if ( this.href && this.href != '#' ){
                    if ( this.target && this.target == '_blank' ) {
                        window.open(this.href, '_blank');
                    } else {
                        window.location.href = this.href;
                    }
                }
            });
            
            $("#vertical-menu-container").slidingMenu();

            $('.vertical-wrapper .show-navbar-sidebar').on('click', function(){
                $(this).closest('.vertical-wrapper').find('.vertical-menu-container-wrapper').addClass('active');
                $(this).closest('.vertical-wrapper').find('.over-dark').addClass('active');
            });
            
            $('.close-action, .over-dark ').on('click', function(){
                $(this).closest('.vertical-wrapper').find('.vertical-menu-container-wrapper').removeClass('active');
                $(this).closest('.vertical-wrapper').find('.over-dark').removeClass('active');
            });

            self.loadExtension();
        },
        /**
         *  Extensions: Load scripts
         */
        loadExtension: function() {
            var self = this;
            
            if ($.apusThemeExtensions.quantity_increment) {
                $.apusThemeExtensions.quantity_increment.call(self);
            }

            if ($.apusThemeExtensions.shop) {
                $.apusThemeExtensions.shop.call(self);
            }

            if ($.apusThemeExtensions.listing_map) {
                $.apusThemeExtensions.listing_map.call(self);
            }

            if ($.apusThemeExtensions.listing) {
                $.apusThemeExtensions.listing.call(self);
            }
        },
        initSlick: function(element) {
            var self = this;
            element.each( function(){
                var config = {
                    infinite: false,
                    arrows: $(this).data( 'nav' ),
                    dots: $(this).data( 'pagination' ),
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    centerPadding: 0,
                    prevArrow:"<button type='button' class='slick-arrow slick-prev'><i class='flaticon-arrowhead-thin-outline-to-the-left'></i></span><span class='textnav'>"+ boxcar_opts.previous +"</span></button>",
                    nextArrow:"<button type='button' class='slick-arrow slick-next'><span class='textnav'>"+ boxcar_opts.next +"</span><i class='flaticon-arrow-point-to-right'></i></button>",
                };
            
                var slick = $(this);
                if( $(this).data('items') ){
                    config.slidesToShow = $(this).data( 'items' );
                    var slidestoscroll = $(this).data( 'items' );
                }
                if( $(this).data('infinite') ){
                    config.infinite = true;
                }
                if( $(this).data('autoplay') ){
                    config.autoplay = true;
                    config.autoplaySpeed = 2500;
                }
                if( $(this).data('disable_draggable') ){
                    config.touchMove = false;
                    config.draggable = false;
                    config.swipe = false;
                    config.swipeToSlide = false;
                }
                if( $(this).data('centermode') ){
                    config.centerMode = true;
                }
                if( $(this).data('centerpadding') ){
                    config.centerPadding = $(this).data( 'centerpadding' );
                }
                if( $(this).data('vertical') ){
                    config.vertical = true;
                }
                if( $(this).data('rows') ){
                    config.rows = $(this).data( 'rows' );
                }
                if( $(this).data('asnavfor') ){
                    config.asNavFor = $(this).data( 'asnavfor' );
                }
                if( $(this).data('slidestoscroll') ){
                    var slidestoscroll = $(this).data( 'slidestoscroll' );
                }
                if( $(this).data('focusonselect') ){
                    config.focusOnSelect = $(this).data( 'focusonselect' );
                }
                config.slidesToScroll = slidestoscroll;


                if ($(this).data('smalldesktop')) {
                    var smalldesktop = $(this).data('smalldesktop');
                } else {
                    var smalldesktop = config.items;
                }
                if ($(this).data('large')) {
                    var large = $(this).data('large');
                } else {
                    var large = 4;
                }
                if ($(this).data('medium')) {
                    var medium = $(this).data('medium');
                } else {
                    var medium = 3;
                }
                if ($(this).data('small')) {
                    var small = $(this).data('small');
                } else {
                    var small = 2;
                }
                if ($(this).data('smallest')) {
                    var smallest = $(this).data('smallest');
                } else {
                    if ($(this).data('small')) {
                        var smallest = $(this).data('small');
                    } else{
                        var smallest = 2;
                    }
                }


                if ($(this).data('slidestoscroll_smalldesktop')) {
                    var slidestoscroll_smalldesktop = $(this).data('slidestoscroll_smalldesktop');
                } else {
                    var slidestoscroll_smalldesktop = config.items;
                }
                if ($(this).data('slidestoscroll_large')) {
                    var slidestoscroll_large = $(this).data('slidestoscroll_large');
                } else {
                    var slidestoscroll_large = large;
                }
                if ($(this).data('slidestoscroll_medium')) {
                    var slidestoscroll_medium = $(this).data('slidestoscroll_medium');
                } else {
                    var slidestoscroll_medium = medium;
                }
                if ($(this).data('slidestoscroll_small')) {
                    var slidestoscroll_small = $(this).data('slidestoscroll_small');
                } else {
                    var slidestoscroll_small = small;
                }
                if ($(this).data('slidestoscroll_smallest')) {
                    var slidestoscroll_smallest = $(this).data('slidestoscroll_smallest');
                } else {
                    var slidestoscroll_smallest = smallest;
                }

                config.responsive = [

                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: smallest,
                            slidesToScroll: slidestoscroll_smallest,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: small,
                            slidesToScroll: slidestoscroll_small
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: medium,
                            slidesToScroll: slidestoscroll_medium
                        }
                    },
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: large,
                            slidesToScroll: slidestoscroll_large
                        }
                    },
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: smalldesktop,
                            slidesToScroll: slidestoscroll_smalldesktop
                        }
                    }
                ];

                if ( $('html').attr('dir') == 'rtl' ) {
                    config.rtl = true;
                }

                $(this).slick( config );

            } );

            // Fix owl in bootstrap 5 tabs
            $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href");
                var $slick = $(".slick-carousel", target);

                if ($slick.length > 0 && $slick.hasClass('slick-initialized')) {
                    $slick.slick('refresh');
                }
                self.layzyLoadImage();
            });
        },
        layzyLoadImage: function() {
            $(window).off('scroll.unveil resize.unveil lookup.unveil');
            var $images = $('.image-wrapper:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.image-wrapper').first().addClass('image-loaded');
                        $(this).removeAttr('data-src');
                        $(this).removeAttr('data-srcset');
                        $(this).removeAttr('data-sizes');
                    });
                });
            }

            var $images = $('.product-image:not(.image-loaded) .unveil-image'); // Get un-loaded images only
            if ($images.length) {
                $images.unveil(1, function() {
                    $(this).load(function() {
                        $(this).parents('.product-image').first().addClass('image-loaded');
                    });
                });
            }
        },
        initIsotope: function() {
            $('.isotope-items').each(function(){  
                var $container = $(this);
                
                $container.imagesLoaded( function(){
                    $container.isotope({
                        itemSelector : '.isotope-item',
                        transformsEnabled: true,         // Important for videos
                        masonry: {
                            columnWidth: $container.data('columnwidth')
                        }
                    }); 
                });
            });

            /*---------------------------------------------- 
             *    Apply Filter        
             *----------------------------------------------*/
            $('.isotope-filter li a').on('click', function(){
               
                var parentul = $(this).parents('ul.isotope-filter').data('related-grid');
                $(this).parents('ul.isotope-filter').find('li a').removeClass('active');
                $(this).addClass('active');
                var selector = $(this).attr('data-filter'); 
                $('#'+parentul).isotope({ filter: selector }, function(){ });
                
                return(false);
            });
        },
        initHeaderSticky: function(main_sticky_class) {
            if ( $('.' + main_sticky_class).length ) {
                if ( typeof Waypoint !== 'undefined' ) {
                    if ( $('.' + main_sticky_class) && typeof Waypoint.Sticky !== 'undefined' ) {
                        var sticky = new Waypoint.Sticky({
                            element: $('.' + main_sticky_class)[0],
                            wrapper: '<div class="main-sticky-header-wrapper">',
                            offset: '-10px',
                            stuckClass: 'sticky-header'
                        });
                    }
                }
            }
        },
        backToTop: function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 400) {
                    $('#back-to-top').addClass('active');
                } else {
                    $('#back-to-top').removeClass('active');
                }
            });
            $('#back-to-top').on('click', function () {
                $('html, body').animate({scrollTop: '0px'}, 800);
                return false;
            });
        },
        
        commentForm: function () {
            if ( $('#commentform .form-control, .form-theme .form-control').length ) {
                $('#commentform .form-control, .form-theme .form-control').each(function(){
                    var content = $(this).val();
                    if ( content ) {
                        $(this).addClass('has-value');
                    } else {
                        $(this).removeClass('has-value');
                    }
                });
                
                $('#commentform .form-control, .form-theme .form-control').on('change', function(){
                    var content = $(this).val();
                    if ( content ) {
                        $(this).addClass('has-value');
                    } else {
                        $(this).removeClass('has-value');
                    }
                });
            }
        },
            
        popupImage: function() {
            // popup
            var self = this;
            $(".popup-image").magnificPopup({type:'image'});
            $('.popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });

            $('.widget-gallery').each(function(){
                var tagID = $(this).attr('id');
                $('#' + tagID).magnificPopup({
                    delegate: '.popup-image-gallery',
                    type: 'image',
                    tLoading: 'Loading image #%curr%...',
                    mainClass: 'mfp-img-mobile',
                    gallery: {
                        enabled: true,
                        navigateByImgClick: true,
                        preload: [0,1] // Will preload 0 - before current, and 1 after the current image
                    }
                });
            });
            $('.btn-show-popup').magnificPopup({
                mainClass: 'apus-mfp-zoom-in',
                type:'inline',
                midClick: true,
                modal: true,
                callbacks: {
                    open: function() {
                        self.layzyLoadImage();
                    }
                }
            });
            
            $('body').on('click', '.close-magnific-popup', function() {
                $.magnificPopup.close();
            });
        },
        preloadSite: function() {
            // preload page
            setTimeout(function(){
                if ( $('body').hasClass('apus-body-loading') ) {
                    $('body').removeClass('apus-body-loading');
                    $('.apus-page-loading').fadeOut(100);
                }
            }, 100);
        },
        
        activeAccordion: function() {
            $('.panel-collapse').on('show.bs.collapse', function () {
                $(this).siblings('.panel-heading').addClass('active');
            });

            $('.panel-collapse').on('hide.bs.collapse', function () {
                $(this).siblings('.panel-heading').removeClass('active');
            });
        },

        initMobileMenu: function() {

            // stick mobile
            var self = this;

            // mobile menu
            $('.btn-showmenu').on('click', function (e) {
                e.stopPropagation();
                $('.apus-offcanvas').toggleClass('active');           
                $('.over-dark').toggleClass('active');
                $('body').toggleClass('over-hidden');

                $("#mobile-menu-container").slidingMenu({
                    backLabel: boxcar_opts.menu_back_text
                });
            });
            $('body').on('click', function() {
                if ($('.apus-offcanvas').hasClass('active')) {
                    $('.apus-offcanvas').toggleClass('active');
                    $('.over-dark').toggleClass('active');
                }
            });
            $('.apus-offcanvas').on('click', function(e) {
                e.stopPropagation();
            });
            
            if ($(window).width() < 992) {
                if ( $('.apus-offcanvas-body').length ) {
                    var ps = new PerfectScrollbar('.apus-offcanvas-body', {
                        wheelPropagation: true
                    });
                }
            }

            // search price
            $('form.form-search.horizontal .wrapper-action .heading-label').on('click', function (e) {
                e.stopPropagation();
                var hasclass = false;
                if ( $(this).closest('.wrapper-action').hasClass('active') ) {
                   hasclass = true;
                }
                $('form.form-search.horizontal .wrapper-action').removeClass('active');
                if ( !hasclass ) {
                    $(this).closest('.wrapper-action').addClass('active');
                }
            });

            $('body').on('click', function() {
                if ($('form.form-search.horizontal .wrapper-action').hasClass('active')) {
                    $('form.form-search.horizontal .wrapper-action').removeClass('active');
                }
            });

            $('form.form-search.horizontal .wrapper-action:not(.price-list)').on('click', function(e) {
                e.stopPropagation();
            });

            // sidebar mobile       
            $('body').on('click', '.mobile-sidebar-btn.btn-left', function(){
                $('.sidebar-left').toggleClass('active');
            });
            $('body').on('click', '.mobile-sidebar-btn.btn-right', function(){
                $('.sidebar-right').toggleClass('active');
            });

            $('body').on('click', '.mobile-sidebar-btn', function(){
                $('.mobile-sidebar-panel-overlay').toggleClass('active');
                $('.mobile-sidebar-btn i').toggleClass('ti-menu-alt ti-close');
            });
            $('body').on('click', '.mobile-sidebar-panel-overlay, .close-sidebar-btn', function(){
                $('.sidebar').removeClass('active');
                $('.mobile-sidebar-panel-overlay').removeClass('active');
                $('.mobile-sidebar-btn i').toggleClass('ti-menu-alt ti-close');
            });


            if ($(window).width() < 992) {
                if ( $('.sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-right, .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-left').length ) {
                    var ps = new PerfectScrollbar('.sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-right, .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-left', {
                        wheelPropagation: true
                    });
                }
            }

        },
        mainMenuInit: function() {
            $('.apus-megamenu .megamenu .has-mega-menu.aligned-fullwidth').each(function(e){
                var $this = $(this),
                    i = $this.closest(".elementor-container"),
                    a = $this.closest('.apus-megamenu');
                $this.on('hover', function(){
                    var m = $(this).find('> .dropdown-menu .dropdown-menu-inner'),
                        w = i.width();

                    m.css({
                        width: w,
                        marginLeft: i.offset().left - a.offset().left
                    });
                });

                $this.find('.elementor-element').addClass('no-transparent');
            });
        },

        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        }
    }

    $.apusThemeCore = ApusThemeCore.prototype;

    $(document).ready(function() {
        // Initialize script
        var apusthemecore_init = new ApusThemeCore();
        apusthemecore_init.init();
    });

    jQuery(window).on("elementor/frontend/init", function() {
        
        var apusthemecore_init = new ApusThemeCore();

        // General element
        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_brands.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_features_box.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_posts.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_testimonials.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        // cardealer elements
        
        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_cardealer_listings.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
                apusthemecore_init.layzyLoadImage();
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_cardealer_listings_tabs.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_cardealer_listings_slider.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_cardealer_listings_slider_special.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_cardealer_listing_types.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_listing_related.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );
        
        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_user_listings.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );
        
        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_listing_reviews.default",
            function($scope) {

                if ( $scope.find('.review-calculator-chart').length ) {
                    var ctx =  $scope.find('.review-calculator-chart').get(0).getContext("2d");

                    var rating =  $scope.find('.review-calculator-chart').data('rating');
                    var rating_remain =  $scope.find('.review-calculator-chart').data('rating_remain');
                    var color =  $scope.find('.review-calculator-chart').data('color');
                    var bg_color =  $scope.find('.review-calculator-chart').data('bg_color');

                    var calDoughnutChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [rating, rating_remain],
                                backgroundColor: [
                                    color,
                                    bg_color,
                                ]
                            }]
                        },
                        options: {
                            cutoutPercentage: 90,
                            responsive: false,
                            tooltips: false,
                        }
                    });
                }
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_dealer_reviews.default",
            function($scope) {
                
                if ( $scope.find('.review-calculator-chart').length ) {
                    var ctx =  $scope.find('.review-calculator-chart').get(0).getContext("2d");

                    var rating =  $scope.find('.review-calculator-chart').data('rating');
                    var rating_remain =  $scope.find('.review-calculator-chart').data('rating_remain');
                    var color =  $scope.find('.review-calculator-chart').data('color');
                    var bg_color =  $scope.find('.review-calculator-chart').data('bg_color');

                    var calDoughnutChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [rating, rating_remain],
                                backgroundColor: [
                                    color,
                                    bg_color,
                                ]
                            }]
                        },
                        options: {
                            cutoutPercentage: 90,
                            responsive: false,
                            tooltips: false,
                        }
                    });
                }
            }
        );


        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_listing_location.default",
            function($scope) {
                apusthemecore_init.mapInit('single-listing-google-maps');
            }
        );
        
        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_dashboard_chart.default",
            function($scope) {
                apusthemecore_init.dashboardChartInit();
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_dealer_gallery.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );

        elementorFrontend.hooks.addAction( "frontend/element_ready/apus_element_detail_dealer_listings.default",
            function($scope) {
                apusthemecore_init.initSlick($scope.find('.slick-carousel'));
            }
        );
    });

})(jQuery);

