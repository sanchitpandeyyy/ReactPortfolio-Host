"use server";

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
  const data = {
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
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await guard();
  await prisma.project.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
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
}

/* ---- Community ---- */
export async function saveCommunity(formData: FormData) {
  await guard();
  const id = str(formData.get("id"));
  const data = {
    role: str(formData.get("role")),
    org: str(formData.get("org")),
    place: str(formData.get("place")),
    body: str(formData.get("body")),
    order: num(formData.get("order")),
  };
  if (id) await prisma.community.update({ where: { id }, data });
  else await prisma.community.create({ data });
  revalidatePath("/");
  redirect("/admin/community");
}

export async function deleteCommunity(formData: FormData) {
  await guard();
  await prisma.community.delete({ where: { id: str(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin/community");
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
}
