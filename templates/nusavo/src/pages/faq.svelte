<script>import { submitForm } from '../interactions.js';import {carousel} from '../carousel.js';import Cart from '../Cart.svelte';import OrderSummary from '../OrderSummary.svelte';</script>
<svelte:head><title>FAQ – Nusavo</title><link rel="stylesheet" href="/assets/e0ef1f19df-woocommerce-layout.css" media="all"/>
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
<link rel="stylesheet" href="/assets/2f96ba9562-widget-nested-accordion.min.css" media="all"/>
<link rel="stylesheet" href="/assets/80668fad64-fadeInDown.min.css" media="all"/>
<link rel="stylesheet" href="/assets/610c93ed22-widget-icon-box.min.css" media="all"/>
<link rel="stylesheet" href="/assets/617f2271fb-post-232.css" media="all"/>
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
<link rel="stylesheet" href="/assets/619553c0c9-lucide.css" media="all"/>
<link rel="stylesheet" href="/assets/61bdf4d9f6-bootstrap-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/3e9e95528f-phosphor-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/590680e632-iconoir.css" media="all"/>
<link rel="stylesheet" href="/assets/f38c36ed79-wc-blocks.css" media="all"/>
<link rel="stylesheet" href="/assets/543ee46843-ekiticons.css" media="all"/>
<link rel="stylesheet" href="/styles/faq.css"/></svelte:head>





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
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-39"><a href="/car-listing/" class="elementor-item">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40"><a href="/car-listing/urbango-hatchback/" class="elementor-sub-item">Single Listing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-41"><a href="/contact-us/" class="elementor-item">Contact us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-47"><a href="#preview-info" class="elementor-item elementor-item-anchor">Pages<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-42"><a href="/faq/" aria-current="page" class="elementor-sub-item elementor-item-active">FAQ</a></li>
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
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-39"><a href="/car-listing/" class="elementor-item" tabindex="-1">Car Listing<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-40"><a href="/car-listing/urbango-hatchback/" class="elementor-sub-item" tabindex="-1">Single Listing</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-41"><a href="/contact-us/" class="elementor-item" tabindex="-1">Contact us</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom current-menu-ancestor current-menu-parent menu-item-has-children menu-item-47"><a href="#preview-info" class="elementor-item elementor-item-anchor" tabindex="-1">Pages<span class="sub-arrow"><svg aria-hidden="true" class="e-font-icon-svg e-fas-angle-down" viewBox="0 0 320 512"><path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0L160 256.2l96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.3 9.4-24.5 9.4-33.9 0z"></path></svg></span></a><ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom  menu-item-42"><a href="/faq/" aria-current="page" class="elementor-sub-item elementor-item-active" tabindex="-1">FAQ</a></li>
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
				<div data-elementor-type="wp-page" data-elementor-id="232" class="elementor elementor-232" data-elementor-post-type="page">
				<div class="elementor-element elementor-element-52cd6db4 e-flex e-con-boxed e-con e-parent" data-id="52cd6db4" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-4c6b7c41  elementor-widget elementor-widget-heading" data-id="4c6b7c41" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h1 class="elementor-heading-title elementor-size-default">FAQ</h1>				</div>
				<div class="elementor-element elementor-element-15423c67 elementor-widget__width-initial elementor-widget-mobile__width-inherit  elementor-widget elementor-widget-heading" data-id="15423c67" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default">Find helpful answers for your car rental journey</h4>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-16c5dca e-flex e-con-boxed e-con e-parent" data-id="16c5dca" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-271e96b e-flex e-con-boxed e-con e-child" data-id="271e96b" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-90614cf  elementor-widget elementor-widget-heading" data-id="90614cf" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Common Questions</h6>				</div>
				<div class="elementor-element elementor-element-ccac759  elementor-widget elementor-widget-heading" data-id="ccac759" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Learn everything before booking your next rental vehicle</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-fda1553 e-con-full e-grid e-con e-child" data-id="fda1553" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-dd3c8d4  elementor-widget elementor-widget-n-accordion" data-id="dd3c8d4" data-element_type="widget" data-e-type="widget" data-widget_type="nested-accordion.default">
							<div class="e-n-accordion" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
						<details id="e-n-accordion-item-2310" class="e-n-accordion-item" open>
				<summary class="e-n-accordion-item-title" data-accordion-index="1" tabindex="0" aria-controls="e-n-accordion-item-2310">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Odio arcu consectetur quisque venenatis habitasse torquent facilisis elit id? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2310" class="elementor-element elementor-element-87e1865 e-con-full e-flex e-con e-child" data-id="87e1865" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-dca0b76 elementor-widget elementor-widget-text-editor" data-id="dca0b76" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-2311" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="2" tabindex="0" aria-controls="e-n-accordion-item-2311">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Finibus enim maximus porta scelerisque augue nisi eleifend? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2311" class="elementor-element elementor-element-529b26f e-con-full e-flex e-con e-child" data-id="529b26f" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-8355d7b elementor-widget elementor-widget-text-editor" data-id="8355d7b" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-2312" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="3" tabindex="0" aria-controls="e-n-accordion-item-2312">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Letius fermentum cras in etiam dui sem tincidunt? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2312" class="elementor-element elementor-element-c4e2413 e-con-full e-flex e-con e-child" data-id="c4e2413" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-64f2486 elementor-widget elementor-widget-text-editor" data-id="64f2486" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-2313" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="4" tabindex="0" aria-controls="e-n-accordion-item-2313">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Nunc lacinia est sapien pretium hendrerit placerat nam? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2313" class="elementor-element elementor-element-d98026e e-con-full e-flex e-con e-child" data-id="d98026e" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-df6aacd elementor-widget elementor-widget-text-editor" data-id="df6aacd" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-2314" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="5" tabindex="0" aria-controls="e-n-accordion-item-2314">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Adipiscing pretium mattis habitant lectus non elit sem? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2314" class="elementor-element elementor-element-ac4eee4 e-con-full e-flex e-con e-child" data-id="ac4eee4" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-bf1e4a8 elementor-widget elementor-widget-text-editor" data-id="bf1e4a8" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-2315" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="6" tabindex="0" aria-controls="e-n-accordion-item-2315">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Est cras pretium odio ante hendrerit accumsan tristique? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-2315" class="elementor-element elementor-element-bfbedc0 e-con-full e-flex e-con e-child" data-id="bfbedc0" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-31f6186 elementor-widget elementor-widget-text-editor" data-id="31f6186" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
					</div>
					
							</div>
				<div class="elementor-element elementor-element-37a8dde  elementor-widget elementor-widget-n-accordion" data-id="37a8dde" data-element_type="widget" data-e-type="widget" data-widget_type="nested-accordion.default">
							<div class="e-n-accordion" aria-label="Accordion. Open links with Enter or Space, close with Escape, and navigate with Arrow Keys">
						<details id="e-n-accordion-item-5830" class="e-n-accordion-item" open>
				<summary class="e-n-accordion-item-title" data-accordion-index="1" tabindex="0" aria-controls="e-n-accordion-item-5830">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Odio arcu consectetur quisque venenatis habitasse torquent facilisis elit id? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5830" class="elementor-element elementor-element-ea3ce72 e-con-full e-flex e-con e-child" data-id="ea3ce72" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a79667b elementor-widget elementor-widget-text-editor" data-id="a79667b" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-5831" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="2" tabindex="0" aria-controls="e-n-accordion-item-5831">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Finibus enim maximus porta scelerisque augue nisi eleifend? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5831" class="elementor-element elementor-element-0cbfca7 e-con-full e-flex e-con e-child" data-id="0cbfca7" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3f20ddf elementor-widget elementor-widget-text-editor" data-id="3f20ddf" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-5832" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="3" tabindex="0" aria-controls="e-n-accordion-item-5832">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Letius fermentum cras in etiam dui sem tincidunt? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5832" class="elementor-element elementor-element-793ca68 e-con-full e-flex e-con e-child" data-id="793ca68" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-30d9cb5 elementor-widget elementor-widget-text-editor" data-id="30d9cb5" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-5833" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="4" tabindex="0" aria-controls="e-n-accordion-item-5833">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Nunc lacinia est sapien pretium hendrerit placerat nam? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5833" class="elementor-element elementor-element-76a4924 e-con-full e-flex e-con e-child" data-id="76a4924" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-9b1d42a elementor-widget elementor-widget-text-editor" data-id="9b1d42a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-5834" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="5" tabindex="0" aria-controls="e-n-accordion-item-5834">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Adipiscing pretium mattis habitant lectus non elit sem? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5834" class="elementor-element elementor-element-677e5b5 e-con-full e-flex e-con e-child" data-id="677e5b5" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-2437495 elementor-widget elementor-widget-text-editor" data-id="2437495" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
						<details id="e-n-accordion-item-5835" class="e-n-accordion-item">
				<summary class="e-n-accordion-item-title" data-accordion-index="6" tabindex="0" aria-controls="e-n-accordion-item-5835">
					<span class="e-n-accordion-item-title-header"><div class="e-n-accordion-item-title-text"> Est cras pretium odio ante hendrerit accumsan tristique? </div></span>
							<span class="e-n-accordion-item-title-icon">
			<span class="e-opened"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-down"></i></span>
			<span class="e-closed"><i aria-hidden="true" class="mox-lucide mox-lucide mox-lucide-chevron-up"></i></span>
		</span>

						</summary>
				<div role="region" aria-labelledby="e-n-accordion-item-5835" class="elementor-element elementor-element-6855fa2 e-con-full e-flex e-con e-child" data-id="6855fa2" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6a5bf53 elementor-widget elementor-widget-text-editor" data-id="6a5bf53" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
									<p>Adipiscing class vel parturient curae conubia posuere. Dui laoreet quam tincidunt suscipit sem eget condimentum conubia netus fusce. Aliquam consequat blandit purus interdum potenti fermentum auctor faucibus.</p>								</div>
				</div>
					</details>
					</div>
					
							</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-e1e289e e-flex e-con-boxed e-con e-parent" data-id="e1e289e" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-80607c8 e-con-full e-flex e-con e-child" data-id="80607c8" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-52b9e10  elementor-widget elementor-widget-heading" data-id="52b9e10" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Start driving with 15% off</div>				</div>
				<div class="elementor-element elementor-element-06152c9  elementor-widget elementor-widget-heading" data-id="06152c9" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Register as a new member and unlock instant savings on your first Nusavo rental.</div>				</div>
				<div class="elementor-element elementor-element-b3818c2  elementor-widget elementor-widget-button" data-id="b3818c2" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/my-account/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>			</span>
									<span class="elementor-button-text">Get 15% off</span>
					</span>
					</a></div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-32e2131f e-flex e-con-boxed e-con e-parent" data-id="32e2131f" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-764e373e e-flex e-con-boxed e-con e-child" data-id="764e373e" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-610be51f  elementor-widget elementor-widget-heading" data-id="610be51f" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Need More Help</h6>				</div>
				<div class="elementor-element elementor-element-5fb513d7  elementor-widget elementor-widget-heading" data-id="5fb513d7" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Still need help planning your next rental journey?</h2>				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-18fd16e9 e-con-full e-grid e-con e-child" data-id="18fd16e9" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-86342bd e-con-full e-flex  e-con e-child" data-id="86342bd" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-8f3d52d elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="8f3d52d" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-b840045 elementor-align-center elementor-widget elementor-widget-button" data-id="b840045" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Chat Now!</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-c9c6c0d e-con-full e-flex  e-con e-child" data-id="c9c6c0d" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6f84679 elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="6f84679" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-9b4316c elementor-align-center elementor-widget elementor-widget-button" data-id="9b4316c" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/contact-us/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Send Ticket</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-b5f4047 e-con-full e-flex  e-con e-child" data-id="b5f4047" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-15af53e elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="15af53e" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-141c51c elementor-align-center elementor-widget elementor-widget-button" data-id="141c51c" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/services/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn More</span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-6d5d1e3 e-con-full e-flex  e-con e-child" data-id="6d5d1e3" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-dc4a76d elementor-view-stacked elementor-shape-rounded elementor-position-block-start elementor-mobile-position-block-start elementor-widget elementor-widget-icon-box" data-id="dc4a76d" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
				<div class="elementor-element elementor-element-980707f elementor-align-center elementor-widget elementor-widget-button" data-id="980707f" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
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
		

			
				
	































