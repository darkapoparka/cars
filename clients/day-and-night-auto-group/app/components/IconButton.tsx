'use client';

import * as stylex from '@stylexjs/stylex';
import type {StyleXStyles} from '@stylexjs/stylex';
import type {LucideIcon} from 'lucide-react';
import Link from '@/components/AppLink';
import {iconButtonStyles as s} from '@/components/icon-button.stylex';

export type IconButtonAction = {href: string; onClick?: never} | {href?: never; onClick: () => void};
export type IconButtonTone = 'neutral' | 'photo' | 'rail' | 'grey' | 'embedded';
type IconButtonProps = IconButtonAction & {icon: LucideIcon; label: string; tone?: IconButtonTone; layout?: StyleXStyles; selected?: boolean; count?: number; expanded?: boolean; pressed?: boolean; hasPopup?: 'dialog' | 'menu'; dataAttributes?: Record<`data-${string}`, string | number | boolean | undefined>};

/** Grey page actions; white photo actions retain contrast over imagery. */
export default function IconButton({icon: Icon, label, tone = 'neutral', layout, selected = false, count, expanded, pressed, hasPopup, dataAttributes, ...action}: IconButtonProps) {
  const content = <span data-icon-surface {...stylex.props(s.content, tone === 'photo' && s.photo, tone === 'grey' && s.grey, tone === 'embedded' && s.embedded, selected && s.selected)}><Icon aria-hidden="true" {...stylex.props(s.icon)}/>{count ? <span aria-hidden="true" {...stylex.props(s.badge)}>{count}</span> : null}</span>;
  const props = {...dataAttributes, ...stylex.props(s.button, layout)};
  return action.href !== undefined
    ? <Link data-icon-button data-icon-tone={tone} href={action.href} title={label} aria-label={label} aria-expanded={expanded} aria-pressed={pressed} aria-haspopup={hasPopup} {...props}>{content}</Link>
    : <button data-icon-button data-icon-tone={tone} type="button" onClick={action.onClick} title={label} aria-label={label} aria-expanded={expanded} aria-pressed={pressed} aria-haspopup={hasPopup} {...props}>{content}</button>;
}
