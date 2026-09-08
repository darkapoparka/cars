<script>import { submitForm } from '../interactions.js';import {carousel} from '../carousel.js';import Cart from '../Cart.svelte';import OrderSummary from '../OrderSummary.svelte';</script>
<svelte:head><title>Nusavo – Listing Car – Nusavo</title><link rel="stylesheet" href="/assets/e0ef1f19df-woocommerce-layout.css" media="all"/>
<link rel="stylesheet" href="/assets/dc0dc3919f-woocommerce-smallscreen.css" media="only screen and (max-width: 768px)"/>
<link rel="stylesheet" href="/assets/56b71e1803-woocommerce.css" media="all"/>
<link rel="stylesheet" href="/assets/d3bbadec86-template-kit-export-public.css" media="all"/>
<link rel="stylesheet" href="/assets/9ba39770d2-reset.css" media="all"/>
<link rel="stylesheet" href="/assets/6ee6e7935c-theme.css" media="all"/>
<link rel="stylesheet" href="/assets/5a1b506d9e-header-footer.css" media="all"/>
<link rel="stylesheet" href="/assets/f9605abec1-frontend.min.css" media="all"/>
<link rel="stylesheet" href="/assets/9cf3a27b6f-post-16.css" media="all"/>
<link rel="stylesheet" href="/assets/84467e332e-widget-icon-list.min.css" media="all"/>
<link rel="stylesheet" href="/assets/4c7fe2b6c3-widget-social-icons.min.css" media="all"/>
<link rel="stylesheet" href="/assets/6309bec332-apple-webkit.min.css" media="all"/>
<link rel="stylesheet" href="/assets/afc377a0c0-widget-image.min.css" media="all"/>
<link rel="stylesheet" href="/assets/a9f44c348d-widget-nav-menu.min.css" media="all"/>
<link rel="stylesheet" href="/assets/33bf661319-widget-heading.min.css" media="all"/>
<link rel="stylesheet" href="/assets/82f4e7d03c-e-animation-float.min.css" media="all"/>
<link rel="stylesheet" href="/assets/01634eeaa3-widget-form.min.css" media="all"/>
<link rel="stylesheet" href="/assets/d57ac564b3-fadeInLeft.min.css" media="all"/>
<link rel="stylesheet" href="/assets/894e886320-fadeInRight.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c34d0b4625-widget-loop-filter.min.css" media="all"/>
<link rel="stylesheet" href="/assets/878c6019a0-widget-loop-common.min.css" media="all"/>
<link rel="stylesheet" href="/assets/757652bad6-widget-loop-grid.min.css" media="all"/>
<link rel="stylesheet" href="/assets/993432d894-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c6d7f7ba6b-e-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/4d9f430b7f-widget-image-carousel.min.css" media="all"/>
<link rel="stylesheet" href="/assets/e22f54b1fa-fadeInUp.min.css" media="all"/>
<link rel="stylesheet" href="/assets/610c93ed22-widget-icon-box.min.css" media="all"/>
<link rel="stylesheet" href="/assets/80668fad64-fadeInDown.min.css" media="all"/>
<link rel="stylesheet" href="/assets/2548843443-post-777.css" media="all"/>
<link rel="stylesheet" href="/assets/dd73b9d6b3-base-desktop.css" media="all"/>
<link rel="stylesheet" href="/assets/8b3e2aea3c-base-mobile.css" media="(max-width:767px)"/>
<link rel="stylesheet" href="/assets/aff3c77772-post-49.css" media="all"/>
<link rel="stylesheet" href="/assets/803c93c109-post-64.css" media="all"/>
<link rel="stylesheet" href="/assets/01bbdb238d-common.css" media="all"/>
<link rel="stylesheet" href="/assets/9f69b879a4-nav-menu.css" media="all"/>
<link rel="stylesheet" href="/assets/aea4936564-header-search.css" media="all"/>
<link rel="stylesheet" href="/assets/63e7530997-header-offcanvas.css" media="all"/>
<link rel="stylesheet" href="/assets/956ad7259a-header-info.css" media="all"/>
<link rel="stylesheet" href="/assets/a6484e7d98-css" media="all"/>
<link rel="stylesheet" href="/assets/2539b44ea8-css" media="all"/>
<link rel="stylesheet" href="/assets/3e9e95528f-phosphor-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/590680e632-iconoir.css" media="all"/>
<link rel="stylesheet" href="/assets/61bdf4d9f6-bootstrap-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/619553c0c9-lucide.css" media="all"/>
<link rel="stylesheet" href="/assets/f38c36ed79-wc-blocks.css" media="all"/>
<link rel="stylesheet" href="/assets/efd6efe4e3-widget-woocommerce-product-rating.min.css" media="all"/>
<link rel="stylesheet" href="/assets/543ee46843-ekiticons.css" media="all"/>
<link rel="stylesheet" href="/styles/car-listing.css"/></svelte:head>





		<header data-elementor-type="header" data-elementor-id="49" class="elementor elementor-49 elementor-location-header" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-6feffb8 e-flex e-con-boxed e-con e-parent" data-id="6feffb8" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-17e108f elementor-icon-list--layout-inline elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="17e108f" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items elementor-inline-items">
							<li class="elementor-icon-list-item elementor-inline-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-phone-call"></i>						</span>
										<span class="elementor-icon-list-text">(888) 4000-2345</span>
									</li>
								<li class="elementor-icon-list-item elementor-inline-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-envelope-simple"></i>						</span>
										<span class="elementor-icon-list-text">support@domain.tld</span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-99b1d3b elementor-shape-circle elementor-hidden-mobile elementor-grid-0 e-grid-align-center elementor-widget elementor-widget-social-icons" data-id="99b1d3b" data-element_type="widget" data-e-type="widget" data-widget_type="social-icons.default">
							<div class="elementor-social-icons-wrapper elementor-grid" role="list">
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-facebook-f elementor-repeater-item-380e2c6" target="_blank" href="/car-listing/">
						<span class="elementor-screen-only">Facebook-f</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-tiktok elementor-repeater-item-c01b82a" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Tiktok</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-tiktok" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-x-twitter elementor-repeater-item-c1e1e8f" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">X-twitter</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-x-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-a21f7fa" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Instagram</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-cfb21b9" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Youtube</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>					</a></span>
					</div>
						</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-c98e0b5 e-flex e-con-boxed e-con e-parent" data-id="c98e0b5" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-f1adf81 elementor-widget__width-initial elementor-widget elementor-widget-image" data-id="f1adf81" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
																<a href="/">
							<img src="/assets/0802b3aeb8-logo_nusavo.png" title="logo_nusavo" alt="logo_nusavo" loading="eager">								</a></div>
		<div class="elementor-element elementor-element-2956be7 e-con-full e-flex e-con e-child" data-id="2956be7" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-0e5f9b0 elementor-nav-menu--stretch elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-id="0e5f9b0" data-element_type="widget" data-e-type="widget" data-widget_type="nav-menu.default">
								<nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none">
				<ul id="menu-1-0e5f9b0" class="elementor-nav-menu"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-36"><a href="/" class="elementor-item">Home</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-37"><a href="/about-us/" class="elementor-item">About us<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-43"><a href="/our-team/" class="elementor-sub-item">Our Team</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-38"><a href="/services/" class="elementor-item">Services</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-has-children menu-item-39"><a href="/car-listing/" aria-current="page" class="elementor-item elementor-item-active">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40"><a href="/car-listing/urbango-hatchback/" class="elementor-sub-item">Single Listing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-41"><a href="/contact-us/" class="elementor-item">Contact us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-47"><a href="#preview-info" class="elementor-item elementor-item-anchor">Pages<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-42"><a href="/faq/" class="elementor-sub-item">FAQ</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-44"><a href="/blog/" class="elementor-sub-item">Archive Blog</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-45"><a href="/self-drive-or-chauffeur-rental-which-is-better/" class="elementor-sub-item">Single Post</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-46"><a href="/404/" class="elementor-sub-item">Error 404</a></li>
</ul>
</li>
</ul>			</nav>
					<div class="elementor-menu-toggle" role="button" tabindex="0" aria-label="Open navigation" aria-expanded="false">
			<i aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open mox-iconoir mox-iconoir mox-iconoir-menu"></i><i aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close mox-iconoir mox-iconoir mox-iconoir-xmark"></i>		</div>
					<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-0e5f9b0" class="elementor-nav-menu"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-home menu-item-36"><a href="/" class="elementor-item" tabindex="-1">Home</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-37"><a href="/about-us/" class="elementor-item" tabindex="-1">About us<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-43"><a href="/our-team/" class="elementor-sub-item" tabindex="-1">Our Team</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-38"><a href="/services/" class="elementor-item" tabindex="-1">Services</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-has-children menu-item-39"><a href="/car-listing/" aria-current="page" class="elementor-item elementor-item-active" tabindex="-1">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40"><a href="/car-listing/urbango-hatchback/" class="elementor-sub-item" tabindex="-1">Single Listing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-41"><a href="/contact-us/" class="elementor-item" tabindex="-1">Contact us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-47"><a href="#preview-info" class="elementor-item elementor-item-anchor" tabindex="-1">Pages<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-42"><a href="/faq/" class="elementor-sub-item" tabindex="-1">FAQ</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-44"><a href="/blog/" class="elementor-sub-item" tabindex="-1">Archive Blog</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-45"><a href="/self-drive-or-chauffeur-rental-which-is-better/" class="elementor-sub-item" tabindex="-1">Single Post</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-46"><a href="/404/" class="elementor-sub-item" tabindex="-1">Error 404</a></li>
</ul>
</li>
</ul>			</nav>
						</div>
				<div class="elementor-element elementor-element-f733ce4 elementor-hidden-mobile elementor-widget elementor-widget-button" data-id="f733ce4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/my-account/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-user-circle"></i>			</span>
									<span class="elementor-button-text">My Account</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-a3d7a47 elementor-hidden-mobile elementor-widget elementor-widget-button" data-id="a3d7a47" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>			</span>
									<span class="elementor-button-text">Book Now</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</header>
				<div data-elementor-type="product-archive" data-elementor-id="777" class="elementor elementor-777 elementor-location-archive product" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-4675a244 e-flex e-con-boxed e-con e-parent" data-id="4675a244" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-7d8f0821  elementor-widget elementor-widget-heading" data-id="7d8f0821" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h1 class="elementor-heading-title elementor-size-default">Listing Cars</h1>				</div>
				<div class="elementor-element elementor-element-35d7a6c3 elementor-widget__width-initial elementor-widget-mobile__width-inherit  elementor-widget elementor-widget-heading" data-id="35d7a6c3" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default">Let’s plan your next journey across Indonesia together</h4>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-8be8864 e-flex e-con-boxed e-con e-parent" data-id="8be8864" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-deb1a74 e-con-full e-flex e-con e-child" data-id="deb1a74" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-91852cd e-con-full e-flex e-con e-child" data-id="91852cd" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-b43c5ff elementor-widget elementor-widget-heading" data-id="b43c5ff" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Popular Category</h6>				</div>
				<div class="elementor-element elementor-element-2804e06 elementor-widget elementor-widget-taxonomy-filter" data-id="2804e06" data-element_type="widget" data-e-type="widget" data-widget_type="taxonomy-filter.default">
							<search class="e-filter" role="search" data-base-url="https://shop.creativemox.com/nusavo/listing-cars/" data-page-num="1">
							<button class="e-filter-item" data-filter="economy" aria-pressed="false" type="button">Economy</button>
							<button class="e-filter-item" data-filter="electric" aria-pressed="false" type="button">Electric</button>
							<button class="e-filter-item" data-filter="family" aria-pressed="false" type="button">Family</button>
							<button class="e-filter-item" data-filter="luxury" aria-pressed="false" type="button">Luxury</button>
							<button class="e-filter-item" data-filter="premium-mpv" aria-pressed="false" type="button">Premium MPV</button>
							<button class="e-filter-item" data-filter="standard" aria-pressed="false" type="button">Standard</button>
							<button class="e-filter-item" data-filter="suv" aria-pressed="false" type="button">SUV</button>
							<button class="e-filter-item" data-filter="van" aria-pressed="false" type="button">Van</button>
			
									<button class="e-filter-item" data-filter="__all" aria-pressed="true" type="button">
				All			</button>
					</search>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-812c60a e-con-full e-flex e-con e-child" data-id="812c60a" data-element_type="container" data-e-type="container">
				<div class="woocommerce elementor-element elementor-element-62a8e29 elementor-grid-4 elementor-grid-mobile-2 elementor-grid-tablet-2 elementor-widget elementor-widget-loop-grid" data-id="62a8e29" data-element_type="widget" data-e-type="widget" data-widget_type="loop-grid.product">
				<div class="elementor-widget-container">
							<div class="elementor-loop-container elementor-grid" role="list">
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-802 post-802 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-electric product_tag-electric first instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img fetchpriority="high" width="1254" height="1254" src="/assets/bc4473e090-9-1.jpg" class="attachment-full size-full wp-image-755" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Evolve Electric SUV</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>92.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Automatic</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Electric</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/evolve-electric-suv/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=802">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-792 post-792 product type-product status-publish has-post-thumbnail product_brand-manual product_cat-van product_tag-diesel  instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img width="1254" height="1254" src="/assets/44c0560280-10-1.jpg" class="attachment-full size-full wp-image-756" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Metro Passenger Van</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>120.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Manual</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Diesel</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/trailmark-4x4/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=792">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-791 post-791 product type-product status-publish has-post-thumbnail product_brand-hybrid product_cat-premium-mpv product_tag-petrol  instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img width="1254" height="1254" src="/assets/405612b11a-1-2.jpg" class="attachment-full size-full wp-image-747" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Voyager Minivan</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>95.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Hybrid</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Petrol</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/voyager-minivan/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=791">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-790 post-790 product type-product status-publish has-post-thumbnail product_brand-hybrid product_cat-luxury product_tag-hybrid last instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" width="1254" height="1254" src="/assets/85cb8fd946-6-1.jpg" class="attachment-full size-full wp-image-752" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Prestige Executive</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>110.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Hybrid</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Hybrid</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/prestige-executive/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=790">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-788 post-788 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-suv product_tag-petrol first instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" width="1254" height="1254" src="/assets/8c5c5d4308-4-1.jpg" class="attachment-full size-full wp-image-750" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">TerraX SUV</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>75.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Automatic</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Petrol</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/terrax-suv/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=788">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-787 post-787 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-family product_tag-petrol  instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" width="1254" height="1254" src="/assets/48d6955f6d-8-1.jpg" class="attachment-full size-full wp-image-754" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Grandis MPV</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>68.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Automatic</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Petrol</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/grandis-mpv/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=787">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-782 post-782 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-standard product_tag-petrol  instock shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" width="1254" height="1254" src="/assets/e5f7dd4897-2-2.jpg" class="attachment-full size-full wp-image-748" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Veloce Sedan</h5>				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>52.00</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Automatic</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Petrol</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/veloce-sedan/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=782">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="758" class="elementor elementor-758 e-loop-item e-loop-item-746 post-746 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-economy product_tag-petrol last instock sale shipping-taxable purchasable product-type-simple" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<div class="elementor-element elementor-element-18add6c e-flex e-con-boxed e-con e-parent" data-id="18add6c" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-250ad25 e-con-full e-flex e-con e-child" data-id="250ad25" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-994516a elementor-widget elementor-widget-image" data-id="994516a" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" width="1254" height="1254" src="/assets/b204f5a04c-3-1.jpg" class="attachment-full size-full wp-image-749" alt="">															</div>
				<div class="elementor-element elementor-element-c225c1a elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="c225c1a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">UrbanGo Hatchback</h5>				</div>
				<div class="elementor-element elementor-element-b873f04 elementor-widget__width-inherit elementor-widget elementor-widget-woocommerce-product-rating" data-id="b873f04" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-rating.default">
					
	<div class="woocommerce-product-rating">
		<div class="star-rating" role="img" aria-label="Rated 4.00 out of 5"><span style="width:80%">Rated <strong class="rating">4.00</strong> out of 5 based on <span class="rating">1</span> customer rating</span></div>								<a href="#reviews" class="woocommerce-review-link" rel="nofollow">(<span class="count">1</span> customer review)</a></div>

				</div>
				<div class="elementor-element elementor-element-a38d7cf elementor-widget elementor-widget-heading" data-id="a38d7cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default"><del aria-hidden="true"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>38.00</span></del> <span class="screen-reader-text">Original price was: $38.00.</span><ins aria-hidden="true"><span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">$</span>30.00</span></ins><span class="screen-reader-text">Current price is: $30.00.</span></h4>				</div>
				<div class="elementor-element elementor-element-57861be elementor-widget elementor-widget-heading" data-id="57861be" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">/day</div>				</div>
		<div class="elementor-element elementor-element-9e01669 e-con-full e-grid e-con e-child" data-id="9e01669" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a02aaf9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a02aaf9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Automatic</a></span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-743a502 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="743a502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-diesel-fill"></i>						</span>
										<span class="elementor-icon-list-text"><a href="/car-listing/" rel="tag">Petrol</a></span>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-ebdd9f6 e-con-full e-flex e-con e-child" data-id="ebdd9f6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-545deb4 elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="545deb4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/car-listing/urbango-hatchback/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Detail</span>
					</span>
					</a></div>
				<div class="elementor-element elementor-element-939d12e elementor-align-justify elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="939d12e" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=746">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Book</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
				</div>
				</div>
		
						</div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-8ef5dd4 e-flex e-con-boxed e-con e-parent" data-id="8ef5dd4" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-8a2fc32 elementor-widget elementor-widget-image-carousel" data-id="8a2fc32" data-element_type="widget" data-e-type="widget" data-widget_type="image-carousel.default" data-carousel="&#123;&quot;slides_to_show&quot;:&quot;6&quot;,&quot;slides_to_scroll&quot;:&quot;1&quot;,&quot;navigation&quot;:&quot;none&quot;,&quot;slides_to_show_tablet&quot;:&quot;5&quot;,&quot;slides_to_show_mobile&quot;:&quot;3&quot;,&quot;slides_to_scroll_tablet&quot;:&quot;1&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;infinite&quot;:&quot;yes&quot;,&quot;speed&quot;:500&#125;">
							<div class="elementor-image-carousel-wrapper swiper" role="region" aria-roledescription="carousel" aria-label="Image Carousel" dir="ltr" {@attach carousel}>
			<div class="elementor-image-carousel swiper-wrapper" aria-live="off">
								<div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/30a2b61c77-logo-1.png" alt="logo-1.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/209a201d7d-logo-2.png" alt="logo-2.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/f1c38936c6-logo-3.png" alt="logo-3.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="4 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/a7724a4168-logo-4.png" alt="logo-4.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="5 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/aead7cc8ed-logo-5.png" alt="logo-5.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="6 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/28178c1722-logo-11.png" alt="logo-11.png"></figure></div>			</div>
							
									</div>
						</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-1ea00e5b e-flex e-con-boxed e-con e-parent" data-id="1ea00e5b" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-36243857 e-flex e-con-boxed e-con e-child" data-id="36243857" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-44fe0013  elementor-widget elementor-widget-heading" data-id="44fe0013" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Why Choose Us</h6>				</div>
				<div class="elementor-element elementor-element-5676e50c  elementor-widget elementor-widget-heading" data-id="5676e50c" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Better rental experiences built around your travel needs</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-535ad156 e-con-full e-grid e-con e-child" data-id="535ad156" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-572da74d e-con-full e-flex  e-con e-child" data-id="572da74d" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-4095ff3e elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="4095ff3e" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-steering-wheel"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Reliable vehicles						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Conubia ad nullam ante praesent nec et dapibus tempor velit molestie sem					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-4fdd45d7 elementor-widget elementor-widget-button" data-id="4fdd45d7" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-622bfb68 e-con-full e-flex  e-con e-child" data-id="622bfb68" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-304f8495 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="304f8495" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-clock-clockwise"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Flexible rental options						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Conubia ad nullam ante praesent nec et dapibus tempor velit molestie sem					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-7149ec3b elementor-widget elementor-widget-button" data-id="7149ec3b" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-1d4e2700 e-con-full e-flex  e-con e-child" data-id="1d4e2700" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-5f8e6711 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="5f8e6711" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-medal"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Professional support						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Conubia ad nullam ante praesent nec et dapibus tempor velit molestie sem					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-7162ceea elementor-widget elementor-widget-button" data-id="7162ceea" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-2984a4fb e-con-full e-flex  e-con e-child" data-id="2984a4fb" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-8793502 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="8793502" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-gear"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Well-maintained fleet						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Conubia ad nullam ante praesent nec et dapibus tempor velit molestie sem					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-43931137 elementor-widget elementor-widget-button" data-id="43931137" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-3d89b8f5 e-flex e-con-boxed e-con e-parent" data-id="3d89b8f5" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-32c0e6c5 e-flex e-con-boxed e-con e-child" data-id="32c0e6c5" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-5abf4f36  elementor-widget elementor-widget-heading" data-id="5abf4f36" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Need More Help</h6>				</div>
				<div class="elementor-element elementor-element-4b8aa3fc  elementor-widget elementor-widget-heading" data-id="4b8aa3fc" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Still need help planning your next rental journey?</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-58d871ca e-con-full e-grid e-con e-child" data-id="58d871ca" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-37b1bc1b e-con-full e-flex  e-con e-child" data-id="37b1bc1b" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6f1495dc elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="6f1495dc" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-headphones"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Customer Support						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Commodo maecenas iaculis egestas blandit luctus tempor					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-2b6aaba7 elementor-align-center elementor-widget elementor-widget-button" data-id="2b6aaba7" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Chat Now!</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-20e12bb e-con-full e-flex  e-con e-child" data-id="20e12bb" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3e245c23 elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="3e245c23" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-envelope-open"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Ticket Support						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Commodo maecenas iaculis egestas blandit luctus tempor					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-a84850f elementor-align-center elementor-widget elementor-widget-button" data-id="a84850f" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Send Ticket</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-4eda8f27 e-con-full e-flex  e-con e-child" data-id="4eda8f27" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6639ab50 elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="6639ab50" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-lifebuoy"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Help Center						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Commodo maecenas iaculis egestas blandit luctus tempor					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-1ae477dc elementor-align-center elementor-widget elementor-widget-button" data-id="1ae477dc" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn More</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-3d2d4cfa e-con-full e-flex  e-con e-child" data-id="3d2d4cfa" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-7a550532 elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="7a550532" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-file-text"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Free Insight						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Commodo maecenas iaculis egestas blandit luctus tempor					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-6ba09c4d elementor-align-center elementor-widget elementor-widget-button" data-id="6ba09c4d" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/blog/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Read Article</span>
					</span>
					</a></div>
				</div>
				</div>
					</div>
				</div>
				</div>
				<footer data-elementor-type="footer" data-elementor-id="64" class="elementor elementor-64 elementor-location-footer" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-4b21fb2 e-flex e-con-boxed e-con e-parent" data-id="4b21fb2" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-1da8e04 e-con-full e-flex e-con e-child" data-id="1da8e04" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e79e3b4 elementor-widget elementor-widget-image" data-id="e79e3b4" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img src="/assets/aa2c47ac05-logo_nusavo_w.png" title="logo_nusavo_w" alt="logo_nusavo_w" loading="eager">															</div>
				<div class="elementor-element elementor-element-fbb37f4 elementor-widget elementor-widget-heading" data-id="fbb37f4" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Nusavo makes car rental across Indonesia simple, reliable, and comfortable. Choose the right vehicle and enjoy every journey with confidence.</div>				</div>
				<div class="elementor-element elementor-element-e3dce0c elementor-shape-circle e-grid-align-tablet-center elementor-grid-0 elementor-widget elementor-widget-social-icons" data-id="e3dce0c" data-element_type="widget" data-e-type="widget" data-widget_type="social-icons.default">
							<div class="elementor-social-icons-wrapper elementor-grid" role="list">
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-facebook-f elementor-animation-float elementor-repeater-item-8b03d5b" target="_blank" href="/car-listing/">
						<span class="elementor-screen-only">Facebook-f</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-facebook-f" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-tiktok elementor-animation-float elementor-repeater-item-3be9463" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Tiktok</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-tiktok" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-x-twitter elementor-animation-float elementor-repeater-item-0d11106" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">X-twitter</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-x-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-animation-float elementor-repeater-item-1e5b6ab" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Instagram</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-instagram" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>					</a></span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-animation-float elementor-repeater-item-5b7763f" target="_blank" href="#preview-info">
						<span class="elementor-screen-only">Youtube</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>					</a></span>
					</div>
						</div>
				</div>
		<div class="elementor-element elementor-element-86046ea e-con-full e-flex e-con e-child" data-id="86046ea" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-32ee91e elementor-widget elementor-widget-heading" data-id="32ee91e" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Services</h5>				</div>
				<div class="elementor-element elementor-element-0ec82a9 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="0ec82a9" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Self-drive rental</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Chauffeur service</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Airport transfer</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Corporate rental</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Wedding transport</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/services/">

											<span class="elementor-icon-list-text">Travel assistance</span>
											</a></li>
						</ul>
						</div>
				</div>
		<div class="elementor-element elementor-element-747b5a9 e-con-full e-flex e-con e-child" data-id="747b5a9" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-26aceee elementor-widget elementor-widget-heading" data-id="26aceee" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h5 class="elementor-heading-title elementor-size-default">Support</h5>				</div>
				<div class="elementor-element elementor-element-ef9dbf7 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="ef9dbf7" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/faq/">

											<span class="elementor-icon-list-text">Help center</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/faq/">

											<span class="elementor-icon-list-text">Rental requirements</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/car-listing/">

											<span class="elementor-icon-list-text">Booking guide</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="#preview-info">

											<span class="elementor-icon-list-text">Payment options</span>
											</a></li>
								<li class="elementor-icon-list-item">
											<a href="/faq/">

											<span class="elementor-icon-list-text">Cancellation policy</span>
											</a></li>
						</ul>
						</div>
				</div>
		<div class="elementor-element elementor-element-3bcef97 e-con-full e-flex e-con e-child" data-id="3bcef97" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-81a5f36 elementor-widget elementor-widget-heading" data-id="81a5f36" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Get the latest Nusavo promotions and travel ideas sent straight to your inbox.</div>				</div>
				<div class="elementor-element elementor-element-703bea5 elementor-button-align-stretch elementor-widget elementor-widget-form" data-id="703bea5" data-element_type="widget" data-e-type="widget" data-widget_type="form.default">
							<form class="elementor-form" method="post" name="New Form" aria-label="New Form" onsubmit={submitForm}>
			
			
			

							
			
			<div class="elementor-form-fields-wrapper elementor-labels-">
								<div class="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-100 elementor-field-required">
												<label for="form-field-email" class="elementor-field-label elementor-screen-only">
								Email							</label>
														<input size="1" type="email" name="form_fields[email]" id="form-field-email" class="elementor-field elementor-size-sm  elementor-field-textual" placeholder="Enter your email address" required>
											</div>
								<div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
					<button class="elementor-button elementor-size-sm" type="submit">
						<span class="elementor-button-content-wrapper">
															<span class="elementor-button-icon">
									<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-envelope-simple"></i>																	</span>
																						<span class="elementor-button-text">Join newsletter</span>
													</span>
					</button>
				</div>
			</div>
		</form>
						</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-0a94f8e e-flex e-con-boxed e-con e-parent" data-id="0a94f8e" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-833f543 elementor-widget elementor-widget-heading" data-id="833f543" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Copyright © 2026 nusavo, All rights reserved. Powered by MoxCreative.</div>				</div>
				<div class="elementor-element elementor-element-86ebc38 elementor-icon-list--layout-inline elementor-mobile-align-center elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="86ebc38" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items elementor-inline-items">
							<li class="elementor-icon-list-item elementor-inline-item">
											<a href="/faq/">

											<span class="elementor-icon-list-text">Terms and conditions</span>
											</a></li>
								<li class="elementor-icon-list-item elementor-inline-item">
											<a href="/faq/">

												<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Privacy policy</span>
											</a></li>
								<li class="elementor-icon-list-item elementor-inline-item">
											<a href="/faq/">

												<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Cookie policy</span>
											</a></li>
						</ul>
						</div>
					</div>
				</div>
				</footer>
		

			
				
	


































