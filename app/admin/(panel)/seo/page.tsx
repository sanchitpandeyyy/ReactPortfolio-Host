import { getSiteSeo } from "@/lib/content";
import { saveSeo } from "@/lib/admin-actions";
import { Field, Area } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function SeoAdmin() {
  const seo = await getSiteSeo();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Website</div>
        <h1 className="adm-title">SEO</h1>
        <p className="adm-sub">
          Meta title, description, and keywords for the live site. Leave the
          Open Graph fields empty to reuse the values above.
        </p>
      </header>

      <div className="adm-card">
        <form action={saveSeo}>
          <Field
            name="title"
            label="Meta title"
            defaultValue={seo?.title}
            required
            placeholder="Sanchit Pandey · Full-Stack Developer"
          />
          <Area
            name="description"
            label="Meta description"
            defaultValue={seo?.description}
            required
          />
          <Field
            name="keywords"
            label="Keywords (comma separated)"
            defaultValue={seo?.keywords.join(", ")}
            placeholder="Sanchit Pandey, Full-Stack Developer, Next.js"
          />
          <Field
            name="ogTitle"
            label="Open Graph title (optional)"
            defaultValue={seo?.ogTitle}
          />
          <Area
            name="ogDescription"
            label="Open Graph description (optional)"
            defaultValue={seo?.ogDescription}
          />
          <div className="adm-actions-row">
            <button className="adm-submit">Save SEO settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}
