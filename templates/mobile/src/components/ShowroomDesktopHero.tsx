'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import type { ShowroomFilterTab } from '@/lib/showroom-filter-editor';
import { Icon } from './Icon';

const s = stylex.create({
  hero: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    minHeight: 280,
    order: 2,
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
    gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, .85fr) auto',
    alignItems: 'center',
    width: '100%',
    padding: 6,
    borderRadius: 16,
    color: colors.text,
    backgroundColor: colors.background,
    boxShadow: '0 8px 32px rgba(14, 25, 36, .16)',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
    minHeight: 56,
    paddingInline: 16,
    paddingBlock: 6,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  divided: { borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: colors.line },
  fieldCopy: { flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 },
  fieldLabel: { color: colors.muted, fontSize: 12, lineHeight: '18px' },
  value: {
    fontSize: 15,
    lineHeight: '22px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
  query,
  makeLabel,
  priceLabel,
  resultLabel,
  sheet,
  onOpen,
  onBrowse,
}: {
  query: string;
  makeLabel: string;
  priceLabel: string;
  resultLabel: string;
  sheet: ShowroomFilterTab | null;
  onOpen: (tab: ShowroomFilterTab, button: HTMLButtonElement) => void;
  onBrowse: () => void;
}) {
  const { t } = useLocale();
  const fields = [
    { tab: 'search', label: 'Search', value: query || t('Search make or model') },
    { tab: 'make', label: 'Make & model', value: makeLabel },
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
        {fields.map(({ tab, label, value }, index) => (
          <button
            key={tab}
            type="button"
            data-desktop-hero-filter={tab}
            aria-label={t(label) + ': ' + value}
            aria-haspopup="dialog"
            aria-expanded={sheet === tab}
            onClick={(event) => onOpen(tab, event.currentTarget)}
            {...stylex.props(s.field, index > 0 && s.divided)}
          >
            {tab === 'search' && <Icon name="search" size={20} />}
            <span {...stylex.props(s.fieldCopy)}>
              <span {...stylex.props(s.fieldLabel)}>{t(label)}</span>
              <span {...stylex.props(s.value)}>{value}</span>
            </span>
            {tab !== 'search' && <Icon name="down" size={16} />}
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
