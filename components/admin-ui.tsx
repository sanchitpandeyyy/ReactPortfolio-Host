import type { ReactNode } from "react";
import Link from "next/link";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";

export function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="adm-input"
      />
    </label>
  );
}

export function Area({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={3}
        className="adm-textarea"
      />
    </label>
  );
}

export function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <select name={name} defaultValue={defaultValue} className="adm-select">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

type Action = (formData: FormData) => Promise<void>;

/** Shared form shell for both the "new" and "[id]" edit pages of a section. */
export function EntityForm({
  id,
  saveAction,
  deleteAction,
  backHref,
  children,
}: {
  id?: string;
  saveAction: Action;
  deleteAction?: Action;
  backHref: string;
  children: ReactNode;
}) {
  return (
    <div className="adm-card">
      <form action={saveAction}>
        {id && <input type="hidden" name="id" value={id} />}
        {children}
        <div className="adm-actions-row">
          <button className="adm-submit">{id ? "Save changes" : "Add"}</button>
          <Link href={backHref} className="adm-ghost">
            Cancel
          </Link>
          {id && deleteAction && (
            <ConfirmDeleteForm
              id={id}
              action={deleteAction}
              className="adm-delete adm-delete-inline"
            />
          )}
        </div>
      </form>
    </div>
  );
}

export interface AdminTableColumn<T> {
  label: string;
  render: (item: T) => ReactNode;
  className?: string;
}

/** Compact table listing for a section, linking out to per-item edit pages. */
export function AdminTable<T extends { id: string }>({
  columns,
  items,
  editHref,
  deleteAction,
  emptyLabel,
}: {
  columns: AdminTableColumn<T>[];
  items: T[];
  editHref: (item: T) => string;
  deleteAction: Action;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="adm-empty">{emptyLabel}</p>;
  }

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label} className={c.className}>
                {c.label}
              </th>
            ))}
            <th className="adm-table-actions-head">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((c) => (
                <td key={c.label} className={c.className}>
                  {c.render(item)}
                </td>
              ))}
              <td className="adm-table-actions">
                <Link href={editHref(item)} className="adm-table-edit">
                  Edit
                </Link>
                <ConfirmDeleteForm id={item.id} action={deleteAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
