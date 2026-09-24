<script lang="ts">
  import { trapDialogTab } from '$lib/ui/overlay';
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { onDestroy, tick } from 'svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { dialogViewport } from '$lib/ui/dialog-viewport';
  import { brand } from '$config/brand';
  import { parseVehicleReference } from '$data/vehicle-reference';
  import EnquiryEntryField from './EnquiryEntryField.svelte';

  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let heading: HTMLHeadingElement;
  let returnFocus: HTMLElement | undefined;
  let opened = false;
  let scrollY = 0;
  let step = $state(0);
  let purpose = $state('Продажба');
  let reference = $state('');
  let referenceError = $state('');
  let referenceEditor = $state<{ edit: (trigger?: HTMLElement) => Promise<void> }>();
  let openedReference = '';
  const vehicleReference = $derived(parseVehicleReference(reference));
  let make = $state('');
  let model = $state('');
  let year = $state('');
  let mileage = $state('');
  let price = $state('');
  let notes = $state('');
  let name = $state('');
  let phone = $state('');
  let photos = $state<{ file: File; url: string }[]>([]);
  let photoError = $state('');
  let feedback = $state('');
  let sharing = $state(false);

  const steps = $derived([i18n.t("m_a5cdf07dbbc1"), i18n.t("m_3bcc77dee29d"), i18n.t("m_037d5c97213b")]);
  const vehicleLabel = $derived([make.trim(), model.trim()].filter(Boolean).join(' ') || (vehicleReference?.kind === 'listing' ? i18n.t("m_66ff4c93f569") : i18n.t("m_a5cdf07dbbc1")));
  const summary = $derived([
    i18n.t("m_40d088288de4", { p0: (purpose === 'Продажба' ? i18n.t("m_05e9f7818f00") : i18n.t("m_b4acafc27b89")).toLocaleLowerCase(i18n.locale) }),
    i18n.t("m_fa6a6c46af78", { p0: vehicleLabel }),
    vehicleReference ? i18n.t("m_07e3a63ea0ed", { p0: vehicleReference.kind === 'vin' ? i18n.t("m_5e0211b12d1e") : i18n.t("m_5743138af5d7"), p1: vehicleReference.value }) : '',
    year ? i18n.t("m_c5527ade7ffd", { p0: year }) : '',
    mileage ? i18n.t("m_a9d49d7c030f", { p0: mileage }) : '',
    price ? i18n.t("m_286a9843c0bb", { p0: price }) : '',
    notes.trim() ? i18n.t("m_a3f0cc7450c8", { p0: notes.trim() }) : '',
    name.trim() ? i18n.t("m_0e553c290508", { p0: name.trim() }) : '',
    phone.trim() ? i18n.t("m_7e03674f09cb", { p0: phone.trim() }) : '',
    photos.length ? i18n.t("m_bcd0efffe74f", { p0: photos.length }) : ''
  ].filter(Boolean).join('\n'));

  async function open(event: MouseEvent) {
    if (reference.trim() && !vehicleReference) {
      await referenceEditor?.edit(event.currentTarget as HTMLElement);
      return;
    }
    referenceError = '';
    if (reference !== openedReference) step = 0;
    openedReference = reference;
    returnFocus = event.currentTarget as HTMLElement;
    scrollY = window.scrollY;
    document.body.style.setProperty('--dn-tradein-scroll', `-${scrollY}px`);
    opened = true;
    feedback = '';
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function restore() {
    if (!opened) return;
    opened = false;
    document.body.style.removeProperty('--dn-tradein-scroll');
    window.scrollTo({ top: scrollY, behavior: 'instant' });
    returnFocus?.isConnected && returnFocus.focus({ preventScroll: true });
  }

  async function move(next: number) {
    if (next > step && step === 0 && reference.trim() && !vehicleReference) {
      referenceError = i18n.t("m_4b200427f69a");
      form.querySelector<HTMLInputElement>('[name="reference"]')?.focus();
      return;
    }
    if (next > step && !form.reportValidity()) return;
    step = next;
    feedback = '';
    await tick();
    heading.focus();
    form.scrollTop = 0;
  }

  function addPhotos(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    photoError = '';
    for (const file of Array.from(input.files || [])) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        photoError = i18n.t("m_f584ec8f827b");
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        photoError = i18n.t("m_c1140eeec913");
        continue;
      }
      if (photos.some((photo) => photo.file.name === file.name && photo.file.size === file.size && photo.file.lastModified === file.lastModified)) continue;
      if (photos.length >= 6) {
        photoError = i18n.t("m_a59a2cac14f1");
        break;
      }
      photos = [...photos, { file, url: URL.createObjectURL(file) }];
    }
    input.value = '';
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    photos = photos.filter((photo) => photo.url !== url);
    photoError = '';
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      feedback = i18n.t("m_9b610bbd53bf");
    } catch {
      feedback = i18n.t("m_53f5ed5ce5b6");
    }
  }

  async function share() {
    sharing = true;
    feedback = '';
    try {
      const files = photos.map((photo) => photo.file);
      if (files.length && !navigator.canShare?.({ files })) {
        feedback = i18n.t("m_c1ee33fffd0f");
        return;
      }
      if (!navigator.share) {
        await copy();
        return;
      }
      await navigator.share({ title: i18n.t("m_b9b49dbed887", { p0: brand.name }), text: summary, ...(files.length ? { files } : {}) });
      feedback = i18n.t("m_26d3c9788f18", { p0: brand.name });
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        feedback = i18n.t("m_54deb07743c0");
      }
    } finally {
      sharing = false;
    }
  }

  onDestroy(() => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    restore();
  });
</script>

<div class="dn-tradein-enquiry">
  <h1>{i18n.t("m_cd386206fba4")}</h1>
  <p class="dn-tradein-reference-hint" id="tradein-reference-hint">{i18n.t("m_7730704b5290")}</p>

  <div class="dn-tradein-entry-segments dn-segmented-control" role="group" aria-label={i18n.t("m_b20c31514d01")}>
    {#each ['Продажба', 'Бартер'] as option (option)}
      <button class="dn-segmented-option" type="button" class:active={purpose === option} aria-pressed={purpose === option} onclick={() => purpose = option}>{i18n.t(option === 'Продажба' ? 'enquiry.purpose.sell' : 'enquiry.purpose.tradeIn')}</button>
    {/each}
  </div>

  <div class="dn-tradein-reference">
    <EnquiryEntryField id="tradein-reference" kind="reference" value={reference} bind:this={referenceEditor} onapply={(value) => { reference = value; referenceError = ''; }} />
  </div>

  <button class="dn-tradein-start dn-compact-control dn-entry-action dn-compact-primary" type="button" onclick={open} aria-haspopup="dialog">
    {i18n.t("action.requestValuation")}
    <Icon name="arrow-right" size={15} />
  </button>
</div>

<dialog onkeydown={trapDialogTab} {@attach dialogViewport} class="dn-tradein-dialog" bind:this={dialog} aria-labelledby="tradein-title" onclose={restore} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <div class="dn-tradein-panel">
    <header class="dn-tradein-header">
      <div>
        <p>{i18n.t("m_c0ce3e0c1192")}</p>
        <h2 id="tradein-title" tabindex="-1" bind:this={heading}>{step === 0 ? i18n.t("m_881ec3398409") : step === 1 ? i18n.t("m_3bcc77dee29d") : i18n.t("m_11669a1c9e37")}</h2>
      </div>
      <button class="dn-tradein-close dn-icon-button" type="button" aria-label={i18n.t("m_f62bc38ddfaf")} onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
    </header>

    <div class="dn-tradein-progress" aria-label={i18n.t("m_c248b5704fda", { p0: step + 1, p1: steps[step] })}>
      <div class="dn-tradein-progress__copy"><span>{i18n.t("m_94c0b160a86b", { p0: step + 1 })}</span><strong>{steps[step]}</strong></div>
      <div class="dn-tradein-progress__bar" aria-hidden="true"><i style:width={`${((step + 1) / 3) * 100}%`}></i></div>
    </div>

    <form class="dn-tradein-body" bind:this={form} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        <div class="dn-tradein-fields dn-tradein-fields--vehicle">
        <label class="dn-tradein-reference-edit">{i18n.t("m_1ae4f1789f8f")} <small>{i18n.t("m_d42086812b73")}</small><input {@attach i18n.validation} name="reference" bind:value={reference} oninput={() => referenceError = ''} maxlength={2048} autocomplete="off" autocapitalize="none" spellcheck={false} placeholder={i18n.t("m_30d45936ce71")} aria-invalid={referenceError ? true : undefined} aria-describedby={referenceError ? 'tradein-reference-edit-error' : undefined} /></label>
        {#if referenceError}<p class="dn-tradein-error" id="tradein-reference-edit-error" role="alert">{referenceError}</p>{/if}
          <label>{i18n.t("m_ccdd25d4230f")} {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input {@attach i18n.validationFor(vehicleReference)} bind:value={make} name="make" required={!vehicleReference} maxlength={60} placeholder={i18n.t("m_f72bd5b65622")} autocomplete="off" /></label>
          <label>{i18n.t("m_5e2c614c23f0")} {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input {@attach i18n.validationFor(vehicleReference)} bind:value={model} name="model" required={!vehicleReference} maxlength={80} placeholder={i18n.t("m_a40a2e1bcc02")} autocomplete="off" /></label>
          <div class="dn-tradein-pair">
            <label>{i18n.t("m_89f6832560de")} {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input {@attach i18n.validationFor(vehicleReference)} bind:value={year} name="year" required={!vehicleReference} inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="2020" /></label>
            <label>{i18n.t("m_694bea758e96")} {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input {@attach i18n.validationFor(vehicleReference)} bind:value={mileage} name="mileage" required={!vehicleReference} inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder="85000" /></label>
          </div>
          <label>{i18n.t("m_ce900bda7196")} <small>{i18n.t("m_d42086812b73")}</small><input {@attach i18n.validation} bind:value={price} name="price" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder={i18n.t("m_3241a6d5a4a1")} /></label>
        </div>
        <p class="dn-tradein-note">{i18n.t("m_a8a3831ebf78", { p0: vehicleReference ? i18n.t("m_965353f48823") : i18n.t("m_b6daa68f18ca") })}</p>
      {:else if step === 1}
        <section class="dn-tradein-photos" aria-labelledby="tradein-photos-title">
          <div class="dn-tradein-section-heading"><div><h3 id="tradein-photos-title">{i18n.t("m_bda056c9ed24")}</h3><p>{i18n.t("m_d282bfeea8ae")}</p></div><span>{photos.length}/6</span></div>
          <label class="dn-tradein-upload"><Icon name="car" size={25} /><span>{i18n.t("m_ed13ae7913f0")}<small>{i18n.t("m_a17d08dfdf3e")}</small></span><input {@attach i18n.validation} type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} aria-label={i18n.t("m_e44ab8a34c3d")} /></label>
          {#if photoError}<p class="dn-tradein-error" role="alert">{photoError}</p>{/if}
          {#if photos.length}<ul class="dn-tradein-photo-grid">{#each photos as photo (photo.url)}<li><img src={photo.url} alt={photo.file.name} /><button type="button" aria-label={i18n.t("m_ef5e8d630d53", { p0: photo.file.name })} onclick={() => removePhoto(photo.url)}><Icon name="x" size={16} /></button></li>{/each}</ul>{/if}
        </section>

        <label class="dn-tradein-notes">{i18n.t("m_7d6fc1420c70")} <small>{i18n.t("m_d42086812b73")}</small><textarea {@attach i18n.validation} bind:value={notes} maxlength={1500} rows="3" placeholder={i18n.t("m_e5abad3754e2")}></textarea></label>

        <section class="dn-tradein-contact-block" aria-labelledby="tradein-contact-title">
          <div class="dn-tradein-section-heading"><div><h3 id="tradein-contact-title">{i18n.t("m_f2c4db7237d9")}</h3><p>{i18n.t("m_949cc45642de")}</p></div></div>
          <div class="dn-tradein-fields">
            <label>{i18n.t("m_dcd1d5223f73")} <small>{i18n.t("m_d42086812b73")}</small><input {@attach i18n.validation} bind:value={name} maxlength={80} autocomplete="name" placeholder={i18n.t("m_172161d4a4d0")} /></label>
            <label>{i18n.t("m_63dceb8800b2")} <small>{i18n.t("m_d42086812b73")}</small><input {@attach i18n.validation} bind:value={phone} type="tel" maxlength={25} autocomplete="tel" inputmode="tel" placeholder="08…" /></label>
          </div>
        </section>
        <p class="dn-tradein-note">{i18n.t("m_164399abe2a7")}</p>
      {:else}
        <div class="dn-tradein-review-card">
          <div class="dn-tradein-review-top"><span>{i18n.t(purpose === 'Продажба' ? 'enquiry.purpose.sell' : 'enquiry.purpose.tradeIn')}</span><button type="button" onclick={() => move(0)}>{i18n.t("m_69bd6f7ec2e5")}</button></div>
          <h3>{vehicleLabel}</h3>
          {#if year || mileage || price}<p>{[year, mileage ? i18n.t("m_9f595d190089", { p0: mileage }) : '', price ? i18n.t("m_7ce2209d146e", { p0: price }) : ''].filter(Boolean).join(' · ')}</p>{/if}
          {#if vehicleReference}<p class="dn-tradein-review-reference">{vehicleReference.kind === 'vin' ? i18n.t("m_5e0211b12d1e") : i18n.t("m_5743138af5d7")}: {vehicleReference.value}</p>{/if}
          {#if notes.trim()}<div class="dn-tradein-review-note">{notes.trim()}</div>{/if}
          {#if name.trim() || phone.trim()}<div class="dn-tradein-review-contact"><strong>{i18n.t("m_5bc9a8a2e214")}</strong><span>{[name.trim(), phone.trim()].filter(Boolean).join(' · ')}</span></div>{/if}
          {#if photos.length}<div class="dn-tradein-review-photos">{#each photos as photo (photo.url)}<img src={photo.url} alt={photo.file.name} />{/each}</div>{/if}
        </div>

        <div class="dn-tradein-next-step">
          <strong>{i18n.t("m_5cb92f9a0abd")}</strong>
          <p>{i18n.t("m_b979470ae53e", { p0: brand.name })}</p>
        </div>
        {#if feedback}<p class="dn-tradein-feedback" role="status">{feedback}</p>{/if}
        <button class="dn-tradein-copy" type="button" onclick={copy}>{i18n.t("m_2ac82d9b4ca8")}</button>
        <a class="dn-tradein-review-call" href={i18n.href(brand.phoneHref)}><Icon name="phone" size={18} />{i18n.t("m_950b8cce1fa2", { p0: brand.phone })}</a>
      {/if}

      {#if feedback && step < 2}<p class="dn-tradein-feedback" role="status">{feedback}</p>{/if}
    </form>

    <footer class="dn-tradein-footer">
      {#if step > 0}<button class="dn-tradein-back" type="button" onclick={() => move(step - 1)}><Icon name="arrow-left" size={17} />{i18n.t("m_76900f1bfd16")}</button>{/if}
      {#if step < 2}
        <button class="dn-tradein-primary" type="button" onclick={() => move(step + 1)}>{step === 0 ? i18n.t("m_7ef2846a7d92") : i18n.t("m_d2b55d5b18b9")}<Icon name="arrow-right" size={18} /></button>
      {:else}
        <button class="dn-tradein-primary" type="button" disabled={sharing} onclick={share}>{sharing ? i18n.t("m_7001d98040b4") : i18n.t("m_38602fbd1ebc")}<Icon name="arrow-right" size={18} /></button>
      {/if}
    </footer>
  </div>
</dialog>

<style>
  button { cursor: pointer; font: inherit; }
  .dn-tradein-enquiry { display: grid; gap: 0; }
  .dn-tradein-enquiry > h1 { max-width: 620px; margin: 0; color: #202329; font-size: var(--dn-text-fluid-section); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-section); letter-spacing: var(--dn-tracking-heading); }
  .dn-tradein-entry-segments { width: var(--dn-entry-segment-width); margin: 18px auto 0; }
  .dn-tradein-reference { margin-top: var(--dn-space-3); }
  .dn-tradein-reference-hint { margin: var(--dn-space-2) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-tradein-review-reference { overflow-wrap: anywhere; }
  .dn-tradein-start { margin: 14px auto 0; }
  .dn-tradein-primary:is(:hover,:focus-visible) { background: var(--dn-red-hover); }
  :global(body:has(.dn-tradein-dialog[open])) { position: fixed; top: var(--dn-tradein-scroll,0); width: 100%; overflow: hidden; }
  .dn-tradein-dialog { width: min(640px,calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 40px); margin: auto; padding: 0; border: 0; border-radius: 22px; background: #fff; color: #202329; overflow: hidden; }
  .dn-tradein-dialog::backdrop { background: rgba(7,9,12,.68); backdrop-filter: blur(2px); }
  .dn-tradein-panel { display: flex; max-height: calc(100dvh - 40px); flex-direction: column; }
  .dn-tradein-header { display: flex; flex: 0 0 auto; align-items: flex-start; gap: 14px; padding: 22px 24px 14px; }
  .dn-tradein-header > div { min-width: 0; flex: 1; }
  .dn-tradein-header p { margin: 0 0 4px; color: var(--dn-red); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); letter-spacing: var(--dn-tracking-label); text-transform: uppercase; }
  .dn-tradein-header h2 { margin: 0; font-size: var(--dn-text-heading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-tradein-close { border: 0; border-radius: 50%; background: #f2f3f5; color: #202329; }
  .dn-tradein-progress { flex: 0 0 auto; padding: 0 24px 16px; border-bottom: 1px solid #e8eaed; }
  .dn-tradein-progress__copy { display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #686f79; font-size: var(--dn-text-meta); }
  .dn-tradein-progress__copy strong { color: #30343a; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-tradein-progress__bar { height: 3px; margin-top: 10px; border-radius: 999px; background: #eceef1; overflow: hidden; }
  .dn-tradein-progress__bar i { display: block; height: 100%; border-radius: inherit; background: var(--dn-red); transition: width 180ms ease; }
  .dn-tradein-body { min-height: 0; flex: 1; margin: 0; padding: 22px 24px 26px; overflow-y: auto; overscroll-behavior: contain; }
  .dn-tradein-fields { display: grid; gap: 16px; }
  .dn-tradein-fields label, .dn-tradein-notes { display: block; min-width: 0; color: #353a41; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-meta); }
  .dn-tradein-fields label > span { color: var(--dn-red); }
  .dn-tradein-fields small, .dn-tradein-notes small { color: #7a818b; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-regular); }
  .dn-tradein-pair { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
  .dn-tradein-fields input, .dn-tradein-notes textarea { display: block; width: 100%; min-height: var(--dn-control-height-editor); margin-top: 7px; padding: var(--dn-space-2) var(--dn-space-3); box-sizing: border-box; border: 1px solid #d5dae0; border-radius: 12px; background: #fff; color: #202329; font: var(--dn-entry-font); }
  .dn-tradein-notes textarea { min-height: 96px; resize: vertical; }
  .dn-tradein-fields input:focus, .dn-tradein-notes textarea:focus { border-color: #202329; outline: 2px solid rgba(32,35,41,.12); outline-offset: 1px; }
  .dn-tradein-fields input::placeholder, .dn-tradein-notes textarea::placeholder { color: #8a919b; opacity: 1; }
  .dn-tradein-note { margin: 14px 0 0; color: #747b85; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-tradein-section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
  .dn-tradein-section-heading h3 { margin: 0; color: #25292f; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-meta); }
  .dn-tradein-section-heading p { margin: 4px 0 0; color: #737a84; font-size: var(--dn-text-body); line-height: var(--dn-leading-meta); }
  .dn-tradein-section-heading > span { flex: 0 0 auto; color: #737a84; font-size: var(--dn-text-meta); }
  .dn-tradein-upload { position: relative; display: flex; min-height: 84px; align-items: center; justify-content: center; gap: 12px; margin-top: 12px; padding: 12px; border: 1px dashed #aeb5bf; border-radius: 14px; background: #fafbfc; cursor: pointer; }
  .dn-tradein-upload > span { font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); }
  .dn-tradein-upload small { display: block; margin-top: 3px; color: #737a84; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-regular); }
  .dn-tradein-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .dn-tradein-upload:focus-within { outline: 2px solid #202329; outline-offset: 3px; }
  .dn-tradein-error { margin: 8px 0 0; color: #9b111e; font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
  .dn-tradein-photo-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin: 12px 0 0; padding: 0; list-style: none; }
  .dn-tradein-photo-grid li { position: relative; min-width: 0; }
  .dn-tradein-photo-grid img { display: block; width: 100%; aspect-ratio: 4/3; border-radius: 10px; object-fit: cover; }
  .dn-tradein-photo-grid button { position: absolute; top: 3px; right: 3px; display: grid; width: var(--dn-control-height-default); height: var(--dn-control-height-default); place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #202329; }
  .dn-tradein-notes { margin-top: 22px; }
  .dn-tradein-contact-block { margin-top: 22px; padding-top: 20px; border-top: 1px solid #e7e9ec; }
  .dn-tradein-contact-block .dn-tradein-fields { margin-top: 12px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .dn-tradein-review-card { padding: 18px; border: 1px solid #e0e3e7; border-radius: 16px; background: #f8f9fa; }
  .dn-tradein-review-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .dn-tradein-review-top > span { padding: 5px 9px; border-radius: 999px; background: #202329; color: #fff; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-tradein-review-top button { min-height: var(--dn-control-height-default); padding: 0; border: 0; background: transparent; color: #373c43; font: var(--dn-compact-control-font); text-decoration: underline; text-underline-offset: 3px; }
  .dn-tradein-review-card h3 { margin: 14px 0 0; font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-tradein-review-card > p { margin: 5px 0 0; color: #626a74; font-size: var(--dn-text-body); line-height: var(--dn-leading-meta); }
  .dn-tradein-review-note { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e0e3e7; color: #4e555f; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); white-space: pre-wrap; }
  .dn-tradein-review-contact { display: grid; gap: 3px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #e0e3e7; font-size: var(--dn-control-size); }
  .dn-tradein-review-contact span { color: #5f6670; overflow-wrap: anywhere; }
  .dn-tradein-review-photos { display: flex; gap: 8px; margin-top: 14px; overflow-x: auto; }
  .dn-tradein-review-photos img { width: 86px; height: 64px; flex: 0 0 86px; border-radius: 8px; object-fit: cover; }
  .dn-tradein-next-step { margin-top: 16px; padding: 14px 15px; border-radius: 13px; background: #fff2f2; color: #3e3334; }
  .dn-tradein-next-step strong { font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-tradein-next-step p { margin: 4px 0 0; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
  .dn-tradein-copy, .dn-tradein-review-call { display: flex; width: 100%; min-height: var(--dn-control-height-default); align-items: center; justify-content: center; gap: var(--dn-entry-action-gap); margin-top: 10px; padding: 0 var(--dn-space-4); box-sizing: border-box; border-radius: 12px; font: var(--dn-compact-control-font); text-decoration: none; }
  .dn-tradein-copy { border: 1px solid #d7dbe0; background: #fff; color: #24282e; }
  .dn-tradein-review-call { border: 0; background: #202329; color: #fff; }
  .dn-tradein-feedback { margin: 12px 0 0; padding: 11px 12px; border-radius: 10px; background: #f0f2f4; color: #424850; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-tradein-footer { display: flex; flex: 0 0 auto; align-items: center; gap: 10px; padding: 14px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-tradein-back { display: flex; min-height: var(--dn-control-height-default); align-items: center; gap: var(--dn-entry-action-gap); padding: 0 4px; border: 0; background: transparent; color: #30343a; font: var(--dn-compact-control-font); }
  .dn-tradein-primary { display: flex; min-height: var(--dn-control-height-default); flex: 1; align-items: center; justify-content: center; gap: var(--dn-entry-action-gap); padding: 0 var(--dn-space-4); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); line-height: var(--dn-leading-control); }
  .dn-tradein-primary:disabled { opacity: .6; cursor: wait; }

  :global(.dn-contact-intent--tradein .dn-contact-workflow-title),
  :global(.dn-contact-intent--tradein .dn-contact-intent__heading),
  :global(.dn-contact-intent--tradein .dn-contact-selected),
  :global(.dn-contact-intent--tradein .dn-contact-intent__main > .dn-contact-button) { display: none; }

  @media (min-width: 768px) {
    :global(.dn-contact-intent--tradein .dn-contact-intent__main) { background: #fff; }
  }
  @media (max-width: 767px) {

    :global(.dn-contact-intent--tradein > .dn-contact-workflow-call) { display: none; }
    .dn-tradein-enquiry > h1 { margin-inline: auto; font-size: var(--dn-text-heading); text-align: center; }
    .dn-tradein-reference-hint { text-align: center; }
    .dn-tradein-entry-segments { margin-top: 16px; }
    .dn-tradein-start { margin-top: var(--dn-space-3); }
    .dn-tradein-dialog { inset: var(--dn-form-dialog-top) 0 auto; width: 100%; height: var(--dn-form-dialog-height); max-height: var(--dn-form-dialog-height); margin: 0; border-radius: 0 0 var(--dn-radius-lg) var(--dn-radius-lg); }
    .dn-tradein-panel { height: 100%; max-height: 100%; }
    .dn-tradein-header { padding: 18px 16px 12px; }
    .dn-tradein-header h2 { font-size: var(--dn-text-subheading); }
    .dn-tradein-progress { padding: 0 16px 14px; }
    .dn-tradein-body { padding: 18px 16px 22px; }
    .dn-tradein-footer { padding: 11px 16px max(12px,env(safe-area-inset-bottom)); }
    .dn-tradein-contact-block .dn-tradein-fields { grid-template-columns: 1fr; }
  }

  @media (max-width: 374px) {
    :global(.dn-contact-intent--tradein .dn-contact-intent__main) { padding-inline: 16px; }
    .dn-tradein-enquiry > h1 { font-size: var(--dn-text-heading); }
    .dn-tradein-pair { gap: 8px; }
  }

  @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .dn-tradein-dialog[open] { animation: tradein-enter 220ms cubic-bezier(.16,1,.3,1); }
    @keyframes tradein-enter { from { transform: translateY(-12px); } to { transform: translateY(0); } }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-tradein-dialog[open] { animation: none; }
    .dn-tradein-progress__bar i { transition: none; }
  }
</style>
