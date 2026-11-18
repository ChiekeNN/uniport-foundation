"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, Building2, FileText, LogOut, Megaphone, RefreshCw, Users,
} from "lucide-react";
import { Button, Card, Field, inputCls, selectCls } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Overview {
  campaigns: number;
  donations: number;
  verifiedGifts: number;
  verifiedTotalNgn: number;
  pendingPledges: number;
  alumniRecords: number;
  openInquiries: number;
  recentDonations: Array<{
    id: string; donorName: string; donorEmail: string; amount: string;
    currency: string; paymentStatus: string; paymentGateway: string;
    gatewayReference: string | null; pledgeReference: string | null;
  }>;
  recentInquiries: Array<{ id: string; fullName: string; email: string; category: string; subject: string | null }>;
}

const TABS = ["Overview", "Campaigns", "Pledges", "Leadership", "Reports"] as const;

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [pledges, setPledges] = useState<Overview["recentDonations"]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, p] = await Promise.all([
        fetch("/api/admin/overview").then((r) => r.json()),
        fetch("/api/admin/verify-pledge").then((r) => r.json()),
      ]);
      if (o.error) throw new Error("unauthorized");
      setData(o);
      setPledges(p.pledges ?? []);
    } catch {
      router.push("/admin/login?next=/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function verify(reference: string, action: "verify" | "fail") {
    setMsg("");
    const res = await fetch("/api/admin/verify-pledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, action }),
    });
    const j = await res.json();
    if (!res.ok) setMsg(j.error ?? "Action failed");
    else setMsg(action === "verify" ? `Verified ${reference}` : `Marked failed: ${reference}`);
    load();
  }

  if (loading)
    return <div className="mx-auto max-w-6xl px-4 py-16 text-slate-500">Loading Advancement CMS…</div>;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#C59B27]">Protected • Advancement CMS</p>
          <h1 className="mt-1 font-serif text-3xl text-[#003366]">Foundation Operations Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          <Button variant="ghost" onClick={logout}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </div>

      {msg ? <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{msg}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("rounded-full px-4 py-2 text-sm font-bold cursor-pointer border transition", tab === t ? "bg-[#003366] text-white border-[#003366]" : "bg-white text-slate-600 border-slate-200 hover:border-[#C59B27]")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Megaphone, l: "Campaigns", v: String(data.campaigns) },
            { icon: BadgeCheck, l: "Verified gifts", v: `${data.verifiedGifts} • ₦${data.verifiedTotalNgn.toLocaleString()}` },
            { icon: Building2, l: "Pending pledges", v: String(data.pendingPledges) },
            { icon: Users, l: "Alumni / Inquiries", v: `${data.alumniRecords} / ${data.openInquiries} open` },
          ].map((s) => (
            <Card key={s.l} className="p-5">
              <s.icon className="h-5 w-5 text-[#C59B27]" />
              <p className="mt-2 font-serif text-xl text-[#003366]">{s.v}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{s.l}</p>
            </Card>
          ))}
          <Card className="p-5 sm:col-span-2">
            <p className="text-sm font-bold text-[#003366]">Recent donations</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-slate-600">
              {data.recentDonations.slice(0, 6).map((d) => (
                <li key={d.id} className="flex justify-between gap-2 border-b border-slate-100 pb-1.5">
                  <span className="truncate">{d.donorName} • {d.amount} {d.currency}</span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold", d.paymentStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{d.paymentStatus}</span>
                </li>
              ))}
              {data.recentDonations.length === 0 ? <li className="text-slate-400">No donations yet.</li> : null}
            </ul>
          </Card>
          <Card className="p-5 sm:col-span-2">
            <p className="text-sm font-bold text-[#003366]">Recent inquiries</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-slate-600">
              {data.recentInquiries.slice(0, 6).map((q) => (
                <li key={q.id} className="border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-[#003366]">{q.fullName}</span> • {q.category} • {q.subject ?? "—"}
                </li>
              ))}
              {data.recentInquiries.length === 0 ? <li className="text-slate-400">No inquiries yet.</li> : null}
            </ul>
          </Card>
        </div>
      )}

      {tab === "Campaigns" && <CampaignEditor onDone={load} />}
      {tab === "Pledges" && (
        <Card className="mt-6 p-5">
          <p className="text-sm font-bold text-[#003366]">Verify manual bank-wire pledges ({pledges.length} pending)</p>
          <p className="mt-1 text-xs text-slate-500">Verification flips PENDING → VERIFIED; the database trigger then posts the gift to campaign totals exactly once.</p>
          <div className="mt-4 space-y-2">
            {pledges.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm">
                <span>
                  <strong className="text-[#003366]">{p.donorName}</strong> • {p.amount} {p.currency} • {p.paymentGateway}
                  <span className="block font-mono text-xs text-slate-500">{p.pledgeReference ?? p.gatewayReference}</span>
                </span>
                <span className="flex gap-2">
                  <Button variant="gold" className="!px-3 !py-1.5 text-xs" onClick={() => verify(p.pledgeReference ?? p.gatewayReference ?? "", "verify")}>Verify</Button>
                  <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => verify(p.pledgeReference ?? p.gatewayReference ?? "", "fail")}>Fail</Button>
                </span>
              </div>
            ))}
            {pledges.length === 0 ? <p className="text-sm text-slate-400">No pending pledges. Wire gifts created via the donate portal appear here.</p> : null}
          </div>
        </Card>
      )}
      {tab === "Leadership" && <LeadershipEditor />}
      {tab === "Reports" && <ReportsEditor />}
    </section>
  );
}

function CampaignEditor({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    slug: "", title: "", category: "ENDOWMENT", shortDescription: "",
    description: "", targetAmountNgn: "500000000", isActive: true, isFeatured: false,
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [k]: v as never });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, targetAmountNgn: Number(form.targetAmountNgn) }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Save failed");
      setMsg(j.updated ? "Campaign updated." : "Campaign created.");
      onDone();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-6 p-6">
      <p className="font-serif text-xl text-[#003366]">Create / edit campaign</p>
      <p className="text-xs text-slate-500">Same slug = update. New slug = create. Progress totals are trigger-managed — never edited here.</p>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Slug (e.g. golden-jubilee-endowment-fund)"><input required className={inputCls} value={form.slug} onChange={set("slug")} /></Field>
        <Field label="Title"><input required className={inputCls} value={form.title} onChange={set("title")} /></Field>
        <Field label="Category">
          <select className={selectCls} value={form.category} onChange={set("category")}>
            {["ENDOWMENT", "SCHOLARSHIP", "INFRASTRUCTURE", "RESEARCH", "ALUMNI_CLASS"].map((c) => (<option key={c}>{c}</option>))}
          </select>
        </Field>
        <Field label="Target (NGN)"><input required inputMode="numeric" className={inputCls} value={form.targetAmountNgn} onChange={set("targetAmountNgn")} /></Field>
        <div className="sm:col-span-2"><Field label="Short description"><input required className={inputCls} value={form.shortDescription} onChange={set("shortDescription")} /></Field></div>
        <div className="sm:col-span-2"><Field label="Full description"><textarea required rows={4} className={inputCls} value={form.description} onChange={set("description")} /></Field></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="h-4 w-4 accent-[#003366]" /> Active</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={set("isFeatured")} className="h-4 w-4 accent-[#C59B27]" /> Featured on home</label>
        {msg ? <p className="sm:col-span-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">{msg}</p> : null}
        <div className="sm:col-span-2"><Button variant="navy" disabled={busy}>{busy ? "Saving…" : "Save campaign"}</Button></div>
      </form>
    </Card>
  );
}

function LeadershipEditor() {
  const [form, setForm] = useState({ fullName: "", role: "", category: "TRUSTEE", bio: "", tenure: "", displayOrder: "0" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/leadership", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, displayOrder: Number(form.displayOrder) }),
    });
    const j = await res.json();
    setMsg(res.ok ? "Profile added." : (j.error ?? "Failed"));
    if (res.ok) setForm({ fullName: "", role: "", category: "TRUSTEE", bio: "", tenure: "", displayOrder: "0" });
  }
  return (
    <Card className="mt-6 p-6">
      <p className="flex items-center gap-2 font-serif text-xl text-[#003366]"><Users className="h-5 w-5 text-[#C59B27]" /> Add leadership profile</p>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input required className={inputCls} value={form.fullName} onChange={set("fullName")} /></Field>
        <Field label="Role"><input required className={inputCls} value={form.role} onChange={set("role")} /></Field>
        <Field label="Category"><select className={selectCls} value={form.category} onChange={set("category")}><option>TRUSTEE</option><option>DIRECTORATE</option></select></Field>
        <Field label="Tenure / order"><input className={inputCls} value={form.tenure} onChange={set("tenure")} placeholder="Trustee" /></Field>
        <div className="sm:col-span-2"><Field label="Bio"><textarea rows={3} className={inputCls} value={form.bio} onChange={set("bio")} /></Field></div>
        {msg ? <p className="sm:col-span-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">{msg}</p> : null}
        <div className="sm:col-span-2"><Button variant="navy">Add profile</Button></div>
      </form>
    </Card>
  );
}

function ReportsEditor() {
  const [form, setForm] = useState({ title: "", fiscalYear: "2024", reportType: "ANNUAL_IMPACT", fileUrl: "/reports/", fileSize: "", summary: "" });
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/admin/reports", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const j = await res.json();
    setMsg(res.ok ? "Report registered." : (j.error ?? "Failed"));
    if (res.ok) setForm({ title: "", fiscalYear: "2024", reportType: "ANNUAL_IMPACT", fileUrl: "/reports/", fileSize: "", summary: "" });
  }
  return (
    <Card className="mt-6 p-6">
      <p className="flex items-center gap-2 font-serif text-xl text-[#003366]"><FileText className="h-5 w-5 text-[#C59B27]" /> Upload stewardship report (PDF record)</p>
      <p className="text-xs text-slate-500">Host the PDF in Supabase Storage or /public/reports, then register its URL, year, and type here.</p>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Title"><input required className={inputCls} value={form.title} onChange={set("title")} placeholder="Annual Impact Report 2025" /></Field></div>
        <Field label="Fiscal year"><input required className={inputCls} value={form.fiscalYear} onChange={set("fiscalYear")} /></Field>
        <Field label="Report type">
          <select className={selectCls} value={form.reportType} onChange={set("reportType")}>
            <option value="ANNUAL_IMPACT">Annual Impact</option>
            <option value="AUDITED_FINANCIAL">Audited Financial</option>
            <option value="QUARTERLY">Quarterly Bulletin</option>
            <option value="ENDOWMENT_STATEMENT">Endowment Statement</option>
          </select>
        </Field>
        <Field label="File URL"><input required className={inputCls} value={form.fileUrl} onChange={set("fileUrl")} /></Field>
        <Field label="File size"><input className={inputCls} value={form.fileSize} onChange={set("fileSize")} placeholder="2.4 MB" /></Field>
        <div className="sm:col-span-2"><Field label="Summary"><textarea rows={2} className={inputCls} value={form.summary} onChange={set("summary")} /></Field></div>
        {msg ? <p className="sm:col-span-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">{msg}</p> : null}
        <div className="sm:col-span-2"><Button variant="navy">Register report</Button></div>
      </form>
    </Card>
  );
}
