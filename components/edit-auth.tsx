"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { Button } from "./ui/button"

interface EditAuthProps {
  onAuthSuccess: () => void
}

export function EditAuth({ onAuthSuccess }: EditAuthProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/edit/verify", {
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

      onAuthSuccess()
    } catch {
      setError("Network error during authentication")
      setPassword("")
      setIsLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-content flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="soft-card-strong p-8 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-sky-600 p-4 text-white shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Editor access</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Enter the editor password</h1>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                This area is for updating saved performances and lighting cues.
              </p>
            </div>

            <div className="mt-8">
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="field-input"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading || !password.trim()} className="mt-6 w-full">
              {isLoading ? "Checking access..." : "Unlock editor"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
