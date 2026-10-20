'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ArrowLeft, Check, ChevronDown, ChevronRight, Mail, Phone } from 'lucide-react';
import { useLocale } from '@/lib/use-locale';
import { useMediaQuery } from '@/lib/use-media-query';
import { showroomServices, type ShowroomService } from '@/lib/showroom-services';
import {
  serviceDetailHref,
  serviceEnquiryHref,
  type ShowroomServiceDetail,
} from '@/lib/showroom-service-details';
import { Header } from './Header';
import { ContactSheet } from './ContactSheet';
import { ShowroomTabs } from './ShowroomTabs';
import { s } from './showroom-service-detail.stylex';

const labels = {
  en: {
    back: 'Back to services',
    enquiry: 'Enquire',
    contact: 'Contact',
    service: 'Showroom service',
    overview: 'Information',
    phoneOverview: 'Info',
    process: 'How it works',
    phoneProcess: 'Steps',
    questions: 'Questions',
    included: 'What to expect',
    prepare: 'Start with your details',
    related: 'Other services',
    navigation: 'Service information',
    note: 'Availability and details are confirmed with the showroom.',
  },
  bg: {
    back: 'Обратно към услугите',
    enquiry: 'Запитване',
    contact: 'Контакт',
    service: 'Услуга от автосалона',
    overview: 'Информация',
    phoneOverview: 'Инфо',
    process: 'Как работи',
    phoneProcess: 'Стъпки',
    questions: 'Въпроси',
    included: 'Какво да очаквате',
    prepare: 'Започнете с вашите данни',
    related: 'Други услуги',
    navigation: 'Информация за услугата',
    note: 'Наличността и подробностите се уточняват с автосалона.',
  },
};

type ServiceSection = 'overview' | 'process' | 'questions';

export function ShowroomServiceDetailScreen({
  service,
  detail,
}: {
  service: ShowroomService;
  detail: ShowroomServiceDetail;
}) {
  const { t, locale } = useLocale();
  const phone = useMediaQuery('(max-width: 699px)');
  const [section, setSection] = useState<ServiceSection>('overview');
  const [contactOpen, setContactOpen] = useState(false);
  const navigation = useRef<HTMLDivElement>(null);
  const navigationAnchor = useRef<HTMLDivElement>(null);
  const text = labels[locale];
  const content = detail[locale];
  const enquiryHref = serviceEnquiryHref(service.id)!;
  const related = showroomServices.filter((item) => item.id !== service.id).slice(0, 3);

  function selectSection(value: ServiceSection) {
    if (value === section) return;
    const nav = navigation.current;
    const stickyTop = nav ? Number.parseFloat(getComputedStyle(nav).top) : 0;
    const pinned = nav && nav.getBoundingClientRect().top <= stickyTop + 1;
    const scrollTop = window.scrollY;
    setSection(value);
    // Retain the visible rail, or return a pinned rail to the start of the new panel.
    requestAnimationFrame(() => {
      const anchor = navigationAnchor.current;
      if (!anchor) return;
      window.scrollTo({
        top: pinned
          ? Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - stickyTop)
          : scrollTop,
        behavior: 'instant',
      });
    });
  }

  const action = (
    <Link
      href={enquiryHref}
      aria-label={text.enquiry + ': ' + t(service.action)}
      data-service-enquiry
      {...stylex.props(s.action)}
    >
      <span data-service-action-face {...stylex.props(s.actionFace)}>
        <Mail size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>{text.enquiry}</span>
      </span>
    </Link>
  );
  const contactAction = (
    <button
      type="button"
      aria-haspopup="dialog"
      data-service-contact
      onClick={() => setContactOpen(true)}
      {...stylex.props(s.action)}
    >
      <span data-service-action-face {...stylex.props(s.actionFace, s.contactFace)}>
        <Phone size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>{text.contact}</span>
      </span>
    </button>
  );

  return (
    <article data-service-detail={service.id} {...stylex.props(s.page)}>
      <div {...stylex.props(s.desktopHeader)}>
        <Header home sticky={false} />
      </div>
      <div data-service-detail-hero {...stylex.props(s.hero)}>
        {service.image && (
          <Image
            src={service.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1440px) 1392px, 100vw"
            {...stylex.props(s.photo)}
          />
        )}
        <div aria-hidden="true" {...stylex.props(s.heroShade)} />
        <Link href="/services" aria-label={text.back} {...stylex.props(s.back)}>
          <ArrowLeft size={24} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>
      <div data-service-detail-drawer {...stylex.props(s.drawer)}>
        <div {...stylex.props(s.layout)}>
          <div {...stylex.props(s.main)}>
            <header data-service-drawer-header {...stylex.props(s.drawerHeader)}>
              <p {...stylex.props(s.serviceLabel)}>{text.service}</p>
              <h1 {...stylex.props(s.title)}>{t(service.title)}</h1>
              <p {...stylex.props(s.summary)}>{content.summary}</p>
              <div data-service-summary-action {...stylex.props(s.summaryAction)}>
                {action}
                {contactAction}
              </div>
            </header>
            <div ref={navigationAnchor} aria-hidden="true" />
            <div ref={navigation} {...stylex.props(s.sections)}>
              <ShowroomTabs
                label={text.navigation}
                tabs={[
                  { value: 'overview', label: phone ? text.phoneOverview : text.overview },
                  { value: 'process', label: phone ? text.phoneProcess : text.process },
                  { value: 'questions', label: text.questions },
                ]}
                selected={section}
                panelId="service-information-panel"
                idPrefix="service-tab-"
                layout="desktop-segmented"
                tone="neutral"
                flush
                onChange={selectSection}
              />
            </div>
            <div
              id="service-information-panel"
              role="tabpanel"
              aria-labelledby={'service-tab-' + section}
              tabIndex={0}
            >
              <section
                id="service-overview"
                hidden={section !== 'overview'}
                aria-labelledby="service-overview-title"
                {...stylex.props(s.section)}
              >
                <p {...stylex.props(s.lead)}>{content.intro}</p>
                <h2 id="service-overview-title" {...stylex.props(s.heading)}>
                  {text.included}
                </h2>
                <ul {...stylex.props(s.expectations)}>
                  {content.expectations.map((item) => (
                    <li key={item.title} {...stylex.props(s.expectation)}>
                      <span {...stylex.props(s.check)}>
                        <Check size={18} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 {...stylex.props(s.itemTitle)}>{item.title}</h3>
                        <p {...stylex.props(s.copy)}>{item.copy}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <section
                id="service-process"
                hidden={section !== 'process'}
                aria-labelledby="service-process-title"
                {...stylex.props(s.section)}
              >
                <h2 id="service-process-title" {...stylex.props(s.heading)}>
                  {text.process}
                </h2>
                <ol {...stylex.props(s.steps)}>
                  {content.steps.map((step, index) => (
                    <li key={step.title} {...stylex.props(s.step)}>
                      <span aria-hidden="true" {...stylex.props(s.number)}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 {...stylex.props(s.itemTitle)}>{step.title}</h3>
                        <p {...stylex.props(s.copy)}>{step.copy}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <section
                id="service-questions"
                hidden={section !== 'questions'}
                aria-labelledby="service-questions-title"
                {...stylex.props(s.section)}
              >
                <h2 id="service-questions-title" {...stylex.props(s.heading)}>
                  {text.questions}
                </h2>
                <div {...stylex.props(s.faqs)}>
                  {content.faqs.map((faq) => (
                    <details key={faq.question} {...stylex.props(s.faq)}>
                      <summary {...stylex.props(s.question)}>
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                          {...stylex.props(s.chevron)}
                        />
                      </summary>
                      <p {...stylex.props(s.copy, s.answer)}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <aside aria-labelledby="service-enquiry-title" {...stylex.props(s.aside)}>
            <div {...stylex.props(s.enquiry)}>
              <h2 id="service-enquiry-title" {...stylex.props(s.heading)}>
                {text.prepare}
              </h2>
              <p {...stylex.props(s.copy)}>{content.preparation}</p>
              {action}
              {contactAction}
              <p {...stylex.props(s.note)}>{text.note}</p>
            </div>
            <div {...stylex.props(s.related)}>
              <h2 {...stylex.props(s.heading)}>{text.related}</h2>
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={serviceDetailHref(item.id)!}
                  {...stylex.props(s.relatedLink)}
                >
                  <span>{t(item.title)}</span>
                  <ChevronRight
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    {...stylex.props(s.chevron)}
                  />
                </Link>
              ))}
            </div>
          </aside>
        </div>
        <p {...stylex.props(s.demo)}>
          {t('Showroom template preview ·')} {t('Example services')}
        </p>
      </div>
      <ContactSheet service={service} open={contactOpen} onClose={() => setContactOpen(false)} />
    </article>
  );
}
