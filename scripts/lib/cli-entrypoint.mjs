import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Node resolves an imported module to its physical file, while argv can retain
// a supported directory junction or symlink used to launch the command.
export function isEntrypoint(moduleUrl, entryPath = process.argv[1]) {
  if (typeof entryPath !== 'string' || !entryPath) return false;
  const canonical = file => {
    const resolved = fs.realpathSync(path.resolve(file));
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  };
  try {
    return canonical(entryPath) === canonical(fileURLToPath(moduleUrl));
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return false;
    throw error;
  }
}
