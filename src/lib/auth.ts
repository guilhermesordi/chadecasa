import { createHmac } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "cha_admin";

function token() {
  const secret = process.env.ADMIN_SECRET || "dev-secret";
  return createHmac("sha256", secret).update("admin-ok").digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(COOKIE)?.value === token();
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export function checkPassword(password: string) {
  return password === (process.env.ADMIN_PASSWORD || "admin");
}
