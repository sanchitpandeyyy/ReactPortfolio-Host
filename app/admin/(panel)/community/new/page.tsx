import { saveCommunity } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { CommunityFields } from "../fields";

export const dynamic = "force-dynamic";

export default function NewCommunityAdmin() {
  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Community section</div>
        <h1 className="adm-title">New community role</h1>
      </header>

      <EntityForm saveAction={saveCommunity} backHref="/admin/community">
        <CommunityFields />
      </EntityForm>
    </div>
  );
}
