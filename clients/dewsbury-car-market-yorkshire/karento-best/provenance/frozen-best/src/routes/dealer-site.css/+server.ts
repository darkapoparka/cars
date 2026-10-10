import styles from '../../lib/server/dealer-site.css?raw';

export function GET() {
  return new Response(styles, { headers: { 'content-type': 'text/css; charset=utf-8' } });
}
