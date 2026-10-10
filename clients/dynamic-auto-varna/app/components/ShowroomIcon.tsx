import {Car, CarFront, CreditCard, Heart, House, Mail, MapPin, Menu, Phone, Tag, Wrench} from 'lucide-react';

const icons = {home: House, cars: CarFront, saved: Heart, more: Menu, sell: Tag, finance: CreditCard, service: Wrench, location: MapPin, phone: Phone, email: Mail};
export type ShowroomIconName = keyof typeof icons;

/** One icon family throughout the showroom; dock strokes keep their pixel weight. */
export default function ShowroomIcon({name, size = 28, strokeWidth = 1.75, dock = false}: {name: ShowroomIconName; size?: number; strokeWidth?: number; dock?: boolean}) {
  const Icon = dock && name === 'cars' ? Car : icons[name];
  return <Icon size={dock && name === 'cars' ? 26 : size} strokeWidth={strokeWidth} absoluteStrokeWidth={dock} aria-hidden="true" data-dock-icon={dock ? name : undefined}/>;
}
