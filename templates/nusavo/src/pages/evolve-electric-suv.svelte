<script>import { submitForm } from '../interactions.js';import {carousel} from '../carousel.js';import Cart from '../Cart.svelte';import OrderSummary from '../OrderSummary.svelte';</script>
<svelte:head><title>Evolve Electric SUV – Nusavo</title><link rel="stylesheet" href="/assets/f1e92a7457-style.min.css" media="all"/>
<link rel="stylesheet" href="/assets/6a53d6dbfb-photoswipe.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c4bb2ef6f6-default-skin.min.css" media="all"/>
<link rel="stylesheet" href="/assets/e0ef1f19df-woocommerce-layout.css" media="all"/>
<link rel="stylesheet" href="/assets/dc0dc3919f-woocommerce-smallscreen.css" media="only screen and (max-width: 768px)"/>
<link rel="stylesheet" href="/assets/56b71e1803-woocommerce.css" media="all"/>
<link rel="stylesheet" href="/assets/d3bbadec86-template-kit-export-public.css" media="all"/>
<link rel="stylesheet" href="/assets/d3d1b024bd-brands.css" media="all"/>
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
<link rel="stylesheet" href="/assets/6997ff0368-widget-woocommerce-product-images.min.css" media="all"/>
<link rel="stylesheet" href="/assets/efd6efe4e3-widget-woocommerce-product-rating.min.css" media="all"/>
<link rel="stylesheet" href="/assets/36cd311967-widget-woocommerce-product-price.min.css" media="all"/>
<link rel="stylesheet" href="/assets/610c93ed22-widget-icon-box.min.css" media="all"/>
<link rel="stylesheet" href="/assets/993432d894-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c6d7f7ba6b-e-swiper.min.css" media="all"/>
<link rel="stylesheet" href="/assets/4d9f430b7f-widget-image-carousel.min.css" media="all"/>
<link rel="stylesheet" href="/assets/80668fad64-fadeInDown.min.css" media="all"/>
<link rel="stylesheet" href="/assets/e22f54b1fa-fadeInUp.min.css" media="all"/>
<link rel="stylesheet" href="/assets/c8038c0005-widget-rating.min.css" media="all"/>
<link rel="stylesheet" href="/assets/feb70bd47f-widget-nested-carousel.min.css" media="all"/>
<link rel="stylesheet" href="/assets/dd73b9d6b3-base-desktop.css" media="all"/>
<link rel="stylesheet" href="/assets/8b3e2aea3c-base-mobile.css" media="(max-width:767px)"/>
<link rel="stylesheet" href="/assets/aff3c77772-post-49.css" media="all"/>
<link rel="stylesheet" href="/assets/803c93c109-post-64.css" media="all"/>
<link rel="stylesheet" href="/assets/137fc6c84e-post-832.css" media="all"/>
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
<link rel="stylesheet" href="/assets/b69bcbfa35-materialdesignicons.min.css" media="all"/>
<link rel="stylesheet" href="/assets/ba0455ec8d-fluent-color.css" media="all"/>
<link rel="stylesheet" href="/assets/c1d5d88886-tabler-icons.css" media="all"/>
<link rel="stylesheet" href="/assets/f38c36ed79-wc-blocks.css" media="all"/>
<link rel="stylesheet" href="/assets/543ee46843-ekiticons.css" media="all"/>
<link rel="stylesheet" href="/styles/evolve-electric-suv.css"/></svelte:head>





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
				<div data-elementor-type="product" data-elementor-id="832" class="elementor elementor-832 elementor-location-single post-802 product type-product status-publish has-post-thumbnail product_brand-automatic product_cat-electric product_tag-electric first instock shipping-taxable purchasable product-type-simple product" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-d978255 e-flex e-con-boxed e-con e-parent" data-id="d978255" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-86faa90 e-con-full e-flex e-con e-child" data-id="86faa90" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-310a76e elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-woocommerce-product-images" data-id="310a76e" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-images.default">
					<div class="woocommerce-product-gallery woocommerce-product-gallery--with-images woocommerce-product-gallery--columns-4 images" data-columns="4" style="opacity: 1; transition: opacity .25s ease-in-out;">
	<div class="woocommerce-product-gallery__wrapper">
		<div data-thumb="https://shop.creativemox.com/nusavo/wp-content/uploads/sites/17/2026/07/9-1-100x100.jpg" data-thumb-alt="Evolve Electric SUV" class="woocommerce-product-gallery__image"><a href="/assets/bc4473e090-9-1.jpg"><img fetchpriority="high" width="600" height="600" src="/assets/1681138351-9-1-600x600.jpg" class="wp-post-image" alt="Evolve Electric SUV" data-caption="" data-src="/assets/bc4473e090-9-1.jpg" data-large_image="/assets/bc4473e090-9-1.jpg" data-large_image_width="1254" data-large_image_height="1254" decoding="async"></a></div>	</div>
</div>
				</div>
		<div class="elementor-element elementor-element-d194fc7 e-con-full e-flex e-con e-child" data-id="d194fc7" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-96da953 elementor-widget elementor-widget-woocommerce-product-title elementor-page-title elementor-widget-heading" data-id="96da953" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-title.default">
					<h3 class="product_title entry-title elementor-heading-title elementor-size-default">Evolve Electric SUV</h3>				</div>
				<div class="elementor-element elementor-element-e184c6b elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="e184c6b" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-car-front-fill"></i>						</span>
										<span class="elementor-icon-list-text">Transmission : <span>Automatic</span></span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-fuel-pump-fill"></i>						</span>
										<span class="elementor-icon-list-text">Fuel : <span>Electric</span></span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-suitcase-fill"></i>						</span>
										<span class="elementor-icon-list-text">Luggage : 4 bags</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mdi mdi mdi-car-seat"></i>						</span>
										<span class="elementor-icon-list-text">Seats: 5 passengers</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-snow2"></i>						</span>
										<span class="elementor-icon-list-text">Air Condition : Yes</span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-504a70e elementor-widget elementor-widget-woocommerce-product-short-description" data-id="504a70e" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-short-description.default">
					<div class="woocommerce-product-details__short-description">
	<p>A modern electric SUV combining quiet performance, advanced technology, and efficient everyday mobility.</p>
</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-9b0ba6a e-con-full e-flex e-con e-child" data-id="9b0ba6a" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e51bdf6 elementor-widget elementor-widget-heading" data-id="e51bdf6" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default">Descriptions</h4>				</div>
				<div class="elementor-element elementor-element-844066c elementor-widget elementor-widget-woocommerce-product-content" data-id="844066c" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-content.default">
					<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
<p>Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.</p>
<p>Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.</p>
<div style="display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0 40px; margin: 24px 0;">
<ul style="list-style: none; margin: 0; padding: 0;">
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Luxury Limousine Selection</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ High Safety and Security</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Fixed Pricing and Bonus System</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ 100% Luxurious Fleet</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Clean and Professional Service</li>
</ul>
<ul style="list-style: none; margin: 0; padding: 0;">
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Flexible Rental Options</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Professional Chauffeur Service</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Transparent Rental Pricing</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Modern and Reliable Vehicles</li>
<li style="margin-bottom: 14px; line-height: 1.6;">✅ Friendly Customer Support</li>
</ul>
</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-2d3dde3 e-con-full e-flex e-con e-child" data-id="2d3dde3" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-719113c e-con-full e-flex e-con e-child" data-id="719113c" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-941da20 elementor-widget elementor-widget-woocommerce-product-price" data-id="941da20" data-element_type="widget" data-e-type="widget" data-widget_type="woocommerce-product-price.default">
					<p class="price"><span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol" translate="no">$</span>92.00</bdi></span></p>
				</div>
				<div class="elementor-element elementor-element-cb42186 elementor-widget elementor-widget-heading" data-id="cb42186" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">per day</div>				</div>
				<div class="elementor-element elementor-element-26be2c5 elementor-widget__width-inherit elementor-widget elementor-widget-heading" data-id="26be2c5" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Additional benefits with this car rental
</div>				</div>
				<div class="elementor-element elementor-element-c41ca52 elementor-widget__width-inherit elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="c41ca52" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-fluent-color mox-fluent-color mox-fluent-color-checkmark-circle-48"></i>						</span>
										<span class="elementor-icon-list-text">Cancellation available</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-fluent-color mox-fluent-color mox-fluent-color-checkmark-circle-48"></i>						</span>
										<span class="elementor-icon-list-text">Pay at pick-up</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-fluent-color mox-fluent-color mox-fluent-color-checkmark-circle-48"></i>						</span>
										<span class="elementor-icon-list-text">Reserve with a card and save</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="mox-fluent-color mox-fluent-color mox-fluent-color-checkmark-circle-48"></i>						</span>
										<span class="elementor-icon-list-text">Online check-in</span>
									</li>
						</ul>
						</div>
				<div class="elementor-element elementor-element-f4c32f9 elementor-align-justify elementor-widget__width-inherit elementor-widget elementor-widget-button" data-id="f4c32f9" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
										<a class="elementor-button elementor-button-link elementor-size-sm" href="/cart/?add=802">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-calendar-dots"></i>			</span>
									<span class="elementor-button-text">Reserve </span>
					</span>
					</a></div>
				</div>
		<div class="elementor-element elementor-element-2992fb4 e-con-full e-flex e-con e-child" data-id="2992fb4" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-d0d4d0d elementor-widget elementor-widget-heading" data-id="d0d4d0d" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h4 class="elementor-heading-title elementor-size-default">Sales Support</h4>				</div>
				<div class="elementor-element elementor-element-b42ac55 elementor-view-stacked elementor-shape-rounded elementor-position-inline-start elementor-mobile-position-inline-start elementor-widget elementor-widget-icon-box" data-id="b42ac55" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-headphones"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Customer support						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						(888) 4000-2345					</p>
				
			</div>
			
		</div>
						</div>
				<div class="elementor-element elementor-element-4b15a41 elementor-view-stacked elementor-shape-rounded elementor-position-inline-start elementor-mobile-position-inline-start elementor-widget elementor-widget-icon-box" data-id="4b15a41" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
							<div class="elementor-icon-box-wrapper">

						<div class="elementor-icon-box-icon">
				<span class="elementor-icon">
				<i aria-hidden="true" class="mox-phosphor mox-phosphor mox-phosphor-envelope-simple"></i>				</span>
			</div>
			
						<div class="elementor-icon-box-content">

									<div class="elementor-icon-box-title">
						<span>
							Email support						</span>
					</div>
				
									<p class="elementor-icon-box-description">
						support@domain.tld					</p>
				
			</div>
			
		</div>
						</div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-aee9718 e-flex e-con-boxed e-con e-parent" data-id="aee9718" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-df54e55 elementor-widget elementor-widget-image-carousel" data-id="df54e55" data-element_type="widget" data-e-type="widget" data-widget_type="image-carousel.default" data-carousel="&#123;&quot;slides_to_show&quot;:&quot;6&quot;,&quot;slides_to_scroll&quot;:&quot;1&quot;,&quot;navigation&quot;:&quot;none&quot;,&quot;slides_to_show_tablet&quot;:&quot;5&quot;,&quot;slides_to_show_mobile&quot;:&quot;3&quot;,&quot;slides_to_scroll_tablet&quot;:&quot;1&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;infinite&quot;:&quot;yes&quot;,&quot;speed&quot;:500&#125;">
							<div class="elementor-image-carousel-wrapper swiper" role="region" aria-roledescription="carousel" aria-label="Image Carousel" dir="ltr" {@attach carousel}>
			<div class="elementor-image-carousel swiper-wrapper" aria-live="off">
								<div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/30a2b61c77-logo-1.png" alt="logo-1.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/209a201d7d-logo-2.png" alt="logo-2.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/f1c38936c6-logo-3.png" alt="logo-3.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="4 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/a7724a4168-logo-4.png" alt="logo-4.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="5 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/aead7cc8ed-logo-5.png" alt="logo-5.png"></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="6 of 6"><figure class="swiper-slide-inner"><img class="swiper-slide-image" src="/assets/28178c1722-logo-11.png" alt="logo-11.png"></figure></div>			</div>
							
									</div>
						</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-4492cc14 e-flex e-con-boxed e-con e-parent" data-id="4492cc14" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-88ad62a e-con-full e-flex e-con e-child" data-id="88ad62a" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3a8f5907  elementor-widget elementor-widget-heading" data-id="3a8f5907" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Start driving with 15% off</div>				</div>
				<div class="elementor-element elementor-element-f6c1850  elementor-widget elementor-widget-heading" data-id="f6c1850" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Register as a new member and unlock instant savings on your first Nusavo rental.</div>				</div>
				<div class="elementor-element elementor-element-a55c82b  elementor-widget elementor-widget-button" data-id="a55c82b" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
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
		<div class="elementor-element elementor-element-a1202d0 e-flex e-con-boxed e-con e-parent" data-id="a1202d0" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-524eb752 e-flex e-con-boxed e-con e-child" data-id="524eb752" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-188deac  elementor-widget elementor-widget-heading" data-id="188deac" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h6 class="elementor-heading-title elementor-size-default">Testimonial</h6>				</div>
				<div class="elementor-element elementor-element-3daaee00 elementor-widget elementor-widget-heading" data-id="3daaee00" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<h2 class="elementor-heading-title elementor-size-default">Real stories from travelers who trust Nusavo every time</h2>				</div>
					</div>
				</div>
				<div class="elementor-element elementor-element-7c1ae099 elementor-pagination-type-bullets elementor-arrows-position-inside elementor-pagination-position-outside elementor-widget elementor-widget-n-carousel" data-id="7c1ae099" data-element_type="widget" data-e-type="widget" data-widget_type="nested-carousel.default" data-carousel="&#123;&quot;carousel_items&quot;:[&#123;&quot;slide_title&quot;:&quot;Testimonial 1&quot;,&quot;_id&quot;:&quot;38e08bd&quot;&#125;,&#123;&quot;slide_title&quot;:&quot;Testimonial 2&quot;,&quot;_id&quot;:&quot;94b6237&quot;&#125;,&#123;&quot;slide_title&quot;:&quot;Testimonial 3&quot;,&quot;_id&quot;:&quot;452d183&quot;&#125;],&quot;slides_to_show&quot;:&quot;3&quot;,&quot;image_spacing_custom_tablet&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:20,&quot;sizes&quot;:[]&#125;,&quot;image_spacing_custom&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:20,&quot;sizes&quot;:[]&#125;,&quot;slides_to_show_tablet&quot;:&quot;2&quot;,&quot;slides_to_show_mobile&quot;:&quot;1&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;infinite&quot;:&quot;yes&quot;,&quot;speed&quot;:500,&quot;offset_sides&quot;:&quot;none&quot;,&quot;arrows&quot;:&quot;yes&quot;,&quot;pagination&quot;:&quot;bullets&quot;,&quot;image_spacing_custom_mobile&quot;:&#123;&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]&#125;&#125;">
							<div class="e-n-carousel swiper" role="region" aria-roledescription="carousel" aria-label="Carousel" dir="ltr" {@attach carousel}>
			<div class="swiper-wrapper" aria-live="off">
										<div class="swiper-slide" data-slide="1" role="group" aria-roledescription="slide" aria-label="1 of 3">
							<div class="elementor-element elementor-element-1154974 e-flex e-con-boxed e-con e-child" data-id="1154974" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-4752bcd5 elementor-view-default elementor-widget elementor-widget-icon" data-id="4752bcd5" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-6fca60d5 elementor-widget elementor-widget-rating" data-id="6fca60d5" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
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
				<div class="elementor-element elementor-element-2e191fd5 elementor-widget elementor-widget-heading" data-id="2e191fd5" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">Booking with Nusavo was quick, clear, and completely stress-free. The car was clean, comfortable, and ready exactly when promised. Their reliable service made my entire business trip much easier.</div>				</div>
				<div class="elementor-element elementor-element-273628f2 elementor-widget elementor-widget-image" data-id="273628f2" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img src="/assets/f6bcbeb1f8-1-1.jpg" title="1.jpg" alt="1.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-637d114f elementor-widget elementor-widget-icon-box" data-id="637d114f" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
							<div class="elementor-element elementor-element-5cc02e9a e-flex e-con-boxed e-con e-child" data-id="5cc02e9a" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-1ac2495d elementor-view-default elementor-widget elementor-widget-icon" data-id="1ac2495d" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-74e155d7 elementor-widget elementor-widget-rating" data-id="74e155d7" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
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
				<div class="elementor-element elementor-element-4abda8e1 elementor-widget elementor-widget-heading" data-id="4abda8e1" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">The car was ideal for our long road trip and handled every route comfortably. Pickup and return were both fast and straightforward. Nusavo made the whole adventure much more enjoyable.</div>				</div>
				<div class="elementor-element elementor-element-19d7f8e5 elementor-widget elementor-widget-image" data-id="19d7f8e5" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img src="/assets/853a95463b-15-1.jpg" title="15.jpg" alt="15.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-2aaeec49 elementor-widget elementor-widget-icon-box" data-id="2aaeec49" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
							<div class="elementor-element elementor-element-9c1e2ac e-flex e-con-boxed e-con e-child" data-id="9c1e2ac" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-5cfd51c7 elementor-view-default elementor-widget elementor-widget-icon" data-id="5cfd51c7" data-element_type="widget" data-e-type="widget" data-widget_type="icon.default">
							<div class="elementor-icon-wrapper">
			<div class="elementor-icon">
			<i aria-hidden="true" class="mox-bootstrap mox-bootstrap mox-bootstrap-quote"></i>			</div>
		</div>
						</div>
				<div class="elementor-element elementor-element-6d9bdcaf elementor-widget elementor-widget-rating" data-id="6d9bdcaf" data-element_type="widget" data-e-type="widget" data-widget_type="rating.default">
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
				<div class="elementor-element elementor-element-3f130f25 elementor-widget elementor-widget-heading" data-id="3f130f25" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
					<div class="elementor-heading-title elementor-size-default">I was impressed by how simple the entire booking process felt. The vehicle was spotless, comfortable, and performed perfectly during the trip. Nusavo delivered a rental experience I could trust.
</div>				</div>
				<div class="elementor-element elementor-element-4a1d74bf elementor-widget elementor-widget-image" data-id="4a1d74bf" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
															<img src="/assets/cccb3d1303-2-1.jpg" title="2.jpg" alt="2.jpg" loading="eager">															</div>
				<div class="elementor-element elementor-element-12aae793 elementor-widget elementor-widget-icon-box" data-id="12aae793" data-element_type="widget" data-e-type="widget" data-widget_type="icon-box.default">
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
		

			
			

	
	
































