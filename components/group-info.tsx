import { ExternalLink } from "lucide-react"
import type { GroupInfo as GroupInfoType } from "@/lib/types"

interface GroupInfoProps {
  info: GroupInfoType
  duration?: number
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

function calculateEndTime(startTime: string, durationMs: number): string {
  if (!startTime) return ""
  const [hours, minutes] = startTime.split(":").map(Number)
  const totalMinutes = hours * 60 + minutes + Math.floor(durationMs / 60000)
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMins = totalMinutes % 60
  return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`
}

export function GroupInfo({ info, duration = 0 }: GroupInfoProps) {
  const endTime = info.startTime ? calculateEndTime(info.startTime, duration) : ""
  return (
    <div className="h-full overflow-y-auto space-y-6 border-l-0 border border-white/15 bg-black p-6 text-white">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/55">Group Details</h3>
      </div>

      {/* Time Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-white/55">Start Time</span>
          <span className="font-semibold">{info.startTime || "—"}</span>
        </div>
        {endTime && (
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-white/55">End Time</span>
            <span className="font-semibold">{endTime}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/15" />

      {/* Leaders Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Leaders</h4>
        <ul className="space-y-1">
          {info.leaders.map((leader) => (
            <li key={leader} className="text-sm">
              {leader}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/15" />

      {/* Members Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Members</h4>
        <ul className="space-y-1">
          {info.members.map((member) => (
            <li key={member} className="text-sm">
              {member}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/15" />

      {/* Duration Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Duration</h4>
        <p className="text-sm">
          {formatDuration(duration)}
          {endTime && ` (${info.startTime} - ${endTime})`}
        </p>
      </div>

      <div className="border-t border-white/15" />

      {/* Equipment Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Equipment</h4>
        <ul className="space-y-1">
          {info.equipment.map((item) => (
            <li key={item} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/15" />

      {/* Links Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Links</h4>
        <div className="space-y-2">
          <a
            href={info.directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white hover:underline"
          >
            Directions
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={info.audioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white hover:underline"
          >
            Audio File
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-white/15" />

      {/* Notes Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-white/55">Notes</h4>
        <p className="text-sm leading-relaxed">{info.notes}</p>
      </div>
    </div>
  )
}
