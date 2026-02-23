"use client"

import { useState, ChangeEvent } from "react"
import { Upload } from "lucide-react"

export interface AudioUploadResult {
  file: File
  duration: number
  name: string
}

export function AudioUpload({
  onUpload,
  disabled = false,
}: {
  onUpload: (result: AudioUploadResult) => void
  disabled?: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileName(file.name)

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
        console.error("Audio load error")
        alert("Error loading audio file")
        setIsLoading(false)
      })

      audio.src = URL.createObjectURL(file)
    } catch (error) {
      console.error("Error uploading audio:", error)
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
        id="audio-upload"
        className="hidden"
      />
      <label
        htmlFor="audio-upload"
        className={`cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors ${disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <span className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          {isLoading ? "Loading..." : "Upload"}
        </span>
      </label>
    </div>
  )
}
