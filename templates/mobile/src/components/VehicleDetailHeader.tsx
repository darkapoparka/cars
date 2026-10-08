'use client';
import { useEffect, useState, type RefObject } from 'react';
import * as stylex from '@stylexjs/stylex';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors } from '@/styles/tokens.stylex';
import { useLocale } from '@/lib/use-locale';
import { Header } from './Header';
import { Icon } from './Icon';
import { IconButton } from './ui';

const s = stylex.create({
  desktop: { display: { default: 'contents', '@media (max-width: 699px)': 'none' } },
  mobile: {
    display: { default: 'none', '@media (max-width: 699px)': 'flex' },
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    minHeight: 60,
    alignItems: 'center',
    gap: 8,
    paddingInline: 12,
    backgroundColor: 'transparent',
    color: colors.text,
  },
  compact: { backgroundColor: colors.background, boxShadow: '0 1px 8px #0000000a' },
  title: {
    display: 'none',
    flex: '1',
    minWidth: 0,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '22px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  compactTitle: { display: 'block' },
  spacer: { flex: '1' },
  control: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    padding: 0,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: 'transparent',
    color: colors.text,
    outlineColor: colors.accent,
    outlineOffset: -3,
  },
  controlFace: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: controlShape.circle,
    backgroundColor: { default: colors.background, ':hover': colors.controlSurface },
    boxShadow: '0 1px 5px #00000014',
  },
  compactFace: {
    backgroundColor: { default: 'transparent', ':hover': colors.controlSurface },
    boxShadow: 'none',
  },
});

export function VehicleDetailHeader({
  id,
  title,
  image,
  saved,
  onBack,
  onShare,
  onSave,
}: {
  id: string;
  title: string;
  image: RefObject<HTMLDivElement | null>;
  saved: boolean;
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
}) {
  const { t } = useLocale();
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (!image.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting && entry.boundingClientRect.bottom <= 140),
      { rootMargin: '-140px 0px 0px 0px' },
    );
    observer.observe(image.current);
    return () => observer.disconnect();
  }, [id, image]);
  const saveLabel = saved ? t('Remove from saved cars') : t('Save car');
  return (
    <>
      <div {...stylex.props(s.desktop)}>
        <Header title={title} back="/" onBack={onBack}>
          <IconButton icon="share" label={t('Share via')} onClick={onShare} />
          <IconButton
            icon="checklist"
            label={t('Checklist')}
            href={'/vehicle/' + id + '/checklist'}
          />
          <IconButton icon="heart" label={saveLabel} filled={saved} onClick={onSave} />
        </Header>
      </div>
      <header
        aria-label={t('Vehicle information')}
        data-vehicle-mobile-header={compact ? 'compact' : 'image'}
        {...stylex.props(s.mobile, compact && s.compact)}
      >
        <button
          type="button"
          aria-label={t('Go back')}
          onClick={onBack}
          {...stylex.props(s.control)}
        >
          <span {...stylex.props(s.controlFace, compact && s.compactFace)}>
            <Icon name="back" />
          </span>
        </button>
        <span title={title} {...stylex.props(s.title, compact && s.compactTitle)}>
          {title}
        </span>
        {!compact && <span {...stylex.props(s.spacer)} />}
        <button
          type="button"
          aria-label={t('Share via')}
          onClick={onShare}
          {...stylex.props(s.control)}
        >
          <span {...stylex.props(s.controlFace, compact && s.compactFace)}>
            <Icon name="share" />
          </span>
        </button>
        <button
          type="button"
          aria-label={saveLabel}
          aria-pressed={saved}
          onClick={onSave}
          {...stylex.props(s.control)}
        >
          <span {...stylex.props(s.controlFace, compact && s.compactFace)}>
            <Icon name="heart" filled={saved} />
          </span>
        </button>
      </header>
    </>
  );
}
