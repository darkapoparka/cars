'use client';
import { useLocale } from '@/lib/use-locale';
import { Fragment, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NativeDealerCards } from './NativeDealerCards';
import { DealerLogo } from './DealerLogo';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { colors } from '@/styles/tokens.stylex';
import { compactVehicleSpecification, localizeSpecification } from '@/lib/vehicle-copy';
import { vehicles } from '@/lib/catalog';
import { showroom } from '@/lib/showroom';
import { defaultPaymentEstimate } from '@/lib/search';
import { vehicleDetailSections, type VehicleDetailSection } from '@/lib/vehicle-detail-navigation';
import { Button, Modal, ui } from './ui';
import { Icon, type IconName } from './Icon';
import { RatingStars } from './RatingStars';
import { AssistantPanel } from './AssistantEntry';
import { VehicleCard } from './VehicleCard';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { GalleryScreen } from './GalleryScreen';
import { ShowroomTabs } from './ShowroomTabs';
import { selectVehicleDetailSection, useVehicleDetailSection } from './useVehicleDetailSection';
const mobileDetailSections = [
  vehicleDetailSections[0],
  vehicleDetailSections[2],
  vehicleDetailSections[1],
] as const;
const showroomTechnicalFields = new Set([
  'Vehicle condition',
  'Category',
  'Cubic Capacity',
  'Number of Seats',
  'Number of seats',
  'Colour',
  'Interior Design',
  'Number of doors',
]);
const s = stylex.create({
  body: {
    backgroundColor: colors.surface,
    padding: 8,
    paddingTop: 0,
    paddingBottom: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  showroomBody: {
    backgroundColor: {
      default: colors.surface,
      '@media (max-width: 699px)': colors.background,
      '@media (min-width: 1024px)': colors.background,
    },
    padding: 0,
    paddingBottom: {
      default: 'calc(100px + env(safe-area-inset-bottom))',
      '@media (min-width: 1024px)': 24,
    },
    gap: { default: 16, '@media (min-width: 1024px)': 24 },
  },
  sheet: {
    position: 'relative',
    marginTop: { default: -20, '@media (min-width: 1024px)': 0 },
    borderTopLeftRadius: { default: 24, '@media (min-width: 1024px)': 0 },
    borderTopRightRadius: { default: 24, '@media (min-width: 1024px)': 0 },
    backgroundColor: colors.background,
    boxShadow: {
      default: '0 -4px 16px #00000012',
      '@media (max-width: 699px)': '0 -2px 12px #0000000a',
      '@media (min-width: 1024px)': 'none',
    },
  },
  sectionNav: {
    position: 'sticky',
    top: { default: 60, '@media (min-width: 1024px)': 72 },
    zIndex: 25,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    scrollMarginTop: { default: 60, '@media (min-width: 1024px)': 72 },
  },
  afterMobileSummary: {
    borderTopLeftRadius: {
      default: 24,
      '@media (max-width: 699px)': 0,
      '@media (min-width: 1024px)': 0,
    },
    borderTopRightRadius: {
      default: 24,
      '@media (max-width: 699px)': 0,
      '@media (min-width: 1024px)': 0,
    },
  },
  summaryGrip: {
    height: { default: 24, '@media (max-width: 699px)': 0, '@media (min-width: 1024px)': 0 },
  },
  grip: {
    display: 'flex',
    height: { default: 24, '@media (max-width: 699px)': 8 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripBar: {
    display: {
      default: 'block',
      '@media (max-width: 699px)': 'none',
      '@media (min-width: 1024px)': 'none',
    },
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  fullSpecification: { display: { default: 'inline', '@media (max-width: 699px)': 'none' } },
  compactSpecification: { display: { default: 'none', '@media (max-width: 699px)': 'inline' } },
  mobileFinanceSection: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    padding: 16,
  },
  financeAction: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    minHeight: 84,
    padding: 16,
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    color: colors.text,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  financeIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.accent,
  },
  financeCopy: { display: 'flex', flexDirection: 'column', flex: '1', gap: 2, minWidth: 0 },
  financeLabel: { fontSize: 16, fontWeight: 500, lineHeight: '24px' },
  financeAmount: {
    fontSize: 14,
    lineHeight: '20px',
    color: colors.muted,
    overflowWrap: 'anywhere',
  },
  financeChevron: { display: 'inline-flex', flexShrink: 0, color: colors.muted },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  showroomPanel: {
    gap: { default: 0, '@media (min-width: 1024px)': 20 },
    paddingTop: { default: 0, '@media (min-width: 1024px)': 20 },
  },
  showroomSection: {
    borderWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderColor: { default: colors.line, '@media (min-width: 1024px)': colors.cardLine },
    borderRadius: { default: 0, '@media (min-width: 1024px)': 16 },
    overflow: 'visible',
  },
  showroomDivider: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: { default: colors.line, '@media (min-width: 1024px)': colors.cardLine },
  },
  showroomTitle: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 12,
    fontSize: { default: 18, '@media (min-width: 1024px)': 20 },
    lineHeight: { default: '24px', '@media (min-width: 1024px)': '28px' },
  },
  showroomFooter: {
    marginInline: { default: 12, '@media (max-width: 699px)': 0, '@media (min-width: 1024px)': 0 },
    borderWidth: { default: 1, '@media (max-width: 699px)': 0 },
    borderTopWidth: 1,
    borderColor: { default: colors.line, '@media (min-width: 1024px)': colors.cardLine },
    borderRadius: { default: 16, '@media (max-width: 699px)': 0 },
  },
  showroomFooterTitle: {
    borderBottomWidth: { default: 1, '@media (max-width: 699px)': 0 },
    fontSize: { default: 16, '@media (max-width: 699px)': 18, '@media (min-width: 1024px)': 20 },
    marginBottom: { default: 8, '@media (max-width: 699px)': 0 },
  },
  showroomContactTitle: { paddingBottom: { default: 8, '@media (max-width: 699px)': 0 } },
  showroomCarousel: {
    scrollbarWidth: { default: 'auto', '@media (max-width: 699px)': 'none' },
    padding: { default: 16, '@media (max-width: 699px)': '0 16px 16px' },
    scrollPaddingInline: { default: 0, '@media (max-width: 699px)': 16 },
  },
  featureValue: { fontWeight: 500 },
  featureTags: { marginBottom: 16 },
  showroomFeatureTag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    backgroundColor: colors.badgeSurface,
    color: colors.text,
    borderRadius: 6,
    paddingBlock: 4,
    paddingInline: 8,
    fontSize: 13,
    lineHeight: '20px',
  },
  desktopFeatures: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 1024px)': 'repeat(2,minmax(0,1fr))',
    },
    columnGap: 24,
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  desktopFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minHeight: 40,
    minWidth: 0,
    paddingBlock: 10,
    fontSize: 14,
    lineHeight: '20px',
  },
  desktopFeatureCheck: { display: 'inline-flex', flexShrink: 0, color: colors.muted },
  desktopFeatureLabel: { minWidth: 0, overflowWrap: 'anywhere' },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pad: { padding: { default: 16, '@media (min-width: 1024px)': 24 } },
  title: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '24px',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    marginBottom: 8,
  },
  specs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 24,
    padding: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  spec: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    paddingLeft: 44,
    minHeight: 40,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  label: { fontSize: 12, lineHeight: '20px', color: colors.muted },
  value: { fontSize: 14, lineHeight: '20px', fontWeight: 700 },
  showroomSpecs: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: { default: 16, '@media (max-width: 359px)': 8, '@media (min-width: 1024px)': 20 },
    gridTemplateColumns: {
      default: 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 1280px)': 'repeat(3,minmax(0,1fr))',
    },
  },
  showroomSpec: {
    paddingLeft: {
      default: 52,
      '@media (max-width: 699px)': 44,
      '@media (max-width: 359px)': 40,
      '@media (min-width: 1024px)': 40,
    },
    minHeight: 44,
  },
  showroomSpecIcon: {
    color: colors.text,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    transform: {
      default: 'translateY(-50%)',
      '@media (max-width: 699px)': 'translateY(-50%) scale(0.8)',
      '@media (min-width: 1024px)': 'translateY(-50%) scale(0.6)',
    },
    transformOrigin: 'left center',
  },
  showroomFuelIcon: { left: 2 },
  specIcon: {
    display: 'inline-flex',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  showroomLabel: {
    fontSize: {
      default: 12,
      '@media (max-width: 699px)': 14,
      '@media (max-width: 359px)': 13,
      '@media (min-width: 1024px)': 13,
    },
    lineHeight: { default: '18px', '@media (max-width: 699px)': '20px' },
  },
  showroomValue: {
    fontSize: {
      default: 14,
      '@media (max-width: 699px)': 16,
      '@media (max-width: 359px)': 15,
      '@media (min-width: 1024px)': 16,
    },
    lineHeight: {
      default: '20px',
      '@media (max-width: 699px)': '24px',
      '@media (min-width: 1024px)': '24px',
    },
    fontWeight: 500,
  },
  seller: {
    width: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    marginTop: 16,
    paddingTop: 16,
    color: colors.text,
    textDecoration: 'none',
    fontSize: 14,
  },
  stars: { color: '#bf8000', fontSize: 20, letterSpacing: 1 },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
    lineHeight: '20px',
    tableLayout: 'fixed',
  },
  row: { backgroundColor: { default: colors.background, ':nth-child(even)': colors.stripe } },
  diagram: { width: '100%', height: 'auto', display: 'block', objectFit: 'contain' },
  diagramCell: { padding: 8, backgroundColor: colors.background },
  cell: {
    whiteSpace: 'pre-line',
    padding: 8,
    paddingBlock: 6,
    height: { default: 52, '@media (min-width: 1024px)': 44 },
    fontWeight: 400,
    textAlign: 'left',
    verticalAlign: 'middle',
    width: '50%',
    overflowWrap: 'anywhere',
  },
  key: { fontWeight: 700 },
  showroomTechnicalTable: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 12,
    overflow: 'hidden',
  },
  showroomKey: { fontWeight: 500, color: colors.muted, paddingInline: 12 },
  showroomCell: { fontWeight: 500, paddingInline: 12 },
  check: { textAlign: 'right', color: colors.muted, width: '20%' },
  more: {
    width: '100%',
    height: 64,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: colors.background,
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
  },
  showroomMore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    height: 'auto',
    padding: 12,
    color: colors.text,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    lineHeight: { default: '20px', '@media (max-width: 699px)': '24px' },
    outlineColor: colors.accent,
    outlineOffset: -3,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
  },
  contactAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 48,
    paddingBlock: 12,
    paddingInline: 16,
    borderRadius: 12,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    fontWeight: 500,
    lineHeight: { default: '20px', '@media (max-width: 699px)': '24px' },
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  modalScroll: { flex: '1', minHeight: 0, overflowY: 'auto', paddingTop: 4, marginBottom: 12 },
  showroomSpecificationDialog: {
    width: { default: 'calc(100% - 48px)', '@media (max-width: 699px)': '100%' },
    maxWidth: 720,
    height: { default: 'min(800px, calc(100dvh - 48px))', '@media (max-width: 699px)': '90dvh' },
    maxHeight: { default: 'calc(100dvh - 48px)', '@media (max-width: 699px)': '90dvh' },
    marginBottom: { default: 'auto', '@media (max-width: 699px)': 0 },
    transform: 'none',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: { default: 24, '@media (max-width: 699px)': 0 },
    borderBottomRightRadius: { default: 24, '@media (max-width: 699px)': 0 },
    overflow: 'hidden',
    paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
    fontFamily: '"Mobile UI", Arial, sans-serif',
  },
  modalCell: {
    paddingBlock: 0,
    borderBottomWidth: 4,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.background,
  },
  modalKey: { fontWeight: 500 },
  modalTitle: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 700,
    marginBottom: 8,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  modalClose: { borderTopWidth: 0, textAlign: 'right', paddingRight: 32, height: 48 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  description: {
    whiteSpace: 'pre-line',
    fontSize: { default: 14, '@media (max-width: 699px)': 16, '@media (min-width: 1024px)': 15 },
    lineHeight: {
      default: '22px',
      '@media (max-width: 699px)': '24px',
      '@media (min-width: 1024px)': '26px',
    },
  },
  carousel: {
    display: 'flex',
    overflowX: 'auto',
    gap: 16,
    padding: 16,
    scrollSnapType: 'x mandatory',
  },
  featuresLabel: { width: '80%' },
  showroomCar: {
    width: {
      default: 281,
      '@media (min-width: 1024px)': 260,
      '@media (min-width: 1280px)': 'calc((100% - 32px) / 3)',
    },
    flexShrink: 0,
    scrollSnapAlign: 'start',
  },
});
export function VehicleSections({
  vehicle: v,
  onReport,
  showroomMode = false,
  mobileView = false,
  onFinance,
  overview,
  mobileOverview,
}: {
  vehicle: Vehicle;
  onReport: () => void;
  showroomMode?: boolean;
  mobileView?: boolean;
  onFinance?: () => void;
  overview?: ReactNode;
  mobileOverview?: ReactNode;
}) {
  const { t, locale, number, money } = useLocale();
  const section = useVehicleDetailSection();
  const navigation = useRef<HTMLDivElement>(null);
  const panelId = 'vehicle-detail-panel-' + v.id;
  const tabPrefix = 'vehicle-detail-tab-' + v.id + '-';
  const showDetails = !showroomMode || section === 'details';
  const showFeatures = !showroomMode || section === 'features';
  const monthly = defaultPaymentEstimate(v.price);
  function selectSection(value: VehicleDetailSection) {
    if (value === section) return;
    const nav = navigation.current;
    const stickyTop = nav ? Number.parseFloat(getComputedStyle(nav).top) : 0;
    const resetScroll = nav && nav.getBoundingClientRect().top <= stickyTop + 1;
    const scrollTop = window.scrollY;
    selectVehicleDetailSection(value);
    // Keep a visible rail steady; start the next panel at the rail when it is pinned.
    requestAnimationFrame(() => {
      if (!resetScroll) {
        window.scrollTo({ top: scrollTop, behavior: 'instant' });
        return;
      }
      const sheet = navigation.current?.closest('[data-vehicle-detail-sheet]');
      if (!sheet) return;
      const summary = sheet.querySelector<HTMLElement>('[data-vehicle-mobile-summary]');
      const anchor = summary?.getBoundingClientRect();
      // Use the normal-flow summary to retain the rail's page position while it is sticky.
      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY +
            (anchor?.height ? anchor.bottom : sheet.getBoundingClientRect().top) -
            stickyTop,
        ),
        behavior: 'instant',
      });
    });
  }
  const [technical, setTechnical] = useState(false);
  const [features, setFeatures] = useState(false);
  const [description, setDescription] = useState(false);
  const spec: [IconName, string, string][] = [
    ['mileage', 'Mileage', number(v.mileage) + ' ' + t('km')],
    ...(v.mileage > 0
      ? [
          ['date', showroomMode ? 'First registered' : 'First Registration', v.registration] as [
            IconName,
            string,
            string,
          ],
        ]
      : []),
    ['gauge', 'Power', Math.round(v.power / 1.36) + ' kW (' + v.power + ' ' + t('hp') + ')'],
    ...(v.attributes?.hideOwners || !v.attributes?.owners
      ? []
      : [
          ['user', showroomMode ? 'Owners' : 'Number of Owners', v.attributes.owners] as [
            IconName,
            string,
            string,
          ],
        ]),
    ['fuel', 'Fuel', v.attributes?.fuelLabel || v.fuel],
    ['transmission', 'Transmission', v.transmission],
  ];
  const data: [string, string][] = v.technicalData || [
    ['Vehicle condition', v.mileage ? 'Used vehicle' : 'New vehicle'],
    ['Category', v.body],
    ...(v.attributes?.modelRange
      ? [['Model range', v.attributes.modelRange] as [string, string]]
      : []),
    ...(v.attributes?.trimLine ? [['Trim line', v.attributes.trimLine] as [string, string]] : []),
    ...(v.attributes?.origin ? [['Origin', v.attributes.origin] as [string, string]] : []),
    ['Mileage', number(v.mileage) + ' ' + t('km')],
    ['Power', Math.round(v.power / 1.36) + ' kW (' + v.power + ' ' + t('hp') + ')'],
    ['Fuel', v.fuel],
    ['Transmission', v.transmission],
    ['First Registration', v.registration],
    ['Colour', v.color],
    ['Number of seats', String(v.seats)],
    ['Number of doors', String(v.doors)],
    ...Object.entries(v.attributes || {}).filter(
      ([key]) => !['modelRange', 'trimLine', 'origin', 'owners', 'description'].includes(key),
    ),
  ];
  const previewData = showroomMode
    ? data.filter(([label]) => showroomTechnicalFields.has(label)).slice(0, 6)
    : data.slice(0, 6);
  return (
    <div {...stylex.props(s.body, showroomMode && s.showroomBody)}>
      <section
        aria-label={showroomMode ? t('Vehicle information') : undefined}
        data-vehicle-detail-sheet={showroomMode ? '' : undefined}
        {...stylex.props(showroomMode && s.sheet)}
      >
        {showroomMode && mobileOverview}
        {showroomMode && (
          <div
            ref={navigation}
            data-vehicle-detail-nav
            {...stylex.props(s.sectionNav, Boolean(mobileOverview) && s.afterMobileSummary)}
          >
            <span
              aria-hidden="true"
              {...stylex.props(s.grip, Boolean(mobileOverview) && s.summaryGrip)}
            >
              <span {...stylex.props(s.gripBar)} />
            </span>
            <ShowroomTabs
              label={t('Vehicle information')}
              tabs={mobileView ? mobileDetailSections : vehicleDetailSections}
              selected={section}
              panelId={panelId}
              idPrefix={tabPrefix}
              tone="neutral"
              layout="desktop-segmented"
              flush
              onChange={selectSection}
            />
          </div>
        )}
        <div
          id={showroomMode ? panelId : undefined}
          role={showroomMode ? 'tabpanel' : undefined}
          aria-labelledby={showroomMode ? tabPrefix + section : undefined}
          tabIndex={showroomMode ? 0 : undefined}
          data-vehicle-detail-panel={showroomMode ? section : undefined}
          {...stylex.props(s.panel, showroomMode && s.showroomPanel)}
        >
          {showDetails && overview}
          {showDetails && (
            <section
              aria-label={t('Vehicle overview')}
              {...stylex.props(
                s.card,
                s.pad,
                showroomMode && s.showroomSection,
                showroomMode && s.showroomDivider,
              )}
            >
              <dl {...stylex.props(s.specs, showroomMode && s.showroomSpecs)}>
                {spec.map(([icon, label, value]) => (
                  <div key={label} {...stylex.props(s.spec, showroomMode && s.showroomSpec)}>
                    <dt {...stylex.props(s.label, showroomMode && s.showroomLabel)}>
                      <span
                        {...stylex.props(
                          ui.orange,
                          s.specIcon,
                          showroomMode && s.showroomSpecIcon,
                          showroomMode && icon === 'fuel' && s.showroomFuelIcon,
                        )}
                      >
                        <Icon name={icon} size={showroomMode ? (icon === 'date' ? 36 : 40) : 28} />
                      </span>
                      <span {...stylex.props(showroomMode && s.fullSpecification)}>{t(label)}</span>
                      {showroomMode && (
                        <span {...stylex.props(s.compactSpecification)}>
                          {compactVehicleSpecification(label, value, locale)[0]}
                        </span>
                      )}
                    </dt>
                    <dd {...stylex.props(s.value, showroomMode && s.showroomValue)}>
                      <span {...stylex.props(showroomMode && s.fullSpecification)}>
                        {localizeSpecification(value, locale)}
                      </span>
                      {showroomMode && (
                        <span {...stylex.props(s.compactSpecification)}>
                          {compactVehicleSpecification(label, value, locale)[1]}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {!showroomMode && <AssistantPanel detail />}
              {!showroomMode && (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('about-dealer-' + v.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  {...stylex.props(s.seller)}
                >
                  <DealerLogo id={v.id} size={40} />
                  <div>
                    <p>{v.dealer}</p>
                    <p {...stylex.props(s.stars)}>
                      <RatingStars rating={v.rating} />{' '}
                      <span {...stylex.props(s.label)}>({v.reviews})</span>
                    </p>
                    <span {...stylex.props(ui.orange)}>About this dealer</span>
                  </div>
                </button>
              )}
              {!showroomMode && v.specialFeatures && (
                <div {...stylex.props(ui.space)}>
                  <strong>{t('Special features according to dealer')}</strong>
                  <div {...stylex.props(s.tags)}>
                    {v.specialFeatures.map((feature) => (
                      <span key={feature} {...stylex.props(ui.badge)}>
                        {t(feature)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
          {showDetails && (
            <section
              {...stylex.props(
                s.card,
                showroomMode && s.showroomSection,
                showroomMode && s.showroomDivider,
              )}
            >
              <div {...stylex.props(s.pad)}>
                <h2 {...stylex.props(s.title, showroomMode && s.showroomTitle)}>
                  {t('Technical data')}
                </h2>
                <div {...stylex.props(showroomMode && s.showroomTechnicalTable)}>
                  <table {...stylex.props(s.table)}>
                    <tbody>
                      {previewData.map(([label, value]) => (
                        <tr key={label} {...stylex.props(s.row)}>
                          <th
                            scope="row"
                            {...stylex.props(s.cell, s.key, showroomMode && s.showroomKey)}
                          >
                            <span {...stylex.props(showroomMode && s.fullSpecification)}>
                              {t(label)}
                            </span>
                            {showroomMode && (
                              <span {...stylex.props(s.compactSpecification)}>
                                {compactVehicleSpecification(label, value, locale)[0]}
                              </span>
                            )}
                          </th>
                          <td {...stylex.props(s.cell, showroomMode && s.showroomCell)}>
                            <span {...stylex.props(showroomMode && s.fullSpecification)}>
                              {localizeSpecification(value, locale)}
                            </span>
                            {showroomMode && (
                              <span {...stylex.props(s.compactSpecification)}>
                                {compactVehicleSpecification(label, value, locale)[1]}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={technical}
                aria-label={t('Show more technical data')}
                aria-haspopup="dialog"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setTechnical(true);
                }}
                {...stylex.props(s.more, showroomMode && s.showroomMore)}
              >
                {showroomMode ? t('All specifications') : t('Show more')}
                {showroomMode && <Icon name="right" size={18} />}
              </button>
            </section>
          )}
          {showroomMode && section === 'photos' && (
            <section
              aria-label={t('Vehicle photos')}
              {...stylex.props(s.card, s.pad, s.showroomSection)}
            >
              <GalleryScreen vehicle={v} embedded />
            </section>
          )}
          {showFeatures && (
            <section {...stylex.props(s.card, showroomMode && s.showroomSection)}>
              <div {...stylex.props(s.pad)}>
                <h2 {...stylex.props(s.title, showroomMode && s.showroomTitle)}>{t('Features')}</h2>
                {showroomMode && v.specialFeatures && v.specialFeatures.length > 0 && (
                  <div {...stylex.props(s.tags, s.featureTags)}>
                    {v.specialFeatures.map((feature) => (
                      <span key={feature} {...stylex.props(ui.badge, s.showroomFeatureTag)}>
                        {t(feature)}
                      </span>
                    ))}
                  </div>
                )}
                {!v.features.length && (
                  <p {...stylex.props(ui.muted)}>{t('No features listed.')}</p>
                )}
                {showroomMode && v.features.length > 0 && (
                  <ul
                    data-vehicle-desktop-features
                    aria-label={t('Features')}
                    {...stylex.props(s.desktopFeatures)}
                  >
                    {v.features.map((feature) => (
                      <li key={feature} {...stylex.props(s.desktopFeature)}>
                        <span aria-hidden="true" {...stylex.props(s.desktopFeatureCheck)}>
                          <Icon name="check" size={18} />
                        </span>
                        <span {...stylex.props(s.desktopFeatureLabel)}>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {!showroomMode && (
                  <table {...stylex.props(s.table)}>
                    <tbody>
                      {(showroomMode ? v.features : v.features.slice(0, 6)).map((feature) => (
                        <tr key={feature} {...stylex.props(s.row)}>
                          <th
                            scope="row"
                            {...stylex.props(
                              s.cell,
                              s.key,
                              showroomMode && s.featureValue,
                              s.featuresLabel,
                            )}
                          >
                            {t(feature)}
                          </th>
                          <td {...stylex.props(s.cell, s.check)}>
                            <Icon name="check" size={18} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {!showroomMode && v.features.length > 6 && (
                <button
                  type="button"
                  aria-expanded={features}
                  aria-label={t('Show more features')}
                  aria-haspopup="dialog"
                  onClick={() => setFeatures(true)}
                  {...stylex.props(s.more)}
                >
                  {t('Show more')}
                </button>
              )}
            </section>
          )}
          {showDetails && (
            <section
              {...stylex.props(
                s.card,
                showroomMode && s.showroomSection,
                showroomMode && s.showroomDivider,
              )}
            >
              <div {...stylex.props(s.pad)}>
                <h2 {...stylex.props(s.title, showroomMode && s.showroomTitle)}>
                  {t('Vehicle description')}
                </h2>
                <p {...stylex.props(s.description)}>
                  {v.attributes?.description
                    ? description
                      ? v.attributes.description
                      : v.attributes.description.slice(0, 600)
                    : v.make + ' ' + v.model + '\n' + v.variant}
                </p>
                {description && (
                  <p {...stylex.props(ui.small, ui.muted, ui.space)}>
                    {t(
                      'Captured vehicle example. Supplementary specifications are local fixtures, not a verified current sales offer.',
                    )}
                  </p>
                )}
              </div>
              {(!showroomMode || (v.attributes?.description?.length || 0) > 600) && (
                <button
                  type="button"
                  aria-expanded={description}
                  aria-label={
                    description
                      ? t('Show less vehicle description')
                      : t('Show more vehicle description')
                  }
                  onClick={() => setDescription(!description)}
                  {...stylex.props(s.more, showroomMode && s.showroomMore)}
                >
                  {description ? t('Show less') : t('Show more')}
                </button>
              )}
            </section>
          )}
          {showroomMode && showDetails && onFinance && (
            <section data-mobile-vehicle-finance {...stylex.props(s.mobileFinanceSection)}>
              <button
                type="button"
                data-mobile-monthly-payment
                aria-label={t('Calculate Financing') + ': ' + money(monthly) + ' ' + t('per month')}
                aria-haspopup="dialog"
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  onFinance();
                }}
                {...stylex.props(s.financeAction)}
              >
                <span aria-hidden="true" {...stylex.props(s.financeIcon)}>
                  <Icon name="calculator" size={24} />
                </span>
                <span {...stylex.props(s.financeCopy)}>
                  <span {...stylex.props(s.financeLabel)}>{t('Financing')}</span>
                  <span {...stylex.props(s.financeAmount)}>
                    {t('Estimate')} {money(monthly)} / {locale === 'bg' ? 'мес.' : 'mo.'}
                  </span>
                </span>
                <span {...stylex.props(s.financeChevron)}>
                  <Icon name="right" size={18} />
                </span>
              </button>
            </section>
          )}
        </div>
      </section>
      {showroomMode ? (
        <section {...stylex.props(s.card, ui.pad, s.showroomFooter)}>
          <h2 {...stylex.props(s.title, s.showroomFooterTitle, s.showroomContactTitle)}>
            {t(showroom.name)}
          </h2>
          <p {...stylex.props(ui.text, ui.muted, ui.space)}>
            {t('Ask about this car or arrange a viewing.')}
          </p>
          <div {...stylex.props(ui.space)}>
            <Link href={'/contact?vehicle=' + v.id} {...stylex.props(s.contactAction)}>
              <Icon name="mail" size={18} />
              {t('Contact the showroom')}
            </Link>
          </div>
        </section>
      ) : (
        <NativeDealerCards vehicle={v} />
      )}
      <section {...stylex.props(s.card, showroomMode && s.showroomFooter)}>
        <h2 {...stylex.props(s.title, s.pad, showroomMode && s.showroomFooterTitle)}>
          {t('Similar vehicles')}
        </h2>
        <div {...stylex.props(s.carousel, showroomMode && s.showroomCarousel)}>
          {vehicles
            .filter((other) => other.id !== v.id)
            .map((other) =>
              showroomMode ? (
                <div key={other.id} {...stylex.props(s.showroomCar)}>
                  <ShowroomVehicleCard vehicle={other} />
                </div>
              ) : (
                <VehicleCard key={other.id} vehicle={other} home />
              ),
            )}
        </div>
      </section>
      {!showroomMode && (
        <Button variant="ghost" onClick={onReport}>
          Report this listing
        </Button>
      )}
      {(!showroomMode || v.sample) && (
        <p {...stylex.props(ui.small, ui.muted, ui.center)}>
          {showroomMode
            ? t('Sample vehicle · Showroom template preview')
            : 'Local reference · No live seller connection'}
        </p>
      )}
      <Modal
        table
        open={technical}
        onClose={() => setTechnical(false)}
        label={t('Technical data')}
        xstyle={showroomMode ? s.showroomSpecificationDialog : undefined}
      >
        <h2 {...stylex.props(s.modalTitle)}>{t('Technical data')}</h2>
        <div {...stylex.props(s.modalScroll)}>
          <table {...stylex.props(s.table)}>
            <tbody>
              {data.map(([label, value]) => (
                <Fragment key={label}>
                  <tr {...stylex.props(s.row)}>
                    <th
                      scope="row"
                      {...stylex.props(
                        s.cell,
                        s.modalCell,
                        s.modalKey,
                        showroomMode && s.showroomKey,
                      )}
                    >
                      {t(label)}
                    </th>
                    <td {...stylex.props(s.cell, s.modalCell, showroomMode && s.showroomCell)}>
                      {localizeSpecification(value, locale)}
                    </td>
                  </tr>
                  {v.technicalDiagrams?.[label] && (
                    <tr>
                      <td colSpan={2} {...stylex.props(s.diagramCell)}>
                        <Image
                          src={v.technicalDiagrams[label]}
                          alt={label + ' — captured emissions classification'}
                          width={928}
                          height={555}
                          {...stylex.props(s.diagram)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setTechnical(false)}
          {...stylex.props(s.more, s.modalClose, showroomMode && s.showroomMore)}
        >
          {t('Close')}
        </button>
      </Modal>
      <Modal table open={features} onClose={() => setFeatures(false)} label={t('Features')}>
        <h2 {...stylex.props(s.modalTitle)}>{t('Features')}</h2>
        <div {...stylex.props(s.modalScroll)}>
          <table {...stylex.props(s.table)}>
            <tbody>
              {v.features.map((feature) => (
                <tr key={feature} {...stylex.props(s.row)}>
                  <th
                    scope="row"
                    {...stylex.props(s.cell, s.modalCell, s.modalKey, s.featuresLabel)}
                  >
                    {t(feature)}
                  </th>
                  <td {...stylex.props(s.cell, s.modalCell, s.check)}>
                    <Icon name="check" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => setFeatures(false)}
          {...stylex.props(s.more, s.modalClose)}
        >
          {t('Close')}
        </button>
      </Modal>
    </div>
  );
}
