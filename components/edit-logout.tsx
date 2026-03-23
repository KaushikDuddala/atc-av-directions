"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

export function EditLogout() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/edit/logout", {
        method: "POST",
      })
      // Redirect to edit page which will show the auth screen
      window.location.href = "/edit"
    } catch (err) {
      console.error("Logout failed:", err)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="text-stone-600 hover:text-stone-900"
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  )
}
