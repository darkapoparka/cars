import {CarFront, CreditCard, Heart, House, Mail, MapPin, PanelsTopLeft, Phone, Tag, Wrench} from 'lucide-react';

const icons = {home: House, cars: CarFront, saved: Heart, more: PanelsTopLeft, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;

/** Shared navigation symbols; size changes by context, colour follows the theme. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75}: {name: ShowroomIconName; size?: number; strokeWidth?: number}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true"/>;
}
