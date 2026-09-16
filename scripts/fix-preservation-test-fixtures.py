from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}")
    file.write_text(text.replace(old, new), encoding="utf-8")


replace_once(
    "scripts/client-refresh-presentation.test.mjs",
    """  for (const base of [template, candidate]) {
    write(base, 'src/lib/components/home/Hero.svelte', '<section>hero</section>');
    write(base, 'src/lib/styles/tokens.css', ':root { --accent: red; }');
    write(base, 'static/assets/home-hero.webp', 'same-image');
  }""",
    """  for (const base of [template, candidate]) {
    write(base, 'src/lib/components/home/Hero.svelte', '<section>hero</section>');
    write(base, 'src/lib/styles/tokens.css', ':root { --accent: red; }');
    write(base, 'static/assets/home-hero.webp', 'same-image');
    for (const relative of [
      'src/lib/data/home.ts',
      'src/lib/data/feature-artwork.ts',
      'src/lib/data/service-artwork.ts',
      'src/lib/data/vehicle-artwork.ts'
    ]) write(base, relative, '// template-owned presentation fixture');
  }""",
)

replace_once(
    "scripts/refresh-client.test.mjs",
    """  const legacyArtwork = path.join(legacy, protectedFile);
  copy(path.join(template, protectedFile), legacyArtwork);""",
    """  copy(
    path.join(NAVARA, 'auto-best/src/lib/config/brand.ts'),
    path.join(legacy, 'src/lib/config/brand.ts')
  );
  copy(
    path.join(NAVARA, 'auto-best/static/navara/wordmark.png'),
    path.join(legacy, 'static/navara/wordmark.png')
  );
  const legacyArtwork = path.join(legacy, protectedFile);
  copy(path.join(template, protectedFile), legacyArtwork);""",
)
