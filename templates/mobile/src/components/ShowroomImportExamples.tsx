import Image from 'next/image';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';

const s = stylex.create({
  section: { minWidth: 0 },
  heading: { fontSize: 18, fontWeight: 600, lineHeight: '26px', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 12 },
  card: { backgroundColor: colors.background, borderRadius: 16, overflow: 'hidden', minWidth: 0 },
  photo: { position: 'relative', aspectRatio: '16 / 9', backgroundColor: colors.surface },
  image: { objectFit: 'cover' },
  body: { padding: 12 },
  title: { fontSize: 16, fontWeight: 600, lineHeight: '24px' },
  copy: { fontSize: 14, lineHeight: '20px', color: colors.muted, marginTop: 2 },
});

// Portfolio placeholders, not evidence of a dealer's completed imports.
const exampleIds = ['bmw-540', 'bmw-x3'];

export function ShowroomImportExamples() {
  return (
    <section aria-label="Example imports" {...stylex.props(s.section)}>
      <h2 {...stylex.props(s.heading)}>Example imports</h2>
      <div {...stylex.props(s.grid)}>
        {exampleIds
          .map((id) => vehicles.find((vehicle) => vehicle.id === id))
          .filter((vehicle) => vehicle !== undefined)
          .map((vehicle) => (
            <article key={vehicle.id} data-import-example={vehicle.id} {...stylex.props(s.card)}>
              <div {...stylex.props(s.photo)}>
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.make + ' ' + vehicle.model}
                  fill
                  sizes="(max-width: 699px) calc(100vw - 32px), 440px"
                  {...stylex.props(s.image)}
                />
              </div>
              <div {...stylex.props(s.body)}>
                <h3 {...stylex.props(s.title)}>
                  {vehicle.make} {vehicle.model}
                </h3>
                <p {...stylex.props(s.copy)}>
                  {vehicle.year} · {vehicle.fuel}
                </p>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
