import { load } from 'cheerio';

// One organized website over the preserved HTML reference; no dealer generator.
export const siteRoutes = {
  '': 'index-3',
  vehicles: 'cars-list-2',
  vehicle: 'cars-details-3',
  import: 'dealer-listing',
  'import/source': 'dealer-details',
  shop: 'shop-list',
  'shop/product': 'shop-details',
  about: 'about-us',
  services: 'services',
  membership: 'pricing',
  calculator: 'calculator',
  faq: 'faqs',
  terms: 'term',
  contact: 'contact',
  login: 'login',
  register: 'register',
  '404': '404',
  news: 'blog-grid',
  'news/article': 'blog-details',
  account: 'user-dashboard-home',
  'account/bookings': 'user-dashboard-bookings',
  'account/wishlist': 'user-dashboard-wishlist',
  'account/wallet': 'user-dashboard-wallet',
  'account/profile': 'user-dashboard-profile',
  'account/settings': 'user-dashboard-setting',
  dashboard: 'agent-dashboard-home',
  'dashboard/listings': 'agent-dashboard-listing',
  'dashboard/add-listing': 'agent-dashboard-add-listing',
  'dashboard/earnings': 'agent-dashboard-earning',
  'dashboard/settings': 'agent-dashboard-setting'
};

const companyLinks = [
  ['About Us', '/about'], ['Import', '/import'],
  ['News', '/news'], ['Car Calculator', '/calculator'],
  ['FAQ', '/faq'], ['Terms', '/terms']
];
const memberLinks = [
  ['Member Overview', '/account'], ['My Bookings', '/account/bookings'],
  ['My Wishlist', '/account/wishlist'], ['My Wallet', '/account/wallet'],
  ['My Profile', '/account/profile'], ['Settings', '/account/settings']
];
const dealerLinks = [
  ['Dealer Overview', '/dashboard'], ['Listings', '/dashboard/listings'],
  ['Add Listing', '/dashboard/add-listing'], ['Earnings', '/dashboard/earnings'],
  ['Settings', '/dashboard/settings']
];

export const siteNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Vehicles', href: '/vehicles' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'Explore', links: companyLinks },
  { label: 'Plans', href: '/membership' },
  { label: 'Contact', href: '/contact' }
];

const sourceRoutes = Object.fromEntries(Object.entries(siteRoutes).map(([route, source]) => [source, '/' + route]));
const titles = {
  'index-3': 'Home', 'cars-list-2': 'Vehicles', 'cars-details-3': 'Vehicle Details',
  'dealer-listing': 'Import Sources', 'dealer-details': 'Import Source Profile',
  'shop-list': 'Shop', 'shop-details': 'Product Details', 'about-us': 'About Us',
  services: 'Services', pricing: 'Membership & Pricing', calculator: 'Car Calculator',
  faqs: 'FAQ', term: 'Terms', contact: 'Contact', login: 'Login', register: 'Register',
  '404': 'Page Not Found', 'blog-grid': 'News', 'blog-details': 'News Article',
  'user-dashboard-home': 'Member Overview', 'user-dashboard-bookings': 'My Bookings',
  'user-dashboard-wishlist': 'My Wishlist', 'user-dashboard-wallet': 'My Wallet',
  'user-dashboard-profile': 'My Profile', 'user-dashboard-setting': 'Member Settings',
  'agent-dashboard-home': 'Dealer Overview', 'agent-dashboard-listing': 'Listings',
  'agent-dashboard-add-listing': 'Add Listing', 'agent-dashboard-earning': 'Earnings',
  'agent-dashboard-setting': 'Dealer Settings'
};

export function resolveSiteRoute(route = '') {
  const key = route.replace(/\/$/, '').replace(/\.html$/, '');
  return Object.hasOwn(siteRoutes, key) ? siteRoutes[key] : key;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function linksHtml(links) {
  return links.map(([label, href]) => `<li class="menu-item"><a href="${href}">${escapeHtml(label)}</a></li>`).join('');
}

function navigationHtml(mobile = false) {
  return siteNavigation.map(item => {
    if (item.href) return `<li class="menu-item"><a href="${item.href}">${item.label}</a></li>`;
    const trigger = `<a href="#" role="button" aria-haspopup="true">${item.label}</a>`;
    if (item.groups && !mobile) {
      const groups = item.groups.map(group => `<div class="col-lg-6"><h6 class="text-lg-bold neutral-1000">${group.label}</h6><ul class="sub-menu">${linksHtml(group.links)}</ul></div>`).join('');
      return `<li class="mega-li-small has-children">${trigger}<div class="mega-menu"><div class="mega-menu-inner mega-menu-inner-small"><div class="row">${groups}</div></div></div></li>`;
    }
    const links = item.groups
      ? item.groups.map(group => `<li class="has-children"><a href="#" role="button" aria-haspopup="true">${group.label}</a><ul class="sub-menu">${linksHtml(group.links)}</ul></li>`).join('')
      : linksHtml(item.links);
    return `<li class="has-children">${trigger}<ul class="sub-menu">${links}</ul></li>`;
  }).join('');
}

function websiteHref(href) {
  if (!href?.startsWith('/') || href.startsWith('//')) return href;
  const match = href.match(/^\/([^?#]*)(.*)$/);
  const key = match[1].replace(/\.html$/, '');
  const suffix = match[2];
  if (/^index(?:-[23])?$/.test(key)) return '/' + suffix;
  if (/^cars-list-[1-4]$/.test(key)) return '/vehicles' + suffix;
  if (/^cars-details-[1-4]$/.test(key)) return '/vehicle' + suffix;
  if (/^blog-list$/.test(key)) return '/news' + suffix;
  return sourceRoutes[key] ? sourceRoutes[key] + suffix : href;
}

function organizeImport($, sourceKey) {
  if (sourceKey === 'dealer-listing') {
    $('main .page-header h2').text('Import Sources');
    $('main .page-header .text-xl-medium').text('Explore brands, source markets and vehicle options');
    const heading = $('main h4').first();
    heading.text('Explore Import Sources');
    heading.next('p').text('Illustrative source profiles. Discuss availability and your preferred vehicle with our team.');
    $('.card-dealer .card-image img').wrap('<a href="/import/source" aria-label="View source profile"></a>');
    $('main a').filter((_, element) => $(element).text().trim().includes('Become a renter'))
      .attr('href', '/contact').contents().filter((_, node) => node.type === 'text').first().replaceWith('Discuss an import ');
  }
  if (sourceKey === 'dealer-details') {
    $('main .page-header .text-xl-medium').text('Sample import source profile');
    const overview = $('main #collapseOverview .card-body > p');
    overview.eq(0).text('This illustrative profile shows how a vehicle source can be presented with its location, brands and available stock. Source details are examples for the website proposal.');
    overview.eq(1).text('Tell us your preferred model, source market and budget. Vehicle availability, condition, transport and import costs are confirmed individually before proceeding.');
    $('main p, main h4').filter((_, element) => $(element).text().trim() === 'Dealer Location').text('Source Location');
    $('main h4').filter((_, element) => $(element).text().trim() === 'Listed by this dealer').text('Vehicles from This Source');
  }
}

function composeHomeSections($, home2Body) {
  if (!home2Body) throw new Error('Home 2 source is required for Karento Best homepage composition');
  const home2 = load(home2Body, undefined, false);
  const system = home2('.section-cta-4');
  const stats = home2('.section-static-1 .rounded-12.background-3');
  const testimonials = home2('.block-testimonials').closest('section');
  if (system.length !== 1 || stats.length !== 1 || testimonials.length !== 1) {
    throw new Error('Expected Home 2 rental system, statistics and testimonial sections');
  }
  stats.removeClass('background-3').addClass('karento-system-stats background-card border mt-60');
  system.children('.container').append(stats);
  system.attr('data-home-section-source', 'index-2');
  testimonials.attr('data-home-section-source', 'index-2');
  $('.section-cta-6').replaceWith(home2.html(system));
  $('.section-static-1').remove();
  $('.box-author-testimonials').closest('section').replaceWith(home2.html(testimonials));
  $('.box-why-book-22').replaceWith(howItWorksHtml());
}

function howItWorksHtml() {
  const steps = [
    ['choose', 'Find your car', 'Browse our cars and shortlist your favourites.', '/vehicles'],
    ['talk', 'Talk with us', 'Ask about availability and vehicle details.', '/contact'],
    ['view', 'View & test drive', 'Arrange a viewing or test drive.', '/contact'],
    ['collect', 'Make it yours', 'Confirm the details and plan collection.', '/contact']
  ];
  return `<section class="karento-how-it-works background-body" id="how-it-works" aria-labelledby="how-it-works-title">
    <div class="container">
      <div class="karento-process-heading text-center">
        <span class="karento-process-label background-2 neutral-1000">How it works</span>
        <h3 class="neutral-1000" id="how-it-works-title">Your next car, in four steps</h3>
        <p class="text-lg-medium neutral-500">From the first look to the first drive.</p>
      </div>
      <ol class="karento-process-grid">
        ${steps.map(([image, title, description, href], index) => `<li class="karento-process-step">
          <a class="karento-process-image" href="${href}" aria-label="${escapeHtml(title)}">
            <img src="/assets/karento-best/how-it-works/${image}-20261006${image === 'view' ? '-v2' : ''}.webp" alt="" width="1672" height="941" loading="lazy" decoding="async">
            <span class="karento-process-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
          </a>
          <h6 class="neutral-1000"><a href="${href}">${escapeHtml(title)}</a></h6>
          <p class="text-md-medium neutral-500">${description}</p>
        </li>`).join('')}
      </ol>
    </div>
  </section>`;
}

function polishMotion($) {
  // Render complete content immediately; WOW never receives reveal targets.
  $('[class]').each((_, element) => {
    const node = $(element);
    node.attr('class', node.attr('class').split(/\s+/).filter(token =>
      !/^(?:wow|animated|hover-up|fadeIn\w*|bounceIn\w*|zoomIn\w*|slideIn\w*)$/.test(token)).join(' '));
    for (const attribute of Object.keys(element.attribs || {})) {
      if (attribute.startsWith('data-wow-')) node.removeAttr(attribute);
    }
  });
  $('#preloader-active').remove();
  $('.odometer').each((_, element) => {
    const counter = $(element);
    counter.removeClass('odometer').addClass('karento-static-count').text(counter.attr('data-count') || counter.text());
  });
  // A static, wrapping brand list avoids the continuously moving ticker.
  $('.carouselTicker-left,.carouselTicker-right').removeClass('carouselTicker-left carouselTicker-right').addClass('karento-static-brands');
}

function composeHomeBrands($, home1Body) {
  if (!home1Body) throw new Error('Home 1 source is required for the Karento Best brand strip');
  const home1 = load(home1Body, undefined, false);
  const logos = [...new Set(home1('.item-brand img.light-mode').map((_, image) => home1(image).attr('src')).get())];
  const names = { lexus: 'Lexus', mer: 'Mercedes-Benz', bugatti: 'Bugatti', jaguar: 'Jaguar', honda: 'Honda', chevrolet: 'Chevrolet', acura: 'Acura', bmw: 'BMW', toyota: 'Toyota' };
  const section = $('.box-list-brand-car').closest('.py-96');
  if (section.length !== 1 || logos.length !== 9) throw new Error('Expected one Home 3 brand section and nine unique Home 1 logos');
  section.removeClass('py-96 border-top').addClass('karento-home-brands background-100').attr('data-brand-source', 'index');
  section.find('.box-search-category').html(`<div class="karento-brands-heading">
    <h3 class="heading-3 neutral-1000">Popular Brands</h3>
    <p class="text-lg-medium neutral-500">Explore a range of leading car manufacturers.</p>
    <a href="/vehicles" class="text-sm-bold neutral-1000">View all vehicles <span aria-hidden="true">↗</span></a>
  </div>
  <ul class="karento-brands-grid" aria-label="Sample car brands">
    ${logos.map(src => {
      const key = src.split('/').pop().replace('.png', '');
      return `<li class="karento-brand-logo"><img src="${src}" alt="${names[key]}" loading="lazy" decoding="async"></li>`;
    }).join('')}
  </ul>`);
}

function polishMembership($) {
  const section = $('.section-pricing-1');
  section.find('.change-price-plan').replaceWith(`<fieldset class="karento-billing-control" data-billing-control>
    <legend class="visually-hidden">Billing period</legend>
    <label class="karento-billing-option"><input class="visually-hidden" type="radio" name="billing-period" value="monthly" checked><span>Monthly</span></label>
    <label class="karento-billing-option"><input class="visually-hidden" type="radio" name="billing-period" value="annual"><span>Annual</span></label>
  </fieldset>`);
  section.find('h3[class*="text-price-"]').each((_, element) => {
    const price = $(element);
    const monthly = Number(price.text().trim());
    price.attr({ 'data-plan-price': '', 'data-monthly-price': monthly, 'data-annual-price': monthly * 12 });
    price.next().attr('data-plan-price-unit', '').text('/ month');
  });
  section.find('img[src$="/pricing-1/check-primary.svg"]').replaceWith(`<svg class="karento-plan-check" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false">
    <circle cx="13" cy="13" r="13" fill="currentColor"/>
    <path d="m8 13 3.25 3.25L18 9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`);
}

function polishPageHeroes($, sourceKey) {
  const hero = $('main > .page-header');
  if (hero.length) {
    const copy = hero.find('.container.position-absolute.top-50').first();
    const title = copy.find('h2').first();
    hero.addClass('karento-page-hero').attr('aria-labelledby', 'karento-page-title');
    copy.removeClass('d-none d-lg-block').addClass('karento-hero-copy');
    title.removeClass('w-75 py-3').addClass('karento-hero-title').attr('id', 'karento-page-title');
    copy.children('.text-xl-medium').addClass('karento-hero-description');

    if (sourceKey === 'about-us') {
      copy.find('.karento-hero-description').text('Meet our team and explore what we do.');
    }
    if (sourceKey === 'dealer-details') hero.addClass('karento-source-hero');
    if (sourceKey === 'contact') {
      title.text('Contact Us');
      copy.append('<p class="karento-hero-description text-white">Ask about a vehicle, arrange a viewing or talk with our team.</p>');
      copy.append('<a class="btn btn-white karento-hero-action" href="#contact-enquiry">Send an enquiry <span aria-hidden="true">↗</span></a>');
      const enquiryTitle = $('main .form-contact').closest('.col-lg-6').find('h2').first();
      enquiryTitle.attr({ id: 'contact-enquiry', tabindex: '-1' }).addClass('karento-hero-target');
    }
    if (sourceKey === 'services') {
      copy.find('.karento-hero-description').text('Explore our services and find the right support for your car.');
      copy.append('<a class="btn btn-white karento-hero-action" href="/contact">Contact us <span aria-hidden="true">↗</span></a>');
    }
    if (sourceKey === 'blog-details') {
      hero.addClass('karento-article-hero');
      // The hero is visible on phones too; retain the captured duplicate, hidden.
      $('main > .box-section > .container.d-block.d-lg-none').first()
        .removeClass('d-block d-lg-none').addClass('d-none').attr('aria-hidden', 'true');
    }
  }

  if (sourceKey === 'blog-grid') {
    const intro = $('main > section').first().find('.text-center').first();
    intro.find('a[href="#"]').text('News');
    $('.item-banner-slide-review').addClass('karento-news-hero')
      .children('.position-relative.z-1').removeClass('ps-md-5 ps-2').addClass('karento-news-hero-copy');
  }
  if (sourceKey === 'calculator') {
    const intro = $('main > .section-cta-11');
    intro.addClass('karento-calculator-hero');
    intro.find('.col-lg-5').removeClass('col-lg-5').addClass('col-lg-12 karento-calculator-copy');
    intro.find('h4').first().text('Car Loan Calculator').addClass('karento-hero-title');
    intro.find('.karento-calculator-copy > p').text('Estimate monthly payments and explore the numbers for your next car.');
    intro.find('.col-lg-7').removeClass('col-lg-7').addClass('col-lg-12 karento-calculator-images');
    intro.find('.karento-calculator-copy').append('<a class="btn btn-primary karento-hero-action" href="#car-loan-calculator">Use calculator <span aria-hidden="true">↓</span></a>');
    const calculatorTitle = $('main .section-cta-12 h5').first();
    calculatorTitle.attr({ id: 'car-loan-calculator', tabindex: '-1' }).addClass('karento-hero-target');
  }
  if (sourceKey === 'cars-details-3') {
    $('main .box-breadcrumb').addClass('karento-product-breadcrumb')
      .attr({ role: 'navigation', 'aria-label': 'Breadcrumb' });
    $('main .breadcrumbs .text-breadcrumb').attr('aria-current', 'page');
  }
}

function organizeAccountAreas($, sourceKey) {
  $('.header-right > .d-none.d-xxl-inline-block').addClass('karento-header-actions');
  const ownerPage = sourceKey.startsWith('agent-dashboard-');
  const memberPage = sourceKey.startsWith('user-dashboard-');
  if (ownerPage) {
    $('main').find('h1,h2,h3,h4,a').filter((_, element) => $(element).text().trim() === 'Agent Dashboard').text('Owner Dashboard');
  }
  const profileIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  $('.karento-header-actions').html(`<a class="btn btn-primary karento-header-cta" href="/login" data-demo-account-link data-demo-fixed-label>${profileIcon}<span>Account</span></a>`);
  $('.header-right .burger-icon-2').replaceWith(`<button class="burger-icon-2 karento-menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="karento-account-drawer">
    <img src="/assets/imgs/template/icons/menu.svg" alt="" width="18" height="18">
  </button>`);
  const drawer = $('.sidebar-canvas-wrapper');
  const logo = drawer.find('.sidebar-canvas-logo').toString();
  const mainLinks = siteNavigation.filter(item => item.href).map(item => [item.label, item.href]);
  // Retain the reference drawer and vendor scrollbar lifecycle with useful site/account links.
  drawer.attr({ id: 'karento-account-drawer', role: 'dialog', 'aria-label': 'Menu and account', 'aria-modal': 'true', 'aria-hidden': 'true', inert: '' })
    .addClass('karento-account-drawer').html(`<div class="sidebar-canvas-container">
      <div class="sidebar-canvas-head">${logo}
        <button class="close-canvas" type="button" aria-label="Close menu"><img src="/assets/imgs/template/icons/close.png" alt="" width="16" height="16"></button>
      </div>
      <div class="sidebar-canvas-content">
        <nav class="karento-drawer-account" aria-label="Account">
          <p class="karento-account-heading" data-demo-account-heading>Your account</p>
          <a href="/login" data-demo-account-link data-demo-drawer-account>Sign in</a>
          <a href="/register" data-demo-register-link>Create an account</a>
          <a href="/account/settings" data-demo-settings-link hidden>Account settings</a>
          <button class="karento-demo-signout" type="button" hidden>Sign out</button>
        </nav>
        <nav class="karento-drawer-navigation" aria-label="Website" data-site-navigation="karento-best">
          <ul>${linksHtml(mainLinks)}</ul>
          <details class="karento-drawer-explore"><summary>Explore</summary><ul>${linksHtml(companyLinks)}</ul></details>
        </nav>
      </div>
    </div>`);
  $('.mobile-menu').after(`<div class="karento-mobile-account">
    <a href="/login" data-demo-account-link="true">Sign in</a>
  </div>`);
  if (sourceKey === 'login') {
    const form = $('.form-login form');
    const arrow = form.find('.btn-primary svg').first().toString();
    form.attr('data-demo-signin', 'true').attr('action', '/dashboard').attr('method', 'get');
    form.html(`<p class="text-sm-medium neutral-500 mb-20">Template preview: choose your dashboard. No credentials are required.</p>
      <div class="form-group"><label class="text-sm-bold neutral-1000 mb-10" for="demo-account-type">Account type</label>
        <select class="form-control" id="demo-account-type" name="area">
          <option value="owner">Dealership owner</option><option value="member">Member</option>
        </select>
      </div>
      <div class="form-group mb-0"><button class="btn btn-primary w-100" type="submit">Sign in to demo ${arrow}</button></div>
      <p class="text-sm-medium neutral-500 text-center mt-20">New here? <a class="neutral-1000" href="/register">Create an account</a></p>`);
  }
  if (!ownerPage && !memberPage) return;
  const links = ownerPage ? dealerLinks : memberLinks;
  const sidebar = $('.dashboard-sidebar-menu');
  sidebar.attr('aria-label', ownerPage ? 'Owner dashboard' : 'Member account');
  sidebar.find('a').each((_, element) => {
    const anchor = $(element);
    const link = links.find(([, href]) => href === anchor.attr('href'));
    if (link) {
      const icon = anchor.find('i').first().toString();
      anchor.html(`${icon} ${escapeHtml(link[0])}`);
      if (link[1] === sourceRoutes[sourceKey]) anchor.attr('aria-current', 'page');
    }
  });
  $('.dashboard > .container').prepend(`<div class="karento-dashboard-notice" role="note">
    <strong>${ownerPage ? 'Owner dashboard' : 'Member account'} · Demo</strong>
    <span>Preview screens with sample data. Changes are not saved.</span>
  </div>`);
}

function composeSharedHeader($, home3Body) {
  if (!home3Body) throw new Error('Home 3 source is required for the shared website header');
  const home3 = load(home3Body, undefined, false);
  for (const selector of ['header.header', '.mobile-header-active', '.sidebar-canvas-wrapper']) {
    if ($(selector).length !== 1 || home3(selector).length !== 1) {
      throw new Error(`Expected one shared header component: ${selector}`);
    }
    $(selector).replaceWith(home3.html(home3(selector)));
  }
  $('header.header').attr('data-header-source', 'index-3');
}

export function composeSitePage(sourceKey, page, body, home2Body, home3Body, home1Body) {
  const $ = load(body, undefined, false);
  composeSharedHeader($, home3Body);
  if (sourceKey === 'index-3') {
    composeHomeSections($, home2Body);
    composeHomeBrands($, home1Body);
  }
  if (sourceKey === 'pricing') polishMembership($);
  $('.main-menu').html(navigationHtml());
  $('.mobile-menu').html(navigationHtml(true));
  $('.main-menu, .mobile-menu').attr('data-site-navigation', 'karento-best');
  $('.header-logo a, .mobile-header-logo a, .sidebar-canvas-logo a').attr('href', '/');
  $('a[href]').each((_, element) => {
    const anchor = $(element);
    anchor.attr('href', websiteHref(anchor.attr('href')));
  });
  // The reference links these two screens to pages absent from its capture.
  $('main a[href="/destination.html"]').attr('href', '/vehicles').text('Vehicles');
  $('main a[href="/privacy.html"]').each((_, element) => {
    const label = $(element).closest('label');
    label.html('<input class="cb-remember" type="checkbox">Agree to our <a class="text-sm-medium neutral-1000" href="/terms">Terms of service</a>');
  });
  // Restore useful existing footer destinations without replacing its composition.
  const footerRoutes = { 'About Us': '/about', 'Our Services': '/services', 'Terms of Use': '/terms', 'How it works': '/services', 'Help Center': '/faq' };
  $('footer a[href="#"]').each((_, element) => {
    const anchor = $(element);
    const href = footerRoutes[anchor.text().trim()];
    if (href) anchor.attr('href', href);
  });
  organizeImport($, sourceKey);
  polishPageHeroes($, sourceKey);
  $('main .card-news').each((_, element) => {
    const card = $(element);
    const titleLink = card.find('.card-title > a[href="/news/article"]');
    if (!titleLink.length) return;
    titleLink.addClass('d-block');
    card.find('.card-image > img').wrap('<a class="d-block" href="/news/article" aria-label="Read article"></a>');
  });
  if (sourceKey === 'blog-grid') {
    $('main .item-banner-slide-review').wrap('<a class="d-block" href="/news/article"></a>');
  }
  if (sourceKey === 'blog-details') {
    $('main .page-header a[href="#"]').filter((_, element) => $(element).text().trim() === 'News')
      .attr('href', '/news');
  }
  if (sourceKey === 'shop-list') {
    $('main .box-grid-tours .card-journey-small .card-image > img')
      .wrap('<a class="d-block" href="/shop/product" aria-label="View product"></a>');
    $('main .box-grid-tours .card-title > a').addClass('d-block');
  }
  if (sourceKey === 'shop-details') {
    const buyBox = $('main .box-banner-home2 .tour-header');
    buyBox.addClass('karento-product-buybox');
    buyBox.find('.tour-title-main br').remove();
    const productTitle = buyBox.find('.tour-title-main').text().replace(/\s+/g, ' ').trim();
    $('main .box-breadcrumb').addClass('karento-product-breadcrumb')
      .attr('role', 'navigation').attr('aria-label', 'Breadcrumb');
    $('main .breadcrumbs li:nth-child(2) a').text('Shop');
    $('main .breadcrumbs .text-breadcrumb').text(productTitle).attr('aria-current', 'page');
    buyBox.find('.btn-wishlish').contents().filter((_, node) => node.type === 'text')
      .last().replaceWith(' Wishlist ');
  }
  organizeAccountAreas($, sourceKey);
  polishMotion($);
  // Four upstream collage portraits were never supplied. Reuse the reviewed
  // portraits from this same testimonial section without changing its layout.
  $('img[src^="/assets/imgs/testimonials/Testimonials-2/img-"]').each((_, element) => {
    const image = $(element);
    image.attr('src', image.attr('src').replace('Testimonials-2/img-', 'testimonials-2/author-'));
  });
  $('.main-menu a, .mobile-menu a').each((_, element) => {
    if ($(element).attr('href') === sourceRoutes[sourceKey]) $(element).attr('aria-current', 'page');
  });
  $('main a').filter((_, element) => /^@@(?:prev|current)-page$/.test($(element).text().trim())).each((_, element) => {
    const anchor = $(element);
    anchor.text(titles[sourceKey] || 'Explore').attr('href', sourceRoutes[sourceKey] || '/');
  });
  const title = titles[sourceKey] ? `${titles[sourceKey]} | Karento` : page.title;
  const head = `${page.head}\n<link rel="stylesheet" href="/dealer-site.css">`;
  return { ...page, title, head, scripts: [...page.scripts.filter(script => !script.src?.endsWith('/plugins/dark.js')), { src: '/dealer-ui.js' }],
    bodyAttributes: { ...page.bodyAttributes, 'data-karento-site': 'best' }, body: $.html() };
}
