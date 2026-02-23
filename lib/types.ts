export interface Floodlight {
  percent?: number
  pct?: number
  color: string
  notes?: string
}

export interface Overhead {
  percent?: number
  pct?: number
  notes?: string
}

export interface Direction {
  id?: string
  // New format (start/end)
  start?: number
  end?: number
  // Old format (startTime/endTime)
  startTime?: number
  endTime?: number
  // Legacy
  timestamp?: number
  // Data - support both formats
  flood?: { pct: number; color: string }
  over?: { pct: number }
  floodlight?: Floodlight
  overhead?: Overhead
  notes?: string
}

export interface GroupInfo {
  startTime: string
  endTime: string
  leaders: string[]
  members: string[]
  equipment: string[]
  directionsLink: string
  audioLink: string
  notes: string
}

export type PerformanceType = "dance" | "music" | "singing" | "other"

export interface AudioGroup {
  id: string
  name: string
  audioUrl: string
  duration: number // milliseconds
  directions: Direction[]
  info: GroupInfo // Added group info metadata
  performanceType?: PerformanceType
  performanceTypeOther?: string // For "other" type specifications
  approved?: boolean // Whether performance is approved for /live
  scheduleTime?: string // Scheduled start time (e.g., "19:00")
  scheduleOrder?: number // Order in the schedule
}

export interface ScheduleItem {
  id: string
  type: "performance" | "break"
  name: string
  duration: number // milliseconds
  startTime?: string // HH:MM format
  performanceId?: string // Reference to performance if type is performance
  notes?: string
}
