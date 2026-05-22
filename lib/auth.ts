import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

const COOKIE = "admin_session";

function token() {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(`sanchitpandey-admin::${pw}`).digest("hex");
}

export async function isAuthenticated() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === token();
}

export async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

export async function signIn(password: string) {
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return false;
  }
  const store = await cookies();
  store.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE);
}
