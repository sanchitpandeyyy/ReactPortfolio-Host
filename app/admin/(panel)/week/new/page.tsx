import { saveWeekItem } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { WeekFields } from "../fields";

export const dynamic = "force-dynamic";

export default function NewWeekItemAdmin() {
  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Now section</div>
        <h1 className="adm-title">New this-week item</h1>
      </header>

      <EntityForm saveAction={saveWeekItem} backHref="/admin/week">
        <WeekFields />
      </EntityForm>
    </div>
  );
}
