import type { Attachment } from 'svelte/attachments';

export function deferredMapFrame(src: string, rootMargin: string): Attachment<HTMLIFrameElement> {
	return (frame) => {
		if (frame.src) return;

		const load = () => {
			if (!frame.src) frame.src = src;
		};

		if (!('IntersectionObserver' in window)) {
			load();
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					load();
					observer.disconnect();
				}
			},
			{ rootMargin }
		);

		observer.observe(frame);
		return () => observer.disconnect();
	};
}
