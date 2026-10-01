'use client';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { defaultFilters, type Filters } from '@/lib/types';
import { vehicles } from '@/lib/catalog';
import { filterVehicles, serializeFilters } from '@/lib/search';
import { Icon, type IconName } from './Icon';
import { Button } from './ui';
const s = stylex.create({
  body: { display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24, paddingBottom: 40 },
  assistant: {
    marginInline: 16,
    borderRadius: 12,
    padding: 16,
    backgroundImage: 'linear-gradient(115deg,#eaf2ff,#ecdcee)',
  },
  word: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontFamily: 'var(--font-hero)',
    fontSize: 32,
    fontWeight: 700,
    lineHeight: '40px',
    color: colors.deepPurple,
  },
  beta: {
    fontFamily: 'var(--font-base)',
    fontSize: 10,
    lineHeight: '16px',
    paddingInline: 4,
    borderRadius: 4,
    backgroundColor: '#495f99',
    color: '#fff',
    marginLeft: 4,
  },
  assistantCopy: { fontSize: 16, lineHeight: '24px', marginBottom: 16 },
  heading: {
    fontFamily: 'var(--font-hero)',
    fontSize: 24,
    fontWeight: 500,
    lineHeight: '32px',
    paddingInline: 16,
    marginBottom: 16,
  },
  carousel: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingInline: 16,
    scrollbarWidth: 'none',
    scrollSnapType: 'x mandatory',
    scrollPaddingInline: 16,
  },
  tile: {
    flexShrink: 0,
    width: 182,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    color: colors.text,
    textDecoration: 'none',
    scrollSnapAlign: 'start',
  },
  blue: { backgroundColor: '#bed7fe' },
  art: { width: '100%', height: 84, objectFit: 'cover', display: 'block' },
  tileText: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingInline: 26,
    paddingTop: 12,
    paddingBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.iconBg,
    color: colors.muted,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  blueIcon: { backgroundColor: '#495f99', color: '#fff' },
  label: { fontSize: 14, fontWeight: 700, lineHeight: '20px' },
  secondary: { fontSize: 12, lineHeight: '20px', color: colors.muted, whiteSpace: 'nowrap' },
  popular: { width: 281.333 },
  popularArt: { width: '100%', height: 176, display: 'block', objectFit: 'cover' },
  popularBody: { padding: 12, paddingTop: 16, paddingBottom: 16 },
  popularTitle: { fontSize: 20, fontWeight: 700, lineHeight: '28px', marginBottom: 8 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingInline: 8,
    backgroundColor: colors.iconBg,
    borderRadius: 6,
    fontSize: 14,
    lineHeight: '20px',
  },
  vehicle: { textAlign: 'center', paddingBottom: 12 },
});
const href = (filters: Partial<Filters>) =>
  '/results?' + serializeFilters({ ...structuredClone(defaultFilters), ...filters });
export function HomeDiscovery() {
  const popular: { id: string; title: string; tags: string[]; filters: Partial<Filters> }[] = [
    {
      id: 'family',
      title: 'Family cars',
      tags: ['from 2016', 'to 150.000 km', '4/5 doors', 'to 50.000 €'],
      filters: { minYear: '2016', maxMileage: '150000', doors: '5', maxPrice: '50000' },
    },
    {
      id: 'first',
      title: 'First cars',
      tags: ['to 150.000 km', 'Service history', 'up to 7.000 €'],
      filters: { maxMileage: '150000', maxPrice: '7000', features: ['Full Service History'] },
    },
    {
      id: 'premium',
      title: 'Premium',
      tags: ['from 2018', 'from 35.000 €', 'to 80.000 km', 'Camera'],
      filters: {
        minYear: '2018',
        minPrice: '35000',
        maxMileage: '80000',
        details: ['parking=Camera'],
      },
    },
    {
      id: 'eco',
      title: 'Eco-conscious',
      tags: ['Electric', 'from 2020', 'to 60.000 km', 'to 28.000 €'],
      filters: { fuel: ['Electric'], minYear: '2020', maxMileage: '60000', maxPrice: '28000' },
    },
    {
      id: 'commuter',
      title: 'Commuter',
      tags: ['Estate', 'Saloon', 'from 2019', '10.000 - 25.000 €'],
      filters: {
        body: ['Estate', 'Saloon'],
        minYear: '2019',
        minPrice: '10000',
        maxPrice: '25000',
      },
    },
  ];
  const featured: {
    id: string;
    label: string;
    hint: string;
    icon: IconName;
    blue?: boolean;
    filters: Partial<Filters>;
  }[] = [
    {
      id: 'electric',
      label: 'Electric',
      hint: 'Eco-conscious',
      icon: 'electricCar',
      blue: true,
      filters: { fuel: ['Electric'] },
    },
    {
      id: 'leasing',
      label: 'Leasing',
      hint: 'From 89€ mth.',
      icon: 'wallet',
      filters: { payment: 'lease' },
    },
    {
      id: 'new',
      label: 'New cars',
      hint: 'Fresh & shiny',
      icon: 'star',
      filters: { condition: ['New'] },
    },
    {
      id: 'ebike',
      label: 'E-Bikes',
      hint: 'More movement',
      icon: 'electric',
      blue: true,
      filters: { category: 'electric-bike' },
    },
    {
      id: 'motorbike',
      label: 'Motorbikes',
      hint: 'Feel freedom',
      icon: 'bike',
      filters: { category: 'bike' },
    },
  ];
  return (
    <div {...stylex.props(s.body)}>
      <section {...stylex.props(s.assistant)}>
        <div {...stylex.props(s.word)}>
          <Icon name="sparkles" size={24} />
          mobee<span {...stylex.props(s.beta)}>Beta</span>
        </div>
        <p {...stylex.props(s.assistantCopy)}>
          I’m your personal AI assistant! I’ll help you through the jungle of offers.
        </p>
        <Button href="/assistant" variant="purple" block>
          Ask me anything!
        </Button>
      </section>
      <section>
        <h2 {...stylex.props(s.heading)}>Featured categories</h2>
        <div {...stylex.props(s.carousel)} aria-label="Featured categories">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={href(item.filters)}
              {...stylex.props(s.tile, item.blue && s.blue)}
            >
              <Image
                src={'/images/discovery/' + item.id + '.webp'}
                alt={item.label}
                width={546}
                height={252}
                {...stylex.props(s.art)}
              />
              <div {...stylex.props(s.tileText)}>
                <span {...stylex.props(s.icon, item.blue && s.blueIcon)}>
                  <Icon name={item.icon} size={18} />
                </span>
                <span>
                  <strong {...stylex.props(s.label)}>{item.label}</strong>
                  <span {...stylex.props(s.secondary)}>
                    <br />
                    {item.hint}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 {...stylex.props(s.heading)}>Popular categories</h2>
        <div {...stylex.props(s.carousel)} aria-label="Popular categories">
          {popular.map((item) => (
            <Link key={item.id} href={href(item.filters)} {...stylex.props(s.tile, s.popular)}>
              <Image
                src={'/images/discovery/' + item.id + '.webp'}
                alt={item.title}
                width={844}
                height={528}
                {...stylex.props(s.popularArt)}
              />
              <div {...stylex.props(s.popularBody)}>
                <h3 {...stylex.props(s.popularTitle)}>{item.title}</h3>
                <div {...stylex.props(s.tags)}>
                  {item.tags.map((tag) => (
                    <span key={tag} {...stylex.props(s.tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 {...stylex.props(s.heading)}>Vehicle types</h2>
        <div {...stylex.props(s.carousel)} aria-label="Vehicle types">
          {[
            ['estate', 'Stationwagon', 'Estate'],
            ['saloon', 'Saloon', 'Saloon'],
            ['convertible', 'Convertible', 'Convertible'],
            ['suv', 'SUV/Offroad', 'SUV'],
            ['coupe', 'Coupe', 'Coupe'],
            ['van', 'Van', 'Van'],
            ['small', 'Small car', 'Small Car'],
          ].map(([id, label, body]) => (
            <Link key={id} href={href({ body: [body] })} {...stylex.props(s.tile, s.vehicle)}>
              <Image
                src={'/images/discovery/' + id + '.webp'}
                alt={label}
                width={546}
                height={236}
                {...stylex.props(s.art)}
              />
              <strong {...stylex.props(s.label)}>{label}</strong>
              <p {...stylex.props(s.secondary)}>
                {
                  filterVehicles(vehicles, { ...structuredClone(defaultFilters), body: [body] })
                    .length
                }{' '}
                offers
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
