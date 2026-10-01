'use client';
import { useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { patchState, useAppState } from '@/lib/store';
import { Header } from './Header';
import { Button, CheckRow, Modal, ui } from './ui';
import { Icon } from './Icon';
const s = stylex.create({
  background: { minHeight: 'calc(100dvh - 60px)', backgroundColor: colors.surface, padding: 16 },
  notification: {
    minHeight: 'calc(100dvh - 92px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingBottom: 0,
  },
  art: { width: 80, height: 88, objectFit: 'contain', marginBottom: 24 },
  title: {
    fontFamily: 'var(--font-base)',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: '28px',
    marginBottom: 8,
  },
  copy: { fontSize: 16, lineHeight: '24px', marginBottom: 20, maxWidth: 360 },
  card: {
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.background,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    fontSize: 14,
    lineHeight: '20px',
  },
  demo: { paddingBlock: 24, fontSize: 12, lineHeight: '20px', color: colors.muted },
});
export function NativeNotificationSettings() {
  const { notifications, theme } = useAppState();
  const [settings, setSettings] = useState(false);
  return (
    <>
      <Header title="Notifications" back="/profile" />
      <div {...stylex.props(s.background)}>
        <section {...stylex.props(s.notification)}>
          <Image
            src="/images/notification-bell.webp"
            width={80}
            height={88}
            alt=""
            {...stylex.props(s.art)}
          />
          <h2 {...stylex.props(s.title)}>Notifications {notifications ? 'active' : 'inactive'}</h2>
          <p {...stylex.props(s.copy)}>
            {notifications
              ? 'Notifications are active. You can deactivate them from System Settings.'
              : 'Notifications are inactive. You can activate them from System Settings.'}
          </p>
          <Button onClick={() => setSettings(true)} block>
            {notifications ? 'Deactivate' : 'Activate'} in System Settings
          </Button>
        </section>
        <p {...stylex.props(s.demo)}>
          Local reference preference, not browser push permission. No notification delivery is
          connected.
        </p>
      </div>
      <Modal
        open={settings}
        onClose={() => setSettings(false)}
        title="Local notification preferences"
      >
        <div {...stylex.props(ui.column)}>
          <p>
            Android System Settings cannot be opened from this web reference. These preferences
            apply only to the local demo.
          </p>
          <CheckRow
            checked={notifications}
            onChange={(value) => patchState({ notifications: value })}
          >
            New offers and price changes
          </CheckRow>
          <CheckRow
            checked={theme === 'dark'}
            onChange={(dark) => patchState({ theme: dark ? 'dark' : 'light' })}
          >
            Dark appearance
          </CheckRow>
          <Button onClick={() => setSettings(false)} block>
            Done
          </Button>
        </div>
      </Modal>
    </>
  );
}
export function NativeLanguageSettings() {
  const [settings, setSettings] = useState(false);
  return (
    <>
      <Header title="Language" back="/profile" />
      <div {...stylex.props(s.background)}>
        <section {...stylex.props(s.card)}>
          <p>
            The app follows your device&apos;s language settings. Changes take effect after
            restarting the app.
          </p>
          <div {...stylex.props(ui.row)}>
            <Icon name="info" size={22} />
            <p>
              Supported languages: <strong>English, German</strong>
            </p>
          </div>
          <p>You can also set the language just for this app.</p>
          <Button icon="settings" onClick={() => setSettings(true)} block>
            Open Language Settings
          </Button>
        </section>
      </div>
      <Modal open={settings} onClose={() => setSettings(false)} title="Language Settings">
        <div {...stylex.props(ui.column)}>
          <p>
            The native app delegates this screen to Android. This browser reconstruction currently
            follows the captured English reference; German content has not been reconstructed.
          </p>
          <Button onClick={() => setSettings(false)} block>
            Keep English
          </Button>
        </div>
      </Modal>
    </>
  );
}
