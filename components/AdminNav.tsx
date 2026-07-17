"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/community", label: "Community" },
  { href: "/admin/week", label: "This Week" },
  { href: "/admin/notes", label: "Notes" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/seo", label: "SEO" },
];

export function AdminNav() {
  const path = usePathname();

  return (
    <nav className="adm-nav">
      {items.map((it) => {
        const active =
          it.href === "/admin"
            ? path === "/admin"
            : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={active ? "adm-nav-link active" : "adm-nav-link"}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
