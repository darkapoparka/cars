'use client';
import { useLocale } from '@/lib/use-locale';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { showroomVehiclePhotos } from '@/lib/vehicle-copy';
import { importCountryLabel, importExamplesFor, type ImportCountry } from '@/lib/showroom-services';

const s = stylex.create({
  section: { minWidth: 0 },
  heading: {
    fontSize: { default: 16, '@media (min-width: 1024px)': 18 },
    fontWeight: { default: 600, '@media (min-width: 1024px)': 500 },
    lineHeight: '24px',
    marginBottom: { default: 10, '@media (min-width: 1024px)': 16 },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
    },
    gap: { default: 12, '@media (min-width: 1024px)': showroomDesktop.cardGap },
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: colors.line, '@media (min-width: 1024px)': colors.cardLine },
    borderRadius: { default: 16, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    overflow: 'hidden',
    minWidth: 0,
  },
  photo: { position: 'relative', aspectRatio: '16 / 10', backgroundColor: colors.surface },
  image: { objectFit: 'cover' },
  body: {
    padding: { default: 12, '@media (min-width: 1024px)': 14 },
    display: 'flex',
    flexDirection: 'column',
    gap: { default: 3, '@media (min-width: 1024px)': 4 },
  },
  title: {
    fontSize: { default: 18, '@media (min-width: 1024px)': 16 },
    fontWeight: { default: 600, '@media (min-width: 1024px)': 500 },
    lineHeight: '24px',
    overflowWrap: 'anywhere',
  },
  copy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    maxWidth: 'calc(100% - 16px)',
    paddingBlock: 4,
    paddingInline: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
});

export function ShowroomImportExamples({ country = 'all' }: { country?: ImportCountry }) {
  const { t } = useLocale();
  return (
    <section aria-label={t('Example imports')} {...stylex.props(s.section)}>
      <h2 {...stylex.props(s.heading)}>{t('Example imports')}</h2>
      <div {...stylex.props(s.grid)}>
        {importExamplesFor(country).map((example) => {
          const vehicle = vehicles.find((vehicle) => vehicle.id === example.vehicleId);
          if (!vehicle) return null;
          return (
            <article
              key={vehicle.id}
              data-import-example={vehicle.id}
              data-import-country={example.country}
              {...stylex.props(s.card)}
            >
              <div {...stylex.props(s.photo)}>
                <Image
                  src={showroomVehiclePhotos(vehicle)[0]}
                  alt={vehicle.make + ' ' + vehicle.model}
                  fill
                  sizes="(max-width: 699px) calc(100vw - 32px), (max-width: 1071px) calc((100vw - 44px) / 2), 514px"
                  {...stylex.props(s.image)}
                />
                <span {...stylex.props(s.badge)}>{t(importCountryLabel(example.country))}</span>
              </div>
              <div {...stylex.props(s.body)}>
                <h3 {...stylex.props(s.title)}>
                  {vehicle.make} {vehicle.model}
                </h3>
                <p {...stylex.props(s.copy)}>
                  {vehicle.year} · {t(vehicle.fuel)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
