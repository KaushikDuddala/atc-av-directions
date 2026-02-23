"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Calendar, Clock, Music, Coffee } from "lucide-react"

// ─── Types (mirror admin page) ────────────────────────────────────────────────

interface SavedRow {
  id: string
  type: "performance" | "break"
  performanceId?: string
  name: string
  durationMs: number
  gapAfterMs: number
  startTime?: string
}

interface DisplayRow {
  id: string
  type: "performance" | "break"
  name: string
  durationMs: number
  startTime: string
  endTime: string
  leaders?: string[]
  performanceType?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseHHMM(hhmm: string): number {
  if (!hhmm) return 0
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

function addMins(hhmm: string, mins: number): string {
  if (!hhmm) return ""
  const total = parseHHMM(hhmm) + Math.round(mins)
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

function to12h(hhmm: string): string {
  if (!hhmm) return ""
  const [h, m] = hhmm.split(":").map(Number)
  const period = h < 12 ? "AM" : "PM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${period}`
}

function msToDuration(ms: number): string {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

const msToMin = (ms: number) => Math.round(ms / 60000)

function cascade(rows: SavedRow[]): Array<SavedRow & { endTime: string }> {
  const out: Array<SavedRow & { endTime: string; derivedStart: string }> = []
  for (let i = 0; i < rows.length; i++) {
    const r = { ...rows[i], endTime: "", derivedStart: rows[i].startTime ?? "" }
    if (i === 0) {
      r.derivedStart = r.startTime ?? ""
      r.endTime = r.derivedStart ? addMins(r.derivedStart, r.durationMs / 60000) : ""
    } else {
      const prev = out[i - 1]
      if (prev.endTime) {
        const gap = prev.type === "performance" ? msToMin(prev.gapAfterMs) : 0
        r.derivedStart = addMins(prev.endTime, gap)
        r.endTime = addMins(r.derivedStart, r.durationMs / 60000)
      }
    }
    r.startTime = r.derivedStart
    out.push(r)
  }
  return out
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const [rows, setRows]         = useState<DisplayRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [eventName, setEventName] = useState("Event Schedule")

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load saved schedule config
      const { data: cfg, error: cfgErr } = await supabase
        .from("schedule_config")
        .select("value")
        .eq("key", "main")
        .single()

      if (cfgErr || !cfg?.value) {
        setError("No schedule has been published yet.")
        setLoading(false)
        return
      }

      const saved = cfg.value as { defaultGapMins: number; rows: SavedRow[] }

      // Load performance details for leader/type info
      const perfIds = saved.rows
        .filter(r => r.type === "performance" && r.performanceId)
        .map(r => r.performanceId!)

      const { data: perfs } = perfIds.length > 0
        ? await supabase
            .from("performances")
            .select("id, name, duration, performance_type, info")
            .in("id", perfIds)
        : { data: [] }

      const perfMap = new Map((perfs ?? []).map((p: any) => [p.id, p]))

      // Cascade times
      const cascaded = cascade(saved.rows)

      const display: DisplayRow[] = cascaded.map(r => {
        if (r.type === "performance") {
          const perf = perfMap.get(r.performanceId)
          return {
            id: r.id,
            type: "performance",
            name: r.name,
            durationMs: r.durationMs,
            startTime: r.startTime ?? "",
            endTime: r.endTime,
            leaders: perf?.info?.leaders ?? [],
            performanceType: perf?.performance_type ?? null,
          }
        }
        return {
          id: r.id,
          type: "break",
          name: r.name,
          durationMs: r.durationMs,
          startTime: r.startTime ?? "",
          endTime: r.endTime,
        }
      })

      setRows(display)
    } catch (e) {
      setError("Failed to load schedule.")
    } finally {
      setLoading(false)
    }
  }

  const performanceRows = rows.filter(r => r.type === "performance")
  const totalMs = performanceRows.reduce((s, r) => s + r.durationMs, 0)
  const firstTime = rows.find(r => r.startTime)?.startTime
  const lastEnd   = rows.length > 0 ? rows[rows.length - 1].endTime : ""

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Hero header */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-purple-950/30 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-300 text-xs font-medium tracking-widest uppercase mb-6">
            <Calendar className="w-3.5 h-3.5" />
            Program
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{eventName}</h1>

          {!loading && !error && firstTime && (
            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mt-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {to12h(firstTime)}
                {lastEnd && <> – {to12h(lastEnd)}</>}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <span>{performanceRows.length} performance{performanceRows.length !== 1 ? "s" : ""}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
              <span>{msToDuration(totalMs)} total</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-4 py-10">

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20 text-slate-500">
            <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm">Loading schedule…</p>
          </div>

        ) : error ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 text-lg">{error}</p>
            <p className="text-slate-600 text-sm mt-2">Check back soon.</p>
          </div>

        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400">No schedule items yet.</p>
          </div>

        ) : (
          <div className="relative">
            {/* Vertical timeline spine */}
            <div className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-500/40 via-slate-700/50 to-purple-500/30" />

            <div className="space-y-1">
              {rows.map((row, idx) => {
                const isBreak = row.type === "break"
                const isLast  = idx === rows.length - 1
                const perfIdx = rows.slice(0, idx + 1).filter(r => r.type === "performance").length

                return (
                  <div key={row.id} className="relative flex gap-5 group">

                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: 44 }}>
                      <div className={`
                        w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-4 z-10
                        ${isBreak
                          ? "bg-amber-950 border-amber-600/70"
                          : "bg-slate-900 border-blue-500 group-hover:bg-blue-500/20 transition-colors"
                        }
                      `}>
                        {isBreak
                          ? <Coffee className="w-2.5 h-2.5 text-amber-400" />
                          : <Music className="w-2.5 h-2.5 text-blue-400" />
                        }
                      </div>
                    </div>

                    {/* Card */}
                    <div className={`
                      flex-1 mb-3 rounded-xl border transition-all
                      ${isBreak
                        ? "bg-amber-950/10 border-amber-800/30 px-5 py-3.5"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700 px-5 py-4"
                      }
                    `}>
                      {isBreak ? (
                        /* Break row */
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400/80 font-medium text-sm">{row.name}</span>
                            <span className="text-amber-800/70 text-xs">· {msToMin(row.durationMs)} min</span>
                          </div>
                          {row.startTime && (
                            <span className="text-amber-700/80 text-xs font-mono tabular-nums">
                              {to12h(row.startTime)} – {to12h(row.endTime)}
                            </span>
                          )}
                        </div>

                      ) : (
                        /* Performance row */
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-slate-500 text-xs font-mono tabular-nums w-5">{perfIdx}.</span>
                              <h3 className="font-bold text-base leading-tight">{row.name}</h3>
                              {row.performanceType && (
                                <span className="text-xs bg-slate-800 border border-slate-700 rounded-full px-2 py-0.5 text-slate-400 capitalize">
                                  {row.performanceType}
                                </span>
                              )}
                            </div>
                            {row.leaders && row.leaders.length > 0 && (
                              <p className="text-sm text-slate-400 ml-7">
                                {row.leaders.join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-slate-600 mt-1 ml-7">{msToDuration(row.durationMs)}</p>
                          </div>

                          {row.startTime && (
                            <div className="text-right flex-shrink-0">
                              <p className="text-white font-semibold tabular-nums text-sm">{to12h(row.startTime)}</p>
                              <p className="text-slate-500 text-xs tabular-nums">ends {to12h(row.endTime)}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer summary */}
            {lastEnd && (
              <div className="mt-8 ml-[52px] flex items-center gap-3 text-slate-500 text-sm border-t border-slate-800 pt-6">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  Show ends at <span className="text-slate-300 font-semibold">{to12h(lastEnd)}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/50 mt-10 py-6 text-center text-slate-700 text-xs">
        Schedule subject to change
      </div>
    </div>
  )
}