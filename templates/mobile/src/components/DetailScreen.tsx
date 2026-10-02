'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { money } from '@/lib/search';
import { markViewed, setVehiclePhoto, notify, togglePark, useAppState } from '@/lib/store';
import { inventoryCanGoBack, inventoryReturnHref } from '@/lib/showroom';
import { vehicleGalleryHref } from '@/lib/vehicle-detail-navigation';
import { VehicleSections } from './VehicleSections';
import { Header } from './Header';
import { Icon } from './Icon';
import { Button, IconButton, Modal, ui } from './ui';
import { ContactSheet } from './ContactSheet';
import { FinanceCalculator } from './FinanceCalculator';
import { PriceRating } from './VehicleCard';
import { useVehicleDetailSection } from './useVehicleDetailSection';
const s = stylex.create({
  paymentTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    marginInline: 16,
    marginTop: 12,
    padding: 3,
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.controlSurface,
  },
  paymentTab: {
    backgroundColor: 'transparent',
    color: colors.text,
    borderWidth: 0,
    borderRadius: 9,
    minHeight: 44,
    padding: 8,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  selectedTab: {
    backgroundColor: colors.background,
    boxShadow: '0 1px 3px #0001',
  },
  leasePrice: { display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  leaseCopy: { fontSize: 13, color: colors.muted, lineHeight: '20px' },
  hero: {
    touchAction: 'pan-y',
    display: 'block',
    position: 'relative',
    aspectRatio: '1280 / 810',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  image: { objectFit: 'cover' },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 84,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25262bcc',
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
  },
  info: { paddingInline: 16, paddingTop: 16 },
  offer: {
    backgroundColor: colors.background,
    paddingInline: 16,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  model: { fontSize: 24, fontWeight: 700, lineHeight: '30px', overflowWrap: 'anywhere' },
  variant: {
    fontSize: 14,
    lineHeight: '20px',
    color: colors.muted,
    marginTop: 4,
    overflowWrap: 'anywhere',
  },
  price: { fontFamily: 'var(--font-base)', fontSize: 24, fontWeight: 700, lineHeight: '32px' },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 2,
  },
  priceNote: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  finance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingBlock: 12,
    paddingInline: 12,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    color: colors.text,
    width: '100%',
    marginTop: 12,
    minHeight: 48,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 8,
    marginTop: 12,
  },
  action: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingBlock: 12,
    paddingInline: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  enquire: {
    backgroundColor: { default: colors.accent, ':hover': colors.accent },
    borderColor: colors.accent,
    color: '#fff',
  },
  contactDock: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 1100,
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    paddingInline: 16,
    paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    boxShadow: '0 -3px 12px #00000008',
    zIndex: 38,
  },
  dockPrice: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 4,
    minWidth: 0,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    overflowWrap: 'anywhere',
  },
  dockPeriod: { fontSize: 12, fontWeight: 400, lineHeight: '18px', color: colors.muted },
  actionIcon: { display: 'inline-flex', flexShrink: 0 },
  financeAmount: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
    color: colors.muted,
    fontWeight: 400,
  },
  financeAction: { display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  ratingButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    marginLeft: 'auto',
    paddingBlock: 4,
    paddingInline: 6,
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.muted,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  oldRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  financeValue: { fontWeight: 500, fontSize: 16, color: colors.text },
  old: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
    textDecoration: 'line-through',
    color: colors.muted,
  },
  discount: {
    backgroundColor: colors.activeSurface,
    color: colors.accent,
    paddingInline: 8,
    paddingBlock: 2,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
  },
});
export function DetailScreen({ vehicle: v }: { vehicle: Vehicle }) {
  const router = useRouter();
  const section = useVehicleDetailSection();
  const actions = useRef<HTMLDivElement>(null);
  const [contactDock, setContactDock] = useState(false);
  const { parked, filters, photoIndexes } = useAppState();
  const photoIndex = Math.min(v.images.length - 1, Math.max(0, photoIndexes[v.id] || 0));
  const photoGesture = useRef({ x: 0, y: 0, moved: false });
  function changePhoto(direction: number) {
    setVehiclePhoto(v.id, (photoIndex + direction + v.images.length) % v.images.length);
  }
  const [contact, setContact] = useState(false);
  const [finance, setFinance] = useState(false);
  const [leaseQuote, setLeaseQuote] = useState(false);
  const [paymentOverride, setPaymentOverride] = useState<'buy' | 'lease' | null>(null);
  const leasing = Boolean(v.leaseTerms) && (paymentOverride || filters.payment) === 'lease';
  const financeMonthly = v.financeMonthly || v.monthly || Math.round(v.price * 0.01061);

  const [priceInfo, setPriceInfo] = useState(false);
  const [report, setReport] = useState(false);
  useEffect(() => markViewed(v.id), [v.id]);
  useEffect(() => {
    const target = actions.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setContactDock(!entry.isIntersecting && entry.boundingClientRect.bottom <= 60);
      },
      { rootMargin: '-60px 0px 0px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [v.id]);
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Vehicle link copied');
    } catch {
      notify('Copy the vehicle link from your browser’s address bar.');
    }
  }
  return (
    <>
      <Header
        title={v.make + ' ' + v.model}
        back="/"
        onBack={() => {
          const canGoBack = inventoryCanGoBack(v.id);
          const href = inventoryReturnHref(v.id);
          if (canGoBack) router.back();
          else router.replace(href, { scroll: false });
        }}
      >
        <IconButton icon="share" label="Share via" onClick={share} />
        <IconButton icon="checklist" label="Checklist" href={'/vehicle/' + v.id + '/checklist'} />
        <IconButton
          icon="heart"
          label={parked.includes(v.id) ? 'Remove from saved cars' : 'Save car'}
          filled={parked.includes(v.id)}
          onClick={() => togglePark(v.id)}
        />
      </Header>
      <Link
        href={vehicleGalleryHref(v.id, section)}
        {...stylex.props(s.hero)}
        aria-label="Vehicle image"
        onPointerDown={(event) => {
          photoGesture.current = { x: event.clientX, y: event.clientY, moved: false };
        }}
        onPointerUp={(event) => {
          const dx = event.clientX - photoGesture.current.x;
          const dy = event.clientY - photoGesture.current.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            photoGesture.current.moved = true;
            changePhoto(dx < 0 ? 1 : -1);
          }
        }}
        onClick={(event) => {
          if (photoGesture.current.moved) {
            event.preventDefault();
            photoGesture.current.moved = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            changePhoto(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
      >
        <Image
          src={v.images[photoIndex]}
          alt={v.make + ' ' + v.model}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 1100px"
          {...stylex.props(s.image)}
        />
        <span {...stylex.props(s.counter)}>
          <Icon name="photo" size={20} />
          {photoIndex + 1} / {v.images.length}
        </span>
      </Link>
      <section {...stylex.props(s.info)}>
        <h1 {...stylex.props(s.model)}>
          {v.make} {v.model}
        </h1>
        <p {...stylex.props(s.variant)}>{v.variant}</p>
      </section>
      {v.leaseTerms && (
        <div {...stylex.props(s.paymentTabs)} role="group" aria-label="Payment type">
          <button
            type="button"
            aria-pressed={!leasing}
            onClick={() => setPaymentOverride('buy')}
            {...stylex.props(s.paymentTab, !leasing && s.selectedTab)}
          >
            Buying
          </button>
          <button
            type="button"
            aria-pressed={leasing}
            onClick={() => setPaymentOverride('lease')}
            {...stylex.props(s.paymentTab, leasing && s.selectedTab)}
          >
            Leasing
          </button>
        </div>
      )}
      <section aria-label="Vehicle price and contact" {...stylex.props(s.offer)}>
        {leasing && v.leaseTerms ? (
          <>
            <div {...stylex.props(s.leasePrice)}>
              <strong {...stylex.props(s.price)}>
                {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
                  v.monthly || 0,
                )}
              </strong>
              <span {...stylex.props(s.leaseCopy)}>Monthly incl. VAT.</span>
            </div>
            <p {...stylex.props(s.leaseCopy)}>
              {v.leaseTerms.months} months term •{' '}
              {v.leaseTerms.annualMileage.toLocaleString('en-GB')} km per year,{' '}
              {v.leaseTerms.customer}
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              {...stylex.props(s.finance)}
              onClick={() => setLeaseQuote(true)}
            >
              Leasing details
              <Icon name="right" size={18} />
            </button>
          </>
        ) : (
          <>
            <div {...stylex.props(s.priceRow)}>
              <strong {...stylex.props(s.price)}>{money(v.price)}</strong>
              <button
                type="button"
                aria-label="Price rating details"
                aria-haspopup="dialog"
                onClick={() => setPriceInfo(true)}
                {...stylex.props(s.ratingButton)}
              >
                <PriceRating veryGood={v.deal} detail />
                <Icon name="info" size={14} />
              </button>
            </div>
            {v.previousPrice && (
              <p {...stylex.props(s.oldRow)}>
                <span {...stylex.props(s.old)}>{money(v.previousPrice)}</span>
                <span {...stylex.props(s.discount)}>-{money(v.previousPrice - v.price)}</span>
              </p>
            )}
            <p {...stylex.props(s.priceNote)}>
              {v.priceNote || money(v.price / 1.19) + ' Net, 19.00% VAT'}
            </p>
            <button
              type="button"
              aria-label={'Calculate financing, from ' + money(financeMonthly) + ' per month'}
              aria-haspopup="dialog"
              onClick={() => setFinance(true)}
              {...stylex.props(s.finance)}
            >
              <span {...stylex.props(s.financeAmount)}>
                from <strong {...stylex.props(s.financeValue)}>{money(financeMonthly)}</strong> /
                month
              </span>
              <span {...stylex.props(s.financeAction)}>
                Financing <Icon name="right" size={18} />
              </span>
            </button>
          </>
        )}
        <div ref={actions} {...stylex.props(s.actions)}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setContact(true)}
            {...stylex.props(s.action)}
          >
            <span {...stylex.props(s.actionIcon)}>
              <Icon name="phone" size={18} />
            </span>
            Contact
          </button>
          <Link href={'/contact?vehicle=' + v.id} {...stylex.props(s.action, s.enquire)}>
            <span {...stylex.props(s.actionIcon)}>
              <Icon name="mail" size={18} />
            </span>
            Enquire
          </Link>
        </div>
      </section>
      <VehicleSections key={v.id} vehicle={v} showroomMode onReport={() => setReport(true)} />
      {contactDock && (
        <aside
          aria-label="Vehicle enquiry"
          data-vehicle-contact-dock
          {...stylex.props(s.contactDock)}
        >
          <strong {...stylex.props(s.dockPrice)}>
            {money(leasing ? v.monthly || 0 : v.price)}
            {leasing && <span {...stylex.props(s.dockPeriod)}> / month</span>}
          </strong>
          <Link
            href={'/contact?vehicle=' + v.id}
            aria-label={'Enquire about ' + v.make + ' ' + v.model}
            {...stylex.props(s.action, s.enquire)}
          >
            Enquire
          </Link>
        </aside>
      )}
      <ContactSheet vehicle={v} open={contact} onClose={() => setContact(false)} />
      <Modal open={finance} onClose={() => setFinance(false)} title="Calculate Financing">
        <FinanceCalculator vehicle={v} onClose={() => setFinance(false)} />
      </Modal>
      <Modal open={leaseQuote} onClose={() => setLeaseQuote(false)} title="Leasing details">
        <div {...stylex.props(ui.column)}>
          <strong>
            {v.make} {v.model}
          </strong>
          <p>{v.monthly} € per month, including VAT.</p>
          <p>
            {v.leaseTerms?.months} months · {v.leaseTerms?.annualMileage.toLocaleString('en-GB')} km
            per year · {v.leaseTerms?.deposit} € initial payment.
          </p>
          <p {...stylex.props(ui.small, ui.muted)}>
            Captured reference quote only. Live lease calculation and finance applications are not
            connected; no request is sent.
          </p>
          <Button onClick={() => setLeaseQuote(false)}>Close</Button>
        </div>
      </Modal>
      <Modal open={priceInfo} onClose={() => setPriceInfo(false)} title="Price rating">
        <div {...stylex.props(ui.column)}>
          <PriceRating veryGood={v.deal} />
          <p>
            The rating and advertised price are reproduced from the captured reference listing. They
            are not a current market valuation.
          </p>
          <Button onClick={() => setPriceInfo(false)} block>
            Close
          </Button>
        </div>
      </Modal>
      <Modal open={report} onClose={() => setReport(false)} title="Report listing">
        <div {...stylex.props(ui.column)}>
          <p>
            This listing is a local captured example. Reporting to the marketplace is not connected.
          </p>
          <Button onClick={() => setReport(false)} block>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
