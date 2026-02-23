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
      className="text-slate-400 border-slate-600/50 hover:text-slate-300 h-8 text-sm px-3"
    >
      <LogOut className="w-3 h-3 mr-1.5" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
