'use client';
import { useLocale } from '@/lib/use-locale';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { searchShowroomServices, showroomServices } from '@/lib/showroom-services';
import { colors } from '@/styles/tokens.stylex';
import { ShowroomSearchField } from './ShowroomSearch';
import { Button, IconButton, Modal } from './ui';

const s = stylex.create({
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: { default: 8, '@media (max-width: 699px)': 0 },
    paddingInline: 12,
    paddingTop: 'max(8px, env(safe-area-inset-top))',
    paddingBottom: 8,
    flexShrink: 0,
  },
  title: {
    fontSize: { default: 20, '@media (max-width: 699px)': 16 },
    lineHeight: { default: '28px', '@media (max-width: 699px)': '24px' },
    fontWeight: { default: 600, '@media (max-width: 699px)': 400 },
    flexGrow: { default: 0, '@media (max-width: 699px)': 1 },
    paddingRight: { default: 0, '@media (max-width: 699px)': 48 },
    textAlign: { default: 'left', '@media (max-width: 699px)': 'center' },
    minWidth: 0,
  },
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
    borderRadius: controlShape.option,
    textAlign: 'left',
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    color: colors.text,
    outlineColor: colors.accent,
    fontSize: { default: 15, '@media (max-width: 699px)': 16 },
    fontWeight: 500,
    lineHeight: { default: '22px', '@media (max-width: 699px)': '24px' },
    overflowWrap: 'anywhere',
  },
  icon: { color: colors.muted, flexShrink: 0 },
  apply: {
    minHeight: { default: 48, '@media (max-width: 699px)': 44 },
    paddingBlock: { default: 10, '@media (max-width: 699px)': 0 },
    borderRadius: controlShape.pill,
  },
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
  const { t } = useLocale();
  const [draft, setDraft] = useState(value);
  const matches = searchShowroomServices(showroomServices, draft);
  return (
    <Modal open onClose={onClose} label={t('Search services')} flowSheet>
      <div {...stylex.props(s.heading)}>
        <IconButton icon="close" label={t('Close service search')} onClick={onClose} />
        <h2 {...stylex.props(s.title)}>{t('Search services')}</h2>
      </div>
      <div data-service-search-body {...stylex.props(s.body)}>
        <ShowroomSearchField
          label={t('Search services')}
          value={draft}
          onChange={setDraft}
          onSubmit={() => onApply(draft)}
          autoFocus
        />
        <div {...stylex.props(s.list)}>
          <h3 {...stylex.props(s.copy)}>
            {draft.trim() ? t('Matching services') : t('Browse services')}
          </h3>
          {matches.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onApply(t(service.title))}
              {...stylex.props(s.choice)}
            >
              {t(service.title)}
              <ChevronRight size={16} strokeWidth={1.8} aria-hidden {...stylex.props(s.icon)} />
            </button>
          ))}
          {!matches.length && (
            <p {...stylex.props(s.copy)}>{t('Try another word or browse all services.')}</p>
          )}
        </div>
      </div>
      <div data-service-search-footer {...stylex.props(s.footer)}>
        <Button block floating xstyle={s.apply} onClick={() => onApply(draft)}>
          <span aria-live="polite" aria-atomic="true">
            {t('Show ')}
            {matches.length} {matches.length === 1 ? t('service') : t('services')}
          </span>
        </Button>
      </div>
    </Modal>
  );
}
