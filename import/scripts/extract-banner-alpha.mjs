import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const CANVAS_WIDTH = 1983;
const CANVAS_HEIGHT = 793;
const SUBJECT_HEIGHT = 440;
const SUBJECT_BASELINE = 680;

const assets = [
	['route-services-framed-v2.png', 'route-services-edges-v4.png'],
	['route-about-framed-v2.png', 'route-about-edges-v4.png'],
	['route-contact-framed-v2.png', 'route-contact-edges-v4.png'],
	['route-inventory-framed-v4.png', 'route-inventory-edges-v4.png']
];

const assetDirectory = new URL('../static/assets/daynight/banners/', import.meta.url);

const isBackdropRed = (red, green, blue) => {
	const secondary = Math.max(green, blue);

	return red >= 72 && green <= 86 && blue <= 96 && red - secondary >= 34 && red >= secondary * 1.35;
};

const findAlphaBounds = (data, info, startX, endX) => {
	let minX = endX;
	let minY = info.height;
	let maxX = -1;
	let maxY = -1;

	for (let y = 0; y < info.height; y += 1) {
		for (let x = startX; x < endX; x += 1) {
			const alpha = data[(y * info.width + x) * info.channels + 3];
			if (alpha <= 20) continue;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}
	}

	if (maxX < minX || maxY < minY) throw new Error('No visible edge subject found');

	return {
		left: minX,
		top: minY,
		width: maxX - minX + 1,
		height: maxY - minY + 1
	};
};

const extractBackdrop = async (sourceUrl) => {
	const { data, info } = await sharp(fileURLToPath(sourceUrl))
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const pixelCount = info.width * info.height;
	const background = new Uint8Array(pixelCount);
	const queue = new Int32Array(pixelCount);
	let head = 0;
	let tail = 0;

	const enqueueIfBackdrop = (pixelIndex) => {
		if (background[pixelIndex]) return;

		const offset = pixelIndex * info.channels;
		if (!isBackdropRed(data[offset], data[offset + 1], data[offset + 2])) return;

		background[pixelIndex] = 1;
		queue[tail++] = pixelIndex;
	};

	for (let x = 0; x < info.width; x += 1) {
		enqueueIfBackdrop(x);
		enqueueIfBackdrop((info.height - 1) * info.width + x);
	}

	for (let y = 1; y < info.height - 1; y += 1) {
		enqueueIfBackdrop(y * info.width);
		enqueueIfBackdrop(y * info.width + info.width - 1);
	}

	while (head < tail) {
		const pixelIndex = queue[head++];
		const x = pixelIndex % info.width;
		const y = Math.floor(pixelIndex / info.width);

		for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
			const neighborY = y + offsetY;
			if (neighborY < 0 || neighborY >= info.height) continue;

			for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
				if (offsetX === 0 && offsetY === 0) continue;

				const neighborX = x + offsetX;
				if (neighborX < 0 || neighborX >= info.width) continue;
				enqueueIfBackdrop(neighborY * info.width + neighborX);
			}
		}
	}

	for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
		if (background[pixelIndex]) data[pixelIndex * info.channels + 3] = 0;
	}

	return { data, info, removedPixels: tail };
};

const normalizedSubject = async (data, info, bounds) => {
	const image = sharp(data, {
		raw: { width: info.width, height: info.height, channels: info.channels }
	})
		.extract(bounds)
		.resize({ height: SUBJECT_HEIGHT });
	const buffer = await image.png().toBuffer();
	const metadata = await sharp(buffer).metadata();

	return { buffer, width: metadata.width, height: metadata.height };
};

for (const [sourceName, outputName] of assets) {
	const sourceUrl = new URL(sourceName, assetDirectory);
	const outputUrl = new URL(outputName, assetDirectory);
	const { data, info, removedPixels } = await extractBackdrop(sourceUrl);
	const midpoint = Math.floor(info.width / 2);
	const left = await normalizedSubject(data, info, findAlphaBounds(data, info, 0, midpoint));
	const right = await normalizedSubject(
		data,
		info,
		findAlphaBounds(data, info, midpoint, info.width)
	);

	await sharp({
		create: {
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	})
		.composite([
			{
				input: left.buffer,
				left: 0,
				top: SUBJECT_BASELINE - left.height
			},
			{
				input: right.buffer,
				left: CANVAS_WIDTH - right.width,
				top: SUBJECT_BASELINE - right.height
			}
		])
		.png()
		.toFile(fileURLToPath(outputUrl));

	console.log(
		`${sourceName} -> ${outputName}: ${left.height}px/${right.height}px subjects; removed ${removedPixels.toLocaleString()} backdrop pixels`
	);
}
