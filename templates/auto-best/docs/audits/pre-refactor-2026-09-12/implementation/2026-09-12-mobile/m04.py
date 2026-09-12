p = 'src/lib/components/company/VehicleEnquiry.svelte'
s = (root/p).read_text(encoding='utf8').replace("  import { resolveImportUrl }", "  import { enquiryPolicy, validateVehicleIdentity } from '$data/enquiry';\n  import { resolveImportUrl }")
s = s.replace("  let make = $state('');", "  let fieldErrors = $state<Partial<Record<'make' | 'model', string>>>({});\n  let make = $state('');")
s = s.replace('    if (next > step && !form.reportValidity()) return;', "    if (next > step) {\n      if (step === 0) {\n        const result = validateVehicleIdentity(make, model, Boolean(selectedLink));\n        make = result.values.make;\n        model = result.values.model;\n        fieldErrors = result.errors;\n        await tick();\n      }\n      if (!form.reportValidity() || Object.keys(fieldErrors).length) return;\n    }")
s = s.replace("!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)", '!enquiryPolicy.photoTypes.includes(file.type)').replace('file.size > 10 * 1024 * 1024', 'file.size > enquiryPolicy.maxPhotoBytes').replace('photos.length >= 6', 'photos.length >= enquiryPolicy.maxPhotos')
s = s.replace("photoError = 'Можете да добавите до 6 снимки.'", 'photoError = `Можете да добавите до ${enquiryPolicy.maxPhotos} снимки.`')
s = s.replace("photoError = 'Всяка снимка трябва да е до 10 MB.'", 'photoError = `Всяка снимка трябва да е до ${enquiryPolicy.maxPhotoBytes / (1024 * 1024)} MB.`')
s = s.replace('{photos.length}/6', '{photos.length}/{enquiryPolicy.maxPhotos}').replace('до 10 MB всяка', 'до {enquiryPolicy.maxPhotoBytes / (1024 * 1024)} MB всяка').replace('accept="image/jpeg,image/png,image/webp"', 'accept={enquiryPolicy.photoTypes.join(\',\')}')
for field in ['make', 'model']:
    s = s.replace(f'bind:value={{{field}}} name="{field}"', f'bind:value={{{field}}} name="{field}" aria-invalid={{fieldErrors.{field} ? true : undefined}} aria-describedby={{fieldErrors.{field} ? \'enquiry-{field}-error\' : undefined}} oninput={{() => {{ delete fieldErrors.{field}; }}}}')
    pattern = rf'(<label>[^\n]*?<input bind:value=\{{{field}\}}[^\n]*?/>)(</label>)'
    s, n = re.subn(pattern, rf'\1{{#if fieldErrors.{field}}}<span class="dn-enquiry-error" id="enquiry-{field}-error">{{fieldErrors.{field}}}</span>{{/if}}\2', s)
    assert n == 1, (field, n)
put(p, s)
