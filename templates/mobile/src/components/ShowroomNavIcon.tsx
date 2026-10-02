import * as stylex from '@stylexjs/stylex';
import { phosphorNavigationIcons } from './icons/phosphor/navigation';

const s = stylex.create({
  icon: {
    display: 'block',
    width: 24,
    height: 24,
    flexShrink: 0,
  },
});

export type ShowroomNavIconName = 'cars' | 'services' | 'contact';

export function ShowroomNavIcon({
  name,
  active = false,
}: {
  name: ShowroomNavIconName;
  active?: boolean;
}) {
  const weight = active ? 'fill' : 'regular';
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      data-icon-family="phosphor"
      data-icon-weight={weight}
      {...stylex.props(s.icon)}
    >
      <path d={phosphorNavigationIcons[name][weight]} />
    </svg>
  );
}
