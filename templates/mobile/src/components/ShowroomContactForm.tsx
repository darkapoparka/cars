'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { ShowroomContactDetails } from '@/lib/persistence';
import { useAppState } from '@/lib/store';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { ShowroomContactArtwork, ShowroomContactCards } from './ShowroomContactCards';
import { ShowroomContactIntro } from './ShowroomContactInfo';
import { Button, IconButton, Modal } from './ui';

const emptyDetails: ShowroomContactDetails = { name: '', email: '', phone: '' };
const formId = 'showroom-mobile-enquiry';
const historyEntry = 'cars-showroom-enquiry';
const s = stylex.create({
  phone: {
    display: { default: 'flex', '@media (min-width: 700px)': 'none' },
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
  },
  entry: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
    padding: 16,
    minWidth: 0,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 20,
    backgroundColor: { default: colors.background, ':hover': colors.panel },
    color: colors.text,
    textAlign: 'left',
    boxShadow: '0 4px 16px rgba(27, 27, 33, 0.045)',
    outlineColor: colors.text,
    outlineOffset: 3,
    cursor: 'pointer',
  },
  entryHeader: { display: 'flex', alignItems: 'center', gap: 8 },
  entryTitle: { fontSize: 18, lineHeight: '26px', fontWeight: 500 },
  prompt: {
    position: 'relative',
    display: 'block',
    minHeight: 112,
    padding: 14,
    paddingRight: 54,
    borderRadius: 12,
    backgroundColor: colors.controlSurface,
    minWidth: 0,
  },
  preview: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
    overflowWrap: 'anywhere',
    color: colors.text,
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400,
  },
  placeholder: { color: colors.muted },
  promptArrow: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    color: colors.text,
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '48px minmax(0,1fr) 48px',
    alignItems: 'center',
    flexShrink: 0,
    paddingInline: 12,
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    paddingBottom: 8,
    minWidth: 0,
  },
  title: { fontSize: 16, lineHeight: '24px', fontWeight: 400, textAlign: 'center' },
  body: {
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    paddingInline: 16,
    paddingTop: 8,
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
  },
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
  message: { minHeight: 160, resize: 'vertical', scrollMarginBottom: 24 },
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
    scrollMarginBottom: 24,
  },
  note: { fontSize: 12, lineHeight: '18px', color: colors.muted, textAlign: 'center' },
  status: { fontSize: 14, lineHeight: '22px', color: colors.muted, overflowWrap: 'anywhere' },
});

function subscribePhone(listener: () => void) {
  const media = window.matchMedia('(max-width: 699px)');
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
function phoneSnapshot() {
  return window.matchMedia('(max-width: 699px)').matches;
}
function messageFocusTarget(field: HTMLTextAreaElement | null) {
  // Native dialog focus reads this attribute when showModal runs.
  if (field) field.autofocus = true;
}

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
  const phone = useSyncExternalStore(subscribePhone, phoneSnapshot, () => false);
  const open = phone && params.get('enquiry') === '1';
  const { showroomContactDetails } = useAppState();
  const [editedDetails, setEditedDetails] = useState<ShowroomContactDetails | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);
  const closing = useRef(false);
  const details = editedDetails ?? showroomContactDetails[draftKey] ?? emptyDetails;
  const placeholder = t(
    context?.linkLabel === 'View car'
      ? 'Ask about availability or a viewing…'
      : 'Tell us how we can help…',
  );

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    closing.current = false;
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const frame = requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function start(button: HTMLButtonElement) {
    openerRef.current = button;
    button.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    url.searchParams.set('enquiry', '1');
    window.history.pushState(
      { [historyEntry]: draftKey },
      '',
      url.pathname + url.search + url.hash,
    );
  }

  function close() {
    if (closing.current) return;
    closing.current = true;
    if (window.history.state?.[historyEntry] === draftKey) window.history.back();
    else {
      const url = new URL(window.location.href);
      url.searchParams.delete('enquiry');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
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
      <ShowroomContactCards enquiryOpen={open} onWrite={start} />
      <button
        data-contact-message-entry
        type="button"
        aria-label={t('Write a message')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? formId : undefined}
        onClick={(event) => start(event.currentTarget)}
        {...stylex.props(s.entry)}
      >
        <span {...stylex.props(s.entryHeader)}>
          <ShowroomContactArtwork name="enquiry" />
          <span {...stylex.props(s.entryTitle)}>{t('Message')}</span>
        </span>
        <span {...stylex.props(s.prompt)}>
          <span {...stylex.props(s.preview, !message.trim() && s.placeholder)}>
            {message.trim() || placeholder}
          </span>
          <span {...stylex.props(s.promptArrow)}>
            <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </span>
        </span>
      </button>
      <Modal open={open} onClose={close} label={t('Write to us')} flowSheet>
        <div {...stylex.props(s.header)}>
          <IconButton icon="close" label={t('Close enquiry')} onClick={close} />
          <h2 {...stylex.props(s.title)}>{t('Write to us')}</h2>
          <span aria-hidden="true" />
        </div>
        <div id={formId} data-contact-enquiry-body {...stylex.props(s.body)}>
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
            <label {...stylex.props(s.label)}>
              {t('Message')}
              <textarea
                ref={messageFocusTarget}
                name="message"
                aria-label={t('Enquiry message')}
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder={placeholder}
                required
                minLength={10}
                maxLength={4000}
                {...stylex.props(s.field, s.message)}
              />
            </label>
            {field('name', 'Name', 'text', 'name')}
            <div {...stylex.props(s.contacts)}>
              {field('phone', 'Phone', 'tel', 'tel')}
              {field('email', 'Email', 'email', 'email')}
            </div>
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
        </div>
      </Modal>
    </div>
  );
}
