"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Card, Field, inputCls, selectCls } from "@/components/ui";

const CHAPTERS = ["Nigeria — Lagos", "Nigeria — Abuja/FCT", "Nigeria — Port Harcourt (Home)", "UK — London", "UK — Manchester", "North America — Houston", "North America — New York", "North America — DMV", "Europe / Schengen", "Middle East", "Asia–Pacific", "Not sure yet"];

export function AlumniForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", graduationYear: "", department: "", faculty: "",
    city: "", country: "", industry: "", chapterInterest: CHAPTERS[0], phone: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, graduationYear: Number(form.graduationYear) }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Submission failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  if (done)
    return (
      <Card className="p-8 text-center border-emerald-200 bg-emerald-50/50">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-3 font-serif text-2xl text-[#26206B]">Record received. Welcome home, Unique.</h3>
        <p className="mt-2 text-sm text-slate-600">Your chapter lead and the Advancement Centre will be in touch. Watch your inbox for reunion calendars.</p>
        <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>Update another record</Button>
      </Card>
    );

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input required className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Tamunoemi Horsfall" /></Field>
        <Field label="Email"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@example.com" /></Field>
        <Field label="Graduation year"><input required inputMode="numeric" className={inputCls} value={form.graduationYear} onChange={set("graduationYear")} placeholder="1998" /></Field>
        <Field label="Department"><input required className={inputCls} value={form.department} onChange={set("department")} placeholder="Petroleum Engineering" /></Field>
        <Field label="Faculty"><input className={inputCls} value={form.faculty} onChange={set("faculty")} placeholder="Engineering" /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+234 …" /></Field>
        <Field label="Current city"><input className={inputCls} value={form.city} onChange={set("city")} placeholder="Port Harcourt" /></Field>
        <Field label="Current country"><input className={inputCls} value={form.country} onChange={set("country")} placeholder="Nigeria" /></Field>
        <Field label="Industry"><input className={inputCls} value={form.industry} onChange={set("industry")} placeholder="Energy" /></Field>
        <Field label="Chapter interest">
          <select className={selectCls} value={form.chapterInterest} onChange={set("chapterInterest")}>
            {CHAPTERS.map((c) => (<option key={c}>{c}</option>))}
          </select>
        </Field>
        {error ? <p className="sm:col-span-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button variant="navy" className="w-full justify-center" disabled={loading}>{loading ? "Saving…" : "Update my alumni record"}</Button>
        </div>
      </form>
    </Card>
  );
}
