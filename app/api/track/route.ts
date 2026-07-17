import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function utcDay() {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const { type, target, newVisitor } = await req.json();

    if (type === "view") {
      const day = utcDay();
      await prisma.dailyStat.upsert({
        where: { day },
        create: { day, views: 1, visitors: newVisitor ? 1 : 0 },
        update: {
          views: { increment: 1 },
          ...(newVisitor ? { visitors: { increment: 1 } } : {}),
        },
      });
    } else if (type === "click" && typeof target === "string" && target) {
      const t = target.slice(0, 200);
      await prisma.clickStat.upsert({
        where: { target: t },
        create: { target: t, count: 1 },
        update: { count: { increment: 1 } },
      });
    }
  } catch {
    // Tracking must never break the site; swallow bad payloads / DB hiccups.
  }
  return NextResponse.json({ ok: true });
}
