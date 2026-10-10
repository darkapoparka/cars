'use client';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { MessageDrafts } from './MessageDrafts';
import { Icon, type IconName } from './Icon';
import { Button, CheckRow, ui } from './ui';
const s = stylex.create({
  body: {
    backgroundColor: colors.surface,
    minHeight: 'calc(100dvh - 60px)',
    padding: 16,
    paddingTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  welcome: {
    padding: 16,
    paddingBottom: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
    textAlign: 'center',
  },
  hello: { fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-base)', lineHeight: '28px' },
  subtitle: { fontSize: 16, lineHeight: '24px', marginBottom: 16 },
  group: { paddingInline: 0 },
  label: {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    color: colors.muted,
    marginBottom: 8,
    paddingInline: 16,
  },
  menu: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    paddingInline: 16,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    minHeight: 48,
    paddingBlock: 8,
    fontWeight: 500,
    borderWidth: 0,
    borderBottomWidth: { default: 1, ':last-child': 0 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    textDecoration: 'none',
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
  },
  version: { marginTop: -16, paddingInline: 16, fontSize: 12, color: colors.muted },
  message: {
    textAlign: 'center',
    padding: 32,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20,
  },
});
function Row({
  label,
  icon,
  href,
  onClick,
}: {
  label: string;
  icon?: IconName;
  href?: string;
  onClick?: () => void;
}) {
  const children = (
    <>
      {icon && (
        <span {...stylex.props(ui.muted)}>
          <Icon name={icon} size={24} />
        </span>
      )}
      <span {...stylex.props(ui.grow)}>{label}</span>
      <span {...stylex.props(ui.muted)}>
        <Icon name="right" size={24} />
      </span>
    </>
  );
  return href ? (
    <Link href={href} {...stylex.props(s.row)}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} {...stylex.props(s.row)}>
      {children}
    </button>
  );
}
function Menu({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section {...stylex.props(s.group)}>
      <h2 {...stylex.props(s.label)}>{title}</h2>
      <div {...stylex.props(s.menu)}>{children}</div>
    </section>
  );
}
export function ProfileScreen() {
  const { email } = useAppState();
  return (
    <>
      <Header title="My mobile.de" back="/" />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(s.welcome)}>
          <h2 {...stylex.props(s.hello)}>Hello!</h2>
          <p {...stylex.props(s.subtitle)}>
            {email ? 'Local demo profile' : 'Login or create an account!'}
          </p>
          {email ? (
            <Button variant="purple" onClick={() => patchState({ email: '' })} block>
              Log out of demo
            </Button>
          ) : (
            <Button href="/login" variant="purple" block>
              Login
            </Button>
          )}
        </section>
        <Menu title="My profile">
          <Row label="Notifications" icon="bell" href="/settings/notifications" />
          <Row label="Language" icon="globe" href="/settings/language" />
        </Menu>
        <Menu title="Buy">
          <Row label="My Searches" icon="searches" href="/my-searches" />
          <Row label="Car Park" icon="heart" href="/car-park" />
        </Menu>
        <Menu title="Miscellaneous">
          <Row label="Feedback & Customer Service" href="/help" />
          <Row label="Company" href="/company" />
          <Row label="Legal" href="/legal" />
        </Menu>
        <p {...stylex.props(s.version)}>v10.26 (1707) · Local reference</p>
      </div>
    </>
  );
}
export { NativeNotificationSettings as NotificationSettingsScreen } from './NativeSettings';
export function MessagesScreen() {
  const { messageDrafts } = useAppState();
  if (Object.keys(messageDrafts).length) return <MessageDrafts />;
  return (
    <>
      <Header title="Messages" back="/" />
      <div {...stylex.props(s.message)}>
        <Icon name="message" size={64} />
        <h2 {...stylex.props(ui.title)}>All your conversations in one place</h2>
        <p>Log in to see messages about your vehicles.</p>
        <Button href="/login" variant="purple" block>
          Login
        </Button>
        <p {...stylex.props(ui.small, ui.muted)}>
          This reference does not connect to real seller conversations.
        </p>
      </div>
    </>
  );
}
export function NotificationsScreen() {
  const [read, setRead] = useState(false);
  return (
    <>
      <Header title="Notifications" back="/" />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(ui.card, ui.column)}>
          <div {...stylex.props(ui.row)}>
            <Icon name="sparkles" size={32} />
            <h2 {...stylex.props(ui.title)}>Meet your AI Assistant</h2>
          </div>
          <p>Explore vehicles and compare the facts with mobee.</p>
          <Button href="/assistant" variant="purple" block>
            Discover mobee
          </Button>
          <Button variant="ghost" onClick={() => setRead(true)} disabled={read}>
            {read ? 'Read' : 'Mark as read'}
          </Button>
        </section>
        <Button href="/settings/notifications" variant="outline">
          Notification settings
        </Button>
      </div>
    </>
  );
}
export function InformationScreen({ section }: { section: 'legal' | 'company' | 'help' }) {
  const { consent } = useAppState();
  const title =
    section === 'legal'
      ? 'Legal'
      : section === 'company'
        ? 'Company'
        : 'Feedback & Customer Service';
  return (
    <>
      <Header title={title} back="/profile" />
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(ui.card, ui.column)}>
          <h2 {...stylex.props(ui.title)}>
            {section === 'company'
              ? 'About this reference'
              : section === 'help'
                ? 'Local reference support'
                : 'Privacy and legal information'}
          </h2>
          <p>
            This is an independent local reconstruction of the mobile.de Android interface. It is
            not operated by or affiliated with mobile.de.
          </p>
          <p>
            Vehicle information and artwork are captured demonstration fixtures. No listings,
            finance requests, messages or account credentials are sent to the marketplace.
          </p>
          {section === 'legal' ? (
            <>
              <h3>Local storage</h3>
              <p>
                Saved vehicles, search filters and demonstration preferences remain in this browser.
                No advertising or analytics trackers are loaded.
              </p>
              <CheckRow checked={consent} onChange={(value) => patchState({ consent: value })}>
                I have read the local-storage notice
              </CheckRow>
            </>
          ) : (
            <>
              <h3>Reference build</h3>
              <p>Android app version 10.26 (1707). Next.js 16 App Router, React and StyleX.</p>
              <Button href="/" variant="outline">
                Return home
              </Button>
            </>
          )}
        </section>
      </div>
    </>
  );
}
