import * as stylex from '@stylexjs/stylex';
export const colors = stylex.defineVars({
  // Shared page canvas, cards and overlay surfaces.
  background: '#ffffff',
  surface: '#e6eaf0',
  panel: '#fcfbfd',
  stripe: '#f5f7fa', // Quiet grouped content and alternating rows.
  controlSurface: '#f0f2f5', // Fields, secondary actions and control states.
  activeSurface: '#fff9f6',
  text: '#1b1b21',
  muted: '#5d616b',
  line: '#d5dae0',
  cardLine: '#e7e7ea',
  accent: '#db3000',
  purple: '#4f166e',
  deepPurple: '#350051',
  purpleLine: '#68298a',
  iconBg: '#d5dae0',
  green: '#256141',
  assistant: '#eee6f5',
});
export const darkTheme = stylex.createTheme(colors, {
  background: '#19171d',
  surface: '#302e37',
  panel: '#24212a',
  stripe: '#2b2831',
  controlSurface: '#302e37',
  activeSurface: '#442c25',
  text: '#faf8fc',
  muted: '#bab7c4',
  line: '#46404e',
  cardLine: '#37333d',
  accent: '#ff6946',
  purple: '#d9a5fb',
  deepPurple: '#350051',
  purpleLine: '#b883d6',
  iconBg: '#46404e',
  green: '#61c88a',
  assistant: '#342840',
});
