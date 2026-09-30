import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClockIcon, MailIcon } from "@/components/icons";
import { ContactForm, ContactFormFields } from "@/components/ContactForm";
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

export default function ContactPage() {

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
          <span className="np-meta-item">
            <MailIcon />
            <span>
              Or email <b>mail@sanchit.pro</b>
            </span>
          </span>
          <span className="np-meta-item">
            <ClockIcon />
            <span>replies within 24h on weekdays (NPT)</span>
          </span>
        </div>
      </header>

      <Suspense fallback={<ContactFormFields />}>
        <ContactForm />
      </Suspense>
    </article>
  );
}
