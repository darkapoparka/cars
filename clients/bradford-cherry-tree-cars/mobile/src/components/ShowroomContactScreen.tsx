'use client';
import { useLocale } from '@/lib/use-locale';
import { useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { Vehicle } from '@/lib/types';
import { showroomVehiclePhotos } from '@/lib/vehicle-copy';
import { showroom, showroomPageContent } from '@/lib/showroom';
import { serviceCategoryHref, showroomService } from '@/lib/showroom-services';
import { saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { ShowroomBanner, ShowroomDrawer, ShowroomPageHero } from './ShowroomPageLayout';
import { ShowroomContactPanel } from './ShowroomContactPanel';
import { ShowroomContactBanner } from './ShowroomContactBanner';
import { ShowroomContactForm } from './ShowroomContactForm';
import { Button, ui } from './ui';
import { s } from './showroom-pages.stylex';

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
  const { t, locale, money } = useLocale();
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
                          image: showroomVehiclePhotos(vehicle)[0],
                          price: money(vehicle.price),
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
