import {CarFront, CreditCard, Heart, House, Mail, MapPin, Menu, Phone, Tag, TextAlignJustify, Wrench} from 'lucide-react';

const icons = {home: House, cars: CarFront, saved: Heart, more: Menu, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;
const dockIcons = {...icons, more: TextAlignJustify};

/** Shared navigation symbols; size changes by context, colour follows the theme. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75, dock = false}: {name: ShowroomIconName; size?: number; strokeWidth?: number; dock?: boolean}) {
  const Icon = (dock ? dockIcons : icons)[name];
  const iconSize = dock && name === 'cars' ? size + 2 : dock && (name === 'more' || name === 'service') ? size - 2 : size;
  return <Icon size={iconSize} strokeWidth={strokeWidth} absoluteStrokeWidth={dock} aria-hidden="true"/>;
}
