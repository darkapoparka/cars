'use client';
import { useLocale } from '@/lib/use-locale';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import { vehicles } from '@/lib/catalog';
import type { Vehicle } from '@/lib/types';
import {
  restoreInventoryPosition,
  showroom,
  showroomInventoryHref,
  showroomPageContent,
} from '@/lib/showroom';
import {
  serviceCategories,
  serviceCategoryHref,
  serviceSearchHref,
  searchShowroomServices,
  showroomService,
  showroomServices,
  importCountries,
  importCountry,
  importCountryHref,
  saleEnquiryTypes,
  saleEnquiryType,
  saleEnquiryHref,
  serviceQuickFiltersFor,
  serviceQuickFilter,
  serviceQuickFilterHref,
  type ServiceTab,
  type ServiceQuickFilter,
} from '@/lib/showroom-services';
import { saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearch } from './ShowroomSearch';
import { ShowroomServiceSearchSheet } from './ShowroomServiceSearchSheet';
import { ShowroomQuickPill, ShowroomQuickPills } from './ShowroomQuickPills';
import { ShowroomServiceRequest } from './ShowroomServiceRequest';
import { ShowroomImportExamples } from './ShowroomImportExamples';
import { ShowroomVehicleCard } from './ShowroomVehicleCard';
import { ShowroomBanner, ShowroomDrawer, ShowroomPageHero } from './ShowroomPageLayout';
import { ShowroomContactPanel } from './ShowroomContactPanel';
import { ShowroomContactBanner } from './ShowroomContactBanner';
import { ShowroomContactForm } from './ShowroomContactForm';
import { ShowroomServiceArtwork } from './ShowroomServiceArtwork';
import { Button, ui } from './ui';

const s = stylex.create({
  page: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,
    minHeight: 'calc(100dvh - 124px)',
  },
  servicesPage: {
    minHeight: { default: 'calc(100dvh - 242px)', '@media (min-width: 1024px)': 0 },
    paddingTop: { default: 16, '@media (max-width: 699px)': 16, '@media (min-width: 1024px)': 20 },
    paddingInline: { default: 16, '@media (min-width: 1024px)': 0 },
    borderTopLeftRadius: { default: 0, '@media (max-width: 699px)': 24 },
    borderTopRightRadius: { default: 0, '@media (max-width: 699px)': 24 },
    boxShadow: {
      default: 'none',
      '@media (max-width: 699px)': '0 -2px 12px rgba(23, 32, 43, 0.05)',
    },
  },
  head: { paddingBlock: 12, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  title: { fontSize: 28, lineHeight: '36px', fontWeight: 700 },
  intro: { fontSize: 16, lineHeight: '24px', color: colors.muted },
  subTitle: {
    fontSize: { default: 18, '@media (min-width: 1024px)': 20 },
    lineHeight: { default: '24px', '@media (min-width: 1024px)': '26px' },
    fontWeight: { default: 700, '@media (min-width: 1024px)': 500 },
  },
  search: {
    paddingTop: { default: 4, '@media (min-width: 1024px)': 0 },
    width: '100%',
    maxWidth: { default: 'none', '@media (min-width: 1024px)': 620 },
  },
  tabs: {
    position: { default: 'sticky', '@media (min-width: 1024px)': 'static' },
    top: 0,
    zIndex: 25,
    display: { default: 'flow-root', '@media (min-width: 1024px)': 'flex' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minWidth: 0,
    backgroundColor: colors.background,
  },
  phoneServiceControls: {
    display: {
      default: 'contents',
      '@media (max-width: 699px)': 'block',
      '@media (min-width: 1024px)': 'none',
    },
    clipPath: { default: 'none', '@media (max-width: 699px)': 'inset(0 -16px -16px)' },
  },
  desktopServiceControls: {
    display: { default: 'none', '@media (min-width: 1024px)': 'block' },
    minWidth: 0,
    maxWidth: '100%',
  },
  serviceHeroControls: {
    display: { default: 'contents', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  serviceFlow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr)',
    alignItems: 'start',
    gap: 20,
    maxWidth: { default: 1040, '@media (min-width: 1024px)': 'none' },
    marginInline: 'auto',
  },
  saleFlow: { gridTemplateColumns: 'minmax(0,1fr)', maxWidth: 720 },
  importFlow: {
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 1024px)': 'minmax(0,.85fr) minmax(0,1.15fr)',
    },
    gap: { default: 20, '@media (min-width: 1024px)': showroomDesktop.sectionGap },
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 1024px)': 'repeat(3,minmax(0,1fr))',
    },
    alignItems: 'stretch',
    columnGap: { default: 8, '@media (min-width: 1024px)': showroomDesktop.sectionGap },
    rowGap: { default: 8, '@media (min-width: 1024px)': 32 },
    maxWidth: { default: 1040, '@media (min-width: 1024px)': 'none' },
    marginInline: 'auto',
  },
  serviceCard: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto',
    alignItems: 'start',
    columnGap: 8,
    rowGap: { default: 4, '@media (min-width: 1024px)': 12 },
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: {
      default: colors.line,
      '@media (max-width: 699px)': colors.cardLine,
      '@media (min-width: 1024px)': colors.cardLine,
    },
    borderRadius: { default: 12, '@media (min-width: 1024px)': 16 },
    paddingBlock: { default: 12, '@media (min-width: 1024px)': 20 },
    paddingInline: { default: 14, '@media (min-width: 1024px)': 20 },
    minWidth: 0,
    boxShadow: {
      default: 'none',
      '@media (max-width: 699px)': '0 3px 12px rgba(27, 27, 33, 0.035)',
    },
  },
  serviceCardLink: {
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 360px)': 'minmax(0,1fr) auto',
    },
    gridTemplateRows: { default: 'auto', '@media (min-width: 1024px)': 'auto auto 1fr' },
    paddingBlock: { default: 12, '@media (min-width: 1024px)': 0 },
    paddingInline: { default: 14, '@media (min-width: 1024px)': 0 },
    rowGap: { default: 4, '@media (min-width: 1024px)': 0 },
    borderWidth: { default: 1, '@media (min-width: 1024px)': 0 },
    borderRadius: { default: 12, '@media (max-width: 699px)': 16, '@media (min-width: 1024px)': 0 },
    overflow: 'visible',
    color: colors.text,
    textDecoration: 'none',
    backgroundColor: {
      default: colors.background,
      ':hover': colors.controlSurface,
      ':active': colors.controlSurface,
      '@media (min-width: 1024px)': {
        default: 'transparent',
        ':hover': 'transparent',
        ':active': 'transparent',
      },
    },
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  serviceCardCopy: {
    gridColumn: '1 / -1',
    paddingInline: 0,
    paddingTop: { default: 0, '@media (min-width: 1024px)': 8 },
    paddingBottom: 0,
  },
  serviceCardHeading: {
    display: { default: 'flex', '@media (min-width: 1024px)': 'contents' },
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  serviceCardText: {
    display: { default: 'flex', '@media (min-width: 1024px)': 'contents' },
    flexDirection: 'column',
    flexGrow: 1,
    gap: 4,
    minWidth: 0,
  },
  serviceCardTitle: {
    paddingTop: { default: 0, '@media (min-width: 1024px)': 14 },
    paddingBottom: 0,
  },
  serviceCardLine: {
    minWidth: 0,
    overflow: { default: 'hidden', '@media (min-width: 1024px)': 'visible' },
    whiteSpace: { default: 'nowrap', '@media (min-width: 1024px)': 'normal' },
    textOverflow: { default: 'ellipsis', '@media (min-width: 1024px)': 'clip' },
  },
  serviceMobileCopy: { display: { default: 'inline', '@media (min-width: 1024px)': 'none' } },
  serviceDesktopCopy: { display: { default: 'none', '@media (min-width: 1024px)': 'inline' } },
  serviceIcon: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    alignItems: 'center',
    justifyContent: 'center',
    gridColumn: 1,
    gridRow: 1,
    width: 44,
    height: 44,
    borderRadius: 12,
    color: colors.muted,
    backgroundColor: colors.stripe,
    margin: { default: 0, '@media (min-width: 1024px)': 18 },
  },
  serviceCardCue: {
    display: { default: 'none', '@media (min-width: 360px)': 'inline-flex' },
    alignItems: 'center',
    justifyContent: 'center',
    justifySelf: 'end',
    alignSelf: { default: 'center', '@media (min-width: 1024px)': 'start' },
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 2 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 2 },
    gap: 3,
    minHeight: 26,
    width: { default: 24, '@media (min-width: 1024px)': 32 },
    paddingBlock: 0,
    paddingInline: 0,
    marginTop: { default: 0, '@media (min-width: 1024px)': 14 },
    marginRight: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '20px',
    whiteSpace: 'nowrap',
  },
  serviceCardChevron: {
    flexShrink: 0,
    color: colors.muted,
    width: { default: 16, '@media (min-width: 1024px)': 20 },
    height: { default: 16, '@media (min-width: 1024px)': 20 },
  },
  serviceCardViewCue: { width: { default: 24, '@media (min-width: 1024px)': 'auto' }, gap: 4 },
  serviceCardCueText: { display: { default: 'none', '@media (min-width: 1024px)': 'inline' } },
  serviceDetail: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 1024px)': 'minmax(0,.85fr) minmax(0,1.15fr)',
    },
    alignItems: 'start',
    gap: { default: 12, '@media (min-width: 1024px)': 28 },
    borderRadius: 16,
    padding: { default: 20, '@media (min-width: 1024px)': 28 },
  },
  singleCategory: {
    gridTemplateColumns: '1fr',
    maxWidth: { default: 620, '@media (min-width: 1024px)': 840 },
    marginInline: 'auto',
  },
  serviceBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    minWidth: 0,
  },
  serviceTitle: {
    paddingTop: { default: 3, '@media (min-width: 1024px)': 14 },
    paddingBottom: { default: 3, '@media (min-width: 1024px)': 0 },
    paddingLeft: 0,
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 1 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 2 },
    fontSize: { default: 16, '@media (min-width: 1024px)': 18 },
    lineHeight: { default: '22px', '@media (min-width: 1024px)': '26px' },
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  serviceCopy: { fontSize: 14, lineHeight: '20px', color: colors.muted, overflowWrap: 'anywhere' },
  serviceAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    flexShrink: 0,
    padding: 0,
    borderRadius: 18,
    textDecoration: 'none',
    outlineColor: colors.accent,
  },
  serviceActionFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: { default: 36, '@media (min-width: 1024px)': 40 },
    paddingBlock: 7,
    paddingInline: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: { default: 18, '@media (min-width: 1024px)': 20 },
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    color: colors.text,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
  },
  serviceActionPrimary: {
    backgroundColor: { default: colors.accent, ':hover': colors.accent },
    borderColor: colors.accent,
    color: '#fff',
    fontWeight: 600,
  },
  serviceDetailAction: {
    gridColumn: { default: '1 / -1', '@media (min-width: 1024px)': 1 },
    marginTop: 4,
  },
  serviceDetails: {
    gridColumn: { default: '1 / -1', '@media (min-width: 1024px)': 2 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': '1 / span 2' },
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 4,
  },
  detailTitle: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
  detailCopy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  contactGrid: {
    display: { default: 'grid', '@media (min-width: 1024px)': 'contents' },
    gridTemplateColumns: 'minmax(0,1fr)',
    alignItems: 'start',
    gap: 12,
  },
  contactPage: {
    display: { default: 'flex', '@media (min-width: 1024px)': 'grid' },
    flexDirection: 'column',
    gridTemplateColumns: 'minmax(0,.85fr) minmax(0,1.15fr)',
    gap: { default: 0, '@media (min-width: 1024px)': showroomDesktop.sectionGap },
    alignItems: 'stretch',
    paddingBlock: { default: 0, '@media (min-width: 1024px)': 12 },
    minHeight: { default: 'calc(100dvh - 124px)', '@media (min-width: 1024px)': 0 },
  },
  contactIntro: {
    display: { default: 'block', '@media (max-width: 699px)': 'none' },
    backgroundColor: colors.background,
    paddingInline: { default: 16, '@media (min-width: 1024px)': 0 },
    paddingBlock: { default: 12, '@media (min-width: 1024px)': 0 },
    borderWidth: { default: 0, '@media (min-width: 1024px)': 1 },
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: { default: 0, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    gridColumn: 1,
    gridRow: { default: 1, '@media (min-width: 1024px)': '1 / span 2' },
  },
  contactBody: {
    flex: '1',
    minHeight: 0,
    display: { default: 'block', '@media (min-width: 1024px)': 'contents' },
    paddingTop: 16,
  },
  contactContainer: {
    maxWidth: 620,
    marginInline: 'auto',
    minWidth: 0,
    display: { default: 'block', '@media (min-width: 1024px)': 'contents' },
  },
  phoneContact: { display: { default: 'contents', '@media (min-width: 1024px)': 'none' } },
  contactHeroAction: {
    display: { default: 'none', '@media (min-width: 1024px)': 'inline-flex' },
    minHeight: 44,
    paddingInline: 22,
    borderRadius: 22,
    borderColor: '#fff',
    backgroundColor: { default: '#fff', ':hover': colors.controlSurface },
    color: colors.text,
    fontWeight: 500,
    outlineColor: '#fff',
    outlineOffset: 4,
  },
  messageLabel: { flexGrow: { default: 0, '@media (min-width: 1024px)': 1 } },
  enquiryCard: {
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 2 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': '1 / span 2' },
  },
  inlineEnquiry: { display: { default: 'none', '@media (min-width: 700px)': 'flex' } },
  detailsCard: {
    display: { default: 'flex', '@media (min-width: 1024px)': 'none' },
    gridColumn: { default: 'auto', '@media (min-width: 1024px)': 1 },
    gridRow: { default: 'auto', '@media (min-width: 1024px)': 2 },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 700px)': 'repeat(2,minmax(0,1fr))',
      '@media (min-width: 1024px)': showroomDesktop.inventoryColumns,
    },
    gap: { default: 20, '@media (min-width: 1024px)': showroomDesktop.cardGap },
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: colors.line, '@media (min-width: 1024px)': colors.cardLine },
    borderRadius: { default: 16, '@media (min-width: 1024px)': showroomDesktop.panelRadius },
    padding: { default: 16, '@media (min-width: 1024px)': 24 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: { default: 14, '@media (min-width: 1024px)': showroomDesktop.cardGap },
    minWidth: 0,
  },
  body: { fontSize: 15, lineHeight: '22px', color: colors.muted },
  contactActions: {
    display: { default: 'grid', '@media (max-width: 699px)': 'none' },
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: { default: 12, '@media (max-width: 699px)': 8 },
  },
  contactAction: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    minWidth: 0,
    padding: 0,
    borderWidth: 0,
    borderRadius: 22,
    backgroundColor: 'transparent',
    textDecoration: 'none',
    outlineColor: colors.accent,
    cursor: { default: 'pointer', ':disabled': 'default' },
  },
  contactActionFace: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    minHeight: 44,
    paddingBlock: 10,
    paddingInline: { default: 12, '@media (max-width: 699px)': 10 },
    borderRadius: 22,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: colors.text,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    fontWeight: 500,
    lineHeight: '20px',
    overflowWrap: 'anywhere',
  },
  contactActionUnavailable: {
    backgroundColor: { default: colors.controlSurface, ':hover': colors.controlSurface },
    color: colors.muted,
  },
  contactExtraAction: { gridColumn: '1 / -1', justifySelf: 'center', minWidth: 144 },
  contactAvailability: {
    marginTop: 8,
    display: { default: 'block', '@media (max-width: 699px)': 'none' },
  },
  contactPreviewCopy: { display: { default: 'block', '@media (max-width: 699px)': 'none' } },
  contactSubmit: {
    alignSelf: 'flex-start',
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderRadius: { default: 18, '@media (max-width: 699px)': 22 },
  },
  contactSubmitFace: {
    minHeight: {
      default: 36,
      '@media (max-width: 699px)': 44,
      '@media (min-width: 1024px)': 40,
    },
    borderRadius: {
      default: 18,
      '@media (max-width: 699px)': 22,
      '@media (min-width: 1024px)': 20,
    },
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
  },
  info: { display: 'flex', flexDirection: 'column', gap: 12 },
  infoRow: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  infoIcon: { display: 'inline-flex', color: colors.muted, flexShrink: 0, marginTop: 2 },
  context: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingInline: 12,
    paddingBlock: 8,
    borderRadius: 10,
    backgroundColor: colors.stripe,
  },
  contextText: { flex: '1 1 160px', minWidth: 0, overflowWrap: 'anywhere' },
  contextTitle: { fontSize: 15, lineHeight: '22px', fontWeight: 500 },
  contextLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    flexShrink: 0,
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
  },
  note: {
    fontSize: 12,
    lineHeight: '20px',
    color: colors.muted,
    textAlign: 'center',
    paddingTop: 24,
  },
  textArea: {
    width: '100%',
    minHeight: {
      default: 120,
      '@media (max-width: 699px)': 144,
      '@media (min-width: 1024px)': 180,
    },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: { default: 10, '@media (min-width: 1024px)': showroomDesktop.fieldRadius },
    padding: 12,
    backgroundColor: {
      default: colors.controlSurface,
      '@media (min-width: 1024px)': colors.stripe,
    },
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    '::placeholder': {
      color: { default: null, '@media (max-width: 699px)': colors.muted },
      opacity: { default: null, '@media (max-width: 699px)': 1 },
    },
    resize: 'vertical',
    flexGrow: { default: 0, '@media (min-width: 1024px)': 1 },
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flexGrow: { default: 0, '@media (min-width: 1024px)': 1 },
  },
  saved: { color: colors.green, fontSize: 14, lineHeight: '22px' },
  saveUnavailable: { color: colors.text },
});

export function SavedCarsScreen() {
  const { t, locale } = useLocale();
  const { parked, filters, inventorySort } = useAppState();
  const saved = vehicles.filter((vehicle) => parked.includes(vehicle.id));
  useEffect(restoreInventoryPosition, []);
  return (
    <>
      <Header home />
      <div {...stylex.props(s.page)}>
        <div {...stylex.props(s.head)}>
          <h1 {...stylex.props(s.title)}>{t('Saved cars')}</h1>
          <p {...stylex.props(s.intro)}>
            {saved.length
              ? locale === 'bg'
                ? saved.length +
                  (saved.length === 1 ? ' кола е запазена' : ' коли са запазени') +
                  ' на това устройство.'
                : saved.length + (saved.length === 1 ? ' car' : ' cars') + ' saved on this device.'
              : t('Keep the cars you like in one place.')}
          </p>
        </div>
        {saved.length ? (
          <div {...stylex.props(s.grid)}>
            {saved.map((vehicle) => (
              <ShowroomVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(ui.empty)}>
            <Icon name="heart" size={44} />
            <h2 {...stylex.props(ui.title)}>{t('Your shortlist starts here')}</h2>
            <p>{t('Tap the heart on a car to save it for later.')}</p>
            <Button href={showroomInventoryHref(filters, inventorySort)}>{t('Browse cars')}</Button>
          </div>
        )}
      </div>
    </>
  );
}

export function ShowroomServicesScreen() {
  const { t } = useLocale();
  const params = useSearchParams();
  const query = params.get('q') || '';
  const searching = params.get('search') === '1';
  const searchOpener = useRef<HTMLButtonElement | null>(null);
  const selected = query.trim()
    ? 'services'
    : serviceCategories.find(({ value }) => value === params.get('tab'))?.value || 'services';
  // Existing Financing/Parts URLs continue to open their details from All.
  const detail =
    !query.trim() && ['financing', 'parts'].includes(params.get('tab') || '')
      ? showroomService(params.get('tab') || '')
      : undefined;
  const overview = selected === 'services' && !detail;
  const country = importCountry(params.get('country'));
  const saleType = saleEnquiryType(params.get('saleType'));
  const quickFilters = serviceQuickFiltersFor(showroomServices);
  const requestedQuickFilter = serviceQuickFilter(detail?.id || params.get('topic'));
  const quickFilter =
    quickFilters.find(({ value }) => value === requestedQuickFilter)?.value || 'all';
  const matchingServices = searchShowroomServices(showroomServices, query);
  const shown = overview
    ? matchingServices.filter((service) => quickFilter === 'all' || service.id === quickFilter)
    : detail
      ? [detail]
      : [];
  const panelLabel =
    (selected === 'services' && quickFilters.find(({ value }) => value === quickFilter)?.label) ||
    serviceCategories.find(({ value }) => value === selected)?.label ||
    'All';
  function selectCategory(value: ServiceTab) {
    if (value === selected && !query && !detail && quickFilter === 'all') return;
    window.history.pushState(null, '', serviceCategoryHref(value));
    window.scrollTo(0, 0);
  }
  function search(value: string) {
    window.history.replaceState(null, '', serviceSearchHref(value));
    requestAnimationFrame(() => searchOpener.current?.focus({ preventScroll: true }));
  }
  function openSearch(button: HTMLButtonElement) {
    searchOpener.current = button;
    button.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    url.searchParams.set('search', '1');
    window.history.pushState({ carsMobileServiceSearch: true }, '', url.pathname + url.search);
  }
  function closeSearch() {
    if (window.history.state?.carsMobileServiceSearch) window.history.back();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      window.history.replaceState(null, '', url.pathname + url.search);
    }
    requestAnimationFrame(() => searchOpener.current?.focus({ preventScroll: true }));
  }
  function selectServiceFilter(value: ServiceQuickFilter) {
    window.history.pushState(
      null,
      '',
      serviceQuickFilterHref(value === quickFilter ? 'all' : value, query),
    );
  }
  const contextFilters =
    selected === 'import' ? (
      <ShowroomQuickPills label={t('Import countries')} inventoryDesktop>
        {importCountries.map(({ value, label }) => (
          <ShowroomQuickPill
            key={value}
            inventoryDesktop
            secondary
            active={country === value}
            aria-pressed={country === value}
            onClick={() => window.history.pushState(null, '', importCountryHref(value))}
          >
            {t(label)}
          </ShowroomQuickPill>
        ))}
      </ShowroomQuickPills>
    ) : selected === 'sell' ? (
      <ShowroomQuickPills label={t('Sale type')} inventoryDesktop>
        {saleEnquiryTypes.map(({ value, label }) => (
          <ShowroomQuickPill
            key={value}
            inventoryDesktop
            secondary
            active={saleType === value}
            aria-pressed={saleType === value}
            onClick={() => window.history.pushState(null, '', saleEnquiryHref(value))}
          >
            {t(label)}
          </ShowroomQuickPill>
        ))}
      </ShowroomQuickPills>
    ) : null;
  return (
    <>
      <ShowroomBanner>
        <Header home sticky={false} overHeroDesktop />
        <ShowroomPageHero
          {...showroomPageContent.services}
          description={undefined}
          compact
          stackedControls
        >
          <div {...stylex.props(s.serviceHeroControls)}>
            <div {...stylex.props(s.desktopServiceControls)}>
              <ShowroomTabs
                label={t('Service category')}
                tabs={serviceCategories}
                selected={selected}
                panelId="showroom-services"
                idPrefix="service-hero-"
                layout="hero"
                onChange={selectCategory}
              />
            </div>
            <div {...stylex.props(s.search)}>
              <ShowroomSearch
                label={t('Search services')}
                value={query}
                onOpen={openSearch}
                inBanner
              />
            </div>
          </div>
        </ShowroomPageHero>
      </ShowroomBanner>
      <ShowroomDrawer phoneResults>
        <div data-showroom-controls {...stylex.props(s.tabs)}>
          <div {...stylex.props(s.phoneServiceControls)}>
            <ShowroomTabs
              label={t('Service category')}
              tabs={serviceCategories}
              selected={selected}
              panelId="showroom-services"
              idPrefix="service-category-"
              layout="desktop-pills"
              primary
              flushOnPhone
              onChange={selectCategory}
            />
          </div>
          {contextFilters || (
            <ShowroomQuickPills label={t('Service filters')} inventoryDesktop>
              {quickFilters
                .filter(({ value }) => value !== 'all')
                .map(({ value, label }) => (
                  <ShowroomQuickPill
                    key={value}
                    inventoryDesktop
                    secondary
                    active={quickFilter === value}
                    aria-pressed={quickFilter === value}
                    aria-label={label}
                    onClick={() => selectServiceFilter(value)}
                  >
                    {label}
                  </ShowroomQuickPill>
                ))}
            </ShowroomQuickPills>
          )}
        </div>
        <div
          id="showroom-services"
          role="tabpanel"
          aria-label={t(panelLabel)}
          {...stylex.props(s.page, s.servicesPage)}
        >
          {overview && (
            <p aria-live="polite" {...stylex.props(ui.srOnly)}>
              {shown.length} {shown.length === 1 ? t('service') : t('services')}
            </p>
          )}
          {selected === 'import' || selected === 'sell' ? (
            <>
              <div
                {...stylex.props(
                  s.serviceFlow,
                  selected === 'import' && s.importFlow,
                  selected === 'sell' && s.saleFlow,
                )}
              >
                <ShowroomServiceRequest
                  key={selected}
                  kind={selected}
                  country={country}
                  saleType={saleType}
                />
                {selected === 'import' && <ShowroomImportExamples country={country} />}
              </div>
            </>
          ) : shown.length ? (
            <div {...stylex.props(s.serviceGrid, !overview && s.singleCategory)}>
              {shown.map((service) =>
                overview ? (
                  <Link
                    key={service.id}
                    data-showroom-service={service.id}
                    href={
                      service.details ||
                      service.category === 'import' ||
                      service.category === 'sell'
                        ? serviceCategoryHref(service.category)
                        : '/contact?service=' + service.id
                    }
                    aria-label={
                      service.details
                        ? t('View ') + t(service.title).toLowerCase()
                        : t(service.action)
                    }
                    aria-describedby={'showroom-service-' + service.id + '-copy'}
                    {...stylex.props(s.serviceCard, s.serviceCardLink)}
                  >
                    <div {...stylex.props(s.serviceCardHeading)}>
                      {service.image ? (
                        <ShowroomServiceArtwork
                          src={service.image}
                          mobileSrc={service.mobileImage}
                        />
                      ) : (
                        <span aria-hidden="true" {...stylex.props(s.serviceIcon)}>
                          <Icon name={service.icon || 'grid'} size={24} />
                        </span>
                      )}
                      <div data-service-card-text {...stylex.props(s.serviceCardText)}>
                        <h2
                          title={t(service.title)}
                          {...stylex.props(s.serviceTitle, s.serviceCardTitle, s.serviceCardLine)}
                        >
                          <span {...stylex.props(s.serviceMobileCopy)}>
                            {t(service.mobileTitle || service.title)}
                          </span>
                          <span {...stylex.props(s.serviceDesktopCopy)}>{t(service.title)}</span>
                        </h2>
                        <p
                          id={'showroom-service-' + service.id + '-copy'}
                          title={t(service.summary || service.copy)}
                          {...stylex.props(s.serviceCopy, s.serviceCardCopy, s.serviceCardLine)}
                        >
                          <span {...stylex.props(s.serviceMobileCopy)}>
                            {t(service.mobileSummary || service.summary || service.copy)}
                          </span>
                          <span {...stylex.props(s.serviceDesktopCopy)}>
                            {t(service.summary || service.copy)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span
                      data-service-card-cue
                      aria-hidden="true"
                      {...stylex.props(
                        s.serviceCardCue,
                        (service.details ||
                          service.category === 'import' ||
                          service.category === 'sell') &&
                          s.serviceCardViewCue,
                      )}
                    >
                      {(service.details ||
                        service.category === 'import' ||
                        service.category === 'sell') && (
                        <span {...stylex.props(s.serviceCardCueText)}>{t('View')}</span>
                      )}
                      <ChevronRight
                        size={12}
                        strokeWidth={1.8}
                        aria-hidden="true"
                        {...stylex.props(s.serviceCardChevron)}
                      />
                    </span>
                  </Link>
                ) : (
                  <section
                    key={service.id}
                    data-showroom-service={service.id}
                    {...stylex.props(s.serviceCard, s.serviceDetail)}
                  >
                    <div {...stylex.props(s.serviceBody)}>
                      <h2 {...stylex.props(s.subTitle)}>{t(service.title)}</h2>
                      <p id={'showroom-service-' + service.id + '-copy'} {...stylex.props(s.body)}>
                        {t(service.copy)}
                      </p>
                    </div>
                    {service.details && (
                      <dl {...stylex.props(s.serviceDetails)}>
                        {service.details.map((detail) => (
                          <div key={detail.label}>
                            <dt {...stylex.props(s.detailTitle)}>{t(detail.label)}</dt>
                            <dd {...stylex.props(s.detailCopy)}>{t(detail.copy)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <div {...stylex.props(s.serviceDetailAction)}>
                      <Link
                        href={'/contact?service=' + service.id}
                        {...stylex.props(s.serviceAction)}
                      >
                        <span
                          data-service-action-surface
                          {...stylex.props(s.serviceActionFace, s.serviceActionPrimary)}
                        >
                          {t(service.action)}
                        </span>
                      </Link>
                    </div>
                  </section>
                ),
              )}
            </div>
          ) : (
            <div {...stylex.props(ui.empty)}>
              <h2 {...stylex.props(ui.title)}>{t('No services found')}</h2>
              <p>{t('Try another search or browse all services.')}</p>
              <Button
                variant="outline"
                onClick={() => window.history.replaceState(null, '', '/services')}
              >
                {t('Show all services')}
              </Button>
            </div>
          )}
          <p {...stylex.props(s.note)}>
            {t('Showroom template preview ·')}{' '}
            {selected === 'import' ? t('Sample import gallery') : t('Example services')}
          </p>
        </div>
      </ShowroomDrawer>
      {searching && (
        <ShowroomServiceSearchSheet value={query} onApply={search} onClose={closeSearch} />
      )}
    </>
  );
}

function ShowroomContactAction({
  href,
  children,
  extra = false,
}: {
  href: string | null;
  children: ReactNode;
  extra?: boolean;
}) {
  const face = (
    <span {...stylex.props(s.contactActionFace, !href && s.contactActionUnavailable)}>
      {children}
    </span>
  );
  return href ? (
    <a href={href} {...stylex.props(s.contactAction, extra && s.contactExtraAction)}>
      {face}
    </a>
  ) : (
    <button
      type="button"
      disabled
      aria-describedby="contact-option-availability"
      {...stylex.props(s.contactAction, extra && s.contactExtraAction)}
    >
      {face}
    </button>
  );
}

export function ShowroomContactScreen({
  vehicle,
  serviceId,
}: {
  vehicle?: Vehicle;
  serviceId?: string;
}) {
  const { t, locale } = useLocale();
  const { messageDrafts } = useAppState();
  const service = showroomService(serviceId);
  const hasContactDetails = Boolean(showroom.address || showroom.hours.length);
  const unavailableContacts = !showroom.phone || !showroom.directionsUrl;
  const draftKey = vehicle?.id || 'showroom-' + (service?.id || 'general');
  const initial = vehicle
    ? locale === 'bg'
      ? `Здравейте, интересувам се от ${vehicle.make} ${vehicle.model}. Можем ли да уговорим оглед?`
      : `Hello, I'm interested in the ${vehicle.make} ${vehicle.model}. Could we arrange a viewing?`
    : service
      ? locale === 'bg'
        ? `Здравейте, искам да попитам за ${t(service.title).toLowerCase()}.`
        : `Hello, I'd like to ask about ${service.title.toLowerCase()}.`
      : '';
  const [edited, setEdited] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unavailable' | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const message = edited ?? messageDrafts[draftKey] ?? initial;
  return (
    <>
      <ShowroomBanner>
        <Header home overHeroDesktop />
        <ShowroomPageHero {...showroomPageContent.contact} compact>
          <Button
            href={showroom.phone ? 'tel:' + showroom.phone : undefined}
            xstyle={s.contactHeroAction}
            onClick={() => {
              const field = messageRef.current;
              field?.focus({ preventScroll: true });
              field?.scrollIntoView({
                block: 'center',
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              });
            }}
          >
            {showroom.phone ? 'Call us' : 'Write to us'}
          </Button>
        </ShowroomPageHero>
      </ShowroomBanner>
      <ShowroomDrawer>
        <div {...stylex.props(s.contactPage)}>
          <section aria-label={t('Showroom contact')} {...stylex.props(s.contactIntro)}>
            <ShowroomContactPanel />
            <div {...stylex.props(s.phoneContact)}>
              <div {...stylex.props(s.contactContainer)}>
                <div
                  role="group"
                  aria-label={t('Contact options')}
                  {...stylex.props(s.contactActions)}
                >
                  <ShowroomContactAction href={showroom.phone ? 'tel:' + showroom.phone : null}>
                    <Phone size={20} strokeWidth={1.8} aria-hidden="true" />
                    {t('Call us')}
                  </ShowroomContactAction>
                  <ShowroomContactAction href={showroom.directionsUrl}>
                    <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                    {t('Visit us')}
                  </ShowroomContactAction>
                  {showroom.email && (
                    <ShowroomContactAction href={'mailto:' + showroom.email} extra>
                      <Mail size={20} strokeWidth={1.8} aria-hidden="true" />
                      {t('Email us')}
                    </ShowroomContactAction>
                  )}
                </div>
                {unavailableContacts && (
                  <p
                    id="contact-option-availability"
                    {...stylex.props(ui.small, ui.muted, s.contactAvailability)}
                  >
                    {!showroom.phone && !showroom.directionsUrl
                      ? t('Phone and location details are unavailable in this preview.')
                      : !showroom.phone
                        ? t('Phone details are unavailable in this preview.')
                        : t('Location details are unavailable in this preview.')}
                  </p>
                )}
              </div>
            </div>
          </section>
          <div {...stylex.props(s.page, s.contactBody)}>
            <div {...stylex.props(s.contactContainer)}>
              <div {...stylex.props(s.contactGrid)}>
                <ShowroomContactForm
                  key={draftKey}
                  draftKey={draftKey}
                  message={message}
                  onMessageChange={(value) => {
                    setEdited(value);
                    setSaveStatus(null);
                  }}
                  onEdit={() => setSaveStatus(null)}
                  onSave={(details) => {
                    setSaveStatus(
                      saveMessageDraft(draftKey, message, details) ? 'saved' : 'unavailable',
                    );
                  }}
                  saveStatus={saveStatus}
                  context={
                    vehicle
                      ? {
                          title: vehicle.make + ' ' + vehicle.model,
                          href: '/vehicle/' + vehicle.id,
                          linkLabel: 'View car',
                        }
                      : service
                        ? {
                            title: t(service.title),
                            href: serviceCategoryHref(service.category),
                            linkLabel: 'View service',
                          }
                        : undefined
                  }
                />
                <ShowroomContactBanner />
                <section
                  aria-labelledby="showroom-enquiry-heading"
                  {...stylex.props(s.card, s.enquiryCard, s.inlineEnquiry)}
                >
                  <h2 id="showroom-enquiry-heading" {...stylex.props(s.subTitle)}>
                    {t('Enquiry')}
                  </h2>
                  <p {...stylex.props(s.body)}>{t('Ask a question or arrange a viewing.')}</p>
                  {(vehicle || service) && (
                    <div {...stylex.props(s.context)}>
                      <div {...stylex.props(s.contextText)}>
                        <p {...stylex.props(ui.small, ui.muted)}>{t('Regarding')}</p>
                        <p {...stylex.props(s.contextTitle)}>
                          {vehicle
                            ? vehicle.make + ' ' + vehicle.model
                            : service?.title
                              ? t(service.title)
                              : ''}
                        </p>
                      </div>
                      <Link
                        href={
                          vehicle
                            ? '/vehicle/' + vehicle.id
                            : serviceCategoryHref(service?.category || 'services')
                        }
                        {...stylex.props(s.contextLink)}
                      >
                        {vehicle ? t('View car') : t('View service')}
                      </Link>
                    </div>
                  )}
                  <form
                    {...stylex.props(s.form)}
                    onSubmit={(event) => {
                      event.preventDefault();
                      setSaveStatus(saveMessageDraft(draftKey, message) ? 'saved' : 'unavailable');
                    }}
                  >
                    <label {...stylex.props(ui.label, s.messageLabel)}>
                      {t('Message')}
                      <textarea
                        ref={messageRef}
                        aria-label={t('Enquiry message')}
                        value={message}
                        onChange={(event) => {
                          setEdited(event.target.value);
                          setSaveStatus(null);
                        }}
                        placeholder={
                          vehicle
                            ? t('Ask about availability or a viewing…')
                            : t('Tell us how we can help…')
                        }
                        required
                        minLength={10}
                        maxLength={4000}
                        {...stylex.props(s.textArea)}
                      />
                    </label>
                    <p {...stylex.props(ui.small, ui.muted, s.contactPreviewCopy)}>
                      {t('Preview: save your enquiry on this device.')}
                    </p>
                    <button type="submit" {...stylex.props(s.serviceAction, s.contactSubmit)}>
                      <span
                        {...stylex.props(
                          s.serviceActionFace,
                          s.serviceActionPrimary,
                          s.contactSubmitFace,
                        )}
                      >
                        {t('Save enquiry draft')}
                      </span>
                    </button>
                    {saveStatus && (
                      <p
                        role="status"
                        {...stylex.props(
                          s.saved,
                          saveStatus === 'unavailable' && s.saveUnavailable,
                        )}
                      >
                        {t(
                          saveStatus === 'saved'
                            ? 'Draft saved on this device. Nothing was sent.'
                            : 'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.',
                        )}
                      </p>
                    )}
                  </form>
                </section>
                {hasContactDetails && (
                  <section {...stylex.props(s.card, s.detailsCard)}>
                    <h2 {...stylex.props(s.subTitle)}>{t('Showroom details')}</h2>
                    <dl {...stylex.props(s.info)}>
                      {showroom.address && (
                        <div {...stylex.props(s.infoRow)}>
                          <span {...stylex.props(s.infoIcon)}>
                            <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <div>
                            <dt {...stylex.props(s.detailTitle)}>{t('Address')}</dt>
                            <dd {...stylex.props(s.body)}>{showroom.address}</dd>
                          </div>
                        </div>
                      )}
                      {showroom.hours.length > 0 && (
                        <div {...stylex.props(s.infoRow)}>
                          <span {...stylex.props(s.infoIcon)}>
                            <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <div>
                            <dt {...stylex.props(s.detailTitle)}>{t('Opening hours')}</dt>
                            <dd {...stylex.props(s.body)}>
                              {showroom.hours.map((hours) => (
                                <p key={hours}>{hours}</p>
                              ))}
                            </dd>
                          </div>
                        </div>
                      )}
                    </dl>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </ShowroomDrawer>
    </>
  );
}
