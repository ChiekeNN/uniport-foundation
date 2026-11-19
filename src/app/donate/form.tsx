"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Landmark, CreditCard, Globe2, BadgeCheck } from "lucide-react";
import type { CampaignDTO, Currency } from "@/types/database";
import { PRESETS, formatMoney, toNgn } from "@/lib/currency";
import { Button, Card, Field, inputCls, selectCls } from "@/components/ui";
import { cn } from "@/lib/utils";

const CURRENCIES: Currency[] = ["NGN", "USD", "GBP", "EUR"];

export function DonateForm({ campaigns }: { campaigns: CampaignDTO[] }) {
  const params = useSearchParams();
  const [currency, setCurrency] = useState<Currency>(
    ((params.get("currency") ?? "NGN").toUpperCase() as Currency) || "NGN"
  );
  const [campaignSlug, setCampaignSlug] = useState(params.get("campaign") ?? "");
  const [amount, setAmount] = useState(params.get("amount") ?? "100000");
  const [customMode, setCustomMode] = useState(false);
  const [donorName, setDonorName] = useState(params.get("name") ?? "");
  const [donorEmail, setDonorEmail] = useState(params.get("email") ?? "");
  const [organization, setOrganization] = useState("");
  const [isAlumni, setIsAlumni] = useState(false);
  const [graduationYear, setGraduationYear] = useState("");
  const [displayWall, setDisplayWall] = useState(true);
  const [gateway, setGateway] = useState<"AUTO" | "BANK_WIRE">(
    params.get("gateway") === "wire" ? "BANK_WIRE" : "AUTO"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wire, setWire] = useState<{ pledgeReference: string; amountLabel: string } | null>(null);

  const numericAmount = useMemo(() => Number(amount) || 0, [amount]);
  const ngnEquiv = useMemo(() => toNgn(numericAmount, currency), [numericAmount, currency]);
  const campaignTitle = useMemo(() => {
    if (!campaignSlug) return "Untied General Endowment Fund";
    return campaigns.find((c) => c.slug === campaignSlug)?.title ?? "Untied General Endowment Fund";
  }, [campaignSlug, campaigns]);

  const routeLabel = currency === "NGN" ? "Paystack" : "Stripe Checkout";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setWire(null);
    if (!donorName.trim() || !donorEmail.trim()) {
      setError("Please provide your full name and email for receipting.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid gift amount.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/donations/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignSlug: campaignSlug || null,
          amount: numericAmount,
          currency,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          organization: organization.trim(),
          isAlumni,
          graduationYear: graduationYear ? Number(graduationYear) : null,
          displayOnDonorWall: displayWall,
          gateway: gateway === "BANK_WIRE" ? "BANK_WIRE" : currency === "NGN" ? "PAYSTACK" : "STRIPE",
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Could not initialise donation");
      if (j.mode === "wire") {
        setWire({ pledgeReference: j.pledgeReference, amountLabel: j.amountLabel });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (j.checkoutUrl) {
        if (j.mode === "demo") {
          // Simulated gateway: show the donor what is about to happen.
          window.location.href = j.checkoutUrl as string;
          return;
        }
        window.location.href = j.checkoutUrl as string;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {wire ? (
        <Card className="p-8 border-emerald-200 bg-emerald-50/60">
          <p className="flex items-center gap-2 font-serif text-2xl text-[#003366]"><BadgeCheck className="h-6 w-6 text-emerald-600" /> Pledge registered</p>
          <p className="mt-2 text-sm text-slate-700">
            Thank you, <strong>{donorName}</strong>. Your pledge of <strong>{wire.amountLabel}</strong> to the{" "}
            <strong>{campaignTitle}</strong> is reserved under reference:
          </p>
          <p className="mt-4 rounded-xl bg-[#003366] px-5 py-4 text-center font-mono text-xl font-bold tracking-widest text-[#C59B27]">{wire.pledgeReference}</p>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed">
            <p className="font-bold text-[#003366]">Official Foundation Wire Instructions</p>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li><strong>Account Name:</strong> University of Port Harcourt Foundation</li>
              <li><strong>Bank:</strong> [Designated Fiduciary Bank — confirm with Advancement Office]</li>
              <li><strong>Account No (NGN):</strong> 0123456789 • <strong>Sort / Swift:</strong> provided on confirmation</li>
              <li><strong>Domiciliary (USD/GBP/EUR):</strong> details issued per pledge via email</li>
              <li><strong>Narration:</strong> {wire.pledgeReference} — {campaignTitle}</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              After wiring, forward your transfer advice to <a className="font-bold text-[#0055A5]" href="mailto:advancement@uniport.edu.ng">advancement@uniport.edu.ng</a> quoting
              your pledge reference. The Advancement office verifies and posts your gift within 2 business days, then emails your receipt.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setWire(null)}>Make another gift</Button>
            <Button variant="navy" onClick={() => (window.location.href = `/donate/success?gateway=wire&reference=${wire.pledgeReference}`)}>View confirmation</Button>
          </div>
        </Card>
      ) : null}

      <form onSubmit={submit} className="space-y-6">
        {/* Currency */}
        <Card className="p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-[#003366]"><Globe2 className="h-4 w-4 text-[#C59B27]" /> 1 • Choose currency</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {CURRENCIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => { setCurrency(c); setCustomMode(false); setAmount(String(PRESETS[c][2])); }}
                className={cn("rounded-xl border px-3 py-3 text-sm font-bold transition cursor-pointer", currency === c ? "border-[#C59B27] bg-[#C59B27]/15 text-[#003366] shadow" : "border-slate-200 bg-white text-slate-600 hover:border-[#0055A5]")}
              >
                {c}
                <span className="block text-[11px] font-medium text-slate-500">{c === "NGN" ? "Paystack" : "Stripe"}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-bold text-[#003366]">Select amount {customMode ? "(custom)" : ""}</p>
          {!customMode ? (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESETS[currency].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(String(p))}
                  className={cn("rounded-xl border px-2 py-2.5 text-sm font-bold cursor-pointer transition", Number(amount) === p ? "bg-[#003366] text-white border-[#003366]" : "bg-white border-slate-200 text-slate-700 hover:border-[#C59B27]")}
                >
                  {formatMoney(p, currency)}
                </button>
              ))}
            </div>
          ) : null}
          <div className="mt-3 flex gap-2">
            <input
              className={inputCls}
              inputMode="decimal"
              value={amount}
              onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setCustomMode(true); }}
              placeholder="Custom amount"
            />
            {!customMode ? (
              <button type="button" onClick={() => setCustomMode(true)} className="shrink-0 rounded-lg border border-dashed border-slate-300 px-4 text-sm font-semibold text-slate-600 hover:text-[#003366] cursor-pointer">
                Custom
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            ≈ ₦{ngnEquiv.toLocaleString()} • Routes to <strong>{routeLabel}</strong> {gateway === "BANK_WIRE" ? "(overridden: bank wire)" : ""}
          </p>
        </Card>

        {/* Campaign */}
        <Card className="p-6">
          <p className="text-sm font-bold text-[#003366]">2 • Choose designation</p>
          <select className={cn(selectCls, "mt-3")} value={campaignSlug} onChange={(e) => setCampaignSlug(e.target.value)}>
            <option value="">Untied General Endowment Fund (greatest need)</option>
            {campaigns.filter((c) => c.isActive).map((c) => (
              <option key={c.id} value={c.slug}>{c.title}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500">Giving to: <strong className="text-[#003366]">{campaignTitle}</strong></p>
        </Card>

        {/* Donor */}
        <Card className="p-6">
          <p className="text-sm font-bold text-[#003366]">3 • Your details & receipt</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><input required className={inputCls} value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Dr. Adaeze Okonkwo" /></Field>
            <Field label="Email (receipt sent here)"><input required type="email" className={inputCls} value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="you@example.com" /></Field>
            <Field label="Organisation (optional)"><input className={inputCls} value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Company / Class set" /></Field>
            <Field label="Graduation year (if alumni)">
              <input className={inputCls} inputMode="numeric" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value.replace(/[^0-9]/g, ""))} placeholder="1998" />
            </Field>
          </div>
          <div className="mt-4 space-y-2.5 text-sm">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={isAlumni} onChange={(e) => setIsAlumni(e.target.checked)} className="h-4 w-4 accent-[#003366]" />
              I am a UNIPORT alumnus / alumna
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={displayWall} onChange={(e) => setDisplayWall(e.target.checked)} className="h-4 w-4 accent-[#C59B27]" />
              Display my name on the Donor Wall of Honor
            </label>
          </div>
        </Card>

        {/* Gateway */}
        <Card className="p-6">
          <p className="text-sm font-bold text-[#003366]">4 • Payment channel</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setGateway("AUTO")}
              className={cn("flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition", gateway === "AUTO" ? "border-[#003366] bg-[#003366]/5 shadow" : "border-slate-200 hover:border-[#0055A5]")}
            >
              <CreditCard className="h-6 w-6 text-[#0055A5]" />
              <span><span className="block text-sm font-bold text-[#003366]">Card / Transfer via {routeLabel}</span><span className="block text-xs text-slate-500">Instant verification + receipt</span></span>
            </button>
            <button
              type="button"
              onClick={() => setGateway("BANK_WIRE")}
              className={cn("flex items-center gap-3 rounded-xl border p-4 text-left cursor-pointer transition", gateway === "BANK_WIRE" ? "border-[#C59B27] bg-[#C59B27]/10 shadow" : "border-slate-200 hover:border-[#C59B27]")}
            >
              <Landmark className="h-6 w-6 text-[#7a5f14]" />
              <span><span className="block text-sm font-bold text-[#003366]">Direct Bank Wire / Institutional Transfer</span><span className="block text-xs text-slate-500">Pledge reference + manual verification</span></span>
            </button>
          </div>
          {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <Button variant="gold" className="mt-5 w-full justify-center py-4 text-base" disabled={loading}>
            {loading ? "Securing your gift…" : gateway === "BANK_WIRE" ? `Generate pledge for ${formatMoney(numericAmount || 0, currency)}` : `Give ${formatMoney(numericAmount || 0, currency)} securely`}
          </Button>
          <p className="mt-2 text-center text-[11px] text-slate-500">RC 61670 • Ring-fenced fiduciary accounts • Instant email receipt • Opt-in public recognition only</p>
        </Card>
      </form>
    </section>
  );
}
