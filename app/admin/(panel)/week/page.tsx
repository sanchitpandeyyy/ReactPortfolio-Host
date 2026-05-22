import type { WeekItem } from "@prisma/client";
import { getWeekItems } from "@/lib/content";
import { saveWeekItem, deleteWeekItem } from "@/lib/admin-actions";
import { Field, Area, CreateCard, ItemCard } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

function WeekFields({ item }: { item?: WeekItem }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="label" label="Label" defaultValue={item?.label} placeholder="Shipping" required />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <div className="sm:col-span-2">
        <Field name="title" label="Title" defaultValue={item?.title} required />
      </div>
      <div className="sm:col-span-2">
        <Area name="detail" label="Detail (optional)" defaultValue={item?.detail} />
      </div>
    </div>
  );
}

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

      <CreateCard title="Add a this-week item" saveAction={saveWeekItem}>
        <WeekFields />
      </CreateCard>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="adm-empty">
            Nothing here, so the Now section is currently hidden.
          </p>
        )}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={`${item.label} · ${item.title}`}
            saveAction={saveWeekItem}
            deleteAction={deleteWeekItem}
          >
            <WeekFields item={item} />
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
