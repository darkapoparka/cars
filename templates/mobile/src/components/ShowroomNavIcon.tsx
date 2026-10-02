import * as stylex from '@stylexjs/stylex';

const s = stylex.create({
  icon: {
    display: 'inline-block',
    width: 24,
    height: 24,
    flexShrink: 0,
    backgroundColor: 'currentColor',
    maskSize: 'contain',
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
  },
  cars: { maskImage: 'url(/icons/showroom/cars.svg)' },
  services: { maskImage: 'url(/icons/showroom/services.svg)' },
  contact: { maskImage: 'url(/icons/showroom/contact.svg)' },
});

export type ShowroomNavIconName = 'cars' | 'services' | 'contact';

export function ShowroomNavIcon({ name }: { name: ShowroomNavIconName }) {
  return <span aria-hidden="true" {...stylex.props(s.icon, s[name])} />;
}
