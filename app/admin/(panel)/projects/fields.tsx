import type { Project } from "@prisma/client";
import { Field, Area, Select, ImagesField } from "@/components/admin-ui";

export const VARIANTS = ["feat", "tall", "wide", "sq", "strip"];

export function ProjectFields({ item }: { item?: Project }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field name="num" label="Number" defaultValue={item?.num} placeholder="N° 001" required />
      <Field name="year" label="Year / tag" defaultValue={item?.year} placeholder="2025 · Social" required />
      <Field name="category" label="Category" defaultValue={item?.category} required />
      <Select name="variant" label="Card size" defaultValue={item?.variant ?? "wide"} options={VARIANTS} />
      <Field name="title" label="Title" defaultValue={item?.title} required />
      <Field name="titleEm" label="Title, italic part (optional)" defaultValue={item?.titleEm} />
      <Field name="titleSuffix" label="Title suffix (optional)" defaultValue={item?.titleSuffix} />
      <Field name="href" label="Link URL" defaultValue={item?.href} placeholder="https://" />
      <Field name="stackBold" label="Stack, bold line" defaultValue={item?.stackBold} required />
      <Field name="stackRest" label="Stack, second line (optional)" defaultValue={item?.stackRest} />
      <Field name="order" label="Order" type="number" defaultValue={item?.order ?? 0} />
      <Field
        name="slug"
        label="Slug (auto from title if empty)"
        defaultValue={item?.slug}
        placeholder="find-your-fellow"
      />
      <div className="sm:col-span-2">
        <Area name="desc" label="Description" defaultValue={item?.desc} required />
      </div>
      <div className="sm:col-span-2">
        <ImagesField images={item?.images} label="Project photos" />
      </div>
    </div>
  );
}
