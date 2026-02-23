"use server"

import { cookies } from "next/headers"

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin_session")
  return sessionCookie?.value === "authenticated"
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
}
