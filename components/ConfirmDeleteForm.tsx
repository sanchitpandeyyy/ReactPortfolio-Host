"use client";

export function ConfirmDeleteForm({
  id,
  action,
  label = "Delete",
  className = "adm-table-delete",
  confirmText = "Delete this item? This can't be undone.",
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label?: string;
  className?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
