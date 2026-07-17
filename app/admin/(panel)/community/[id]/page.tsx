import { notFound } from "next/navigation";
import { getCommunityItem } from "@/lib/content";
import { saveCommunity, deleteCommunity } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { CommunityFields } from "../fields";

export const dynamic = "force-dynamic";

export default async function EditCommunityAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getCommunityItem(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Community section</div>
        <h1 className="adm-title">
          {item.role} · {item.org}
        </h1>
      </header>

      <EntityForm
        id={item.id}
        saveAction={saveCommunity}
        deleteAction={deleteCommunity}
        backHref="/admin/community"
      >
        <CommunityFields item={item} />
      </EntityForm>
    </div>
  );
}
