import { NativeIcon, isNativeIcon, type NativeIconName } from './NativeIcon';
import {
  Car,
  Caravan,
  Calculator,
  Globe,
  Timer,
  MessageSquareText,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bike,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  CircleUserRound,
  ClipboardCheck,
  Euro,
  Fuel,
  Gauge,
  Heart,
  House,
  Info,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  Mic,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
const icons = {
  calculator: Calculator,
  globe: Globe,
  timer: Timer,
  back: ArrowLeft,
  arrow: ArrowRight,
  bell: Bell,
  bike: Bike,
  building: Building2,
  calendar: CalendarCheck,
  camera: Camera,
  car: Car,
  check: Check,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
  up: ChevronUp,
  help: CircleHelp,
  user: CircleUserRound,
  checklist: ClipboardCheck,
  euro: Euro,
  fuel: Fuel,
  gauge: Gauge,
  heart: Heart,
  home: House,
  info: Info,
  grid: LayoutGrid,
  list: List,
  mail: Mail,
  pin: MapPin,
  message: MessageSquareText,
  mic: Mic,
  phone: Phone,
  plus: Plus,
  reset: RotateCcw,
  search: Search,
  settings: Settings2,
  share: Share2,
  shield: ShieldCheck,
  filter: SlidersHorizontal,
  sparkles: Sparkles,
  star: Star,
  tag: Tag,
  trash: Trash2,
  truck: Truck,
  users: Users,
  wallet: Wallet,
  wrench: Wrench,
  close: X,
  electric: Zap,
  zoom: ZoomIn,
};
export type IconName =
  | keyof typeof icons
  | NativeIconName
  | 'searches'
  | 'motorhome'
  | 'transmission'
  | 'smartSearch'
  | 'sort'
  | 'mileage'
  | 'edit'
  | 'map'
  | 'send'
  | 'date';
export function Icon({
  name,
  size = 24,
  filled = false,
}: {
  name: IconName;
  size?: number;
  filled?: boolean;
}) {
  if (filled && name === 'heart') return <NativeIcon name="heartFilled" size={size} />;
  if (!filled && isNativeIcon(name)) return <NativeIcon name={name} size={size} />;
  if (name === 'smartSearch')
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 26 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M14 4a8 8 0 1 0 5 7M17 18l6 6" />
        <path
          d="m19 1 1.2 3.2L23 5.5l-2.8 1.3L19 10l-1.2-3.2L15 5.5l2.8-1.3Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  if (name === 'sparkles')
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
        <path d="M12 7c-1.5 7-3.5 9-10 11 6.5 1.5 8.5 4 10 9 1.5-5 3.5-7.5 10-9-6.5-2-8.5-4-10-11ZM22 0c-.8 3.6-2.4 5.2-6 6 3.6.8 5.2 2.4 6 6 .8-3.6 2.4-5.2 6-6-3.6-.8-5.2-2.4-6-6Z" />
      </svg>
    );
  if (name === 'searches')
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 2 2.8 5.7 6.3.9-4.5 4.4.4 2.2M6.4 15.6 5.3 22l6.7-3.5M6.4 15.6l-4.5-4.4 6.3-.9L12 2" />
        <circle cx="17.5" cy="17" r="3.2" />
        <path d="m20 19.5 2 2" />
      </svg>
    );
  if (name === 'transmission')
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M5 3v18M12 3v18M19 3v9H5" />
        <circle cx="5" cy="3" r="1" />
        <circle cx="12" cy="3" r="1" />
        <circle cx="19" cy="3" r="1" />
      </svg>
    );
  const Component =
    name === 'motorhome' ? Caravan : icons[name as keyof typeof icons] || CircleHelp;
  return (
    <Component
      size={size}
      strokeWidth={1.9}
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden="true"
    />
  );
}
