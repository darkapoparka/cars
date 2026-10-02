'use client';
import { Fragment, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NativeDealerCards } from './NativeDealerCards';
import { DealerLogo } from './DealerLogo';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { colors } from '@/styles/tokens.stylex';
import { number } from '@/lib/search';
import { vehicles } from '@/lib/catalog';
import { showroom } from '@/lib/showroom';
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
    padding: 0,
    paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
    gap: 16,
  },
  sheet: {
    position: 'relative',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
    boxShadow: '0 -4px 16px #00000012',
  },
  sectionNav: {
    position: 'sticky',
    top: 60,
    zIndex: 25,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    scrollMarginTop: 60,
  },
  grip: {
    display: 'flex',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gripBar: { width: 36, height: 4, borderRadius: 4, backgroundColor: colors.line },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  showroomPanel: { gap: 0 },
  showroomSection: {
    borderWidth: 0,
    borderRadius: 0,
    overflow: 'visible',
  },
  showroomDivider: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
  },
  showroomTitle: { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 12, fontSize: 18 },
  showroomFooter: { marginInline: 12 },
  featureValue: { fontWeight: 500 },
  featureTags: { marginBottom: 16 },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pad: { padding: 16 },
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
  showroomSpecs: { padding: 0, gap: 16 },
  showroomSpec: { paddingLeft: 34 },
  specIcon: {
    display: 'inline-flex',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  showroomLabel: { fontSize: 12, lineHeight: '18px' },
  showroomValue: { fontSize: 14, lineHeight: '20px', fontWeight: 500 },
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
    height: 52,
    fontWeight: 400,
    textAlign: 'left',
    verticalAlign: 'middle',
    width: '50%',
    overflowWrap: 'anywhere',
  },
  key: { fontWeight: 700 },
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
    fontSize: 14,
    lineHeight: '20px',
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
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    textDecoration: 'none',
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  modalScroll: { flex: '1', minHeight: 0, overflowY: 'auto', paddingTop: 4, marginBottom: 12 },
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
  description: { whiteSpace: 'pre-line', fontSize: 14, lineHeight: '22px' },
  carousel: {
    display: 'flex',
    overflowX: 'auto',
    gap: 16,
    padding: 16,
    scrollSnapType: 'x mandatory',
  },
  featuresLabel: { width: '80%' },
  showroomCar: { width: 281, flexShrink: 0, scrollSnapAlign: 'start' },
});
export function VehicleSections({
  vehicle: v,
  onReport,
  showroomMode = false,
  overview,
}: {
  vehicle: Vehicle;
  onReport: () => void;
  showroomMode?: boolean;
  overview?: ReactNode;
}) {
  const section = useVehicleDetailSection();
  const navigation = useRef<HTMLDivElement>(null);
  const panelId = 'vehicle-detail-panel-' + v.id;
  const tabPrefix = 'vehicle-detail-tab-' + v.id + '-';
  const showDetails = !showroomMode || section === 'details';
  const showFeatures = !showroomMode || section === 'features';
  function selectSection(value: VehicleDetailSection) {
    selectVehicleDetailSection(value);
    requestAnimationFrame(() => {
      const sheet = navigation.current?.closest('[data-vehicle-detail-sheet]');
      if (!sheet) return;
      // A sticky rail's visible position changes; the sheet retains its page position.
      window.scrollTo({
        top: Math.max(0, window.scrollY + sheet.getBoundingClientRect().top - 60),
        behavior: 'instant',
      });
    });
  }
  const [technical, setTechnical] = useState(false);
  const [features, setFeatures] = useState(false);
  const [description, setDescription] = useState(false);
  const spec: [IconName, string, string][] = [
    ['mileage', 'Mileage', number(v.mileage) + ' km'],
    ...(v.mileage > 0
      ? [
          ['date', showroomMode ? 'First registered' : 'First Registration', v.registration] as [
            IconName,
            string,
            string,
          ],
        ]
      : []),
    ['gauge', 'Power', Math.round(v.power / 1.36) + ' kW (' + v.power + ' hp)'],
    ...(v.attributes?.hideOwners
      ? []
      : [
          ['user', showroomMode ? 'Owners' : 'Number of Owners', v.attributes?.owners || '1'] as [
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
    ['Mileage', number(v.mileage) + ' km'],
    ['Power', Math.round(v.power / 1.36) + ' kW (' + v.power + ' hp)'],
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
  return (
    <div {...stylex.props(s.body, showroomMode && s.showroomBody)}>
      <section
        aria-label={showroomMode ? 'Vehicle information' : undefined}
        data-vehicle-detail-sheet={showroomMode ? '' : undefined}
        {...stylex.props(showroomMode && s.sheet)}
      >
        {showroomMode && (
          <div ref={navigation} data-vehicle-detail-nav {...stylex.props(s.sectionNav)}>
            <span aria-hidden="true" {...stylex.props(s.grip)}>
              <span {...stylex.props(s.gripBar)} />
            </span>
            <ShowroomTabs
              label="Vehicle information"
              tabs={vehicleDetailSections}
              selected={section}
              panelId={panelId}
              idPrefix={tabPrefix}
              layout="fill"
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
              aria-label="Vehicle overview"
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
                      <span {...stylex.props(ui.orange, s.specIcon)}>
                        <Icon name={icon} size={showroomMode ? 24 : 28} />
                      </span>
                      {label}
                    </dt>
                    <dd {...stylex.props(s.value, showroomMode && s.showroomValue)}>{value}</dd>
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
                  <strong>Special features according to dealer</strong>
                  <div {...stylex.props(s.tags)}>
                    {v.specialFeatures.map((feature) => (
                      <span key={feature} {...stylex.props(ui.badge)}>
                        {feature}
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
                <h2 {...stylex.props(s.title, showroomMode && s.showroomTitle)}>Technical data</h2>
                <table {...stylex.props(s.table)}>
                  <tbody>
                    {data.slice(0, 6).map(([label, value]) => (
                      <tr key={label} {...stylex.props(s.row)}>
                        <th scope="row" {...stylex.props(s.cell, s.key)}>
                          {label}
                        </th>
                        <td {...stylex.props(s.cell)}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                aria-expanded={technical}
                aria-label="Show more technical data"
                aria-haspopup="dialog"
                onClick={() => setTechnical(true)}
                {...stylex.props(s.more, showroomMode && s.showroomMore)}
              >
                {showroomMode ? 'All specifications' : 'Show more'}
                {showroomMode && <Icon name="right" size={18} />}
              </button>
            </section>
          )}
          {showroomMode && section === 'photos' && (
            <section
              aria-label="Vehicle photos"
              {...stylex.props(s.card, s.pad, s.showroomSection)}
            >
              <GalleryScreen vehicle={v} embedded />
            </section>
          )}
          {showFeatures && (
            <section {...stylex.props(s.card, showroomMode && s.showroomSection)}>
              <div {...stylex.props(s.pad)}>
                <h2 {...stylex.props(s.title, showroomMode && s.showroomTitle)}>Features</h2>
                {showroomMode && v.specialFeatures && v.specialFeatures.length > 0 && (
                  <div {...stylex.props(s.tags, s.featureTags)}>
                    {v.specialFeatures.map((feature) => (
                      <span key={feature} {...stylex.props(ui.badge)}>
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
                {!v.features.length && <p {...stylex.props(ui.muted)}>No features listed.</p>}
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
                          {feature}
                        </th>
                        <td {...stylex.props(s.cell, s.check)}>
                          <Icon name="check" size={18} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showroomMode && v.features.length > 6 && (
                <button
                  type="button"
                  aria-expanded={features}
                  aria-label="Show more features"
                  aria-haspopup="dialog"
                  onClick={() => setFeatures(true)}
                  {...stylex.props(s.more)}
                >
                  Show more
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
                  Vehicle description
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
                    Captured vehicle example. Supplementary specifications are local fixtures, not a
                    verified current sales offer.
                  </p>
                )}
              </div>
              {(!showroomMode || (v.attributes?.description?.length || 0) > 600) && (
                <button
                  type="button"
                  aria-expanded={description}
                  aria-label={
                    description ? 'Show less vehicle description' : 'Show more vehicle description'
                  }
                  onClick={() => setDescription(!description)}
                  {...stylex.props(s.more, showroomMode && s.showroomMore)}
                >
                  {description ? 'Show less' : 'Show more'}
                </button>
              )}
            </section>
          )}
        </div>
      </section>
      {showroomMode ? (
        <section {...stylex.props(s.card, ui.pad, s.showroomFooter)}>
          <h2 {...stylex.props(s.title)}>{showroom.name}</h2>
          <p {...stylex.props(ui.text, ui.muted, ui.space)}>
            Ask about this car or arrange a viewing.
          </p>
          <div {...stylex.props(ui.space)}>
            <Link href={'/contact?vehicle=' + v.id} {...stylex.props(s.contactAction)}>
              <Icon name="mail" size={18} />
              Contact the showroom
            </Link>
          </div>
        </section>
      ) : (
        <NativeDealerCards vehicle={v} />
      )}
      <section {...stylex.props(s.card, showroomMode && s.showroomFooter)}>
        <h2 {...stylex.props(s.title, s.pad)}>Similar vehicles</h2>
        <div {...stylex.props(s.carousel)}>
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
      <p {...stylex.props(ui.small, ui.muted, ui.center)}>
        {showroomMode
          ? 'Sample vehicle · Showroom template preview'
          : 'Local reference · No live seller connection'}
      </p>
      <Modal table open={technical} onClose={() => setTechnical(false)} label="Technical data">
        <h2 {...stylex.props(s.modalTitle)}>Technical data</h2>
        <div {...stylex.props(s.modalScroll)}>
          <table {...stylex.props(s.table)}>
            <tbody>
              {data.map(([label, value]) => (
                <Fragment key={label}>
                  <tr {...stylex.props(s.row)}>
                    <th scope="row" {...stylex.props(s.cell, s.modalCell, s.modalKey)}>
                      {label}
                    </th>
                    <td {...stylex.props(s.cell, s.modalCell)}>{value}</td>
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
          {...stylex.props(s.more, s.modalClose)}
        >
          Close
        </button>
      </Modal>
      <Modal table open={features} onClose={() => setFeatures(false)} label="Features">
        <h2 {...stylex.props(s.modalTitle)}>Features</h2>
        <div {...stylex.props(s.modalScroll)}>
          <table {...stylex.props(s.table)}>
            <tbody>
              {v.features.map((feature) => (
                <tr key={feature} {...stylex.props(s.row)}>
                  <th
                    scope="row"
                    {...stylex.props(s.cell, s.modalCell, s.modalKey, s.featuresLabel)}
                  >
                    {feature}
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
          Close
        </button>
      </Modal>
    </div>
  );
}
