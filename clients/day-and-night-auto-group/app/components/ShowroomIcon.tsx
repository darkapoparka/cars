import {CarFront, CreditCard, Heart, House, Mail, MapPin, Menu, Phone, ShoppingBag, Tag, Wrench} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import {dockIcons, type DockIconName} from '@/components/dock-icons';
import ShowroomArtwork from '@/components/ShowroomArtwork';
import {assetPath} from '@/lib/paths';

const icons = {home: House, cars: CarFront, saved: Heart, shop: ShoppingBag, more: Menu, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;

const menuArtwork: Partial<Record<ShowroomIconName, string>> = {
  cars: '/navigation/dock/cars.webp',
  saved: '/navigation/menu/saved.webp',
  sell: '/navigation/menu/sell.webp',
  finance: '/navigation/menu/finance.webp',
  service: '/navigation/dock/service.webp',
  location: '/navigation/menu/location.webp',
  phone: '/navigation/menu/phone.webp',
  email: '/navigation/menu/email.webp',
};

/** Menu and dock artwork keep the original SVG family available. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75, dock = false, active = false, dockArtwork = true, artwork = false}: {name: ShowroomIconName; size?: number; strokeWidth?: number; dock?: boolean; active?: boolean; dockArtwork?: boolean; artwork?: boolean}) {
  const dockGlyph = dock && name in dockIcons ? dockIcons[name as DockIconName] : null;
  // Four small transparent WebPs need no image optimizer or responsive variants.
  if (dockGlyph && dockArtwork) return <img src={assetPath(`/navigation/dock/${name}.webp`)} alt="" aria-hidden="true" width={64} height={64} loading="eager" decoding="async" data-dock-icon={name} data-dock-artwork data-dock-weight={active ? 'asset-active' : 'asset'} {...stylex.props(s.artwork, !active && s.artworkInactive)}/>;
  if (dockGlyph) return <svg width={24} height={24} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" data-dock-icon={name} data-dock-weight={active ? 'fill' : 'regular'}><path d={dockGlyph[active ? 'fill' : 'regular']}/></svg>;
  const Icon = icons[name];
  const artworkSource = artwork ? menuArtwork[name] : undefined;
  if (artworkSource) return <ShowroomArtwork src={assetPath(artworkSource)} size={size} fallback={<Icon size={Math.min(size, 20)} strokeWidth={strokeWidth} aria-hidden="true"/>}/>;
  return <Icon size={dock && name === 'cars' ? 24 : size} strokeWidth={strokeWidth} absoluteStrokeWidth={dock} aria-hidden="true" data-dock-icon={dock ? name : undefined}/>;
}

const s = stylex.create({
  artwork: {display: 'block', width: 28, height: 28, objectFit: 'contain', pointerEvents: 'none'},
  artworkInactive: {opacity: .85},
});
