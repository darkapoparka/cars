import { error } from '@sveltejs/kit';

// Keep the generated template portraits separate from the preserved capture.
const sources = import.meta.glob('/src/lib/server/assets/contact-avatars/*.webp', {
  query: '?inline', import: 'default', eager: true
}) as Record<string, string>;
const images = Object.fromEntries(Object.entries(sources).map(([path, data]) => [path.split('/').pop(), data]));

export function GET({ params }: { params: { image: string } }) {
  if (!Object.hasOwn(images, params.image)) error(404, 'Image not found');
  const data = images[params.image];
  if (!data) error(404, 'Image not found');
  const bytes = Uint8Array.from(atob(data.slice(data.indexOf(',') + 1)), character => character.charCodeAt(0));
  return new Response(bytes, { headers: {
    'content-type': 'image/webp',
    'cache-control': 'public, max-age=31536000, immutable'
  } });
}
