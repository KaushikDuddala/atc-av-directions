"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminAuth } from "@/components/admin-auth"
import { AdminLogout } from "@/components/admin-logout"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { supabase } from "@/lib/supabase"
import type { Direction } from "@/lib/types"
import { ChevronLeft, Clock, Plus, X, Save, Calendar, Check, Trash2, GripVertical } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// ─── Types ────────────────────────────────────────────────────────────────────

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
  startTime: string   // "HH:MM" — only first row is user-editable; rest are derived
  endTime: string     // always derived
  gapAfterMs: number  // gap between this item and the next (performances only)
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────

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

/** Convert "HH:MM" (24h) → "h:MM AM/PM" for display */
function to12h(hhmm: string): string {
  if (!hhmm) return ""
  const [h, m] = hhmm.split(":").map(Number)
  const period = h < 12 ? "AM" : "PM"
  const h12    = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${period}`
}

/** Rebuild all startTime/endTime fields from scratch given the first row's startTime */
function cascade(rows: ScheduleRow[]): ScheduleRow[] {
  const out: ScheduleRow[] = []
  for (let i = 0; i < rows.length; i++) {
    const r = { ...rows[i] }
    if (i === 0) {
      r.endTime = r.startTime ? addMins(r.startTime, r.durationMs / 60000) : ""
    } else {
      const prev = out[i - 1]
      if (prev.endTime) {
        const gap = prev.type === "performance" ? msToMin(prev.gapAfterMs) : 0
        r.startTime = addMins(prev.endTime, gap)
        r.endTime   = addMins(r.startTime, r.durationMs / 60000)
      } else {
        r.startTime = ""
        r.endTime   = ""
      }
    }
    out.push(r)
  }
  return out
}

// ─── Sortable row ─────────────────────────────────────────────────────────────

interface RowProps {
  row: ScheduleRow
  idx: number
  isFirst: boolean
  defaultGapMs: number
  onStartTime: (id: string, v: string) => void
  onBreakDuration: (id: string, mins: number) => void
  onGapAfter: (id: string, mins: number) => void
  onName: (id: string, v: string) => void
  onRemove: (id: string) => void
}

function SortableRow({ row, idx, isFirst, defaultGapMs, onStartTime, onBreakDuration, onGapAfter, onName, onRemove }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })
  const isBreak   = row.type === "break"
  const gapMins   = msToMin(row.gapAfterMs)
  const defMins   = msToMin(defaultGapMs)
  const gapChanged = !isBreak && gapMins !== defMins

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      className={`rounded-lg border ${isBreak ? "bg-amber-950/20 border-amber-800/50" : "bg-slate-900 border-slate-800"}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button {...attributes} {...listeners} className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical className="w-4 h-4" />
        </button>

        <span className="text-slate-600 font-mono text-xs w-5 flex-shrink-0">{idx + 1}.</span>

        {/* Name / label */}
        <div className="flex-1 min-w-0">
          {isBreak ? (
            <input
              type="text"
              value={row.name}
              onChange={e => onName(row.id, e.target.value)}
              className="bg-transparent border-b border-amber-700/60 text-amber-400 font-medium w-full text-sm focus:outline-none"
              placeholder="Break name"
            />
          ) : (
            <p className="font-medium text-sm truncate">{row.name}</p>
          )}
          {!isBreak && (
            <p className="text-xs text-slate-500 mt-0.5">{msToDurationLabel(row.durationMs)}</p>
          )}
        </div>

        {/* Time column */}
        <div className="flex items-center gap-2 flex-shrink-0 text-sm">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className={`font-mono ${row.startTime ? (isFirst ? "text-blue-300" : "text-slate-300") : "text-slate-600"}`}>
            {row.startTime ? to12h(row.startTime) : "——"}
          </span>
          {row.endTime && (
            <span className="text-slate-500 text-xs">→ {to12h(row.endTime)}</span>
          )}
        </div>

        <button onClick={() => onRemove(row.id)} className="text-slate-600 hover:text-red-400 flex-shrink-0 ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-row: break duration OR performance gap */}
      <div className="flex items-center gap-5 px-14 pb-2.5 text-xs text-slate-500">
        {isBreak ? (
          <label className="flex items-center gap-1.5">
            <span>Duration:</span>
            <input
              type="number"
              min={1}
              max={120}
              value={msToMin(row.durationMs)}
              onChange={e => onBreakDuration(row.id, Math.max(1, Number(e.target.value)))}
              className="w-14 bg-slate-800 border border-amber-800/60 rounded px-1.5 py-0.5 text-amber-300 text-xs focus:outline-none focus:border-amber-500"
            />
            <span>min</span>
          </label>
        ) : (
          <label className="flex items-center gap-1.5">
            <span className="text-slate-600">Gap after this act:</span>
            <input
              type="number"
              min={0}
              max={120}
              value={gapMins}
              onChange={e => onGapAfter(row.id, Math.max(0, Number(e.target.value)))}
              className={`w-12 bg-slate-800 rounded px-1.5 py-0.5 text-xs focus:outline-none border ${
                gapChanged ? "border-blue-600 text-blue-300" : "border-slate-700 text-slate-400"
              }`}
            />
            <span>min</span>
            {gapChanged && (
              <button onClick={() => onGapAfter(row.id, defMins)} className="text-slate-600 hover:text-slate-300 underline ml-0.5">
                reset
              </button>
            )}
          </label>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading]             = useState(true)
  const [activeTab, setActiveTab]             = useState<"performances" | "schedule">("performances")
  const [performances, setPerformances]       = useState<DbPerformance[]>([])
  const [rows, setRows]                       = useState<ScheduleRow[]>([])
  const [defaultGapMins, setDefaultGapMins]   = useState(5)
  const [dataLoading, setDataLoading]         = useState(true)
  const [saving, setSaving]                   = useState(false)

  useEffect(() => {
    isAdminAuthenticated().then(ok => {
      setIsAuthenticated(ok)
      setIsLoading(false)
      if (ok) loadData()
    })
  }, [])

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadData = async () => {
    setDataLoading(true)

    const { data: perfs } = await supabase
      .from("performances")
      .select("*")
      .order("created_at", { ascending: false })

    if (perfs) setPerformances(perfs)

    // Try to load saved schedule config
    const { data: cfg } = await supabase
      .from("schedule_config")
      .select("value")
      .eq("key", "main")
      .single()

    if (cfg?.value && perfs) {
      const saved = cfg.value as {
        defaultGapMins: number
        rows: Array<{
          id: string; type: "performance" | "break"
          performanceId?: string; name: string
          durationMs: number; gapAfterMs: number; startTime?: string
        }>
      }
      setDefaultGapMins(saved.defaultGapMins ?? 5)

      const rebuilt: ScheduleRow[] = saved.rows
        .map(r => {
          if (r.type === "performance") {
            const p = perfs.find(x => x.id === r.performanceId)
            if (!p?.approved) return null
            return {
              id: r.id, type: "performance" as const,
              performanceId: p.id, name: p.name,
              durationMs: p.duration ?? 0,
              startTime: r.startTime ?? "", endTime: "",
              gapAfterMs: r.gapAfterMs ?? minToMs(saved.defaultGapMins ?? 5),
            }
          }
          return {
            id: r.id, type: "break" as const,
            name: r.name, durationMs: r.durationMs,
            startTime: r.startTime ?? "", endTime: "",
            gapAfterMs: 0,
          }
        })
        .filter(Boolean) as ScheduleRow[]

      // Append newly approved performances not yet in config
      const inSet = new Set(rebuilt.filter(r => r.type === "performance").map(r => r.performanceId))
      perfs
        .filter(p => p.approved && !inSet.has(p.id))
        .sort((a, b) => (a.schedule_order ?? 999) - (b.schedule_order ?? 999))
        .forEach(p => rebuilt.push(makeRow(p, saved.defaultGapMins ?? 5)))

      setRows(cascade(rebuilt))
    } else if (perfs) {
      const initial = perfs
        .filter(p => p.approved)
        .sort((a, b) => (a.schedule_order ?? 999) - (b.schedule_order ?? 999))
        .map(p => makeRow(p, defaultGapMins))
      setRows(cascade(initial))
    }

    setDataLoading(false)
  }

  function makeRow(p: DbPerformance, gapMins: number): ScheduleRow {
    return {
      id: `perf-${p.id}`, type: "performance",
      performanceId: p.id, name: p.name,
      durationMs: p.duration ?? 0,
      startTime: p.schedule_time ?? "", endTime: "",
      gapAfterMs: minToMs(gapMins),
    }
  }

  // ── Cascade helper ─────────────────────────────────────────────────────────
  const update = useCallback((fn: (prev: ScheduleRow[]) => ScheduleRow[]) => {
    setRows(prev => cascade(fn(prev)))
  }, [])

  // ── Mutations ──────────────────────────────────────────────────────────────
  const setStartTime     = (id: string, v: string) => update(p => p.map(r => r.id === id ? { ...r, startTime: v } : r))
  const setBreakDuration = (id: string, mins: number) => update(p => p.map(r => r.id === id ? { ...r, durationMs: minToMs(mins) } : r))
  const setGapAfter      = (id: string, mins: number) => update(p => p.map(r => r.id === id ? { ...r, gapAfterMs: minToMs(mins) } : r))
  const setName          = (id: string, v: string) => setRows(p => p.map(r => r.id === id ? { ...r, name: v } : r))
  const removeRow        = (id: string) => update(p => p.filter(r => r.id !== id))

  const addBreak = () => update(p => [...p, {
    id: `break-${Date.now()}`, type: "break",
    name: "Break", durationMs: minToMs(15),
    startTime: "", endTime: "", gapAfterMs: 0,
  }])

  const handleDefaultGap = (mins: number) => {
    const oldMs = minToMs(defaultGapMins)
    setDefaultGapMins(mins)
    update(p => p.map(r =>
      r.type === "performance" && r.gapAfterMs === oldMs ? { ...r, gapAfterMs: minToMs(mins) } : r
    ))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      update(p => {
        const from = p.findIndex(r => r.id === active.id)
        const to   = p.findIndex(r => r.id === over.id)
        return arrayMove(p, from, to)
      })
    }
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const saveSchedule = async () => {
    setSaving(true)
    try {
      // Update schedule_order + schedule_time for each performance
      await Promise.all(
        rows
          .filter(r => r.type === "performance" && r.performanceId)
          .map((r, i) =>
            supabase.from("performances").update({
              schedule_order: i + 1,
              schedule_time:  r.startTime || null,
              updated_at:     new Date().toISOString(),
            }).eq("id", r.performanceId!)
          )
      )

      // Persist full schedule (including breaks) to schedule_config
      const { error } = await supabase
        .from("schedule_config")
        .upsert({
          key: "main",
          value: {
            defaultGapMins,
            rows: rows.map(r => ({
              id: r.id, type: r.type,
              performanceId: r.performanceId,
              name: r.name,
              durationMs: r.durationMs,
              gapAfterMs: r.gapAfterMs,
              startTime: r.startTime,
            })),
          },
          updated_at: new Date().toISOString(),
        }, { onConflict: "key" })

      if (error) {
        console.warn("schedule_config save failed:", error.message)
        alert("Performance times saved! Break data couldn't be persisted — please create a schedule_config table (key text PK, value jsonb, updated_at timestamptz).")
      } else {
        alert("Schedule saved!")
      }

      loadData()
    } finally {
      setSaving(false)
    }
  }

  // ── Auth/data helpers ──────────────────────────────────────────────────────
  const approvedPerfs = useMemo(() => performances.filter(p => p.approved), [performances])
  const pendingPerfs  = useMemo(() => performances.filter(p => !p.approved), [performances])

  const handleApprove   = async (id: string) => { await supabase.from("performances").update({ approved: true,  updated_at: new Date().toISOString() }).eq("id", id); loadData() }
  const handleUnapprove = async (id: string) => { await supabase.from("performances").update({ approved: false, updated_at: new Date().toISOString() }).eq("id", id); loadData() }
  const handleDelete    = async (id: string) => { if (!confirm("Delete this performance?")) return; await supabase.from("performances").delete().eq("id", id); loadData() }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fmtDur = (ms: number) => {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, "0")}`
  }

  // ── Early returns ──────────────────────────────────────────────────────────
  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>
  if (!isAuthenticated) return <AdminAuth onAuthSuccess={() => { setIsAuthenticated(true); loadData() }} />

  const lastRow = rows[rows.length - 1]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="sm" className="text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4 mr-2" />Back</Button></Link>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <AdminLogout />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex gap-1 px-6">
          {(["performances", "schedule"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>
              {tab === "schedule" ? <><Calendar className="w-4 h-4 inline mr-1.5" />Schedule Builder</> : "Performances"}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6">
        {dataLoading ? <div className="text-center py-12 text-slate-400">Loading...</div>

        : activeTab === "performances" ? (
          <div className="space-y-8">

            {/* Pending */}
            {pendingPerfs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Pending Approval ({pendingPerfs.length})
                </h2>
                <div className="space-y-2">
                  {pendingPerfs.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-slate-500">{p.info?.leaders?.join(", ")}</div>
                        <div className="text-xs text-slate-600 mt-1">{p.directions?.length || 0} cues • {fmtDur(p.duration || 0)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" />Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)} className="text-red-400 border-red-800 hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Approved ({approvedPerfs.length})
              </h2>
              {approvedPerfs.length === 0
                ? <div className="text-slate-500 text-center py-8">No approved performances yet</div>
                : <div className="space-y-2">
                    {approvedPerfs.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="text-slate-600 font-mono text-sm">#{p.schedule_order || "—"}</div>
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-slate-500">{p.info?.leaders?.join(", ")}</div>
                            <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                              <span>{p.directions?.length || 0} cues</span>
                              <span>•</span><span>{fmtDur(p.duration || 0)}</span>
                              {p.schedule_time && <><span>•</span><span className="text-blue-400">{to12h(p.schedule_time)}</span></>}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleUnapprove(p.id)} className="text-amber-400 border-amber-800 hover:bg-amber-900/30">Unapprove</Button>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

        ) : (
          /* ── Schedule tab ── */
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <h2 className="text-lg font-semibold">Event Schedule</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                  <span>Default gap:</span>
                  <input type="number" min={0} max={120} value={defaultGapMins}
                    onChange={e => handleDefaultGap(Math.max(0, Number(e.target.value)))}
                    className="w-12 bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-white text-sm focus:outline-none focus:border-blue-500" />
                  <span>min between acts</span>
                </label>
                <Button onClick={addBreak} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />Add Break
                </Button>
                <Button onClick={saveSchedule} disabled={saving} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />{saving ? "Saving…" : "Save Schedule"}
                </Button>
              </div>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No approved performances to schedule.</p>
                <p className="text-sm mt-2 text-slate-600">Approve some performances first.</p>
              </div>
            ) : (
              <>
                {/* Show start time — drives everything */}
                <div className="flex items-center gap-3 mb-2 p-3 bg-slate-900/50 border border-slate-700/40 rounded-lg">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-400 flex-shrink-0">Show start time:</span>
                  <input
                    type="time"
                    value={rows[0]?.startTime ?? ""}
                    onChange={e => setStartTime(rows[0].id, e.target.value)}
                    className="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs text-slate-600">All other times cascade automatically</span>
                </div>

                {/* Estimated end */}
                {lastRow?.endTime && (
                  <div className="text-xs text-slate-500 text-right mb-4">
                    Estimated end: <span className="text-slate-300 font-mono">{to12h(lastRow.endTime)}</span>
                  </div>
                )}

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
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
      </div>
    </div>
  )
}