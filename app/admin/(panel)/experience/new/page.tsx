import { saveExperience } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { ExperienceFields } from "../fields";

export const dynamic = "force-dynamic";

export default function NewExperienceAdmin() {
  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Experience section</div>
        <h1 className="adm-title">New role</h1>
      </header>

      <EntityForm saveAction={saveExperience} backHref="/admin/experience">
        <ExperienceFields />
      </EntityForm>
    </div>
  );
}
