export interface Floodlight {
  percent: number
  color: string
  notes: string
}

export interface Overhead {
  percent: number
  notes: string
}

export interface Direction {
  timestamp: number // milliseconds from start
  floodlight: Floodlight
  overhead: Overhead
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

export interface AudioGroup {
  id: string
  name: string
  audioUrl: string
  duration: number // milliseconds
  directions: Direction[]
  info: GroupInfo // Added group info metadata
}
