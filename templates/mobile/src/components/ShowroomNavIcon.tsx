import * as stylex from '@stylexjs/stylex';
import { Car, LayoutGrid, Phone } from 'lucide-react';

const s = stylex.create({
  icon: {
    display: 'block',
    width: 24,
    height: 24,
    flexShrink: 0,
  },
});

const icons = { cars: Car, services: LayoutGrid, contact: Phone };

export type ShowroomNavIconName = 'cars' | 'services' | 'contact';

export function ShowroomNavIcon({ name }: { name: ShowroomNavIconName }) {
  const NavIcon = icons[name];
  return (
    <NavIcon
      size={24}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      {...stylex.props(s.icon)}
    />
  );
}
