<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';
  import { resolveImportUrl } from '$data/company';

  let { kind, importUrl = null }: { kind: 'trade-in' | 'import'; importUrl?: string | null } = $props();
  const selling = $derived(kind === 'trade-in');
  const title = $derived(selling ? 'Offer a vehicle' : 'Import inquiry');
  let dialog: HTMLDialogElement;
  let form: HTMLFormElement;
  let heading: HTMLHeadingElement;
  let linkInput = $state<HTMLInputElement>();
  let returnFocus: HTMLElement | undefined;
  let scrollY = 0;
  let step = $state(0);
  let opened = false;
  let linkDraft = $state<string | null>(null);
  let link = $derived(linkDraft ?? importUrl ?? '');
  let linkError = $state('');
  let selectedLink = $state('');
  let make = $state('');
  let model = $state('');
  let year = $state('');
  let mileage = $state('');
  let budget = $state('');
  let purpose = $state('Sale');
  let name = $state('');
  let phone = $state('');
  let notes = $state('');
  let photos = $state<{ file: File; url: string }[]>([]);
  let photoError = $state('');
  let feedback = $state('');
  let sharing = $state(false);
  const steps = ['Vehicle', 'Details', 'Review'];
  const summary = $derived([
    selling ? `Vehicle for ${purpose.toLowerCase()}` : 'Import inquiry',
    selectedLink ? `Listing: ${selectedLink}` : '',
    `Vehicle: ${[make.trim(), model.trim()].filter(Boolean).join(' ') || 'Based on the selected listing'}`,
    year ? `${selling ? 'Year' : 'Year from'}: ${year}` : '',
    mileage ? `Mileage: ${mileage} miles` : '',
    budget ? `${selling ? 'Asking price' : 'Budget'}: ${budget} EUR` : '',
    notes.trim() ? `Additional details: ${notes.trim()}` : '',
    name.trim() ? `Name: ${name.trim()}` : '',
    phone.trim() ? `Phone: ${phone.trim()}` : '',
    photos.length ? `Selected photos: ${photos.length}` : ''
  ].filter(Boolean).join('\n'));

  const attachDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    return () => {
      if (opened) restore();
    };
  };

  async function open(event: MouseEvent, withoutLink = false) {
    if (!selling && !withoutLink && !resolveImportUrl(link)) {
      linkError = link.trim() ? 'Enter a valid link starting with https:// or http://.' : 'Paste a link or select “I don’t have a listing”.';
      linkInput?.focus();
      return;
    }
    const nextLink = selling || withoutLink ? '' : resolveImportUrl(link) || '';
    if (nextLink !== selectedLink) step = 0;
    selectedLink = nextLink;
    returnFocus = event.currentTarget as HTMLElement;
    scrollY = window.scrollY;
    document.body.style.setProperty('--dn-enquiry-scroll', `-${scrollY}px`);
    opened = true;
    feedback = '';
    dialog.showModal();
    await tick();
    heading.focus();
  }

  function restore() {
    opened = false;
    document.body.style.removeProperty('--dn-enquiry-scroll');
    window.scrollTo(0, scrollY);
    returnFocus?.isConnected && returnFocus.focus();
  }

  async function move(next: number) {
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
        photoError = 'Choose JPG, PNG, or WebP photos.';
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        photoError = 'Each photo must be no larger than 10 MB.';
        continue;
      }
      if (photos.some((photo) => photo.file.name === file.name && photo.file.size === file.size && photo.file.lastModified === file.lastModified)) continue;
      if (photos.length >= 6) { photoError = 'You can add up to 6 photos.'; break; }
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
      feedback = 'Text copied. Photos are not included.';
    } catch {
      feedback = 'Copying is unavailable. Select the text in the preview.';
    }
  }

  async function share() {
    sharing = true;
    feedback = '';
    try {
      const files = photos.map((photo) => photo.file);
      if (files.length && !navigator.canShare?.({ files })) {
        feedback = 'This browser can’t share photos. Copy the text and add the photos in your chosen app.';
        return;
      }
      if (!navigator.share) {
        await copy();
        return;
      }
      await navigator.share({ title, text: summary, ...(files.length ? { files } : {}) });
      feedback = 'Draft only — not sent';
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) feedback = 'Sharing failed. You can copy the text and try again.';
    } finally { sharing = false; }
  }

  onDestroy(() => photos.forEach((photo) => URL.revokeObjectURL(photo.url)));
</script>

<div class="dn-enquiry-entry">
  {#if selling}
    <button class="dn-enquiry-primary" type="button" onclick={open} aria-haspopup="dialog">
      Offer a vehicle <Icon name="arrow-right" size={20} />
    </button>
    <p>Details, photos, and review.</p>
  {:else}
    <label class="dn-sr-only" for="enquiry-listing-link">Listing link</label>
    <div class="dn-enquiry-link-row">
      <input id="enquiry-listing-link" bind:this={linkInput} value={link} oninput={(event) => { linkDraft = event.currentTarget.value; linkError = ''; }} type="url" inputmode="url" maxlength={2048} placeholder="Paste the listing link" autocomplete="off" autocapitalize="none" spellcheck={false} aria-invalid={linkError ? true : undefined} aria-describedby={linkError ? 'enquiry-link-error' : undefined} />
      <button type="button" class="dn-enquiry-link-go" onclick={open} aria-label="Continue with listing" aria-haspopup="dialog"><Icon name="arrow-right" size={22} /></button>
    </div>
    {#if linkError}<p class="dn-enquiry-error" id="enquiry-link-error" role="alert">{linkError}</p>{/if}
    <button class="dn-enquiry-alternative dn-action--dark" type="button" onclick={(event) => open(event, true)} aria-haspopup="dialog">I don’t have a listing — describe your search <Icon name="arrow-right" size={17} /></button>
  {/if}
</div>

<dialog class="dn-enquiry" aria-labelledby="enquiry-title" {@attach attachDialog} onclose={restore} onclick={(event) => { if (event.target === event.currentTarget) dialog.close(); }}>
  <div class="dn-enquiry-panel">
    <header class="dn-enquiry-header">
      <div><h2 id="enquiry-title" tabindex="-1" bind:this={heading}>{step === 0 ? title : step === 1 ? 'A few more details' : 'Review inquiry'}</h2></div>
      <button class="dn-enquiry-close" type="button" aria-label="Close inquiry" onclick={() => dialog.close()}><Icon name="x" size={22} /></button>
    </header>
    <ol class="dn-enquiry-steps" aria-label="Inquiry steps">
      {#each steps as label, index (label)}<li class:current={step === index} class:complete={step > index} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>{/each}
    </ol>

    <form class="dn-enquiry-body" bind:this={form} onsubmit={(event) => { event.preventDefault(); if (step < 2) void move(step + 1); }}>
      {#if step === 0}
        {#if selectedLink}<div class="dn-enquiry-selected-link"><Icon name="globe" size={20} /><span>{selectedLink}</span></div>{/if}
        {#if selling}
          <fieldset class="dn-enquiry-purpose"><legend>What do you prefer?</legend>{#each ['Sale', 'Trade-in inquiry'] as option (option)}<label><input type="radio" bind:group={purpose} value={option} />{option}</label>{/each}</fieldset>
        {/if}
        <div class="dn-enquiry-fields">
          <label>Make{#if !selectedLink}<span aria-hidden="true"> *</span>{/if}<input bind:value={make} name="make" required={!selectedLink} maxlength={60} placeholder="e.g. Audi" autocomplete="off" /></label>
          <label>Model{#if !selectedLink}<span aria-hidden="true"> *</span>{/if}<input bind:value={model} name="model" required={!selectedLink} maxlength={80} placeholder="e.g. A6 Avant" autocomplete="off" /></label>
          <label>{selling ? 'Year' : 'Year from'}<input bind:value={year} name="year" type="text" inputmode="numeric" pattern={'(19|20)[0-9]{2}'} maxlength={4} placeholder="e.g. 2020" /></label>
          {#if selling}<label>Mileage, miles<input bind:value={mileage} name="mileage" inputmode="numeric" pattern={'[0-9]{1,7}'} maxlength={7} placeholder="e.g. 85000" /></label>{/if}
          <label class:wide={!selling}>{selling ? 'Asking price, USD' : 'Budget, USD'} <span class="dn-enquiry-optional">optional</span><input bind:value={budget} name="budget" inputmode="numeric" pattern={'[0-9]{1,8}'} maxlength={8} placeholder="e.g. 35000" /></label>
        </div>
        <p class="dn-enquiry-note">{selectedLink ? 'Add preferences if they differ from the listing.' : '* Required fields.'} Your information stays on this page until you share it.</p>
      {:else if step === 1}
        {#if selling}
          <div class="dn-enquiry-photos">
            <div class="dn-enquiry-photo-heading"><h3>Vehicle photos</h3><span>{photos.length}/6</span></div>
            <p>Exterior, interior, and important details.</p>
            <label class="dn-enquiry-upload"><Icon name="car" size={24} /><span>Add photos<small>JPG, PNG, WebP · up to 10 MB each</small></span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onchange={addPhotos} aria-label="Add vehicle photos" /></label>
            {#if photoError}<p class="dn-enquiry-error" role="alert">{photoError}</p>{/if}
            {#if photos.length}<ul class="dn-enquiry-photo-grid">{#each photos as photo (photo.url)}<li><img src={photo.url} alt={photo.file.name} onerror={() => { removePhoto(photo.url); photoError = 'This photo can’t be opened. Choose another file.'; }} /><button type="button" aria-label={`Remove ${photo.file.name}`} onclick={() => removePhoto(photo.url)}><Icon name="x" size={16} /></button></li>{/each}</ul>{/if}
            <p class="dn-enquiry-note">Photos are for preview on your device only. They haven’t been uploaded or sent.</p>
          </div>
        {/if}
        <label class="dn-enquiry-notes">{selling ? 'Condition and additional details' : 'Preferences and additional details'}<textarea bind:value={notes} maxlength={1500} rows="3" placeholder={selling ? 'Maintenance, features, issues…' : 'Engine, features, country, timeline…'}></textarea></label>
        <div class="dn-enquiry-fields dn-enquiry-contact-fields">
          <label>Name <span class="dn-enquiry-optional">optional</span><input bind:value={name} maxlength={80} autocomplete="name" /></label>
          <label>Phone <span class="dn-enquiry-optional">optional</span><input bind:value={phone} type="tel" maxlength={25} autocomplete="tel" /></label>
        </div>
      {:else}
        <div class="dn-enquiry-review-heading"><h3>Everything in one place</h3><button class="dn-enquiry-text-button" type="button" onclick={() => move(0)}>Edit</button></div>
        <pre class="dn-enquiry-summary">{summary}</pre>
        {#if photos.length}<div class="dn-enquiry-review-photos">{#each photos as photo (photo.url)}<img src={photo.url} alt={photo.file.name} />{/each}</div>{/if}
        <div class="dn-enquiry-review-notice"><strong>Draft only — not sent</strong><p>Share it through an app on your device or copy the text. To speak directly: <a href={brand.phoneHref}>{brand.phone}</a>.</p></div>
        <button class="dn-enquiry-copy" type="button" onclick={copy}>Copy text</button>
      {/if}
      {#if feedback}<p class="dn-enquiry-feedback" role="status">{feedback}</p>{/if}
    </form>

    <footer class="dn-enquiry-footer">
      {#if step > 0}<button class="dn-enquiry-back" type="button" onclick={() => move(step - 1)}><Icon name="arrow-left" size={18} />Back</button>{/if}
      {#if step < 2}<button class="dn-enquiry-primary" type="button" onclick={() => move(step + 1)}>{step === 0 ? 'Continue' : 'Review inquiry'}<Icon name="arrow-right" size={18} /></button>
      {:else}<button class="dn-enquiry-primary" type="button" disabled={sharing} onclick={share}>{sharing ? 'Opening…' : 'Share inquiry'}<Icon name="arrow-right" size={18} /></button>{/if}
    </footer>
  </div>
</dialog>

<style>
  .dn-enquiry-entry { margin-top: 24px; }
  @media (max-width: 991px) {
    .dn-enquiry-entry { text-align: center; }
  }
  button { cursor: pointer; font: inherit; }
  .dn-enquiry-primary { display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: center; gap: 12px; padding: 12px 20px; border: 0; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 16px; font-weight: 600; line-height: 1.4; }
  .dn-enquiry-primary:hover { background: var(--dn-red-hover); }
  .dn-enquiry-primary:disabled { opacity: .6; cursor: wait; }
  .dn-enquiry-entry > p { margin: 10px 0 0; color: #5d626b; font-size: 14px; }
  .dn-enquiry-alternative { display: flex; width: fit-content; max-width: 100%; min-height: 44px; align-items: center; justify-content: center; gap: 8px; margin: 12px auto 0; padding: 8px 16px; border: 0; border-radius: var(--dn-radius-button); font-size: 14px; font-weight: 600; text-align: center; }
  .dn-enquiry-link-row { display: flex; gap: 8px; padding: 6px; background: #f2f3f5; border-radius: 16px; }
  .dn-enquiry-link-row > input { min-width: 0; flex: 1; padding: 8px 10px; border: 0; border-radius: 10px; background: transparent; color: #202329; font-size: 16px; }
  .dn-enquiry-link-go { display: grid; width: 48px; height: 48px; flex: 0 0 48px; place-items: center; border: 0; border-radius: 12px; background: var(--dn-red); color: #fff; }
  .dn-enquiry-text-button { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; padding: 8px 0; border: 0; background: transparent; color: #202329; font-size: 14px; font-weight: 600; text-align: left; text-decoration: underline; text-underline-offset: 4px; }
  :global(body:has(.dn-enquiry[open])) { position: fixed; top: var(--dn-enquiry-scroll, 0); width: 100%; overflow: hidden; }
  .dn-enquiry { width: min(620px, calc(100% - 32px)); max-width: none; max-height: calc(100dvh - 48px); margin: auto; padding: 0; border: 0; border-radius: 20px; background: #fff; color: #202329; overflow: hidden; }
  .dn-enquiry::backdrop { background: rgba(8,10,14,.65); }
  .dn-enquiry-panel { display: flex; max-height: calc(100dvh - 48px); flex-direction: column; }
  .dn-enquiry-header { display: flex; flex: 0 0 auto; align-items: center; gap: 16px; padding: 24px 24px 18px; }
  .dn-enquiry-header > div { min-width: 0; flex: 1; }
  .dn-enquiry-header h2 { margin: 0; font-size: 24px; line-height: 1.25; letter-spacing: -.025em; }
  .dn-enquiry-close { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; border: 0; border-radius: 50%; background: #f2f3f5; color: #202329; }
  .dn-enquiry-steps { display: flex; flex: 0 0 auto; gap: 16px; margin: 0; padding: 0 24px 20px; list-style: none; border-bottom: 1px solid #e7e9ec; }
  .dn-enquiry-steps li { display: flex; align-items: center; gap: 6px; color: #656b74; font-size: 13px; }
  .dn-enquiry-steps span { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: #f2f3f5; font-size: 12px; }
  .dn-enquiry-steps .current { color: #202329; font-weight: 700; }
  .dn-enquiry-steps .current span { background: #202329; color: #fff; }
  .dn-enquiry-steps .complete span { background: #fbeaea; color: #a40000; }
  .dn-enquiry-body { min-height: 0; margin: 0; padding: 24px; overflow-y: auto; overscroll-behavior: contain; }
  .dn-enquiry-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px 14px; }
  .dn-enquiry-fields label, .dn-enquiry-notes { display: block; min-width: 0; font-size: 14px; font-weight: 600; }
  .dn-enquiry-fields input, textarea { display: block; width: 100%; min-height: 50px; margin-top: 8px; padding: 12px; box-sizing: border-box; border: 1px solid #d9dde2; border-radius: 12px; background: #fff; color: #202329; font: inherit; font-size: 16px; font-weight: 400; }
  input::placeholder, textarea::placeholder { color: #69717c; opacity: 1; }
  textarea { resize: vertical; }
  .wide { grid-column: 1 / -1; }
  .dn-enquiry-optional { display: inline-block; color: #656b74; font-size: 12px; font-weight: 400; }
  .dn-enquiry-purpose { display: flex; gap: 8px; margin: 0 0 22px; padding: 0; border: 0; }
  .dn-enquiry-purpose legend { margin-bottom: 10px; font-size: 14px; font-weight: 600; }
  .dn-enquiry-purpose label { display: flex; min-height: 44px; flex: 1; align-items: center; justify-content: center; gap: 8px; border: 1px solid #d9dde2; border-radius: 12px; font-size: 15px; cursor: pointer; }
  .dn-enquiry-purpose label:has(:checked) { border-color: #202329; background: #f2f3f5; }
  .dn-enquiry-purpose input { accent-color: #202329; }
  .dn-enquiry-note { margin: 16px 0 0; color: #656b74; font-size: 13px; line-height: 1.5; }
  .dn-enquiry-selected-link { display: flex; gap: 10px; margin-bottom: 20px; padding: 12px; border-radius: 12px; background: #f2f3f5; font-size: 14px; overflow-wrap: anywhere; }
  .dn-enquiry-selected-link :global(svg) { flex: 0 0 20px; }
  .dn-enquiry-photo-heading, .dn-enquiry-review-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  h3 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.4; }
  .dn-enquiry-photo-heading > span { color: #656b74; font-size: 13px; }
  .dn-enquiry-photos > p:not(.dn-enquiry-error) { margin: 8px 0 14px; color: #656b74; font-size: 13px; line-height: 1.5; }
  .dn-enquiry-upload { position: relative; display: flex; min-height: 80px; align-items: center; justify-content: center; gap: 14px; padding: 12px; border: 1px dashed #aeb5bf; border-radius: 12px; cursor: pointer; }
  .dn-enquiry-upload > span { font-size: 15px; font-weight: 600; }
  .dn-enquiry-upload small { display: block; margin-top: 4px; font-size: 12px; color: #656b74; font-weight: 400; }
  .dn-enquiry-upload input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .dn-enquiry-upload:focus-within { outline: 3px solid #0b57d0; outline-offset: 3px; }
  .dn-enquiry-photo-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; padding: 0; margin: 14px 0; list-style: none; }
  .dn-enquiry-photo-grid li { position: relative; min-width: 0; }
  .dn-enquiry-photo-grid img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 10px; }
  .dn-enquiry-photo-grid button { position: absolute; top: 3px; right: 3px; display: grid; width: 44px; height: 44px; place-items: center; border: 0; border-radius: 50%; background: #fff; color: #202329; }
  .dn-enquiry-contact-fields { margin-top: 20px; }
  .dn-enquiry-footer { display: flex; flex: 0 0 auto; align-items: center; gap: 12px; padding: 16px 24px; border-top: 1px solid #e7e9ec; background: #fff; }
  .dn-enquiry-back { display: flex; min-height: 48px; align-items: center; gap: 6px; padding: 0 4px; border: 0; background: transparent; color: #202329; font-size: 14px; font-weight: 600; }
  .dn-enquiry-summary { margin: 16px 0; padding: 16px; border-radius: 12px; background: #f4f5f7; color: #202329; font: inherit; font-size: 15px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
  .dn-enquiry-review-photos { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 20px; }
  .dn-enquiry-review-photos img { width: 88px; height: 66px; flex: 0 0 88px; object-fit: cover; border-radius: 8px; }
  .dn-enquiry-review-notice { color: #525a66; font-size: 14px; line-height: 1.6; }
  .dn-enquiry-review-notice p { margin: 6px 0 0; }
  .dn-enquiry-review-notice a { color: #202329; text-decoration: underline; }
  .dn-enquiry-copy { min-height: 44px; margin-top: 14px; padding: 10px 16px; border: 1px solid #d9dde2; border-radius: 12px; background: #fff; font-size: 14px; font-weight: 600; }
  .dn-enquiry-error, .dn-enquiry-entry > .dn-enquiry-error { color: #a40000; font-size: 14px; line-height: 1.5; }
  .dn-enquiry-feedback { padding: 12px; border-radius: 10px; background: #f2f3f5; font-size: 14px; line-height: 1.5; }
  @media (max-width: 767px) {
    .dn-enquiry { inset: auto 0 0; width: 100%; height: calc(100dvh - max(24px,env(safe-area-inset-top))); max-height: 900px; margin: 0; border-radius: 24px 24px 0 0; }
    .dn-enquiry-panel { height: 100%; max-height: 100%; }
    .dn-enquiry-header { padding: 20px 16px 16px; }
    .dn-enquiry-header h2 { font-size: 22px; }
    .dn-enquiry-steps { gap: 14px; padding: 0 16px 16px; }
    .dn-enquiry-body { flex: 1; padding: 20px 16px; }
    .dn-enquiry-footer { padding: 12px 16px max(12px,env(safe-area-inset-bottom)); }
    .dn-enquiry-footer .dn-enquiry-primary { padding-inline: 12px; font-size: 15px; }
  }
  @media (prefers-reduced-motion: no-preference) and (max-width: 767px) {
    .dn-enquiry[open] { animation: enquiry-enter 220ms cubic-bezier(.16,1,.3,1); }
    @keyframes enquiry-enter { from { transform: translateY(32px); } to { transform: translateY(0); } }
  }
  @media (max-width: 359px) {
    .dn-enquiry-steps { gap: 10px; }
    .dn-enquiry-steps li { font-size: 12px; }
    .dn-enquiry-fields { gap: 16px 10px; }
    .dn-enquiry-contact-fields { grid-template-columns: 1fr; }
  }
</style>
