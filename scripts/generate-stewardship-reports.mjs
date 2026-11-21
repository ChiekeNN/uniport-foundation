/**
 * Generates the six downloadable documents listed in the /stewardship repository.
 *
 *   node scripts/generate-stewardship-reports.mjs
 *
 * They are purpose-built for the public demo: every figure is drawn from the
 * site's own seed data, so a tester who downloads a report sees the same numbers
 * that the dashboard and the campaign pages show. Each one is marked
 * "Preview edition" — they are illustrative, not the executed audit documents.
 *
 * Output: public/reports/*.pdf
 *
 * Requires pdfkit, which is intentionally not a project dependency:
 *
 *   npm i --no-save pdfkit && node scripts/generate-stewardship-reports.mjs
 *
 * The naira sign is set in DejaVu Sans, because the base-14 Helvetica face has
 * no ₦ glyph. Without that font installed the script falls back to Helvetica and
 * the sign renders as a box — install fonts-dejavu before regenerating.
 */
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

const NAVY = "#26206B";
const ROYAL = "#0C76B4";
const GOLD = "#D6A419";
const INK = "#0F172A";
const SLATE = "#475569";
const MUTED = "#94A3B8";
const LINE = "#E2E8F0";
const WASH = "#F8FAFC";

const PAGE = { width: 595.28, height: 841.89 };
const M = 56; // page margin
const CONTENT_W = PAGE.width - M * 2;
const CREST = path.join(process.cwd(), "public", "brand", "uniport-logo.png");
// The base-14 Helvetica face has no naira sign; DejaVu covers it. Only strings
// that contain "₦" are set in DejaVu, so the rest of the typography stays Helvetica.
const FONT_NUM = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_NUM_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
const hasNaira = (v) => typeof v === "string" && v.includes("₦");
const OUT = path.join(process.cwd(), "public", "reports");

const ngn = (n) =>
  "₦" + Math.round(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });

/* ────────────────────────────── primitives ────────────────────────────── */

function cover(doc, meta) {
  // Navy field
  doc.rect(0, 0, PAGE.width, 470).fill(NAVY);
  // Gold rule under the crest block
  doc.rect(0, 470, PAGE.width, 6).fill(GOLD);

  if (fs.existsSync(CREST)) {
    doc.save();
    doc.roundedRect(M, 58, 74, 74, 12).fill("#FFFFFF");
    doc.image(CREST, M + 8, 66, { width: 58, height: 58 });
    doc.restore();
  }

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("UNIVERSITY OF PORT HARCOURT FOUNDATION", M + 90, 66, { width: CONTENT_W - 90 });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#9DB6CE")
    .text("Advancement • Endowment • Alumni   ·   RC 61670", M + 90, 82);
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(GOLD)
    .text("PREVIEW EDITION", M + 90, 112, { characterSpacing: 1.6 });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#C9D8E6")
    .text(meta.kicker.toUpperCase(), M, 214, { characterSpacing: 2, width: CONTENT_W });

  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(31)
    .text(meta.title, M, 238, { width: CONTENT_W - 40, lineGap: 2 });

  if (meta.subtitle) {
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#D3E0EC")
      .text(meta.subtitle, M, doc.y + 12, { width: CONTENT_W - 70, lineGap: 3 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(GOLD)
    .text(meta.period.toUpperCase(), M, 424, { characterSpacing: 1.4 });

  // Cover stats
  let y = 512;
  doc.fillColor(MUTED).font("Helvetica-Bold").fontSize(8);
  doc.text("AT A GLANCE", M, y - 26, { characterSpacing: 2 });
  const colW = CONTENT_W / meta.stats.length;
  meta.stats.forEach((s, i) => {
    const x = M + colW * i;
    doc
      .fillColor(NAVY)
      .font(hasNaira(s.value) ? "NumBold" : "Helvetica-Bold")
      .fontSize(s.value.length > 8 ? 16 : 19)
      .text(s.value, x, y, { width: colW - 10, lineBreak: false });
    doc.fillColor(SLATE).font("Helvetica").fontSize(8.5).text(s.label, x, y + 26, {
      width: colW - 12,
      lineGap: 1,
    });
  });

  doc
    .fillColor(SLATE)
    .font("Helvetica")
    .fontSize(9)
    .text(meta.blurb, M, y + 76, { width: CONTENT_W - 60, lineGap: 3 });

  doc
    .fillColor(MUTED)
    .fontSize(8)
    .text(
      "This preview edition is issued for website demonstration. Figures are illustrative and drawn from the Foundation's published campaign data; the executed, externally audited documents are issued separately.",
      M,
      PAGE.height - 92,
      { width: CONTENT_W, lineGap: 2 }
    );
}

function chrome(doc, meta) {
  doc.rect(0, 0, PAGE.width, 4).fill(NAVY);
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(7.5)
    .text("UNIVERSITY OF PORT HARCOURT FOUNDATION", M, 26, { characterSpacing: 1.2 });
  doc
    .fillColor(NAVY)
    .font("Helvetica-Bold")
    .fontSize(7.5)
    .text(meta.title.toUpperCase(), M, 26, { width: CONTENT_W, align: "right" });
  doc.moveTo(M, 40).lineTo(PAGE.width - M, 40).lineWidth(0.7).strokeColor(LINE).stroke();
  doc.y = 62;
}

function footer(doc, meta, page) {
  const y = PAGE.height - 44;
  doc.moveTo(M, y).lineTo(PAGE.width - M, y).lineWidth(0.7).strokeColor(LINE).stroke();
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(7.5)
    .text(
      "Advancement Centre, Delta Park, Choba, Port Harcourt  ·  RC 61670  ·  Preview edition",
      M,
      y + 8,
      { width: CONTENT_W - 40 }
    );
  doc.text(String(page), PAGE.width - M - 40, y + 8, { width: 40, align: "right" });
}

function h2(doc, text) {
  doc.moveDown(0.4);
  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(text.toUpperCase(), M, doc.y, { width: CONTENT_W, characterSpacing: 1.8 });
  doc.x = M;
  doc.moveDown(0.2);
}

function h3(doc, text) {
  doc.moveDown(0.5);
  doc.fillColor(NAVY).font("Helvetica-Bold").fontSize(12).text(text, M, doc.y, { width: CONTENT_W });
  doc.x = M;
  doc.moveDown(0.3);
}

function para(doc, text, opts = {}) {
  doc
    .fillColor(opts.color ?? SLATE)
    .font(hasNaira(text) ? "Num" : opts.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(opts.size ?? 9.5)
    .text(text, M, doc.y, { width: CONTENT_W, lineGap: 3, align: opts.align ?? "left" });
  doc.x = M;
  doc.moveDown(0.5);
}

function bullets(doc, items) {
  items.forEach((t) => {
    const y = doc.y;
    doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9.5).text("•", M + 2, y, { width: 12 });
    doc
      .fillColor(SLATE)
      .font(hasNaira(t) ? "Num" : "Helvetica")
      .fontSize(9.5)
      .text(t, M + 16, y, { width: CONTENT_W - 16, lineGap: 2.5 });
    doc.moveDown(0.25);
  });
  doc.moveDown(0.4);
}

function table(doc, { columns, rows, align, note }) {
  const widths = columns.map((c) => c.width ?? CONTENT_W / columns.length);
  const pad = 6;
  const rowHeight = (cells, bold) => {
    doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(8.5);
    let max = 0;
    cells.forEach((c, i) => {
      max = Math.max(
        max,
        doc.heightOfString(String(c ?? ""), { width: widths[i] - pad * 2, lineGap: 1.5 })
      );
    });
    return max + pad;
  };

  // header
  let y = doc.y;
  doc.rect(M, y, CONTENT_W, rowHeight(columns.map((c) => c.label), true)).fill(NAVY);
  let x = M;
  columns.forEach((c, i) => {
    doc
      .fillColor("#FFFFFF")
      .font(hasNaira(c.label) ? "NumBold" : "Helvetica-Bold")
      .fontSize(8)
      .text(c.label.toUpperCase(), x + pad, y + pad - 1, {
        width: widths[i] - pad * 2,
        align: align?.[i] ?? "left",
        characterSpacing: 0.6,
      });
    x += widths[i];
  });
  y += rowHeight(columns.map((c) => c.label), true);

  rows.forEach((cells, r) => {
    const h = rowHeight(cells, false);
    if (r % 2 === 1) doc.rect(M, y, CONTENT_W, h).fill(WASH);
    x = M;
    cells.forEach((c, i) => {
      const emphasise = i === 0;
      const val = String(c ?? "");
      doc
        .fillColor(emphasise ? NAVY : SLATE)
        .font(hasNaira(val) ? (emphasise ? "NumBold" : "Num") : emphasise ? "Helvetica-Bold" : "Helvetica")
        .fontSize(8.5)
        .text(val, x + pad, y + pad - 1, {
          width: widths[i] - pad * 2,
          align: align?.[i] ?? "left",
          lineGap: 1.5,
        });
      x += widths[i];
    });
    y += h;
    doc.moveTo(M, y).lineTo(PAGE.width - M, y).lineWidth(0.5).strokeColor(LINE).stroke();
  });

  doc.y = y + 10;
  doc.x = M;
  if (note) {
    doc
      .fillColor(MUTED)
      .font("Helvetica-Oblique")
      .fontSize(7.5)
      .text(note, M, doc.y, { width: CONTENT_W - 120, lineGap: 2 });
    doc.x = M;
    doc.moveDown(0.4);
  }
}

function callout(doc, title, body) {
  const h = 20 + doc.heightOfString(body, { width: CONTENT_W - 44, lineGap: 3 });
  const y = doc.y;
  doc.roundedRect(M, y, CONTENT_W, h + 34, 8).fillAndStroke(WASH, LINE);
  doc.rect(M, y, 4, h + 34).fill(GOLD);
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(8).text(title.toUpperCase(), M + 18, y + 12, {
    characterSpacing: 1.4,
  });
  doc
    .fillColor(SLATE)
    .font(hasNaira(body) ? "Num" : "Helvetica")
    .fontSize(9)
    .text(body, M + 18, y + 26, {
    width: CONTENT_W - 44,
    lineGap: 3,
  });
  doc.y = y + h + 46;
}

function backCover(doc, meta) {
  doc.rect(0, 0, PAGE.width, PAGE.height).fill(NAVY);
  doc.rect(0, 0, 6, PAGE.height).fill(GOLD);

  if (fs.existsSync(CREST)) {
    doc.roundedRect(M, 70, 60, 60, 10).fill("#FFFFFF");
    doc.image(CREST, M + 7, 77, { width: 46, height: 46 });
  }
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("UNIVERSITY OF PORT HARCOURT FOUNDATION", M + 76, 78, { width: CONTENT_W - 76 });
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#9DB6CE")
    .text("Advancement • Endowment • Alumni  ·  RC 61670", M + 76, 93);

  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("THANK YOU", M, 300, { characterSpacing: 2.4 });
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(25)
    .text("Every naira in this report\nhas a name, a fund and a purpose.", M, 322, {
      width: CONTENT_W - 40,
      lineGap: 4,
    });

  doc
    .fillColor("#D3E0EC")
    .font("Helvetica")
    .fontSize(9.5)
    .text(meta.closing, M, 412, { width: CONTENT_W - 90, lineGap: 4 });

  const ways = [
    ["Card & transfer", "Verified online at uniport-foundation.vercel.app/donate"],
    ["Endowment pledge", "Multi-year commitments from ₦1,000,000"],
    ["Corporate partnership", "Milestone-certified project or CSR alignment"],
    ["Legacy & bequest", "Named chairs and endowment windows"],
  ];
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(8).text("WAYS TO GIVE", M, 512, { characterSpacing: 2 });
  let y = 534;
  ways.forEach(([k, v]) => {
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9.5).text(k, M, y, { width: 150 });
    doc
      .fillColor("#C9D8E6")
      .font(hasNaira(v) ? "Num" : "Helvetica")
      .fontSize(9.5)
      .text(v, M + 160, y, { width: CONTENT_W - 160 });
    y += 26;
  });

  doc
    .fillColor("#7E9AB5")
    .font("Helvetica")
    .fontSize(8)
    .text(
      "University Advancement Centre, Delta Park, Choba, Port Harcourt  ·  RC 61670  ·  Preview edition",
      M,
      PAGE.height - 70,
      { width: CONTENT_W }
    );
}

/* ────────────────────────────── document shell ────────────────────────────── */

function build(file, meta, sections) {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: M, bottom: M, left: M, right: M },
    bufferPages: true,
    info: {
      Title: `${meta.title} — ${meta.period}`,
      Author: "University of Port Harcourt Foundation",
      Subject: meta.subtitle || meta.kicker,
      Creator: "UPHF Advancement Centre",
    },
  });

  if (fs.existsSync(FONT_NUM)) {
    doc.registerFont("Num", FONT_NUM);
    doc.registerFont("NumBold", FONT_NUM_BOLD);
  } else {
    doc.registerFont("Num", "Helvetica");
    doc.registerFont("NumBold", "Helvetica-Bold");
  }

  const stream = fs.createWriteStream(path.join(OUT, file));
  doc.pipe(stream);

  cover(doc, meta);

  doc.addPage();
  chrome(doc, meta);

  const needsNewPage = (s) => {
    const remaining = PAGE.height - 80 - doc.y;
    if (s.kind === "table") return remaining < Math.min(s.rows.length * 26 + 70, 320);
    if (s.kind === "callout") return remaining < 150;
    if (s.kind === "h2" || s.kind === "h3") return remaining < 110;
    return remaining < 70;
  };

  sections.forEach((s) => {
    if (needsNewPage(s)) {
      doc.addPage();
      chrome(doc, meta);
    }
    if (s.kind === "h2") h2(doc, s.text);
    else if (s.kind === "h3") h3(doc, s.text);
    else if (s.kind === "p") para(doc, s.text);
    else if (s.kind === "lead") para(doc, s.text, { color: NAVY, size: 10.5 });
    else if (s.kind === "bullets") bullets(doc, s.items);
    else if (s.kind === "table") table(doc, s);
    else if (s.kind === "callout") callout(doc, s.title, s.body);
    else if (s.kind === "rule") {
      doc.moveDown(0.4);
      doc.moveTo(M, doc.y).lineTo(PAGE.width - M, doc.y).lineWidth(0.7).strokeColor(LINE).stroke();
      doc.moveDown(0.8);
    }
  });

  doc.addPage();
  backCover(doc, meta);

  // page furniture — the back cover carries its own layout
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(range.start + i);
    if (i > 0 && i < range.count - 1) footer(doc, meta, i);
  }
  doc.flushPages();
  doc.end();

  return new Promise((resolve) =>
    stream.on("finish", () => {
      const bytes = fs.statSync(path.join(OUT, file)).size;
      console.log(`✓ ${file.padEnd(42)} ${(bytes / 1024).toFixed(0)} KB`);
      resolve();
    })
  );
}

/* ────────────────────────────── content ────────────────────────────── */

const ORG = {
  board: "Senator Mao Arukwe Ohuabunwa",
  boardTitle: "Pro-Chancellor & Chairman, 17th Governing Council",
  patron: "Prof. Chike Princewill Rewhuamwhu Chike",
  patronTitle: "10th Vice-Chancellor & Institutional Patron",
};

const TOTAL_VERIFIED = 2_327_450_000; // sum of the four pillar gift lines
const ENDOWMENT = 1_150_000_000;

const docs = [
  {
    file: "uphf-annual-impact-2024.pdf",
    meta: {
      kicker: "Annual Impact Report",
      title: "Advancing Excellence",
      subtitle:
        "Scholarships disbursed, laboratories commissioned and endowment growth across the 2024 stewardship year.",
      period: "Fiscal Year 2024",
      closing:
        "Your gift is receipted within 48 hours, ring-fenced to the fund you chose, and reported back to you each quarter. That is the whole promise of this Foundation — and it is the reason a report like this can be published at all.",
      blurb:
        "The 2024 stewardship year closed with every naira of verified intake traceable to a named fund, a named beneficiary or a commissioned milestone. This report sets out what the Foundation received, what it released, and what it produced.",
      stats: [
        { value: "₦2.33bn", label: "Verified intake, all funds" },
        { value: "412", label: "Scholars supported" },
        { value: "1,684", label: "Unique donors" },
        { value: "3.9%", label: "Admin & fundraising, of income" },
      ],
    },
    sections: [
      { kind: "h2", text: "Letter from the Director" },
      {
        kind: "lead",
        text: "In 2024 the Foundation moved from proving the Advancement model to institutionalising it.",
      },
      {
        kind: "p",
        text: "When the year opened, the question before this office was no longer whether alumni, industry and friends of the University would give — the record of the previous two decades had settled that — but whether the Foundation could receive, invest and account for those gifts at the standard a fiduciary trust owes its beneficiaries. The answer, at the close of the year, is a qualified yes.",
      },
      {
        kind: "p",
        text: "Verified intake rose to ₦2.33 billion across the four fundraising pillars. Four hundred and twelve students held a Foundation scholarship through the year, none of whom lost a session to fees. Three teaching and research laboratories were commissioned and handed over to their faculties. The endowment corpus passed ₦1.15 billion, and for the first time the Foundation released programme funding from investment income rather than from fresh donations — the threshold at which an endowment begins to do the work it was created for.",
      },
      {
        kind: "p",
        text: "None of this is the work of one office. The Board of Trustees, under the Pro-Chancellor and led by the Vice-Chancellor as Institutional Patron, held the line on ring-fencing. Class-set reunion committees did the unglamorous work of persuading peers. Corporate partners accepted milestone-certified releases rather than lump-sum transfers. This report is, in the end, a record of their discipline.",
      },
      { kind: "p", text: "Prof. Uzoma D. Chima", bold: true },
      { kind: "p", text: "Director, University of Port Harcourt Foundation (2024–2025)", size: 8.5 },

      { kind: "rule" },
      { kind: "h2", text: "The year at a glance" },
      {
        kind: "table",
        columns: [
          { label: "Indicator", width: 260 },
          { label: "FY 2023", width: 110, align: "right" },
          { label: "FY 2024", width: 110, align: "right" },
        ],
        rows: [
          ["Verified intake", ngn(1_420_000_000), ngn(TOTAL_VERIFIED)],
          ["Unique donors", "1,190", "1,684"],
          ["Scholars supported", "268", "412"],
          ["Endowment corpus", ngn(1_002_000_000), ngn(ENDOWMENT)],
          ["Projects commissioned", "5", "9"],
          ["Donor-wall honorees", "288", "342"],
        ],
        note: "Intake is recognised when a gift is verified by the payment gateway or bank confirmation, not when pledged.",
      },

      { kind: "h2", text: "Fund performance by pillar" },
      {
        kind: "table",
        columns: [
          { label: "Fund", width: 200 },
          { label: "Target", width: 110, align: "right" },
          { label: "Raised", width: 110, align: "right" },
          { label: "Progress", width: 62, align: "right" },
        ],
        rows: [
          ["Golden Jubilee Endowment Fund", ngn(5_000_000_000), ngn(1_287_500_000), "25.8%"],
          ["Unique UNIPORT Indigent Scholars Fund", ngn(750_000_000), ngn(214_600_000), "28.6%"],
          ["STEM & Digital Innovation Labs", ngn(1_800_000_000), ngn(642_300_000), "35.7%"],
          ["Alumni Class Legacy — Research Chairs", ngn(900_000_000), ngn(187_450_000), "20.8%"],
        ],
        note: "Funds are ring-fenced: a shortfall in one pillar is never met from another pillar's balance.",
      },

      { kind: "h2", text: "Scholarship & access" },
      {
        kind: "p",
        text: "The Unique UNIPORT Indigent Scholars Fund released ₦214.6 million in 2024 across 412 awards: 214 full scholarships covering tuition, accommodation and a monthly upkeep stipend, and 198 partial awards covering tuition alone. Awards are need-tested against the University's financial-aid instrument and reviewed each session by the Scholarships Committee.",
      },
      {
        kind: "bullets",
        items: [
          "100% of full-scholarship holders progressed to the next class; 6 graduated with First Class honours.",
          "Average award value: ₦520,900 per scholar per session.",
          "Zero qualified applicants were turned away for lack of funds in the second semester.",
        ],
      },
      { kind: "callout", title: "Did you know", body: "A full scholarship — tuition, accommodation and upkeep — costs ₦520,900 a session. Ninety-six of the 412 awards in 2024 were funded entirely by alumni class-set giving." },

      { kind: "h2", text: "Infrastructure & research" },
      {
        kind: "p",
        text: "The STEM & Digital Innovation Labs pillar released ₦618.4 million against milestone certification. Three facilities were commissioned during the year: the Advanced Materials Laboratory, the Applied Data Science Teaching Suite, and the Renewable Energy Testbed. Each release followed inspection and sign-off by the Foundation's Projects Committee, with photographic evidence and faculty acceptance notes held in the project file.",
      },
      {
        kind: "table",
        columns: [
          { label: "Project", width: 230 },
          { label: "Released", width: 100, align: "right" },
          { label: "Status", width: 152 },
        ],
        rows: [
          ["Advanced Materials Laboratory", ngn(268_000_000), "Commissioned — March 2024"],
          ["Applied Data Science Teaching Suite", ngn(214_400_000), "Commissioned — July 2024"],
          ["Renewable Energy Testbed", ngn(136_000_000), "Commissioned — November 2024"],
        ],
      },

      { kind: "h2", text: "Endowment & investment" },
      {
        kind: "p",
        text: "Endowment principal closed the year at ₦1.15 billion against a ₦5 billion target under the Golden Jubilee Endowment Fund. The portfolio returned 11.4% gross for the year, against a 12-month Treasury benchmark of 18.5% — a deliberate trade: the investment policy caps below-investment-grade exposure at zero and holds a 6% liquidity buffer, which cost yield in a high-rate year but protected principal in a volatile one.",
      },
      {
        kind: "bullets",
        items: [
          "Only audited investment income is released; principal is untouched by policy.",
          "₦98.2 million of programmatic funding was released from income in 2024.",
          "Custody, valuation and audit are performed by independent third parties.",
        ],
      },

      { kind: "h2", text: "Stewardship, assurance and governance" },
      {
        kind: "p",
        text: `The Foundation is governed by a Board of Trustees chaired by the Pro-Chancellor, ${ORG.board} (${ORG.boardTitle}), with the Vice-Chancellor, ${ORG.patron} (${ORG.patronTitle}), as Institutional Patron. The Directorate operates from the University Advancement Centre at Delta Park, and reports to the Board quarterly.`,
      },
      {
        kind: "bullets",
        items: [
          "Receipts issued within 48 hours of a verified gift; digital receipts carry a pledge reference.",
          "Quarterly milestone evidence is required before the next tranche of any project release.",
          "External annual audit; audited statements published in this repository.",
          "Donor Wall listings are opt-in only and can be withdrawn at any time by the donor.",
        ],
      },

      { kind: "h2", text: "Thank you" },
      {
        kind: "p",
        text: "Every name on the Donor Wall is a decision that the University's next fifty years are worth funding now. If this report has been useful to you, the most helpful next step is a recurring gift — it is what allows the Foundation to commit to multi-year scholarship cohorts rather than one-off awards.",
      },
    ],
  },

  {
    file: "uphf-audited-financials-2024.pdf",
    meta: {
      kicker: "Audited Financial Statements",
      title: "Financial Statements",
      subtitle: "Independent external audit opinion, statement of financial position and fund-by-fund accounting.",
      period: "For the year ended 31 December 2024",
      closing:
        "These statements are published so that any donor, trustee or regulator can follow a naira from the moment it is given to the moment it is spent. Questions may be put to the Directorate at any time.",
      blurb:
        "Prepared in accordance with the reporting framework adopted at incorporation, and presented fund by fund so that no donor's gift is commingled with another's purpose.",
      stats: [
        { value: "₦2.54bn", label: "Total assets" },
        { value: "₦2.43bn", label: "Total income for the year" },
        { value: "₦1.15bn", label: "Endowment principal" },
        { value: "11.4%", label: "Gross portfolio return" },
      ],
    },
    sections: [
      { kind: "h2", text: "Independent auditor's report" },
      {
        kind: "p",
        text: "We have audited the accompanying financial statements of the University of Port Harcourt Foundation (RC 61670), which comprise the statement of financial position as at 31 December 2024, the statement of activities, the statement of cash flows for the year then ended, and the notes to the financial statements, including a summary of significant accounting policies.",
      },
      { kind: "p", text: "Opinion", bold: true },
      {
        kind: "p",
        text: "In our opinion, the financial statements give a true and fair view of the financial position of the Foundation as at 31 December 2024, and of its financial performance and cash flows for the year then ended, in accordance with the basis of accounting described in Note 1.",
      },
      { kind: "p", text: "Basis for opinion", bold: true },
      {
        kind: "p",
        text: "We conducted our audit in accordance with International Standards on Auditing. We are independent of the Foundation in accordance with the ethical requirements relevant to our audit, and we have fulfilled our other ethical responsibilities. We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our opinion.",
      },
      {
        kind: "callout",
        title: "Preview edition",
        body: "This is a demonstration copy prepared for the Foundation's website preview. The executed statements, signed auditor's report and management letter are issued separately to the Board of Trustees.",
      },

      { kind: "h2", text: "Statement of financial position" },
      { kind: "p", text: "As at 31 December 2024", size: 8.5 },
      {
        kind: "table",
        columns: [
          { label: "Assets", width: 300 },
          { label: "2024 (₦)", width: 92, align: "right" },
          { label: "2023 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Cash and cash equivalents", "318,400,000", "241,600,000"],
          ["Short-term deposits", "402,100,000", "356,800,000"],
          ["Investments — endowment portfolio", "1,688,900,000", "1,412,300,000"],
          ["Receivables and prepayments", "71,300,000", "48,900,000"],
          ["Property and equipment", "60,300,000", "52,100,000"],
          ["Total assets", "2,541,000,000", "2,111,700,000"],
        ],
      },
      {
        kind: "table",
        columns: [
          { label: "Funds and liabilities", width: 300 },
          { label: "2024 (₦)", width: 92, align: "right" },
          { label: "2023 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Endowment principal (ring-fenced)", "1,150,000,000", "1,002,000,000"],
          ["Restricted programme funds", "612,700,000", "498,300,000"],
          ["Unrestricted operating reserve", "248,900,000", "201,400,000"],
          ["Payables and accruals", "129,400,000", "96,600,000"],
          ["Scholarship commitments not yet disbursed", "400,000,000", "313,400,000"],
          ["Total funds and liabilities", "2,541,000,000", "2,111,700,000"],
        ],
      },

      { kind: "h2", text: "Statement of activities" },
      { kind: "p", text: "For the year ended 31 December 2024", size: 8.5 },
      {
        kind: "table",
        columns: [
          { label: "Income", width: 300 },
          { label: "2024 (₦)", width: 92, align: "right" },
          { label: "2023 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Endowment gifts", "1,283,100,000", "722,000,000"],
          ["Scholarship gifts", "214,600,000", "186,400,000"],
          ["Infrastructure gifts", "642,300,000", "394,900,000"],
          ["Alumni class gifts", "187,450,000", "112,300,000"],
          ["Investment income", "98,200,000", "61,700,000"],
          ["Total income", "2,425,650,000", "1,477,300,000"],
        ],
      },
      {
        kind: "table",
        columns: [
          { label: "Expenditure", width: 300 },
          { label: "2024 (₦)", width: 92, align: "right" },
          { label: "2023 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Scholarships disbursed", "214,600,000", "186,400,000"],
          ["Project releases (milestone-certified)", "618,400,000", "381,200,000"],
          ["Alumni legacy programme", "152,900,000", "98,700,000"],
          ["Administration and fundraising", "96,400,000", "81,300,000"],
          ["Total expenditure", "1,082,300,000", "747,600,000"],
        ],
        note: "Administration and fundraising represent 3.9% of income — within the 12% policy ceiling.",
      },

      { kind: "h2", text: "Statement of cash flows (summary)" },
      {
        kind: "table",
        columns: [
          { label: "Movement", width: 340 },
          { label: "2024 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Net cash from operating activities", "1,184,600,000"],
          ["Net cash used in investing activities", "(1,107,800,000)"],
          ["Net increase in cash and equivalents", "76,800,000"],
          ["Cash and equivalents at 1 January", "241,600,000"],
          ["Cash and equivalents at 31 December", "318,400,000"],
        ],
      },

      { kind: "h2", text: "Notes to the financial statements" },
      { kind: "p", text: "1. Basis of preparation", bold: true },
      {
        kind: "p",
        text: "The financial statements are prepared on the accrual basis under the historical cost convention, modified for the valuation of investments at fair value. They are presented in Nigerian naira, rounded to the nearest thousand unless otherwise stated.",
      },
      { kind: "p", text: "2. Fund accounting", bold: true },
      {
        kind: "p",
        text: "Gifts are recognised against the pillar for which they were solicited. Restricted funds are held in ring-fenced accounts and may not be applied to another pillar's purpose, nor to administration, without the donor's written consent.",
      },
      { kind: "p", text: "3. Endowment principal", bold: true },
      {
        kind: "p",
        text: "Endowment principal is preserved in perpetuity; only audited investment income net of a 2.5% inflation reserve may be released. Cumulative principal at year end: ₦1,150,000,000.",
      },
      { kind: "p", text: "4. Recognition of gifts", bold: true },
      {
        kind: "p",
        text: "A gift is recognised when verified by the payment gateway or by bank confirmation, not when pledged. Pledges are disclosed as commitments and are not included in income.",
      },
      { kind: "p", text: "5. Related-party transactions", bold: true },
      {
        kind: "p",
        text: "Transactions with members of the Board of Trustees and the Directorate are conducted at arm's length and disclosed to the Audit Committee. No trustee received remuneration from the Foundation during the year.",
      },
      { kind: "p", text: "6. Going concern", bold: true },
      {
        kind: "p",
        text: "The trustees have assessed the Foundation's ability to continue as a going concern and are satisfied that it has adequate resources to do so for the foreseeable future.",
      },
    ],
  },

  {
    file: "uphf-q4-2024-bulletin.pdf",
    meta: {
      kicker: "Stewardship Bulletin",
      title: "Q4 2024 Milestones",
      subtitle: "Quarterly tranche releases, scholar progression notes and the commissioning record for the closing quarter.",
      period: "October – December 2024",
      closing:
        "This bulletin is issued every quarter, within six weeks of quarter end, so that progress is read while it is still news rather than reconstructed at year end.",
      blurb:
        "Issued to donors and the Board each quarter so that progress is read while it is still news, not reconstructed at year end.",
      stats: [
        { value: "₦742.9m", label: "Verified in quarter" },
        { value: "3", label: "Tranches released" },
        { value: "1", label: "Facility commissioned" },
        { value: "412", label: "Scholars in good standing" },
      ],
    },
    sections: [
      { kind: "h2", text: "The quarter in brief" },
      {
        kind: "lead",
        text: "The closing quarter of 2024 was a quarter of completions rather than launches — three tranches released, one facility commissioned, and the scholarship cohort carried into the new session without a single arrears case.",
      },
      {
        kind: "p",
        text: "Verified intake for the quarter was ₦742.9 million, the strongest quarter of the year, driven by class-set reunion giving ahead of the Golden Jubilee and two corporate commitments aligned to the STEM labs pillar. The Donor Wall of Honor gained 31 new opt-in honorees.",
      },

      { kind: "h2", text: "Tranche releases" },
      {
        kind: "table",
        columns: [
          { label: "Project", width: 190 },
          { label: "Tranche", width: 62 },
          { label: "Released (₦)", width: 100, align: "right" },
          { label: "Certified", width: 130 },
        ],
        rows: [
          ["Renewable Energy Testbed", "3 of 3", "136,000,000", "Nov 2024"],
          ["Applied Data Science Suite", "2 of 2", "94,400,000", "Oct 2024"],
          ["Indigent Scholars Fund", "Q4 release", "52,300,000", "Dec 2024"],
        ],
        note: "Each release followed inspection, photographic evidence and faculty acceptance sign-off.",
      },

      { kind: "h2", text: "Scholar progression" },
      {
        kind: "bullets",
        items: [
          "412 scholars in good standing at the close of the quarter; 0 arrears cases.",
          "Semester upkeep stipends paid on schedule to all 214 full-scholarship holders.",
          "38 scholars completed their final session — 6 with First Class honours, 11 with Second Class Upper.",
          "12 new awards made from the second-semester pool following need-testing.",
        ],
      },
      { kind: "callout", title: "In their words", body: "“The stipend is the part nobody sees. Fees are paid to the University — the upkeep is what lets me stay in the laboratory instead of looking for paid work at night.” — a 400-level scholar, Class of 2025." },

      { kind: "h2", text: "Milestones commissioned" },
      {
        kind: "p",
        text: "The Renewable Energy Testbed was commissioned on 14 November 2024, closing the third and final tranche of its funding. The testbed supports solar and micro-grid research for the Faculty of Engineering and will host two postgraduate cohorts in the 2025 session.",
      },

      { kind: "h2", text: "Donor wall additions" },
      {
        kind: "table",
        columns: [
          { label: "Giving category", width: 240 },
          { label: "Honorees", width: 90, align: "right" },
          { label: "Value", width: 152, align: "right" },
        ],
        rows: [
          ["Class-set reunion giving", "18", ngn(268_400_000)],
          ["Individual donors", "9", ngn(84_200_000)],
          ["Corporate partners", "3", ngn(310_000_000)],
          ["Anonymous (wall opt-out)", "1", ngn(80_300_000)],
        ],
        note: "Listing on the wall is opt-in. A donor may withdraw consent at any time and the entry is removed within one working day.",
      },

      { kind: "h2", text: "Outlook — Q1 2025" },
      {
        kind: "bullets",
        items: [
          "Release tranche 2 of the Advanced Materials Laboratory refurbishment.",
          "Open the Golden Jubilee alumni chapter challenge across six chapters.",
          "Publish the FY 2024 audited statements in this repository.",
          "Commission an independent review of the endowment investment policy.",
        ],
      },
    ],
  },

  {
    file: "uphf-annual-impact-2023.pdf",
    meta: {
      kicker: "Annual Impact Report",
      title: "The Stewardship Year",
      subtitle: "The year the ring-fenced reporting protocol was established and every naira given a named destination.",
      period: "Fiscal Year 2023",
      closing:
        "The rules adopted in 2023 are the reason the 2024 figures can be published with confidence. Read the two reports together and the trajectory is legible.",
      blurb:
        "2023 was the year the Foundation stopped describing stewardship in prose and started proving it in schedules. This report is the baseline against which later years are measured.",
      stats: [
        { value: "₦1.42bn", label: "Verified intake" },
        { value: "268", label: "Scholars supported" },
        { value: "1,190", label: "Unique donors" },
        { value: "288", label: "Donor-wall honorees" },
      ],
    },
    sections: [
      { kind: "h2", text: "Letter from the Director" },
      {
        kind: "lead",
        text: "We spent 2023 building the plumbing that makes generosity auditable. It is not the part of the work that photographs well, but it is the part that makes the next decade possible.",
      },
      {
        kind: "p",
        text: "Three changes defined the year. First, ring-fencing became structural rather than aspirational: each pillar now holds its own account, and no transfer between funds is possible without a Board resolution. Second, gift recognition moved from pledge to verification, which reduced reported intake in the short term and increased its credibility. Third, quarterly milestone certification became a condition of every project tranche.",
      },
      {
        kind: "p",
        text: "The result is a lower headline number than a pledge-inclusive figure would have shown — ₦1.42 billion in verified intake — and a far stronger foundation for the Golden Jubilee campaign that follows.",
      },
      { kind: "p", text: "Prof. Leo C. Osuji", bold: true },
      { kind: "p", text: "Director, University of Port Harcourt Foundation (2022–2024)", size: 8.5 },

      { kind: "rule" },
      { kind: "h2", text: "Performance by pillar" },
      {
        kind: "table",
        columns: [
          { label: "Fund", width: 210 },
          { label: "Raised (₦)", width: 110, align: "right" },
          { label: "Share of intake", width: 112, align: "right" },
        ],
        rows: [
          ["Golden Jubilee Endowment Fund", "722,000,000", "51.0%"],
          ["STEM & Digital Innovation Labs", "394,900,000", "27.9%"],
          ["Unique UNIPORT Indigent Scholars Fund", "186,400,000", "13.2%"],
          ["Alumni Class Legacy — Research Chairs", "112,300,000", "7.9%"],
        ],
      },

      { kind: "h2", text: "Scholarship & access" },
      {
        kind: "p",
        text: "268 students held a Foundation award in 2023 — 141 full scholarships and 127 partial awards — at an average value of ₦495,600. The Scholars Committee introduced a hardship review that allows a mid-session re-assessment where a household's circumstances change.",
      },

      { kind: "h2", text: "Infrastructure & research" },
      {
        kind: "p",
        text: "Five projects were commissioned during the year, including two teaching laboratory refurbishments and the Faculty of Science instrumentation upgrade. The milestone-certification protocol was introduced mid-year; from July, no tranche was released without inspection evidence on file.",
      },

      { kind: "h2", text: "Endowment & investment" },
      {
        kind: "p",
        text: "Endowment principal closed the year at ₦1.002 billion, crossing the billion-naira mark for the first time. Portfolio return was 9.8% gross against a 12-month Treasury benchmark of 15.2%, reflecting the policy's zero-tolerance for sub-investment-grade exposure and a deliberate liquidity buffer.",
      },

      { kind: "h2", text: "What changed in the rules" },
      {
        kind: "bullets",
        items: [
          "Ring-fenced accounts per pillar, with Board resolution required for any transfer.",
          "Gift recognition at verification, not at pledge.",
          "Quarterly milestone certification before tranche release.",
          "Public donor wall made strictly opt-in, with a one-working-day withdrawal commitment.",
          "Administration and fundraising ceiling set at 12% of income.",
        ],
      },
      {
        kind: "callout",
        title: "Read this against FY 2024",
        body: "The FY 2024 report shows what these rules produced: intake up 64%, scholars up 54%, and the first programme funding released from endowment income rather than fresh gifts.",
      },
    ],
  },

  {
    file: "uphf-audited-financials-2023.pdf",
    meta: {
      kicker: "Audited Financial Statements",
      title: "Financial Statements",
      subtitle: "Prior-year audited statements presented as comparatives to the FY 2024 accounts.",
      period: "For the year ended 31 December 2023",
      closing:
        "Comparatives are presented unchanged from the prior year. Any reclassification is disclosed in the notes, never quietly absorbed into a total.",
      blurb:
        "Presented in the same format as the current year, so that movement between years can be read line by line rather than inferred.",
      stats: [
        { value: "₦2.11bn", label: "Total assets" },
        { value: "₦1.48bn", label: "Income for the year" },
        { value: "₦1.00bn", label: "Endowment principal" },
        { value: "9.8%", label: "Gross portfolio return" },
      ],
    },
    sections: [
      { kind: "h2", text: "Independent auditor's report" },
      {
        kind: "p",
        text: "We have audited the financial statements of the University of Port Harcourt Foundation (RC 61670) for the year ended 31 December 2023. In our opinion the financial statements give a true and fair view of the financial position of the Foundation as at that date and of its financial performance for the year then ended.",
      },
      {
        kind: "callout",
        title: "Preview edition",
        body: "Demonstration copy prepared for the website preview. The executed statements and signed auditor's report are issued separately to the Board of Trustees.",
      },

      { kind: "h2", text: "Statement of financial position" },
      {
        kind: "table",
        columns: [
          { label: "Assets", width: 300 },
          { label: "2023 (₦)", width: 92, align: "right" },
          { label: "2022 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Cash and cash equivalents", "241,600,000", "164,300,000"],
          ["Short-term deposits", "356,800,000", "298,100,000"],
          ["Investments — endowment portfolio", "1,412,300,000", "1,186,400,000"],
          ["Receivables and prepayments", "48,900,000", "31,700,000"],
          ["Property and equipment", "52,100,000", "44,800,000"],
          ["Total assets", "2,111,700,000", "1,725,300,000"],
        ],
      },
      {
        kind: "table",
        columns: [
          { label: "Funds and liabilities", width: 300 },
          { label: "2023 (₦)", width: 92, align: "right" },
          { label: "2022 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Endowment principal (ring-fenced)", "1,002,000,000", "861,200,000"],
          ["Restricted programme funds", "498,300,000", "392,600,000"],
          ["Unrestricted operating reserve", "201,400,000", "168,900,000"],
          ["Payables and accruals", "96,600,000", "71,400,000"],
          ["Scholarship commitments not yet disbursed", "313,400,000", "231,200,000"],
          ["Total funds and liabilities", "2,111,700,000", "1,725,300,000"],
        ],
      },

      { kind: "h2", text: "Statement of activities" },
      {
        kind: "table",
        columns: [
          { label: "Income", width: 300 },
          { label: "2023 (₦)", width: 92, align: "right" },
          { label: "2022 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Endowment gifts", "722,000,000", "561,400,000"],
          ["Scholarship gifts", "186,400,000", "142,800,000"],
          ["Infrastructure gifts", "394,900,000", "318,600,000"],
          ["Alumni class gifts", "112,300,000", "74,900,000"],
          ["Investment income", "61,700,000", "44,200,000"],
          ["Total income", "1,477,300,000", "1,141,900,000"],
        ],
      },
      {
        kind: "table",
        columns: [
          { label: "Expenditure", width: 300 },
          { label: "2023 (₦)", width: 92, align: "right" },
          { label: "2022 (₦)", width: 92, align: "right" },
        ],
        rows: [
          ["Scholarships disbursed", "186,400,000", "142,800,000"],
          ["Project releases (milestone-certified)", "381,200,000", "298,400,000"],
          ["Alumni legacy programme", "98,700,000", "66,100,000"],
          ["Administration and fundraising", "81,300,000", "68,400,000"],
          ["Total expenditure", "747,600,000", "575,700,000"],
        ],
        note: "Administration and fundraising represent 5.5% of income — within the 12% policy ceiling.",
      },

      { kind: "h2", text: "Notes" },
      {
        kind: "p",
        text: "The accounting policies applied are consistent with those set out in the FY 2024 statements. In 2023 the Foundation formalised ring-fenced accounts per pillar; comparatives for 2022 have been reclassified accordingly and do not change previously reported totals.",
      },
    ],
  },

  {
    file: "uphf-endowment-h1-2025.pdf",
    meta: {
      kicker: "Endowment Performance Statement",
      title: "H1 2025 Interim",
      subtitle: "Principal, yield, asset allocation and disbursement schedule for the six months to 30 June 2025.",
      period: "Half year ended 30 June 2025",
      closing:
        "Principal is preserved; income is released; both are reported separately and audited annually. Endowment donors may request a briefing from the Directorate at any time.",
      blurb:
        "An interim statement, unaudited, issued so that endowment donors can see principal preservation and income release separately.",
      stats: [
        { value: "₦1.15bn", label: "Principal at 30 June" },
        { value: "11.4%", label: "Annualised gross yield" },
        { value: "₦98.2m", label: "Income released" },
        { value: "6.0%", label: "Liquidity buffer" },
      ],
    },
    sections: [
      { kind: "h2", text: "Purpose of this statement" },
      {
        kind: "p",
        text: "The Golden Jubilee Endowment Fund is a perpetual fund: the principal is not spent, and only audited investment income is released. This statement reports the two separately, because conflating them is the most common way endowments are quietly consumed.",
      },

      { kind: "h2", text: "Principal and movement" },
      {
        kind: "table",
        columns: [
          { label: "Movement", width: 320 },
          { label: "Amount (₦)", width: 112, align: "right" },
        ],
        rows: [
          ["Principal at 1 January 2025", "1,150,000,000"],
          ["New endowment gifts received", "184,600,000"],
          ["Income capitalised by donor instruction", "31,200,000"],
          ["Income released to programmes", "(98,200,000)"],
          ["Principal at 30 June 2025", "1,267,600,000"],
        ],
        note: "Principal is never applied to administration, fundraising or any pillar other than the endowment.",
      },

      { kind: "h2", text: "Portfolio and allocation" },
      {
        kind: "table",
        columns: [
          { label: "Asset class", width: 220 },
          { label: "Allocation", width: 90, align: "right" },
          { label: "Policy band", width: 122, align: "right" },
        ],
        rows: [
          ["FGN bonds", "42%", "35 – 50%"],
          ["Treasury bills", "18%", "10 – 25%"],
          ["Listed equities", "22%", "15 – 30%"],
          ["Real estate (income-producing)", "12%", "0 – 15%"],
          ["Cash and equivalents", "6%", "5 – 10%"],
        ],
        note: "Zero direct exposure to sub-investment-grade instruments, unlisted private placements or related-party vehicles.",
      },
      {
        kind: "p",
        text: "The portfolio returned 11.4% gross on an annualised basis for the half year, against a 12-month Treasury bill benchmark of 18.2%. The shortfall is the price of a defensive policy in a high-rate environment: duration is short and the equity book is limited to liquid, dividend-paying names.",
      },

      { kind: "h2", text: "Income release schedule" },
      {
        kind: "table",
        columns: [
          { label: "Destination", width: 240 },
          { label: "Released (₦)", width: 100, align: "right" },
          { label: "Basis", width: 142 },
        ],
        rows: [
          ["Scholarship pool top-up", "48,200,000", "Audited income"],
          ["Named chairs support", "28,400,000", "Audited income"],
          ["Library and acquisitions", "14,600,000", "Audited income"],
          ["Inflation reserve (2.5%)", "7,000,000", "Policy retention"],
        ],
        note: "Release is capped at audited income net of the inflation reserve; the cap was not breached in the period.",
      },

      { kind: "h2", text: "Governance of the fund" },
      {
        kind: "bullets",
        items: [
          "Investment policy approved by the Board of Trustees; reviewed annually.",
          "Custody, valuation and performance measurement by independent third parties.",
          "No leverage, no derivatives beyond hedging of currency exposure.",
          "Annual external audit; interim statements unaudited and marked as such.",
          "Any deviation from policy bands requires a documented Board resolution.",
        ],
      },
      {
        kind: "callout",
        title: "Path to the ₦5 billion target",
        body: "At current verified giving, the Golden Jubilee Endowment Fund reaches ₦5 billion in 2031. Class-set reunion giving and multi-year endowment pledges are the two levers that shorten that timeline.",
      },
    ],
  },
];

/* ────────────────────────────── run ────────────────────────────── */

fs.mkdirSync(OUT, { recursive: true });
for (const d of docs) await build(d.file, d.meta, d.sections);
console.log("\nDone — files written to public/reports/");
