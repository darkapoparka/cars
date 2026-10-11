export type PhotoPan = { x: number; y: number };
/** Clamp against the actual contained photograph, not the whole letterboxed frame. */
export function clampPhotoPan(
  pan: PhotoPan,
  scale: number,
  frameWidth: number,
  frameHeight: number,
  imageWidth: number,
  imageHeight: number,
): PhotoPan {
  if (
    ![scale, frameWidth, frameHeight, imageWidth, imageHeight].every(Number.isFinite) ||
    scale <= 1 ||
    Math.min(frameWidth, frameHeight, imageWidth, imageHeight) <= 0
  )
    return { x: 0, y: 0 };
  const fit = Math.min(frameWidth / imageWidth, frameHeight / imageHeight);
  const maxX = Math.max(0, (imageWidth * fit * scale - frameWidth) / 2);
  const maxY = Math.max(0, (imageHeight * fit * scale - frameHeight) / 2);
  const clamp = (value: number, limit: number) =>
    Math.max(-limit, Math.min(limit, Number.isFinite(value) ? value : 0));
  return { x: clamp(pan.x, maxX), y: clamp(pan.y, maxY) };
}
