'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState } from 'react';
import { showroomVehiclePhotos } from '@/lib/vehicle-copy';
import { rememberInventory } from '@/lib/showroom';
import { togglePark, useAppState } from '@/lib/store';

const s = stylex.create({
  card: {
    position: 'relative',
    minWidth: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', '@media (max-width: 699px)': colors.cardLine },
    borderRadius: 16,
    boxShadow: {
      default: '0 1px 4px rgba(27, 27, 33, 0.08)',
      '@media (max-width: 699px)': '0 3px 12px rgba(27, 27, 33, 0.035)',
    },
    overflow: 'hidden',
  },
  photo: {
    position: 'relative',
    aspectRatio: '16 / 10',
    margin: { default: 12, '@media (min-width: 1024px)': 8 },
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  link: {
    display: 'block',
    textDecoration: 'none',
    '::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 16 },
  },
  image: { objectFit: 'cover' },
  save: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },
  saveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: 24,
    backgroundColor: 'transparent',
    color: colors.text,
    outlineColor: colors.text,
    outlineOffset: -2,
    opacity: { default: 1, ':active': 0.75 },
  },
  savedButton: { color: colors.accent },
  saveFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
  },
  body: { padding: 12, display: 'flex', flexDirection: 'column', gap: 6 },
  title: {
    minWidth: 0,
    fontSize: { default: 18, '@media (max-width: 699px)': 17, '@media (min-width: 1024px)': 16 },
    lineHeight: '24px',
    fontWeight: { default: 700, '@media (max-width: 699px)': 500 },
    overflowWrap: 'anywhere',
  },
  titleText: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
  },
  specs: {
    position: 'relative',
    display: 'flex',
    flexWrap: {
      default: 'wrap',
      '@media (max-width: 699px)': 'nowrap',
    },
    gap: 4,
  },
  hiddenFact: {
    position: { default: 'static', '@media (max-width: 699px)': 'absolute' },
    insetInlineStart: { default: 'auto', '@media (max-width: 699px)': 0 },
    top: { default: 'auto', '@media (max-width: 699px)': 0 },
    visibility: { default: 'visible', '@media (max-width: 699px)': 'hidden' },
    pointerEvents: { default: 'auto', '@media (max-width: 699px)': 'none' },
  },
  fuelFact: { flexShrink: { default: 0, '@media (max-width: 699px)': 1 } },
  price: {
    fontSize: { default: 20, '@media (max-width: 699px)': 18, '@media (min-width: 1024px)': 18 },
    lineHeight: { default: '26px', '@media (max-width: 699px)': '24px' },
    fontWeight: { default: 700, '@media (max-width: 699px)': 400 },
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    minWidth: 0,
    maxWidth: 'calc(50% - 2px)',
    flexShrink: 0,
    paddingInline: 6,
    paddingBlock: 2,
    borderRadius: 4,
    backgroundColor: colors.controlSurface,
    color: colors.muted,
    fontSize: { default: 12, '@media (max-width: 699px)': 14 },
    lineHeight: { default: '18px', '@media (max-width: 699px)': '20px' },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export function ShowroomVehicleCard({
  vehicle,
  priority = false,
}: {
  vehicle: Vehicle;
  priority?: boolean;
}) {
  const { t, locale, number, money } = useLocale();
  const photos = showroomVehiclePhotos(vehicle);
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const factsRow = useRef<HTMLParagraphElement>(null);
  const [hideTransmission, setHideTransmission] = useState(false);
  useEffect(() => {
    const row = factsRow.current;
    if (!row) return;
    const phone = window.matchMedia('(max-width: 699px)');
    let active = true;
    const measure = () => {
      if (!active) return;
      const facts = [...row.querySelectorAll<HTMLElement>('[data-vehicle-fact]')];
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const required = facts.reduce(
        (sum, fact) => sum + Math.max(fact.scrollWidth, fact.getBoundingClientRect().width),
        gap * (facts.length - 1),
      );
      setHideTransmission(phone.matches && required > row.clientWidth + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    phone.addEventListener('change', measure);
    measure();
    void document.fonts.ready.then(measure);
    return () => {
      active = false;
      observer.disconnect();
      phone.removeEventListener('change', measure);
    };
  }, [locale, vehicle]);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = {
    year: String(vehicle.year),
    mileage: number(vehicle.mileage) + ' ' + t('km'),
    fuel: t(vehicle.fuel),
    transmission: t(vehicle.transmission),
  };
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <div {...stylex.props(s.photo)}>
        <Image
          src={photos[0]}
          alt={name}
          fill
          priority={priority}
          sizes="(max-width: 699px) calc(100vw - 56px), 520px"
          {...stylex.props(s.image)}
        />
        <span {...stylex.props(s.save)}>
          <button
            type="button"
            aria-label={
              (locale === 'bg' ? (saved ? 'Премахни ' : 'Запази ') : saved ? 'Remove ' : 'Save ') +
              name +
              (saved ? (locale === 'bg' ? ' от запазените' : ' from saved cars') : '')
            }
            aria-pressed={saved}
            onClick={() => togglePark(vehicle.id)}
            {...stylex.props(s.saveButton, saved && s.savedButton)}
          >
            <span {...stylex.props(s.saveFace)}>
              <Heart
                size={22}
                strokeWidth={1.8}
                fill={saved ? 'currentColor' : 'none'}
                aria-hidden="true"
                focusable="false"
              />
            </span>
          </button>
        </span>
      </div>
      <div {...stylex.props(s.body)}>
        <h2 {...stylex.props(s.title)}>
          <Link href={href} onClick={() => rememberInventory(vehicle.id)} {...stylex.props(s.link)}>
            <span title={name} {...stylex.props(s.titleText)}>
              {name}
            </span>
          </Link>
        </h2>
        <p ref={factsRow} title={Object.values(specs).join(' · ')} {...stylex.props(s.specs)}>
          {Object.entries(specs).map(([key, fact]) => (
            <span
              key={key}
              data-vehicle-fact={key}
              aria-hidden={key === 'transmission' && hideTransmission ? true : undefined}
              title={fact}
              {...stylex.props(
                s.fact,
                key === 'fuel' && s.fuelFact,
                key === 'transmission' && hideTransmission && s.hiddenFact,
              )}
            >
              {fact}
            </span>
          ))}
        </p>
        <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
      </div>
    </article>
  );
}
