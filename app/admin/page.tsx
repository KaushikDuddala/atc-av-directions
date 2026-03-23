"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminAuth } from "@/components/admin-auth"
import { AdminLogout } from "@/components/admin-logout"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { supabase } from "@/lib/supabase"
import type { Direction } from "@/lib/types"
import { Calendar, Check, ChevronLeft, Clock, GripVertical, Plus, Save, Trash2, X } from "lucide-react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface DbPerformance {
  id: string
  name: string
  audio_path: string | null
  duration: number | null
  performance_type: string | null
  directions: Direction[] | null
  info: { leaders?: string[]; members?: string[]; notes?: string } | null
  approved: boolean
  schedule_time: string | null
  schedule_order: number | null
  created_at: string
}

interface ScheduleRow {
  id: string
  type: "performance" | "break"
  performanceId?: string
  name: string
  durationMs: number
  startTime: string
  endTime: string
  gapAfterMs: number
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

function msToDurationLabel(ms: number): string {
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

const msToMin = (ms: number) => Math.round(ms / 60000)
const minToMs = (m: number) => m * 60000

function to12h(hhmm: string): string {
  if (!hhmm) return ""
  const [h, m] = hhmm.split(":").map(Number)
  const period = h < 12 ? "AM" : "PM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${period}`
}

function cascade(rows: ScheduleRow[]): ScheduleRow[] {
  const out: ScheduleRow[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = { ...rows[i] }
    if (i === 0) {
      row.endTime = row.startTime ? addMins(row.startTime, row.durationMs / 60000) : ""
    } else {
      const prev = out[i - 1]
      if (prev.endTime) {
        const gap = prev.type === "performance" ? msToMin(prev.gapAfterMs) : 0
        row.startTime = addMins(prev.endTime, gap)
        row.endTime = addMins(row.startTime, row.durationMs / 60000)
      } else {
        row.startTime = ""
        row.endTime = ""
      }
    }
    out.push(row)
  }
  return out
}

interface RowProps {
  row: ScheduleRow
  idx: number
  isFirst: boolean
  defaultGapMs: number
  onStartTime: (id: string, value: string) => void
  onBreakDuration: (id: string, mins: number) => void
  onGapAfter: (id: string, mins: number) => void
  onName: (id: string, value: string) => void
  onRemove: (id: string) => void
}

function SortableRow({ row, idx, isFirst, defaultGapMs, onStartTime, onBreakDuration, onGapAfter, onName, onRemove }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })
  const isBreak = row.type === "break"
  const gapMins = msToMin(row.gapAfterMs)
  const defMins = msToMin(defaultGapMs)
  const gapChanged = !isBreak && gapMins !== defMins

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      className={`rounded-[24px] border shadow-sm ${isBreak ? "border-emerald-400/20 bg-emerald-500/8" : "border-white/10 bg-white/5"}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button {...attributes} {...listeners} className="flex-shrink-0 cursor-grab text-stone-400 hover:text-stone-200 active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="w-5 flex-shrink-0 font-mono text-xs text-stone-400">{idx + 1}.</span>

        <div className="min-w-0 flex-1">
          {isBreak ? (
            <input
              type="text"
              value={row.name}
              onChange={(event) => onName(row.id, event.target.value)}
              className="w-full border-b border-emerald-400/30 bg-transparent text-sm font-medium text-emerald-100 focus:outline-none"
              placeholder="Break name"
              style={{ colorScheme: "dark", caretColor: "#f8fafc" }}
            />
          ) : (
            <p className="truncate text-sm font-semibold text-stone-900">{row.name}</p>
          )}
          {!isBreak && <p className="mt-0.5 text-xs text-stone-500">{msToDurationLabel(row.durationMs)}</p>}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 text-sm">
          <Clock className="h-3.5 w-3.5 text-stone-400" />
          <span className={`font-mono ${row.startTime ? (isFirst ? "text-amber-300" : "text-stone-200") : "text-stone-400"}`}>
            {row.startTime ? to12h(row.startTime) : "——"}
          </span>
          {row.endTime && <span className="text-xs text-stone-500">→ {to12h(row.endTime)}</span>}
        </div>

        <button onClick={() => onRemove(row.id)} className="ml-1 flex-shrink-0 text-stone-400 hover:text-red-500">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-5 px-14 pb-2.5 text-xs text-stone-500">
        {isBreak ? (
          <label className="flex items-center gap-1.5">
            <span>Duration:</span>
            <input
              type="number"
              min={1}
              max={120}
              value={msToMin(row.durationMs)}
              onChange={(event) => onBreakDuration(row.id, Math.max(1, Number(event.target.value)))}
              className="w-14 rounded border border-emerald-400/25 bg-white/5 px-1.5 py-0.5 text-xs text-emerald-100 focus:outline-none focus:border-emerald-400/50"
              style={{ colorScheme: "dark", caretColor: "#f8fafc" }}
            />
            <span>min</span>
          </label>
        ) : (
          <label className="flex items-center gap-1.5">
            <span className="text-stone-500">Gap after this act:</span>
            <input
              type="number"
              min={0}
              max={120}
              value={gapMins}
              onChange={(event) => onGapAfter(row.id, Math.max(0, Number(event.target.value)))}
              className={`w-12 rounded border bg-white/5 px-1.5 py-0.5 text-xs focus:outline-none ${
                gapChanged ? "border-amber-400/60 text-amber-200" : "border-white/10 text-stone-300"
              }`}
              style={{ colorScheme: "dark", caretColor: "#f8fafc" }}
            />
            <span>min</span>
            {gapChanged && (
              <button onClick={() => onGapAfter(row.id, defMins)} className="ml-0.5 text-stone-400 underline hover:text-stone-200">
                reset
              </button>
            )}
          </label>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"performances" | "schedule">("performances")
  const [performances, setPerformances] = useState<DbPerformance[]>([])
  const [rows, setRows] = useState<ScheduleRow[]>([])
  const [defaultGapMins, setDefaultGapMins] = useState(5)
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    isAdminAuthenticated().then((ok) => {
      setIsAuthenticated(ok)
      setIsLoading(false)
      if (ok) loadData()
    })
  }, [])

  const loadData = async () => {
    setDataLoading(true)

    const { data: perfs } = await supabase.from("performances").select("*").order("created_at", { ascending: false })
    if (perfs) setPerformances(perfs)

    const { data: cfg } = await supabase.from("schedule_config").select("value").eq("key", "main").single()

    if (cfg?.value && perfs) {
      const saved = cfg.value as {
        defaultGapMins: number
        confirmed?: boolean
        rows: Array<{
          id: string
          type: "performance" | "break"
          performanceId?: string
          name: string
          durationMs: number
          gapAfterMs: number
          startTime?: string
        }>
      }

      setDefaultGapMins(saved.defaultGapMins ?? 5)
      setScheduleConfirmed(Boolean(saved.confirmed))

      const rebuilt: ScheduleRow[] = saved.rows
        .map((row) => {
          if (row.type === "performance") {
            const perf = perfs.find((value) => value.id === row.performanceId)
            if (!perf?.approved) return null
            return {
              id: row.id,
              type: "performance" as const,
              performanceId: perf.id,
              name: perf.name,
              durationMs: perf.duration ?? 0,
              startTime: row.startTime ?? "",
              endTime: "",
              gapAfterMs: row.gapAfterMs ?? minToMs(saved.defaultGapMins ?? 5),
            }
          }

          return {
            id: row.id,
            type: "break" as const,
            name: row.name,
            durationMs: row.durationMs,
            startTime: row.startTime ?? "",
            endTime: "",
            gapAfterMs: 0,
          }
        })
        .filter(Boolean) as ScheduleRow[]

      const inSet = new Set(rebuilt.filter((row) => row.type === "performance").map((row) => row.performanceId))
      perfs
        .filter((perf) => perf.approved && !inSet.has(perf.id))
        .sort((a, b) => (a.schedule_order ?? 999) - (b.schedule_order ?? 999))
        .forEach((perf) => rebuilt.push(makeRow(perf, saved.defaultGapMins ?? 5)))

      setRows(cascade(rebuilt))
    } else if (perfs) {
      setScheduleConfirmed(false)
      const initial = perfs
        .filter((perf) => perf.approved)
        .sort((a, b) => (a.schedule_order ?? 999) - (b.schedule_order ?? 999))
        .map((perf) => makeRow(perf, defaultGapMins))
      setRows(cascade(initial))
    }

    setDataLoading(false)
  }

  function makeRow(perf: DbPerformance, gapMins: number): ScheduleRow {
    return {
      id: `perf-${perf.id}`,
      type: "performance",
      performanceId: perf.id,
      name: perf.name,
      durationMs: perf.duration ?? 0,
      startTime: perf.schedule_time ?? "",
      endTime: "",
      gapAfterMs: minToMs(gapMins),
    }
  }

  const update = useCallback((fn: (prev: ScheduleRow[]) => ScheduleRow[]) => {
    setScheduleConfirmed(false)
    setRows((previous) => cascade(fn(previous)))
  }, [])

  const setStartTime = (id: string, value: string) => update((previous) => previous.map((row) => row.id === id ? { ...row, startTime: value } : row))
  const setBreakDuration = (id: string, mins: number) => update((previous) => previous.map((row) => row.id === id ? { ...row, durationMs: minToMs(mins) } : row))
  const setGapAfter = (id: string, mins: number) => update((previous) => previous.map((row) => row.id === id ? { ...row, gapAfterMs: minToMs(mins) } : row))
  const setName = (id: string, value: string) => {
    setScheduleConfirmed(false)
    setRows((previous) => previous.map((row) => row.id === id ? { ...row, name: value } : row))
  }
  const removeRow = (id: string) => update((previous) => previous.filter((row) => row.id !== id))

  const addBreak = () => update((previous) => [
    ...previous,
    {
      id: `break-${Date.now()}`,
      type: "break",
      name: "Break",
      durationMs: minToMs(15),
      startTime: "",
      endTime: "",
      gapAfterMs: 0,
    },
  ])

  const handleDefaultGap = (mins: number) => {
    const oldMs = minToMs(defaultGapMins)
    setDefaultGapMins(mins)
    setScheduleConfirmed(false)
    update((previous) =>
      previous.map((row) =>
        row.type === "performance" && row.gapAfterMs === oldMs ? { ...row, gapAfterMs: minToMs(mins) } : row,
      ),
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      update((previous) => {
        const from = previous.findIndex((row) => row.id === active.id)
        const to = previous.findIndex((row) => row.id === over.id)
        return arrayMove(previous, from, to)
      })
    }
  }

  const saveSchedule = async () => {
    setSaving(true)
    try {
      await Promise.all(
        rows
          .filter((row) => row.type === "performance" && row.performanceId)
          .map((row, index) =>
            supabase
              .from("performances")
              .update({
                schedule_order: index + 1,
                schedule_time: row.startTime || null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", row.performanceId!),
          ),
      )

      const { error } = await supabase.from("schedule_config").upsert(
        {
          key: "main",
          value: {
            defaultGapMins,
            confirmed: scheduleConfirmed,
            rows: rows.map((row) => ({
              id: row.id,
              type: row.type,
              performanceId: row.performanceId,
              name: row.name,
              durationMs: row.durationMs,
              gapAfterMs: row.gapAfterMs,
              startTime: row.startTime,
            })),
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      )

      if (error) {
        console.warn("schedule_config save failed:", error.message)
        alert("Performance times saved! Break data couldn't be persisted — please create a schedule_config table (key text PK, value jsonb, updated_at timestamptz).")
      } else {
        alert(scheduleConfirmed ? "Schedule saved and confirmed." : "Schedule draft saved.")
      }

      loadData()
    } finally {
      setSaving(false)
    }
  }

  const approvedPerfs = useMemo(() => performances.filter((perf) => perf.approved), [performances])
  const pendingPerfs = useMemo(() => performances.filter((perf) => !perf.approved), [performances])

  const handleApprove = async (id: string) => {
    await supabase.from("performances").update({ approved: true, updated_at: new Date().toISOString() }).eq("id", id)
    loadData()
  }

  const handleUnapprove = async (id: string) => {
    await supabase.from("performances").update({ approved: false, updated_at: new Date().toISOString() }).eq("id", id)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this performance?")) return
    await supabase.from("performances").delete().eq("id", id)
    loadData()
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const fmtDur = (ms: number) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="page-content flex min-h-screen items-center justify-center">
          <div className="soft-card px-8 py-6 text-stone-600">Loading admin workspace…</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => { setIsAuthenticated(true); loadData() }} />
  }

  const lastRow = rows[rows.length - 1]

  return (
    <div className="page-shell">
      <div className="page-content">
        <section className="soft-card-strong p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Admin workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Approve acts and publish the run of show</h1>
              </div>
            </div>
            <AdminLogout />
          </div>
        </section>

        <section className="muted-card mt-5 flex flex-wrap gap-2 p-2">
          {(["performances", "schedule"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? "bg-white/10 text-stone-100 shadow-sm" : "text-stone-400 hover:bg-white/6 hover:text-stone-100"
              }`}
            >
              {tab === "schedule" ? (
                <>
                  <Calendar className="mr-1.5 inline h-4 w-4" />
                  Schedule Builder
                </>
              ) : (
                "Performances"
              )}
            </button>
          ))}
        </section>

        <section className="mt-5">
          {dataLoading ? (
            <div className="soft-card p-10 text-center text-stone-600">Loading admin data…</div>
          ) : activeTab === "performances" ? (
            <div className="space-y-8">
              {pendingPerfs.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                    Pending approval ({pendingPerfs.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingPerfs.map((perf) => (
                      <div key={perf.id} className="soft-card p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="text-xl font-semibold tracking-tight text-stone-900">{perf.name}</div>
                            <div className="mt-2 text-sm text-stone-600">{perf.info?.leaders?.join(", ") || "No leaders listed"}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="summary-pill">{perf.directions?.length || 0} cues</span>
                              <span className="summary-pill">{fmtDur(perf.duration || 0)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(perf.id)}>
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(perf.id)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-stone-900">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Approved ({approvedPerfs.length})
                </h2>
                {approvedPerfs.length === 0 ? (
                  <div className="soft-card p-10 text-center text-stone-600">No approved performances yet.</div>
                ) : (
                  <div className="space-y-3">
                    {approvedPerfs.map((perf) => (
                      <div key={perf.id} className="soft-card p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="summary-pill min-w-12 justify-center font-mono">#{perf.schedule_order || "—"}</div>
                            <div>
                              <div className="text-xl font-semibold tracking-tight text-stone-900">{perf.name}</div>
                              <div className="mt-2 text-sm text-stone-600">{perf.info?.leaders?.join(", ") || "No leaders listed"}</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="summary-pill">{perf.directions?.length || 0} cues</span>
                                <span className="summary-pill">{fmtDur(perf.duration || 0)}</span>
                                {perf.schedule_time && <span className="summary-pill">{to12h(perf.schedule_time)}</span>}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleUnapprove(perf.id)}>
                            Unapprove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="soft-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Event schedule</h2>
                    <p className="mt-2 text-sm text-stone-600">Adjust the order, breaks, and start times, then confirm once the lineup is final.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setScheduleConfirmed((value) => !value)}
                      className={`summary-pill cursor-pointer ${
                        scheduleConfirmed
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                          : "border-amber-400/30 bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {scheduleConfirmed ? "Confirmed" : "Draft"}
                    </button>
                    <label className="summary-pill">
                      <span>Default gap</span>
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={defaultGapMins}
                        onChange={(event) => handleDefaultGap(Math.max(0, Number(event.target.value)))}
                        className="w-12 rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-stone-100 focus:outline-none"
                        style={{ colorScheme: "dark", caretColor: "#f8fafc" }}
                      />
                      <span className="text-stone-500">min</span>
                    </label>
                    <Button onClick={addBreak} variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                      Add break
                    </Button>
                    <Button onClick={saveSchedule} disabled={saving} size="sm">
                      <Save className="h-4 w-4" />
                      {saving ? "Saving…" : scheduleConfirmed ? "Save and confirm" : "Save draft"}
                    </Button>
                  </div>
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="soft-card p-10 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-stone-300" />
                  <p className="text-lg font-semibold text-stone-900">No approved performances to schedule.</p>
                  <p className="mt-2 text-sm text-stone-600">Approve a few performances first.</p>
                </div>
              ) : (
                <>
                  <div className="muted-card flex flex-wrap items-center gap-3 p-4">
                    <Clock className="h-4 w-4 text-stone-500" />
                    <span className="text-sm font-medium text-stone-700">Show start time</span>
                    <input
                      type="time"
                      value={rows[0]?.startTime ?? ""}
                      onChange={(event) => setStartTime(rows[0].id, event.target.value)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-100 focus:outline-none"
                      style={{ colorScheme: "dark", caretColor: "#f8fafc" }}
                    />
                    <span className="text-sm text-stone-500">Everything else cascades automatically.</span>
                    {lastRow?.endTime && <span className="summary-pill ml-auto">Estimated end {to12h(lastRow.endTime)}</span>}
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {rows.map((row, idx) => (
                          <SortableRow
                            key={row.id}
                            row={row}
                            idx={idx}
                            isFirst={idx === 0}
                            defaultGapMs={minToMs(defaultGapMins)}
                            onStartTime={setStartTime}
                            onBreakDuration={setBreakDuration}
                            onGapAfter={setGapAfter}
                            onName={setName}
                            onRemove={removeRow}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
