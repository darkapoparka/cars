import test from 'node:test';
import assert from 'node:assert/strict';
import { showroomServices } from '../.qa/domain/showroom-services.mjs';
import {
  getShowroomServiceDetail,
  serviceDetailHref,
  serviceEnquiryHref,
} from '../.qa/domain/showroom-service-details.mjs';

const nonempty = (text) => typeof text === 'string' && text.trim().length > 0;

test('every available showroom offering has a complete detail guide in both locales', () => {
  for (const service of showroomServices) {
    const detail = getShowroomServiceDetail(service.id);
    assert.ok(detail, service.id);
    assert.equal(detail.id, service.id);
    for (const locale of ['en', 'bg']) {
      const content = detail[locale];
      assert.ok(nonempty(content.intro), `${service.id} ${locale} intro`);
      assert.ok(nonempty(content.preparation), `${service.id} ${locale} preparation`);
      assert.equal(content.expectations.length, 3);
      assert.equal(content.steps.length, 3);
      assert.equal(content.faqs.length, 2);
      for (const point of [...content.expectations, ...content.steps]) {
        assert.ok(nonempty(point.title), `${service.id} ${locale} point title`);
        assert.ok(nonempty(point.copy), `${service.id} ${locale} point copy`);
      }
      for (const faq of content.faqs) {
        assert.ok(nonempty(faq.question), `${service.id} ${locale} FAQ question`);
        assert.ok(nonempty(faq.answer), `${service.id} ${locale} FAQ answer`);
      }
    }
    assert.notEqual(detail.en.intro, detail.bg.intro);
    assert.match(detail.bg.intro, /[А-Яа-я]/);
    assert.match(detail.bg.preparation, /[А-Яа-я]/);
    for (const point of [...detail.bg.expectations, ...detail.bg.steps]) {
      assert.match(point.title, /[А-Яа-я]/);
      assert.match(point.copy, /[А-Яа-я]/);
    }
    for (const faq of detail.bg.faqs) {
      assert.match(faq.question, /[А-Яа-я]/);
      assert.match(faq.answer, /[А-Яа-я]/);
    }
  }
});

test('available service cards have distinct canonical detail URLs', () => {
  const hrefs = showroomServices.map(({ id }) => serviceDetailHref(id));
  assert.equal(new Set(hrefs).size, showroomServices.length);
  for (const service of showroomServices) {
    assert.equal(serviceDetailHref(service.id), '/services/' + service.id);
  }
});

test('unknown service IDs cannot produce detail content or invented action URLs', () => {
  for (const id of [undefined, '', 'missing', 'Import', '../contact', 'parts?service=other']) {
    assert.equal(getShowroomServiceDetail(id), undefined);
    assert.equal(serviceDetailHref(id), undefined);
    assert.equal(serviceEnquiryHref(id), undefined);
  }
});

test('import, sale and part exchange keep their existing enquiry flow and purpose', () => {
  assert.equal(serviceEnquiryHref('import'), '/services?tab=import&request=1');
  assert.equal(serviceEnquiryHref('sell'), '/services?tab=sell&request=1');
  const exchange = new URL(serviceEnquiryHref('trade-in'), 'https://example.test');
  assert.equal(exchange.pathname, '/services');
  assert.equal(exchange.searchParams.get('tab'), 'sell');
  assert.equal(exchange.searchParams.get('saleType'), 'part-exchange');
  assert.equal(exchange.searchParams.get('request'), '1');
});

test('general service enquiries retain the exact offering in Contact', () => {
  for (const id of ['viewing', 'sourcing', 'servicing', 'financing', 'parts']) {
    const enquiry = new URL(serviceEnquiryHref(id), 'https://example.test');
    assert.equal(enquiry.pathname, '/contact');
    assert.equal(enquiry.searchParams.get('service'), id);
  }
});
