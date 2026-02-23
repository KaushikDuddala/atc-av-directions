"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Lock } from "lucide-react"

interface AdminAuthProps {
  onAuthSuccess: () => void
}

export function AdminAuth({ onAuthSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Authentication failed")
        setPassword("")
        setIsLoading(false)
        return
      }

      // Success - server set secure HTTP-only cookie
      onAuthSuccess()
    } catch (err) {
      setError("Network error during authentication")
      setPassword("")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 mb-4">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Access</h1>
            <p className="text-sm text-slate-400 mt-2">Enter password to continue</p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 border border-slate-600/50 rounded-lg bg-slate-900/50 text-white placeholder-slate-500 disabled:opacity-50 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5"
          >
            {isLoading ? "Authenticating..." : "Unlock Admin"}
          </Button>
        </form>
      </div>
    </div>
  )
}
