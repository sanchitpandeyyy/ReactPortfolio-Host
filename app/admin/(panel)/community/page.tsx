import type { Community } from "@prisma/client";
import { getCommunityItems } from "@/lib/content";
import { saveCommunity, deleteCommunity } from "@/lib/admin-actions";
import { Field, Area, CreateCard, ItemCard } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

function CommunityFields({ item }: { item?: Community }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="role" label="Role" defaultValue={item?.role} placeholder="President" required />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <Field name="org" label="Organization" defaultValue={item?.org} required />
      <Field name="place" label="Place / context" defaultValue={item?.place} required />
      <div className="sm:col-span-2">
        <Area name="body" label="Description" defaultValue={item?.body} required />
      </div>
    </div>
  );
}

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

      <CreateCard title="Add a community role" saveAction={saveCommunity}>
        <CommunityFields />
      </CreateCard>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="adm-empty">No community items yet.</p>
        )}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={`${item.role} · ${item.org}`}
            saveAction={saveCommunity}
            deleteAction={deleteCommunity}
          >
            <CommunityFields item={item} />
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
