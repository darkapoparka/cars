'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { searchShowroomServices, showroomServices } from '@/lib/showroom-services';
import { colors } from '@/styles/tokens.stylex';
import { ShowroomSearchField } from './ShowroomSearch';
import { Button, IconButton, Modal } from './ui';

const s = stylex.create({
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingInline: 12,
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    paddingBottom: 8,
    flexShrink: 0,
  },
  title: { fontSize: 20, lineHeight: '28px', fontWeight: 600, minWidth: 0 },
  body: {
    flex: '1',
    minHeight: 0,
    minWidth: 0,
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 4 },
  copy: { color: colors.muted, fontSize: 14, lineHeight: '22px' },
  choice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 48,
    minWidth: 0,
    paddingBlock: 10,
    paddingInline: 12,
    borderWidth: 0,
    borderRadius: 12,
    textAlign: 'left',
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    outlineColor: colors.accent,
    fontSize: 15,
    fontWeight: 500,
    lineHeight: '22px',
    overflowWrap: 'anywhere',
  },
  icon: { color: colors.muted, flexShrink: 0 },
  footer: {
    flexShrink: 0,
    paddingInline: 16,
    paddingTop: 12,
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.line,
    backgroundColor: colors.background,
  },
});

export function ShowroomServiceSearchSheet({
  value,
  onApply,
  onClose,
}: {
  value: string;
  onApply: (query: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const matches = searchShowroomServices(showroomServices, draft);
  return (
    <Modal open onClose={onClose} label="Search services" flowSheet>
      <div {...stylex.props(s.heading)}>
        <IconButton icon="close" label="Close service search" onClick={onClose} />
        <h2 {...stylex.props(s.title)}>Search services</h2>
      </div>
      <div data-service-search-body {...stylex.props(s.body)}>
        <ShowroomSearchField
          label="Search services"
          value={draft}
          onChange={setDraft}
          onSubmit={() => onApply(draft)}
          autoFocus
        />
        <div {...stylex.props(s.list)}>
          <h3 {...stylex.props(s.copy)}>
            {draft.trim() ? 'Matching services' : 'Browse services'}
          </h3>
          {matches.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onApply(service.title)}
              {...stylex.props(s.choice)}
            >
              {service.title}
              <ChevronRight size={16} strokeWidth={1.8} aria-hidden {...stylex.props(s.icon)} />
            </button>
          ))}
          {!matches.length && (
            <p {...stylex.props(s.copy)}>Try another word or browse all services.</p>
          )}
        </div>
      </div>
      <div data-service-search-footer {...stylex.props(s.footer)}>
        <Button block floating onClick={() => onApply(draft)}>
          <span aria-live="polite" aria-atomic="true">
            Show {matches.length} {matches.length === 1 ? 'service' : 'services'}
          </span>
        </Button>
      </div>
    </Modal>
  );
}
