from pathlib import Path
root=Path('J:/cars/templates/auto-best')
for file, expression in [('src/lib/components/vehicles/VehicleCard.svelte','vehicle.image'),('src/routes/listing-detail-v1/[id]/+page.svelte','data.vehicle.image')]:
    p=root/file; source=p.read_text(encoding='utf-8')
    old=f'onerror={{() => failedImage = {expression}}}'
    new=old+f'\n        {{@attach (image) => {{ if (image.complete && !image.naturalWidth) failedImage = {expression}; }}}}'
    assert source.count(old)==1,file
    p.write_text(source.replace(old,new),encoding='utf-8')
p=root/'scripts/mobile-resilience.mjs'; s=p.read_text(encoding='utf-8')
s=s.replace("      assert(Math.abs(await page.evaluate(() => scrollY) - before) <= 1);", "      // WebKit dispatches the native close event asynchronously. Wait for the owner's cleanup, not an arbitrary delay.\n      await page.waitForFunction(() => document.body.style.position !== 'fixed');\n      await page.waitForFunction(y => Math.abs(scrollY - y) <= 1, before);\n      assert(Math.abs(await page.evaluate(() => scrollY) - before) <= 1);")
p.write_text(s,encoding='utf-8')
print('Detect image failures that occur before hydration; wait for native WebKit close cleanup in the regression test.')
