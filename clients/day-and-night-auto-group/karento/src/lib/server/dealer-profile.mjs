import { load } from 'cheerio';
import profile from './dealer-profile.json' with { type: 'json' };

const { business, listings } = profile;
const sampleDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(business.observedAt));
const city = business.cityLatin || (business.city === 'София' ? 'Sofia' : business.city);
const location = [city, business.country].filter(Boolean).join(', ');
const number = value => new Intl.NumberFormat('en-GB').format(value);
const price = vehicle => vehicle.priceAmount == null ? 'Price on request' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: vehicle.currency || business.currency, maximumFractionDigits: Number.isInteger(vehicle.priceAmount) ? 0 : 2 }).format(vehicle.priceAmount);
const displayTitle = vehicle => {
  const model = vehicle.title.replace(new RegExp('^' + vehicle.make + '\\s*', 'i'), '');
  return vehicle.make + ' ' + model.split(/\s+(?:Очакван|ОЧАКВАН|Mercedes|BMW|Audi|LAMBORGHINI|Range Rover SPORT|AMG360)/)[0].trim();
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function listingPowerHp(vehicle) {
  if (Number.isFinite(vehicle.powerHp) && vehicle.powerHp > 0) return vehicle.powerHp;
  const sourced = /^(\d+(?:[.,]\d+)?)\s*(?:hp|к\.?\s*с\.?)$/i.exec(String(vehicle.raw?.power || '').trim());
  const value = sourced ? Number(sourced[1].replace(',', '.')) : null;
  return Number.isFinite(value) && value > 0 ? value : null;
}

const specBadge = (kind, label, value) => `<div class="dealer-spec" data-spec="${kind}"><dt class="dealer-spec-label">${label}</dt><dd class="dealer-spec-value"><span class="dealer-spec-icon" aria-hidden="true"></span><span>${escape(value)}</span></dd></div>`;

export function personalizePage(sourceKey, page, url) {
  const dom = load(page.body, undefined, false);
  if (!['index-3', 'cars-list-2', 'cars-details-3', 'contact'].includes(sourceKey)) {
    dom('main').prepend('<p class="text-sm-medium neutral-500 dealer-preview-note">Supporting page preview · Illustrative content and demo controls. No purchases, bookings or account changes are processed.</p>');
  }
  dom('img[src*="/template/logo-"]').each((_, element) => {
    const image = dom(element);
    const onDark = image.attr('src').includes('logo-w') || image.closest('footer').length;
    image.attr('src', onDark ? '/dealer-brand/logo-on-dark.webp' : '/dealer-brand/logo-on-light.webp')
      .attr('alt', business.name).removeAttr('width').removeAttr('height');
  });
  dom('img[alt="Carento"],img[alt="Karento"]').attr('alt', '');
  dom('.header-logo a,.mobile-header-logo a').attr('aria-label', business.name);
  dom('.btn-mode').attr('aria-label', 'Change color mode');
  dom('.burger-icon-2').attr('aria-label', 'Open menu');
  dom('a[href^="tel:"]').attr('href', business.phoneHref).text(business.phoneDisplay);
  dom('a[href^="mailto:"]').attr('href', business.website).text('Dealer profile');
  dom('footer .icon-address').text(business.address);
  dom('footer .icon-worktime').text('Viewings by appointment');
  dom('footer .icon-email, .sidebar-canvas .email-2').text(business.phoneDisplay);
  dom('footer p').filter((_, el) => dom(el).text().includes('©')).text(`© 2026 ${business.name} · Independent design preview`);
  dom('.sidebar-canvas .address-2').text(business.address);
  dom('.sidebar-canvas .phone-2').text(business.phoneDisplay);
  dom('a.icon-socials').attr('href', business.website).attr('aria-label', 'View dealer profile');
  dom('iframe[src*="maps"]').attr('src', business.mapsEmbedUrl).attr('title', business.name + ' location');
  dom('main .location-search').text(location);
  dom('main .location-search + .dropdown-menu').each((_, el) => dom(el).find('li').slice(1).remove());
  dom('main .location-search + .dropdown-menu a').text(location);
  dom('main .card-testimonial .card-title').text('Customer story');
  dom('main .card-testimonial p:not(.card-title)').text('Example testimonial layout. Published customer feedback can be added with permission.');
  dom('main .card-testimonial .card-author strong, main .card-testimonial h6').text('Example customer');
  dom('main .card-testimonial .card-author .card-info p').first().text('Example customer');
  dom('main .card-testimonial .card-author .card-info').each((_, el) => {
    dom(el).find('p').first().text('Example customer');
    dom(el).find('p').slice(1).text('Illustrative content');
  });
  dom('main .card-testimonial .card-author').find('img').attr('alt', 'Example portrait');
  dom('main .card-testimonial .card-rating').text('Example review');
  dom('main .card-testimonial .card-rate img').each((_, element) => {
    dom(element).removeClass('background-brand-2 p-1').wrap('<span class="dealer-review-star"></span>');
  });
  dom('main .card-team h6').text('Example team member');
  dom('main .card-team .card-image img').attr('alt', 'Template portrait');
  dom('img[src*="/team/team-"]').each((_, el) => {
    const card = dom(el).closest('.card-news');
    card.find('h6').text('Example team member');
    card.find('.card-title span').text('Template portrait');
    card.find('.card-title a,.card-image a').attr('href', '/contact');
  });
  dom('main .karento-static-count').each((index, element) => {
    const count = dom(element);
    count.text([String(listings.length), String(new Set(listings.map(v => v.make)).size), '1', 'EUR', 'Demo'][index] || 'Demo');
    count.parent().siblings('h3').remove();
    const label = count.parent().parent().next();
    if (label.find('p').length) {
      label.find('p').first().text(['Sample vehicles', 'Vehicle makes', 'Showroom', 'Listing currency', 'Website preview'][index] || 'Sample content');
      label.find('p').slice(1).remove();
    }
  });
  if (sourceKey === 'cars-list-2') {
    const cards = dom('main .card-journey-small');
    let last = cards.last().parent();
    for (let index = cards.length; index < listings.length; index++) {
      const extra = last.clone();
      last.after(extra);
      last = extra;
    }
    dom('.number-found').text(`${listings.length} listing samples`);
    dom('.pagination').html('<li class="page-item active"><a class="page-link" href="/vehicles" aria-current="page">1</a></li>');
  }
  dom('main .card-journey-small').each((index, element) => {
    // Shop product cards keep their template product data and demo behavior.
    if (sourceKey.startsWith('shop-')) return;
    const card = dom(element), vehicle = listings[index % listings.length];
    const href = '/vehicle?id=' + encodeURIComponent(vehicle.id);
    card.attr('data-vehicle-id', vehicle.id);
    card.find('.card-image img').attr('src', vehicle.image).attr('alt', vehicle.title);
    card.find('.card-image a,.card-title a,.card-button a').attr('href', href);
    card.find('.card-title a').text(displayTitle(vehicle)).attr('title', vehicle.title);
    card.find('.rating').text('Listing sample');
    card.find('.card-location p').text(location);
    const power = listingPowerHp(vehicle);
    const facts = [
      specBadge('mileage', 'Mileage', number(vehicle.mileageValue) + ' km'),
      specBadge('transmission', 'Gearbox', vehicle.transmissionType === 'automatic' ? 'Automatic' : 'Manual'),
      specBadge('year', 'Year', String(vehicle.year)),
      specBadge('fuel', 'Fuel', vehicle.fuelType === 'diesel' ? 'Diesel' : 'Petrol'),
      ...(power === null ? [] : [specBadge('power', 'Power', number(power) + ' hp')])
    ];
    card.find('.card-facitlities').html(`<dl class="dealer-spec-list" data-secondary-count="${power === null ? 2 : 3}">${facts.join('')}</dl>`);
    if (card.find('.card-facitlities').length) {
      // Every sample belongs to this showroom; the site and detail pages carry its location.
      card.find('.card-location').remove();
      card.find('.card-button a').addClass('dealer-card-view');
    }
    card.find('.card-price h6').text(price(vehicle));
    // The selected template leaves this caption empty; sale prices need the row space.
    card.find('.card-price p').remove();
    card.find('.card-button a').text('View').attr('aria-label', 'View ' + displayTitle(vehicle));
  });
  if (sourceKey === 'index-3') {
    dom('main h1').text(`Your next car. ${business.shortName}.`);
    dom('main span.btn').filter((_, el) => /3600/.test(dom(el).text())).text(`${city} · ${business.name}`);
    dom('main .item-banner-slide h6').text('Explore the cars. Contact the showroom. Arrange a viewing.');
    dom('main p').filter((_, el) => /Favorite vehicles based on customer reviews/.test(dom(el).text())).text('Selected listing samples from ' + business.name);
  }
  // Reuse the template search composition as a dealer showroom entry point.
  dom('.box-search-advance .item-search label').each((index, element) => dom(element).text(['Showroom', 'Viewings', 'Sample date', 'Availability'][index] || 'Browse vehicles'));
  dom('.box-search-advance input').each((index, element) => dom(element).attr('value', index === 0 ? sampleDate : 'Call to confirm').attr('readonly', 'readonly').removeClass('datepicker'));
  dom('.box-search-advance .item-search button:not([data-bs-toggle])').each((_, element) => {
    const button = dom(element);
    button.replaceWith(`<a class="${escape(button.attr('class') || 'btn btn-search')}" href="/vehicles">View vehicles</a>`);
  });
  const selected = listings.find(vehicle => vehicle.id === url.searchParams.get('id')) || listings[0];
  if (sourceKey === 'cars-details-3') {
    dom('.tour-title-main h1,.tour-title-main h2,.tour-title-main h3,.tour-title-main h4').text(displayTitle(selected));
    dom('main .text-breadcrumb').text(displayTitle(selected));
    dom('.tour-rate').text('Listing sample');
    dom('.tour-meta-right').find('p,span').filter((_, el) => /Fleet Code/.test(dom(el).text())).text('Listing ' + selected.id);
    dom('.tour-location').text(location);
    dom('.tour-meta-left a').attr('href', business.mapsUrl).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    dom('.tour-meta-left p').filter((_, el) => /Fleet Code/.test(dom(el).text())).text('Source:');
    dom('.tour-meta-left a').filter((_, el) => /LVA-4125/.test(dom(el).text())).text('Public listing').attr('href', selected.sourceUrl || business.website);
    dom('.banner-slide-activity img,.banner-slide img').attr('src', selected.image).attr('alt', selected.title);
    dom('.banner-activities-detail,.slider-nav-thumbnails-activities-detail').addClass('dealer-single-photo').each((_, el) => dom(el).children().slice(1).remove());
    dom('main a').filter((_, el) => /See All Photos/.test(dom(el).text())).attr('href', selected.image).attr('target', '_blank').attr('rel', 'noopener noreferrer').text('View sample photo');
    dom('main a').filter((_, el) => /Schedule Test Drive|Make An Offer Price/.test(dom(el).text())).attr('href', '/contact?vehicle=' + encodeURIComponent(selected.id));
    dom('.box-feature-car .feature-info p').each((index, element) => dom(element).text([
      number(selected.mileageValue) + ' km', selected.fuelType === 'diesel' ? 'Diesel' : 'Petrol',
      selected.transmissionType === 'automatic' ? 'Automatic' : 'Manual', String(selected.year),
      'Confirm details', selected.body, 'Confirm details', 'Confirm details'
    ][index] || 'Confirm details'));
    dom('.booking-form .head-booking-form').html(`<h5>${escape(price(selected))}</h5><p class="text-sm-medium neutral-500">Advertised vehicle price</p>`);
    dom('.booking-form .content-booking-form').html(`<p class="text-md-medium neutral-500">${escape(business.address)}</p><p class="text-md-medium neutral-500">Listing sample observed ${escape(sampleDate)}. Confirm price, availability and specifications with the showroom.</p><a class="btn btn-book w-100" href="${escape(business.phoneHref)}">Call ${escape(business.phoneDisplay)}</a><a class="btn btn-gray w-100 mt-20" href="/contact?vehicle=${encodeURIComponent(selected.id)}">Arrange a viewing</a>`);
    dom('main .popup-youtube').attr('href', '/contact').removeClass('popup-youtube');
    dom('.group-collapse-expand').each((_, element) => {
      const group = dom(element), heading = group.find('.btn-collapse h6').first().text().trim();
      const body = group.find('.card-body').first();
      if (heading === 'Overview') body.html(`<p class="text-md-medium neutral-500">${escape(selected.title)} · ${selected.year} · ${number(selected.mileageValue)} km · ${escape(price(selected))}.</p><p class="text-md-medium neutral-500">Dated listing sample from the dealer's public profile. Confirm equipment, history, specifications and current availability with ${escape(business.name)}.</p>`);
      if (heading === 'Included in the price') {
        group.find('.btn-collapse h6').text('Before your viewing');
        body.html('<p class="text-md-medium neutral-500">Contact the showroom to confirm the advertised price, available documentation and viewing arrangements.</p>');
      }
      if (heading === 'Question & Answers') body.html(`<p class="text-md-medium neutral-500">For questions about this vehicle, call the showroom. The samples in this preview were observed on ${escape(sampleDate)}.</p>`);
      if (heading === 'Rate & Reviews') body.html('<p class="text-md-medium neutral-500">No verified customer reviews are included in this proposal.</p>');
      if (heading === 'Add a review') body.html('<p class="text-md-medium neutral-500">Customer feedback can be added with permission.</p>');
      if (heading === 'Car Loan Calculator') group.find('a').filter((_, el) => /Apply for a loan/.test(dom(el).text())).attr('href', '/contact').text('Ask about finance');
    });
    const seller = dom('.sidebar-left').filter((_, el) => /Listed by/.test(dom(el).text()));
    seller.find('.card-author-info a').text(business.name).attr('href', business.website);
    seller.find('.card-author-info p').first().text(business.name);
    seller.find('.card-author-info p').slice(1).text(location);
    seller.find('.card-author img').attr('src', '/dealer-brand/logo-on-light.webp').attr('alt', business.name);
    seller.find('.box-info-contact').html(`<p class="text-md-medium neutral-1000"><a href="${escape(business.phoneHref)}">Showroom: ${escape(business.phoneDisplay)}</a></p><p class="text-md-medium neutral-1000">${escape(business.address)}</p><a href="${escape(business.website)}">Public dealer profile</a>`);
    seller.find('a').filter((_, el) => /All items/.test(dom(el).text())).attr('href', '/vehicles');
  }
  if (sourceKey === 'contact') {
    dom('main h4').first().text('Visit ' + business.name);
    dom('.card-contact').each((index, element) => {
      const card = dom(element);
      card.find('.card-title a').text(['Showroom', 'Viewings', 'Vehicle enquiries', 'Dealer profile'][index]).attr('href', index === 3 ? business.website : business.mapsUrl);
      card.find('a.location').text(index === 0 ? business.address : location + ' · Viewings by appointment').attr('href', business.mapsUrl);
    });
  }
  // Keep reference forms as drafts and prevent inherited external submissions.
  dom('form:not([data-demo-signin])').removeAttr('action').attr('data-dealer-draft', 'true');
  dom('form:not([data-demo-signin]) button[type="submit"],form:not([data-demo-signin]) input[type="submit"]').attr('type', 'button');
  dom('footer .form-newsletter button').attr('type', 'button').text('Demo');
  dom('footer h5').filter((_, el) => /Subscribe/.test(dom(el).text())).text(business.name + ' · ' + city);
  dom('footer .form-newsletter input').attr('placeholder', 'Preview only — no subscription').attr('disabled', 'disabled');
  const notice = `<p class="text-sm-medium neutral-500 dealer-preview-note">Independent design preview · Vehicle samples dated ${escape(sampleDate)}. Forms do not send enquiries or create bookings.</p>`;
  dom('footer .footer-1').length ? dom('footer .footer-1').append(notice) : dom('footer').prepend(notice);
  // Replace the template identity in remaining visible text, preserving markup.
  dom('*').contents().filter((_, node) => node.type === 'text' && /carento|karento|support@carento\.com|\+1 222-555-33-99/i.test(node.data)).each((_, node) => {
    node.data = node.data.replace(/support@carento\.com/gi, business.phoneDisplay)
      .replace(/\+1 222-555-33-99/g, business.phoneDisplay).replace(/(?:Carento|Karento)(?: Inc\.)?/gi, business.name);
  });
  dom('main h3,main h4,main h5,main h6').filter((_, el) => /Loking for a rental car/.test(dom(el).text())).text('Looking for your next car?');
  dom('main .section-cta-4 h4').first().text('Meet ' + business.name);
  dom('main .section-cta-4 p').filter((_, el) => /rental/.test(dom(el).text())).text('Browse the listing samples, then contact the showroom to arrange a viewing.');
  dom('main .item-brand-2 span').filter((_, el) => /180 cars/.test(dom(el).text())).text('Explore vehicles');
  dom('main a').filter((_, el) => /^\d+ Vehicles$/i.test(dom(el).text().trim())).text('View samples');
  dom('main *').contents().filter((_, node) => node.type === 'text').each((_, node) => {
    node.data = node.data.replace(/Best Car Rental System/g, business.name)
      .replace(/Search and find your best car rental with easy way/g, `Explore dated vehicle samples from the ${city} showroom`)
      .replace(/Find cars for sale and for rent near you/g, business.name + ' · ' + city)
      .replace(/Manage all your car rentals on the go/g, 'Browse the public dealer profile')
      .replace(new RegExp('with the ' + business.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' app', 'g'), 'and contact the showroom for details');
  });
  dom('.box-filter-top .dropdown-toggle,.box-sort-by .dropdown-toggle').attr('title', 'Template preview control; advanced inventory filtering is not connected');
  dom('main h4').filter((_, el) => /Get 15% off/.test(dom(el).text())).text('Explore ' + business.name);
  dom('main .box-author-profile .card-author').text(business.shortName + ' · Demo account');
  dom('main a[href*="youtube.com"],main a[href*="youtu.be"]').attr('href', '/contact').removeClass('popup-youtube');
  dom('main button').filter((_, el) => /^(Send message|Apply for a loan|Submit review)$/i.test(dom(el).text().trim())).each((_, el) => dom(el).replaceWith(`<a class="${escape(dom(el).attr('class') || 'btn')}" href="${escape(business.phoneHref)}">Call the showroom</a>`));
  dom('main .box-info-contact').html(`<p class="text-md-medium neutral-1000"><a href="${escape(business.phoneHref)}">Showroom: ${escape(business.phoneDisplay)}</a></p><p class="text-md-medium neutral-1000">${escape(business.address)}</p><a href="${escape(business.website)}">Public dealer profile</a>`);
  dom('main .card-author-info').each((_, el) => {
    dom(el).find('p').first().text(business.name);
    dom(el).find('p').slice(1).text(location);
  });
  dom('main .item-review .content-review').text('Illustrative review content. Verified customer feedback can be added with permission.');
  dom('main .item-review .author-info').html('<p class="text-lg-bold neutral-1000">Example customer</p><p class="text-sm-medium neutral-500">Preview content</p>');
  dom('main .group-collapse-expand').filter((_, el) => /The High Roller/.test(dom(el).text())).each((_, el) => {
    dom(el).find('.card-body').first().html('<p class="text-md-medium neutral-500">Contact the showroom for vehicle and product questions. This supporting page contains illustrative content.</p>');
  });
  const head = load(page.head, undefined, false);
  const accent = /^#[\da-f]{6}$/i.test(business.accent) ? business.accent : '#c40101';
  const rgb = [1, 3, 5].map(i => parseInt(accent.slice(i, i + 2), 16));
  const luminance = channels => channels.map(channel => channel / 255).map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
  const foreground = channels => 1.05 / (luminance(channels) + 0.05) >= (luminance(channels) + 0.05) / 0.05 ? '#fff' : '#000';
  const ink = foreground(rgb), hoverInk = foreground(rgb.map(channel => channel * 0.8));
  head.root().append(`<style data-dealer-brand>:root,[data-bs-theme=dark]{--bs-brand-2:${accent};--bs-brand-2-dark:${accent};--bs-brand-2-darken:color-mix(in srgb,${accent} 80%,black);--bs-brand-2-light:color-mix(in srgb,${accent} 7%,white);--bs-background-2:color-mix(in srgb,${accent} 7%,white);--bs-button-bg:${accent};--bs-button-text:${ink};--bs-primary-rgb:${rgb.join(',')};--bs-link-hover-color:${accent};--dealer-accent-ink:${ink};--dealer-accent-hover-ink:${hoverInk};--dealer-accent-icon-filter:brightness(0)${ink === '#fff' ? ' invert(1)' : ''};}[data-bs-theme=dark]{--bs-background-2:color-mix(in srgb,${accent} 20%,#202020);}</style>`);
  head('link[rel*="icon"]').attr('href', '/dealer-brand/icon.png').attr('type', 'image/png');
  head('meta[name="description"]').attr('content', `${business.name} in ${city}. Independent Karento design proposal with dated vehicle samples.`);
  head('meta[name="keywords"]').attr('content', `${business.name}, ${city}, cars`);
  return { ...page, title: `${sourceKey === 'cars-details-3' ? displayTitle(selected) : page.title.split(' | ')[0]} | ${business.name}`,
    head: head.html(), body: dom.html(), bodyAttributes: {...page.bodyAttributes, 'data-dealer': business.slug} };
}
