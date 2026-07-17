import { saveProject } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { ProjectFields } from "../fields";

export const dynamic = "force-dynamic";

export default function NewProjectAdmin() {
  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Work section</div>
        <h1 className="adm-title">New project</h1>
      </header>

      <EntityForm saveAction={saveProject} backHref="/admin/projects">
        <ProjectFields />
      </EntityForm>
    </div>
  );
}
