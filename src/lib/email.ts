import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

export interface ReceiptParams {
  to: string;
  donorName: string;
  amountLabel: string;
  campaignTitle: string;
  reference: string;
  gateway: string;
}

export async function sendDonorReceipt(params: ReceiptParams): Promise<void> {
  const client = getResend();
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "University of Port Harcourt Foundation <advancement@uniport.edu.ng>";
  const subject = `Thank you — your UPHF gift receipt (${params.reference})`;
  const html = `
    <div style="font-family: Georgia, serif; color:#0F172A; max-width:600px; margin:auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden">
      <div style="background:#173377; color:#fff; padding:28px 32px">
        <p style="margin:0; font-size:12px; letter-spacing:2px; color:#D6A419">UNIVERSITY OF PORT HARCOURT FOUNDATION • RC 61670</p>
        <h1 style="margin:8px 0 0; font-size:26px">Thank you, ${escapeHtml(params.donorName)}.</h1>
      </div>
      <div style="padding:28px 32px; font-family: Inter, Arial, sans-serif; font-size:14px; line-height:1.7">
        <p>Your generosity advances academic excellence at the University of Port Harcourt. This email confirms receipt of your gift:</p>
        <table style="width:100%; border-collapse:collapse; margin:16px 0">
          <tr><td style="padding:8px 0; color:#64748b">Campaign</td><td style="padding:8px 0; font-weight:600">${escapeHtml(params.campaignTitle)}</td></tr>
          <tr><td style="padding:8px 0; color:#64748b">Amount</td><td style="padding:8px 0; font-weight:600">${escapeHtml(params.amountLabel)}</td></tr>
          <tr><td style="padding:8px 0; color:#64748b">Reference</td><td style="padding:8px 0; font-weight:600">${escapeHtml(params.reference)}</td></tr>
          <tr><td style="padding:8px 0; color:#64748b">Channel</td><td style="padding:8px 0;">${escapeHtml(params.gateway)}</td></tr>
        </table>
        <p>All gifts are held in ring-fenced fiduciary accounts and reported quarterly. Your name will appear on the Digital Donor Wall of Honor only if you opted in.</p>
        <p style="margin-top:20px">With gratitude,<br/><strong>University Advancement Centre</strong><br/>Delta Park, UNIPORT • advancement@uniport.edu.ng</p>
      </div>
      <div style="background:#F8FAFC; padding:16px 32px; font-size:12px; color:#64748b; font-family:Inter,Arial">RC No. 61670 • Independently incorporated fiduciary trust • 100% audited donor stewardship</div>
    </div>`;
  if (!client) {
    console.log(`[resend:demo] Receipt to ${params.to}: ${subject}`);
    return;
  }
  try {
    await client.emails.send({ from, to: params.to, subject, html });
  } catch (err) {
    console.error("[resend] send failed", err);
  }
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
