<script lang="ts">
  import { t } from "#lib/i18n/index.ts";

  let { car = null }: { car?: string | null } = $props();

  const m = $derived(t());
  const id = $props.id();
  let sent = $state(false);

  // Preview template: the form validates but never sends data anywhere.
  function submit(event: SubmitEvent) {
    event.preventDefault();
    sent = true;
  }
</script>

<form class="form" onsubmit={submit}>
  <div class="field">
    <label for="{id}-name">{m.form.name}</label>
    <input id="{id}-name" name="name" autocomplete="name" required />
  </div>
  <div class="row">
    <div class="field">
      <label for="{id}-phone">{m.form.phone}</label>
      <input
        id="{id}-phone"
        name="phone"
        type="tel"
        autocomplete="tel"
        required
      />
    </div>
    <div class="field">
      <label for="{id}-email">{m.form.email}</label>
      <input id="{id}-email" name="email" type="email" autocomplete="email" />
    </div>
  </div>
  <div class="field">
    <label for="{id}-message">{m.form.message}</label>
    <textarea id="{id}-message" name="message" rows="4"
      >{car ? m.form.defaultMessage(car) : ""}</textarea
    >
  </div>
  <div class="actions">
    <button class="button button--solid" type="submit">
      {m.form.submit}<span class="arrow" aria-hidden="true"></span>
    </button>
    <p class="note" role="status">{sent ? m.form.demo : m.form.note}</p>
  </div>
</form>

<style>
  .form {
    display: grid;
    gap: 1.75rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem;
  }

  .field {
    display: grid;
    gap: 0.5rem;
  }

  label {
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  input,
  textarea {
    width: 100%;
    padding: 0.625rem 0;
    border: 0;
    border-bottom: 1px solid var(--line-strong);
    border-radius: 0;
    background: transparent;
    font-size: var(--step-1);
    transition: border-color var(--fast) ease;
  }

  textarea {
    resize: vertical;
    line-height: 1.5;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-bottom-color: var(--accent);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem 2rem;
  }

  .note {
    flex: 1 1 14rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  @media (max-width: 40rem) {
    .row {
      grid-template-columns: 1fr;
    }

    .actions .button {
      width: 100%;
    }
  }
</style>
