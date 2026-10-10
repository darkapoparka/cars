'use client';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import type { ShowroomFilterTab } from '@/lib/showroom-filter-editor';
import type { VehicleCategory } from '@/lib/types';
import { Icon } from './Icon';
import { ShowroomDesktopType } from './ShowroomDesktopType';
import { ShowroomHeroHeading } from './ShowroomPageLayout';
import { showroomHeroStyles as hero } from './showroom-hero.stylex';
import { desktopSearchStyles as field } from './showroom-desktop-controls.stylex';

const s = stylex.create({
  compactSearchPanel: { maxWidth: 880 },
  search: {
    display: { default: 'none', '@media (min-width: 1024px)': 'grid' },
    gridTemplateColumns: 'minmax(0, .95fr) minmax(0, 1.35fr) minmax(0, .85fr) auto',
    alignItems: 'center',
    width: '100%',
    padding: 6,
    gap: 6,
  },
  splitSearch: {
    gridTemplateColumns: 'minmax(210px, 1fr) minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, .85fr) auto',
  },
  disabledField: { opacity: 0.6, cursor: 'not-allowed' },
  submit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    minHeight: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: { default: colors.accent, ':hover': '#b72800' },
    color: '#fff',
    outlineColor: colors.text,
    outlineOffset: -4,
  },
  fieldWrapper: { position: 'relative', minWidth: 0 },
  clearableField: { paddingInlineEnd: 44 },
  clearField: {
    position: 'absolute',
    right: 4,
    top: 6,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    minHeight: 44,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    color: colors.muted,
    outlineColor: colors.accent,
    outlineOffset: -2,
  },
});

export function ShowroomDesktopHero({
  category,
  makeLabel,
  modelLabel,
  priceLabel,
  resultLabel,
  sheet,
  makeView,
  onSelectCategory,
  onOpen,
  onBrowse,
  makeActive,
  modelActive,
  modelReady,
  priceActive,
  onClear,
}: {
  category: VehicleCategory;
  makeLabel: string;
  modelLabel: string;
  priceLabel: string;
  resultLabel: string;
  sheet: ShowroomFilterTab | null;
  makeView: 'make' | 'model';
  onSelectCategory: (category: VehicleCategory) => void;
  onOpen: (
    tab: ShowroomFilterTab | 'model',
    button: HTMLButtonElement,
    keyboardOpening: boolean,
  ) => void;
  onBrowse: () => void;
  makeActive: boolean;
  modelActive: boolean;
  modelReady: boolean;
  priceActive: boolean;
  onClear: (tab: 'make' | 'model' | 'price') => void;
}) {
  const { t } = useLocale();
  const fields = [
    {
      tab: 'make',
      label: category === 'car' ? 'Make' : 'Make & model',
      value: makeLabel,
      active: makeActive,
      disabled: false,
    },
    ...(category === 'car'
      ? [
          {
            tab: 'model',
            label: 'Model',
            value: modelLabel,
            active: modelActive,
            disabled: !modelReady,
          } as const,
        ]
      : []),
    { tab: 'price', label: 'Price', value: priceLabel, active: priceActive, disabled: false },
  ] as const;
  return (
    <div data-desktop-discovery-hero {...stylex.props(hero.layout)}>
      <ShowroomHeroHeading
        title="Find your next vehicle"
        heading="h2"
        id="desktop-discovery-title"
        desktopOnly
      />
      <div
        data-desktop-search-box
        data-showroom-hero-controls
        {...stylex.props(hero.controlSurface, category !== 'car' && s.compactSearchPanel)}
      >
        <div
          role="group"
          aria-label={t('Find a vehicle')}
          {...stylex.props(s.search, category === 'car' && s.splitSearch)}
        >
          <ShowroomDesktopType category={category} onSelect={onSelectCategory} />
          {fields.map(({ tab, label, value, active, disabled }) => {
            const open =
              tab === 'model'
                ? sheet === 'make' && makeView === 'model'
                : sheet === tab && (tab !== 'make' || makeView === 'make');
            return (
              <div
                key={tab}
                data-selected-filter={active ? tab : undefined}
                {...stylex.props(s.fieldWrapper)}
              >
                <button
                  type="button"
                  data-desktop-hero-filter={tab}
                  aria-label={t(label) + ': ' + value}
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  disabled={disabled}
                  onClick={(event) => onOpen(tab, event.currentTarget, event.detail === 0)}
                  {...stylex.props(
                    field.field,
                    tab !== 'price' && field.divider,
                    active && s.clearableField,
                    open && field.open,
                    open && field.hideDivider,
                    disabled && s.disabledField,
                  )}
                >
                  <span {...stylex.props(field.copy)}>
                    <span {...stylex.props(field.label)}>{t(label)}</span>
                    <span {...stylex.props(field.value)}>{value}</span>
                  </span>
                  {!active && <Icon name="down" size={16} />}
                </button>
                {active && (
                  <button
                    type="button"
                    data-remove-selected-filter={tab}
                    aria-label={t('Clear filters') + ': ' + t(label)}
                    title={t('Clear filters') + ': ' + t(label)}
                    onClick={() => onClear(tab)}
                    {...stylex.props(s.clearField)}
                  >
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            data-desktop-browse
            aria-label={resultLabel}
            title={t('Search')}
            onClick={onBrowse}
            {...stylex.props(s.submit)}
          >
            <Icon name="search" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
