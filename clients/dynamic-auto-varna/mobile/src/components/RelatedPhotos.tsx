'use client';
import { useState } from 'react';
import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { Button, Modal, ui } from './ui';
const s = stylex.create({
  section: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    marginTop: 18,
    marginInline: -16,
    marginBottom: -16,
    padding: 16,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 14, fontWeight: 500, lineHeight: '20px' },
  strip: { display: 'flex', gap: 8, overflowX: 'auto', marginTop: 8, scrollbarWidth: 'none' },
  item: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: 96,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: { width: 96, height: 72, objectFit: 'cover' },
  preview: { width: '100%', height: 'auto', borderRadius: 8 },
});
export function RelatedPhotos() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <>
      <section {...stylex.props(s.section)} aria-label="Similar vehicles from this seller">
        <h4 {...stylex.props(s.title)}>Similar vehicles from this seller</h4>
        <div {...stylex.props(s.strip)}>
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={'Preview related vehicle ' + i}
              onClick={() => setSelected(i)}
              {...stylex.props(s.item)}
            >
              <Image
                src={'/images/related-x6-' + i + '.webp'}
                alt={'Related vehicle photo ' + i}
                width={96}
                height={72}
                {...stylex.props(s.image)}
              />
            </button>
          ))}
        </div>
      </section>
      <Modal open={selected !== null} onClose={() => setSelected(null)} title="Related vehicle">
        <div {...stylex.props(ui.column)}>
          {selected !== null && (
            <Image
              src={'/images/related-x6-' + selected + '.webp'}
              alt="Captured related vehicle"
              width={288}
              height={216}
              {...stylex.props(s.preview)}
            />
          )}
          <p {...stylex.props(ui.small, ui.muted)}>
            Captured related-listing image. The corresponding live listing is not connected in this
            local reference.
          </p>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
