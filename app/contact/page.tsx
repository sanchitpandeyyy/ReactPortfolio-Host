import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { submitContact } from "@/lib/contact-actions";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { absoluteUrl, defaultSocialImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Say hi",
  description:
    "Get in touch with Sanchit Pandey — project inquiries, collaborations, or just to say hi.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    type: "website",
    title: "Say hi · Sanchit Pandey",
    description:
      "Get in touch with Sanchit Pandey — project inquiries, collaborations, or just to say hi.",
    url: absoluteUrl("/contact"),
    images: [defaultSocialImage()],
  },
  robots: { index: true, follow: true },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <article className="np-article ct-page">
      <JsonLd
        data={graph([
          webPageNode({
            type: "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Contact Sanchit Pandey",
            description:
              "Project inquiries, collaborations, or just to say hi.",
          }),
          breadcrumbNode([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Contact" },
          ]),
        ])}
      />

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />

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
