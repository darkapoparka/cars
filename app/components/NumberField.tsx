import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

/** Desktop fields keep their label and units visible while the value is edited. */
export default function NumberField({label, children, prefix, suffix, onDark = false, compact = false, inlineLabel = false}: {label: ReactNode; children: ReactNode; prefix?: ReactNode; suffix?: ReactNode; onDark?: boolean; compact?: boolean; inlineLabel?: boolean}) {
  return <span data-number-field data-number-field-layout={inlineLabel ? 'inline' : 'stacked'} {...stylex.props(s.field, onDark && s.onDark, compact && s.compact, inlineLabel && s.inlineField)}>
    <span {...stylex.props(s.caption, onDark && s.darkCaption, inlineLabel && s.inlineCaption)}>{label}</span>
    <span {...stylex.props(s.value, inlineLabel && s.inlineValue)}>{prefix ? <span aria-hidden="true" {...stylex.props(s.unit)}>{prefix}</span> : null}{children}{suffix ? <span aria-hidden="true" {...stylex.props(s.unit)}>{suffix}</span> : null}</span>
  </span>;
}

const s = stylex.create({
  field: {display: {[media.desktop]: 'flex', default: 'contents'}, flexDirection: 'column', justifyContent: 'center', gap: 2, minWidth: 0, height: 56, padding: '7px 12px', color: {[media.desktop]: $.ink, default: 'inherit'}, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 12, backgroundColor: $.surface, outline: {default: 'none', ':focus-within': {[media.desktop]: '2px solid #202024', default: 'none'}}, outlineOffset: 2},
  caption: {display: 'block', color: {[media.desktop]: $.muted, default: 'inherit'}, fontSize: {[media.desktop]: 12, default: 'inherit'}, fontWeight: {[media.desktop]: 400, default: 'inherit'}, lineHeight: {[media.desktop]: '16px', default: 'inherit'}},
  value: {display: {[media.desktop]: 'flex', default: 'contents'}, alignItems: 'center', gap: 6, minWidth: 0, fontFamily: $.fontSans, fontSize: {[media.desktop]: 16, default: 'inherit'}, fontWeight: {[media.desktop]: 400, default: 'inherit'}, lineHeight: {[media.desktop]: '24px', default: 'inherit'}},
  unit: {display: {[media.desktop]: 'inline', default: 'none'}, flexShrink: 0},
  onDark: {color: {[media.desktop]: '#fff', default: 'inherit'}, borderColor: '#505057', backgroundColor: '#38383d', outline: {default: 'none', ':focus-within': {[media.desktop]: '2px solid #fff', default: 'none'}}},
  darkCaption: {color: {[media.desktop]: '#d8d8de', default: 'inherit'}},
  compact: {height: 48, paddingBlock: 3},
  inlineField: {flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, padding: '9px 12px'},
  inlineCaption: {flexShrink: 0, fontSize: {[media.desktop]: 14, default: 'inherit'}, lineHeight: {[media.desktop]: '24px', default: 'inherit'}, whiteSpace: 'nowrap'},
  inlineValue: {flexGrow: 1},
});
