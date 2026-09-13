import { describe, expect, it } from 'vitest';
import {
	DAY_IMAGE_FALLBACK,
	daynightImageFallback,
	isBrokenDayNightImage
} from './daynight-image-fallback';

class ImageStub extends EventTarget {
	src = '/vehicle.jpg';
	currentSrc = '';
	complete = false;
	naturalWidth = 0;
	dataset: Record<string, string> = {};
	attrs = new Map<string, string>();
	classes = new Set<string>();
	classList = {
		add: (name: string) => this.classes.add(name),
		remove: (name: string) => this.classes.delete(name)
	};
	getAttribute(name: string) {
		return name === 'src' ? this.src : (this.attrs.get(name) ?? null);
	}
	hasAttribute(name: string) {
		return name === 'src' ? Boolean(this.src) : this.attrs.has(name);
	}
	removeAttribute(name: string) {
		this.attrs.delete(name);
	}
	get image() {
		return this as unknown as HTMLImageElement;
	}
}

describe('image fallback lifecycle', () => {
	it('leaves healthy images and healthy transparent pixels alone', () => {
		const stub = new ImageStub();
		stub.complete = true;
		stub.naturalWidth = 1;
		const action = daynightImageFallback(stub.image);
		expect(stub.src).toBe('/vehicle.jpg');
		action.destroy();
	});
	it('handles an image that failed before attachment without polling or timers', () => {
		const stub = new ImageStub();
		stub.complete = true;
		const action = daynightImageFallback(stub.image);
		expect(stub.src).toBe(DAY_IMAGE_FALLBACK);
		action.destroy();
	});
	it('does not replace an unselected responsive candidate, but responds to its error', () => {
		const stub = new ImageStub();
		stub.complete = true;
		stub.attrs.set('srcset', '/large.jpg 2x');
		expect(isBrokenDayNightImage(stub.image)).toBe(false);
		const action = daynightImageFallback(stub.image);
		expect(stub.src).toBe('/vehicle.jpg');
		stub.dispatchEvent(new Event('error'));
		expect(stub.src).toBe(DAY_IMAGE_FALLBACK);
		expect(stub.attrs.has('srcset')).toBe(false);
		action.destroy();
	});
	it('keeps the remaining owner active and makes release idempotent', () => {
		const stub = new ImageStub();
		const first = daynightImageFallback(stub.image);
		const second = daynightImageFallback(stub.image);
		first.destroy();
		first.destroy();
		stub.dispatchEvent(new Event('error'));
		expect(stub.src).toBe(DAY_IMAGE_FALLBACK);
		second.destroy();
		stub.src = '/another.jpg';
		stub.dispatchEvent(new Event('error'));
		expect(stub.src).toBe('/another.jpg');
	});
	it('allows a cleaned-up node to acquire a fresh attachment', () => {
		const stub = new ImageStub();
		daynightImageFallback(stub.image).destroy();
		const action = daynightImageFallback(stub.image);
		stub.dispatchEvent(new Event('error'));
		expect(stub.src).toBe(DAY_IMAGE_FALLBACK);
		action.destroy();
	});
	it('clears placeholder styling when a reused image successfully loads a different photo', () => {
		const stub = new ImageStub();
		const action = daynightImageFallback(stub.image);
		stub.dispatchEvent(new Event('error'));
		stub.src = '/recovered.jpg';
		stub.currentSrc = stub.src;
		stub.naturalWidth = 640;
		stub.dispatchEvent(new Event('load'));
		expect(stub.classes.has('daynight-img-fallback')).toBe(false);
		expect(stub.dataset.daynightImgFallback).toBeUndefined();
		action.destroy();
	});
});
