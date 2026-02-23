"use server"

import { cookies } from "next/headers"

export async function isEditAuthenticated() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("edit_session")
  return sessionCookie?.value === "authenticated"
}

export async function logoutEdit() {
  const cookieStore = await cookies()
  cookieStore.delete("edit_session")
}
