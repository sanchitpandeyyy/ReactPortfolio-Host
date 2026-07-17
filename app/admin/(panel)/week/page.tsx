import Link from "next/link";
import { getWeekItems } from "@/lib/content";
import { deleteWeekItem } from "@/lib/admin-actions";
import { AdminTable } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function WeekAdmin() {
  const items = await getWeekItems();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Now section</div>
        <h1 className="adm-title">This Week</h1>
        <p className="adm-sub">
          The Now section. While this list is empty, the section is hidden from
          the site entirely.
        </p>
      </header>

      <div className="adm-table-toolbar">
        <span className="adm-table-count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <Link href="/admin/week/new" className="adm-new-btn">
          + New this-week item
        </Link>
      </div>

      <AdminTable
        items={items}
        emptyLabel="Nothing here, so the Now section is currently hidden."
        editHref={(item) => `/admin/week/${item.id}`}
        deleteAction={deleteWeekItem}
        columns={[
          { label: "Label", render: (i) => i.label },
          { label: "Title", render: (i) => i.title },
          { label: "Order", render: (i) => i.order },
        ]}
      />
    </div>
  );
}
