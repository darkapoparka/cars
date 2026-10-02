/** Dealer service categories. Availability and pricing are confirmed in the enquiry flow. */
export const serviceOptions = [
  {
    id: 'routine',
    name: 'Routine service',
    label: 'Servicing',
    copy: 'Oil, filters and routine checks.',
    image: '/showroom/services/maintenance-v1.webp',
    checks: ['Oil and filters', 'Safety checks', 'Tyres and brakes'],
  },
  {
    id: 'diagnostics',
    name: 'Inspection and diagnostics',
    label: 'Diagnostics',
    copy: 'Check your car and plan any work.',
    image: '/showroom/services/diagnostics-v1.webp',
    checks: ['Computer check', 'Suspension and brakes', 'Recommendations'],
  },
] as const;
