"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { supabase } from "@/lib/supabase"
import type { AudioGroup, Direction } from "@/lib/types"
import { DirectionsDisplay } from "@/components/directions-display"
import { AudioPlayer } from "@/components/audio-player"
import { GroupInfo } from "@/components/group-info"
import { CountdownTimer } from "@/components/countdown-timer"
import { Search, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DbPerformance {
  id: string
  name: string
  audio_path: string | null
  duration: number | null
  performance_type: string | null
  performance_type_other: string | null
  directions: Direction[] | null
  info: {
    startTime?: string
    endTime?: string
    leaders?: string[]
    members?: string[]
    equipment?: string[]
    notes?: string
  } | null
  approved: boolean
  schedule_time: string | null
  schedule_order: number | null
  created_at: string
}

function dbToAudioGroup(db: DbPerformance | undefined): AudioGroup | null {
  if (!db) return null
  
  const info = db.info || {}
  return {
    id: db.id,
    name: db.name,
    audioUrl: db.audio_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/performance-audio/${db.audio_path}` : "",
    duration: db.duration || 0,
    directions: db.directions || [],
    info: {
      startTime: info.startTime || "",
      endTime: info.endTime || "",
      leaders: info.leaders || [],
      members: info.members || [],
      equipment: info.equipment || [],
      notes: info.notes || "",
      directionsLink: "",
      audioLink: "",
    },
    performanceType: db.performance_type as AudioGroup["performanceType"],
    performanceTypeOther: db.performance_type_other || undefined,
    approved: db.approved,
    scheduleTime: db.schedule_time || undefined,
    scheduleOrder: db.schedule_order || undefined,
  }
}

export default function Live() {
  const [performances, setPerformances] = useState<DbPerformance[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [currentTime, setCurrentTime] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  useEffect(() => {
    document.documentElement.classList.add("dark")
    loadPerformances()
  }, [])

  const loadPerformances = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("performances")
      .select("*")
      .eq("approved", true)
      .order("schedule_order", { ascending: true })
    
    if (data) {
      setPerformances(data)
      if (data.length > 0 && !selectedGroupId) {
        setSelectedGroupId(data[0].id)
      }
    }
    setLoading(false)
  }

  const filteredPerformances = useMemo(() => {
    if (!searchQuery) return performances
    const query = searchQuery.toLowerCase()
    return performances.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.info?.leaders?.some((leader: string) => leader.toLowerCase().includes(query))
    )
  }, [performances, searchQuery])

  const currentIndex = filteredPerformances.findIndex((g) => g.id === selectedGroupId)

  const listRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedGroupId(filteredPerformances[currentIndex - 1].id)
      setCurrentTime(0)
    }
  }

  const goToNext = () => {
    if (currentIndex < filteredPerformances.length - 1) {
      setSelectedGroupId(filteredPerformances[currentIndex + 1].id)
      setCurrentTime(0)
    }
  }

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId)
    setCurrentTime(0)
  }

  const selectedGroup = dbToAudioGroup(filteredPerformances.find((g) => g.id === selectedGroupId) || filteredPerformances[0])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    )
  }

  if (performances.length === 0) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-white">No Performances</h1>
          <p className="text-slate-400">No approved performances scheduled yet.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Directions Control</h1>
            <p className="text-muted-foreground">AV System cues</p>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Search and Group List */}
          {leftSidebarOpen && (
            <div className="w-80 border-r border-border flex flex-col bg-card/30">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search performances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              
              <div ref={(el) => { (listRef as any).current = el }} className="flex-1 overflow-y-auto">
                {filteredPerformances.map((group, index) => (
                  <button
                    key={group.id}
                    data-selected={group.id === selectedGroupId}
                    onClick={() => handleGroupSelect(group.id)}
                    className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 ${
                      group.id === selectedGroupId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="font-mono text-xs text-muted-foreground mr-2">
                      {group.schedule_time || `#${index + 1}`}
                    </span>
                    <span className="font-medium">{group.name}</span>
                    <span className="text-sm ml-2 opacity-70">
                      {group.info?.leaders?.join(", ")}
                    </span>
                  </button>
                ))}
                {filteredPerformances.length === 0 && (
                  <div className="px-4 py-2 text-muted-foreground">No results found</div>
                )}
              </div>
            </div>
          )}

          {/* Main content - Controls and Directions */}
          <div className="flex-1 overflow-auto px-6 py-8 flex flex-col">
            {/* Navigation */}
            <div className="flex items-center gap-2 mb-8">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1" />
              <span className="text-muted-foreground">
                {currentIndex + 1} / {filteredPerformances.length}
              </span>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={currentIndex >= filteredPerformances.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Audio Player */}
            {selectedGroup && (
              <div className="mb-8 p-6 rounded-lg border border-border bg-card">
                <AudioPlayer group={selectedGroup} onTimeUpdate={setCurrentTime} />
              </div>
            )}

            {/* Countdown Timer */}
            {selectedGroup && (
              <div className="mb-8">
                <CountdownTimer group={selectedGroup} currentTime={currentTime} />
              </div>
            )}

            {/* Directions Display */}
            {selectedGroup && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Directions</h2>
                <DirectionsDisplay group={selectedGroup} currentTime={currentTime} />
              </div>
            )}
          </div>

          {/* Right section - Group Info sidebar */}
          {selectedGroup && (
            <div className="w-80 border-l border-border overflow-hidden flex flex-col">
              <GroupInfo info={selectedGroup.info} duration={selectedGroup.duration} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
