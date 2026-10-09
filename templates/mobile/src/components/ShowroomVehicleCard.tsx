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
    display: { default: 'block', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    height: { default: 'auto', '@media (min-width: 1024px)': '100%' },
    minWidth: 0,
    backgroundColor: { default: colors.background, '@media (min-width: 1024px)': 'transparent' },
    borderWidth: { default: 1, '@media (min-width: 1024px)': 0 },
    borderStyle: 'solid',
    borderColor: {
      default: colors.cardLine,
      '@media (min-width: 1024px)': { default: colors.cardLine, ':hover': colors.line },
    },
    borderRadius: { default: 16, '@media (min-width: 1024px)': 0 },
    boxShadow: {
      default: '0 3px 12px rgba(27, 27, 33, 0.035)',
      '@media (min-width: 1024px)': 'none',
      '@media (max-width: 699px)': 'none',
    },
    overflow: { default: 'hidden', '@media (min-width: 1024px)': 'visible' },
  },
  layout: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  photo: {
    position: 'relative',
    flexShrink: 0,
    margin: { default: 12, '@media (min-width: 1024px)': 0 },
    marginBottom: 0,
    borderRadius: { default: 10, '@media (min-width: 1024px)': 12 },
    overflow: 'hidden',
    backgroundColor: colors.surface,
    aspectRatio: { default: '16 / 10', '@media (min-width: 1024px)': '3 / 2' },
  },
  picture: { position: 'absolute', inset: 0 },
  link: {
    display: 'block',
    textDecoration: 'none',
    outline: 'none',
    color: { default: 'inherit', '@media (min-width: 1024px)': { default: 'inherit', ':hover': colors.accent } },
    '::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: { default: 16, '@media (min-width: 1024px)': 12 },
      outline: { default: 'none', ':focus-visible': '2px solid' },
      outlineColor: colors.text,
      outlineOffset: -3,
    },
  },
  image: { objectFit: 'cover' },
  letterboxedImage: {
    transform: { default: 'none', '@media (min-width: 1024px)': 'scale(1.334)' },
  },
  brandedCover: {
    transform: { default: 'none', '@media (min-width: 1024px)': 'scale(1.3)' },
    transformOrigin: { default: '50% 50%', '@media (min-width: 1024px)': '50% 44%' },
  },
  save: {
    position: 'absolute',
    top: { default: 6, '@media (min-width: 1024px)': 8 },
    right: { default: 6, '@media (min-width: 1024px)': 8 },
    zIndex: 2,
  },
  saveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
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
    borderRadius: controlShape.circle,
    backgroundColor: colors.background,
  },
  body: {
    padding: { default: 12, '@media (min-width: 1024px)': '12px 2px 0' },
    flexGrow: { default: 0, '@media (min-width: 1024px)': 1 },
    fontFamily: {
      default: 'inherit',
      '@media (min-width: 1024px)': '"Mobile UI", Arial, sans-serif',
    },
    minWidth: 0,
    display: { default: 'flex', '@media (min-width: 1024px)': 'grid' },
    gridTemplateColumns: {
      default: 'none',
      '@media (min-width: 1024px)': {
        default: 'minmax(0, 1fr) auto',
        '@container (max-width: 280px)': 'minmax(0, 1fr)',
      },
    },
    alignContent: 'start',
    flexDirection: 'column',
    gap: { default: 6, '@media (min-width: 1024px)': 4 },
    columnGap: { default: 6, '@media (min-width: 1024px)': 10 },
  },
  title: {
    minWidth: 0,
    fontSize: { default: 18, '@media (min-width: 1024px)': 16 },
    lineHeight: '24px',
    fontWeight: {
      default: 500,
      '@media (max-width: 699px)': 600,
      '@media (min-width: 1024px)': 600,
    },
    overflowWrap: 'anywhere',
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 1 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 1 },
  },
  titleText: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: { default: 2, '@media (min-width: 1024px)': 1 },
    overflow: 'hidden',
  },
  variant: {
    display: {
      default: 'none',
      '@media (max-width: 699px)': 'block',
    },
    minWidth: 0,
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  specs: {
    display: 'flex',
    flexWrap: { default: 'wrap', '@media (min-width: 1024px)': 'nowrap' },
    alignItems: 'center',
    columnGap: 6,
    rowGap: { default: 6, '@media (min-width: 1024px)': 4 },
    marginTop: 0,
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': '1 / -1' },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 2 },
  },
  price: {
    position: { default: 'static', '@media (min-width: 1024px)': { default: 'static', '@container (max-width: 280px)': 'absolute' } },
    top: { default: 'auto', '@media (min-width: 1024px)': { default: 'auto', '@container (max-width: 280px)': 'calc(66.66667cqw - 10px)' } },
    right: { default: 'auto', '@media (min-width: 1024px)': { default: 'auto', '@container (max-width: 280px)': 10 } },
    transform: { default: 'none', '@media (min-width: 1024px)': { default: 'none', '@container (max-width: 280px)': 'translateY(-100%)' } },
    padding: { default: 0, '@media (min-width: 1024px)': { default: 0, '@container (max-width: 280px)': '5px 8px' } },
    backgroundColor: { default: 'transparent', '@media (min-width: 1024px)': { default: 'transparent', '@container (max-width: 280px)': colors.background } },
    borderRadius: 6,
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 2 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 1 },
    zIndex: { default: 'auto', '@media (min-width: 1024px)': 1 },
    pointerEvents: { default: 'auto', '@media (min-width: 1024px)': 'none' },
    marginTop: 0,
    fontSize: { default: 20, '@media (min-width: 1024px)': { default: 18, '@container (max-width: 280px)': 16 } },
    lineHeight: {
      default: '26px',
      '@media (max-width: 699px)': '24px',
      '@media (min-width: 1024px)': { default: '24px', '@container (max-width: 280px)': '20px' },
    },
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  fact: {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '100%',
    flexShrink: 0,
    paddingInline: { default: 8, '@media (min-width: 1024px)': 0 },
    paddingBlock: { default: 3, '@media (min-width: 1024px)': 0 },
    borderWidth: { default: 1, '@media (min-width: 1024px)': 0 },
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 6,
    backgroundColor: { default: colors.badgeSurface, '@media (min-width: 1024px)': 'transparent' },
    color: { default: colors.muted, '@media (max-width: 699px)': colors.text },
    fontSize: {
      default: 12,
      '@media (max-width: 699px)': 14,
      '@media (min-width: 1024px)': 13,
      '@container (max-width: 250px)': 12,
    },
    lineHeight: {
      default: '18px',
      '@media (max-width: 699px)': '20px',
      '@media (min-width: 1024px)': '20px',
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  separatedFact: {
    '::before': {
      content: '"·"',
      display: { default: 'none', '@media (min-width: 1024px)': 'inline' },
      marginRight: 6,
    },
  },
  footer: { display: 'contents' },
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
  const desktopPhoto = cover && photos.includes(cover)
    ? cover
    : photos[0];
  const { parked } = useAppState();
  const saved = parked.includes(vehicle.id);
  const name = vehicle.make + ' ' + vehicle.model;
  const href = '/vehicle/' + vehicle.id;
  const specs = {
    year: String(vehicle.year),
    mileage: number(vehicle.mileage) + ' ' + t('km'),
    fuel: t(vehicle.fuel),
  };
  return (
    <article data-showroom-vehicle={vehicle.id} {...stylex.props(s.card)}>
      <div {...stylex.props(s.layout)}>
        <div {...stylex.props(s.photo)}>
          <picture {...stylex.props(s.picture)}>
            <source media="(min-width: 1024px)" srcSet={desktopPhoto} />
            <Image
              src={photos[0]}
              alt={name}
              fill
              priority={priority}
              sizes="(min-width: 1600px) 350px, (min-width: 1024px) calc((100vw - 152px) / 4), (max-width: 699px) calc(100vw - 56px), 520px"
              {...stylex.props(
                s.image,
                showroomPhotoHasLetterbox(photos[0]) && s.letterboxedImage,
                desktopPhoto === '/images/bmw-540-gallery-03.webp' && s.brandedCover,
              )}
            />
          </picture>
          <span {...stylex.props(s.save)}>
            <button
              type="button"
              aria-label={
                (locale === 'bg'
                  ? saved
                    ? 'Премахни '
                    : 'Запази '
                  : saved
                    ? 'Remove '
                    : 'Save ') +
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
            <Link
              href={href}
              onClick={() => rememberInventory(vehicle.id)}
              {...stylex.props(s.link)}
            >
              <span title={name} {...stylex.props(s.titleText)}>
                {name}
              </span>
            </Link>
          </h2>
          {localizedVehicle.variant && (
            <p title={localizedVehicle.variant} {...stylex.props(s.variant)}>
              {localizedVehicle.variant}
            </p>
          )}
          <p title={Object.values(specs).join(' · ')} {...stylex.props(s.specs)}>
            {Object.entries(specs).map(([key, fact]) => (
              <span
                key={key}
                data-vehicle-fact={key}
                title={fact}
                {...stylex.props(s.fact, key !== 'year' && s.separatedFact)}
              >
                {fact}
              </span>
            ))}
          </p>
          <div {...stylex.props(s.footer)}>
            <strong {...stylex.props(s.price)}>{money(vehicle.price)}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
