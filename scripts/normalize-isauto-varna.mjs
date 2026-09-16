import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CARWOW = path.join(ROOT, 'clients', 'isauto-varna', 'carwow');

const socialFiles = [
  'src/lib/components/about/DesktopAboutPage.svelte',
  'src/lib/components/home/mobile/mobile-home-data.ts',
  'src/lib/components/layout/DayNightFooter.svelte',
  'src/lib/components/layout/DesktopDealerFooter.svelte',
  'src/lib/components/layout/SiteChromeTopBar.svelte'
];

const replacements = [
  ['https://www.facebook.com/61566304063141/', 'https://www.facebook.com/isauto1'],
  ['https://www.instagram.com/daynight.auto.plovdiv/', 'https://www.instagram.com/is__auto/?hl=bg']
];

async function read(relative) {
  return fs.readFile(path.join(CARWOW, relative), 'utf8');
}

async function write(relative, content) {
  await fs.writeFile(path.join(CARWOW, relative), content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

for (const relative of socialFiles) {
  const before = await read(relative);
  let after = before;
  for (const [legacy, official] of replacements) after = after.replaceAll(legacy, official);
  for (const [, official] of replacements) {
    if (!after.includes(official)) throw new Error(`Missing official social URL in ${relative}: ${official}`);
  }
  if (after !== before) await write(relative, after);
}

await write('src/lib/data/daynight-videos.ts', `// IS AUTO's official website publishes Facebook and Instagram links, but no verified YouTube channel.\n// Keep the inherited template video surface empty instead of presenting another dealer's media.\nexport const youtubeChannelUrl: string | null = null;\nexport const homeVideos = [] as const;\n`);

const emptyVideoComponent = `<script lang="ts">\n\t// Intentionally empty: IS AUTO does not publish a verified YouTube channel.\n</script>\n`;
await write('src/lib/components/home/desktop/DesktopHomeVideos.svelte', emptyVideoComponent);
await write('src/lib/components/home/mobile/MobileHomeVideos.svelte', emptyVideoComponent);

let about = await read('src/lib/components/about/DesktopAboutPage.svelte');
about = about.replace("\timport { youtubeChannelUrl } from '$lib/data/daynight-videos';\n", '');
about = about.replace(/\n\t\t\t\t\t<a\s+href=\{youtubeChannelUrl\}[\s\S]*?<\/a\s*>/, '');
await write('src/lib/components/about/DesktopAboutPage.svelte', about);

let footer = await read('src/lib/components/layout/DesktopDealerFooter.svelte');
footer = footer.replace("\timport { youtubeChannelUrl } from '$lib/data/daynight-videos';\n", '');
footer = footer.replace(/\n\tconst youtubeLink = \{[\s\S]*?\n\t\} as const;\n/, '\n');
footer = footer.replace(/\n\t\t\t\t\t<a \{\.\.\.youtubeLink\}[\s\S]*?<\/a\s*>/, '');
await write('src/lib/components/layout/DesktopDealerFooter.svelte', footer);

const forbidden = [
  'daynight.auto.plovdiv',
  '61566304063141',
  'kristiankirilov1355',
  '6S3dLIgeAT8',
  'zG6rjLpT4u8',
  'w_XaGmIWJFM'
];

async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(target);
    else if (/\.(?:svelte|ts|js|mjs)$/.test(entry.name)) {
      const content = await fs.readFile(target, 'utf8');
      for (const value of forbidden) {
        if (content.includes(value)) throw new Error(`Inherited IS AUTO content remains in ${target}: ${value}`);
      }
    }
  }
}

await scan(path.join(CARWOW, 'src'));
console.log('IS AUTO social links normalized; unverified inherited YouTube content removed.');
