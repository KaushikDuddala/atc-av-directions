"use client"

import { useState, useEffect } from "react"
import { audioGroups } from "@/lib/data"
import type { AudioGroup } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DirectionsDisplay } from "@/components/directions-display"
import { AudioPlayer } from "@/components/audio-player"
import { GroupInfo } from "@/components/group-info"
import { CountdownTimer } from "@/components/countdown-timer"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(audioGroups[0].id)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setIsDark(JSON.parse(savedDarkMode))
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark))
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId)
    setCurrentTime(0)
  }

  const selectedGroup = audioGroups.find((g) => g.id === selectedGroupId) as AudioGroup

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Directions Control</h1>
            <p className="text-muted-foreground">lighting directions synced with audio</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-full">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left section - Main controls and directions */}
          <div className="flex-1 overflow-auto px-6 py-8 flex flex-col">
            {/* Group Selector */}
            <div className="mb-8 max-w-md">
              <label className="block text-sm font-semibold mb-2">Select Group</label>
              <Select value={selectedGroupId} onValueChange={handleGroupChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a group..." />
                </SelectTrigger>
                <SelectContent>
                  {audioGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Audio Player */}
            <div className="mb-8 p-6 rounded-lg border border-border bg-card">
              <AudioPlayer group={selectedGroup} onTimeUpdate={setCurrentTime} />
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <CountdownTimer group={selectedGroup} currentTime={currentTime} />
            </div>

            {/* Directions Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Directions</h2>
              <DirectionsDisplay group={selectedGroup} currentTime={currentTime} />
            </div>
          </div>

          {/* Right section - Group Info sidebar */}
          <div className="w-80 border-l border-border overflow-hidden flex flex-col">
            <GroupInfo info={selectedGroup.info} />
          </div>
        </div>
      </div>
    </main>
  )
}
