"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface AdminLogoutProps {
  onLogout?: () => void
}

export function AdminLogout({ onLogout }: AdminLogoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Refresh page to redirect to login
        window.location.href = "/admin"
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="text-slate-400 hover:text-red-400 border-slate-600/50"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  )
}
