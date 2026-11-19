"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Lock } from "lucide-react";
import { Button, Field, inputCls } from "@/components/ui";

export function DemoCheckoutForm({ reference }: { reference: string }) {
  const router = useRouter();
  const [card, setCard] = useState("4084 0840 8408 4081");
  const [expiry, setExpiry] = useState("12 / 29");
  const [cvv, setCvv] = useState("123");
  const [name, setName] = useState("Demo Donor");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/donations/demo-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Could not confirm the payment");
      router.push(`/donate/success?gateway=demo&reference=${encodeURIComponent(reference)}&confirmed=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={pay} className="mt-5 space-y-3">
      <Field label="Card number">
        <input className={inputCls} value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry">
          <input className={inputCls} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </Field>
        <Field label="CVV">
          <input className={inputCls} value={cvv} onChange={(e) => setCvv(e.target.value)} inputMode="numeric" maxLength={4} />
        </Field>
      </div>
      <Field label="Name on card">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>
      ) : null}

      <Button variant="gold" className="w-full justify-center py-3 text-base" disabled={busy || !reference}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Pay and mark as verified
          </>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-400">
        <BadgeCheck className="h-3.5 w-3.5" /> Demo gateway · no card details are stored or charged
      </p>
    </form>
  );
}
