import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';
export const controls = stylex.create({
  radio: {
    appearance: 'none',
    width: 20,
    height: 20,
    margin: 0,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: '50%',
    padding: 0,
    color: colors.deepPurple,
    borderColor: { default: '#808592', ':checked': 'currentColor' },
    backgroundColor: { default: 'transparent', ':checked': 'currentColor' },
    backgroundClip: 'padding-box',
    backgroundImage: {
      default: 'none',
      ':checked': 'radial-gradient(circle, #fff 0 3px, transparent 3.5px)',
    },
    flexShrink: 0,
    outlineOffset: 3,
  },
  orangeRadio: {
    backgroundColor: 'transparent',
    backgroundImage: {
      default: 'none',
      ':checked': 'radial-gradient(circle, currentColor 0 4px, transparent 4.5px)',
    },
    color: colors.accent,
    borderColor: { default: '#b1b8c4', ':checked': 'currentColor' },
  },
  checkbox: {
    appearance: 'none',
    width: 20,
    height: 20,
    margin: 0,
    flexShrink: 0,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: { default: '#808592', ':checked': colors.deepPurple },
    backgroundColor: { default: colors.background, ':checked': colors.deepPurple },
    backgroundImage: {
      default: 'none',
      ':checked':
        'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3E%3Cpath d=%27M4 10l4 4 8-9%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272.7%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E")',
    },
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    cursor: 'pointer',
    outlineOffset: 3,
  },
});
