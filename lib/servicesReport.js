import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// A4 portrait, in PDF points.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_SPACE = 44;

const INK = rgb(0.12, 0.14, 0.2);
const GREY = rgb(0.42, 0.45, 0.5);
const ACCENT = rgb(0.31, 0.27, 0.9);
const TINT = rgb(0.95, 0.95, 0.99);
const RULE = rgb(0.86, 0.87, 0.9);
const WHITE = rgb(1, 1, 1);

// The built-in PDF fonts only cover Western characters, so anything else becomes "?".
function clean(value) {
  return String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\x20-\x7E -ÿ–—‘’“”•…]/g, "?")
    .trim();
}

function wrap(text, font, size, maxWidth) {
  const words = clean(text).split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      // A single very long word (for example a URL) is cut so it never overflows the page.
      let w = word;
      while (font.widthOfTextAtSize(w, size) > maxWidth && w.length > 1) {
        let cut = w.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > maxWidth) cut -= 1;
        lines.push(w.slice(0, cut));
        w = w.slice(cut);
      }
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function formatDateTime(date) {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export async function buildServicesReportPdf(data) {
  const doc = await PDFDocument.create();
  doc.setTitle("Haven House - Services Report");
  doc.setAuthor("Haven House");
  doc.setCreator("Haven House Safe Service Navigation Assistant");

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function newPage() {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  }
  function ensure(height) {
    if (y - height < MARGIN + FOOTER_SPACE) newPage();
  }
  function text(str, x, yy, { font = regular, size = 10, color = INK } = {}) {
    page.drawText(clean(str), { x, y: yy, font, size, color });
  }
  function rightText(str, rightX, yy, opts = {}) {
    const font = opts.font || regular;
    const size = opts.size || 10;
    const w = font.widthOfTextAtSize(clean(str), size);
    text(str, rightX - w, yy, opts);
  }
  function paragraph(str, x, width, { font = regular, size = 10, color = INK, lead = 1.35 } = {}) {
    const lines = wrap(str, font, size, width);
    for (const line of lines) {
      ensure(size * lead);
      text(line, x, y - size, { font, size, color });
      y -= size * lead;
    }
  }
  function rule(yy = y, color = RULE) {
    page.drawLine({ start: { x: MARGIN, y: yy }, end: { x: PAGE_W - MARGIN, y: yy }, thickness: 0.6, color });
  }

  // ---------------------------------------------------------------- title block
  page.drawRectangle({ x: 0, y: PAGE_H - 10, width: PAGE_W, height: 10, color: ACCENT });
  y -= 14;
  text("HAVEN HOUSE", MARGIN, y - 10, { font: bold, size: 10, color: ACCENT });
  y -= 24;
  text("Services Report", MARGIN, y - 22, { font: bold, size: 26 });
  y -= 40;
  const stamp = `Generated ${formatDateTime(data.generatedAt || new Date())}` +
    (data.generatedBy ? ` by ${clean(data.generatedBy)}` : "");
  text(stamp, MARGIN, y - 10, { size: 10, color: GREY });
  y -= 16;
  text("For Haven House staff only. This report lists service information and contains no client data.", MARGIN, y - 10, { font: italic, size: 9, color: GREY });
  y -= 30;

  // ---------------------------------------------------------------- summary cards
  const t = data.totals;
  const cards = [
    { value: t.services, label: "Total services" },
    { value: data.categories.length, label: "Categories" },
    { value: t.categoriesWithServices, label: "Categories with services" },
    { value: t.emptyCategories, label: "Categories with none" },
  ];
  const gap = 10;
  const cardW = (CONTENT_W - gap * (cards.length - 1)) / cards.length;
  const cardH = 62;
  cards.forEach((c, i) => {
    const x = MARGIN + i * (cardW + gap);
    page.drawRectangle({ x, y: y - cardH, width: cardW, height: cardH, color: TINT, borderColor: RULE, borderWidth: 0.6 });
    text(String(c.value), x + 12, y - 36, { font: bold, size: 24, color: ACCENT });
    text(c.label, x + 12, y - 52, { size: 8.5, color: GREY });
  });
  y -= cardH + 28;

  // ---------------------------------------------------------------- services per category
  text("Services per category", MARGIN, y - 13, { font: bold, size: 13 });
  y -= 26;
  const maxCount = Math.max(1, ...data.categories.map((c) => c.count));
  const labelW = 150;
  const barMax = CONTENT_W - labelW - 40;
  for (const c of data.categories) {
    ensure(20);
    text(c.label, MARGIN, y - 11, { size: 10 });
    page.drawRectangle({ x: MARGIN + labelW, y: y - 12, width: barMax, height: 11, color: TINT });
    if (c.count > 0) {
      page.drawRectangle({ x: MARGIN + labelW, y: y - 12, width: Math.max(4, (c.count / maxCount) * barMax), height: 11, color: ACCENT });
    }
    rightText(String(c.count), PAGE_W - MARGIN, y - 11, { font: bold, size: 10 });
    y -= 20;
  }
  y -= 14;

  // ---------------------------------------------------------------- most viewed
  ensure(110);
  text("Most viewed services (top 5)", MARGIN, y - 13, { font: bold, size: 13 });
  y -= 26;
  if (!data.topViewed.length) {
    text("No service page views have been recorded yet.", MARGIN, y - 10, { font: italic, size: 10, color: GREY });
    y -= 20;
  } else {
    data.topViewed.forEach((s, i) => {
      ensure(20);
      text(`${i + 1}.`, MARGIN, y - 11, { font: bold, size: 10, color: ACCENT });
      const name = wrap(s.name, regular, 10, 260)[0] || "";
      text(name, MARGIN + 22, y - 11, { size: 10 });
      text(s.categoryLabel, MARGIN + 300, y - 11, { size: 9.5, color: GREY });
      rightText(`${s.views} view${s.views === 1 ? "" : "s"}`, PAGE_W - MARGIN, y - 11, { font: bold, size: 10 });
      y -= 19;
      rule(y + 4);
    });
  }

  // ---------------------------------------------------------------- services by category (new page)
  newPage();
  text("Services by category", MARGIN, y - 18, { font: bold, size: 18 });
  y -= 36;

  for (const c of data.categories) {
    // Keep the heading with its description and the first service block.
    const first = c.services[0];
    const firstDesc = first && first.description ? wrap(first.description, regular, 9.5, CONTENT_W - 8).length : 0;
    const firstMeta = first ? 1 + (first.phone ? 1 : 0) + (first.email ? 1 : 0) + (first.location ? 1 : 0) + first.details.length : 0;
    ensure(34 + (c.helpsWith ? 18 : 0) + (first ? 18 + firstDesc * 13 + firstMeta * 13 + 14 : 30));
    page.drawRectangle({ x: MARGIN, y: y - 24, width: CONTENT_W, height: 24, color: ACCENT });
    text(c.label, MARGIN + 10, y - 16, { font: bold, size: 11.5, color: WHITE });
    rightText(`${c.count} service${c.count === 1 ? "" : "s"}`, PAGE_W - MARGIN - 10, y - 16, { font: bold, size: 10, color: WHITE });
    y -= 34;
    if (c.helpsWith) {
      paragraph(c.helpsWith, MARGIN, CONTENT_W, { font: italic, size: 9, color: GREY });
      y -= 4;
    }

    if (c.services.length === 0) {
      ensure(24);
      text("No services available at the moment.", MARGIN + 4, y - 11, { size: 10, color: GREY, font: italic });
      y -= 30;
      continue;
    }

    c.services.forEach((s, idx) => {
      // Estimate the block height so a service is not split across pages when it can be avoided.
      const descLines = s.description ? wrap(s.description, regular, 9.5, CONTENT_W - 8).length : 0;
      const metaCount = 1 + (s.phone ? 1 : 0) + (s.email ? 1 : 0) + (s.location ? 1 : 0) + s.details.length;
      ensure(16 + descLines * 13 + metaCount * 13 + 14);

      text(s.name, MARGIN + 4, y - 11, { font: bold, size: 11 });
      y -= 18;
      if (s.description) {
        paragraph(s.description, MARGIN + 4, CONTENT_W - 8, { size: 9.5, color: INK });
        y -= 3;
      }
      const meta = [];
      if (s.phone) meta.push(["Phone", s.phone]);
      if (s.email) meta.push(["Email", s.email]);
      if (s.location) meta.push(["Location", s.location]);
      for (const [k, v] of s.details) meta.push([k, v]);
      meta.push(["Page views", String(s.views)]);
      for (const [k, v] of meta) {
        ensure(13);
        text(`${k}:`, MARGIN + 4, y - 9, { size: 9, color: GREY });
        const lines = wrap(v, regular, 9, CONTENT_W - 138);
        lines.forEach((ln, li) => {
          if (li > 0) ensure(12);
          text(ln, MARGIN + 128, y - 9, { size: 9 });
          if (li < lines.length - 1) y -= 12;
        });
        y -= 13;
      }
      y -= 4;
      if (idx < c.services.length - 1) {
        rule(y);
        y -= 10;
      }
    });
    y -= 16;
  }

  // ---------------------------------------------------------------- footers (page x of n)
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: MARGIN, y: 40 }, end: { x: PAGE_W - MARGIN, y: 40 }, thickness: 0.6, color: RULE });
    p.drawText("Haven House - Services Report (staff use only)", { x: MARGIN, y: 26, font: regular, size: 8, color: GREY });
    const label = `Page ${i + 1} of ${pages.length}`;
    const w = regular.widthOfTextAtSize(label, 8);
    p.drawText(label, { x: PAGE_W - MARGIN - w, y: 26, font: regular, size: 8, color: GREY });
  });

  return doc.save();
}
