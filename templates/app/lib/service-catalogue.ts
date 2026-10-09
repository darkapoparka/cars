/** Dealer service categories. Availability and pricing are confirmed in the enquiry flow. */
export const serviceOptions = [
  {
    id: 'routine',
    name: 'Routine service',
    label: 'Servicing',
    copy: 'Oil, filters and routine checks.',
    image: '/showroom/services/maintenance-v1.webp',
    demo: false,
    checks: ['Oil and filters', 'Safety checks', 'Tyres and brakes'],
  },
  {
    id: 'diagnostics',
    name: 'Inspection and diagnostics',
    label: 'Diagnostics',
    copy: 'Check your car and plan any work.',
    image: '/showroom/services/diagnostics-v1.webp',
    demo: false,
    checks: ['Computer check', 'Suspension and brakes', 'Recommendations'],
  },
  {
    id: 'tyres',
    name: 'Tyres and wheel care',
    label: 'Tyres',
    copy: 'Tyre condition, pressures and wheel balancing.',
    image: '/showroom/services/tyres-v2.webp',
    demo: true,
    checks: ['Tread and pressure', 'Wheel balancing', 'Tyre advice'],
  },
  {
    id: 'brakes',
    name: 'Brake inspection',
    label: 'Brakes',
    copy: 'Brake pads, discs and braking condition.',
    image: '/showroom/services/brakes-v1.webp',
    demo: true,
    checks: ['Pads and discs', 'Brake condition', 'Repair advice'],
  },
  {
    id: 'air-conditioning',
    name: 'Air conditioning service',
    label: 'Air con',
    copy: 'Cooling, cabin filter and system checks.',
    image: '/showroom/services/air-conditioning-v1.webp',
    demo: true,
    checks: ['Cooling check', 'Cabin filter', 'System inspection'],
  },
] as const;

export type ServiceOption = (typeof serviceOptions)[number];
