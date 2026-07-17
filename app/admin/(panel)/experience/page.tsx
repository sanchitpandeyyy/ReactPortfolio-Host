import Link from "next/link";
import { getExperiences } from "@/lib/content";
import { deleteExperience } from "@/lib/admin-actions";
import { AdminTable } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function ExperienceAdmin() {
  const items = await getExperiences();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Experience section</div>
        <h1 className="adm-title">Experience</h1>
        <p className="adm-sub">Roles in the stacking Experience section.</p>
      </header>

      <div className="adm-table-toolbar">
        <span className="adm-table-count">
          {items.length} {items.length === 1 ? "role" : "roles"}
        </span>
        <Link href="/admin/experience/new" className="adm-new-btn">
          + New role
        </Link>
      </div>

      <AdminTable
        items={items}
        emptyLabel="No roles yet."
        editHref={(item) => `/admin/experience/${item.id}`}
        deleteAction={deleteExperience}
        columns={[
          { label: "Role", render: (i) => i.role },
          { label: "Org", render: (i) => i.org },
          { label: "Period", render: (i) => i.period },
          { label: "Order", render: (i) => i.order },
        ]}
      />
    </div>
  );
}
