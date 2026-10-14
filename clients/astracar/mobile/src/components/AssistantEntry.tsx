'use client';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { showroomDesktop } from '@/styles/showroom-desktop-tokens.stylex';
import { Icon } from './Icon';
import { Button, ui } from './ui';
const s = stylex.create({
  panel: {
    borderWidth: 2,
    borderColor: colors.purpleLine,
    borderStyle: 'solid',
    borderRadius: 12,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    backgroundColor: colors.assistant,
    borderRightColor: '#8fa8ec',
    fontSize: 14,
    lineHeight: '20px',
  },
  word: {
    fontFamily: 'var(--font-hero)',
    fontSize: 32,
    fontWeight: 700,
    lineHeight: '28px',
    color: colors.deepPurple,
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  beta: {
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 4,
    paddingBlock: 2,
    paddingInline: 4,
    color: '#fff',
    backgroundColor: '#495f99',
  },
  fab: {
    position: 'fixed',
    right: {
      default: 'max(16px, calc((100vw - 1100px) / 2 + 16px))',
      '@media (min-width: 1024px)': `max(calc(${showroomDesktop.viewportGutter} + 16px), calc((100vw - ${showroomDesktop.shellWidth}) / 2 + 16px))`,
    },
    bottom: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    height: 56,
    padding: 4,
    backgroundColor: '#350051',
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
    backgroundImage: 'linear-gradient(110deg,#903fa5,#80a6e6)',
    borderRadius: 17,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 5px 8px #0003',
    zIndex: 35,
  },
  floatingLow: { bottom: 0 },
  compact: { width: 56 },
  inner: {
    height: 48,
    borderRadius: 13,
    backgroundColor: '#350051',
    paddingInline: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  compactInner: { padding: 0 },
});
export function AssistantPanel({ detail = false }: { detail?: boolean }) {
  return (
    <section {...stylex.props(s.panel)}>
      <div {...stylex.props(ui.row)}>
        <span {...stylex.props(s.word)}>
          <Icon name="mobeeLogo" size={22} />
          mobee
        </span>
        <span {...stylex.props(s.beta)}>Beta</span>
      </div>
      <p>
        {detail
          ? 'All the facts at a glance. Your AI assistant mobee takes care of the analysis for you.'
          : 'Get the key insights on your search result in seconds. The AI-Guide mobee analyzes the important details so you don’t have to.'}
      </p>
      <Button href="/assistant" variant="purple" icon="sparkles" block>
        {detail ? 'Ask your AI Assistant' : 'Ask AI Assistant'}
      </Button>
    </section>
  );
}
export function AssistantFab({
  low = false,
  compact = false,
}: {
  low?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/assistant"
      aria-label="AI Assistant"
      {...stylex.props(s.fab, low && s.floatingLow, compact && s.compact)}
    >
      <span {...stylex.props(s.inner, compact && s.compactInner)}>
        <Icon name="sparkles" size={26} />
        {!compact && 'AI Assistant'}
      </span>
    </Link>
  );
}
