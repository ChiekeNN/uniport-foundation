import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LeadershipDTO } from "@/types/database";
import { Card, SectionHeading } from "@/components/ui";
import {
  INCORPORATION,
  LEADERSHIP_GROUPS,
  directorsSuccession,
  isFoundingTrustee,
  leadershipByGroup,
} from "@/lib/constants/leadership";

const GROUP_ANCHORS = {
  BOARD_OF_TRUSTEES: "governance-trustees",
  DIRECTORATE: "governance-directorate",
  PAST_DIRECTORS: "governance-heritage",
} as const;

function Initials({ name }: { name: string }) {
  const clean = name
    .replace(/^Prof\.\s+/, "")
    .replace(/^Professor\s+/, "")
    .replace(/^Senator\s+/, "")
    .replace(/^Rev\.\s+\(Dr\.\)\s+/, "")
    .replace(/^Mrs\.\s+/, "")
    .replace(/^Dr\.\s+/, "");
  const parts = clean.split(" ").filter(Boolean);
  return <>{(parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "")}</>;
}

function MemberCard({
  member,
  tone,
}: {
  member: LeadershipDTO;
  tone: "trustee" | "directorate" | "heritage";
}) {
  const badge =
    tone === "trustee"
      ? "bg-gradient-to-br from-[#26206B] to-[#0C76B4] text-[#D6A419]"
      : tone === "directorate"
        ? "bg-gradient-to-br from-[#D6A419] to-[#8A6300] text-white"
        : "border border-[#26206B]/20 bg-white text-[#26206B]";
  const roleTone =
    tone === "trustee" ? "text-[#D6A419]" : tone === "directorate" ? "text-[#0C76B4]" : "text-slate-500";
  const size = tone === "heritage" ? "text-base" : "text-lg";

  return (
    <Card
      className={
        tone === "heritage"
          ? "p-6 bg-slate-50 hover:shadow-lg transition"
          : "p-6 hover:shadow-lg transition"
      }
    >
      <span
        className={`flex ${tone === "heritage" ? "h-12 w-12 text-lg" : "h-14 w-14 text-xl"} items-center justify-center rounded-full font-serif font-bold ${badge}`}
      >
        <Initials name={member.fullName} />
      </span>
      <h4 className={`mt-4 font-serif ${size} text-[#26206B]`}>{member.fullName}</h4>
      {member.credentials ? (
        <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-500">{member.credentials}</p>
      ) : null}
      <p
        className={`mt-2 ${tone === "heritage" ? "text-[11px]" : "text-xs"} font-bold uppercase tracking-wider ${roleTone}`}
      >
        {member.role}
      </p>
      {member.tenure ? <p className="mt-1 text-xs text-slate-500 italic">{member.tenure}</p> : null}
      <p
        className={`mt-3 ${tone === "heritage" ? "text-[13px]" : "text-sm"} leading-relaxed text-slate-600`}
      >
        {member.bio}
      </p>
    </Card>
  );
}

/**
 * Governance & Leadership (2026) — shared between the homepage and /about#governance.
 *
 * Renders three stacked, anchor-linked sections:
 *   1. Institutional Patrons & Board of Trustees
 *   2. Executive Directorate (University Advancement Centre)
 *   3. Founding Stewards & Past Directors (2002–Present)
 */
export function GovernanceSection({
  leaders,
  heading = true,
  ctaHref,
  ctaLabel = "Read the full governance profile",
  idPrefix = "",
}: {
  leaders: LeadershipDTO[];
  heading?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  /** Optional prefix so both the homepage and /about can own their own anchors. */
  idPrefix?: string;
}) {
  const anch = (key: keyof typeof GROUP_ANCHORS) => `${idPrefix}${GROUP_ANCHORS[key]}`;
  const trustees = leadershipByGroup(leaders, "BOARD_OF_TRUSTEES");
  const directorate = leadershipByGroup(leaders, "DIRECTORATE");
  const heritage = leadershipByGroup(leaders, "PAST_DIRECTORS");
  const founding = heritage.filter(isFoundingTrustee);
  const succession = directorsSuccession(leaders);

  const tabs = [
    { key: "BOARD_OF_TRUSTEES" as const, label: "Institutional Patrons & Board of Trustees", count: trustees.length },
    { key: "DIRECTORATE" as const, label: "Executive Directorate", count: directorate.length },
    { key: "PAST_DIRECTORS" as const, label: "Founding Trustees & Directors", count: heritage.length },
  ];

  return (
    <div>
      {heading ? (
        <SectionHeading
          eyebrow="Governance & Leadership • 2026"
          title="Institutional Patrons, Executive Directorate & Institutional Heritage"
          lede="Fiduciary leadership drawn from UNIPORT's most distinguished scholars and administrators. Historic officeholders are preserved in the archive so institutional continuity is visible, not erased. Profiles are maintained by the Advancement office and editable via the admin CMS."
        />
      ) : null}

      {/* Quick-jump tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`#${anch(t.key)}`}
            className="rounded-full border border-[#26206B]/20 bg-[#26206B]/5 px-4 py-2 text-xs font-bold tracking-wide text-[#26206B] transition hover:border-[#D6A419] hover:text-[#0C76B4]"
          >
            {t.label} <span className="ml-1 text-[#D6A419]">{t.count}</span>
          </a>
        ))}
      </div>

      {/* 1 — Institutional Patrons & Board of Trustees */}
      {trustees.length ? (
        <div id={anch("BOARD_OF_TRUSTEES")} className="mt-12 scroll-mt-28">
          <h3 className="font-serif text-2xl text-[#26206B]">1. Institutional Patrons & Board of Trustees</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{LEADERSHIP_GROUPS[0].caption}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {trustees.map((m) => (
              <MemberCard key={m.id} member={m} tone="trustee" />
            ))}
          </div>
        </div>
      ) : null}

      {/* 2 — Executive Directorate */}
      {directorate.length ? (
        <div id={anch("DIRECTORATE")} className="mt-14 scroll-mt-28">
          <h3 className="font-serif text-2xl text-[#26206B]">
            2. Executive Directorate (University Advancement Centre)
          </h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{LEADERSHIP_GROUPS[1].caption}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {directorate.map((m) => (
              <MemberCard key={m.id} member={m} tone="directorate" />
            ))}
          </div>
        </div>
      ) : null}

      {/* 3 — Founding Trustees & Directors */}
      {heritage.length ? (
        <div id={anch("PAST_DIRECTORS")} className="mt-14 scroll-mt-28">
          <h3 className="font-serif text-2xl text-[#26206B]">
            3. Founding Trustees &amp; Directors of the Foundation (2013–Present)
          </h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{LEADERSHIP_GROUPS[2].caption}</p>

          {/* 3a — line of succession */}
          <div className="mt-8">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D6A419]">
                Line of succession — directors of UPHF
              </p>
              <p className="text-[11px] text-slate-400">
                Chronological · “c.” marks terms reconstructed from convocation brochures
              </p>
            </div>
            <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {succession.map((m, i) => {
                const sitting = m.group === "DIRECTORATE";
                return (
                  <li key={m.id}>
                    <Card
                      className={`h-full rounded-xl p-5 ${
                        sitting ? "!border-[#D6A419]/60 bg-[#FFFBEB]/40" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D6A419]">
                          {m.tenure?.split(" · ")[0] ?? `Term ${i + 1}`}
                        </p>
                        <span className="text-[10px] font-bold tabular-nums text-slate-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-2 font-serif text-base leading-snug text-[#26206B]">
                        {m.fullName}
                      </p>
                      <p className="mt-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
                        {m.role}
                      </p>
                      <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-600">{m.bio}</p>
                      {sitting ? (
                        <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          In office
                        </span>
                      ) : null}
                    </Card>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 3b — incorporated trustees (RC 61670) */}
          <div className="mt-10">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D6A419]">
                Incorporated Trustees — {INCORPORATION.rcNumber}
              </p>
              <p className="text-[11px] text-slate-400">
                Registered with the {INCORPORATION.body} on {INCORPORATION.date}
              </p>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {founding.map((m) => (
                <MemberCard key={m.id} member={m} tone="heritage" />
              ))}
            </div>
            <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-slate-400">
              {INCORPORATION.note}
            </p>
          </div>
        </div>
      ) : null}

      {ctaHref ? (
        <div className="mt-10 text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0C76B4] hover:text-[#26206B]"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
