import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAllPosts } from "@/lib/notes";
import { getAnalytics } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [projects, experience, community, week, posts, analytics] =
    await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.community.count(),
      prisma.weekItem.count(),
      getAllPosts(),
      getAnalytics(),
    ]);

  const traffic = [
    {
      label: "Visitors today",
      count: analytics.today.visitors,
      hint: `${analytics.today.views} page views today`,
    },
    {
      label: "Visitors, 7 days",
      count: analytics.week.visitors,
      hint: `${analytics.week.views} page views this week`,
    },
    {
      label: "Visitors, all time",
      count: analytics.allTime.visitors,
      hint: `${analytics.allTime.views} page views total`,
    },
    {
      label: "Link clicks",
      count: analytics.clicks,
      hint: "Outbound links clicked on the site",
    },
  ];

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

      <div className="adm-section">Traffic</div>
      <div className="adm-stats">
        {traffic.map((t) => (
          <div key={t.label} className="adm-stat">
            <div className="adm-stat-num">
              {String(t.count).padStart(2, "0")}
            </div>
            <div className="adm-stat-label">{t.label}</div>
            <div className="adm-stat-hint">{t.hint}</div>
          </div>
        ))}
      </div>

      {analytics.topClicks.length > 0 && (
        <>
          <div className="adm-section">Top clicked links</div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topClicks.map((c) => (
                  <tr key={c.id}>
                    <td>{c.target}</td>
                    <td>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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
