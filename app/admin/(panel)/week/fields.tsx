import type { WeekItem } from "@prisma/client";
import { Field, Area } from "@/components/admin-ui";

export function WeekFields({ item }: { item?: WeekItem }) {
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
