import type { Project } from "@prisma/client";
import { getProjects } from "@/lib/content";
import { saveProject, deleteProject } from "@/lib/admin-actions";
import { Field, Area, Select, CreateCard, ItemCard } from "@/components/admin-ui";

export const dynamic = "force-dynamic";

const VARIANTS = ["feat", "tall", "wide", "sq", "strip"];

function ProjectFields({ item }: { item?: Project }) {
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
      <div className="sm:col-span-2">
        <Area name="desc" label="Description" defaultValue={item?.desc} required />
      </div>
    </div>
  );
}

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

      <CreateCard title="Add a project" saveAction={saveProject}>
        <ProjectFields />
      </CreateCard>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="adm-empty">No projects yet.</p>
        )}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={`${item.num} · ${item.title}`}
            saveAction={saveProject}
            deleteAction={deleteProject}
          >
            <ProjectFields item={item} />
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
