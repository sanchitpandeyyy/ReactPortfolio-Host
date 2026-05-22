import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAllPosts } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [projects, experience, community, week, posts] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.community.count(),
    prisma.weekItem.count(),
    getAllPosts(),
  ]);

  const stats = [
    {
      href: "/admin/projects",
      label: "Projects",
      count: projects,
      hint: "Cards in the Work section",
    },
    {
      href: "/admin/experience",
      label: "Experience",
      count: experience,
      hint: "Roles in the timeline",
    },
    {
      href: "/admin/community",
      label: "Community",
      count: community,
      hint: "Tiles in the Community grid",
    },
    {
      href: "/admin/week",
      label: "This Week",
      count: week,
      hint: week === 0 ? "Now section is hidden" : "Items in the Now section",
    },
    {
      href: "/admin/notes",
      label: "Notes",
      count: posts.length,
      hint: "Blog posts (read-only)",
    },
  ];

  const quick = [
    { href: "/admin/projects", label: "New project" },
    { href: "/admin/experience", label: "New role" },
    { href: "/admin/community", label: "New community role" },
    { href: "/admin/week", label: "New this-week item" },
  ];

  return (
    <>
      <header className="adm-head">
        <div className="adm-eyebrow">Dashboard</div>
        <h1 className="adm-title">
          Content <em>control.</em>
        </h1>
        <p className="adm-sub">
          Everything you add or edit here renders straight onto the live
          portfolio.
        </p>
      </header>

      <div className="adm-section">Manage content</div>
      <div className="adm-stats">
        {stats.map((s) => (
          <Link key={s.href} href={s.href} className="adm-stat">
            <span className="adm-stat-go" aria-hidden="true">
              &#8599;
            </span>
            <div className="adm-stat-num">
              {String(s.count).padStart(2, "0")}
            </div>
            <div className="adm-stat-label">{s.label}</div>
            <div className="adm-stat-hint">{s.hint}</div>
          </Link>
        ))}
      </div>

      <div className="adm-section">Quick actions</div>
      <div className="adm-quick">
        {quick.map((q) => (
          <Link key={q.label} href={q.href} className="adm-quick-link">
            <span className="plus" aria-hidden="true">
              +
            </span>
            {q.label}
          </Link>
        ))}
      </div>

      <div className="adm-banner">
        <div>
          <div className="adm-banner-eye">Live site</div>
          <h2>See your changes in context.</h2>
        </div>
        <Link href="/" target="_blank" className="adm-btn-lime">
          View live site <span aria-hidden="true">&#8599;</span>
        </Link>
      </div>
    </>
  );
}
