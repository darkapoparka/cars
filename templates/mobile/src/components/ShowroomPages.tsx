'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import type { Vehicle } from '@/lib/types';
import { restoreInventoryPosition, showroom, showroomInventoryHref } from '@/lib/showroom';
import {
  serviceCategories,
  serviceCategoryHref,
  serviceSearchHref,
  searchShowroomServices,
  showroomService,
  showroomServices,
  importCountries,
  importCountry,
  importCountryHref,
  saleEnquiryTypes,
  saleEnquiryType,
  saleEnquiryHref,
  serviceQuickFiltersFor,
  serviceQuickFilter,
  serviceQuickFilterHref,
  type ServiceTab,
  type ServiceQuickFilter,
} from '@/lib/showroom-services';
import { notify, saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearch } from './ShowroomSearch';
import { ShowroomServiceSearchSheet } from './ShowroomServiceSearchSheet';
import { ShowroomQuickPill, ShowroomQuickPills } from './ShowroomQuickPills';
import { ShowroomServiceRequest } from './ShowroomServiceRequest';
import { ShowroomImportExamples } from './ShowroomImportExamples';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { Button, ui } from './ui';

const s = stylex.create({
  page: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.stripe,
    minHeight: 'calc(100dvh - 124px)',
  },
  servicesPage: { minHeight: 'calc(100dvh - 242px)' },
  head: { paddingBlock: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  title: { fontSize: 28, lineHeight: '36px', fontWeight: 700 },
  intro: { fontSize: 16, lineHeight: '24px', color: colors.muted },
  subTitle: { fontSize: 18, lineHeight: '24px', fontWeight: 700 },
  tabs: {
    position: 'sticky',
    top: 60,
    zIndex: 25,
    backgroundColor: colors.background,
    paddingTop: 4,
    paddingBottom: 0,
  },
  serviceFlow: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'minmax(0,1fr)',
    },
    alignItems: 'start',
    gap: 20,
    maxWidth: 1040,
    marginInline: 'auto',
  },
  saleFlow: { gridTemplateColumns: 'minmax(0,1fr)', maxWidth: 720 },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
    },
    alignItems: 'stretch',
    gap: 8,
    maxWidth: 1040,
    marginInline: 'auto',
  },
  serviceCard: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto',
    alignItems: 'start',
    columnGap: 8,
    rowGap: 4,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingBlock: 12,
    paddingInline: 14,
    minWidth: 0,
  },
  serviceCardLink: {
    gridTemplateRows: 'auto 1fr',
    color: colors.text,
    textDecoration: 'none',
    backgroundColor: {
      default: colors.background,
      ':hover': colors.panel,
      ':active': colors.controlSurface,
    },
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  serviceCardCopy: { gridColumn: '1 / -1' },
  serviceCardCue: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    justifySelf: 'end',
    gap: 3,
    minHeight: 28,
    paddingBlock: 4,
    paddingInline: 8,
    borderRadius: 14,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
  },
  serviceCardChevron: { flexShrink: 0, color: colors.muted },
  serviceDetail: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr)',
    alignItems: 'start',
    gap: 12,
    borderRadius: 16,
    padding: 20,
  },
  singleCategory: { gridTemplateColumns: '1fr', maxWidth: 620, marginInline: 'auto' },
  serviceBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 0,
  },
  serviceTitle: {
    paddingBlock: 3,
    fontSize: 16,
    lineHeight: '22px',
    fontWeight: 600,
    overflowWrap: 'anywhere',
  },
  serviceCopy: { fontSize: 14, lineHeight: '20px', color: colors.muted, overflowWrap: 'anywhere' },
  serviceAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    flexShrink: 0,
    padding: 0,
    borderRadius: 18,
    textDecoration: 'none',
    outlineColor: colors.accent,
  },
  serviceActionFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    paddingBlock: 7,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
  },
  serviceActionPrimary: {
    backgroundColor: { default: colors.accent, ':hover': colors.accent },
    borderColor: colors.accent,
    color: '#fff',
    fontWeight: 600,
  },
  serviceDetailAction: { gridColumn: '1 / -1', marginTop: 4 },
  serviceDetails: {
    gridColumn: '1 / -1',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 4,
  },
  detailTitle: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
  detailCopy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr)',
    alignItems: 'start',
    gap: 12,
  },
  contactPage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100dvh - 124px)',
  },
  contactIntro: { backgroundColor: colors.background, paddingInline: 16, paddingBlock: 12 },
  contactBody: { flex: '1', minHeight: 0 },
  contactContainer: { maxWidth: 620, marginInline: 'auto', minWidth: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
    gap: 20,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 14,
    minWidth: 0,
  },
  body: { fontSize: 15, lineHeight: '22px', color: colors.muted },
  contactActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 12,
  },
  contactAction: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    minWidth: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: 'transparent',
    textDecoration: 'none',
    outlineColor: colors.accent,
    cursor: { default: 'pointer', ':disabled': 'default' },
  },
  contactActionFace: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    minHeight: 44,
    paddingBlock: 10,
    paddingInline: 12,
    borderRadius: 22,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    overflowWrap: 'anywhere',
  },
  contactActionUnavailable: {
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
    color: colors.muted,
  },
  contactExtraAction: { gridColumn: '1 / -1', justifySelf: 'center', minWidth: 144 },
  contactAvailability: { marginTop: 8 },
  contactSubmit: { alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'transparent' },
  info: { display: 'flex', flexDirection: 'column', gap: 12 },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  infoIcon: { display: 'inline-flex', color: colors.muted, flexShrink: 0, marginTop: 2 },
  context: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingInline: 12,
    paddingBlock: 8,
    borderRadius: 10,
    backgroundColor: colors.stripe,
  },
  contextText: { flex: '1 1 160px', minWidth: 0, overflowWrap: 'anywhere' },
  contextTitle: { fontSize: 15, lineHeight: '22px', fontWeight: 500 },
  contextLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    flexShrink: 0,
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
  },
  note: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.muted,
    textAlign: 'center',
    paddingTop: 24,
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    resize: 'vertical',
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  saved: { color: colors.green, fontSize: 14, lineHeight: '22px' },
});

export function SavedCarsScreen() {
  const { parked, filters, inventorySort } = useAppState();
  const saved = vehicles.filter((vehicle) => parked.includes(vehicle.id));
  useEffect(restoreInventoryPosition, []);
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>Saved cars</h1>
          <p {...stylex.props(s.intro)}>
            {saved.length
              ? saved.length + (saved.length === 1 ? ' car' : ' cars') + ' saved on this device.'
              : 'Keep the cars you like in one place.'}
          </p>
        </div>
        {saved.length ? (
          <div {...stylex.props(s.grid)}>
            {saved.map((vehicle) => (
              <ShowroomVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <Icon name="heart" size={44} />
            <h2 {...stylex.props(ui.title)}>Your shortlist starts here</h2>
            <p>Tap the heart on a car to save it for later.</p>
            <Button href={showroomInventoryHref(filters, inventorySort)}>Browse cars</Button>
          </div>
        )}
      </div>
    </>
  );
}

export function ShowroomServicesScreen() {
  const params = useSearchParams();
  const query = params.get('q') || '';
  const searching = params.get('search') === '1';
  const searchOpener = useRef<HTMLButtonElement | null>(null);
  const selected = query.trim()
    ? 'services'
    : serviceCategories.find(({ value }) => value === params.get('tab'))?.value || 'services';
  // Existing Financing/Parts URLs continue to open their details from All.
  const detail =
    !query.trim() && ['financing', 'parts'].includes(params.get('tab') || '')
      ? showroomService(params.get('tab') || '')
      : undefined;
  const overview = selected === 'services' && !detail;
  const country = importCountry(params.get('country'));
  const saleType = saleEnquiryType(params.get('saleType'));
  const quickFilters = serviceQuickFiltersFor(showroomServices);
  const requestedQuickFilter = serviceQuickFilter(detail?.id || params.get('topic'));
  const quickFilter =
    quickFilters.find(({ value }) => value === requestedQuickFilter)?.value || 'all';
  const matchingServices = searchShowroomServices(showroomServices, query);
  const shown = overview
    ? matchingServices.filter((service) => quickFilter === 'all' || service.id === quickFilter)
    : detail
      ? [detail]
      : [];
  function selectCategory(value: ServiceTab) {
    if (value === selected && !query && !detail) return;
    window.history.pushState(null, '', serviceCategoryHref(value));
    window.scrollTo(0, 0);
  }
  function search(value: string) {
    window.history.replaceState(null, '', serviceSearchHref(value));
    requestAnimationFrame(() => searchOpener.current?.focus({ preventScroll: true }));
  }
  function openSearch(button: HTMLButtonElement) {
    searchOpener.current = button;
    button.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    url.searchParams.set('search', '1');
    window.history.pushState({ carsMobileServiceSearch: true }, '', url.pathname + url.search);
  }
  function closeSearch() {
    if (window.history.state?.carsMobileServiceSearch) window.history.back();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      window.history.replaceState(null, '', url.pathname + url.search);
    }
    requestAnimationFrame(() => searchOpener.current?.focus({ preventScroll: true }));
  }
  function selectServiceFilter(value: ServiceQuickFilter) {
    window.history.pushState(null, '', serviceQuickFilterHref(value, query));
  }
  return (
    <>
      <Header home />
      <h1 {...stylex.props(ui.srOnly)}>Services</h1>
      <div {...stylex.props(s.tabs)}>
        <ShowroomSearch label="Search services" value={query} onOpen={openSearch} />
        <ShowroomTabs
          label="Service category"
          tabs={serviceCategories}
          selected={selected}
          panelId="showroom-services"
          idPrefix="service-category-"
          layout="fill"
          onChange={selectCategory}
        />
        {selected === 'import' ? (
          <ShowroomQuickPills label="Import countries">
            {importCountries.map(({ value, label }) => (
              <ShowroomQuickPill
                key={value}
                active={country === value}
                aria-pressed={country === value}
                onClick={() => window.history.pushState(null, '', importCountryHref(value))}
              >
                {label}
              </ShowroomQuickPill>
            ))}
          </ShowroomQuickPills>
        ) : selected === 'sell' ? (
          <ShowroomQuickPills label="Sale type">
            {saleEnquiryTypes.map(({ value, label }) => (
              <ShowroomQuickPill
                key={value}
                active={saleType === value}
                aria-pressed={saleType === value}
                onClick={() => window.history.pushState(null, '', saleEnquiryHref(value))}
              >
                {label}
              </ShowroomQuickPill>
            ))}
          </ShowroomQuickPills>
        ) : (
          <ShowroomQuickPills label="Service filters">
            {quickFilters.map(({ value, label }) => (
              <ShowroomQuickPill
                key={value}
                active={quickFilter === value}
                aria-pressed={quickFilter === value}
                aria-label={
                  value === 'all' ? 'All services (' + matchingServices.length + ')' : label
                }
                onClick={() => selectServiceFilter(value)}
              >
                {value === 'all' ? 'All (' + matchingServices.length + ')' : label}
              </ShowroomQuickPill>
            ))}
          </ShowroomQuickPills>
        )}
      </div>
      <div
        id="showroom-services"
        role="tabpanel"
        aria-labelledby={'service-category-' + selected}
        {...stylex.props(s.page, s.servicesPage)}
      >
        {overview && (
          <p aria-live="polite" {...stylex.props(ui.srOnly)}>
            {shown.length} {shown.length === 1 ? 'service' : 'services'}
          </p>
        )}
        {selected === 'import' || selected === 'sell' ? (
          <div {...stylex.props(s.serviceFlow, selected === 'sell' && s.saleFlow)}>
            <ShowroomServiceRequest
              key={selected}
              kind={selected}
              country={country}
              saleType={saleType}
            />
            {selected === 'import' && <ShowroomImportExamples country={country} />}
          </div>
        ) : shown.length ? (
          <div {...stylex.props(s.serviceGrid, !overview && s.singleCategory)}>
            {shown.map((service) =>
              overview ? (
                <Link
                  key={service.id}
                  data-showroom-service={service.id}
                  href={
                    service.details || service.category === 'import' || service.category === 'sell'
                      ? serviceCategoryHref(service.category)
                      : '/contact?service=' + service.id
                  }
                  aria-label={
                    service.details ? 'View ' + service.title.toLowerCase() : service.action
                  }
                  aria-describedby={'showroom-service-' + service.id + '-copy'}
                  {...stylex.props(s.serviceCard, s.serviceCardLink)}
                >
                  <h2 {...stylex.props(s.serviceTitle)}>{service.title}</h2>
                  <span data-service-card-cue {...stylex.props(s.serviceCardCue)}>
                    {service.details || service.category === 'import' || service.category === 'sell'
                      ? 'View'
                      : 'Enquire'}
                    <ChevronRight
                      size={12}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      {...stylex.props(s.serviceCardChevron)}
                    />
                  </span>
                  <p
                    id={'showroom-service-' + service.id + '-copy'}
                    {...stylex.props(s.serviceCopy, s.serviceCardCopy)}
                  >
                    {service.copy}
                  </p>
                </Link>
              ) : (
                <section
                  key={service.id}
                  data-showroom-service={service.id}
                  {...stylex.props(s.serviceCard, s.serviceDetail)}
                >
                  <div {...stylex.props(s.serviceBody)}>
                    <h2 {...stylex.props(s.subTitle)}>{service.title}</h2>
                    <p id={'showroom-service-' + service.id + '-copy'} {...stylex.props(s.body)}>
                      {service.copy}
                    </p>
                  </div>
                  {service.details && (
                    <dl {...stylex.props(s.serviceDetails)}>
                      {service.details.map((detail) => (
                        <div key={detail.label}>
                          <dt {...stylex.props(s.detailTitle)}>{detail.label}</dt>
                          <dd {...stylex.props(s.detailCopy)}>{detail.copy}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div {...stylex.props(s.serviceDetailAction)}>
                    <Link
                      href={'/contact?service=' + service.id}
                      {...stylex.props(s.serviceAction)}
                    >
                      <span
                        data-service-action-surface
                        {...stylex.props(s.serviceActionFace, s.serviceActionPrimary)}
                      >
                        {service.action}
                      </span>
                    </Link>
                  </div>
                </section>
              ),
            )}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <h2 {...stylex.props(ui.title)}>No services found</h2>
            <p>Try another search or browse all services.</p>
            <Button
              variant="outline"
              onClick={() => window.history.replaceState(null, '', '/services')}
            >
              Show all services
            </Button>
          </div>
        )}
        <p {...stylex.props(s.note)}>
          Showroom template preview ·{' '}
          {selected === 'import' ? 'Sample import gallery' : 'Example services'}
        </p>
      </div>
      {searching && (
        <ShowroomServiceSearchSheet value={query} onApply={search} onClose={closeSearch} />
      )}
    </>
  );
}

function ShowroomContactAction({
  href,
  children,
  extra = false,
}: {
  href: string | null;
  children: ReactNode;
  extra?: boolean;
}) {
  const face = (
    <span {...stylex.props(s.contactActionFace, !href && s.contactActionUnavailable)}>
      {children}
    </span>
  );
  return href ? (
    <a href={href} {...stylex.props(s.contactAction, extra && s.contactExtraAction)}>
      {face}
    </a>
  ) : (
    <button
      type="button"
      disabled
      aria-describedby="contact-option-availability"
      {...stylex.props(s.contactAction, extra && s.contactExtraAction)}
    >
      {face}
    </button>
  );
}

export function ShowroomContactScreen({
  vehicle,
  serviceId,
}: {
  vehicle?: Vehicle;
  serviceId?: string;
}) {
  const { messageDrafts } = useAppState();
  const service = showroomService(serviceId);
  const hasContactDetails = Boolean(showroom.address || showroom.hours.length);
  const unavailableContacts = !showroom.phone || !showroom.directionsUrl;
  const draftKey = vehicle?.id || 'showroom-' + (service?.id || 'general');
  const initial = vehicle
    ? `Hello, I'm interested in the ${vehicle.make} ${vehicle.model}. Could we arrange a viewing?`
    : service
      ? `Hello, I'd like to ask about ${service.title.toLowerCase()}.`
      : '';
  const [edited, setEdited] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const message = edited ?? messageDrafts[draftKey] ?? initial;
  return (
    <>
      <Header home />
      <h1 {...stylex.props(ui.srOnly)}>Contact</h1>
      <div {...stylex.props(s.contactPage)}>
        <section aria-label="Showroom contact" {...stylex.props(s.contactIntro)}>
          <div {...stylex.props(s.contactContainer)}>
            <div role="group" aria-label="Contact options" {...stylex.props(s.contactActions)}>
              <ShowroomContactAction href={showroom.phone ? 'tel:' + showroom.phone : null}>
                <Phone size={20} strokeWidth={1.8} aria-hidden="true" />
                Call us
              </ShowroomContactAction>
              <ShowroomContactAction href={showroom.directionsUrl}>
                <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                Visit us
              </ShowroomContactAction>
              {showroom.email && (
                <ShowroomContactAction href={'mailto:' + showroom.email} extra>
                  <Mail size={20} strokeWidth={1.8} aria-hidden="true" />
                  Email us
                </ShowroomContactAction>
              )}
            </div>
            {unavailableContacts && (
              <p
                id="contact-option-availability"
                {...stylex.props(ui.small, ui.muted, s.contactAvailability)}
              >
                {!showroom.phone && !showroom.directionsUrl
                  ? 'Phone and location details are unavailable in this preview.'
                  : !showroom.phone
                    ? 'Phone details are unavailable in this preview.'
                    : 'Location details are unavailable in this preview.'}
              </p>
            )}
          </div>
        </section>
        <div {...stylex.props(s.page, s.contactBody)}>
          <div {...stylex.props(s.contactContainer)}>
            <div {...stylex.props(s.contactGrid)}>
              <section aria-labelledby="showroom-enquiry-heading" {...stylex.props(s.card)}>
                <h2 id="showroom-enquiry-heading" {...stylex.props(s.subTitle)}>
                  Enquiry
                </h2>
                <p {...stylex.props(s.body)}>Ask a question or arrange a viewing.</p>
                {(vehicle || service) && (
                  <div {...stylex.props(s.context)}>
                    <div {...stylex.props(s.contextText)}>
                      <p {...stylex.props(ui.small, ui.muted)}>Regarding</p>
                      <p {...stylex.props(s.contextTitle)}>
                        {vehicle ? vehicle.make + ' ' + vehicle.model : service?.title}
                      </p>
                    </div>
                    <Link
                      href={
                        vehicle
                          ? '/vehicle/' + vehicle.id
                          : serviceCategoryHref(service?.category || 'services')
                      }
                      {...stylex.props(s.contextLink)}
                    >
                      {vehicle ? 'View car' : 'View service'}
                    </Link>
                  </div>
                )}
                <form
                  {...stylex.props(s.form)}
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveMessageDraft(draftKey, message);
                    notify('Enquiry draft saved on this device. Nothing was sent.');
                    setSaved(true);
                  }}
                >
                  <label {...stylex.props(ui.label)}>
                    Message
                    <textarea
                      aria-label="Enquiry message"
                      value={message}
                      onChange={(event) => {
                        setEdited(event.target.value);
                        setSaved(false);
                      }}
                      placeholder={
                        vehicle
                          ? 'Ask about availability or a viewing…'
                          : 'Tell us how we can help…'
                      }
                      required
                      minLength={10}
                      maxLength={4000}
                      {...stylex.props(s.textArea)}
                    />
                  </label>
                  <p {...stylex.props(ui.small, ui.muted)}>
                    Preview: save your enquiry on this device.
                  </p>
                  <button type="submit" {...stylex.props(s.serviceAction, s.contactSubmit)}>
                    <span {...stylex.props(s.serviceActionFace, s.serviceActionPrimary)}>
                      Save enquiry draft
                    </span>
                  </button>
                  {saved && (
                    <p role="status" {...stylex.props(s.saved)}>
                      Draft saved on this device. Nothing was sent.
                    </p>
                  )}
                </form>
              </section>
              {hasContactDetails && (
                <section {...stylex.props(s.card)}>
                  <h2 {...stylex.props(s.subTitle)}>Showroom details</h2>
                  <dl {...stylex.props(s.info)}>
                    {showroom.address && (
                      <div {...stylex.props(s.infoRow)}>
                        <span {...stylex.props(s.infoIcon)}>
                          <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div>
                          <dt {...stylex.props(s.detailTitle)}>Address</dt>
                          <dd {...stylex.props(s.body)}>{showroom.address}</dd>
                        </div>
                      </div>
                    )}
                    {showroom.hours.length > 0 && (
                      <div {...stylex.props(s.infoRow)}>
                        <span {...stylex.props(s.infoIcon)}>
                          <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" />
                        </span>
                        <div>
                          <dt {...stylex.props(s.detailTitle)}>Opening hours</dt>
                          <dd {...stylex.props(s.body)}>
                            {showroom.hours.map((hours) => (
                              <p key={hours}>{hours}</p>
                            ))}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
