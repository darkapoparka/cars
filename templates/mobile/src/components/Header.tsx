'use client';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { IconButton } from './ui';
import type { IconName } from './Icon';
import { useAppState } from '@/lib/store';
const s = stylex.create({
  header: {
    height: 60,
    paddingBottom: 4,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    paddingInline: 0,
    gap: 4,
    backgroundColor: colors.background,
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    flex: '1',
    minWidth: 0,
    paddingInline: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  backTitle: { paddingInline: 8 },
  logo: { width: 124, height: 28, objectFit: 'contain' },
  home: { paddingLeft: 16, paddingRight: 0 },
  actions: { display: 'flex', alignItems: 'center', gap: 0 },
  logoLink: { display: 'flex', alignItems: 'center', flex: '1' },
  badge: {
    position: 'absolute',
    right: 9,
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 20,
    backgroundColor: colors.accent,
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: '16px',
  },
  relative: { position: 'relative' },
});
export function Header({
  title,
  back,
  children,
  home = false,
  onBack,
  backIcon = 'back',
}: {
  title?: string;
  back?: string;
  children?: ReactNode;
  home?: boolean;
  onBack?: () => void;
  backIcon?: IconName;
}) {
  const { readWelcome } = useAppState();
  return (
    <header {...stylex.props(s.header, home && s.home)}>
      {(back || onBack) && (
        <IconButton
          href={onBack ? undefined : back}
          onClick={onBack}
          icon={backIcon}
          label={backIcon === 'close' ? 'Close' : 'Go back'}
        />
      )}
      {home ? (
        <Link href="/" {...stylex.props(s.logoLink)} aria-label="mobile.de home">
          <Image
            src="/images/logo.png"
            alt="mobile.de"
            width={124}
            height={28}
            priority
            {...stylex.props(s.logo)}
          />
        </Link>
      ) : (
        <h1 {...stylex.props(s.title, Boolean(back || onBack) && s.backTitle)}>{title}</h1>
      )}
      {home ? (
        <div {...stylex.props(s.actions)}>
          <IconButton href="/messages" icon="message" label="Messages" />
          <span {...stylex.props(s.relative)}>
            <IconButton href="/notifications" icon="bell" label="Notifications" />
            {!readWelcome && <span {...stylex.props(s.badge)}>1</span>}
          </span>
          <IconButton href="/profile" icon="user" label="Profile" />
        </div>
      ) : (
        children
      )}
    </header>
  );
}
