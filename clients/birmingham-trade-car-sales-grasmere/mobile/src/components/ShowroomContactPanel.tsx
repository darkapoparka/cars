'use client';

import * as stylex from '@stylexjs/stylex';
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { showroom, showroomContactLocation, showroomPreviewPhone } from '@/lib/showroom';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';

const s = stylex.create({
  panel: {
    display: { default: 'none', '@media (min-width: 1024px)': 'flex' },
    flexDirection: 'column',
    height: 'auto',
    minWidth: 0,
  },
  map: {
    width: '100%',
    aspectRatio: '2 / 1',
    minHeight: 180,
    position: 'relative',
    backgroundColor: colors.stripe,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.cardLine,
  },
  frame: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexGrow: 1,
    gap: 12,
    padding: 20,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  title: {
    flex: '1 1 140px',
    minWidth: 0,
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  icon: { color: colors.muted, flexShrink: 0, marginTop: 1 },
  address: { fontStyle: 'normal', overflowWrap: 'anywhere' },
  note: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: '18px',
  },
  contacts: { display: 'flex', flexDirection: 'column', gap: 8, width: '100%' },
  contact: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    color: colors.text,
    minHeight: 44,
    width: '100%',
    textDecoration: 'none',
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 400,
    overflowWrap: 'anywhere',
    outlineColor: colors.accent,
    outlineOffset: 3,
  },
  contactText: { minWidth: 0 },
  hours: { display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%' },
  hoursText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: '20px',
  },
  actions: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 'auto' },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    flexShrink: 0,
    padding: 0,
    textDecoration: 'none',
    color: colors.text,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    outlineColor: colors.accent,
    outlineOffset: 2,
  },
  face: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingBlock: 7,
    paddingInline: 12,
    borderRadius: 18,
    backgroundColor: { default: colors.stripe, ':hover': colors.controlSurface },
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
  },
});

function ContactRow({ href, children }: { href?: string; children: ReactNode }) {
  return href ? (
    <a href={href} {...stylex.props(s.contact)}>
      {children}
    </a>
  ) : (
    <div {...stylex.props(s.contact)}>{children}</div>
  );
}

export function ShowroomContactPanel() {
  const { t, locale } = useLocale();
  const location = showroomContactLocation(locale);
  const phone = showroom.phone || (showroom.contactPreview ? showroomPreviewPhone : null);
  const examplePhone = !showroom.phone && Boolean(phone);
  return (
    <div data-showroom-contact-panel {...stylex.props(s.panel)}>
      {location.embedUrl && (
        <div data-showroom-contact-map {...stylex.props(s.map)}>
          <iframe
            src={location.embedUrl}
            title={t('Showroom map')}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            {...stylex.props(s.frame)}
          />
        </div>
      )}
      <div {...stylex.props(s.body)}>
        <div {...stylex.props(s.header)}>
          <h2 {...stylex.props(s.title)}>{t(showroom.name)}</h2>
          {location.directionsUrl && (
            <a
              href={location.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(s.link)}
            >
              <span {...stylex.props(s.face)}>
                {t(location.preview ? 'View on map' : 'Get directions')}
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
          )}
        </div>
        <div {...stylex.props(s.contacts)}>
          {location.address && (
            <ContactRow>
              <MapPin size={18} strokeWidth={1.6} aria-hidden="true" {...stylex.props(s.icon)} />
              <div {...stylex.props(s.contactText)}>
                <address {...stylex.props(s.address)}>{location.address}</address>
              </div>
            </ContactRow>
          )}
          {phone && (
            <ContactRow href={showroom.phone ? 'tel:' + showroom.phone : undefined}>
              <Phone size={18} strokeWidth={1.6} aria-hidden="true" {...stylex.props(s.icon)} />
              <div {...stylex.props(s.contactText)}>
                <p>{phone}</p>
                {examplePhone && <p {...stylex.props(s.note)}>{t('Example phone')}</p>}
              </div>
            </ContactRow>
          )}
          {showroom.email && (
            <a href={'mailto:' + showroom.email} {...stylex.props(s.contact)}>
              <Mail size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
              <span {...stylex.props(s.contactText)}>{showroom.email}</span>
            </a>
          )}
        </div>
        {showroom.hours.length > 0 && (
          <div {...stylex.props(s.hours)}>
            <Clock3 size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
            <div>
              <p {...stylex.props(s.address)}>{t('Opening hours')}</p>
              {showroom.hours.map((hours) => (
                <p key={hours} {...stylex.props(s.hoursText)}>
                  {hours}
                </p>
              ))}
            </div>
          </div>
        )}
        {showroom.socialLinks.length > 0 && (
          <div {...stylex.props(s.actions)}>
            {showroom.socialLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...stylex.props(s.link)}
              >
                <span {...stylex.props(s.face)}>
                  {label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
