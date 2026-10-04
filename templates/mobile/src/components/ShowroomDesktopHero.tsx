'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import type { ShowroomFilterTab } from '@/lib/showroom-filter-editor';
import type { VehicleCategory } from '@/lib/types';
import { Icon } from './Icon';
import { ShowroomDesktopType } from './ShowroomDesktopType';
import { desktopSearchStyles as field } from './showroom-desktop-controls.stylex';

const s = stylex.create({
  hero: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    minHeight: 280,
    marginInline: 16,
    marginTop: 8,
    marginBottom: 0,
    paddingBlock: 32,
    paddingInline: 40,
    borderRadius: 20,
    color: '#fff',
    backgroundColor: '#263644',
    // The media query also keeps this decorative photo out of phone requests.
    backgroundImage: {
      default: 'none',
      '@media (min-width: 1024px)':
        'linear-gradient(180deg, rgba(14, 25, 36, .55), rgba(14, 25, 36, .3)), url("/images/desktop/discovery-hero.jpg")',
    },
    backgroundSize: 'cover',
    backgroundPosition: 'center 80%',
  },
  copy: { textAlign: 'center', maxWidth: 800 },
  title: {
    fontFamily: 'var(--font-base), Arial, sans-serif',
    fontSize: 'clamp(32px, 3vw, 40px)',
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: '-.02em',
    textWrap: 'balance',
  },
  description: { marginTop: 12, fontSize: 15, lineHeight: '24px', textWrap: 'balance' },
  search: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, .95fr) minmax(0, 1.35fr) minmax(0, .85fr) auto',
    alignItems: 'center',
    width: '100%',
    padding: 6,
    borderRadius: 16,
    color: colors.text,
    backgroundColor: colors.background,
    boxShadow: '0 8px 24px rgba(14, 25, 36, .12)',
  },
  submit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
    paddingInline: 20,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: { default: colors.accent, ':hover': '#b72800' },
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    lineHeight: '22px',
    whiteSpace: 'nowrap',
    outlineColor: colors.text,
    outlineOffset: -4,
  },
});

export function ShowroomDesktopHero({
  category,
  query,
  makeLabel,
  priceLabel,
  resultLabel,
  sheet,
  onSelectCategory,
  onOpen,
  onBrowse,
}: {
  category: VehicleCategory;
  query: string;
  makeLabel: string;
  priceLabel: string;
  resultLabel: string;
  sheet: ShowroomFilterTab | null;
  onSelectCategory: (category: VehicleCategory) => void;
  onOpen: (tab: ShowroomFilterTab, button: HTMLButtonElement) => void;
  onBrowse: () => void;
}) {
  const { t } = useLocale();
  const fields = [
    { tab: 'make', label: 'Make & model', value: query || makeLabel },
    { tab: 'price', label: 'Price', value: priceLabel },
  ] as const;
  return (
    <section
      aria-labelledby="desktop-discovery-title"
      data-desktop-discovery-hero
      {...stylex.props(s.hero)}
    >
      <div {...stylex.props(s.copy)}>
        <h2 id="desktop-discovery-title" {...stylex.props(s.title)}>
          {t('Find your next vehicle')}
        </h2>
        <p {...stylex.props(s.description)}>
          {t('Explore the showroom. Find a vehicle that fits you.')}
        </p>
      </div>
      <div role="group" aria-label={t('Find a vehicle')} {...stylex.props(s.search)}>
        <ShowroomDesktopType category={category} onSelect={onSelectCategory} />
        {fields.map(({ tab, label, value }) => (
          <button
            key={tab}
            type="button"
            data-desktop-hero-filter={tab}
            aria-label={t(label) + ': ' + value}
            aria-haspopup="dialog"
            aria-expanded={sheet === tab}
            onClick={(event) => onOpen(tab, event.currentTarget)}
            {...stylex.props(field.field, field.divided, sheet === tab && field.open)}
          >
            <span {...stylex.props(field.copy)}>
              <span {...stylex.props(field.label)}>{t(label)}</span>
              <span {...stylex.props(field.value)}>{value}</span>
            </span>
            <Icon name="down" size={16} />
          </button>
        ))}
        <button type="button" data-desktop-browse onClick={onBrowse} {...stylex.props(s.submit)}>
          <Icon name="search" size={18} />
          {resultLabel}
        </button>
      </div>
    </section>
  );
}
