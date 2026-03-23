import type { Direction } from "@/lib/types"

export function DirectionColumn({
  label,
  direction,
}: {
  label: string
  direction: Direction | null
}) {
  if (!direction) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-white/15 bg-black p-4 text-white">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        <p className="text-sm text-white/55">--:--</p>
      </div>
    )
  }

  const minutes = Math.floor(direction.startTime / 60000)
  const seconds = Math.floor((direction.startTime % 60000) / 1000)
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/15 bg-black p-4 text-white">
      <h3 className="text-lg font-semibold text-white/55">{label}</h3>

      <div className="space-y-2">
        <p className="text-sm font-mono text-white/60">{timeStr}</p>

        <div className="space-y-2">
          <div>
            <p className="mb-1 text-sm font-semibold text-white">Floodlight</p>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-8 w-8 rounded border border-white/15"
                style={{ backgroundColor: direction.floodlight.color }}
              />
              <p className="text-sm text-white">{direction.floodlight.percent}%</p>
            </div>
            <div className="mb-2 h-2 w-full rounded bg-white/15">
              <div
                className="h-full rounded"
                style={{ width: `${direction.floodlight.percent}%`, backgroundColor: direction.floodlight.color }}
              />
            </div>
            <p className="text-sm text-white/60">{direction.floodlight.notes}</p>
          </div>

          <div>
            <p className="mb-1 text-sm font-semibold text-white">Overhead</p>
            <div className="mb-2 h-2 w-full rounded bg-white/15">
              <div
                className="h-full rounded bg-white"
                style={{ width: `${direction.overhead.percent}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xl font-bold text-white">{direction.overhead.percent}%</p>
                <p className="text-xl font-bold text-white">{direction.overhead.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
