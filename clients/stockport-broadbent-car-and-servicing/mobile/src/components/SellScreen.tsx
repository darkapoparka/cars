'use client';
import { useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Header } from './Header';
import { Button, IconButton } from './ui';
import { SellCategorySheet } from './SellCategorySheet';
const s = stylex.create({
  body: {
    backgroundColor: colors.surface,
    minHeight: 'calc(100dvh - 124px)',
    padding: 24,
    paddingTop: 16,
    paddingBottom: 96,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    overflow: 'hidden',
  },
  art: { width: '100%', height: 'auto', display: 'block' },
  content: { padding: 16 },
  title: {
    fontSize: 20,
    fontFamily: 'var(--font-hero)',
    fontWeight: 500,
    lineHeight: '28px',
    marginBottom: 4,
  },
  copy: { fontSize: 16, lineHeight: '24px', marginBottom: 20 },
  actions: { display: 'flex', flexDirection: 'column', gap: 12 },
  footer: {
    position: 'fixed',
    bottom: 'calc(64px + env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 1100,
    padding: 8,
    backgroundColor: colors.surface,
    zIndex: 35,
  },
});
export function SellScreen() {
  const [create, setCreate] = useState(false);
  return (
    <>
      <Header title="Sell">
        <IconButton icon="plus" label="Create new ad" onClick={() => setCreate(true)} />
      </Header>
      <div {...stylex.props(s.body)}>
        <section {...stylex.props(s.card)}>
          <Image
            src="/images/sell-valuation.webp"
            alt="Vehicle price estimation"
            width={1136}
            height={568}
            {...stylex.props(s.art)}
            priority
          />
          <div {...stylex.props(s.content)}>
            <h2 {...stylex.props(s.title)}>Free car valuation</h2>
            <p {...stylex.props(s.copy)}>
              Get a quick and <strong>free price estimation online</strong> based on current market
              data.
            </p>
            <Button href="/sell/valuation" variant="purple" icon="calculator" block>
              Evaluate price
            </Button>
          </div>
        </section>
        <section {...stylex.props(s.card, s.content)}>
          <h2 {...stylex.props(s.title)}>Sell your vehicle</h2>
          <p {...stylex.props(s.copy)}>
            To verified dealers in your area or via listing to over{' '}
            <strong>14 mio. potential buyers</strong> on Germany’s biggest vehicle marketplace.
          </p>
          <div {...stylex.props(s.actions)}>
            <Button href="/sell/direct" variant="outline" icon="timer" block>
              Direct sale
            </Button>
            <Button onClick={() => setCreate(true)} variant="outline" icon="tag" block>
              Create listing
            </Button>
          </div>
        </section>
      </div>
      <div {...stylex.props(s.footer)}>
        <Button href="/login" block>
          Login
        </Button>
      </div>
      <SellCategorySheet open={create} onClose={() => setCreate(false)} />
    </>
  );
}
