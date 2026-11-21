"use client";

import { useState } from "react";
import { CalendarClock, X, CheckCircle2 } from "lucide-react";
import { Button, Field, inputCls, selectCls } from "@/components/ui";

export function PartnershipDrawer() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          organization: form.organization,
          phone: form.phone,
          category: "CORPORATE_CSR",
          subject: "Corporate Partnership Briefing Request",
          message: form.message || `Briefing request from ${form.organization}`,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      alert("Could not submit. Please email advancement@uniport.edu.ng");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <Button variant="gold" className="mt-4 w-full justify-center" onClick={() => { setOpen(true); setSent(false); }}>
        <CalendarClock className="h-4 w-4" /> Schedule a Corporate Partnership Briefing
      </Button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-[#26206B]/60 backdrop-blur-sm p-0 sm:p-6" onClick={() => setOpen(false)}>
          <div
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto text-[#0F172A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl text-[#26206B]">Corporate Partnership Briefing</h3>
                <p className="mt-1 text-sm text-slate-600">We respond within 2 business days with calendar options.</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg border p-1.5 text-slate-500 hover:text-[#26206B]" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sent ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="mt-3 font-bold text-emerald-800">Briefing request received</p>
                <p className="mt-1 text-sm text-emerald-700">The Advancement Centre will contact you shortly. Reference your organisation name in all correspondence.</p>
                <Button variant="primary" className="mt-4" onClick={() => setOpen(false)}>Done</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Full name"><input required className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Engr. …" /></Field>
                  <Field label="Work email"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@company.com" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Organisation"><input required className={inputCls} value={form.organization} onChange={set("organization")} placeholder="Company Ltd" /></Field>
                  <Field label="Phone"><input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+234 …" /></Field>
                </div>
                <Field label="Partnership interest">
                  <select className={selectCls} defaultValue="CSR / Sponsored Lab">
                    <option>CSR / Sponsored Lab</option>
                    <option>Research Chair</option>
                    <option>Scholarship Cohort</option>
                    <option>Talent Pipeline</option>
                  </select>
                </Field>
                <Field label="Notes for the directorate">
                  <textarea className={inputCls} rows={3} value={form.message} onChange={set("message")} placeholder="Budget range, timeline, focus area…" />
                </Field>
                <Button variant="navy" className="w-full justify-center" disabled={loading}>
                  {loading ? "Sending…" : "Request briefing"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
