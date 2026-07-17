"use server";

import { redirect } from "next/navigation";
import { prisma } from "./db";

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

export async function submitContact(formData: FormData) {
  // Honeypot: real people never fill this hidden field.
  if (str(formData.get("website"))) redirect("/contact?sent=1");

  const name = str(formData.get("name")).slice(0, 120);
  const email = str(formData.get("email")).slice(0, 200);
  const message = str(formData.get("message")).slice(0, 5000);

  if (!name || !email || !message) redirect("/contact?error=1");

  await prisma.contactMessage.create({ data: { name, email, message } });
  redirect("/contact?sent=1");
}
