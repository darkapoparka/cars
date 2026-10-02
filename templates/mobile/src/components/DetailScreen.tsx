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
import { VehicleSections } from './VehicleSections';
import { Header } from './Header';
import { Icon } from './Icon';
import { Button, IconButton, Modal, ui } from './ui';
import { ContactSheet } from './ContactSheet';
import { FinanceCalculator } from './FinanceCalculator';
import { PriceRating } from './VehicleCard';
const s = stylex.create({
  paymentTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    marginInline: 16,
    marginTop: 12,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
  },
  paymentTab: {
    backgroundColor: colors.background,
    color: colors.text,
    borderWidth: 0,
    fontSize: 14,
    fontWeight: 700,
  },
  selectedTab: { boxShadow: 'inset 0 0 0 1.5px #5a087b' },
  leasePrice: { display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 },
  leaseCopy: { fontSize: 12, color: colors.muted, lineHeight: '20px' },
  leaseAction: {
    borderWidth: 0,
    padding: 0,
    width: 'fit-content',
    fontSize: 16,
    fontWeight: 700,
    color: colors.accent,
    backgroundColor: 'transparent',
    textAlign: 'left',
    lineHeight: '24px',
  },
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
    right: 8,
    bottom: 8,
    width: 84,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#38393c',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
  },
  info: { paddingInline: 16, paddingTop: 8 },
  stickyPrice: {
    position: 'sticky',
    top: 60,
    zIndex: 26,
    backgroundColor: colors.background,
    paddingInline: 16,
    paddingBottom: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  model: { fontSize: 14, fontWeight: 700, lineHeight: '20px' },
  variant: { fontSize: 16, lineHeight: '24px' },
  price: { fontFamily: 'var(--font-base)', fontSize: 20, fontWeight: 700, lineHeight: '28px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, marginBottom: 10 },
  finance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: { default: 24, '@media (max-width: 380px)': 12 },
    padding: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.accent,
    width: '100%',
    marginTop: 8,
    minHeight: 48,
    fontSize: 14,
  },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 },
  financeAmount: {
    minWidth: { default: 131, '@media (max-width: 380px)': 112 },
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: colors.text,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  financeAction: { flex: '1', textAlign: 'left' },
  ratingButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.muted,
    padding: 0,
  },
  oldRow: { marginTop: 4, marginBottom: 6 },
  discountFinance: { marginTop: 14 },
  financeValue: { fontWeight: 700, fontSize: 16 },
  old: { fontSize: 16, fontWeight: 700, textDecoration: 'line-through', color: colors.accent },
  discount: {
    backgroundColor: '#ff8f66',
    color: colors.text,
    paddingLeft: 18,
    paddingRight: 8,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '22px',
    clipPath: 'polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%)',
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 5,
      top: 9,
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: '#fff',
    },
  },
});
export function DetailScreen({ vehicle: v }: { vehicle: Vehicle }) {
  const router = useRouter();
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

  const [priceInfo, setPriceInfo] = useState(false);
  const [report, setReport] = useState(false);
  useEffect(() => markViewed(v.id), [v.id]);
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
        href={'/vehicle/' + v.id + '/gallery'}
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
        <h1 {...stylex.props(s.model, ui.row)}>
          {v.make} {v.model}
        </h1>
        <p {...stylex.props(s.variant)}>{v.variant}</p>
      </section>
      {v.leaseTerms && (
        <div {...stylex.props(s.paymentTabs)} role="tablist" aria-label="Payment type">
          <button
            type="button"
            role="tab"
            aria-selected={!leasing}
            onClick={() => setPaymentOverride('buy')}
            {...stylex.props(s.paymentTab, !leasing && s.selectedTab)}
          >
            Buying
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={leasing}
            onClick={() => setPaymentOverride('lease')}
            {...stylex.props(s.paymentTab, leasing && s.selectedTab)}
          >
            Leasing
          </button>
        </div>
      )}
      <section aria-label="Vehicle price and contact" {...stylex.props(s.stickyPrice)}>
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
              {...stylex.props(s.leaseAction)}
              onClick={() => setLeaseQuote(true)}
            >
              Calculate lease rate
            </button>
          </>
        ) : (
          <>
            <div {...stylex.props(s.priceRow)}>
              <strong {...stylex.props(s.price)}>{money(v.price)}</strong>
              <button
                type="button"
                aria-label="Price rating details"
                onClick={() => setPriceInfo(true)}
                {...stylex.props(s.ratingButton)}
              >
                <PriceRating veryGood={v.deal} detail />
                <Icon name="info" size={14} />
              </button>
            </div>
            {v.previousPrice && (
              <p {...stylex.props(ui.row, s.oldRow)}>
                <span {...stylex.props(s.old)}>{money(v.previousPrice)}</span>
                <span {...stylex.props(s.discount)}>-{money(v.previousPrice - v.price)}</span>
              </p>
            )}
            <p {...stylex.props(ui.small, ui.muted, ui.row)}>
              {v.priceNote || money(v.price / 1.19) + ' Net, 19.00% VAT'}{' '}
              <Icon name="info" size={14} />
            </p>
            <button
              type="button"
              onClick={() => setFinance(true)}
              {...stylex.props(s.finance, Boolean(v.previousPrice) && s.discountFinance)}
            >
              <span {...stylex.props(s.financeAmount)}>
                from{' '}
                <strong {...stylex.props(s.financeValue)}>
                  {money(v.financeMonthly || v.monthly || Math.round(v.price * 0.01061))}
                </strong>{' '}
                mth. <Icon name="info" size={14} />
              </span>
              <strong {...stylex.props(s.financeAction)}>Calculate Financing</strong>
            </button>
          </>
        )}
        <div {...stylex.props(s.actions)}>
          <Button icon="phone" onClick={() => setContact(true)}>
            Contact
          </Button>
          <Button icon="mail" href={'/contact?vehicle=' + v.id}>
            Enquire
          </Button>
        </div>
      </section>
      <VehicleSections vehicle={v} showroomMode onReport={() => setReport(true)} />
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
