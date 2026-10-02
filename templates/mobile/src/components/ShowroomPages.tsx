'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeftRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  WalletCards,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import type { Vehicle } from '@/lib/types';
import { restoreInventoryPosition, showroom, showroomInventoryHref } from '@/lib/showroom';
import {
  serviceCategories,
  serviceCategoryHref,
  showroomService,
  showroomServices,
  type ServiceCategory,
} from '@/lib/showroom-services';
import { notify, saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { Button, ui } from './ui';

const serviceIcons: Record<string, LucideIcon> = {
  financing: WalletCards,
  'trade-in': ArrowLeftRight,
  sourcing: Search,
  viewing: CalendarDays,
  servicing: Wrench,
  parts: Package,
};
const s = stylex.create({
  page: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.stripe,
    minHeight: 'calc(100dvh - 124px)',
  },
  servicesPage: { minHeight: 'calc(100dvh - 180px)' },
  head: { paddingBlock: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  title: { fontSize: 28, lineHeight: '36px', fontWeight: 700 },
  intro: { fontSize: 16, lineHeight: '24px', color: colors.muted },
  pageHead: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 },
  pageTitle: { fontSize: 24, lineHeight: '32px', fontWeight: 700 },
  subTitle: { fontSize: 18, lineHeight: '24px', fontWeight: 700 },
  tabs: { position: 'sticky', top: 60, zIndex: 25, backgroundColor: colors.background },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))' },
    alignItems: 'start',
    gap: 12,
  },
  serviceCard: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '44px minmax(0,1fr)',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    minWidth: 0,
  },
  singleCategory: { gridTemplateColumns: '1fr', maxWidth: 620, marginInline: 'auto' },
  serviceBody: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 },
  serviceAction: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 32,
    marginTop: 4,
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    textDecoration: 'none',
    '::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 16 },
  },
  serviceDetails: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  detailTitle: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
  detailCopy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 700px)': 'minmax(0,1.2fr) minmax(0,.8fr)',
    },
    alignItems: 'start',
    gap: 12,
  },
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
  icon: {
    color: colors.muted,
    backgroundColor: colors.stripe,
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { fontSize: 15, lineHeight: '22px', color: colors.muted },
  contactActions: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(0,1fr)',
    gap: 8,
    marginBottom: 12,
  },
  contactAction: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    minHeight: 76,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    textDecoration: 'none',
    overflowWrap: 'anywhere',
  },
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
  const selected =
    serviceCategories.find(({ value }) => value === params.get('tab'))?.value || 'services';
  function selectCategory(value: ServiceCategory) {
    if (value === selected) return;
    window.history.pushState(null, '', serviceCategoryHref(value));
    window.scrollTo(0, 0);
  }
  return (
    <>
      <Header home />
      <h1 {...stylex.props(ui.srOnly)}>Services</h1>
      <div {...stylex.props(s.tabs)}>
        <ShowroomTabs
          label="Service category"
          tabs={serviceCategories}
          selected={selected}
          panelId="showroom-services"
          idPrefix="service-category-"
          onChange={selectCategory}
        />
      </div>
      <div
        id="showroom-services"
        role="tabpanel"
        aria-labelledby={'service-category-' + selected}
        {...stylex.props(s.page, s.servicesPage)}
      >
        <div {...stylex.props(s.serviceGrid, selected !== 'services' && s.singleCategory)}>
          {showroomServices
            .filter((service) => service.category === selected)
            .map((service) => {
              const ServiceIcon = serviceIcons[service.id];
              return (
                <section
                  key={service.id}
                  data-showroom-service={service.id}
                  {...stylex.props(s.serviceCard)}
                >
                  <span {...stylex.props(s.icon)}>
                    <ServiceIcon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div {...stylex.props(s.serviceBody)}>
                    <h2 {...stylex.props(s.subTitle)}>{service.title}</h2>
                    <p {...stylex.props(s.body)}>{service.copy}</p>
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
                    <Link
                      href={'/contact?service=' + service.id}
                      {...stylex.props(s.serviceAction)}
                    >
                      {service.action}
                    </Link>
                  </div>
                </section>
              );
            })}
        </div>
        <p {...stylex.props(s.note)}>Showroom template preview · Example services</p>
      </div>
    </>
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
  const hasContactActions = Boolean(showroom.phone || showroom.email || showroom.directionsUrl);
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
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.pageHead)}>
          <h1 {...stylex.props(s.pageTitle)}>Contact</h1>
          <p {...stylex.props(s.body)}>Ask a question or arrange a viewing.</p>
        </div>
        {hasContactActions && (
          <div {...stylex.props(s.contactActions)}>
            {showroom.phone && (
              <a
                href={'tel:' + showroom.phone}
                aria-label="Call the showroom"
                {...stylex.props(s.contactAction)}
              >
                <Phone size={22} strokeWidth={1.8} aria-hidden="true" />
                Call
              </a>
            )}
            {showroom.email && (
              <a
                href={'mailto:' + showroom.email}
                aria-label="Email the showroom"
                {...stylex.props(s.contactAction)}
              >
                <Mail size={22} strokeWidth={1.8} aria-hidden="true" />
                Email
              </a>
            )}
            {showroom.directionsUrl && (
              <a
                href={showroom.directionsUrl}
                aria-label="Directions to the showroom"
                {...stylex.props(s.contactAction)}
              >
                <MapPin size={22} strokeWidth={1.8} aria-hidden="true" />
                Directions
              </a>
            )}
          </div>
        )}
        <div {...stylex.props(s.contactGrid)}>
          <section {...stylex.props(s.card)}>
            <h2 {...stylex.props(s.subTitle)}>Your enquiry</h2>
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
                    vehicle ? 'Ask about availability or a viewing…' : 'Tell us how we can help…'
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
              <Button type="submit" block>
                Save enquiry draft
              </Button>
              {saved && (
                <p role="status" {...stylex.props(s.saved)}>
                  Draft saved on this device. Nothing was sent.
                </p>
              )}
            </form>
          </section>
          <section {...stylex.props(s.card)}>
            <h2 {...stylex.props(s.subTitle)}>Showroom details</h2>
            <dl {...stylex.props(s.info)}>
              <div {...stylex.props(s.infoRow)}>
                <span {...stylex.props(s.infoIcon)}>
                  <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <dt {...stylex.props(s.detailTitle)}>Address</dt>
                  <dd {...stylex.props(s.body)}>
                    {showroom.address || 'Address to be confirmed.'}
                  </dd>
                </div>
              </div>
              <div {...stylex.props(s.infoRow)}>
                <span {...stylex.props(s.infoIcon)}>
                  <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <dt {...stylex.props(s.detailTitle)}>Opening hours</dt>
                  <dd {...stylex.props(s.body)}>
                    {showroom.hours.length
                      ? showroom.hours.map((hours) => <p key={hours}>{hours}</p>)
                      : 'Opening hours to be confirmed.'}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
