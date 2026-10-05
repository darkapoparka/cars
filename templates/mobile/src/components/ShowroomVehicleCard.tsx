'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
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
    borderColor: 'transparent',
    borderRadius: 16,
    boxShadow: '0 1px 4px rgba(27, 27, 33, 0.08)',
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
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  price: {
    fontSize: { default: 20, '@media (max-width: 699px)': 18, '@media (min-width: 1024px)': 18 },
    lineHeight: { default: '26px', '@media (max-width: 699px)': '24px' },
    fontWeight: { default: 700, '@media (max-width: 699px)': 400 },
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    minWidth: 0,
    // Four badges, each at most half the row, fit within two rows.
    maxWidth: 'calc(50% - 2px)',
    flexShrink: 0,
    paddingInline: 6,
    paddingBlock: 2,
    borderRadius: 4,
    backgroundColor: colors.controlSurface,
    color: colors.muted,
    fontSize: 12,
    lineHeight: '18px',
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
        <p title={Object.values(specs).join(' · ')} {...stylex.props(s.specs)}>
          {Object.entries(specs).map(([key, fact]) => (
            <span key={key} title={fact} {...stylex.props(s.fact)}>
              {fact}
            </span>
          ))}
        </p>
        <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
      </div>
    </article>
  );
}
