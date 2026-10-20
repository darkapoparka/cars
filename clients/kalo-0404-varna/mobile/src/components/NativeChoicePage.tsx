'use client';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { controls } from '@/styles/controls.stylex';
import { Header } from './Header';
import { Modal } from './ui';
import { BrandLogo } from './MakePicker';
const s = stylex.create({
  body: { overflowY: 'auto', flex: '1', padding: 16, backgroundColor: colors.panel },
  group: {
    fontSize: 16,
    lineHeight: '24px',
    fontWeight: 400,
    color: colors.muted,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    minHeight: 65,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.line,
    fontSize: 14,
    lineHeight: '20px',
    cursor: 'pointer',
  },
  brandRow: { gap: 12, paddingInline: 8 },
  radio: { color: colors.accent },
});
export type ChoiceGroup = { title?: string; options: string[] };
export function NativeChoicePage({
  title,
  groups,
  value,
  onChoose,
  onClose,
  brands = false,
}: {
  title: string;
  groups: ChoiceGroup[];
  value: string;
  onChoose: (value: string) => void;
  onClose: () => void;
  brands?: boolean;
}) {
  return (
    <Modal fullScreen open onClose={onClose}>
      <Header title={title} onBack={onClose} backIcon="close" />
      <div {...stylex.props(s.body)}>
        {groups.map((group, index) => (
          <section key={index}>
            {group.title && <h2 {...stylex.props(s.group)}>{group.title}</h2>}
            {group.options.map((option) => (
              <label key={option} {...stylex.props(s.row, brands && s.brandRow)}>
                {brands && <BrandLogo make={option} size={36} />}
                <input
                  type="radio"
                  name={title}
                  checked={value === option}
                  onChange={() => onChoose(option)}
                  {...stylex.props(controls.radio, s.radio)}
                />
                <span>{option}</span>
              </label>
            ))}
          </section>
        ))}
      </div>
    </Modal>
  );
}
