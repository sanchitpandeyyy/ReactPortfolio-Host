import type { Experience } from "@prisma/client";
import { Field, Area } from "@/components/admin-ui";

export function ExperienceFields({ item }: { item?: Experience }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="period" label="Period" defaultValue={item?.period} placeholder="2022 → Present" required />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <Field name="role" label="Role" defaultValue={item?.role} required />
      <Field name="org" label="Organization" defaultValue={item?.org} required />
      <Field name="place" label="Place / type" defaultValue={item?.place} placeholder="Butwal, Nepal · Full-time" required />
      <Field name="tags" label="Tags (comma separated)" defaultValue={item ? item.tags.join(", ") : ""} placeholder="Next.js, TypeScript" />
      <div className="sm:col-span-2">
        <Area name="summary" label="Summary" defaultValue={item?.summary} required />
      </div>
    </div>
  );
}
