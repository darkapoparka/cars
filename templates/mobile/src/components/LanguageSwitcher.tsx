'use client';
import { Globe } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
const s = stylex.create({
  button: {
    display: { default: 'inline-flex', '@media (min-width: 700px)': 'none' },
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    minWidth: 60,
    minHeight: 44,
    paddingInline: 8,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: controlShape.pill,
    backgroundColor: 'transparent',
    color: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: '20px',
    outlineColor: colors.accent,
    outlineOffset: 2,
    opacity: { default: 1, ':active': 0.75 },
  },
});
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const label =
    locale === 'bg'
      ? 'Език: български. Switch to English'
      : 'Language: English. Превключи на български';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setLocale(locale === 'bg' ? 'en' : 'bg')}
      {...stylex.props(s.button)}
    >
      <Globe size={16} strokeWidth={1.8} aria-hidden="true" />
      <span>{locale.toUpperCase()}</span>
    </button>
  );
}
