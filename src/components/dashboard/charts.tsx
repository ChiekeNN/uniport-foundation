"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────── helpers ─────────────────────────── */

export function useCountUp(target: number, duration = 1100): number {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(origin + (target - origin) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/** Fires `true` one frame after mount so CSS transitions can run. */
function useMounted(delay = 60): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

const ngnCompact = new Intl.NumberFormat("en-NG", {
  notation: "compact",
  maximumFractionDigits: 1,
  style: "currency",
  currency: "NGN",
});

export function shortNgn(value: number): string {
  return ngnCompact.format(value).replace("NGN", "₦").replace(/\s/g, "");
}

/* ─────────────────────────── sparkline ─────────────────────────── */

export function Sparkline({
  values,
  className,
  stroke = "#D6A419",
  height = 34,
}: {
  values: number[];
  className?: string;
  stroke?: string;
  height?: number;
}) {
  const on = useMounted();
  const w = 120;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * w;
    const y = height - 4 - ((v - min) / span) * (height - 8);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  const rawId = useId();
  const id = `spark${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={cn("h-8 w-full", className)} role="img" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} opacity={on ? 1 : 0} className="transition-opacity duration-700" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={on ? 0 : 1}
        style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(.22,1,.36,1)" }}
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill={stroke} />
    </svg>
  );
}

/* ─────────────────────────── area trend ─────────────────────────── */

export function AreaTrend({
  data,
  format = shortNgn,
  height = 260,
  target,
  targetLabel,
}: {
  data: Array<{ label: string; value: number }>;
  format?: (v: number) => string;
  height?: number;
  target?: number;
  targetLabel?: string;
}) {
  const on = useMounted();
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement | null>(null);

  const W = 760;
  const H = height;
  const padX = 8;
  const padTop = 18;
  const padBottom = 30;
  const max = Math.max(...data.map((d) => d.value), target ?? 0, 1);
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const pts = data.map((d, i) => {
    const x = padX + (i / Math.max(1, data.length - 1)) * innerW;
    const y = padTop + innerH - (d.value / max) * innerH;
    return { x, y, ...d };
  });

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${padTop + innerH} L${padX},${padTop + innerH} Z`;
  const targetY = target ? padTop + innerH - (target / max) * innerH : null;
  const marker = hover != null ? pts[hover] : null;

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
          setHover(Math.round(ratio * (data.length - 1)));
        }}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C76B4" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0C76B4" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#26206B" />
            <stop offset="60%" stopColor="#0C76B4" />
            <stop offset="100%" stopColor="#D6A419" />
          </linearGradient>
        </defs>

        {/* horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={W - padX}
            y1={padTop + innerH * t}
            y2={padTop + innerH * t}
            stroke="#e2e8f0"
            strokeDasharray="3 5"
          />
        ))}

        {targetY ? (
          <>
            <line x1={padX} x2={W - padX} y1={targetY} y2={targetY} stroke="#D6A419" strokeDasharray="6 4" strokeWidth="1.2" />
            <text x={W - padX} y={targetY - 6} textAnchor="end" className="fill-[#96700F] text-[11px] font-semibold">
              {targetLabel ?? "Board target pace"}
            </text>
          </>
        ) : null}

        <path d={area} fill="url(#areaFill)" opacity={on ? 1 : 0} className="transition-opacity duration-1000" />
        <path
          d={line}
          fill="none"
          stroke="url(#areaStroke)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={on ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)" }}
        />

        {pts.map((p, i) => (
          <g key={p.label}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hover === i ? 5 : 3}
              fill="#fff"
              stroke={hover === i ? "#D6A419" : "#0C76B4"}
              strokeWidth={hover === i ? 3 : 2}
              className="transition-all duration-150"
            />
            <text x={p.x} y={H - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">
              {p.label}
            </text>
          </g>
        ))}

        {marker ? (
          <line x1={marker.x} x2={marker.x} y1={padTop} y2={padTop + innerH} stroke="#26206B" strokeOpacity="0.18" strokeDasharray="3 3" />
        ) : null}
      </svg>

      {marker ? (
        <div
          className="pointer-events-none absolute top-2 z-10 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur"
          style={{
            left: `${(marker.x / W) * 100}%`,
            transform: `translateX(${marker.x / W > 0.75 ? "-105%" : marker.x / W < 0.15 ? "5%" : "-50%"})`,
          }}
        >
          <p className="font-bold text-[#26206B]">{format(marker.value)}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">{marker.label}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── stacked bars ─────────────────────────── */

export function StackedBars({
  data,
  series,
  format = shortNgn,
  height = 220,
}: {
  data: Array<{ label: string; values: number[] }>;
  series: Array<{ name: string; color: string }>;
  format?: (v: number) => string;
  height?: number;
}) {
  const on = useMounted();
  const [hover, setHover] = useState<number | null>(null);
  const totals = data.map((d) => d.values.reduce((s, v) => s + v, 0));
  const max = Math.max(...totals, 1);

  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const total = totals[i];
          const active = hover === i;
          return (
            <div
              key={d.label}
              className="group relative flex h-full flex-1 flex-col justify-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {active ? (
                <div className="pointer-events-none absolute -top-1 left-1/2 z-10 w-max -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 text-[11px] shadow-lg">
                  <p className="font-bold text-[#26206B]">{format(total)}</p>
                  {series.map((s, si) => (
                    <p key={s.name} className="flex items-center gap-1 text-slate-600">
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                      {s.name}: {format(d.values[si])}
                    </p>
                  ))}
                </div>
              ) : null}
              <div className={cn("flex w-full flex-col overflow-hidden rounded-t-md transition-all", active ? "brightness-110" : "")}>
                {d.values.map((v, si) => (
                  <div
                    key={series[si].name}
                    style={{
                      background: series[si].color,
                      height: on ? `${(v / max) * (height - 26)}px` : 0,
                      transition: `height 900ms cubic-bezier(.22,1,.36,1) ${i * 45 + si * 60}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="h-6 pt-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {d.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── donut ─────────────────────────── */

export function Donut({
  segments,
  size = 208,
  centerLabel,
  centerValue,
  format = shortNgn,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  format?: (v: number) => string;
}) {
  const on = useMounted();
  const [active, setActive] = useState<number | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 46;
  const c = 2 * Math.PI * r;
  const arcs = useMemo(() => {
    const dashes = segments.map((s) => (s.value / total) * c);
    return segments.map((s, i) => ({
      ...s,
      dash: dashes[i],
      offset: dashes.slice(0, i).reduce((sum, d) => sum + d, 0),
    }));
  }, [segments, total, c]);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Ring — centred, with the total sitting inside the hole */}
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#eef2f7" strokeWidth="13" />
          {arcs.map((s, i) => (
            <circle
              key={s.label}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={active === i ? 16 : 13}
              strokeLinecap="round"
              strokeDasharray={`${on ? s.dash : 0} ${c}`}
              strokeDashoffset={-s.offset}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer transition-all duration-700"
              style={{ transitionDelay: `${i * 120}ms` }}
            />
          ))}
        </svg>
        {centerValue ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {centerLabel}
            </span>
            <span className="mt-0.5 font-serif text-xl font-bold leading-none text-[#26206B]">
              {centerValue}
            </span>
          </div>
        ) : null}
      </div>

      {/* Legend — fixed columns so percentages and amounts line up */}
      <ul className="w-full">
        {segments.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition",
                active === i ? "bg-slate-50" : "hover:bg-slate-50/70"
              )}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                style={{ background: s.color }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-slate-600">
                {s.label}
              </span>
              <span className="w-8 shrink-0 text-right text-[11.5px] font-bold tabular-nums text-[#26206B]">
                {Math.round((s.value / total) * 100)}%
              </span>
              <span className="w-[62px] shrink-0 text-right text-[11px] font-medium tabular-nums text-slate-400">
                {format(s.value)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────── funnel ─────────────────────────── */

export function Funnel({ steps }: { steps: Array<{ stage: string; count: number; note: string }> }) {
  const on = useMounted();
  const top = steps[0]?.count || 1;
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const pct = Math.max(6, (s.count / top) * 100);
        return (
          <li key={s.stage}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#26206B]">{s.stage}</p>
              <p className="text-sm font-bold tabular-nums text-[#26206B]">
                {s.count}
                <span className="ml-1 text-[10px] font-semibold text-slate-400">{((s.count / top) * 100).toFixed(0)}%</span>
              </p>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#26206B] via-[#0C76B4] to-[#D6A419]"
                style={{
                  width: on ? `${pct}%` : 0,
                  transition: `width 1000ms cubic-bezier(.22,1,.36,1) ${i * 110}ms`,
                }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500">{s.note}</p>
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────── progress ─────────────────────────── */

export function ProgressBar({
  value,
  delay = 0,
  tone = "navy",
}: {
  value: number;
  delay?: number;
  tone?: "navy" | "gold" | "emerald";
}) {
  const on = useMounted();
  const tones = {
    navy: "bg-gradient-to-r from-[#26206B] to-[#0C76B4]",
    gold: "bg-gradient-to-r from-[#D6A419] to-[#e0bb56]",
    emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400",
  } as const;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn("h-full rounded-full", tones[tone])}
        style={{
          width: on ? `${Math.min(100, Math.max(0, value))}%` : 0,
          transition: `width 1100ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────── delta chip ─────────────────────────── */

export function Delta({ value, suffix = "vs prior period" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
        up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
      <span className="font-medium text-slate-400">{suffix}</span>
    </span>
  );
}
