import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const RULER_H    = 32;
const TRACK_H    = 52;
const LABEL_W    = 88;
const MIN_DUR    = 300;
const BASE_PX_MS = 0.08;
const TRACKS = [
  { id: "flood", label: "FLOOD", icon: "⚡" },
  { id: "over",  label: "OVER",  icon: "☀"  },
];

const fmt = (ms) => {
  const s  = Math.floor(ms / 1000);
  const m  = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${m}:${ss}.${cs}`;
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const uid   = () => Math.random().toString(36).slice(2, 9);

// Parse "#rrggbb" → {r,g,b}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0,2), 16),
    g: parseInt(h.slice(2,4), 16),
    b: parseInt(h.slice(4,6), 16),
  };
}
const hexRgba = (hex, a) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${clamp(a,0,1).toFixed(2)})`;
};

function dirToInternal(d) {
  return {
    id:        d._id ?? uid(),
    start:     d.startTime,
    end:       d.endTime,
    flood:     { pct: d.floodlight.percent, color: d.floodlight.color },
    over:      { pct: d.overhead.percent },
    notes:     d.floodlight.notes ?? "",
    overNotes: d.overhead.notes   ?? "",
  };
}

function internalToDir(c) {
  return {
    startTime:  c.start,
    endTime:    c.end,
    floodlight: { percent: c.flood.pct, color: c.flood.color, notes: c.notes     ?? "" },
    overhead:   { percent: c.over.pct,                        notes: c.overNotes ?? "" },
  };
}

// Only resolves overlaps caused by a specific moved/resized cue — never pushes others
function resolveAfterDrag(cues) {
  const sorted = [...cues].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur  = sorted[i];
    if (cur.start < prev.end) {
      const dur = cur.end - cur.start;
      sorted[i] = { ...cur, start: prev.end, end: prev.end + dur };
    }
  }
  return sorted;
}

// Place a new cue at `start`, clamping end to the next cue's start (never pushing)
function placeNewCue(existing, newCue, duration) {
  const sorted = [...existing].sort((a, b) => a.start - b.start);
  const next   = sorted.find(c => c.start >= newCue.start);
  const maxEnd = next ? next.start : duration;
  const end    = Math.min(newCue.end, maxEnd);
  if (end - newCue.start < MIN_DUR) return null; // no room
  return { ...newCue, end };
}

export function LightingTimeline({
  duration,
  directions       = [],
  onDirectionsChange,
  currentTime      = 0,
  isPlaying        = false,
  onPlayPause,
  onSeek,
}) {
  const [cues, setCues]         = useState(() => directions.map(dirToInternal));
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom]         = useState(1);

  // Refs — always current, safe to read in event handlers registered once
  const pxPerMsRef        = useRef(BASE_PX_MS);
  const dragRef           = useRef(null);
  const isDraggingRef     = useRef(false);
  const hasMovedRef       = useRef(false);
  const scrollEl          = useRef(null);
  const onSeekRef         = useRef(onSeek);
  const onDirectionsRef   = useRef(onDirectionsChange);
  const durationRef       = useRef(duration);
  const cuesRef           = useRef(cues);

  // Update refs every render
  const pxPerMs = BASE_PX_MS * zoom;
  pxPerMsRef.current     = pxPerMs;
  onSeekRef.current       = onSeek;
  onDirectionsRef.current = onDirectionsChange;
  durationRef.current     = duration;
  cuesRef.current         = cues;

  const totalW = duration * pxPerMs;
  const toX    = (ms) => ms * pxPerMs;  // used in render — reactive to zoom state

  // ── Sync directions from parent (initial load / external save only) ─────────
  const prevStartsRef = useRef("");
  useEffect(() => {
    if (isDraggingRef.current) return;
    const key = directions.map(d => d.startTime).sort().join(",");
    if (key !== prevStartsRef.current) {
      prevStartsRef.current = key;
      setCues(directions.map(dirToInternal));
    }
  }, [directions]);

  // ── Global mouse handlers (registered once — use refs) ──────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      hasMovedRef.current = true;

      const px  = pxPerMsRef.current;
      const dur = durationRef.current;

      if (d.kind === "ruler") {
        if (!scrollEl.current) return;
        const rect = scrollEl.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left + scrollEl.current.scrollLeft;
        onSeekRef.current?.(clamp(rawX / px, 0, dur));
        return;
      }

      const dms = (e.clientX - d.startClientX) / px;
      setCues((prev) => resolveAfterDrag(prev.map((c) => {
        if (c.id !== d.cueId) return c;
        const cDur = d.origEnd - d.origStart;
        if (d.kind === "move") {
          const s = clamp(d.origStart + dms, 0, dur - cDur);
          return { ...c, start: Math.round(s), end: Math.round(s + cDur) };
        }
        if (d.kind === "left") {
          const s = clamp(d.origStart + dms, 0, d.origEnd - MIN_DUR);
          return { ...c, start: Math.round(s) };
        }
        if (d.kind === "right") {
          const e2 = clamp(d.origEnd + dms, d.origStart + MIN_DUR, dur);
          return { ...c, end: Math.round(e2) };
        }
        return c;
      })));
    };

    const onUp = () => {
      if (!dragRef.current) return;
      dragRef.current       = null;
      isDraggingRef.current = false;
      onDirectionsRef.current?.(cuesRef.current.map(internalToDir));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  // ── Ctrl+scroll zoom ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollEl.current;
    if (!el) return;
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect     = el.getBoundingClientRect();
      const cursorX  = e.clientX - rect.left + el.scrollLeft;
      const cursorMs = cursorX / pxPerMsRef.current;
      setZoom((z) => {
        const nz = clamp(z * (e.deltaY < 0 ? 1.15 : 0.87), 0.2, 20);
        requestAnimationFrame(() => {
          if (el) el.scrollLeft = cursorMs * BASE_PX_MS * nz - (e.clientX - rect.left);
        });
        return nz;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── Auto-scroll to keep playhead visible (only during playback, not cue drag) ─
  useEffect(() => {
    if (!scrollEl.current) return;
    if (isDraggingRef.current && dragRef.current?.kind !== "ruler") return; // don't fight cue drags
    const x = currentTime * pxPerMsRef.current;
    const { scrollLeft, clientWidth } = scrollEl.current;
    if (x < scrollLeft + 60 || x > scrollLeft + clientWidth - 60) {
      scrollEl.current.scrollLeft = Math.max(0, x - clientWidth / 3);
    }
  }, [currentTime]);

  // ── Track click → place cue without pushing neighbours ─────────────────────
  const handleTrackClick = useCallback((e) => {
    if (hasMovedRef.current) { hasMovedRef.current = false; return; }
    if (!scrollEl.current) return;
    const rect  = scrollEl.current.getBoundingClientRect();
    const rawX  = e.clientX - rect.left + scrollEl.current.scrollLeft;
    const start = clamp(Math.round(rawX / pxPerMsRef.current), 0, durationRef.current - MIN_DUR);
    const candidate = {
      id: uid(), start,
      end: Math.min(start + 5000, durationRef.current),
      flood: { pct: 70, color: "#f97316" },
      over:  { pct: 60 },
      notes: "", overNotes: "",
    };
    setCues((prev) => {
      const placed = placeNewCue(prev, candidate, durationRef.current);
      if (!placed) return prev; // no room — do nothing
      const next = [...prev, placed].sort((a, b) => a.start - b.start);
      onDirectionsRef.current?.(next.map(internalToDir));
      return next;
    });
    setSelected(candidate.id);
  }, []);

  // ── Start drag ──────────────────────────────────────────────────────────────
  const startDrag = (e, cue, kind) => {
    e.stopPropagation();
    hasMovedRef.current   = false;
    isDraggingRef.current = true;
    setSelected(cue.id);
    dragRef.current = { kind, cueId: cue.id, startClientX: e.clientX, origStart: cue.start, origEnd: cue.end };
  };

  // ── Inspector update ────────────────────────────────────────────────────────
  const updateCue = useCallback((id, patch) => {
    setCues(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...patch } : c);
      onDirectionsRef.current?.(next.map(internalToDir));
      return next;
    });
  }, []);

  // ── Ruler marks ─────────────────────────────────────────────────────────────
  const rulerMarks = useMemo(() => {
    const pxPerSec = pxPerMs * 1000;
    const intervals = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60, 120];
    const secInt = intervals.find(i => i * pxPerSec >= 55) ?? 120;
    const msInt  = secInt * 1000;
    const marks = [], subs = [];
    for (let t = 0; t <= duration; t += msInt)     marks.push(t);
    for (let t = 0; t <= duration; t += msInt / 5) { if (t % msInt !== 0) subs.push(t); }
    return { marks, subs };
  }, [pxPerMs, duration]);

  const activeCue   = useMemo(() => {
    const active = cues.filter(c => currentTime >= c.start && currentTime < c.end);
    return active.length ? active[active.length - 1] : null;
  }, [cues, currentTime]);

  const selectedCue = useMemo(() => cues.find(c => c.id === selected) ?? null, [cues, selected]);

  // Preview colours — use rgba() not hex-alpha for broad browser support
  const floodRgb   = activeCue ? hexToRgb(activeCue.flood.color) : { r: 26, g: 26, b: 46 };
  const floodAlpha = (activeCue?.flood.pct ?? 0) / 100;
  const overAlpha  = (activeCue?.over.pct  ?? 0) / 100;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0c", color: "#e2e8f0", fontFamily: "'DM Mono','Fira Mono','Courier New',monospace", userSelect: "none", borderRadius: 10, overflow: "hidden", border: "1px solid #1e1e2a" }}>

      {/* ── PREVIEW ────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", flexShrink: 0, height: 148, background: "#050507", overflow: "hidden", borderBottom: "1px solid #1e1e2a" }}>
        {/* Overhead ambient — top-down wash */}
        <div style={{ position: "absolute", inset: 0, background: `rgba(148,178,255,${(overAlpha * 0.4).toFixed(2)})`, transition: "background 0.3s" }} />
        {/* Floodlight — single upward cone from bottom centre */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 70% 90% at 50% 110%, rgba(${floodRgb.r},${floodRgb.g},${floodRgb.b},${floodAlpha.toFixed(2)}) 0%, rgba(${floodRgb.r},${floodRgb.g},${floodRgb.b},0) 70%)`,
          transition: "background 0.3s",
        }} />
        {/* Scanlines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 3px)" }} />
        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%)" }} />

        {/* Meters */}
        <div style={{ position: "absolute", top: 14, left: 18, display: "flex", gap: 22 }}>
          <VUMeter label="OVERHEAD"   value={activeCue?.over.pct  ?? 0} color="#93c5fd" />
          <VUMeter label="FLOODLIGHT" value={activeCue?.flood.pct ?? 0} color={activeCue?.flood.color ?? "#f97316"} />
          {activeCue && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>COLOR</span>
              <div style={{ width: 30, height: 22, borderRadius: 3, background: activeCue.flood.color, border: "1px solid rgba(255,255,255,0.15)", boxShadow: `0 0 10px ${activeCue.flood.color}` }} />
            </div>
          )}
        </div>

        {/* Time */}
        <div style={{ position: "absolute", bottom: 12, right: 18, textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em", lineHeight: 1 }}>{fmt(currentTime)}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>/ {fmt(duration)}</div>
        </div>

        {activeCue?.notes && (
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "2px 10px", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            {activeCue.notes}
          </div>
        )}
      </div>

      {/* ── TRANSPORT ──────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "#0f0f14", borderBottom: "1px solid #1e1e2a" }}>
        <button onClick={onPlayPause} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 5, border: "none", cursor: "pointer", background: isPlaying ? "#dc2626" : "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.08em" }}>
          {isPlaying ? "⏸ STOP" : "▶ PLAY"}
        </button>
        <button onClick={() => onSeekRef.current?.(0)} style={ghostBtnStyle}>↩ RTZ</button>
        <div style={{ width: 1, height: 18, background: "#2a2a3a", margin: "0 2px" }} />
        <button onClick={() => {
          const start     = currentTime;
          const candidate = { id: uid(), start, end: Math.min(start + 5000, duration), flood: { pct: 70, color: "#f97316" }, over: { pct: 60 }, notes: "", overNotes: "" };
          setCues(prev => {
            const placed = placeNewCue(prev, candidate, duration);
            if (!placed) return prev;
            const next = [...prev, placed].sort((a, b) => a.start - b.start);
            onDirectionsRef.current?.(next.map(internalToDir));
            return next;
          });
          setSelected(candidate.id);
        }} style={ghostBtnStyle}>+ CUE AT PLAYHEAD</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => {
          const exported = [...cues].sort((a, b) => a.start - b.start).map(internalToDir);
          const blob = new Blob([JSON.stringify(exported, null, 2)], { type: "application/json" });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement("a");
          a.href = url; a.download = "lighting-cues.json";
          a.click(); URL.revokeObjectURL(url);
        }} style={ghostBtnStyle}>↓ EXPORT JSON</button>
        <div style={{ width: 1, height: 18, background: "#2a2a3a", margin: "0 6px" }} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginRight: 2 }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => clamp(z * 0.75, 0.2, 20))} style={zoomBtnStyle}>−</button>
        <input type="range" min={20} max={2000} value={zoom * 100} onChange={e => setZoom(Number(e.target.value) / 100)} style={{ width: 72, accentColor: "#4f46e5", cursor: "pointer" }} />
        <button onClick={() => setZoom(z => clamp(z * 1.33, 0.2, 20))} style={zoomBtnStyle}>+</button>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", marginLeft: 4 }}>CTRL+SCROLL</span>
      </div>

      {/* ── TIMELINE ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}>

        {/* Track labels (fixed left) */}
        <div style={{ flexShrink: 0, width: LABEL_W, display: "flex", flexDirection: "column", background: "#0a0a0c", borderRight: "1px solid #1e1e2a", zIndex: 10 }}>
          <div style={{ height: RULER_H, borderBottom: "1px solid #1e1e2a" }} />
          {TRACKS.map(t => (
            <div key={t.id} style={{ height: TRACK_H, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", borderBottom: "1px solid #1e1e2a" }}>
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)" }}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable area */}
        <div ref={scrollEl} style={{ flex: 1, overflowX: "auto", overflowY: "hidden", position: "relative" }}>
          <div style={{ width: totalW + 120, position: "relative" }}>

            {/* Ruler */}
            <div
              style={{ position: "sticky", top: 0, zIndex: 20, height: RULER_H, background: "#0f0f14", borderBottom: "1px solid #1e1e2a", cursor: "pointer" }}
              onMouseDown={e => {
                isDraggingRef.current = true;
                hasMovedRef.current   = false;
                dragRef.current       = { kind: "ruler" };
                const rect = scrollEl.current.getBoundingClientRect();
                const rawX = e.clientX - rect.left + scrollEl.current.scrollLeft;
                onSeekRef.current?.(clamp(rawX / pxPerMsRef.current, 0, durationRef.current));
              }}
            >
              {rulerMarks.subs.map(t => (
                <div key={t} style={{ position: "absolute", left: toX(t), bottom: 0, width: 1, height: 5, background: "rgba(255,255,255,0.08)" }} />
              ))}
              {rulerMarks.marks.map(t => (
                <div key={t} style={{ position: "absolute", left: toX(t), top: 0 }}>
                  <div style={{ width: 1, height: "100%", background: "rgba(255,255,255,0.15)" }} />
                  <span style={{ position: "absolute", top: 6, left: 3, fontSize: 9, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{fmt(t)}</span>
                </div>
              ))}
              {/* Playhead marker on ruler */}
              <div style={{ position: "absolute", left: toX(currentTime), top: 0, bottom: 0, width: 1, background: "#ef4444", zIndex: 5, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: 0, left: -5, width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "8px solid #ef4444" }} />
              </div>
            </div>

            {/* Tracks */}
            {TRACKS.map((track, ti) => (
              <div
                key={track.id}
                style={{ position: "relative", height: TRACK_H, background: ti % 2 === 0 ? "rgba(255,255,255,0.013)" : "transparent", borderBottom: "1px solid #1e1e2a", cursor: "crosshair" }}
                onClick={handleTrackClick}
              >
                {/* Grid lines */}
                {rulerMarks.marks.map(t => (
                  <div key={t} style={{ position: "absolute", left: toX(t), top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
                ))}

                {/* Cue blocks */}
                {cues.map(cue => {
                  const isSel  = cue.id === selected;
                  const isFlood = track.id === "flood";
                  const color  = isFlood ? cue.flood.color : "#7aa2f7";
                  const pct    = isFlood ? cue.flood.pct   : cue.over.pct;
                  const x      = toX(cue.start);
                  const w      = Math.max(6, toX(cue.end) - toX(cue.start));
                  const { r, g, b } = hexToRgb(color);
                  const bgAlpha = Math.max(0.22, pct / 100 * 0.65);

                  return (
                    <div
                      key={cue.id + track.id}
                      style={{
                        position: "absolute", left: x, top: 6, width: w, height: TRACK_H - 12,
                        background: isSel
                          ? `linear-gradient(135deg, rgba(${r},${g},${b},0.87), rgba(${r},${g},${b},0.6))`
                          : `rgba(${r},${g},${b},${bgAlpha.toFixed(2)})`,
                        border: `1px solid rgba(${r},${g},${b},${isSel ? 1 : 0.45})`,
                        borderRadius: 4, cursor: "grab",
                        boxShadow: isSel ? `0 0 10px rgba(${r},${g},${b},0.35)` : "none",
                        zIndex: isSel ? 8 : 4,
                        overflow: "hidden", display: "flex", alignItems: "center",
                        transition: "box-shadow 0.1s",
                      }}
                      onMouseDown={e => startDrag(e, cue, "move")}
                    >
                      {/* Left handle */}
                      <div
                        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 7, cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
                        onMouseDown={e => startDrag(e, cue, "left")}
                      >
                        <div style={{ width: 2, height: 14, borderRadius: 2, background: "rgba(255,255,255,0.45)" }} />
                      </div>

                      {w > 36 && (
                        <span style={{ position: "absolute", left: 10, right: 10, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", pointerEvents: "none" }}>
                          {pct}%{cue.notes ? ` · ${cue.notes}` : ""}
                        </span>
                      )}

                      {/* Right handle */}
                      <div
                        style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 7, cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
                        onMouseDown={e => startDrag(e, cue, "right")}
                      >
                        <div style={{ width: 2, height: 14, borderRadius: 2, background: "rgba(255,255,255,0.45)" }} />
                      </div>
                    </div>
                  );
                })}

                {/* Playhead line */}
                <div style={{ position: "absolute", left: toX(currentTime), top: 0, bottom: 0, width: 1, background: "#ef4444", boxShadow: "0 0 5px rgba(239,68,68,0.6)", pointerEvents: "none", zIndex: 6 }} />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ── INSPECTOR ──────────────────────────────────────────────────────── */}
      {selectedCue ? (
        <div style={{ flexShrink: 0, background: "#0f0f14", borderTop: "1px solid #1e1e2a", padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>CUE INSPECTOR</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
              {fmt(selectedCue.start)} → {fmt(selectedCue.end)} ({fmt(selectedCue.end - selectedCue.start)})
            </span>
            <div style={{ flex: 1 }} />
            <button title="Duplicate" style={iconBtnStyle} onClick={() => {
              const dur      = selectedCue.end - selectedCue.start;
              const candidate = { ...selectedCue, id: uid(), start: selectedCue.end, end: selectedCue.end + dur };
              setCues(prev => {
                const placed = placeNewCue(prev, candidate, duration);
                if (!placed) return prev;
                const next = [...prev, placed].sort((a, b) => a.start - b.start);
                onDirectionsRef.current?.(next.map(internalToDir));
                return next;
              });
              setSelected(candidate.id);
            }}>⧉</button>
            <button title="Delete" style={{ ...iconBtnStyle, color: "#f87171" }} onClick={() => {
              setCues(prev => {
                const next = prev.filter(c => c.id !== selected);
                onDirectionsRef.current?.(next.map(internalToDir));
                return next;
              });
              setSelected(null);
            }}>🗑</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <InspectorBlock label="⚡ FLOODLIGHT" accent="#fde68a" showColor
              colorVal={selectedCue.flood.color}
              onColorChange={c => updateCue(selected, { flood: { ...selectedCue.flood, color: c } })}
              pct={selectedCue.flood.pct}
              onPctChange={v => updateCue(selected, { flood: { ...selectedCue.flood, pct: v } })} />
            <InspectorBlock label="☀ OVERHEAD" accent="#bfdbfe"
              pct={selectedCue.over.pct}
              onPctChange={v => updateCue(selected, { over: { ...selectedCue.over, pct: v } })} />
          </div>
          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={selectedCue.notes}           onChange={e => updateCue(selected, { notes:     e.target.value })} placeholder="Flood notes…"    style={notesInputStyle} />
            <input value={selectedCue.overNotes ?? ""} onChange={e => updateCue(selected, { overNotes: e.target.value })} placeholder="Overhead notes…" style={notesInputStyle} />
          </div>
        </div>
      ) : (
        <div style={{ flexShrink: 0, background: "#0f0f14", borderTop: "1px solid #1e1e2a", padding: "12px 16px", textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
          CLICK A CUE TO INSPECT · CLICK EMPTY TRACK TO ADD
        </div>
      )}
    </div>
  );
}

// ── VU Meter ──────────────────────────────────────────────────────────────────
function VUMeter({ label, value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const on = value >= ((i + 1) / 12) * 100;
          return <div key={i} style={{ width: 5, height: 4 + i * 2, borderRadius: 1, background: on ? color : "rgba(255,255,255,0.07)", boxShadow: on ? `0 0 4px ${color}` : "none", transition: "background 0.05s" }} />;
        })}
        <span style={{ marginLeft: 5, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>
          {value}<span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>%</span>
        </span>
      </div>
    </div>
  );
}

// ── Inspector block ───────────────────────────────────────────────────────────
function InspectorBlock({ label, accent, showColor, colorVal, onColorChange, pct, onPctChange }) {
  return (
    <div style={{ background: "#0a0a0c", border: "1px solid #1e1e2a", borderRadius: 6, padding: "9px 11px" }}>
      <div style={{ fontSize: 9, letterSpacing: "0.12em", color: accent, marginBottom: 7 }}>{label}</div>
      {showColor && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 30 }}>COLOR</span>
          <input type="color" value={colorVal} onChange={e => onColorChange(e.target.value)}
            style={{ width: 28, height: 20, border: "none", borderRadius: 3, cursor: "pointer", background: "transparent" }} />
          <code style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{colorVal}</code>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", width: 30 }}>LEVEL</span>
        <input type="range" min={0} max={100} value={pct} onChange={e => onPctChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: accent, cursor: "pointer" }} />
        <span style={{ fontSize: 11, fontWeight: 700, width: 32, textAlign: "right", color: accent, fontFamily: "monospace" }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const ghostBtnStyle   = { padding: "4px 10px", borderRadius: 5, border: "1px solid #2a2a3a", background: "transparent", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 11, fontFamily: "inherit" };
const zoomBtnStyle    = { width: 22, height: 22, borderRadius: 4, border: "1px solid #2a2a3a", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, fontFamily: "inherit" };
const iconBtnStyle    = { width: 24, height: 24, borderRadius: 4, border: "1px solid #2a2a3a", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0, fontFamily: "inherit" };
const notesInputStyle = { width: "100%", background: "#0a0a0c", border: "1px solid #2a2a3a", borderRadius: 5, color: "rgba(255,255,255,0.55)", fontSize: 11, padding: "5px 9px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };