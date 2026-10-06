'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import type { ShowroomContactDetails } from '@/lib/persistence';
import { useAppState } from '@/lib/store';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { ShowroomContactCards } from './ShowroomContactCards';
import { ShowroomContactIntro } from './ShowroomContactInfo';
import { Button } from './ui';

const emptyDetails: ShowroomContactDetails = { name: '', email: '', phone: '' };
const formId = 'showroom-mobile-enquiry';
const s = stylex.create({
  phone: {
    display: { default: 'flex', '@media (min-width: 700px)': 'none' },
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },
  card: {
    padding: 16,
    minWidth: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 20,
    backgroundColor: colors.background,
    boxShadow: '0 4px 16px rgba(27, 27, 33, 0.045)',
    scrollMarginTop: 24,
  },
  title: { fontSize: 18, lineHeight: '26px', fontWeight: 500, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 14, minWidth: 0 },
  contacts: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0,1fr)',
      '@media (min-width: 380px)': 'repeat(2,minmax(0,1fr))',
    },
    gap: 14,
    minWidth: 0,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
  },
  field: {
    width: '100%',
    minWidth: 0,
    minHeight: 48,
    paddingInline: 12,
    paddingBlock: 11,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':focus-visible': colors.text },
    borderRadius: 12,
    backgroundColor: colors.controlSurface,
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400,
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: 2,
    '::placeholder': { color: colors.muted, opacity: 1 },
  },
  message: { minHeight: 112, resize: 'vertical', scrollMarginBottom: 96 },
  context: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    minWidth: 0,
    marginBottom: 16,
    paddingInline: 12,
    paddingBlock: 8,
    borderRadius: 12,
    backgroundColor: colors.stripe,
  },
  contextTitle: {
    flex: '1 1 140px',
    minWidth: 0,
    fontSize: 15,
    lineHeight: '22px',
    fontWeight: 500,
    overflowWrap: 'anywhere',
  },
  contextLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 44,
    color: colors.accent,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    textDecoration: 'none',
  },
  footer: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 },
  submit: {
    width: '100%',
    minHeight: 48,
    borderRadius: 24,
    paddingInline: 16,
    paddingBlock: 10,
    fontWeight: 500,
    scrollMarginBottom: 96,
  },
  note: { fontSize: 12, lineHeight: '18px', color: colors.muted, textAlign: 'center' },
  status: { fontSize: 14, lineHeight: '22px', color: colors.muted, overflowWrap: 'anywhere' },
});

export function ShowroomContactForm({
  draftKey,
  message,
  onMessageChange,
  onEdit,
  onSave,
  saveStatus,
  context,
}: {
  draftKey: string;
  message: string;
  onMessageChange: (value: string) => void;
  onEdit: () => void;
  onSave: (details: ShowroomContactDetails) => void;
  saveStatus: 'saved' | 'unavailable' | null;
  context?: { title: string; href: string; linkLabel: string };
}) {
  const { t } = useLocale();
  const params = useSearchParams();
  const { showroomContactDetails } = useAppState();
  const [editedDetails, setEditedDetails] = useState<ShowroomContactDetails | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const details = editedDetails ?? showroomContactDetails[draftKey] ?? emptyDetails;
  const requested = params.get('enquiry') === '1';

  useEffect(() => {
    if (!requested || !window.matchMedia('(max-width: 699px)').matches) return;
    messageRef.current?.focus();
    const url = new URL(window.location.href);
    url.searchParams.delete('enquiry');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }, [requested]);

  function focusMessage() {
    const field = messageRef.current;
    field?.focus({ preventScroll: true });
    field?.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  function field(
    key: keyof ShowroomContactDetails,
    label: string,
    type: string,
    autoComplete: string,
  ) {
    return (
      <label {...stylex.props(s.label)}>
        {t(label)}
        <input
          name={key}
          type={type}
          autoComplete={autoComplete}
          maxLength={key === 'email' ? 254 : key === 'name' ? 80 : 60}
          value={details[key]}
          onChange={(event) => {
            const value = event.target.value;
            setEditedDetails((current) => ({ ...(current ?? details), [key]: value }));
          }}
          {...stylex.props(s.field)}
        />
      </label>
    );
  }

  return (
    <div data-contact-enquiry-entry {...stylex.props(s.phone)}>
      <ShowroomContactIntro />
      <ShowroomContactCards formId={formId} onWrite={focusMessage} />
      <section
        id={formId}
        data-contact-inline-form
        aria-labelledby={formId + '-heading'}
        {...stylex.props(s.card)}
      >
        <h2 id={formId + '-heading'} {...stylex.props(s.title)}>
          {t('Enquiry')}
        </h2>
        {context && (
          <div {...stylex.props(s.context)}>
            <p {...stylex.props(s.contextTitle)}>{context.title}</p>
            <Link href={context.href} {...stylex.props(s.contextLink)}>
              {t(context.linkLabel)}
            </Link>
          </div>
        )}
        <form
          aria-label={t('Enquiry')}
          {...stylex.props(s.form)}
          onChange={onEdit}
          onSubmit={(event) => {
            event.preventDefault();
            onSave(details);
          }}
        >
          {field('name', 'Name', 'text', 'name')}
          <div {...stylex.props(s.contacts)}>
            {field('phone', 'Phone', 'tel', 'tel')}
            {field('email', 'Email', 'email', 'email')}
          </div>
          <label {...stylex.props(s.label)}>
            {t('Message')}
            <textarea
              ref={messageRef}
              name="message"
              aria-label={t('Enquiry message')}
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              placeholder={t(
                context?.linkLabel === 'View car'
                  ? 'Ask about availability or a viewing…'
                  : 'Tell us how we can help…',
              )}
              required
              minLength={10}
              maxLength={4000}
              {...stylex.props(s.field, s.message)}
            />
          </label>
          <div {...stylex.props(s.footer)}>
            <Button type="submit" floating xstyle={s.submit}>
              {t('Save enquiry draft')}
            </Button>
            <p {...stylex.props(s.note)}>{t('Local draft only. Nothing is sent.')}</p>
          </div>
          {saveStatus && (
            <p role="status" {...stylex.props(s.status)}>
              {t(
                saveStatus === 'saved'
                  ? 'Message saved as a local draft. Nothing was sent.'
                  : 'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.',
              )}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
