import { notFound } from "next/navigation";
import { getExperience } from "@/lib/content";
import { saveExperience, deleteExperience } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { ExperienceFields } from "../fields";

export const dynamic = "force-dynamic";

export default async function EditExperienceAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getExperience(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Experience section</div>
        <h1 className="adm-title">
          {item.role} · {item.org}
        </h1>
      </header>

      <EntityForm
        id={item.id}
        saveAction={saveExperience}
        deleteAction={deleteExperience}
        backHref="/admin/experience"
      >
        <ExperienceFields item={item} />
      </EntityForm>
    </div>
  );
}
