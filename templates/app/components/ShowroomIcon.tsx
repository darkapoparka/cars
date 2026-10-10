import {CarFront, CreditCard, Heart, House, Mail, MapPin, Menu, Phone, Tag, TextAlignJustify, Wrench} from 'lucide-react';

const icons = {home: House, cars: CarFront, saved: Heart, more: Menu, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;
const dockIcons = {...icons, more: TextAlignJustify};

/** Google Material Icons Outlined directions_car; Apache-2.0, see docs/licenses/material-design-icons.txt. */
function DockCarIcon({size}: {size: number}) {
  return <svg width={size} height={size} viewBox="0 1 24 24" fill="currentColor" aria-hidden="true" focusable="false" data-dock-icon="cars"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>;
}

/** Shared navigation symbols; size changes by context, colour follows the theme. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75, dock = false}: {name: ShowroomIconName; size?: number; strokeWidth?: number; dock?: boolean}) {
  if (dock && name === 'cars') return <DockCarIcon size={size + 4}/>;
  const Icon = (dock ? dockIcons : icons)[name];
  const iconSize = dock && (name === 'more' || name === 'service') ? size - 2 : size;
  return <Icon size={iconSize} strokeWidth={strokeWidth} absoluteStrokeWidth={dock} aria-hidden="true"/>;
}
