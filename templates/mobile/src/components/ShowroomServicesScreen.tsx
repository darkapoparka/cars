'use client';
import { useLocale } from '@/lib/use-locale';
import { useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { showroomPageContent } from '@/lib/showroom';
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
import { Header } from './Header';
import { Icon } from './Icon';
import { ShowroomTabs } from './ShowroomTabs';
import { ShowroomSearch } from './ShowroomSearch';
import { ShowroomServiceSearchSheet } from './ShowroomServiceSearchSheet';
import { ShowroomQuickPill, ShowroomQuickPills } from './ShowroomQuickPills';
import { ShowroomServiceRequest } from './ShowroomServiceRequest';
import { ShowroomImportExamples } from './ShowroomImportExamples';
import { ShowroomBanner, ShowroomDrawer, ShowroomPageHero } from './ShowroomPageLayout';
import { ShowroomServiceArtwork } from './ShowroomServiceArtwork';
import { Button, ui } from './ui';
import { s } from './showroom-pages.stylex';

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
      <ShowroomQuickPills label={t('Import countries')} inventoryDesktop compactOnPhone>
        {importCountries.map(({ value, label }) => (
          <ShowroomQuickPill
            key={value}
            inventoryDesktop
            secondaryOnPhone
            active={country === value}
            aria-pressed={country === value}
            onClick={() => window.history.pushState(null, '', importCountryHref(value))}
          >
            {t(label)}
          </ShowroomQuickPill>
        ))}
      </ShowroomQuickPills>
    ) : selected === 'sell' ? (
      <ShowroomQuickPills label={t('Sale type')} inventoryDesktop compactOnPhone>
        {saleEnquiryTypes.map(({ value, label }) => (
          <ShowroomQuickPill
            key={value}
            inventoryDesktop
            secondaryOnPhone
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
      <ShowroomDrawer>
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
              onChange={selectCategory}
            />
          </div>
          {contextFilters || (
            <ShowroomQuickPills label={t('Service filters')} inventoryDesktop compactOnPhone>
              {quickFilters
                .filter(({ value }) => value !== 'all')
                .map(({ value, label }) => (
                  <ShowroomQuickPill
                    key={value}
                    inventoryDesktop
                    secondaryOnPhone
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
