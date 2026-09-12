import type { Attachment } from 'svelte/attachments';

export function imageStatus(onChange: (failed: boolean) => void): Attachment<HTMLImageElement> {
  return (node) => {
    const update = () => onChange(node.complete && node.naturalWidth === 0);
    node.addEventListener('load', update);
    node.addEventListener('error', update);
    if (node.complete) update();
    return () => { node.removeEventListener('load', update); node.removeEventListener('error', update); };
  };
}
