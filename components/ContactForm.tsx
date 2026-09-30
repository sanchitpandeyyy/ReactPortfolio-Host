"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailIcon } from "@/components/icons";
import { submitContact } from "@/lib/contact-actions";

/**
 * The contact form and its result state. `?sent` / `?error` are read in the
 * browser so the contact page itself stays static.
 */
export function ContactForm() {
  const params = useSearchParams();
  const sent = params.get("sent");
  const error = params.get("error");

  if (sent) {
    return (
      <div className="ct-done" data-reveal>
        <div className="ct-done-mark" aria-hidden="true">
          ✓
        </div>
        <h2>Message sent.</h2>
        <p>
          Thanks for reaching out — I read every message and reply within a
          day on weekdays.
        </p>
        <Link href="/" className="endcap-cta">
          Back home <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    );
  }

  return <ContactFormFields error={!!error} />;
}

/** The bare form; also the static fallback before search params are read. */
export function ContactFormFields({ error = false }: { error?: boolean }) {
  return (
    <form action={submitContact} className="ct-form" data-reveal>
      {error && (
        <p className="ct-error">
          Please fill in your name, email, and a message.
        </p>
      )}
      <input
        type="text"
        name="website"
        className="ct-hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="ct-row">
        <label className="ct-field">
          <span>Your name</span>
          <input name="name" type="text" required placeholder="Jane Doe" />
        </label>
        <label className="ct-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@studio.com"
          />
        </label>
      </div>
      <label className="ct-field">
        <span>Message</span>
        <textarea
          name="message"
          rows={7}
          required
          placeholder="A project, a collaboration, or just hello…"
        />
      </label>
      <div className="ct-actions">
        <button type="submit" className="endcap-cta">
          Send message <span aria-hidden="true">&rarr;</span>
        </button>
        <a className="ct-note" href="mailto:mail@sanchit.pro">
          <MailIcon />
          Prefer email? mail@sanchit.pro
        </a>
      </div>
    </form>
  );
}
