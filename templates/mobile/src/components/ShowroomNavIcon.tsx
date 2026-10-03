import * as stylex from '@stylexjs/stylex';
import { CarFront, Phone, Wrench } from 'lucide-react';

const icons = { cars: CarFront, services: Wrench, contact: Phone } as const;

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
