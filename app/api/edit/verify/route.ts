import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return Response.json({ error: "Password required" }, { status: 400 })
    }

    // Fetch edit credentials from Supabase
    const { data: editCreds, error: fetchError } = await supabase
      .from("edit_credentials")
      .select("password_hash")
      .single()

    if (fetchError || !editCreds) {
      // If no credentials exist in database, fall back to environment variable
      const envPassword = process.env.EDIT_PASSWORD_HASH

      if (!envPassword) {
        return Response.json(
          { error: "Edit credentials not configured" },
          { status: 500 }
        )
      }

      // Compare against hashed password in environment
      const isValid = await bcrypt.compare(password, envPassword)
      if (!isValid) {
        return Response.json({ error: "Invalid password" }, { status: 401 })
      }
    } else {
      // Compare against database password hash
      const isValid = await bcrypt.compare(password, editCreds.password_hash)
      if (!isValid) {
        return Response.json({ error: "Invalid password" }, { status: 401 })
      }
    }

    // Set secure HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("edit_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 days
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Edit verification error:", error)
    return Response.json(
      { error: "Server error during verification" },
      { status: 500 }
    )
  }
}
