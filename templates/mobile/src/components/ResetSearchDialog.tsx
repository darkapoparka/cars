'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { resetFilters } from '@/lib/store';
import { Modal } from './ui';
const s = stylex.create({
  copy: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 },
  action: {
    height: 48,
    paddingInline: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: colors.accent,
    fontSize: 14,
    fontWeight: 500,
  },
});
export function ResetSearchDialog({
  open,
  onClose,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  onReset?: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Reset">
      <p {...stylex.props(s.copy)}>Do you want to reset all search criteria?</p>
      <div {...stylex.props(s.actions)}>
        <button type="button" onClick={onClose} {...stylex.props(s.action)}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            resetFilters();
            onReset?.();
            onClose();
          }}
          {...stylex.props(s.action)}
        >
          Reset search
        </button>
      </div>
    </Modal>
  );
}
