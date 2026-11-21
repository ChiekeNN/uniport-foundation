"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Card, Button, Field, inputCls } from "@/components/ui";

export function QuickPledge({
  campaignSlug,
  campaignTitle,
}: {
  campaignSlug: string;
  campaignTitle: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("100000");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <Card className="p-6 border-t-4 !border-t-[#D6A419]">
      <p className="flex items-center gap-2 font-serif text-xl text-[#173377]">
        <Heart className="h-5 w-5 text-[#D6A419]" /> Quick pledge
      </p>
      <p className="mt-1 text-xs text-slate-500">You’re giving to: <strong className="text-[#173377]">{campaignTitle}</strong></p>
      <div className="mt-4 space-y-3">
        <Field label="Amount (NGN)">
          <input
            className={inputCls}
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="100000"
          />
        </Field>
        <Field label="Full name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Adaeze Okonkwo" />
        </Field>
        <Field label="Email">
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Button
          variant="gold"
          className="w-full"
          onClick={() => {
            const q = new URLSearchParams({
              campaign: campaignSlug,
              amount: amount || "100000",
              currency: "NGN",
              name,
              email,
            });
            router.push(`/donate?${q.toString()}`);
          }}
        >
          Continue to secure checkout
        </Button>
        <p className="text-center text-[11px] text-slate-500">Paystack • Stripe • Bank wire • Instant receipt</p>
      </div>
    </Card>
  );
}
