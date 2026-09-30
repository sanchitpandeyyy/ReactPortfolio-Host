"use server";

import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { isAuthenticated, signIn, signOut } from "./auth";

async function guard() {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}
function orNull(v: FormDataEntryValue | null) {
  const s = str(v);
  return s === "" ? null : s;
}
function num(v: FormDataEntryValue | null) {
  const n = Number(str(v));
  return Number.isFinite(n) ? n : 0;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(
  model: "project" | "community",
  raw: string,
  selfId: string
) {
  const base = slugify(raw) || "item";
  let slug = base;
  for (let i = 2; ; i++) {
    const clash =
      model === "project"
        ? await prisma.project.findUnique({ where: { slug } })
        : await prisma.community.findUnique({ where: { slug } });
    if (!clash || clash.id === selfId) return slug;
    slug = `${base}-${i}`;
  }
}

function cloudinaryConfig() {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (m) return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };
  return null;
}

/** Uploads an image file to Cloudinary (signed upload), returns its URL. */
async function uploadToCloudinary(file: File) {
  const cfg = cloudinaryConfig();
  if (!cfg) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) in .env."
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${cfg.apiSecret}`)
    .digest("hex");

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", cfg.apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("folder", folder);
  fd.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
    { method: "POST", body: fd }
  );
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  }
  const json = (await res.json()) as { secure_url: string };
  return json.secure_url;
}

/** Uploads submitted image files to Cloudinary, returns their URLs. */
async function saveUploads(formData: FormData, field = "newImages") {
  const files = formData
    .getAll(field)
    .filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  for (const f of files) {
    if (!f.type.startsWith("image/")) continue;
    urls.push(await uploadToCloudinary(f));
  }
  return urls;
}

/** Merges kept existing images with new uploads for a save action. */
async function mergeImages(formData: FormData, existing: string[]) {
  const removed = new Set(formData.getAll("removeImage").map(String));
  const kept = existing.filter((u) => !removed.has(u));
  const uploaded = await saveUploads(formData);
  return [...kept, ...uploaded];
}

/* ---- Auth ---- */
export async function loginAction(formData: FormData) {
  const ok = await signIn(str(formData.get("password")));
  redirect(ok ? "/admin" : "/admin/login?error=1");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}

/* ---- Projects ---- */
export async function saveProject(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const existing = id
    ? await prisma.project.findUnique({ where: { id } })
    : null;
  const fullTitle = [
    str(formData.get("title")),
    str(formData.get("titleEm")),
    str(formData.get("titleSuffix")),
  ]
    .filter(Boolean)
    .join(" ");
  const slug = await uniqueSlug(
    "project",
    str(formData.get("slug")) || fullTitle,
    id
  );
  const images = await mergeImages(formData, existing?.images ?? []);
  const data = {
    slug,
    images,
    num: str(formData.get("num")),
    year: str(formData.get("year")),
    category: str(formData.get("category")),
    title: str(formData.get("title")),
    titleEm: orNull(formData.get("titleEm")),
    titleSuffix: orNull(formData.get("titleSuffix")),
    desc: str(formData.get("desc")),
    stackBold: str(formData.get("stackBold")),
    stackRest: orNull(formData.get("stackRest")),
    variant: str(formData.get("variant")) || "wide",
    href: str(formData.get("href")),
    order: num(formData.get("order")),
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data });
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await guard();
  await prisma.project.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

/* ---- Experience ---- */
export async function saveExperience(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const data = {
    period: str(formData.get("period")),
    role: str(formData.get("role")),
    org: str(formData.get("org")),
    place: str(formData.get("place")),
    summary: str(formData.get("summary")),
    tags: str(formData.get("tags"))
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order: num(formData.get("order")),
  };
  if (id) await prisma.experience.update({ where: { id }, data });
  else await prisma.experience.create({ data });
  revalidatePath("/");
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData) {
  await guard();
  await prisma.experience.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

/* ---- Community ---- */
export async function saveCommunity(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const existing = id
    ? await prisma.community.findUnique({ where: { id } })
    : null;
  const slug = await uniqueSlug(
    "community",
    str(formData.get("slug")) || str(formData.get("org")),
    id
  );
  const images = await mergeImages(formData, existing?.images ?? []);
  const data = {
    slug,
    images,
    role: str(formData.get("role")),
    org: str(formData.get("org")),
    place: str(formData.get("place")),
    body: str(formData.get("body")),
    order: num(formData.get("order")),
  };
  if (id) await prisma.community.update({ where: { id }, data });
  else await prisma.community.create({ data });
  revalidatePath("/");
  revalidatePath("/community/[slug]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/community");
}

export async function deleteCommunity(formData: FormData) {
  await guard();
  await prisma.community.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/community/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/community");
  redirect("/admin/community");
}

/* ---- This Week ---- */
export async function saveWeekItem(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const data = {
    label: str(formData.get("label")),
    title: str(formData.get("title")),
    detail: orNull(formData.get("detail")),
    order: num(formData.get("order")),
  };
  if (id) await prisma.weekItem.update({ where: { id }, data });
  else await prisma.weekItem.create({ data });
  revalidatePath("/");
  redirect("/admin/week");
}

export async function deleteWeekItem(formData: FormData) {
  await guard();
  await prisma.weekItem.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/week");
  redirect("/admin/week");
}

/* ---- Contact messages ---- */
export async function toggleMessageRead(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (msg) {
    await prisma.contactMessage.update({
      where: { id },
      data: { read: !msg.read },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await guard();
  await prisma.contactMessage.delete({
    where: { id: str(formData.get("id")) },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

/* ---- SEO ---- */
export async function saveSeo(formData: FormData) {
  await guard();
  const data = {
    title: str(formData.get("title")),
    description: str(formData.get("description")),
    keywords: str(formData.get("keywords"))
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    ogTitle: orNull(formData.get("ogTitle")),
    ogDescription: orNull(formData.get("ogDescription")),
  };
  await prisma.siteSeo.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data,
  });
  // Site SEO feeds the root layout metadata on every page.
  revalidatePath("/", "layout");
  redirect("/admin/seo");
}
