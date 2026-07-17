import { getMessages } from "@/lib/content";
import { toggleMessageRead, deleteMessage } from "@/lib/admin-actions";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";

export const dynamic = "force-dynamic";

export default async function MessagesAdmin() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Contact form</div>
        <h1 className="adm-title">Messages</h1>
        <p className="adm-sub">
          Everything submitted through the contact page lands here.
        </p>
      </header>

      <div className="adm-table-toolbar">
        <span className="adm-table-count">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
          {unread > 0 && ` · ${unread} unread`}
        </span>
      </div>

      {messages.length === 0 ? (
        <p className="adm-empty">No messages yet.</p>
      ) : (
        <div className="adm-msg-list">
          {messages.map((m) => (
            <article
              key={m.id}
              className={m.read ? "adm-msg" : "adm-msg unread"}
            >
              <div className="adm-msg-top">
                <div>
                  <b>{m.name}</b>{" "}
                  <a href={`mailto:${m.email}`} className="adm-msg-mail">
                    {m.email}
                  </a>
                </div>
                <span className="adm-msg-date">
                  {m.createdAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {!m.read && <span className="adm-msg-dot">● new</span>}
                </span>
              </div>
              <p className="adm-msg-body">{m.message}</p>
              <div className="adm-msg-actions">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="adm-table-edit">
                    Mark as {m.read ? "unread" : "read"}
                  </button>
                </form>
                <ConfirmDeleteForm
                  id={m.id}
                  action={deleteMessage}
                  confirmText="Delete this message? This can't be undone."
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
