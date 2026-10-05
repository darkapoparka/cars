'use client';

import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';

const s = stylex.create({
  summary: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    position: 'relative',
    padding: 16,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr)',
    gridTemplateAreas: '"rating" "identity" "price" "variant"',
    columnGap: 12,
    rowGap: 4,
    alignItems: 'start',
  },
  besideTitleGrid: { gridTemplateAreas: '"identity" "price" "variant"' },
  identity: { gridArea: 'identity', minWidth: 0 },
  title: {
    fontSize: 20,
    fontWeight: 500,
    lineHeight: '28px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    fontSize: 12,
    lineHeight: '18px',
    overflowWrap: 'anywhere',
  },
  priceGroup: {
    gridArea: 'price',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    minWidth: 0,
    width: 'max-content',
    maxWidth: '100%',
    textAlign: 'left',
  },
  ratingDisclosure: {
    gridArea: 'rating',
    display: 'flex',
    alignItems: 'center',
    minHeight: 24,
    minWidth: 0,
    width: 'max-content',
    maxWidth: '100%',
    alignSelf: 'start',
    justifySelf: 'end',
    padding: 0,
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  ratingBesideTitle: { gridArea: 'identity', alignSelf: 'center' },
  amount: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 8,
    maxWidth: '100%',
  },
  price: { fontSize: 18, fontWeight: 400, lineHeight: '24px', overflowWrap: 'anywhere' },
  oldPrice: { fontSize: 12, fontWeight: 400, lineHeight: '18px', color: colors.muted },
  rating: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    lineHeight: '18px',
    color: colors.green,
  },
  note: {
    flexShrink: 0,
    maxWidth: 140,
    fontSize: 11,
    lineHeight: '16px',
    color: colors.muted,
    overflowWrap: 'anywhere',
  },
  measurementClip: {
    position: 'absolute',
    insetInline: 0,
    top: 0,
    height: 0,
    overflow: 'hidden',
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  measurement: { display: 'flex', alignItems: 'center', gap: 12, width: 'max-content' },
  measurementText: { flexShrink: 0, overflow: 'visible' },
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
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 44,
    paddingBlock: 10,
    paddingInline: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    textDecoration: 'none',
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
  const { t, locale, money } = useLocale();
  const summary = useRef<HTMLElement>(null);
  const measurement = useRef<HTMLDivElement>(null);
  const [ratingBesideTitle, setRatingBesideTitle] = useState(false);
  useLayoutEffect(() => {
    const container = summary.current;
    const probe = measurement.current;
    if (!container || !probe) return;
    const measure = () => {
      const css = getComputedStyle(container);
      const available =
        container.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
      setRatingBesideTitle(available > 0 && probe.getBoundingClientRect().width <= available);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(probe);
    return () => observer.disconnect();
  }, []);
  const fullName = `${v.make} ${v.model}`;
  const variantPills = [...new Set([...v.variant.split(/\s*·\s*/), t(v.transmission)])]
    .map((part) => part.trim())
    .filter(Boolean);
  const price = money(v.price);
  const rating = t(v.deal ? 'Very good price' : 'Good price');
  const note = v.priceNote || money(v.price / 1.19) + (locale === 'bg' ? ' без ДДС' : ' Net');
  const showNote = note !== t('may include delivery costs');
  return (
    <section
      ref={summary}
      data-vehicle-mobile-summary
      data-mobile-price-layout="below-title"
      data-mobile-rating-position={ratingBesideTitle ? 'beside-title' : 'above-title'}
      aria-label={t('Vehicle price and contact')}
      {...stylex.props(s.summary)}
    >
      <div aria-hidden="true" {...stylex.props(s.measurementClip)}>
        <div ref={measurement} {...stylex.props(s.measurement)}>
          <span data-mobile-title-probe {...stylex.props(s.title, s.measurementText)}>
            {fullName}
          </span>
          <span {...stylex.props(s.rating, s.measurementText)}>
            {rating}
            <Icon name="info" size={12} />
          </span>
        </div>
      </div>
      <div {...stylex.props(s.summaryGrid, ratingBesideTitle && s.besideTitleGrid)}>
        <div {...stylex.props(s.identity)}>
          <h1 data-mobile-vehicle-title title={fullName} {...stylex.props(s.title)}>
            {fullName}
          </h1>
        </div>
        <button
          type="button"
          aria-label={t('Price rating details')}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.currentTarget.focus({ preventScroll: true });
            onPriceInfo();
          }}
          {...stylex.props(s.ratingDisclosure, ratingBesideTitle && s.ratingBesideTitle)}
        >
          <span {...stylex.props(s.rating)}>
            {rating}
            <Icon name="info" size={12} />
          </span>
        </button>
        <div data-mobile-vehicle-variant {...stylex.props(s.variant)}>
          {variantPills.map((part) => (
            <span key={part} data-mobile-variant-pill {...stylex.props(s.variantPill)}>
              {part}
            </span>
          ))}
        </div>
        <div data-mobile-price-group {...stylex.props(s.priceGroup)}>
          <span {...stylex.props(s.amount)}>
            <strong data-mobile-vehicle-price {...stylex.props(s.price)}>
              {price}
            </strong>
            {showNote && (
              <span data-mobile-vehicle-net-price {...stylex.props(s.note)}>
                {note}
              </span>
            )}
            {v.previousPrice && <del {...stylex.props(s.oldPrice)}>{money(v.previousPrice)}</del>}
          </span>
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
