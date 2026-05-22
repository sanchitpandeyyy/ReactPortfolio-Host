import type { ReactNode } from "react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/lib/admin-actions";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <div className="adm">
      <header className="adm-bar">
        <div className="adm-bar-in">
          <Link href="/admin" className="adm-brand">
            <span className="star">&#10022;</span> Sanchit
            <span className="tag">Admin</span>
          </Link>
          <AdminNav />
          <div className="adm-bar-actions">
            <Link href="/" target="_blank" className="adm-ghost">
              View site &#8599;
            </Link>
            <form action={logoutAction}>
              <button className="adm-pill">Log out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="adm-shell">{children}</div>
    </div>
  );
}
