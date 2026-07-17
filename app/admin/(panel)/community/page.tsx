import Link from "next/link";
import { getCommunityItems } from "@/lib/content";
import { deleteCommunity } from "@/lib/admin-actions";
import { AdminTable } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

export default async function CommunityAdmin() {
  const items = await getCommunityItems();

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Community section</div>
        <h1 className="adm-title">Community</h1>
        <p className="adm-sub">
          The first item (lowest Order) becomes the large feature tile.
        </p>
      </header>

      <div className="adm-table-toolbar">
        <span className="adm-table-count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <Link href="/admin/community/new" className="adm-new-btn">
          + New community role
        </Link>
      </div>

      <AdminTable
        items={items}
        emptyLabel="No community items yet."
        editHref={(item) => `/admin/community/${item.id}`}
        deleteAction={deleteCommunity}
        columns={[
          { label: "Role", render: (i) => i.role },
          { label: "Org", render: (i) => i.org },
          { label: "Place", render: (i) => i.place },
          { label: "Order", render: (i) => i.order },
        ]}
      />
    </div>
  );
}
