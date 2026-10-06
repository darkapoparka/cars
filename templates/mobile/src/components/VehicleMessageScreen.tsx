'use client';
import { useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import type { Vehicle } from '@/lib/types';
import { saveMessageDraft, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { Button, Modal, ui } from './ui';
import { EnquiryEditor } from './EnquiryEditor';
import { enquirySummary, type EnquiryKind, type EnquiryFields } from '@/lib/enquiry';
const s = stylex.create({
  to: {
    minHeight: 68,
    padding: 16,
    paddingBlock: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 16,
    fontWeight: 700,
  },
  logo: { width: 48, height: 48, objectFit: 'contain' },
  form: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: {
      default: 110,
      '@media (max-width: 699px)': 'max(18px, env(safe-area-inset-bottom))',
    },
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  input: {
    height: 44,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    fontWeight: 400,
    paddingInline: 12,
  },
  textarea: {
    height: 126,
    width: '100%',
    resize: 'none',
    minHeight: 126,
    padding: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 8,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: { default: 14, '@media (max-width: 699px)': 16 },
    lineHeight: { default: '17px', '@media (max-width: 699px)': '24px' },
    fontWeight: 400,
  },
  pair: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 },
  phone: { marginTop: 4 },
  requests: { marginTop: -8 },
  new: {
    display: 'inline-block',
    fontSize: 12,
    lineHeight: '20px',
    fontWeight: 700,
    fontStyle: 'italic',
    backgroundColor: '#495f99',
    color: '#fff',
    paddingInline: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  requestHeading: { fontSize: 14, fontWeight: 700, marginBottom: 0 },
  toggleRow: {
    minHeight: 72,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    borderBottomWidth: 0,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    paddingInline: 4,
  },
  request: { flex: '1', fontSize: 14, lineHeight: '20px' },
  requestTitle: { fontWeight: 500 },
  requestBlock: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  inputAction: {
    height: 48,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 700,
    color: colors.purple,
  },
  summary: { fontSize: 14, lineHeight: '20px', color: colors.muted, paddingBottom: 8 },
  switch: {
    width: 52,
    height: 32,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#818592',
    borderRadius: 20,
    backgroundColor: colors.background,
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  on: {
    borderColor: colors.deepPurple,
    backgroundColor: colors.deepPurple,
    justifyContent: 'flex-end',
  },
  dot: { width: 16, height: 16, borderRadius: '50%', backgroundColor: '#818592' },
  dotOn: { backgroundColor: '#fff' },
  footer: {
    position: { default: 'fixed', '@media (max-width: 699px)': 'static' },
    bottom: 0,
    left: { default: '50%', '@media (max-width: 699px)': 'auto' },
    transform: { default: 'translateX(-50%)', '@media (max-width: 699px)': 'none' },
    maxWidth: 1100,
    width: '100%',
    paddingInline: { default: 16, '@media (max-width: 699px)': 0 },
    paddingTop: { default: 6, '@media (max-width: 699px)': 0 },
    paddingBottom: {
      default: 'calc(18px + env(safe-area-inset-bottom))',
      '@media (max-width: 699px)': 0,
    },
    backgroundColor: colors.background,
    zIndex: 30,
  },
  action: {
    minHeight: 44,
    paddingBlock: { default: 10, '@media (max-width: 699px)': 8 },
    borderRadius: { default: 8, '@media (max-width: 699px)': 22 },
  },
  consent: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.stripe,
    fontSize: 12,
    lineHeight: '20px',
  },
  note: { fontSize: 12, lineHeight: '20px', color: colors.muted },
});
const defaultMessage =
  'Dear Sir/Madam,\n\nI am interested in your offer.\nPlease contact me.\n\nKind regards';
export function VehicleMessageScreen({ vehicle: v }: { vehicle: Vehicle }) {
  const { messageDrafts } = useAppState();
  const [editedMessage, setMessage] = useState<string | null>(null);
  const message = editedMessage ?? messageDrafts[v.id] ?? defaultMessage;
  const [requests, setRequests] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [details, setDetails] = useState<EnquiryKind | null>(null);
  const [entered, setEntered] = useState<Partial<Record<EnquiryKind, EnquiryFields>>>({});
  function toggle(id: string) {
    setRequests((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }
  const requestOptions = [
    ['Financing', ''],
    ['Leasing', 'You can find out the leasing details from the dealer'],
    ['Trade-in', 'Make • Model • First registration • Mileage'],
    ['Onsite visit', 'Date • Time'],
    ...(v.id === 'bmw-540' ? [['Delivery', 'Zip • City']] : []),
  ];
  return (
    <>
      <Header title="Message" back={'/vehicle/' + v.id} />
      <div {...stylex.props(s.to)}>
        {v.id === 'bmw-x6' ? (
          <Image
            src="/images/dealer-hofmann.webp"
            width={48}
            height={48}
            alt=""
            {...stylex.props(s.logo)}
          />
        ) : (
          <Icon name="building" size={48} />
        )}
        <span>To: {v.dealer}</span>
      </div>
      <form
        id="vehicle-message-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(saveMessageDraft(v.id, message));
        }}
        {...stylex.props(s.form)}
      >
        <label {...stylex.props(s.label)}>
          Your Message
          <textarea
            aria-label="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minLength={10}
            maxLength={4000}
            required
            {...stylex.props(s.textarea)}
          />
        </label>
        <div {...stylex.props(s.pair)}>
          <label {...stylex.props(s.label)}>
            Title
            <select aria-label="Title" defaultValue="" {...stylex.props(ui.input, s.input)}>
              <option value="">e.g. Mr</option>
              <option>Mr</option>
              <option>Ms</option>
              <option>Other</option>
            </select>
          </label>
          <label {...stylex.props(s.label)}>
            First name
            <input
              aria-label="First name"
              placeholder="e.g. Alex"
              autoComplete="off"
              {...stylex.props(ui.input, s.input)}
            />
          </label>
        </div>
        <label {...stylex.props(s.label)}>
          Last name
          <input
            aria-label="Last name"
            placeholder="e.g. Schmidt"
            autoComplete="off"
            {...stylex.props(ui.input, s.input)}
          />
        </label>
        <label {...stylex.props(s.label)}>
          E-mail
          <input
            aria-label="E-mail"
            type="email"
            placeholder="e.g. alex.schmidt@email.com"
            autoComplete="off"
            {...stylex.props(ui.input, s.input)}
          />
        </label>
        <div {...stylex.props(s.pair, s.phone)}>
          <label {...stylex.props(s.label)}>
            Country code
            <select
              aria-label="Country code"
              defaultValue="+49"
              {...stylex.props(ui.input, s.input)}
            >
              {['+49', '+43', '+359', '+33', '+44', '+39', '+31', '+48', '+34', '+41'].map(
                (code) => (
                  <option key={code}>{code}</option>
                ),
              )}
            </select>
          </label>
          <label {...stylex.props(s.label)}>
            Phone number (optional)
            <input
              aria-label="Phone number (optional)"
              type="tel"
              placeholder="e.g. 17289039300"
              autoComplete="off"
              {...stylex.props(ui.input, s.input)}
            />
          </label>
        </div>
        <section {...stylex.props(s.requests)}>
          <h2 {...stylex.props(s.requestHeading)}>
            <span {...stylex.props(s.new)}>NEW</span>Request without obligation:
          </h2>
          {requestOptions.map(([id, hint]) => {
            const editable = (['Trade-in', 'Onsite visit', 'Delivery'] as const).find(
              (value) => value === id,
            );
            const value = editable ? entered[editable] : undefined;
            return (
              <div key={id} {...stylex.props(s.requestBlock)}>
                <div {...stylex.props(s.toggleRow)}>
                  <div {...stylex.props(s.request)}>
                    <p {...stylex.props(s.requestTitle)}>{id}</p>
                    {hint && <p {...stylex.props(ui.muted)}>{hint}</p>}
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-label={'Select ' + id}
                    aria-checked={requests.includes(id)}
                    onClick={() => toggle(id)}
                    {...stylex.props(s.switch, requests.includes(id) && s.on)}
                  >
                    <span {...stylex.props(s.dot, requests.includes(id) && s.dotOn)} />
                  </button>
                </div>
                {editable && requests.includes(id) && (
                  <>
                    {value && <p {...stylex.props(s.summary)}>{enquirySummary(editable, value)}</p>}
                    <button
                      type="button"
                      aria-label={'Open ' + id.toLowerCase() + ' input'}
                      onClick={() => setDetails(editable)}
                      {...stylex.props(s.inputAction)}
                    >
                      {value ? 'Edit' : 'Input'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </section>
        <section {...stylex.props(s.consent)}>
          <strong>Local UI reference — nothing is sent</strong>
          <p>
            The message body is saved only in this browser. Names, e-mail addresses, phone numbers
            and request preferences are not stored or transmitted.
          </p>
        </section>
        <p {...stylex.props(s.note)}>
          This form reproduces the captured seller-enquiry interface. The Send action saves a local
          message draft; it does not contact the dealer. Do not enter private information.
        </p>
        <div data-message-actions {...stylex.props(s.footer)}>
          <Button icon="send" type="submit" block xstyle={s.action}>
            Send
          </Button>
        </div>
      </form>
      <Modal open={sent} onClose={() => setSent(false)} title="Local draft saved">
        <div {...stylex.props(ui.column)}>
          <p>
            No message was sent and no personal contact details were stored. Your message draft is
            available under Messages.
          </p>
          <Button href="/messages" variant="purple" block>
            View message drafts
          </Button>
          <Button variant="ghost" onClick={() => setSent(false)} block>
            Close
          </Button>
        </div>
      </Modal>
      {details && (
        <EnquiryEditor
          key={details}
          kind={details}
          initial={entered[details] || {}}
          vehicle={v}
          onClose={() => setDetails(null)}
          onApply={(values) => {
            setEntered((current) => ({ ...current, [details]: values }));
            setDetails(null);
          }}
        />
      )}
    </>
  );
}
