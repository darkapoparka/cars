// Original native Next configuration, preserved through a Node CJS boundary.
import { createRequire } from 'node:module';
const nextConfig = createRequire(import.meta.url)('./cars-next-source.cjs');
export default nextConfig;
