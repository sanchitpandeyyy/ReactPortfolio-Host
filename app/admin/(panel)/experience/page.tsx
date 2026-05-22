import type { Experience } from "@prisma/client";
import { getExperiences } from "@/lib/content";
import { saveExperience, deleteExperience } from "@/lib/admin-actions";
import { Field, Area, CreateCard, ItemCard } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

function ExperienceFields({ item }: { item?: Experience }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="period" label="Period" defaultValue={item?.period} placeholder="2022 → Present" required />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <Field name="role" label="Role" defaultValue={item?.role} required />
      <Field name="org" label="Organization" defaultValue={item?.org} required />
      <Field name="place" label="Place / type" defaultValue={item?.place} placeholder="Butwal, Nepal · Full-time" required />
      <Field name="tags" label="Tags (comma separated)" defaultValue={item ? item.tags.join(", ") : ""} placeholder="Next.js, TypeScript" />
      <div className="sm:col-span-2">
        <Area name="summary" label="Summary" defaultValue={item?.summary} required />
      </div>
    </div>
  );
}

export default async function ExperienceAdmin() {
  const items = await getExperiences();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Experience section</div>
        <h1 className="adm-title">Experience</h1>
        <p className="adm-sub">
          Roles in the stacking Experience section.
        </p>
      </header>

      <CreateCard title="Add a role" saveAction={saveExperience}>
        <ExperienceFields />
      </CreateCard>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="adm-empty">No roles yet.</p>
        )}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={`${item.role} · ${item.org}`}
            saveAction={saveExperience}
            deleteAction={deleteExperience}
          >
            <ExperienceFields item={item} />
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
