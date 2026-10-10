import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const walk = (dir) =>
	fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) =>
			entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
		);
const files = walk(path.join(root, 'static')).filter((file) =>
	/\.(svg|png|webp|jpe?g)$/i.test(file)
);
const failures = [];
for (const file of files) {
	const extension = path.extname(file).toLowerCase();
	const fd = fs.openSync(file, 'r');
	const header = Buffer.alloc(12);
	const length = fs.readSync(fd, header, 0, 12, 0);
	fs.closeSync(fd);
	const valid =
		extension === '.svg'
			? fs.readFileSync(file, 'utf8').includes('<svg')
			: extension === '.png'
				? header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
				: extension === '.webp'
					? header.toString('ascii', 0, 4) === 'RIFF' && header.toString('ascii', 8, 12) === 'WEBP'
					: header[0] === 255 && header[1] === 216 && header[2] === 255;
	if (length < 12 || !valid) failures.push(path.relative(root, file));
}
if (failures.length) {
	console.error('Invalid image signatures:\n' + failures.join('\n'));
	process.exitCode = 1;
} else console.log('Image signature checks passed: ' + files.length + ' local images.');
