"use client"

import { useId, useState, type ChangeEvent } from "react"
import { Upload } from "lucide-react"

export interface AudioUploadResult {
  file: File
  duration: number
  name: string
}

export function AudioUpload({
  onUpload,
  disabled = false,
  label = "Choose audio",
}: {
  onUpload: (result: AudioUploadResult) => void
  disabled?: boolean
  label?: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const inputId = useId()

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    try {
      const audio = new Audio()

      audio.addEventListener("loadedmetadata", () => {
        const durationMs = Math.floor(audio.duration * 1000)
        onUpload({
          file,
          duration: durationMs,
          name: file.name,
        })
        setIsLoading(false)
      })

      audio.addEventListener("error", () => {
        alert("Error loading audio file")
        setIsLoading(false)
      })

      audio.src = URL.createObjectURL(file)
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        id={inputId}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-300 bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-600 ${disabled || isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        <Upload className="h-4 w-4" />
        {isLoading ? "Reading file..." : label}
      </label>
    </div>
  )
}
