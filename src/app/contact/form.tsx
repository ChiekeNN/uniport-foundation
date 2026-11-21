"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button, Card, Field, inputCls, selectCls } from "@/components/ui";

const CATS = [
  { v: "MAJOR_GIFT", l: "Major Gift / Endowment" },
  { v: "CORPORATE_CSR", l: "Corporate CSR / Partnership" },
  { v: "SCHOLARSHIP", l: "Scholarship Sponsorship" },
  { v: "ALUMNI_CHAPTER", l: "Alumni Chapter" },
  { v: "GENERAL", l: "General" },
];

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", organization: "",
    category: "GENERAL", subject: "", message: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Failed to send");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  if (done)
    return (
      <Card className="p-8 text-center border-emerald-200 bg-emerald-50/50">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h3 className="mt-3 font-serif text-2xl text-[#26206B]">Inquiry routed successfully.</h3>
        <p className="mt-2 text-sm text-slate-600">Your message is with the right desk. Expect a response within 2 business days.</p>
        <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>Send another inquiry</Button>
      </Card>
    );

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input required className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Your name" /></Field>
        <Field label="Email"><input required type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@example.com" /></Field>
        <Field label="Phone"><input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+234 …" /></Field>
        <Field label="Organisation"><input className={inputCls} value={form.organization} onChange={set("organization")} placeholder="Company / Chapter" /></Field>
        <Field label="Routing category">
          <select className={selectCls} value={form.category} onChange={set("category")}>
            {CATS.map((c) => (<option key={c.v} value={c.v}>{c.l}</option>))}
          </select>
        </Field>
        <Field label="Subject"><input className={inputCls} value={form.subject} onChange={set("subject")} placeholder="Brief subject" /></Field>
        <div className="sm:col-span-2">
          <Field label="Message">
            <textarea required rows={5} className={inputCls} value={form.message} onChange={set("message")} placeholder="How can the Advancement Centre help? (min. 10 characters)" />
          </Field>
        </div>
        {error ? <p className="sm:col-span-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <div className="sm:col-span-2">
          <Button variant="navy" className="w-full justify-center" disabled={loading}>
            <Send className="h-4 w-4" /> {loading ? "Routing…" : "Send inquiry"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
