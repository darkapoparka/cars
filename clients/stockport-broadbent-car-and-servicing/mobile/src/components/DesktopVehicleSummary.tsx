'use client';
import { formatStockMileage } from "../lib/dealer-mileage";

import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { defaultPaymentEstimate } from '@/lib/search';
import { localizeSpecification } from '@/lib/vehicle-copy';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { PriceRating } from './VehicleCard';
import { vehicleDesktop } from './vehicle-detail-desktop.stylex';

const s = stylex.create({
  card: {
    padding: 24,
    backgroundColor: colors.stripe,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 18,
  },
  paymentTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 2,
    padding: 3,
    marginBottom: 20,
    backgroundColor: colors.controlSurface,
    borderRadius: 24,
  },
  paymentTab: {
    minHeight: 44,
    padding: 8,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  selectedTab: { backgroundColor: colors.background, boxShadow: '0 1px 3px #0001' },
  priceHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  priceCopy: { minWidth: 0 },
  priceLabel: { marginBottom: 6, fontSize: 13, lineHeight: '20px', color: colors.muted },
  price: { display: 'block', fontSize: 36, lineHeight: '44px', fontWeight: 700 },
  note: { marginTop: 4, fontSize: 12, lineHeight: '18px', color: colors.muted },
  previous: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  old: { color: colors.muted, fontSize: 14, lineHeight: '20px' },
  saving: { color: colors.accent, fontSize: 12, lineHeight: '18px' },
  rating: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    minHeight: 44,
    width: 'fit-content',
    maxWidth: '100%',
    padding: 0,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: colors.muted,
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  ratingFace: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 34,
    maxWidth: '100%',
    paddingBlock: 4,
    paddingInline: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 8,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
  },
  financing: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    minHeight: 64,
    padding: 14,
    marginTop: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 12,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 13,
    lineHeight: '20px',
    textAlign: 'left',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  financeCopy: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  financeLabel: { fontWeight: 500 },
  financeValue: { color: colors.muted, overflowWrap: 'anywhere' },
  financeChevron: { display: 'inline-flex', flexShrink: 0, color: colors.muted },
  actions: { display: 'grid', gap: 8, marginTop: 16 },
  action: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingBlock: 2,
    paddingInline: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 15,
    lineHeight: '20px',
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  actionFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    minHeight: 48,
    paddingBlock: 12,
    paddingInline: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 24,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
  },
  primary: {
    backgroundColor: { default: colors.text, ':hover': colors.text },
    color: colors.background,
    borderColor: colors.text,
  },
  checklist: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    marginTop: 20,
    paddingBlock: 12,
    paddingInline: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 24,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 13,
    lineHeight: '20px',
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  facts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 10,
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.cardLine,
  },
  fact: { padding: 12, borderRadius: 10, backgroundColor: colors.background, minWidth: 0 },
  factLabel: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  factValue: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: '22px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
});

export function DesktopVehicleSummary({
  vehicle: v,
  leasing,
  onPaymentChange,
  onFinance,
  onLeaseDetails,
  onPriceInfo,
  onContact,
}: {
  vehicle: Vehicle;
  leasing: boolean;
  onPaymentChange: (payment: 'buy' | 'lease') => void;
  onFinance: () => void;
  onLeaseDetails: () => void;
  onPriceInfo: () => void;
  onContact: () => void;
}) {
  const { t, locale, money, number } = useLocale();
  const monthly = defaultPaymentEstimate(v.price);
  return (
    <aside
      data-vehicle-desktop-summary
      aria-label={t('Vehicle price and contact')}
      {...stylex.props(vehicleDesktop.summary, s.card)}
    >
      {v.leaseTerms && (
        <div role="group" aria-label={t('Payment type')} {...stylex.props(s.paymentTabs)}>
          {(['buy', 'lease'] as const).map((payment) => (
            <button
              key={payment}
              type="button"
              aria-pressed={leasing === (payment === 'lease')}
              onClick={() => onPaymentChange(payment)}
              {...stylex.props(s.paymentTab, leasing === (payment === 'lease') && s.selectedTab)}
            >
              {t(payment === 'buy' ? 'Buying' : 'Leasing')}
            </button>
          ))}
        </div>
      )}
      <div {...stylex.props(s.priceHeader)}>
        <div {...stylex.props(s.priceCopy)}>
          <p data-vehicle-desktop-price-label {...stylex.props(s.priceLabel)}>
            {t(leasing ? 'Leasing' : 'Vehicle price')}
          </p>
          <strong data-vehicle-desktop-price {...stylex.props(s.price)}>
            {money(leasing ? v.monthly || 0 : v.price)}
          </strong>
        </div>
        {!(leasing && v.leaseTerms) && v.priceRating && (
          <button
            type="button"
            aria-label={t('Price rating details')}
            aria-haspopup="dialog"
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true });
              onPriceInfo();
            }}
            {...stylex.props(s.rating)}
          >
            <span data-vehicle-desktop-rating-face {...stylex.props(s.ratingFace)}>
              <PriceRating veryGood={v.priceRating === 'very-good'} detail />
              <Icon name="info" size={14} />
            </span>
          </button>
        )}
      </div>
      {leasing && v.leaseTerms ? (
        <>
          <p {...stylex.props(s.note)}>{t('Monthly incl. VAT.')}</p>
          <p {...stylex.props(s.note)}>
            {v.leaseTerms.months} {t('months')} · {number(v.leaseTerms.annualMileage)}{' '}
            {t('km per year')}
          </p>
          <p {...stylex.props(s.note)}>
            {money(v.leaseTerms.deposit)} {t('initial payment')} · {t(v.leaseTerms.customer)}
          </p>
        </>
      ) : (
        <>
          {v.previousPrice && (
            <p {...stylex.props(s.previous)}>
              <del {...stylex.props(s.old)}>{money(v.previousPrice)}</del>
              <span {...stylex.props(s.saving)}>−{money(v.previousPrice - v.price)}</span>
            </p>
          )}
          {v.priceNote && <p {...stylex.props(s.note)}>{v.priceNote}</p>}
        </>
      )}
      <button
        type="button"
        aria-label={t(leasing ? 'Leasing details' : 'Calculate Financing')}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          if (leasing) onLeaseDetails();
          else onFinance();
        }}
        {...stylex.props(s.financing)}
      >
        <span {...stylex.props(s.financeCopy)}>
          <span {...stylex.props(s.financeLabel)}>
            {t(leasing ? 'Leasing details' : 'Financing')}
          </span>
          {!leasing && (
            <span {...stylex.props(s.financeValue)}>
              {t('Estimate') + ' ' + money(monthly) + ' / ' + t('month')}
            </span>
          )}
        </span>
        <span {...stylex.props(s.financeChevron)}>
          <Icon name="right" size={18} />
        </span>
      </button>
      <div {...stylex.props(s.actions)}>
        <Link
          href={'/contact?vehicle=' + v.id}
          aria-label={t('Enquire about this car') + ': ' + v.make + ' ' + v.model}
          {...stylex.props(s.action)}
        >
          <span data-vehicle-action-face {...stylex.props(s.actionFace, s.primary)}>
            <Icon name="mail" size={16} />
            {t('Enquire')}
          </span>
        </Link>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={(event) => {
            event.currentTarget.focus({ preventScroll: true });
            onContact();
          }}
          {...stylex.props(s.action)}
        >
          <span data-vehicle-action-face {...stylex.props(s.actionFace)}>
            <Icon name="phone" size={16} />
            {t('Contact')}
          </span>
        </button>
      </div>
      <dl aria-label={t('Vehicle overview')} {...stylex.props(s.facts)}>
        {[
          ['Mileage', formatStockMileage(v)],
          v.mileage > 0
            ? ['First registered', v.registration]
            : ['Vehicle condition', t('New vehicle')],
          ['Fuel', v.attributes?.fuelLabel || v.fuel],
          ['Transmission', v.transmission],
        ].map(([label, value]) => (
          <div key={label} {...stylex.props(s.fact)}>
            <dt {...stylex.props(s.factLabel)}>{t(label)}</dt>
            <dd {...stylex.props(s.factValue)}>{localizeSpecification(value, locale)}</dd>
          </div>
        ))}
      </dl>
      <Link href={'/vehicle/' + v.id + '/checklist'} {...stylex.props(s.checklist)}>
        <Icon name="checklist" size={16} />
        {t('Checklist')}
      </Link>
    </aside>
  );
}
