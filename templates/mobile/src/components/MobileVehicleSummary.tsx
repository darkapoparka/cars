'use client';

import type { RefObject } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  summary: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    padding: 16,
    paddingBottom: 8,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto',
    gridTemplateAreas: '"identity rating" "price price" "variant variant"',
    columnGap: 12,
    rowGap: 4,
    alignItems: 'start',
  },
  identity: { gridArea: 'identity', minWidth: 0 },
  title: {
    fontSize: 20,
    fontWeight: 500,
    lineHeight: '28px',
    overflowWrap: 'anywhere',
  },
  variant: {
    gridArea: 'variant',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
    minWidth: 0,
  },
  variantPill: {
    display: 'inline-flex',
    alignItems: 'center',
    maxWidth: '100%',
    minHeight: 22,
    paddingBlock: 2,
    paddingInline: 8,
    borderRadius: 999,
    backgroundColor: colors.controlSurface,
    color: colors.muted,
    fontSize: 13,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceGroup: {
    gridArea: 'price',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: 8,
    rowGap: 0,
    minWidth: 0,
  },
  ratingDisclosure: {
    gridArea: 'rating',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    marginBlock: -8,
    minWidth: 0,
    width: 'max-content',
    maxWidth: '100%',
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  amount: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 8,
    maxWidth: '100%',
  },
  price: {
    fontSize: 18,
    fontWeight: 400,
    lineHeight: '24px',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  oldPrice: { fontSize: 14, fontWeight: 400, lineHeight: '20px', color: colors.muted },
  rating: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    lineHeight: '20px',
    color: colors.green,
  },
  note: {
    fontSize: 14,
    lineHeight: '20px',
    color: colors.muted,
    overflowWrap: 'anywhere',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 8,
    marginTop: 12,
  },
  action: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    paddingBlock: 10,
    paddingInline: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: controlShape.pill,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  primary: {
    backgroundColor: { default: colors.text, ':hover': colors.text },
    borderColor: colors.text,
    color: colors.background,
  },
  icon: { display: 'inline-flex', flexShrink: 0 },
});

export function MobileVehicleSummary({
  vehicle: v,
  actions,
  onPriceInfo,
  onContact,
}: {
  vehicle: Vehicle;
  actions: RefObject<HTMLDivElement | null>;
  onPriceInfo: () => void;
  onContact: () => void;
}) {
  const { t, money } = useLocale();
  const fullName = `${v.make} ${v.model}`;
  const variantPills = [...new Set([...v.variant.split(/\s*·\s*/), t(v.transmission)])]
    .map((part) => part.trim())
    .filter(Boolean);
  const price = money(v.price);
  const rating = t(v.priceRating === 'very-good' ? 'Very good price' : 'Good price');
  return (
    <section
      data-vehicle-mobile-summary
      data-mobile-price-layout="compact"
      aria-label={t('Vehicle price and contact')}
      {...stylex.props(s.summary)}
    >
      <div {...stylex.props(s.summaryGrid)}>
        <div {...stylex.props(s.identity)}>
          <h1 data-mobile-vehicle-title title={fullName} {...stylex.props(s.title)}>
            {fullName}
          </h1>
        </div>
        <div data-mobile-price-group {...stylex.props(s.priceGroup)}>
          <span {...stylex.props(s.amount)}>
            <strong data-mobile-vehicle-price {...stylex.props(s.price)}>
              {price}
            </strong>
            {v.previousPrice && <del {...stylex.props(s.oldPrice)}>{money(v.previousPrice)}</del>}
          </span>
          {v.priceNote && (
            <p data-mobile-vehicle-price-note {...stylex.props(s.note)}>
              {v.priceNote}
            </p>
          )}
        </div>
        {v.priceRating && (
          <button
            type="button"
            aria-label={t('Price rating details')}
            aria-haspopup="dialog"
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true });
              onPriceInfo();
            }}
            {...stylex.props(s.ratingDisclosure)}
          >
            <span {...stylex.props(s.rating)}>
              {rating}
              <Icon name="info" size={12} />
            </span>
          </button>
        )}
        <div data-mobile-vehicle-variant {...stylex.props(s.variant)}>
          {variantPills.map((part) => (
            <span key={part} data-mobile-variant-pill {...stylex.props(s.variantPill)}>
              {part}
            </span>
          ))}
        </div>
      </div>
      <div ref={actions} data-mobile-vehicle-actions {...stylex.props(s.actions)}>
        <Link href={'/contact?vehicle=' + v.id} {...stylex.props(s.action, s.primary)}>
          <span {...stylex.props(s.icon)}>
            <Icon name="mail" size={18} />
          </span>
          {t('Enquire')}
        </Link>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={onContact}
          {...stylex.props(s.action)}
        >
          <span {...stylex.props(s.icon)}>
            <Icon name="phone" size={18} />
          </span>
          {t('Contact')}
        </button>
      </div>
    </section>
  );
}
