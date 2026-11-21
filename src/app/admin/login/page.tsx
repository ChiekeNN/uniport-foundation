"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button, Card, Field, inputCls } from "@/components/ui";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#26206B] text-[#D6A419]"><Lock className="h-6 w-6" /></span>
        <h1 className="mt-4 font-serif text-2xl text-[#26206B]">Advancement CMS</h1>
        <p className="mt-1 text-sm text-slate-600">
          Protected area for UPHF staff. In production this gate is Supabase Auth;
          this deployment also accepts the <code className="rounded bg-slate-100 px-1">ADMIN_PASSWORD</code> gate.
          Default: <code className="rounded bg-slate-100 px-1">uphf-admin-2026</code>
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field label="Admin password">
            <input type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          {error ? <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <Button variant="navy" className="w-full justify-center" disabled={loading}>{loading ? "Verifying…" : "Unlock dashboard"}</Button>
        </form>
      </Card>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
