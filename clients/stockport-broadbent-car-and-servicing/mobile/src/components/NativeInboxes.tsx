'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { notify, patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, IconButton } from './ui';
import { MessageDrafts } from './MessageDrafts';
const s = stylex.create({
  empty: {
    minHeight: 'calc(100dvh - 60px)',
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    transform: 'translateY(-12px)',
  },
  art: { width: 96, height: 96, display: 'block' },
  title: {
    fontFamily: 'var(--font-base)',
    fontSize: 20,
    lineHeight: '28px',
    fontWeight: 700,
    marginTop: 16,
    width: 'calc(100% - 32px)',
  },
  copy: {
    fontSize: 16,
    lineHeight: '24px',
    color: colors.muted,
    marginTop: 16,
    width: 'calc(100% - 32px)',
  },
  login: { height: 48, width: '100%', display: 'flex', alignItems: 'center', marginTop: 40 },
  inbox: { backgroundColor: colors.surface, minHeight: 'calc(100dvh - 60px)' },
  dateGroup: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    color: colors.muted,
  },
  item: {
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background,
    color: colors.text,
    textDecoration: 'none',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  thumbnail: { width: 48, height: 48, flexShrink: 0 },
  subject: { fontSize: 16, lineHeight: '24px', fontWeight: 500 },
  body: { fontSize: 14, lineHeight: '20px', color: colors.muted, marginTop: 8 },
  date: { fontSize: 12, lineHeight: '20px', color: colors.muted, marginTop: 8 },
});
export function NativeMessages() {
  const { messageDrafts } = useAppState();
  if (Object.keys(messageDrafts).length) return <MessageDrafts />;
  return (
    <>
      <Header title="Messages" back="/" />
      <div {...stylex.props(s.empty)}>
        <div {...stylex.props(s.block)}>
          <Image
            src="/images/messages-empty.webp"
            alt=""
            width={96}
            height={96}
            {...stylex.props(s.art)}
          />
          <h2 {...stylex.props(s.title)}>Direct contact with buyers and potential customers</h2>
          <p {...stylex.props(s.copy)}>
            Use the app to securely and quickly write and receive messages.
          </p>
          <div {...stylex.props(s.login)}>
            <Button href="/login?next=/messages" block>
              Log In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export function NativeNotifications() {
  useEffect(() => {
    patchState({ readWelcome: true });
  }, []);
  return (
    <>
      <Header title="Notifications" back="/">
        <IconButton
          icon="refresh"
          label="Refresh"
          onClick={() => notify('Captured notification list is up to date')}
        />
      </Header>
      <div {...stylex.props(s.inbox)}>
        <h2 {...stylex.props(s.dateGroup)}>Yesterday</h2>
        <Link href="/search" {...stylex.props(s.item)}>
          <Image
            src="/images/welcome-notification.webp"
            alt=""
            width={48}
            height={48}
            {...stylex.props(s.thumbnail)}
          />
          <div>
            <h3 {...stylex.props(s.subject)}>Welcome to mobile.de 🚘</h3>
            <p {...stylex.props(s.body)}>
              Start your search now with our intelligent search filters!
            </p>
            <p {...stylex.props(s.date)}>Saturday, Sep 26, 2026</p>
          </div>
        </Link>
      </div>
    </>
  );
}
