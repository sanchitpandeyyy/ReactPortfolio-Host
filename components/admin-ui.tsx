import type { ReactNode } from "react";

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

export function CreateCard({
  title,
  saveAction,
  children,
}: {
  title: string;
  saveAction: Action;
  children: ReactNode;
}) {
  return (
    <form action={saveAction} className="adm-card-add">
      <div className="adm-card-add-title">{title}</div>
      {children}
      <div className="adm-actions-row">
        <button className="adm-submit">Add</button>
      </div>
    </form>
  );
}

export function ItemCard({
  id,
  title,
  saveAction,
  deleteAction,
  children,
}: {
  id: string;
  title: string;
  saveAction: Action;
  deleteAction: Action;
  children: ReactNode;
}) {
  return (
    <div className="adm-card">
      <div className="adm-card-head">
        <span className="adm-card-title">{title}</span>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <button className="adm-delete">Delete</button>
        </form>
      </div>
      <form action={saveAction}>
        <input type="hidden" name="id" value={id} />
        {children}
        <div className="adm-actions-row">
          <button className="adm-submit">Save changes</button>
        </div>
      </form>
    </div>
  );
}
