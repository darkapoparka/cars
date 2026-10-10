'use client';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Button, Modal } from './ui';
const s = stylex.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 0,
  },
  handle: {
    height: 4,
    width: 32,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginTop: 0,
    marginBottom: 32,
  },
  art: { width: 80, height: 80, color: colors.deepPurple, marginBottom: 12 },
  title: { fontFamily: 'var(--font-hero)', fontSize: 20, fontWeight: 500, lineHeight: '24px' },
  copy: { fontSize: 16, lineHeight: '24px', marginBottom: 20 },
  buttons: { width: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
});
export function AuthPrompt({
  open,
  onClose,
  next,
  title = 'Save your Searches',
  copy = 'Log in now and save as many searches as you like!',
}: {
  open: boolean;
  onClose: () => void;
  next: string;
  title?: string;
  copy?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} sheet nativeSheet>
      <div {...stylex.props(s.body)}>
        <div {...stylex.props(s.handle)} />
        <Image
          src="/images/save-search-art.webp"
          width={80}
          height={80}
          alt=""
          {...stylex.props(s.art)}
        />
        <h2 {...stylex.props(s.title)}>{title}</h2>
        <p {...stylex.props(s.copy)}>{copy}</p>
        <div {...stylex.props(s.buttons)}>
          <Button href={'/login?next=' + encodeURIComponent(next)} block>
            Log in now
          </Button>
          <Button
            href={'/login?register=true&next=' + encodeURIComponent(next)}
            variant="ghost"
            block
          >
            Register for free
          </Button>
        </div>
      </div>
    </Modal>
  );
}
