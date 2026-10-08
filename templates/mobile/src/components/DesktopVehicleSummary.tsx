'use client';

import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { PriceRating } from './VehicleCard';
import { vehicleDesktop } from './vehicle-detail-desktop.stylex';

const s = stylex.create({
  card: {
    padding: 24,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 18,
    boxShadow: '0 4px 20px #17202b08',
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
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  price: { display: 'block', fontSize: 32, lineHeight: '40px', fontWeight: 700 },
  note: { marginTop: 4, fontSize: 12, lineHeight: '18px', color: colors.muted },
  previous: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  old: { color: colors.muted, fontSize: 14, lineHeight: '20px' },
  saving: { color: colors.accent, fontSize: 12, lineHeight: '18px' },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    minHeight: 36,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.muted,
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  financing: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    minHeight: 48,
    padding: 12,
    marginTop: 16,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    color: colors.text,
    fontSize: 13,
    lineHeight: '20px',
    textAlign: 'left',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  financeLabel: { display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 },
  financeValue: { display: 'inline-flex', alignItems: 'center', gap: 4 },
  actions: { display: 'grid', gap: 10, marginTop: 20 },
  action: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingBlock: 12,
    paddingInline: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 24,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 14,
    lineHeight: '22px',
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineOffset: 3,
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
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: '20px',
    textDecoration: { default: 'none', ':hover': 'underline' },
    outlineColor: colors.accent,
    outlineOffset: 3,
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
  const monthly = v.financeMonthly || v.monthly || Math.round(v.price * 0.01061);
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
      <div {...stylex.props(s.priceRow)}>
        <strong data-vehicle-desktop-price {...stylex.props(s.price)}>
          {money(leasing ? v.monthly || 0 : v.price)}
        </strong>
        {!(leasing && v.leaseTerms) && (
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
            <PriceRating veryGood={v.deal} detail />
            <Icon name="info" size={14} />
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
          <p {...stylex.props(s.note)}>
            {v.priceNote ||
              money(v.price / 1.19) + (locale === 'bg' ? ' без ДДС, 19% ДДС' : ' Net, 19.00% VAT')}
          </p>
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
        <span {...stylex.props(s.financeLabel)}>
          {t(leasing ? 'Leasing details' : 'Financing ')}
        </span>
        <span {...stylex.props(s.financeValue)}>
          {!leasing && t('from') + ' ' + money(monthly) + ' / ' + t('month')}
          <Icon name="right" size={18} />
        </span>
      </button>
      <div {...stylex.props(s.actions)}>
        <Link
          href={'/contact?vehicle=' + v.id}
          aria-label={t('Enquire about this car') + ': ' + v.make + ' ' + v.model}
          {...stylex.props(s.action, s.primary)}
        >
          <Icon name="mail" size={18} />
          {t('Enquire')}
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
          <Icon name="phone" size={18} />
          {t('Contact')}
        </button>
      </div>
      <Link href={'/vehicle/' + v.id + '/checklist'} {...stylex.props(s.checklist)}>
        <Icon name="checklist" size={16} />
        {t('Checklist')}
      </Link>
    </aside>
  );
}
