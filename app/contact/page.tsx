import type { Metadata } from "next";
import Link from "next/link";
import { submitContact } from "@/lib/contact-actions";

export const metadata: Metadata = {
  title: "Say hi · Sanchit Pandey",
  description:
    "Get in touch with Sanchit Pandey — project inquiries, collaborations, or just to say hi.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <article className="np-article ct-page">
      <Link href="/" className="np-back" data-reveal>
        <span aria-hidden="true">&larr;</span> Back home
      </Link>

      <header className="np-art-head" data-reveal>
        <div className="np-eyebrow">Contact</div>
        <h1 className="np-art-title">
          Say <em>hi.</em>
        </h1>
        <div className="np-art-meta">
          <span>
            Or email <b>mail@sanchit.pro</b>
          </span>
          <span>replies within 24h on weekdays (NPT)</span>
        </div>
      </header>

      {sent ? (
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
      ) : (
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
            <span className="ct-note">
              No newsletters, no spam — this lands straight in my inbox.
            </span>
          </div>
        </form>
      )}
    </article>
  );
}
