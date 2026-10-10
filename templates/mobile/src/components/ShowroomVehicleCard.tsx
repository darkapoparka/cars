'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { useLocale } from '@/lib/use-locale';
import { localizeVehicle, showroomPhotoHasLetterbox } from '@/lib/vehicle-copy';
import { rememberInventory } from '@/lib/inventory-navigation';
import { togglePark, useAppState } from '@/lib/store';

const desktopCovers: Record<string, string> = {
  'bmw-x6': '/images/x6-gallery-06.webp',
  'bmw-540': '/images/bmw-540-gallery-03.webp',
  'bmw-x3': '/images/bmw-x3-gallery-03.webp',
};

const s = stylex.create({
  card: {
    position: 'relative',
    containerType: { default: 'normal', '@media (min-width: 1024px)': 'inline-size' },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 0,
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.background },
    borderWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: { default: 0, '@media (min-width: 1024px)': 16 },
    boxShadow: 'none',
    overflow: { default: 'visible', '@media (min-width: 1024px)': 'hidden' },
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  photo: {
    position: 'relative',
    flexShrink: 0,
    borderRadius: { default: 12, '@media (min-width: 1024px)': '15px 15px 0 0' },
    overflow: 'hidden',
    backgroundColor: colors.surface,
    aspectRatio: '3 / 2',
  },
  picture: { position: 'absolute', inset: 0 },
  link: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    display: 'block',
    borderRadius: { default: 12, '@media (min-width: 1024px)': 16 },
    outline: { default: 'none', ':focus-visible': '2px solid' },
    outlineColor: colors.text,
    outlineOffset: -3,
  },
  image: { objectFit: 'cover' },
  letterboxedImage: {
    // Crop padding baked into these photos before the rounded frame clips them.
    transform: 'scale(1.334)',
  },
  brandedCover: {
    transform: { default: 'none', '@media (min-width: 1024px)': 'scale(1.3)' },
    transformOrigin: { default: '50% 50%', '@media (min-width: 1024px)': '50% 44%' },
  },
  save: {
    display: { default: 'none', '@media (min-width: 1024px)': 'block' },
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 3,
  },
  saveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: 'transparent',
    color: '#24262c',
    outlineColor: colors.text,
    outlineOffset: -2,
    opacity: { default: 1, ':active': 0.75 },
  },
  savedButton: { color: colors.accent },
  saveFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26,
    borderRadius: controlShape.circle,
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: { default: 'none', '@media (min-width: 1024px)': 'blur(8px)' },
  },
  body: {
    position: 'relative',
    padding: {
      default: '6px 0 0',
      '@media (min-width: 1024px)': 16,
    },
    marginTop: { default: 0, '@media (min-width: 1024px)': -20 },
    borderRadius: { default: 0, '@media (min-width: 1024px)': 16 },
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': colors.background },
    flexGrow: 1,
    fontFamily: {
      default: 'inherit',
      '@media (min-width: 1024px)': '"Mobile UI", Arial, sans-serif',
    },
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 2, '@media (min-width: 1024px)': 8 },
  },
  summary: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    minWidth: 0,
    gap: 4,
  },
  title: {
    minWidth: 0,
    margin: 0,
    fontSize: { default: '0.9375rem', '@media (min-width: 1024px)': 16 },
    lineHeight: 1.3,
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  titleText: {
    display: { default: 'block', '@media (min-width: 1024px)': '-webkit-box' },
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    whiteSpace: { default: 'nowrap', '@media (min-width: 1024px)': 'normal' },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mobileMeta: {
    display: { default: 'flex', '@media (min-width: 1024px)': 'none' },
    flexWrap: 'wrap',
    gap: 4,
    margin: 0,
    color: colors.muted,
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  specs: {
    display: { default: 'none', '@media (min-width: 1024px)': 'grid' },
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    alignItems: 'center',
    gap: 6,
    margin: 0,
    padding: 0,
    listStyle: 'none',
    pointerEvents: 'none',
    fontFamily: '"Mobile UI", Arial, sans-serif',
  },
  price: {
    pointerEvents: 'none',
    fontSize: {
      default: '1.125rem',
      '@media (min-width: 1024px)': { default: 22, '@container (max-width: 250px)': 20 },
    },
    lineHeight: 1.25,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    display: 'block',
    textAlign: 'center',
    minWidth: 0,
    maxWidth: '100%',
    padding: '4px 8px',
    borderRadius: controlShape.pill,
    backgroundColor: colors.badgeSurface,
    color: colors.muted,
    fontWeight: 500,
    fontSize: { default: 13, '@container (max-width: 250px)': 12 },
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priceRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 0,
    paddingRight: 0,
    gap: { default: 0, '@media (min-width: 1024px)': 8 },
    order: { default: 1, '@media (min-width: 1024px)': 0 },
    marginTop: { default: 'auto', '@media (min-width: 1024px)': 0 },
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
  const localizedVehicle = localizeVehicle(vehicle, locale);
  const photos = localizedVehicle.images;
  const cover = desktopCovers[vehicle.id];
  const desktopPhoto = cover && photos.includes(cover) ? cover : photos[0];
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = {
    year: String(vehicle.year),
    mileage: number(vehicle.mileage) + ' ' + t('km'),
    transmission: t(vehicle.transmission),
    fuel: t(vehicle.fuel),
  };
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <Link
        href={href}
        aria-label={name}
        onClick={() => rememberInventory(vehicle.id)}
        {...stylex.props(s.link)}
      />
      <div {...stylex.props(s.layout)}>
        <div {...stylex.props(s.photo)}>
          <picture {...stylex.props(s.picture)}>
            <source media="(min-width: 1024px)" srcSet={desktopPhoto} />
            <Image
              src={photos[0]}
              alt={name}
              fill
              priority={priority}
              sizes="(min-width: 1448px) 256px, (min-width: 1440px) calc((100vw - 168px) / 5), (min-width: 1024px) calc((100vw - 152px) / 4), calc((100vw - 46px) / 2)"
              {...stylex.props(
                s.image,
                showroomPhotoHasLetterbox(photos[0]) && s.letterboxedImage,
                desktopPhoto === '/images/bmw-540-gallery-03.webp' && s.brandedCover,
              )}
            />
          </picture>
        </div>
        <div {...stylex.props(s.body)}>
          <div {...stylex.props(s.summary)}>
            <div {...stylex.props(s.priceRow)}>
              <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
            </div>
            <h2 {...stylex.props(s.title)}>
              <span title={name} {...stylex.props(s.titleText)}>
                {name}
              </span>
            </h2>
          </div>
          <p {...stylex.props(s.mobileMeta)}>
            <span data-vehicle-fact="year">{specs.year}</span>
            <span aria-hidden="true">·</span>
            <span data-vehicle-fact="mileage">{specs.mileage}</span>
          </p>
          <ul
            aria-label={locale === 'bg' ? 'Характеристики на ' + name : 'Vehicle facts for ' + name}
            {...stylex.props(s.specs)}
          >
            {Object.entries(specs).map(([key, fact]) => (
              <li key={key} data-vehicle-fact={key} title={fact} {...stylex.props(s.fact)}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
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
              size={17}
              strokeWidth={1.7}
              fill={saved ? 'currentColor' : 'none'}
              aria-hidden="true"
              focusable="false"
            />
          </span>
        </button>
      </span>
    </article>
  );
}
