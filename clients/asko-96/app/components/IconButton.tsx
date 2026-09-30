'use client';

import * as stylex from '@stylexjs/stylex';
import type {LucideIcon} from 'lucide-react';
import Link from '@/components/AppLink';
import {tokens as $} from '@/app/tokens.stylex';

export type IconButtonAction = {href: string; onClick?: never} | {href?: never; onClick: () => void};
export type IconButtonTone = 'neutral' | 'photo';
type IconButtonProps = IconButtonAction & {icon: LucideIcon; label: string; tone?: IconButtonTone};

/** Shared icon geometry: compact visible surface inside a full touch target. */
export default function IconButton({icon: Icon, label, tone = 'neutral', ...action}: IconButtonProps) {
  const content = <span {...stylex.props(s.surface, tone === 'photo' && s.photo)}><Icon aria-hidden="true" {...stylex.props(s.icon)}/></span>;
  return action.href !== undefined
    ? <Link data-icon-button href={action.href} aria-label={label} {...stylex.props(s.control)}>{content}</Link>
    : <button data-icon-button type="button" onClick={action.onClick} aria-label={label} {...stylex.props(s.control)}>{content}</button>;
}

const s = stylex.create({
  control: {display: 'grid', placeItems: 'center', flexShrink: 0, width: $.controlHeight, height: $.controlHeight, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: 'transparent', outlineWidth: 2, outlineStyle: 'solid', outlineColor: {default: 'transparent', ':focus-visible': $.ink}, outlineOffset: 1, pointerEvents: 'auto', cursor: 'pointer'},
  surface: {display: 'grid', placeItems: 'center', width: $.controlCompactHeight, height: $.controlCompactHeight, borderRadius: '50%', backgroundColor: {default: $.surfaceAlt, ':hover': $.violetSoft}},
  photo: {backgroundColor: {default: $.surface, ':hover': $.surface}, boxShadow: '0 1px 6px rgba(0,0,0,.1)'},
  icon: {width: $.controlIconSize, height: $.controlIconSize},
});
