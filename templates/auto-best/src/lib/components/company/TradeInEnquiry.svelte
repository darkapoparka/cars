<script lang="ts">
  import { preserveScrollOffset, trapDialogTab } from '$lib/ui/overlay';
  import { validateVehicleIdentity, type VehicleIdentityErrors } from '$data/enquiry';
  import { setIdentityValidity, clearIdentityError } from '$lib/ui/enquiry-validation';
  import { appendEnquiryPhotos, removeEnquiryPhoto, releaseEnquiryPhotos, type EnquiryPhoto } from '$lib/ui/enquiry-photos';
  import { onDestroy, tick } from 'svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';

  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let heading: HTMLHeadingElement;
  let returnFocus: HTMLElement | undefined;
  let opened = false;
  let releaseOffset: ((restoreScroll?: boolean) => void) | undefined;
  let fieldErrors = $state<VehicleIdentityErrors>({});
  let step = $state(0);
  let purpose = $state('Продажба');
  let make = $state('');
  let model = $state('');
  let year = $state('');
  let mileage = $state('');
  let price = $state('');
  let notes = $state('');
  let name = $state('');
  let phone = $state('');
  let photos = $state<EnquiryPhoto[]>([]);
  let photoError = $state('');
  let feedback = $state('');
  let sharing = $state(false);

  const steps = ['Автомобил', 'Снимки и контакт', 'Изпращане'];
  const vehicleLabel = $derived([make.trim(), model.trim()].filter(Boolean).join(' ') || 'Автомобил');
  const summary = $derived([
    `Заявка за ${purpose.toLowerCase()}`,
    `Автомобил: ${vehicleLabel}`,
    year ? `Година: ${year}` : '',
    mileage ? `Пробег: ${mileage} км` : '',
    price ? `Ориентировъчна цена: ${price} EUR` : '',
    notes.trim() ? `Състояние / детайли: ${notes.trim()}` : '',
    name.trim() ? `Име: ${name.trim()}` : '',
    phone.trim() ? `Телефон: ${phone.trim()}` : '',
    photos.length ? `Снимки: ${photos.length}` : ''
  ].filter(Boolean).join('\n'));

  async function open(event: MouseEvent) {
    returnFocus = event.currentTarget as HTMLElement;
    releaseOffset = preserveScrollOffset('--dn-tradein-scroll');
    opened = true;
    feedback = '';
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function restore(restoreScroll = true) {
    if (!opened) return;
    opened = false;
    releaseOffset?.(restoreScroll);
    if (restoreScroll && returnFocus?.isConnected) returnFocus.focus();
  }

  async function move(next: number) {
    if (next > step) {
      fieldErrors = validateVehicleIdentity(make, model, false, year).errors;
      setIdentityValidity(form, fieldErrors);
      if (!form.reportValidity()) return;
    }
    step = next;
    feedback = '';
    await tick();
    heading.focus();
    form.scrollTop = 0;
  }

  function addPhotos(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const result = appendEnquiryPhotos(photos, input.files ?? [], {
      type: 'Избери JPG, PNG или WebP снимки.', size: 'Всяка снимка трябва да е до 10 MB.', count: 'Можеш да добавиш до 6 снимки.'
    });
    photos = result.photos;
    photoError = result.error;
    input.value = '';
  }

  function removePhoto(url: string) {
    photos = removeEnquiryPhoto(photos, url);
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
    releaseEnquiryPhotos(photos);
    restore(false);
  });
</script>

<div class="dn-tradein-enquiry">
  <h1>Продай или бартер</h1>
  <p class="dn-tradein-lead">Опиши автомобила и добави снимки, за да подготвим данните за оценка.</p>

  <div class="dn-tradein-entry-segments" role="group" aria-label="Избери продажба или бартер">
    {#each ['Продажба', 'Бартер'] as option (option)}
      <button type="button" class:active={purpose === option} aria-pressed={purpose === option} onclick={() => purpose = option}>{option}</button>
    {/each}
  </div>

  <button class="dn-tradein-start" type="button" onclick={open} aria-haspopup="dialog">
    Заяви оценка
    <Icon name="arrow-right" size={19} />
  </button>
  <a class="dn-tradein-call" href={brand.phoneHref} aria-label={`Обади се на ${brand.phone}`}>
    <Icon name="phone" size={17} />
    <span>Обади се · {brand.phone}</span>
  </a>
</div>

<dialog class="dn-tradein-dialog" bind:this={dialog} aria-labelledby="tradein-title" onclose={() => restore()} onkeydown={trapDialogTab} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
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

    <form class="dn-tradein-body" bind:this={form} oninput={(event) => fieldErrors = clearIdentityError(event, fieldErrors)} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        <div class="dn-tradein-fields dn-tradein-fields--vehicle">
          <label>Марка <span aria-hidden="true">*</span><input bind:value={make} name="make" aria-invalid={fieldErrors.make ? true : undefined} required maxlength={60} placeholder="Напр. BMW" autocomplete="off" /></label>
          <label>Модел <span aria-hidden="true">*</span><input bind:value={model} name="model" aria-invalid={fieldErrors.model ? true : undefined} required maxlength={80} placeholder="Напр. 530d xDrive" autocomplete="off" /></label>
          <div class="dn-tradein-pair">
            <label>Година <span aria-hidden="true">*</span><input bind:value={year} name="year" aria-invalid={fieldErrors.year ? true : undefined} required inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="2020" /></label>
            <label>Пробег, км <span aria-hidden="true">*</span><input bind:value={mileage} name="mileage" required inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder="85000" /></label>
          </div>
          <label>Ориентировъчна цена, € <small>по желание</small><input bind:value={price} name="price" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="Напр. 35000" /></label>
        </div>
        <p class="dn-tradein-note">* Нужни за смислен първоначален разговор. Това не е автоматична оценка.</p>
      {:else if step === 1}
        <section class="dn-tradein-photos" aria-labelledby="tradein-photos-title">
          <div class="dn-tradein-section-heading"><div><h3 id="tradein-photos-title">Снимки на автомобила</h3><p>Екстериор, интериор и видими забележки.</p></div><span>{photos.length}/6</span></div>
          <label class="dn-tradein-upload"><Icon name="car" size={25} /><span>Добави снимки<small>JPG, PNG, WebP · до 10 MB всяка</small></span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} aria-label="Добави снимки на автомобила" /></label>
          {#if photoError}<p class="dn-tradein-error" role="alert">{photoError}</p>{/if}
          {#if photos.length}<ul class="dn-tradein-photo-grid">{#each photos as photo (photo.url)}<li><img src={photo.url} alt={photo.file.name} onerror={() => { removePhoto(photo.url); photoError = 'Снимката не може да се отвори. Изберете друг файл.'; }} /><button type="button" aria-label={`Премахни ${photo.file.name}`} onclick={() => removePhoto(photo.url)}><Icon name="x" size={16} /></button></li>{/each}</ul>{/if}
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
          <p>{year} · {mileage} км{#if price} · {price} €{/if}</p>
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
  .dn-tradein-enquiry > h1 { max-width: 620px; margin: 0; color: #202329; font-size: clamp(28px,4vw,38px); font-weight: 680; line-height: 1.08; letter-spacing: -.035em; }
  .dn-tradein-lead { max-width: 48ch; margin: 12px 0 0; color: #555d68; font-size: 16px; line-height: 1.55; }
  .dn-tradein-entry-segments { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 4px; margin-top: 18px; padding: 4px; border-radius: var(--dn-radius-button); background: #eef0f2; }
  .dn-tradein-entry-segments button { min-height: 40px; border: 0; border-radius: var(--dn-radius-button); background: transparent; color: #666d77; font-size: 14px; font-weight: 700; }
  .dn-tradein-entry-segments button.active { background: #fff; color: #202329; box-shadow: 0 1px 4px rgba(17,22,29,.08); }
  .dn-tradein-entry-segments button:focus-visible { outline: 2px solid #202329; outline-offset: 2px; }
  .dn-tradein-start { display: flex; width: 100%; min-height: 54px; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; padding: 12px 18px; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 16px; font-weight: 700; line-height: 1.35; }
  .dn-tradein-start:is(:hover,:focus-visible), .dn-tradein-primary:is(:hover,:focus-visible) { background: var(--dn-red-hover); }
  .dn-tradein-call { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 7px; justify-self: center; margin-top: 10px; padding: 8px 16px; border-radius: var(--dn-radius-button); background: #f1f2f4; color: #2d3238; font-size: 13px; font-weight: 650; text-decoration: none; }
  .dn-tradein-call:is(:hover,:focus-visible) { background: #e7e9ec; }
  :global(body:has(.dn-tradein-dialog[open])) { position: fixed; top: var(--dn-tradein-scroll,0); width: 100%; overflow: hidden; }
  .dn-tradein-dialog { width: min(640px,calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 40px); margin: auto; padding: 0; border: 0; border-radius: 22px; background: #fff; color: #202329; overflow: hidden; }
  .dn-tradein-dialog::backdrop { background: rgba(7,9,12,.68); backdrop-filter: blur(2px); }
  .dn-tradein-panel { display: flex; max-height: calc(100dvh - 40px); flex-direction: column; }
  .dn-tradein-header { display: flex; flex: 0 0 auto; align-items: flex-start; gap: 14px; padding: 22px 24px 14px; }
  .dn-tradein-header > div { min-width: 0; flex: 1; }
  .dn-tradein-header p { margin: 0 0 4px; color: var(--dn-red); font-size: 11px; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
  .dn-tradein-header h2 { margin: 0; font-size: 25px; font-weight: 680; line-height: 1.16; letter-spacing: -.03em; }
  .dn-tradein-close { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; border: 0; border-radius: 50%; background: #f2f3f5; color: #202329; }
  .dn-tradein-progress { flex: 0 0 auto; padding: 0 24px 16px; border-bottom: 1px solid #e8eaed; }
  .dn-tradein-progress__copy { display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #686f79; font-size: 12px; }
  .dn-tradein-progress__copy strong { color: #30343a; font-size: 12px; font-weight: 700; }
  .dn-tradein-progress__bar { height: 3px; margin-top: 10px; border-radius: 999px; background: #eceef1; overflow: hidden; }
  .dn-tradein-progress__bar i { display: block; height: 100%; border-radius: inherit; background: var(--dn-red); transition: width 180ms ease; }
  .dn-tradein-body { min-height: 0; flex: 1; margin: 0; padding: 22px 24px 26px; overflow-y: auto; overscroll-behavior: contain; }
  .dn-tradein-fields { display: grid; gap: 16px; }
  .dn-tradein-fields label, .dn-tradein-notes { display: block; min-width: 0; color: #353a41; font-size: 14px; font-weight: 650; line-height: 1.35; }
  .dn-tradein-fields label > span { color: var(--dn-red); }
  .dn-tradein-fields small, .dn-tradein-notes small { color: #7a818b; font-size: 11px; font-weight: 450; }
  .dn-tradein-pair { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
  .dn-tradein-fields input, .dn-tradein-notes textarea { display: block; width: 100%; min-height: 50px; margin-top: 7px; padding: 12px 13px; box-sizing: border-box; border: 1px solid #d5dae0; border-radius: 12px; background: #fff; color: #202329; font: inherit; font-size: 16px; font-weight: 450; }
  .dn-tradein-notes textarea { min-height: 96px; resize: vertical; }
  .dn-tradein-fields input:focus, .dn-tradein-notes textarea:focus { border-color: #202329; outline: 2px solid rgba(32,35,41,.12); outline-offset: 1px; }
  .dn-tradein-fields input::placeholder, .dn-tradein-notes textarea::placeholder { color: #8a919b; opacity: 1; }
  .dn-tradein-note { margin: 14px 0 0; color: #747b85; font-size: 12px; line-height: 1.5; }
  .dn-tradein-section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
  .dn-tradein-section-heading h3 { margin: 0; color: #25292f; font-size: 17px; font-weight: 680; line-height: 1.35; }
  .dn-tradein-section-heading p { margin: 4px 0 0; color: #737a84; font-size: 12px; line-height: 1.45; }
  .dn-tradein-section-heading > span { flex: 0 0 auto; color: #737a84; font-size: 12px; }
  .dn-tradein-upload { position: relative; display: flex; min-height: 84px; align-items: center; justify-content: center; gap: 12px; margin-top: 12px; padding: 12px; border: 1px dashed #aeb5bf; border-radius: 14px; background: #fafbfc; cursor: pointer; }
  .dn-tradein-upload > span { font-size: 15px; font-weight: 650; }
  .dn-tradein-upload small { display: block; margin-top: 3px; color: #737a84; font-size: 11px; font-weight: 450; }
  .dn-tradein-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .dn-tradein-upload:focus-within { outline: 2px solid #202329; outline-offset: 3px; }
  .dn-tradein-error { margin: 8px 0 0; color: #9b111e; font-size: 13px; line-height: 1.45; }
  .dn-tradein-photo-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 8px; margin: 12px 0 0; padding: 0; list-style: none; }
  .dn-tradein-photo-grid li { position: relative; min-width: 0; }
  .dn-tradein-photo-grid img { display: block; width: 100%; aspect-ratio: 4/3; border-radius: 10px; object-fit: cover; }
  .dn-tradein-photo-grid button { position: absolute; top: 3px; right: 3px; display: grid; width: 38px; height: 38px; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.95); color: #202329; }
  .dn-tradein-notes { margin-top: 22px; }
  .dn-tradein-contact-block { margin-top: 22px; padding-top: 20px; border-top: 1px solid #e7e9ec; }
  .dn-tradein-contact-block .dn-tradein-fields { margin-top: 12px; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .dn-tradein-review-card { padding: 18px; border: 1px solid #e0e3e7; border-radius: 16px; background: #f8f9fa; }
  .dn-tradein-review-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .dn-tradein-review-top > span { padding: 5px 9px; border-radius: 999px; background: #202329; color: #fff; font-size: 11px; font-weight: 700; }
  .dn-tradein-review-top button { min-height: 40px; padding: 6px 0; border: 0; background: transparent; color: #373c43; font-size: 12px; font-weight: 650; text-decoration: underline; text-underline-offset: 3px; }
  .dn-tradein-review-card h3 { margin: 14px 0 0; font-size: 22px; font-weight: 680; line-height: 1.2; letter-spacing: -.025em; }
  .dn-tradein-review-card > p { margin: 5px 0 0; color: #626a74; font-size: 14px; line-height: 1.45; }
  .dn-tradein-review-note { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e0e3e7; color: #4e555f; font-size: 13px; line-height: 1.55; white-space: pre-wrap; }
  .dn-tradein-review-contact { display: grid; gap: 3px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #e0e3e7; font-size: 13px; }
  .dn-tradein-review-contact span { color: #5f6670; overflow-wrap: anywhere; }
  .dn-tradein-review-photos { display: flex; gap: 8px; margin-top: 14px; overflow-x: auto; }
  .dn-tradein-review-photos img { width: 86px; height: 64px; flex: 0 0 86px; border-radius: 8px; object-fit: cover; }
  .dn-tradein-next-step { margin-top: 16px; padding: 14px 15px; border-radius: 13px; background: #fff2f2; color: #3e3334; }
  .dn-tradein-next-step strong { font-size: 13px; font-weight: 750; }
  .dn-tradein-next-step p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; }
  .dn-tradein-copy, .dn-tradein-review-call { display: flex; width: 100%; min-height: 46px; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; padding: 10px 14px; box-sizing: border-box; border-radius: 12px; font-size: 14px; font-weight: 650; text-decoration: none; }
  .dn-tradein-copy { border: 1px solid #d7dbe0; background: #fff; color: #24282e; }
  .dn-tradein-review-call { border: 0; background: #202329; color: #fff; }
  .dn-tradein-feedback { margin: 12px 0 0; padding: 11px 12px; border-radius: 10px; background: #f0f2f4; color: #424850; font-size: 13px; line-height: 1.5; }
  .dn-tradein-footer { display: flex; flex: 0 0 auto; align-items: center; gap: 10px; padding: 14px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-tradein-back { display: flex; min-height: 48px; align-items: center; gap: 5px; padding: 0 4px; border: 0; background: transparent; color: #30343a; font-size: 13px; font-weight: 650; }
  .dn-tradein-primary { display: flex; min-height: 50px; flex: 1; align-items: center; justify-content: center; gap: 9px; padding: 11px 16px; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 15px; font-weight: 700; }
  .dn-tradein-primary:disabled { opacity: .6; cursor: wait; }

  :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-workflow-title),
  :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-intent__heading),
  :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-selected),
  :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-intent__main > .dn-contact-button) { display: none; }

  @media (min-width: 768px) {
    :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-intent__main) { background: #fff; }
  }
  @media (max-width: 767px) {
    :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-intent__main) { padding: 22px 18px 14.4px; }
    :global(.dn-contact-intent:has(.dn-tradein-enquiry) > .dn-contact-workflow-call) { display: none; }
    .dn-tradein-enquiry > h1 { margin-inline: auto; font-size: 27px; text-align: center; }
    .dn-tradein-lead { margin: 10px auto 0; font-size: 14px; line-height: 1.5; text-align: center; }
    .dn-tradein-entry-segments { margin-top: 16px; }
    .dn-tradein-start { height: 44px; min-height: 44px; margin-top: 12px; padding-block: 0; font-size: 14px; }
    .dn-tradein-dialog { inset: auto 0 0; width: 100%; height: calc(100dvh - max(18px,env(safe-area-inset-top))); max-height: 920px; margin: 0; border-radius: 24px 24px 0 0; }
    .dn-tradein-panel { height: 100%; max-height: 100%; }
    .dn-tradein-header { padding: 18px 16px 12px; }
    .dn-tradein-header h2 { font-size: 22px; }
    .dn-tradein-progress { padding: 0 16px 14px; }
    .dn-tradein-body { padding: 18px 16px 22px; }
    .dn-tradein-footer { padding: 11px 16px max(12px,env(safe-area-inset-bottom)); }
    .dn-tradein-contact-block .dn-tradein-fields { grid-template-columns: 1fr; }
    .dn-tradein-primary { min-height: 52px; }
  }

  @media (max-width: 374px) {
    :global(.dn-contact-intent:has(.dn-tradein-enquiry) .dn-contact-intent__main) { padding-inline: 16px; }
    .dn-tradein-enquiry > h1 { font-size: 25px; }
    .dn-tradein-pair { gap: 8px; }
  }

  @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .dn-tradein-dialog[open] { animation: tradein-enter 220ms cubic-bezier(.16,1,.3,1); }
    @keyframes tradein-enter { from { transform: translateY(32px); } to { transform: translateY(0); } }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-tradein-progress__bar i { transition: none; }
  }
</style>
