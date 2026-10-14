import {CarFront, CreditCard, Heart, House, Mail, MapPin, Menu, Phone, Tag, Wrench} from 'lucide-react';
import {dockIcons, type DockIconName} from '@/components/dock-icons';

const icons = {home: House, cars: CarFront, saved: Heart, more: Menu, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;

/** The dock has one SVG family with matching regular and selected fill glyphs. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75, dock = false, active = false}: {name: ShowroomIconName; size?: number; strokeWidth?: number; dock?: boolean; active?: boolean}) {
  const dockGlyph = dock && name in dockIcons ? dockIcons[name as DockIconName] : null;
  if (dockGlyph) return <svg width={24} height={24} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" data-dock-icon={name} data-dock-weight={active ? 'fill' : 'regular'}><path d={dockGlyph[active ? 'fill' : 'regular']}/></svg>;
  const Icon = icons[name];
  return <Icon size={dock && name === 'cars' ? 24 : size} strokeWidth={strokeWidth} absoluteStrokeWidth={dock} aria-hidden="true" data-dock-icon={dock ? name : undefined}/>;
}
