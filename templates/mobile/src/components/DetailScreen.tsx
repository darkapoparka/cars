'use client';
import { useMediaQuery } from '@/lib/use-media-query';
import { useLocale } from '@/lib/use-locale';
import { localizeVehicle, showroomPhotoHasLetterbox } from '@/lib/vehicle-copy';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { markViewed, setVehiclePhoto, notify, togglePark, useAppState } from '@/lib/store';
import { inventoryCanGoBack, inventoryReturnHref } from '@/lib/inventory-navigation';
import { vehicleGalleryHref } from '@/lib/vehicle-detail-navigation';
import { VehicleSections } from './VehicleSections';
import { VehicleDetailHeader } from './VehicleDetailHeader';
import { MobileVehicleSummary } from './MobileVehicleSummary';
import { DesktopVehicleOverview } from './DesktopVehicleOverview';
import { DesktopVehicleSummary } from './DesktopVehicleSummary';
import { vehicleDesktop } from './vehicle-detail-desktop.stylex';
import { Icon } from './Icon';
import { Button, Modal, ui } from './ui';
import { ContactSheet } from './ContactSheet';
import { FinanceCalculator } from './FinanceCalculator';
import { PriceRating } from './VehicleCard';
import { useVehicleDetailSection } from './useVehicleDetailSection';
const s = stylex.create({
  paymentTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    marginInline: 16,
    marginTop: 12,
    padding: 3,
    minHeight: 48,
    borderRadius: controlShape.pill,
    backgroundColor: colors.controlSurface,
  },
  paymentTab: {
    backgroundColor: 'transparent',
    color: colors.text,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    minHeight: 44,
    padding: 8,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  selectedTab: {
    backgroundColor: colors.background,
    boxShadow: '0 1px 3px #0001',
  },
  leasePrice: { display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  leaseCopy: { fontSize: 13, color: colors.muted, lineHeight: '20px' },
  desktopLeasePeriod: { display: { default: 'inline', '@media (max-width: 699px)': 'none' } },
  mobileLeasePeriod: { display: { default: 'none', '@media (max-width: 699px)': 'block' } },
  hero: {
    touchAction: 'pan-y',
    display: 'block',
    position: 'relative',
    aspectRatio: {
      default: '1280 / 810',
      '@media (max-width: 699px)': '4 / 3',
      '@media (min-width: 1024px)': '16 / 10',
    },
    borderRadius: { default: 0, '@media (min-width: 1024px)': 18 },
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  image: { objectFit: 'cover' },
  letterboxedImage: {
    transform: { default: 'none', '@media (max-width: 699px)': 'scale(1.334)' },
  },
  counter: {
    position: 'absolute',
    right: 12,
    bottom: { default: 28, '@media (min-width: 1024px)': 16 },
    width: 84,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25262bcc',
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
  },
  overview: { display: 'contents' },
  desktopOverview: {
    display: {
      default: 'contents',
      '@media (max-width: 699px)': 'none',
      '@media (min-width: 1024px)': 'none',
    },
  },
  leaseOption: {
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.controlSurface,
  },
  leaseOptionLabel: {
    minHeight: 44,
    paddingBlock: 12,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
  },
  purchaseSummary: {
    display: { default: 'contents', '@media (max-width: 699px)': 'flex' },
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    columnGap: 12,
    rowGap: 4,
    padding: { default: 0, '@media (max-width: 699px)': 16 },
  },
  info: { paddingInline: 16, paddingTop: 16 },
  leaseInfo: {
    display: { default: 'block', '@media (max-width: 699px)': 'flex' },
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: 8,
    rowGap: 4,
  },
  purchaseInfo: {
    display: 'block',
    flex: '1 1 auto',
    minWidth: 'min(100%, 5.5em)',
    maxWidth: '100%',
    fontSize: { default: 'inherit', '@media (max-width: 699px)': 24 },
    paddingInline: { default: 16, '@media (max-width: 699px)': 0 },
    paddingTop: { default: 16, '@media (max-width: 699px)': 0 },
  },
  purchaseOffer: {
    display: { default: 'flex', '@media (max-width: 699px)': 'contents' },
  },
  purchaseControl: {
    width: { default: 'auto', '@media (max-width: 699px)': '100%' },
    order: { default: 0, '@media (max-width: 699px)': 3 },
  },
  purchasePaymentTabs: {
    marginInline: { default: 16, '@media (max-width: 699px)': 0 },
    order: { default: 0, '@media (max-width: 699px)': 1 },
  },
  purchaseRating: {
    minHeight: 44,
    marginLeft: 'auto',
    maxWidth: '100%',
    paddingInline: { default: 6, '@media (max-width: 699px)': 0 },
    paddingBlock: { default: 4, '@media (max-width: 699px)': 0 },
    textAlign: { default: 'left', '@media (max-width: 699px)': 'right' },
  },
  purchaseAmount: {
    display: { default: 'contents', '@media (max-width: 699px)': 'flex' },
    flexDirection: 'column',
    alignItems: { default: 'stretch', '@media (max-width: 699px)': 'flex-end' },
    justifyContent: 'flex-end',
    flexShrink: 0,
    maxWidth: '100%',
  },
  purchasePriceRow: {
    display: 'flex',
    alignItems: { default: 'center', '@media (max-width: 699px)': 'flex-start' },
    marginTop: { default: 10, '@media (max-width: 699px)': 0 },
    marginLeft: { default: 0, '@media (max-width: 699px)': 'auto' },
    maxWidth: '100%',
    order: 0,
  },
  mobileLeasePrice: {
    marginTop: { default: 12, '@media (max-width: 699px)': 0 },
    marginLeft: { default: 0, '@media (max-width: 699px)': 'auto' },
    maxWidth: '100%',
  },
  priceCluster: {
    display: { default: 'contents', '@media (max-width: 699px)': 'flex' },
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '100%',
    marginLeft: 'auto',
  },
  mobilePreviousPrice: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    marginTop: { default: 0, '@media (max-width: 699px)': 2 },
  },
  mobileOldPrice: {
    fontSize: 12,
    lineHeight: '18px',
  },
  desktopPreviousPrice: {
    display: { default: 'flex', '@media (max-width: 699px)': 'none' },
  },
  offer: {
    backgroundColor: colors.background,
    paddingInline: 16,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  model: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '30px',
    overflowWrap: 'anywhere',
    flexShrink: 0,
    maxWidth: '100%',
  },
  variant: {
    fontSize: 14,
    lineHeight: '20px',
    color: colors.muted,
    marginTop: 4,
    contain: { default: 'none', '@media (max-width: 699px)': 'inline-size' },
    overflowWrap: 'anywhere',
    flexShrink: 0,
    maxWidth: '100%',
  },
  price: { fontFamily: 'var(--font-base)', fontSize: 24, fontWeight: 700, lineHeight: '32px' },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 2,
  },
  priceNote: {
    fontSize: 12,
    lineHeight: '18px',
    color: colors.muted,
    width: '100%',
    order: { default: 0, '@media (max-width: 699px)': 2 },
  },
  mobileLeaseNote: {
    width: '100%',
    order: { default: 0, '@media (max-width: 699px)': 2 },
  },
  mobileDeliveryNote: { display: { default: 'block', '@media (max-width: 699px)': 'none' } },
  desktopPriceRating: { display: { default: 'contents', '@media (max-width: 699px)': 'none' } },
  mobilePriceRating: {
    display: { default: 'none', '@media (max-width: 699px)': 'block' },
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '20px',
    color: colors.green,
  },
  finance: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingBlock: 12,
    paddingInline: 12,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: { default: colors.controlSurface, ':hover': colors.surface },
    color: colors.text,
    width: '100%',
    marginTop: 12,
    minHeight: 48,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 8,
    marginTop: 12,
  },
  action: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: { default: 48, '@media (max-width: 699px)': 44 },
    paddingBlock: { default: 12, '@media (max-width: 699px)': 10 },
    paddingInline: { default: 12, '@media (max-width: 359px)': 8 },
    borderRadius: controlShape.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    color: colors.text,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  enquire: {
    backgroundColor: { default: colors.text, ':hover': colors.text },
    borderColor: colors.text,
    color: colors.background,
    outlineColor: colors.text,
    outlineOffset: 3,
  },
  contactDock: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: {
      default: '100%',
      '@media (min-width: 1024px)': `calc(100% - ${showroomDesktop.viewportGutter} * 2)`,
    },
    maxWidth: { default: 1100, '@media (min-width: 1024px)': showroomDesktop.shellWidth },
    display: { default: 'grid', '@media (min-width: 1024px)': 'none' },
    gridTemplateColumns: 'minmax(0,1fr) auto',
    alignItems: 'center',
    gap: 12,
    paddingBlock: { default: 12, '@media (max-width: 699px)': 6 },
    paddingInline: 16,
    paddingBottom: {
      default: 'calc(12px + env(safe-area-inset-bottom))',
      '@media (max-width: 699px)': 'calc(6px + env(safe-area-inset-bottom))',
    },
    backgroundColor: colors.background,
    borderTopWidth: { default: 1, '@media (max-width: 699px)': 0 },
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    boxShadow: '0 -3px 12px #00000008',
    zIndex: 38,
  },
  dockPrice: {
    display: 'flex',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 4,
    minWidth: 0,
    fontSize: { default: 20, '@media (max-width: 699px)': 16 },
    fontWeight: { default: 700, '@media (max-width: 699px)': 500 },
    lineHeight: { default: '28px', '@media (max-width: 699px)': '24px' },
    overflowWrap: 'anywhere',
  },
  dockPeriod: { fontSize: 12, fontWeight: 400, lineHeight: '18px', color: colors.muted },
  dockAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: { default: 48, '@media (max-width: 699px)': 44 },
    minWidth: { default: 'auto', '@media (max-width: 699px)': 120 },
    paddingBlock: { default: 12, '@media (max-width: 699px)': 0 },
    paddingInline: { default: 12, '@media (max-width: 699px)': 0 },
    borderWidth: { default: 1, '@media (max-width: 699px)': 0 },
    borderStyle: 'solid',
    borderColor: colors.text,
    borderRadius: controlShape.pill,
    backgroundColor: { default: colors.text, '@media (max-width: 699px)': 'transparent' },
    color: colors.background,
    fontSize: { default: 15, '@media (max-width: 699px)': 14 },
    fontWeight: 500,
    lineHeight: { default: '22px', '@media (max-width: 699px)': '20px' },
    textDecoration: 'none',
    outlineColor: colors.text,
    outlineOffset: 3,
  },
  dockActionFace: {
    display: { default: 'contents', '@media (max-width: 699px)': 'inline-flex' },
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 36,
    paddingBlock: 8,
    paddingInline: 18,
    borderRadius: controlShape.pill,
    backgroundColor: colors.text,
  },
  actionIcon: { display: 'inline-flex', flexShrink: 0 },
  financeAmount: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
    color: colors.muted,
    fontWeight: 400,
  },
  financeAction: { display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  ratingButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    marginLeft: 'auto',
    paddingBlock: 4,
    paddingInline: 6,
    borderRadius: controlShape.pill,
    borderWidth: 0,
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.muted,
    textAlign: 'left',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  oldRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  financeValue: { fontWeight: 500, fontSize: 16, color: colors.text },
  old: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 400,
    textDecoration: 'line-through',
    color: colors.muted,
  },
  discount: {
    backgroundColor: colors.activeSurface,
    color: colors.accent,
    paddingInline: 8,
    paddingBlock: 2,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
  },
});
export function DetailScreen({ vehicle }: { vehicle: Vehicle }) {
  const { t, locale, money, number } = useLocale();
  const v = localizeVehicle(vehicle, locale);
  const router = useRouter();
  const section = useVehicleDetailSection();
  const actions = useRef<HTMLDivElement>(null);
  const mobileActions = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery('(max-width: 699px)');
  const [contactDock, setContactDock] = useState(false);
  const { parked, filters, photoIndexes } = useAppState();
  const photoIndex = Math.min(v.images.length - 1, Math.max(0, photoIndexes[v.id] || 0));
  const photoGesture = useRef({ x: 0, y: 0, moved: false });
  function changePhoto(direction: number) {
    setVehiclePhoto(v.id, (photoIndex + direction + v.images.length) % v.images.length);
  }
  const [contact, setContact] = useState(false);
  const [finance, setFinance] = useState(false);
  const [leaseQuote, setLeaseQuote] = useState(false);
  const [paymentOverride, setPaymentOverride] = useState<'buy' | 'lease' | null>(null);
  const leasing =
    !mobile && Boolean(v.leaseTerms) && (paymentOverride || filters.payment) === 'lease';
  const summaryLayout = !leasing || mobile;
  const financeMonthly = v.financeMonthly || v.monthly || Math.round(v.price * 0.01061);

  const [priceInfo, setPriceInfo] = useState(false);
  const [report, setReport] = useState(false);
  useEffect(() => markViewed(v.id), [v.id]);
  useEffect(() => {
    const target = mobile ? mobileActions.current : actions.current;
    if (!target) return;
    const navigation = target
      .closest('[data-vehicle-detail-sheet]')
      ?.querySelector<HTMLElement>('[data-vehicle-detail-nav]');
    if (mobile) {
      // A fast scroll can skip both sides of an IntersectionObserver's visible range.
      let frame = 0;
      const updateDock = () => {
        frame = 0;
        const stickyHeight = 60 + (navigation?.getBoundingClientRect().height || 0);
        setContactDock(target.getBoundingClientRect().bottom <= stickyHeight);
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(updateDock);
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      const resize = new ResizeObserver(schedule);
      resize.observe(target);
      if (navigation) resize.observe(navigation);
      updateDock();
      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        resize.disconnect();
      };
    }
    let observer: IntersectionObserver | undefined;
    const observeActions = () => {
      observer?.disconnect();
      const stickyHeight = 60 + (navigation?.getBoundingClientRect().height || 0);
      observer = new IntersectionObserver(
        ([entry]) => {
          setContactDock(!entry.isIntersecting && entry.boundingClientRect.bottom <= stickyHeight);
        },
        { rootMargin: '-' + stickyHeight + 'px 0px 0px 0px' },
      );
      observer.observe(target);
    };
    observeActions();
    const resize = new ResizeObserver(observeActions);
    if (navigation) resize.observe(navigation);
    return () => {
      observer?.disconnect();
      resize.disconnect();
    };
  }, [v.id, section, mobile]);
  async function share() {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', locale);
      await navigator.clipboard.writeText(url.href);
      notify(t('Vehicle link copied'));
    } catch {
      notify(t('Copy the vehicle link from your browser’s address bar.'));
    }
  }
  const purchasePrice = (
    <div {...stylex.props(s.priceRow, s.purchasePriceRow)}>
      <div {...stylex.props(s.priceCluster)}>
        <div {...stylex.props(s.purchaseAmount)}>
          <strong data-vehicle-price {...stylex.props(s.price)}>
            {money(v.price)}
          </strong>
          {v.previousPrice && (
            <p {...stylex.props(s.mobilePreviousPrice)}>
              <del {...stylex.props(s.old, s.mobileOldPrice)}>{money(v.previousPrice)}</del>
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label={t('Price rating details')}
          aria-haspopup="dialog"
          onClick={() => setPriceInfo(true)}
          {...stylex.props(s.ratingButton, s.purchaseRating)}
        >
          <span {...stylex.props(s.desktopPriceRating)}>
            <PriceRating veryGood={v.deal} detail />
          </span>
          <span {...stylex.props(s.mobilePriceRating)}>
            {t(v.deal ? 'Very good price' : 'Good price')}
          </span>
          <Icon name="info" size={14} />
        </button>
      </div>
    </div>
  );
  return (
    <>
      <VehicleDetailHeader
        id={v.id}
        title={v.make + ' ' + v.model}
        image={image}
        saved={parked.includes(v.id)}
        onShare={share}
        onSave={() => togglePark(v.id)}
        onBack={() => {
          const canGoBack = inventoryCanGoBack(v.id);
          const href = inventoryReturnHref(v.id);
          if (canGoBack) router.back();
          else router.replace(href, { scroll: false });
        }}
      />
      <div data-vehicle-desktop-layout {...stylex.props(vehicleDesktop.layout)}>
        <DesktopVehicleOverview
          vehicle={v}
          saved={parked.includes(v.id)}
          onSave={() => togglePark(v.id)}
          onShare={share}
        />
        <div ref={image} data-vehicle-hero {...stylex.props(vehicleDesktop.media)}>
          <div {...stylex.props(vehicleDesktop.photoFrame)}>
            <Link
              href={vehicleGalleryHref(v.id, section)}
              {...stylex.props(s.hero)}
              aria-label={t('Vehicle image')}
              onPointerDown={(event) => {
                photoGesture.current = { x: event.clientX, y: event.clientY, moved: false };
              }}
              onPointerUp={(event) => {
                const dx = event.clientX - photoGesture.current.x;
                const dy = event.clientY - photoGesture.current.y;
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                  photoGesture.current.moved = true;
                  changePhoto(dx < 0 ? 1 : -1);
                }
              }}
              onClick={(event) => {
                if (photoGesture.current.moved) {
                  event.preventDefault();
                  photoGesture.current.moved = false;
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  changePhoto(event.key === 'ArrowRight' ? 1 : -1);
                }
              }}
            >
              <Image
                src={v.images[photoIndex]}
                alt={v.make + ' ' + v.model}
                fill
                priority
                sizes="(min-width: 1328px) 840px, (min-width: 1024px) calc(100vw - 488px), 100vw"
                {...stylex.props(
                  s.image,
                  showroomPhotoHasLetterbox(v.images[photoIndex]) && s.letterboxedImage,
                )}
              />
              <span {...stylex.props(s.counter)}>
                <Icon name="photo" size={20} />
                {photoIndex + 1} / {v.images.length}
              </span>
            </Link>
            {v.images.length > 1 && (
              <div {...stylex.props(vehicleDesktop.photoControls)}>
                <button
                  type="button"
                  aria-label={t('Previous photo')}
                  onClick={() => changePhoto(-1)}
                  {...stylex.props(vehicleDesktop.photoButton)}
                >
                  <Icon name="back" />
                </button>
                <button
                  type="button"
                  aria-label={t('Next photo')}
                  onClick={() => changePhoto(1)}
                  {...stylex.props(vehicleDesktop.photoButton)}
                >
                  <Icon name="right" />
                </button>
              </div>
            )}
          </div>
          {v.images.length > 1 && (
            <div
              role="group"
              aria-label={t('Vehicle photos')}
              {...stylex.props(vehicleDesktop.photoRail)}
            >
              {v.images.slice(0, 5).map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={t('Photos') + ' ' + number(index + 1)}
                  aria-pressed={index === photoIndex}
                  onClick={() => setVehiclePhoto(v.id, index)}
                  {...stylex.props(
                    vehicleDesktop.thumbnail,
                    index === photoIndex && vehicleDesktop.selectedThumbnail,
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="140px"
                    loading="lazy"
                    {...stylex.props(vehicleDesktop.thumbnailImage)}
                  />
                </button>
              ))}
              <Link
                href={vehicleGalleryHref(v.id, section)}
                {...stylex.props(vehicleDesktop.thumbnail, vehicleDesktop.photosLink)}
              >
                <Icon name="photo" />
                <span>
                  {t('Photos')} · {number(v.images.length)}
                </span>
              </Link>
            </div>
          )}
        </div>
        <DesktopVehicleSummary
          vehicle={v}
          leasing={leasing}
          onPaymentChange={setPaymentOverride}
          onFinance={() => setFinance(true)}
          onLeaseDetails={() => setLeaseQuote(true)}
          onPriceInfo={() => setPriceInfo(true)}
          onContact={() => setContact(true)}
        />
        <div {...stylex.props(vehicleDesktop.content)}>
          <VehicleSections
            key={v.id}
            vehicle={v}
            showroomMode
            mobileView={mobile}
            onReport={() => setReport(true)}
            onFinance={() => setFinance(true)}
            mobileOverview={
              <MobileVehicleSummary
                vehicle={v}
                actions={mobileActions}
                onPriceInfo={() => setPriceInfo(true)}
                onContact={() => setContact(true)}
              />
            }
            overview={
              <div
                {...stylex.props(s.overview, summaryLayout && s.purchaseSummary, s.desktopOverview)}
              >
                <section {...stylex.props(s.info, summaryLayout ? s.purchaseInfo : s.leaseInfo)}>
                  <h1 {...stylex.props(s.model)}>
                    {v.make} {v.model}
                  </h1>
                  <p {...stylex.props(s.variant)}>{v.variant}</p>
                </section>
                {v.leaseTerms && (
                  <div
                    {...stylex.props(
                      s.paymentTabs,
                      summaryLayout && s.purchaseControl,
                      summaryLayout && s.purchasePaymentTabs,
                    )}
                    role="group"
                    aria-label={t('Payment type')}
                  >
                    <button
                      type="button"
                      aria-pressed={!leasing}
                      onClick={() => setPaymentOverride('buy')}
                      {...stylex.props(s.paymentTab, !leasing && s.selectedTab)}
                    >
                      {t('Buying')}
                    </button>
                    <button
                      type="button"
                      aria-pressed={leasing}
                      onClick={() => setPaymentOverride('lease')}
                      {...stylex.props(s.paymentTab, leasing && s.selectedTab)}
                    >
                      {t('Leasing')}
                    </button>
                  </div>
                )}
                <section
                  aria-label={t('Vehicle price and contact')}
                  {...stylex.props(s.offer, summaryLayout && s.purchaseOffer)}
                >
                  {leasing && v.leaseTerms ? (
                    <>
                      <div {...stylex.props(s.leasePrice, s.mobileLeasePrice)}>
                        <div {...stylex.props(s.priceCluster)}>
                          <strong data-vehicle-price {...stylex.props(s.price)}>
                            {money(v.monthly || 0)}
                          </strong>
                          <span {...stylex.props(s.leaseCopy, s.mobileLeasePeriod)}>
                            / {t('month')}
                          </span>
                        </div>
                        <span {...stylex.props(s.leaseCopy, s.desktopLeasePeriod)}>
                          {t('Monthly incl. VAT.')}
                        </span>
                      </div>
                      <p {...stylex.props(s.leaseCopy, s.mobileLeaseNote)}>
                        {v.leaseTerms.months} {t('months')} · {number(v.leaseTerms.annualMileage)}{' '}
                        {t('km per year')} · {t(v.leaseTerms.customer)}
                      </p>
                      <button
                        type="button"
                        aria-label={t('Leasing details')}
                        aria-haspopup="dialog"
                        {...stylex.props(s.finance, summaryLayout && s.purchaseControl)}
                        onClick={(event) => {
                          event.currentTarget.focus({ preventScroll: true });
                          setLeaseQuote(true);
                        }}
                      >
                        {t('Leasing details')}
                        <Icon name="right" size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      {purchasePrice}
                      {v.previousPrice && (
                        <p {...stylex.props(s.oldRow, s.desktopPreviousPrice)}>
                          <span {...stylex.props(s.old)}>{money(v.previousPrice)}</span>
                          <span {...stylex.props(s.discount)}>
                            -{money(v.previousPrice - v.price)}
                          </span>
                        </p>
                      )}
                      <p
                        {...stylex.props(
                          s.priceNote,
                          v.priceNote === t('may include delivery costs') && s.mobileDeliveryNote,
                        )}
                      >
                        {v.priceNote ||
                          money(v.price / 1.19) +
                            (locale === 'bg' ? ' без ДДС, 19% ДДС' : ' Net, 19.00% VAT')}
                      </p>
                      <button
                        type="button"
                        aria-label={
                          t('Calculate Financing') +
                          ': ' +
                          t('From') +
                          ' ' +
                          money(financeMonthly) +
                          t(' per month')
                        }
                        aria-haspopup="dialog"
                        onClick={() => setFinance(true)}
                        {...stylex.props(s.finance, s.purchaseControl)}
                      >
                        <span {...stylex.props(s.financeAmount)}>
                          {t('from')}{' '}
                          <strong {...stylex.props(s.financeValue)}>{money(financeMonthly)}</strong>{' '}
                          / {t('month')}
                        </span>
                        <span {...stylex.props(s.financeAction)}>
                          {t('Financing ')}
                          <Icon name="right" size={18} />
                        </span>
                      </button>
                    </>
                  )}
                  <div
                    ref={actions}
                    {...stylex.props(s.actions, summaryLayout && s.purchaseControl)}
                  >
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      onClick={() => setContact(true)}
                      {...stylex.props(s.action)}
                    >
                      <span {...stylex.props(s.actionIcon)}>
                        <Icon name="phone" size={18} />
                      </span>
                      {t('Contact')}
                    </button>
                    <Link href={'/contact?vehicle=' + v.id} {...stylex.props(s.action, s.enquire)}>
                      <span {...stylex.props(s.actionIcon)}>
                        <Icon name="mail" size={18} />
                      </span>
                      {t('Enquire')}
                    </Link>
                  </div>
                </section>
              </div>
            }
          />
        </div>
      </div>
      {(contactDock || (!mobile && section !== 'details')) && (
        <aside
          aria-label={t('Vehicle enquiry')}
          data-vehicle-contact-dock
          {...stylex.props(s.contactDock)}
        >
          <strong {...stylex.props(s.dockPrice)}>
            {money(leasing ? v.monthly || 0 : v.price)}
            {leasing && <span {...stylex.props(s.dockPeriod)}> / {t('month')}</span>}
          </strong>
          <Link
            href={'/contact?vehicle=' + v.id}
            aria-label={t('Enquire about this car') + ': ' + v.make + ' ' + v.model}
            {...stylex.props(s.dockAction)}
          >
            <span {...stylex.props(s.dockActionFace)}>{t('Enquire')}</span>
          </Link>
        </aside>
      )}
      <ContactSheet vehicle={v} open={contact} onClose={() => setContact(false)} />
      <Modal
        open={finance}
        onClose={() => setFinance(false)}
        title={t('Calculate Financing')}
        sheet={mobile}
      >
        {mobile && v.leaseTerms && (
          <details data-mobile-lease-offer {...stylex.props(s.leaseOption)}>
            <summary {...stylex.props(s.leaseOptionLabel)}>
              {t('Leasing')} · {money(v.monthly || 0)} / {locale === 'bg' ? 'мес.' : 'mo.'}
            </summary>
            <div {...stylex.props(ui.column)}>
              <p>
                {money(v.monthly || 0)} {t('per month, including VAT.')}
              </p>
              <p>
                {v.leaseTerms.months} {t('months')} · {number(v.leaseTerms.annualMileage)}{' '}
                {t('km per year')} · {money(v.leaseTerms.deposit)} {t('initial payment')}
              </p>
              <p {...stylex.props(ui.small, ui.muted)}>
                {t(
                  'Captured reference quote only. Live lease calculation and finance applications are not connected; no request is sent.',
                )}
              </p>
            </div>
          </details>
        )}
        <FinanceCalculator vehicle={v} onClose={() => setFinance(false)} />
      </Modal>
      <Modal open={leaseQuote} onClose={() => setLeaseQuote(false)} title={t('Leasing details')}>
        <div {...stylex.props(ui.column)}>
          <strong>
            {v.make} {v.model}
          </strong>
          <p>
            {money(v.monthly || 0)} {t('per month, including VAT.')}
          </p>
          <p>
            {v.leaseTerms?.months} {t('months')} · {number(v.leaseTerms?.annualMileage || 0)}{' '}
            {t('km per year')} · {money(v.leaseTerms?.deposit || 0)} {t('initial payment')}
          </p>
          <p {...stylex.props(ui.small, ui.muted)}>
            {t(
              'Captured reference quote only. Live lease calculation and finance applications are not connected; no request is sent.',
            )}
          </p>
          <Button onClick={() => setLeaseQuote(false)}>{t('Close')}</Button>
        </div>
      </Modal>
      <Modal open={priceInfo} onClose={() => setPriceInfo(false)} title={t('Price rating')}>
        <div {...stylex.props(ui.column)}>
          <PriceRating veryGood={v.deal} />
          <p>
            {t(
              'The rating and advertised price are reproduced from the captured reference listing. They are not a current market valuation.',
            )}
          </p>
          <Button onClick={() => setPriceInfo(false)} block>
            {t('Close')}
          </Button>
        </div>
      </Modal>
      <Modal open={report} onClose={() => setReport(false)} title="Report listing">
        <div {...stylex.props(ui.column)}>
          <p>
            This listing is a local captured example. Reporting to the marketplace is not connected.
          </p>
          <Button onClick={() => setReport(false)} block>
            {t('Close')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
