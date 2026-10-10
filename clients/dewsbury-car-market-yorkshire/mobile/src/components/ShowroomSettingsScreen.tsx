'use client';

import * as stylex from '@stylexjs/stylex';
import { useLocale } from '@/lib/use-locale';
import { colors } from '@/styles/tokens.stylex';
import { Header } from './Header';

const s = stylex.create({
  page: { minHeight: '100%', backgroundColor: colors.background },
  content: {
    maxWidth: 560,
    marginInline: 'auto',
    padding: { default: 16, '@media (min-width: 700px)': 24 },
  },
  group: { minWidth: 0, padding: 0, margin: 0, borderWidth: 0 },
  legend: { padding: 0, fontSize: 18, lineHeight: '26px', fontWeight: 600 },
  description: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: '22px',
    color: colors.muted,
  },
  options: { display: 'grid', gap: 8 },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    backgroundColor: { default: colors.background, ':hover': colors.stripe },
    color: colors.text,
    fontSize: 15,
    lineHeight: '22px',
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineWidth: 2,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-within': 'solid' },
  },
  selected: { borderColor: colors.line, backgroundColor: colors.stripe, fontWeight: 600 },
  radio: { width: 18, height: 18, margin: 0, flexShrink: 0, accentColor: colors.text },
});

export function ShowroomSettingsScreen() {
  const { t, locale, setLocale } = useLocale();
  return (
    <div {...stylex.props(s.page)}>
      <Header title="Settings" back="/" />
      <div {...stylex.props(s.content)}>
        <fieldset aria-describedby="language-description" {...stylex.props(s.group)}>
          <legend {...stylex.props(s.legend)}>{t('Language')}</legend>
          <p id="language-description" {...stylex.props(s.description)}>
            {t('Choose your language. The change applies immediately.')}
          </p>
          <div {...stylex.props(s.options)}>
            {(['bg', 'en'] as const).map((language) => (
              <label key={language} {...stylex.props(s.option, locale === language && s.selected)}>
                <input
                  type="radio"
                  name="showroom-language"
                  value={language}
                  checked={locale === language}
                  onChange={() => setLocale(language)}
                  {...stylex.props(s.radio)}
                />
                <span lang={language}>{language === 'bg' ? 'Български' : 'English'}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
