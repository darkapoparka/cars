'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { vehicles } from '@/lib/catalog';
import { capturedDealers } from '@/lib/dealers';
import { patchState, useAppState } from '@/lib/store';
import { colors } from '@/styles/tokens.stylex';
import { Icon } from './Icon';
import { Button, Modal, ui } from './ui';
const s = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 12, marginInline: -4, marginTop: -8 },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 16,
    minHeight: 92,
    padding: 16,
    paddingRight: 0,
  },
  link: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    flex: '1',
    minWidth: 0,
    color: colors.text,
    textDecoration: 'none',
  },
  logo: {
    width: 60,
    height: 44,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.line,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: 700, lineHeight: '20px' },
  location: { fontSize: 14, lineHeight: '20px' },
  menu: {
    width: 40,
    height: 44,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    fontSize: 24,
    flexShrink: 0,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.muted,
    margin: '4px auto 20px',
  },
  action: {
    minHeight: 56,
    width: '100%',
    paddingInline: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.text,
    textAlign: 'left',
    fontSize: 16,
  },
  empty: { textAlign: 'center', fontSize: 14, lineHeight: '28px' },
});
export function FollowedDealers() {
  const { dealers } = useAppState();
  const [menu, setMenu] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  if (!dealers.length)
    return <p {...stylex.props(s.empty)}>You aren’t currently following any dealer.</p>;
  return (
    <>
      <div {...stylex.props(s.list)}>
        {dealers.map((id) => {
          const vehicle = vehicles.find((item) => item.id === id);
          if (!vehicle) return null;
          const data = capturedDealers[id];
          return (
            <section key={id} {...stylex.props(s.card)}>
              <Link href={'/dealer/' + id} {...stylex.props(s.link)}>
                <span {...stylex.props(s.logo)}>
                  {data ? (
                    <Image src={data.logo} alt="" width={48} height={42} />
                  ) : (
                    <Icon name="building" size={32} />
                  )}
                </span>
                <span>
                  <h2 {...stylex.props(s.title)}>{vehicle.dealer}</h2>
                  <span {...stylex.props(s.location)}>
                    {data ? data.address.split('\n').at(-1) : vehicle.location}
                  </span>
                </span>
              </Link>
              <button
                type="button"
                aria-label={'Options for ' + vehicle.dealer}
                onClick={() => setMenu(id)}
                {...stylex.props(s.menu)}
              >
                ⋮
              </button>
            </section>
          );
        })}
      </div>
      <Modal open={menu !== null} onClose={() => setMenu(null)} sheet>
        <div {...stylex.props(s.handle)} />
        <button
          type="button"
          onClick={() => {
            setConfirm(menu);
            setMenu(null);
          }}
          {...stylex.props(s.action)}
        >
          Unfollow dealer
        </button>
      </Modal>
      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title="Unfollow dealer?">
        <div {...stylex.props(ui.column)}>
          <p>Are you sure you don’t want to follow this dealer anymore?</p>
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              patchState({ dealers: dealers.filter((id) => id !== confirm) });
              setConfirm(null);
            }}
          >
            Yes, unfollow
          </Button>
        </div>
      </Modal>
    </>
  );
}
