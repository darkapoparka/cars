'use client';
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {useCopy} from '@/lib/locale';
import {filterPaneStyles as s} from './filter-pane.stylex';

export default function FilterCheckRow({label, checked, onChange, radio, large = false, multiline = false, count}: {label: ReactNode; checked: boolean; onChange: () => void; radio?: string; large?: boolean; multiline?: boolean; count?: number}) {
  const tx = useCopy();

  return <label {...stylex.props(s.option, large && s.optionLarge, multiline && s.optionMultiline, checked && s.optionSelected)}><input type={radio ? 'radio' : 'checkbox'} className={radio ? 'cars24-filter-radio' : 'cars24-filter-checkbox'} name={radio} checked={checked} onChange={onChange} /><span {...stylex.props(s.optionLabel)}>{tx(label)}</span>{count !== undefined ? <span aria-hidden="true" title={`${count} ${tx(count === 1 ? 'car' : 'cars')}`} {...stylex.props(s.stockCount)}>{count}</span> : null}</label>;
}
