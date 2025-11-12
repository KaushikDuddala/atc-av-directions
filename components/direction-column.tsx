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
      <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-muted">
        <h3 className="text-lg font-semibold text-muted-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground">--:--</p>
      </div>
    )
  }

  const minutes = Math.floor(direction.timestamp / 60000)
  const seconds = Math.floor((direction.timestamp % 60000) / 1000)
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold text-muted-foreground">{label}</h3>

      <div className="space-y-2">
        <p className="text-sm font-mono text-foreground/60">{timeStr}</p>

        <div className="space-y-2">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Floodlight</p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-border"
                style={{ backgroundColor: direction.floodlight.color }}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{direction.floodlight.percent}%</p>
                <p className="text-sm text-muted-foreground">{direction.floodlight.notes}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Overhead</p>
            <div>
              <p className="text-sm text-foreground">{direction.overhead.percent}%</p>
              <p className="text-sm text-muted-foreground">{direction.overhead.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
