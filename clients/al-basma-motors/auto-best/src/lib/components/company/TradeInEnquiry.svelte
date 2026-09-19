<script lang="ts">
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

  const steps = ['Автомобил', 'Снимки и контакт', 'Изпращане'];
  const vehicleLabel = $derived([make.trim(), model.trim()].filter(Boolean).join(' ') || (vehicleReference?.kind === 'listing' ? 'Автомобилът от обявата' : 'Автомобил'));
  const summary = $derived([
    `Заявка за ${purpose.toLowerCase()}`,
    `Автомобил: ${vehicleLabel}`,
    vehicleReference ? `${vehicleReference.kind === 'vin' ? 'VIN' : 'Обява'}: ${vehicleReference.value}` : '',
    year ? `Година: ${year}` : '',
    mileage ? `Пробег: ${mileage} км` : '',
    price ? `Ориентировъчна цена: ${price} EUR` : '',
    notes.trim() ? `Състояние / детайли: ${notes.trim()}` : '',
    name.trim() ? `Име: ${name.trim()}` : '',
    phone.trim() ? `Телефон: ${phone.trim()}` : '',
    photos.length ? `Снимки: ${photos.length}` : ''
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
      referenceError = 'Добави валиден линк към обява или VIN от 17 знака.';
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
        photoError = 'Избери JPG, PNG или WebP снимки.';
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        photoError = 'Всяка снимка трябва да е до 10 MB.';
        continue;
      }
      if (photos.some((photo) => photo.file.name === file.name && photo.file.size === file.size && photo.file.lastModified === file.lastModified)) continue;
      if (photos.length >= 6) {
        photoError = 'Можеш да добавиш до 6 снимки.';
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
      feedback = 'Текстът е копиран. Постави го в избраното приложение или се обади на екипа.';
    } catch {
      feedback = 'Копирането не е достъпно. Можеш да маркираш текста от прегледа.';
    }
  }

  async function share() {
    sharing = true;
    feedback = '';
    try {
      const files = photos.map((photo) => photo.file);
      if (files.length && !navigator.canShare?.({ files })) {
        feedback = 'Този браузър не може да споделя снимките. Копирай текста и добави снимките в приложението, което използваш.';
        return;
      }
      if (!navigator.share) {
        await copy();
        return;
      }
      await navigator.share({ title: `Оценка на автомобил — ${brand.name}`, text: summary, ...(files.length ? { files } : {}) });
      feedback = `Споделянето приключи. Увери се, че данните са изпратени към ${brand.name}.`;
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        feedback = 'Споделянето не успя. Копирай текста или опитай отново.';
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
  <h1>Продай или бартер</h1>
  <p class="dn-tradein-reference-hint" id="tradein-reference-hint">Обява от mobile.bg, cars.bg или VIN</p>

  <div class="dn-tradein-entry-segments dn-segmented-control" role="group" aria-label="Избери продажба или бартер">
    {#each ['Продажба', 'Бартер'] as option (option)}
      <button class="dn-segmented-option" type="button" class:active={purpose === option} aria-pressed={purpose === option} onclick={() => purpose = option}>{option}</button>
    {/each}
  </div>

  <div class="dn-tradein-reference">
    <EnquiryEntryField id="tradein-reference" kind="reference" value={reference} bind:this={referenceEditor} onapply={(value) => { reference = value; referenceError = ''; }} />
  </div>

  <button class="dn-tradein-start" type="button" onclick={open} aria-haspopup="dialog">
    Заяви оценка
    <Icon name="arrow-right" size={19} />
  </button>
</div>

<dialog {@attach dialogViewport} class="dn-tradein-dialog" bind:this={dialog} aria-labelledby="tradein-title" onclose={restore} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <div class="dn-tradein-panel">
    <header class="dn-tradein-header">
      <div>
        <p>Оценка на автомобил</p>
        <h2 id="tradein-title" tabindex="-1" bind:this={heading}>{step === 0 ? 'Разкажи за автомобила' : step === 1 ? 'Снимки и контакт' : 'Преглед и изпращане'}</h2>
      </div>
      <button class="dn-tradein-close" type="button" aria-label="Затвори заявката" onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
    </header>

    <div class="dn-tradein-progress" aria-label={`Стъпка ${step + 1} от 3: ${steps[step]}`}>
      <div class="dn-tradein-progress__copy"><span>Стъпка {step + 1} от 3</span><strong>{steps[step]}</strong></div>
      <div class="dn-tradein-progress__bar" aria-hidden="true"><i style:width={`${((step + 1) / 3) * 100}%`}></i></div>
    </div>

    <form class="dn-tradein-body" bind:this={form} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        <div class="dn-tradein-fields dn-tradein-fields--vehicle">
        <label class="dn-tradein-reference-edit">Линк към обява или VIN <small>по желание</small><input name="reference" bind:value={reference} oninput={() => referenceError = ''} maxlength={2048} autocomplete="off" autocapitalize="none" spellcheck={false} placeholder="Линк или VIN" aria-invalid={referenceError ? true : undefined} aria-describedby={referenceError ? 'tradein-reference-edit-error' : undefined} /></label>
        {#if referenceError}<p class="dn-tradein-error" id="tradein-reference-edit-error" role="alert">{referenceError}</p>{/if}
          <label>Марка {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input bind:value={make} name="make" required={!vehicleReference} maxlength={60} placeholder="Напр. BMW" autocomplete="off" /></label>
          <label>Модел {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input bind:value={model} name="model" required={!vehicleReference} maxlength={80} placeholder="Напр. 530d xDrive" autocomplete="off" /></label>
          <div class="dn-tradein-pair">
            <label>Година {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input bind:value={year} name="year" required={!vehicleReference} inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="2020" /></label>
            <label>Пробег, км {#if !vehicleReference}<span aria-hidden="true">*</span>{/if}<input bind:value={mileage} name="mileage" required={!vehicleReference} inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder="85000" /></label>
          </div>
          <label>Ориентировъчна цена, € <small>по желание</small><input bind:value={price} name="price" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="Напр. 35000" /></label>
        </div>
        <p class="dn-tradein-note">{vehicleReference ? 'Обявата или VIN се добавя към заявката. Останалите данни са по желание.' : '* Добави основните данни, ако нямаш обява или VIN.'} Това не е автоматична оценка.</p>
      {:else if step === 1}
        <section class="dn-tradein-photos" aria-labelledby="tradein-photos-title">
          <div class="dn-tradein-section-heading"><div><h3 id="tradein-photos-title">Снимки на автомобила</h3><p>Екстериор, интериор и видими забележки.</p></div><span>{photos.length}/6</span></div>
          <label class="dn-tradein-upload"><Icon name="car" size={25} /><span>Добави снимки<small>JPG, PNG, WebP · до 10 MB всяка</small></span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} aria-label="Добави снимки на автомобила" /></label>
          {#if photoError}<p class="dn-tradein-error" role="alert">{photoError}</p>{/if}
          {#if photos.length}<ul class="dn-tradein-photo-grid">{#each photos as photo (photo.url)}<li><img src={photo.url} alt={photo.file.name} /><button type="button" aria-label={`Премахни ${photo.file.name}`} onclick={() => removePhoto(photo.url)}><Icon name="x" size={16} /></button></li>{/each}</ul>{/if}
        </section>

        <label class="dn-tradein-notes">Състояние, оборудване и забележки <small>по желание</small><textarea bind:value={notes} maxlength={1500} rows="3" placeholder="Обслужване, оборудване, козметични или технически забележки…"></textarea></label>

        <section class="dn-tradein-contact-block" aria-labelledby="tradein-contact-title">
          <div class="dn-tradein-section-heading"><div><h3 id="tradein-contact-title">Контакт за обратна връзка</h3><p>Добавя се към текста, който ще споделиш.</p></div></div>
          <div class="dn-tradein-fields">
            <label>Име <small>по желание</small><input bind:value={name} maxlength={80} autocomplete="name" placeholder="Твоето име" /></label>
            <label>Телефон <small>по желание</small><input bind:value={phone} type="tel" maxlength={25} autocomplete="tel" inputmode="tel" placeholder="08…" /></label>
          </div>
        </section>
        <p class="dn-tradein-note">Снимките остават на устройството до момента, в който избереш да ги споделиш.</p>
      {:else}
        <div class="dn-tradein-review-card">
          <div class="dn-tradein-review-top"><span>{purpose}</span><button type="button" onclick={() => move(0)}>Редактирай</button></div>
          <h3>{vehicleLabel}</h3>
          {#if year || mileage || price}<p>{[year, mileage ? `${mileage} км` : '', price ? `${price} €` : ''].filter(Boolean).join(' · ')}</p>{/if}
          {#if vehicleReference}<p class="dn-tradein-review-reference">{vehicleReference.kind === 'vin' ? 'VIN' : 'Обява'}: {vehicleReference.value}</p>{/if}
          {#if notes.trim()}<div class="dn-tradein-review-note">{notes.trim()}</div>{/if}
          {#if name.trim() || phone.trim()}<div class="dn-tradein-review-contact"><strong>Контакт</strong><span>{[name.trim(), phone.trim()].filter(Boolean).join(' · ')}</span></div>{/if}
          {#if photos.length}<div class="dn-tradein-review-photos">{#each photos as photo (photo.url)}<img src={photo.url} alt={photo.file.name} />{/each}</div>{/if}
        </div>

        <div class="dn-tradein-next-step">
          <strong>Следваща стъпка</strong>
          <p>Заявката още не е изпратена. Сподели данните към {brand.name}, копирай текста или се обади директно.</p>
        </div>
        {#if feedback}<p class="dn-tradein-feedback" role="status">{feedback}</p>{/if}
        <button class="dn-tradein-copy" type="button" onclick={copy}>Копирай текста</button>
        <a class="dn-tradein-review-call" href={brand.phoneHref}><Icon name="phone" size={18} />Обади се · {brand.phone}</a>
      {/if}

      {#if feedback && step < 2}<p class="dn-tradein-feedback" role="status">{feedback}</p>{/if}
    </form>

    <footer class="dn-tradein-footer">
      {#if step > 0}<button class="dn-tradein-back" type="button" onclick={() => move(step - 1)}><Icon name="arrow-left" size={17} />Назад</button>{/if}
      {#if step < 2}
        <button class="dn-tradein-primary" type="button" onclick={() => move(step + 1)}>{step === 0 ? 'Към снимките' : 'Прегледай заявката'}<Icon name="arrow-right" size={18} /></button>
      {:else}
        <button class="dn-tradein-primary" type="button" disabled={sharing} onclick={share}>{sharing ? 'Отваряне…' : 'Сподели заявката'}<Icon name="arrow-right" size={18} /></button>
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
  .dn-tradein-start { display: flex; width: var(--dn-entry-action-width); margin-inline: auto; min-height: var(--dn-entry-action-height); align-items: center; justify-content: center; gap: 10px; margin-top: 14px; padding: var(--dn-space-2) var(--dn-space-5); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); line-height: var(--dn-leading-control); }
  .dn-tradein-start:is(:hover,:focus-visible), .dn-tradein-primary:is(:hover,:focus-visible) { background: var(--dn-red-hover); }
  :global(body:has(.dn-tradein-dialog[open])) { position: fixed; top: var(--dn-tradein-scroll,0); width: 100%; overflow: hidden; }
  .dn-tradein-dialog { width: min(640px,calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 40px); margin: auto; padding: 0; border: 0; border-radius: 22px; background: #fff; color: #202329; overflow: hidden; }
  .dn-tradein-dialog::backdrop { background: rgba(7,9,12,.68); backdrop-filter: blur(2px); }
  .dn-tradein-panel { display: flex; max-height: calc(100dvh - 40px); flex-direction: column; }
  .dn-tradein-header { display: flex; flex: 0 0 auto; align-items: flex-start; gap: 14px; padding: 22px 24px 14px; }
  .dn-tradein-header > div { min-width: 0; flex: 1; }
  .dn-tradein-header p { margin: 0 0 4px; color: var(--dn-red); font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); letter-spacing: var(--dn-tracking-label); text-transform: uppercase; }
  .dn-tradein-header h2 { margin: 0; font-size: var(--dn-text-heading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-tradein-close { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; border: 0; border-radius: 50%; background: #f2f3f5; color: #202329; }
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
  .dn-tradein-fields input, .dn-tradein-notes textarea { display: block; width: 100%; min-height: var(--dn-control-height-editor); margin-top: 7px; padding: var(--dn-space-2) var(--dn-space-3); box-sizing: border-box; border: 1px solid #d5dae0; border-radius: 12px; background: #fff; color: #202329; font: inherit; font-size: var(--dn-control-size); font-weight: var(--dn-weight-regular); }
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
  .dn-tradein-photo-grid button { position: absolute; top: 3px; right: 3px; display: grid; width: 38px; height: 38px; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #202329; }
  .dn-tradein-notes { margin-top: 22px; }
  .dn-tradein-contact-block { margin-top: 22px; padding-top: 20px; border-top: 1px solid #e7e9ec; }
  .dn-tradein-contact-block .dn-tradein-fields { margin-top: 12px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .dn-tradein-review-card { padding: 18px; border: 1px solid #e0e3e7; border-radius: 16px; background: #f8f9fa; }
  .dn-tradein-review-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .dn-tradein-review-top > span { padding: 5px 9px; border-radius: 999px; background: #202329; color: #fff; font-size: var(--dn-text-meta); font-weight: var(--dn-weight-semibold); }
  .dn-tradein-review-top button { min-height: 40px; padding: 6px 0; border: 0; background: transparent; color: #373c43; font-size: var(--dn-control-size); font-weight: var(--dn-control-weight); text-decoration: underline; text-underline-offset: 3px; }
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
  .dn-tradein-copy, .dn-tradein-review-call { display: flex; width: 100%; min-height: 46px; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; padding: 10px 14px; box-sizing: border-box; border-radius: 12px; font-size: var(--dn-control-size); font-weight: var(--dn-control-weight); text-decoration: none; }
  .dn-tradein-copy { border: 1px solid #d7dbe0; background: #fff; color: #24282e; }
  .dn-tradein-review-call { border: 0; background: #202329; color: #fff; }
  .dn-tradein-feedback { margin: 12px 0 0; padding: 11px 12px; border-radius: 10px; background: #f0f2f4; color: #424850; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-tradein-footer { display: flex; flex: 0 0 auto; align-items: center; gap: 10px; padding: 14px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-tradein-back { display: flex; min-height: 48px; align-items: center; gap: 5px; padding: 0 4px; border: 0; background: transparent; color: #30343a; font-size: var(--dn-control-size); font-weight: var(--dn-control-weight); }
  .dn-tradein-primary { display: flex; min-height: var(--dn-control-height-editor); flex: 1; align-items: center; justify-content: center; gap: 9px; padding: var(--dn-space-2) var(--dn-space-4); border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); line-height: var(--dn-leading-control); }
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
