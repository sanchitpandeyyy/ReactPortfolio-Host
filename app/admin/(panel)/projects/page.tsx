import Link from "next/link";
import { getProjects } from "@/lib/content";
import { deleteProject } from "@/lib/admin-actions";
import { AdminTable } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const items = await getProjects();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Work section</div>
        <h1 className="adm-title">Projects</h1>
        <p className="adm-sub">
          Cards in the Work section. Lowest Order value shows first.
        </p>
      </header>

      <div className="adm-table-toolbar">
        <span className="adm-table-count">
          {items.length} {items.length === 1 ? "project" : "projects"}
        </span>
        <Link href="/admin/projects/new" className="adm-new-btn">
          + New project
        </Link>
      </div>

      <AdminTable
        items={items}
        emptyLabel="No projects yet."
        editHref={(item) => `/admin/projects/${item.id}`}
        deleteAction={deleteProject}
        columns={[
          { label: "Num", render: (i) => i.num },
          { label: "Title", render: (i) => `${i.title}${i.titleEm ? ` ${i.titleEm}` : ""}` },
          { label: "Category", render: (i) => i.category },
          { label: "Year", render: (i) => i.year },
          { label: "Variant", render: (i) => i.variant },
          { label: "Order", render: (i) => i.order },
        ]}
      />
    </div>
  );
}
