<script>import { submitForm } from '../interactions.js';import {carousel} from '../carousel.js';import Cart from '../Cart.svelte';import OrderSummary from '../OrderSummary.svelte';</script>
<svelte:head><title>Services – Nusavo</title><link rel="stylesheet" href="/assets/e0ef1f19df-woocommerce-layout.css" media="all"/>
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
<link rel="stylesheet" href="/assets/e22f54b1fa-fadeInUp.min.css" media="all"/>
<link rel="stylesheet" href="/assets/610c93ed22-widget-icon-box.min.css" media="all"/>
<link rel="stylesheet" href="/assets/80668fad64-fadeInDown.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c8038c0005-widget-rating.min.css" media="all"/>
<link rel="stylesheet" href="/assets/993432d894-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c6d7f7ba6b-e-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/feb70bd47f-widget-nested-carousel.min.css" media="all"/>
<link rel="stylesheet" href="/assets/d5852b4e70-post-615.css" media="all"/>
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
<link rel="stylesheet" href="/assets/61bdf4d9f6-bootstrap-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/c1d5d88886-tabler-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/590680e632-iconoir.css" media="all"/>
<link rel="stylesheet" href="/assets/619553c0c9-lucide.css" media="all"/>
<link rel="stylesheet" href="/assets/f38c36ed79-wc-blocks.css" media="all"/>
<link rel="stylesheet" href="/assets/543ee46843-ekiticons.css" media="all"/>
<link rel="stylesheet" href="/styles/services.css"/></svelte:head>





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
<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-38"><a href="/services/" aria-current="page" class="elementor-item elementor-item-active">Services</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-39"><a href="/car-listing/" class="elementor-item">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
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
<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-38"><a href="/services/" aria-current="page" class="elementor-item elementor-item-active" tabindex="-1">Services</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-39"><a href="/car-listing/" class="elementor-item" tabindex="-1">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
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
				<div data-elementor-type="wp-page" data-elementor-id="615" class="elementor elementor-615" data-elementor-post-type="page">
				<div class="elementor-element elementor-element-4ad8c44f e-flex e-con-boxed e-con e-parent" data-id="4ad8c44f" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-585ce17  elementor-widget elementor-widget-heading" data-id="585ce17" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h1 class="elementor-heading-title elementor-size-default">Services</h1>				</div>
				<div class="elementor-element elementor-element-27ca7b80 elementor-widget__width-initial elementor-widget-mobile__width-inherit  elementor-widget elementor-widget-heading" data-id="27ca7b80" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default">Reliable solutions for easier travel experiences</h4>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-a263275 e-con-full e-flex e-con e-parent" data-id="a263275" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-9877f23 e-con-full e-flex  e-con e-child" data-id="9877f23" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e408058  elementor-widget elementor-widget-heading" data-id="e408058" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Meet Our Team</h6>				</div>
				<div class="elementor-element elementor-element-2347b22 elementor-widget elementor-widget-heading" data-id="2347b22" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Reliable solutions for easier travel experiences</h2>				</div>
				<div class="elementor-element elementor-element-2f2283b elementor-widget elementor-widget-heading" data-id="2f2283b" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Scelerisque cras aptent pellentesque odio nulla purus conubia condimentum egestas finibus leo. Vulputate hac mollis potenti urna vestibulum euismod diam. Finibus penatibus bibendum et dis vitae.</div>				</div>
		<div class="elementor-element elementor-element-ebd53c9 e-con-full e-flex e-con e-child" data-id="ebd53c9" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-48a6bd1 elementor-widget elementor-widget-button" data-id="48a6bd1" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="#preview-info">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Discover more</span>
					</span>
					</a></div>
				</div>
				</div>
				<div class="elementor-element elementor-element-ae2d978 elementor-widget__width-initial elementor-widget-mobile__width-inherit  elementor-widget elementor-widget-image" data-id="ae2d978" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img fetchpriority="high" decoding="async" width="2550" height="1275" src="/assets/008894034d-img_11.jpg" class="attachment-full size-full wp-image-624" alt="">															</div>
				</div>
		<div class="elementor-element elementor-element-2c5207e e-flex e-con-boxed e-con e-parent" data-id="2c5207e" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-5f2e980d e-flex e-con-boxed e-con e-child" data-id="5f2e980d" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-4f384214  elementor-widget elementor-widget-heading" data-id="4f384214" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Meet Our Team</h6>				</div>
				<div class="elementor-element elementor-element-a7d575c  elementor-widget elementor-widget-heading" data-id="a7d575c" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Experienced experts committed to your safety and travel comfort</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-37f1e71 e-con-full e-grid e-con e-child" data-id="37f1e71" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-0742234 e-con-full e-flex  e-con e-child" data-id="0742234" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-ec060ba elementor-widget elementor-widget-image" data-id="ec060ba" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img decoding="async" width="1067" height="640" src="/assets/ad97c70af9-img_10.jpg" class="attachment-full size-full wp-image-495" alt="">															</div>
		<div class="elementor-element elementor-element-b53d057 e-con-full e-flex e-con e-child" data-id="b53d057" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6be4df5 elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="6be4df5" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-user"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Self-drive rental						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-98023e2 elementor-widget elementor-widget-button" data-id="98023e2" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
		<div class="elementor-element elementor-element-903afb7 e-con-full e-flex  e-con e-child" data-id="903afb7" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-9589bb8 elementor-widget elementor-widget-image" data-id="9589bb8" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img decoding="async" width="640" height="384" src="/assets/7120b325a2-img_13.jpg" class="attachment-full size-full wp-image-670" alt="">															</div>
		<div class="elementor-element elementor-element-9f75f64 e-con-full e-flex e-con e-child" data-id="9f75f64" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-c567443 elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="c567443" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-police-car"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Chauffeur service						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-077ff56 elementor-widget elementor-widget-button" data-id="077ff56" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
		<div class="elementor-element elementor-element-16f544a e-con-full e-flex  e-con e-child" data-id="16f544a" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3198c46 elementor-widget elementor-widget-image" data-id="3198c46" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" decoding="async" width="640" height="384" src="/assets/42284f24c6-img_14.jpg" class="attachment-full size-full wp-image-671" alt="">															</div>
		<div class="elementor-element elementor-element-44f09ba e-con-full e-flex e-con e-child" data-id="44f09ba" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e532d2c elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="e532d2c" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-airplane-tilt"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Airport transfer						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-d31e1de elementor-widget elementor-widget-button" data-id="d31e1de" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
		<div class="elementor-element elementor-element-15e7481 e-con-full e-flex  e-con e-child" data-id="15e7481" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-f9d5c3e elementor-widget elementor-widget-image" data-id="f9d5c3e" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" decoding="async" width="640" height="384" src="/assets/4d1909f67f-img_15.jpg" class="attachment-full size-full wp-image-672" alt="">															</div>
		<div class="elementor-element elementor-element-d31d915 e-con-full e-flex e-con e-child" data-id="d31d915" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-cb940b3 elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="cb940b3" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-briefcase"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Corporate rental						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-beba287 elementor-widget elementor-widget-button" data-id="beba287" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
		<div class="elementor-element elementor-element-446baf1 e-con-full e-flex  e-con e-child" data-id="446baf1" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-58822d4 elementor-widget elementor-widget-image" data-id="58822d4" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" decoding="async" width="640" height="384" src="/assets/f6657e76fe-img_16.jpg" class="attachment-full size-full wp-image-673" alt="">															</div>
		<div class="elementor-element elementor-element-c76592d e-con-full e-flex e-con e-child" data-id="c76592d" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-4f37688 elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="4f37688" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-flower-tulip"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Wedding transport						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-1181bf7 elementor-widget elementor-widget-button" data-id="1181bf7" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
		<div class="elementor-element elementor-element-b283481 e-con-full e-flex  e-con e-child" data-id="b283481" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-d01a23b elementor-widget elementor-widget-image" data-id="d01a23b" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img loading="eager" decoding="async" width="640" height="384" src="/assets/16c9f2d8ec-img_17.jpg" class="attachment-full size-full wp-image-674" alt="">															</div>
		<div class="elementor-element elementor-element-313e432 e-con-full e-flex e-con e-child" data-id="313e432" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-066faea elementor-view-stacked elementor-shape-circle elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="066faea" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-backpack"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Travel assistance						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Taciti semper lacinia conubia litora senectus viverra mus tempor nascetur sapien porttitor magna etiam in					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-32ac55a elementor-widget elementor-widget-button" data-id="32ac55a" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-30fdeb3e e-flex e-con-boxed e-con e-parent" data-id="30fdeb3e" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-5a437e56 e-flex e-con-boxed e-con e-child" data-id="5a437e56" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-744e5b0a  elementor-widget elementor-widget-heading" data-id="744e5b0a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Why Choose Us</h6>				</div>
				<div class="elementor-element elementor-element-75aa1a13  elementor-widget elementor-widget-heading" data-id="75aa1a13" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Better rental experiences built around your travel needs</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-22b019e e-con-full e-grid e-con e-child" data-id="22b019e" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-7b0ad6a e-con-full e-flex  e-con e-child" data-id="7b0ad6a" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-f9e10c2 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="f9e10c2" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-2f7bbf7 elementor-widget elementor-widget-button" data-id="2f7bbf7" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-2fc9660 e-con-full e-flex  e-con e-child" data-id="2fc9660" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-1490695 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="1490695" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-e4b1a90 elementor-widget elementor-widget-button" data-id="e4b1a90" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-e3f8536 e-con-full e-flex  e-con e-child" data-id="e3f8536" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-7135a5f elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="7135a5f" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-d75d466 elementor-widget elementor-widget-button" data-id="d75d466" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-f638d8b e-con-full e-flex  e-con e-child" data-id="f638d8b" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-7998c22 elementor-view-default elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="7998c22" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-1e8dbf4 elementor-widget elementor-widget-button" data-id="1e8dbf4" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a></div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-119fa55b e-flex e-con-boxed e-con e-parent" data-id="119fa55b" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-1eb746e3 e-flex e-con-boxed e-con e-child" data-id="1eb746e3" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-7543f1d0  elementor-widget elementor-widget-heading" data-id="7543f1d0" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Testimonial</h6>				</div>
				<div class="elementor-element elementor-element-3ea79c27 elementor-widget elementor-widget-heading" data-id="3ea79c27" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Real stories from travelers who trust Nusavo every time</h2>				</div>
					</div>
				</div>
				<div class="elementor-element elementor-element-78dcc38c elementor-pagination-type-bullets elementor-arrows-position-inside elementor-pagination-position-outside elementor-widget elementor-widget-n-carousel" data-id="78dcc38c" data-element_type="widget" data-e-type="widget" data-widget_type="nested-carousel.default" data-carousel="&#123;&quot;carousel_items&quot;:[&#123;&quot;slide_title&quot;:&quot;Testimonial 1&quot;,&quot;_id&quot;:&quot;38e08bd&quot;&#125;,&#123;&quot;slide_title&quot;:&quot;Testimonial 2&quot;,&quot;_id&quot;:&quot;94b6237&quot;&#125;,&#123;&quot;slide_title&quot;:&quot;Testimonial 3&quot;,&quot;_id&quot;:&quot;452d183&quot;&#125;],&quot;slides_to_show&quot;:&quot;3&quot;,&quot;image_spacing_custom_tablet&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:20,&quot;sizes&quot;:[]&#125;,&quot;image_spacing_custom&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:20,&quot;sizes&quot;:[]&#125;,&quot;slides_to_show_tablet&quot;:&quot;2&quot;,&quot;slides_to_show_mobile&quot;:&quot;1&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;infinite&quot;:&quot;yes&quot;,&quot;speed&quot;:500,&quot;offset_sides&quot;:&quot;none&quot;,&quot;arrows&quot;:&quot;yes&quot;,&quot;pagination&quot;:&quot;bullets&quot;,&quot;image_spacing_custom_mobile&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]&#125;&#125;">
							<div class="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr" {@attach carousel}>
			<div class="swiper-wrapper" aria-live="off">
										<div class="swiper-slide" data-slide="1" role="group" aria-roledescription="slide" aria-label="1 of 3">
							<div class="elementor-element elementor-element-1c290910 e-flex e-con-boxed e-con e-child" data-id="1c290910" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-58500f3b elementor-view-default elementor-widget elementor-widget-icon" data-id="58500f3b" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-3a5a2492 elementor-widget elementor-widget-rating" data-id="3a5a2492" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
							<div class="e-rating" itemtype="https://schema.org/Rating" itemscope="" itemprop="reviewRating">
			<meta itemprop="worstRating" content="0">
			<meta itemprop="bestRating" content="5">
			<div class="e-rating-wrapper" itemprop="ratingValue" content="4" role="img" aria-label="Rated 4 out of 5">
							<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked" style="--e-rating-icon-marked-width: 0%;">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-32cdd8d elementor-widget elementor-widget-heading" data-id="32cdd8d" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Booking with Nusavo was quick, clear, and completely stress-free. The car was clean, comfortable, and ready exactly when promised. Their reliable service made my entire business trip much easier.</div>				</div>
				<div class="elementor-element elementor-element-4b575dbb elementor-widget elementor-widget-image" data-id="4b575dbb" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img decoding="async" src="/assets/f6bcbeb1f8-1-1.jpg" title="1.jpg" alt="1.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-331e0c26 elementor-widget elementor-widget-icon-box" data-id="331e0c26" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Daniel R.						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Software Engineer
					</p>
				
			</div>
			
		</div>
						</div>
					</div>
				</div>
								</div>
											<div class="swiper-slide" data-slide="2" role="group" aria-roledescription="slide" aria-label="2 of 3">
							<div class="elementor-element elementor-element-381cbeac e-flex e-con-boxed e-con e-child" data-id="381cbeac" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-2859caec elementor-view-default elementor-widget elementor-widget-icon" data-id="2859caec" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-14edf3a2 elementor-widget elementor-widget-rating" data-id="14edf3a2" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
							<div class="e-rating" itemtype="https://schema.org/Rating" itemscope="" itemprop="reviewRating">
			<meta itemprop="worstRating" content="0">
			<meta itemprop="bestRating" content="5">
			<div class="e-rating-wrapper" itemprop="ratingValue" content="4" role="img" aria-label="Rated 4 out of 5">
							<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked" style="--e-rating-icon-marked-width: 0%;">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-902482f elementor-widget elementor-widget-heading" data-id="902482f" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">The car was ideal for our long road trip and handled every route comfortably. Pickup and return were both fast and straightforward. Nusavo made the whole adventure much more enjoyable.</div>				</div>
				<div class="elementor-element elementor-element-34ea8cd6 elementor-widget elementor-widget-image" data-id="34ea8cd6" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img decoding="async" src="/assets/853a95463b-15-1.jpg" title="15.jpg" alt="15.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-6c00e651 elementor-widget elementor-widget-icon-box" data-id="6c00e651" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Sarah M.						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Marketing Director
					</p>
				
			</div>
			
		</div>
						</div>
					</div>
				</div>
								</div>
											<div class="swiper-slide" data-slide="3" role="group" aria-roledescription="slide" aria-label="3 of 3">
							<div class="elementor-element elementor-element-1ef21d37 e-flex e-con-boxed e-con e-child" data-id="1ef21d37" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-28e9746b elementor-view-default elementor-widget elementor-widget-icon" data-id="28e9746b" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-59d803bc elementor-widget elementor-widget-rating" data-id="59d803bc" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
							<div class="e-rating" itemtype="https://schema.org/Rating" itemscope="" itemprop="reviewRating">
			<meta itemprop="worstRating" content="0">
			<meta itemprop="bestRating" content="5">
			<div class="e-rating-wrapper" itemprop="ratingValue" content="4" role="img" aria-label="Rated 4 out of 5">
							<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						<div class="e-icon">
				<div class="e-icon-wrapper e-icon-marked" style="--e-rating-icon-marked-width: 0%;">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
				<div class="e-icon-wrapper e-icon-unmarked">
					<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-star-fill"></i>				</div>
			</div>
						</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-49aa9986 elementor-widget elementor-widget-heading" data-id="49aa9986" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">I was impressed by how simple the entire booking process felt. The vehicle was spotless, comfortable, and performed perfectly during the trip. Nusavo delivered a rental experience I could trust.
</div>				</div>
				<div class="elementor-element elementor-element-71056e04 elementor-widget elementor-widget-image" data-id="71056e04" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img decoding="async" src="/assets/cccb3d1303-2-1.jpg" title="2.jpg" alt="2.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-25056d78 elementor-widget elementor-widget-icon-box" data-id="25056d78" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Emma L.						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						Entrepreneur					</p>
				
			</div>
			
		</div>
						</div>
					</div>
				</div>
								</div>
								</div>
		</div>
					<div class="elementor-swiper-button elementor-swiper-button-prev" role="button" tabindex="0" aria-label="Previous">
				<i aria-hidden="true" class="mox-tabler mox-tabler mox-tabler-square-rounded-chevron-left"></i>			</div>
			<div class="elementor-swiper-button elementor-swiper-button-next" role="button" tabindex="0" aria-label="Next">
				<i aria-hidden="true" class="mox-tabler mox-tabler mox-tabler-square-rounded-chevron-right"></i>			</div>
					<div class="swiper-pagination"></div>
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
		

			
				
	
































