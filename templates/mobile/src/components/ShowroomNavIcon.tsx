import * as stylex from '@stylexjs/stylex';
import { Car, MessageCircle, Wrench } from 'lucide-react';

const icons = { cars: Car, services: Wrench, contact: MessageCircle } as const;

const s = stylex.create({
  icon: {
    display: 'block',
    width: 22,
    height: 22,
    flexShrink: 0,
  },
});

export type ShowroomNavIconName = keyof typeof icons;

export function ShowroomNavIcon({ name }: { name: ShowroomNavIconName }) {
  const NavigationIcon = icons[name];
  return (
    <NavigationIcon
      size={22}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      data-icon-family="lucide"
      {...stylex.props(s.icon)}
    />
  );
}
