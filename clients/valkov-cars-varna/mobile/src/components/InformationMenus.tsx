'use client';
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { Button, CheckRow, Modal, ui } from './ui';
const s = stylex.create({
  body: { padding: 16, backgroundColor: colors.surface, minHeight: 'calc(100dvh - 60px)' },
  card: {
    paddingInline: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  row: {
    width: '100%',
    minHeight: 65,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    borderWidth: 0,
    borderBottomWidth: { default: 1, ':last-child': 0 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    color: colors.text,
    backgroundColor: 'transparent',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 500,
  },
  help: { paddingTop: 24 },
  actions: { display: 'flex', flexDirection: 'column', gap: 28, marginTop: 26 },
  hours: { fontSize: 12, lineHeight: '20px', paddingInline: 16, marginTop: 8 },
});
function ExternalIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M14 4h6v6M20 4l-9 9M10 5H5v15h15v-6" />
    </svg>
  );
}
export function InformationMenus({ section }: { section: 'legal' | 'company' | 'help' }) {
  const { consent } = useAppState();
  const [selected, setSelected] = useState('');
  const title =
    section === 'help' ? 'Feedback & Customer Service' : section === 'legal' ? 'Legal' : 'Company';
  const items =
    section === 'company'
      ? ['About us', 'Press', 'Careers', 'Sustainability', 'Advertisement', 'Help', 'Contact']
      : [
          'Imprint',
          'Terms & Conditions',
          'Withdraw Contract',
          'Privacy Policy',
          'Accessibility Statement',
          'Privacy Settings',
          'Licences',
          'Report a security vulnerability',
        ];
  return (
    <>
      <Header title={title} back="/profile" />
      <div {...stylex.props(s.body, section === 'help' && s.help)}>
        {section === 'help' ? (
          <>
            <div {...stylex.props(s.card)}>
              <button
                type="button"
                onClick={() => setSelected('Write us a message')}
                {...stylex.props(s.row)}
              >
                <span {...stylex.props(ui.muted)}>
                  <Icon name="mail" size={22} />
                </span>
                <span {...stylex.props(ui.grow)}>Write us a message</span>
                <span {...stylex.props(ui.muted)}>
                  <Icon name="right" size={22} />
                </span>
              </button>
            </div>
            <div {...stylex.props(s.actions)}>
              {['For private/commercial providers', 'For dealers', 'Report fraud'].map((label) => (
                <section key={label}>
                  <Button variant="purple" icon="phone" onClick={() => setSelected(label)} block>
                    {label}
                  </Button>
                  <p {...stylex.props(s.hours)}>
                    {label === 'Report fraud'
                      ? 'If you suspect fraud or misuse of your mobile.de account, you can reach our customer service daily from 8:00 a.m. to 6:00 p.m.'
                      : 'Monday to Friday from 8 am to 6 pm'}
                  </p>
                </section>
              ))}
            </div>
          </>
        ) : (
          <section {...stylex.props(s.card)}>
            {items.map((label) => (
              <button
                type="button"
                key={label}
                onClick={() => setSelected(label)}
                {...stylex.props(s.row)}
              >
                <span {...stylex.props(ui.grow)}>{label}</span>
                <span {...stylex.props(ui.muted)}>
                  {section === 'company' || label === 'Withdraw Contract' ? (
                    <ExternalIcon />
                  ) : (
                    <Icon name="right" size={22} />
                  )}
                </span>
              </button>
            ))}
          </section>
        )}
      </div>
      <Modal open={Boolean(selected)} onClose={() => setSelected('')} title={selected}>
        <div {...stylex.props(ui.column)}>
          <p>
            This is an independent local reconstruction of the Android interface, not the mobile.de
            service.
          </p>
          {selected === 'Privacy Settings' || selected === 'Privacy Policy' ? (
            <>
              <p>
                Parked vehicles, filters, saved searches and message drafts remain in this browser.
                No advertising trackers, calls, account credentials or seller enquiries are
                transmitted.
              </p>
              <CheckRow checked={consent} onChange={(value) => patchState({ consent: value })}>
                I have read the local-storage notice
              </CheckRow>
            </>
          ) : selected === 'Licences' ? (
            <p>
              The implementation uses Next.js, React and StyleX. Captured reference artwork is kept
              separately from application code and is not licensed for third-party commercial
              redistribution by this demo.
            </p>
          ) : (
            <p>
              The original app opens an external service or document here. That service is not
              connected in this local reference; no request has been submitted.
            </p>
          )}
          <Button onClick={() => setSelected('')} block>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
