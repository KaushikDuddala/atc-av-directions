"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CalendarDays, Clock3, Coffee, Home, Music4 } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    const row = { ...rows[i], endTime: "", derivedStart: rows[i].startTime ?? "" }
    if (i === 0) {
      row.derivedStart = row.startTime ?? ""
      row.endTime = row.derivedStart ? addMins(row.derivedStart, row.durationMs / 60000) : ""
    } else {
      const prev = out[i - 1]
      if (prev.endTime) {
        const gap = prev.type === "performance" ? msToMin(prev.gapAfterMs) : 0
        row.derivedStart = addMins(prev.endTime, gap)
        row.endTime = addMins(row.derivedStart, row.durationMs / 60000)
      }
    }
    row.startTime = row.derivedStart
    out.push(row)
  }
  return out
}

export default function SchedulePage() {
  const [rows, setRows] = useState<DisplayRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nowMinutes, setNowMinutes] = useState(() => new Date().getHours() * 60 + new Date().getMinutes())

  useEffect(() => {
    loadSchedule()
  }, [])

  useEffect(() => {
    const syncTime = () => setNowMinutes(new Date().getHours() * 60 + new Date().getMinutes())
    syncTime()
    const timer = window.setInterval(syncTime, 30000)
    return () => window.clearInterval(timer)
  }, [])

  const loadSchedule = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: cfg, error: cfgErr } = await supabase
        .from("schedule_config")
        .select("value")
        .eq("key", "main")
        .single()

      if (cfgErr || !cfg?.value || !cfg.value.confirmed) {
        setError("The schedule has not been confirmed yet.")
        setLoading(false)
        return
      }

      const saved = cfg.value as { defaultGapMins: number; confirmed?: boolean; rows: SavedRow[] }

      const perfIds = saved.rows
        .filter((row) => row.type === "performance" && row.performanceId)
        .map((row) => row.performanceId!)

      const { data: perfs } = perfIds.length > 0
        ? await supabase
            .from("performances")
            .select("id, name, duration, performance_type, info")
            .in("id", perfIds)
        : { data: [] }

      const perfMap = new Map((perfs ?? []).map((perf: any) => [perf.id, perf]))
      const cascaded = cascade(saved.rows)

      const display: DisplayRow[] = cascaded.map((row) => {
        if (row.type === "performance") {
          const perf = perfMap.get(row.performanceId)
          return {
            id: row.id,
            type: "performance",
            name: row.name,
            durationMs: row.durationMs,
            startTime: row.startTime ?? "",
            endTime: row.endTime,
            leaders: perf?.info?.leaders ?? [],
            performanceType: perf?.performance_type ?? null,
          }
        }

        return {
          id: row.id,
          type: "break",
          name: row.name,
          durationMs: row.durationMs,
          startTime: row.startTime ?? "",
          endTime: row.endTime,
        }
      })

      setRows(display)
    } catch {
      setError("Failed to load schedule.")
    } finally {
      setLoading(false)
    }
  }

  const performanceRows = rows.filter((row) => row.type === "performance")
  const totalMs = performanceRows.reduce((sum, row) => sum + row.durationMs, 0)
  const firstTime = rows.find((row) => row.startTime)?.startTime
  const lastEnd = rows.length > 0 ? rows[rows.length - 1].endTime : ""
  const upcomingPerformanceIndex = performanceRows.findIndex((row) => parseHHMM(row.endTime) > nowMinutes)
  const readyPerformanceId = upcomingPerformanceIndex >= 0 ? performanceRows[upcomingPerformanceIndex].id : null
  const onCallPerformanceId = upcomingPerformanceIndex >= 0 ? performanceRows[upcomingPerformanceIndex + 1]?.id ?? null : null

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="section-kicker">
            <CalendarDays className="h-3.5 w-3.5" />
            Confirmed Schedule
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        <section className="soft-card-strong mt-6 p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Run of show</p>
              <h1 className="display-title mt-3 text-4xl leading-tight sm:text-5xl">Tonight&apos;s lineup, in order.</h1>
              <p className="mt-3 text-sm font-medium text-stone-500">Teams should be on site two performances before their own slot.</p>
            </div>

            {!loading && !error && firstTime && (
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <div className="summary-pill">
                  <Clock3 className="h-4 w-4 text-amber-700" />
                  {to12h(firstTime)}
                  {lastEnd && <span className="text-stone-400">to {to12h(lastEnd)}</span>}
                </div>
                <div className="summary-pill">
                  <Music4 className="h-4 w-4 text-sky-700" />
                  {performanceRows.length} performance{performanceRows.length === 1 ? "" : "s"}
                </div>
                <div className="summary-pill">{msToDuration(totalMs)}</div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="soft-card p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />
              <p className="mt-4 text-sm text-stone-500">Loading the latest schedule…</p>
            </div>
          ) : error ? (
            <div className="soft-card p-12 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-4 text-lg font-semibold text-stone-800">{error}</p>
              <p className="mt-2 text-sm text-stone-500">Check back again after an admin confirms the final schedule.</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="soft-card p-12 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-stone-300" />
              <p className="mt-4 text-lg font-semibold text-stone-800">No schedule items yet.</p>
            </div>
          ) : (
            <div className="relative pl-4 sm:pl-6">
              <div className="absolute left-[1.35rem] top-5 bottom-5 hidden w-px bg-gradient-to-b from-amber-300 via-stone-200 to-emerald-300 sm:block" />
              <div className="space-y-4">
                {rows.map((row, index) => {
                  const isBreak = row.type === "break"
                  const performanceNumber = rows.slice(0, index + 1).filter((entry) => entry.type === "performance").length
                  const statusLabel = !isBreak
                    ? row.id === readyPerformanceId
                      ? "Ready to perform"
                      : row.id === onCallPerformanceId
                        ? "On call"
                        : null
                    : null

                  return (
                    <article
                      key={row.id}
                      className={`relative grid gap-3 sm:grid-cols-[72px_minmax(0,1fr)] ${
                        isBreak ? "items-center" : "items-start"
                      }`}
                    >
                      <div className="relative z-10 hidden sm:flex sm:justify-center">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm ${
                            isBreak
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-white text-amber-700"
                          }`}
                        >
                          {isBreak ? <Coffee className="h-5 w-5" /> : <span className="text-sm font-semibold">{performanceNumber}</span>}
                        </div>
                      </div>

                      <div className={isBreak ? "muted-card p-5" : "soft-card p-5 sm:p-6"}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`chip text-xs font-semibold uppercase tracking-[0.18em] ${
                                  isBreak
                                    ? "border-emerald-200 bg-emerald-100/70 text-emerald-800"
                                    : "border-amber-200 bg-amber-100/70 text-amber-800"
                                }`}
                              >
                                {isBreak ? "Break" : row.performanceType ?? "Performance"}
                              </span>
                              {!isBreak && (
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                                  Performance {performanceNumber}
                                </span>
                              )}
                              {statusLabel && (
                                <span
                                  className={`chip text-xs font-semibold uppercase tracking-[0.18em] ${
                                    statusLabel === "Ready to perform"
                                      ? "border-rose-200 bg-rose-100/80 text-rose-800"
                                      : "border-sky-200 bg-sky-100/80 text-sky-800"
                                  }`}
                                >
                                  {statusLabel}
                                </span>
                              )}
                            </div>
                            <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">{row.name}</h2>
                            {row.leaders && row.leaders.length > 0 && (
                              <p className="mt-2 text-sm leading-6 text-stone-600">{row.leaders.join(", ")}</p>
                            )}
                          </div>

                          <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">Start</p>
                            <p className="mt-1 text-lg font-semibold text-stone-100">{to12h(row.startTime)}</p>
                            <p className="mt-1 text-sm text-stone-400">
                              Ends {to12h(row.endTime)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm">
                          <div className="summary-pill">
                            <Clock3 className="h-4 w-4 text-stone-500" />
                            {msToDuration(row.durationMs)}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {lastEnd && !loading && !error && (
          <section className="soft-card mt-6 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Estimated finish</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{to12h(lastEnd)}</p>
          </section>
        )}
      </div>
    </div>
  )
}
