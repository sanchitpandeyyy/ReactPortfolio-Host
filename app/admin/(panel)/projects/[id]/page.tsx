import { notFound } from "next/navigation";
import { getProject } from "@/lib/content";
import { saveProject, deleteProject } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { ProjectFields } from "../fields";

export const dynamic = "force-dynamic";

export default async function EditProjectAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getProject(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Work section</div>
        <h1 className="adm-title">
          {item.num} · {item.title}
        </h1>
      </header>

      <EntityForm
        id={item.id}
        saveAction={saveProject}
        deleteAction={deleteProject}
        backHref="/admin/projects"
      >
        <ProjectFields item={item} />
      </EntityForm>
    </div>
  );
}
