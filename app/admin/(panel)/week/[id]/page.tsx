import { notFound } from "next/navigation";
import { getWeekItem } from "@/lib/content";
import { saveWeekItem, deleteWeekItem } from "@/lib/admin-actions";
import { EntityForm } from "@/components/admin-ui";
import { WeekFields } from "../fields";

export const dynamic = "force-dynamic";

export default async function EditWeekItemAdmin({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getWeekItem(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Now section</div>
        <h1 className="adm-title">
          {item.label} · {item.title}
        </h1>
      </header>

      <EntityForm
        id={item.id}
        saveAction={saveWeekItem}
        deleteAction={deleteWeekItem}
        backHref="/admin/week"
      >
        <WeekFields item={item} />
      </EntityForm>
    </div>
  );
}
