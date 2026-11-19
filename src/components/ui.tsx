import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "gold" | "outline" | "ghost" | "navy" | "onDark" | "onDarkGlass";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants: Record<string, string> = {
    primary: "bg-[#0055A5] text-white hover:bg-[#003366] shadow-sm hover:shadow-md",
    navy: "bg-[#003366] text-white hover:bg-[#002244] shadow-sm hover:shadow-md",
    gold: "bg-[#C59B27] text-[#003366] hover:bg-[#b08a22] hover:text-white shadow-sm hover:shadow-md font-bold",
    outline: "border border-[#003366]/25 bg-white text-[#003366] hover:border-[#C59B27] hover:text-[#0055A5]",
    ghost: "text-[#003366] hover:bg-[#003366]/5",
    // Use on navy/photo backgrounds. Declared as complete variants so the base
    // `outline` styles (bg-white) never collide with an override in `className`.
    onDark:
      "border border-white/50 bg-transparent text-white hover:bg-white hover:text-[#003366] hover:border-white",
    onDarkGlass:
      "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-[#003366] hover:border-white",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "uphf-card rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,51,102,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: ReactNode;
  tone?: "navy" | "gold" | "slate" | "green";
  className?: string;
}) {
  const tones: Record<string, string> = {
    navy: "bg-[#003366]/10 text-[#003366] border-[#003366]/20",
    gold: "bg-[#C59B27]/15 text-[#7a5f14] border-[#C59B27]/40",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#003366] leading-tight">{title}</h2>
      {lede ? <p className="mt-4 text-slate-600 leading-relaxed">{lede}</p> : null}
      <div
        className={cn(
          "mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#003366] via-[#0055A5] to-[#C59B27]",
          align === "center" ? "mx-auto" : ""
        )}
      />
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#0F172A]">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 shadow-sm transition focus:border-[#0055A5] focus:outline-none focus:ring-2 focus:ring-[#0055A5]/20";

export const selectCls = inputCls;
