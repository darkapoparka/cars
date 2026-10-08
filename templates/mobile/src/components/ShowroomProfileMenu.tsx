'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Heart, Settings } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import { validLocale } from '@/lib/locale';
import { showroomInventoryHref } from '@/lib/showroom';
import { useAppState } from '@/lib/store';
import { useLocale } from '@/lib/use-locale';
import { controlShape } from '@/styles/control-tokens.stylex';
import { colors, darkTheme } from '@/styles/tokens.stylex';
import { showroomNavigation } from './showroom-navigation';

const avatar = '/images/demo/profile-avatar-20261008.webp';
const s = stylex.create({
  trigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 48,
    height: 48,
    padding: 0,
    borderWidth: 0,
    borderRadius: controlShape.circle,
    backgroundColor: { default: 'transparent', ':hover': colors.stripe },
    cursor: 'pointer',
    outlineColor: colors.accent,
    outlineWidth: 2,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  triggerOpen: { backgroundColor: colors.stripe },
  triggerHero: {
    backgroundColor: {
      default: 'transparent',
      '@media (min-width: 1024px)': {
        default: 'transparent',
        ':hover': 'rgba(255, 255, 255, .12)',
      },
    },
    outlineColor: { default: colors.accent, '@media (min-width: 1024px)': '#fff' },
  },
  triggerHeroOpen: {
    backgroundColor: {
      default: colors.stripe,
      '@media (min-width: 1024px)': 'rgba(255, 255, 255, .12)',
    },
  },
  portrait: {
    display: 'block',
    width: 36,
    height: 36,
    objectFit: 'cover',
    borderRadius: controlShape.circle,
    backgroundColor: colors.controlSurface,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
  },
  menuPortrait: { width: 40, height: 40 },
  content: {
    zIndex: 100,
    width: 280,
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.cardLine,
    borderRadius: 12,
    backgroundColor: colors.background,
    color: colors.text,
    boxShadow: '0 12px 32px rgba(20, 24, 32, .12)',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  headingText: { display: 'grid', gap: 2, minWidth: 0 },
  title: { fontSize: 15, lineHeight: '22px', fontWeight: 600 },
  guest: { fontSize: 12, lineHeight: '18px', color: colors.muted },
  separator: { height: 1, marginBlock: 6, marginInline: 6, backgroundColor: colors.cardLine },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingBlock: 10,
    paddingInline: 12,
    borderRadius: 8,
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.stripe,
      ':focus': colors.stripe,
    },
    color: colors.text,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    outlineColor: colors.text,
    outlineWidth: 2,
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
  },
  current: { backgroundColor: colors.stripe },
  icon: { flexShrink: 0, color: colors.muted },
  label: { flex: '1', minWidth: 0 },
  count: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    height: 24,
    paddingInline: 6,
    borderRadius: controlShape.pill,
    backgroundColor: colors.controlSurface,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '18px',
  },
  groupLabel: {
    display: 'block',
    paddingBlock: 6,
    paddingInline: 12,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
    color: colors.muted,
  },
  languageCode: { width: 20, fontSize: 11, fontWeight: 600, color: colors.muted },
  indicator: { display: 'flex', alignItems: 'center', width: 18, height: 18 },
  desktopOnly: { display: { default: 'none', '@media (min-width: 1024px)': 'block' } },
});

export function ShowroomProfileMenu({ overHero = false }: { overHero?: boolean }) {
  const { t, locale, setLocale, number } = useLocale();
  const { parked, filters, inventorySort, theme } = useAppState();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t(open ? 'Close profile menu' : 'Open profile menu')}
          data-profile-menu-trigger
          {...stylex.props(
            s.trigger,
            overHero && s.triggerHero,
            open && s.triggerOpen,
            overHero && open && s.triggerHeroOpen,
          )}
        >
          <Image
            src={avatar}
            alt=""
            width={36}
            height={36}
            unoptimized
            {...stylex.props(s.portrait)}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          loop
          aria-label={t('Your menu')}
          data-profile-menu
          {...stylex.props(s.content, theme === 'dark' && darkTheme)}
        >
          <DropdownMenu.Label {...stylex.props(s.heading)}>
            <Image
              src={avatar}
              alt=""
              width={40}
              height={40}
              unoptimized
              {...stylex.props(s.portrait, s.menuPortrait)}
            />
            <span {...stylex.props(s.headingText)}>
              <span {...stylex.props(s.title)}>{t('Your menu')}</span>
              <span {...stylex.props(s.guest)}>{t('Guest')}</span>
            </span>
          </DropdownMenu.Label>
          <DropdownMenu.Separator {...stylex.props(s.separator)} />
          <DropdownMenu.Group>
            <DropdownMenu.Item asChild>
              <Link href="/car-park" prefetch={false} {...stylex.props(s.item)}>
                <Heart size={20} strokeWidth={1.8} aria-hidden="true" {...stylex.props(s.icon)} />
                <span {...stylex.props(s.label)}>{t('Saved cars')}</span>
                <span {...stylex.props(s.count)}>{number(parked.length)}</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link href="/settings" prefetch={false} {...stylex.props(s.item)}>
                <Settings
                  size={20}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  {...stylex.props(s.icon)}
                />
                <span {...stylex.props(s.label)}>{t('Settings')}</span>
                <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.icon)} />
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator {...stylex.props(s.separator)} />
          <DropdownMenu.Label {...stylex.props(s.groupLabel)}>{t('Language')}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            aria-label={t('Language')}
            value={locale}
            onValueChange={(language) => {
              if (validLocale(language)) setLocale(language);
            }}
          >
            {(['bg', 'en'] as const).map((language) => (
              <DropdownMenu.RadioItem
                key={language}
                value={language}
                onSelect={(event) => event.preventDefault()}
                {...stylex.props(s.item)}
              >
                <span aria-hidden="true" {...stylex.props(s.languageCode)}>
                  {language.toUpperCase()}
                </span>
                <span lang={language} {...stylex.props(s.label)}>
                  {language === 'bg' ? 'Български' : 'English'}
                </span>
                <span {...stylex.props(s.indicator)}>
                  <DropdownMenu.ItemIndicator>
                    <Check size={18} strokeWidth={2} aria-hidden="true" />
                  </DropdownMenu.ItemIndicator>
                </span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <div {...stylex.props(s.desktopOnly)}>
            <DropdownMenu.Separator {...stylex.props(s.separator)} />
            <DropdownMenu.Group aria-label={t('Main navigation')}>
              {showroomNavigation.map(([href, label, NavigationIcon]) => (
                <DropdownMenu.Item asChild key={href}>
                  <Link
                    href={href === '/' ? showroomInventoryHref(filters, inventorySort) : href}
                    prefetch={false}
                    aria-current={pathname === href ? 'page' : undefined}
                    {...stylex.props(s.item, pathname === href && s.current)}
                  >
                    <NavigationIcon
                      size={20}
                      strokeWidth={1.8}
                      aria-hidden="true"
                      {...stylex.props(s.icon)}
                    />
                    <span {...stylex.props(s.label)}>{t(label)}</span>
                    <ChevronRight size={16} aria-hidden="true" {...stylex.props(s.icon)} />
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
