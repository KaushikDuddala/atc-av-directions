"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { audioGroups } from "@/lib/data"
import type { AudioGroup } from "@/lib/types"
import { DirectionsDisplay } from "@/components/directions-display"
import { AudioPlayer } from "@/components/audio-player"
import { GroupInfo } from "@/components/group-info"
import { CountdownTimer } from "@/components/countdown-timer"
import { Moon, Sun, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Live() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(audioGroups[0]?.id || "")
  const [currentTime, setCurrentTime] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSelector, setShowSelector] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    if (savedDarkMode !== null) {
      setIsDark(JSON.parse(savedDarkMode))
    } else {
      setIsDark(true)
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

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return audioGroups
    const query = searchQuery.toLowerCase()
    return audioGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.info.leaders.some((leader) => leader.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const currentIndex = audioGroups.findIndex((g) => g.id === selectedGroupId)

  const scrollToSelected = () => {
    if (!showSelector || !listRef.current) return
    const selectedElement = listRef.current.querySelector(`[data-selected="true"]`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedGroupId(audioGroups[currentIndex - 1].id)
      setCurrentTime(0)
      setTimeout(scrollToSelected, 50)
    }
  }

  const goToNext = () => {
    if (currentIndex < audioGroups.length - 1) {
      setSelectedGroupId(audioGroups[currentIndex + 1].id)
      setCurrentTime(0)
      setTimeout(scrollToSelected, 50)
    }
  }

  const handleGroupSelect = (groupId: string) => {
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
            <p className="text-muted-foreground">AV System cues</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-full">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left section - Main controls and directions */}
          <div className="flex-1 overflow-auto px-6 py-8 flex flex-col">
            {/* Group Selector with Search and Navigation */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {showSelector ? (
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search performances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                ) : (
                  <div className="flex-1" />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSelector(!showSelector)}
                >
                  {showSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              {/* Group Selector - Dropdown when collapsed, List when expanded */}
              {!showSelector ? (
                <select
                  value={selectedGroupId}
                  onChange={(e) => {
                    setSelectedGroupId(e.target.value)
                    setCurrentTime(0)
                  }}
                  className="w-full h-10 pl-3 pr-8 rounded-lg border border-border bg-background text-foreground cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                >
                  {filteredGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} - {group.info.leaders.join(", ")}
                    </option>
                  ))}
                </select>
              ) : (
                <div ref={listRef} className="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  {filteredGroups.map((group, index) => (
                    <button
                      key={group.id}
                      data-selected={group.id === selectedGroupId}
                      onClick={() => handleGroupSelect(group.id)}
                      className={`w-full text-left px-4 py-2 border-b border-border last:border-b-0 ${
                        group.id === selectedGroupId
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="font-medium">{group.name}</span>
                      <span className="text-sm ml-2 opacity-70">
                        {group.info.leaders.join(", ")}
                      </span>
                    </button>
                  ))}
                  {filteredGroups.length === 0 && (
                    <div className="px-4 py-2 text-muted-foreground">No results found</div>
                  )}
                </div>
              )}
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
