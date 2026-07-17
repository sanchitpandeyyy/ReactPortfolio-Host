import type { Community } from "@prisma/client";
import { Field, Area, ImagesField } from "@/components/admin-ui";

export function CommunityFields({ item }: { item?: Community }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="role" label="Role" defaultValue={item?.role} placeholder="President" required />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <Field name="org" label="Organization" defaultValue={item?.org} required />
      <Field name="place" label="Place / context" defaultValue={item?.place} required />
      <Field
        name="slug"
        label="Slug (auto from organization if empty)"
        defaultValue={item?.slug}
        placeholder="csit-association-of-bmc"
      />
      <div className="sm:col-span-2">
        <Area name="body" label="Description" defaultValue={item?.body} required />
      </div>
      <div className="sm:col-span-2">
        <ImagesField images={item?.images} label="Community photos" />
      </div>
    </div>
  );
}
