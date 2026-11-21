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
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A419] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants: Record<string, string> = {
    primary: "bg-[#0C76B4] text-white hover:bg-[#173377] shadow-sm hover:shadow-md",
    navy: "bg-[#173377] text-white hover:bg-[#10275C] shadow-sm hover:shadow-md",
    gold: "bg-[#D6A419] text-[#173377] hover:bg-[#B9860F] hover:text-white shadow-sm hover:shadow-md font-bold",
    outline: "border border-[#173377]/25 bg-white text-[#173377] hover:border-[#D6A419] hover:text-[#0C76B4]",
    ghost: "text-[#173377] hover:bg-[#173377]/5",
    // Use on navy/photo backgrounds. Declared as complete variants so the base
    // `outline` styles (bg-white) never collide with an override in `className`.
    onDark:
      "border border-white/50 bg-transparent text-white hover:bg-white hover:text-[#173377] hover:border-white",
    onDarkGlass:
      "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-[#173377] hover:border-white",
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
        "uphf-card rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(23,51,119,0.08)]",
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
    navy: "bg-[#173377]/10 text-[#173377] border-[#173377]/20",
    gold: "bg-[#D6A419]/15 text-[#7a5f14] border-[#D6A419]/40",
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
      <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#D6A419]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl text-[#173377] leading-tight">{title}</h2>
      {lede ? <p className="mt-4 text-slate-600 leading-relaxed">{lede}</p> : null}
      <div
        className={cn(
          "mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#173377] via-[#0C76B4] to-[#D6A419]",
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
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 shadow-sm transition focus:border-[#0C76B4] focus:outline-none focus:ring-2 focus:ring-[#0C76B4]/20";

export const selectCls = inputCls;
