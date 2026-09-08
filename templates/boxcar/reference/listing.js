(function($) {
    "use strict";
    
    var $clonedSelectTax = {};

    $.extend($.apusThemeCore, {
        /**
         *  Initialize scripts
         */
        listing_init: function() {
            var self = this;

            self.select2Init();

            self.searchAjaxInit();
            
            self.submitListing();

            self.listingDetail();

            self.filterListingFnc();

            self.listingBtnFilter();

            self.changePaddingTopContent();

            self.mortgageCalculator();
            
            $(window).resize(function(){
                setTimeout(function(){
                    self.changePaddingTopContent();
                }, 50);
            });

            self.listingCompare();
            
            if ( $('.listings-listing-wrapper.main-items-wrapper').length ) {
                $(document).on('change', 'form.filter-listing-form input, form.filter-listing-form select', function (e) {
                    var form = $(this).closest('form.filter-listing-form');
                    setTimeout(function(){
                        form.trigger('submit');
                    }, 200);
                });

                $(document).on('submit', 'form.filter-listing-form', function (e) {
                    e.preventDefault();
                    var url = $(this).attr('action');

                    var formData = $(this).find(":input").filter(function(index, element) {
                            return $(element).val() != '';
                        }).serialize();

                    if( url.indexOf('?') != -1 ) {
                        url = url + '&' + formData;
                    } else{
                        url = url + '?' + formData;
                    }
                    
                    self.listingsGetPage( url );
                    return false;
                });

                // Sort Action
                $(document).on('change', 'form.listings-ordering select.orderby', function(e) {
                    e.preventDefault();
                    $('form.listings-ordering').trigger('submit');
                });
                
                $(document).on('submit', 'form.listings-ordering', function (e) {
                    var url = $(this).attr('action');

                    var formData = $(this).find(":input").filter(function(index, element) {
                            return $(element).val() != '';
                        }).serialize();
                    
                    if( url.indexOf('?') != -1 ) {
                        url = url + '&' + formData;
                    } else{
                        url = url + '?' + formData;
                    }
                    self.listingsGetPage( url );
                    return false;
                });

                // display mode
                $(document).on('change', 'form.listings-display-mode input', function(e) {
                    e.preventDefault();
                    $('form.listings-display-mode').trigger('submit');
                });

                $(document).on('submit', 'form.listings-display-mode', function (e) {
                    var url = $(this).attr('action');

                    if( url.indexOf('?') != -1 ) {
                        url = url + '&' + $(this).serialize();
                    } else{
                        url = url + '?' + $(this).serialize();
                    }
                    self.listingsGetPage( url );
                    return false;
                });
            }

            // ajax pagination
            if ( $('.ajax-pagination').length ) {
                self.ajaxPaginationLoad();
            }

            if ( $('.page-template-page-dashboard .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-right, .page-template-page-dashboard .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-left').length ) {
                var ps = new PerfectScrollbar('.page-template-page-dashboard .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-right, .page-template-page-dashboard .sidebar-wrapper:not(.offcanvas-filter-sidebar) > .sidebar-left', {
                    wheelPropagation: true
                });
            }

            $(document).on('click', '.advance-search-btn', function(e) {
                e.preventDefault();
                $(this).closest('.search-form-inner').find('.advance-search-wrapper-fields').slideToggle('fast');
            });

            // filter fixed
            if ( $('.listings-filter-sidebar-wrapper').length ) {
                var ps = new PerfectScrollbar('.listings-filter-sidebar-wrapper', {
                    wheelPropagation: true
                });
            }

            self.galleryListing();

            $('.view-user-cars-btn').on('click', function(){
                $('html, body').animate({
                    scrollTop: $("#user-listings-wrapper").offset().top
                }, 2000);
            });

            $(".show_hide_password a").on('click', function(event) {
                event.preventDefault();
                if($(this).siblings('input').attr("type") == "text"){
                    $(this).attr('title', boxcar_listing_opts.show);
                    $(this).siblings('input').attr('type', 'password');
                    $(this).find('span').addClass( "dashicons-hidden" );
                    $(this).find('span').removeClass( "dashicons-visibility" );
                } else if($(this).siblings('input').attr("type") == "password"){
                    $(this).attr('title', boxcar_listing_opts.hide);
                    $(this).siblings('input').attr('type', 'text');
                    $(this).find('span').removeClass( "dashicons-hidden" );
                    $(this).find('span').addClass( "dashicons-visibility" );
                }
            });

            // mobile search
            $('.action-show-filters').on('click', function(){
                $(".action-show-filters + .filter-listing-form, .action-show-filters + #listings-google-maps").toggle('slow');
            });
        },
        select2Init: function() {
            // select2
            if ( $.isFunction( $.fn.select2 ) && typeof wp_cardealer_select2_opts !== 'undefined' ) {
                var select2_args = wp_cardealer_select2_opts;
                select2_args['allowClear']              = true;
                select2_args['minimumResultsForSearch'] = 10;
                
                if ( typeof wp_cardealer_select2_opts.language_result !== 'undefined' ) {
                    select2_args['language'] = {
                        noResults: function(){
                            return wp_cardealer_select2_opts.language_result;
                        }
                    };
                }
                var filter_select2_args = select2_args;
                
                select2_args['allowClear'] = false;
                select2_args['theme'] = 'default';

                var register_select2_args = select2_args;
                // register_select2_args['minimumResultsForSearch'] = -1;
                // filter
                
                $.fn.filterSelect2Tax = function( class_a = ''){
                    if( $(this).is('select') ){
                        var allowclear = true;
                        var width = $(this).data('width') ? $(this).data('width') : '100%';
                        if ( $(this).hasClass('select2-hidden-accessible') ) {
                            $(this).select2('destroy');
                        }
                        $(this).empty();
                        $(this).append( $('option.condition--all', $clonedSelectTax[$(this).attr('name')]).clone() );
                        $(this).append( $('option.' + class_a, $clonedSelectTax[$(this).attr('name')]).clone() );
                       
                        var fil_select2_args = {
                            allowClear: allowclear,
                            width: width,
                            minimumResultsForSearch: 10
                        }
                        if( $(this).closest('.filter-listing-form').hasClass('horizontal') ){
                            fil_select2_args.theme = 'default customizer-search';
                        }
                         $(this).select2(fil_select2_args);
                    }
                    return $(this);
                }
                
                $('select[name=email_frequency]').select2( select2_args );
                $('.register-form select').select2( register_select2_args );
                
                filter_select2_args['allowClear'] = true;

                $('.filter-tax-select[data-condition^="listing_"]').each(function () {
                    $clonedSelectTax[$(this).attr('name')] = $(this).clone();
                });

                $('.filter-tax-select[name="filter-category"]').on('change', function(){
                    var value = $(this).val();
                    if ( value ) {
                        $('.filter-tax-select[data-condition="listing_category"]').each(function () {
                            $(this).filterSelect2Tax('condition-' + value); //will create a select2 with only the car class options.
                        });
                    }
                });

                if ( $('.filter-tax-select[name="filter-category"]').length ) {
                    var value = $('.filter-tax-select[name="filter-category"]').val();
                    if ( value ) {
                        $('.filter-tax-select[data-condition="listing_category"]').each(function () {
                            $(this).filterSelect2Tax('condition-' + value); //will create a select2 with only the car class options.
                        });
                    }
                }
                $('.filter-tax-select[name="filter-make"]').on('change', function(){
                    var value = $(this).val();
                    if ( value ) {
                        $('.filter-tax-select[data-condition="listing_make"]').each(function () {
                            $(this).filterSelect2Tax('condition-' + value); //will create a select2 with only the car class options.
                        });
                    }
                });
                
                if ( $('.filter-tax-select[name="filter-make"]').length ) {
                    var value = $('.filter-tax-select[name="filter-make"]').val();
                    if ( value ) {
                        $('.filter-tax-select[data-condition="listing_make"]').each(function () {
                            $(this).filterSelect2Tax('condition-' + value); //will create a select2 with only the car class options.
                        });
                    }
                }

                $('.filter-listing-form select').select2( filter_select2_args );

                // fix for widget search
                if( $('.filter-listing-form.horizontal:not(.style_list) select').length ){
                    filter_select2_args.theme = 'default customizer-search';
                }

                $('.filter-listing-form .main-inner select').select2( filter_select2_args );
                
            }
        },
        searchAjaxInit: function() {
            if ( $.isFunction( $.fn.typeahead ) ) {
                $('.apus-autocompleate-input').each(function(){
                    var $this = $(this);
                    $this.typeahead({
                            'hint': true,
                            'highlight': true,
                            'minLength': 2,
                            'limit': 10
                        }, {
                            name: 'search',
                            source: function (query, processSync, processAsync) {
                                processSync([boxcar_listing_opts.empty_msg]);
                                $this.closest('.twitter-typeahead').addClass('loading');

                                var values = {};
                                $.each($this.closest('form').serializeArray(), function (i, field) {
                                    values[field.name] = field.value;
                                });

                                var ajaxurl = boxcar_listing_opts.ajaxurl;
                                if ( typeof wp_cardealer_opts.ajaxurl_endpoint !== 'undefined' ) {
                                    var ajaxurl =  wp_cardealer_opts.ajaxurl_endpoint.toString().replace( '%%endpoint%%', 'boxcar_autocomplete_search_listings' );
                                }

                                return $.ajax({
                                    url: ajaxurl,
                                    type: 'GET',
                                    data: {
                                        'search': query,
                                        'data': values
                                    },
                                    dataType: 'json',
                                    success: function (json) {
                                        $this.closest('.twitter-typeahead').removeClass('loading');
                                        $this.closest('.has-suggestion').removeClass('active');
                                        return processAsync(json);
                                    }
                                });
                            },
                            templates: {
                                empty : [
                                    '<div class="empty-message">',
                                    boxcar_listing_opts.empty_msg,
                                    '</div>'
                                ].join('\n'),
                                suggestion: Handlebars.compile( boxcar_listing_opts.template )
                            },
                        }
                    );
                    $this.on('typeahead:selected', function (e, data) {
                        e.preventDefault();
                        setTimeout(function(){
                            $('.apus-autocompleate-input').val(data.title);    
                        }, 5);
                        
                        return false;
                    });
                });
            }
        },
        submitListing: function() {
            $(document).on('click', 'ul.submit-listing-heading li a', function(e) {
                e.preventDefault();
                var href = $(this).attr('href');
                if ( $(href).length ) {
                    $('ul.submit-listing-heading li').removeClass('active');
                    $(this).closest('li').addClass('active');
                    $('.before-group-row').removeClass('active');
                    $(href).addClass('active');

                    $( "input" ).trigger( "pxg:simplerefreshmap" );
                }
            });

            $(document).on('click', '.job-submission-previous-btn, .job-submission-next-btn', function(e) {
                e.preventDefault();
                var index = $(this).data('index');
                if ( $('.before-group-row-'+index).length ) {
                    $('.before-group-row').removeClass('active');
                    $('.before-group-row-'+index).addClass('active');

                    $('.submit-listing-heading li').removeClass('active');
                    $('.submit-listing-heading-'+index).addClass('active');

                    $( "input" ).trigger( "pxg:simplerefreshmap" );
                }
            });
        },
        changePaddingTopContent: function() {
            var admin_bar_h = 0;
            if ( $('#wpadminbar').length ){
                var admin_bar_h = $('#wpadminbar').outerHeight();
            }
            var header_h = 0;

            if ($(window).width() >= 1200) {
                if ( $('#apus-header').length ) {
                    var header_h = $('#apus-header').outerHeight();
                }
                $('.inner-dashboard .sidebar').css({ 'top': header_h + admin_bar_h });
                $('body.page-template-page-dashboard #apus-main-content').css({ 'padding-top': header_h });
            } else if ($(window).width() >= 992) {
                if ( $('#apus-header-mobile').length ) {
                    var header_h = $('#apus-header-mobile').outerHeight();
                }
                $('.inner-dashboard .sidebar').css({ 'top': header_h + admin_bar_h });
                $('body.page-template-page-dashboard #apus-main-content').css({ 'padding-top': 0 });
            } else {

                if ( $('#apus-header-mobile').length ) {
                    var header_h = $('#apus-header-mobile').outerHeight();
                }

                $('body.page-template-page-dashboard #apus-main-content').css({ 'padding-top': 0 });
                $('.inner-dashboard .sidebar').css({ 'top': 0 });
            }
            
            // fix for header
            $('body.page-template-page-dashboard #apus-header, body.fix-header #apus-header').css({ 'top': admin_bar_h });
            $('body.page-template-page-dashboard #apus-header-mobile, body.fix-header #apus-header-mobile').css({ 'top': admin_bar_h });


            // fix for half map
            $('.layout-type-half-map .filter-sidebar').css({ 'padding-top': header_h + 30 });
            if ( $('.layout-type-half-map .filter-scroll').length ) {
                var ps = new PerfectScrollbar('.layout-type-half-map .filter-scroll', {
                    wheelPropagation: true
                });
            }
            // offcanvas-filter-sidebar 
            $('.offcanvas-filter-sidebar').css({ 'padding-top': header_h + 10 });
        },
        listingDetail: function() {
            var self = this;
            
            var adjustheight = 145;
            $('.show-more-less-wrapper').each(function(){
                var desc_height = $(this).closest('.description-inner').find('.description-inner-wrapper').height();
                if ( desc_height > adjustheight ) {
                    $(this).closest('.description-inner').addClass('show-more');
                    $(this).closest('.description-inner').find('.description-inner-wrapper').css({
                        'height': adjustheight,
                        'overflow': 'hidden',
                    });
                }
                $(this).find('.show-more').on('click', function(){
                    $(this).closest('.description-inner').removeClass('show-more').addClass('show-less');
                    $(this).closest('.description-inner').find('.description-inner-wrapper').css({
                        'height': 'auto',
                        'overflow': 'visible',
                    });
                });
                $(this).find('.show-less').on('click', function(){
                    $(this).closest('.description-inner').removeClass('show-less').addClass('show-more');
                    $(this).closest('.description-inner').find('.description-inner-wrapper').css({
                        'height': adjustheight,
                        'overflow': 'hidden',
                    });
                });
            });

            
            $('.btn-print-listing').on('click', function(e){
                e.preventDefault();
                
                var $this = $(this);
                $this.addClass('loading');
                var listing_id = $(this).data('listing_id');
                var nonce = $(this).data('nonce');

                var ajaxurl = boxcar_listing_opts.ajaxurl;
                if ( typeof wp_cardealer_opts.ajaxurl_endpoint !== 'undefined' ) {
                    var ajaxurl =  wp_cardealer_opts.ajaxurl_endpoint.toString().replace( '%%endpoint%%', 'boxcar_ajax_print_listing' );
                }

                var printWindow = window.open('', 'Print Me', 'width=700 ,height=842');
                $.ajax({
                    url: ajaxurl,
                    type:'POST',
                    dataType: 'html',
                    data: {
                        'listing_id': listing_id,
                        'nonce': nonce,
                        'action': 'boxcar_ajax_print_listing',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    
                    printWindow.document.write(data);
                    printWindow.document.close();
                    printWindow.focus();

                });

            });
            
        },
        mortgageCalculator: function() {
            $('#btn_mortgage_get_results').on('click', function (e) {
                e.preventDefault();

                var listing_price = $('#apus_mortgage_listing_price').val();
                var deposit = $('#apus_mortgage_deposit').val();
                var interest_rate = parseFloat($('#apus_mortgage_interest_rate').val(), 10) / 100;
                var years = parseInt($('#apus_mortgage_term_years').val(), 10);
                

                var interest_rate_month = interest_rate / 12;
                var nbp_month = years * 12;

                var loan_amount = listing_price - deposit;
                var monthly_payment = parseFloat((loan_amount * interest_rate_month) / (1 - Math.pow(1 + interest_rate_month, -nbp_month))).toFixed(2);

                if (monthly_payment === 'NaN') {
                    monthly_payment = 0;
                }
                

                var totalPayment = (monthly_payment * nbp_month).toFixed(2);
                var totalInterest = (monthly_payment * nbp_month - loan_amount).toFixed(2);
                
                var monthly_payment_html, totalInterest_html, totalPayment_html;
                if ( boxcar_listing_opts.currency_position == 'before_space' ) {
                    monthly_payment_html = boxcar_listing_opts.currency + ' ' + monthly_payment;
                    totalInterest_html = boxcar_listing_opts.currency + ' ' + totalInterest;
                    totalPayment_html = boxcar_listing_opts.currency + ' ' + totalPayment;
                } else if ( boxcar_listing_opts.currency_position == 'after' ) {
                    monthly_payment_html = monthly_payment + boxcar_listing_opts.currency;
                    totalInterest_html = totalInterest + boxcar_listing_opts.currency;
                    totalPayment_html = totalPayment + boxcar_listing_opts.currency;
                } else if ( boxcar_listing_opts.currency_position == 'after_space' ) {
                    monthly_payment_html = monthly_payment + ' ' + boxcar_listing_opts.currency;
                    totalInterest_html = totalInterest + ' ' + boxcar_listing_opts.currency;
                    totalPayment_html = totalPayment + ' ' + boxcar_listing_opts.currency;
                } else {
                    monthly_payment_html = boxcar_listing_opts.currency + monthly_payment;
                    totalInterest_html = boxcar_listing_opts.currency + totalInterest;
                    totalPayment_html = boxcar_listing_opts.currency + totalPayment;
                }
                
                $('.apus_mortgage_results').find('.monthly-payment .value').html( monthly_payment_html );
                $('.apus_mortgage_results').find('.total-interest .value').html( totalInterest_html );
                $('.apus_mortgage_results').find('.total-payment .value').html( totalPayment_html );
                $('.apus_mortgage_results').addClass('d-md-flex').addClass('d-block').addClass('justify-content-between');

            });
        },
        dashboardChartInit: function() {
            var self = this;
            var $this = $('#dashboard_listing_chart_wrapper');
            if( $this.length <= 0 ) {
                return;
            }

            // select2
            if ( $.isFunction( $.fn.select2 ) && typeof wp_cardealer_select2_opts !== 'undefined' ) {
                var select2_args = wp_cardealer_select2_opts;
                select2_args['allowClear']              = false;
                select2_args['minimumResultsForSearch'] = 10;
                
                if ( typeof wp_cardealer_select2_opts.language_result !== 'undefined' ) {
                    select2_args['language'] = {
                        noResults: function(){
                            return wp_cardealer_select2_opts.language_result;
                        }
                    };
                }
                
                select2_args['width'] = '100%';

                $('.stats-graph-search-form select').select2( select2_args );
            }


            var listing_id = $this.data('listing_id');
            var nb_days = $this.data('nb_days');
            self.dashboardChartAjaxInit($this, listing_id, nb_days);

            $('form.stats-graph-search-form select[name="listing_id"]').on('change', function(){
                $('form.stats-graph-search-form').trigger('submit');
            });

            $('form.stats-graph-search-form select[name="nb_days"]').on('change', function(){
                $('form.stats-graph-search-form').trigger('submit');
            });

            $('form.stats-graph-search-form').on('submit', function(e){
                e.preventDefault();
                var listing_id = $('form.stats-graph-search-form select[name="listing_id"]').val();
                var nb_days = $('form.stats-graph-search-form select[name="nb_days"]').val();
                self.dashboardChartAjaxInit($this, listing_id, nb_days);
                return false;
            });
        },
        dashboardChartAjaxInit: function($this, listing_id, nb_days) {
            var self = this;
            if( $this.length <= 0 ) {
                return;
            }
            var parent_div = $this.parent();
            if ( parent_div.hasClass('loading') ) {
                return;
            }
            parent_div.addClass('loading');

            var ajaxurl = boxcar_listing_opts.ajaxurl;
            if ( typeof wp_cardealer_opts.ajaxurl_endpoint !== 'undefined' ) {
                ajaxurl =  wp_cardealer_opts.ajaxurl_endpoint.toString().replace( '%%endpoint%%', 'wp_cardealer_get_listing_chart' );
            }

            $.ajax({
                url: ajaxurl,
                type:'POST',
                dataType: 'json',
                data: {
                    action: 'wp_cardealer_get_listing_chart',
                    listing_id: listing_id,
                    nb_days: nb_days,
                    nonce: $this.data('nonce'),
                }
            }).done(function(response) {
                if (response.status == 'error') {
                    $this.remove();
                } else {
                    var ctx = $this.get(0).getContext("2d");

                    var data = {
                        labels: response.stats_labels,
                        datasets: [
                            {
                                label: response.stats_view,
                                backgroundColor: response.bg_color,
                                borderColor: response.border_color,
                                borderWidth: 1,
                                data: response.stats_values
                            },
                        ]
                    };

                    var options = {
                        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                        scaleBeginAtZero : true,
                        //Boolean - Whether grid lines are shown across the chart
                        scaleShowGridLines : false,
                        //String - Colour of the grid lines
                        scaleGridLineColor : "rgba(0,0,0,.05)",
                        //Number - Width of the grid lines
                        scaleGridLineWidth : 1,
                        //Boolean - Whether to show horizontal lines (except X axis)
                        scaleShowHorizontalLines: true,
                        //Boolean - Whether to show vertical lines (except Y axis)
                        scaleShowVerticalLines: true,
                        //Boolean - If there is a stroke on each bar
                        barShowStroke : false,
                        //Number - Pixel width of the bar stroke
                        barStrokeWidth : 2,
                        //Number - Spacing between each of the X value sets
                        barValueSpacing : 5,
                        //Number - Spacing between data sets within X values
                        barDatasetSpacing : 1,
                        legend: { display: false },

                        tooltips: {
                            enabled: true,
                            mode: 'x-axis',
                            cornerRadius: 4
                        },
                    }

                    if (typeof self.myBarChart !== 'undefined') {
                        self.myBarChart.destroy();
                    }

                    self.myBarChart = new Chart(ctx, {
                        type: response.chart_type,
                        data: data,
                        options: options
                    });
                }
                parent_div.removeClass('loading');
            });
        },
        listingBtnFilter: function(){
            $('.btn-view-map').on('click', function(e){
                e.preventDefault();
                $('#listings-google-maps').removeClass('hidden-sm').removeClass('hidden-xs');
                $('.content-listing .listings-listing-wrapper, .content-listing .agencies-listing-wrapper').addClass('hidden-sm').addClass('hidden-xs');
                $('.btn-view-listing').removeClass('hidden-sm').removeClass('hidden-xs');
                $(this).addClass('hidden-sm').addClass('hidden-xs');
                $('.listings-pagination-wrapper, .agencies-pagination-wrapper').addClass('p-fix-pagination');
                setTimeout(function() {
                    $(window).trigger('pxg:refreshmap');
                }, 100);
            });
            $('.btn-view-listing').on('click', function(e){
                e.preventDefault();
                $('#listings-google-maps').addClass('hidden-sm').addClass('hidden-xs');
                $('.content-listing .listings-listing-wrapper, .content-listing .agencies-listing-wrapper').removeClass('hidden-sm').removeClass('hidden-xs');
                $('.btn-view-map').removeClass('hidden-sm').removeClass('hidden-xs');
                $(this).addClass('hidden-sm').addClass('hidden-xs');
                $('.listings-pagination-wrapper, .agencies-pagination-wrapper').removeClass('p-fix-pagination');
            });

            $('.show-filter-listings').on('click', function(e){
                e.stopPropagation();
                $('.layout-type-half-map .filter-sidebar').toggleClass('active');
                $('.filter-sidebar + .over-dark').toggleClass('active');
            });
            
            $(document).on('click', '.filter-sidebar + .over-dark', function(){
                $('.layout-type-half-map .filter-sidebar').removeClass('active');
                $('.filter-sidebar + .over-dark').removeClass('active');
            });

            // filter sidebar fixed
            $(document).on('click', '.listings-filter-sidebar-wrapper .close-filter, .btn-show-filter, .filter-in-sidebar, .listings-filter-sidebar-wrapper + .over-dark-filter', function(){
                $('.listings-filter-sidebar-wrapper').toggleClass('active');
            });
        },
        filterListingFnc: function(){
            var self = this;
            $('body').on('click', '.btn-show-filter, .offcanvas-filter-sidebar + .over-dark', function(){
                $('.offcanvas-filter-sidebar, .offcanvas-filter-sidebar + .over-dark').toggleClass('active');
                // $('.offcanvas-filter-sidebar').perfectScrollbar();
                if ( $('.offcanvas-filter-sidebar').length ) {
                    var ps = new PerfectScrollbar('.offcanvas-filter-sidebar', {
                        wheelPropagation: true
                    });
                }
                
            });

            $(document).on('after_add_listing_favorite', function(e, $this, data) {
                $this.attr('data-original-title', boxcar_listing_opts.favorite_added_tooltip_title);
            });
            $(document).on('after_remove_listing_favorite', function( event, $this, data ) {
                $this.attr('data-original-title', boxcar_listing_opts.favorite_add_tooltip_title);
            });

            $('body').on('keyup', '.price-input-wrapper input', function(){
                var $from_val = $(this).closest('.price-input-wrapper').find('.filter-from').val();
                var $to_val = $(this).closest('.price-input-wrapper').find('.filter-to').val();
                var $wrapper = $(this).closest('.from-to-text-wrapper');

                if ( $wrapper.hasClass('price') ) {
                    if ( wp_cardealer_opts.enable_multi_currencies === 'yes' ) {
                        $from_val = self.shortenNumber($from_val);
                        $to_val = self.shortenNumber($to_val);
                    } else {
                        $from_val = self.addCommas($from_val);
                        $to_val = self.addCommas($to_val);
                    }
                    $wrapper.find('.from-text .price-text').text( $from_val );
                    $wrapper.find('.to-text .price-text').text( $to_val );
                } else {
                    $wrapper.find('.from-text').text( $from_val );
                    $wrapper.find('.to-text').text( $to_val );
                }
            });
            $('body').on('change', '.price-input-wrapper input', function(){
                var $from_val = $(this).closest('.price-input-wrapper').find('.filter-from').val();
                var $to_val = $(this).closest('.price-input-wrapper').find('.filter-to').val();
                var $wrapper = $(this).closest('.from-to-text-wrapper');
                if ( $wrapper.hasClass('price') ) {
                    if ( wp_cardealer_opts.enable_multi_currencies === 'yes' ) {
                        $from_val = self.shortenNumber($from_val);
                        $to_val = self.shortenNumber($to_val);
                    } else {
                        $from_val = self.addCommas($from_val);
                        $to_val = self.addCommas($to_val);
                    }

                    $wrapper.find('.from-text .price-text').text( $from_val );
                    $wrapper.find('.to-text .price-text').text( $to_val );
                } else {
                    $wrapper.find('.from-text').text( $from_val );
                    $wrapper.find('.to-text').text( $to_val );
                }
            });
            $('body').on('click', '.from-to-wrapper.price-list .price-filter li', function(){
                var $parent = $(this).closest('.from-to-wrapper');
                var $min = $(this).data('min');
                var $max = $(this).data('max');
                $parent.find('input.filter-from').val($min);
                $parent.find('input.filter-to').val($max);
                $(this).closest('.from-to-wrapper').find('.heading-filter-price .price-text-wrapper').html($(this).find('.price-text-wrapper').html());
                
                if ( $('.listings-listing-wrapper.main-items-wrapper').length ) {
                    $(this).closest('form').trigger('submit');
                }

            });

            $('body').on('click', '.reset-search-btn', function(e){
                e.preventDefault();
                var $form = $( this ).closest( 'form' );

                $form.find(':input').not( ':input[type="hidden"]' ).val( '' ).trigger( 'change.select2' );
                $('.main-range-slider').each(function(){
                    var $this = $(this);
                    $this.slider("values", 0, $this.data('min'));
                    $this.slider("values", 1, $this.data('max'));
                    $this.closest('.form-group-inner').find('.filter-from').val($this.data('min'));
                    $this.closest('.form-group-inner').find('.filter-to').val($this.data('max'));

                    $this.closest('.form-group-inner').find('.from-text').text($this.data('min'));
                    $this.closest('.form-group-inner').find('.to-text').text($this.data('max'));
                });

                $('.price-range-slider').each(function(){
                    var $this = $(this);
                    var $from_price = $this.data('min');
                    var $to_price = $this.data('max');

                    $this.slider("values", 0, $this.data('min'));
                    $this.slider("values", 1, $this.data('max'));

                    if ( wp_cardealer_opts.enable_multi_currencies === 'yes' ) {
                        $from_price = self.shortenNumber($from_price);
                        $to_price = self.shortenNumber($to_price);
                    } else {
                        $from_price = self.addCommas($from_price);
                        $to_price = self.addCommas($to_price);
                    }

                    $this.closest('.form-group-inner').find('.from-text .price-text').text( $from_price );
                    $this.closest('.form-group-inner').find('.filter-from').val( $this.data('min') )
                    $this.closest('.form-group-inner').find('.to-text .price-text').text( $to_price );
                    $this.closest('.form-group-inner').find('.filter-to').val( $this.data('max') );

                });

                if ( $('.listings-listing-wrapper.main-items-wrapper').length ) {
                    $form.trigger('submit');
                }
            });
        },
        listingCompare: function(){
            var self = this;
            if ( $('.compare-sidebar-inner .compare-list').length ) {
                var ps = new PerfectScrollbar('.compare-sidebar-inner .compare-list', {
                    wheelPropagation: true
                });
            }

            $(document).on('after_add_listing_compare', function(e, $this, data) {
                var html_output = '';
                if ( data.html_output ) {
                    html_output = data.html_output;
                }
                $('#compare-sidebar .compare-sidebar-inner').html(html_output);
                $('.compare-sidebar-btn .count').html(data.count);

                if ( $('.compare-sidebar-inner .compare-list').length ) {
                    var ps = new PerfectScrollbar('.compare-sidebar-inner .compare-list', {
                        wheelPropagation: true
                    });
                }

                self.layzyLoadImage();

                if ( !$('#compare-sidebar').hasClass('active') ) {
                    $('#compare-sidebar').addClass('active');
                }
                if ( !$('#compare-sidebar').hasClass('open') ) {
                    $('#compare-sidebar').addClass('open');
                }
                $this.attr('data-original-title', boxcar_listing_opts.compare_added_tooltip_title);
                $this.find('span').text(boxcar_listing_opts.compare_added_title);
            });
            

            $(document).on('after_remove_listing_compare', function( event, $this, data ) {
                var html_output = '';
                if ( data.html_output ) {
                    html_output = data.html_output;
                }
                $('#compare-sidebar .compare-sidebar-inner').html(html_output);
                $('.compare-sidebar-btn .count').html(data.count);
                
                if ( $('.compare-sidebar-inner .compare-list').length ) {
                    var ps = new PerfectScrollbar('.compare-sidebar-inner .compare-list', {
                        wheelPropagation: true
                    });
                }

                if ( data.count == '0' ) {
                    $('#compare-sidebar').removeClass('active');
                }

                $this.attr('data-original-title', boxcar_listing_opts.compare_add_tooltip_title);
                $this.find('span').text(boxcar_listing_opts.compare_title);

                self.layzyLoadImage();
            });

            $('.compare-sidebar-inner').on('click', '.btn-remove-listing-compare-list', function(e) {
                e.stopPropagation();
                var $this = $(this);
                $this.addClass('loading');
                var listing_id = $(this).data('listing_id');
                var nonce = $(this).data('nonce');

                var ajaxurl = boxcar_listing_opts.ajaxurl;
                if ( typeof wp_cardealer_opts.ajaxurl_endpoint !== 'undefined' ) {
                    var ajaxurl =  wp_cardealer_opts.ajaxurl_endpoint.toString().replace( '%%endpoint%%', 'wp_cardealer_ajax_remove_listing_compare' );
                }
                $.ajax({
                    url: ajaxurl,
                    type:'POST',
                    dataType: 'json',
                    data: {
                        'listing_id': listing_id,
                        'nonce': nonce,
                        'action': 'wp_cardealer_ajax_remove_listing_compare',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if ( data.status ) {
                        
                        $(document).trigger( "after_remove_listing_compare", [$this, data] );

                        if ( $('.btn-remove-listing-compare-list').length <= 0 ) {
                            $('#compare-sidebar').removeClass('active');
                            $('#compare-sidebar').removeClass('open');
                        }

                        $('a.btn-added-listing-compare').each(function(){
                            if ( listing_id == $(this).data('listing_id') ) {
                                $(this).removeClass('btn-added-listing-compare').addClass('btn-add-listing-compare');
                                $(this).attr('data-original-title', boxcar_listing_opts.compare_add_tooltip_title);
                                $(this).find('span').text(boxcar_listing_opts.compare_title);
                                $(this).data('nonce', data.nonce);
                            }
                        });
                    }
                });
            });

            $('.compare-sidebar-inner').on('click', '.btn-remove-compare-all', function(e) {
                e.stopPropagation();
                var $this = $(this);
                $this.addClass('loading');
                var nonce = $(this).data('nonce');

                var ajaxurl = boxcar_listing_opts.ajaxurl;
                if ( typeof wp_cardealer_opts.ajaxurl_endpoint !== 'undefined' ) {
                    var ajaxurl =  wp_cardealer_opts.ajaxurl_endpoint.toString().replace( '%%endpoint%%', 'wp_cardealer_ajax_remove_all_listing_compare' );
                }

                $.ajax({
                    url: ajaxurl,
                    type:'POST',
                    dataType: 'json',
                    data: {
                        'nonce': nonce,
                        'action': 'wp_cardealer_ajax_remove_all_listing_compare',
                    }
                }).done(function(data) {
                    $this.removeClass('loading');
                    if ( data.status ) {
                        
                        $(document).trigger( "after_remove_listing_compare", [$this, data] );

                        $('a.btn-added-listing-compare').each(function(){
                            $(this).removeClass('btn-added-listing-compare').addClass('btn-add-listing-compare');
                            $(this).data('nonce', data.nonce);
                        });
                    }
                });
            });

            $('body').on('click', '#compare-sidebar .compare-sidebar-btn', function(e){
                e.stopPropagation();
                $('#compare-sidebar').toggleClass('open');
            });
            $('body').on('click', function() {
                if ($('#compare-sidebar').hasClass('open')) {
                    $('#compare-sidebar').removeClass('open');
                }
            });
            $('.compare-sidebar-inner').on('click', function(e) {
                e.stopPropagation();
            });
        },
        listingsGetPage: function(pageUrl, isBackButton){
            var self = this;
            if (self.filterAjax) { return false; }

            self.listingsSetCurrentUrl();

            if (pageUrl) {
                // Show 'loader' overlay
                self.listingsShowLoader();
                
                // Make sure the URL has a trailing-slash before query args (301 redirect fix)
                pageUrl = pageUrl.replace(/\/?(\?|#|$)/, '/$1');
                
                if (!isBackButton) {
                    self.setPushState(pageUrl);
                }
                var settings = $('body').find('.main-items-wrapper').data('settings');
                self.filterAjax = $.ajax({
                    url: pageUrl,
                    data: {
                        load_type: 'full',
                        settings: settings
                    },
                    dataType: 'html',
                    cache: false,
                    headers: {'cache-control': 'no-cache'},
                    
                    method: 'POST', // Note: Using "POST" method for the Ajax request to avoid "load_type" query-string in pagination links
                    
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log('Apus: AJAX error - listingsGetPage() - ' + errorThrown);
                        
                        // Hide 'loader' overlay (after scroll animation)
                        self.listingsHideLoader();
                        
                        self.filterAjax = false;
                    },
                    success: function(response) {
                        // Update listings content
                        self.listingsUpdateContent(response);
                        
                        self.filterAjax = false;
                    }
                });
                
            }
        },
        listingsHideLoader: function(){
            $('body').find('.main-items-wrapper').removeClass('loading');
        },
        listingsShowLoader: function(){
            $('body').find('.main-items-wrapper').addClass('loading');
        },
        setPushState: function(pageUrl) {
            window.history.pushState({apusShop: true}, '', pageUrl);
        },
        listingsSetCurrentUrl: function() {
            var self = this;
            
            // Set current page URL
            self.searchAndTagsResetURL = window.location.href;
        },
        /**
         *  Listings: Update listings content with AJAX HTML
         */
        listingsUpdateContent: function(ajaxHTML) {
            var self = this,
                $ajaxHTML = $('<div>' + ajaxHTML + '</div>');

            var $listings = $ajaxHTML.find('.main-items-wrapper'),
                $display_mode = $ajaxHTML.find('.listings-display-mode-wrapper-ajax .listings-display-mode-wrapper'),
                $pagination = $ajaxHTML.find('.main-pagination-wrapper'),
                $resultCount = $ajaxHTML.find('.results-count'),
                $orderby = $ajaxHTML.find('form.listings-ordering');

            // Replace listings
            if ($listings.length) {
                $('.main-items-wrapper').replaceWith($listings);
            }
            if ($display_mode.length) {
                $('.listings-display-mode-wrapper').replaceWith($display_mode);
            }
            // Replace pagination
            if ($pagination.length) {
                $('.main-pagination-wrapper').replaceWith($pagination);
            }
            
            if ($resultCount.length) {
                $('.results-count').replaceWith($resultCount);
            }
            if ($orderby.length) {
                $('form.listings-ordering').replaceWith($orderby);
            }

            // Load images (init Unveil)
            self.layzyLoadImage();

            // pagination
            if ( $('.ajax-pagination').length ) {
                self.infloadScroll = false;
                self.ajaxPaginationLoad();
            }

            if ( $.isFunction( $.fn.select2 ) && typeof wp_cardealer_select2_opts !== 'undefined' ) {
                var select2_args = wp_cardealer_select2_opts;
                select2_args['allowClear']              = false;
                select2_args['minimumResultsForSearch'] = 10;
                select2_args['width'] = 'auto';
                
                if ( typeof wp_cardealer_select2_opts.language_result !== 'undefined' ) {
                    select2_args['language'] = {
                        noResults: function(){
                            return wp_cardealer_select2_opts.language_result;
                        }
                    };
                }
                
                $('select.orderby').select2( select2_args );
            }
            
            self.updateMakerCards('listings-google-maps');
            setTimeout(function() {
                // Hide 'loader'
                self.listingsHideLoader();
            }, 100);
        },

        /**
         *  Shop: Initialize infinite load
         */
        ajaxPaginationLoad: function() {
            var self = this,
                $infloadControls = $('body').find('.ajax-pagination'),                   
                nextPageUrl;

            self.infloadScroll = ($infloadControls.hasClass('infinite-action')) ? true : false;
            
            if (self.infloadScroll) {
                self.infscrollLock = false;
                
                var pxFromWindowBottomToBottom,
                    pxFromMenuToBottom = Math.round($(document).height() - $infloadControls.offset().top);
                
                /* Bind: Window resize event to re-calculate the 'pxFromMenuToBottom' value (so the items load at the correct scroll-position) */
                var to = null;
                $(window).resize(function() {
                    if (to) { clearTimeout(to); }
                    to = setTimeout(function() {
                        var $infloadControls = $('.ajax-pagination'); // Note: Don't cache, element is dynamic
                        pxFromMenuToBottom = Math.round($(document).height() - $infloadControls.offset().top);
                    }, 100);
                });
                
                $(window).scroll(function(){
                    if (self.infscrollLock) {
                        return;
                    }
                    
                    pxFromWindowBottomToBottom = 0 + $(document).height() - ($(window).scrollTop()) - $(window).height();
                    
                    // If distance remaining in the scroll (including buffer) is less than the pagination element to bottom:
                    if (pxFromWindowBottomToBottom < pxFromMenuToBottom) {
                        self.ajaxPaginationGet();
                    }
                });
            } else {
                var $productsWrap = $('body');
                /* Bind: "Load" button */
                $productsWrap.on('click', '.main-pagination-wrapper .apus-loadmore-btn', function(e) {
                    e.preventDefault();
                    self.ajaxPaginationGet();
                });
                
            }
            
            if (self.infloadScroll) {
                $(window).trigger('scroll'); // Trigger scroll in case the pagination element (+buffer) is above the window bottom
            }
        },
        /**
         *  Shop: AJAX load next page
         */
        ajaxPaginationGet: function() {
            var self = this;
            
            if (self.filterAjax) return false;
            
            // Get elements (these can be replaced with AJAX, don't pre-cache)
            var $nextPageLink = $('.apus-pagination-next-link').find('a'),
                $infloadControls = $('.ajax-pagination'),
                nextPageUrl = $nextPageLink.attr('href');
            
            if (nextPageUrl) {
                // Show 'loader'
                $infloadControls.addClass('apus-loader');
                
                // self.setPushState(nextPageUrl);
                var settings = $('body').find('.main-items-wrapper').data('settings');
                
                self.filterAjax = $.ajax({
                    url: nextPageUrl,
                    data: {
                        load_type: 'items',
                        settings: settings,
                    },
                    dataType: 'html',
                    cache: false,
                    headers: {'cache-control': 'no-cache'},
                    method: 'POST',
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log('APUS: AJAX error - ajaxPaginationGet() - ' + errorThrown);
                    },
                    complete: function() {
                        // Hide 'loader'
                        $infloadControls.removeClass('apus-loader');
                    },
                    success: function(response) {
                        var $response = $('<div>' + response + '</div>'), // Wrap the returned HTML string in a dummy 'div' element we can get the elements
                            $gridItemElement = $('.items-wrapper', $response).html(),
                            $resultCount = $('.results-count .last', $response).html();
                        

                        // Append the new elements
                        $('.main-items-wrapper .items-wrapper .row').append($gridItemElement);
                        
                        
                        // Append results
                        $('.results-count .last').html($resultCount);

                        // Update Maps
                        self.updateMakerCards('listings-google-maps');
                        
                        // Load images (init Unveil)
                        self.layzyLoadImage();
                        
                        // Get the 'next page' URL
                        nextPageUrl = $response.find('.apus-pagination-next-link').children('a').attr('href');
                        
                        if (nextPageUrl) {
                            $nextPageLink.attr('href', nextPageUrl);
                        } else {
                            $('.main-items-wrapper').addClass('all-listings-loaded');
                            
                            if (self.infloadScroll) {
                                self.infscrollLock = true;
                            }
                            $infloadControls.find('.apus-loadmore-btn').addClass('hidden');
                            $nextPageLink.removeAttr('href');
                        }
                        
                        self.filterAjax = false;
                        
                        if (self.infloadScroll) {
                            $(window).trigger('scroll'); // Trigger 'scroll' in case the pagination element (+buffer) is still above the window bottom
                        }
                    }
                });
            } else {
                if (self.infloadScroll) {
                    self.infscrollLock = true; // "Lock" scroll (no more products/pages)
                }
            }
        },
        shortenNumber: function($number) {
            var self = this;

            var divisors = wp_cardealer_opts.divisors;
            var $key_sign = '';
            $.each(divisors, function( $index, $value ) {
                if ($number < ($value['divisor'] * 1000)) {
                    $key_sign = $value['key'];
                    $number = $number / $value['divisor'];
                    return false;
                }
            });

            return self.addCommas($number) + $key_sign;
        },
        addCommas: function(str) {
            var parts = (str + "").split("."),
                main = parts[0],
                len = main.length,
                output = "",
                first = main.charAt(0),
                i;
            
            if (first === '-') {
                main = main.slice(1);
                len = main.length;    
            } else {
                first = "";
            }
            i = len - 1;
            while(i >= 0) {
                output = main.charAt(i) + output;
                if ((len - i) % 3 === 0 && i > 0) {
                    output = wp_cardealer_opts.money_thousands_separator + output;
                }
                --i;
            }
            // put sign back
            output = first + output;
            // put decimal part back
            if (parts.length > 1) {
                output += wp_cardealer_opts.money_dec_point + parts[1];
            }
            
            return output;
        },
        galleryListing: function() {
            var self = this;
            $(document).on( 'mouseenter', 'article.listing-item', function(){
                if ( !$(this).hasClass('loaded-gallery') && $(this).data('images') ) {
                    var $this = $(this);
                    var href = $(this).find('a.listing-image').attr('href')
                    var images = $(this).data('images');
                    var html = '<div class="slick-carousel-gallery-listings hidden" style="width: ' + $(this).find('.listing-thumbnail-wrapper').width() + 'px;"><div class="slick-carousel" data-items="1" data-large="1" data-medium="1" data-small="1" data-smallest="1" data-pagination="true" data-nav="false" data-disable_draggable="true">';
                    images.forEach(function(img_url, index){
                        html += '<div class="item"><a class="listing-image" href="'+ href +'"><img src="'+img_url+'"></a></div>';
                    });
                    html += '</div></div>';
                    $(this).find('.listing-thumbnail-wrapper .image-thumbnail').append(html);

                    $(this).find('.slick-carousel-gallery-listings').imagesLoaded( function(){

                        $this.find('.slick-carousel-gallery-listings').removeClass("hidden").delay(200).queue(function(){
                            $(this).addClass("active").dequeue();
                        });

                        self.initSlick($this.find('.slick-carousel'));
                        
                    }).progress( function( instance, image ) {
                        $this.addClass('images-loading');
                    }).done( function( instance ) {
                        $this.addClass('images-loaded').removeClass('images-loading');
                    });

                    $(this).addClass('loaded-gallery');
                }
            });
        }
    });

    $.apusThemeExtensions.listing = $.apusThemeCore.listing_init;

    
})(jQuery);
